import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_SELLERS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { t, localizeProduct } = useLanguage();

  const rawProduct = INITIAL_PRODUCTS.find(p => p.id === id) || INITIAL_PRODUCTS[0];
  const lp = localizeProduct(rawProduct);
  const seller = INITIAL_SELLERS.find(s => s.id === rawProduct.sellerId) || INITIAL_SELLERS[0];
  const relatedProducts = INITIAL_PRODUCTS.filter(p => p.category === rawProduct.category && p.id !== rawProduct.id).slice(0, 3);

  const [selectedPackIndex, setSelectedPackIndex] = useState(0);

  const packs = lp.packSizes && lp.packSizes.length > 0 ? lp.packSizes : [{ size: lp.unit, price: lp.price }];
  const currentPack = packs[selectedPackIndex] || packs[0];
  const currentPrice = currentPack.price || lp.price;
  const selectedPack = currentPack.size;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'dosage' | 'reviews' | 'seller'
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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
      comment: 'Authentic ICAR tested tag on the bag. Fast dispatch directly to Gharaunda village gate.',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-700">{t('home')}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/catalog" className="hover:text-emerald-700">{t('catalog')}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{lp.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        
        {/* Left Column: Image View & Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={rawProduct.imageUrl}
              alt={lp.name}
              className="w-full h-full object-cover"
            />
            {rawProduct.germinationRate && rawProduct.germinationRate !== 'N/A' && (
              <span className="absolute top-3 left-3 bg-emerald-700 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{rawProduct.germinationRate} {t('germinationGuaranteed')}</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>{t('testedCertifiedLot')}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700">
              {t('officialLicense')} {seller.licenseNo}
            </span>
          </div>
        </div>

        {/* Right Column: Title, Pack Sizing, Pricing & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
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
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-serif text-slate-950 leading-snug">
              {lp.name}
            </h1>

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

            {/* Pricing Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
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
                  {t('totalLabel')} <strong className="text-slate-900 font-extrabold">₹{currentPrice * quantity}</strong>
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

      {/* Tabs Section: Agronomy Specs, Sowing Guide, Reviews, Seller Info */}
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

        {/* Tab 1: Technical Agronomy Specs Table */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">{t('techParamsTitle')}</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Parameter</th>
                    <th className="p-3.5">Standard Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">{t('paramGermination')}</td>
                    <td className="p-3.5 text-emerald-700 font-extrabold">{rawProduct.germinationRate}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-600">{t('paramPurity')}</td>
                    <td className="p-3.5">{rawProduct.purity}</td>
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

        {/* Tab 2: Sowing & Dosage Guide */}
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

        {/* Tab 3: Reviews */}
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

        {/* Tab 4: Seller Info */}
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
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
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
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
