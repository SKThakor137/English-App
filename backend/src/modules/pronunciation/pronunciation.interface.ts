export interface PhonemeScore {
  phoneme: string;
  ipa: string;
  score: number; // 0 - 100
  errorType: 'None' | 'Omission' | 'Insertion' | 'Substitution';
}

export interface WordPronunciation {
  word: string;
  accuracyScore: number;
  phonemes: PhonemeScore[];
  stressScore?: number;
}

export interface PronunciationResult {
  overallAccuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
  words: WordPronunciation[];
  provider: string;
}

export interface IPronunciationProvider {
  readonly name: string;
  assessPronunciation(
    audioBuffer: Buffer,
    referenceText: string,
  ): Promise<PronunciationResult>;
}

