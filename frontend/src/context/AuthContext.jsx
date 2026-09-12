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
        return { success: true, role: res.user.role || role, redirect: res.redirect || (role === 'admin' ? '/admin' : (role === 'seller' ? '/seller' : '/dashboard')) };
      }
    } catch (e) {
      console.warn('Demo login API fallback:', e);
    }
    // Fallback to local demo profile if backend server is not running
    const fallbackUser = role === 'admin' ? DEMO_USERS.admin : (role === 'seller' ? DEMO_USERS.seller : (role === 'customer' ? DEMO_USERS.customer : DEMO_USERS.farmer));
    setCurrentUser(fallbackUser);
    return { success: true, role: fallbackUser.role, redirect: role === 'admin' ? '/admin' : (role === 'seller' ? '/seller' : '/dashboard') };
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

  const updateUserProfile = async (profileData) => {
    if (!currentUser) return { success: false, message: 'Not logged in.' };
    const uid = currentUser.id || currentUser._id;
    try {
      const res = await authService.updateProfile(uid, profileData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, message: res.message || 'Profile updated successfully!' };
      }
      return { success: false, message: res.message || 'Update failed.' };
    } catch (e) {
      return { success: false, message: 'Server communication failed.' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!currentUser) return { success: false, message: 'Not logged in.' };
    const uid = currentUser.id || currentUser._id;
    try {
      const res = await authService.changePassword(uid, currentPassword, newPassword);
      return res;
    } catch (e) {
      return { success: false, message: 'Server communication failed.' };
    }
  };

  const deleteAccount = async () => {
    if (!currentUser) return { success: false, message: 'Not logged in.' };
    const uid = currentUser.id || currentUser._id;
    try {
      const res = await authService.deleteAccount(uid);
      if (res.success) {
        setCurrentUser(null);
        localStorage.removeItem('agriseed_user');
        return { success: true, message: res.message || 'Account deleted.' };
      }
      return { success: false, message: res.message || 'Deletion failed.' };
    } catch (e) {
      return { success: false, message: 'Server communication failed.' };
    }
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
        updateUserProfile,
        changePassword,
        deleteAccount,
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
