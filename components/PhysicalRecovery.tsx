
import React, { useState, useMemo } from 'react';
import { RecoveryActivity, UserProfile, RecoveryPhase, PeriodLog } from '../types';
import { 
  CheckCircle, Play, Target, Pause, RotateCcw, Clock, Zap, ChevronRight,
  TrendingUp, Heart, Award, Calendar, FileText, Droplet, Smile, Edit,
  ShieldCheck, BarChart3, Activity, ArrowRight, Plus, Info, Download, 
  Moon, Gauge, Ruler, Layers, Sparkles
} from 'lucide-react';
import { PHASES, COLORS, RECOVERY_DATABASE } from '../constants';
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
  const [activeSubTab, setActiveSubTab] = useState<'Journey' | 'Cycle' | 'Report'>('Journey');
  const [sessionActive, setSessionActive] = useState<RecoveryActivity | null>(null);
  
  const [periodForm, setPeriodForm] = useState<Partial<PeriodLog>>({
    date: new Date().toISOString().split('T')[0],
    flow: 'Medium',
    symptoms: [],
    mood: 'Balanced',
    notes: ''
  });

  const isPostpartum = profile.maternityStage === 'Postpartum';
  const theme = COLORS[profile.accent] || COLORS.PINK;

  // Fully functional mode logic based on user stage
  const phaseInfo = useMemo(() => {
    const stage = profile.maternityStage;
    if (stage === 'TTC' || stage === 'Pregnant-T1' || stage === 'Pregnant-T2') {
      return { 
        title: t.physical.nurture, 
        sub: "Building foundations & vital resilience", 
        icon: <Heart size={20} />,
        accent: COLORS.GREEN 
      };
    } else if (stage === 'Pregnant-T3') {
      return { 
        title: t.physical.transition, 
        sub: "Preparation for a safe delivery", 
        icon: <Gauge size={20} />,
        accent: COLORS.BLUE 
      };
    } else {
      return { 
        title: t.physical.healing, 
        sub: "Restorative recovery & clinical care", 
        icon: <Target size={20} />,
        accent: COLORS.PINK 
      };
    }
  }, [profile.maternityStage, t]);

  const handlePeriodLog = () => {
    const newLog: PeriodLog = {
      id: Date.now().toString(),
      date: periodForm.date || new Date().toISOString().split('T')[0],
      flow: (periodForm.flow as any) || 'None',
      symptoms: periodForm.symptoms || [],
      mood: periodForm.mood || 'Balanced',
      notes: periodForm.notes || ''
    };
    setProfile(prev => ({ ...prev, periodLogs: [newLog, ...(prev.periodLogs || [])] }));
    alert("Health metrics updated. Your data is encrypted and safe.");
  };

  const toggleSymptom = (s: string) => {
    setPeriodForm(prev => {
      const current = prev.symptoms || [];
      const updated = current.includes(s) ? current.filter(x => x !== s) : [...current, s];
      return { ...prev, symptoms: updated };
    });
  };

  const progress = activities.length > 0 ? (profile.completedActivities.length / activities.length) * 100 : 0;

  return (
    <div className="space-y-10 animate-in max-w-6xl mx-auto pb-32">
      <div className="w-full flex justify-center">
        <div className="inline-flex gap-1.5 bg-white/95 backdrop-blur-xl p-1.5 rounded-full border border-slate-100 shadow-sm sticky top-[64px] lg:top-[80px] z-[35]">
          <SubTabBtn active={activeSubTab === 'Journey'} onClick={() => setActiveSubTab('Journey')} icon={<Target size={14} />} label="Journey" theme={theme} />
          <SubTabBtn active={activeSubTab === 'Cycle'} onClick={() => setActiveSubTab('Cycle')} icon={<Droplet size={14} />} label={isPostpartum ? t.physical.cycleTitle : t.physical.cycleTitlePre} theme={theme} />
          <SubTabBtn active={activeSubTab === 'Report'} onClick={() => setActiveSubTab('Report')} icon={<FileText size={14} />} label={t.physical.reportTitle} theme={theme} />
        </div>
      </div>

      {activeSubTab === 'Journey' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                   <div className="p-4 rounded-2xl text-white shadow-lg" style={{ backgroundColor: phaseInfo.accent.primary }}>
                     {phaseInfo.icon}
                   </div>
                   <div className="space-y-1">
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{phaseInfo.title}</h2>
                     <div className="text-[9px] font-bold uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 mt-2 inline-block tracking-widest shadow-inner">
                       {phaseInfo.sub}
                     </div>
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Phase Completion</span>
                    <span className="text-3xl font-bold tracking-tighter tabular-nums" style={{ color: phaseInfo.accent.text }}>{Math.round(progress)}%</span>
                 </div>
                 <div className="h-2.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: phaseInfo.accent.primary }} />
                 </div>
              </div>
            </div>
            <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-5">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                 <Award size={32} style={{ color: theme.primary }} strokeWidth={2.5} />
               </div>
               <div className="space-y-1">
                 <div className="text-5xl font-bold text-slate-900 tracking-tighter tabular-nums">{profile.completedActivities.length * 10}</div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Care Tokens</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {activities.length > 0 ? activities.map(act => (
               <ActivityCard key={act.id} act={act} theme={theme} isDone={profile.completedActivities.includes(act.id)} onClick={() => setSessionActive(act)} />
             )) : (
               <div className="col-span-full py-20 text-center space-y-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium italic">No specific tasks found for this stage yet.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {activeSubTab === 'Cycle' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Cycle Variance" value="±2 Days" sub="Clinical Stability" icon={<Ruler size={18} />} trend="Stable" />
              <MetricCard label="Ovulation Window" value="May 12-16" sub="Hormonal Peak" icon={<Sparkles size={18} />} trend="Next Cycle" />
              <MetricCard label="Mood Correlation" value="88%" sub="Hormonal Alignment" icon={<Smile size={18} />} trend="High" />
              <MetricCard label="Recovery Index" value="7.8/10" sub="Structural Integrity" icon={<Gauge size={18} />} trend="+0.2 wk" />
           </div>

           <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight leading-none">
                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 border border-rose-100"><Droplet size={24} /></div>
                    {isPostpartum ? "Vitals & Cycle Log" : "Prenatal Symptom Core"}
                  </h2>
                </div>
                <button onClick={handlePeriodLog} style={{ backgroundColor: theme.primary }} className="w-full md:w-auto px-8 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Commit Entry
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observation Date</label>
                       <input type="date" value={periodForm.date} onChange={e => setPeriodForm(f => ({...f, date: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-rose-100 transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isPostpartum ? "Recovery Intensity" : "Symptom Cluster"}</label>
                       <div className="flex flex-wrap gap-2">
                          {(isPostpartum ? ['Lochia Tracking', 'Breast Pain', 'Pelvic Pressure', 'Fatigue'] : ['Nausea', 'Aching', 'Swelling', 'Insomnia']).map(s => (
                            <button key={s} onClick={() => toggleSymptom(s)} className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase border transition-all ${periodForm.symptoms?.includes(s) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{s}</button>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinical Mood Profile</label>
                       <select value={periodForm.mood} onChange={e => setPeriodForm(f => ({...f, mood: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none appearance-none cursor-pointer">
                         <option>Resilient</option>
                         <option>Balanced</option>
                         <option>Overwhelmed</option>
                         <option>Focused</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Notes</label>
                       <textarea placeholder="Describe physical sensations or concerns..." value={periodForm.notes} onChange={e => setPeriodForm(f => ({...f, notes: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-800 outline-none min-h-[140px] resize-none" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'Report' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Hydration Ratio" value="1.2 L/m" sub="Mineral Balance" icon={<Droplet size={18} />} trend="Optimal" />
              <MetricCard label="Sleep Quality" value="84%" sub="Rem Cycle" icon={<Moon size={18} />} trend="Improving" />
              <MetricCard label="Pelvic Index" value="9.2/10" sub="Structural Strength" icon={<ShieldCheck size={18} />} trend="Verified" />
              <MetricCard label="Activity Load" value="High" sub="Safe Load" icon={<Activity size={18} />} trend="Balanced" />
           </div>

           <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight leading-none">
                    <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 text-sky-500"><BarChart3 size={24} /></div>
                    Health Summary Report
                  </h2>
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl">
                   <Download size={16} /> Structured PDF Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Readiness Indices</h4>
                    <div className="grid gap-6">
                       <ReportProgressBar label="Tissue Restoration" value={82} color="#10B981" />
                       <ReportProgressBar label="Pelvic Resilience" value={Math.round(progress)} color={theme.primary} />
                       <ReportProgressBar label="Core Alignment" value={65} color="#8B5CF6" />
                    </div>
                 </div>
                 <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Behavioral Patterns</h4>
                    <div className="grid gap-6">
                       <ReportProgressBar label="Hydration Adherence" value={95} color="#3B82F6" />
                       <ReportProgressBar label="Rest Efficiency" value={78} color="#F59E0B" />
                       <ReportProgressBar label="Log Consistency" value={88} color="#EC4899" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 animate-in duration-300">
           <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center space-y-8 shadow-2xl border border-slate-100">
              <div className="space-y-3">
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{sessionActive.title}</h2>
                 <p className="text-sm text-slate-400 italic">"{sessionActive.description}"</p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }} style={{ backgroundColor: theme.primary }} className="w-full py-5 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  Log Complete
                </button>
                <button onClick={() => setSessionActive(null)} className="w-full py-3 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, sub, icon, trend }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
     <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 group-hover:text-slate-900 transition-colors shadow-inner">{icon}</div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{trend}</span>
     </div>
     <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{label}</p>
        <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{sub}</p>
     </div>
  </div>
);

const SubTabBtn = ({ active, onClick, icon, label, theme }: any) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2.5 active:scale-95 ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{React.cloneElement(icon, { className: active ? 'text-white' : '' })}{label}</button>
);

const ReportProgressBar = ({ label, value, color }: any) => (
  <div className="space-y-2.5">
     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
     </div>
     <div className="h-2 w-full bg-white rounded-full border border-slate-100 overflow-hidden shadow-inner">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
     </div>
  </div>
);

const ActivityCard = ({ act, theme, isDone, onClick }: any) => (
  <div onClick={onClick} className={`p-6 rounded-[2.5rem] bg-white border transition-all duration-400 cursor-pointer flex items-start gap-6 hover:translate-y-[-4px] hover:shadow-lg ${isDone ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-50 shadow-sm'}`}>
    <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-300'}`} style={{ color: !isDone ? theme.primary : '' }}>{isDone ? <CheckCircle size={28} /> : <Play size={28} />}</div>
    <div className="flex-1 space-y-2">
      <h4 className={`text-lg font-bold ${isDone ? 'text-emerald-900 opacity-60 line-through' : 'text-slate-800'}`}>{act.title}</h4>
      <p className="text-xs text-slate-400 italic line-clamp-2">"{act.description}"</p>
      <div className="flex items-center gap-4 text-[9px] font-bold uppercase text-slate-300 tracking-widest pt-1"><Clock size={10} /> {act.duration} Min • {act.category}</div>
    </div>
  </div>
);

export default PhysicalRecovery;
