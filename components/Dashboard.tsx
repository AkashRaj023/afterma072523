
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplet, Moon, Pill, TrendingUp, AlertCircle, 
  CheckCircle2, Plus, Calendar as CalIcon, Activity,
  Leaf, Bell, X, Zap, ArrowRight, Star, Play, Camera
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Line
} from 'recharts';
import { UserProfile, HealthLog } from '../types';
import { getDailyInspiration } from '../services/geminiService';
import { NUTRITION_GUIDE, RECOVERY_DATABASE, COLORS } from '../constants';
import { translations } from '../translations';

interface DashboardProps {
  profile: UserProfile;
  logs: HealthLog[];
  onAddLog: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, logs, onAddLog }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [inspiration, setInspiration] = useState(t.dashboard.inspiration);
  const lastLog = logs[logs.length - 1];
  // Fix: Property 'pink' does not exist on type COLORS, changed to 'PINK'
  const theme = COLORS[profile.accent] || COLORS.PINK;

  useEffect(() => {
    const fetchInspiration = async () => {
      // Small optimization: don't fetch from AI for translation if basic fallback is fine
      // but the service could technically be multi-lingual too.
      const msg = await getDailyInspiration(lastLog?.moodLevel || 5);
      setInspiration(msg);
    };
    fetchInspiration();
  }, [lastLog, lang]);

  const chartData = useMemo(() => {
    if (logs.length === 0) return [{ time: 'Today', mood: 5, pain: 2 }];
    return logs.slice(-7).map(l => ({
      time: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: l.moodLevel,
      pain: l.painLevel
    }));
  }, [logs]);

  const nextActivity = useMemo(() => {
    return RECOVERY_DATABASE
      .filter(a => !a.typeSpecific || a.typeSpecific === profile.deliveryType)
      .filter(a => profile.journeySettings.pace === 'moderate' || a.intensityScale <= 5)
      .find(a => a.phase === profile.currentPhase && !profile.completedActivities.includes(a.id));
  }, [profile.currentPhase, profile.completedActivities, profile.journeySettings.pace, profile.deliveryType]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-10 animate-in fade-in duration-500 relative">
      {/* Gentle Header Banner */}
      <div 
        className="rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-12 text-white shadow-xl relative overflow-hidden transition-all duration-700" 
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.text}99)` }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center lg:items-center gap-6 lg:gap-8 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
            {/* Profile Pic Display */}
            <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-[1.5rem] lg:rounded-[2rem] bg-white/20 backdrop-blur-md border-4 border-white/20 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl lg:text-3xl font-black text-white">{profile.name[0]}</span>
              )}
            </div>

            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-2xl lg:text-4xl font-black tracking-tight" style={{ color: theme.bg }}>{t.common.welcome}, {profile.name}</h2>
              <p className="opacity-95 max-w-lg italic text-sm lg:text-xl leading-relaxed font-medium" style={{ color: theme.bg }}>"{inspiration}"</p>
              <div className="pt-2 flex flex-wrap gap-2 lg:gap-4 justify-center lg:justify-start">
                 <div className="flex items-center gap-2 bg-white/20 px-4 lg:px-5 py-1.5 lg:py-2 rounded-full backdrop-blur-md border border-white/10">
                   <Zap size={14} className="text-amber-200" fill="currentColor" />
                   <span className="font-bold text-[10px] lg:text-sm" style={{ color: theme.bg }}>{profile.streakCount} {t.dashboard.streakSuffix}</span>
                 </div>
                 <div className="flex items-center gap-2 bg-white/20 px-4 lg:px-5 py-1.5 lg:py-2 rounded-full backdrop-blur-md border border-white/10">
                   <Star size={14} className="text-white opacity-80" fill="currentColor" />
                   <span className="font-bold text-[10px] lg:text-sm" style={{ color: theme.bg }}>{profile.completedActivities.length * 20} {t.dashboard.progressSuffix}</span>
                 </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onAddLog}
            className="bg-white px-8 lg:px-10 py-3 lg:py-4 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 lg:gap-3 shrink-0 text-sm lg:text-base"
            style={{ color: theme.text }}
          >
            <Plus size={20} />
            {t.dashboard.logMoment}
          </button>
        </div>
        <div className="absolute bottom-[-15%] right-[-5%] opacity-10 pointer-events-none scale-150" style={{ color: theme.bg }}>
          <Leaf size={250} />
        </div>
      </div>

      {/* Adaptive Gentle Step Card */}
      {nextActivity && !profile.journeySettings.isPaused && (
        <div 
          className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border-2 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6 group hover:shadow-md transition-all cursor-pointer"
          style={{ borderColor: theme.bg }}
        >
           <div className="flex items-center gap-4 lg:gap-6 w-full lg:w-auto">
              <div 
                className="h-12 w-12 lg:h-16 lg:w-16 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-inner group-hover:text-white transition-colors shrink-0"
                style={{ backgroundColor: theme.bg, color: theme.primary }}
              >
                 <Play fill="currentColor" size={20} />
              </div>
              <div className="space-y-0.5 lg:space-y-1">
                 <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest" style={{ color: theme.primary }}>{t.dashboard.nextStep}</span>
                 <h3 className="text-lg lg:text-2xl font-black text-gray-800 line-clamp-1">{nextActivity.title}</h3>
                 <p className="text-xs lg:text-sm text-gray-400 font-medium line-clamp-1">{nextActivity.description}</p>
              </div>
           </div>
           <button 
            className="w-full md:w-auto px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl font-black flex items-center justify-center gap-2 group-hover:text-white transition-all shadow-sm text-xs lg:text-sm"
            style={{ backgroundColor: theme.bg, color: theme.text }}
           >
             {t.dashboard.startSoftly} <ArrowRight size={16} />
           </button>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard icon={<Droplet className="text-blue-400" />} label={t.dashboard.stats.hydration} value={`${lastLog?.waterIntake || 0}/10`} unit="" color="bg-blue-50/50" />
        <StatCard icon={<Moon className="text-indigo-300" />} label={t.dashboard.stats.rest} value={`${lastLog?.sleepHours || 0}`} unit="" color="bg-indigo-50/50" />
        <StatCard icon={<Pill className="text-emerald-300" />} label={t.dashboard.stats.selfcare} value={lastLog?.medicationsTaken ? "Done" : "1 Task"} unit="" color="bg-emerald-50/50" />
        <StatCard icon={<Activity className="text-rose-300" />} label={t.dashboard.stats.kegel} value={`${lastLog?.kegelCount || 0}`} unit="" color="bg-rose-50/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-sm border border-slate-50">
          <div className="mb-6 lg:mb-10">
            <h3 className="text-xl lg:text-2xl font-black text-gray-800">{t.dashboard.healingPulse}</h3>
            <p className="text-xs lg:text-sm text-slate-400 font-bold">{t.dashboard.healingPulseSub}</p>
          </div>
          <div className="h-48 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 10]} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="mood" stroke={theme.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorMood)" />
                <Line type="monotone" dataKey="pain" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="6 6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-sm border border-slate-50 flex flex-col justify-between">
           <h3 className="text-lg lg:text-xl font-black text-gray-800 flex items-center gap-3">
             <Leaf size={20} className="text-emerald-300" />
             {t.dashboard.warmNutrition}
           </h3>
           <div className="space-y-4 my-6 lg:my-8">
              {NUTRITION_GUIDE.slice(0, 2).map((item, idx) => (
                <div key={idx} className="p-4 lg:p-5 bg-slate-50/50 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 space-y-2 lg:space-y-3">
                   <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-widest">{item.title}</h4>
                   <div className="flex flex-wrap gap-1.5 lg:gap-2">
                     {item.items.map(i => <span key={i} className="text-[9px] lg:text-[10px] bg-white px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full font-bold text-slate-500 shadow-sm">{i}</span>)}
                   </div>
                   <p className="text-[10px] lg:text-[11px] text-emerald-600 font-bold italic">{item.benefit}</p>
                </div>
              ))}
           </div>
           <button className="w-full py-3 lg:py-4 border-2 border-dashed rounded-[1.5rem] lg:rounded-3xl font-black text-xs lg:text-sm hover:opacity-70 transition-colors" style={{ color: theme.text, borderColor: theme.primary }}>
              {t.dashboard.recipes}
           </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit, color }: any) => (
  <div className={`p-4 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-white flex flex-col justify-between hover:scale-105 transition-all cursor-default ${color}`}>
    <div className="flex items-center gap-2 lg:gap-3 text-slate-500 font-black mb-4 lg:mb-6">
      <div className="p-1.5 lg:p-2 bg-white/60 rounded-lg">{icon}</div>
      <span className="text-[8px] lg:text-[10px] uppercase tracking-widest line-clamp-1">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl lg:text-4xl font-black text-slate-800">{value}</span>
      <span className="text-[8px] lg:text-xs text-slate-400 font-black uppercase">{unit}</span>
    </div>
  </div>
);

export default Dashboard;
