import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuantity, removeFromCart, clearCart } from '../store/features/cart/cartSlice';
import { formatCurrency } from '../lib/currency';
import { formatDuration } from '../lib/duration';

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity,
    0
  );

  const totalOriginal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const totalSavings = totalOriginal > subtotal ? totalOriginal - subtotal : 0;
  const totalDuration = items.reduce((sum, item) => sum + item.product.durationMinutes * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-editorial font-bold text-stone-900">No Services Selected</h1>
          <p className="text-xs text-stone-500 mt-2 max-w-xs mx-auto leading-relaxed">
            You haven’t selected any salon services yet. Browse our curated treatments from VLCC, Lotus, and O3+.
          </p>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors"
          >
            <span>Explore Salon Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Selected Services</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
              Selected Services & Duration
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Review your selected at-home salon services and total session time before picking a slot.
            </p>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs text-stone-500 hover:text-rose-600 transition-colors font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Services</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>{items.length} Service{items.length > 1 ? 's' : ''} Selected</span>
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <Clock className="w-3.5 h-3.5 text-[#601A24]" />
                <span>Total Session Time: <strong className="font-mono text-[#601A24]">{formatDuration(totalDuration)}</strong></span>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {items.map((item) => {
                const itemPrice = item.product.price + (item.selectedOption?.priceDelta || 0);
                return (
                  <div
                    key={`${item.product.id}-${item.selectedOption?.id || 'base'}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-stone-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          {item.product.brand}
                        </span>
                        <Link to={`/package/${item.product.slug}`}>
                          <h3 className="text-sm font-semibold text-stone-900 hover:text-[#601A24] transition-colors truncate">
                            {item.product.title}
                          </h3>
                        </Link>
                        {item.selectedOption && (
                          <p className="text-xs text-[#601A24] font-medium mt-0.5">
                            Selection: {item.selectedOption.name}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                          <span>{item.product.durationMinutes} mins</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-medium">Single-use sealed kit</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product.id,
                                optionId: item.selectedOption?.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold text-stone-900 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product.id,
                                optionId: item.selectedOption?.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price Column */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-sm font-bold text-stone-900 font-mono block">
                          {formatCurrency(itemPrice * item.quantity)}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="text-xs text-stone-400 line-through font-mono">
                            {formatCurrency(item.product.originalPrice * item.quantity)}
                          </span>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: item.product.id,
                              optionId: item.selectedOption?.id,
                            })
                          )
                        }
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Delete item from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-stone-100 flex items-center justify-between">
              <Link
                to="/services"
                className="text-xs font-semibold text-[#601A24] hover:underline"
              >
                ← Continue Adding Treatments
              </Link>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900">Appointment Summary</h2>

            <div className="space-y-2.5 text-xs text-stone-600 pb-4 border-b border-stone-100">
              <div className="flex justify-between">
                <span>Services Total</span>
                <span className="font-mono text-stone-800 font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Bundled Package Savings</span>
                  <span className="font-mono font-semibold">- {formatCurrency(totalSavings)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Sanitized Disposable Travel Kit</span>
                <span className="text-emerald-700 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Beautician Arrival Fee</span>
                <span className="text-emerald-700 font-medium">FREE</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-sm font-bold text-stone-900 block">Total Payable</span>
                <span className="text-[11px] font-mono text-stone-500">
                  Total Time: {formatDuration(totalDuration)}
                </span>
              </div>
              <span className="text-xl font-bold text-[#601A24] font-mono">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-stone-500 leading-normal">
              Pay online, pay a 20% advance, or pay cash/UPI on service completion.
            </p>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Pick Date & Time Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Background-verified female stylist only</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Sparkles className="w-4 h-4 text-[#D47A83] shrink-0" />
                <span>Zero mess guarantee — clean leave-behind</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
