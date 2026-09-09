'use client';

import React, { useState } from 'react';
import {
  Cpu,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface QueueStatus {
  name: string;
  concurrency: number;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  avgLatencyMs: number;
  status: 'ACTIVE' | 'PAUSED' | 'IDLE';
}

export default function AdminAiJobsPage() {
  const [queues, setQueues] = useState<QueueStatus[]>([
    {
      name: 'audio-transcription-queue',
      concurrency: 10,
      active: 3,
      waiting: 0,
      completed: 14280,
      failed: 4,
      avgLatencyMs: 410,
      status: 'ACTIVE',
    },
    {
      name: 'ai-feedback-queue',
      concurrency: 6,
      active: 2,
      waiting: 1,
      completed: 12190,
      failed: 2,
      avgLatencyMs: 1250,
      status: 'ACTIVE',
    },
    {
      name: 'pdf-processing-queue',
      concurrency: 2,
      active: 0,
      waiting: 0,
      completed: 854,
      failed: 0,
      avgLatencyMs: 2400,
      status: 'IDLE',
    },
  ]);

  const [retryingQueue, setRetryingQueue] = useState<string | null>(null);

  const handleRetryFailed = (queueName: string) => {
    setRetryingQueue(queueName);
    setTimeout(() => {
      setQueues((prev) =>
        prev.map((q) => (q.name === queueName ? { ...q, failed: 0 } : q)),
      );
      setRetryingQueue(null);
    }, 1000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Queue Fleet & Worker Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time monitoring of BullMQ asynchronous job queues, STT latency, and Dead Letter Queue (DLQ) recovery.
          </p>
        </div>
        <button
          onClick={() => {}}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase text-slate-400">Total Active Jobs</span>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            {queues.reduce((acc, q) => acc + q.active, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Processing concurrently</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase text-slate-400">Completed (24h)</span>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {queues.reduce((acc, q) => acc + q.completed, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Zero timeout failures</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase text-slate-400">DLQ Failed Jobs</span>
          <div className="text-3xl font-black text-rose-400 mt-2">
            {queues.reduce((acc, q) => acc + q.failed, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Requires manual retry</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase text-slate-400">Avg Ingestion Latency</span>
          <div className="text-3xl font-black text-amber-400 mt-2">680ms</div>
          <div className="text-xs text-slate-500 mt-1">Audio upload to response</div>
        </div>
      </div>

      {/* Queue Details List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          Active BullMQ Queue Clusters
        </h2>

        <div className="space-y-4">
          {queues.map((q) => (
            <div
              key={q.name}
              className="p-5 rounded-xl bg-slate-850 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{q.name}</span>
                  <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    Concurrency: {q.concurrency}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      q.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Avg Turnaround: <strong className="text-slate-200">{q.avgLatencyMs}ms</strong> &bull; Completed: {q.completed.toLocaleString()}
                </p>
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center px-3 py-1.5 bg-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400">Active</div>
                  <div className="text-sm font-bold text-indigo-300">{q.active}</div>
                </div>
                <div className="text-center px-3 py-1.5 bg-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400">Waiting</div>
                  <div className="text-sm font-bold text-slate-200">{q.waiting}</div>
                </div>
                <div className="text-center px-3 py-1.5 bg-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400">Failed</div>
                  <div className={`text-sm font-bold ${q.failed > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {q.failed}
                  </div>
                </div>

                {q.failed > 0 && (
                  <button
                    onClick={() => handleRetryFailed(q.name)}
                    disabled={retryingQueue === q.name}
                    className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${retryingQueue === q.name ? 'animate-spin' : ''}`} />
                    <span>Retry ({q.failed})</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
