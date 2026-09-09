import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ISpeechProvider, TranscribeOptions, TranscriptionResult } from '../speech.interface';

@Injectable()
export class WhisperSpeechProvider implements ISpeechProvider {
  readonly name = 'whisper';
  private readonly logger = new Logger(WhisperSpeechProvider.name);

  async transcribe(audioBuffer: Buffer, options?: TranscribeOptions): Promise<TranscriptionResult> {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    const isGroq = !!process.env.GROQ_API_KEY;

    if (!apiKey) {
      this.logger.warn('No Whisper API Key provided, falling back to mock');
      return {
        text: options?.expectedText || 'Audio transcript unavailable without API key',
        words: [],
        durationSeconds: 3.0,
        provider: 'whisper-fallback',
      };
    }

    const endpoint = isGroq
      ? 'https://api.groq.com/openai/v1/audio/transcriptions'
      : 'https://api.openai.com/v1/audio/transcriptions';

    const model = isGroq ? 'whisper-large-v3' : 'whisper-1';

    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/wav' });
    formData.append('file', blob, 'recording.wav');
    formData.append('model', model);
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');
    if (options?.language) formData.append('language', options.language);
    if (options?.prompt) formData.append('prompt', options.prompt);

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });

      const data = response.data;
      const timedWords = (data.words || []).map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end,
        confidence: 0.92,
      }));

      return {
        text: data.text || '',
        words: timedWords,
        durationSeconds: data.duration || 0,
        provider: this.name,
      };
    } catch (err: any) {
      this.logger.error(`Whisper transcription error: ${err.message}`, err.stack);
      throw err;
    }
  }
}

