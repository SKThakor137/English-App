import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../../storage/storage.service';
import { PdfParserService } from './pdf-parser.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private parserService: PdfParserService,
  ) {}

  async createUploadUrl(userId: string, filename: string) {
    const timestamp = Date.now();
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `production/users/${userId}/documents/${timestamp}_${sanitized}`;

    return this.storageService.getPresignedUploadUrl(s3Key, 'application/pdf', 25 * 1024 * 1024);
  }

  async registerDocument(userId: string, dto: UploadDocumentDto) {
    const document = await this.prisma.document.create({
      data: {
        userId,
        title: dto.title,
        originalS3Key: dto.s3Key,
        fileSizeBytes: BigInt(dto.fileSizeBytes),
      },
    });

    // In production, dispatched to BullMQ pdf-processing-queue. Here we trigger parser asynchronously.
    setImmediate(() => {
      this.parserService.parseDocument(document.id).catch(() => {});
    });

    return {
      id: document.id,
      title: document.title,
      status: document.processingStatus,
      createdAt: document.createdAt,
    };
  }

  async getUserDocuments(userId: string) {
    const docs = await this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });

    return docs.map((d) => ({
      id: d.id,
      title: d.title,
      status: d.processingStatus,
      fileSizeBytes: Number(d.fileSizeBytes),
      totalPages: d.totalPages,
      sentenceCount: d._count.chunks,
      createdAt: d.createdAt,
    }));
  }

  async getDocumentById(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
      include: {
        chunks: {
          orderBy: [
            { chapterIndex: 'asc' },
            { paragraphIndex: 'asc' },
            { sentenceIndex: 'asc' },
          ],
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return {
      id: document.id,
      title: document.title,
      status: document.processingStatus,
      totalPages: document.totalPages,
      chunks: document.chunks,
    };
  }

  async deleteDocument(userId: string, documentId: string) {
    const doc = await this.getDocumentById(userId, documentId);
    return this.prisma.document.delete({
      where: { id: doc.id },
    });
  }
}

