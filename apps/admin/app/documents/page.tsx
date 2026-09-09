'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  RotateCw,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface DocumentRecord {
  id: string;
  title: string;
  userEmail: string;
  cefrLevel: string;
  sentenceCount: number;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  uploadedAt: string;
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([
    {
      id: 'doc_1',
      title: 'Distributed Systems & Microservices Patterns.pdf',
      userEmail: 'priya.patel@example.com',
      cefrLevel: 'UPPER_INTERMEDIATE',
      sentenceCount: 48,
      status: 'COMPLETED',
      uploadedAt: '2026-09-08 14:22',
    },
    {
      id: 'doc_2',
      title: 'ESL Everyday Conversational Handbook.pdf',
      userEmail: 'carlos.rodriguez@example.com',
      cefrLevel: 'BEGINNER',
      sentenceCount: 65,
      status: 'COMPLETED',
      uploadedAt: '2026-09-07 09:10',
    },
    {
      id: 'doc_3',
      title: 'IELTS Academic Speaking Part 2 Guide.pdf',
      userEmail: 'akiko.tanaka@example.com',
      cefrLevel: 'ADVANCED',
      sentenceCount: 110,
      status: 'COMPLETED',
      uploadedAt: '2026-09-06 18:45',
    },
  ]);

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          PDF Document Ingestion & Chunking Audit
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review all user-uploaded reading materials, structural sentence segmentations, and CEFR readability estimates.
        </p>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Document Title</th>
                <th className="px-6 py-4">Learner</th>
                <th className="px-6 py-4">CEFR Grade</th>
                <th className="px-6 py-4">Extracted Sentences</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Uploaded</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-850/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="font-bold text-white">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{doc.userEmail}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono font-medium">
                      {doc.cefrLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{doc.sentenceCount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{doc.uploadedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition"
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
    </div>
  );
}
