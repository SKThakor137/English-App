import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getQuotaBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    const quota = await this.prisma.dailyUsageQuota.findUnique({
      where: {
        userId_usageDate: {
          userId,
          usageDate: todayDate,
        },
      },
    });

    const isPremium = user.subscription?.planTier === UserRole.PREMIUM_USER || user.role === UserRole.ADMIN;
    const freeDailyLimit = 20;
    const sentencesUsed = quota?.aiFeedbackRequests || 0;
    const remainingSentences = isPremium ? 9999 : Math.max(0, freeDailyLimit - sentencesUsed);

    return {
      tier: user.subscription?.planTier || UserRole.FREE_USER,
      isPremium,
      dailyQuota: {
        maxSentences: isPremium ? 'UNLIMITED' : freeDailyLimit,
        sentencesUsed,
        remainingSentences,
        resetTimeUtc: '00:00 UTC',
      },
      features: {
        aiConversations: isPremium ? 'UNLIMITED' : '1 per week',
        pdfDocuments: isPremium ? '20 per month' : '1 per month',
        acousticPronunciation: isPremium,
      },
    };
  }

  async createCheckout(userId: string) {
    // Generates checkout redirection URL for Stripe Customer Portal
    return {
      checkoutUrl: 'https://checkout.stripe.com/c/pay/demo_session_english_fluency_premium',
      plan: 'PREMIUM_MONTHLY',
      priceUsd: 12.99,
    };
  }
}

