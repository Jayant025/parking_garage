import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for existing token and restore session
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('parkflow_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiClient.get<{ success: boolean; data: any }>('/auth/me');
        if (res.data.success && res.data.data) {
          const u = res.data.data;
          setUser({
            id: u._id || u.id,
            name: u.name,
            badgeNumber: u.badgeNumber || '#0000',
            email: u.email,
            role: (u.role || 'customer').toLowerCase() as any,
          });
        }
      } catch {
        // Token invalid or expired — clear it
        localStorage.removeItem('parkflow_token');
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const res = await apiClient.post<{ success: boolean; data: { user: any; token: string } }>('/auth/login', {
      email,
      password,
    });

    if (!res.data.success) {
      throw new Error('Login failed.');
    }

    const { user: u, token } = res.data.data;
    localStorage.setItem('parkflow_token', token);

    const loggedInUser: User = {
      id: u._id || u.id,
      name: u.name,
      badgeNumber: u.badgeNumber || '#0000',
      email: u.email,
      role: (u.role || 'customer').toLowerCase() as any,
    };

    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<User> => {
    const res = await apiClient.post<{ success: boolean; data: { user: any; token: string } }>('/auth/register', {
      name,
      email,
      password,
    });

    if (!res.data.success) {
      throw new Error('Registration failed.');
    }

    const { user: u, token } = res.data.data;
    localStorage.setItem('parkflow_token', token);

    const registeredUser: User = {
      id: u._id || u.id,
      name: u.name,
      badgeNumber: u.badgeNumber || '#0000',
      email: u.email,
      role: (u.role || 'customer').toLowerCase() as any,
    };

    setUser(registeredUser);
    return registeredUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore logout error
    }
    localStorage.removeItem('parkflow_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
