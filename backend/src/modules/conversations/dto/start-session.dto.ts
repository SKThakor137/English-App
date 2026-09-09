import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StartSessionDto {
  @ApiProperty({ example: 'scenario-standup', description: 'Scenario slug or identifier' })
  @IsString()
  @IsNotEmpty()
  scenarioId: string;
}

