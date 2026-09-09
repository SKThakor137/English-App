import { ApiProperty } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCoursesDto {
  @ApiProperty({ enum: CefrLevel, required: false })
  @IsEnum(CefrLevel)
  @IsOptional()
  level?: CefrLevel;

  @ApiProperty({ example: 'Workplace', required: false })
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiProperty({ example: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 20, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

