import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PracticeService } from './practice.service';
import { PresignedAudioUrlDto } from './dto/presigned-url.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Practice & Evaluation')
@ApiBearerAuth()
@Controller('practice')
export class PracticeController {
  constructor(private practiceService: PracticeService) {}

  @Post('pre-signed-url')
  @ApiOperation({ summary: 'Obtain pre-signed upload URL for 16kHz audio' })
  @ApiResponse({ status: 200, description: 'Pre-signed S3 upload URL payload' })
  async getPresignedUrl(
    @CurrentUser('id') userId: string,
    @Body() dto: PresignedAudioUrlDto,
  ) {
    return this.practiceService.createPresignedUrl(userId, dto);
  }

  @Post('attempts')
  @ApiOperation({ summary: 'Submit spoken audio attempt for speech-to-text and diff evaluation' })
  @ApiResponse({ status: 200, description: 'Attempt scoring, word diff matrix, and feedback' })
  async submitAttempt(
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitAttemptDto,
  ) {
    return this.practiceService.submitAttempt(userId, dto);
  }

  @Get('attempts/:id')
  @ApiOperation({ summary: 'Get detailed past attempt results by ID' })
  @ApiResponse({ status: 200, description: 'Attempt record' })
  async getAttempt(
    @CurrentUser('id') userId: string,
    @Param('id') attemptId: string,
  ) {
    return this.practiceService.getAttemptById(userId, attemptId);
  }
}

