import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Award,
  Sparkles,
  Truck,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ORDERS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { orderService } from '../services/api';

export const FarmerDashboardPage = () => {
  const { currentUser, logout, openAuthModal } = useAuth();
  const { t, getLocalizedProductName } = useLanguage();
  const [orders, setOrders] = useState(() => {
    const localOrders = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
    return [...localOrders, ...INITIAL_ORDERS];
  });

  useEffect(() => {
    if (!currentUser) return;
    const fetchUserOrders = async () => {
      try {
        const uid = currentUser.id || currentUser._id;
        const res = await orderService.getByUserId(uid);
        if (res.success && res.orders && res.orders.length > 0) {
          const localOrders = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
          // Deduplicate by ID
          const combined = [...res.orders, ...localOrders];
          const unique = Array.from(new Map(combined.map(item => [item.id || item.orderId, item])).values());
          setOrders(unique);
        }
      } catch (e) {
        console.warn('Live farmer orders fetch fallback:', e);
      }
    };
    fetchUserOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">{t('pleaseSignInKisan')}</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'Delivered');
  const pastOrders = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-md">
            👨‍🌾
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
                {currentUser.name}
              </h1>
              <span className="bg-emerald-700 text-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {t('progressiveFarmerBadge')}
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              📍 {currentUser.village}, {currentUser.district}, {currentUser.state} • {t('landLabel')}: <strong>{currentUser.farmSize}</strong>
            </p>
          </div>
        </div>

        {/* Kisan Rewards Wallet */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold shadow-xs">
            🪙
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              {t('kisanLoyaltyRewards')}
            </span>
            <strong className="text-2xl font-black text-white font-sans">
              {currentUser.kisanRewards || 240} <span className="text-xs font-normal text-amber-200">{t('pointsUnit')}</span>
            </strong>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">{t('activeDispatchesMetric')}</span>
            <h3 className="text-2xl font-black text-slate-900">{activeOrders.length} {t('inTransit')}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">{t('totalOrdersMetric')}</span>
            <h3 className="text-2xl font-black text-slate-900">{orders.length} {t('completed')}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">{t('totalSavedMetric')}</span>
            <h3 className="text-2xl font-black text-emerald-800">₹1,850</h3>
          </div>
        </div>
      </div>

      {/* Active Orders Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-black font-serif text-slate-900">
          {t('activeShipmentsTitle')} ({activeOrders.length})
        </h2>

        {activeOrders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            {t('noActiveShipments')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeOrders.map((order) => (
              <div key={order.id || order.orderId} className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-400">{t('orderIdLabel')}</span>
                    <h3 className="text-base font-black text-slate-900">#{order.id || order.orderId}</h3>
                  </div>
                  <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                    {order.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 py-2 border-y border-slate-100">
                  <p>{t('estimatedArrival')} <strong>{order.estimatedDelivery || '2-3 Days'}</strong></p>
                  <p>{t('fleetPartnerLabel')} <strong>{order.courierPartner || 'AgriExpress Rural Fleet'}</strong></p>
                  <p>{t('totalLabel')} <strong>₹{order.totalAmount}</strong> ({order.paymentMethod})</p>
                </div>

                <Link
                  to={`/track?orderId=${order.id || order.orderId}`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t('viewLiveStepperBtn')}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Orders Archive */}
      <div className="space-y-4">
        <h2 className="text-xl font-black font-serif text-slate-900">
          {t('pastOrderHistoryTitle')}
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 text-xs">
            {orders.map((o) => (
              <div key={o.id || o.orderId} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold text-sm">#{o.id || o.orderId}</strong>
                    <span className="text-[11px] text-slate-400">({o.paymentMethod})</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {o.items?.map(i => `${getLocalizedProductName(i)} (${i.packSize})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center">
                  <span className="text-sm font-black text-slate-900">₹{o.totalAmount}</span>
                  <Link
                    to={`/track?orderId=${o.id || o.orderId}`}
                    className="text-xs text-emerald-700 hover:underline font-bold"
                  >
                    {t('viewDetails')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
