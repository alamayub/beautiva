import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../../types/order';
import { Product, ServiceOption } from '../../../types/product';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

const loadInitialCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem('beautiva_cart');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem('beautiva_cart', JSON.stringify(items));
  } catch {
    // ignore
  }
};

const initialState: CartState = {
  items: loadInitialCart(),
  isDrawerOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; option?: ServiceOption }>
    ) => {
      const { product, option } = action.payload;
      const existing = state.items.find(
        (i) =>
          i.product.id === product.id &&
          (i.selectedOption?.id === option?.id || (!i.selectedOption && !option))
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          product,
          quantity: 1,
          selectedOption: option,
        });
      }
      saveCart(state.items);
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; optionId?: string }>
    ) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.product.id === action.payload.productId &&
            (i.selectedOption?.id === action.payload.optionId ||
              (!i.selectedOption && !action.payload.optionId))
          )
      );
      saveCart(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; optionId?: string; quantity: number }>
    ) => {
      const { productId, optionId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (i) =>
            !(
              i.product.id === productId &&
              (i.selectedOption?.id === optionId || (!i.selectedOption && !optionId))
            )
        );
      } else {
        const item = state.items.find(
          (i) =>
            i.product.id === productId &&
            (i.selectedOption?.id === optionId || (!i.selectedOption && !optionId))
        );
        if (item) {
          item.quantity = Math.min(10, Math.max(1, quantity));
        }
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;
