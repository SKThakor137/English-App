import { z } from 'zod';

export const AiFeedbackSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  grammarScore: z.number().int().min(0).max(100),
  fluencyScore: z.number().int().min(0).max(100),
  vocabularyScore: z.number().int().min(0).max(100),
  accuracyScore: z.number().int().min(0).max(100),
  errors: z.array(
    z.object({
      errorType: z.enum(['GRAMMAR', 'TENSE', 'PREPOSITION', 'ARTICLE', 'WORD_CHOICE']),
      originalFragment: z.string(),
      correctedFragment: z.string(),
      explanation: z.string().max(250),
    }),
  ),
  suggestions: z.array(z.string().max(200)).min(1).max(3),
  positiveFeedback: z.array(z.string().max(200)).min(1).max(3),
});

export type AiFeedbackPayload = z.infer<typeof AiFeedbackSchema>;

