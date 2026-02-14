
import { RecoveryActivity, RecoveryPhase } from './types';

export const COLORS = {
  pink: { 
    primary: '#F9A8D4', // Blush Pink
    bg: '#FFF5F7', 
    border: '#FCE7F3', 
    text: '#831843', 
    ring: 'ring-pink-100',
    light: '#FDF2F8'
  },
  green: { 
    primary: '#A7F3D0', // Muted Sage
    bg: '#F0FDF4', 
    border: '#DCFCE7', 
    text: '#064E3B', 
    ring: 'ring-emerald-100',
    light: '#ECFDF5'
  },
  blue: { 
    primary: '#BAE6FD', // Powder Blue
    bg: '#F0F9FF', 
    border: '#E0F2FE', 
    text: '#0C4A6E', 
    ring: 'ring-sky-100',
    light: '#F0F9FF'
  },
  grey: { 
    primary: '#CBD5E1', // Soft Grey
    bg: '#F8FAFC', 
    border: '#F1F5F9', 
    text: '#334155', 
    ring: 'ring-slate-100',
    light: '#F8FAFC'
  }
};

export const PRICING = { plus: 399 };
export const SLOGAN = "Safe Healing Journey";

export const HELPLINES = {
  india: {
    name: "Kiran Mental Health",
    number: "1800-599-0019",
    label: "24/7 National Helpline"
  },
  emergency: "112"
};

export const PHASES: RecoveryPhase[] = ['Stabilize', 'Strengthen', 'Restore', 'Rebuild Confidence'];

export const RECOVERY_DATABASE: RecoveryActivity[] = [
  // Phase 1: Stabilize
  { id: 'st-1', phase: 'Stabilize', category: 'breathing', title: 'Deep Diaphragmatic Breath', description: 'Gently expand your belly as you inhale. Essential for internal pressure management.', duration: 5, points: 10, intensityScale: 1 },
  { id: 'st-2', phase: 'Stabilize', category: 'pelvic', title: 'Gentle Floor Awareness', description: 'Visualization and very light engagement of the pelvic floor.', duration: 3, points: 10, intensityScale: 1 },
  { id: 'st-cs-1', phase: 'Stabilize', category: 'physio', title: 'Log Rolling Technique', description: 'Safe way to get out of bed without straining incision.', duration: 2, points: 15, typeSpecific: 'c-section', intensityScale: 2 },
  
  // Phase 2: Strengthen
  { id: 'sg-1', phase: 'Strengthen', category: 'pelvic', title: 'Timed Kegel Series', description: 'Structured holds and releases to build functional strength.', duration: 5, points: 20, intensityScale: 3 },
  { id: 'sg-2', phase: 'Strengthen', category: 'physio', title: 'Transverse Abdominal Wake-up', description: 'Subtle deep core engagement without crunching.', duration: 4, points: 20, intensityScale: 4 },
  
  // Phase 3: Restore
  { id: 'rt-1', phase: 'Restore', category: 'walking', title: 'Structured Interval Walk', description: '10 min walk with posture focus.', duration: 10, points: 30, intensityScale: 5 },
  { id: 'rt-2', phase: 'Restore', category: 'stretching', title: 'Post-Nursing Neck Stretch', description: 'Relieve tension from nursing or holding the baby.', duration: 5, points: 15, intensityScale: 3 },
  
  // Phase 4: Rebuild Confidence
  { id: 'rb-1', phase: 'Rebuild Confidence', category: 'physio', title: 'Functional Mobility Flow', description: 'Gentle full-body movement patterns.', duration: 15, points: 50, intensityScale: 7 },
  { id: 'rb-cp', phase: 'Rebuild Confidence', category: 'checkpoint', title: 'Diastasis Recti Final Check', description: 'Assess core closure before advanced activity.', duration: 10, points: 100, intensityScale: 2 }
];

export const STABILIZATION_TASKS = [
  "Gratitude: Write 3 small wins from today.",
  "Bonding: 5 mins of skin-to-skin or eye contact.",
  "Grounding: Notice 5 things you can see and 4 you can touch.",
  "Hydration: Drink a glass of warm Ajwain water."
];

export const NUTRITION_GUIDE = [
  { 
    title: "Iron & Energy", 
    items: ["Ragi (Finger Millet)", "Spinach", "Beetroot", "Traditional Soup (Shorba)"],
    benefit: "Replenishes blood loss and prevents anemia."
  },
  { 
    title: "Digestive Health", 
    items: ["Ajwain Water", "Fenugreek (Methi)", "Lauki (Bottle Gourd)"],
    benefit: "Aids digestion and lactation."
  },
  { 
    title: "Calcium Recovery", 
    items: ["Dairy/Curd", "Sesame Seeds", "Almonds"],
    benefit: "Supports bone health and milk production."
  }
];

export const EPDS_QUESTIONS = [
  "I have been able to laugh and see the bright side of things.",
  "I have looked forward with enjoyment to things.",
  "I have blamed myself unnecessarily when things went wrong.",
  "I have been anxious or worried for no good reason.",
  "I have felt scared or panicky for no very good reason.",
  "Things have been getting on top of me.",
  "I have been so unhappy that I have had difficulty sleeping.",
  "I have felt sad or miserable.",
  "I have been so unhappy that I have been crying.",
  "The thought of harming myself has occurred to me."
];
