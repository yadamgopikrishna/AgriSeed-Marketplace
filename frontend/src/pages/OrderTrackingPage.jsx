import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Home,
  Printer,
  Phone,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { INITIAL_ORDERS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const OrderTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const queryOrderId = searchParams.get('orderId') || 'AGRI-849201';
  const [inputOrderId, setInputOrderId] = useState(queryOrderId);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    // Check localStorage first, then fallback to mock data
    const localOrders = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
    const allOrders = [...localOrders, ...INITIAL_ORDERS];
    const found = allOrders.find(o => (o.id || o.orderId).toLowerCase() === queryOrderId.toLowerCase()) || INITIAL_ORDERS[0];
    setCurrentOrder(found);
  }, [queryOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputOrderId.trim()) {
      setSearchParams({ orderId: inputOrderId.trim() });
    }
  };

  const steps = [
    { key: 'Ordered', title: '1. Ordered', desc: 'Order received & batch allocated' },
    { key: 'Confirmed', title: '2. Confirmed', desc: 'Seed certification verified' },
    { key: 'Shipped', title: '3. Shipped', desc: 'Dispatched from Agri-Depot' },
    { key: 'Out for Delivery', title: '4. Out for Delivery', desc: 'Rural delivery van in transit' },
    { key: 'Delivered', title: '5. Delivered', desc: 'Delivered at village farm gate' }
  ];

  const getStepIndex = (status) => {
    const map = {
      'Ordered': 0,
      'Confirmed': 1,
      'Shipped': 2,
      'Out for Delivery': 3,
      'Delivered': 4
    };
    return map[status] !== undefined ? map[status] : 0;
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 2;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Search Bar */}
      <div className="bg-emerald-950 text-white p-8 rounded-3xl relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Real-Time Rural Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            5-Stage Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            Track certified seed bags and fertilizer consignments directly to your farm gate.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. AGRI-849201)"
            value={inputOrderId}
            onChange={(e) => setInputOrderId(e.target.value)}
            className="w-full md:w-64 bg-white text-slate-900 px-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none font-bold uppercase"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {currentOrder && (
        <div className="space-y-8">
          
          {/* Order Meta Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                📦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Order #{currentOrder.id || currentOrder.orderId}
                  </h3>
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    {currentOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Estimated Farm Arrival: <strong className="text-slate-800">{currentOrder.estimatedDelivery || '2-3 Business Days'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Official Invoice</span>
            </button>
          </div>

          {/* 5-Stage Animated Progress Stepper */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base">
              Milestone Fulfillment Progress
            </h3>

            {/* Stepper Bar Container */}
            <div className="relative pt-4 pb-2">
              
              {/* Connecting Line */}
              <div className="absolute top-8 left-6 right-6 h-1.5 bg-slate-200 rounded-full hidden sm:block">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <h4 className={`text-xs font-black leading-tight ${isCurrent ? 'text-emerald-800 font-black' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Details Grid: Logistics Driver Card & Order Items */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Dispatch Fleet & Logistics Partner */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Logistics Carrier & Fleet Info</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Fleet Partner:</span>
                    <strong className="text-slate-900 font-bold">{currentOrder.courierPartner || 'AgriExpress Rural Fleet'}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Tracking AWB:</span>
                    <code className="text-emerald-800 font-mono font-black">{currentOrder.trackingNumber || 'AX-HR-884920'}</code>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Vehicle Registration:</span>
                    <strong className="text-slate-900 font-mono">{currentOrder.vehicleNumber || 'HR-05-AB-7721'}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Assigned Driver:</span>
                    <strong className="text-slate-900">{currentOrder.driverName || 'Sukhwinder Singh'}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
                  <div className="flex items-center gap-2 font-bold">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>Driver Contact Available</span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-800">
                    {currentOrder.driverPhone || '+91 98123 77654'}
                  </span>
                </div>
              </div>

              {/* Delivery Village Address */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>Destination Farm Address</span>
                </h4>
                <div className="text-slate-600 space-y-1">
                  <strong className="text-slate-900 block font-bold text-sm">
                    {currentOrder.deliveryAddress?.fullName || currentOrder.userName}
                  </strong>
                  <p>Village: {currentOrder.deliveryAddress?.village || 'Rampur Khurd'}, {currentOrder.deliveryAddress?.taluk || 'Gharaunda'}</p>
                  <p>District: {currentOrder.deliveryAddress?.district || 'Karnal'}, {currentOrder.deliveryAddress?.state || 'Haryana'} - {currentOrder.deliveryAddress?.pincode || '132114'}</p>
                  <p>Phone: <strong>{currentOrder.deliveryAddress?.phone || currentOrder.phone}</strong></p>
                </div>
              </div>

            </div>

            {/* Right: Items in Consignment & Invoice Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Consignment Items ({currentOrder.items?.length || 0})
                </h4>

                <div className="divide-y divide-slate-100">
                  {currentOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">{item.name}</strong>
                          <span className="text-slate-400 text-[11px]">{item.packSize} • Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 text-sm">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{currentOrder.subtotal}</span>
                  </div>
                  {currentOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Kisan Subsidy Discount</span>
                      <span>- ₹{currentOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Total Amount Paid</span>
                    <span className="text-emerald-950">₹{currentOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
