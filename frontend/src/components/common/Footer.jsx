import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Truck, Award, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { demoLogin } = useAuth();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Guarantee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Tested Germination</h4>
              <p className="text-xs text-slate-400">Certified by ICAR & State Testing Labs</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Govt. Verified Vendors</h4>
              <p className="text-xs text-slate-400">Authentic license seals & batch tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Village Farm Gate Delivery</h4>
              <p className="text-xs text-slate-400">Doorstep transport for heavy seed bags</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-900/60 text-amber-400 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold">0%</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Zero Middlemen Markup</h4>
              <p className="text-xs text-slate-400">Direct producer prices save up to 30%</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-serif">
                Agri<span className="text-emerald-400">Seed</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian farmers through direct digital procurement of certified agricultural inputs. Developed for College Capstone Evaluation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/70 py-1.5 px-3 rounded-lg border border-emerald-800/60 inline-flex">
              <span>🌾 Atmanirbhar Krishi Mission</span>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Product Departments</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/catalog?category=Seeds" className="hover:text-emerald-400 transition-colors">🌾 Certified Hybrid & Desi Seeds</Link></li>
              <li><Link to="/catalog?category=Fertilizers" className="hover:text-emerald-400 transition-colors">🧪 Water Soluble NPK & Bio-Fertilizers</Link></li>
              <li><Link to="/catalog?category=Pesticides" className="hover:text-emerald-400 transition-colors">🌱 Organic & Botanical Crop Protection</Link></li>
              <li><Link to="/catalog?category=Farming+Equipment" className="hover:text-emerald-400 transition-colors">🚜 Knapsack Sprayers & Farm Tools</Link></li>
            </ul>
          </div>

          {/* Farmer Portals */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Farmer Portals & Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/track" className="hover:text-emerald-400 transition-colors">🚚 Live 5-Stage Order Tracking</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">👨‍🌾 Kisan Dashboard & Sowing Plan</Link></li>
              <li><Link to="/crop-doctor" className="hover:text-emerald-400 transition-colors">🌱 Krishi AI Leaf Disease Doctor</Link></li>
              <li><Link to="/presentation" className="hover:text-amber-400 transition-colors text-amber-300 font-semibold">📊 Presentation Slides & Viva Deck</Link></li>
            </ul>
          </div>

          {/* Project Evaluation Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Evaluation Quick Logins</h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Farmer:</span>
                <button
                  onClick={() => demoLogin('farmer')}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  ⚡ Login (farmer@agriseed.in)
                </button>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Admin:</span>
                <button
                  onClick={() => demoLogin('admin')}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  🛡️ Login (admin@agriseed.in)
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Passcode for demo accounts: <code className="text-slate-300">farmer123</code> / <code className="text-slate-300">admin123</code>
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 AgriSeed – Online Agricultural Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-slate-400">Store Management Console</Link>
            <span>•</span>
            <Link to="/presentation" className="hover:text-amber-400 text-amber-500">Presentation Deck (PPT)</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
