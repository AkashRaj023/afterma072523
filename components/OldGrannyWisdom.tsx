
import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Heart, MessageSquare, X, Smile, ChevronUp, ChevronDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, GrannyLog } from '../types';

interface Question {
  id: string;
  text: string;
  type: 'stepper' | 'emoji' | 'options' | 'slider';
  options?: string[];
  encouragement: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'kicks',
    text: "How many gentle baby kicks have been felt today?",
    type: 'stepper',
    encouragement: "Little kicks, big joy! Each one is a tiny hello."
  },
  {
    id: 'glow',
    text: "Is that beautiful pregnancy glow shining through today?",
    type: 'emoji',
    encouragement: "The light of motherhood looks lovely on you."
  },
  {
    id: 'energy',
    text: "How is the body's energy feeling in this moment?",
    type: 'slider',
    encouragement: "Resting is just as productive as doing. Be gentle with yourself."
  },
  {
    id: 'cravings',
    text: "Have any special cravings appeared for the little one today?",
    type: 'options',
    options: ['Yes, very much!', 'A little bit', 'Not today'],
    encouragement: "The body knows exactly what it needs. Enjoy every bite."
  }
];

interface OldGrannyWisdomProps {
  profile: UserProfile;
  onSaveLog: (log: GrannyLog) => void;
}

const OldGrannyWisdom: React.FC<OldGrannyWisdomProps> = ({ profile, onSaveLog }) => {
  // Only show for Pregnancy Trimester 1, 2, or 3
  const isVisible = useMemo(() => {
    const stages = ['Pregnant-T1', 'Pregnant-T2', 'Pregnant-T3'];
    return stages.includes(profile.maternityStage);
  }, [profile.maternityStage]);

  // Rotate question daily based on date
  const dailyQuestion = useMemo(() => {
    const day = new Date().getDate();
    return QUESTIONS[day % QUESTIONS.length];
  }, []);

  const [value, setValue] = useState<any>(dailyQuestion.type === 'stepper' ? 0 : dailyQuestion.type === 'slider' ? 5 : '');
  const [submitted, setSubmitted] = useState(false);
  const [show, setShow] = useState(true);

  // Check if already submitted today
  useEffect(() => {
    const lastSubmission = localStorage.getItem(`granny_checkin_${new Date().toDateString()}`);
    if (lastSubmission) {
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = () => {
    const log: GrannyLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      question: dailyQuestion.text,
      answer: value,
      reaction: dailyQuestion.encouragement
    };
    
    onSaveLog(log);
    setSubmitted(true);
    localStorage.setItem(`granny_checkin_${new Date().toDateString()}`, 'true');
  };

  if (!isVisible || !show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFF9F5] border border-[#F3E5D8] rounded-[2.5rem] p-8 lg:p-10 mb-12 relative overflow-hidden shadow-sm"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8B5E3C 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-[#F3E5D8] rounded-2xl flex items-center justify-center text-[#8B5E3C]">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#5D4037] tracking-tight">Granny’s Gentle Check-In</h3>
              <p className="text-[10px] font-bold text-[#A1887F] uppercase tracking-widest">A moment of nostalgic care</p>
            </div>
          </div>
          <button onClick={() => setShow(false)} className="text-[#D7CCC8] hover:text-[#A1887F] transition-colors p-2">
            <X size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="question"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <p className="text-lg lg:text-xl text-[#5D4037] font-medium italic leading-relaxed">
                "{dailyQuestion.text}"
              </p>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 w-full">
                  {dailyQuestion.type === 'stepper' && (
                    <div className="flex items-center gap-4 bg-white/60 rounded-2xl p-2 border border-[#F3E5D8] w-fit">
                      <button 
                        onClick={() => setValue(Math.max(0, value - 1))}
                        className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#8B5E3C] hover:bg-[#F3E5D8] transition-colors"
                      >
                        <ChevronDown size={20} />
                      </button>
                      <span className="text-2xl font-bold text-[#5D4037] w-12 text-center">{value}</span>
                      <button 
                        onClick={() => setValue(value + 1)}
                        className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#8B5E3C] hover:bg-[#F3E5D8] transition-colors"
                      >
                        <ChevronUp size={20} />
                      </button>
                    </div>
                  )}

                  {dailyQuestion.type === 'emoji' && (
                    <div className="flex gap-4">
                      {['✨', '🌸', '🌟', '💖'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setValue(emoji)}
                          className={`h-16 w-16 rounded-2xl text-3xl flex items-center justify-center transition-all ${value === emoji ? 'bg-[#F3E5D8] scale-110 shadow-md' : 'bg-white/60 hover:bg-white'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {dailyQuestion.type === 'options' && (
                    <div className="flex flex-wrap gap-3">
                      {dailyQuestion.options?.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setValue(opt)}
                          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${value === opt ? 'bg-[#8B5E3C] text-white shadow-lg' : 'bg-white/60 text-[#8B5E3C] border border-[#F3E5D8] hover:bg-white'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {dailyQuestion.type === 'slider' && (
                    <div className="space-y-4 max-w-md">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={value} 
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        className="w-full h-2 bg-[#F3E5D8] rounded-lg appearance-none cursor-pointer accent-[#8B5E3C]"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-[#A1887F] uppercase tracking-widest">
                        <span>Resting</span>
                        <span>Full of Life</span>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={value === ''}
                  className="w-full md:w-auto px-10 py-4 bg-[#8B5E3C] text-white rounded-2xl font-bold shadow-lg shadow-[#8B5E3C]/20 hover:bg-[#6D4C41] transition-all active:scale-95 disabled:opacity-50"
                >
                  Share with Nani
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="encouragement"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center space-y-6 py-4"
            >
              <div className="h-20 w-20 bg-[#F3E5D8] rounded-full flex items-center justify-center text-[#8B5E3C] animate-bounce-slow">
                <Heart size={40} fill="currentColor" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#5D4037] italic">
                  "{dailyQuestion.encouragement}"
                </p>
                <p className="text-sm text-[#A1887F] font-medium">Growing stronger every day within this circle.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-[#F3E5D8]/50 flex items-center gap-2 text-[#A1887F]">
          <Info size={14} />
          <p className="text-[10px] font-medium italic">These gentle whispers remain safely within your personal records history.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OldGrannyWisdom;
