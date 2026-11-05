import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../../types/product';

interface WishlistState {
  items: Product[];
}

const loadWishlist = (): Product[] => {
  try {
    const raw = localStorage.getItem('beautiva_wishlist');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
};

const saveWishlist = (items: Product[]) => {
  try {
    localStorage.setItem('beautiva_wishlist', JSON.stringify(items));
  } catch {
    // ignore
  }
};

const initialState: WishlistState = {
  items: loadWishlist(),
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlist(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlist([]);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
