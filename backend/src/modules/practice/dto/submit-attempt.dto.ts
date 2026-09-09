import { ApiProperty } from '@nestjs/swagger';
import { PracticeType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class SubmitAttemptDto {
  @ApiProperty({ enum: PracticeType, example: 'SENTENCE' })
  @IsEnum(PracticeType)
  practiceType: PracticeType;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', required: false })
  @IsUUID()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ example: 'I usually go for a walk in the evening because it helps me relax.' })
  @IsString()
  @IsNotEmpty()
  expectedText: string;

  @ApiProperty({ example: 'audio/production/users/user1/attempt1.wav' })
  @IsString()
  @IsNotEmpty()
  audioS3Key: string;

  @ApiProperty({ example: 4.5, description: 'Duration of spoken audio in seconds' })
  @IsNumber()
  @Min(0.5)
  durationSeconds: number;
}

