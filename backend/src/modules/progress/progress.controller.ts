import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Progress & Analytics')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get overall progress summary, CEFR radar scores, and streaks' })
  @ApiResponse({ status: 200, description: 'Progress summary' })
  async getSummary(@CurrentUser('id') userId: string) {
    return this.progressService.getSummary(userId);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get 7-day historical speaking time and accuracy breakdown' })
  @ApiResponse({ status: 200, description: 'Weekly activity records' })
  async getWeeklyHistory(@CurrentUser('id') userId: string) {
    return this.progressService.getWeeklyHistory(userId);
  }

  @Get('weaknesses')
  @ApiOperation({ summary: 'Get detected recurring grammatical and pronunciation weaknesses' })
  @ApiResponse({ status: 200, description: 'Weakness list with recommendations' })
  async getWeaknesses(@CurrentUser('id') userId: string) {
    return this.progressService.getWeaknesses(userId);
  }
}

