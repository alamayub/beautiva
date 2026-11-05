import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '../../data/brands';

export const BrandShowcase: React.FC = () => {
  return (
    <section className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
              Authentic Partnerships
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Shop by Trusted Brands
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              We never use unbranded cosmetics. Only 100% sealed, mono-dose factory packs from certified beauty houses.
            </p>
          </div>
          <Link
            to="/brands"
            className="text-xs sm:text-sm font-semibold text-[#601A24] hover:text-[#4a121a] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Brand Partners</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group p-5 bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-editorial text-lg font-bold text-stone-900 group-hover:text-[#601A24] transition-colors">
                    {brand.name}
                  </h3>
                  {brand.badge && (
                    <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      {brand.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#601A24] font-medium mb-2">{brand.tagline}</p>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span className="font-mono">{brand.productCount} Services</span>
                <span className="font-medium text-[#601A24] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Browse <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
