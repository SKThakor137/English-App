'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  Plus,
  Search,
  Filter,
  Volume2,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface SentenceItem {
  id: string;
  targetText: string;
  ipaTranscription: string;
  grammarFocus: string;
  level: string;
  courseTitle: string;
}

export default function AdminSentencesPage() {
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [sentences, setSentences] = useState<SentenceItem[]>([
    {
      id: 's1',
      targetText: 'Hello, my name is Priya and I am pleased to meet you.',
      ipaTranscription: 'həˈloʊ, maɪ neɪm ɪz ˈpriːjə ænd aɪ æm pliːzd tu miːt juː.',
      grammarFocus: 'Present Simple (to be)',
      level: 'BEGINNER',
      courseTitle: 'Everyday Conversational Foundations',
    },
    {
      id: 's2',
      targetText: 'Where are you from, and how long have you lived here?',
      ipaTranscription: 'wɛr ɑr ju frʌm, ænd haʊ lɔŋ hæv ju lɪvd hɪr?',
      grammarFocus: 'Present Perfect & Questions',
      level: 'BEGINNER',
      courseTitle: 'Everyday Conversational Foundations',
    },
    {
      id: 's3',
      targetText: 'I would like an aisle seat near the front of the airplane if possible.',
      ipaTranscription: 'aɪ wʊd laɪk ən aɪl siːt nɪr ðə frʌnt ʌv ði ˈɛrˌpleɪn...',
      grammarFocus: 'Conditional & Preferences',
      level: 'ELEMENTARY',
      courseTitle: 'Travel, Airports & Socializing',
    },
    {
      id: 's4',
      targetText: 'Yesterday I finished implementing the authentication endpoints and wrote unit tests.',
      ipaTranscription: 'ˈjɛstərˌdeɪ aɪ ˈfɪnɪʃt ˈɪmpləmɛntɪŋ ði ɔːˌθɛntɪˈkeɪʃən ˈɛndˌpɔɪnts...',
      grammarFocus: 'Past Simple & Irregular Verbs',
      level: 'INTERMEDIATE',
      courseTitle: 'Professional Workplace & Agile Communication',
    },
    {
      id: 's5',
      targetText: 'We chose a modular monolith to avoid distributed network latency while retaining strict module boundaries.',
      ipaTranscription: 'wiː tʃoʊz ə ˈmɑːdʒələr ˈmɑːnəlɪθ tuː əˈvɔɪd dɪˈstrɪbjutɪd...',
      grammarFocus: 'Infinitives of Purpose & Complex Reasoning',
      level: 'UPPER_INTERMEDIATE',
      courseTitle: 'Technical Presentations & System Architecture',
    },
    {
      id: 's6',
      targetText: 'While I acknowledge your perspective regarding timelines, compromising on security guarantees would jeopardize our compliance posture.',
      ipaTranscription: 'waɪl aɪ ækˈnɑːlɪdʒ jɔr pərˈspɛktɪv rɪˈɡɑrdɪŋ ˈtaɪmˌlaɪnz...',
      grammarFocus: 'Concessive Clauses & Diplomatic Phrasing',
      level: 'ADVANCED',
      courseTitle: 'Executive Persuasion & Strategic Debates',
    },
  ]);

  const [newSentence, setNewSentence] = useState({
    targetText: '',
    ipaTranscription: '',
    grammarFocus: '',
    level: 'INTERMEDIATE',
    courseTitle: 'Professional Workplace & Agile Communication',
  });

  const handleAddSentence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSentence.targetText.trim()) return;

    setSentences([
      { ...newSentence, id: `s_${Date.now()}` },
      ...sentences,
    ]);
    setShowAddModal(false);
    setNewSentence({
      targetText: '',
      ipaTranscription: '',
      grammarFocus: '',
      level: 'INTERMEDIATE',
      courseTitle: 'Professional Workplace & Agile Communication',
    });
  };

  const handleDelete = (id: string) => {
    setSentences((prev) => prev.filter((s) => s.id !== id));
  };

  const handlePlayTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  const filtered = sentences.filter((s) => {
    const matchesLevel = levelFilter === 'ALL' || s.level === levelFilter;
    const matchesSearch =
      s.targetText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.grammarFocus.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Curriculum Sentence Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author phonetic ground truths, International Phonetic Alphabet (IPA) transcriptions, and grammatical rules.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practice Sentence</span>
        </button>
      </div>

      {/* Curriculum Sub-navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        <Link
          href="/curriculum"
          className="pb-3 text-sm font-medium text-slate-400 hover:text-white transition flex items-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses & Lessons</span>
        </Link>
        <Link
          href="/curriculum/sentences"
          className="pb-3 text-sm font-bold text-indigo-400 border-b-2 border-indigo-500 flex items-center space-x-2"
        >
          <Mic className="w-4 h-4" />
          <span>Sentence & IPA Library</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search target text or grammar rule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All CEFR Levels</option>
            <option value="BEGINNER">A1 Beginner</option>
            <option value="ELEMENTARY">A2 Elementary</option>
            <option value="INTERMEDIATE">B1 Intermediate</option>
            <option value="UPPER_INTERMEDIATE">B2 Upper Intermediate</option>
            <option value="ADVANCED">C1 Advanced</option>
          </select>
        </div>
      </div>

      {/* Sentences List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Target Spoken Sentence</th>
                <th className="px-6 py-4">IPA Transcription</th>
                <th className="px-6 py-4">Grammar Focus</th>
                <th className="px-6 py-4">CEFR Band</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850/50 transition">
                  <td className="px-6 py-4 max-w-sm">
                    <div className="font-bold text-white leading-relaxed">{s.targetText}</div>
                    <div className="text-slate-500 text-xs mt-1">{s.courseTitle}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-indigo-300 text-xs max-w-xs">
                    {s.ipaTranscription}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 px-2 py-1 rounded text-slate-200">
                      {s.grammarFocus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {s.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handlePlayTTS(s.targetText)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                      title="Test Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Add New Practice Sentence</h2>

            <form onSubmit={handleAddSentence} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Target English Text
                </label>
                <textarea
                  rows={2}
                  value={newSentence.targetText}
                  onChange={(e) => setNewSentence({ ...newSentence, targetText: e.target.value })}
                  placeholder="E.g. We scheduled a follow-up review for Monday."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  IPA Phonemic Ground Truth
                </label>
                <input
                  type="text"
                  value={newSentence.ipaTranscription}
                  onChange={(e) => setNewSentence({ ...newSentence, ipaTranscription: e.target.value })}
                  placeholder="wiː ˈskɛdʒuːld ə ˈfɑːloʊˌʌp..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Grammar Focus
                </label>
                <input
                  type="text"
                  value={newSentence.grammarFocus}
                  onChange={(e) => setNewSentence({ ...newSentence, grammarFocus: e.target.value })}
                  placeholder="Past Simple & Prepositional Phrases"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Target CEFR Band
                </label>
                <select
                  value={newSentence.level}
                  onChange={(e) => setNewSentence({ ...newSentence, level: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="BEGINNER">A1 Beginner</option>
                  <option value="ELEMENTARY">A2 Elementary</option>
                  <option value="INTERMEDIATE">B1 Intermediate</option>
                  <option value="UPPER_INTERMEDIATE">B2 Upper Intermediate</option>
                  <option value="ADVANCED">C1 Advanced</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Save Sentence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
