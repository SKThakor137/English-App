'use client';

import React, { useState } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import {
  Mic,
  Square,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';

export default function FreeSpeakingPracticePage() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const prompts = [
    {
      topic: 'Workplace Decision Making',
      prompt: 'Describe a situation where you had to make an important decision with incomplete information. What was your thought process, and what was the outcome?',
      suggestedKeywords: ['Analyzed tradeoffs', 'Mitigated risk', 'Collaborated with stakeholders', 'Retrospective'],
    },
    {
      topic: 'Technology & Remote Culture',
      prompt: 'How has remote work transformed software engineering practices and team collaboration over recent years?',
      suggestedKeywords: ['Asynchronous communication', 'Documentation culture', 'Continuous integration', 'Autonomy'],
    },
    {
      topic: 'Personal Overcoming',
      prompt: 'Talk about a skill that was difficult for you to master. How did deliberate practice help you succeed?',
      suggestedKeywords: ['Consistent habit', 'Feedback loops', 'Perseverance', 'Breakthrough'],
    },
  ];

  const currentPrompt = prompts[promptIndex];

  const {
    isRecording,
    duration,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleToggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      resetRecording();
      setResult(null);
      await startRecording();
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    // Simulate deep linguistic analysis
    setTimeout(() => {
      setResult({
        overallFluencyScore: 89,
        lexicalVarietyScore: 92,
        grammaticalAccuracyScore: 86,
        wordsPerMinute: 128,
        fillerWordsCount: 2,
        fillerWordsList: ['like', 'actually'],
        coherenceFeedback:
          'Excellent logical transitions. You introduced your premise clearly and supported your conclusions with concrete examples.',
        vocabularyHighlights: ['mitigated risk', 'architectural tradeoff', 'deliberate practice'],
      });
      setIsEvaluating(false);
    }, 1500);
  };

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % prompts.length);
    setResult(null);
    resetRecording();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
          60-Second Unscripted Free Speaking Drill
        </span>
      </div>

      {/* Prompt Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Topic: {currentPrompt.topic}
          </span>
          <button
            onClick={handleNextPrompt}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600"
          >
            Change Prompt
          </button>
        </div>

        <p className="text-xl font-medium text-slate-800 leading-relaxed">
          "{currentPrompt.prompt}"
        </p>

        {/* Suggested Keywords Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Suggested High-Scoring Collocations:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentPrompt.suggestedKeywords.map((kw, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recording Console */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            {isRecording ? 'Speak freely for 45 to 60 seconds...' : audioUrl ? 'Speech Recording Complete' : 'Press to start unscripted monologue'}
          </div>
          <div className="text-5xl font-mono font-black text-slate-900">
            00:{Math.floor(duration).toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-400 mt-2">Target duration: 45 – 60s</div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={handleToggleRecord}
            className={`p-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-rose-500 hover:bg-rose-600 text-white'
            }`}
          >
            {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {audioUrl && !isRecording && (
          <div className="space-y-4 pt-4 border-t border-slate-100 max-w-md mx-auto">
            <audio src={audioUrl} controls className="w-full" />
            <div className="flex justify-center gap-3">
              <button
                onClick={resetRecording}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-semibold"
              >
                Discard & Retry
              </button>
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Evaluating Monologue...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Evaluate Speech & Grammar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Free Speaking Detailed Evaluation */}
      {result && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-300" />
              <h2 className="text-lg font-bold">Unscripted Speaking Scorecard</h2>
            </div>
            <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-bold">
              CEFR B2+ Fluency
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800 p-4 rounded-2xl">
              <div className="text-2xl font-black text-yellow-300">{result.overallFluencyScore}%</div>
              <div className="text-xs text-slate-400 mt-1">Overall Fluency</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl">
              <div className="text-2xl font-black text-emerald-300">{result.lexicalVarietyScore}%</div>
              <div className="text-xs text-slate-400 mt-1">Lexical Variety</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl">
              <div className="text-2xl font-black text-indigo-300">{result.wordsPerMinute}</div>
              <div className="text-xs text-slate-400 mt-1">Speaking WPM</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl">
              <div className="text-2xl font-black text-amber-300">{result.fillerWordsCount}</div>
              <div className="text-xs text-slate-400 mt-1">Filler Words</div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs leading-relaxed text-slate-200">
              <strong className="text-white block mb-1">Coherence & Argument Structure:</strong>
              {result.coherenceFeedback}
            </div>

            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Filler Word Reductions:
              </div>
              <p className="text-slate-300">
                You used filler words ({result.fillerWordsList.join(', ')}) {result.fillerWordsCount} times. Try substituting brief 1-second silent pauses instead of filler vocalizations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

