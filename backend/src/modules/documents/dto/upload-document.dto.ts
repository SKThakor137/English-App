import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({ example: 'Agile Best Practices Handbook.pdf' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'production/users/user1/documents/doc_123.pdf' })
  @IsString()
  @IsNotEmpty()
  s3Key: string;

  @ApiProperty({ example: 1048576, description: 'File size in bytes' })
  @IsInt()
  @Min(100)
  @Max(25 * 1024 * 1024) // 25MB max
  fileSizeBytes: number;
}

