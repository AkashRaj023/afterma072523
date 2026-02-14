
import React, { useState } from 'react';
import { UserProfile, Appointment, CommunityCircle } from '../types';
import { 
  Users, Calendar, Video, MessageCircle, Heart, 
  Stethoscope, Activity, Baby, ArrowRight, Check, X, Bell, Phone
} from 'lucide-react';
import { COLORS, HELPLINES } from '../constants';

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
  const [activeSubTab, setActiveSubTab] = useState<'Community' | 'Physio' | 'OBGYN' | 'Lactation' | 'MyBookings'>('Community');
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

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    addNotification("Session Cancelled", "The appointment has been removed from your care calendar.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in pb-20">
      {/* Soft Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h2 className="text-4xl font-black text-gray-800 leading-tight">Care Connect</h2>
          <p className="text-slate-400 font-medium">An integrated support network for your safe healing journey.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <a href={`tel:${HELPLINES.india.number}`} className="flex items-center gap-3 px-6 py-3 bg-rose-50 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm">
            <Phone size={16} /> Get Support
          </a>
        </div>
      </div>

      {/* Gentle Navigation */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        <NavButton label="Community" active={activeSubTab === 'Community'} onClick={() => setActiveSubTab('Community')} theme={theme} icon={<Users size={18} />} />
        <NavButton label="Physiotherapy" active={activeSubTab === 'Physio'} onClick={() => setActiveSubTab('Physio')} theme={theme} icon={<Activity size={18} />} />
        <NavButton label="OBGYN Care" active={activeSubTab === 'OBGYN'} onClick={() => setActiveSubTab('OBGYN')} theme={theme} icon={<Stethoscope size={18} />} />
        <NavButton label="Lactation Expert" active={activeSubTab === 'Lactation'} onClick={() => setActiveSubTab('Lactation')} theme={theme} icon={<Baby size={18} />} />
        <NavButton label="My Sessions" active={activeSubTab === 'MyBookings'} onClick={() => setActiveSubTab('MyBookings')} theme={theme} icon={<Calendar size={18} />} />
      </div>

      {/* View Containers */}
      <div className="space-y-6">
        {activeSubTab === 'Community' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {circles.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 space-y-6 hover:shadow-lg transition-all group">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-slate-50" style={{ color: theme.primary }}>
                    <MessageCircle size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{c.members} Sisters</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800">{c.name}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed h-12 overflow-hidden">{c.description}</p>
                </div>
                <button 
                  onClick={() => handleRSVP(c.id)}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${c.isJoined ? 'bg-slate-100 text-slate-400' : 'text-slate-800'}`}
                  style={{ backgroundColor: c.isJoined ? '' : theme.primary }}
                >
                  {c.isJoined ? <Check size={18} /> : null}
                  {c.isJoined ? 'Joined Circle' : 'Join Discussion'}
                </button>
              </div>
            ))}
          </div>
        )}

        {(activeSubTab === 'Physio' || activeSubTab === 'OBGYN' || activeSubTab === 'Lactation') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {activeSubTab === 'Physio' && (
               <>
                 <ExpertCard name="Dr. Priya Mehta" role="Pelvic Floor Specialist" rating="4.9" price="₹1200" theme={theme} onBook={() => handleBook("Dr. Priya Mehta", "Physio")} />
                 <ExpertCard name="Sarah Johnson" role="Postpartum Physio" rating="4.8" price="₹1500" theme={theme} onBook={() => handleBook("Sarah Johnson", "Physio")} />
               </>
             )}
             {activeSubTab === 'OBGYN' && (
               <>
                 <ExpertCard name="Dr. Ananya Roy" role="OBGYN Care" rating="5.0" price="₹2000" theme={theme} onBook={() => handleBook("Dr. Ananya Roy", "OBGYN")} />
                 <ExpertCard name="Dr. Vikram Singh" role="Maternal Specialist" rating="4.7" price="₹1800" theme={theme} onBook={() => handleBook("Dr. Vikram Singh", "OBGYN")} />
               </>
             )}
             {activeSubTab === 'Lactation' && (
               <>
                 <ExpertCard name="Nidhi Kapur" role="Lactation Support" rating="4.9" price="₹800" theme={theme} onBook={() => handleBook("Nidhi Kapur", "Lactation")} />
                 <ExpertCard name="Anjali Sharma" role="Breastfeeding Educator" rating="4.8" price="₹1000" theme={theme} onBook={() => handleBook("Anjali Sharma", "Lactation")} />
               </>
             )}
          </div>
        )}

        {activeSubTab === 'MyBookings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-800">Your Scheduled Care</h3>
            {appointments.length === 0 ? (
              <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-4">
                 <Calendar size={48} className="text-slate-100" />
                 <p className="text-slate-300 font-bold">No sessions scheduled yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map(a => (
                  <div key={a.id} className={`p-8 bg-white rounded-[2.5rem] border flex items-center justify-between transition-all ${a.status === 'Cancelled' ? 'opacity-50' : 'hover:border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-slate-50" style={{ color: theme.text }}>
                        {a.type === 'OBGYN' ? <Stethoscope /> : a.type === 'Physio' ? <Activity /> : <Baby />}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-800">{a.specialistName}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><Calendar size={12} /> {a.date}</span>
                          <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><Clock size={12} /> {a.time}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${a.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{a.status}</span>
                        </div>
                      </div>
                    </div>
                    {a.status === 'Upcoming' && (
                      <button 
                        onClick={() => cancelAppointment(a.id)}
                        className="p-4 text-slate-300 hover:text-rose-400 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <X size={20} />
                      </button>
                    )}
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
    className={`shrink-0 flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-sm transition-all border-2 ${
      active ? 'shadow-md border-transparent' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'
    }`}
    style={{ 
      backgroundColor: active ? theme.primary : '', 
      color: active ? theme.text : '',
      boxShadow: active ? `0 10px 20px -5px ${theme.primary}66` : '' 
    }}
  >
    {icon} {label}
  </button>
);

const ExpertCard = ({ name, role, rating, price, theme, onBook }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 space-y-6 hover:shadow-lg transition-all group relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-xl text-slate-300" style={{ color: theme.text }}>
          {name[0]}
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-800">{name}</h3>
          <p className="text-sm text-slate-400 font-medium">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-amber-300 font-black text-sm">
        ★ {rating}
      </div>
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
       <span className="text-lg font-black text-gray-800">{price} <span className="text-xs text-slate-300 font-bold uppercase">/ session</span></span>
       <button 
        onClick={onBook}
        className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-105 transition-all"
        style={{ backgroundColor: theme.primary, color: theme.text }}
       >
         Request Session
       </button>
    </div>
  </div>
);

const Clock = ({ size }: any) => <Calendar size={size} />; 

export default CareConnect;
