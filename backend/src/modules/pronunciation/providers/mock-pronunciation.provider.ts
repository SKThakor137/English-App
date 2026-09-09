import { Injectable, Logger } from '@nestjs/common';
import {
  IPronunciationProvider,
  PronunciationResult,
  WordPronunciation,
  PhonemeScore,
} from '../pronunciation.interface';

@Injectable()
export class MockPronunciationProvider implements IPronunciationProvider {
  readonly name = 'mock';
  private readonly logger = new Logger(MockPronunciationProvider.name);

  // Common phonetic mappings for demonstration
  private phonemeMap: Record<string, string[]> = {
    i: ['aɪ'],
    usually: ['j', 'uː', 'ʒ', 'u', 'ə', 'l', 'i'],
    go: ['ɡ', 'oʊ'],
    for: ['f', 'ɔr'],
    a: ['ə'],
    walk: ['w', 'ɔ', 'k'],
    in: ['ɪ', 'n'],
    the: ['ð', 'ə'],
    evening: ['iː', 'v', 'n', 'ɪ', 'ŋ'],
    because: ['b', 'ɪ', 'k', 'ɔ', 'z'],
    it: ['ɪ', 't'],
    helps: ['h', 'ɛ', 'l', 'p', 's'],
    me: ['m', 'iː'],
    relax: ['r', 'ɪ', 'ˈl', 'æ', 'k', 's'],
  };

  async assessPronunciation(
    audioBuffer: Buffer,
    referenceText: string,
  ): Promise<PronunciationResult> {
    this.logger.log(`Mock assessing pronunciation for text: "${referenceText}"`);

    const cleanWords = referenceText
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
      .split(/\s+/);

    const words: WordPronunciation[] = cleanWords.map((word) => {
      const phonemeList = this.phonemeMap[word] || word.split('');
      const phonemes: PhonemeScore[] = phonemeList.map((ph) => {
        const score = Math.floor(Math.random() * 15) + 85; // 85 - 100
        return {
          phoneme: ph,
          ipa: ph,
          score,
          errorType: score < 80 ? 'Substitution' : 'None',
        };
      });

      const avgWordScore = Math.round(
        phonemes.reduce((sum, p) => sum + p.score, 0) / phonemes.length,
      );

      return {
        word,
        accuracyScore: avgWordScore,
        phonemes,
        stressScore: 92,
      };
    });

    const overallAccuracy = Math.round(
      words.reduce((sum, w) => sum + w.accuracyScore, 0) / words.length,
    );

    return {
      overallAccuracy,
      fluency: 88,
      completeness: 100,
      prosody: 90,
      words,
      provider: this.name,
    };
  }
}

