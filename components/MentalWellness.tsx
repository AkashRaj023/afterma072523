
import React, { useState, useEffect } from 'react';
import { 
  Brain, Heart, Edit3, Sparkles, MessageCircle, AlertTriangle, Phone, ShieldCheck, 
  CheckSquare, Music, Star, ChevronRight, Activity, Zap, Moon, X, Stethoscope, 
  Search, Shield, Gift, Smile
} from 'lucide-react';
import { EPDS_QUESTIONS, HELPLINES, STABILIZATION_TASKS, COLORS } from '../constants';
import { UserProfile } from '../types';
import { translations } from '../translations';
import { getTriageAnalysis } from '../services/geminiService';

interface MentalProps {
  profile: UserProfile;
}

const MentalWellness: React.FC<MentalProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [showCheckin, setShowCheckin] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showTriage, setShowTriage] = useState(false);
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  // Ritual logic
  const [checkedRituals, setCheckedRituals] = useState<Record<number, boolean>>({});
  const [showReward, setShowReward] = useState(false);

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isPostpartum = profile.maternityStage === 'Postpartum';

  const symptomsList = isPostpartum 
    ? ['High Fever', 'Heavy Bleeding', 'Severe Breast Pain', 'Extreme Sadness', 'Leg Swelling', 'Vision Blurriness']
    : ['Severe Nausea', 'Early Contractions', 'Headache', 'Reduced Movement', 'Spotting', 'Dizziness'];

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    if (currentQuestion < EPDS_QUESTIONS.length - 1 && isPostpartum) {
      setCurrentQuestion(prev => prev + 1);
      setAnswers(newAnswers);
    } else {
      setShowCheckin(false);
      setCurrentQuestion(0);
      setAnswers([]);
      alert("Self-reflection saved. You're doing great.");
    }
  };

  const handleTriage = async () => {
    if (selectedSymptoms.length === 0) return;
    setTriageLoading(true);
    const result = await getTriageAnalysis(selectedSymptoms, profile);
    setTriageResult(result);
    setTriageLoading(false);
  };

  const toggleRitual = (idx: number) => {
    const isNewCheck = !checkedRituals[idx];
    setCheckedRituals(p => ({ ...p, [idx]: isNewCheck }));
    if (isNewCheck) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16 pb-32 animate-in relative">
      {/* Teddy Bear Reward Overlay */}
      {showReward && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-500">
           <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[4rem] border-4 border-rose-100 shadow-2xl flex flex-col items-center gap-6 scale-110">
              <div className="text-8xl animate-bounce-slow">🧸</div>
              <div className="text-center space-y-2">
                 <h4 className="text-3xl font-black text-slate-900 tracking-tight">Warm Hug!</h4>
                 <div className="flex gap-1 justify-center">
                    {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />)}
                 </div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">{t.mental.ritualReward}</p>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[3.5rem] shadow-[0_10px_60px_rgba(0,0,0,0.03)] border border-white/60 col-span-1 lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{isPostpartum ? "Emotional Sanctuary" : "Prenatal Serenity"}</h2>
              <p className="text-slate-400 font-medium italic text-base lg:text-lg opacity-80 leading-relaxed">"{isPostpartum ? t.mental.subtitle : "A safe harbor for your mind during pregnancy."}"</p>
            </div>
            <div className="h-20 w-20 bg-slate-50/50 rounded-[2rem] text-slate-200 flex items-center justify-center shadow-inner border border-white">
               <ShieldCheck size={40} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <MentalAction icon={<Heart className="text-rose-400" />} title={isPostpartum ? "EPDS Screening" : "Bonding Check-in"} subtitle="Guided Reflection" onClick={() => setShowCheckin(true)} theme={theme} />
            <MentalAction icon={<Stethoscope className="text-emerald-400" />} title="AI Symptom Triage" subtitle="Clinical Logic" onClick={() => setShowTriage(true)} theme={theme} />
            <MentalAction icon={<Sparkles className="text-amber-400" />} title="Grounding Loops" subtitle="Safe Audio" onClick={() => {}} theme={theme} />
            <MentalAction icon={<Edit3 className="text-indigo-400" />} title="Safe Journal" subtitle="Private Space" onClick={() => {}} theme={theme} />
          </div>

          {showTriage && (
            <div className="fixed inset-0 z-[130] bg-white/95 backdrop-blur-xl p-8 lg:p-20 flex flex-col items-center animate-in zoom-in-95 duration-300">
               <button onClick={() => {setShowTriage(false); setSelectedSymptoms([]); setTriageResult("");}} className="absolute top-10 right-10 p-4 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
               <div className="max-w-3xl w-full space-y-10">
                  <div className="text-center space-y-3">
                    <div className="p-4 bg-emerald-50 text-emerald-500 rounded-3xl w-fit mx-auto shadow-inner mb-4"><Search size={32} /></div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">AI Clinical Triage</h3>
                    <p className="text-slate-400 font-medium italic">Select any active symptoms for an immediate supportive assessment.</p>
                  </div>

                  {!triageResult ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {symptomsList.map(s => (
                            <button key={s} onClick={() => setSelectedSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])} className={`p-6 rounded-3xl border-2 transition-all font-bold text-xs uppercase tracking-widest text-center h-full flex flex-col items-center justify-center gap-2 ${selectedSymptoms.includes(s) ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                               {s}
                            </button>
                          ))}
                       </div>
                       <button onClick={handleTriage} disabled={selectedSymptoms.length === 0 || triageLoading} className="w-full py-6 rounded-full bg-slate-900 text-white font-bold text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-4">
                          {triageLoading ? <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" /> : <><Shield size={20} /> Analyze Now</>}
                       </button>
                    </div>
                  ) : (
                    <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3.5rem] space-y-8 animate-in slide-in-from-bottom duration-500">
                       <div className="flex items-start gap-6">
                          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-50 text-emerald-500"><AlertTriangle size={24} /></div>
                          <div className="space-y-4 prose prose-slate">
                             <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{triageResult}</div>
                          </div>
                       </div>
                       <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
                          <button onClick={() => {setShowTriage(false); setSelectedSymptoms([]); setTriageResult("");}} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-500">Close Triage</button>
                          <a href={`tel:${HELPLINES.india.number}`} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest text-center shadow-lg shadow-rose-100">Contact Emergency OB-GYN</a>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {showCheckin && (
            <div className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-xl p-10 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
               <button onClick={() => setShowCheckin(false)} className="absolute top-10 right-10 p-4 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
               <div className="max-w-xl w-full text-center space-y-12">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reflection {currentQuestion + 1} of {EPDS_QUESTIONS.length}</span>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{EPDS_QUESTIONS[currentQuestion].question}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 w-full">
                     {EPDS_QUESTIONS[currentQuestion].options.map((choice, idx) => (
                       <button key={choice} onClick={() => handleAnswer(idx)} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-900 hover:shadow-lg transition-all font-bold text-slate-700 text-left flex items-center justify-between group">
                         {choice} <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #10B981, #064E3B)' }}>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-200 opacity-80">Safety First</p>
                <h4 className="text-2xl font-bold tracking-tight">Support Available</h4>
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="p-3 bg-white/20 rounded-xl"><Phone size={20} /></div>
                    <div>
                      <p className="text-xs font-bold">{HELPLINES.india.number}</p>
                      <p className="text-[9px] uppercase tracking-widest text-emerald-100 opacity-70">Verified Helpline</p>
                    </div>
                 </div>
              </div>
              <div className="absolute top-[-20%] right-[-20%] opacity-10 pointer-events-none scale-[1.5]">
                 <ShieldCheck size={200} />
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">{t.mental.ritualTitle}</h4>
              <div className="space-y-4">
                 {STABILIZATION_TASKS.map((task, i) => (
                   <button 
                    key={i} 
                    onClick={() => toggleRitual(i)}
                    className="w-full flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-center text-left hover:bg-slate-100 transition-colors group active:scale-[0.98]"
                   >
                      <div className={`p-2.5 rounded-xl shadow-sm border transition-all ${checkedRituals[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-50 text-slate-100'}`}>
                         {checkedRituals[i] ? <CheckSquare size={16} /> : <div className="w-4 h-4" />}
                      </div>
                      <p className={`text-xs font-bold leading-tight transition-all ${checkedRituals[i] ? 'text-slate-400 line-through italic' : 'text-slate-700'}`}>"{task}"</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MentalAction = ({ icon, title, subtitle, onClick, theme }: any) => (
  <button onClick={onClick} className="flex flex-col items-center p-10 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[3rem] hover:border-white shadow-sm hover:shadow-2xl transition-all duration-500 text-center group active:scale-[0.98]">
    <div className="p-6 bg-slate-50 rounded-[1.75rem] mb-6 group-hover:bg-white group-hover:scale-110 transition-all shadow-inner border border-transparent group-hover:border-slate-100">{React.cloneElement(icon as React.ReactElement, { size: 32, strokeWidth: 2.5 } as any)}</div>
    <span className="font-bold text-slate-900 text-xl mb-1.5 tracking-tight leading-none">{title}</span>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</span>
  </button>
);

export default MentalWellness;
