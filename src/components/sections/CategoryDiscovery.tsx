import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';

export const CategoryDiscovery: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
              Service Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Explore Services & Treatments
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select a specialized beauty discipline to discover targeted packages and treatments.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs sm:text-sm font-semibold text-[#601A24] hover:text-[#4a121a] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/services/${cat.slug}`}
              className="group flex flex-col bg-[#FAF8F5] rounded-xl p-3 border border-stone-200/80 hover:border-[#601A24]/40 hover:bg-stone-50 hover:shadow-xs transition-all text-center"
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-200 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-stone-900 group-hover:text-[#601A24] transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-500 mt-1 font-mono">
                {cat.itemCount} services
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
