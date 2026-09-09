'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  BookOpen,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
} from 'lucide-react';

export default function VocabularyDeckPage() {
  const [words, setWords] = useState<any[]>([]);
  const [dueReviews, setDueReviews] = useState<any[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allRes, dueRes]: any = await Promise.all([
          apiClient.get('/vocabulary'),
          apiClient.get('/vocabulary/due'),
        ]);
        if (allRes?.data) setWords(allRes.data);
        if (dueRes?.data) setDueReviews(dueRes.data);
      } catch {
        // Fallback sample cards
        const sampleWords = [
          {
            id: 'v1',
            word: {
              word: 'exhausted',
              ipaUs: 'ɪɡˈzɔːstɪd',
              definition: 'Extremely tired or depleted of energy.',
              exampleSentence: 'I was exhausted after the late-night architecture deployment.',
              cefrLevel: 'INTERMEDIATE',
            },
            intervalDays: 3,
            repetitions: 2,
            masteryPercentage: 60,
          },
          {
            id: 'v2',
            word: {
              word: 'intricacy',
              ipaUs: 'ˈɪntrɪkəsi',
              definition: 'The quality of being very detailed, complicated, or complex.',
              exampleSentence: 'He explained the intricacies of distributed cache invalidation.',
              cefrLevel: 'UPPER_INTERMEDIATE',
            },
            intervalDays: 1,
            repetitions: 0,
            masteryPercentage: 20,
          },
          {
            id: 'v3',
            word: {
              word: 'articulate',
              ipaUs: 'ɑːrˈtɪkjuleɪt',
              definition: 'Having or showing the ability to speak fluently and coherently.',
              exampleSentence: 'She was able to articulate the business requirements with clarity.',
              cefrLevel: 'ADVANCED',
            },
            intervalDays: 6,
            repetitions: 3,
            masteryPercentage: 80,
          },
        ];
        setWords(sampleWords);
        setDueReviews(sampleWords);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleReviewGrade = async (grade: number) => {
    const activeItem = dueReviews[activeCardIndex];
    if (!activeItem) return;

    try {
      await apiClient.post(`/vocabulary/${activeItem.id}/review`, { grade });
    } catch {
      // offline resilience
    }

    setIsFlipped(false);
    if (activeCardIndex < dueReviews.length - 1) {
      setActiveCardIndex((prev) => prev + 1);
    } else {
      // Finished all due cards
      setDueReviews([]);
    }
  };

  const playAudio = (wordText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(wordText);
      u.lang = 'en-US';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const currentCard = dueReviews[activeCardIndex];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Vocabulary & Spaced Repetition (SM-2)
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Reinforce words encountered in your speaking practice using the proven SuperMemo SM-2 memory retention algorithm.
        </p>
      </div>

      {/* Flashcard Review Section */}
      {currentCard ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>DUE FLASHCARDS TODAY</span>
            <span>Card {activeCardIndex + 1} of {dueReviews.length}</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer transition hover:border-brand-500 relative"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute top-6 right-6">
              Tap Card to Flip
            </span>

            {!isFlipped ? (
              <div className="space-y-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {currentCard.word.word}
                </div>
                {currentCard.word.ipaUs && (
                  <div className="text-sm font-mono text-slate-500">
                    /{currentCard.word.ipaUs}/
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentCard.word.word);
                  }}
                  className="mt-4 p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition inline-flex items-center space-x-1.5 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                  {currentCard.word.cefrLevel || 'INTERMEDIATE'}
                </span>
                <div className="text-base sm:text-lg font-bold text-slate-800">
                  {currentCard.word.definition}
                </div>
                {currentCard.word.exampleSentence && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    &ldquo;{currentCard.word.exampleSentence}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SM-2 Recall Rating Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                onClick={() => handleReviewGrade(1)}
                className="py-3 px-4 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition"
              >
                Again (1)
                <span className="block text-[10px] font-normal text-rose-500">Reset</span>
              </button>
              <button
                onClick={() => handleReviewGrade(2)}
                className="py-3 px-4 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold text-xs transition"
              >
                Hard (2)
                <span className="block text-[10px] font-normal text-amber-500">Short Interval</span>
              </button>
              <button
                onClick={() => handleReviewGrade(3)}
                className="py-3 px-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs transition"
              >
                Good (3)
                <span className="block text-[10px] font-normal text-blue-500">Standard</span>
              </button>
              <button
                onClick={() => handleReviewGrade(4)}
                className="py-3 px-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs transition"
              >
                Easy (4)
                <span className="block text-[10px] font-normal text-emerald-500">Long Interval</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">You are all caught up!</h3>
          <p className="text-xs text-slate-600">
            No vocabulary flashcards due for review right now. Keep practicing sentences to discover new words!
          </p>
        </div>
      )}

      {/* Vocabulary List Table */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900">Your Personal Dictionary</h2>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {words.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{item.word.word}</span>
                  {item.word.ipaUs && (
                    <span className="text-xs font-mono text-slate-400">/{item.word.ipaUs}/</span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.word.cefrLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 max-w-xl line-clamp-1">
                  {item.word.definition}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-brand-600">{item.masteryPercentage || 0}%</span>
                  <span className="text-[10px] block text-slate-400">Mastery</span>
                </div>
                <button
                  onClick={() => playAudio(item.word.word)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

