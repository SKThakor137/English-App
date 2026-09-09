'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Check, ArrowRight, Sparkles, Target, Clock, Award, Loader2 } from 'lucide-react';

const LEVELS = [
  { id: 'BEGINNER', label: 'Beginner (A1)', desc: 'Basic greetings and simple everyday phrases' },
  { id: 'ELEMENTARY', label: 'Elementary (A2)', desc: 'Can communicate in routine tasks and familiar topics' },
  { id: 'INTERMEDIATE', label: 'Intermediate (B1)', desc: 'Can express opinions, experiences, and conversational flows' },
  { id: 'UPPER_INTERMEDIATE', label: 'Upper Intermediate (B2)', desc: 'Fluent in technical, professional, and abstract discussions' },
  { id: 'ADVANCED', label: 'Advanced (C1)', desc: 'Near-native fluency with complex expressions and idioms' },
];

const GOALS = [
  'Speak Confidently without Hesitation',
  'Improve Pronunciation & Accent Intelligibility',
  'Workplace Meetings & Tech Standups',
  'Job Interview Preparation',
  'Grammar & Sentence Formation',
  'IELTS / TOEFL Speaking Exam',
];

const DURATIONS = [5, 10, 15, 30];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState('INTERMEDIATE');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Speak Confidently without Hesitation']);
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== goal));
      }
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await apiClient.post('/users/onboarding', {
        level: selectedLevel,
        goals: selectedGoals,
        dailyGoalMinutes: selectedMinutes,
      });
      router.push('/dashboard');
    } catch {
      // Fallback redirect even if offline
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-10 bg-brand-600'
                    : i < step
                    ? 'w-6 bg-brand-200'
                    : 'w-6 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Step {step} of 3
          </span>
        </div>

        {/* Step 1: Level */}
        {step === 1 && (
          <div>
            <div className="flex items-center space-x-2 text-brand-600 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Current Level</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">What is your English level?</h2>
            <p className="mt-1 text-sm text-slate-500">
              We customize your sentences, stories, and AI conversations to this level.
            </p>

            <div className="mt-6 space-y-3">
              {LEVELS.map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    selectedLevel === lvl.id
                      ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{lvl.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{lvl.desc}</div>
                  </div>
                  {selectedLevel === lvl.id && (
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-100 flex items-center justify-center space-x-2 transition"
            >
              <span>Continue to Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Learning Purpose</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">What are your main goals?</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select one or more areas you want to prioritize in your speaking practice.
            </p>

            <div className="mt-6 space-y-3">
              {GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <div
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-800">{goal}</span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center space-x-3">
              <button
                onClick={() => setStep(1)}
                className="py-3.5 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 transition"
              >
                <span>Continue to Daily Commitment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Daily Target */}
        {step === 3 && (
          <div>
            <div className="flex items-center space-x-2 text-amber-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Habit Building</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Daily practice commitment</h2>
            <p className="mt-1 text-sm text-slate-500">
              Consistency is key to fluency. Just 15 minutes a day builds lasting muscle memory.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {DURATIONS.map((mins) => (
                <div
                  key={mins}
                  onClick={() => setSelectedMinutes(mins)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer text-center transition ${
                    selectedMinutes === mins
                      ? 'border-brand-600 bg-brand-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl font-extrabold text-slate-900">{mins}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">Min / Day</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center space-x-3">
              <button
                onClick={() => setStep(2)}
                className="py-3.5 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-100 flex items-center justify-center space-x-2 transition disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Finish Setup & Start Speaking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

