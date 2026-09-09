import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VocabularyService } from './vocabulary.service';
import { SaveWordDto } from './dto/save-word.dto';
import { ReviewWordDto } from './dto/review-word.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Vocabulary & Spaced Repetition')
@ApiBearerAuth()
@Controller('vocabulary')
export class VocabularyController {
  constructor(private vocabularyService: VocabularyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user saved vocabulary words' })
  @ApiResponse({ status: 200, description: 'List of vocabulary words' })
  async getUserVocabulary(@CurrentUser('id') userId: string) {
    return this.vocabularyService.getUserVocabulary(userId);
  }

  @Get('due')
  @ApiOperation({ summary: 'Get vocabulary words due for SM-2 review today' })
  @ApiResponse({ status: 200, description: 'Due cards' })
  async getDueReviews(@CurrentUser('id') userId: string) {
    return this.vocabularyService.getDueReviews(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Save a new vocabulary word to user deck' })
  @ApiResponse({ status: 201, description: 'Word saved' })
  async saveWord(
    @CurrentUser('id') userId: string,
    @Body() dto: SaveWordDto,
  ) {
    return this.vocabularyService.saveWord(userId, dto);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Submit an SM-2 flashcard recall review grade (1=Again, 2=Hard, 3=Good, 4=Easy)' })
  @ApiResponse({ status: 200, description: 'Card updated with new interval' })
  async submitReview(
    @CurrentUser('id') userId: string,
    @Param('id') userVocabId: string,
    @Body() dto: ReviewWordDto,
  ) {
    return this.vocabularyService.submitReview(userId, userVocabId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove word from personal deck' })
  async deleteWord(
    @CurrentUser('id') userId: string,
    @Param('id') userVocabId: string,
  ) {
    return this.vocabularyService.deleteWord(userId, userVocabId);
  }
}

