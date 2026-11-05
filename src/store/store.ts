import { configureStore } from '@reduxjs/toolkit';
import { salonlineApi } from './api/baseApi';
import cartReducer from './features/cart/cartSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [salonlineApi.reducerPath]: salonlineApi.reducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(salonlineApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
