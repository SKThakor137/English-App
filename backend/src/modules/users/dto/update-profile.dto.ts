import { ApiPropertyOptional } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Jordan Belfort' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-learner' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Spanish' })
  @IsString()
  @IsOptional()
  nativeLanguage?: string;

  @ApiPropertyOptional({ enum: CefrLevel })
  @IsEnum(CefrLevel)
  @IsOptional()
  currentLevel?: CefrLevel;

  @ApiPropertyOptional({ example: 'Workplace Fluency' })
  @IsString()
  @IsOptional()
  targetGoal?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsInt()
  @Min(5)
  @Max(120)
  @IsOptional()
  dailyGoalMinutes?: number;
}

