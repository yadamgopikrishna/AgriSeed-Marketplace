import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingCart, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const WishlistDrawer = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { t, localizeProduct } = useLanguage();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    const pack = product.packSizes && product.packSizes.length > 0 ? product.packSizes[0].size : product.unit;
    addToCart(product, pack, 1);
    removeFromWishlist(product.id);
    setIsWishlistOpen(false);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-emerald-100 animate-slideLeft">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t('wishlistTitle')}</h3>
              <p className="text-xs text-slate-500">{wishlist.length} {t('savedForSeason')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
                ❤️
              </div>
              <h4 className="font-bold text-slate-800 text-base">{t('emptyWishlistTitle')}</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t('emptyWishlistDesc')}
              </p>
              <Link
                to="/catalog"
                onClick={() => setIsWishlistOpen(false)}
                className="inline-block mt-2 bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-700/20"
              >
                {t('exploreSeeds')}
              </Link>
            </div>
          ) : (
            wishlist.map((item) => {
              const lp = localizeProduct(item);
              return (
                <div key={item.id} className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <img
                    src={item.imageUrl}
                    alt={lp.name}
                    className="w-18 h-18 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">{lp.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          🌾 {lp.cropSuitability}
                        </span>
                        <span className="font-black text-xs text-emerald-950">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{t('moveToCart')}</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={clearWishlist}
              className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
            >
              {t('clearAllItems')}
            </button>
            <Link
              to="/catalog"
              onClick={() => setIsWishlistOpen(false)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>{t('viewFullCatalog')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
