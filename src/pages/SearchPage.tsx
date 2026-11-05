import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, X } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localInput, setLocalInput] = useState(query);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.inclusions.some((i) => i.toLowerCase().includes(q))
    );
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      setSearchParams({ q: localInput.trim() });
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Search Results</span>
        </nav>

        {/* Search Bar */}
        <div className="max-w-2xl mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Search VLCC, Lotus, Facials, Hair Spa, Rica Wax..."
              className="w-full bg-white border border-stone-300 rounded-xl pl-11 pr-24 py-3 text-sm focus:outline-none focus:border-[#601A24] shadow-xs"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1.5 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-editorial font-bold text-stone-900">
            {query ? `Search results for "${query}"` : 'All Services Search'}
          </h1>
          <span className="text-xs font-mono text-stone-500">
            {results.length} treatments matched
          </span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <h3 className="font-semibold text-stone-800 text-base">No services found for "{query}"</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try searching for "VLCC", "Lotus WhiteGlow", "Bridal", "Facial", or "Hair Spa".
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['VLCC', 'Lotus', 'O3+', 'Hair Spa', 'Waxing'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setLocalInput(term);
                    setSearchParams({ q: term });
                  }}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
