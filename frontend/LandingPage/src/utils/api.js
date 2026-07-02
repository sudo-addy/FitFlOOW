const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5005/api';

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = sanitizeObject(obj[key]);
    }
    return cleaned;
  }
  if (typeof obj === 'string') {
    return obj.trim();
  }
  return obj;
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

async function apiFetch(url, options = {}) {
  try {
    if (options.body && typeof options.body === 'string') {
      try {
        const parsed = JSON.parse(options.body);
        options.body = JSON.stringify(sanitizeObject(parsed));
      } catch (e) {
        // Leave body untouched if JSON parse fails
      }
    }

    const res = await fetch(url, {
      ...options,
      headers: { ...getHeaders(), ...options.headers },
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login?expired=true';
      }
      throw new Error('Session expired. Please log in again.');
    }

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError') {
      throw new Error('Network error — check your connection.');
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: async (email, password) => {
    const data = await apiFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  signup: async (name, email, password) => {
    const data = await apiFetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  forgotPassword: async (email) => {
    return apiFetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, password) => {
    return apiFetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
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
    return apiFetch(`${API_BASE}/dashboard/stats`);
  },

  // Workouts
  getWorkouts: async () => {
    return apiFetch(`${API_BASE}/workouts`);
  },

  logWorkout: async (workoutData) => {
    return apiFetch(`${API_BASE}/workouts`, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  },

  getTemplates: async () => {
    return apiFetch(`${API_BASE}/workouts/templates`);
  },

  createTemplate: async (templateData) => {
    return apiFetch(`${API_BASE}/workouts/templates`, {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  // Classes
  getBookings: async () => {
    return apiFetch(`${API_BASE}/classes`);
  },

  bookClass: async (classData) => {
    return apiFetch(`${API_BASE}/classes/book`, {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  cancelBooking: async (bookingId) => {
    return apiFetch(`${API_BASE}/classes/cancel/${bookingId}`, {
      method: 'DELETE',
    });
  },

  // Nutrition
  getNutrition: async () => {
    return apiFetch(`${API_BASE}/nutrition`);
  },

  updateWater: async (cups) => {
    return apiFetch(`${API_BASE}/nutrition/water`, {
      method: 'POST',
      body: JSON.stringify({ cups }),
    });
  },

  logMeal: async (mealData) => {
    return apiFetch(`${API_BASE}/nutrition/meal`, {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  },

  // Profile & Achievements
  getProfile: async () => {
    return apiFetch(`${API_BASE}/profile`);
  },

  updateProfile: async (profileData) => {
    return apiFetch(`${API_BASE}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  updateTier: async (tier, paymentConfirmed, paymentToken) => {
    const data = await apiFetch(`${API_BASE}/profile/tier`, {
      method: 'PUT',
      body: JSON.stringify({
        tier,
        payment_confirmed: paymentConfirmed,
        payment_token: paymentToken,
      }),
    });
    // Update local user representation too
    const user = api.getUser();
    if (user) {
      user.tier = tier;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return data;
  },

  createPaymentSession: async (tier) => {
    return apiFetch(`${API_BASE}/payments/create-session`, {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  },

  getAchievements: async () => {
    return apiFetch(`${API_BASE}/achievements`);
  },

  searchExercises: async (query) => {
    return apiFetch(`${API_BASE}/exercises/search?q=${encodeURIComponent(query)}`);
  },

  getBodyWeightLogs: async () => {
    return apiFetch(`${API_BASE}/body-weight`);
  },

  logBodyWeight: async (weight, date) => {
    return apiFetch(`${API_BASE}/body-weight`, {
      method: 'POST',
      body: JSON.stringify({ weight: parseFloat(weight) || 0.0, date }),
    });
  },
};
