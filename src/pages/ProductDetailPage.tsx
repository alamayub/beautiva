import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus, 
  Share2,
  ArrowRight
} from 'lucide-react';
import { products } from '../data/products';
import { ServiceOption } from '../types/product';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, updateQuantity, openCartDrawer } from '../store/features/cart/cartSlice';
import { toggleWishlist } from '../store/features/wishlist/wishlistSlice';
import { useToast } from '../components/common/ToastProvider';
import { formatCurrency } from '../lib/currency';
import { ProductCard } from '../components/products/ProductCard';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { SEO } from '../components/common/SEO';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const product = useMemo(() => {
    return products.find((p) => p.slug === slug || p.id === slug);
  }, [slug]);

  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [selectedOption, setSelectedOption] = useState<ServiceOption | undefined>(
    product?.options?.[0]
  );

  const isInWishlist = product ? wishlistItems.some((i) => i.id === product.id) : false;
  const cartItem = product
    ? cartItems.find(
        (i) =>
          i.product.id === product.id &&
          (i.selectedOption?.id === selectedOption?.id || (!i.selectedOption && !selectedOption))
      )
    : undefined;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F5]">
        <h2 className="font-editorial text-2xl font-bold text-stone-900">Service Not Found</h2>
        <p className="text-sm text-stone-500 mt-2">The requested package or service could not be located.</p>
        <Link
          to="/services"
          className="mt-4 px-5 py-2.5 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a]"
        >
          Browse All Services
        </Link>
      </div>
    );
  }

  const currentPrice = product.price + (selectedOption?.priceDelta || 0);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, option: selectedOption }));
    showToast(`Added ${product.title} to your cart`);
  };

  const handleBookNow = () => {
    dispatch(addToCart({ product, option: selectedOption }));
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    dispatch(toggleWishlist(product));
    if (isInWishlist) {
      showToast('Removed from wishlist', 'info');
    } else {
      showToast('Saved to wishlist');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Service link copied to clipboard');
    }
  };

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title={`${product.title} - Doorstep Salon Service`}
        description={`${product.title} at home by certified Salonline beauticians. Price: ₹${currentPrice}. 100% sealed mono-dose kits & hospital-sterilized tools.`}
        image={product.image}
        canonical={`https://salonline.in/package/${product.slug || product.id}`}
        type="product"
        schema={{
          '@type': 'Product',
          name: product.title,
          image: product.image,
          description: product.description,
          category: product.category,
          brand: {
            '@type': 'Brand',
            name: product.brand,
          },
          offers: {
            '@type': 'Offer',
            price: currentPrice,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: `https://salonline.in/package/${product.slug || product.id}`,
            priceValidUntil: '2026-12-31',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '348',
            bestRating: '5',
            worstRating: '1',
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/services" className="hover:text-stone-900 transition-colors">Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/services/${product.categoryId}`} className="hover:text-stone-900 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900 truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* 2-Column Split: Sticky Gallery Left, Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left Gallery & Inclusions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded backdrop-blur-xs">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Inclusions Card */}
            <div className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                What’s Included in This Service
              </h3>
              <div className="space-y-2.5">
                {product.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <Check className="w-4 h-4 text-[#601A24] shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hygiene Protocol */}
            <div className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Salonline Doorstep Hygiene Protocols
                </h3>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-stone-600">
                {product.safetyProtocol.map((sp, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span>{sp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors rounded-lg"
                      aria-label="Share package"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isInWishlist ? 'text-rose-600 bg-rose-50' : 'text-stone-400 hover:text-stone-700'
                      }`}
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-editorial font-bold text-stone-900 leading-snug">
                  {product.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-stone-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{product.durationMinutes} Minutes</span>
                  </div>
                  <span>·</span>
                  <span>{product.category}</span>
                  {product.skinType && (
                    <>
                      <span>·</span>
                      <span>{product.skinType}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-stone-900 font-mono">
                      {formatCurrency(currentPrice)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-stone-400 line-through font-mono">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                    Save {product.discountPercent}% ({formatCurrency(product.originalPrice - currentPrice)} off)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Taxes & Kit Fee</span>
                  <span className="text-xs font-semibold text-emerald-700">INCLUDED</span>
                </div>
              </div>

              {/* Variants / Options if available */}
              {product.options && product.options.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-stone-800 block">
                    Select Formulation or Upgrade
                  </span>
                  <div className="space-y-2">
                    {product.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          selectedOption?.id === opt.id
                            ? 'border-[#601A24] bg-stone-50 text-stone-900 font-semibold ring-1 ring-[#601A24]'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="font-mono text-stone-600">
                          {opt.priceDelta > 0 ? `+${formatCurrency(opt.priceDelta)}` : 'Included'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2 border-t border-stone-100 pt-4">
                <span className="text-xs font-semibold text-stone-800 block">About This Package</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Primary Actions */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                {cartItem ? (
                  <div className="flex items-center justify-between p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-xs font-medium text-stone-700">Quantity in Cart:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product.id,
                              optionId: selectedOption?.id,
                              quantity: cartItem.quantity - 1,
                            })
                          )
                        }
                        className="p-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold text-stone-900 w-6 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: product.id,
                              optionId: selectedOption?.id,
                              quantity: cartItem.quantity + 1,
                            })
                          )
                        }
                        className="p-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-lg border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="py-3 px-4 rounded-lg bg-[#601A24] text-white text-xs font-semibold hover:bg-[#4a121a] transition-colors shadow-xs cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>

                <WhatsAppButton
                  variant="inline"
                  label="Book / Inquire via WhatsApp"
                  message={`Hello Salonline! I am looking to book "${product.title}" (${formatCurrency(currentPrice)}) for home service. Please share available slots.`}
                  className="w-full text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-stone-200">
            <h2 className="text-xl font-editorial font-bold text-stone-900 mb-6">
              You May Also Like in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
