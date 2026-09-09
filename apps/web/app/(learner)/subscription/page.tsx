'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Mic,
  MessageSquare,
  FileText,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

interface QuotaData {
  tier: string;
  isPremium: boolean;
  dailyQuota: {
    maxSentences: number | string;
    sentencesUsed: number;
    remainingSentences: number;
    resetTimeUtc: string;
  };
  features: {
    aiConversations: string;
    pdfDocuments: string;
    acousticPronunciation: boolean;
  };
}

export default function SubscriptionPage() {
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchQuota();
  }, []);

  const fetchQuota = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/subscriptions/quota');
      setQuota(res.data || res);
    } catch (err) {
      console.error('Failed to load quota details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const res: any = await apiClient.post('/subscriptions/checkout');
      const data = res.data || res;
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('Failed to initiate checkout:', err);
      alert('Stripe checkout simulation triggered! In production, this redirects to Stripe Checkout.');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isPremium = quota?.isPremium;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title & Overview */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Subscription & Daily Quota
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 tracking-tight">
          Supercharge Your Spoken English
        </h1>
        <p className="text-gray-600 mt-3 text-base">
          Practice without limits. Get real-time acoustic phoneme analysis and unlimited AI roleplay conversations.
        </p>
      </div>

      {/* Quota Gauge Card */}
      {quota && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Today's Practice Allowance</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isPremium
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {quota.tier.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Resets daily at {quota.dailyQuota.resetTimeUtc}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gray-900">
                {quota.dailyQuota.sentencesUsed}
              </span>
              <span className="text-gray-400 font-medium"> / {quota.dailyQuota.maxSentences}</span>
              <div className="text-xs text-gray-500">Sentences Evaluated Today</div>
            </div>
          </div>

          {/* Progress Bar */}
          {!isPremium && typeof quota.dailyQuota.maxSentences === 'number' && (
            <div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (quota.dailyQuota.sentencesUsed / quota.dailyQuota.maxSentences) * 100,
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{quota.dailyQuota.remainingSentences} free sentences remaining today</span>
                <span>Limit: 20/day</span>
              </div>
            </div>
          )}

          {isPremium && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              You have Unlimited speaking evaluations unlocked as a Premium member!
            </div>
          )}
        </div>
      )}

      {/* Pricing Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Free Tier</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                Standard
              </span>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-gray-900">$0</span>
              <span className="text-gray-500 text-sm"> / forever</span>
              <p className="text-xs text-gray-500 mt-1">Core deliberate practice tools</p>
            </div>

            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>20 sentences</strong> evaluated per day</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Full CEFR A1–C1 structured curriculum</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Word-level diff matrix & accuracy scoring</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1 AI Conversation session per week</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1 PDF document conversion per month</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              disabled={!isPremium}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 bg-gray-50 cursor-default"
            >
              {!isPremium ? 'Current Active Plan' : 'Downgrade to Free'}
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-yellow-950 text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Most Popular
              </div>
              <span className="text-xs bg-white/10 text-indigo-200 px-3 py-1 rounded-full font-medium">
                Premium Pro
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$12.99</span>
                <span className="text-indigo-200 text-sm"> / month</span>
              </div>
              <p className="text-xs text-indigo-300 mt-1">Billed monthly, cancel anytime</p>
            </div>

            <ul className="space-y-3 text-sm text-indigo-100">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <span><strong className="text-white">Unlimited</strong> sentence & speech evaluations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <span><strong className="text-white">Acoustic Phoneme Engine</strong> with IPA phonetic error highlights</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <span><strong className="text-white">Unlimited</strong> AI multi-turn conversational roleplays</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <span>Up to <strong className="text-white">20 PDF documents</strong> processed per month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <span>Personalized AI weakness drills & priority speech queue</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            {isPremium ? (
              <div className="w-full py-3 px-4 rounded-xl font-bold text-center text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                You are currently Premium!
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                {upgrading ? (
                  'Redirecting to Checkout...'
                ) : (
                  <>
                    Upgrade to Premium
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

