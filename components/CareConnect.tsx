
import React, { useState } from 'react';
import { UserProfile, Appointment, CommunityCircle } from '../types';
import { 
  Users, Calendar, Heart, Stethoscope, Phone, ShieldCheck, Landmark, Globe, Star, Info, ChevronRight, MessageCircle, X, Edit, RotateCcw, ExternalLink
} from 'lucide-react';
import { COLORS, HELPLINES, NGO_DATA, INSURANCE_DATA, EXPERT_DATA } from '../constants';
import { translations } from '../translations';

interface CareConnectProps {
  profile: UserProfile;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  circles: CommunityCircle[];
  setCircles: React.Dispatch<React.SetStateAction<CommunityCircle[]>>;
  addNotification: (title: string, text: string) => void;
}

const CareConnect: React.FC<CareConnectProps> = ({ 
  profile, appointments, setAppointments, circles, setCircles, addNotification 
}) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'Community' | 'Experts' | 'NGOs' | 'Insurance' | 'MyBookings'>('Community');
  const [expertFilter, setExpertFilter] = useState<'Physiotherapy' | 'OB-GYN' | 'Lactation'>('Physiotherapy');
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const handleRSVP = (id: string) => {
    setCircles(prev => prev.map(c => {
      if (c.id === id) {
        if (!c.isJoined) addNotification("Circle Joined", `Welcome to the ${c.name} sisterhood.`);
        return { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 };
      }
      return c;
    }));
  };

  const handleBook = (name: string, type: Appointment['type'], price: string) => {
    const newAppt: Appointment = {
      id: Date.now().toString(),
      specialistName: name,
      type,
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '11:30 AM',
      status: 'Upcoming',
      price
    };
    setAppointments(prev => [...prev, newAppt]);
    addNotification("Session Scheduled", `Confirmed appointment with ${name}. Details in My Sessions.`);
    setActiveSubTab('MyBookings');
  };

  const cancelAppointment = (id: string) => {
    const confirm = window.confirm("Are you sure you want to cancel this healing session?");
    if (confirm) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
      addNotification("Session Cancelled", "Your appointment has been removed from the active schedule.");
    }
  };

  const rescheduleAppointment = (id: string) => {
    const newDate = prompt("Enter new preferred date (YYYY-MM-DD):", "2024-05-15");
    if (newDate) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, status: 'Rescheduled' } : a));
      addNotification("Session Rescheduled", `Your session has been moved to ${newDate}.`);
    }
  };

  const filteredExperts = EXPERT_DATA.filter(e => e.category === expertFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in pb-20 px-1 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 lg:p-14 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-500 group hover:shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Verified Network</div>
          <h2 className="text-3xl lg:text-5xl font-black text-gray-800 leading-tight group-hover:translate-x-1 transition-transform">{t.care.title}</h2>
          <p className="text-sm lg:text-lg text-slate-400 font-medium italic max-w-lg">{t.care.subtitle}</p>
        </div>
        <a 
          href={`tel:${HELPLINES.india.number}`} 
          className="flex items-center gap-4 px-8 py-4 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 group/sos overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, #F43F5E, #BE123C)` }}
        >
          <Phone size={20} className="group-hover/sos:rotate-12 transition-transform" /> {t.care.helpline}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/sos:translate-y-0 transition-transform" />
        </a>
        <div className="absolute bottom-[-10%] right-[-5%] opacity-5 pointer-events-none group-hover:opacity-10 transition-all scale-150">
           <Heart size={200} />
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2 sticky top-[130px] lg:top-[150px] z-30 bg-white/50 backdrop-blur-md rounded-3xl py-2">
        <NavButton label={t.care.tabs.community} active={activeSubTab === 'Community'} onClick={() => setActiveSubTab('Community')} theme={theme} icon={<Users size={20} />} />
        <NavButton label={t.care.tabs.experts} active={activeSubTab === 'Experts'} onClick={() => setActiveSubTab('Experts')} theme={theme} icon={<Stethoscope size={20} />} />
        <NavButton label={t.care.tabs.ngo} active={activeSubTab === 'NGOs'} onClick={() => setActiveSubTab('NGOs')} theme={theme} icon={<Heart size={20} />} />
        <NavButton label={t.care.tabs.insurance} active={activeSubTab === 'Insurance'} onClick={() => setActiveSubTab('Insurance')} theme={theme} icon={<ShieldCheck size={20} />} />
        <NavButton label={t.care.tabs.sessions} active={activeSubTab === 'MyBookings'} onClick={() => setActiveSubTab('MyBookings')} theme={theme} icon={<Calendar size={20} />} />
      </div>

      <div className="space-y-10">
        {activeSubTab === 'Community' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
            {circles.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-8 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group shadow-sm flex flex-col justify-between hover:translate-y-[-8px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-slate-50 rounded-3xl group-hover:scale-110 transition-transform shadow-inner" style={{ color: theme.primary }}>
                      <Users size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Active Sisters</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">{c.name}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed italic opacity-80">"{c.description}"</p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl w-fit shadow-inner">
                    <Star size={14} className="text-amber-400 fill-amber-400" /> {c.members} {t.care.community.sistersJoined}
                  </div>
                </div>
                <button 
                  onClick={() => handleRSVP(c.id)}
                  className={`w-full py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 ${c.isJoined ? 'bg-slate-100 text-slate-400 shadow-none' : 'text-white'}`}
                  style={{ 
                    backgroundColor: c.isJoined ? '' : theme.primary,
                    background: c.isJoined ? '' : `linear-gradient(135deg, ${theme.primary}, ${theme.text})`
                  }}
                >
                  {c.isJoined ? 'Already joined' : t.care.community.joinSisters}
                  {!c.isJoined && <ChevronRight size={18} />}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'Experts' && (
          <div className="space-y-10 animate-in fade-in">
             <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-fit mx-auto md:mx-0 shadow-inner">
                {['Physiotherapy', 'OB-GYN', 'Lactation'].map((cat) => (
                   <button 
                    key={cat}
                    onClick={() => setExpertFilter(cat as any)}
                    className={`px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 ${expertFilter === cat ? 'bg-white shadow-md scale-[1.05] text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    style={{ color: expertFilter === cat ? theme.text : '' }}
                   >
                     {cat}
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {filteredExperts.map(expert => (
                 <div key={expert.name} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 group relative overflow-hidden shadow-sm hover:translate-y-[-4px]">
                   <div className="space-y-8 relative z-10">
                     <div className="flex items-center gap-8">
                       <div 
                        className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center font-black text-3xl shadow-inner group-hover:rotate-6 transition-all"
                        style={{ color: theme.primary }}
                       >
                         {expert.name[0]}
                       </div>
                       <div>
                         <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{expert.name}</h3>
                         <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: theme.primary }}>{expert.role}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-tighter opacity-70 bg-slate-50 px-3 py-1 rounded-lg w-fit">{expert.credentials}</p>
                       </div>
                     </div>
                     <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-[1.5rem] border border-slate-50 flex gap-5 shadow-inner">
                       <Info className="shrink-0" size={24} style={{ color: theme.primary }} />
                       <p className="text-sm font-bold text-slate-600 leading-relaxed italic opacity-80">"{expert.insight}"</p>
                     </div>
                   </div>
                   <div className="flex justify-between items-center pt-8 mt-10 border-t border-gray-50 relative z-10">
                      <div className="space-y-0.5">
                        <span className="text-2xl font-black text-gray-900 tracking-tight">{expert.price}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Per Consult</span>
                      </div>
                      <div className="flex gap-3">
                        <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all shadow-inner hover:scale-110 active:scale-90"><MessageCircle size={22} /></button>
                        <button 
                          onClick={() => handleBook(expert.name, expert.role, expert.price)}
                          className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3 text-white"
                          style={{ 
                            backgroundColor: theme.primary,
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.text})`
                          }}
                        >
                          {t.care.experts.book} <ChevronRight size={18} />
                        </button>
                      </div>
                   </div>
                   <div className="absolute top-[-20%] right-[-10%] w-48 h-48 rounded-full opacity-5 pointer-events-none group-hover:scale-110 transition-transform" style={{ backgroundColor: theme.primary }} />
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* NGO Support Tab Content */}
        {activeSubTab === 'NGOs' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-gray-900">{t.care.tabs.ngo}</h3>
                <Globe className="text-slate-300" size={24} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {NGO_DATA.map(ngo => (
                 <div key={ngo.name} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group">
                    <div className="space-y-6">
                       <div className="p-4 bg-emerald-50 text-emerald-500 rounded-[1.5rem] w-fit shadow-inner group-hover:scale-110 transition-transform"><Heart size={28} /></div>
                       <div className="space-y-2">
                          <h4 className="text-xl font-black text-slate-900 tracking-tight">{ngo.name}</h4>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{ngo.area}</span>
                       </div>
                    </div>
                    <div className="pt-8 mt-6 border-t border-slate-50 space-y-4">
                       <div className="flex items-center justify-between text-xs font-black text-slate-600">
                          <span className="uppercase tracking-widest">Contact</span>
                          <span className="text-emerald-500">{ngo.contact}</span>
                       </div>
                       <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                          Visit Website <ExternalLink size={14} />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Insurance Tab Content */}
        {activeSubTab === 'Insurance' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-gray-900">{t.care.tabs.insurance}</h3>
                <Landmark className="text-slate-300" size={24} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {INSURANCE_DATA.map(ins => (
                  <div key={ins.bank} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-8 items-center group">
                     <div className="p-6 bg-slate-50 text-slate-800 rounded-3xl shadow-inner group-hover:rotate-6 transition-all"><Landmark size={32} /></div>
                     <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                           <h4 className="text-xl font-black text-slate-900">{ins.bank}</h4>
                           <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest">Partner</span>
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{ins.plan}</p>
                        <p className="text-sm font-bold text-slate-600 italic">"Includes {ins.benefit.toLowerCase()} for ages {ins.minAge}+"</p>
                     </div>
                     <button className="px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95">Inquire Now</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* My Sessions Restored with Standard Sizing */}
        {activeSubTab === 'MyBookings' && (
          <div className="space-y-8 animate-in fade-in">
            <h3 className="text-2xl font-black text-gray-900 px-2">{t.care.tabs.sessions}</h3>
            {appointments.length === 0 ? (
              <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-6 shadow-inner grayscale opacity-60">
                 <div className="p-8 bg-slate-50 rounded-full animate-pulse"><Calendar size={64} className="text-slate-300" /></div>
                 <div className="space-y-1">
                    <p className="text-slate-500 font-black text-xl">Your calendar is currently clear</p>
                    <p className="text-sm text-slate-400 font-medium">Ready to take the next step in your recovery?</p>
                 </div>
                 <button onClick={() => setActiveSubTab('Experts')} className="px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-[1.5rem] hover:shadow-2xl transition-all active:scale-95">Discover Specialists</button>
              </div>
            ) : (
              <div className="grid gap-8">
                {appointments.map(a => (
                  <div key={a.id} className="p-8 bg-white rounded-[2.5rem] border border-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
                    {a.status === 'Cancelled' && <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10"><span className="px-6 py-2 bg-red-100 text-red-600 rounded-xl font-black text-xs uppercase tracking-[0.25em] shadow-lg animate-pulse">Cancelled</span></div>}
                    <div className="flex items-center gap-6">
                       <div 
                        className="p-5 bg-slate-50 rounded-3xl group-hover:scale-110 transition-transform shadow-inner"
                        style={{ color: theme.primary }}
                       ><Stethoscope size={32} /></div>
                       <div className="space-y-1">
                         <h4 className="font-black text-gray-900 text-xl tracking-tight leading-tight">{a.specialistName}</h4>
                         <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{a.type}</p>
                         <div className="flex items-center gap-4 mt-3">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                             a.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600' : 
                             a.status === 'Rescheduled' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                           }`}>{a.status}</span>
                         </div>
                       </div>
                    </div>
                    <div className="mt-8 md:mt-0 flex flex-col md:items-end gap-3 text-left md:text-right">
                       <div className="space-y-1">
                         <span className="block text-2xl font-black text-gray-900 tracking-tighter">{a.date}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">{a.time}</span>
                       </div>
                       {a.status !== 'Cancelled' && (
                         <div className="flex gap-3 mt-2">
                            <button onClick={() => rescheduleAppointment(a.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all shadow-inner active:scale-90"><RotateCcw size={18} /></button>
                            <button onClick={() => cancelAppointment(a.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-inner active:scale-90"><X size={18} /></button>
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NavButton = ({ label, active, onClick, theme, icon }: any) => (
  <button 
    onClick={onClick}
    className={`shrink-0 flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-[13px] transition-all border shadow-sm group active:scale-95 ${
      active ? 'bg-white border-slate-200 z-10 scale-[1.05] ring-8 ring-slate-50 translate-y-[-2px]' : 'bg-white text-slate-400 border-gray-100 hover:bg-slate-50 hover:translate-y-[-1px]'
    }`}
    style={{ 
      color: active ? theme.text : '',
      boxShadow: active ? `0 15px 30px ${theme.primary}11` : ''
    }}
  >
    <div className={`transition-transform group-hover:scale-110 ${active ? 'animate-bounce-slow' : ''}`} style={{ color: active ? theme.primary : '' }}>{icon}</div>
    <span className="tracking-tight">{label}</span>
  </button>
);

export default CareConnect;
