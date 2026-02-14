
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, UserProfile, HealthLog, RecoveryActivity, RecoveryPhase, Appointment, CommunityCircle } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import PhysicalRecovery from './components/PhysicalRecovery';
import MentalWellness from './components/MentalWellness';
import Education from './components/Education';
import Membership from './components/Membership';
import Settings from './components/Settings';
import SOSOverlay from './components/SOSOverlay';
import NotificationPanel from './components/NotificationPanel';
import CareConnect from './components/CareConnect';
import { Search, LogIn, EyeOff, Bell, Heart, Zap, User } from 'lucide-react';
import { RECOVERY_DATABASE, PHASES, COLORS } from './constants';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('education');
  const [showSOS, setShowSOS] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Care Connect States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [circles, setCircles] = useState<CommunityCircle[]>([
    { id: '1', name: 'New Moms Bonding', members: 124, description: 'Sharing the joys and struggles of the first few months.', isJoined: false },
    { id: '2', name: 'Sleep Solutions', members: 89, description: 'Tips and support for the sleepless nights.', isJoined: false },
    { id: '3', name: 'Emotional Overwhelm', members: 56, description: 'A safe space to talk about the harder days.', isJoined: false },
  ]);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('afterma_profile_v2');
    if (saved) return JSON.parse(saved);
    return {
      name: "Guest",
      age: 28,
      deliveryDate: new Date().toISOString(),
      deliveryType: 'normal',
      authenticated: false,
      role: 'mother',
      accent: 'pink',
      incognito: false,
      medicalHistory: "",
      emergencyContact: "",
      membershipPlan: 'free',
      currentPhase: 'Stabilize',
      completedActivities: [],
      streakCount: 0,
      streakProtectionActive: false,
      lastLoginDate: new Date().toISOString().split('T')[0],
      badges: [],
      caregiver: {
        name: "", relationship: "", contact: "",
        permissions: { canViewMood: true, canViewPhysical: true, canViewMedicalHistory: false, canViewAppointments: true }
      },
      journeySettings: {
        pace: 'gentle',
        preferredTime: 'morning',
        goals: ['improve strength', 'stabilize mood'],
        isPaused: false,
        language: 'english'
      },
      notifications: {
        exerciseReminders: true,
        hydrationAlerts: true,
        moodCheckins: true,
        careConnectUpdates: true,
        sosConfirmations: true
      }
    };
  });

  const [logs, setLogs] = useState<HealthLog[]>([]);

  useEffect(() => {
    localStorage.setItem('afterma_profile_v2', JSON.stringify(profile));
  }, [profile]);

  // Handle Dynamic Theme
  const theme = COLORS[profile.accent] || COLORS.pink;

  const addNotification = (title: string, text: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), title, text, time: 'Just now' }, ...prev]);
  };

  const handleLogin = () => {
    setProfile(prev => ({ ...prev, name: "Aditi Sharma", authenticated: true, lastLoginDate: new Date().toISOString().split('T')[0] }));
    setView('dashboard');
    addNotification(`Pranam Aditi`, `Welcome back to your healing journey.`);
  };

  const logout = () => {
    setProfile(prev => ({ ...prev, authenticated: false }));
    setView('education');
  };

  const toggleActivity = (activityId: string) => {
    if (profile.journeySettings.isPaused) return;
    setProfile(prev => {
      const isCompleted = prev.completedActivities.includes(activityId);
      const newCompleted = isCompleted 
        ? prev.completedActivities.filter(id => id !== activityId)
        : [...prev.completedActivities, activityId];
      
      if (!isCompleted) {
        addNotification("Activity Done!", "Points earned and progress logged.");
      }
      return { ...prev, completedActivities: newCompleted };
    });
  };

  const triggerSOS = () => setShowSOS(true);

  const filteredActivities = useMemo(() => {
    return RECOVERY_DATABASE
      .filter(a => !a.typeSpecific || a.typeSpecific === profile.deliveryType)
      .filter(a => {
        if (profile.journeySettings.pace === 'gentle') {
          return a.intensityScale <= 5 || a.category === 'breathing';
        }
        return true;
      });
  }, [profile.deliveryType, profile.journeySettings.pace]);

  return (
    <div className={`min-h-screen flex transition-colors duration-500 font-sans`} style={{ backgroundColor: theme.bg }}>
      <Navigation currentView={currentView} setView={setView} profile={profile} logout={logout} />
      
      <main className="flex-1 ml-64 min-h-screen relative overflow-x-hidden">
        <header className="h-20 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-pink-100/30">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-lg w-full">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${profile.incognito ? 'text-purple-500' : 'text-gray-400'}`} size={18} />
              <input 
                type="text" 
                placeholder={profile.incognito ? "Incognito Search Active..." : "Find activities, experts, recipes..."}
                className={`w-full border-none rounded-full py-3 pl-14 pr-24 focus:ring-2 transition-all text-sm ${profile.incognito ? 'bg-purple-50 focus:ring-purple-200' : 'bg-gray-50 focus:ring-pink-200'}`}
              />
              <button 
                onClick={() => setProfile(p => ({...p, incognito: !p.incognito}))}
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase px-2.5 py-1 rounded-full transition-all ${profile.incognito ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
              >
                {profile.incognito ? 'Hide' : 'Incognito'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onMouseDown={(e) => {
                const timer = setTimeout(triggerSOS, 1500);
                const clear = () => clearTimeout(timer);
                e.currentTarget.addEventListener('mouseup', clear);
                e.currentTarget.addEventListener('mouseleave', clear);
              }}
              className="px-6 py-2.5 bg-[#EF4444] text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-red-100/50"
            >
              Hold for SOS
            </button>
            
            {profile.authenticated ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && <span className={`absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white animate-pulse`} style={{ backgroundColor: theme.primary }}></span>}
                </button>
                <button 
                  onClick={() => setView('profile')} 
                  style={{ backgroundColor: theme.primary }}
                  className="h-10 w-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white hover:scale-110 transition-transform overflow-hidden"
                >
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    profile.name[0]
                  )}
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin} 
                style={{ backgroundColor: theme.primary }}
                className="text-white px-8 py-2.5 rounded-full font-black text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        <div className="p-8 pb-32">
          {currentView === 'dashboard' && profile.authenticated && (
            <Dashboard profile={profile} logs={logs} onAddLog={() => {}} />
          )}
          {currentView === 'physical' && profile.authenticated && (
            <PhysicalRecovery 
              profile={profile} 
              setProfile={setProfile}
              onToggleActivity={toggleActivity}
              activities={filteredActivities} 
            />
          )}
          {currentView === 'mental' && profile.authenticated && <MentalWellness />}
          {currentView === 'education' && <Education />}
          {currentView === 'membership' && <Membership profile={profile} setProfile={setProfile} />}
          {currentView === 'profile' && profile.authenticated && <Settings profile={profile} setProfile={setProfile} />}
          {currentView === 'care-connect' && profile.authenticated && (
            <CareConnect 
              profile={profile} 
              appointments={appointments} 
              setAppointments={setAppointments} 
              circles={circles}
              setCircles={setCircles}
              addNotification={addNotification}
            />
          )}
        </div>

        {showNotifications && (
          <NotificationPanel 
            notifications={notifications} 
            onClose={() => setShowNotifications(false)}
            onClear={() => setNotifications([])} 
          />
        )}
      </main>

      {showSOS && <SOSOverlay profile={profile} onClose={() => setShowSOS(false)} />}
    </div>
  );
};

export default App;
