import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../products/ProductCard';

export const FeaturedPackages: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'facials' | 'hair' | 'body'>('all');

  const filteredProducts = products.filter((p) => {
    if (!p.isPackage && selectedFilter === 'all') return false; // Show only curated packages here
    if (selectedFilter === 'facials') return p.categoryId === 'facials-skincare';
    if (selectedFilter === 'hair') return p.categoryId === 'hair-services';
    if (selectedFilter === 'body') return p.categoryId === 'waxing-grooming' || p.categoryId === 'bridal-packages';
    return true;
  }).slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
              Handcrafted Combos
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Curated Salon Packages
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Save up to 43% with authentic multi-service bundles from VLCC, Lotus, SARA, and O3+.
            </p>
          </div>

          {/* Interactive Filter Tabs (Zero-Pill compliant segmented button controls) */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setSelectedFilter('facials')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedFilter === 'facials'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Facials
            </button>
            <button
              onClick={() => setSelectedFilter('hair')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedFilter === 'hair'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hair Spa
            </button>
            <button
              onClick={() => setSelectedFilter('body')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedFilter === 'body'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Full Body & Rica
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-800 text-sm font-semibold rounded-lg hover:bg-stone-50 transition-colors border border-stone-300 shadow-xs"
          >
            <span>Explore All {products.length} Treatments & Combos</span>
            <ArrowRight className="w-4 h-4 text-[#601A24]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
