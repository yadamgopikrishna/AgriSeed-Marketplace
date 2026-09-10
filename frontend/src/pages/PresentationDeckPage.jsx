import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Home,
  Sprout,
  Presentation,
  CheckCircle2,
  Award,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Database
} from 'lucide-react';

export const PresentationDeckPage = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 14;
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(totalSlides, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(1, prev - 1));
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 border-b border-slate-800 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <span>AgriSeed Project Presentation Deck</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-300">
            Slide {currentSlide} / {totalSlides}
          </span>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(totalSlides, prev + 1))}
            disabled={currentSlide === totalSlides}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <Link
            to="/"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>
        </div>
      </div>

      {/* Slide Progress Indicator */}
      <div className="w-full h-1 bg-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
        ></div>
      </div>

      {/* Main Slide Stage Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 p-8 sm:p-12 shadow-2xl min-h-[550px] flex flex-col justify-between animate-fadeIn">
          
          {/* Slide 1: Title Slide */}
          {currentSlide === 1 && (
            <div className="text-center space-y-6 my-auto">
              <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300">
                🌱 AGRISEED CAPSTONE PRESENTATION
              </div>
              <h1 className="text-4xl sm:text-6xl font-black font-serif text-white tracking-tight">
                AgriSeed – Online Agricultural Marketplace
              </h1>
              <p className="text-xl font-serif italic text-amber-300">
                “Quality Seeds. Better Crops. Better Future.”
              </p>
              <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                A Direct-to-Farmer Agricultural E-Commerce Ecosystem Disintermediating Supply Chains and Delivering Certified High-Germination Inputs Directly to Rural Villages.
              </p>
              <div className="pt-4 flex justify-center gap-3 text-xs text-emerald-400 font-bold">
                <span>⚡ Python Flask REST API</span>
                <span>•</span>
                <span>MongoDB NoSQL Database</span>
                <span>•</span>
                <span>React Modern Frontend</span>
              </div>
            </div>
          )}

          {/* Slide 2: Vision & Purpose */}
          {currentSlide === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase">Foundation & Motivation</span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-0.5">Project Vision & Core Purpose</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs leading-relaxed">
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-emerald-400 text-sm">🌟 The Vision</h3>
                  <p className="text-slate-300">Empower Indian smallholder farmers through transparent digital procurement, eliminating middlemen margins that inflate cultivation costs.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-emerald-400 text-sm">🎯 The Mission</h3>
                  <p className="text-slate-300">Direct linkage between verified Krishi Kendra cooperatives and farmers with 100% agronomic transparency and 5-stage live dispatch tracking.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <h3 className="font-extrabold text-amber-400 text-sm">📈 Impact Target</h3>
                  <p className="text-slate-300">20% to 30% reduction in cultivation input expenses, 90%+ guaranteed germination emergence, and zero spurious seed risk.</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3: Problem Statement */}
          {currentSlide === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-rose-400 uppercase">Problem Statement</span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-0.5">The Real-World Agricultural Crisis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs leading-relaxed">
                <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-2">
                  <h3 className="font-extrabold text-rose-400 text-sm">1. Middlemen Exploitation</h3>
                  <p className="text-slate-300">4-tier intermediaries inflate seed & fertilizer prices by 25% to 40% before reaching village farmers.</p>
                </div>
                <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-2">
                  <h3 className="font-extrabold text-rose-400 text-sm">2. Spurious & Fake Inputs</h3>
                  <p className="text-slate-300">Over 30% of local mandi seeds suffer from poor germination (&lt;60%), leading to catastrophic crop failures.</p>
                </div>
                <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-2">
                  <h3 className="font-extrabold text-rose-400 text-sm">3. Rural Logistics Barrier</h3>
                  <p className="text-slate-300">Farmers waste days traveling 30-50 km to city mandis without stock certainty or doorstep delivery transport.</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 4: Solution Architecture */}
          {currentSlide === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase">Solution Architecture</span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-0.5">AgriSeed Direct-to-Farmer Model</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-900/40 space-y-2 text-slate-300">
                  <h3 className="font-bold text-rose-400 text-sm">❌ Traditional Broken Chain</h3>
                  <p>Producer ➔ State Distributor (10%) ➔ Mandi Agent (12%) ➔ Village Retailer (15%) ➔ <strong>Farmer pays 40% Extra + High Risk of Fake Seeds</strong></p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-2 text-slate-300">
                  <h3 className="font-bold text-emerald-400 text-sm">✅ AgriSeed Direct Model</h3>
                  <p>Verified Seed Corporations & Cooperatives ➔ <strong>AgriSeed Digital Marketplace</strong> ➔ <strong>Progressive Farmers (Direct Farm Gate Village Delivery)</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 5: Tech Stack */}
          {currentSlide === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase">Technical Architecture</span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-0.5">Full-Stack Technology Stack</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <h3 className="font-bold text-emerald-400 text-sm">💻 Frontend Tier</h3>
                  <p className="text-slate-300">React 18, Vite, Tailwind CSS, Lucide Icons, Multilingual i18n support, and dynamic unit pack pricing.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <h3 className="font-bold text-emerald-400 text-sm">⚙️ Backend Application</h3>
                  <p className="text-slate-300">Python Flask Modular REST API Architecture with SHA-256 session auth and role-based access control.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <h3 className="font-bold text-emerald-400 text-sm">🗄️ Database Tier</h3>
                  <p className="text-slate-300">MongoDB NoSQL document store with dual-mode zero-config fallback persistence for 100% viva reliability.</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 6: 10 Screens Overview */}
          {currentSlide === 6 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase">Prototype Ecosystem</span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-0.5">10 Integrated Application Screens</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">1. Welcome / Splash</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">2. Home & Advisory</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">3. Farmer Auth / Demo</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">4. Product Catalog</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">5. Agronomy Specs</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">6. Shopping Cart</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">7. Multi-Pay Checkout</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">8. 5-Stage Tracking</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">9. Kisan Dashboard</div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">10. Admin Store Hub</div>
              </div>
            </div>
          )}

          {/* Slide 7 to 13 summaries */}
          {currentSlide >= 7 && currentSlide <= 13 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase">Deep Dive Section</span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-0.5">
                  {currentSlide === 7 && 'Catalog & Agronomic Technical Precision'}
                  {currentSlide === 8 && 'Kisan Subsidy & Multi-Payment Checkout'}
                  {currentSlide === 9 && '5-Stage Live Order Tracking Pipeline'}
                  {currentSlide === 10 && 'Admin Store Management & Order Sync'}
                  {currentSlide === 11 && 'MongoDB NoSQL Schema & Architecture'}
                  {currentSlide === 12 && 'Automated Testing & 100% Pass Validation'}
                  {currentSlide === 13 && 'Future Roadmap: Krishi AI & Regional Voice'}
                </h2>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 leading-relaxed space-y-3">
                {currentSlide === 7 && <p>Captures crucial agronomic specifications: Germination %, Genetic Purity %, Sowing Season, Maturity Duration (Days), and Recommended Dosage per Acre with dynamic unit pack sizing.</p>}
                {currentSlide === 8 && <p>Coupon engine applies direct 10% Kisan subsidies (<code>KISAN50</code>). Payment modes include dynamic simulated UPI QR Code, Card, and Cash on Delivery with farm-gate seal inspection.</p>}
                {currentSlide === 9 && <p>Visual milestone progress bar synchronously advances from Ordered ➔ Confirmed ➔ Shipped ➔ Out for Delivery ➔ Delivered with driver contacts and printable bill.</p>}
                {currentSlide === 10 && <p>Store manager console allows administrators to coordinate order dispatches, manage low-stock inventory, and verify seed vendor government licenses.</p>}
                {currentSlide === 11 && <p>5 collections (users, products, sellers, orders, reviews) structured for flexible agricultural schemas with automated zero-config fallback storage.</p>}
                {currentSlide === 12 && <p>All 7 automated test suites passed successfully with 100% test coverage across authentication, catalog filtering, cart, checkout, and admin lifecycle.</p>}
                {currentSlide === 13 && <p>Future extensions include AI Plant Disease Scanner (CNN), Multilingual Voice Assistance in 6 regional languages, and IoT Smart Soil NPK sensor integration.</p>}
              </div>
            </div>
          )}

          {/* Slide 14: Conclusion Slide */}
          {currentSlide === 14 && (
            <div className="text-center space-y-6 my-auto">
              <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300">
                🌾 PROJECT SUMMARY & LIVE DEMO
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
                AgriSeed: Ready for Live Demonstration
              </h2>
              <p className="text-base sm:text-lg italic text-amber-300">
                “Transforming Agricultural Procurement for a Self-Reliant India (Atmanirbhar Krishi)”
              </p>
              <div className="p-4 rounded-2xl bg-slate-800/80 max-w-md mx-auto text-xs text-slate-300 border border-slate-700">
                <p>• Demo Farmer: <code className="text-emerald-400 font-bold">farmer@agriseed.in</code> (farmer123)</p>
                <p>• Demo Admin: <code className="text-amber-400 font-bold">admin@agriseed.in</code> (admin123)</p>
              </div>
              <h3 className="text-xl font-bold text-white">Thank You! Questions & Discussion Warmly Welcomed.</h3>
            </div>
          )}

          {/* Slide Navigation Footer */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>Use Arrow Keys (◀ / ▶) or Space to Navigate</span>
            <span className="font-mono text-emerald-400 font-bold">Slide {currentSlide} of {totalSlides}</span>
          </div>

        </div>
      </div>

    </div>
  );
};
