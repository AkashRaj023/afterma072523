
import React, { useState } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase } from '../types';
import { 
  CheckCircle, Play, ChevronRight, Trophy, Zap, Clock, 
  Target, Info, ArrowRight, Star, Heart, Pause, RotateCcw, Settings as SettingsIcon
} from 'lucide-react';
import { PHASES, COLORS } from '../constants';

interface PhysicalProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activities: RecoveryActivity[];
  onToggleActivity: (id: string) => void;
}

const PhysicalRecovery: React.FC<PhysicalProps> = ({ profile, setProfile, activities, onToggleActivity }) => {
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

  const changePace = (pace: 'gentle' | 'moderate') => {
    setProfile(prev => ({
      ...prev,
      journeySettings: { ...prev.journeySettings, pace }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in pb-10">
      {/* Journey Header with Adaptive Controls */}
      <div className="bg-white p-10 rounded-[3rem] border border-pink-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="relative z-10 space-y-4 flex-1">
          <div className="flex items-center gap-3">
             <div className="p-3 text-white rounded-2xl shadow-lg" style={{ backgroundColor: theme.primary }}>
               <Target size={28} />
             </div>
             <div>
               <h2 className="text-4xl font-black text-gray-900 leading-tight">Recovery Journey</h2>
               <p className="text-gray-500 font-medium">Phase {currentPhaseIndex + 1}: {profile.currentPhase}</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={togglePause}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs transition-all ${
                profile.journeySettings.isPaused ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
              }`}
            >
              {profile.journeySettings.isPaused ? <RotateCcw size={14} /> : <Pause size={14} />}
              {profile.journeySettings.isPaused ? 'Resume Journey' : 'Pause Journey'}
            </button>
            <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100">
               <button 
                 onClick={() => changePace('gentle')}
                 className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${profile.journeySettings.pace === 'gentle' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
               >Gentle</button>
               <button 
                 onClick={() => changePace('moderate')}
                 className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${profile.journeySettings.pace === 'moderate' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
               >Moderate</button>
            </div>
          </div>

          <p className="text-gray-600 max-w-lg leading-relaxed text-sm">
            {profile.journeySettings.isPaused 
              ? "Your journey is currently paused. No daily checks or notifications will be sent until you resume."
              : `You are in the ${profile.journeySettings.pace} track. Focus: ${profile.journeySettings.goals.join(', ')}.`}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 bg-gray-50 p-8 rounded-[2rem] border border-gray-100 min-w-[200px]">
           <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white" />
                <circle cx="48" cy="48" r="40" stroke={theme.primary} strokeWidth="8" fill="transparent" 
                        strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * phaseProgress) / 100} 
                        className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-xl" style={{ color: theme.text }}>
                {Math.round(phaseProgress)}%
              </div>
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phase Completion</span>
        </div>
      </div>

      {/* Adaptive Phase Selection */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {PHASES.map((p, idx) => {
          const active = selectedPhase === p;
          const locked = idx > currentPhaseIndex;
          return (
            <button 
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`shrink-0 px-8 py-5 rounded-[2rem] border-2 transition-all flex flex-col gap-1 items-start min-w-[190px] ${
                active ? 'text-white border-transparent shadow-2xl scale-105' : 
                locked ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed opacity-60' :
                'bg-white text-gray-700 border-pink-50 hover:border-pink-300'
              }`}
              style={{ backgroundColor: active ? theme.primary : '', boxShadow: active ? `0 25px 50px -12px ${theme.primary}33` : '' }}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-70' : 'text-gray-400'}`}>Phase {idx + 1}</span>
              <span className="text-lg font-black whitespace-nowrap">{p}</span>
              {locked && <span className="text-[8px] font-bold mt-1 uppercase">Locked</span>}
            </button>
          );
        })}
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
           <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
             <ActivityIcon phase={selectedPhase} />
             {selectedPhase} Modules
           </h3>
           <span className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">{completedInPhase} / {phaseActivities.length} Completed</span>
        </div>

        {isLocked ? (
          <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center text-center space-y-4">
             <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center">
               <Pause size={40} />
             </div>
             <h4 className="text-xl font-bold text-gray-700">Access Restricted</h4>
             <p className="text-gray-400 max-w-sm">Finish your current focus areas in **{profile.currentPhase}** to unlock this part of your AfterMa journey.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phaseActivities.map(act => {
              const isDone = profile.completedActivities.includes(act.id);
              return (
                <div 
                  key={act.id}
                  onClick={() => startSession(act)}
                  className={`p-8 rounded-[2.5rem] bg-white border-2 transition-all cursor-pointer group relative overflow-hidden ${
                    isDone ? 'border-emerald-100' : 'border-gray-50 hover:border-pink-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                     <div 
                      className={`p-4 rounded-2xl transition-all ${isDone ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:text-white'}`}
                      style={{ backgroundColor: !isDone ? '' : '', background: !isDone && 'group-hover' ? theme.primary : '' }}
                     >
                        {isDone ? <CheckCircle size={24} /> : <Play size={24} fill="currentColor" />}
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase bg-gray-50 px-2 py-1 rounded text-gray-400">{act.category}</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                          <Clock size={12} /> {act.duration}M
                        </div>
                     </div>
                  </div>
                  
                  <h4 className="text-xl font-black text-gray-900 group-hover:text-pink-600 transition-colors">{act.title}</h4>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed h-10 overflow-hidden text-ellipsis line-clamp-2">{act.description}</p>
                  
                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50">
                     <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <Star size={14} className="text-amber-400" /> +{act.points} Recovery Pts
                     </div>
                     <ArrowRight size={20} className="text-gray-200 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  {isDone && <div className="absolute top-0 right-0 p-3 bg-emerald-500 text-white font-black text-[9px] rounded-bl-xl uppercase tracking-widest">Completed</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Session Modal */}
      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
           <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center space-y-8 relative shadow-2xl">
              <button onClick={() => setSessionActive(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><RotateCcw size={24} /></button>
              <div className="p-6 bg-gray-50 rounded-[2rem] inline-block mx-auto" style={{ color: theme.primary }}>
                <Play size={40} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">{sessionActive.title}</h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Module ID: {sessionActive.id}</span>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed">{sessionActive.description}</p>
              
              <div className="p-10 bg-gray-50 rounded-[2.5rem] border-2" style={{ borderColor: theme.bg }}>
                 <div className="text-6xl font-black tabular-nums mb-2" style={{ color: theme.primary }}>05:00</div>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Focus Session</span>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }}
                  style={{ backgroundColor: theme.primary }}
                  className="w-full py-5 text-white rounded-full font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Log Completion
                </button>
                <button onClick={() => setSessionActive(null)} className="text-gray-400 font-bold text-sm hover:text-gray-600">Cancel Session</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ActivityIcon = ({ phase }: { phase: RecoveryPhase }) => {
  switch (phase) {
    case 'Stabilize': return <Clock className="text-blue-500" />;
    case 'Strengthen': return <Zap className="text-amber-500" />;
    case 'Restore': return <Heart className="text-pink-500" />;
    case 'Rebuild Confidence': return <Trophy className="text-purple-500" />;
    default: return <Info className="text-gray-500" />;
  }
};

export default PhysicalRecovery;
