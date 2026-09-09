import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  IPronunciationProvider,
  PronunciationResult,
} from './pronunciation.interface';
import { AzurePronunciationProvider } from './providers/azure-pronunciation.provider';
import { MockPronunciationProvider } from './providers/mock-pronunciation.provider';

@Injectable()
export class PronunciationService {
  private readonly logger = new Logger(PronunciationService.name);
  private providers: Map<string, IPronunciationProvider> = new Map();

  constructor(
    private prisma: PrismaService,
    private azureProvider: AzurePronunciationProvider,
    private mockProvider: MockPronunciationProvider,
  ) {
    this.providers.set(azureProvider.name, azureProvider);
    this.providers.set(mockProvider.name, mockProvider);
  }

  async assess(
    audioBuffer: Buffer,
    referenceText: string,
    attemptId?: string,
  ): Promise<PronunciationResult> {
    const selected = (process.env.PRONUNCIATION_PROVIDER || 'mock').toLowerCase();
    const provider = this.providers.get(selected) || this.mockProvider;

    let result: PronunciationResult;
    try {
      this.logger.log(`Assessing phonemes via provider: ${provider.name}`);
      result = await provider.assessPronunciation(audioBuffer, referenceText);
    } catch (err: any) {
      this.logger.warn(`Provider ${provider.name} failed (${err.message}), falling back to mock`);
      result = await this.mockProvider.assessPronunciation(audioBuffer, referenceText);
    }

    // Persist phoneme evaluations if attemptId provided
    if (attemptId && result.words) {
      try {
        for (const w of result.words) {
          if (w.phonemes && Array.isArray(w.phonemes)) {
            for (const p of w.phonemes) {
              await this.prisma.phonemeEvaluation.create({
                data: {
                  attemptId,
                  word: w.word,
                  phoneme: p.phoneme || '',
                  score: Number(p.score ?? 85.0),
                  isAccurate: Number(p.score ?? 85.0) >= 75.0,
                  ipaSymbol: p.phoneme || null,
                },
              });
            }
          }
        }
      } catch (dbErr: any) {
        this.logger.error(`Failed to persist phoneme records: ${dbErr.message}`);
      }
    }

    return result;
  }
}

