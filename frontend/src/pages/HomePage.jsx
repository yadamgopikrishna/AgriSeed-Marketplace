import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Truck,
  Award,
  ArrowRight,
  Sparkles,
  Tag,
  Star,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const HomePage = () => {
  const { currentUser, openAuthModal, demoLogin } = useAuth();
  const { t } = useLanguage();

  const featuredSeeds = INITIAL_PRODUCTS.filter(p => p.category === 'Seeds' && p.isFeatured);
  const popularInputs = INITIAL_PRODUCTS.filter(p => p.category !== 'Seeds');

  const categories = [
    { name: 'Seeds', icon: '🌾', count: '6+ Varieties', desc: 'Certified Paddy, Wheat, Bt Cotton, Hybrid Tomato', color: 'from-amber-500/20 to-emerald-500/20' },
    { name: 'Fertilizers', icon: '🧪', count: '4+ Formulations', desc: '100% Water Soluble NPK, Organic Neem Cake', color: 'from-blue-500/20 to-emerald-500/20' },
    { name: 'Pesticides', icon: '🌱', count: '3+ Bio Solutions', desc: 'Bio-Neem 10,000 PPM, Larvicide & Saaf Fungicide', color: 'from-green-500/20 to-teal-500/20' },
    { name: 'Farming Equipment', icon: '🚜', count: '4+ Modern Tools', desc: '16L Battery Sprayers, Seed Drills, Drip Kits', color: 'from-amber-600/20 to-orange-500/20' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Glow Accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-700/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-200">
                🌾 Direct Farm Gate Delivery • Zero Middlemen Commission
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-tight">
              Quality Seeds. <br />
              <span className="text-emerald-400">Better Crops.</span> <br />
              Better Future.
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 max-w-xl leading-relaxed font-normal">
              Directly connect with certified agricultural research centers, verified seed corporations, and licensed cooperatives. Get lab-tested germination seeds delivered directly to your village farm.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/catalog"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <span>🌾 {t('exploreSeeds')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/crop-doctor"
                className="bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-bold text-sm px-5 py-3.5 rounded-2xl transition-all border border-emerald-600/50 backdrop-blur-xs flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-emerald-300" />
                <span>AI Crop Disease Doctor</span>
              </Link>
            </div>

            {/* Value Guarantees Row */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-800/60 text-xs">
              <div className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Tested Germination</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Govt. License Verified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Doorstep Village Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Quick Farmer Access & Registration Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 border-2 border-emerald-400/40 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-emerald-950">
                    🌾 Quick Farmer Portal
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentUser ? 'Active Farmer Session' : 'Join in 30 seconds (+100 Points)'}
                  </p>
                </div>
                <span className="bg-amber-100 text-amber-900 font-black text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>+100 Kisan Bonus</span>
                </span>
              </div>

              {currentUser ? (
                <div className="py-5 space-y-4">
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xl shadow-xs">
                      👨‍🌾
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{currentUser.name}</h4>
                      <p className="text-xs text-slate-500">
                        📍 {currentUser.village}, {currentUser.district} • Land: {currentUser.farmSize}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Kisan Rewards</span>
                      <strong className="text-base text-emerald-700 font-black">{currentUser.kisanRewards || 240} Pts</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Active Dispatches</span>
                      <strong className="text-base text-amber-600 font-black">1 In-Transit</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to="/dashboard"
                      className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl text-center transition-colors shadow-md shadow-emerald-700/20"
                    >
                      Farmer Dashboard
                    </Link>
                    <Link
                      to="/track"
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center transition-colors"
                    >
                      Track My Seeds
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-3.5">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Create your farmer account to book certified seed lots, apply 10% Kisan subsidies, and track rural shipments.
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => openAuthModal('register')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>🌱 Register Farm Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      🔑 Already Registered? Sign In
                    </button>
                  </div>

                  {/* 1-Click Demo Evaluation Row */}
                  <div className="pt-3 border-t border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      College Viva 1-Click Quick Demo
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => demoLogin('farmer')}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        👨‍🌾 Demo Farmer
                      </button>
                      <button
                        onClick={() => demoLogin('admin')}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        🛡️ Demo Admin
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Sowing Season Weather & Krishi Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                  Seasonal Sowing Window
                </span>
                <strong className="text-slate-900 font-bold text-sm">Wheat 1105 & Basmati Paddy Booking</strong>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Current soil moisture index is optimal in Northern and Central belts. Book certified seed lots with 92%+ germination before stocks exhaust.
              </p>
            </div>
          </div>

          <Link
            to="/catalog?category=Seeds"
            className="shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            Order Certified Seeds →
          </Link>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              Complete Agricultural Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 mt-1">
              Browse by Department
            </h2>
          </div>
          <Link to="/catalog" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>View Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/catalog?category=${encodeURIComponent(cat.name)}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700">{cat.count}</span>
                <span className="text-slate-400 group-hover:text-emerald-600 transition-colors font-semibold flex items-center">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Seeds Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              ICAR & NSC Certified Lots
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 mt-1">
              Featured High-Yield Seeds
            </h2>
          </div>
          <Link to="/catalog?category=Seeds" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>See All Seeds</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSeeds.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Kisan Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
              Direct Farmer Subsidy 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
              Get 10% Extra Kisan Subsidy on Certified Crop Inputs
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed font-normal">
              Apply coupon code <code className="bg-white/20 text-amber-300 font-mono px-2 py-0.5 rounded font-bold">KISAN50</code> at checkout to claim instant 10% government subsidy discount + Free Rural Delivery above ₹999.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20"
              >
                Claim Subsidy Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Bio-Fertilizers & Protection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              Nutrients & Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 mt-1">
              Bio-Fertilizers & Crop Tools
            </h2>
          </div>
          <Link to="/catalog" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularInputs.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Farmer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
            Verified Farmer Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 mt-1">
            Trusted by Growers Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              “Procured 50kg Pusa Basmati 1121. The germination was above 94% with zero weeds. Saved ₹3,800 compared to local city mandi traders.”
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                JD
              </div>
              <div>
                <strong className="text-xs text-slate-900 block font-bold">Jaswinder Dhillon</strong>
                <span className="text-[11px] text-slate-400">Farmer, Sangrur (Punjab) • 12 Acres</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              “The 5-stage order tracking stepper is brilliant. I knew exactly when the delivery van reached my village. The battery sprayer is top quality.”
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                RS
              </div>
              <div>
                <strong className="text-xs text-slate-900 block font-bold">Ramesh Kumar Singh</strong>
                <span className="text-[11px] text-slate-400">Farmer, Karnal (Haryana) • 5.5 Acres</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              “Used Bio-Neem Shield on my hybrid tomato nursery. Completely eliminated whitefly without any chemical burning. Highly recommended!”
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                VP
              </div>
              <div>
                <strong className="text-xs text-slate-900 block font-bold">Venkata Rao Patil</strong>
                <span className="text-[11px] text-slate-400">Farmer, Guntur (AP) • 8 Acres</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
