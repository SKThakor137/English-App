import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        streak: true,
        dailyProgress: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalSeconds = user.dailyProgress.reduce((sum, d) => sum + d.practiceSeconds, 0);
    const totalWords = user.dailyProgress.reduce((sum, d) => sum + d.wordsSpoken, 0);
    const totalSentences = user.dailyProgress.reduce((sum, d) => sum + d.sentencesPracticed, 0);
    const avgAccuracy = user.dailyProgress.length > 0
      ? Math.round(user.dailyProgress.reduce((sum, d) => sum + Number(d.averageAccuracy), 0) / user.dailyProgress.length)
      : 88;

    return {
      streak: {
        current: user.streak?.currentStreak || 0,
        longest: user.streak?.longestStreak || 0,
        freezeCredits: 1,
      },
      totals: {
        practiceMinutes: Math.round(totalSeconds / 60),
        wordsSpoken: totalWords,
        sentencesPracticed: totalSentences,
        averageAccuracy: avgAccuracy,
      },
      skillRadar: {
        grammar: 86,
        pronunciation: 84,
        fluency: 88,
        vocabulary: 82,
        speed: 85,
      },
    };
  }

  async getWeeklyHistory(userId: string) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const records = await this.prisma.userDailyProgress.findMany({
      where: {
        userId,
        activityDate: { gte: sevenDaysAgo },
      },
      orderBy: { activityDate: 'asc' },
    });

    return records.map((r) => ({
      date: r.activityDate.toISOString().split('T')[0],
      minutes: Math.round(r.practiceSeconds / 60),
      wordsSpoken: r.wordsSpoken,
      sentences: r.sentencesPracticed,
      accuracy: Number(r.averageAccuracy),
    }));
  }

  async getWeaknesses(userId: string) {
    const weaknesses = await this.prisma.userWeakness.findMany({
      where: { userId },
      orderBy: { errorCount: 'desc' },
    });

    if (weaknesses.length === 0) {
      return [
        {
          id: 'w1',
          weaknessType: 'Past Simple Irregular Verbs (e.g. go -> went)',
          frequencyCount: 3,
          recommendedLesson: 'Delivering Agile Standup Updates',
        },
        {
          id: 'w2',
          weaknessType: 'Voiced Dental Fricative /ð/ in "the", "this"',
          frequencyCount: 2,
          recommendedLesson: 'Introducing Yourself & Greetings',
        },
      ];
    }

    return weaknesses;
  }
}

