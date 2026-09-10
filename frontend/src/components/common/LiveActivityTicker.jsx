import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const RECENT_ACTIVITIES = [
  {
    farmer: 'Harpreet Singh',
    location: 'Bathinda, Punjab',
    productKey: 'prod_2_short',
    productFallback: 'Shriram Super Wheat 1105',
    action: 'booked 2 bags (40kg)',
    time: '2 mins ago',
    icon: '🌾',
    productId: 'prod_2'
  },
  {
    farmer: 'Suresh Reddy',
    location: 'Guntur, Andhra Pradesh',
    productKey: 'prod_3_short',
    productFallback: 'Bt Cotton Hybrid RCH 659',
    action: 'booked 5 packets',
    time: '4 mins ago',
    icon: '🌱',
    productId: 'prod_3'
  },
  {
    farmer: 'Baldev Kumar',
    location: 'Karnal, Haryana',
    productKey: 'prod_1_short',
    productFallback: 'Pusa Basmati 1121 Paddy',
    action: 'ordered certified lot (95% Germination)',
    time: '6 mins ago',
    icon: '🌾',
    productId: 'prod_1'
  },
  {
    farmer: 'Rameshwar Patil',
    location: 'Pune, Maharashtra',
    productKey: 'prod_5_short',
    productFallback: 'NPK 19:19:19 Soluble Fertilizer',
    action: 'applied 10% Kisan subsidy',
    time: '8 mins ago',
    icon: '🧪',
    productId: 'prod_5'
  },
  {
    farmer: 'Kuldeep Sharma',
    location: 'Meerut, Uttar Pradesh',
    productKey: 'prod_7_short',
    productFallback: 'Bio-Neem Shield Pesticide',
    action: 'booked farm gate delivery',
    time: '11 mins ago',
    icon: '🌿',
    productId: 'prod_7'
  }
];

export const LiveActivityTicker = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
        setIsVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = RECENT_ACTIVITIES[currentIndex];
  const translatedProduct = t(current.productKey) !== current.productKey ? t(current.productKey) : current.productFallback;

  return (
    <div className={`fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm transition-all duration-500 ease-out transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
    }`}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-200/90 shadow-xl p-3.5 flex items-start gap-3 text-xs text-slate-800 relative group">
        
        {/* Left Pulse Avatar */}
        <div className="relative shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shadow-xs">
            {current.icon}
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
            <span className="font-bold text-slate-900">{current.farmer}</span>
            <span>•</span>
            <span className="truncate">{current.location}</span>
          </div>

          <p className="text-slate-700 leading-snug">
            {current.action}{' '}
            <Link
              to={`/product/${current.productId}`}
              className="font-bold text-emerald-800 hover:underline inline"
            >
              {translatedProduct}
            </Link>
          </p>

          <span className="text-[10px] text-emerald-700 font-semibold block mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>ICAR Verified Batch • {current.time}</span>
          </span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 text-slate-300 hover:text-slate-600 p-1 transition-colors cursor-pointer"
          title="Dismiss live feed"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
