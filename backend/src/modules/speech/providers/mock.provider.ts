import { Injectable, Logger } from '@nestjs/common';
import { ISpeechProvider, TranscribeOptions, TranscriptionResult } from '../speech.interface';

@Injectable()
export class MockSpeechProvider implements ISpeechProvider {
  readonly name = 'mock';
  private readonly logger = new Logger(MockSpeechProvider.name);

  async transcribe(audioBuffer: Buffer, options?: TranscribeOptions): Promise<TranscriptionResult> {
    this.logger.log(`Mock transcribing audio buffer (${audioBuffer.length} bytes)`);

    // Use expectedText if provided in options, or a default phrase
    const text = options?.expectedText || 'I usually go for a walk in the evening because it helps me relax.';
    const rawWords = text.split(/\s+/);
    
    let currentTime = 0.2;
    const timedWords = rawWords.map((word) => {
      const duration = 0.3 + word.length * 0.05;
      const start = Number(currentTime.toFixed(2));
      const end = Number((currentTime + duration).toFixed(2));
      currentTime = end + 0.1;

      return {
        word: word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''),
        start,
        end,
        confidence: 0.95,
      };
    });

    return {
      text,
      words: timedWords,
      durationSeconds: Number(currentTime.toFixed(2)),
      provider: this.name,
    };
  }
}

