import {
  Users,
  Cpu,
  DollarSign,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Operations & Telemetry Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time oversight of active learners, queue throughput, and speech API expenditures.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Daily Active Learners</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">1,482</div>
          <div className="text-xs text-emerald-400 flex items-center space-x-1 mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% from last week</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Queue Jobs Processed</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">18,920</div>
          <div className="text-xs text-slate-400 mt-3">Avg STT latency: 420ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Daily AI / STT Spend</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">$24.38</div>
          <div className="text-xs text-slate-400 mt-3">Budget cap: $100.00 / day</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>System Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6" />
            <span>Operational</span>
          </div>
          <div className="text-xs text-slate-400 mt-3">0 active DLQ errors</div>
        </div>
      </div>

      {/* BullMQ Worker Status & Curriculum Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">BullMQ Queue Fleet Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-850 border border-slate-800">
              <div>
                <div className="font-semibold text-sm text-white">audio-transcription-queue</div>
                <div className="text-xs text-slate-400">Concurrency: 10 | Whisper API / Deepgram</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Healthy
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-850 border border-slate-800">
              <div>
                <div className="font-semibold text-sm text-white">ai-feedback-queue</div>
                <div className="text-xs text-slate-400">Concurrency: 6 | LLM Grammar Parser</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Healthy
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-850 border border-slate-800">
              <div>
                <div className="font-semibold text-sm text-white">pdf-processing-queue</div>
                <div className="text-xs text-slate-400">Concurrency: 2 | PDF Parser & Tesseract OCR</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Healthy
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Curriculum Operations</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/curriculum/courses"
              className="p-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 transition"
            >
              <div className="font-bold text-white text-sm">Manage Courses</div>
              <div className="text-xs text-slate-400 mt-1">Syllabi, levels, and prerequisites</div>
            </Link>

            <Link
              href="/curriculum/sentences"
              className="p-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 transition"
            >
              <div className="font-bold text-white text-sm">Sentence Library</div>
              <div className="text-xs text-slate-400 mt-1">Manage target texts, IPA & audio</div>
            </Link>

            <Link
              href="/challenges"
              className="p-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 transition"
            >
              <div className="font-bold text-white text-sm">Schedule Daily Challenge</div>
              <div className="text-xs text-slate-400 mt-1">Calendar of daily speaking topics</div>
            </Link>

            <Link
              href="/users"
              className="p-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 transition"
            >
              <div className="font-bold text-white text-sm">Manage User Quotas</div>
              <div className="text-xs text-slate-400 mt-1">Adjust limits and grant tier access</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

