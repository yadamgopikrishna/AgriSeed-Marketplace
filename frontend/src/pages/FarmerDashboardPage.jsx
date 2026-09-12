import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FileText,
  Settings,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  LogOut,
  MapPin,
  Sprout,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ORDERS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { orderService } from '../services/api';

export const FarmerDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserProfile, changePassword, deleteAccount, openAuthModal } = useAuth();
  const { t, getLocalizedProductName } = useLanguage();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'security' | 'danger'
  const [orders, setOrders] = useState(() => {
    const localOrders = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
    return [...localOrders, ...INITIAL_ORDERS];
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: '',
    farmSize: '5 Acres',
    village: 'Rampur Khurd',
    district: 'Karnal',
    state: 'Haryana',
    pincode: '132001',
    primaryCrops: 'Paddy, Wheat'
  });

  // Password Change State
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status banners
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync profileForm when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        farmSize: currentUser.farmSize || '5 Acres',
        village: currentUser.village || 'Rampur Khurd',
        district: currentUser.district || 'Karnal',
        state: currentUser.state || 'Haryana',
        pincode: currentUser.pincode || '132001',
        primaryCrops: Array.isArray(currentUser.primaryCrops)
          ? currentUser.primaryCrops.join(', ')
          : currentUser.primaryCrops || 'Paddy, Wheat'
      });
    }
  }, [currentUser]);

  // Fetch live orders
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserOrders = async () => {
      try {
        const uid = currentUser.id || currentUser._id;
        const res = await orderService.getByUserId(uid);
        if (res.success && res.orders && res.orders.length > 0) {
          const localOrders = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
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

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    const res = await updateUserProfile(profileForm);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message || 'Profile updated successfully!' });
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    if (passForm.newPassword !== passForm.confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    if (passForm.newPassword.length < 4) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    const res = await changePassword(passForm.currentPassword, passForm.newPassword);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message || 'Password changed successfully!' });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to change password. Current password may be incorrect.' });
    }
  };

  // Handle Delete Account
  const handleDeleteAccountConfirm = async () => {
    setIsDeleting(true);
    const res = await deleteAccount();
    setIsDeleting(false);
    setShowDeleteModal(false);
    if (res.success) {
      navigate('/');
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to delete account.' });
    }
  };

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
              📍 {currentUser.village || 'Rampur Khurd'}, {currentUser.district || 'Karnal'}, {currentUser.state || 'Haryana'} • {t('landLabel')}: <strong>{currentUser.farmSize || '5 Acres'}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls & Kisan Rewards Wallet */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold shadow-xs">
              🪙
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                {t('kisanLoyaltyRewards')}
              </span>
              <strong className="text-2xl font-black text-white font-sans">
                {currentUser.kisanRewards || 100} <span className="text-xs font-normal text-amber-200">{t('pointsUnit')}</span>
              </strong>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 border border-rose-400/30 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('signOut') || 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('orders'); setStatusMsg({ type: '', text: '' }); }}
            className={`py-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>📦 {t('tabLiveOrders')} ({orders.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setStatusMsg({ type: '', text: '' }); }}
            className={`py-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>🌾 Farm & Profile Settings</span>
          </button>

          <button
            onClick={() => { setActiveTab('security'); setStatusMsg({ type: '', text: '' }); }}
            className={`py-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>🔒 Security & Password</span>
          </button>

          <button
            onClick={() => { setActiveTab('danger'); setStatusMsg({ type: '', text: '' }); }}
            className={`py-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'danger' ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-400 hover:text-rose-600'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>⚠️ Delete Account</span>
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMsg.text && (
          <div className={`p-4 mx-6 mt-6 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tab 1: Orders View */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-8">
            {/* Active Orders */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                {t('activeShipmentsTitle')} ({activeOrders.length})
              </h3>

              {activeOrders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  {t('noActiveShipments')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeOrders.map((order) => (
                    <div key={order.id || order.orderId} className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-slate-400">{t('orderIdLabel')}</span>
                          <h4 className="text-base font-black text-slate-900">#{order.id || order.orderId}</h4>
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

            {/* Past Orders History */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {t('pastOrderHistoryTitle')} ({orders.length})
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                {orders.map((o) => (
                  <div key={o.id || o.orderId} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors rounded-xl px-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold text-sm">#{o.id || o.orderId}</strong>
                        <span className="text-[11px] text-slate-400">({o.paymentMethod})</span>
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          {o.status}
                        </span>
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
        )}

        {/* Tab 2: Edit Farm & Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6 max-w-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              🌾 Farmer & Agricultural Profile
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Update your registered farm details, land size, and contact details stored in MongoDB.
            </p>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Farm Land Holding</label>
                  <input
                    type="text"
                    placeholder="e.g. 8.5 Acres"
                    value={profileForm.farmSize}
                    onChange={(e) => setProfileForm({ ...profileForm, farmSize: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Village / Post Office</label>
                  <input
                    type="text"
                    value={profileForm.village}
                    onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={profileForm.district}
                    onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Crops Cultivated</label>
                <input
                  type="text"
                  placeholder="e.g. Basmati Rice, Wheat, Mustard, Sugarcane"
                  value={profileForm.primaryCrops}
                  onChange={(e) => setProfileForm({ ...profileForm, primaryCrops: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes to MongoDB</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Security & Password Settings */}
        {activeTab === 'security' && (
          <div className="p-6 max-w-lg">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              🔒 Security & Password
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Change your portal password securely.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    title={showCurrentPass ? "Hide Password" : "Show Password"}
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Minimum 4 characters"
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    title={showNewPass ? "Hide Password" : "Show Password"}
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    title={showConfirmPass ? "Hide Password" : "Show Password"}
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Delete Account Danger Zone */}
        {activeTab === 'danger' && (
          <div className="p-6 max-w-xl space-y-4">
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Danger Zone: Permanent Account Deletion</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                Deleting your account is permanent. All your farmer registration details, farm land holding records, and Kisan loyalty points will be permanently deleted from MongoDB.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete My Account Permanently</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Are you sure?</h3>
              <p className="text-xs text-slate-500">
                This will permanently delete account <strong>{currentUser.name}</strong> from the MongoDB database.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccountConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

