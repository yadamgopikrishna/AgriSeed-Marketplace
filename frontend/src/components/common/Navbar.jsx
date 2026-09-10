import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  Search,
  ShoppingCart,
  User,
  ShieldCheck,
  Globe,
  Stethoscope,
  Presentation,
  Truck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { currentUser, logout, openAuthModal, demoLogin } = useAuth();
  const { currentLang, setLang, t, languages } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Advisory & Language Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🌾 <strong>Krishi Sowing Advisory:</strong> Optimal Kharif & Rabi certified seed booking is live across Punjab, Haryana, UP & AP.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/presentation" className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold text-amber-400">
              <Presentation className="w-3.5 h-3.5" />
              <span>Project Presentation Deck</span>
            </Link>

            <span className="text-emerald-700">|</span>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-emerald-900/60 px-2 py-0.5 rounded"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{languages.find(l => l.code === currentLang)?.native}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-slate-900 text-white rounded-lg shadow-xl border border-emerald-800/50 py-1 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLang(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-800 transition-colors flex justify-between items-center ${
                        currentLang === lang.code ? 'text-emerald-400 font-bold bg-emerald-950/80' : 'text-slate-300'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-emerald-950 font-serif">
                  Agri<span className="text-emerald-600">Seed</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Direct
                </span>
              </div>
              <p className="text-[10px] text-emerald-800 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-lg relative">
            <input
              type="text"
              placeholder="Search certified seeds, NPK fertilizers, bio-pesticides, sprayers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-full py-2.5 pl-11 pr-24 text-sm outline-none transition-all shadow-inner focus:shadow-emerald-500/10"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 rounded-full transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>

            <Link
              to="/catalog"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/catalog') ? 'text-emerald-700 bg-emerald-50' : 'hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('catalog')}
            </Link>

            <Link
              to="/track"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/track') ? 'text-emerald-700 bg-emerald-50' : 'hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{t('trackOrder')}</span>
            </Link>

            <Link
              to="/crop-doctor"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/crop-doctor') ? 'text-emerald-700 bg-emerald-50' : 'hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 font-bold">{t('cropDoctor')}</span>
            </Link>
          </nav>

          {/* Right Action Icons & User State */}
          <div className="flex items-center gap-2.5">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer group"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {currentUser.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs shadow-amber-500/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin Portal</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-emerald-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">
                      👨‍🌾
                    </div>
                    <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  🌱 {t('register')}
                </button>
                <button
                  onClick={() => demoLogin('farmer')}
                  className="hidden sm:inline-flex bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-2 rounded-xl transition-colors cursor-pointer"
                  title="1-Click Evaluation Login"
                >
                  ⚡ Demo
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search seeds, fertilizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-800 flex items-center gap-2"
            >
              🏠 {t('home')}
            </Link>
            <Link
              to="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-800 flex items-center gap-2"
            >
              🌾 {t('catalog')}
            </Link>
            <Link
              to="/track"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-800 flex items-center gap-2"
            >
              🚚 {t('trackOrder')}
            </Link>
            <Link
              to="/crop-doctor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center gap-2"
            >
              🌱 {t('cropDoctor')}
            </Link>
          </div>

          {/* Language Picker on Mobile */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-500 block mb-1.5">Language / भाषा</label>
            <div className="grid grid-cols-4 gap-1">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`py-1.5 text-xs font-bold rounded ${
                    currentLang === l.code ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
