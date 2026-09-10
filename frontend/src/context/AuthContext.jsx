import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agriseed_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.farmer; // Default to demo farmer for instant review
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('register'); // 'login' | 'register'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agriseed_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('agriseed_user');
    }
  }, [currentUser]);

  const login = async (identity, password) => {
    // Try live API if available, fallback to mock demo user
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        return { success: true, message: data.message };
      }
    } catch (e) {
      console.warn('Using client-side auth fallback:', e);
    }

    if (identity.includes('admin')) {
      setCurrentUser(DEMO_USERS.admin);
      return { success: true, message: 'Signed in as Admin!' };
    } else {
      setCurrentUser({
        ...DEMO_USERS.farmer,
        email: identity.includes('@') ? identity : `${identity}@agriseed.in`,
        phone: !identity.includes('@') ? identity : DEMO_USERS.farmer.phone
      });
      return { success: true, message: 'Signed in successfully!' };
    }
  };

  const register = async (userData) => {
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email || `${userData.phone}@agriseed.in`,
      phone: userData.phone,
      role: 'farmer',
      farmSize: userData.farmSize || '5 Acres',
      primaryCrops: userData.primaryCrops || ['Paddy / Rice', 'Wheat'],
      village: userData.village || 'Rampur Khurd',
      district: userData.district || 'Karnal',
      state: userData.state || 'Haryana',
      kisanRewards: 100, // +100 welcome bonus points
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (e) {
      console.warn('API sync warning:', e);
    }

    setCurrentUser(newUser);
    return { success: true, message: `Welcome ${newUser.name}! +100 Kisan Points Credited.` };
  };

  const demoLogin = (role = 'farmer') => {
    if (role === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
    } else {
      setCurrentUser(DEMO_USERS.farmer);
    }
  };

  const logout = () => {
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
