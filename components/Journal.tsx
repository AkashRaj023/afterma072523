
import React, { useState } from 'react';
import { 
  BookOpen, Heart, Sparkles, ChevronRight, ChevronLeft, 
  Send, ShieldCheck, Star, MessageCircle, PenTool, 
  ArrowRight, Smile, Sun, Moon, Cloud, Wind, X, RefreshCw, History, Calendar, Trash2
} from 'lucide-react';
import { UserProfile, JournalEntry } from '../types';
import { COLORS } from '../constants';

interface JournalProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onClose: () => void;
}

const JOURNAL_PROMPTS = [
  "How did your day go today? Take a moment to reflect on your feelings.",
  "What is one small thing that brought you a moment of peace today?",
  "How did you show kindness to yourself in the last 24 hours?",
  "Describe a sensation in your body that feels grounded or calm.",
  "What are you most looking forward to in your healing journey?",
  "If your heart could speak today, what would it say in one sentence?",
  "Who is someone you felt supported by recently, and how did it feel?",
  "What is a strength you've discovered in yourself since becoming a mother?"
];

const Journal: React.FC<JournalProps> = ({ profile, setProfile, onClose }) => {
  const [view, setView] = useState<'write' | 'history'>('write');
  const [promptIndex, setPromptIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [response, setResponse] = useState("");

  const theme = COLORS[profile.accent] || COLORS.PINK;

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % JOURNAL_PROMPTS.length);
    setEntry("");
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (!entry.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      prompt: JOURNAL_PROMPTS[promptIndex],
      content: entry,
      timestamp: Date.now()
    };

    setProfile(prev => ({
      ...prev,
      journalEntries: [newEntry, ...(prev.journalEntries || [])]
    }));

    if (entry.toLowerCase() === 'nothing') {
      setResponse("It's perfectly okay to have moments where words don't come. Your presence here is enough. Take a deep breath—we're here whenever you're ready.");
    } else {
      setResponse("Thank you for sharing that piece of your heart. Every word you write is a step toward deeper healing. You are heard, you are seen, and you are doing so well.");
    }
    setIsSubmitted(true);
  };

  const deleteEntry = (id: string) => {
    setProfile(prev => ({
      ...prev,
      journalEntries: (prev.journalEntries || []).filter(e => e.id !== id)
    }));
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white/95 backdrop-blur-2xl flex flex-col animate-in slide-in-from-bottom duration-700">
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><PenTool size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-900 leading-none">Guided Reflection</h3>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Private & Safe Space</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(view === 'write' ? 'history' : 'write')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${view === 'history' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {view === 'write' ? <><History size={16} /> History</> : <><PenTool size={16} /> Write</>}
          </button>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-20 flex flex-col items-center">
        {view === 'write' ? (
          !isSubmitted ? (
            <div className="max-w-2xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center space-y-6">
                <div className="inline-flex p-4 bg-indigo-50 rounded-3xl text-indigo-500 mb-4 animate-bounce-slow">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {JOURNAL_PROMPTS[promptIndex]}
                </h2>
                <p className="text-slate-400 font-medium italic text-lg">
                  Take your time. There are no wrong answers here.
                </p>
              </div>

              <div className="relative group">
                <textarea 
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Start typing your heart out..."
                  className="w-full h-64 p-10 bg-slate-50 border border-slate-100 rounded-[3rem] font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all shadow-inner text-lg resize-none"
                />
                <div className="absolute bottom-6 right-6 flex gap-3">
                  <button 
                    onClick={handleNextPrompt}
                    className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm"
                    title="Change Prompt"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    Save Reflection <Send size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2"><ShieldCheck size={14} /> End-to-End Private</div>
                <div className="flex items-center gap-2"><Heart size={14} /> Compassionate Space</div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl w-full text-center space-y-10 animate-in zoom-in-95 duration-500 my-auto">
              <div className="relative inline-block">
                <div className="text-8xl mb-6">✨</div>
                <div className="absolute -top-4 -right-4 animate-pulse">🌸</div>
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">A Moment of Peace</h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
                  "{response}"
                </p>
              </div>
              <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleNextPrompt}
                  className="px-10 py-5 bg-slate-50 text-slate-600 rounded-3xl font-bold text-sm hover:bg-slate-100 transition-all"
                >
                  Reflect More
                </button>
                <button 
                  onClick={() => setView('history')}
                  className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-xl hover:scale-105 transition-all"
                >
                  View History
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="max-w-4xl w-full space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Reflections</h2>
              <p className="text-slate-400 font-medium italic">A timeline of your healing and growth.</p>
            </div>

            {(!profile.journalEntries || profile.journalEntries.length === 0) ? (
              <div className="text-center py-20 space-y-6">
                <div className="text-6xl opacity-20">🍃</div>
                <p className="text-slate-400 font-medium italic">Your history is a blank canvas. Start writing to fill it with light.</p>
                <button onClick={() => setView('write')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Start Writing</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {profile.journalEntries.map((entry) => (
                  <div key={entry.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-6 group">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                          <Calendar size={12} />
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 leading-tight">{entry.prompt}</h4>
                      </div>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic whitespace-pre-wrap">"{entry.content}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
