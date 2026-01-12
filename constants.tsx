
import { Product, AnalyticsData, Pharmacist, Offer, HealthService, HealthPackage, LabPartner, BlogArticle, Manufacturer, Store, MTMPlan, Clinic, LabTest, CorporatePlan, Vendor, PurchaseOrder } from './types';

export const MOCK_BLOGS: BlogArticle[] = [
  {
    id: 'b1',
    title: "Understanding Generic vs Brand Name Medicines",
    excerpt: "Why the price difference doesn't mean a difference in quality or efficacy.",
    content: "Full article content about bioequivalence and FDA/CDSCO standards...",
    category: "Education",
    author: "Dr. Sarah Varma",
    date: "2024-05-15",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800",
    verifiedBy: "Clinical Board"
  },
  {
    id: 'b2',
    title: "The Rise of Personalized Medicine in India",
    excerpt: "How genetic profiling is changing how we treat chronic conditions.",
    content: "Precision medicine is no longer a futuristic concept...",
    category: "Innovation",
    author: "Dr. Rajesh Mehta",
    date: "2024-05-12",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
    verifiedBy: "Tech Hub"
  },
  {
    id: 'b3',
    title: "Vitamins: Do You Really Need Supplements?",
    excerpt: "Debunking myths about multi-vitamins and understanding natural absorption.",
    content: "Most healthy adults get enough nutrients from a balanced diet...",
    category: "Wellness",
    author: "Dr. Priya Iyer",
    date: "2024-05-10",
    image: "https://images.unsplash.com/photo-1584017945516-30751f77a81b?auto=format&fit=crop&q=80&w=800",
    verifiedBy: "Nutrition Node"
  }
];

export const MOCK_NEWS = [
  {
    id: 'n1',
    title: "New Regulation on Digital Prescriptions",
    summary: "Government mandates QR codes on all primary care prescriptions by Q4.",
    date: "2 hours ago",
    tag: "Regulation"
  },
  {
    id: 'n2',
    title: "Breakthrough in Insulin Delivery Nodes",
    summary: "New non-invasive patch shows 99% efficacy in early clinical trials.",
    date: "5 hours ago",
    tag: "Medical Tech"
  }
];

export const MOCK_PHARMACISTS: Pharmacist[] = [
  {
    id: 'ph1',
    name: "Dr. Sarah Varma",
    registrationNumber: "PH-IND-2024-8892",
    experience: "12+ Years",
    specialty: "Clinical Pharmacy",
    certifications: ["PCI Verified", "Quality Assurance"],
    image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400",
    phone: "+919876543210",
    available: true,
    rating: 4.9,
    bio: "Expert in medicine interaction analysis and dosage optimization for chronic care patients."
  },
  {
    id: 'ph2',
    name: "Dr. Rajesh Mehta",
    registrationNumber: "PH-IND-2024-9912",
    experience: "8+ Years",
    specialty: "Geriatric Care",
    certifications: ["PCI Verified", "Therapy Management"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    phone: "+919876543211",
    available: false,
    rating: 4.7,
    bio: "Dedicated to helping seniors manage complex multi-medication schedules safely."
  },
  {
    id: 'ph3',
    name: "Dr. Priya Iyer",
    registrationNumber: "PH-IND-2024-7721",
    experience: "15+ Years",
    specialty: "Pediatric Formulations",
    certifications: ["PCI Verified", "Advanced Care"],
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
    phone: "+919876543215",
    available: true,
    rating: 5.0,
    bio: "Specialist in pediatric medicine delivery systems and safe OTC care for children."
  }
];

export const MOCK_CLINICS: Clinic[] = [
  {
    id: 'c1',
    name: 'Apollo Medical Node',
    specialty: 'General Medicine',
    doctorName: 'Dr. Vivek Malhotra',
    address: 'Vashi Sector 17, Navi Mumbai',
    rating: 4.8,
    availableSlots: ['10:00 AM', '11:30 AM', '04:00 PM', '06:00 PM'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
    description: "Full-service medical node offering diagnostic and consultation services for the whole family."
  },
  {
    id: 'c2',
    name: 'Fortis Clinic Node',
    specialty: 'Pediatrics',
    doctorName: 'Dr. Anjali Desai',
    address: 'Andheri West, Mumbai',
    rating: 4.9,
    availableSlots: ['09:00 AM', '01:00 PM', '05:30 PM'],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    description: "Specialized care for infants, children, and adolescents with 24/7 pediatric emergency support."
  },
  {
    id: 'c3',
    name: 'Lilavati Cardiac Node',
    specialty: 'Cardiology',
    doctorName: 'Dr. Sameer Kulkarni',
    address: 'Bandra West, Mumbai',
    rating: 5.0,
    availableSlots: ['08:00 AM', '12:00 PM', '04:30 PM'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    description: "Premier cardiac care center featuring world-class cardiologists and advanced heart health telemetry."
  }
];

export const MOCK_LAB_TESTS: LabTest[] = [
  {
    id: 'lt1',
    name: 'Complete Blood Count (CBC)',
    price: 350,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTime: '12 Hours',
    partnerId: 'lp1',
    partnerName: 'SRL Diagnostics',
    description: "A blood test used to evaluate your overall health and detect a wide range of disorders."
  },
  {
    id: 'lt2',
    name: 'Diabetes Screening (HbA1c)',
    price: 650,
    sampleType: 'Blood',
    fastingRequired: true,
    reportTime: '24 Hours',
    partnerId: 'lp1',
    partnerName: 'SRL Diagnostics',
    description: "Measures your average blood sugar levels over the past 3 months."
  },
  {
    id: 'lt3',
    name: 'Thyroid Profile Node',
    price: 850,
    sampleType: 'Blood',
    fastingRequired: true,
    reportTime: '24 Hours',
    partnerId: 'lp2',
    partnerName: 'Metropolis Labs',
    description: "Comprehensive panel to evaluate thyroid function (T3, T4, TSH)."
  },
  {
    id: 'lt4',
    name: 'Lipid Profile Node',
    price: 1200,
    sampleType: 'Blood',
    fastingRequired: true,
    reportTime: '24 Hours',
    partnerId: 'lp2',
    partnerName: 'Metropolis Labs',
    description: "Measures cholesterol and triglyceride levels to assess heart health risk."
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    brand: 'Panadol',
    activeIngredient: 'Paracetamol',
    category: 'Pain Relief',
    price: 45.00,
    description: 'Effective relief for pain and fever.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    stock: 250,
    requiresPrescription: false,
    expiryDate: '2026-08-15',
    batchNumber: 'BN-8821-X',
    rating: 4.8,
    reviews: [],
    sideEffects: ['Nausea', 'Loss of appetite'],
    usageInstructions: 'Take 1 tablet every 4-6 hours with water.',
    usageVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    condition: 'Fever & Pain',
    missedDoseGuidance: 'Take it as soon as you remember. If it is almost time for your next dose, skip the missed dose and resume your regular dosing schedule. Do not double doses.',
    clinicalInsights: {
      prescriptionsLastMonth: 1240,
      doctorApprovalRate: 94,
      sideEffectStats: [{ effect: 'No Side Effects', percentage: 88 }, { effect: 'Nausea', percentage: 7 }, { effect: 'Other', percentage: 5 }],
      ratingStats: [{ stars: 5, count: 850 }, { stars: 4, count: 210 }, { stars: 3, count: 45 }, { stars: 2, count: 12 }, { stars: 1, count: 5 }]
    }
  },
  {
    id: '3',
    name: 'Vitamin D3 60K',
    brand: 'Uprise-D3',
    activeIngredient: 'Cholecalciferol',
    category: 'Vitamins',
    price: 350.00,
    description: 'High potency Vitamin D3 for bone health and immunity.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    stock: 50,
    requiresPrescription: false,
    expiryDate: '2026-10-20',
    batchNumber: 'BN-7721-V',
    rating: 4.9,
    reviews: [],
    usageInstructions: 'Take once a week as directed by your physician.',
    usageVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    missedDoseGuidance: 'Take it the same day you remember. If several days have passed, skip it and wait for your next weekly scheduled dose.',
    clinicalInsights: {
      prescriptionsLastMonth: 450,
      doctorApprovalRate: 99,
      sideEffectStats: [{ effect: 'No Side Effects', percentage: 98 }, { effect: 'Other', percentage: 2 }],
      ratingStats: [{ stars: 5, count: 400 }, { stars: 4, count: 40 }, { stars: 3, count: 8 }, { stars: 2, count: 2 }, { stars: 1, count: 0 }]
    }
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    brand: 'Zyrtec',
    activeIngredient: 'Cetirizine Dihydrochloride',
    category: 'Allergy',
    price: 120.00,
    description: 'Relief from seasonal allergies and hay fever.',
    image: 'https://images.unsplash.com/photo-1550572017-ed20015994b9?auto=format&fit=crop&q=80&w=400',
    stock: 120,
    requiresPrescription: false,
    expiryDate: '2027-01-12',
    batchNumber: 'BN-9912-A',
    rating: 4.7,
    reviews: [],
    usageInstructions: 'One tablet daily, preferably in the evening.',
    usageVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    missedDoseGuidance: 'Take the missed dose as soon as you remember. Skip it if your next dose is less than 12 hours away.',
    clinicalInsights: {
      prescriptionsLastMonth: 3200,
      doctorApprovalRate: 92,
      sideEffectStats: [{ effect: 'No Side Effects', percentage: 80 }, { effect: 'Drowsiness', percentage: 15 }, { effect: 'Dry Mouth', percentage: 5 }],
      ratingStats: [{ stars: 5, count: 2100 }, { stars: 4, count: 800 }, { stars: 3, count: 200 }, { stars: 2, count: 70 }, { stars: 1, count: 30 }]
    }
  }
];

export const MOCK_STORES: Store[] = [
  {
    id: 'node-central',
    name: 'HealthHub Central Hub',
    address: 'Plot 12, Sector 17, Vashi, Navi Mumbai',
    city: 'Navi Mumbai',
    pincodes: ['400703', '400705', '400706'],
    coordinates: { lat: 19.0745, lng: 72.9978 },
    status: 'active',
    loadFactor: 0.3
  }
];

export const MOCK_ANALYTICS: AnalyticsData[] = [
  { name: 'Mon', sales: 42000, orders: 120 },
  { name: 'Tue', sales: 38000, orders: 110 },
  { name: 'Wed', sales: 45000, orders: 130 },
  { name: 'Thu', sales: 52000, orders: 150 },
  { name: 'Fri', sales: 48000, orders: 140 },
  { name: 'Sat', sales: 55000, orders: 160 },
  { name: 'Sun', sales: 60000, orders: 180 }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Zydus Lifesciences', contactPerson: 'Rahul Khanna', email: 'p@z.com', phone: '9821', address: 'AMD', reliabilityScore: 4.9, categories: ['A'], status: 'active' }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [];
export const MOCK_MTM: MTMPlan = { id: 'm1', patientName: 'Arjun', goals: [], medications: [], pharmacistReview: '', lastUpdated: '' };
export const MOCK_CORPORATE_PLANS: CorporatePlan[] = [];
