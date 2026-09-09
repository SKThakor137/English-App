'use client';

import { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';

export interface PhonemeItem {
  phoneme: string;
  ipa: string;
  score: number;
}

export interface WordPhonemeData {
  word: string;
  accuracyScore: number;
  phonemes: PhonemeItem[];
}

interface PhonemeVisualizerProps {
  words: WordPhonemeData[];
}

export function PhonemeVisualizer({ words }: PhonemeVisualizerProps) {
  const [selectedWord, setSelectedWord] = useState<WordPhonemeData | null>(words[0] || null);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (score >= 70) return 'bg-amber-50 text-amber-700 border-amber-300';
    return 'bg-rose-50 text-rose-700 border-rose-300';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-100';
    if (score >= 70) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-sm text-slate-900">Acoustic Phoneme Breakdown</h3>
        </div>
        <span className="text-xs text-slate-400">Click any word to inspect phonetic sounds</span>
      </div>

      {/* Word Pills Bar */}
      <div className="flex flex-wrap gap-2">
        {words.map((w, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWord(w)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
              selectedWord?.word === w.word
                ? 'border-brand-600 bg-brand-50 text-brand-800 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
            }`}
          >
            <span>{w.word}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${getScoreBadge(w.accuracyScore)}`}>
              {w.accuracyScore}%
            </span>
          </button>
        ))}
      </div>

      {/* Selected Word Phoneme Inspector */}
      {selectedWord && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Word Analysis
              </span>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {selectedWord.word}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Pronunciation
              </span>
              <div className="text-lg font-extrabold text-brand-600">
                {selectedWord.accuracyScore}%
              </div>
            </div>
          </div>

          {/* Phoneme IPA Sequence */}
          <div>
            <span className="text-xs font-bold text-slate-500 mb-2 block">
              Individual IPA Phonemes:
            </span>
            <div className="flex flex-wrap gap-3">
              {selectedWord.phonemes?.map((p, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-center min-w-[56px] shadow-sm ${getScoreColor(p.score)}`}
                >
                  <div className="text-base font-extrabold font-mono">/{p.ipa}/</div>
                  <div className="text-[10px] font-bold mt-1 uppercase tracking-wider">{p.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

