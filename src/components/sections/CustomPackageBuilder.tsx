import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Plus, 
  ShoppingBag, 
  Trash2, 
  Clock, 
  Tag, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToCart, openCartDrawer } from '../../store/features/cart/cartSlice';
import { useToast } from '../common/ToastProvider';
import { formatCurrency } from '../../lib/currency';
import { Product } from '../../types/product';

interface BuilderOption {
  id: string;
  category: 'facial' | 'waxing' | 'addon';
  title: string;
  brand: string;
  price: number;
  originalPrice: number;
  durationMinutes: number;
  image: string;
  highlight: string;
}

const BUILDER_ITEMS: BuilderOption[] = [
  // Facials
  {
    id: 'b-facial-1',
    category: 'facial',
    title: 'Lotus WhiteGlow Herbal Facial',
    brand: 'Lotus Herbals',
    price: 899,
    originalPrice: 1400,
    durationMinutes: 60,
    image: '/images/salonline_facial_skincare_1792923326387.jpg',
    highlight: 'Deep cleansing + herbal de-tan'
  },
  {
    id: 'b-facial-2',
    category: 'facial',
    title: 'VLCC Gold Radiance Facial',
    brand: 'VLCC Professional',
    price: 999,
    originalPrice: 1650,
    durationMinutes: 70,
    image: '/images/salonline_facial_skincare_1792923326387.jpg',
    highlight: '24K gold leaves + acupressure glow'
  },
  {
    id: 'b-facial-3',
    category: 'facial',
    title: 'O3+ Bridal Whitening Facial',
    brand: 'O3+ Professional',
    price: 1399,
    originalPrice: 2200,
    durationMinutes: 75,
    image: '/images/salonline_facial_skincare_1792923326387.jpg',
    highlight: 'Dermatologically tested bridal glow'
  },

  // Waxing
  {
    id: 'b-wax-1',
    category: 'waxing',
    title: 'Rica Italian Waxing (Full Arms & Legs)',
    brand: 'Rica Italy',
    price: 699,
    originalPrice: 1100,
    durationMinutes: 45,
    image: '/images/salonline_hero_luxury_1792923326581.jpg',
    highlight: 'Colophony-free & painless strip'
  },
  {
    id: 'b-wax-2',
    category: 'waxing',
    title: 'Honey Waxing (Full Arms + Underarms)',
    brand: 'Beautiva Pure',
    price: 399,
    originalPrice: 650,
    durationMinutes: 30,
    image: '/images/salonline_hero_luxury_1792923326581.jpg',
    highlight: 'Gentle on sensitive skin'
  },

  // Hair Spa & Nails Addons
  {
    id: 'b-addon-1',
    category: 'addon',
    title: 'L’Oréal Deep Conditioning Hair Spa',
    brand: 'L’Oréal Professionnel',
    price: 799,
    originalPrice: 1300,
    durationMinutes: 50,
    image: '/images/salonline_hair_spa_1792923327617.jpg',
    highlight: 'Steam cap + scalp reflexology'
  },
  {
    id: 'b-addon-2',
    category: 'addon',
    title: 'SARA Green Apple Manicure & Pedicure',
    brand: 'SARA Soul of Beauty',
    price: 649,
    originalPrice: 1050,
    durationMinutes: 55,
    image: '/images/salonline_facial_skincare_1792923326387.jpg',
    highlight: 'Disposable foot tub liner included'
  }
];

export const CustomPackageBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [selectedFacial, setSelectedFacial] = useState<BuilderOption | null>(BUILDER_ITEMS[0]);
  const [selectedWaxing, setSelectedWaxing] = useState<BuilderOption | null>(BUILDER_ITEMS[3]);
  const [selectedAddon, setSelectedAddon] = useState<BuilderOption | null>(null);

  // Compute selected items array
  const selectedItems = [selectedFacial, selectedWaxing, selectedAddon].filter(Boolean) as BuilderOption[];
  const itemCount = selectedItems.length;

  const basePrice = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const baseOriginalPrice = selectedItems.reduce((acc, item) => acc + item.originalPrice, 0);
  const totalMinutes = selectedItems.reduce((acc, item) => acc + item.durationMinutes, 0);

  // Multi-item combo discounts (Salonline dynamic bundle rewards)
  let bundleDiscountPercent = 0;
  if (itemCount === 2) bundleDiscountPercent = 10;
  if (itemCount >= 3) bundleDiscountPercent = 20;

  const bundleDiscountAmount = Math.round((basePrice * bundleDiscountPercent) / 100);
  const finalPrice = basePrice - bundleDiscountAmount;
  const totalSavings = baseOriginalPrice - finalPrice;

  const handleAddBundleToCart = () => {
    if (selectedItems.length === 0) return;

    // Dispatch each item into cart
    selectedItems.forEach((item) => {
      const mockProduct: Product = {
        id: item.id,
        title: item.title,
        slug: item.id,
        brand: item.brand,
        category: item.category === 'facial' ? 'Facial & Skincare' : item.category === 'waxing' ? 'Waxing & Grooming' : 'Hair & Nails',
        categoryId: item.category === 'facial' ? 'facials-skincare' : item.category === 'waxing' ? 'waxing-grooming' : 'hair-services',
        price: bundleDiscountPercent > 0 ? Math.round(item.price * (1 - bundleDiscountPercent / 100)) : item.price,
        originalPrice: item.originalPrice,
        discountPercent: Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100),
        durationMinutes: item.durationMinutes,
        badge: 'Custom Combo',
        shortDescription: item.highlight,
        description: `${item.title} as part of your custom-crafted at-home salon bundle.`,
        image: item.image,
        inclusions: [item.highlight, 'Sterilized disposable tools', 'Single-use sealed kit'],
        safetyProtocol: ['Single-use kit unsealed before client', '100% genuine brand packaging'],
        isPackage: true
      };

      dispatch(addToCart({ product: mockProduct }));
    });

    dispatch(openCartDrawer());
    showToast(`Added your custom ${itemCount}-service package to cart (Saved ${formatCurrency(totalSavings)})!`);
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Package Crafting</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Roll Your Own Salon Package
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              Mix and match your favorite branded services. Add 2 services for 10% off, or 3+ services for 20% combo savings!
            </p>
          </div>

          {/* Bundle Discount Tier Banner */}
          <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs">
            <span className="font-bold text-stone-800">Combo Discount:</span>
            <span className={`px-2 py-0.5 rounded font-mono font-bold ${
              itemCount >= 3 ? 'bg-emerald-600 text-white' : itemCount === 2 ? 'bg-[#601A24] text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              {bundleDiscountPercent}% OFF
            </span>
            {itemCount < 3 && (
              <span className="text-stone-500 hidden sm:inline">
                (Add {3 - itemCount} more to get 20% off!)
              </span>
            )}
          </div>
        </div>

        {/* 3-Column Interactive Step Selector + Live Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Selection Columns (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Select Facial */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#601A24] text-white text-[11px] flex items-center justify-center font-mono">1</span>
                  <span>Choose Your Facial / Clean-up</span>
                </span>
                {selectedFacial && (
                  <button
                    type="button"
                    onClick={() => setSelectedFacial(null)}
                    className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BUILDER_ITEMS.filter((i) => i.category === 'facial').map((item) => {
                  const isSelected = selectedFacial?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedFacial(isSelected ? null : item)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#601A24] bg-rose-50/40 ring-1 ring-[#601A24] shadow-xs'
                          : 'border-stone-200 bg-[#FAF8F5] hover:bg-stone-50 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1">
                          <span>{item.brand}</span>
                          <span className="font-mono text-stone-400">{item.durationMinutes}m</span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                          {item.highlight}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-stone-200/60">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="font-mono text-[11px] text-stone-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Waxing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#601A24] text-white text-[11px] flex items-center justify-center font-mono">2</span>
                  <span>Choose Your Waxing Service</span>
                </span>
                {selectedWaxing && (
                  <button
                    type="button"
                    onClick={() => setSelectedWaxing(null)}
                    className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUILDER_ITEMS.filter((i) => i.category === 'waxing').map((item) => {
                  const isSelected = selectedWaxing?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedWaxing(isSelected ? null : item)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#601A24] bg-rose-50/40 ring-1 ring-[#601A24] shadow-xs'
                          : 'border-stone-200 bg-[#FAF8F5] hover:bg-stone-50 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1">
                          <span>{item.brand}</span>
                          <span className="font-mono text-stone-400">{item.durationMinutes}m</span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                          {item.highlight}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-stone-200/60">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="font-mono text-[11px] text-stone-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add Hair Spa or Mani-Pedi */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#601A24] text-white text-[11px] flex items-center justify-center font-mono">3</span>
                  <span>Add Hair Spa or Mani-Pedi (Unlocks 20% OFF!)</span>
                </span>
                {selectedAddon && (
                  <button
                    type="button"
                    onClick={() => setSelectedAddon(null)}
                    className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUILDER_ITEMS.filter((i) => i.category === 'addon').map((item) => {
                  const isSelected = selectedAddon?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedAddon(isSelected ? null : item)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#601A24] bg-rose-50/40 ring-1 ring-[#601A24] shadow-xs'
                          : 'border-stone-200 bg-[#FAF8F5] hover:bg-stone-50 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1">
                          <span>{item.brand}</span>
                          <span className="font-mono text-stone-400">{item.durationMinutes}m</span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                          {item.highlight}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-stone-200/60">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="font-mono text-[11px] text-stone-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Live Package Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm sticky top-24 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Custom Package Summary
              </span>
              <h3 className="text-base font-bold text-stone-900 mt-0.5">
                {itemCount} Service{itemCount === 1 ? '' : 's'} Selected
              </h3>
            </div>

            {/* List of picked services */}
            <div className="space-y-2 border-t border-b border-stone-200 py-3">
              {selectedItems.length === 0 ? (
                <p className="text-xs text-stone-400 italic text-center py-4">
                  Please select at least 1 treatment to preview your combo
                </p>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="truncate max-w-[180px]">
                      <span className="font-semibold text-stone-800 block truncate">{item.title}</span>
                      <span className="text-[10px] text-stone-400">{item.durationMinutes} mins · {item.brand}</span>
                    </div>
                    <span className="font-mono font-semibold text-stone-900 tabular-nums">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Live Calculation */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal MRP:</span>
                <span className="font-mono line-through text-stone-400 tabular-nums">
                  {formatCurrency(baseOriginalPrice)}
                </span>
              </div>

              {bundleDiscountPercent > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Combo Discount ({bundleDiscountPercent}%):</span>
                  <span className="font-mono tabular-nums">
                    -{formatCurrency(bundleDiscountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Session Time:</span>
                <span className="font-mono text-stone-900 font-semibold">
                  {totalMinutes} Minutes
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Safety Disposables Kit:</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Total Bundle Price:</span>
                <span className="font-mono text-2xl font-bold text-[#601A24] tabular-nums">
                  {formatCurrency(finalPrice)}
                </span>
              </div>
            </div>

            {/* Savings Callout */}
            {totalSavings > 0 && (
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 font-medium text-center">
                🎉 You are saving <strong>{formatCurrency(totalSavings)}</strong> on this tailored bundle!
              </div>
            )}

            <button
              type="button"
              onClick={handleAddBundleToCart}
              disabled={selectedItems.length === 0}
              className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                selectedItems.length > 0
                  ? 'bg-[#601A24] text-white hover:bg-[#4a121a]'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Book This Custom Combo</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
