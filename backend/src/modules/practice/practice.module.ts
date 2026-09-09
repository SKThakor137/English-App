import { Module } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { DiffService } from './diff.service';
import { SpeechModule } from '../speech/speech.module';
import { AiFeedbackModule } from '../ai-feedback/ai-feedback.module';

@Module({
  imports: [SpeechModule, AiFeedbackModule],
  controllers: [PracticeController],
  providers: [PracticeService, DiffService],
  exports: [PracticeService, DiffService],
})
export class PracticeModule {}
