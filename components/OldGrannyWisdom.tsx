
import React, { useState, useMemo } from 'react';
import { Sparkles, Heart, MessageSquare, X, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

const TRIMESTER_QUESTIONS: Record<string, any[]> = {
  'Pregnant - Trimester 1': [
    {
      question: "Is the little seed making its presence felt with a bit of morning magic?",
      reactions: {
        yes: "Ah, the first signs of life. Within this circle, such moments are cherished as the start of a beautiful path.",
        no: "A quiet beginning is a grace. Every journey within this circle has its own rhythm.",
      }
    },
    {
      question: "Has a moment been taken to simply listen to the body's whispers today?",
      reactions: {
        yes: "Good. Listening to the body is how strength is found for the days ahead.",
        no: "A quiet moment now can bring peace. The body knows the way.",
      }
    }
  ],
  'Pregnant - Trimester 2': [
    {
      question: "Is the glow of motherhood beginning to shine through?",
      reactions: {
        yes: "The light of motherhood is a beautiful sight. It brings warmth to all in this circle.",
        no: "Beauty is found in the quiet strength of this journey. It is always there.",
      }
    },
    {
      question: "Are the first gentle movements being felt within?",
      reactions: {
        yes: "A tiny dancer! Such joy is shared among sisters when life makes itself known.",
        no: "Patience is a mother's virtue. The time for meeting will come soon enough.",
      }
    }
  ],
  'Pregnant - Trimester 3': [
    {
      question: "Is the weight of the journey feeling heavy today?",
      reactions: {
        yes: "The final steps are often the most demanding. Lean on the collective strength of this circle.",
        no: "Strength is found in the anticipation. The finish line is near.",
      }
    },
    {
      question: "Are preparations for the new arrival bringing a sense of peace?",
      reactions: {
        yes: "Building the nest is a sacred task. It prepares the heart as much as the home.",
        no: "Take it one breath at a time. Everything will find its place in due time.",
      }
    }
  ]
};

interface OldGrannyWisdomProps {
  profile: UserProfile;
}

const OldGrannyWisdom: React.FC<OldGrannyWisdomProps> = ({ profile }) => {
  const questions = useMemo(() => {
    return TRIMESTER_QUESTIONS[profile.maternityStage] || [];
  }, [profile.maternityStage]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [reaction, setReaction] = useState<string | null>(null);
  const [show, setShow] = useState(true);

  const handleAnswer = (val: string) => {
    if (!questions[currentIdx]) return;
    const q = questions[currentIdx];
    let r = "";
    
    if (val.toLowerCase().includes('yes') || val.toLowerCase().includes('yeah') || val.toLowerCase().includes('sure')) {
      r = q.reactions.yes;
    } else {
      r = q.reactions.no;
    }

    setReaction(r);
  };

  const nextQuestion = () => {
    setReaction(null);
    setAnswer('');
    setCurrentIdx((prev) => (prev + 1) % questions.length);
  };

  if (!show || questions.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-stone-50/40 backdrop-blur-md border border-stone-100 rounded-[2.5rem] p-8 mb-12 relative overflow-hidden group shadow-sm"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setShow(false)} className="text-stone-300 hover:text-stone-500 transition-colors"><X size={18} /></button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
        <div className="h-20 w-20 bg-stone-100/50 rounded-3xl flex items-center justify-center shrink-0 shadow-inner border border-stone-200/50">
          <Sparkles className="text-stone-400" size={36} />
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h4 className="text-stone-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-3">
              Old Granny's Wisdom
              <span className="h-1.5 w-1.5 rounded-full bg-stone-300 animate-pulse" />
            </h4>
            <p className="text-stone-800 font-medium italic text-lg leading-relaxed">
              "{questions[currentIdx].question}"
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!reaction ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto md:mx-0"
              >
                <input 
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Share a thought..."
                  className="flex-1 bg-white/40 border border-stone-200 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-300"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnswer(answer)}
                />
                <button 
                  onClick={() => handleAnswer(answer)}
                  className="px-8 py-3 bg-stone-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-stone-900 transition-all shadow-lg shadow-stone-900/10"
                >
                  Share
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="reaction"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="p-6 bg-white/60 rounded-3xl border border-stone-100 shadow-sm">
                  <p className="text-stone-700 font-medium text-base leading-relaxed italic">
                    "{reaction}"
                  </p>
                </div>
                <button 
                  onClick={nextQuestion}
                  className="text-stone-400 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center md:justify-start gap-3 hover:text-stone-600 transition-all group/btn"
                >
                  Seek another whisper <Smile size={16} className="group-hover/btn:rotate-12 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default OldGrannyWisdom;
