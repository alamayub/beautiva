import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  CreditCard,
  Wallet,
  Banknote,
  Lock,
  Info,
} from 'lucide-react';
import { checkoutSchema, CheckoutFormData } from '../lib/validation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCart } from '../store/features/cart/cartSlice';
import {
  releaseSlotHold,
  confirmLocation,
  checkPincodeServiceability,
  SERVICEABLE_CITIES,
} from '../store/features/booking/bookingSlice';
import { useCreateOrderMutation } from '../store/api/baseApi';
import { formatCurrency } from '../lib/currency';
import { formatDuration } from '../lib/duration';
import { Order, PaymentOption } from '../types/order';
import { SlotBookingCalendar } from '../components/booking/SlotBookingCalendar';
import { saveBookingRecord, formatDateToReadable } from '../lib/slotAvailability';

type BookingStep = 1 | 2 | 3 | 4;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const bookingState = useAppSelector((state) => state.booking);

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('cash');

  // Start at Step 1 if location not confirmed, otherwise Step 2 (Pick a Slot)
  const [activeStep, setActiveStep] = useState<BookingStep>(
    bookingState.isLocationConfirmed ? 2 : 1
  );

  // Local state for Step 1 inline location check
  const [locCity, setLocCity] = useState<string>(bookingState.city || 'Lucknow');
  const [locPincode, setLocPincode] = useState<string>(
    bookingState.pincode || SERVICEABLE_CITIES[bookingState.city || 'Lucknow']?.samplePincodes[0] || '226010'
  );
  const [locError, setLocError] = useState<string | null>(null);

  // 10-minute slot hold countdown
  const [holdSecondsLeft, setHoldSecondsLeft] = useState<number>(0);
  useEffect(() => {
    if (!bookingState.slotHold) {
      setHoldSecondsLeft(0);
      return;
    }
    const tick = () => {
      const diff = Math.max(0, Math.floor((bookingState.slotHold!.expiresAt - Date.now()) / 1000));
      setHoldSecondsLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [bookingState.slotHold]);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity,
    0
  );

  const totalOriginal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const totalSavings = totalOriginal > subtotal ? totalOriginal - subtotal : 0;
  const totalDurationMinutes = items.reduce(
    (sum, item) => sum + item.product.durationMinutes * item.quantity,
    0
  );

  const advanceAmount = Math.max(99, Math.round(subtotal * 0.2));
  const remainingAfterAdvance = Math.max(0, subtotal - advanceAmount);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      city: bookingState.city || user?.city || 'Lucknow',
      houseFlat: '',
      streetArea: bookingState.locality || user?.address || '',
      landmark: '',
      pincode: bookingState.pincode || '226010',
      serviceDate:
        bookingState.slotHold?.date ||
        new Date(Date.now() + 86400000).toISOString().split('T')[0],
      serviceTimeSlot: bookingState.slotHold?.timeSlot || '',
      instructions: '',
    },
  });

  const watchedCity = watch('city');
  const selectedDate = watch('serviceDate');
  const selectedSlot = watch('serviceTimeSlot');
  const watchedHouseFlat = watch('houseFlat');
  const watchedStreetArea = watch('streetArea');
  const watchedLandmark = watch('landmark');
  const watchedPhone = watch('phone');
  const watchedFullName = watch('fullName');
  const watchedPincode = watch('pincode');

  const handleConfirmStep1Location = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkPincodeServiceability(locPincode, locCity);
    if (!res.serviceable || !res.matchedCity) {
      setLocError(res.message);
      return;
    }
    setLocError(null);
    const matched = res.matchedCity;
    const defaultLoc = SERVICEABLE_CITIES[matched]?.localities[0] || '';
    dispatch(
      confirmLocation({
        city: matched,
        pincode: locPincode.trim(),
        locality: defaultLoc,
      })
    );
    setValue('city', matched);
    setValue('pincode', locPincode.trim());
    if (!watchedStreetArea) {
      setValue('streetArea', defaultLoc);
    }
    setActiveStep(2);
  };

  const handleContinueToAddress = async () => {
    const valid = await trigger(['serviceDate', 'serviceTimeSlot']);
    if (valid) {
      setActiveStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueToConfirm = async () => {
    const valid = await trigger([
      'fullName',
      'phone',
      'houseFlat',
      'streetArea',
      'city',
      'pincode',
    ]);
    if (valid) {
      setActiveStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const result = await createOrder({
        items,
        address: data,
        subtotal,
        discount: totalSavings,
        tax: 0,
        total: subtotal,
        paymentMethod: paymentOption,
        advanceAmount: paymentOption === 'advance' ? advanceAmount : undefined,
      }).unwrap();

      const validCity = (
        ['Lucknow', 'Patna', 'Kanpur', 'Gorakhpur', 'Varanasi'].includes(data.city)
          ? data.city
          : 'Lucknow'
      ) as 'Lucknow' | 'Patna' | 'Kanpur' | 'Gorakhpur' | 'Varanasi';

      const paymentMethodLabel: 'Cash on Delivery' | 'Prepaid Card' | 'UPI on Spot' =
        paymentOption === 'online'
          ? 'Prepaid Card'
          : paymentOption === 'advance'
          ? 'UPI on Spot'
          : 'Cash on Delivery';

      saveBookingRecord({
        id: result.id,
        customerName: data.fullName,
        phone: data.phone,
        city: validCity,
        locality: data.streetArea,
        fullAddress: `${data.houseFlat}, ${data.streetArea}${
          data.landmark ? ` (Near ${data.landmark})` : ''
        }, ${data.city} - ${data.pincode}`,
        serviceNames: items.map((i) => i.product.title),
        totalAmount: subtotal,
        date: data.serviceDate,
        timeSlot: data.serviceTimeSlot,
        status: 'assigned',
        assignedStylistName: result.assignedBeautician?.name || 'Pooja Verma (Verified)',
        paymentMethod: paymentMethodLabel,
        paymentStatus: paymentOption === 'online' ? 'paid' : 'pending',
        specialNotes: data.instructions,
        createdAt: new Date().toISOString(),
      });

      setConfirmedOrder(result);
      dispatch(releaseSlotHold());
      dispatch(clearCart());
    } catch {
      // error handled
    }
  };

  // Confirmed Booking Receipt
  if (confirmedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-10">
          <div className="text-center space-y-3 pb-8 border-b border-stone-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
              Beautician Booked & Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
              Booking ID: {confirmedOrder.id}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you, {confirmedOrder.address.fullName}! Your doorstep beauty session is confirmed.
            </p>
          </div>

          {/* Stylist Assigned */}
          <div className="py-6 border-b border-stone-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Assigned Beautician
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
                  <p className="text-[11px] text-stone-500">
                    Police verified · Carrying sealed brand kits
                  </p>
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
                Date, Time & Duration
              </span>
              <p className="font-semibold text-stone-900 text-sm">
                {formatDateToReadable(confirmedOrder.address.serviceDate)}
              </p>
              <p className="text-stone-600 font-mono">{confirmedOrder.address.serviceTimeSlot}</p>
              <p className="text-[#601A24] font-mono font-semibold mt-0.5">
                Session Time: {formatDuration(totalDurationMinutes)}
              </p>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-semibold text-[10px] block mb-1">
                Service Address
              </span>
              <p className="font-semibold text-stone-900">
                {confirmedOrder.address.houseFlat}, {confirmedOrder.address.streetArea}
              </p>
              {confirmedOrder.address.landmark && (
                <p className="text-stone-500">Landmark: {confirmedOrder.address.landmark}</p>
              )}
              <p className="text-stone-500">
                {confirmedOrder.address.city} – {confirmedOrder.address.pincode}
              </p>
            </div>
          </div>

          {/* Booked Services */}
          <div className="py-6 border-b border-stone-100 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Booked Services ({confirmedOrder.items.length})
            </h3>
            {confirmedOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs py-1">
                <span className="text-stone-800">
                  {item.quantity}x {item.product.title} (
                  {formatDuration(item.product.durationMinutes * item.quantity)})
                </span>
                <span className="font-mono font-semibold text-stone-900">
                  {formatCurrency(
                    (item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="py-6 border-b border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 block">
                {confirmedOrder.paymentMethod === 'online'
                  ? 'Paid Online in Full'
                  : confirmedOrder.paymentMethod === 'advance'
                  ? `Advance Paid: ${formatCurrency(confirmedOrder.advanceAmount || 0)} · Balance on Service: ${formatCurrency(
                      confirmedOrder.total - (confirmedOrder.advanceAmount || 0)
                    )}`
                  : 'Cash / UPI on Service Completion'}
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                Free cancellation up to 4 hours before slot
              </span>
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
    navigate('/services');
    return null;
  }

  const steps = [
    { num: 1 as BookingStep, label: 'Location' },
    { num: 2 as BookingStep, label: 'Pick a Slot' },
    { num: 3 as BookingStep, label: 'Address & Contact' },
    { num: 4 as BookingStep, label: 'Confirm & Pay' },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-5" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/services" className="hover:text-stone-900 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Book Beautician</span>
        </nav>

        {/* Header + 10-Minute Slot Hold Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
              Complete Your Beautician Booking
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {items.length} service{items.length > 1 ? 's' : ''} selected · Total time:{' '}
              <strong className="font-mono text-[#601A24]">
                {formatDuration(totalDurationMinutes)}
              </strong>{' '}
              · Total:{' '}
              <strong className="font-mono text-stone-900">{formatCurrency(subtotal)}</strong>
            </p>
          </div>

          {holdSecondsLeft > 0 && selectedSlot && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 shadow-2xs self-start md:self-auto">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Slot <strong>{selectedSlot}</strong> held for{' '}
                <strong className="font-mono text-[#601A24]">
                  {String(Math.floor(holdSecondsLeft / 60)).padStart(2, '0')}:
                  {String(holdSecondsLeft % 60).padStart(2, '0')}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* 4-Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {steps.map((s) => {
            const isDone = activeStep > s.num;
            const isCurrent = activeStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num <= activeStep || (s.num === 2 && bookingState.isLocationConfirmed)) {
                    setActiveStep(s.num);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isCurrent
                    ? 'bg-[#601A24] border-[#601A24] text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-100/70'
                    : 'bg-white border-stone-200 text-stone-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-white text-[#601A24]'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </span>
                <span className="text-xs font-semibold truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Step Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 1: CITY & PINCODE CHECK */}
              {activeStep === 1 && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24]">
                      Step 1 of 4 · Location Check
                    </span>
                    <h2 className="text-lg font-editorial font-bold text-stone-900 mt-0.5">
                      Confirm Your City & PIN Code
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Verify doorstep beautician availability in your area before selecting a time slot.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        City *
                      </label>
                      <select
                        value={locCity}
                        onChange={(e) => {
                          const c = e.target.value;
                          setLocCity(c);
                          setLocPincode(SERVICEABLE_CITIES[c]?.samplePincodes[0] || '');
                          setLocError(null);
                        }}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#601A24]"
                      >
                        {Object.keys(SERVICEABLE_CITIES).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        6-Digit PIN Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={locPincode}
                        onChange={(e) => {
                          setLocPincode(e.target.value.replace(/\D/g, ''));
                          setLocError(null);
                        }}
                        placeholder="e.g. 226010"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-xs font-mono font-semibold focus:outline-none focus:border-[#601A24]"
                      />
                    </div>
                  </div>

                  {locError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{locError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleConfirmStep1Location}
                      className="px-6 py-3 bg-[#601A24] hover:bg-[#4a121a] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <span>Confirm Location & Pick Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PICK A SLOT (DATE, THEN TIME BASED ON DURATION, 10-MIN HOLD) */}
              {activeStep === 2 && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24]">
                        Step 2 of 4 · Date & Time Slot
                      </span>
                      <h2 className="text-lg font-editorial font-bold text-stone-900 mt-0.5">
                        Pick a Date & Free Beautician Slot
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Showing only slots in <strong>{watchedCity}</strong> where a beautician is free for your{' '}
                        <strong className="font-mono text-[#601A24]">
                          {formatDuration(totalDurationMinutes)}
                        </strong>{' '}
                        session. Selecting a slot holds it for 10 minutes.
                      </p>
                    </div>
                  </div>

                  <SlotBookingCalendar
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    city={watchedCity}
                    totalDurationMinutes={totalDurationMinutes}
                    onSelectDate={(date) => {
                      setValue('serviceDate', date, { shouldValidate: true });
                      setValue('serviceTimeSlot', '', { shouldValidate: false });
                    }}
                    onSelectSlot={(slot) => {
                      setValue('serviceTimeSlot', slot, { shouldValidate: true });
                    }}
                  />

                  <input type="hidden" {...register('serviceDate')} />
                  <input type="hidden" {...register('serviceTimeSlot')} />

                  {(errors.serviceDate || errors.serviceTimeSlot) && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        {errors.serviceDate?.message || errors.serviceTimeSlot?.message}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      ← Change City / PIN
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueToAddress}
                      className="px-6 py-3 bg-[#601A24] hover:bg-[#4a121a] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <span>Continue to Address & Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ADDRESS & CONTACT */}
              {activeStep === 3 && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
                  <div className="border-b border-stone-100 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24]">
                      Step 3 of 4 · Doorstep Details
                    </span>
                    <h2 className="text-lg font-editorial font-bold text-stone-900 mt-0.5">
                      Address & Contact Information
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Where should your beautician arrive on {formatDateToReadable(selectedDate)} ({selectedSlot})?
                    </p>
                  </div>

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
                        Phone Number (10 Digits) *
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

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        Home Address — House / Flat / Building No. *
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
                        placeholder="e.g. Gomti Nagar, Vibhuti Khand"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                      />
                      {errors.streetArea && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.streetArea.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('landmark')}
                        placeholder="e.g. Near Cinepolis Mall Gate 2"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        {...register('pincode')}
                        placeholder="e.g. 226010"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#601A24]"
                      />
                      {errors.pincode && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.pincode.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        Optional Notes for Beautician
                      </label>
                      <textarea
                        rows={2}
                        {...register('instructions')}
                        placeholder="e.g. Sensitive skin, please bring extra disposable bedsheet, call on arrival"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      ← Back to Slot Selection
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueToConfirm}
                      className="px-6 py-3 bg-[#601A24] hover:bg-[#4a121a] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <span>Continue to Confirm & Pay</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRM & PAY (ONLINE, ADVANCE, OR CASH + CANCELLATION POLICY) */}
              {activeStep === 4 && (
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
                  <div className="border-b border-stone-100 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24]">
                      Step 4 of 4 · Final Review & Payment
                    </span>
                    <h2 className="text-lg font-editorial font-bold text-stone-900 mt-0.5">
                      Confirm & Choose Payment Method
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Review your booking details, choose how you’d like to pay, and confirm your beautician.
                    </p>
                  </div>

                  {/* Review Summary Card */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        Appointment Slot
                      </span>
                      <p className="font-bold text-stone-900">
                        {formatDateToReadable(selectedDate)}
                      </p>
                      <p className="font-mono text-[#601A24] font-semibold">{selectedSlot}</p>
                      <p className="text-stone-500 mt-0.5">
                        Total Duration: {formatDuration(totalDurationMinutes)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        Doorstep Address
                      </span>
                      <p className="font-bold text-stone-900">{watchedFullName}</p>
                      <p className="text-stone-600">
                        {watchedHouseFlat}, {watchedStreetArea}
                        {watchedLandmark ? ` (${watchedLandmark})` : ''}
                      </p>
                      <p className="text-stone-500 font-mono">
                        {watchedCity} – {watchedPincode} · {watchedPhone}
                      </p>
                    </div>
                  </div>

                  {/* 3 Payment Options */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Select Payment Option
                    </label>

                    {/* Option 1: Pay Online */}
                    <label
                      className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                        paymentOption === 'online'
                          ? 'border-[#601A24] bg-[#601A24]/[0.03]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === 'online'}
                        onChange={() => setPaymentOption('online')}
                        className="mt-1 accent-[#601A24]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-[#601A24]" />
                            Pay Online (Full Amount)
                          </span>
                          <span className="font-mono font-bold text-sm text-[#601A24]">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Instant confirmation via UPI (GPay, PhonePe, Paytm), Credit/Debit Card, or NetBanking.
                        </p>
                      </div>
                    </label>

                    {/* Option 2: Pay an Advance */}
                    <label
                      className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                        paymentOption === 'advance'
                          ? 'border-[#601A24] bg-[#601A24]/[0.03]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === 'advance'}
                        onChange={() => setPaymentOption('advance')}
                        className="mt-1 accent-[#601A24]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <Wallet className="w-4 h-4 text-[#601A24]" />
                            Pay an Advance (20% Now)
                          </span>
                          <span className="font-mono font-bold text-sm text-[#601A24]">
                            {formatCurrency(advanceAmount)} now
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Lock your beautician with {formatCurrency(advanceAmount)} now and pay the remaining{' '}
                          <strong className="font-mono text-stone-700">
                            {formatCurrency(remainingAfterAdvance)}
                          </strong>{' '}
                          after service completion.
                        </p>
                      </div>
                    </label>

                    {/* Option 3: Cash on Service */}
                    <label
                      className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                        paymentOption === 'cash'
                          ? 'border-[#601A24] bg-[#601A24]/[0.03]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === 'cash'}
                        onChange={() => setPaymentOption('cash')}
                        className="mt-1 accent-[#601A24]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <Banknote className="w-4 h-4 text-emerald-600" />
                            Cash on Service (Pay After Completion)
                          </span>
                          <span className="font-mono font-bold text-sm text-stone-900">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Pay via Cash or UPI directly to your beautician once your treatment is complete.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                      <Info className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Beautiva Cancellation & Rescheduling Policy</span>
                    </div>
                    <ul className="text-[11px] text-stone-700 space-y-1 pl-6 list-disc leading-relaxed">
                      <li>
                        <strong>Free Cancellation / Rescheduling:</strong> Up to <strong>4 hours</strong> before your scheduled slot (100% refund of any online or advance payment).
                      </li>
                      <li>
                        <strong>Late Cancellation (&lt; 4 hours before slot):</strong> A ₹150 convenience fee applies to cover beautician dispatch.
                      </li>
                      <li>
                        <strong>No-Show / Doorstep Refusal:</strong> 100% of advance (or ₹250) is non-refundable.
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      ← Edit Address & Contact
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3.5 bg-[#601A24] hover:bg-[#4a121a] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      <span>
                        {isLoading
                          ? 'Confirming Booking...'
                          : paymentOption === 'online'
                          ? `Pay ${formatCurrency(subtotal)} & Confirm Booking`
                          : paymentOption === 'advance'
                          ? `Pay ${formatCurrency(advanceAmount)} Advance & Confirm`
                          : `Confirm Booking (${formatCurrency(subtotal)} on Service)`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Running Summary Sidebar */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">Booking Summary</h2>
                <span className="text-xs font-mono font-bold text-[#601A24] bg-[#601A24]/10 px-2.5 py-1 rounded-lg">
                  {formatDuration(totalDurationMinutes)}
                </span>
              </div>

              {/* Confirmed Location Pill */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#601A24] shrink-0" />
                  <div>
                    <span className="font-semibold text-stone-900 block">
                      {watchedCity} ({watchedPincode || bookingState.pincode || '226010'})
                    </span>
                    <span className="text-[11px] text-stone-500">Doorstep service area</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="text-[11px] font-semibold text-[#601A24] hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Selected Services List with Duration */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto divide-y divide-stone-100 pr-1">
                {items.map((i, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-900">{i.product.title}</span>
                      <span className="text-stone-500 block text-[11px] font-mono">
                        {i.quantity}x · {formatDuration(i.product.durationMinutes * i.quantity)}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-stone-900">
                      {formatCurrency(
                        (i.product.price + (i.selectedOption?.priceDelta || 0)) * i.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price & Time Breakdown */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Total Session Duration</span>
                  <span className="font-mono font-bold text-[#601A24]">
                    {formatDuration(totalDurationMinutes)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Services Subtotal</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Package Discount</span>
                    <span className="font-mono font-semibold">
                      - {formatCurrency(totalSavings)}
                    </span>
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

              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified female beautician · 100% sealed mono-dose kits</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
