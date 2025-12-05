export interface Motorcycle {
  id: string;
  name: string;
  image: string;
  description: string;
  active: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  surname: string;
  email: string; // Used for login
  bio: string;
  photo: string;
  active: boolean;
  isAdmin: boolean;
}

export interface Customer {
  name: string;
  surname: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  heightCm: number;
  phone: string;
}

export interface Booking {
  id: string;
  motorcycleId: string;
  instructorId: string;
  date: string; // ISO Date string YYYY-MM-DD
  timeSlot: string; // e.g., "14:00"
  customer: Customer;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export type TimeSlot = string;

// Mock data structure for our service
export interface AppData {
  instructors: Instructor[];
  motorcycles: Motorcycle[];
  bookings: Booking[];
}