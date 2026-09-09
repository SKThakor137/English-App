import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../database/prisma.service';
import { AiFeedbackSchema, AiFeedbackPayload } from './ai-feedback.schema';
import { CefrLevel } from '@prisma/client';

@Injectable()
export class AiFeedbackService {
  private readonly logger = new Logger(AiFeedbackService.name);

  constructor(private prisma: PrismaService) {}

  async generateFeedback(
    expectedText: string,
    spokenText: string,
    level: CefrLevel = CefrLevel.INTERMEDIATE,
    attemptId?: string,
  ): Promise<AiFeedbackPayload> {
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    let payload: AiFeedbackPayload;

    if (apiKey) {
      try {
        payload = await this.callLlmProvider(expectedText, spokenText, level);
      } catch (err: any) {
        this.logger.warn(`LLM provider error (${err.message}), falling back to deterministic analyzer`);
        payload = this.generateDeterministicFeedback(expectedText, spokenText);
      }
    } else {
      payload = this.generateDeterministicFeedback(expectedText, spokenText);
    }

    // If an attempt ID is provided, persist the feedback record
    if (attemptId) {
      try {
        await this.prisma.aiFeedbackRecord.create({
          data: {
            attemptId,
            overallScore: payload.overallScore || 85,
            grammarScore: payload.grammarScore || 85,
            fluencyScore: payload.fluencyScore || 85,
            accuracyScore: payload.accuracyScore || 85,
            errors: payload.errors as any,
            suggestions: payload.suggestions as any,
            positiveFeedback: Array.isArray(payload.positiveFeedback)
              ? (payload.positiveFeedback as string[]).join(' ')
              : (payload.positiveFeedback || 'Good effort!'),
          },
        });
      } catch (dbErr: any) {
        this.logger.error(`Failed to persist feedback record: ${dbErr.message}`);
      }
    }

    return payload;
  }

  private async callLlmProvider(
    expectedText: string,
    spokenText: string,
    level: string,
  ): Promise<AiFeedbackPayload> {
    const prompt = `You are a supportive, expert ESL pronunciation and grammar coach.
Analyze the user's spoken sentence against the expected model sentence.

Context:
- Learner CEFR Level: ${level}
- Expected Target: "${expectedText}"
- User Spoken: "${spokenText}"

Directives:
1. Provide constructive, encouraging feedback.
2. Return ONLY a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "grammarScore": number (0-100),
  "fluencyScore": number (0-100),
  "vocabularyScore": number (0-100),
  "accuracyScore": number (0-100),
  "errors": [
    {
      "errorType": "GRAMMAR" | "TENSE" | "PREPOSITION" | "ARTICLE" | "WORD_CHOICE",
      "originalFragment": "string",
      "correctedFragment": "string",
      "explanation": "concise rationale max 150 chars"
    }
  ],
  "suggestions": ["1 to 3 actionable suggestions"],
  "positiveFeedback": ["1 to 3 positive affirmations"]
}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 8000,
      },
    );

    const rawContent = response.data.choices[0].message.content;
    const parsed = JSON.parse(rawContent);
    return AiFeedbackSchema.parse(parsed);
  }

  private generateDeterministicFeedback(expected: string, spoken: string): AiFeedbackPayload {
    const expWords = expected.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').split(/\s+/);
    const spkWords = spoken.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').split(/\s+/);

    const errors: any[] = [];
    let matchCount = 0;

    for (let i = 0; i < expWords.length; i++) {
      const exp = expWords[i];
      const spk = spkWords[i];

      if (spk && exp === spk) {
        matchCount++;
      } else if (spk && exp !== spk) {
        errors.push({
          errorType: 'WORD_CHOICE',
          originalFragment: spk,
          correctedFragment: exp,
          explanation: `Used "${spk}" instead of the model word "${exp}".`,
        });
      } else if (!spk) {
        errors.push({
          errorType: 'ARTICLE',
          originalFragment: '(omitted)',
          correctedFragment: exp,
          explanation: `Omitted word "${exp}".`,
        });
      }
    }

    const accuracy = expWords.length > 0 ? Math.round((matchCount / expWords.length) * 100) : 100;
    const overallScore = Math.max(50, Math.min(100, accuracy));

    return {
      overallScore,
      grammarScore: errors.length === 0 ? 98 : 82,
      fluencyScore: 86,
      vocabularyScore: 90,
      accuracyScore: accuracy,
      errors,
      suggestions: [
        errors.length > 0
          ? `Focus on articulating "${errors[0].correctedFragment}" clearly in your next attempt.`
          : 'Practice speaking at a slightly faster tempo while maintaining clear syllable stress.',
      ],
      positiveFeedback: [
        'Good vocal projection and steady conversational rhythm!',
        'Clear consonant pronunciation on key words.',
      ],
    };
  }
}

