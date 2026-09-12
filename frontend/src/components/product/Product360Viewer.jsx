import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  Info,
  Maximize2,
  Calendar,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import ProductImage from '../common/ProductImage';

export const Product360Viewer = ({ product, localizedProduct }) => {
  const [angle, setAngle] = useState(0); // 0 to 359 degrees
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const startAngle = useRef(0);
  const containerRef = useRef(null);

  const lp = localizedProduct || product;

  // Auto spin animation loop
  useEffect(() => {
    let animId;
    if (isAutoSpin) {
      const step = () => {
        setAngle((prev) => (prev + 1) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAutoSpin]);

  // Drag handlers for mouse & touch
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    dragStartX.current = e.clientX;
    startAngle.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    // Map drag sensitivity: 1px = ~0.8 degrees
    let newAngle = Math.round(startAngle.current + deltaX * 0.8) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoSpin(false);
      dragStartX.current = e.touches[0].clientX;
      startAngle.current = angle;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    let newAngle = Math.round(startAngle.current + deltaX * 0.8) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Step rotation
  const rotateStep = (deg) => {
    setIsAutoSpin(false);
    let newAngle = (angle + deg) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  // Determine which side is facing the user
  const normalizedAngle = (angle % 360 + 360) % 360;
  const isBackSide = normalizedAngle >= 100 && normalizedAngle <= 260;

  // View phase label
  let viewPhase = 'Front Branded Packaging';
  if (normalizedAngle >= 45 && normalizedAngle < 135) viewPhase = 'Side Profile & Barcode';
  else if (normalizedAngle >= 135 && normalizedAngle < 225) viewPhase = 'Back Regulatory Label & Specs';
  else if (normalizedAngle >= 225 && normalizedAngle < 315) viewPhase = 'Safety Precautions & Dilution';

  // Calculate dynamic lighting reflection offset based on angle
  const lightOffset = Math.sin((normalizedAngle * Math.PI) / 180) * 40;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden select-none">
      
      {/* Top Bar with 360 Badge, Angle Indicator and Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            360° Interactive 3D View
          </span>
          <span className="hidden sm:inline-block text-slate-400 font-mono">
            {normalizedAngle}° ({viewPhase})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isAutoSpin
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isAutoSpin ? 'Pause auto-spin' : 'Start auto-spin'}
          >
            {isAutoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSpin ? 'Pause' : 'Auto-Spin'}</span>
          </button>

          <button
            onClick={() => { setAngle(0); setIsAutoSpin(false); }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Reset to 0° Front"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-80 sm:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden my-3"
      >
        {/* Ambient Radial Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-100"
          style={{
            background: `radial-gradient(circle at ${50 + lightOffset}% 40%, rgba(16, 185, 129, 0.15), transparent 65%)`
          }}
        />

        {/* 360 Grid & Compass Guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div
            className="w-72 h-72 rounded-full border border-dashed border-emerald-400/40 flex items-center justify-center transition-transform duration-75"
            style={{ transform: `rotate(${normalizedAngle}deg)` }}
          >
            <div className="w-full h-0.5 bg-emerald-400/30" />
            <div className="h-full w-0.5 bg-emerald-400/30 absolute" />
          </div>
        </div>

        {/* 3D Perspective Card Container */}
        <div
          className="relative z-10 w-64 h-80 flex items-center justify-center transition-transform duration-75"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Packaging Body with 3D Y-Rotation */}
          <div
            className="w-full h-full relative transition-transform duration-75 flex items-center justify-center"
            style={{
              transform: `rotateY(${normalizedAngle}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* FRONT FACE (0° - 90° & 270° - 360°) */}
            <div
              className={`absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-2 transition-opacity duration-200 ${
                isBackSide ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                filter: `drop-shadow(${lightOffset * 0.4}px 12px 20px rgba(0,0,0,0.6))`
              }}
            >
              <ProductImage
                src={product.imageUrl}
                alt={lp.name}
                category={product.category}
                className="max-h-72 w-auto object-contain drop-shadow-xl"
              />
              
              {/* Front Floating Holographic Seal */}
              <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-md text-[10px] font-black px-2 py-0.5 rounded-full text-slate-950 flex items-center gap-1 shadow-lg">
                <ShieldCheck className="w-3 h-3" />
                <span>ORIGINAL SEAL</span>
              </div>
            </div>

            {/* BACK / REVERSE FACE (90° - 270°) */}
            <div
              className={`absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between text-left shadow-2xl transition-opacity duration-200 ${
                isBackSide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Back Header with Brand & Batch */}
              <div className="border-b border-slate-700 pb-2 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                    {product.brand || 'GOVT CERTIFIED INPUT'}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{lp.name}</h4>
                </div>
                <QrCode className="w-7 h-7 text-emerald-400 bg-slate-950 p-1 rounded border border-slate-700" />
              </div>

              {/* Manufacturing & Expiry Dates Card */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">MFG Date:</span>
                  <strong className="text-emerald-400">{product.mfgDate || '15-FEB-2026'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">EXP / Retest:</span>
                  <strong className="text-amber-400">{product.expiryDate || '14-FEB-2028'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Batch / Lot:</span>
                  <span className="text-slate-200">{product.batchNumber || 'PB-2026-B881'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lab Cert No:</span>
                  <span className="text-blue-400">{product.labCertId || 'ICAR-QC-9921'}</span>
                </div>
              </div>

              {/* Chemical Formulation / Ingredients */}
              <div className="text-[10px] space-y-1 text-slate-300">
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Composition / Purity:</span>
                  <strong className="text-emerald-300">{product.purity || product.activeIngredient || '99.2% Standard'}</strong>
                </div>
                <p className="line-clamp-2 text-slate-400 text-[9px] leading-tight">
                  {product.description}
                </p>
              </div>

              {/* Statutory Warning & Government Seal */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px]">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <AlertTriangle className="w-3 h-3" />
                  <span>CIB-RC / FCO Certified</span>
                </span>
                <span className="text-slate-500 font-mono">MRP: ₹{product.price}/- (Incl. GST)</span>
              </div>

            </div>

          </div>
        </div>

        {/* 3D Dynamic Shadow Beneath */}
        <div
          className="absolute bottom-4 w-44 h-4 rounded-full bg-black/60 blur-md transition-all duration-75 pointer-events-none"
          style={{
            transform: `scaleX(${0.8 + Math.abs(Math.sin((normalizedAngle * Math.PI) / 180)) * 0.4})`
          }}
        />

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-slate-300 font-medium flex items-center gap-1.5 border border-slate-800 pointer-events-none">
          <span>⟵ Drag horizontally or swipe to rotate 360° ⟶</span>
        </div>
      </div>

      {/* Cardinal View Buttons */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-4 gap-2 text-center">
        <button
          onClick={() => { setAngle(0); setIsAutoSpin(false); }}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            normalizedAngle >= 315 || normalizedAngle < 45
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          0° Front
        </button>

        <button
          onClick={() => { setAngle(90); setIsAutoSpin(false); }}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            normalizedAngle >= 45 && normalizedAngle < 135
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          90° Side
        </button>

        <button
          onClick={() => { setAngle(180); setIsAutoSpin(false); }}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            normalizedAngle >= 135 && normalizedAngle < 225
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          180° Back / Specs
        </button>

        <button
          onClick={() => { setAngle(270); setIsAutoSpin(false); }}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            normalizedAngle >= 225 && normalizedAngle < 315
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          270° Safety
        </button>
      </div>

    </div>
  );
};

export default Product360Viewer;
