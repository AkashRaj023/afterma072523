
export type DeliveryType = 'normal' | 'c-section' | 'pending';
export type ThemeAccent = 'PINK' | 'GREEN' | 'BLUE' | 'PURPLE' | 'YELLOW';
export type RecoveryPhase = 'Month 1' | 'Month 2' | 'Month 3' | 'Month 4+' | 'Trimester 1' | 'Trimester 2' | 'Trimester 3' | 'Pre-conception';
export type MaternityStage = 'TTC' | 'Pregnant-T1' | 'Pregnant-T2' | 'Pregnant-T3' | 'Postpartum';
export type RecoveryPace = 'gentle' | 'moderate';
export type Language = 'english' | 'hindi';

export interface JourneySettings {
  pace: RecoveryPace;
  preferredTime: 'morning' | 'evening';
  goals: string[];
  isPaused: boolean;
  language: Language;
}

export interface NotificationSettings {
  exerciseReminders: boolean;
  hydrationAlerts: boolean;
  moodCheckins: boolean;
  careConnectUpdates: boolean;
  sosConfirmations: boolean;
}

export interface CaregiverInfo {
  name: string;
  relationship: string;
  contact: string;
  permissions: {
    canViewMood: boolean;
    canViewPhysical: boolean;
    canViewMedicalHistory: boolean;
    canViewAppointments: boolean;
  };
}

export interface Appointment {
  id: string;
  specialistName: string;
  type: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled';
  price?: string;
}

export interface CommunityCircle {
  id: string;
  name: string;
  members: number;
  description: string;
  isJoined: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  brand: string;
  category: 'Baby Care' | 'Recovery' | 'Nutrition' | 'Devices' | 'Maternity Care';
  price: number;
  image: string;
  description: string;
  rating: number;
}

export interface CartItem extends StoreItem {
  quantity: number;
}

export interface PeriodLog {
  id: string;
  date: string;
  flow: 'Spotting' | 'Light' | 'Medium' | 'Heavy' | 'None';
  symptoms: string[];
  mood: string;
  notes: string;
}

export interface UserProfile {
  name: string;
  age: number;
  deliveryDate: string;
  deliveryType: DeliveryType;
  maternityStage: MaternityStage;
  authenticated: boolean;
  role: 'mother' | 'caregiver';
  accent: ThemeAccent;
  incognito: boolean;
  medicalHistory: string;
  emergencyContact: string;
  membershipPlan: 'free' | 'plus';
  currentPhase: RecoveryPhase;
  completedActivities: string[]; 
  streakCount: number;
  streakProtectionActive: boolean;
  lastLoginDate: string; // YYYY-MM-DD
  badges: string[];
  caregiver: CaregiverInfo;
  journeySettings: JourneySettings;
  notifications: NotificationSettings;
  periodLogs: PeriodLog[];
  profilePicture?: string;
}

export interface HealthLog {
  id: string;
  timestamp: number;
  painLevel: number;
  energyLevel: number;
  moodLevel: number;
  sleepHours: number;
  waterIntake: number;
  medicationsTaken: boolean;
  symptoms: string[];
  kegelCount: number;
  isSensitive?: boolean;
}

export interface RecoveryActivity {
  id: string;
  phase: RecoveryPhase;
  title: string;
  description: string;
  category: 'Physical Recovery' | 'Emotional Stabilization' | 'Strength Building' | 'Prenatal Care' | 'Birth Prep';
  duration: number; // minutes
  frequency: string; 
  points: number;
  typeSpecific?: DeliveryType; 
  intensityScale: number; // 1-10
}

export type AppView = 
  | 'education' 
  | 'dashboard' 
  | 'physical' 
  | 'mental' 
  | 'care-connect' 
  | 'momkart'
  | 'profile'
  | 'membership'
  | 'caregiver';
