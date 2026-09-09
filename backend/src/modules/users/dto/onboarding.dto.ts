import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class OnboardingDto {
  @ApiPropertyOptional({ example: 'Hindi' })
  @IsString()
  @IsOptional()
  nativeLanguage?: string;

  @ApiProperty({ enum: CefrLevel, example: CefrLevel.BEGINNER })
  @IsEnum(CefrLevel)
  @IsNotEmpty()
  currentLevel: CefrLevel;

  @ApiProperty({ example: 'Pass IELTS Speaking with 7.5' })
  @IsString()
  @IsNotEmpty()
  targetGoal: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(5)
  @Max(120)
  dailyGoalMinutes: number;
}

