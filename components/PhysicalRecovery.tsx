
import React, { useState } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase } from '../types';
import { 
  CheckCircle, Play, Target, Pause, RotateCcw
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in pb-10">
      {/* Journey Header with Adaptive Controls */}
      <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-pink-50 shadow-md relative overflow-hidden flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="relative z-10 space-y-4 flex-1">
          <div className="flex items-center gap-4">
             <div className="p-4 text-white rounded-[1.5rem] shadow-lg" style={{ backgroundColor: theme.primary }}>
               <Target size={32} />
             </div>
             <div>
               <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">{t.physical.title}</h2>
               <p className="text-gray-500 font-medium">{t.physical.phase} {currentPhaseIndex + 1}: {profile.currentPhase}</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={togglePause}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
                profile.journeySettings.isPaused ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-500 border border-gray-100 shadow-sm'
              }`}
            >
              {profile.journeySettings.isPaused ? <RotateCcw size={14} /> : <Pause size={14} />}
              {profile.journeySettings.isPaused ? t.physical.resume : t.physical.pause}
            </button>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 bg-gray-50/50 p-6 lg:p-8 rounded-[2rem] border border-gray-100 min-w-[200px] shadow-inner">
           <div className="relative w-20 h-20 lg:w-24 lg:h-24">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="white" strokeWidth="8" fill="transparent" />
                <circle cx="48" cy="48" r="40" stroke={theme.primary} strokeWidth="8" fill="transparent" 
                        strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * phaseProgress) / 100} 
                        className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-lg lg:text-xl" style={{ color: theme.text }}>
                {Math.round(phaseProgress)}%
              </div>
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.physical.completion}</span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {PHASES.map((p, idx) => {
          const active = selectedPhase === p;
          const locked = idx > currentPhaseIndex;
          return (
            <button 
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`shrink-0 px-6 lg:px-8 py-4 lg:py-5 rounded-[2rem] border-2 transition-all flex flex-col gap-1 items-start min-w-[170px] lg:min-w-[190px] ${
                active ? 'text-white border-transparent shadow-xl scale-105' : 
                locked ? 'bg-gray-100/50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60' :
                'bg-white text-gray-700 border-gray-50 hover:border-pink-200 shadow-sm'
              }`}
              style={{ backgroundColor: active ? theme.primary : '', boxShadow: active ? `0 20px 40px -10px ${theme.primary}55` : '' }}
            >
              <span className={`text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-70' : 'text-gray-400'}`}>{t.physical.phase} {idx + 1}</span>
              <span className="text-base lg:text-lg font-black whitespace-nowrap">{p}</span>
              {locked && <span className="text-[8px] font-bold mt-1 uppercase">{t.physical.locked}</span>}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {isLocked ? (
          <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center text-center space-y-4 shadow-sm">
             <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center">
               <Pause size={32} />
             </div>
             <h4 className="text-lg lg:text-xl font-bold text-gray-700">{t.physical.restricted}</h4>
             <p className="text-sm text-gray-400 max-w-sm">{t.physical.restrictedSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {phaseActivities.map(act => {
              const isDone = profile.completedActivities.includes(act.id);
              return (
                <div 
                  key={act.id}
                  onClick={() => startSession(act)}
                  className={`p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white border border-gray-50 transition-all cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-lg ${
                    isDone ? 'border-emerald-100 bg-emerald-50/20' : 'hover:border-pink-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 lg:mb-6">
                     <div 
                      className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all ${isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-50 text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-600 shadow-sm'}`}
                     >
                        {isDone ? <CheckCircle size={24} /> : <Play size={24} fill="currentColor" />}
                     </div>
                  </div>
                  <h4 className="text-lg lg:text-xl font-black text-gray-900 group-hover:text-pink-600 transition-colors">{act.title}</h4>
                  <p className="text-xs lg:text-sm text-gray-500 mt-2 line-clamp-2">{act.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
           <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 lg:p-12 text-center space-y-6 lg:space-y-8 relative shadow-2xl border border-white/50">
              <button onClick={() => setSessionActive(null)} className="absolute top-6 right-6 lg:top-8 lg:right-8 text-slate-400 hover:text-slate-600 transition-colors"><RotateCcw size={24} /></button>
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900">{sessionActive.title}</h2>
              <div className="p-10 bg-gray-50 rounded-[2.5rem] border-2 border-gray-100 shadow-inner">
                 <div className="text-5xl lg:text-7xl font-black tabular-nums tracking-tight" style={{ color: theme.primary }}>05:00</div>
              </div>
              <button 
                onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }}
                style={{ backgroundColor: theme.primary }}
                className="w-full py-5 text-white rounded-full font-black shadow-xl shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all"
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
