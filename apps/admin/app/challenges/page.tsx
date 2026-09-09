'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Trophy,
  Plus,
  Sparkles,
  Flame,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react';

interface ChallengeItem {
  id: string;
  date: string;
  prompt: string;
  level: string;
  multiplier: number;
  participants: number;
  avgScore: number;
  topLearner: string;
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeItem[]>([
    {
      id: '1',
      date: '2026-09-09',
      prompt: 'Describe a challenging engineering or communication hurdle you recently overcame.',
      level: 'INTERMEDIATE',
      multiplier: 1.5,
      participants: 412,
      avgScore: 82.4,
      topLearner: 'Priya Patel (94%)',
    },
    {
      id: '2',
      date: '2026-09-10',
      prompt: 'Explain how you negotiate project priorities when faced with competing deadlines.',
      level: 'UPPER_INTERMEDIATE',
      multiplier: 2.0,
      participants: 0,
      avgScore: 0,
      topLearner: 'Scheduled',
    },
    {
      id: '3',
      date: '2026-09-11',
      prompt: 'Summarize your favorite book or podcast and why it inspired your daily habits.',
      level: 'ELEMENTARY',
      multiplier: 1.2,
      participants: 0,
      avgScore: 0,
      topLearner: 'Scheduled',
    },
  ]);

  const [form, setForm] = useState({
    date: '2026-09-12',
    prompt: '',
    level: 'INTERMEDIATE',
    multiplier: 1.5,
    sampleAnswer: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prompt.trim()) return;

    const newChallenge: ChallengeItem = {
      id: String(Date.now()),
      date: form.date,
      prompt: form.prompt,
      level: form.level,
      multiplier: form.multiplier,
      participants: 0,
      avgScore: 0,
      topLearner: 'Scheduled',
    };

    setChallenges([newChallenge, ...challenges]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setForm({
      date: '',
      prompt: '',
      level: 'INTERMEDIATE',
      multiplier: 1.5,
      sampleAnswer: '',
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Daily Speaking Challenge Scheduler
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Program community-wide speaking prompts, CEFR bands, and gamified streak multipliers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            Schedule New Daily Prompt
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Challenge Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Target CEFR Level
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="BEGINNER">BEGINNER (A1)</option>
                <option value="ELEMENTARY">ELEMENTARY (A2)</option>
                <option value="INTERMEDIATE">INTERMEDIATE (B1)</option>
                <option value="UPPER_INTERMEDIATE">UPPER INTERMEDIATE (B2)</option>
                <option value="ADVANCED">ADVANCED (C1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Points Multiplier
              </label>
              <select
                value={form.multiplier}
                onChange={(e) => setForm({ ...form, multiplier: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value={1.0}>1.0x (Standard)</option>
                <option value={1.5}>1.5x (Bonus)</option>
                <option value={2.0}>2.0x (Double Points Weekend)</option>
                <option value={3.0}>3.0x (Holiday Special)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Speaking Prompt
              </label>
              <textarea
                rows={3}
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                placeholder="E.g. What is your strategy for maintaining focus during prolonged remote work sessions?"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Model High-Scoring Response (Optional)
              </label>
              <textarea
                rows={3}
                value={form.sampleAnswer}
                onChange={(e) => setForm({ ...form, sampleAnswer: e.target.value })}
                placeholder="Demonstration answer learners can inspect after submitting..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Publish to Daily Calendar
            </button>

            {savedSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Challenge scheduled successfully!
              </div>
            )}
          </form>
        </div>

        {/* Right Table / Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>Scheduled & Past Speaking Quests</span>
              <span className="text-xs text-slate-400 font-normal">
                {challenges.length} challenges configured
              </span>
            </h2>

            <div className="space-y-4">
              {challenges.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-800 px-2.5 py-1 rounded text-slate-300">
                        {c.date}
                      </span>
                      <span className="text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                        {c.level}
                      </span>
                      <span className="text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {c.multiplier}x
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{c.participants} completed</span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-200">
                    "{c.prompt}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>
                      Avg Score: <strong className="text-emerald-400">{c.avgScore ? `${c.avgScore}%` : 'N/A'}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-yellow-400" />
                      Leader: {c.topLearner}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

