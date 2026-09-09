import { ApiProperty } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({ example: '2026-09-10', description: 'YYYY-MM-DD challenge date' })
  @IsDateString()
  challengeDate: string;

  @ApiProperty({ example: 'Describe your favorite weekend routine in 60 seconds' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ example: 'Talk about what you usually do on Saturday morning, afternoon, and evening. Practice using past and present time transitions.' })
  @IsString()
  @IsNotEmpty()
  promptText: string;

  @ApiProperty({ example: 60, default: 60 })
  @IsInt()
  @Min(30)
  @Max(180)
  targetDurationSeconds: number = 60;

  @ApiProperty({ enum: CefrLevel, default: CefrLevel.INTERMEDIATE })
  @IsEnum(CefrLevel)
  difficulty: CefrLevel = CefrLevel.INTERMEDIATE;
}

