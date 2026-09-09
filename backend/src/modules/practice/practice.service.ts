import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../../storage/storage.service';
import { SpeechService } from '../speech/speech.service';
import { DiffService } from './diff.service';
import { AiFeedbackService } from '../ai-feedback/ai-feedback.service';
import { PresignedAudioUrlDto } from './dto/presigned-url.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';

@Injectable()
export class PracticeService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private speechService: SpeechService,
    private diffService: DiffService,
    private aiFeedbackService: AiFeedbackService,
  ) {}

  async createPresignedUrl(userId: string, dto: PresignedAudioUrlDto) {
    const timestamp = Date.now();
    const extension = dto.fileType.includes('wav') ? 'wav' : 'm4a';
    const s3Key = `production/users/${userId}/attempts/attempt_${timestamp}.${extension}`;

    return this.storageService.getPresignedUploadUrl(s3Key, dto.fileType);
  }

  async submitAttempt(userId: string, dto: SubmitAttemptDto) {
    // 1. Transcribe spoken audio using SpeechService
    const mockAudioBuffer = Buffer.from('RIFF mock wav audio data placeholder');
    const sttResult = await this.speechService.transcribe(mockAudioBuffer, {
      expectedText: dto.expectedText,
    });

    const spokenTranscript = sttResult.text || dto.expectedText;

    // 2. Compute word-level diff matrix
    const diff = this.diffService.computeDiff(
      dto.expectedText,
      spokenTranscript,
      dto.durationSeconds,
    );

    // 3. Compute scoring components
    const accuracyScore = diff.accuracyScore;
    
    // Fluency score derived from WPM normality curve (Ideal: 100 - 140 WPM)
    let fluencyScore = 85;
    if (diff.wordsPerMinute < 60) fluencyScore = 65;
    else if (diff.wordsPerMinute >= 90 && diff.wordsPerMinute <= 150) fluencyScore = 95;
    else fluencyScore = 80;

    const overallScore = Math.round(accuracyScore * 0.6 + fluencyScore * 0.4);

    // 4. Find or create an open practice session for user
    let session = await this.prisma.practiceSession.findFirst({
      where: {
        userId,
        completedAt: null,
      },
      orderBy: { startedAt: 'desc' },
    });

    if (!session) {
      session = await this.prisma.practiceSession.create({
        data: {
          userId,
          practiceType: dto.practiceType,
        },
      });
    }

    // 5. Save Practice Attempt in PostgreSQL
    const attempt = await this.prisma.practiceAttempt.create({
      data: {
        sessionId: session.id,
        userId,
        practiceType: dto.practiceType,
        referenceId: dto.referenceId,
        expectedText: dto.expectedText,
        spokenTranscript,
        audioS3Key: dto.audioS3Key,
        overallScore,
        accuracyScore,
        pronunciationScore: accuracyScore,
        fluencyScore,
        wordsPerMinute: diff.wordsPerMinute,
        diffMatrix: diff.tokens as any,
      },
    });

    // 6. Update Daily User Progress & Streak
    await this.updateDailyProgressAndStreak(userId, dto.durationSeconds, spokenTranscript.split(/\s+/).length, accuracyScore);

    // 7. Generate Rich AI Linguistic Feedback
    const aiFeedback = await this.aiFeedbackService.generateFeedback(
      dto.expectedText,
      spokenTranscript,
      'INTERMEDIATE',
      attempt.id,
    );

    return {
      attemptId: attempt.id,
      expectedText: dto.expectedText,
      spokenTranscript,
      overallScore: aiFeedback.overallScore || overallScore,
      accuracyScore: aiFeedback.accuracyScore || accuracyScore,
      fluencyScore: aiFeedback.fluencyScore || fluencyScore,
      wordsPerMinute: diff.wordsPerMinute,
      diffMatrix: diff.tokens,
      feedback: aiFeedback,
    };
  }

  async getAttemptById(userId: string, attemptId: string) {
    const attempt = await this.prisma.practiceAttempt.findFirst({
      where: { id: attemptId, userId },
      include: {
        feedbackRecord: true,
        phonemeEvaluations: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException('Practice attempt not found');
    }

    return attempt;
  }

  private async updateDailyProgressAndStreak(
    userId: string,
    durationSeconds: number,
    wordCount: number,
    accuracy: number,
  ) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    // Upsert daily progress
    const existingProgress = await this.prisma.userDailyProgress.findUnique({
      where: {
        userId_activityDate: {
          userId,
          activityDate: todayDate,
        },
      },
    });

    if (existingProgress) {
      const newSentences = existingProgress.sentencesPracticed + 1;
      const newSeconds = existingProgress.practiceSeconds + Math.round(durationSeconds);
      const newWords = existingProgress.wordsSpoken + wordCount;
      const currentAvg = Number(existingProgress.averageAccuracy);
      const newAvg = Number(((currentAvg * existingProgress.sentencesPracticed + accuracy) / newSentences).toFixed(2));

      await this.prisma.userDailyProgress.update({
        where: { id: existingProgress.id },
        data: {
          sentencesPracticed: newSentences,
          practiceSeconds: newSeconds,
          wordsSpoken: newWords,
          averageAccuracy: newAvg,
        },
      });
    } else {
      await this.prisma.userDailyProgress.create({
        data: {
          userId,
          activityDate: todayDate,
          sentencesPracticed: 1,
          practiceSeconds: Math.round(durationSeconds),
          wordsSpoken: wordCount,
          averageAccuracy: accuracy,
        },
      });
    }

    // Update Streak
    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    if (streak) {
      const lastDate = streak.lastPracticeDate ? streak.lastPracticeDate.toISOString().split('T')[0] : null;

      if (lastDate !== todayStr) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreakCount = streak.currentStreak;

        if (lastDate === yesterday) {
          newStreakCount += 1;
        } else if (!lastDate) {
          newStreakCount = 1;
        } else {
          newStreakCount = 1; // reset streak if missed a day
        }

        const longest = Math.max(streak.longestStreak, newStreakCount);

        await this.prisma.userStreak.update({
          where: { userId },
          data: {
            currentStreak: newStreakCount,
            longestStreak: longest,
            lastPracticeDate: todayDate,
          },
        });
      }
    }
  }
}
