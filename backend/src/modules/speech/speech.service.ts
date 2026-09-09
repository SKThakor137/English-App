import { Injectable, Logger } from '@nestjs/common';
import { ISpeechProvider, TranscribeOptions, TranscriptionResult } from './speech.interface';
import { WhisperSpeechProvider } from './providers/whisper.provider';
import { MockSpeechProvider } from './providers/mock.provider';

@Injectable()
export class SpeechService {
  private readonly logger = new Logger(SpeechService.name);
  private providers: Map<string, ISpeechProvider> = new Map();

  constructor(
    private whisperProvider: WhisperSpeechProvider,
    private mockProvider: MockSpeechProvider,
  ) {
    this.providers.set(whisperProvider.name, whisperProvider);
    this.providers.set(mockProvider.name, mockProvider);
  }

  async transcribe(audioBuffer: Buffer, options?: TranscribeOptions): Promise<TranscriptionResult> {
    const selected = (process.env.SPEECH_PROVIDER || 'mock').toLowerCase();
    const provider = this.providers.get(selected) || this.mockProvider;

    try {
      this.logger.log(`Executing STT via provider: ${provider.name}`);
      return await provider.transcribe(audioBuffer, options);
    } catch (err: any) {
      this.logger.warn(`Provider ${provider.name} failed (${err.message}), falling back to mock`);
      return this.mockProvider.transcribe(audioBuffer, options);
    }
  }
}

