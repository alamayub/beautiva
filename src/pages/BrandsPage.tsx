import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { brands } from '../data/brands';
import { products } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { SEO } from '../components/common/SEO';

export const BrandsPage: React.FC = () => {
  const { brand: brandSlug } = useParams<{ brand?: string }>();

  const currentBrand = useMemo(() => {
    if (!brandSlug) return null;
    return brands.find((b) => b.slug === brandSlug || b.id === brandSlug);
  }, [brandSlug]);

  const brandProducts = useMemo(() => {
    if (!currentBrand) return [];
    return products.filter(
      (p) => p.brand.toLowerCase() === currentBrand.name.toLowerCase()
    );
  }, [currentBrand]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title={currentBrand ? `${currentBrand.name} Salon Services & Sealed Kits` : 'Official Salon Brand Houses - VLCC, Lotus, O3+ & L’Oréal'}
        description={
          currentBrand
            ? currentBrand.description
            : 'Explore genuine mono-dose treatments from India’s top skincare and haircare brand houses, opened exclusively in your presence.'
        }
        canonical={currentBrand ? `https://beautiva.in/brands/${currentBrand.slug}` : 'https://beautiva.in/brands'}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/brands" className={!currentBrand ? 'font-semibold text-stone-900' : 'hover:text-stone-900'}>
            Brand Partners
          </Link>
          {currentBrand && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-stone-900">{currentBrand.name}</span>
            </>
          )}
        </nav>

        {currentBrand ? (
          <div>
            {/* Brand Header Hero */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs mb-10">
              <div className="max-w-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
                    Official Partner Brand
                  </span>
                  {currentBrand.badge && (
                    <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                      {currentBrand.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900">
                  {currentBrand.name}
                </h1>
                <p className="text-sm font-medium text-[#601A24]">{currentBrand.tagline}</p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {currentBrand.description}
                </p>
                <div className="pt-2 text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">Signature Specialties:</span> {currentBrand.specialty}
                </div>
              </div>
            </div>

            {/* Brand Services Grid */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-editorial font-bold text-stone-900">
                {currentBrand.name} Treatments & Kits ({brandProducts.length})
              </h2>
              <Link to="/brands" className="text-xs text-[#601A24] font-semibold hover:underline">
                View Other Brands →
              </Link>
            </div>

            {brandProducts.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-stone-200 text-center">
                <p className="text-sm text-stone-600">No services currently listed for this brand.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {brandProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-10 max-w-2xl">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
                Authentic Brand Portfolio
              </span>
              <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 mt-1">
                Authorized Cosmetic Brands
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Beautiva works exclusively with verified manufacturer partners to deliver genuine single-use sealed kits directly to your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  to={`/brands/${b.slug}`}
                  className="group bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-[#601A24]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-editorial font-bold text-stone-900 group-hover:text-[#601A24] transition-colors">
                        {b.name}
                      </h2>
                      {b.badge && (
                        <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          {b.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#601A24]">{b.tagline}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">{b.description}</p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-mono">{b.productCount} Treatments</span>
                    <span className="font-semibold text-[#601A24] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Explore Brand <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
