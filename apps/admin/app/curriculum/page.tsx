'use client';

import { useState } from 'react';
import { BookOpen, Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function AdminCurriculumPage() {
  const [courses] = useState([
    {
      id: '1',
      title: 'Everyday Conversational Foundations',
      slug: 'everyday-conversational-foundations',
      level: 'BEGINNER',
      topic: 'Daily Life',
      lessonCount: 2,
      isPublished: true,
    },
    {
      id: '2',
      title: 'Travel, Airports & Socializing',
      slug: 'travel-airports-socializing',
      level: 'ELEMENTARY',
      topic: 'Travel',
      lessonCount: 1,
      isPublished: true,
    },
    {
      id: '3',
      title: 'Professional Workplace & Agile Communication',
      slug: 'professional-workplace-agile-communication',
      level: 'INTERMEDIATE',
      topic: 'Workplace',
      lessonCount: 1,
      isPublished: true,
    },
    {
      id: '4',
      title: 'Technical Presentations & System Architecture',
      slug: 'technical-presentations-system-architecture',
      level: 'UPPER_INTERMEDIATE',
      topic: 'Engineering',
      lessonCount: 1,
      isPublished: true,
    },
    {
      id: '5',
      title: 'Executive Persuasion & Strategic Debates',
      slug: 'executive-persuasion-strategic-debates',
      level: 'ADVANCED',
      topic: 'Leadership',
      lessonCount: 1,
      isPublished: true,
    },
  ]);

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Curriculum & Content Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author and publish structured courses, lessons, and practice sentences across CEFR levels.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-md">
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses or topics..."
            className="w-full bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Filter:</span>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none">
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-850/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Course Title</th>
              <th className="p-4">Level</th>
              <th className="p-4">Topic</th>
              <th className="p-4">Lessons</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-850/40 transition">
                <td className="p-4 pl-6 font-semibold text-white">
                  {course.title}
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{course.slug}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-indigo-400 border border-indigo-900/50">
                    {course.level}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-400">{course.topic}</td>
                <td className="p-4 text-xs text-slate-400">{course.lessonCount} Lessons</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Published
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="inline-flex items-center space-x-2">
                    <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

