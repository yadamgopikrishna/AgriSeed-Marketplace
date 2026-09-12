import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Store, UserCheck, ShoppingCart, Sparkles, ArrowRight, Lock, Eye, EyeOff, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();

  const [tab, setTab] = useState('register'); // 'register' | 'login'
  const [activeRole, setActiveRole] = useState('farmer'); // 'farmer' | 'customer' | 'seller' | 'admin'
  const [showPassword, setShowPassword] = useState(false);

  // Registration state
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' | 'customer' | 'seller' | 'admin'
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    farmSize: '5 Acres',
    shopName: 'Kisan Vikas Agro Kendra',
    licenseNumber: 'HR-AGR-2024-QC8821',
    gstin: '06AABCU9603R1ZM',
    adminDesignation: 'ICAR Quality & Operations Manager',
    adminPasscode: 'AGRI_ADMIN_2026',
    village: 'Rampur Khurd',
    district: 'Karnal',
    state: 'Haryana',
    pincode: '132001',
    password: 'farmer123'
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identity: 'farmer@agriseed.in',
    password: 'farmer123'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle switching preset roles in login tab
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || (!regForm.phone && !regForm.email)) {
      setErrorMsg('Full Name and either Mobile Number or Email are required.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await register({ ...regForm, role: regRole });
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      const target = regRole === 'seller' ? '/seller' : (regRole === 'admin' ? '/admin' : '/dashboard');
      setTimeout(() => navigate(target), 800);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await login(loginForm.identity, loginForm.password);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      const user = JSON.parse(localStorage.getItem('agriseed_user') || '{}');
      const target = user.role === 'admin' ? '/admin' : (user.role === 'seller' ? '/seller' : '/dashboard');
      setTimeout(() => navigate(target), 700);
    } else {
      setErrorMsg(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleInstantDemoLogin = async (role) => {
    setLoading(true);
    const res = await demoLogin(role);
    setLoading(false);
    const target = role === 'admin' ? '/admin' : (role === 'seller' ? '/seller' : '/dashboard');
    navigate(target);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-800/20">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black font-serif text-slate-900">
          Agri<span className="text-emerald-600">Seed</span> Portal
        </h1>
        <p className="text-xs text-slate-500">
          Agricultural Marketplace & Sowing Tracker • Select your account type to proceed
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Clean Top Switcher: Register vs Login */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register' ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Register</span>
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'login' ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-700" />
            <span>Login</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ----------------- REGISTER TAB ----------------- */}
        {tab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            
            {/* 4-Role Account Type Selector for Registration */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Register as (Select Account Type) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Farmer */}
                <button
                  type="button"
                  onClick={() => {
                    setRegRole('farmer');
                    setRegForm({ ...regForm, password: 'farmer123' });
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    regRole === 'farmer'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xl mb-1">👨‍🌾</div>
                  <div className="font-extrabold text-xs">Farmer</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Crop Grower</div>
                </button>

                {/* Customer */}
                <button
                  type="button"
                  onClick={() => {
                    setRegRole('customer');
                    setRegForm({ ...regForm, password: 'customer123' });
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    regRole === 'customer'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xl mb-1">🛒</div>
                  <div className="font-extrabold text-xs">Customer</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Buyer / Retail</div>
                </button>

                {/* Seller */}
                <button
                  type="button"
                  onClick={() => {
                    setRegRole('seller');
                    setRegForm({ ...regForm, password: 'seller123' });
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    regRole === 'seller'
                      ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xl mb-1">🏢</div>
                  <div className="font-extrabold text-xs">Seller</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Agro Kendra</div>
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setRegRole('admin');
                    setRegForm({ ...regForm, password: 'admin123' });
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    regRole === 'admin'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xl mb-1">🛡️</div>
                  <div className="font-extrabold text-xs">Admin</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Store Manager</div>
                </button>

              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {regRole === 'seller' ? 'Proprietor / Contact Person Full Name *' : 
                 regRole === 'admin' ? 'Administrator Full Name *' :
                 regRole === 'customer' ? 'Customer Full Name *' : 'Farmer Full Name *'}
              </label>
              <input
                type="text"
                placeholder={
                  regRole === 'seller' ? 'e.g. Shri Rajesh Sharma' :
                  regRole === 'admin' ? 'e.g. Dr. Harpreet Singh (Director)' :
                  regRole === 'customer' ? 'e.g. Vikram Choudhary' : 'e.g. Ramesh Kumar Singh'
                }
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
              />
            </div>

            {/* Role Specific Fields */}
            {regRole === 'seller' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agro Kendra / Shop Name *</label>
                  <input
                    type="text"
                    placeholder="Kisan Vikas Agro Kendra"
                    value={regForm.shopName}
                    onChange={(e) => setRegForm({ ...regForm, shopName: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seed / Pesticide License No. *</label>
                  <input
                    type="text"
                    placeholder="HR-AGR-2024-QC8821"
                    value={regForm.licenseNumber}
                    onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {regRole === 'admin' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department / Designation *</label>
                  <input
                    type="text"
                    placeholder="ICAR Quality & Operations"
                    value={regForm.adminDesignation}
                    onChange={(e) => setRegForm({ ...regForm, adminDesignation: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Passcode / Access Key *</label>
                  <input
                    type="text"
                    placeholder="AGRI_ADMIN_2026"
                    value={regForm.adminPasscode}
                    onChange={(e) => setRegForm({ ...regForm, adminPasscode: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium font-mono focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Mobile & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder={`${regRole}@agriseed.in`}
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>
            </div>

            {regRole === 'farmer' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Farm Land Holding</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Acres"
                  value={regForm.farmSize}
                  onChange={(e) => setRegForm({ ...regForm, farmSize: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>
            )}

            {/* Location & Address */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village / City *</label>
                <input
                  type="text"
                  placeholder="Rampur / Sector 14"
                  value={regForm.village}
                  onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">State *</label>
                <select
                  value={regForm.state}
                  onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium text-slate-800 cursor-pointer focus:border-emerald-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  placeholder="132001"
                  maxLength={6}
                  value={regForm.pincode}
                  onChange={(e) => setRegForm({ ...regForm, pincode: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-10 outline-none font-medium focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md cursor-pointer ${
                regRole === 'seller' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' :
                regRole === 'admin' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' :
                'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
              }`}
            >
              {loading ? 'Creating Account...' : (
                regRole === 'farmer' ? '🌱 Register as Farmer (+100 Kisan Points)' :
                regRole === 'customer' ? '🛒 Register as Customer' :
                regRole === 'seller' ? '🏢 Register as Certified Seller Kendra' :
                '🛡️ Register as Administrator'
              )}
            </button>
          </form>
        ) : (
          /* ----------------- LOGIN TAB ----------------- */
          <div className="space-y-5">
            {/* 4-Role Account Type Selector for Login */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Login as (Select Account Role) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Farmer */}
                <button
                  type="button"
                  onClick={() => handleRolePreset('farmer')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeRole === 'farmer'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-lg">👨‍🌾</span>
                    {activeRole === 'farmer' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </div>
                  <span className="text-xs font-extrabold">Farmer</span>
                  <span className="text-[10px] text-slate-400">Order & Track</span>
                </button>

                {/* Customer */}
                <button
                  type="button"
                  onClick={() => handleRolePreset('customer')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeRole === 'customer'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-lg">🛒</span>
                    {activeRole === 'customer' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </div>
                  <span className="text-xs font-extrabold">Customer</span>
                  <span className="text-[10px] text-slate-400">Retail Buyer</span>
                </button>

                {/* Seller */}
                <button
                  type="button"
                  onClick={() => handleRolePreset('seller')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeRole === 'seller'
                      ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-lg">🏢</span>
                    {activeRole === 'seller' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                  </div>
                  <span className="text-xs font-extrabold">Seller</span>
                  <span className="text-[10px] text-slate-400">QC & Payouts</span>
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => handleRolePreset('admin')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeRole === 'admin'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-lg">🛡️</span>
                    {activeRole === 'admin' && <span className="w-2 h-2 rounded-full bg-amber-600"></span>}
                  </div>
                  <span className="text-xs font-extrabold">Admin</span>
                  <span className="text-[10px] text-slate-400">Store CRUD</span>
                </button>

              </div>
            </div>

            {/* Test Credential Quick-Helper Pill */}
            <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
              activeRole === 'seller' ? 'bg-blue-50/80 border-blue-200 text-blue-950' :
              activeRole === 'admin' ? 'bg-amber-50/80 border-amber-200 text-amber-950' :
              'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}>
              <div className="space-y-0.5">
                <span className="font-extrabold text-[11px] block">
                  {activeRole === 'farmer' && '👨‍🌾 Farmer ID:'}
                  {activeRole === 'customer' && '🛒 Customer ID:'}
                  {activeRole === 'seller' && '🏢 Certified Seller ID:'}
                  {activeRole === 'admin' && '🛡️ Master Admin ID:'}
                </span>
                <span className="font-mono font-semibold">{loginForm.identity}</span> | Pass: <span className="font-mono font-semibold">{loginForm.password}</span>
              </div>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin(activeRole)}
                className="px-3 py-1.5 bg-white font-extrabold rounded-xl border shadow-xs hover:scale-105 transition-transform text-[11px] cursor-pointer shrink-0"
              >
                ⚡ 1-Click Login
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Number or Email Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or user@agriseed.in"
                  value={loginForm.identity}
                  onChange={(e) => setLoginForm({ ...loginForm, identity: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 outline-none font-medium focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : `🔑 Login as ${activeRole.toUpperCase()}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
export default AuthPage;
