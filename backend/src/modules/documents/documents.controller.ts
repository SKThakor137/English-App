import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Documents & PDF Learning')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Obtain pre-signed S3 upload URL for PDF learning document' })
  @ApiResponse({ status: 200, description: 'Pre-signed upload URL' })
  async getUploadUrl(
    @CurrentUser('id') userId: string,
    @Query('filename') filename: string,
  ) {
    return this.documentsService.createUploadUrl(userId, filename || 'document.pdf');
  }

  @Post()
  @ApiOperation({ summary: 'Register uploaded PDF document and trigger chapter extraction' })
  @ApiResponse({ status: 201, description: 'Document registered' })
  async registerDocument(
    @CurrentUser('id') userId: string,
    @Body() dto: UploadDocumentDto,
  ) {
    return this.documentsService.registerDocument(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user uploaded documents with processing status' })
  @ApiResponse({ status: 200, description: 'List of documents' })
  async getUserDocuments(@CurrentUser('id') userId: string) {
    return this.documentsService.getUserDocuments(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details and extracted sentence practice chunks' })
  @ApiResponse({ status: 200, description: 'Document details with chunks' })
  async getDocumentById(
    @CurrentUser('id') userId: string,
    @Param('id') documentId: string,
  ) {
    return this.documentsService.getDocumentById(userId, documentId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document and associated practice chunks' })
  async deleteDocument(
    @CurrentUser('id') userId: string,
    @Param('id') documentId: string,
  ) {
    return this.documentsService.deleteDocument(userId, documentId);
  }
}

