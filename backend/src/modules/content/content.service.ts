import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { QueryCoursesDto } from './dto/query-curriculum.dto';
import { CefrLevel } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getCourses(query: QueryCoursesDto) {
    const { level, topic, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (level) where.level = level;
    if (topic) where.topic = { contains: topic, mode: 'insensitive' };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
        include: {
          _count: {
            select: { lessons: true },
          },
          lessons: {
            select: { estimatedMinutes: true },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    const formatted = courses.map((course) => {
      const totalEstimatedMinutes = course.lessons.reduce((acc, l) => acc + l.estimatedMinutes, 0);
      const { lessons, _count, ...rest } = course;
      return {
        ...rest,
        lessonCount: _count.lessons,
        totalEstimatedMinutes,
      };
    });

    return {
      courses: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: {
              select: {
                sentences: true,
                paragraphs: true,
                stories: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async getLessonById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
        sentences: {
          orderBy: { orderIndex: 'asc' },
        },
        paragraphs: true,
        stories: {
          include: { segments: { orderBy: { orderIndex: 'asc' } } },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async getSentences(level?: CefrLevel, limit: number = 20) {
    const where: any = {};
    if (level) where.level = level;

    return this.prisma.sentence.findMany({
      where,
      take: limit,
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getSentenceById(id: string) {
    const sentence = await this.prisma.sentence.findUnique({
      where: { id },
    });

    if (!sentence) {
      throw new NotFoundException('Sentence not found');
    }

    return sentence;
  }

  // --- Admin Authoring Operations ---

  async createCourse(dto: CreateCourseDto) {
    const existing = await this.prisma.course.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('A course with this slug already exists');
    }

    return this.prisma.course.create({
      data: {
        ...dto,
        description: dto.description || dto.title,
      },
    });
  }

  async updateCourse(id: string, dto: Partial<CreateCourseDto>) {
    await this.getCourseById(id);
    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCourse(id: string) {
    await this.getCourseById(id);
    return this.prisma.course.delete({
      where: { id },
    });
  }

  async createLesson(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: dto,
    });
  }

  async updateLesson(id: string, dto: Partial<CreateLessonDto>) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async deleteLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  async createSentence(dto: CreateSentenceDto) {
    return this.prisma.sentence.create({
      data: dto,
    });
  }

  async bulkCreateSentences(sentences: CreateSentenceDto[]) {
    return this.prisma.sentence.createMany({
      data: sentences,
    });
  }

  async deleteSentence(id: string) {
    await this.getSentenceById(id);
    return this.prisma.sentence.delete({
      where: { id },
    });
  }
}

