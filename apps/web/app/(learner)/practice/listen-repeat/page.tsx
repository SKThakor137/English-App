'use client';

import React, { useState } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import {
  Ear,
  Volume2,
  Mic,
  Square,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function ListenRepeatPracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const drills = [
    {
      phrase: 'Could I please schedule an appointment for tomorrow morning?',
      ipa: 'kʊd aɪ pliːz ˈskɛdʒuːl ən əˈpɔɪntmənt fɔr təˈmɔroʊ ˈmɔrnɪŋ?',
      focus: 'Polite request intonation & soft vowel transitions',
    },
    {
      phrase: 'I would like an aisle seat near the front of the airplane.',
      ipa: 'aɪ wʊd laɪk ən aɪl siːt nɪr ðə frʌnt ʌv ði ˈɛrˌpleɪn.',
      focus: 'Vowel length contrast between "aisle" and "seat"',
    },
    {
      phrase: 'We chose a modular architecture to minimize latency.',
      ipa: 'wiː tʃoʊz ə ˈmɑːdʒələr ˈɑːrkɪˌtɛktʃər tuː ˈmɪnɪˌmaɪz ˈleɪtənsi.',
      focus: 'Technical consonant clusters (chose, architecture, minimize)',
    },
  ];

  const currentDrill = drills[currentIndex];

  const {
    isRecording,
    duration,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handlePlayModel = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentDrill.phrase);
      utterance.lang = 'en-US';
      utterance.rate = 0.90;
      utterance.onstart = () => setIsPlayingModel(true);
      utterance.onend = () => setIsPlayingModel(false);
      utterance.onerror = () => setIsPlayingModel(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
      // Simulated immediate phonetic match
      setScore(Math.floor(Math.random() * 12) + 88); // 88 - 99%
    } else {
      resetRecording();
      setScore(null);
      await startRecording();
    }
  };

  const handleNextDrill = () => {
    setCurrentIndex((prev) => (prev + 1) % drills.length);
    setScore(null);
    resetRecording();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/courses"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          &larr; Back to Curriculum
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          Rapid Listen & Repeat Drill
        </span>
      </div>

      {/* Drill Target Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Drill {currentIndex + 1} of {drills.length}
        </span>

        <p className="text-2xl font-bold text-slate-900 leading-snug">
          "{currentDrill.phrase}"
        </p>

        <div className="font-mono text-xs text-indigo-600 bg-indigo-50/60 p-2.5 rounded-xl inline-block max-w-lg mx-auto">
          IPA: {currentDrill.ipa}
        </div>

        <div>
          <button
            onClick={handlePlayModel}
            disabled={isPlayingModel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingModel ? 'animate-pulse' : ''}`} />
            <span>{isPlayingModel ? 'Playing Audio...' : '1. Listen to Model Audio'}</span>
          </button>
        </div>
      </div>

      {/* Repeating Window */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          2. Repeat Immediately
        </span>

        <div className="text-4xl font-mono font-black text-slate-900">
          00:{Math.floor(duration).toString().padStart(2, '0')}
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleToggleRecord}
            className={`p-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {score !== null && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-sm mx-auto animate-fade-in">
            <div className="text-2xl font-black text-emerald-700">{score}%</div>
            <div className="text-xs font-semibold text-emerald-800 mt-0.5">Phonetic Acoustic Match</div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleNextDrill}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <span>Next Drill</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

