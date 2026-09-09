import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PdfParserService } from './pdf-parser.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PdfParserService],
  exports: [DocumentsService, PdfParserService],
})
export class DocumentsModule {}

