import { ApiProperty } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveWordDto {
  @ApiProperty({ example: 'exhausted' })
  @IsString()
  @IsNotEmpty()
  word: string;

  @ApiProperty({ example: 'ɪɡˈzɔːstɪd', required: false })
  @IsString()
  @IsOptional()
  ipaUs?: string;

  @ApiProperty({ example: 'Extremely tired or depleted of energy.' })
  @IsString()
  @IsNotEmpty()
  definition: string;

  @ApiProperty({ example: 'I was exhausted after the long sprint planning session.', required: false })
  @IsString()
  @IsOptional()
  exampleSentence?: string;

  @ApiProperty({ enum: CefrLevel, example: 'INTERMEDIATE', required: false })
  @IsEnum(CefrLevel)
  @IsOptional()
  cefrLevel?: CefrLevel;
}

