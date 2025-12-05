import { AppData, Booking, Customer, Instructor, Motorcycle } from '../types.ts';

const STORAGE_KEY = 'motovasiya_db_v1';

const INITIAL_DATA: AppData = {
  instructors: [
    {
      id: 'inst-1',
      name: 'Narmin',
      surname: 'Mammadova',
      email: 'narmin@motovasiya.az',
      bio: 'Professional certified instructor. Passionate about teaching safe riding techniques to new riders.',
      // Using a placeholder image of a female rider in gear. Replace with your actual hosted image URL.
      photo: 'https://images.unsplash.com/photo-1622151834625-1e43d1a88b8f?auto=format&fit=crop&q=80&w=400', 
      active: true,
      isAdmin: true,
    }
  ],
  motorcycles: [
    {
      id: 'bike-1',
      name: 'Bajaj Pulsar NS160',
      // Using a placeholder image of a red street motorcycle. Replace with your actual hosted image URL.
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
      description: '160cc Street Fighter. Agile, powerful, and perfect for training.',
      active: true,
    }
  ],
  bookings: [
    {
      id: 'booking-demo-1',
      instructorId: 'inst-1',
      motorcycleId: 'bike-1',
      date: new Date().toISOString().split('T')[0], // Today
      timeSlot: '10:00', // Busy slot
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      customer: {
        name: 'Demo',
        surname: 'User',
        age: 25,
        gender: 'Male',
        heightCm: 175,
        phone: '+994 50 000 00 00'
      }
    }
  ]
};

// Helper to simulate DB
const getDb = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(stored);
};

const saveDb = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
  getInstructors: async (): Promise<Instructor[]> => {
    return getDb().instructors.filter(i => i.active);
  },
  
  getAllInstructorsAdmin: async (): Promise<Instructor[]> => {
    return getDb().instructors;
  },

  getMotorcycles: async (): Promise<Motorcycle[]> => {
    return getDb().motorcycles.filter(m => m.active);
  },

  getAllMotorcyclesAdmin: async (): Promise<Motorcycle[]> => {
    return getDb().motorcycles;
  },

  getBookings: async (): Promise<Booking[]> => {
    return getDb().bookings;
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    const db = getDb();
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    db.bookings.push(newBooking);
    saveDb(db);
    
    // Simulate email notification
    console.log(`[EMAIL SENT] To Instructor ${booking.instructorId}: New request from ${booking.customer.name} ${booking.customer.phone}`);
    
    return newBooking;
  },

  // Admin Methods
  addInstructor: async (inst: Omit<Instructor, 'id'>) => {
    const db = getDb();
    const newInst = { ...inst, id: `inst-${Date.now()}` };
    db.instructors.push(newInst);
    saveDb(db);
  },

  toggleInstructorStatus: async (id: string) => {
    const db = getDb();
    const idx = db.instructors.findIndex(i => i.id === id);
    if (idx > -1) {
      db.instructors[idx].active = !db.instructors[idx].active;
      saveDb(db);
    }
  },

  addMotorcycle: async (bike: Omit<Motorcycle, 'id'>) => {
    const db = getDb();
    const newBike = { ...bike, id: `bike-${Date.now()}` };
    db.motorcycles.push(newBike);
    saveDb(db);
  },
  
  deleteMotorcycle: async (id: string) => {
     const db = getDb();
     db.motorcycles = db.motorcycles.filter(m => m.id !== id);
     saveDb(db);
  }
};