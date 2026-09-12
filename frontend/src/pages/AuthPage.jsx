import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ShieldCheck, UserCheck, Sparkles, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();

  const [tab, setTab] = useState('register'); // 'register' | 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    village: 'Rampur Khurd',
    district: 'Karnal',
    farmSize: '5 Acres',
    password: 'farmer123'
  });

  const [loginForm, setLoginForm] = useState({
    identity: 'farmer@agriseed.in',
    password: 'farmer123'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) {
      setErrorMsg('Name and Mobile number are required.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await register(regForm);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => navigate('/dashboard'), 800);
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
      setTimeout(() => navigate('/dashboard'), 700);
    } else {
      setErrorMsg(res.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-800/20">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black font-serif text-slate-900">
          Agri<span className="text-emerald-600">Seed</span> Farmer Portal
        </h1>
        <p className="text-xs text-slate-500">
          Direct-to-Farmer Agricultural Marketplace & Sowing Tracker
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-xl space-y-5">
        
        {/* Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'register' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🌾 Quick Register
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'login' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🔑 Farmer Sign In
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            ✓ {successMsg}
          </div>
        )}

        {tab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar Singh"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Farm Size</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Acres"
                  value={regForm.farmSize}
                  onChange={(e) => setRegForm({ ...regForm, farmSize: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village / Town *</label>
                <input
                  type="text"
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
                  value={regForm.district}
                  onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-10 outline-none font-medium"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              {loading ? 'Registering...' : '🌱 Register & Receive +100 Kisan Points'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Number or Email</label>
              <input
                type="text"
                placeholder="e.g. 9876543210 or farmer@agriseed.in"
                value={loginForm.identity}
                onChange={(e) => setLoginForm({ ...loginForm, identity: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-10 outline-none font-medium"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              {loading ? 'Signing In...' : '🔑 Sign In to Portal'}
            </button>
          </form>
        )}

        {/* 1-Click Demo Section */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            1-Click Demo Evaluation Login
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => { demoLogin('farmer'); navigate('/dashboard'); }}
              className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
            >
              👨‍🌾 Demo Farmer
            </button>
            <button
              onClick={() => { demoLogin('admin'); navigate('/admin'); }}
              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
