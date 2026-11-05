import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react';
import { loginSchema, LoginFormData } from '../lib/validation';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/features/auth/authSlice';
import { useToast } from '../components/common/ToastProvider';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneOrEmail: '9876543210',
      password: 'password123',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    dispatch(
      login({
        id: 'usr-101',
        name: data.phoneOrEmail.includes('@') ? data.phoneOrEmail.split('@')[0] : 'Priya Verma',
        phone: data.phoneOrEmail.includes('@') ? '9876543210' : data.phoneOrEmail,
        email: data.phoneOrEmail.includes('@') ? data.phoneOrEmail : 'priya.verma@example.com',
        city: 'Lucknow',
        address: 'Sector 4, Gomti Nagar, Lucknow',
        isLoggedIn: true,
      })
    );
    showToast('Welcome back to Beautiva!');
    navigate('/profile');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#601A24]">
              Beautiva<span className="text-[#D47A83]">.in</span>
            </span>
          </Link>
          <h1 className="text-xl font-editorial font-bold text-stone-900">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-stone-500">
            Manage your salon bookings, past invoices, and saved addresses.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#601A24] shrink-0 mt-0.5" />
          <span>
            <strong>Demo Access:</strong> Sample credentials are pre-filled below. Click Sign In to test customer account features.
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Mobile Number or Email
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('phoneOrEmail')}
                placeholder="e.g. 9876543210"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
            {errors.phoneOrEmail && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.phoneOrEmail.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-9 py-2 text-xs focus:outline-none focus:border-[#601A24]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-sm text-center"
          >
            Sign In
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          <span>Don’t have an account yet? </span>
          <Link to="/register" className="font-semibold text-[#601A24] hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
