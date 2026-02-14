
import { RecoveryActivity, RecoveryPhase, StoreItem } from './types';

export const COLORS = {
  PINK: { 
    primary: '#EC4899', 
    bg: '#FFF5F7', 
    border: '#F9A8D4', 
    text: '#831843', 
    ring: 'ring-pink-200',
    light: '#FFF5F7'
  },
  GREEN: { 
    primary: '#10B981', 
    bg: '#F0FDF4', 
    border: '#A7F3D0', 
    text: '#064E3B', 
    ring: 'ring-emerald-200',
    light: '#F0FDF4'
  },
  BLUE: { 
    primary: '#0EA5E9', 
    bg: '#F0F9FF', 
    border: '#BAE6FD', 
    text: '#0C4A6E', 
    ring: 'ring-sky-200',
    light: '#F0F9FF'
  },
  PURPLE: { 
    primary: '#8B5CF6', 
    bg: '#F5F3FF', 
    border: '#DDD6FE', 
    text: '#4C1D95', 
    ring: 'ring-purple-200',
    light: '#F5F3FF'
  },
  YELLOW: { 
    primary: '#F59E0B', 
    bg: '#FFFBEB', 
    border: '#FDE68A', 
    text: '#78350F', 
    ring: 'ring-amber-200',
    light: '#FFFBEB'
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

export const PHASES: RecoveryPhase[] = ['Month 1', 'Month 2', 'Month 3', 'Month 4+'];

export const RECOVERY_DATABASE: RecoveryActivity[] = [
  // Month 1: Stabilization & Gentle Movement
  { id: 'm1-p1', phase: 'Month 1', category: 'Physical Recovery', title: 'Deep Diaphragmatic Breath', description: 'Internal pressure management and core connection.', duration: 5, frequency: 'Daily', points: 10, intensityScale: 1 },
  { id: 'm1-e1', phase: 'Month 1', category: 'Emotional Stabilization', title: 'Skin-to-Skin Bonding', description: '5 mins of eye contact or skin contact to lower cortisol.', duration: 5, frequency: 'Daily', points: 15, intensityScale: 1 },
  { id: 'm1-s1', phase: 'Month 1', category: 'Strength Building', title: 'Pelvic Floor Awareness', description: 'Visualizing engagement without heavy contraction.', duration: 3, frequency: '3x week', points: 10, intensityScale: 2 },
  { id: 'm1-cs1', phase: 'Month 1', category: 'Physical Recovery', title: 'Safe Mobility: Log Roll', description: 'Preventing abdominal strain after C-Section.', duration: 2, frequency: 'As needed', points: 15, typeSpecific: 'c-section', intensityScale: 2 },
  
  // Month 2: Gentle Strength
  { id: 'm2-p1', phase: 'Month 2', category: 'Physical Recovery', title: 'Structured Walking', description: 'Short 10-min interval walks to build stamina.', duration: 10, frequency: 'Daily', points: 20, intensityScale: 3 },
  { id: 'm2-e1', phase: 'Month 2', category: 'Emotional Stabilization', title: 'Gratitude Journaling', description: 'Note 3 wins to anchor your mental resilience.', duration: 5, frequency: 'Daily', points: 10, intensityScale: 1 },
  { id: 'm2-s1', phase: 'Month 2', category: 'Strength Building', title: 'Transverse Core Wake-up', description: 'Subtle deep core activation exercises.', duration: 5, frequency: '4x week', points: 25, intensityScale: 4 },

  // Month 3: Restoration
  { id: 'm3-p1', phase: 'Month 3', category: 'Physical Recovery', title: 'Post-Nursing Neck Stretch', description: 'Relieving cervical tension from holding baby.', duration: 5, frequency: 'Daily', points: 15, intensityScale: 3 },
  { id: 'm3-e1', phase: 'Month 3', category: 'Emotional Stabilization', title: 'Guided Grounding', description: '5-4-3-2-1 technique for anxious moments.', duration: 10, frequency: 'As needed', points: 20, intensityScale: 2 },
  { id: 'm3-s1', phase: 'Month 3', category: 'Strength Building', title: 'Pelvic Power Series', description: 'Timed holds and rapid pulses for functional core.', duration: 8, frequency: '3x week', points: 30, intensityScale: 5 },

  // Month 4+: Confidence & Resilience
  { id: 'm4-p1', phase: 'Month 4+', category: 'Physical Recovery', title: 'Full Body Mobility Flow', description: 'Dynamic movement to regain full range of motion.', duration: 15, frequency: '3x week', points: 40, intensityScale: 6 },
  { id: 'm4-s1', phase: 'Month 4+', category: 'Strength Building', title: 'Checkpoint: Diastasis Recti', description: 'Self-assessment and targeted closure drills.', duration: 12, frequency: '2x week', points: 100, intensityScale: 4 }
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

export const STORE_ITEMS: StoreItem[] = [
  { id: 'p1', name: 'Organic Nipple Balm', brand: 'Mamaearth', category: 'Recovery', price: 450, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400', description: 'Soothes and protects sensitive skin.', rating: 4.8 },
  { id: 'p2', name: 'Cotton Belly Wrap', brand: 'FirstCry', category: 'Recovery', price: 1200, image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=400', description: 'Comfortable support for postpartum core.', rating: 4.9 },
  { id: 'p3', name: 'Cerelac Wheat-Apple', brand: 'Nestlé', category: 'Nutrition', price: 350, image: 'https://images.unsplash.com/photo-1544787210-2211d430154e?auto=format&fit=crop&q=80&w=400', description: 'Traditional infant nutrition supplement.', rating: 4.7 },
  { id: 'p4', name: 'Symphony Breast Pump', brand: 'Medela', category: 'Devices', price: 4500, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400', description: 'Hospital-grade efficiency for home use.', rating: 4.6 },
  { id: 'p5', name: 'Pure Almond Baby Oil', brand: 'Himalaya Baby', category: 'Baby Care', price: 250, image: 'https://images.unsplash.com/photo-1555820585-c5ae44394b79?auto=format&fit=crop&q=80&w=400', description: 'Traditional Ayurvedic care for infants.', rating: 4.9 },
  { id: 'p6', name: 'Diaper Rash Cream', brand: 'Sebamed', category: 'Baby Care', price: 550, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=400', description: 'pH balanced clinical protection.', rating: 4.8 },
  { id: 'p7', name: 'Stretch Mark Lotion', brand: 'Mamaearth', category: 'Recovery', price: 499, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400', description: 'Toxin-free care for recovery skin.', rating: 4.7 },
  { id: 'p8', name: 'Natural Baby Wipes', brand: 'Johnson & Johnson', category: 'Baby Care', price: 199, image: 'https://images.unsplash.com/photo-1584305650818-bc19bca9445a?auto=format&fit=crop&q=80&w=400', description: 'Clinically proven mildness for soft skin.', rating: 4.6 },
  { id: 'p9', name: 'Avent Natural Bottle', brand: 'Philips Avent', category: 'Devices', price: 850, image: 'https://images.unsplash.com/photo-1610492317734-d89741c8c114?auto=format&fit=crop&q=80&w=400', description: 'Wide breast-shaped nipple for natural latch.', rating: 4.8 },
  { id: 'p10', name: 'Postpartum Tea Mix', brand: 'Pigeon', category: 'Nutrition', price: 420, image: 'https://images.unsplash.com/photo-1594631252845-595b998e31b6?auto=format&fit=crop&q=80&w=400', description: 'Supports lactation and digestive ease.', rating: 4.5 },
  { id: 'p11', name: 'Baby Bath Foam', brand: 'Chicco', category: 'Baby Care', price: 600, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=400', description: 'No-tears formula with calendula.', rating: 4.7 },
];

export const EXPERT_DATA = [
  // Physiotherapy
  { category: 'Physiotherapy', name: 'Dr. Shweta Singh', role: 'Pelvic Floor Physiotherapist', credentials: 'MPT (Obstetrics & Gynecology), 12+ Years Exp.', insight: 'Core stability starts with the breath; focus on your diaphragm to heal the pelvic floor.', price: '₹1200' },
  { category: 'Physiotherapy', name: 'Dr. Rohan Das', role: 'Rehab Specialist', credentials: 'MPT (Sports Rehab), 8+ Years Exp.', insight: 'Gentle steps lead to great strides in abdominal recovery.', price: '₹1100' },
  { category: 'Physiotherapy', name: 'Dr. Anjali Deshmukh', role: 'Pelvic Health Expert', credentials: 'BPT, Specialized in Postpartum Physio', insight: 'Listening to your pelvic floor is the first step to reclaiming your strength.', price: '₹1000' },
  { category: 'Physiotherapy', name: 'Dr. Vikram Seth', role: 'Senior Physiotherapist', credentials: 'MPT, Max Hospital Fellow', insight: 'Functional stability is the key foundation for pain-free motherhood.', price: '₹1300' },
  
  // OB-GYN
  { category: 'OB-GYN', name: 'Dr. Meena Iyer', role: 'Senior Obstetrician', credentials: 'MD, DNB (OB-GYN), Apollo Hospitals', insight: 'Recovery is a marathon, not a sprint. Listen to your body’s signals for rest.', price: '₹1500' },
  { category: 'OB-GYN', name: 'Dr. Sunita Kapoor', role: 'Maternal Care Specialist', credentials: 'MBBS, MS (OB-GYN), 15+ Years Exp.', insight: 'Proper nutrition is as important as physical rest for internal healing.', price: '₹1400' },
  { category: 'OB-GYN', name: 'Dr. Preeti Verma', role: 'Gynae Surgeon', credentials: 'MD (OB-GYN), Fortis Healthcare', insight: 'Incision care and gentle movement are the pillars of surgical recovery.', price: '₹1600' },
  { category: 'OB-GYN', name: 'Dr. Lakshmi Narayan', role: 'Women Wellness Expert', credentials: 'DGO, Maternal Health Researcher', insight: 'Mental and physical health are deeply linked in the postpartum period.', price: '₹1200' },

  // Lactation
  { category: 'Lactation', name: 'Dr. Kavita Reddy', role: 'IBCLC Lactation Consultant', credentials: 'Certified Lactation Professional', insight: 'A good latch is the foundation of a happy feeding journey for both mother and child.', price: '₹1000' },
  { category: 'Lactation', name: 'Dr. Smita Patil', role: 'Feeding Counselor', credentials: 'Certified Breastfeeding Counselor (BPNI)', insight: 'Patience and persistence are your best allies in establishing milk supply.', price: '₹900' },
  { category: 'Lactation', name: 'Dr. Neha Sharma', role: 'Lactation Expert', credentials: 'Certified Consultant, Cloudnine Hospitals', insight: 'Correct positioning can alleviate the majority of nursing discomfort.', price: '₹1100' },
  { category: 'Lactation', name: 'Dr. Priya Bansal', role: 'Child Nutritionist', credentials: 'M.Sc. Nutrition, IBCLC Associate', insight: 'Hydration and balanced meals directly support a sustainable nursing journey.', price: '₹1200' }
];

export const NGO_DATA = [
  { name: 'White Swan Foundation', area: 'Mental Health Awareness', contact: '080-2555-5555', website: 'whiteswanfoundation.org' },
  { name: 'Sangath', area: 'Maternal Mental Health', contact: '011-4050-6666', website: 'sangath.in' },
  { name: 'The Banyan', area: 'Crisis Support', contact: '044-2454-5555', website: 'thebanyan.org' }
];

export const INSURANCE_DATA = [
  { bank: 'SBI Life', plan: 'Sampoorna Suraksha', benefit: 'Maternity Rider & Newborn Cover', minAge: 18 },
  { bank: 'ICICI Lombard', plan: 'Health Shield', benefit: 'Cashless Delivery & Recovery Assist', minAge: 21 },
  { bank: 'Canara Bank', plan: 'Canara Health Plus', benefit: 'Low-cost Premium for Young Mothers', minAge: 18 },
  { bank: 'Axis Bank', plan: 'Axis Care Plus', benefit: 'Exclusive Postpartum Wellness Benefits', minAge: 25 }
];

export const GOVT_SCHEMES = [
  { title: 'PMMVY', fullName: 'Pradhan Mantri Matru Vandana Yojana', benefit: '₹5,000 Direct Benefit Transfer', eligibility: 'First-time mothers' },
  { title: 'JSY', fullName: 'Janani Suraksha Yojana', benefit: 'Financial assistance for institutional delivery', eligibility: 'Below Poverty Line mothers' },
  { title: 'JSSK', fullName: 'Janani Shishu Suraksha Karyakram', benefit: 'Zero-cost cashless delivery & treatment', eligibility: 'All pregnant women in govt hospitals' }
];
