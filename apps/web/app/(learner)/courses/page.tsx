'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { BookOpen, Clock, ArrowRight, Award, CheckCircle } from 'lucide-react';

const LEVELS = ['ALL', 'BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED'];

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const query = selectedLevel !== 'ALL' ? `?level=${selectedLevel}` : '';
        const res: any = await apiClient.get(`/courses${query}`);
        if (res?.data?.courses) {
          setCourses(res.data.courses);
        }
      } catch {
        // Fallback demo courses if backend is not yet populated
        setCourses([
          {
            id: '1',
            title: 'Everyday Conversational Foundations',
            level: 'BEGINNER',
            topic: 'Daily Life',
            description: 'Master essential English for introductions, daily routines, and asking directions.',
            lessonCount: 4,
            totalEstimatedMinutes: 35,
          },
          {
            id: '2',
            title: 'Travel, Airports & Socializing',
            level: 'ELEMENTARY',
            topic: 'Travel',
            description: 'Navigate flights, hotels, taxi bookings, and casual conversations abroad.',
            lessonCount: 5,
            totalEstimatedMinutes: 45,
          },
          {
            id: '3',
            title: 'Professional Workplace & Agile Communication',
            level: 'INTERMEDIATE',
            topic: 'Workplace',
            description: 'Speak with authority in daily agile standups, sprint reviews, and team meetings.',
            lessonCount: 6,
            totalEstimatedMinutes: 60,
          },
          {
            id: '4',
            title: 'Technical Presentations & System Architecture',
            level: 'UPPER_INTERMEDIATE',
            topic: 'Engineering',
            description: 'Articulate complex engineering tradeoffs, distributed system diagrams, and interview questions.',
            lessonCount: 5,
            totalEstimatedMinutes: 75,
          },
          {
            id: '5',
            title: 'Executive Persuasion & Strategic Debates',
            level: 'ADVANCED',
            topic: 'Leadership',
            description: 'Master high-stakes stakeholder negotiations, diplomatic disagreements, and keynote delivery.',
            lessonCount: 4,
            totalEstimatedMinutes: 60,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Curriculum & Courses</h1>
        <p className="mt-2 text-sm text-slate-600">
          Explore structured speaking courses grouped by international CEFR standards.
        </p>
      </div>

      {/* CEFR Level Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedLevel === lvl
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                  {course.level}
                </span>
                <span className="text-xs text-slate-400 font-medium">{course.topic}</span>
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-brand-600 transition">
                {course.title}
              </h2>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.lessonCount || 0} Lessons</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.totalEstimatedMinutes || 0}m</span>
                </span>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="font-bold text-brand-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1"
              >
                <span>View Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

