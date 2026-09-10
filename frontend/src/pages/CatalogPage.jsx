import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Sparkles,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, localizeProduct } = useLanguage();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('q') || '';
  const initialCrop = searchParams.get('crop') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceMax, setPriceMax] = useState(3000);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Farming Equipment'];
  const cropList = ['All', 'Paddy / Rice', 'Wheat', 'Cotton', 'Vegetables', 'All Crops'];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(item => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Crop match
      if (selectedCrop !== 'All' && !item.cropSuitability.toLowerCase().includes(selectedCrop.toLowerCase())) {
        return false;
      }
      // Price match
      if (item.price > priceMax) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const lp = localizeProduct(item);
        const matchName = item.name.toLowerCase().includes(q) || (lp.name && lp.name.toLowerCase().includes(q));
        const matchCat = item.category.toLowerCase().includes(q) || (lp.category && lp.category.toLowerCase().includes(q));
        const matchCrop = item.cropSuitability.toLowerCase().includes(q) || (lp.cropSuitability && lp.cropSuitability.toLowerCase().includes(q));
        const matchDesc = item.description.toLowerCase().includes(q) || (lp.description && lp.description.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchCrop && !matchDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.isFeatured ? 1 : -1;
    });
  }, [selectedCategory, selectedCrop, searchQuery, priceMax, sortBy, localizeProduct]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCrop('All');
    setSearchQuery('');
    setPriceMax(3000);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Search */}
      <div className="bg-emerald-950 text-white p-8 rounded-3xl relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {t('deptSubtitle')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
            {t('catalogHeaderTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            {t('catalogHeaderDesc')}
          </p>

          <div className="pt-3 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm outline-none shadow-md font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 sticky top-28">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>{t('filterTitle')}</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-700 hover:underline font-bold cursor-pointer"
              >
                {t('resetAll')}
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                {t('departmentsFilter')}
              </label>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex justify-between items-center cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat === 'Seeds' ? t('seedsTitle') : cat === 'Fertilizers' ? t('fertilizersTitle') : cat === 'Pesticides' ? t('pesticidesTitle') : cat === 'Farming Equipment' ? t('equipmentTitle') : cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Suitability Filter */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                {t('cropSuitabilityFilter')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {cropList.map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedCrop(crop)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedCrop === crop
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>{t('maxPriceLabel')}</span>
                <span className="text-emerald-700 font-extrabold">₹{priceMax}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>₹100</span>
                <span>₹3,000+</span>
              </div>
            </div>

            {/* Assurance Card */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1.5 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('certifiedGuaranteeTitle')}</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-tight">
                {t('certifiedGuaranteeDesc')}
              </p>
            </div>

          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs text-slate-500 font-medium">
              {t('showingCount')} <strong className="text-slate-900 font-extrabold">{filteredProducts.length}</strong> {t('agriculturalProducts')}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>{t('sortByLabel')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs outline-none font-bold text-slate-800 cursor-pointer"
                >
                  <option value="featured">{t('sortFeatured')}</option>
                  <option value="rating">{t('sortRating')}</option>
                  <option value="price-low">{t('sortPriceLow')}</option>
                  <option value="price-high">{t('sortPriceHigh')}</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden p-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{t('filtersBtn')}</span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-800">{t('noProductsFound')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('noProductsDesc')}
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 cursor-pointer"
              >
                {t('resetAll')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
