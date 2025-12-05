import { AppData, Booking, Customer, Instructor, Motorcycle } from '../types.ts';

// Django API base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  getInstructors: async (): Promise<Instructor[]> => {
    const data = await fetch(`${API_BASE_URL}/instructors/`).then(res => res.json());
    return data.map((inst: any) => ({
      id: inst.id.toString(),
      name: inst.name,
      surname: inst.surname,
      email: inst.email,
      bio: inst.bio,
      photo: inst.photo,
      active: inst.active,
      isAdmin: inst.is_admin,
    }));
  },

  getAllInstructorsAdmin: async (): Promise<Instructor[]> => {
    const data = await authFetch(`${API_BASE_URL}/instructors/`);
    return data.map((inst: any) => ({
      id: inst.id.toString(),
      name: inst.name,
      surname: inst.surname,
      email: inst.email,
      bio: inst.bio,
      photo: inst.photo,
      active: inst.active,
      isAdmin: inst.is_admin,
    }));
  },

  getMotorcycles: async (): Promise<Motorcycle[]> => {
    const data = await fetch(`${API_BASE_URL}/motorcycles/`).then(res => res.json());
    return data.map((bike: any) => ({
      id: bike.id.toString(),
      name: bike.name,
      image: bike.image,
      description: bike.description,
      active: bike.active,
    }));
  },

  getAllMotorcyclesAdmin: async (): Promise<Motorcycle[]> => {
    const data = await authFetch(`${API_BASE_URL}/motorcycles/`);
    return data.map((bike: any) => ({
      id: bike.id.toString(),
      name: bike.name,
      image: bike.image,
      description: bike.description,
      active: bike.active,
    }));
  },

  getBookings: async (): Promise<Booking[]> => {
    const data = await authFetch(`${API_BASE_URL}/bookings/`);
    return data.map((booking: any) => ({
      id: booking.id.toString(),
      instructorId: booking.instructorId.toString(),
      motorcycleId: booking.motorcycleId.toString(),
      date: booking.date,
      timeSlot: booking.timeSlot,
      customer: booking.customer,
      status: booking.status,
      createdAt: booking.createdAt,
    }));
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    const data = await response.json();
    console.log(`[EMAIL SENT] To Instructor ${booking.instructorId}: New request from ${booking.customer.name} ${booking.customer.phone}`);

    return {
      id: data.id.toString(),
      instructorId: data.instructorId.toString(),
      motorcycleId: data.motorcycleId.toString(),
      date: data.date,
      timeSlot: data.timeSlot,
      customer: data.customer,
      status: data.status,
      createdAt: data.createdAt,
    };
  },

  // Admin Methods
  addInstructor: async (inst: Omit<Instructor, 'id'>) => {
    await authFetch(`${API_BASE_URL}/instructors/`, {
      method: 'POST',
      body: JSON.stringify({
        name: inst.name,
        surname: inst.surname,
        email: inst.email,
        bio: inst.bio,
        photo: inst.photo,
        active: inst.active,
        is_admin: inst.isAdmin,
      }),
    });
  },

  updateInstructor: async (id: string, updates: Partial<Instructor>) => {
    await authFetch(`${API_BASE_URL}/instructors/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: updates.name,
        surname: updates.surname,
        email: updates.email,
        bio: updates.bio,
        photo: updates.photo,
        active: updates.active,
        is_admin: updates.isAdmin,
      }),
    });
  },

  deleteInstructor: async (id: string) => {
    await authFetch(`${API_BASE_URL}/instructors/${id}/`, {
      method: 'DELETE',
    });
  },

  toggleInstructorStatus: async (id: string) => {
    await authFetch(`${API_BASE_URL}/instructors/${id}/toggle_status/`, {
      method: 'POST',
    });
  },

  addMotorcycle: async (bike: Omit<Motorcycle, 'id'>) => {
    await authFetch(`${API_BASE_URL}/motorcycles/`, {
      method: 'POST',
      body: JSON.stringify(bike),
    });
  },

  deleteMotorcycle: async (id: string) => {
    await authFetch(`${API_BASE_URL}/motorcycles/${id}/`, {
      method: 'DELETE',
    });
  },

  deleteBooking: async (id: string) => {
    await authFetch(`${API_BASE_URL}/bookings/${id}/`, {
      method: 'DELETE',
    });
  },

  // Authentication
  login: async (email: string): Promise<{ token: string; instructor: Instructor }> => {
    try {
      console.log('Attempting login with email:', email);
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Login error:', error);
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store token
      localStorage.setItem('auth_token', data.token);

      return {
        token: data.token,
        instructor: {
          id: data.instructor.id.toString(),
          name: data.instructor.name,
          surname: data.instructor.surname,
          email: data.instructor.email,
          bio: data.instructor.bio,
          photo: data.instructor.photo,
          active: data.instructor.active,
          isAdmin: data.instructor.is_admin,
        },
      };
    } catch (error) {
      console.error('Login exception:', error);
      throw error;
    }
  },
};