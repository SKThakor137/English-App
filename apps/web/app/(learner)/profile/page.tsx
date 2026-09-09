'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  User,
  Settings,
  Target,
  Clock,
  Globe,
  Sparkles,
  CheckCircle2,
  Save,
  LogOut,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

export default function LearnerProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'Alex Learner',
    email: 'learner@example.com',
    nativeLanguage: 'Hindi',
    currentLevel: 'INTERMEDIATE',
    targetGoal: 'Workplace Fluency & Executive Presentations',
    dailyGoalMinutes: 20,
    planTier: 'FREE_USER',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res: any = await apiClient.get('/users/me');
        const data = res.data || res;
        if (data) {
          setProfile({
            fullName: data.profile?.fullName || 'Alex Learner',
            email: data.email || 'learner@example.com',
            nativeLanguage: data.profile?.nativeLanguage || 'Hindi',
            currentLevel: data.profile?.currentLevel || 'INTERMEDIATE',
            targetGoal: data.profile?.targetGoal || 'Workplace Fluency',
            dailyGoalMinutes: data.profile?.dailyGoalMinutes || 20,
            planTier: data.subscription?.planTier || data.role || 'FREE_USER',
          });
        }
      } catch {
        // Fallback for presentation
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiClient.patch('/users/me', {
        fullName: profile.fullName,
        nativeLanguage: profile.nativeLanguage,
        targetGoal: profile.targetGoal,
        dailyGoalMinutes: profile.dailyGoalMinutes,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account & Profile Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal learning goals, target CEFR band, and subscription entitlements.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Plan Badge Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white text-2xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
              {profile.fullName.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{profile.fullName}</h2>
            <p className="text-xs text-slate-400 mb-4">{profile.email}</p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Plan Tier</span>
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-xs font-black ${
                  profile.planTier === 'PREMIUM_USER'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {profile.planTier.replace('_', ' ')}
              </span>
            </div>

            <Link
              href="/subscription"
              className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 border border-indigo-100"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Manage Subscription & Quotas</span>
            </Link>
          </div>
        </div>

        {/* Right Col: Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
              Personalized Practice Goals
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Native Language
                </label>
                <select
                  value={profile.nativeLanguage}
                  onChange={(e) => setProfile({ ...profile, nativeLanguage: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="French">French</option>
                  <option value="Arabic">Arabic</option>
                  <option value="German">German</option>
                  <option value="Other">Other</option>
                </select>
                <span className="text-xs text-slate-400 mt-1 block">
                  Used by our acoustic engine to detect native language phonetic interference.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Daily Speaking Goal (Minutes)
                </label>
                <select
                  value={profile.dailyGoalMinutes}
                  onChange={(e) => setProfile({ ...profile, dailyGoalMinutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value={10}>10 minutes / day (Casual)</option>
                  <option value={15}>15 minutes / day (Standard)</option>
                  <option value={30}>30 minutes / day (Dedicated)</option>
                  <option value={45}>45 minutes / day (Intensive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Primary English Speaking Objective
                </label>
                <input
                  type="text"
                  value={profile.targetGoal}
                  onChange={(e) => setProfile({ ...profile, targetGoal: e.target.value })}
                  placeholder="E.g. Clear articulation in standups and technical presentations"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess && (
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Profile updated successfully!
                </div>
              )}
              {!savedSuccess && <div />}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
