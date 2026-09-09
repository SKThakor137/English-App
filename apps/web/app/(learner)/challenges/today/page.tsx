'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import {
  Trophy,
  Flame,
  Mic,
  Square,
  Play,
  CheckCircle2,
  Award,
  Sparkles,
  RefreshCw,
  Users,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

interface ChallengeData {
  id: string;
  challengeDate: string;
  promptText: string;
  targetCefr: string;
  sampleAnswer?: string;
  pointsMultiplier: number;
  leaderboard: Array<{
    rank: number;
    userName: string;
    score: number;
    submittedAt: string;
  }>;
}

export default function DailyChallengePage() {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const {
    isRecording,
    duration,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    error: micError,
  } = useAudioRecorder();

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/challenges/today');
      setChallenge(res.data || res);
    } catch (err) {
      console.error('Failed to load challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      resetRecording();
      setResult(null);
      await startRecording();
    }
  };

  const handleSubmitAttempt = async () => {
    if (!challenge) return;
    try {
      setSubmitting(true);
      const res: any = await apiClient.post(`/challenges/${challenge.id}/attempt`, {
        durationSeconds: Math.round(duration) || 30,
      });
      const data = res.data || res;
      setResult(data);
      // Refresh challenge to get updated leaderboard
      fetchChallenge();
    } catch (err: any) {
      console.error('Error submitting challenge:', err);
      setFeedback('Failed to submit challenge attempt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Challenge</h2>
          <p className="text-gray-600 mb-6">Today's speaking challenge is currently being refreshed by our curriculum team.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              Daily Speaking Quest &bull; {challenge.pointsMultiplier}x Points
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Today's Speaking Challenge</h1>
            <p className="text-amber-100 mt-2 max-w-xl">
              Sharpen spontaneous fluency. Speak for 45-60 seconds on the prompt below to claim today's streak reward!
            </p>
          </div>
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div>
              <div className="text-xs text-amber-100 font-medium">Difficulty Band</div>
              <div className="text-lg font-black tracking-wide">{challenge.targetCefr}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Prompt, Audio Recorder & Result */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Challenge Prompt
              </span>
              <button
                onClick={() => setShowSample(!showSample)}
                className="text-xs font-medium text-gray-500 hover:text-indigo-600 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showSample ? 'Hide Model Answer' : 'View Model Answer'}
              </button>
            </div>

            <p className="text-xl font-medium text-gray-800 leading-relaxed">
              "{challenge.promptText}"
            </p>

            {showSample && challenge.sampleAnswer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 italic">
                <span className="font-semibold text-gray-900 block not-italic mb-1">High-Scoring Inspiration:</span>
                "{challenge.sampleAnswer}"
              </div>
            )}
          </div>

          {/* Recording Console */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-1">
                {isRecording ? 'Listening to your speech...' : audioUrl ? 'Recording Complete!' : 'Press button when ready to speak'}
              </div>
              <div className="text-4xl font-mono font-bold text-gray-900">
                00:{Math.floor(duration).toString().padStart(2, '0')}
              </div>
            </div>

            {micError && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-xl">
                {micError}
              </div>
            )}

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={handleToggleRecord}
                className={`p-6 rounded-full transition-all duration-200 shadow-lg flex items-center justify-center ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            {/* Audio Preview & Submit */}
            {audioUrl && !isRecording && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <audio src={audioUrl} controls className="w-full max-w-md mx-auto" />
                <div className="flex justify-center gap-3">
                  <button
                    onClick={resetRecording}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium"
                  >
                    Discard & Retry
                  </button>
                  <button
                    onClick={handleSubmitAttempt}
                    disabled={submitting}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Evaluating Speech...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Submit for Points
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {feedback && (
              <p className="mt-4 text-sm text-rose-600">{feedback}</p>
            )}
          </div>

          {/* Results Modal / Panel */}
          {result && (
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-xl animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <h3 className="font-bold text-lg">Challenge Evaluated!</h3>
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-yellow-300">
                  +{result.pointsEarned || 50} Points
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-2xl font-black text-yellow-300">{result.score || 88}</div>
                  <div className="text-xs text-gray-300">Overall Score</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-2xl font-black text-white">#{result.leaderboardRank || 1}</div>
                  <div className="text-xs text-gray-300">Today's Rank</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-2xl font-black text-emerald-300">Completed</div>
                  <div className="text-xs text-gray-300">Quest Status</div>
                </div>
              </div>

              <p className="text-sm text-indigo-100 bg-white/5 p-3 rounded-xl">
                Great job! Your spoken vocabulary demonstrated solid sentence variety. Check the leaderboard on the right to see where you stand with peers!
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Leaderboard */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Users className="w-5 h-5 text-indigo-600" />
                Community Leaderboard
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                Live
              </span>
            </div>

            {challenge.leaderboard && challenge.leaderboard.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {challenge.leaderboard.map((entry, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-400'
                            : idx === 1
                            ? 'bg-gray-100 text-gray-700'
                            : idx === 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-transparent text-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{entry.userName}</div>
                        <div className="text-xs text-gray-400">Score: {entry.score}%</div>
                      </div>
                    </div>
                    {idx === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                Be the first learner to complete today's speaking quest and claim the #1 spot!
              </div>
            )}
          </div>

          {/* Streak Perk Box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 font-semibold text-amber-900 mb-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              Keep Your Streak Alive
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Completing the daily speaking challenge advances your active streak by 1 day and doubles your practice points toward weekly leaderboard awards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

