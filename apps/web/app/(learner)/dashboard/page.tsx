'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import {
  Flame,
  Target,
  Mic,
  MessageSquare,
  BookOpen,
  FileText,
  Sparkles,
  Trophy,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res: any = await apiClient.get('/users/dashboard');
        if (res?.data) {
          setDashboard(res.data);
        }
      } catch {
        // Mock fallback for presentation
        setDashboard({
          user: { fullName: 'Learner', currentLevel: 'INTERMEDIATE', planTier: 'FREE_USER' },
          streak: { current: 3, longest: 7, freezeCredits: 1 },
          todayGoal: { targetMinutes: 15, practicedMinutes: 12, goalPercentage: 80, sentencesPracticed: 8, wordsSpoken: 142 },
          quota: { isPremium: false, remainingSentences: 12, maxDaily: 20 },
          dailyChallenge: { id: 'mock', topic: 'Describe your favorite weekend routine in 60 seconds' },
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const data = dashboard || {
    user: { fullName: 'Learner', currentLevel: 'INTERMEDIATE' },
    streak: { current: 3, longest: 7 },
    todayGoal: { targetMinutes: 15, practicedMinutes: 12, goalPercentage: 80 },
    quota: { remainingSentences: 12 },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-100">
              E
            </div>
            <span className="font-bold text-lg text-slate-900">EnglishFluency</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/progress"
              className="text-xs font-semibold text-slate-600 hover:text-brand-600 hidden sm:block"
            >
              Analytics
            </Link>
            <Link
              href="/subscription"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Upgrade</span>
            </Link>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{data.streak?.current || 0} Day Streak</span>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {data.user?.currentLevel || 'INTERMEDIATE'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-brand-200">Welcome Back</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Ready to speak, {data.user?.fullName || 'Learner'}?
            </h1>
            <p className="mt-1 text-sm text-brand-100 max-w-lg">
              You are {data.todayGoal?.goalPercentage || 0}% toward your daily speaking goal. 3 more minutes to keep your streak!
            </p>
          </div>
          <Link
            href="/practice/sentence/starter"
            className="px-6 py-3 bg-white text-brand-700 hover:bg-brand-50 rounded-xl font-bold text-sm shadow-md transition flex items-center space-x-2 flex-shrink-0"
          >
            <Mic className="w-4 h-4 text-brand-600" />
            <span>Continue Practice</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Today&apos;s Goal</span>
              <Target className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {data.todayGoal?.practicedMinutes || 0} / {data.todayGoal?.targetMinutes || 15} <span className="text-xs font-normal text-slate-500">min</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, data.todayGoal?.goalPercentage || 0)}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Current Streak</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {data.streak?.current || 0} <span className="text-xs font-normal text-slate-500">days</span>
            </div>
            <div className="text-xs text-slate-500 mt-3">
              Longest: {data.streak?.longest || 0} days
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Words Spoken</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {data.todayGoal?.wordsSpoken || 142}
            </div>
            <div className="text-xs text-slate-500 mt-3">
              {data.todayGoal?.sentencesPracticed || 8} sentences completed
            </div>
          </div>

          <Link
            href="/subscription"
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-sm transition block"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Daily AI Quota</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {data.quota?.remainingSentences !== undefined ? data.quota.remainingSentences : 12}
            </div>
            <div className="text-xs text-indigo-600 font-medium mt-3 flex items-center justify-between">
              <span>Sentences remaining today</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Practice Modes Hub */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Choose Your Practice Mode</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/practice/sentence/starter"
              className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Sentence Practice</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Listen to native model audio, record your voice, and get instant word diffs.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-brand-600 space-x-1">
                <span>Start Drill</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/conversations"
              className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">AI Voice Conversation</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Roleplay real-world workplace standups, job interviews, and hotel check-ins.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 space-x-1">
                <span>Enter Scenario</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/documents"
              className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Document & PDF Drills</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your own workplace PDFs or study material to generate personalized practice.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-amber-600 space-x-1">
                <span>Upload PDF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/vocabulary"
              className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Vocabulary SRS Deck</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Review saved words using the SuperMemo SM-2 spaced repetition algorithm.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-purple-600 space-x-1">
                <span>Review Deck</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Daily Speaking Challenge Section */}
        {data.dailyChallenge && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-200">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Today&apos;s Challenge</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {data.dailyChallenge.topic}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Speak for 60 seconds. Compete on today&apos;s accuracy & fluency leaderboard!
                </p>
              </div>
            </div>
            <Link
              href="/challenges/today"
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition flex-shrink-0"
            >
              Accept Challenge
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

