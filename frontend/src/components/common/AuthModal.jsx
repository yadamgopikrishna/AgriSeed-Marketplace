import React, { useState } from 'react';
import { X, Sprout, ShieldCheck, UserCheck, Phone, Lock, MapPin, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal, login, register, demoLogin } = useAuth();
  const { t } = useLanguage();

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

  if (!isAuthModalOpen) return null;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) {
      setErrorMsg('Please fill in Farmer Name and Mobile Number.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await register(regForm);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
      }, 1000);
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
      }, 800);
    } else {
      setErrorMsg(res.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100 animate-scaleUp">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black font-serif tracking-tight">
              Agri<span className="text-emerald-400">Seed</span> Portal
            </h3>
          </div>
          <p className="text-xs text-emerald-200">
            Direct access to certified seeds, fertilizers & farm tracking.
          </p>

          {/* Switchable Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-emerald-950/60 p-1 rounded-xl">
            <button
              onClick={() => openAuthModal('register')}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'register' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
              }`}
            >
              🌾 {t('register')}
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'login' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300 hover:text-white'
              }`}
            >
              🔑 {t('login')}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Register Form */}
          {authModalTab === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('fullNameInput')}</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar Singh"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneInput')}</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farm Land Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Acres"
                    value={regForm.farmSize}
                    onChange={(e) => setRegForm({ ...regForm, farmSize: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('villageInput')}</label>
                  <input
                    type="text"
                    value={regForm.village}
                    onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('districtInput')}</label>
                  <input
                    type="text"
                    value={regForm.district}
                    onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 pr-10 outline-none font-medium"
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
                {loading ? 'Registering Farm...' : `🌱 ${t('registerFarmBtn')} (+100)`}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneInput')}</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or farmer@agriseed.in"
                  value={loginForm.identity}
                  onChange={(e) => setLoginForm({ ...loginForm, identity: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 pr-10 outline-none font-medium"
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
                {loading ? 'Signing In...' : `🔑 ${t('login')}`}
              </button>
            </form>
          )}

          {/* Quick Demo Shortcuts */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              {t('demoEvalLabel')}
            </span>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  demoLogin('farmer');
                  closeAuthModal();
                }}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
              >
                {t('demoFarmer')}
              </button>
              <button
                type="button"
                onClick={() => {
                  demoLogin('admin');
                  closeAuthModal();
                }}
                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
              >
                {t('demoAdmin')}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
