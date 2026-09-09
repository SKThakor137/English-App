import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        streak: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, refreshTokenHash, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        fullName: dto.fullName || 'Learner',
        currentLevel: dto.currentLevel || 'BEGINNER',
        targetGoal: dto.targetGoal,
        dailyGoalMinutes: dto.dailyGoalMinutes || 15,
        nativeLanguage: dto.nativeLanguage,
        avatarUrl: dto.avatarUrl,
      },
    });

    return profile;
  }

  async completeOnboarding(userId: string, dto: OnboardingDto) {
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        currentLevel: dto.currentLevel,
        targetGoal: dto.targetGoal,
        dailyGoalMinutes: dto.dailyGoalMinutes,
        nativeLanguage: dto.nativeLanguage,
      },
      create: {
        userId,
        fullName: 'Learner',
        currentLevel: dto.currentLevel,
        targetGoal: dto.targetGoal,
        dailyGoalMinutes: dto.dailyGoalMinutes,
        nativeLanguage: dto.nativeLanguage,
      },
    });

    return {
      message: 'Onboarding completed successfully',
      profile,
    };
  }

  async getDashboardSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        streak: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    const todayProgress = await this.prisma.userDailyProgress.findUnique({
      where: {
        userId_activityDate: {
          userId,
          activityDate: todayDate,
        },
      },
    });

    const recentAttempts = await this.prisma.practiceAttempt.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const totalWords = await this.prisma.practiceAttempt.count({
      where: { userId },
    });

    return {
      profile: user.profile,
      streak: user.streak?.currentStreak || 0,
      longestStreak: user.streak?.longestStreak || 0,
      todayMinutes: Math.round((todayProgress?.practiceSeconds || 0) / 60),
      todayTargetMinutes: user.profile?.dailyGoalMinutes || 15,
      todaySentences: todayProgress?.sentencesPracticed || 0,
      averageAccuracy: todayProgress?.averageAccuracy || 0,
      totalAttemptsCount: totalWords,
      recentAttempts,
      planTier: user.subscription?.planTier || user.role,
    };
  }
}

