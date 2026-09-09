import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Cpu,
  Users,
  Calendar,
  Settings,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Console | English Speaking Platform',
  description: 'Operations, Curriculum Management, and Queue Supervision Console',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex bg-slate-950 text-slate-100">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2 pb-6 border-b border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                A
              </div>
              <span className="font-bold text-base text-white tracking-tight">Admin Console</span>
            </div>

            <nav className="mt-6 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/curriculum"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 text-sm font-medium transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>Curriculum & Lessons</span>
              </Link>
              <Link
                href="/documents"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 text-sm font-medium transition"
              >
                <FileText className="w-4 h-4" />
                <span>PDF Ingestion & OCR</span>
              </Link>
              <Link
                href="/ai-jobs"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 text-sm font-medium transition"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>BullMQ Queue Fleet</span>
              </Link>
              <Link
                href="/users"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 text-sm font-medium transition"
              >
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </Link>
              <Link
                href="/challenges"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 text-sm font-medium transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Daily Challenges</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 text-sm font-medium transition"
              >
                <Settings className="w-4 h-4" />
                <span>Settings & Quotas</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
            Platform Version 1.0.0 (NestJS + BullMQ)
          </div>
        </aside>

        {/* Admin Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}

