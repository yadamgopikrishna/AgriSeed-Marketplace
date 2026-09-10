import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    appliedCoupon,
    deliveryFee,
    totalAmount,
    freeShippingThreshold
  } = useCart();

  const { t } = useLanguage();

  if (!isCartDrawerOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-emerald-100 animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t('cartTitle')}</h3>
              <p className="text-xs text-slate-500">{cartItems.length} items</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100">
          {remainingForFreeShipping === 0 ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('freeShippingUnlocked')}</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Add ₹{remainingForFreeShipping} {t('freeShippingProgress')}</span>
                <span className="text-emerald-700 font-extrabold">{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                🌾
              </div>
              <h4 className="font-bold text-slate-800 text-base">{t('emptyCartTitle')}</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t('emptyCartDesc')}
              </p>
              <Link
                to="/catalog"
                onClick={() => setIsCartDrawerOpen(false)}
                className="inline-block mt-2 bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-700/20"
              >
                {t('browseCatalogBtn')}
              </Link>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${item.packSize}-${idx}`} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-18 h-18 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">{item.name}</h4>
                  <div className="inline-block bg-emerald-100/80 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded mt-1">
                    {item.packSize}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-extrabold text-sm text-emerald-900">
                      ₹{item.price * item.quantity}
                    </span>

                    {/* Steppers */}
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-1 py-0.5 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.packSize, -1)}
                        className="p-1 hover:text-rose-600 text-slate-500 cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.packSize, 1)}
                        className="p-1 hover:text-emerald-600 text-slate-500 cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id, item.packSize)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            
            {/* Price Summary Mini */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t('subsidyDiscount')} ({appliedCoupon})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('ruralDeliveryFee')}</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">{t('free')}</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>{t('netPayable')}</span>
                <span className="text-emerald-900 text-base">₹{totalAmount}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-3 rounded-xl text-center transition-colors"
              >
                {t('cart')}
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-700/20"
              >
                <span>{t('buyNow')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
