import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Package, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import { Link } from 'react-router-dom';

export const TransparencyCalculator: React.FC = () => {
  // Mode: 'sealed_kit' (We bring sealed kit) vs 'own_product' (User provides product)
  const [productMode, setProductMode] = useState<'sealed_kit' | 'own_product'>('sealed_kit');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [selectedDiscipline, setSelectedDiscipline] = useState<'facial' | 'waxing' | 'hair'>('facial');

  // Rate per minute for beautician labor = ₹6/min
  const laborRatePerMin = 6;
  const serviceCharge = durationMinutes * laborRatePerMin;

  // Branded sealed product cost based on service
  const productCostMap = {
    facial: 599, // Lotus / VLCC Herbal Sealed Kit
    waxing: 399, // Rica Cartridge + Pre/Post Wax Gel
    hair: 499,   // L'Oréal Deep Conditioning Mono-dose
  };

  const productCost = productMode === 'sealed_kit' ? productCostMap[selectedDiscipline] : 0;
  const disposablesCost = 0; // 100% Free / Included
  const totalBeautivaCost = serviceCharge + productCost + disposablesCost;

  // Typical offline salon price for the same duration & service
  const offlineSalonCostMap = {
    facial: durationMinutes >= 90 ? 2800 : durationMinutes >= 60 ? 1950 : 1200,
    waxing: durationMinutes >= 90 ? 2200 : durationMinutes >= 60 ? 1500 : 900,
    hair: durationMinutes >= 90 ? 2400 : durationMinutes >= 60 ? 1650 : 1100,
  };
  const offlineCost = offlineSalonCostMap[selectedDiscipline];
  const totalSavings = Math.max(0, offlineCost - totalBeautivaCost);
  const savingsPercent = Math.round((totalSavings / offlineCost) * 100);

  return (
    <section className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
            The Beautiva Freedom Model
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
            100% Transparent Per-Minute Pricing
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Choose whether we bring sealed mono-dose kits or use your own cosmetics. You only pay for exact service time with zero hidden parlor markups.
          </p>
        </div>

        {/* Interactive Calculator Surface */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden max-w-4xl mx-auto">
          
          {/* Top Toggle Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-50 to-white border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Step 1: Product Preference
              </span>
              <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                Do you want our sealed branded kits or have your own?
              </span>
            </div>

            {/* Segmented Button Control */}
            <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200/80 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setProductMode('sealed_kit')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  productMode === 'sealed_kit'
                    ? 'bg-[#601A24] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Use Beautiva Sealed Kit
              </button>
              <button
                type="button"
                onClick={() => setProductMode('own_product')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  productMode === 'own_product'
                    ? 'bg-[#601A24] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Use My Own Product (₹6/min)
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Discipline Switcher */}
              <div>
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">
                  Select Treatment Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'facial', label: 'Facial & Skincare', icon: '💆‍♀️' },
                    { id: 'waxing', label: 'Rica Waxing', icon: '🍯' },
                    { id: 'hair', label: 'Hair Spa / Therapy', icon: '🧖‍♀️' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDiscipline(d.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedDiscipline === d.id
                          ? 'border-[#601A24] bg-rose-50/50 text-[#601A24] ring-1 ring-[#601A24]'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-lg mb-1">{d.icon}</span>
                      <span className="truncate">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-600 uppercase tracking-wider">
                    Service Duration:
                  </span>
                  <span className="font-mono font-bold text-stone-900 text-sm bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200/80">
                    {durationMinutes} Minutes (@ ₹6/min)
                  </span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="120"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-[#601A24] cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
                />

                <div className="flex justify-between text-[11px] font-mono text-stone-400">
                  <span>30m (Quick)</span>
                  <span>60m (Standard)</span>
                  <span>90m (Deluxe)</span>
                  <span>120m (Full)</span>
                </div>
              </div>

              {/* Transparency Promise Pills */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-stone-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-stone-700 font-medium">Free Disposable Sheet & Spatulas</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-stone-200/60">
                  <UserCheck className="w-4 h-4 text-[#601A24] shrink-0" />
                  <span className="text-stone-700 font-medium">Verified Women Cosmetologist</span>
                </div>
              </div>
            </div>

            {/* Right Live Itemized Bill Card */}
            <div className="lg:col-span-5 bg-[#FAF8F5] rounded-xl p-5 sm:p-6 border border-stone-200/90 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Transparent Bill Breakdown
                </span>

                <div className="space-y-2.5 mt-3 text-xs">
                  <div className="flex justify-between items-center text-stone-700">
                    <span>Beautician Labor ({durationMinutes} mins @ ₹6/min)</span>
                    <span className="font-mono font-semibold text-stone-900 tabular-nums">
                      {formatCurrency(serviceCharge)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-stone-700">
                    <span>
                      {productMode === 'sealed_kit' ? 'Sealed Branded Mono-Dose Kit' : 'Client Products Provided'}
                    </span>
                    <span className="font-mono font-semibold text-stone-900 tabular-nums">
                      {productMode === 'sealed_kit' ? formatCurrency(productCost) : '₹0'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-stone-700">
                    <span>Disposables & Sanitization Kit</span>
                    <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                      FREE (₹0)
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-stone-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Total You Pay:</span>
                      <span className="text-[10px] text-stone-400">All taxes included</span>
                    </div>
                    <span className="font-mono text-2xl font-bold text-[#601A24] tabular-nums">
                      {formatCurrency(totalBeautivaCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison vs Offline Parlor */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Offline Salon Estimate:</span>
                  <span className="font-mono line-through text-stone-400">{formatCurrency(offlineCost)}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span>You Save With Beautiva:</span>
                  <span className="font-mono tabular-nums">{formatCurrency(totalSavings)} ({savingsPercent}%)</span>
                </div>
              </div>

              <Link
                to="/services"
                className="w-full py-2.5 px-4 bg-[#601A24] hover:bg-[#4a121a] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Browse & Book Treatments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
