import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { products } from '../../data/products';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart, updateQuantity, openCartDrawer } from '../../store/features/cart/cartSlice';
import { formatCurrency } from '../../lib/currency';
import { formatDuration } from '../../lib/duration';
import { useToast } from '../common/ToastProvider';

export const TrendingServicesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [activeCategory, setActiveCategory] = useState<'all' | 'facial' | 'waxing' | 'hair' | 'nails'>('all');

  const filteredList = products.filter((p) => {
    if (activeCategory === 'facial') return p.categoryId === 'facials-skincare';
    if (activeCategory === 'waxing') return p.categoryId === 'waxing-grooming';
    if (activeCategory === 'hair') return p.categoryId === 'hair-services';
    if (activeCategory === 'nails') return p.categoryId === 'manicure-pedicure';
    return true;
  }).slice(0, 8);

  const handleAdd = (product: any) => {
    dispatch(addToCart({ product }));
    dispatch(openCartDrawer());
    showToast(`Added "${product.title}" to cart!`);
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#601A24]" />
              <span>Trending Near You</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Most Booked Treatments This Week
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Top-rated at-home treatments delivered with sealed mono-dose brand kits.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Popular' },
              { id: 'facial', label: 'Facials & Glow' },
              { id: 'waxing', label: 'Rica Waxing' },
              { id: 'hair', label: 'Hair Studio' },
              { id: 'nails', label: 'Mani-Pedi' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#601A24] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Beautiva Service Cards Grid with Direct Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredList.map((product) => {
            const inCart = cartItems.find((i) => i.product.id === product.id);
            const qty = inCart?.quantity || 0;

            return (
              <div
                key={product.id}
                className="bg-[#FAF8F5] rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-md hover:border-[#601A24]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Quick Badges */}
                  <div className="relative aspect-[16/10] bg-stone-200 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-900/90 text-white font-mono backdrop-blur-xs">
                        {product.brand}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white bg-black/50 backdrop-blur-xs px-2 py-1 rounded-md">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {product.durationMinutes} mins
                      </span>
                      <span className="flex items-center gap-1 font-bold text-[#F3E5AB]">
                        <Star className="w-3 h-3 fill-[#F3E5AB]" />
                        4.9 (1.2k)
                      </span>
                    </div>
                  </div>

                  {/* Body Copy */}
                  <div className="p-4 space-y-2">
                    <Link to={`/package/${product.slug}`} className="block">
                      <h3 className="font-bold text-sm text-stone-900 hover:text-[#601A24] transition-colors line-clamp-1 leading-snug">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Inclusions checklist preview */}
                    <div className="space-y-1 pt-1 text-[11px] text-stone-600">
                      {(product.inclusions || []).slice(0, 2).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Price & Add Button */}
                <div className="p-4 pt-2 border-t border-stone-200/80 bg-white flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#601A24]">
                        · {formatDuration(product.durationMinutes)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        Save {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Direct Add or Stepper */}
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className="px-3.5 py-1.5 bg-white border border-[#601A24] text-[#601A24] hover:bg-[#601A24] hover:text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  ) : (
                    <div className="flex items-center bg-[#FAF8F5] border border-stone-300 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product.id,
                              quantity: qty - 1,
                            })
                          )
                        }
                        className="p-1 text-stone-700 hover:text-stone-900 rounded hover:bg-stone-200 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-stone-900 w-5 text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product.id,
                              quantity: qty + 1,
                            })
                          )
                        }
                        className="p-1 text-stone-700 hover:text-stone-900 rounded hover:bg-stone-200 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
