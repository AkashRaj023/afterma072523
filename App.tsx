
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppView, UserProfile, HealthLog, RecoveryActivity, RecoveryPhase, Appointment, CommunityCircle, PeriodLog } from './types';
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
import MomKart from './components/Store';
import { Search, Bell, Menu } from 'lucide-react';
import { RECOVERY_DATABASE, COLORS } from './constants';
import { translations } from './translations';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('education');
  const [showSOS, setShowSOS] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastClickRef = useRef<number>(0);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [circles, setCircles] = useState<CommunityCircle[]>([
    { id: '1', name: 'New Moms Bonding', members: 124, description: 'Sharing the joys and struggles of the first few months.', isJoined: false },
    { id: '2', name: 'Sleep Solutions', members: 89, description: 'Tips and support for the sleepless nights.', isJoined: false },
    { id: '3', name: 'Emotional Overwhelm', members: 56, description: 'A safe space to talk about the harder days.', isJoined: false },
  ]);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('afterma_profile_v3');
    if (saved) return JSON.parse(saved);
    return {
      name: "Guest",
      age: 28,
      deliveryDate: new Date().toISOString(),
      deliveryType: 'normal',
      authenticated: false,
      role: 'mother',
      accent: 'PINK',
      incognito: false,
      medicalHistory: "",
      emergencyContact: "",
      membershipPlan: 'free',
      currentPhase: 'Month 1',
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
      },
      periodLogs: []
    };
  });

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  const [logs, setLogs] = useState<HealthLog[]>([]);

  useEffect(() => {
    localStorage.setItem('afterma_profile_v3', JSON.stringify(profile));
    document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';
  }, [profile, lang]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const theme = COLORS[profile.accent] || COLORS.PINK;

  const addNotification = (title: string, text: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), title, text, time: 'Just now' }, ...prev]);
  };

  const handleLogin = () => {
    setProfile(prev => ({ ...prev, name: "Aditi Sharma", authenticated: true, lastLoginDate: new Date().toISOString().split('T')[0] }));
    setView('dashboard');
    addNotification(`${t.common.welcome} Aditi`, `Welcome back to your healing journey.`);
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

  const handleSOSClick = () => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickRef.current;
    if (timeSinceLastClick < 300) {
      triggerSOS();
    }
    lastClickRef.current = currentTime;
  };

  const filteredActivities = useMemo(() => {
    return RECOVERY_DATABASE
      .filter(a => !a.typeSpecific || a.typeSpecific === profile.deliveryType)
      .filter(a => {
        if (profile.journeySettings.pace === 'gentle') {
          return a.intensityScale <= 5 || a.category === 'Emotional Stabilization';
        }
        return true;
      });
  }, [profile.deliveryType, profile.journeySettings.pace]);

  return (
    <div className={`min-h-screen flex transition-colors duration-500 font-sans`} style={{ backgroundColor: theme.bg }}>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Truly Fixed */}
      <div className={`fixed inset-y-0 left-0 w-64 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-[60] lg:z-50 h-screen`}>
        <Navigation 
          currentView={currentView} 
          setView={setView} 
          profile={profile} 
          logout={logout}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen relative flex flex-col">
        {/* Sticky Header */}
        <header className="h-16 lg:h-20 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between border-b border-gray-100 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-2xl">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative w-full hidden sm:block">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <Search className={`${profile.incognito ? 'text-purple-500' : 'text-gray-400'}`} size={16} />
              </div>
              <input 
                type="text" 
                placeholder={profile.incognito ? "GHOST Mode Active..." : t.common.searchPlaceholder}
                className={`w-full border rounded-full py-2 pl-10 pr-20 focus:outline-none focus:ring-2 transition-all text-sm ${
                  profile.incognito 
                  ? 'bg-purple-50/50 border-purple-200 focus:ring-purple-100' 
                  : 'bg-white border-slate-200 focus:ring-pink-100 shadow-sm'
                }`}
              />
              <button 
                onClick={() => setProfile(p => ({...p, incognito: !p.incognito}))}
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase px-2 py-1 rounded-full transition-all ${profile.incognito ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {profile.incognito ? 'GHOST' : 'GHOST'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5 ml-4">
            <button 
              onClick={handleSOSClick}
              className="px-4 py-1.5 bg-[#EF4444] text-white rounded-full font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-red-100"
            >
              {t.common.sos}
            </button>
            
            {profile.authenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white`} style={{ backgroundColor: theme.primary }}></span>}
                </button>
                <button 
                  onClick={() => setView('profile')} 
                  style={{ backgroundColor: theme.primary }}
                  className="h-8 w-8 lg:h-9 lg:w-9 rounded-full text-white flex items-center justify-center font-bold text-xs lg:text-sm shadow-md border border-white hover:scale-105 transition-transform overflow-hidden"
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
                className="text-white px-5 py-2 rounded-full font-bold text-xs shadow-md hover:opacity-90 transition-all"
              >
                {t.common.signIn}
              </button>
            )}
          </div>
        </header>

        {/* View Content Wrapper */}
        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
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
            {currentView === 'mental' && profile.authenticated && <MentalWellness profile={profile} />}
            {currentView === 'education' && <Education profile={profile} />}
            {currentView === 'momkart' && profile.authenticated && <MomKart profile={profile} />}
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
