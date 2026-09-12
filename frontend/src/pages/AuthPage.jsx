import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Store, UserCheck, Sparkles, ArrowRight, Lock, Eye, EyeOff, CheckCircle2, KeyRound } from 'lucide-react';
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

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [activeRole, setActiveRole] = useState('farmer'); // 'farmer' | 'seller' | 'admin'
  const [showPassword, setShowPassword] = useState(false);

  // Registration state
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' | 'seller'
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    farmSize: '5 Acres',
    shopName: 'Kisan Vikas Agro Kendra',
    licenseNumber: 'HR-AGR-2024-QC8821',
    gstin: '06AABCU9603R1ZM',
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
      // Route based on role
      const user = JSON.parse(localStorage.getItem('agriseed_user') || '{}');
      const target = user.role === 'admin' ? '/admin' : (user.role === 'seller' ? '/seller' : '/dashboard');
      setTimeout(() => navigate(target), 700);
    } else {
      setErrorMsg(res.message || 'Login failed. Please check credentials.');
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
          Agri<span className="text-emerald-600">Seed</span> Multi-Role Portal
        </h1>
        <p className="text-xs text-slate-500">
          Direct-to-Farmer Marketplace • Certified Seller Hub • Admin Governance
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Top Tab Switcher: Login vs Register */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'login' ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-700" />
            <span>Sign In (3 Roles)</span>
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register' ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Create New Account</span>
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

        {/* ----------------- LOGIN FORM ----------------- */}
        {tab === 'login' ? (
          <div className="space-y-5">
            {/* Role Preset Selector Cards */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select Account Role & Quick-Fill Credentials
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRolePreset('farmer')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeRole === 'farmer'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">👨‍🌾</span>
                    {activeRole === 'farmer' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </div>
                  <span className="text-xs font-bold leading-tight">Farmer</span>
                  <span className="text-[10px] text-slate-400">Order & Track</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRolePreset('seller')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeRole === 'seller'
                      ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">🏢</span>
                    {activeRole === 'seller' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                  </div>
                  <span className="text-xs font-bold leading-tight">Seller / Kendra</span>
                  <span className="text-[10px] text-slate-400">QC & Payouts</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRolePreset('admin')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeRole === 'admin'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">🛡️</span>
                    {activeRole === 'admin' && <span className="w-2 h-2 rounded-full bg-amber-600"></span>}
                  </div>
                  <span className="text-xs font-bold leading-tight">Admin</span>
                  <span className="text-[10px] text-slate-400">Full Store CRUD</span>
                </button>
              </div>
            </div>

            {/* Credential Reference Box */}
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              activeRole === 'farmer' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' :
              (activeRole === 'seller' ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-amber-50/70 border-amber-200 text-amber-900')
            }`}>
              <div className="space-y-0.5">
                <span className="font-extrabold block text-[11px]">
                  {activeRole === 'farmer' && '👨‍🌾 Farmer Demo ID:'}
                  {activeRole === 'seller' && '🏢 Certified Seller Demo ID:'}
                  {activeRole === 'admin' && '🛡️ Master Admin Demo ID:'}
                </span>
                <span className="font-mono font-semibold">{loginForm.identity}</span> | Password: <span className="font-mono font-semibold">{loginForm.password}</span>
              </div>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin(activeRole)}
                className="px-2.5 py-1.5 bg-white font-bold rounded-lg border shadow-xs hover:scale-105 transition-transform text-[11px] cursor-pointer shrink-0"
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
                <span>{loading ? 'Authenticating...' : `🔑 Sign In as ${activeRole.toUpperCase()}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* ----------------- REGISTRATION FORM ----------------- */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Account Type Selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Select Account Type *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('farmer')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    regRole === 'farmer'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xl">👨‍🌾</span>
                  <div>
                    <div className="text-xs">Farmer Account</div>
                    <div className="text-[10px] text-slate-400 font-normal">Buy seeds, get rewards</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('seller')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    regRole === 'seller'
                      ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xl">🏢</span>
                  <div>
                    <div className="text-xs">Seller / Kendra</div>
                    <div className="text-[10px] text-slate-400 font-normal">Sell certified QC stock</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {regRole === 'seller' ? 'Proprietor / Contact Person Full Name *' : 'Farmer Full Name *'}
              </label>
              <input
                type="text"
                placeholder={regRole === 'seller' ? 'e.g. Shri Rajesh Sharma' : 'e.g. Ramesh Kumar Singh'}
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
              />
            </div>

            {regRole === 'seller' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agro Kendra / Shop Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Kisan Vikas Agro Kendra"
                    value={regForm.shopName}
                    onChange={(e) => setRegForm({ ...regForm, shopName: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seed / Pest License No. *</label>
                  <input
                    type="text"
                    placeholder="e.g. HR-AGR-2024-QC8821"
                    value={regForm.licenseNumber}
                    onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-blue-500"
                  />
                </div>
              </div>
            )}

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
                  placeholder={regRole === 'seller' ? 'seller@agriseed.in' : 'farmer@agriseed.in'}
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village / Market Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Rampur Khurd / Mandi Rd"
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
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Password *</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              {loading ? 'Registering Account...' : (regRole === 'seller' ? '🏢 Register Certified Seller Kendra' : '🌱 Register Farmer (+100 Kisan Points)')}
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
export default AuthPage;
