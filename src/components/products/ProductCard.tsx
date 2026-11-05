import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Clock, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart, updateQuantity } from '../../store/features/cart/cartSlice';
import { toggleWishlist } from '../../store/features/wishlist/wishlistSlice';
import { useToast } from '../common/ToastProvider';
import { formatCurrency } from '../../lib/currency';
import { formatDuration } from '../../lib/duration';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const cartItem = cartItems.find((i) => i.product.id === product.id);
  const isInWishlist = wishlistItems.some((i) => i.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product }));
    showToast(`Added ${product.title} (${formatDuration(product.durationMinutes)}) to booking`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (isInWishlist) {
      showToast(`Removed from wishlist`, 'info');
    } else {
      showToast(`Saved to wishlist`);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <Link to={`/package/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors backdrop-blur-xs ${
            isInWishlist
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Single subtle badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900/85 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded backdrop-blur-xs">
            {product.badge}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata clean line without pills */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-stone-600 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{product.durationMinutes} mins</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/package/${product.slug}`}>
            <h3 className="font-semibold text-stone-900 text-base leading-snug hover:text-[#601A24] transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Bottom Price & Add Action */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs font-semibold text-[#601A24] font-mono">
                · {formatDuration(product.durationMinutes)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discountPercent > 0 && (
              <span className="text-[11px] font-semibold text-emerald-700">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Cart Stepper or Add Button */}
          {cartItem ? (
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    updateQuantity({
                      productId: product.id,
                      quantity: cartItem.quantity - 1,
                    })
                  );
                }}
                className="px-2.5 py-1.5 text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 py-1 text-xs font-bold text-stone-900 font-mono">
                {cartItem.quantity}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    updateQuantity({
                      productId: product.id,
                      quantity: cartItem.quantity + 1,
                    })
                  );
                }}
                className="px-2.5 py-1.5 text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#601A24] bg-stone-100 hover:bg-[#601A24] hover:text-white rounded-lg transition-colors border border-stone-200 shrink-0"
            >
              Add Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
