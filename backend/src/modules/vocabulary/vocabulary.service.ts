import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SaveWordDto } from './dto/save-word.dto';
import { ReviewWordDto } from './dto/review-word.dto';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async saveWord(userId: string, dto: SaveWordDto) {
    const cleanWord = dto.word.toLowerCase().trim();

    // 1. Find or create master vocabulary word
    const word = await this.prisma.vocabularyWord.upsert({
      where: { word: cleanWord },
      update: {
        definition: dto.definition,
        ipaUs: dto.ipaUs,
        exampleSentence: dto.exampleSentence,
      },
      create: {
        word: cleanWord,
        definition: dto.definition,
        ipaUs: dto.ipaUs,
        exampleSentence: dto.exampleSentence,
        cefrLevel: dto.cefrLevel || 'INTERMEDIATE',
      },
    });

    // 2. Add to user vocabulary deck with initial SM-2 parameters
    const userVocab = await this.prisma.userVocabulary.upsert({
      where: {
        userId_wordId: {
          userId,
          wordId: word.id,
        },
      },
      update: {},
      create: {
        userId,
        wordId: word.id,
        intervalDays: 1,
        easeFactor: 2.50,
        repetitions: 0,
        nextReviewAt: new Date(),
        masteryPercentage: 0,
      },
      include: { word: true },
    });

    return userVocab;
  }

  async getUserVocabulary(userId: string) {
    return this.prisma.userVocabulary.findMany({
      where: { userId },
      include: { word: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDueReviews(userId: string) {
    const now = new Date();
    return this.prisma.userVocabulary.findMany({
      where: {
        userId,
        nextReviewAt: { lte: now },
      },
      include: { word: true },
      orderBy: { nextReviewAt: 'asc' },
    });
  }

  async submitReview(userId: string, userVocabId: string, dto: ReviewWordDto) {
    const item = await this.prisma.userVocabulary.findFirst({
      where: { id: userVocabId, userId },
    });

    if (!item) {
      throw new NotFoundException('Vocabulary card not found');
    }

    const q = dto.grade + 1; // map 1..4 to 2..5
    let repetitions = item.repetitions;
    let intervalDays = item.intervalDays;
    let easeFactor = Number(item.easeFactor);

    // SM-2 Calculation
    if (q >= 3) {
      if (repetitions === 0) {
        intervalDays = 1;
      } else if (repetitions === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      intervalDays = 1;
    }

    // Update Ease Factor
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.30) easeFactor = 1.30;

    const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);
    const masteryPercentage = Math.min(100, repetitions * 20);

    return this.prisma.userVocabulary.update({
      where: { id: userVocabId },
      data: {
        repetitions,
        intervalDays,
        easeFactor: Number(easeFactor.toFixed(2)),
        nextReviewAt,
        masteryPercentage,
      },
      include: { word: true },
    });
  }

  async deleteWord(userId: string, userVocabId: string) {
    const item = await this.prisma.userVocabulary.findFirst({
      where: { id: userVocabId, userId },
    });

    if (!item) {
      throw new NotFoundException('Vocabulary card not found');
    }

    return this.prisma.userVocabulary.delete({
      where: { id: userVocabId },
    });
  }
}

