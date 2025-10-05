// src/store/types.ts

// Nested types for Business Profile
interface BusinessContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

interface BusinessLocation {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;       // ✨ Landmark add karein
  latitude?: number | null;  // ✨ Latitude add karein
  longitude?: number | null;
}

interface OperatingHour {
  day: string;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

// Main Business Profile type
export interface BusinessProfile {
  _id?: string;
  name?: string;
  description?: string;
  category?: string;
  businessModel?: string;
  logoUrl?: string;
  contact?: BusinessContact;
  location?: BusinessLocation;
  operatingHours?: OperatingHour[];
}

// Main User object from backend
export interface User {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  token: string;
  role?: 'user' | 'business';
  availableRoles: string[];
  avatarUrl?: string | null;
  bio?: string;
  address?: BusinessLocation | null;
  businessProfile?: BusinessProfile | null; // Can be null
  isAdmin?: boolean;
  employeeProfile?: any | null; // Use a more specific type if you have one

}

// Data for new user registration
export interface RegisterUserData {
  fullName: string;
  mobileNumber: string;
  email: string;
  password?: string;
  role?: 'user' | 'business';
  avatarUrl?: string | null;
  address?: BusinessLocation | null;
}

// Data for login
export interface LoginUserData {
  mobileNumber: string;
  password?: string;
}

// Payload for updating user's personal details
// ✅ FIX: Payload for updating user to match Postman spec
export interface UpdateUserData {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  avatarUrl?: string | null;
  bio?: string;
  role?: 'user' | 'business';
  address?: BusinessLocation | null;
  password?: string; // Optional: for password changes
}

// Tax structure
export interface TaxRate {
  _id: string;
  name: string;      // e.g., "GST 18%"
  rate: number;      // e.g., 18
  description?: string;
  isActive: boolean;
}


// Yeh Blueprint (Template) ka structure hai
export interface ItemTemplate {
  _id: string;
  business: string;
  templateName: string;
  category: string | string[];
  modelType: string | string[];
  categories: string | string[];
  fields: {
    fieldName: string;
    label: string;
    fieldType: 'text' | 'number' | 'textarea' | 'dropdown-single' | 'dropdown-multi' | 'checkbox' | 'date' | 'switch' | 'file' | 'currency' | 'time';
    options?: string[];
    validation?: {
      isRequired: boolean;
      minLength?: number;
      maxLength?: number;
    };
    isSystemField?: boolean;
  }[];
  isPublic?: boolean;
  createdBy?: 'System' | 'User';
  version?: number;
  originTemplate?: ItemTemplate | string; // Original public template (ya uski ID)
  originVersion?: number;
}

// Yeh asli Product/Service/Plan (Item) ka structure hai
export interface CatalogItem {
  _id: string;
  business: string;
  template: string | ItemTemplate; // API se ID string ya poora object aa sakta hai
  name: string;
  description?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  isActive: boolean;
  tax?: TaxRate | string | null;
  // ✅ FIX: `pricingOptions` ab sabhi cases (e-commerce, subscription) ke liye kaam karega.
  // Yeh aapke Postman example se bilkul match karta hai.
  pricingOptions?: {
    label: string;
    basePrice: number;
    // 'cycle' batata hai ki yeh one-time purchase hai ya recurring subscription.
    cycle: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one-time';
    // Yeh do fields backend se calculate hokar aate hain.
    taxAmount: number;
    totalPrice: number;
  }[];

  // Puraani `pricing` property ko hata diya gaya hai taaki confusion na ho.
  // `subscriptionPlans` ki bhi zaroorat nahi hai kyunki `pricingOptions` hi sab handle kar raha hai.

  stock?: number;
  durationInMinutes?: number;
  dynamicFields: {
    [key: string]: any; // e.g., { "size": "M", "color": "Red" }
  };
  // Analytics
  views: number;
  clicks: number;
  likes: number;
  shares: number;
  rating: number;
  numReviews: number;
  reviews: any[];
}

