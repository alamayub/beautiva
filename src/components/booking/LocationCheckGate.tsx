import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Sparkles, Navigation } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  confirmLocation,
  resetLocationConfirmation,
  SERVICEABLE_CITIES,
  checkPincodeServiceability,
} from '../../store/features/booking/bookingSlice';
import { useToast } from '../common/ToastProvider';

interface LocationCheckGateProps {
  onConfirmed?: () => void;
  compact?: boolean;
}

export const LocationCheckGate: React.FC<LocationCheckGateProps> = ({
  onConfirmed,
  compact = false,
}) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { city, pincode, locality, isLocationConfirmed } = useAppSelector(
    (state) => state.booking
  );

  const [inputCity, setInputCity] = useState<string>(city || 'Lucknow');
  const [inputPincode, setInputPincode] = useState<string>(
    pincode || SERVICEABLE_CITIES[city || 'Lucknow']?.samplePincodes[0] || '226010'
  );
  const [inputLocality, setInputLocality] = useState<string>(
    locality || SERVICEABLE_CITIES[city || 'Lucknow']?.localities[0] || 'Gomti Nagar'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cityInfo = SERVICEABLE_CITIES[inputCity] || SERVICEABLE_CITIES['Lucknow'];

  const handleCitySelect = (newCity: string) => {
    setInputCity(newCity);
    const info = SERVICEABLE_CITIES[newCity];
    if (info) {
      setInputPincode(info.samplePincodes[0]);
      setInputLocality(info.localities[0]);
    }
    setErrorMsg(null);
  };

  const handleCheckAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkPincodeServiceability(inputPincode, inputCity);
    if (!res.serviceable || !res.matchedCity) {
      setErrorMsg(res.message);
      return;
    }

    setErrorMsg(null);
    const finalCity = res.matchedCity;
    const finalLocality =
      finalCity === inputCity
        ? inputLocality
        : SERVICEABLE_CITIES[finalCity]?.localities[0] || '';

    dispatch(
      confirmLocation({
        city: finalCity,
        pincode: inputPincode.trim(),
        locality: finalLocality,
      })
    );
    showToast(
      `Location confirmed: ${finalLocality ? `${finalLocality}, ` : ''}${finalCity} (${inputPincode.trim()})`
    );
    onConfirmed?.();
  };

  if (isLocationConfirmed && compact) {
    const activeInfo = SERVICEABLE_CITIES[city] || SERVICEABLE_CITIES['Lucknow'];
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-stone-900">
                Serviceable at {locality ? `${locality}, ` : ''}
                {city} ({pincode})
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {activeInfo.stylistsCount} Beauticians Active
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Showing real-time services & beautician slots available at your doorstep.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch(resetLocationConfirmation())}
          className="text-xs font-semibold text-[#601A24] hover:underline px-2.5 py-1 rounded-lg bg-white border border-stone-200"
        >
          Change City / PIN
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#601A24]/20 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#601A24]">
            <Navigation className="w-3.5 h-3.5" />
            <span>Step 1 · Check Service Availability</span>
          </span>
          <h2 className="text-lg sm:text-xl font-editorial font-bold text-stone-900 mt-0.5">
            Where should your beautician visit?
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Confirm your city and 6-digit PIN code first so we only show services and live beautician slots available at your doorstep.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{cityInfo.stylistsCount} Stylists in {inputCity}</span>
        </div>
      </div>

      <form onSubmit={handleCheckAndConfirm} className="pt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* City */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Select City
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#601A24] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={inputCity}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#601A24]"
              >
                {Object.keys(SERVICEABLE_CITIES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Locality */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Locality / Area
            </label>
            <select
              value={inputLocality}
              onChange={(e) => setInputLocality(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#601A24]"
            >
              {cityInfo.localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 6-Digit PIN Code */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              6-Digit PIN Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputPincode}
                onChange={(e) => {
                  setInputPincode(e.target.value.replace(/\D/g, ''));
                  setErrorMsg(null);
                }}
                placeholder="e.g. 226010"
                className="flex-1 bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-mono font-semibold text-stone-900 focus:outline-none focus:border-[#601A24]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#601A24] hover:bg-[#4a121a] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs shrink-0"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>

        {/* Quick PIN suggestions */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
          <span>Quick PINs for {inputCity}:</span>
          {cityInfo.samplePincodes.map((pin) => (
            <button
              key={pin}
              type="button"
              onClick={() => {
                setInputPincode(pin);
                setErrorMsg(null);
              }}
              className={`px-2 py-0.5 rounded font-mono border transition-colors ${
                inputPincode === pin
                  ? 'bg-[#601A24] text-white border-[#601A24]'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {pin}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>
    </div>
  );
};
