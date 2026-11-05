import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearWishlist } from '../store/features/wishlist/wishlistSlice';
import { addToCart } from '../store/features/cart/cartSlice';
import { useToast } from '../components/common/ToastProvider';
import { ProductCard } from '../components/products/ProductCard';

export const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items } = useAppSelector((state) => state.wishlist);

  const handleAddAllToCart = () => {
    items.forEach((p) => {
      dispatch(addToCart({ product: p }));
    });
    showToast(`Added ${items.length} items to your cart`);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Saved Wishlist</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
              My Saved Services ({items.length})
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Keep track of packages you wish to book for future occasions.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(clearWishlist())}
                className="text-xs text-stone-500 hover:text-rose-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleAddAllToCart}
                className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-xs"
              >
                Add All to Cart
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-semibold text-stone-800 text-base">Your wishlist is empty</h3>
            <p className="text-xs text-stone-500 mt-1">
              Tap the heart icon on any package to save it for quick booking later.
            </p>
            <Link
              to="/services"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors"
            >
              <span>Explore Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
