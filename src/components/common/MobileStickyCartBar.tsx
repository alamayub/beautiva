import React from 'react';
import { CalendarCheck, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openCartDrawer } from '../../store/features/cart/cartSlice';
import { formatCurrency } from '../../lib/currency';
import { formatDuration } from '../../lib/duration';

export const MobileStickyCartBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);

  if (cartItems.length === 0 || isDrawerOpen) return null;

  const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const totalMinutes = cartItems.reduce(
    (acc, i) => acc + i.product.durationMinutes * i.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-stone-900/95 backdrop-blur-md text-white p-3 border-t border-stone-800 shadow-2xl flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#601A24] flex items-center justify-center text-white shrink-0">
          <CalendarCheck className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] text-stone-300 block font-mono">
            {totalCount} Service{totalCount === 1 ? '' : 's'} · {formatDuration(totalMinutes)}
          </span>
          <span className="font-mono font-bold text-sm text-white tabular-nums">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => dispatch(openCartDrawer())}
        className="px-4 py-2 bg-[#601A24] hover:bg-[#7A222F] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
      >
        <span>Pick Slot & Book</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
