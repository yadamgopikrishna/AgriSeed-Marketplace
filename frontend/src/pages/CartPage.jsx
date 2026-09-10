import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    deliveryFee,
    totalAmount,
    freeShippingThreshold
  } = useCart();

  const { t, getLocalizedProductName } = useLanguage();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res.message);
    setCouponSuccess(res.success);
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
          🛒
        </div>
        <h2 className="text-2xl font-black font-serif text-slate-900">{t('emptyCartTitle')}</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t('emptyCartDesc')}
        </p>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-700/20 transition-all"
          >
            <span>{t('browseCatalogBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {t('orderReviewBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 mt-1">
            {t('cartTitle')} ({cartItems.length} Products)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
        >
          {t('clearAllItems')}
        </button>
      </div>

      {/* Free Shipping Notification Bar */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-900 font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          {remainingForFreeShipping === 0 ? (
            <span>{t('freeShippingUnlocked')}</span>
          ) : (
            <span>Add ₹{remainingForFreeShipping} {t('freeShippingProgress')}</span>
          )}
        </div>
        <div className="w-full sm:w-48 h-2 bg-emerald-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Main Cart Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Itemized Cart Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="divide-y divide-slate-100">
            {cartItems.map((item, idx) => (
              <div key={`${item.id}-${item.packSize}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.imageUrl}
                    alt={getLocalizedProductName(item)}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{getLocalizedProductName(item)}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.packSize}
                      </span>
                      <span className="text-xs text-slate-400">₹{item.price} each</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center">
                  {/* Quantity Controller */}
                  <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.packSize, -1)}
                      className="p-1 hover:text-rose-600 text-slate-500 font-bold cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-black text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.packSize, 1)}
                      className="p-1 hover:text-emerald-600 text-slate-500 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-black text-emerald-950 min-w-16 text-right">
                    ₹{item.price * item.quantity}
                  </span>

                  <button
                    onClick={() => removeItem(item.id, item.packSize)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>{t('kisanPromoTitle')}</span>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder={t('enterCouponPlaceholder')}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-mono uppercase font-bold"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                {t('applyBtn')}
              </button>
            </form>

            {couponMsg && (
              <p className={`text-xs font-bold ${couponSuccess ? 'text-emerald-700' : 'text-rose-600'}`}>
                {couponMsg}
              </p>
            )}

            {/* Active Coupon Badge */}
            {appliedCoupon && (
              <div className="flex justify-between items-center bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{t('appliedBadge')} <strong>{appliedCoupon}</strong></span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 text-[11px] font-bold hover:underline cursor-pointer"
                >
                  {t('removeCouponBtn')}
                </button>
              </div>
            )}
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-base">{t('orderPriceBreakdown')}</h3>

            <div className="space-y-2 text-xs text-slate-600 pb-3 border-b border-slate-100">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t('subsidyDiscount')} ({appliedCoupon})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t('ruralDeliveryFee')}</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">{t('free')}</strong> : `₹${deliveryFee}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-extrabold text-sm text-slate-900">{t('netPayable')}</span>
              <span className="text-2xl font-black text-emerald-950 font-sans">₹{totalAmount}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-700/25 cursor-pointer hover:scale-102"
            >
              <span>{t('proceedToPaymentBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/catalog"
              className="block text-center text-xs font-bold text-slate-500 hover:text-emerald-700"
            >
              {t('addMoreInputs')}
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
