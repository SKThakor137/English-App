'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Zap,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Flame,
  Award,
} from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: 'FREE_USER' | 'PREMIUM_USER' | 'ADMIN';
  currentLevel: string;
  streak: number;
  totalAttempts: number;
  sentencesUsedToday: number;
  joinedDate: string;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'usr_1',
      email: 'priya.patel@example.com',
      name: 'Priya Patel',
      role: 'PREMIUM_USER',
      currentLevel: 'INTERMEDIATE',
      streak: 12,
      totalAttempts: 342,
      sentencesUsedToday: 24,
      joinedDate: '2026-08-15',
    },
    {
      id: 'usr_2',
      email: 'carlos.rodriguez@example.com',
      name: 'Carlos Rodriguez',
      role: 'FREE_USER',
      currentLevel: 'ELEMENTARY',
      streak: 4,
      totalAttempts: 88,
      sentencesUsedToday: 18,
      joinedDate: '2026-08-28',
    },
    {
      id: 'usr_3',
      email: 'akiko.tanaka@example.com',
      name: 'Akiko Tanaka',
      role: 'PREMIUM_USER',
      currentLevel: 'UPPER_INTERMEDIATE',
      streak: 21,
      totalAttempts: 512,
      sentencesUsedToday: 35,
      joinedDate: '2026-07-10',
    },
    {
      id: 'usr_4',
      email: 'admin@englishfluency.com',
      name: 'System Administrator',
      role: 'ADMIN',
      currentLevel: 'ADVANCED',
      streak: 45,
      totalAttempts: 120,
      sentencesUsedToday: 5,
      joinedDate: '2026-01-01',
    },
  ]);

  const handleToggleTier = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === 'PREMIUM_USER' ? 'FREE_USER' : 'PREMIUM_USER';
          return { ...u, role: nextRole };
        }
        return u;
      }),
    );
  };

  const handleResetQuota = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, sentencesUsedToday: 0 } : u)),
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            User Management & Quota Overrides
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search registered learners, adjust subscription tiers, and override daily speaking allowances.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="FREE_USER">Free Tier</option>
            <option value="PREMIUM_USER">Premium Tier</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Learner</th>
                <th className="px-6 py-4">Plan Tier</th>
                <th className="px-6 py-4">CEFR Level</th>
                <th className="px-6 py-4">Active Streak</th>
                <th className="px-6 py-4">Today's Usage</th>
                <th className="px-6 py-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-slate-500 text-xs">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.role === 'PREMIUM_USER'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : u.role === 'ADMIN'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-200">
                    {u.currentLevel}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-orange-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-orange-400" />
                      <span>{u.streak} days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold text-white">{u.sentencesUsedToday}</span>
                      <span className="text-slate-500"> / {u.role === 'PREMIUM_USER' ? '∞' : '20'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleTier(u.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
                    >
                      Toggle Tier
                    </button>
                    <button
                      onClick={() => handleResetQuota(u.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
                    >
                      Reset Quota
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
