import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OnboardingDto } from './dto/onboarding.dto';

@ApiTags('Users & Learner Profiles')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile and account details' })
  @ApiResponse({ status: 200, description: 'Current authenticated user profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update learner profile settings' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Submit initial onboarding questionnaire' })
  @ApiResponse({ status: 200, description: 'Onboarding completed' })
  async completeOnboarding(
    @CurrentUser('id') userId: string,
    @Body() dto: OnboardingDto,
  ) {
    return this.usersService.completeOnboarding(userId, dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get learner home dashboard analytics and metrics' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics aggregate' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.usersService.getDashboardSummary(userId);
  }
}

