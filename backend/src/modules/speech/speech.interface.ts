export interface TimedWord {
  word: string;
  start: number; // seconds
  end: number; // seconds
  confidence: number; // 0.0 - 1.0
}

export interface TranscriptionResult {
  text: string;
  words: TimedWord[];
  durationSeconds: number;
  provider: string;
}

export interface TranscribeOptions {
  prompt?: string;
  language?: string;
  expectedText?: string;
}

export interface ISpeechProvider {
  readonly name: string;
  transcribe(audioBuffer: Buffer, options?: TranscribeOptions): Promise<TranscriptionResult>;
}

