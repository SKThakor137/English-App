import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  IPronunciationProvider,
  PronunciationResult,
  WordPronunciation,
} from '../pronunciation.interface';

@Injectable()
export class AzurePronunciationProvider implements IPronunciationProvider {
  readonly name = 'azure';
  private readonly logger = new Logger(AzurePronunciationProvider.name);

  async assessPronunciation(
    audioBuffer: Buffer,
    referenceText: string,
  ): Promise<PronunciationResult> {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION || 'eastus';

    if (!speechKey) {
      this.logger.warn('Azure Speech Key not configured, falling back to mock');
      throw new Error('Azure credentials missing');
    }

    const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

    const pronunciationAssessmentHeader = Buffer.from(
      JSON.stringify({
        ReferenceText: referenceText,
        GradingSystem: 'HundredMark',
        Granularity: 'Phoneme',
        Dimension: 'Comprehensive',
        EnableMiscue: true,
      }),
    ).toString('base64');

    try {
      const res = await axios.post(endpoint, audioBuffer, {
        headers: {
          'Ocp-Apim-Subscription-Key': speechKey,
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          'Pronunciation-Assessment': pronunciationAssessmentHeader,
        },
        timeout: 12000,
      });

      const nBest = res.data?.NBest?.[0];
      const assessment = nBest?.PronunciationAssessment;

      const words: WordPronunciation[] = (nBest?.Words || []).map((w: any) => ({
        word: w.Word,
        accuracyScore: Math.round(w.PronunciationAssessment?.AccuracyScore || 80),
        stressScore: Math.round(w.PronunciationAssessment?.StressScore || 85),
        phonemes: (w.Phonemes || []).map((p: any) => ({
          phoneme: p.Phoneme,
          ipa: p.Phoneme,
          score: Math.round(p.PronunciationAssessment?.AccuracyScore || 80),
          errorType: p.PronunciationAssessment?.ErrorType || 'None',
        })),
      }));

      return {
        overallAccuracy: Math.round(assessment?.AccuracyScore || 85),
        fluency: Math.round(assessment?.FluencyScore || 85),
        completeness: Math.round(assessment?.CompletenessScore || 100),
        prosody: Math.round(assessment?.ProsodyScore || 85),
        words,
        provider: this.name,
      };
    } catch (err: any) {
      this.logger.error(`Azure assessment failed: ${err.message}`);
      throw err;
    }
  }
}

