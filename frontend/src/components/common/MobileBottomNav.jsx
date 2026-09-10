import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, Stethoscope, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { currentUser, openAuthModal } = useAuth();
  const { t } = useLanguage();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-2 flex justify-around items-center shadow-lg">
      <Link
        to="/"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/') ? 'text-emerald-700' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>{t('home')}</span>
      </Link>

      <Link
        to="/catalog"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/catalog') ? 'text-emerald-700' : 'text-slate-500'
        }`}
      >
        <Package className="w-5 h-5" />
        <span>{t('catalog')}</span>
      </Link>

      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className="relative flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 cursor-pointer"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{t('cart')}</span>
        {totalItemsCount > 0 && (
          <span className="absolute -top-1 right-1 bg-amber-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
            {totalItemsCount}
          </span>
        )}
      </button>

      <Link
        to="/crop-doctor"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/crop-doctor') ? 'text-amber-700 font-extrabold' : 'text-amber-600'
        }`}
      >
        <Stethoscope className="w-5 h-5" />
        <span>{t('cropDoctor')}</span>
      </Link>

      {currentUser ? (
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            isActive('/dashboard') ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{t('dashboard')}</span>
        </Link>
      ) : (
        <button
          onClick={() => openAuthModal('register')}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-emerald-700 cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span>{t('login')}</span>
        </button>
      )}
    </div>
  );
};
