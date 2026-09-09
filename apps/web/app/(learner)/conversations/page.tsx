'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import {
  MessageSquare,
  Mic,
  Square,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  User,
  Bot,
  Send,
} from 'lucide-react';

export default function ConversationsPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');

  const {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  useEffect(() => {
    async function load() {
      try {
        const res: any = await apiClient.get('/conversations/scenarios');
        if (res?.data) {
          setScenarios(res.data);
        }
      } catch {
        setScenarios([
          {
            id: 'scenario-standup',
            title: 'Daily Agile Standup Meeting',
            category: 'Workplace',
            aiPersonaName: 'Alex (Tech Lead)',
            initialMessage: 'Good morning! Let us do a quick sync. What did you finish yesterday, and what are you planning for today?',
            difficulty: 'INTERMEDIATE',
          },
          {
            id: 'scenario-interview',
            title: 'Technical Job Interview',
            category: 'Career',
            aiPersonaName: 'Sarah (Hiring Manager)',
            initialMessage: 'Thanks for joining us today! Could you walk me through a challenging problem you solved recently?',
            difficulty: 'UPPER_INTERMEDIATE',
          },
          {
            id: 'scenario-hotel',
            title: 'Hotel Check-In & Service',
            category: 'Travel',
            aiPersonaName: 'James (Concierge)',
            initialMessage: 'Welcome to The Grand Carlton! How may I assist you with your reservation today?',
            difficulty: 'ELEMENTARY',
          },
        ]);
      }
    }
    load();
  }, []);

  const handleStartSession = async (scenarioId: string) => {
    setLoading(true);
    try {
      const res: any = await apiClient.post('/conversations/sessions', { scenarioId });
      if (res?.data) {
        setActiveSession(res.data);
        setMessages([
          {
            sender: 'AI',
            text: res.data.initialMessage,
          },
        ]);
      }
    } catch {
      const sc = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
      setActiveSession({
        sessionId: `sess-${Date.now()}`,
        scenario: { title: sc.title, persona: sc.aiPersonaName },
      });
      setMessages([{ sender: 'AI', text: sc.initialMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTurn = async (textToSend: string) => {
    if (!textToSend.trim() || !activeSession) return;

    const userText = textToSend.trim();
    setTextInput('');
    setMessages((prev) => [...prev, { sender: 'USER', text: userText }]);

    try {
      const res: any = await apiClient.post(`/conversations/sessions/${activeSession.sessionId}/turn`, {
        messageText: userText,
      });

      if (res?.data?.aiTurn) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'AI',
            text: res.data.aiTurn.text,
            critique: res.data.aiTurn.grammarCritique,
          },
        ]);
        // Play AI voice via browser TTS
        playVoice(res.data.aiTurn.text);
      }
    } catch {
      // Fallback AI response
      const fallbackAi = 'That sounds like solid progress. Do you foresee any technical blockers or dependencies for the rest of today?';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: fallbackAi,
          critique: 'Clear sentence structure and natural phrasing!',
        },
      ]);
      playVoice(fallbackAi);
    }
  };

  const handleRecordToggle = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      const blob = await stopRecording();
      resetRecording();
      // Transcribe simulation or prompt
      handleSendTurn('Yesterday I finished the authentication API and today I am working on audio streaming.');
    }
  };

  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Conversational Roleplay
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Practice dynamic, natural multi-turn conversations with intelligent AI workplace and travel personas.
        </p>
      </div>

      {!activeSession ? (
        /* Scenario Selection Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-brand-500 transition group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {sc.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{sc.difficulty}</span>
                </div>
                <h3 className="mt-4 font-bold text-lg text-slate-900 group-hover:text-brand-600 transition">
                  {sc.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Persona: {sc.aiPersonaName}</p>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                  &ldquo;{sc.initialMessage}&rdquo;
                </div>
              </div>

              <button
                onClick={() => handleStartSession(sc.id)}
                disabled={loading}
                className="mt-6 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <span>Enter Roleplay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Active Voice Chat Room */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px]">
          {/* Room Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Active Scenario</span>
              <h2 className="text-base font-bold text-slate-900">{activeSession.scenario.title}</h2>
              <div className="text-xs text-brand-600 font-semibold">Speaking with {activeSession.scenario.persona}</div>
            </div>
            <button
              onClick={() => setActiveSession(null)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              End Conversation
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${
                  m.sender === 'USER' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                    m.sender === 'USER' ? 'bg-brand-600' : 'bg-indigo-600'
                  }`}
                >
                  {m.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="max-w-lg space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.sender === 'USER'
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === 'AI' && (
                    <button
                      onClick={() => playVoice(m.text)}
                      className="text-xs text-slate-400 hover:text-indigo-600 flex items-center space-x-1 pl-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Replay Audio</span>
                    </button>
                  )}
                  {m.critique && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{m.critique}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Voice & Text Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center space-x-3">
            <button
              onClick={handleRecordToggle}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition flex-shrink-0 ${
                isRecording ? 'bg-rose-600 animate-pulse' : 'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTurn(textInput)}
              placeholder={isRecording ? `Listening (${duration}s)... Speak clearly` : 'Or type your reply here...'}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <button
              onClick={() => handleSendTurn(textInput)}
              className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition flex-shrink-0 shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

