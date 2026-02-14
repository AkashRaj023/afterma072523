
import React, { useState, useRef } from 'react';
import { UserProfile, RecoveryPace, ThemeAccent, Language } from '../types';
import { 
  Save, User, Shield, HeartPulse, Palette, BellRing, Target, 
  Lock, Eye, Check, Globe, Layout, Bell, Trash2, Camera, Upload
} from 'lucide-react';
import { COLORS } from '../constants';

interface SettingsProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'journey' | 'custom' | 'notifications' | 'privacy'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
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
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 animate-in pb-20">
      {/* Dynamic Navigation */}
      <div className="w-full md:w-72 space-y-2">
        <TabBtn icon={<User size={18} />} label="Personal Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} theme={currentTheme} />
        <TabBtn icon={<Target size={18} />} label="Recovery Journey" active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} theme={currentTheme} />
        <TabBtn icon={<Palette size={18} />} label="UI Customization" active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} theme={currentTheme} />
        <TabBtn icon={<Bell size={18} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} theme={currentTheme} />
        <TabBtn icon={<Lock size={18} />} label="Privacy & Caregiver" active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} theme={currentTheme} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-[3.5rem] p-10 md:p-14 shadow-sm border border-gray-50 space-y-12">
        
        {activeTab === 'profile' && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><User /></div>
              About You
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
                <h4 className="text-xl font-black text-gray-800">Your Identity</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">Customize how you appear in AfterMa and during Care Connect sessions.</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mt-2"
                  style={{ color: currentTheme.primary }}
                >
                  <Upload size={14} /> Upload New Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Field label="Mother's Name" value={profile.name} onChange={v => updateProfile({ name: v })} />
              <Field label="Age" type="number" value={profile.age.toString()} onChange={v => updateProfile({ age: parseInt(v) || 0 })} />
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Delivery Type</label>
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
              <Field label="SOS Emergency Phone" value={profile.emergencyContact} onChange={v => updateProfile({ emergencyContact: v })} />
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Key Medical Context</label>
               <textarea 
                  className="w-full bg-gray-50 border-none rounded-[2rem] p-6 font-medium text-gray-700 h-32"
                  placeholder="Complications, allergies, or previous surgical history..."
                  value={profile.medicalHistory}
                  onChange={e => updateProfile({ medicalHistory: e.target.value })}
               />
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><Target /></div>
              Journey Tuning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Recovery Intensity Pace</label>
                <div className="flex bg-gray-50 p-1.5 rounded-3xl border border-gray-100">
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'gentle' } })}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${profile.journeySettings.pace === 'gentle' ? 'bg-white shadow-md' : 'text-gray-400'}`}
                    style={{ color: profile.journeySettings.pace === 'gentle' ? currentTheme.primary : '' }}
                   >Gentle</button>
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, pace: 'moderate' } })}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${profile.journeySettings.pace === 'moderate' ? 'bg-white shadow-md' : 'text-gray-400'}`}
                    style={{ color: profile.journeySettings.pace === 'moderate' ? currentTheme.primary : '' }}
                   >Moderate</button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Preferred Reminder Time</label>
                <div className="flex bg-gray-50 p-1.5 rounded-3xl border border-gray-100">
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, preferredTime: 'morning' } })}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${profile.journeySettings.preferredTime === 'morning' ? 'bg-white shadow-md' : 'text-gray-400'}`}
                    style={{ color: profile.journeySettings.preferredTime === 'morning' ? currentTheme.primary : '' }}
                   >Morning</button>
                   <button 
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, preferredTime: 'evening' } })}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${profile.journeySettings.preferredTime === 'evening' ? 'bg-white shadow-md' : 'text-gray-400'}`}
                    style={{ color: profile.journeySettings.preferredTime === 'evening' ? currentTheme.primary : '' }}
                   >Evening</button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
               <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Current Active Focus Goals</label>
               <div className="flex flex-wrap gap-3">
                 {['reduce pain', 'improve strength', 'stabilize mood', 'improve sleep'].map(goal => {
                    const active = profile.journeySettings.goals.includes(goal);
                    return (
                      <button 
                        key={goal}
                        onClick={() => {
                          const newGoals = active ? profile.journeySettings.goals.filter(g => g !== goal) : [...profile.journeySettings.goals, goal];
                          updateProfile({ journeySettings: { ...profile.journeySettings, goals: newGoals } });
                        }}
                        className={`px-6 py-3 rounded-full font-bold text-sm transition-all border-2 ${active ? 'text-white border-transparent' : 'bg-white border-gray-100 text-gray-400 hover:border-pink-100'}`}
                        style={{ backgroundColor: active ? currentTheme.primary : '' }}
                      >{goal}</button>
                    )
                 })}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><Palette /></div>
              Look & Feel
            </h3>
            <div className="space-y-6">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Application Accent Color</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {(Object.keys(COLORS) as ThemeAccent[]).map(key => (
                  <button 
                    key={key}
                    onClick={() => updateProfile({ accent: key })}
                    className={`p-6 rounded-[2.5rem] border-4 flex flex-col items-center gap-3 transition-all ${profile.accent === key ? 'shadow-xl' : 'hover:bg-gray-50'}`}
                    style={{ borderColor: profile.accent === key ? COLORS[key].primary : 'transparent', backgroundColor: profile.accent === key ? 'white' : '' }}
                  >
                    <div className="w-12 h-12 rounded-2xl shadow-inner" style={{ backgroundColor: COLORS[key].primary }} />
                    <span className="font-black text-xs uppercase tracking-widest">{key}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Interface Language</label>
              <div className="flex gap-4">
                 {['english', 'hindi'].map(lang => (
                   <button 
                    key={lang}
                    onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: lang as Language } })}
                    className={`px-10 py-4 rounded-3xl font-black text-sm border-2 transition-all ${profile.journeySettings.language === lang ? 'text-white border-transparent' : 'bg-gray-50 border-transparent text-gray-400'}`}
                    style={{ backgroundColor: profile.journeySettings.language === lang ? currentTheme.primary : '' }}
                   >{lang === 'english' ? 'English (US)' : 'हिन्दी (India)'}</button>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><BellRing /></div>
              Alert Toggles
            </h3>
            <div className="space-y-4">
               <ToggleItem label="Recovery Activity Reminders" enabled={profile.notifications.exerciseReminders} onClick={() => updateProfile({ notifications: { ...profile.notifications, exerciseReminders: !profile.notifications.exerciseReminders } })} theme={currentTheme} />
               <ToggleItem label="Hydration & Nutrition Alerts" enabled={profile.notifications.hydrationAlerts} onClick={() => updateProfile({ notifications: { ...profile.notifications, hydrationAlerts: !profile.notifications.hydrationAlerts } })} theme={currentTheme} />
               <ToggleItem label="Daily Mood Check-ins" enabled={profile.notifications.moodCheckins} onClick={() => updateProfile({ notifications: { ...profile.notifications, moodCheckins: !profile.notifications.moodCheckins } })} theme={currentTheme} />
               <ToggleItem label="Care Connect Video Updates" enabled={profile.notifications.careConnectUpdates} onClick={() => updateProfile({ notifications: { ...profile.notifications, careConnectUpdates: !profile.notifications.careConnectUpdates } })} theme={currentTheme} />
               <ToggleItem label="SOS Trigger Confirmations" enabled={profile.notifications.sosConfirmations} onClick={() => updateProfile({ notifications: { ...profile.notifications, sosConfirmations: !profile.notifications.sosConfirmations } })} theme={currentTheme} />
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl" style={{ color: currentTheme.primary }}><Shield /></div>
              Privacy & Caregiver
            </h3>
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
               <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest">Caregiver Information</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <Field label="Full Name" value={profile.caregiver.name} onChange={v => updateProfile({ caregiver: { ...profile.caregiver, name: v } })} />
                 <Field label="Relationship" value={profile.caregiver.relationship} onChange={v => updateProfile({ caregiver: { ...profile.caregiver, relationship: v } })} />
                 <Field label="Contact" value={profile.caregiver.contact} onChange={v => updateProfile({ caregiver: { ...profile.caregiver, contact: v } })} />
               </div>
               
               <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Visibility Boundaries</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PermissionItem label="Mood Analytics" enabled={profile.caregiver.permissions.canViewMood} toggle={() => updateProfile({ caregiver: { ...profile.caregiver, permissions: { ...profile.caregiver.permissions, canViewMood: !profile.caregiver.permissions.canViewMood } } })} theme={currentTheme} />
                    <PermissionItem label="Recovery Progress" enabled={profile.caregiver.permissions.canViewPhysical} toggle={() => updateProfile({ caregiver: { ...profile.caregiver, permissions: { ...profile.caregiver.permissions, canViewPhysical: !profile.caregiver.permissions.canViewPhysical } } })} theme={currentTheme} />
                    <PermissionItem label="Medical History" enabled={profile.caregiver.permissions.canViewMedicalHistory} toggle={() => updateProfile({ caregiver: { ...profile.caregiver, permissions: { ...profile.caregiver.permissions, canViewMedicalHistory: !profile.caregiver.permissions.canViewMedicalHistory } } })} theme={currentTheme} />
                    <PermissionItem label="Appointments" enabled={profile.caregiver.permissions.canViewAppointments} toggle={() => updateProfile({ caregiver: { ...profile.caregiver, permissions: { ...profile.caregiver.permissions, canViewAppointments: !profile.caregiver.permissions.canViewAppointments } } })} theme={currentTheme} />
                  </div>
               </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h4 className="font-black text-gray-900 flex items-center gap-2 text-sm"><Trash2 size={16} className="text-red-500" /> Data Management</h4>
              <p className="text-xs text-gray-400 font-medium">Clear your AfterMa local dashboard data or reset your journey progress. This action is irreversible.</p>
              <button 
                onClick={() => { if(window.confirm("Reset all AfterMa data?")) { localStorage.clear(); window.location.reload(); } }}
                className="px-6 py-2 border-2 border-red-100 text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 transition-all"
              >Reset Application</button>
            </div>
          </div>
        )}

        {/* Global Save Action */}
        <div className="pt-10 border-t border-gray-100 flex justify-end">
           <button 
            className="px-12 py-5 text-white rounded-full font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            style={{ backgroundColor: currentTheme.primary, boxShadow: `0 20px 40px -10px ${currentTheme.primary}44` }}
            onClick={() => alert("AfterMa Settings Synced. Your journey has been updated.")}
           >
             <Save size={18} /> Apply Customizations
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
      className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-gray-700 focus:ring-2 focus:ring-pink-200 transition-all"
    />
  </div>
);

const ToggleItem = ({ label, enabled, onClick, theme }: any) => (
  <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-pink-50 transition-colors">
    <span className="font-bold text-gray-800">{label}</span>
    <button onClick={onClick} className={`w-14 h-8 rounded-full relative transition-all ${enabled ? '' : 'bg-gray-200'}`} style={{ backgroundColor: enabled ? theme.primary : '' }}>
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${enabled ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

const PermissionItem = ({ label, enabled, toggle, theme }: any) => (
  <button 
    onClick={toggle}
    className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${enabled ? 'bg-white border-transparent shadow-md' : 'bg-gray-100/50 border-transparent opacity-50'}`}
    style={{ color: enabled ? theme.text : '' }}
  >
    <div className="flex items-center gap-3">
      {enabled ? <Eye size={16} /> : <div className="w-4 h-4 border-2 border-gray-300 rounded-sm" />}
      <span className="text-xs font-black uppercase tracking-wider">{label}</span>
    </div>
    {enabled && <Check size={14} />}
  </button>
);

export default Settings;
