import { ApiProperty } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSentenceDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', required: false })
  @IsUUID()
  @IsOptional()
  lessonId?: string;

  @ApiProperty({ example: 'Yesterday I finished the database migration and unblocked the frontend team.' })
  @IsString()
  @IsNotEmpty()
  targetText: string;

  @ApiProperty({ example: 'ˈjɛstərˌdeɪ aɪ ˈfɪnɪʃt ðə ˈdeɪtəˌbeɪs maɪˈɡreɪʃən...', required: false })
  @IsString()
  @IsOptional()
  ipaTranscription?: string;

  @ApiProperty({ example: 'https://example.com/audio/sentences/123.mp3', required: false })
  @IsString()
  @IsOptional()
  audioUrl?: string;

  @ApiProperty({ enum: CefrLevel, example: 'INTERMEDIATE' })
  @IsEnum(CefrLevel)
  level: CefrLevel;

  @ApiProperty({ example: 'Past Simple & Irregular Verbs', required: false })
  @IsString()
  @IsOptional()
  grammarFocus?: string;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  orderIndex?: number;
}

