
import React, { useState } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase } from '../types';
import { 
  CheckCircle, Play, Target, Pause, RotateCcw, Clock, Zap, ChevronRight
} from 'lucide-react';
import { PHASES, COLORS } from '../constants';
import { translations } from '../translations';

interface PhysicalProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activities: RecoveryActivity[];
  onToggleActivity: (id: string) => void;
}

const PhysicalRecovery: React.FC<PhysicalProps> = ({ profile, setProfile, activities, onToggleActivity }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [selectedPhase, setSelectedPhase] = useState<RecoveryPhase>(profile.currentPhase);
  const [sessionActive, setSessionActive] = useState<RecoveryActivity | null>(null);

  const phaseActivities = activities.filter(a => a.phase === selectedPhase);
  const completedInPhase = phaseActivities.filter(a => profile.completedActivities.includes(a.id)).length;
  const phaseProgress = phaseActivities.length > 0 ? (completedInPhase / phaseActivities.length) * 100 : 0;

  const currentPhaseIndex = PHASES.indexOf(profile.currentPhase);
  const selectedPhaseIndex = PHASES.indexOf(selectedPhase);
  const isLocked = selectedPhaseIndex > currentPhaseIndex;
  
  const theme = COLORS[profile.accent] || COLORS.pink;

  const startSession = (act: RecoveryActivity) => {
    if (isLocked || profile.journeySettings.isPaused) return;
    setSessionActive(act);
  };

  const togglePause = () => {
    setProfile(prev => ({
      ...prev,
      journeySettings: { ...prev.journeySettings, isPaused: !prev.journeySettings.isPaused }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in pb-20">
      {/* Refined Progress Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
               <div className="p-4 rounded-3xl text-white shadow-lg" style={{ backgroundColor: theme.primary }}>
                 <Target size={32} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-gray-900 leading-tight">{t.physical.title}</h2>
                 <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{t.physical.phase} {currentPhaseIndex + 1}: {profile.currentPhase}</p>
               </div>
            </div>
            <button 
              onClick={togglePause}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                profile.journeySettings.isPaused ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
              }`}
            >
              {profile.journeySettings.isPaused ? <RotateCcw size={14} /> : <Pause size={14} />}
              {profile.journeySettings.isPaused ? t.physical.resume : t.physical.pause}
            </button>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.physical.completion}</span>
                <span className="text-2xl font-black" style={{ color: theme.text }}>{Math.round(phaseProgress)}%</span>
             </div>
             <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${phaseProgress}%`, backgroundColor: theme.primary }}
                />
             </div>
          </div>
        </div>

        {/* Phase Focus Stats Card */}
        <div className="bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center space-y-6">
           <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="#F8FAFC" strokeWidth="12" fill="transparent" />
                <circle cx="64" cy="64" r="58" stroke={theme.primary} strokeWidth="12" fill="transparent" 
                        strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * phaseProgress) / 100} 
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className="text-xs font-black text-slate-300 uppercase leading-none mb-1">{t.common.points}</span>
                 <span className="text-3xl font-black text-slate-800">{completedInPhase * 10}</span>
              </div>
           </div>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.physical.activeTitle}: {selectedPhase}</p>
        </div>
      </div>

      {/* Phase Selector */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        {PHASES.map((p, idx) => {
          const active = selectedPhase === p;
          const locked = idx > currentPhaseIndex;
          return (
            <button 
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`shrink-0 px-8 py-5 rounded-[2rem] border-2 transition-all flex flex-col gap-1 items-start min-w-[200px] ${
                active ? 'text-white border-transparent shadow-xl scale-105' : 
                locked ? 'bg-slate-100/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50' :
                'bg-white text-slate-600 border-slate-50 hover:border-slate-200 shadow-sm'
              }`}
              style={{ backgroundColor: active ? theme.primary : '', boxShadow: active ? `0 20px 40px -10px ${theme.primary}55` : '' }}
            >
              <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'opacity-70' : 'text-slate-300'}`}>{t.physical.phase} {idx + 1}</span>
              <span className="text-lg font-black whitespace-nowrap">{p}</span>
              {locked && <span className="text-[9px] font-bold mt-1 uppercase opacity-60">{t.physical.locked}</span>}
            </button>
          );
        })}
      </div>

      {/* Activities Grid */}
      <div className="space-y-6">
        {isLocked ? (
          <div className="bg-white p-20 rounded-[3.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-6 shadow-inner">
             <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center">
               <Pause size={40} />
             </div>
             <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-700">{t.physical.restricted}</h4>
                <p className="text-sm text-slate-400 max-w-sm font-medium">{t.physical.restrictedSub}</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {phaseActivities.map(act => {
              const isDone = profile.completedActivities.includes(act.id);
              return (
                <div 
                  key={act.id}
                  onClick={() => startSession(act)}
                  className={`p-8 rounded-[3rem] bg-white border-2 transition-all cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-2xl ${
                    isDone ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-50 hover:border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                     <div 
                      className={`p-4 rounded-2xl transition-all ${isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100 transition-colors shadow-inner'}`}
                      style={{ color: !isDone && profile.accent === 'pink' ? theme.primary : '' }}
                     >
                        {isDone ? <CheckCircle size={28} /> : <Play size={28} fill="currentColor" />}
                     </div>
                     <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-400 border border-slate-100">{act.category}</div>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-xl font-black text-gray-900 group-hover:text-pink-600 transition-colors">{act.title}</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">{act.description}</p>
                  </div>

                  <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-50">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{act.duration} Min</span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-400">
                        <Zap size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.physical.intensityLabel} {act.intensityScale}/10</span>
                     </div>
                     <ChevronRight className="ml-auto text-slate-200 group-hover:text-slate-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Session Modal */}
      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-lg flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="max-w-xl w-full bg-white rounded-[4rem] p-10 lg:p-16 text-center space-y-10 relative shadow-2xl border border-white/50">
              <button onClick={() => setSessionActive(null)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-500 transition-colors"><RotateCcw size={28} /></button>
              <div className="space-y-4">
                 <h2 className="text-3xl font-black text-gray-900 leading-tight">{sessionActive.title}</h2>
                 <p className="text-slate-400 font-medium">{sessionActive.description}</p>
              </div>
              <div className="p-14 bg-slate-50 rounded-[3rem] border-4 border-white shadow-inner flex flex-col items-center">
                 <div className="text-6xl lg:text-8xl font-black tabular-nums tracking-tighter mb-2" style={{ color: theme.primary }}>05:00</div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Remaining Time</span>
              </div>
              <button 
                onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }}
                style={{ backgroundColor: theme.primary, boxShadow: `0 20px 40px -10px ${theme.primary}55` }}
                className="w-full py-6 text-white rounded-full font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                {t.physical.logCompletion}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalRecovery;
