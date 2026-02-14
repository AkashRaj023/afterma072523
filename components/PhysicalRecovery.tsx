
import React, { useState } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase, PeriodLog } from '../types';
import { 
  CheckCircle, Play, Target, Pause, RotateCcw, Clock, Zap, ChevronRight,
  TrendingUp, ShieldHeart, Heart, Award, Calendar, FileText, Droplet, Smile, Edit,
  ShieldCheck
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
  const [activeSubTab, setActiveSubTab] = useState<'Journey' | 'Cycle' | 'Report'>('Journey');
  
  // Period Form State
  const [periodForm, setPeriodForm] = useState<Partial<PeriodLog>>({
    date: new Date().toISOString().split('T')[0],
    flow: 'Medium',
    symptoms: [],
    mood: 'Good',
    notes: ''
  });

  const phaseActivities = activities.filter(a => a.phase === selectedPhase);
  const completedInPhase = phaseActivities.filter(a => profile.completedActivities.includes(a.id)).length;
  const phaseProgress = phaseActivities.length > 0 ? (completedInPhase / phaseActivities.length) * 100 : 0;

  const currentPhaseIndex = PHASES.indexOf(profile.currentPhase);
  const selectedPhaseIndex = PHASES.indexOf(selectedPhase);
  const isLocked = selectedPhaseIndex > currentPhaseIndex;
  
  const theme = COLORS[profile.accent] || COLORS.PINK;

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

  const handlePeriodLog = () => {
    const newLog: PeriodLog = {
      id: Date.now().toString(),
      ...(periodForm as any)
    };
    setProfile(prev => ({
      ...prev,
      periodLogs: [newLog, ...(prev.periodLogs || [])]
    }));
    alert("Cycle details logged safely.");
  };

  const physicalTasks = phaseActivities.filter(a => a.category === 'Physical Recovery');
  const otherTasks = phaseActivities.filter(a => a.category !== 'Physical Recovery');

  return (
    <div className="space-y-6 animate-in max-w-6xl mx-auto">
      {/* View Switcher Strip */}
      <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl border border-slate-100 w-fit mx-auto lg:mx-0 shadow-sm">
        <button 
          onClick={() => setActiveSubTab('Journey')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubTab === 'Journey' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Target size={14} /> Journey
        </button>
        <button 
          onClick={() => setActiveSubTab('Cycle')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubTab === 'Cycle' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Droplet size={14} /> {t.physical.cycleTitle}
        </button>
        <button 
          onClick={() => setActiveSubTab('Report')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubTab === 'Report' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FileText size={14} /> {t.physical.reportTitle}
        </button>
      </div>

      {activeSubTab === 'Journey' && (
        <>
          {/* Header Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-white p-6 lg:p-8 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl text-white shadow-md transition-transform hover:scale-110" style={{ backgroundColor: theme.primary }}>
                     <Target size={24} />
                   </div>
                   <div>
                     <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">{t.physical.title}</h2>
                     <div className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 mt-1 inline-block tracking-widest">
                       {selectedPhase} Focused Healing
                     </div>
                   </div>
                </div>
                <button 
                  onClick={togglePause}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm ${
                    profile.journeySettings.isPaused ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {profile.journeySettings.isPaused ? <RotateCcw size={14} /> : <Pause size={14} />}
                  {profile.journeySettings.isPaused ? 'Resume' : 'Pause'}
                </button>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedPhase} Progress</span>
                    <span className="text-2xl font-black tabular-nums" style={{ color: theme.text }}>{Math.round(phaseProgress)}%</span>
                 </div>
                 <div className="h-3 w-full bg-slate-50 rounded-full border border-slate-100 p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${phaseProgress}%`, backgroundColor: theme.primary }}
                    />
                 </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4 hover:shadow-md transition-shadow">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                 <Award size={32} style={{ color: theme.primary }} strokeWidth={2} />
               </div>
               <div className="space-y-1">
                 <div className="text-3xl font-black text-slate-800">{completedInPhase * 10}</div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Healing Points earned</p>
               </div>
               <div className="w-full h-px bg-slate-50" />
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Current Phase: {profile.currentPhase}</p>
            </div>
          </div>

          {/* Month Selector Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PHASES.map((p, idx) => {
              const active = selectedPhase === p;
              const locked = idx > currentPhaseIndex;
              return (
                <button 
                  key={p}
                  onClick={() => setSelectedPhase(p)}
                  className={`px-4 py-6 rounded-[1.5rem] border transition-all flex flex-col items-center text-center gap-2 group overflow-hidden relative ${
                    active ? 'bg-white border-slate-200 shadow-lg ring-4 ring-opacity-10' : 
                    locked ? 'bg-slate-50/50 text-slate-300 border-slate-50 cursor-not-allowed opacity-60' :
                    'bg-white text-slate-500 border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                  style={{ ringColor: active ? theme.primary : 'transparent', borderColor: active ? theme.primary : '' }}
                >
                  <span className={`text-[9px] font-black uppercase tracking-widest ${active ? '' : 'text-slate-400'}`} style={{ color: active ? theme.primary : '' }}>{p}</span>
                  <span className={`text-sm font-bold tracking-tight ${active ? 'text-slate-800' : ''}`}>Healing Path</span>
                  {locked && <Pause size={12} className="text-slate-200 mt-1" />}
                </button>
              );
            })}
          </div>

          {/* Tasks Layout */}
          <div className="pt-2">
            {isLocked ? (
              <div className="bg-slate-50/50 p-16 rounded-[1.5rem] border border-dashed border-slate-200 flex flex-col items-center text-center space-y-4 shadow-inner">
                 <Pause size={48} className="text-slate-200" />
                 <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-800">Phase Access Restricted</h4>
                    <p className="text-sm text-slate-400 italic">Complete your current focus to unlock more modules.</p>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                     <div className="w-1.5 h-6 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }} />
                     <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Physical Recovery</h3>
                  </div>
                  <div className="space-y-4">
                    {physicalTasks.map(act => (
                      <ActivityCard key={act.id} act={act} theme={theme} isDone={profile.completedActivities.includes(act.id)} onClick={() => startSession(act)} />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                     <div className="w-1.5 h-6 rounded-full shadow-sm" style={{ backgroundColor: '#A78BFA' }} />
                     <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Emotional & Core</h3>
                  </div>
                  <div className="space-y-4">
                    {otherTasks.map(act => (
                      <ActivityCard key={act.id} act={act} theme={theme} isDone={profile.completedActivities.includes(act.id)} onClick={() => startSession(act)} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeSubTab === 'Cycle' && (
        <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-10 animate-in">
           <div className="space-y-2">
             <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
               <Droplet size={28} className="text-rose-400" /> Postpartum Cycle Tracker
             </h2>
             <p className="text-sm text-slate-500">Track your transition back to menstrual health with care and privacy.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner">
                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Log New Data</h3>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                     <input type="date" value={periodForm.date} onChange={e => setPeriodForm({...periodForm, date: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flow Intensity</label>
                     <select value={periodForm.flow} onChange={e => setPeriodForm({...periodForm, flow: e.target.value as any})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm">
                       <option>Spotting</option>
                       <option>Light</option>
                       <option>Medium</option>
                       <option>Heavy</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mood correlation</label>
                     <input type="text" placeholder="e.g. Irritable, Sensitive" value={periodForm.mood} onChange={e => setPeriodForm({...periodForm, mood: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm" />
                   </div>
                   <button 
                    onClick={handlePeriodLog}
                    className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:brightness-105 active:scale-95 transition-all mt-4"
                   >
                     Log Cycle Entry
                   </button>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest px-2">Recent Logs</h3>
                <div className="space-y-3">
                  {(profile.periodLogs || []).length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[1.5rem] text-slate-300">
                      <Droplet size={32} opacity={0.3} />
                      <p className="text-sm font-bold">No entries logged yet.</p>
                    </div>
                  ) : (
                    profile.periodLogs.map(log => (
                      <div key={log.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center group hover:border-rose-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-rose-50 text-rose-400 rounded-xl"><Droplet size={20} /></div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">{log.date}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.flow} Flow • {log.mood}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
                      </div>
                    ))
                  )}
                </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'Report' && (
        <div className="bg-white p-8 lg:p-12 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-10 animate-in">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <FileText size={28} className="text-blue-400" /> Healing Summary Generator
                </h2>
                <p className="text-sm text-slate-500">Compile your recovery milestones, mood trends, and health data into a single clinical summary.</p>
             </div>
             <button 
              onClick={() => window.print()}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
             >
               <FileText size={18} /> Download Summary PDF
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              <ReportMetric icon={<Target className="text-pink-500" />} label="Recovery Milestones" value={`${profile.completedActivities.length} Tasks`} sub="Standard Progress" />
              <ReportMetric icon={<Droplet className="text-rose-400" />} label="Cycle Trends" value={`${(profile.periodLogs || []).length} Entries`} sub="Menstrual Return" />
              <ReportMetric icon={<Smile className="text-amber-400" />} label="Mood Stability" value="Stable" sub="EPDS Logged" />
              <ReportMetric icon={<Clock className="text-indigo-400" />} label="Healing Time" value="Month 1" sub="Postpartum Stage" />
              <ReportMetric icon={<Zap className="text-emerald-400" />} label="Points Gained" value={`${profile.completedActivities.length * 10} pts`} sub="Engagement Score" />
              <ReportMetric icon={<Award className="text-blue-400" />} label="Specialist Sync" value="Verified" sub="Care Connect Ready" />
           </div>

           <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center space-y-4">
              {/* Fix: Added missing import for ShieldCheck at top of file */}
              <ShieldCheck className="mx-auto text-emerald-400" size={40} />
              <div className="space-y-1">
                <p className="font-black text-slate-800">Private & Secure</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">This summary is generated locally for your personal use. You can securely share it with your OB-GYN or Physiotherapist during Care Connect sessions.</p>
              </div>
           </div>
        </div>
      )}

      {/* Session Modal */}
      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in">
           <div className="max-w-sm w-full bg-white rounded-[1.5rem] p-8 text-center space-y-6 shadow-2xl border border-white/20">
              <div className="space-y-2">
                 <h2 className="text-lg font-black text-slate-800">{sessionActive.title}</h2>
                 <p className="text-xs text-slate-500 italic leading-relaxed">"{sessionActive.description}"</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center shadow-inner">
                 <div className="text-6xl font-black tabular-nums tracking-tighter" style={{ color: theme.primary }}>05:00</div>
                 <div className="text-[10px] font-bold uppercase text-slate-300 mt-2 tracking-widest">Recovery Guide Active</div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }}
                  style={{ backgroundColor: theme.primary }}
                  className="w-full py-4 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-105 active:scale-95 transition-all"
                >
                  Confirm Completion
                </button>
                <button 
                  onClick={() => setSessionActive(null)}
                  className="w-full py-2 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 transition-all"
                >
                  Exit Session
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ActivityCard = ({ act, theme, isDone, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-[1.5rem] bg-white border transition-all cursor-pointer group flex items-start gap-4 hover-lift ${
        isDone ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-50 shadow-sm'
      }`}
    >
      <div 
        className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-all ${
          isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-300 group-hover:bg-white border border-transparent group-hover:border-slate-100'
        }`}
        style={{ color: !isDone ? theme.primary : '' }}
      >
        {isDone ? <CheckCircle size={22} /> : <Play size={22} fill="currentColor" />}
      </div>
      
      <div className="flex-1 space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`text-sm font-black leading-snug group-hover:text-pink-600 transition-colors ${isDone ? 'text-emerald-900' : 'text-slate-800'}`}>
            {act.title}
          </h4>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 whitespace-nowrap tracking-tighter">
            {act.frequency}
          </span>
        </div>
        
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 font-medium">{act.description}</p>

        <div className="flex items-center gap-4 pt-1">
           <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <Clock size={14} strokeWidth={2.5} />
              {act.duration} Min
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <TrendingUp size={14} strokeWidth={2.5} />
              Level {act.intensityScale}
           </div>
        </div>
      </div>
    </div>
  );
};

const ReportMetric = ({ icon, label, value, sub }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover-lift transition-all">
    <div className="p-4 bg-slate-50 rounded-2xl shadow-inner">{icon}</div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-slate-800 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-slate-300 italic">{sub}</p>
    </div>
  </div>
);

export default PhysicalRecovery;
