
import React, { useState, useRef } from 'react';
import { UserProfile, RecoveryPace, ThemeAccent, Language } from '../types';
// Added Zap to the import list to fix the missing name error
import { 
  Save, User, Shield, Palette, Target, 
  Lock, Eye, Check, Trash2, Camera, Upload, Bell,
  Activity, Users, Clipboard, Calendar, Heart, Clock, Focus, Zap
} from 'lucide-react';
import { COLORS } from '../constants';
import { translations } from '../translations';

interface SettingsProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'journey' | 'custom' | 'notifications' | 'privacy'>('profile');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const changeAccent = (key: ThemeAccent) => {
    if (profile.accent === key) return;
    
    // Trigger transition animation
    setIsTransitioning(true);
    setTimeout(() => {
      updateProfile({ accent: key });
    }, 400); // Change mid-animation
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  };

  const toggleGoal = (goalKey: string) => {
    setProfile(prev => {
      const currentGoals = prev.journeySettings.goals || [];
      const newGoals = currentGoals.includes(goalKey)
        ? currentGoals.filter(g => g !== goalKey)
        : [...currentGoals, goalKey];
      return { ...prev, journeySettings: { ...prev.journeySettings, goals: newGoals } };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTheme = COLORS[profile.accent] || COLORS.pink;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 animate-in pb-20 relative">
      {/* Cylindrical Transition Overlay */}
      <div 
        className={`theme-transition-overlay ${isTransitioning ? 'theme-transition-active' : ''}`}
        style={{ color: currentTheme.primary }}
      />

      {/* Dynamic Navigation */}
      <div className="w-full md:w-72 space-y-2">
        <TabBtn icon={<User size={18} />} label={t.settings.tabs.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} theme={currentTheme} />
        <TabBtn icon={<Target size={18} />} label={t.settings.tabs.journey} active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} theme={currentTheme} />
        <TabBtn icon={<Palette size={18} />} label={t.settings.tabs.custom} active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} theme={currentTheme} />
        <TabBtn icon={<Bell size={18} />} label={t.settings.tabs.notifications} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} theme={currentTheme} />
        <TabBtn icon={<Lock size={18} />} label={t.settings.tabs.privacy} active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} theme={currentTheme} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-[3.5rem] p-10 md:p-14 shadow-sm border border-gray-50 space-y-12 transition-all duration-700">
        
        {activeTab === 'profile' && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><User /></div>
              {t.settings.aboutYou}
            </h3>

            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <div className="relative group shrink-0">
                <div className="h-32 w-32 rounded-[2.5rem] bg-white shadow-lg overflow-hidden flex items-center justify-center border-4 border-white">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-200" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 bg-white shadow-xl rounded-2xl text-gray-500 hover:text-pink-500 transition-all border-2 border-gray-50"
                  title="Change Photo"
                >
                  <Camera size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-xl font-black text-gray-800">{t.settings.identity}</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{t.settings.identitySub}</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mt-2"
                  style={{ color: currentTheme.primary }}
                >
                  <Upload size={14} /> {t.settings.upload}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Field label={t.settings.fields.name} value={profile.name} onChange={v => updateProfile({ name: v })} />
              <Field label={t.settings.fields.age} type="number" value={profile.age.toString()} onChange={v => updateProfile({ age: parseInt(v) || 0 })} />
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{t.settings.fields.delivery}</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-gray-700 focus:ring-2"
                  style={{ '--tw-ring-color': currentTheme.primary } as any}
                  value={profile.deliveryType}
                  onChange={e => updateProfile({ deliveryType: e.target.value as any })}
                >
                  <option value="normal">Normal Delivery</option>
                  <option value="c-section">C-Section</option>
                </select>
              </div>
              <Field label={t.settings.fields.sos} value={profile.emergencyContact} onChange={v => updateProfile({ emergencyContact: v })} />
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-12 animate-in fade-in">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><Target /></div>
                {t.settings.journey.title}
              </h3>
              <p className="text-sm text-gray-400 font-medium italic leading-relaxed">{t.settings.journey.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Pace Control */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Activity size={14} /> {t.settings.journey.paceTitle}
                  </label>
                  <p className="text-[10px] text-slate-400 font-bold">{t.settings.journey.paceSub}</p>
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-100 shadow-inner">
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'gentle' } })}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${profile.journeySettings.pace === 'gentle' ? 'bg-white shadow-md' : 'text-slate-400'}`}
                    style={{ color: profile.journeySettings.pace === 'gentle' ? currentTheme.primary : '' }}
                   >Gentle</button>
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'moderate' } })}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${profile.journeySettings.pace === 'moderate' ? 'bg-white shadow-md' : 'text-slate-400'}`}
                    style={{ color: profile.journeySettings.pace === 'moderate' ? currentTheme.primary : '' }}
                   >Moderate</button>
                </div>
              </div>

              {/* Commitment Control */}
              <div className="space-y-4">
                 <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Clock size={14} /> {t.settings.journey.commitmentTitle}
                  </label>
                  <p className="text-[10px] text-slate-400 font-bold">{t.settings.journey.commitmentSub}</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                   <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="5"
                    className="flex-1 accent-pink-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: currentTheme.primary }}
                   />
                   <span className="font-black text-xl w-16 text-right" style={{ color: currentTheme.text }}>15m</span>
                </div>
              </div>
            </div>

            {/* Focus Areas Checklist */}
            <div className="space-y-6">
               <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Focus size={14} /> {t.settings.journey.focusTitle}
                  </label>
                  <p className="text-[10px] text-slate-400 font-bold">{t.settings.journey.focusSub}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CheckItem 
                    icon={<Activity size={16} />} 
                    label={t.settings.journey.goals.pelvic} 
                    active={profile.journeySettings.goals?.includes('pelvic')} 
                    onChange={() => toggleGoal('pelvic')} 
                    theme={currentTheme}
                  />
                  <CheckItem 
                    icon={<Target size={16} />} 
                    label={t.settings.journey.goals.core} 
                    active={profile.journeySettings.goals?.includes('core')} 
                    onChange={() => toggleGoal('core')} 
                    theme={currentTheme}
                  />
                  <CheckItem 
                    icon={<Activity size={16} />} 
                    label={t.settings.journey.goals.mobility} 
                    active={profile.journeySettings.goals?.includes('mobility')} 
                    onChange={() => toggleGoal('mobility')} 
                    theme={currentTheme}
                  />
                  <CheckItem 
                    icon={<Zap size={16} />} 
                    label={t.settings.journey.goals.energy} 
                    active={profile.journeySettings.goals?.includes('energy')} 
                    onChange={() => toggleGoal('energy')} 
                    theme={currentTheme}
                  />
                </div>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><Palette /></div>
              {t.settings.lookFeel}
            </h3>
            <div className="space-y-6">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">{t.settings.accent}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {(Object.keys(COLORS) as ThemeAccent[]).map(key => (
                  <button 
                    key={key}
                    onClick={() => changeAccent(key)}
                    disabled={isTransitioning}
                    className={`p-6 rounded-[2.5rem] border-4 flex flex-col items-center gap-3 transition-all ${profile.accent === key ? 'shadow-xl' : 'hover:bg-gray-50 opacity-80'}`}
                    style={{ 
                      borderColor: profile.accent === key ? COLORS[key].primary : 'transparent', 
                      backgroundColor: profile.accent === key ? 'white' : '' 
                    }}
                  >
                    <div className="w-12 h-12 rounded-2xl shadow-inner" style={{ backgroundColor: COLORS[key].primary }} />
                    <span className="font-black text-xs uppercase tracking-widest">{key}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">{t.settings.language}</label>
              <div className="flex gap-4">
                 {['english', 'hindi'].map(langOption => (
                   <button 
                    key={langOption}
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: langOption as Language } })}
                    className={`px-10 py-4 rounded-3xl font-black text-sm border-2 transition-all ${profile.journeySettings.language === langOption ? 'text-white border-transparent' : 'bg-gray-50 border-transparent text-gray-400'}`}
                    style={{ backgroundColor: profile.journeySettings.language === langOption ? currentTheme.primary : '' }}
                   >{langOption === 'english' ? 'English (US)' : 'हिन्दी (India)'}</button>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-10 animate-in fade-in">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><Bell /></div>
              {t.settings.notifications.title}
            </h3>
            <p className="text-sm text-gray-400 font-medium italic -mt-6">{t.settings.notifications.subtitle}</p>
            
            <div className="space-y-4">
               <ToggleRow 
                label={t.settings.notifications.exercise} 
                active={profile.notifications.exerciseReminders} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, exerciseReminders: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.hydration} 
                active={profile.notifications.hydrationAlerts} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, hydrationAlerts: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.mood} 
                active={profile.notifications.moodCheckins} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, moodCheckins: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.care} 
                active={profile.notifications.careConnectUpdates} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, careConnectUpdates: v} })} 
                theme={currentTheme}
               />
               <ToggleRow 
                label={t.settings.notifications.sos} 
                active={profile.notifications.sosConfirmations} 
                onChange={v => updateProfile({ notifications: {...profile.notifications, sosConfirmations: v} })} 
                theme={currentTheme}
               />
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-12 animate-in fade-in">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><Lock /></div>
                {t.settings.privacy.title}
              </h3>
              <p className="text-sm text-gray-400 font-medium italic">{t.settings.privacy.subtitle}</p>
            </div>

            <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
               <div className="space-y-1">
                 <h4 className="text-xl font-black text-gray-800">{t.settings.privacy.caregiverTitle}</h4>
                 <p className="text-xs text-gray-400 font-medium">{t.settings.privacy.caregiverSub}</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <Field label={t.settings.privacy.name} value={profile.caregiver.name} onChange={v => updateProfile({ caregiver: {...profile.caregiver, name: v} })} />
                 <Field label={t.settings.privacy.relation} value={profile.caregiver.relationship} onChange={v => updateProfile({ caregiver: {...profile.caregiver, relationship: v} })} />
                 <Field label={t.settings.privacy.phone} value={profile.caregiver.contact} onChange={v => updateProfile({ caregiver: {...profile.caregiver, contact: v} })} />
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-1">
                 <h4 className="text-xl font-black text-gray-800 flex items-center gap-3">
                   {t.settings.privacy.sharingTitle}
                   <Shield className="text-emerald-400" size={20} />
                 </h4>
                 <p className="text-xs text-gray-400 font-medium">{t.settings.privacy.sharingSub}</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <CheckItem 
                  icon={<Heart size={16} />} 
                  label={t.settings.privacy.canMood} 
                  active={profile.caregiver.permissions.canViewMood} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewMood: v}} })} 
                  theme={currentTheme}
                 />
                 <CheckItem 
                  icon={<Activity size={16} />} 
                  label={t.settings.privacy.canPhys} 
                  active={profile.caregiver.permissions.canViewPhysical} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewPhysical: v}} })} 
                  theme={currentTheme}
                 />
                 <CheckItem 
                  icon={<Clipboard size={16} />} 
                  label={t.settings.privacy.canMed} 
                  active={profile.caregiver.permissions.canViewMedicalHistory} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewMedicalHistory: v}} })} 
                  theme={currentTheme}
                 />
                 <CheckItem 
                  icon={<Calendar size={16} />} 
                  label={t.settings.privacy.canAppt} 
                  active={profile.caregiver.permissions.canViewAppointments} 
                  onChange={v => updateProfile({ caregiver: {...profile.caregiver, permissions: {...profile.caregiver.permissions, canViewAppointments: v}} })} 
                  theme={currentTheme}
                 />
               </div>
            </div>
          </div>
        )}
        
        <div className="pt-10 border-t border-gray-100 flex justify-end">
           <button 
            className="px-12 py-5 text-white rounded-full font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            style={{ backgroundColor: currentTheme.primary, boxShadow: `0 20px 40px -10px ${currentTheme.primary}44` }}
            onClick={() => alert(t.common.apply)}
           >
             <Save size={18} /> {t.settings.apply}
           </button>
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick, theme }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] font-black text-sm transition-all border-2 ${
      active ? 'bg-white shadow-xl' : 'text-gray-400 hover:bg-white/50 border-transparent'
    }`}
    style={{ color: active ? theme.primary : '', borderColor: active ? theme.bg : 'transparent' }}
  >
    {icon} {label}
  </button>
);

const Field = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-gray-700 focus:ring-2 transition-all"
    />
  </div>
);

const ToggleRow = ({ label, active, onChange, theme }: any) => (
  <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
    <span className="font-bold text-gray-700">{label}</span>
    <button 
      onClick={() => onChange(!active)}
      className={`w-14 h-8 rounded-full relative transition-all duration-300 ${active ? '' : 'bg-gray-200'}`}
      style={{ backgroundColor: active ? theme.primary : '' }}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const CheckItem = ({ icon, label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className={`flex items-center gap-4 p-5 rounded-2xl text-left border-2 transition-all ${
      active ? 'bg-white border-transparent shadow-md' : 'bg-gray-50 border-transparent text-gray-400 opacity-60'
    }`}
  >
    <div 
      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'text-white' : 'bg-white text-gray-300'}`}
      style={{ backgroundColor: active ? theme.primary : '' }}
    >
      {active ? <Check size={18} /> : icon}
    </div>
    <span className={`font-bold text-sm ${active ? 'text-gray-900' : ''}`}>{label}</span>
  </button>
);

export default Settings;
