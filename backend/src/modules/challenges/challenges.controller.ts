import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Daily Challenges')
@ApiBearerAuth()
@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get today active speaking challenge prompt and leaderboard' })
  @ApiResponse({ status: 200, description: 'Today challenge' })
  async getTodayChallenge() {
    return this.challengesService.getTodayChallenge();
  }

  @Post(':id/attempt')
  @ApiOperation({ summary: 'Submit attempt for daily speaking challenge' })
  @ApiResponse({ status: 200, description: 'Challenge result and leaderboard rank' })
  async submitAttempt(
    @CurrentUser('id') userId: string,
    @Param('id') challengeId: string,
    @Body('durationSeconds') durationSeconds: number,
  ) {
    return this.challengesService.submitAttempt(userId, challengeId, durationSeconds || 60);
  }

  @Post('admin/schedule')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Schedule a daily speaking challenge (Admin only)' })
  async scheduleChallenge(@Body() dto: CreateChallengeDto) {
    return this.challengesService.scheduleChallenge(dto);
  }
}

