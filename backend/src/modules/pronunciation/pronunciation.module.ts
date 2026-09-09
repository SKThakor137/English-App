import { Module } from '@nestjs/common';
import { PronunciationService } from './pronunciation.service';
import { AzurePronunciationProvider } from './providers/azure-pronunciation.provider';
import { MockPronunciationProvider } from './providers/mock-pronunciation.provider';

@Module({
  providers: [
    PronunciationService,
    AzurePronunciationProvider,
    MockPronunciationProvider,
  ],
  exports: [PronunciationService],
})
export class PronunciationModule {}

