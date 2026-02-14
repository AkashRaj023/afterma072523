
import React, { useState } from 'react';
import { UserProfile, Appointment, CommunityCircle } from '../types';
import { 
  Users, Calendar, Heart, Stethoscope, Phone, ShieldCheck, Landmark, Globe, Star, Info, ChevronRight, MessageCircle
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
  const theme = COLORS[profile.accent] || COLORS.pink;

  const handleRSVP = (id: string) => {
    setCircles(prev => prev.map(c => {
      if (c.id === id) {
        if (!c.isJoined) addNotification("Circle Joined", `Welcome to the ${c.name} circle.`);
        return { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 };
      }
      return c;
    }));
  };

  const handleBook = (name: string, type: Appointment['type']) => {
    const newAppt: Appointment = {
      id: Date.now().toString(),
      specialistName: name,
      type,
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '10:00 AM',
      status: 'Upcoming'
    };
    setAppointments(prev => [...prev, newAppt]);
    addNotification("Session Scheduled", `Your healing session with ${name} is confirmed.`);
    setActiveSubTab('MyBookings');
  };

  const filteredExperts = EXPERT_DATA.filter(e => e.category === expertFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-gray-50 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-800 leading-tight">{t.care.title}</h2>
          <p className="text-sm lg:text-base text-slate-400 font-medium italic">{t.care.subtitle}</p>
        </div>
        <a href={`tel:${HELPLINES.india.number}`} className="flex items-center gap-3 px-8 py-4 bg-rose-50 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow">
          <Phone size={18} /> {t.care.helpline}
        </a>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        <NavButton label={t.care.tabs.community} active={activeSubTab === 'Community'} onClick={() => setActiveSubTab('Community')} theme={theme} icon={<Users size={18} />} />
        <NavButton label={t.care.tabs.experts} active={activeSubTab === 'Experts'} onClick={() => setActiveSubTab('Experts')} theme={theme} icon={<Stethoscope size={18} />} />
        <NavButton label={t.care.tabs.ngo} active={activeSubTab === 'NGOs'} onClick={() => setActiveSubTab('NGOs')} theme={theme} icon={<Heart size={18} />} />
        <NavButton label={t.care.tabs.insurance} active={activeSubTab === 'Insurance'} onClick={() => setActiveSubTab('Insurance')} theme={theme} icon={<ShieldCheck size={18} />} />
        <NavButton label={t.care.tabs.sessions} active={activeSubTab === 'MyBookings'} onClick={() => setActiveSubTab('MyBookings')} theme={theme} icon={<Calendar size={18} />} />
      </div>

      <div className="space-y-6">
        {activeSubTab === 'Community' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {circles.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 space-y-6 hover:shadow-xl transition-all group">
                <h3 className="text-xl font-black text-gray-800">{c.name}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{c.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Users size={14} /> {c.members} mothers healing together
                </div>
                <button 
                  onClick={() => handleRSVP(c.id)}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${c.isJoined ? 'bg-slate-100 text-slate-400 shadow-none' : 'text-slate-800 hover:shadow-md'}`}
                  style={{ backgroundColor: c.isJoined ? '' : theme.primary }}
                >
                  {c.isJoined ? 'Member' : 'Join Discussion'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'Experts' && (
          <div className="space-y-8 animate-in">
             <div className="flex gap-2 bg-gray-50 p-1.5 rounded-3xl border border-gray-100 w-fit">
                {['Physiotherapy', 'OB-GYN', 'Lactation'].map((cat) => (
                   <button 
                    key={cat}
                    onClick={() => setExpertFilter(cat as any)}
                    className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${expertFilter === cat ? 'bg-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    style={{ color: expertFilter === cat ? theme.text : '' }}
                   >
                     {cat}
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {filteredExperts.map(expert => (
                 <div key={expert.name} className="bg-white p-8 rounded-[3rem] border border-gray-50 flex flex-col justify-between hover:shadow-2xl transition-all group relative overflow-hidden">
                   <div className="space-y-6 relative z-10">
                     <div className="flex items-center gap-5">
                       <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-[1.5rem] bg-gray-50 flex items-center justify-center font-black text-2xl text-slate-300 shadow-inner group-hover:bg-pink-50 transition-colors">
                         {expert.name[0]}
                       </div>
                       <div>
                         <h3 className="text-xl lg:text-2xl font-black text-gray-800">{expert.name}</h3>
                         <p className="text-xs lg:text-sm text-pink-500 font-bold uppercase tracking-wider">{expert.role}</p>
                         <p className="text-[10px] text-slate-400 font-black uppercase mt-1">{expert.credentials}</p>
                       </div>
                     </div>
                     <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-3">
                       <Info className="text-pink-300 shrink-0" size={18} />
                       <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{expert.insight}"</p>
                     </div>
                   </div>
                   <div className="flex justify-between items-center pt-8 mt-6 border-t border-gray-50 relative z-10">
                      <span className="text-xl font-black text-gray-900">{expert.price} <span className="text-[10px] text-slate-400 font-bold">/ {t.care.experts.session}</span></span>
                      <div className="flex gap-2">
                        <button className="p-3 bg-gray-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all"><MessageCircle size={18} /></button>
                        <button 
                          onClick={() => handleBook(expert.name, expert.role.includes('Physio') ? 'Physio' : 'OBGYN')}
                          className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                          style={{ backgroundColor: theme.primary, color: theme.text }}
                        >
                          {t.care.experts.book} <ChevronRight size={14} />
                        </button>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeSubTab === 'NGOs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NGO_DATA.map(ngo => (
              <div key={ngo.name} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 hover:border-pink-200 shadow-sm hover:shadow-xl transition-all space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-pink-50 text-pink-500 shadow-inner"><Globe size={24} /></div>
                  <span className="text-[9px] font-black uppercase px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full shadow-sm">Verified Support</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800">{ngo.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{ngo.area}</p>
                </div>
                <div className="space-y-3">
                   <a href={`tel:${ngo.contact}`} className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-pink-500 transition-colors">
                     <Phone size={16} /> {ngo.contact}
                   </a>
                   <a href={`https://${ngo.website}`} target="_blank" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-pink-500 transition-colors">
                     <Globe size={16} /> {ngo.website}
                   </a>
                </div>
                <button 
                  className="w-full py-4 border-2 border-dashed rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:border-pink-300 hover:text-pink-500 transition-all shadow-sm"
                >
                  {t.care.experts.request} Assistance
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'Insurance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INSURANCE_DATA.map(ins => (
              <div key={ins.bank} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 flex items-center justify-between group hover:shadow-2xl transition-all shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="p-5 rounded-2xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform shadow-inner"><Landmark size={36} /></div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800">{ins.bank}</h3>
                    <p className="text-sm font-bold text-blue-500">{ins.plan}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1 leading-relaxed">{ins.benefit}</p>
                  </div>
                </div>
                <button 
                  className="px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white shadow-xl active:scale-95 transition-all"
                >
                  Compare Policies
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'MyBookings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-800">{t.care.tabs.sessions}</h3>
            {appointments.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-4 shadow-inner">
                 <Calendar size={64} className="text-slate-100" />
                 <p className="text-slate-300 font-bold text-lg">No sessions scheduled yet.</p>
                 <button onClick={() => setActiveSubTab('Experts')} className="px-6 py-2 text-pink-500 font-black text-xs uppercase tracking-widest hover:bg-pink-50 rounded-xl transition-colors">Explore Experts</button>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments.map(a => (
                  <div key={a.id} className="p-8 bg-white rounded-[2.5rem] border border-gray-50 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-pink-50 text-pink-500 rounded-2xl shadow-sm"><Stethoscope size={24} /></div>
                       <div>
                         <h4 className="font-black text-gray-800 text-lg">{a.specialistName}</h4>
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{a.type} Session</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="block text-sm font-black text-gray-900">{a.date}</span>
                       <span className="text-xs font-bold text-slate-400">{a.time}</span>
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
    className={`shrink-0 flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black text-xs lg:text-sm transition-all border-2 ${
      active ? 'shadow-xl border-transparent scale-105' : 'bg-white text-slate-500 border-gray-50 hover:bg-slate-50 shadow-sm'
    }`}
    style={{ 
      backgroundColor: active ? theme.primary : '', 
      color: active ? theme.text : ''
    }}
  >
    {icon} {label}
  </button>
);

export default CareConnect;
