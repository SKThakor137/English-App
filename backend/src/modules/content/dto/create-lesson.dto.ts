import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 'Running Daily Agile Standups' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @ApiProperty({ example: 10, required: false })
  @IsInt()
  @IsOptional()
  estimatedMinutes?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

