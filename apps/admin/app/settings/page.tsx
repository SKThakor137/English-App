'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  DollarSign,
  Cpu,
  CheckCircle2,
  HardDrive,
  Save,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    speechProvider: 'whisper',
    aiModel: 'gpt-4o-mini',
    dailyBudgetCapUsd: 100,
    freeSentencesPerDay: 20,
    audioRetentionDays: 30,
    enableCircuitBreaker: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Platform Configuration & Cost Guardrails
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure third-party speech recognition providers, LLM models, cost limits, and user tier allowances.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI & Speech Provider Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            AI & Speech-to-Text Providers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Primary STT Engine
              </label>
              <select
                value={settings.speechProvider}
                onChange={(e) => setSettings({ ...settings, speechProvider: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="whisper">OpenAI Whisper (Cloud)</option>
                <option value="deepgram">Deepgram Nova-2 (Ultra-low latency)</option>
                <option value="azure">Azure Speech Pronunciation Engine</option>
                <option value="mock">Local Mock (Offline / Development)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Linguistic Feedback LLM Model
              </label>
              <select
                value={settings.aiModel}
                onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="gpt-4o-mini">OpenAI GPT-4o-mini (Recommended - Cost Efficient)</option>
                <option value="gpt-4o">OpenAI GPT-4o (High Reasoning)</option>
                <option value="groq-llama3">Groq LLaMA-3.3-70B (Fast Inference)</option>
                <option value="mock">Deterministic Rule-based Fallback</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cost & Quota Guardrails */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Cost Guardrails & User Quotas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Daily Cloud Spend Budget Cap (USD)
              </label>
              <input
                type="number"
                value={settings.dailyBudgetCapUsd}
                onChange={(e) => setSettings({ ...settings, dailyBudgetCapUsd: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs text-slate-500 mt-1 block">Circuit breaker trips if daily cost exceeds this limit.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Free Tier Daily Sentences Allowance
              </label>
              <input
                type="number"
                value={settings.freeSentencesPerDay}
                onChange={(e) => setSettings({ ...settings, freeSentencesPerDay: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs text-slate-500 mt-1 block">Resets automatically at 00:00 UTC.</span>
            </div>
          </div>
        </div>

        {/* Storage Retention */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            Object Storage (S3 / MinIO) Retention
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Audio Recording Retention Period (Days)
            </label>
            <input
              type="number"
              value={settings.audioRetentionDays}
              onChange={(e) => setSettings({ ...settings, audioRetentionDays: parseInt(e.target.value) })}
              className="w-full sm:w-1/2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-500 mt-1 block">Audio older than this threshold will be pruned by lifecycle policies.</span>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Settings successfully saved!
            </div>
          )}
          {!saved && <div />}
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
