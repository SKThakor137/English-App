import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConversationTurnDto {
  @ApiProperty({ example: 'Yesterday I completed the authentication API and today I am working on audio streaming.' })
  @IsString()
  @IsNotEmpty()
  messageText: string;

  @ApiProperty({ example: 'production/users/user1/conv_turn_123.wav', required: false })
  @IsString()
  @IsOptional()
  audioS3Key?: string;
}

