import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('canteen_token') || null);
  const [loading, setLoading] = useState(true);

  // Auto-login or restore user
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('canteen_token');
      const savedUser = localStorage.getItem('canteen_user');
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch (e) {
          console.error("Failed to parse saved user", e);
        }
      } else {
        // Automatically sign in as student for seamless first visit
        await switchDemoUser('student@canteen.com', 'password123');
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      const data = res.data;
      setToken(data.token);
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        walletBalance: data.walletBalance,
      };
      setUser(userData);
      localStorage.setItem('canteen_token', data.token);
      localStorage.setItem('canteen_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (name, email, password, phone, role) => {
    try {
      const res = await authApi.register({ name, email, password, phone, role });
      const data = res.data;
      setToken(data.token);
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        walletBalance: data.walletBalance,
      };
      setUser(userData);
      localStorage.setItem('canteen_token', data.token);
      localStorage.setItem('canteen_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('canteen_token');
    localStorage.removeItem('canteen_user');
  };

  const switchDemoUser = async (email, password) => {
    return await login(email, password);
  };

  const refreshUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('canteen_user', JSON.stringify(updatedUser));
  };

  const topUpWallet = async (amount) => {
    try {
      const res = await authApi.topUpWallet(amount);
      const newBal = res.data.walletBalance;
      const updatedUser = { ...user, walletBalance: newBal };
      refreshUser(updatedUser);
      return { success: true, balance: newBal };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Top-up failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      switchDemoUser,
      refreshUser,
      topUpWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
