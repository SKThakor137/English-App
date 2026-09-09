import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Subscriptions & Quotas')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('quota')
  @ApiOperation({ summary: 'Get current user daily speaking quota balance and tier entitlements' })
  @ApiResponse({ status: 200, description: 'Quota balance and subscription status' })
  async getQuota(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getQuotaBalance(userId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Create checkout session for upgrading to Premium subscription' })
  @ApiResponse({ status: 200, description: 'Checkout redirection URL' })
  async createCheckout(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.createCheckout(userId);
  }
}

