import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test_jwt_secret_min_32_characters_long';
      if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret_min_32_characters';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ConflictException if email is already registered', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id' });

    await expect(
      service.register({
        email: 'learner@example.com',
        password: 'Password123!',
        fullName: 'Alex Learner',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should successfully register a new learner and issue token pair', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'learner@example.com',
      role: 'FREE_USER',
      profile: { fullName: 'Alex Learner', currentLevel: 'BEGINNER' },
    });
    mockPrismaService.user.update.mockResolvedValue({});

    const result = await service.register({
      email: 'learner@example.com',
      password: 'Password123!',
      fullName: 'Alex Learner',
    });

    expect(result.user.id).toBe('new-user-id');
    expect(result.tokens.accessToken).toBe('mocked.jwt.token');
    expect(result.tokens.refreshToken).toBe('mocked.jwt.token');
  });

  it('should throw UnauthorizedException on invalid password during login', async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('CorrectPassword123!', salt);

    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'learner@example.com',
      passwordHash,
      role: 'FREE_USER',
      profile: { fullName: 'Learner' },
    });

    await expect(
      service.login({
        email: 'learner@example.com',
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

