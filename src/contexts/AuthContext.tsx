import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type {User} from "../types";




interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
  fetchMe: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = Boolean(user);

  const fetchMe = async () => {
    try {
      const res = await axiosInstance.get('/users/me/');
      console.log("res",res)
      setUser(res.data);
    } catch {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await axiosInstance.post('/users/token/', { email, password });
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    console.log("data",data)
    await fetchMe();
  };
  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };
  const updateUser = async (updates: Partial<User>) => {
    const { data } = await axiosInstance.patch(`/users/${user?.id}/`, updates);
    setUser(prev => ({ ...prev!, ...data }));
    return data;
  };

  useEffect(() => {
    if (localStorage.getItem('access')) fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUser ,fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
