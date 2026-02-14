
import React from 'react';
import { UserProfile } from '../types';
import { Check, ShieldCheck, Zap, Heart, Star, Activity, Crown } from 'lucide-react';
import { PRICING, COLORS } from '../constants';

interface MembershipProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Membership: React.FC<MembershipProps> = ({ profile, setProfile }) => {
  const isPlus = profile.membershipPlan === 'plus';
  const theme = COLORS[profile.accent] || COLORS.pink;

  const handleUpgrade = () => {
    // Razorpay Integration Simulation
    const confirm = window.confirm(`Ready to upgrade to AfterMa Plus for ₹${PRICING.plus}/mo? This includes secure data encryption and priority care.`);
    if (confirm) {
      setProfile(p => ({ ...p, membershipPlan: 'plus' }));
      alert("Welcome to AfterMa Plus! Your premium benefits are now active.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 animate-in">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
         <div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ backgroundColor: theme.bg, color: theme.text }}
         >
           <Star size={12} /> Membership Hub
         </div>
         <h2 className="text-5xl font-black text-gray-900 leading-tight">Elevate Your Recovery Journey</h2>
         <p className="text-gray-500 text-lg">Personalized care, expert access, and advanced analytics for the modern mother.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Free Plan */}
        <div className="p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-sm space-y-8 flex flex-col">
           <div className="space-y-2">
              <h3 className="text-2xl font-bold">Essential Care</h3>
              <p className="text-gray-400 text-sm">Everything needed for a standard recovery.</p>
           </div>
           <div className="text-4xl font-black text-gray-900">₹0 <span className="text-sm text-gray-400 font-bold">/ month</span></div>
           
           <div className="flex-1 space-y-4">
              <Benefit icon={<Check style={{ color: theme.primary }} />} label="Standard Recovery Pathway" />
              <Benefit icon={<Check style={{ color: theme.primary }} />} label="Daily Mood & Pain Logs" />
              <Benefit icon={<Check style={{ color: theme.primary }} />} label="Basic Nutrition Guide" />
              <Benefit icon={<Check style={{ color: theme.primary }} />} label="Educational Resource Library" />
           </div>

           <button 
             disabled={!isPlus} 
             className={`w-full py-5 rounded-3xl font-black text-sm transition-all ${!isPlus ? 'bg-gray-100 text-gray-400' : 'bg-slate-50 text-slate-300'}`}
           >
             {!isPlus ? 'Current Plan' : 'Free Tier'}
           </button>
        </div>

        {/* Plus Plan - Theme Adaptive */}
        <div 
          className={`p-12 rounded-[3.5rem] border-4 space-y-8 flex flex-col relative overflow-hidden transition-all shadow-2xl`}
          style={{ 
            borderColor: theme.primary,
            backgroundColor: isPlus ? 'white' : theme.primary,
            color: isPlus ? 'inherit' : theme.text
          }}
        >
           {!isPlus && <div className="absolute top-8 right-[-35px] rotate-45 bg-amber-300 text-amber-900 px-12 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">Recommended</div>}
           
           <div className="space-y-2">
              <h3 className="text-2xl font-black flex items-center gap-3">AfterMa Plus <Crown size={24} /></h3>
              <p className={`text-sm opacity-80 ${isPlus ? 'text-gray-400' : ''}`}>The gold standard in postpartum wellness.</p>
           </div>
           
           <div className="text-4xl font-black">₹{PRICING.plus} <span className={`text-sm font-bold opacity-60`}>/ month</span></div>

           <div className="flex-1 space-y-4">
              <Benefit icon={<Zap style={{ color: isPlus ? theme.primary : 'white' }} />} label="Priority Care Connect Appointments" inverted={!isPlus} />
              <Benefit icon={<Activity style={{ color: isPlus ? theme.primary : 'white' }} />} label="Advanced Recovery Analytics" inverted={!isPlus} />
              <Benefit icon={<Heart style={{ color: isPlus ? theme.primary : 'white' }} />} label="Exclusive Peer Support Circles" inverted={!isPlus} />
              <Benefit icon={<ShieldCheck style={{ color: isPlus ? theme.primary : 'white' }} />} label="Downloadable Clinical Reports" inverted={!isPlus} />
              <Benefit icon={<Zap style={{ color: isPlus ? theme.primary : 'white' }} />} label="Unlimited AI Triage Assistant" inverted={!isPlus} />
           </div>

           <button 
             onClick={!isPlus ? handleUpgrade : undefined}
             className={`w-full py-5 rounded-3xl font-black text-sm transition-all shadow-xl hover:scale-105 active:scale-95`}
             style={{ 
               backgroundColor: isPlus ? theme.bg : 'white',
               color: isPlus ? theme.text : theme.text,
               border: isPlus ? `1px solid ${theme.primary}` : 'none'
             }}
           >
             {isPlus ? 'Active Plus Member' : 'Upgrade to Plus Now'}
           </button>
        </div>
      </div>
    </div>
  );
};

const Benefit = ({ icon, label, inverted }: any) => (
  <div className="flex items-center gap-3">
    <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${inverted ? 'bg-black/5' : 'bg-slate-50'}`}>
      {icon}
    </div>
    <span className={`text-sm font-bold ${inverted ? 'opacity-90' : 'text-gray-700'}`}>{label}</span>
  </div>
);

export default Membership;
