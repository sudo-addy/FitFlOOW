const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  signup: async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Dashboard
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load dashboard statistics.');
    return res.json();
  },

  // Workouts
  getWorkouts: async () => {
    const res = await fetch(`${API_BASE}/workouts`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load workouts battle log.');
    return res.json();
  },

  logWorkout: async (workoutData) => {
    const res = await fetch(`${API_BASE}/workouts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workoutData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to log workout session.');
    return data;
  },

  // Classes
  getBookings: async () => {
    const res = await fetch(`${API_BASE}/classes`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load class bookings.');
    return res.json();
  },

  bookClass: async (classData) => {
    const res = await fetch(`${API_BASE}/classes/book`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(classData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to book training class.');
    return data;
  },

  cancelBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE}/classes/cancel/${bookingId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to cancel class booking.');
    return data;
  },

  // Nutrition
  getNutrition: async () => {
    const res = await fetch(`${API_BASE}/nutrition`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load nutrition log.');
    return res.json();
  },

  updateWater: async (cups) => {
    const res = await fetch(`${API_BASE}/nutrition/water`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ cups }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update water intake.');
    return data;
  },

  logMeal: async (mealData) => {
    const res = await fetch(`${API_BASE}/nutrition/meal`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(mealData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to log meal.');
    return data;
  },

  // Profile & Achievements
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load profile.');
    return res.json();
  },

  updateProfile: async (name) => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile name.');
    return data;
  },

  updateTier: async (tier) => {
    const res = await fetch(`${API_BASE}/profile/tier`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update membership tier.');
    // Update local user representation too
    const user = api.getUser();
    if (user) {
      user.tier = tier;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return data;
  },

  getAchievements: async () => {
    const res = await fetch(`${API_BASE}/achievements`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load achievements.');
    return res.json();
  },

  searchExercises: async (query) => {
    const res = await fetch(`${API_BASE}/exercises/search?q=${encodeURIComponent(query)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to search exercises.');
    return res.json();
  },
};
