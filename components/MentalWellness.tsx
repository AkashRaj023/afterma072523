
import React, { useState } from 'react';
import { Brain, Heart, Edit3, Sparkles, MessageCircle, AlertTriangle, Phone, ShieldCheck, CheckSquare, Music } from 'lucide-react';
import { EPDS_QUESTIONS, HELPLINES, STABILIZATION_TASKS, COLORS } from '../constants';

const MentalWellness: React.FC = () => {
  const [showEPDS, setShowEPDS] = useState(false);
  const [epdsStep, setEpdsStep] = useState(0);
  const [epdsScore, setEpdsScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleEPDSAnswer = (points: number) => {
    setEpdsScore(prev => prev + points);
    if (epdsStep < EPDS_QUESTIONS.length - 1) {
      setEpdsStep(epdsStep + 1);
    } else {
      setShowEPDS(false);
      alert(`Healing Check-in Complete. Your emotional state is logged with care for your steady progress.`);
      setEpdsStep(0);
      setEpdsScore(0);
    }
  };

  const toggleTask = (task: string) => {
    setCompletedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-50 col-span-1 md:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-gray-800 leading-tight">Emotional Haven</h2>
              <p className="text-slate-400 font-medium italic">A safe, non-judgmental space for your mind to rest.</p>
            </div>
            <div className="h-14 w-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center shadow-inner">
               <ShieldCheck size={32} />
            </div>
          </div>
          
          {!showEPDS ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <MentalAction icon={<Heart className="text-rose-300" />} title="Healing Check-in" subtitle="EPDS Screening" onClick={() => setShowEPDS(true)} />
              <MentalAction icon={<Edit3 className="text-indigo-300" />} title="Gentle Journal" subtitle="Daily Reflections" onClick={() => {}} />
              <MentalAction icon={<Sparkles className="text-amber-300" />} title="Moment of Calm" subtitle="Grounding Loops" onClick={() => {}} />
              <MentalAction icon={<Music className="text-emerald-300" />} title="Safe Sounds" subtitle="Bonding Audio" onClick={() => {}} />
            </div>
          ) : (
            <div className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-black text-slate-400 bg-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Reflection {epdsStep + 1} of 10</span>
                <button onClick={() => setShowEPDS(false)} className="text-slate-300 font-bold text-sm uppercase hover:text-slate-500 transition-colors">Close</button>
              </div>
              <h3 className="text-3xl font-black text-gray-700 mb-10 leading-tight">{EPDS_QUESTIONS[epdsStep]}</h3>
              <div className="grid gap-4">
                {[0, 1, 2, 3].map((val) => (
                  <button 
                    key={val}
                    onClick={() => handleEPDSAnswer(val)}
                    className="w-full text-left px-8 py-5 bg-white border-2 border-slate-50 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-slate-700 font-bold text-lg"
                  >
                    {val === 0 ? "As much as I ever did" : val === 1 ? "Rather less than I used to" : val === 2 ? "Definitely less than I used to" : "Not at all"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stabilization Tasks Section */}
          <div className="pt-10 border-t border-slate-50 space-y-6">
             <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
               <CheckSquare className="text-emerald-300" size={24} />
               Daily Comfort Tasks
             </h3>
             <div className="grid gap-3">
               {STABILIZATION_TASKS.map(task => (
                 <button 
                  key={task}
                  onClick={() => toggleTask(task)}
                  className={`flex items-center gap-4 p-5 rounded-2xl text-left border-2 transition-all ${
                    completedTasks.includes(task) ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-50 text-slate-600 hover:border-slate-200'
                  }`}
                 >
                   <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                     completedTasks.includes(task) ? 'bg-emerald-400 border-emerald-400 text-white' : 'border-slate-200'
                   }`}>
                     {completedTasks.includes(task) && <CheckSquare size={14} />}
                   </div>
                   <span className="font-bold text-sm">{task}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-400 to-rose-500 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-rose-100" size={32} />
                <h3 className="text-2xl font-black">Urgent Support</h3>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest">{HELPLINES.india.name}</p>
                <a href={`tel:${HELPLINES.india.number}`} className="text-3xl font-black block tracking-tight hover:underline">
                  {HELPLINES.india.number}
                </a>
              </div>
              <p className="text-xs text-rose-50 leading-relaxed font-medium">
                Feeling heavy is okay. Talking helps. Reach out to our verified partners for a gentle conversation.
              </p>
              <button className="w-full py-4 bg-white text-rose-500 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">
                Connect Now
              </button>
            </div>
            <Heart size={150} className="absolute bottom-[-40px] right-[-20px] opacity-10" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 space-y-6">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <Brain size={24} className="text-rose-300" />
              Gentle Check-in
            </h3>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-50 text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">How are you feeling?</p>
               <div className="flex justify-between items-center px-2">
                  {['😔', '😐', '🙂', '😊', '🌟'].map((e, i) => (
                    <button key={i} className="text-4xl hover:scale-150 transition-transform active:scale-95 drop-shadow-sm">{e}</button>
                  ))}
               </div>
               <p className="mt-8 text-[11px] font-bold text-rose-400 italic">Your feelings are valid and safe here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MentalAction = ({ icon, title, subtitle, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-slate-200 hover:shadow-lg transition-all text-center group"
  >
    <div className="p-5 bg-slate-50 rounded-2xl mb-4 group-hover:bg-slate-100 transition-all shadow-inner">
      {icon}
    </div>
    <span className="font-black text-slate-800 text-lg mb-1">{title}</span>
    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{subtitle}</span>
  </button>
);

export default MentalWellness;
