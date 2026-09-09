import { Module } from '@nestjs/common';
import { SpeechService } from './speech.service';
import { WhisperSpeechProvider } from './providers/whisper.provider';
import { MockSpeechProvider } from './providers/mock.provider';

@Module({
  providers: [SpeechService, WhisperSpeechProvider, MockSpeechProvider],
  exports: [SpeechService],
})
export class SpeechModule {}

