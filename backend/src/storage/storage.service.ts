import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.STORAGE_BUCKET || 'english-platform-audio';
    const endpoint = process.env.STORAGE_ENDPOINT || 'http://localhost:9000';
    const accessKeyId = process.env.STORAGE_ACCESS_KEY || 'minioadmin';
    const secretAccessKey = process.env.STORAGE_SECRET_KEY || 'minioadmin';
    const region = process.env.STORAGE_REGION || 'us-east-1';

    this.s3 = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Required for MinIO & local dev
    });
  }

  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    maxSizeBytes: number = 10 * 1024 * 1024, // 10MB default
    expiresInSeconds: number = 300, // 5 min
  ) {
    const allowedAudioTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp4', 'audio/webm', 'application/pdf'];
    if (!allowedAudioTypes.includes(contentType)) {
      throw new BadRequestException(`Unsupported Content-Type: ${contentType}. Allowed types: ${allowedAudioTypes.join(', ')}`);
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      uploadUrl,
      s3Key: key,
      maxSizeBytes,
      expiresInSeconds,
    };
  }

  async getPresignedDownloadUrl(key: string, expiresInSeconds: number = 900) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });
  }
}

