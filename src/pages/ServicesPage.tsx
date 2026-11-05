import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Filter, 
  ChevronRight, 
  Search, 
  X, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { brands } from '../data/brands';
import { ProductCard } from '../components/products/ProductCard';
import { SEO } from '../components/common/SEO';

export const ServicesPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category?: string }>();

  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find((c) => c.slug === categorySlug || c.id === categorySlug);
  }, [categorySlug]);

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'discount'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (categorySlug) {
      list = list.filter(
        (p) => p.categoryId === categorySlug || p.category.toLowerCase().includes(categorySlug.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    }

    return list;
  }, [categorySlug, selectedBrand, searchQuery, sortBy]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title={currentCategory ? `${currentCategory.name} Services at Home` : 'At-Home Salon Packages & Beauty Services'}
        description={
          currentCategory
            ? currentCategory.description
            : 'Explore verified facial, waxing, manicure, haircut, and bridal packages with single-use sealed kits delivered to your doorstep in Lucknow and Patna.'
        }
        canonical={currentCategory ? `https://salonline.in/services/${currentCategory.slug}` : 'https://salonline.in/services'}
        keywords={currentCategory ? `${currentCategory.name.toLowerCase()} at home, ${currentCategory.name.toLowerCase()} salon service, home beauty parlour` : 'salon at home, waxing at home, facial at home, manicure pedicure home service'}
        schema={{
          '@type': 'CollectionPage',
          name: currentCategory ? `${currentCategory.name} - Salonline` : 'All Salon Services - Salonline',
          description: currentCategory ? currentCategory.description : 'Explore verified doorstep salon services and packages.',
          url: currentCategory ? `https://salonline.in/services/${currentCategory.slug}` : 'https://salonline.in/services',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: filteredProducts.slice(0, 10).map((p, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: p.title,
              url: `https://salonline.in/package/${p.slug || p.id}`,
            })),
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/services" className={!categorySlug ? 'font-semibold text-stone-900' : 'hover:text-stone-900'}>
            Services & Packages
          </Link>
          {currentCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-stone-900">{currentCategory.name}</span>
            </>
          )}
        </nav>

        {/* Heading Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-stone-900">
            {currentCategory ? currentCategory.name : 'All Salon Services & Packages'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
            {currentCategory
              ? currentCategory.description
              : 'Browse our complete catalog of certified doorstep beauty treatments, herbal skincare, hair nourishment, and occasion styling.'}
          </p>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <Link
            to="/services"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              !categorySlug
                ? 'bg-[#601A24] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Disciplines
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/services/${c.slug}`}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categorySlug === c.slug
                  ? 'bg-[#601A24] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, active ingredient..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-[#601A24]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Brand Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden md:inline">Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#601A24]"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#601A24]"
              >
                <option value="recommended">Featured / Popular</option>
                <option value="discount">Highest Discount</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filters */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-stone-600 font-mono">
            Showing {filteredProducts.length} treatments
          </p>
          {(selectedBrand !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#601A24] hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <h3 className="font-semibold text-stone-800 text-base">No services found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your search terms or clearing selected brand filters.
            </p>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
