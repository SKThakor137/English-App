'use client';

import React, { useState } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import {
  Sparkles,
  Volume2,
  Mic,
  Square,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

export default function StoryPracticePage() {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlayingNarrator, setIsPlayingNarrator] = useState(false);
  const [segmentEvaluated, setSegmentEvaluated] = useState(false);

  const storyData = {
    title: 'The Startup Pitch in San Francisco',
    level: 'INTERMEDIATE (B1)',
    segments: [
      {
        order: 1,
        narratorContext:
          'You arrive at a bustling tech incubator on Market Street. The venture partner welcomes you and asks about your company mission.',
        promptToSpeak:
          'Good morning. We are building an AI-powered communication platform to help engineers speak English with executive clarity.',
        targetPoints: ['Clear tone', 'Confidence in introductory greeting', 'Present continuous tense'],
      },
      {
        order: 2,
        narratorContext:
          'The investor nods thoughtfully and asks how your system differs from traditional language apps on the market.',
        promptToSpeak:
          'Unlike passive apps, our engine uses real-time acoustic phoneme analysis and word-level diffing to correct pronunciation instantly.',
        targetPoints: ['Distinction between "passive" and "acoustic"', 'Technical vocabulary', 'Smooth cadence'],
      },
      {
        order: 3,
        narratorContext:
          'Impressive. She asks what traction your team has demonstrated over the past quarter.',
        promptToSpeak:
          'Over the past three months, more than ten thousand engineers have practiced over fifty thousand sentences across five CEFR tiers.',
        targetPoints: ['Number pronunciation clarity', 'Past perfect framing', 'Rhythm'],
      },
    ],
  };

  const segment = storyData.segments[currentSegmentIndex];
  const isLastSegment = currentSegmentIndex === storyData.segments.length - 1;

  const {
    isRecording,
    duration,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handlePlayNarrator = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(segment.narratorContext);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingNarrator(true);
      utterance.onend = () => setIsPlayingNarrator(false);
      utterance.onerror = () => setIsPlayingNarrator(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
      setSegmentEvaluated(true);
    } else {
      resetRecording();
      setSegmentEvaluated(false);
      await startRecording();
    }
  };

  const handleNextSegment = () => {
    if (!isLastSegment) {
      setCurrentSegmentIndex((prev) => prev + 1);
      setSegmentEvaluated(false);
      resetRecording();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/courses"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          &larr; Back to Curriculum
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          Interactive Narrative &bull; {storyData.level}
        </span>
      </div>

      {/* Story Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>{storyData.title}</span>
          <span>Chapter {currentSegmentIndex + 1} of {storyData.segments.length}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSegmentIndex + 1) / storyData.segments.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Narrator Context Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Narrator Storyline
          </span>
          <button
            onClick={handlePlayNarrator}
            disabled={isPlayingNarrator}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingNarrator ? 'text-yellow-300 animate-pulse' : ''}`} />
            <span>{isPlayingNarrator ? 'Narrating...' : 'Listen to Narrator'}</span>
          </button>
        </div>

        <p className="text-lg text-slate-100 leading-relaxed italic font-serif">
          "{segment.narratorContext}"
        </p>

        {/* Your Character's Speaking Line */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
            Your Line to Speak:
          </span>
          <p className="text-xl font-bold text-white leading-relaxed">
            "{segment.promptToSpeak}"
          </p>
        </div>
      </div>

      {/* Recording Console */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            {isRecording ? 'Delivering your line...' : audioUrl ? 'Line Captured' : 'Ready to record dialogue'}
          </div>
          <div className="text-4xl font-mono font-black text-slate-900">
            00:{Math.floor(duration).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={handleToggleRecord}
            className={`p-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
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
                Re-take Line
              </button>
              {!isLastSegment ? (
                <button
                  onClick={handleNextSegment}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <span>Continue Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Story Complete! Return Home</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

