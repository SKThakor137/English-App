import { ApiProperty } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Professional Workplace English' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'professional-workplace-english' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Master standups, client demos, and salary negotiations in English.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CefrLevel, example: 'INTERMEDIATE' })
  @IsEnum(CefrLevel)
  level: CefrLevel;

  @ApiProperty({ example: 'Workplace' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ example: 'https://example.com/thumbnails/workplace.jpg', required: false })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

