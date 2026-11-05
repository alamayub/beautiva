import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { checkoutSchema, CheckoutFormData } from '../lib/validation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCart } from '../store/features/cart/cartSlice';
import { useCreateOrderMutation } from '../store/api/baseApi';
import { formatCurrency } from '../lib/currency';
import { Order } from '../types/order';
import { SlotBookingCalendar } from '../components/booking/SlotBookingCalendar';
import { saveBookingRecord } from '../lib/slotAvailability';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity,
    0
  );

  const totalOriginal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const totalSavings = totalOriginal > subtotal ? totalOriginal - subtotal : 0;

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      city: user?.city || 'Lucknow',
      houseFlat: '',
      streetArea: user?.address || '',
      landmark: '',
      pincode: '',
      serviceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      serviceTimeSlot: '11:30 AM - 02:00 PM',
      instructions: '',
    },
  });

  const watchedCity = watch('city');
  const selectedDate = watch('serviceDate');
  const selectedSlot = watch('serviceTimeSlot');

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const result = await createOrder({
        items,
        address: data,
        subtotal,
        discount: totalSavings,
        tax: 0,
        total: subtotal,
      }).unwrap();

      // Persist booking record so slot availability dynamically decrements in real-time
      const validCity = (['Lucknow', 'Patna', 'Kanpur', 'Gorakhpur', 'Varanasi'].includes(data.city)
        ? data.city
        : 'Lucknow') as 'Lucknow' | 'Patna' | 'Kanpur' | 'Gorakhpur' | 'Varanasi';

      saveBookingRecord({
        id: result.id,
        customerName: data.fullName,
        phone: data.phone,
        city: validCity,
        locality: data.streetArea,
        fullAddress: `${data.houseFlat}, ${data.streetArea}, ${data.city} - ${data.pincode}`,
        serviceNames: items.map((i) => i.product.title),
        totalAmount: subtotal,
        date: data.serviceDate,
        timeSlot: data.serviceTimeSlot,
        status: 'assigned',
        assignedStylistName: result.assignedBeautician?.name || 'Pooja Verma (Verified)',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
        specialNotes: data.instructions,
        createdAt: new Date().toISOString(),
      });

      setConfirmedOrder(result);
      dispatch(clearCart());
    } catch {
      // error handled
    }
  };

  // If order is confirmed, show order receipt
  if (confirmedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-10">
          <div className="text-center space-y-3 pb-8 border-b border-stone-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
              Appointment Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
              Booking ID: {confirmedOrder.id}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you, {confirmedOrder.address.fullName}! Your doorstep beauty session has been scheduled.
            </p>
          </div>

          {/* Stylist Assigned */}
          <div className="py-6 border-b border-stone-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Assigned Professional
            </h3>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#601A24] text-white flex items-center justify-center font-bold text-sm">
                  PR
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {confirmedOrder.assignedBeautician?.name}
                  </h4>
                  <p className="text-[11px] text-stone-500">Police verified · Carrying sealed brand kits</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ★ 4.9
              </span>
            </div>
          </div>

          {/* Appointment Timing & Address */}
          <div className="py-6 border-b border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
            <div>
              <span className="text-stone-400 uppercase font-semibold text-[10px] block mb-1">
                Date & Time Slot
              </span>
              <p className="font-semibold text-stone-900 text-sm">
                {confirmedOrder.address.serviceDate}
              </p>
              <p className="text-stone-500">{confirmedOrder.address.serviceTimeSlot}</p>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-semibold text-[10px] block mb-1">
                Service Address
              </span>
              <p className="font-semibold text-stone-900">
                {confirmedOrder.address.houseFlat}, {confirmedOrder.address.streetArea}
              </p>
              <p className="text-stone-500">
                {confirmedOrder.address.city} – {confirmedOrder.address.pincode}
              </p>
            </div>
          </div>

          {/* Ordered Packages */}
          <div className="py-6 border-b border-stone-100 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Reserved Packages ({confirmedOrder.items.length})
            </h3>
            {confirmedOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs py-1">
                <span className="text-stone-800">
                  {item.quantity}x {item.product.title}
                  {item.selectedOption ? ` (${item.selectedOption.name})` : ''}
                </span>
                <span className="font-mono font-semibold text-stone-900">
                  {formatCurrency((item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Payment Note */}
          <div className="py-6 border-b border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 block">Total Due Upon Service</span>
              <span className="text-xs text-emerald-700 font-medium">Pay via Cash, UPI or Card after completion</span>
            </div>
            <span className="text-xl font-bold font-mono text-[#601A24]">
              {formatCurrency(confirmedOrder.total)}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/profile"
              className="flex-1 py-3 px-4 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors text-center"
            >
              View in My Appointments
            </Link>
            <Link
              to="/"
              className="py-3 px-4 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/cart" className="hover:text-stone-900 transition-colors">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Book Appointment</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
            Confirm Appointment Details
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Provide your home address and preferred time slot. No advance payment required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Fields Left */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-stone-900">1. Customer Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Alternate Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      {...register('alternatePhone')}
                      placeholder="e.g. Landline or family contact"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-stone-900">2. Service Location</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      House / Flat / Building No. *
                    </label>
                    <input
                      type="text"
                      {...register('houseFlat')}
                      placeholder="e.g. Flat 302, Royal Palms, Block B"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                    {errors.houseFlat && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.houseFlat.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Street / Locality / Society *
                    </label>
                    <input
                      type="text"
                      {...register('streetArea')}
                      placeholder="e.g. Faizabad Road, Chinhat or Patliputra Colony"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                    {errors.streetArea && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.streetArea.message}</p>
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
                    {errors.city && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      PIN Code (6 Digits) *
                    </label>
                    <input
                      type="text"
                      {...register('pincode')}
                      placeholder="e.g. 226028"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                    {errors.pincode && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.pincode.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      {...register('landmark')}
                      placeholder="e.g. Near New Gulista Colony Gate"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                  </div>
                </div>
              </div>

              {/* Slot Scheduling Card with Interactive Calendar View */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      <span>3. Choose Appointment Slot</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Live Availability
                      </span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Check real-time cosmetologist availability in {watchedCity || 'your city'}. Past dates and filled slots are locked.
                    </p>
                  </div>
                </div>

                {/* Calendar View Component */}
                <SlotBookingCalendar
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  city={watchedCity}
                  onSelectDate={(date) => {
                    setValue('serviceDate', date, { shouldValidate: true });
                  }}
                  onSelectSlot={(slot) => {
                    setValue('serviceTimeSlot', slot, { shouldValidate: true });
                  }}
                />

                {/* Hidden form inputs registered for zod validation */}
                <input type="hidden" {...register('serviceDate')} />
                <input type="hidden" {...register('serviceTimeSlot')} />

                {/* Validation errors */}
                {(errors.serviceDate || errors.serviceTimeSlot) && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.serviceDate?.message || errors.serviceTimeSlot?.message}</span>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Special Requests / Instructions for Cosmetologist (Optional)
                  </label>
                  <textarea
                    rows={2}
                    {...register('instructions')}
                    placeholder="e.g. Ring bell twice, patch test required for sensitive skin"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                  />
                </div>
              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-5 sticky top-24">
              <h2 className="text-base font-bold text-stone-900">Payment & Summary</h2>

              {/* Service Items List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto divide-y divide-stone-100 pr-1">
                {items.map((i, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-900">{i.product.title}</span>
                      <span className="text-stone-500 block text-[11px]">
                        Qty: {i.quantity} · {i.product.durationMinutes} mins
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-stone-900">
                      {formatCurrency((i.product.price + (i.selectedOption?.priceDelta || 0)) * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Package Discount</span>
                    <span className="font-mono font-semibold">- {formatCurrency(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Single-Use Safety & Travel Kit</span>
                  <span className="text-emerald-700 font-medium">FREE</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                <span className="text-sm font-bold text-stone-900">Total Payable</span>
                <span className="text-xl font-bold font-mono text-[#601A24]">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {/* Payment Method Badge */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-stone-900">
                    Pay After Service Completion
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal pl-6">
                  Cash on Delivery (COD), UPI (GPay/PhonePe), or Credit/Debit Card to the beautician once you are satisfied with the treatment.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-sm disabled:opacity-50 text-center"
              >
                {isLoading ? 'Confirming Appointment...' : 'Book Verified Doorstep Service'}
              </button>

              <p className="text-[10px] text-stone-400 text-center leading-normal">
                By booking, you agree to Beautiva’s Terms of Sale and Safety Guidelines.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
