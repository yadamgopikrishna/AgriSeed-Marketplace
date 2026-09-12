import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ShieldCheck, Check, Zap, Heart, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductImage from '../common/ProductImage';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { t, localizeProduct } = useLanguage();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const lp = localizeProduct(product);
  const isWished = isInWishlist(product.id);

  const [selectedPackIndex, setSelectedPackIndex] = useState(0);

  const packs = lp.packSizes && lp.packSizes.length > 0 ? lp.packSizes : [{ size: lp.unit, price: lp.price }];
  const currentPack = packs[selectedPackIndex] || packs[0];
  const currentPrice = currentPack.price || lp.price;
  const selectedPack = currentPack.size;

  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedPack, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedPack, 1);
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <Link to={`/product/${product.id}`}>
          <ProductImage
            src={product.imageUrl}
            alt={lp.name}
            category={product.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Floating Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
            isWished
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          title={isWished ? t('removedFromWishlist') : t('addedToWishlist')}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-white' : ''}`} />
        </button>

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span>{product.categoryIcon}</span>
            <span>{lp.category}</span>
          </span>
          {lp.cropSuitability && (
            <span className="bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              🌾 {lp.cropSuitability}
            </span>
          )}
        </div>

        {/* Germination Badge if Seed */}
        {product.germinationRate && product.germinationRate !== 'N/A' && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>{product.germinationRate} {t('testedGermination').split(' ')[1] || 'Germination'}</span>
          </span>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Seller */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
            </div>

            {product.verifiedSeller && (
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5" title="Licensed Seller">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('govtApproved').split(' ')[0] || 'Verified'}</span>
              </span>
            )}
          </div>

          {/* Title and Brand */}
          <div className="mt-1">
            {product.brand && (
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1">
                {product.brand}
              </span>
            )}
            <Link to={`/product/${product.id}`}>
              <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                {lp.name}
              </h3>
            </Link>
          </div>

          {/* Active chemical / formulation or Season */}
          {product.activeIngredient ? (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-mono">
              🧪 {product.activeIngredient}
            </p>
          ) : lp.season ? (
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span>📅 {t('paramSeason')}:</span> <strong className="text-slate-700">{lp.season}</strong>
            </p>
          ) : null}

          {/* QC Lab Certificate Tag */}
          <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100 font-mono">
            <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate">Cert: {product.labCertId || 'CIB-RC/2024-QC'}</span>
          </div>

          {/* Dynamic Pack Size Selector */}
          {packs && packs.length > 1 && (
            <div className="mt-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t('selectPackUnit')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {packs.map((pack, idx) => (
                  <button
                    key={pack.size || idx}
                    type="button"
                    onClick={() => setSelectedPackIndex(idx)}
                    className={`text-[11px] px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedPackIndex === idx
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pack.size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-4 mt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 font-medium">Price: </span>
              <span className="text-lg font-black text-emerald-950 font-sans">
                ₹{currentPrice}
              </span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-xs text-slate-400 line-through ml-1.5">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              {selectedPack}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                addedAnim
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>✓</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{t('buyNow')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
