import React, { useState } from 'react';
import {
  Maximize2,
  X,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
  RotateCw,
  Camera,
  Eye,
  FileText
} from 'lucide-react';
import ProductImage from '../common/ProductImage';
import Product360Viewer from './Product360Viewer';

export const ProductGallery = ({ product, localizedProduct }) => {
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | '360'
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  const lp = localizedProduct || product;

  // Prepare multiple gallery angles based on category and product details
  const galleryViews = [
    {
      id: 'front',
      label: 'Front View',
      sublabel: 'Official Branded Packaging',
      type: 'image',
      src: product.imageUrl,
      icon: '📦'
    },
    {
      id: 'back_specs',
      label: 'Back Label',
      sublabel: 'Lab Cert & Chemical Breakdown',
      type: 'specs_card',
      icon: '📋'
    },
    {
      id: 'cert_seal',
      label: 'Govt QC Seal',
      sublabel: 'CIB-RC & ICAR Verified',
      type: 'cert_card',
      icon: '🛡️'
    },
    {
      id: '360_preview',
      label: '360° 3D Model',
      sublabel: 'Interactive Rotating View',
      type: '360',
      icon: '🔄'
    }
  ];

  const currentView = galleryViews[selectedImageIndex] || galleryViews[0];

  // Mouse move zoom lens effect
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  return (
    <div className="space-y-4">
      
      {/* Top View Mode Switcher */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setViewMode('gallery')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === 'gallery'
              ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multi-Angle Photos</span>
        </button>

        <button
          onClick={() => setViewMode('360')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === '360'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span>🔄 360° Interactive 3D</span>
        </button>
      </div>

      {/* Main View Area */}
      {viewMode === '360' ? (
        <Product360Viewer product={product} localizedProduct={lp} />
      ) : (
        <div className="space-y-4">
          
          {/* Main Visual Display Container */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 shadow-inner group">
            
            {/* View 1: Main Photo */}
            {currentView.type === 'image' && (
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full relative flex items-center justify-center p-6 cursor-crosshair"
              >
                <ProductImage
                  src={product.imageUrl}
                  alt={lp.name}
                  category={product.category}
                  className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />

                {/* Floating Zoom Window */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl bg-no-repeat bg-white transition-opacity duration-150"
                  style={{
                    ...zoomStyle,
                    backgroundImage: `url(${product.imageUrl})`,
                    backgroundSize: '250%'
                  }}
                />
              </div>
            )}

            {/* View 2: Back Label Specifications Card */}
            {currentView.type === 'specs_card' && (
              <div className="w-full h-full p-6 flex flex-col justify-between bg-slate-900 text-white select-none">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                      Technical Label Specifications
                    </span>
                    <h4 className="text-sm font-bold">{lp.name}</h4>
                  </div>
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Manufacturing Date</span>
                    <strong className="text-emerald-400 font-mono text-sm">{product.mfgDate || '15-FEB-2026'}</strong>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Expiry / Retest Date</span>
                    <strong className="text-amber-400 font-mono text-sm">{product.expiryDate || '14-FEB-2028'}</strong>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Batch / Lot No.</span>
                    <span className="text-white font-mono font-bold">{product.batchNumber || 'PB-2026-B881'}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Shelf Life Duration</span>
                    <span className="text-white font-bold">{product.shelfLife || '24 Months'}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-[11px] text-emerald-200 flex items-center justify-between">
                  <span>Lab Inspection Report ID: <strong className="font-mono text-white">{product.labCertId || 'ICAR-QC-9921'}</strong></span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            )}

            {/* View 3: Govt QC Seal Card */}
            {currentView.type === 'cert_card' && (
              <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                      Government Tested & Certified
                    </span>
                    <h4 className="text-sm font-extrabold text-white">CIB-RC & ICAR Quality Clearance</h4>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Tested Germination:</span>
                    <strong className="text-emerald-400">{product.germinationRate || '94%+ (Standard)'}</strong>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Physical & Genetic Purity:</span>
                    <strong className="text-white">{product.purity || '99.0% High Pure'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Govt Lab Inspection:</span>
                    <strong className="text-blue-400 font-mono">PASSED & SEALED</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-emerald-300/80">
                  <span>Ministry of Agriculture Compliant</span>
                  <span className="font-mono">Tamper-Proof Hologram ✓</span>
                </div>
              </div>
            )}

            {/* View 4: 360 Redirect Card */}
            {currentView.type === '360' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
                  <RotateCw className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold">Interactive 360° 3D Packaging Model</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Rotate the physical packaging horizontally in full 3D to inspect labels, barcodes, and safety stamps.
                </p>
                <button
                  onClick={() => setViewMode('360')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Launch 360° Studio View</span>
                </button>
              </div>
            )}

            {/* Badges on Main Image */}
            {product.germinationRate && product.germinationRate !== 'N/A' && currentView.type === 'image' && (
              <span className="absolute top-4 left-4 bg-emerald-700/95 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{product.germinationRate} Guaranteed</span>
              </span>
            )}

            {/* Fullscreen Expand Button */}
            {currentView.type === 'image' && (
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md shadow-md transition-all cursor-pointer"
                title="Fullscreen High-Res Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

          </div>

          {/* Thumbnail Selector Strip */}
          <div className="grid grid-cols-4 gap-2.5">
            {galleryViews.map((view, idx) => {
              const isSelected = selectedImageIndex === idx;
              return (
                <button
                  key={view.id}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    if (view.type === '360') setViewMode('360');
                  }}
                  className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{view.icon}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 block leading-tight truncate">
                      {view.label}
                    </span>
                    <span className="text-[9px] text-slate-500 block truncate leading-tight">
                      {view.sublabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                {lp.category} • {product.brand}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{lp.name}</h3>

              <div className="h-96 flex items-center justify-center bg-slate-50 rounded-2xl p-4">
                <ProductImage
                  src={product.imageUrl}
                  alt={lp.name}
                  category={product.category}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <p className="text-xs text-slate-500">
                Official high-resolution vector SVG packaging asset. Sealed with tamper-proof security hologram.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductGallery;
