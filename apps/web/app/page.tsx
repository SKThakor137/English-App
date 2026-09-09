import Link from 'next/link';
import { Mic, Volume2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-brand-200">
              E
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              EnglishFluency
            </span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-650 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>AI-Powered Deliberate Speaking Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            Speak English Confidently with{' '}
            <span className="text-brand-600 underline decoration-brand-200 decoration-wavy">
              Real-Time AI Feedback
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Stop passively reading grammar rules. Listen to native speech, speak into your microphone, get instant word-by-word pronunciation and grammar analysis, and master real conversations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-100 transition group"
            >
              <span>Start Speaking Free</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
            >
              Resume Practice
            </Link>
          </div>

          {/* Core Practice Loop Visual */}
          <div className="mt-16 p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-slate-150 text-left max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-650">
                Interactive Practice Demo
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Intermediate B1
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-650 font-medium">Target Sentence:</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                &ldquo;I usually go for a walk in the evening because it helps me relax.&rdquo;
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition">
                <Volume2 className="w-4 h-4 text-slate-600" />
                <span>Listen Model</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition shadow-sm">
                <Mic className="w-4 h-4" />
                <span>Tap to Speak</span>
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 bg-slate-100/60 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-900">
                Everything You Need for Spoken Fluency
              </h2>
              <p className="mt-3 text-slate-600">
                Structured deliberate practice designed by linguistic and speech experts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900">Phoneme-Level Accuracy</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Real acoustic phoneme alignment spots exact mispronounced sounds and syllable stress rather than generic text diffs.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900">AI Roleplay Conversations</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Engage in dynamic multi-turn voice roleplays for tech workplace standups, job interviews, customer support, and travel.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900">PDF & Document Learning</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Upload your own workplace documents, course syllabi, or articles. Our OCR and chunking engine turns them into speaking drills.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>&copy; 2026 EnglishFluency Platform. Multi-client platform built for web and mobile.</p>
      </footer>
    </div>
  );
}

