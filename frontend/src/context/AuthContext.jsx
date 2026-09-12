import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agriseed_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('register'); // 'login' | 'register'
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agriseed_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('agriseed_user');
    }
  }, [currentUser]);

  // Sync session with MongoDB on mount
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('agriseed_user');
      const userId = savedUser ? JSON.parse(savedUser).id : null;
      const res = await authService.getMe(userId);
      if (res.success && res.authenticated && res.user) {
        setCurrentUser(res.user);
      }
    };
    checkSession();
  }, []);

  const login = async (identity, password) => {
    setIsLoadingAuth(true);
    try {
      const res = await authService.login(identity, password);
      setIsLoadingAuth(false);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, message: res.message || 'Signed in successfully!' };
      }
      return { success: false, message: res.message || 'Invalid login credentials.' };
    } catch (e) {
      setIsLoadingAuth(false);
      return { success: false, message: 'Server communication failed.' };
    }
  };

  const register = async (userData) => {
    setIsLoadingAuth(true);
    try {
      const res = await authService.register(userData);
      setIsLoadingAuth(false);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, message: res.message || 'Account created successfully (+100 Kisan Points)!' };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (e) {
      setIsLoadingAuth(false);
      return { success: false, message: 'Server communication failed.' };
    }
  };

  const demoLogin = async (role = 'farmer') => {
    try {
      const res = await authService.demoLogin(role);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return;
      }
    } catch (e) {
      console.warn('Demo login API fallback:', e);
    }
    // Fallback to local demo profile if backend server is not running
    setCurrentUser(role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.farmer);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout API warning:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('agriseed_user');
  };

  const openAuthModal = (tab = 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        demoLogin,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
