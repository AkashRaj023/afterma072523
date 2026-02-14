
import React from 'react';
import { 
  Home, Activity, Heart, Users, BookOpen, 
  Settings, LogOut, UserCheck, Star, X, ShoppingBag
} from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { COLORS, SLOGAN } from '../constants';
import { translations } from '../translations';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  profile: UserProfile;
  logout: () => void;
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, profile, logout, onClose }) => {
  const theme = COLORS[profile.accent] || COLORS.pink;
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  
  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home, private: true },
    { id: 'physical', label: t.nav.physical, icon: Activity, private: true },
    { id: 'mental', label: t.nav.mental, icon: Heart, private: true },
    { id: 'care-connect', label: t.nav.care, icon: Users, private: true },
    { id: 'momkart', label: t.nav.momkart, icon: ShoppingBag, private: true },
    { id: 'education', label: t.nav.education, icon: BookOpen, private: false },
    { id: 'profile', label: t.nav.settings, icon: Settings, private: true },
    { id: 'membership', label: t.nav.membership, icon: Star, private: true },
  ];

  if (profile.role === 'caregiver') {
    navItems.unshift({ id: 'caregiver', label: t.nav.caregiver, icon: UserCheck, private: true });
  }

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col shadow-sm relative z-50">
      <div className="p-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">
            AfterMa
          </h1>
          <p className="text-[10px] mt-1 tracking-widest font-bold text-black opacity-80">
            {SLOGAN}
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 -mr-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.private && !profile.authenticated) return null;
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id as AppView);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              style={{ 
                backgroundColor: isActive ? theme.primary : '', 
                boxShadow: isActive ? `0 10px 20px -5px ${theme.primary}66` : '',
                color: isActive ? theme.text : ''
              }}
            >
              <Icon size={20} className={isActive ? '' : 'text-slate-400'} style={{ color: isActive ? theme.text : '' }} />
              <span className={`font-bold text-sm`}>{item.label}</span>
              {item.id === 'membership' && profile.membershipPlan === 'plus' && <Star size={12} fill="currentColor" className="ml-auto text-amber-300" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-50">
        {profile.authenticated && (
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} />
            <span>{t.common.signOut}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
