
import React, { useState, useEffect, useMemo, useRef } from 'react';
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

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  const [logs, setLogs] = useState<HealthLog[]>([]);

  useEffect(() => {
    localStorage.setItem('afterma_profile_v2', JSON.stringify(profile));
    // Set HTML lang attribute for accessibility and styling
    document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';
  }, [profile, lang]);

  // Close mobile menu on view change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const theme = COLORS[profile.accent] || COLORS.pink;

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
    
    if (timeSinceLastClick < 300) { // Double tap threshold 300ms
      triggerSOS();
    }
    lastClickRef.current = currentTime;
  };

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
      {/* Mobile Navigation Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation - Sidebar on Desktop, Drawer on Mobile */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-[60] lg:z-50`}>
        <Navigation 
          currentView={currentView} 
          setView={setView} 
          profile={profile} 
          logout={logout}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
      
      <main className="flex-1 w-full lg:ml-64 min-h-screen relative overflow-x-hidden">
        <header className="h-16 lg:h-24 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 lg:gap-6 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-xl"
            >
              <Menu size={24} />
            </button>
            
            <div className="relative max-w-xl w-full hidden sm:block">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                <Search className={`${profile.incognito ? 'text-purple-500' : 'text-gray-400'}`} size={20} />
              </div>
              <input 
                type="text" 
                placeholder={profile.incognito ? t.common.incognito + " Active..." : t.common.searchPlaceholder}
                className={`w-full border border-gray-50 rounded-full py-4 pl-14 pr-24 focus:ring-4 transition-all text-base font-medium shadow-lg shadow-gray-200/40 placeholder:text-gray-400 ${profile.incognito ? 'bg-purple-50/50 focus:ring-purple-100' : 'bg-gray-50/80 focus:ring-pink-100'}`}
              />
              <button 
                onClick={() => setProfile(p => ({...p, incognito: !p.incognito}))}
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase px-3 py-1.5 rounded-full transition-all tracking-wider ${profile.incognito ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
              >
                {profile.incognito ? t.common.hidden : t.common.incognito}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6 ml-4">
            <button 
              onClick={handleSOSClick}
              className="px-4 lg:px-6 py-2.5 lg:py-3 bg-[#EF4444] text-white rounded-full font-black text-[9px] lg:text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-red-200"
            >
              {t.common.sos}
            </button>
            
            {profile.authenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors"
                >
                  <Bell size={22} />
                  {notifications.length > 0 && <span className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse`} style={{ backgroundColor: theme.primary }}></span>}
                </button>
                <button 
                  onClick={() => setView('profile')} 
                  style={{ backgroundColor: theme.primary }}
                  className="h-10 w-10 lg:h-12 lg:w-12 rounded-full text-white flex items-center justify-center font-bold text-sm lg:text-base shadow-lg border-2 border-white hover:scale-110 transition-transform overflow-hidden"
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
                className="text-white px-6 lg:px-10 py-3 lg:py-3.5 rounded-full font-black text-xs lg:text-sm shadow-xl hover:opacity-90 transition-all"
              >
                {t.common.signIn}
              </button>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-8 pb-32">
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
