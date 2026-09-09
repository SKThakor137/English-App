import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class ReviewWordDto {
  @ApiProperty({
    example: 3,
    description: 'SuperMemo SM-2 recall rating: 1=Again, 2=Hard, 3=Good, 4=Easy',
  })
  @IsInt()
  @Min(1)
  @Max(4)
  grade: number;
}

