import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeCartDrawer, updateQuantity, removeFromCart } from '../../store/features/cart/cartSlice';
import { formatCurrency } from '../../lib/currency';

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isDrawerOpen } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity,
    0
  );

  const totalOriginal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const totalSavings = totalOriginal > subtotal ? totalOriginal - subtotal : 0;

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate('/checkout');
  };

  const handleViewCart = () => {
    dispatch(closeCartDrawer());
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(closeCartDrawer())}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#601A24]" />
                  <h2 className="font-semibold text-stone-900 text-lg">Your Service Cart</h2>
                  <span className="text-xs text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded font-mono">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} items
                  </span>
                </div>
                <button
                  onClick={() => dispatch(closeCartDrawer())}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/50 transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-stone-800 text-base">Your cart is empty</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-xs">
                      Explore our verified beauty packages and parlour services at home.
                    </p>
                    <button
                      onClick={() => {
                        dispatch(closeCartDrawer());
                        navigate('/services');
                      }}
                      className="mt-6 px-5 py-2.5 bg-[#601A24] text-white text-sm font-medium rounded-lg hover:bg-[#4a121a] transition-colors"
                    >
                      Browse Salon Packages
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const price = item.product.price + (item.selectedOption?.priceDelta || 0);
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedOption?.id || 'base'}`}
                        className="flex gap-3 pb-4 border-b border-stone-100"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-18 h-18 rounded-lg object-cover bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-medium tracking-wide text-stone-500 uppercase">
                                {item.product.brand}
                              </span>
                              <h4 className="text-sm font-semibold text-stone-900 truncate">
                                {item.product.title}
                              </h4>
                            </div>
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
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {item.selectedOption && (
                            <p className="text-xs text-[#601A24] font-medium mt-0.5">
                              Variant: {item.selectedOption.name}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50">
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
                                className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 py-0.5 text-xs font-semibold text-stone-800 font-mono">
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
                                className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-semibold text-stone-900 font-mono">
                                {formatCurrency(price * item.quantity)}
                              </span>
                              {item.product.originalPrice > item.product.price && (
                                <span className="block text-[11px] text-stone-400 line-through font-mono">
                                  {formatCurrency(item.product.originalPrice * item.quantity)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-stone-200 bg-[#FAF8F5] space-y-3">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Service Subtotal</span>
                      <span className="font-mono text-stone-800 font-semibold">{formatCurrency(subtotal)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Total Package Savings</span>
                        <span className="font-mono font-medium">- {formatCurrency(totalSavings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-500">
                      <span>Doorstep Safety Kit & Travel</span>
                      <span className="font-mono text-emerald-700 font-medium">FREE</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200/70 flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-stone-900">Total Payable</span>
                    <span className="text-lg font-bold text-[#601A24] font-mono">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={handleViewCart}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-center"
                    >
                      View Cart Full
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-[#601A24] rounded-lg hover:bg-[#4a121a] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Book Slot <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
