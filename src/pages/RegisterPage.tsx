import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../lib/validation';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/features/auth/authSlice';
import { useToast } from '../components/common/ToastProvider';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      city: 'Lucknow',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    dispatch(
      login({
        id: `usr-${Date.now()}`,
        name: data.fullName,
        phone: data.phone,
        email: data.email,
        city: data.city,
        isLoggedIn: true,
      })
    );
    showToast('Account created successfully! Welcome to Beautiva.');
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
            Create Customer Account
          </h1>
          <p className="text-xs text-stone-500">
            Enjoy one-click slot re-bookings, verified deals, and doorstep salon tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              {...register('fullName')}
              placeholder="e.g. Shalini Verma"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
            />
            {errors.fullName && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Mobile Number (10 Digits) *
            </label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="e.g. 9876543210"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
            />
            {errors.phone && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="e.g. shalini@example.com"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
            />
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              City *
            </label>
            <select
              {...register('city')}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
            >
              <option value="Lucknow">Lucknow, UP</option>
              <option value="Patna">Patna, Bihar</option>
              <option value="Kanpur">Kanpur, UP</option>
              <option value="Gorakhpur">Gorakhpur, UP</option>
              <option value="Varanasi">Varanasi, UP</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Set Password *
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="Minimum 6 characters"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
            />
            {errors.password && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-sm text-center"
          >
            Create My Account
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-[#601A24] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
