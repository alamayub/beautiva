import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  isLoggedIn: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const loadUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem('beautiva_user');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
};

const initialState: AuthState = {
  user: loadUser(),
  isAuthenticated: !!loadUser(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.user = { ...action.payload, isLoggedIn: true };
      state.isAuthenticated = true;
      try {
        localStorage.setItem('beautiva_user', JSON.stringify(state.user));
      } catch {
        // ignore
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        try {
          localStorage.setItem('beautiva_user', JSON.stringify(state.user));
        } catch {
          // ignore
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('beautiva_user');
      } catch {
        // ignore
      }
    },
  },
});

export const { login, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;
