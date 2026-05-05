export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number; // Base price for minimum weight
  category: string;
  eventCategories: string[]; // Wedding, Birthday, etc.
  imageUrl: string;
  servings: string;
  flavors: string[];
  availableWeights: number[]; // [1, 2, 3, 5] kg
  colorOptions: string[];
  themeOptions?: string[];
  rating: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  total: number;
  deposit: number;
  deliveryFee: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially-paid' | 'fully-paid';
  paymentOption: 'deposit' | 'full';
  paymentReference?: string;
  createdAt: any;
  eventDate: string;
  eventTime?: string;
  eventType?: string;
  deliveryAddress: string;
  type: 'order' | 'booking';
}

export interface OrderItem {
  cakeId: string;
  cakeName: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  weight: number;
  flavor: string;
  themeColors?: string[];
  customMessage?: string;
  notes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
}

export interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  status: 'pending' | 'enrolled' | 'completed';
  paymentStatus: 'unpaid' | 'paid';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  color: string;
  accent: string;
}

export interface WebsiteSettings {
  id: 'global';
  heroSlides: HeroSlide[];
  deliveryFees: {
    nairobi: number;
    outsideNairobi: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    instagram?: string;
    facebook?: string;
  };
  homeContent: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutText: string;
  };
}

