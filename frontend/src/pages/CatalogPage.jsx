import React, { useState, useMemo, useEffect } from 'react';
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
  X,
  Tag,
  Award,
  Leaf,
  Layers
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { productService } from '../services/api';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, localizeProduct } = useLanguage();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('q') || '';
  const initialCrop = searchParams.get('crop') || 'All';
  const initialSubcategory = searchParams.get('subcategory') || 'All';
  const initialBrand = searchParams.get('brand') || 'All';

  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceMax, setPriceMax] = useState(10000);
  const [onlyCertified, setOnlyCertified] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync URL search params on mount or param change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
    const sub = searchParams.get('subcategory');
    if (sub) setSelectedSubcategory(sub);
  }, [searchParams]);

  // Fetch live products from backend / MongoDB
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const res = await productService.getAll();
        if (res.success && res.products && res.products.length > 0) {
          setProductsList(res.products);
        }
      } catch (e) {
        console.warn('Using local product catalog fallback:', e);
      }
    };
    fetchLiveProducts();
  }, []);

  const categories = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Farming Equipment'];
  const cropList = ['All', 'Paddy / Rice', 'Wheat', 'Cotton', 'Vegetables', 'Mustard', 'All Crops'];

  // Dynamically compute subcategories available for current category
  const availableSubcategories = useMemo(() => {
    const subs = new Set();
    productsList.forEach(p => {
      if (selectedCategory === 'All' || p.category === selectedCategory) {
        if (p.subcategory) subs.add(p.subcategory);
      }
    });
    return ['All', ...Array.from(subs)];
  }, [productsList, selectedCategory]);

  // Dynamically compute brands available
  const availableBrands = useMemo(() => {
    const brands = new Set();
    productsList.forEach(p => {
      if (selectedCategory === 'All' || p.category === selectedCategory) {
        if (p.brand) {
          // Clean up brand name
          const simpleBrand = p.brand.split('/')[0].split('(')[0].trim();
          brands.add(simpleBrand);
        }
      }
    });
    return ['All', ...Array.from(brands).sort()];
  }, [productsList, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return productsList.filter(item => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Subcategory match
      if (selectedSubcategory !== 'All' && item.subcategory !== selectedSubcategory) {
        return false;
      }
      // Brand match
      if (selectedBrand !== 'All' && !item.brand.toLowerCase().includes(selectedBrand.toLowerCase())) {
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
      // QC Certified match
      if (onlyCertified && item.qcStatus !== 'Quality Check Passed') {
        return false;
      }
      // In Stock match
      if (onlyInStock && item.stock <= 0) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const lp = localizeProduct(item);
        const matchName = item.name.toLowerCase().includes(q) || (lp.name && lp.name.toLowerCase().includes(q));
        const matchCat = item.category.toLowerCase().includes(q) || (lp.category && lp.category.toLowerCase().includes(q));
        const matchSub = (item.subcategory || '').toLowerCase().includes(q);
        const matchBrand = (item.brand || '').toLowerCase().includes(q);
        const matchCrop = item.cropSuitability.toLowerCase().includes(q) || (lp.cropSuitability && lp.cropSuitability.toLowerCase().includes(q));
        const matchDesc = item.description.toLowerCase().includes(q) || (lp.description && lp.description.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchSub && !matchBrand && !matchCrop && !matchDesc) {
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
  }, [selectedCategory, selectedSubcategory, selectedBrand, selectedCrop, searchQuery, priceMax, onlyCertified, onlyInStock, sortBy, productsList, localizeProduct]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('All');
    setSelectedBrand('All');
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedBrand('All');
    setSelectedCrop('All');
    setSearchQuery('');
    setPriceMax(10000);
    setOnlyCertified(false);
    setOnlyInStock(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Search */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Govt Lab Certified Agricultural Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white">
            {t('catalogHeaderTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            {t('catalogHeaderDesc')}
          </p>

          <div className="pt-2 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl py-3 pl-11 pr-10 text-xs sm:text-sm outline-none shadow-lg font-medium focus:ring-2 focus:ring-emerald-400"
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

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{cat === 'Seeds' ? '🌾 ' + t('seedsTitle') : cat === 'Fertilizers' ? '🧪 ' + t('fertilizersTitle') : cat === 'Pesticides' ? '🛡️ ' + t('pesticidesTitle') : cat === 'Farming Equipment' ? '⚙️ ' + t('equipmentTitle') : '🌐 ' + cat}</span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills (when available) */}
      {availableSubcategories.length > 2 && (
        <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1 shrink-0 pl-1">
            <Layers className="w-3.5 h-3.5 text-emerald-700" /> Sub-type:
          </span>
          {availableSubcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubcategory === sub
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-100/60'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

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

            {/* Quality & Stock Toggles */}
            <div className="space-y-2.5 pb-2 border-b border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={onlyCertified}
                  onChange={(e) => setOnlyCertified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer accent-emerald-600"
                />
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Govt Lab QC Certified Only
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer accent-emerald-600"
                />
                <span>In-Stock Ready to Dispatch</span>
              </label>
            </div>

            {/* Brand Filter */}
            {availableBrands.length > 2 && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Brand / Manufacturer
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:border-emerald-500"
                >
                  {availableBrands.map(b => (
                    <option key={b} value={b}>{b === 'All' ? 'All Top Brands (IFFCO, Bayer, Syngenta...)' : b}</option>
                  ))}
                </select>
              </div>
            )}

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
                <span className="text-emerald-700 font-extrabold">₹{priceMax.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>₹100</span>
                <span>₹10,000</span>
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
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs outline-none font-bold text-slate-800 cursor-pointer focus:border-emerald-500"
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

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-bold text-sm text-slate-900">Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Brands */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                >
                  {availableBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Max Price</span>
                  <span className="text-emerald-700">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          )}

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
                <ProductCard key={prod.id || prod._id} product={prod} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

