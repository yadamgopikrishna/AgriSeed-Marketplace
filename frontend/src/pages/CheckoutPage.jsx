import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discount, deliveryFee, totalAmount, clearCart, appliedCoupon } = useCart();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: currentUser ? currentUser.name : 'Ramesh Kumar Singh',
    phone: currentUser ? currentUser.phone : '9876543210',
    village: currentUser ? currentUser.village : 'Rampur Khurd',
    taluk: 'Gharaunda',
    district: currentUser ? currentUser.district : 'Karnal',
    state: currentUser ? currentUser.state : 'Haryana',
    pincode: '132114'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [upiId, setUpiId] = useState('farmer@upi');
  const [cardData, setCardData] = useState({ number: '4532 •••• •••• 8821', exp: '12/28', cvv: '•••' });
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No items in checkout</h2>
        <Link to="/catalog" className="inline-block bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl">
          Browse Catalog →
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderId = `AGRI-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId,
      items: cartItems,
      subtotal,
      discount,
      deliveryFee,
      totalAmount,
      couponCode: appliedCoupon,
      paymentMethod: paymentMethod === 'upi' ? 'UPI (QR Code Verification)' : paymentMethod === 'card' ? 'Debit/Credit Card' : 'Cash on Delivery (COD)',
      deliveryAddress,
      status: 'Ordered',
      statusHistory: [
        { status: 'Ordered', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), details: 'Order placed & certified batch allocated.' }
      ],
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    // Save order to localStorage for tracking
    const existingOrders = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
    localStorage.setItem('agriseed_orders', JSON.stringify([orderPayload, ...existingOrders]));

    // Try sending to Flask API
    try {
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
    } catch (err) {
      console.warn('API sync fallback');
    }

    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      navigate(`/track?orderId=${orderId}`);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          {t('checkoutSubtitle')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 mt-1">
          {t('checkoutTitle')}
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Farmer Village Delivery Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                1
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{t('farmAddressStep')}</h3>
                <p className="text-xs text-slate-500">{t('farmAddressDesc')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('fullNameInput')}</label>
                <input
                  type="text"
                  value={deliveryAddress.fullName}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneInput')}</label>
                <input
                  type="tel"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('villageInput')}</label>
                <input
                  type="text"
                  value={deliveryAddress.village}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, village: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('talukInput')}</label>
                <input
                  type="text"
                  value={deliveryAddress.taluk}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, taluk: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('districtInput')}</label>
                <input
                  type="text"
                  value={deliveryAddress.district}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, district: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('stateInput')}</label>
                  <input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('pinInput')}</label>
                  <input
                    type="text"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Gateway Selection */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                2
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{t('paymentMethodStep')}</h3>
                <p className="text-xs text-slate-500">{t('paymentMethodDesc')}</p>
              </div>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Option 1: UPI */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl">📱</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{t('upiTitle')}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('upiDesc')}</p>
                </div>
              </div>

              {/* Option 2: Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl">💳</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{t('cardTitle')}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('cardDesc')}</p>
                </div>
              </div>

              {/* Option 3: COD */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl">💵</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{t('codTitle')}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t('codDesc')}</p>
                </div>
              </div>

            </div>

            {/* Interactive Payment Details Block */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-4">
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{t('dynamicQrTitle')}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {t('zeroFeeBadge')}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="w-28 h-28 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white shrink-0 shadow-xs">
                      <QrCode className="w-16 h-16 text-emerald-400" />
                      <span className="text-[9px] font-mono text-slate-300 mt-1">UPI: AGRISEED</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600 text-center sm:text-left">
                      <strong className="text-slate-900 block font-bold">{t('scanQrPrompt')}</strong>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-mono font-bold text-slate-800 outline-none"
                        />
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-lg text-[10px] flex items-center">
                          {t('vpaVerified')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Order proceeds automatically upon clicking Confirm.</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 text-xs">
                  <label className="block font-bold text-slate-800">{t('cardDemoNotice')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardData.number}
                      readOnly
                      className="text-xs bg-white border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardData.exp}
                        readOnly
                        className="text-xs bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-center font-bold text-slate-800"
                      />
                      <input
                        type="text"
                        value={cardData.cvv}
                        readOnly
                        className="text-xs bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-center font-bold text-slate-800"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> {t('encryptedSslNotice')}
                  </span>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <strong className="text-slate-900 block font-bold">{t('codAssuranceTitle')}</strong>
                    <p className="text-[11px] text-slate-500">
                      {t('codAssuranceDesc')} (<strong>₹{totalAmount}</strong>)
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Order Summary & Confirm Button */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 sticky top-28">
            <h3 className="font-black text-slate-900 text-base">{t('finalOrderSummary')}</h3>

            {/* Cart items list mini */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-900 block truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.packSize} × {item.quantity}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
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

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
              <span className="font-extrabold text-sm text-slate-900">{t('netPayable')}</span>
              <span className="text-2xl font-black text-emerald-950 font-sans">₹{totalAmount}</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-700/25 cursor-pointer hover:scale-102 disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('processingOrder')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('confirmPlaceOrderBtn')} (₹{totalAmount})</span>
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('certifiedGuaranteeTitle')}</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
