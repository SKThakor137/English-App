'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, BookOpen, Clock, Mic, CheckCircle2, Play } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res: any = await apiClient.get(`/courses/${courseId}`);
        if (res?.data) {
          setCourse(res.data);
        }
      } catch {
        // Fallback demo data
        setCourse({
          id: courseId,
          title: 'Professional Workplace & Agile Communication',
          description: 'Master agile standup delivery, sprint planning discussions, and cross-functional project updates.',
          level: 'INTERMEDIATE',
          topic: 'Workplace',
          lessons: [
            {
              id: 'l1',
              title: 'Delivering Agile Standup Updates',
              orderIndex: 1,
              estimatedMinutes: 12,
              _count: { sentences: 5, paragraphs: 1, stories: 0 },
            },
            {
              id: 'l2',
              title: 'Explaining Blockers & Technical Dependencies',
              orderIndex: 2,
              estimatedMinutes: 15,
              _count: { sentences: 4, paragraphs: 1, stories: 0 },
            },
            {
              id: 'l3',
              title: 'Sprint Retrospectives & Constructive Feedback',
              orderIndex: 3,
              estimatedMinutes: 15,
              _count: { sentences: 6, paragraphs: 1, stories: 1 },
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    if (courseId) load();
  }, [courseId]);

  if (!course) {
    return <div className="p-8 text-center text-slate-500">Loading course syllabus...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <Link
        href="/courses"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Courses</span>
      </Link>

      {/* Course Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-3 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
            {course.level}
          </span>
          <span className="text-xs font-semibold text-slate-400">{course.topic}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{course.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>
      </div>

      {/* Lessons Syllabus */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Course Syllabus</h2>

        <div className="space-y-3">
          {course.lessons?.map((lesson: any, index: number) => (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm hover:border-brand-500 transition group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-50 text-slate-700 group-hover:text-brand-600 flex items-center justify-center font-bold text-sm transition">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lesson.estimatedMinutes} min</span>
                    </span>
                    <span>•</span>
                    <span>{lesson._count?.sentences || 4} Practice Sentences</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/practice/sentence/${lesson.id}`}
                className="px-4 py-2 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-700 group-hover:text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Lesson</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

