import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'dispatch',
    icon: '🚚',
    title: 'Order Dispatched',
    message: 'Your seed consignment (AGRI-849201) has left Karnal Central Depot and is en route to Rampur Khurd.',
    time: '10m ago',
    read: false,
    link: '/track?orderId=AGRI-849201'
  },
  {
    id: 'notif_2',
    type: 'subsidy',
    icon: '🌾',
    title: '10% Kisan Subsidy Live',
    message: 'Apply coupon KISAN50 at checkout to receive ₹100 instant government seed grant on certified lots.',
    time: '1h ago',
    read: false,
    link: '/catalog'
  },
  {
    id: 'notif_3',
    type: 'weather',
    icon: '🌦️',
    title: 'Yellow Rust Weather Alert',
    message: 'High humidity reported in Punjab & Haryana belts. Inspect wheat leaves for yellow powder pustules using Crop Doctor.',
    time: '3h ago',
    read: false,
    link: '/crop-doctor'
  },
  {
    id: 'notif_4',
    type: 'certification',
    icon: '📜',
    title: 'New ICAR Seed Lot Certified',
    message: 'Pusa Basmati 1121 Lot #PB-2026-9912 verified with 95% germination rate ready for booking.',
    time: '5h ago',
    read: true,
    link: '/product/prod_1'
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('agriseed_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('agriseed_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      removeNotification,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
