import { Module } from '@nestjs/common';
import { AiFeedbackService } from './ai-feedback.service';

@Module({
  providers: [AiFeedbackService],
  exports: [AiFeedbackService],
})
export class AiFeedbackModule {}

