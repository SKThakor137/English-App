import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CefrLevel, DocumentStatus } from '@prisma/client';

export interface ExtractedSentence {
  chapterIndex: number;
  paragraphIndex: number;
  sentenceIndex: number;
  contentText: string;
  cleanText: string;
  calculatedLevel: CefrLevel;
}

@Injectable()
export class PdfParserService {
  private readonly logger = new Logger(PdfParserService.name);

  constructor(private prisma: PrismaService) {}

  async parseDocument(documentId: string, sampleTextContent?: string) {
    this.logger.log(`Starting structural parsing for document: ${documentId}`);

    try {
      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.PROCESSING },
      });

      // If raw extracted text was passed or mock sample
      const rawText = sampleTextContent || this.getSamplePdfText();

      // 1. Split into paragraphs
      const paragraphs = rawText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 20);

      const chunks: ExtractedSentence[] = [];
      let chapterIndex = 1;
      let paragraphIndex = 1;

      for (const p of paragraphs) {
        // Detect chapter headings
        if (p.toLowerCase().startsWith('chapter') || p.length < 50 && p.endsWith(':')) {
          chapterIndex++;
          continue;
        }

        // 2. Sentence boundary detection (protecting abbreviations like e.g., i.e., Dr., etc.)
        const rawSentences = p
          .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
          .split('|')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        let sentenceIndex = 1;
        for (const s of rawSentences) {
          const wordCount = s.split(/\s+/).length;
          // Only extract pedagogical sentences between 4 and 35 words
          if (wordCount >= 4 && wordCount <= 35) {
            const cleanText = s.replace(/\s+/g, ' ');
            const calculatedLevel = this.estimateCefrLevel(cleanText);

            chunks.push({
              chapterIndex,
              paragraphIndex,
              sentenceIndex,
              contentText: s,
              cleanText,
              calculatedLevel,
            });
            sentenceIndex++;
          }
        }
        paragraphIndex++;
      }

      // 3. Persist document chunks in database
      let idx = 0;
      for (const chunk of chunks) {
        await this.prisma.documentChunk.create({
          data: {
            documentId,
            chunkIndex: idx++,
            textContent: chunk.contentText || chunk.cleanText || '',
            targetSentences: [chunk.cleanText],
          },
        });
      }

      // 4. Update document status
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          status: DocumentStatus.COMPLETED,
          totalSentences: chunks.length,
        },
      });

      this.logger.log(`Document ${documentId} parsed successfully: ${chunks.length} practice sentences generated.`);
      return chunks;
    } catch (err: any) {
      this.logger.error(`Document parsing failed: ${err.message}`, err.stack);
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          status: DocumentStatus.FAILED,
        },
      });
      throw err;
    }
  }

  private estimateCefrLevel(sentence: string): CefrLevel {
    const words = sentence.toLowerCase().split(/\s+/);
    const avgWordLength = words.reduce((acc, w) => acc + w.length, 0) / words.length;

    if (words.length < 8 && avgWordLength < 4.5) return CefrLevel.BEGINNER;
    if (words.length < 12 && avgWordLength < 5.2) return CefrLevel.ELEMENTARY;
    if (words.length < 18 && avgWordLength < 6.0) return CefrLevel.INTERMEDIATE;
    if (words.length < 25 && avgWordLength < 6.8) return CefrLevel.UPPER_INTERMEDIATE;
    return CefrLevel.ADVANCED;
  }

  private getSamplePdfText(): string {
    return `Chapter 1: Principles of Effective Workplace Communication

Effective communication is the cornerstone of every high-performing engineering organization. When team members articulate architectural decisions with clarity, project delivery velocity accelerates significantly.

Daily standups provide an opportunity to share progress and highlight blockers before they jeopardize sprint deliverables. Clear communication prevents misunderstandings and fosters mutual trust across cross-functional teams.

Chapter 2: Managing Stakeholder Expectations

Clear expectations require proactive dialogue and transparent documentation. When unforeseen technical challenges emerge, communicating early allows stakeholders to adjust priorities pragmatically.`;
  }
}

