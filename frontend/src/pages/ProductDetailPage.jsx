import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  Check,
  ShoppingCart,
  Zap,
  Award,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Heart,
  Tag,
  Volume2,
  VolumeX,
  Flame,
  Calculator,
  AlertTriangle,
  QrCode,
  Clock,
  Box,
  BadgePercent
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_SELLERS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import ProductGallery from '../components/product/ProductGallery';
import { productService } from '../services/api';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { currentLang, t, localizeProduct } = useLanguage();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [rawProduct, setRawProduct] = useState(() => {
    return INITIAL_PRODUCTS.find(p => p.id === id || p._id === id) || INITIAL_PRODUCTS[0];
  });

  useEffect(() => {
    const fetchLiveDetail = async () => {
      try {
        const res = await productService.getById(id);
        if (res.success && res.product) {
          setRawProduct(res.product);
        }
      } catch (e) {
        console.warn('Live product detail fetch fallback:', e);
      }
    };
    fetchLiveDetail();
  }, [id]);

  const lp = localizeProduct(rawProduct);
  const productId = rawProduct.id || rawProduct._id;
  const isWished = isInWishlist(productId);
  const seller = INITIAL_SELLERS.find(s => s.id === rawProduct.sellerId || s._id === rawProduct.sellerId) || INITIAL_SELLERS[0];
  const relatedProducts = INITIAL_PRODUCTS.filter(p => p.category === rawProduct.category && (p.id !== productId && p._id !== productId)).slice(0, 3);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN', te: 'te-IN' };
    utterance.lang = langMap[currentLang] || 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const [selectedPackIndex, setSelectedPackIndex] = useState(0);

  const packs = lp.packSizes && lp.packSizes.length > 0 ? lp.packSizes : [{ size: lp.unit, price: lp.price }];
  const currentPack = packs[selectedPackIndex] || packs[0];
  const currentPrice = currentPack.price || lp.price;
  const selectedPack = currentPack.size;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'calculator' | 'dosage' | 'reviews' | 'seller'
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Farm Acreage Calculator State
  const [farmAcres, setFarmAcres] = useState(2);

  // Review state
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev_1',
      name: 'Jaswinder Singh',
      location: 'Sangrur, Punjab',
      rating: 5,
      date: '2026-08-20',
      comment: 'Excellent basmati seed lot! Sowed on 6 acres; emergence rate was outstanding (>95%). Zero sheath blight attack.',
      crop: 'Paddy / Rice'
    },
    {
      id: 'rev_2',
      name: 'Balwinder Kumar',
      location: 'Karnal, Haryana',
      rating: 5,
      date: '2026-08-15',
      comment: 'Authentic ICAR tested tag on the bag with fresh 2026 manufacturing date. Fast dispatch directly to village gate.',
      crop: 'Paddy / Rice'
    }
  ]);

  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '', crop: lp.cropSuitability });

  const handleAddToCart = () => {
    addToCart(rawProduct, selectedPack, quantity);
    setIsCartDrawerOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(rawProduct, selectedPack, quantity);
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleAddAcreageToCart = (calcQty) => {
    addToCart(rawProduct, selectedPack, Math.max(1, calcQty));
    setIsCartDrawerOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setReviewsList([
      {
        id: `rev_${Date.now()}`,
        name: newReview.name,
        location: 'Verified Grower',
        rating: Number(newReview.rating),
        date: new Date().toISOString().split('T')[0],
        comment: newReview.comment,
        crop: newReview.crop
      },
      ...reviewsList
    ]);
    setIsReviewModalOpen(false);
    setNewReview({ name: '', rating: 5, comment: '', crop: lp.cropSuitability });
  };

  // Dosage computation based on product category
  const getDosageRate = () => {
    if (rawProduct.category === 'Seeds') return { rate: 6, unit: 'kg/acre' };
    if (rawProduct.category === 'Fertilizers') {
      if (rawProduct.name.toLowerCase().includes('urea')) return { rate: 45, unit: 'kg/acre' };
      if (rawProduct.name.toLowerCase().includes('dap')) return { rate: 50, unit: 'kg/acre' };
      return { rate: 25, unit: 'kg/acre' };
    }
    if (rawProduct.category === 'Pesticides') {
      if (rawProduct.name.toLowerCase().includes('pexalon')) return { rate: 235, unit: 'ml/acre' };
      if (rawProduct.name.toLowerCase().includes('coragen')) return { rate: 150, unit: 'ml/acre' };
      if (rawProduct.name.toLowerCase().includes('confidor')) return { rate: 250, unit: 'ml/acre' };
      return { rate: 500, unit: 'ml/acre' };
    }
    return { rate: 1, unit: 'unit/acre' };
  };

  const dosageInfo = getDosageRate();
  const totalRequiredQuantity = farmAcres * dosageInfo.rate;
  const recommendedPacks = Math.ceil(totalRequiredQuantity / (parseFloat(selectedPack) || 1));

  // Determine toxicity badge
  const getToxicityBadge = () => {
    if (rawProduct.category === 'Seeds') {
      return { label: 'Certified Agricultural Seed Lot (Zero Toxicity)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', triangle: '🟢' };
    }
    if (rawProduct.category === 'Fertilizers') {
      return { label: 'Plant Nutrient - Non Hazardous / FCO Approved', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', triangle: '🟢' };
    }
    if (rawProduct.name.toLowerCase().includes('saaf') || rawProduct.name.toLowerCase().includes('blitox') || rawProduct.name.toLowerCase().includes('contaf')) {
      return { label: 'Slightly Toxic (Blue Label - Fungicide/Bactericide)', color: 'bg-blue-100 text-blue-900 border-blue-300', triangle: '🔵' };
    }
    return { label: 'Moderately Toxic (Yellow Label - Insecticide / Herbicide)', color: 'bg-amber-100 text-amber-900 border-amber-300', triangle: '🟡' };
  };

  const toxicity = getToxicityBadge();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-700">{t('home')}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/catalog" className="hover:text-emerald-700">{t('catalog')}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/catalog?category=${rawProduct.category}`} className="hover:text-emerald-700">{rawProduct.category}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{lp.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        
        {/* Left Column: Interactive Product Gallery with 360° Studio */}
        <div className="lg:col-span-5 space-y-4">
          <ProductGallery product={rawProduct} localizedProduct={lp} />

          {/* Guarantee & License Footer */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{t('testedCertifiedLot')}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 font-mono">
              Lic: {seller.licenseNo || 'AGRI/GOV/2026'}
            </span>
          </div>
        </div>

        {/* Right Column: Title, Dates, Sizing, Pricing & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category and Suitability Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span>{rawProduct.categoryIcon}</span>
                <span>{lp.category}</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                🌾 {lp.cropSuitability}
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                📅 {lp.season}
              </span>
              <span className="bg-blue-100 text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{rawProduct.qcStatus || 'QC Passed'}</span>
              </span>
            </div>

            {/* Brand Header */}
            {rawProduct.brand && (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-800 text-white text-xs font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                  {rawProduct.brand}
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">
                  Lab Cert: <strong className="text-blue-700">{rawProduct.labCertId || 'CIB-RC/2024-QC'}</strong>
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 leading-snug">
                {lp.name}
              </h1>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Voice Guidance Button */}
                <button
                  type="button"
                  onClick={() => handleSpeak(`${lp.name}. ${lp.cropSuitability}. ${lp.description || ''}. ${lp.dosageGuide || ''}`)}
                  className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer shadow-xs"
                  title={isSpeaking ? t('playingAudio') : t('listenAudio')}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-emerald-600' : ''}`} />
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(rawProduct)}
                  className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shadow-xs ${
                    isWished
                      ? 'bg-rose-500 border-rose-600 text-white'
                      : 'bg-slate-50 hover:bg-rose-50 border-slate-200 text-slate-700 hover:text-rose-500'
                  }`}
                  title={isWished ? t('removedFromWishlist') : t('addedToWishlist')}
                >
                  <Heart className={`w-4 h-4 ${isWished ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Ratings & Seller info */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black text-slate-900">{rawProduct.rating}</span>
                <span className="text-slate-500 font-medium">({rawProduct.reviewCount} reviews)</span>
              </div>

              <span className="text-slate-300">•</span>

              <div className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Seller: <strong className="text-slate-800">{rawProduct.sellerName}</strong></span>
              </div>
            </div>

            {/* KEY MANUFACTURING & EXPIRY DATES HIGHLIGHT BOX */}
            <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-blue-50 p-4 rounded-2xl border border-emerald-100/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-200/60">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Manufacturing & Shelf-Life Verification</span>
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Fresh 2026 Batch
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">MFG Date</span>
                  <strong className="text-slate-900 font-mono text-sm">{rawProduct.mfgDate || '15-FEB-2026'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">EXP / Best Before</span>
                  <strong className="text-emerald-700 font-mono text-sm">{rawProduct.expiryDate || '14-FEB-2028'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Batch Number</span>
                  <span className="text-slate-800 font-mono font-bold">{rawProduct.batchNumber || 'PB-1121-B4-2026'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Shelf Life</span>
                  <span className="text-blue-800 font-bold">{rawProduct.shelfLife || '24 Months'}</span>
                </div>
              </div>
            </div>

            {/* Pricing & Subsidy Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-0.5">{t('specialPriceLabel')}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-950 font-sans">
                      ₹{currentPrice}
                    </span>
                    {rawProduct.originalPrice && rawProduct.originalPrice > currentPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{rawProduct.originalPrice}
                      </span>
                    )}
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {t('saveLabel')} ₹{(rawProduct.originalPrice || currentPrice) - currentPrice + 50}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                    {t('inStockBadge')} ({rawProduct.stock})
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">{t('readyDispatch')}</span>
                </div>
              </div>

              {/* Kisan Subsidy Promo */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between font-medium">
                <span className="flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-amber-600" />
                  <span>Kisan Subsidy Code: <strong>KISAN50</strong> (Extra 10% Off)</span>
                </span>
                <span className="text-[11px] text-amber-800 font-bold">Free Rural Shipping &gt; ₹999</span>
              </div>
            </div>

            {/* Dynamic Pack Size Unit Selector */}
            {packs && packs.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  {t('selectPackUnit')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {packs.map((pack, idx) => (
                    <button
                      key={pack.size || idx}
                      type="button"
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPackIndex === idx
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="font-extrabold text-xs">{pack.size}</div>
                      <div className="text-sm font-black text-emerald-800 mt-1">₹{pack.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700">{t('quantityLabel')}</label>
                <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-0.5 font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-black text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-0.5 font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {t('totalLabel')} <strong className="text-slate-900 font-extrabold">₹{(currentPrice * quantity).toLocaleString('en-IN')}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-700" />
                  <span>{t('addToCart')}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/25 cursor-pointer hover:scale-102"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{t('buyNow')}</span>
                </button>
              </div>
            </div>

            {/* Toxicity / Safety Classification */}
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${toxicity.color}`}>
              <span className="text-base">{toxicity.triangle}</span>
              <span>{toxicity.label}</span>
            </div>

          </div>

          {/* Value Props Row */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{t('doorstepAssurance')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('sealedBagAssurance')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>{t('subsidyEligibleAssurance')}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Section: Agronomy Specs, Acreage Calculator, Sowing Guide, Reviews, Seller Info */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
        
        <div className="flex border-b border-slate-200 gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-black transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {t('specsTab')}
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-4 text-sm font-black transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Farm Acreage Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('dosage')}
            className={`pb-4 text-sm font-black transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'dosage'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {t('dosageTab')}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-black transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {t('reviewsTab')} ({reviewsList.length})
          </button>

          <button
            onClick={() => setActiveTab('seller')}
            className={`pb-4 text-sm font-black transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'seller'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {t('sellerTab')}
          </button>
        </div>

        {/* Tab 1: Technical Agronomy & Manufacturing Specs Table */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">{t('techParamsTitle')}</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Parameter</th>
                    <th className="p-3.5">Official Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {rawProduct.brand && (
                    <tr>
                      <td className="p-3.5 font-bold text-slate-600">Manufacturer / Brand</td>
                      <td className="p-3.5 font-extrabold text-emerald-800">{rawProduct.brand}</td>
                    </tr>
                  )}
                  {rawProduct.activeIngredient && (
                    <tr>
                      <td className="p-3.5 font-bold text-slate-600">Active Chemical / Formulation</td>
                      <td className="p-3.5 font-mono text-slate-900 font-bold">{rawProduct.activeIngredient}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">Manufacturing Date (MFG)</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{rawProduct.mfgDate || '15-FEB-2026'}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">Expiry Date (EXP) / Retest</td>
                    <td className="p-3.5 font-mono font-bold text-amber-700">{rawProduct.expiryDate || '14-FEB-2028'}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">Batch / Lot Identification</td>
                    <td className="p-3.5 font-mono text-slate-700">{rawProduct.batchNumber || 'PB-1121-B4-2026'}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">Quality Check Status</td>
                    <td className="p-3.5 font-extrabold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{rawProduct.qcStatus || 'Quality Check Passed (Govt Certified)'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">Govt Lab Certificate ID</td>
                    <td className="p-3.5 font-mono font-bold text-blue-700">{rawProduct.labCertId || 'ICAR-IARI-QC-9921'}</td>
                  </tr>
                  {rawProduct.germinationRate && rawProduct.germinationRate !== 'N/A' && (
                    <tr>
                      <td className="p-3.5 font-bold text-slate-600">{t('paramGermination')}</td>
                      <td className="p-3.5 text-emerald-700 font-extrabold">{rawProduct.germinationRate}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">{t('paramPurity')}</td>
                    <td className="p-3.5">{rawProduct.purity || '99.0% High Purity'}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">{t('paramSeason')}</td>
                    <td className="p-3.5">{lp.season}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">{t('paramMaturity')}</td>
                    <td className="p-3.5">{rawProduct.maturityPeriod}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">{t('paramYield')}</td>
                    <td className="p-3.5 font-bold text-slate-900">{rawProduct.yieldPotential}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">{t('paramCrop')}</td>
                    <td className="p-3.5">{lp.cropSuitability}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Farm Acreage Requirement Calculator */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>Farm Acreage Dosage & Quantity Calculator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your total cultivated farm acreage to calculate exact seed or chemical requirements.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Land Area (Acres)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={farmAcres}
                    onChange={(e) => setFarmAcres(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-32 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-2">
                    {[1, 2, 5, 10].map(a => (
                      <button
                        key={a}
                        onClick={() => setFarmAcres(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          farmAcres === a
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {a} Acre{a > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculated Output Card */}
              <div className="p-4 rounded-2xl bg-emerald-900 text-white space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-800 text-xs">
                  <span className="text-emerald-300">Recommended Application Rate:</span>
                  <strong className="font-mono text-emerald-100">{dosageInfo.rate} {dosageInfo.unit}</strong>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-emerald-300 block text-[11px]">Total Quantity Required:</span>
                    <span className="text-xl font-black text-amber-300 font-mono">
                      {totalRequiredQuantity} {dosageInfo.unit.split('/')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-300 block text-[11px]">Estimated Investment:</span>
                    <span className="text-xl font-black text-white font-mono">
                      ₹{(recommendedPacks * currentPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-800 flex justify-between items-center">
                  <span className="text-xs text-emerald-200">
                    Required Pack Count: <strong>{recommendedPacks} Pack(s)</strong>
                  </span>
                  <button
                    onClick={() => handleAddAcreageToCart(recommendedPacks)}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add {recommendedPacks} Packs to Cart</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Sowing & Dosage Guide */}
        {activeTab === 'dosage' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">{t('dosageBestPracticesTitle')}</h3>
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 space-y-2 leading-relaxed">
              <strong className="block text-sm font-extrabold">{t('dosageInstruction')}</strong>
              <p>{lp.dosageGuide}</p>
              <div className="pt-3 border-t border-emerald-200/60 font-semibold text-emerald-800">
                {t('dosageTip')}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{t('reviewsTab')}</h3>
                <p className="text-xs text-slate-500">Real feedback from progressive crop growers.</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                {t('writeReviewBtn')}
              </button>
            </div>

            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{rev.name}</strong>
                      <span className="text-slate-400">({rev.location})</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {t('verifiedPurchase')}
                      </span>
                    </div>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Seller Info */}
        {activeTab === 'seller' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-extrabold text-slate-900">{t('sellerProfileTitle')}</h3>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-900">{seller.name}</h4>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Licensed</span>
                </span>
              </div>
              <p className="text-slate-600">Owner: <strong>{seller.owner}</strong></p>
              <p className="text-slate-600">Location: <strong>{seller.location}</strong></p>
              <p className="text-slate-600">{t('officialLicense')} <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono font-bold text-emerald-800">{seller.licenseNo}</code></p>
              <p className="text-slate-600">Contact: <strong>{seller.phone}</strong> | {seller.email}</p>
            </div>
          </div>
        )}

      </div>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">{t('writeReviewTitle')}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('yourNameLabel')}</label>
                <input
                  type="text"
                  placeholder="e.g. Gurdeep Singh"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('ratingLabel')}</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 - Outstanding Germination)</option>
                  <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3 - Average)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('feedbackLabel')}</label>
                <textarea
                  rows="3"
                  placeholder="Share your experience regarding germination rate, yield, disease resistance..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  {t('submitReviewBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black font-serif text-slate-900">
            {t('complementaryInputsTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

