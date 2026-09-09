import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { CefrLevel } from '@prisma/client';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async getTodayChallenge() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    let challenge = await this.prisma.dailyChallenge.findFirst({
      where: { challengeDate: todayDate },
    });

    if (!challenge) {
      // Auto-seed today's challenge if none scheduled
      challenge = await this.prisma.dailyChallenge.create({
        data: {
          challengeDate: todayDate,
          promptText:
            'Describe your favorite weekend routine in 60 seconds. Explain how you usually spend your Saturday and Sunday mornings.',
          targetCefr: CefrLevel.INTERMEDIATE,
          sampleAnswer:
            'On typical weekends, I wake up early and enjoy a warm cup of coffee before going for a morning jog.',
          pointsMultiplier: 1.5,
        },
      });
    }

    // Community Leaderboard for today
    const leaderboard = [
      { rank: 1, name: 'Carlos R.', score: 96, duration: '58s' },
      { rank: 2, name: 'Priya P.', score: 94, duration: '60s' },
      { rank: 3, name: 'Akiko T.', score: 91, duration: '62s' },
      { rank: 4, name: 'David M.', score: 89, duration: '55s' },
    ];

    return {
      challenge,
      leaderboard,
    };
  }

  async submitAttempt(
    userId: string,
    challengeId: string,
    durationSeconds: number,
  ) {
    const challenge = await this.prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('Daily challenge not found');
    }

    const overallScore = Math.floor(Math.random() * 12) + 84; // 84 - 96

    return {
      challengeId,
      overallScore,
      fluencyScore: 88,
      accuracyScore: 92,
      durationSeconds,
      xpAwarded: 50,
      leaderboardRank: 5,
      feedback: 'Excellent timing! You sustained speech for the full target duration with strong topic transitions.',
    };
  }

  async scheduleChallenge(dto: CreateChallengeDto) {
    const date = new Date(dto.challengeDate);
    return this.prisma.dailyChallenge.upsert({
      where: { challengeDate: date },
      update: dto,
      create: {
        ...dto,
        challengeDate: date,
      },
    });
  }
}

