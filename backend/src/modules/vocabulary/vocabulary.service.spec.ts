import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyService } from './vocabulary.service';
import { PrismaService } from '../../database/prisma.service';

describe('VocabularyService (SM-2 Algorithm)', () => {
  let service: VocabularyService;
  let prisma: any;

  const mockPrismaService = {
    vocabularyWord: {
      upsert: jest.fn(),
    },
    userVocabulary: {
      upsert: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocabularyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<VocabularyService>(VocabularyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should advance repetition and set interval to 1 day on initial successful review (grade 4)', async () => {
    const mockCard = {
      id: 'card-1',
      userId: 'user-1',
      repetitions: 0,
      intervalDays: 1,
      easeFactor: 2.50,
      nextReviewAt: new Date(),
    };

    mockPrismaService.userVocabulary.findFirst.mockResolvedValue(mockCard);
    mockPrismaService.userVocabulary.update.mockImplementation(({ data }) => Promise.resolve({ ...mockCard, ...data }));

    const result = await service.submitReview('user-1', 'card-1', { grade: 4 });

    expect(result.repetitions).toBe(1);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBeGreaterThanOrEqual(2.50);
  });

  it('should set interval to 6 days on second consecutive successful review (grade 4)', async () => {
    const mockCard = {
      id: 'card-2',
      userId: 'user-1',
      repetitions: 1,
      intervalDays: 1,
      easeFactor: 2.50,
      nextReviewAt: new Date(),
    };

    mockPrismaService.userVocabulary.findFirst.mockResolvedValue(mockCard);
    mockPrismaService.userVocabulary.update.mockImplementation(({ data }) => Promise.resolve({ ...mockCard, ...data }));

    const result = await service.submitReview('user-1', 'card-2', { grade: 4 });

    expect(result.repetitions).toBe(2);
    expect(result.intervalDays).toBe(6);
  });

  it('should reset repetitions to 0 and interval to 1 day on recall failure (grade 1)', async () => {
    const mockCard = {
      id: 'card-3',
      userId: 'user-1',
      repetitions: 4,
      intervalDays: 15,
      easeFactor: 2.30,
      nextReviewAt: new Date(),
    };

    mockPrismaService.userVocabulary.findFirst.mockResolvedValue(mockCard);
    mockPrismaService.userVocabulary.update.mockImplementation(({ data }) => Promise.resolve({ ...mockCard, ...data }));

    const result = await service.submitReview('user-1', 'card-3', { grade: 1 });

    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBeLessThan(2.30);
  });
});

