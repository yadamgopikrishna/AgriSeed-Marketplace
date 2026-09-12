import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sprout, ShieldCheck, Store, UserCheck, ShoppingCart, Phone, Lock, MapPin, Sparkles, Eye, EyeOff, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

export const AuthModal = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal, login, register, demoLogin } = useAuth();
  const { t } = useLanguage();

  const [activeRole, setActiveRole] = useState('farmer'); // 'farmer' | 'customer' | 'seller' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' | 'customer' | 'seller' | 'admin'

  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    farmSize: '5 Acres',
    shopName: 'Kisan Vikas Agro Kendra',
    licenseNumber: 'HR-AGR-2024-QC8821',
    gstin: '06AABCU9603R1ZM',
    adminDesignation: 'ICAR Operations Lead',
    adminPasscode: 'AGRI_ADMIN_2026',
    village: 'Rampur Khurd',
    district: 'Karnal',
    state: 'Haryana',
    pincode: '132001',
    password: 'farmer123'
  });

  const [loginForm, setLoginForm] = useState({
    identity: 'farmer@agriseed.in',
    password: 'farmer123'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRolePreset = (role) => {
    setActiveRole(role);
    setErrorMsg('');
    if (role === 'farmer') {
      setLoginForm({ identity: 'farmer@agriseed.in', password: 'farmer123' });
    } else if (role === 'customer') {
      setLoginForm({ identity: 'customer@agriseed.in', password: 'customer123' });
    } else if (role === 'seller') {
      setLoginForm({ identity: 'seller@agriseed.in', password: 'seller123' });
    } else if (role === 'admin') {
      setLoginForm({ identity: 'admin@agriseed.in', password: 'admin123' });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || (!regForm.phone && !regForm.email)) {
      setErrorMsg('Please fill in Full Name and either Mobile Number or Email.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await register({ ...regForm, role: regRole });
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
        const target = regRole === 'seller' ? '/seller' : (regRole === 'admin' ? '/admin' : '/dashboard');
        navigate(target);
      }, 900);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await login(loginForm.identity, loginForm.password);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
        const user = JSON.parse(localStorage.getItem('agriseed_user') || '{}');
        const target = user.role === 'admin' ? '/admin' : (user.role === 'seller' ? '/seller' : '/dashboard');
        navigate(target);
      }, 700);
    } else {
      setErrorMsg(res.message || 'Invalid credentials.');
    }
  };

  const handleInstantDemo = async (role) => {
    await demoLogin(role);
    closeAuthModal();
    const target = role === 'admin' ? '/admin' : (role === 'seller' ? '/seller' : '/dashboard');
    navigate(target);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 animate-scaleUp my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-5 relative shrink-0">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black font-serif tracking-tight">
              Agri<span className="text-emerald-400">Seed</span> Portal
            </h3>
          </div>
          <p className="text-xs text-emerald-200">
            Select your account type to proceed
          </p>

          {/* Clean Switchable Tabs: Register vs Login */}
          <div className="grid grid-cols-2 gap-2 mt-3 bg-emerald-950/70 p-1 rounded-xl">
            <button
              onClick={() => openAuthModal('register')}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authModalTab === 'register' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authModalTab === 'login' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1">
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ---------------- REGISTER MODE ---------------- */}
          {authModalTab === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Register as (Select Account Type) *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('farmer');
                      setRegForm({ ...regForm, password: 'farmer123' });
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'farmer'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-base">👨‍🌾</div>
                    <div className="text-[11px] font-extrabold">Farmer</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('customer');
                      setRegForm({ ...regForm, password: 'customer123' });
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'customer'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-base">🛒</div>
                    <div className="text-[11px] font-extrabold">Customer</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('seller');
                      setRegForm({ ...regForm, password: 'seller123' });
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'seller'
                        ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-base">🏢</div>
                    <div className="text-[11px] font-extrabold">Seller</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('admin');
                      setRegForm({ ...regForm, password: 'admin123' });
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'admin'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-base">🛡️</div>
                    <div className="text-[11px] font-extrabold">Admin</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {regRole === 'seller' ? 'Proprietor / Contact Name *' :
                   regRole === 'admin' ? 'Administrator Name *' :
                   regRole === 'customer' ? 'Customer Name *' : 'Farmer Full Name *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Name"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              {regRole === 'seller' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shop / Kendra Name *</label>
                    <input
                      type="text"
                      placeholder="Kisan Vikas Agro Kendra"
                      value={regForm.shopName}
                      onChange={(e) => setRegForm({ ...regForm, shopName: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">License No. *</label>
                    <input
                      type="text"
                      placeholder="HR-AGR-2024-QC8821"
                      value={regForm.licenseNumber}
                      onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                    />
                  </div>
                </div>
              )}

              {regRole === 'admin' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department / Role *</label>
                    <input
                      type="text"
                      placeholder="Operations Lead"
                      value={regForm.adminDesignation}
                      onChange={(e) => setRegForm({ ...regForm, adminDesignation: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Passcode *</label>
                    <input
                      type="text"
                      placeholder="AGRI_ADMIN_2026"
                      value={regForm.adminPasscode}
                      onChange={(e) => setRegForm({ ...regForm, adminPasscode: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder={`${regRole}@agriseed.in`}
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Town *</label>
                  <input
                    type="text"
                    placeholder="Karnal"
                    value={regForm.village}
                    onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    placeholder="Karnal"
                    value={regForm.district}
                    onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State *</label>
                  <select
                    value={regForm.state}
                    onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium text-slate-800"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    placeholder="132001"
                    maxLength={6}
                    value={regForm.pincode}
                    onChange={(e) => setRegForm({ ...regForm, pincode: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-8 outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                {loading ? 'Creating...' : (
                  regRole === 'farmer' ? '🌱 Register as Farmer (+100 Kisan Points)' :
                  regRole === 'customer' ? '🛒 Register as Customer' :
                  regRole === 'seller' ? '🏢 Register as Certified Seller' :
                  '🛡️ Register as Administrator'
                )}
              </button>
            </form>
          ) : (
            /* ---------------- LOGIN MODE ---------------- */
            <div className="space-y-4">
              {/* 4-Role Account Type Selector for Login */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Login as (Select Account Role) *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  
                  {/* Farmer */}
                  <button
                    type="button"
                    onClick={() => handleRolePreset('farmer')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      activeRole === 'farmer'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm">👨‍🌾</div>
                    <div className="text-xs font-bold leading-tight mt-0.5">Farmer</div>
                  </button>

                  {/* Customer */}
                  <button
                    type="button"
                    onClick={() => handleRolePreset('customer')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      activeRole === 'customer'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm">🛒</div>
                    <div className="text-xs font-bold leading-tight mt-0.5">Customer</div>
                  </button>

                  {/* Seller */}
                  <button
                    type="button"
                    onClick={() => handleRolePreset('seller')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      activeRole === 'seller'
                        ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm">🏢</div>
                    <div className="text-xs font-bold leading-tight mt-0.5">Seller</div>
                  </button>

                  {/* Admin */}
                  <button
                    type="button"
                    onClick={() => handleRolePreset('admin')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      activeRole === 'admin'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm">🛡️</div>
                    <div className="text-xs font-bold leading-tight mt-0.5">Admin</div>
                  </button>

                </div>
              </div>

              {/* Demo Credentials Helper Pill */}
              <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                activeRole === 'seller' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                activeRole === 'admin' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="text-[11px]">
                  <span className="font-bold">ID: </span><span className="font-mono">{loginForm.identity}</span><br />
                  <span className="font-bold">Pass: </span><span className="font-mono">{loginForm.password}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInstantDemo(activeRole)}
                  className="px-2.5 py-1 bg-white font-bold rounded-lg border text-[11px] shadow-xs hover:scale-105 transition-transform cursor-pointer shrink-0"
                >
                  ⚡ 1-Click Login
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number or Email *</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210 or user@agriseed.in"
                    value={loginForm.identity}
                    onChange={(e) => setLoginForm({ ...loginForm, identity: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl p-2.5 pr-10 outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  {loading ? 'Signing In...' : `🔑 Login as ${activeRole.toUpperCase()}`}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default AuthModal;
