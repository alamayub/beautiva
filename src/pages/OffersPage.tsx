import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, Tag } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { SEO } from '../components/common/SEO';

export const OffersPage: React.FC = () => {
  // Filter products with high discounts (>= 38%)
  const discountedProducts = products
    .filter((p) => p.discountPercent >= 38)
    .sort((a, b) => b.discountPercent - a.discountPercent);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title="Beauty Offers, Salon Discounts & Festive Deals"
        description="Save up to 43% on doorstep beauty services, bridal glow packages, VLCC facials, and waxing combos in Lucknow, Patna, and Kanpur. Free safety kits."
        canonical="https://beautiva.in/offers"
        keywords="salon offers, beauty parlour discount, facial deals, bridal package offer, Lucknow parlour deals"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Special Offers & Deals</span>
        </nav>

        <div className="bg-gradient-to-r from-[#601A24] to-[#401218] text-white rounded-2xl p-6 sm:p-10 mb-10 shadow-md">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-rose-200">
              <Sparkles className="w-3.5 h-3.5 text-[#D47A83]" />
              <span>Verified Package Discounts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-white">
              Festive & Bundled Beauty Offers
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Enjoy verified savings up to 43% on authentic VLCC facials, Rica full body waxing, and hair spas. All prices include single-use safety kits and beautician travel.
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            High Discount Packages ({discountedProducts.length})
          </h2>
          <span className="text-xs font-mono text-stone-500">
            Up to 43% OFF verified retail rates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
