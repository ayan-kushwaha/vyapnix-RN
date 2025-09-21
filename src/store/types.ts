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
  businessModel?: 'e-commerce' | 'booking' | 'subscription';
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
  avatarUrl?: string | null;
  bio?: string;
   address?: BusinessLocation | null;
  businessProfile?: BusinessProfile | null; // Can be null
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
