import { configureStore } from '@reduxjs/toolkit';
import { beautivaApi } from './api/baseApi';
import cartReducer from './features/cart/cartSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import authReducer from './features/auth/authSlice';
import bookingReducer from './features/booking/bookingSlice';

export const store = configureStore({
  reducer: {
    [beautivaApi.reducerPath]: beautivaApi.reducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(beautivaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
