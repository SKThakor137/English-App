import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { QueryCoursesDto } from './dto/query-curriculum.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, CefrLevel } from '@prisma/client';

@ApiTags('Curriculum & Content')
@ApiBearerAuth()
@Controller()
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Get published courses with level and topic filters' })
  @ApiResponse({ status: 200, description: 'List of courses' })
  async getCourses(@Query() query: QueryCoursesDto) {
    return this.contentService.getCourses(query);
  }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get course syllabus and lessons by course ID' })
  @ApiResponse({ status: 200, description: 'Course syllabus' })
  async getCourseById(@Param('id') id: string) {
    return this.contentService.getCourseById(id);
  }

  @Get('lessons/:id')
  @ApiOperation({ summary: 'Get lesson exercises, sentences, and stories' })
  @ApiResponse({ status: 200, description: 'Lesson details' })
  async getLessonById(@Param('id') id: string) {
    return this.contentService.getLessonById(id);
  }

  @Get('sentences')
  @ApiOperation({ summary: 'Get practice sentences filtered by CEFR level' })
  @ApiResponse({ status: 200, description: 'List of practice sentences' })
  async getSentences(
    @Query('level') level?: CefrLevel,
    @Query('limit') limit?: number,
  ) {
    return this.contentService.getSentences(level, limit);
  }

  @Get('sentences/:id')
  @ApiOperation({ summary: 'Get single practice sentence with ground truth text' })
  @ApiResponse({ status: 200, description: 'Sentence item' })
  async getSentenceById(@Param('id') id: string) {
    return this.contentService.getSentenceById(id);
  }

  // --- Admin Authoring Endpoints ---

  @Post('admin/courses')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  @ApiResponse({ status: 201, description: 'Course created' })
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.contentService.createCourse(dto);
  }

  @Patch('admin/courses/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update existing course (Admin only)' })
  async updateCourse(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCourseDto>,
  ) {
    return this.contentService.updateCourse(id, dto);
  }

  @Delete('admin/courses/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete course (Admin only)' })
  async deleteCourse(@Param('id') id: string) {
    return this.contentService.deleteCourse(id);
  }

  @Post('admin/lessons')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new lesson within a course (Admin only)' })
  async createLesson(@Body() dto: CreateLessonDto) {
    return this.contentService.createLesson(dto);
  }

  @Patch('admin/lessons/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update lesson (Admin only)' })
  async updateLesson(
    @Param('id') id: string,
    @Body() dto: Partial<CreateLessonDto>,
  ) {
    return this.contentService.updateLesson(id, dto);
  }

  @Delete('admin/lessons/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete lesson (Admin only)' })
  async deleteLesson(@Param('id') id: string) {
    return this.contentService.deleteLesson(id);
  }

  @Post('admin/sentences')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create practice sentence (Admin only)' })
  async createSentence(@Body() dto: CreateSentenceDto) {
    return this.contentService.createSentence(dto);
  }
}

