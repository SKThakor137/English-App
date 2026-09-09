import { ApiProperty } from '@nestjs/swagger';
import { PracticeType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class PresignedAudioUrlDto {
  @ApiProperty({ example: 'audio/wav', description: 'MIME type of the audio recording' })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({ enum: PracticeType, example: 'SENTENCE' })
  @IsEnum(PracticeType)
  practiceType: PracticeType;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', required: false })
  @IsUUID()
  @IsOptional()
  referenceId?: string;
}

