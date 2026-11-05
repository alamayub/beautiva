import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../products/ProductCard';

export const OccasionMakeupSection: React.FC = () => {
  const occasionItems = products.filter(
    (p) => p.categoryId === 'makeup-styling' || p.categoryId === 'hair-services'
  ).slice(0, 4);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          <div className="lg:col-span-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
              Artistry & Celebrations
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Occasion, Party & Bridal Makeup
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
              Step into your spotlight with certified artists specializing in HD makeup, bridal styling, saree draping, and professional hair transformations.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link
              to="/services/makeup-styling"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#601A24] hover:underline"
            >
              <span>Explore All Makeup Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Split Banner + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Spotlight Hero Card */}
          <div className="lg:col-span-4 rounded-2xl bg-[#3B151A] text-stone-100 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D47A83]">
                Bridal Studio At Home
              </span>
              <h3 className="text-2xl font-editorial font-bold text-white leading-tight">
                Flawless HD & Airbrush Artistry
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Enjoy pre-bridal skin consultations, sanitized brush kits, and 18-hour sweatproof glam without the stress of traveling to crowded parlors on your wedding day.
              </p>

              <div className="space-y-2 pt-2 text-xs text-stone-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D47A83] shrink-0" />
                  <span>3D HD / Airbrush Foundation Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D47A83] shrink-0" />
                  <span>Dupatta & Saree Precision Draping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D47A83] shrink-0" />
                  <span>Floral Updos, Tongs & Ironing</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                to="/package/bridal-makeup"
                className="w-full py-2.5 px-4 bg-white text-[#3B151A] hover:bg-stone-100 font-semibold text-xs rounded-lg transition-colors block text-center shadow-xs"
              >
                View Bridal Package Details
              </Link>
            </div>
          </div>

          {/* Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {occasionItems.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
