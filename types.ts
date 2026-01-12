
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SideEffectStat {
  effect: string;
  percentage: number;
}

export interface RatingStat {
  stars: number;
  count: number;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  reliabilityScore: number; // 1-5
  categories: string[];
  status: 'active' | 'blacklisted' | 'on_hold';
}

export interface PurchaseOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  status: 'draft' | 'pending' | 'shipped' | 'received' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  totalAmount: number;
  notes?: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  licenseNumber: string;
  headquarters: string;
  qualityRating: number;
  establishedYear: number;
  description: string;
  certifications: string[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  pincodes: string[]; // Serviceable pincodes
  coordinates: { lat: number; lng: number };
  status: 'active' | 'busy' | 'closed';
  loadFactor: number; // 0 to 1, affects delivery time
}

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  doctorName: string;
  address: string;
  rating: number;
  availableSlots: string[];
  image: string;
  description: string;
}

export interface LabTest {
  id: string;
  name: string;
  price: number;
  sampleType: string; // 'Blood', 'Urine', etc.
  fastingRequired: boolean;
  reportTime: string; // '24 Hours', etc.
  partnerId: string;
  partnerName: string;
  description: string;
}

export interface CorporatePlan {
  id: string;
  companyName: string;
  benefitType: 'Bulk Discount' | 'Priority Fulfillment' | 'Health Checkup';
  coveragePercentage: number;
  status: 'active' | 'pending';
}

export interface Pharmacist {
  id: string;
  name: string;
  registrationNumber: string;
  experience: string;
  specialty: string;
  certifications: string[];
  image: string;
  phone: string;
  available: boolean;
  rating: number;
  bio: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'DISPENSE' | 'VERIFY_PRESCRIPTION' | 'LOGIN' | 'RECALL_VOID' | 'CONSULTATION_START' | 'MTM_UPDATE' | 'VENDOR_PO_CREATE' | 'INVENTORY_RESTOCK';
  staffId: string;
  entityId: string; // Order ID or Product ID
  details: string;
  securityHash: string; // Mock hash for HIPAA/compliance
}

export interface AnalyticsData {
  name: string;
  sales: number;
  orders: number;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  expiry: string;
}

export interface HealthService {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
  category: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  includes: string[];
  image: string;
}

export interface LabPartner {
  id: string;
  name: string;
  specialty: string;
  logo: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  activeIngredient: string; // The "salt" of the medicine
  category: 'Pain Relief' | 'Vitamins' | 'Skincare' | 'Allergy' | 'First Aid' | 'Prescription' | 'Chronic Care';
  price: number;
  description: string;
  image: string;
  stock: number;
  requiresPrescription: boolean;
  expiryDate: string;
  batchNumber: string;
  rating: number;
  reviews: Review[];
  contraindications?: string[];
  dosageGuidelines?: string;
  manufacturerId?: string;
  recallStatus?: {
    isRecalled: boolean;
    reason: string;
    date: string;
  };
  qrCodeToken?: string;
  sideEffects?: string[];
  usageInstructions?: string;
  usageVideo?: string;
  condition?: string;
  missedDoseGuidance?: string;
  clinicalInsights?: {
    prescriptionsLastMonth: number;
    doctorApprovalRate: number;
    sideEffectStats: SideEffectStat[];
    ratingStats: RatingStat[];
  };
}

export interface Consultation {
  id: string;
  type: 'chat' | 'call' | 'review';
  pharmacistId: string;
  status: 'scheduled' | 'active' | 'completed';
  date: string;
  notes?: string;
}

export interface MTMPlan {
  id: string;
  patientName: string;
  goals: string[];
  medications: {
    name: string;
    schedule: string;
    purpose: string;
  }[];
  pharmacistReview: string;
  lastUpdated: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  verifiedBy?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'confirmed' | 'prescription_pending' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'UPI' | 'Card' | 'COD' | 'Insurance';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  type: 'delivery' | 'takeaway';
  date: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  autoRefill: boolean;
  storeId?: string;
  prescriptionUrl?: string;
  dispensedBy?: string; // Staff ID
  deliveryEstimate?: string;
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
  };
  tracking?: {
    currentPos: { lat: number, lng: number };
    history: { lat: number, lng: number }[];
  };
}

export type Language = 'en' | 'hi';

export type ViewState = 'home' | 'shop' | 'cart' | 'checkout' | 'user-dashboard' | 'staff-dashboard' | 'ai-assistant' | 'login' | 'policy' | 'services' | 'about' | 'privacy' | 'terms' | 'returns' | 'blog' | 'manufacturer' | 'tracking' | 'guides' | 'consult' | 'clinics' | 'labs' | 'corporate' | 'product-details' | 'smart-pack';

export interface AuthState {
  isLoggedIn: boolean;
  role: 'user' | 'staff' | null;
  userId?: string;
}

export interface NotificationSettings {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  allergies: string[];
  lastCheckup: string;
  membership: string;
  notificationSettings: NotificationSettings;
  addresses: string[];
  weight?: number;
  age?: number;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  corporatePlanId?: string;
}

export interface Reminder {
  id: string;
  medication: string;
  dosage: string;
  time: string;
  days: string[];
  active: boolean;
}

export interface ScannedPrescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  date: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface StockNotification {
  productId: string;
  productName: string;
  email: string;
  timestamp: string;
}
