import React, { createContext, useContext, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('fitfloow_sidebar_collapsed');
    return stored ? JSON.parse(stored) : false;
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('fitfloow_sidebar_collapsed', JSON.stringify(next));
      return next;
    });
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await api.signup(name, email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSidebarCollapsed,
        toggleSidebar,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
