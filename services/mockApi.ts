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
  console.log('authFetch - URL:', url, 'Token:', token ? 'Present' : 'Missing');

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
    console.error('authFetch error:', response.status, response.statusText);
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
  addInstructor: async (data: { name: string; surname: string; email: string; bio: string; photo?: File; active: boolean; isAdmin: boolean }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('surname', data.surname);
    formData.append('email', data.email);
    formData.append('bio', data.bio);
    formData.append('active', String(data.active));
    formData.append('is_admin', String(data.isAdmin));
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/instructors/`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to add instructor');
    return response.json();
  },

  updateInstructor: async (id: string, updates: Partial<Instructor> & { photo?: File }) => {
    const formData = new FormData();
    if (updates.name) formData.append('name', updates.name);
    if (updates.surname) formData.append('surname', updates.surname);
    if (updates.email) formData.append('email', updates.email);
    if (updates.bio) formData.append('bio', updates.bio);
    if (updates.active !== undefined) formData.append('active', String(updates.active));
    if (updates.isAdmin !== undefined) formData.append('is_admin', String(updates.isAdmin));
    if (updates.photo) formData.append('photo', updates.photo);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/instructors/${id}/`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to update instructor');
    return response.json();
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

  addMotorcycle: async (data: { name: string; description: string; image?: File; active: boolean }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('active', String(data.active));
    if (data.image) {
      formData.append('image', data.image);
    }

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/motorcycles/`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to add motorcycle');
    return response.json();
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