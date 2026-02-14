
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ThemeAccent, Language } from '../types';
import { 
  Save, User, Palette, Target, 
  Lock, Eye, Check, Camera, Upload, Bell,
  Activity, Users, Clipboard, Calendar, Heart, Clock, Zap
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
  const [localCommitment, setLocalCommitment] = useState(15);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  useEffect(() => {
    setLocalCommitment(15);
  }, []);

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const updateCaregiver = (fields: any) => {
    setProfile(prev => ({
      ...prev,
      caregiver: { ...prev.caregiver, ...fields }
    }));
  };

  const updateCaregiverPermissions = (key: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      caregiver: {
        ...prev.caregiver,
        permissions: { ...prev.caregiver.permissions, [key]: value }
      }
    }));
  };

  const updateNotifications = (key: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const changeAccent = (key: ThemeAccent) => {
    if (profile.accent === key) return;
    setIsTransitioning(true);
    setTimeout(() => {
      updateProfile({ accent: key });
    }, 400);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
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

  const currentTheme = COLORS[profile.accent] || COLORS.PINK;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 animate-in pb-20 relative px-1 md:px-0">
      <div 
        className={`theme-transition-overlay ${isTransitioning ? 'theme-transition-active' : ''}`}
        style={{ color: currentTheme.primary }}
      />

      {/* Settings Navigation Sidebar */}
      <div className="w-full md:w-72 space-y-3">
        <TabBtn icon={<User size={20} />} label={t.settings.tabs.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} theme={currentTheme} />
        <TabBtn icon={<Target size={20} />} label={t.settings.tabs.journey} active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} theme={currentTheme} />
        <TabBtn icon={<Palette size={20} />} label={t.settings.tabs.custom} active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} theme={currentTheme} />
        <TabBtn icon={<Bell size={20} />} label={t.settings.tabs.notifications} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} theme={currentTheme} />
        <TabBtn icon={<Lock size={20} />} label={t.settings.tabs.privacy} active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} theme={currentTheme} />
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 bg-white rounded-[2rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 space-y-12 transition-all duration-700">
        
        {/* Tab 1: Personal Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-3xl font-black text-slate-800 flex items-center gap-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl shadow-inner" style={{ color: currentTheme.primary }}><User size={28} /></div>
              {t.settings.aboutYou}
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-10 p-10 bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="relative group shrink-0">
                <div className="h-36 w-36 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white transition-transform group-hover:scale-105 group-hover:rotate-2">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-slate-100" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-4 bg-white shadow-2xl rounded-2xl text-slate-500 hover:text-pink-500 transition-all border border-slate-50 hover:scale-110 active:scale-90"
                >
                  <Camera size={24} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <div className="space-y-3 text-center sm:text-left">
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{t.settings.identity}</h4>
                <p className="text-sm text-slate-500 font-medium italic leading-relaxed max-w-sm opacity-80">"{t.settings.identitySub}"</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] mt-3 hover:opacity-70 transition-opacity"
                  style={{ color: currentTheme.primary }}
                >
                  <Upload size={16} /> {t.settings.upload}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <Field label={t.settings.fields.name} value={profile.name} onChange={v => updateProfile({ name: v })} />
              <Field label={t.settings.fields.age} type="number" value={profile.age.toString()} onChange={v => updateProfile({ age: parseInt(v) || 0 })} />
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{t.settings.fields.delivery}</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-black text-slate-700 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm"
                  style={{ '--tw-ring-color': currentTheme.primary + '33' } as any}
                  value={profile.deliveryType}
                  onChange={e => updateProfile({ deliveryType: e.target.value as any })}
                >
                  <option value="normal">Natural Delivery</option>
                  <option value="c-section">C-Section Journey</option>
                </select>
              </div>
              <Field label={t.settings.fields.sos} value={profile.emergencyContact} onChange={v => updateProfile({ emergencyContact: v })} />
            </div>
          </div>
        )}

        {/* Tab 2: Journey Tuning */}
        {activeTab === 'journey' && (
          <div className="space-y-12 animate-in fade-in">
             <h3 className="text-3xl font-black text-slate-800 flex items-center gap-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl shadow-inner" style={{ color: currentTheme.primary }}><Target size={28} /></div>
              {t.settings.journey.title}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">{t.settings.journey.paceTitle}</label>
                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'gentle' } })}
                    className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${profile.journeySettings.pace === 'gentle' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
                    style={{ color: profile.journeySettings.pace === 'gentle' ? currentTheme.primary : '' }}
                   >Gentle</button>
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'moderate' } })}
                    className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${profile.journeySettings.pace === 'moderate' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
                    style={{ color: profile.journeySettings.pace === 'moderate' ? currentTheme.primary : '' }}
                   >Moderate</button>
                </div>
                <p className="text-[11px] text-slate-400 font-bold italic px-2">{t.settings.journey.paceSub}</p>
              </div>

              <div className="space-y-6">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">{t.settings.journey.commitmentTitle}</label>
                <div className="flex flex-col gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                   <input 
                    type="range" 
                    min="5" max="60" step="5"
                    value={localCommitment}
                    onChange={(e) => setLocalCommitment(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: currentTheme.primary }}
                   />
                   <div className="flex justify-between items-center px-1">
                      <span className="text-2xl font-black text-slate-800 tabular-nums">{localCommitment}</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Minutes Daily</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: UI Customization */}
        {activeTab === 'custom' && (
          <div className="space-y-12 animate-in fade-in">
             <h3 className="text-3xl font-black text-slate-800 flex items-center gap-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl shadow-inner" style={{ color: currentTheme.primary }}><Palette size={28} /></div>
              {t.settings.lookFeel}
            </h3>

            <div className="space-y-8">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">{t.settings.accent}</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {(Object.keys(COLORS) as ThemeAccent[]).map(key => (
                  <button 
                    key={key}
                    onClick={() => changeAccent(key)}
                    disabled={isTransitioning}
                    className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${profile.accent === key ? 'bg-white shadow-xl border-slate-200' : 'bg-slate-50 border-transparent opacity-60'}`}
                  >
                    <div className="w-12 h-12 rounded-xl shadow-lg border-2 border-white transition-transform group-hover:scale-110" style={{ backgroundColor: COLORS[key].primary }} />
                    <span className="font-black text-[10px] uppercase tracking-tighter" style={{ color: profile.accent === key ? COLORS[key].text : '' }}>{key}</span>
                    {profile.accent === key && (
                      <div className="absolute top-1 right-1">
                        <Check size={12} className="text-emerald-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 pt-6">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">{t.settings.language}</label>
              <div className="flex flex-wrap gap-4">
                 {[
                   { id: 'english', label: 'English (Global)' },
                   { id: 'hindi', label: 'Hindi (India)' }
                 ].map(langOption => (
                   <button 
                    key={langOption.id}
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: langOption.id as Language } })}
                    className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md active:scale-95 ${profile.journeySettings.language === langOption.id ? 'text-white translate-y-[-2px]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    style={{ 
                      backgroundColor: profile.journeySettings.language === langOption.id ? currentTheme.primary : '',
                      boxShadow: profile.journeySettings.language === langOption.id ? `0 10px 20px ${currentTheme.primary}44` : ''
                    }}
                   >
                     {langOption.label}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-3xl font-black text-slate-800 flex items-center gap-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl shadow-inner" style={{ color: currentTheme.primary }}><Bell size={28} /></div>
              {t.settings.notifications.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium italic -mt-6">{t.settings.notifications.subtitle}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CheckItem icon={<Activity size={24} />} label={t.settings.notifications.exercise} active={profile.notifications.exerciseReminders} onChange={v => updateNotifications('exerciseReminders', v)} theme={currentTheme} />
              <CheckItem icon={<Zap size={24} />} label={t.settings.notifications.hydration} active={profile.notifications.hydrationAlerts} onChange={v => updateNotifications('hydrationAlerts', v)} theme={currentTheme} />
              <CheckItem icon={<Heart size={24} />} label={t.settings.notifications.mood} active={profile.notifications.moodCheckins} onChange={v => updateNotifications('moodCheckins', v)} theme={currentTheme} />
              <CheckItem icon={<Users size={24} />} label={t.settings.notifications.care} active={profile.notifications.careConnectUpdates} onChange={v => updateNotifications('careConnectUpdates', v)} theme={currentTheme} />
            </div>
          </div>
        )}

        {/* Tab 5: Privacy & Caregiver */}
        {activeTab === 'privacy' && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-3xl font-black text-slate-800 flex items-center gap-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl shadow-inner" style={{ color: currentTheme.primary }}><Lock size={28} /></div>
              {t.settings.privacy.title}
            </h3>
            
            <div className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-[2rem] border border-slate-100 space-y-10 shadow-inner">
               <div className="space-y-6">
                  <h4 className="text-xl font-black text-slate-800 flex items-center gap-3"><Users size={24} /> {t.settings.privacy.caregiverTitle}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Field label={t.settings.privacy.name} value={profile.caregiver.name} onChange={v => updateCaregiver({ name: v })} />
                    <Field label={t.settings.privacy.relation} value={profile.caregiver.relationship} onChange={v => updateCaregiver({ relationship: v })} />
                    <Field label={t.settings.privacy.phone} value={profile.caregiver.contact} onChange={v => updateCaregiver({ contact: v })} />
                  </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-slate-200">
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest text-[10px]">{t.settings.privacy.sharingTitle}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PermissionToggle label={t.settings.privacy.canMood} active={profile.caregiver.permissions.canViewMood} onChange={v => updateCaregiverPermissions('canViewMood', v)} theme={currentTheme} />
                    <PermissionToggle label={t.settings.privacy.canPhys} active={profile.caregiver.permissions.canViewPhysical} onChange={v => updateCaregiverPermissions('canViewPhysical', v)} theme={currentTheme} />
                    <PermissionToggle label={t.settings.privacy.canMed} active={profile.caregiver.permissions.canViewMedicalHistory} onChange={v => updateCaregiverPermissions('canViewMedicalHistory', v)} theme={currentTheme} />
                    <PermissionToggle label={t.settings.privacy.canAppt} active={profile.caregiver.permissions.canViewAppointments} onChange={v => updateCaregiverPermissions('canViewAppointments', v)} theme={currentTheme} />
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-10 border-t border-slate-50 flex justify-end">
           <button 
            className="px-14 py-5 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
            style={{ 
              backgroundColor: currentTheme.primary, 
              boxShadow: `0 20px 40px -10px ${currentTheme.primary}66`,
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.text})`
            }}
            onClick={() => {
              updateProfile({ streakCount: profile.streakCount }); // Simple persist trigger simulation
              alert(t.common.apply);
            }}
           >
             <Save size={20} /> {t.settings.apply}
           </button>
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick, theme }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-black text-sm transition-all border group relative overflow-hidden ${
      active ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-slate-100 scale-[1.03]' : 'text-slate-400 hover:bg-white/60 border-transparent hover:translate-x-1'
    }`}
    style={{ color: active ? theme.text : '' }}
  >
    <div className={`p-2 rounded-lg transition-all ${active ? 'bg-slate-50 text-slate-800' : 'text-slate-200'}`} style={{ color: active ? theme.primary : '' }}>
       {icon}
    </div>
    <span className="tracking-tight relative z-10">{label}</span>
    {active && (
      <div className="absolute left-0 top-0 w-1 h-full" style={{ backgroundColor: theme.primary }} />
    )}
  </button>
);

const Field = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-black text-slate-700 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm focus:bg-white focus:shadow-md"
      style={{ '--tw-ring-color': '#00000008' } as any}
    />
  </div>
);

const CheckItem = ({ icon, label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className={`flex items-center gap-5 p-6 rounded-2xl text-left border transition-all group relative overflow-hidden ${
      active ? 'bg-white shadow-xl border-slate-100 scale-[1.02]' : 'bg-slate-50/50 border-transparent text-slate-400 opacity-80 hover:opacity-100 hover:bg-white'
    }`}
  >
    <div 
      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm ${active ? 'text-white' : 'bg-white text-slate-200'}`}
      style={{ backgroundColor: active ? theme.primary : '', background: active ? `linear-gradient(135deg, ${theme.primary}, ${theme.text})` : '' }}
    >
      {active ? <Check size={28} strokeWidth={4} /> : icon}
    </div>
    <span className={`font-black text-base leading-tight ${active ? 'text-slate-800' : ''}`}>{label}</span>
  </button>
);

const PermissionToggle = ({ label, active, onChange, theme }: any) => (
  <button 
    onClick={() => onChange(!active)}
    className={`flex items-center justify-between gap-4 p-4 rounded-xl bg-white border transition-all ${active ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60'}`}
  >
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
    <div className={`w-11 h-6 rounded-full relative transition-all shadow-inner ${active ? 'bg-emerald-400' : 'bg-slate-200'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
);

export default Settings;
