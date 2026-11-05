import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  ChevronDown,
  Star,
  Zap
} from 'lucide-react';
import { categories } from '../../data/categories';
import { formatCurrency } from '../../lib/currency';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  confirmLocation,
  checkPincodeServiceability,
  SERVICEABLE_CITIES,
} from '../../store/features/booking/bookingSlice';
import { useToast } from '../common/ToastProvider';

const CITY_DETAILS: Record<string, {
  name: string;
  tagline: string;
  localities: string[];
  stylistsCount: number;
  nextSlot: string;
  avgTime: string;
}> = {
  'Lucknow': {
    name: 'Lucknow',
    tagline: 'Gomti Nagar, Aliganj, Hazratganj & Chinhat',
    localities: ['Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Hazratganj', 'Mahanagar', 'Chinhat'],
    stylistsCount: 24,
    nextSlot: 'Today 2:30 PM',
    avgTime: '30 mins'
  },
  'Patna': {
    name: 'Patna',
    tagline: 'Patliputra, Boring Road, Bailey Road & Kankarbagh',
    localities: ['Patliputra', 'Boring Road', 'Bailey Road', 'Kankarbagh', 'Rajendra Nagar'],
    stylistsCount: 18,
    nextSlot: 'Today 3:15 PM',
    avgTime: '35 mins'
  },
  'Kanpur': {
    name: 'Kanpur',
    tagline: 'Civil Lines, Swaroop Nagar & Kakadeo',
    localities: ['Civil Lines', 'Swaroop Nagar', 'Kakadeo', 'Kidwai Nagar'],
    stylistsCount: 16,
    nextSlot: 'Today 4:00 PM',
    avgTime: '30 mins'
  },
  'Gorakhpur': {
    name: 'Gorakhpur',
    tagline: 'Civil Lines, Golghar & Medical College Road',
    localities: ['Civil Lines', 'Golghar', 'Medical Road', 'Taramandal'],
    stylistsCount: 12,
    nextSlot: 'Tomorrow 9:30 AM',
    avgTime: '40 mins'
  },
  'Varanasi': {
    name: 'Varanasi',
    tagline: 'Sigra, Bhelupur, Mahmoorganj & Lanka',
    localities: ['Sigra', 'Bhelupur', 'Mahmoorganj', 'Lanka', 'Cantt'],
    stylistsCount: 14,
    nextSlot: 'Today 4:30 PM',
    avgTime: '35 mins'
  },
  'New Delhi NCR': {
    name: 'New Delhi NCR',
    tagline: 'South Delhi, Dwarka, Noida & Gurugram',
    localities: ['South Ext', 'Greater Kailash', 'Dwarka', 'Noida Sec 62', 'Gurugram Phase 5'],
    stylistsCount: 35,
    nextSlot: 'Today 1:45 PM',
    avgTime: '25 mins'
  }
};

const CATEGORY_ICONS: Record<string, { emoji: string; color: string }> = {
  'facials-skincare': { emoji: '💆‍♀️', color: 'bg-rose-50 border-rose-200 text-rose-800' },
  'hair-services': { emoji: '🧖‍♀️', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  'makeup-styling': { emoji: '💄', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  'waxing-grooming': { emoji: '🍯', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  'manicure-pedicure': { emoji: '💅', color: 'bg-pink-50 border-pink-200 text-pink-800' },
  'bridal-packages': { emoji: '👰', color: 'bg-red-50 border-red-200 text-red-800' },
};

export const CityHeroModule: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const bookingLoc = useAppSelector((state) => state.booking);

  const [selectedCity, setSelectedCity] = useState<string>(bookingLoc.city || 'Lucknow');
  const [selectedLocality, setSelectedLocality] = useState<string>(
    bookingLoc.locality || 'Gomti Nagar'
  );
  const [pincodeInput, setPincodeInput] = useState<string>(
    bookingLoc.pincode || SERVICEABLE_CITIES[bookingLoc.city || 'Lucknow']?.samplePincodes[0] || '226010'
  );
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCity = CITY_DETAILS[selectedCity] || CITY_DETAILS['Lucknow'];

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const loc = CITY_DETAILS[city]?.localities[0] || 'Center';
    setSelectedLocality(loc);
    const samplePin = SERVICEABLE_CITIES[city]?.samplePincodes[0] || '';
    setPincodeInput(samplePin);
    setPincodeError(null);
  };

  const handleConfirmPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkPincodeServiceability(pincodeInput, selectedCity);
    if (!res.serviceable || !res.matchedCity) {
      setPincodeError(res.message);
      return;
    }
    setPincodeError(null);
    const matched = res.matchedCity;
    const loc =
      matched === selectedCity
        ? selectedLocality
        : CITY_DETAILS[matched]?.localities[0] || '';
    setSelectedCity(matched);
    setSelectedLocality(loc);
    dispatch(
      confirmLocation({
        city: matched,
        pincode: pincodeInput.trim(),
        locality: loc,
      })
    );
    showToast(`Service confirmed at ${loc}, ${matched} (${pincodeInput.trim()})`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FFFDF9] to-white border-b border-stone-200 pt-6 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step 1: City, Locality & Pincode Check Bar */}
        <form
          onSubmit={handleConfirmPincode}
          className="mb-6 bg-white p-3 sm:p-3.5 rounded-2xl border border-stone-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-700">
                <MapPin className="w-4 h-4 text-[#601A24] shrink-0" />
                <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">City:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="font-bold text-stone-900 bg-transparent focus:outline-none cursor-pointer pr-1"
                  aria-label="Select City"
                >
                  {Object.keys(CITY_DETAILS).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-700">
                <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Area:</span>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="font-semibold text-stone-900 bg-transparent focus:outline-none cursor-pointer"
                  aria-label="Select Locality"
                >
                  {currentCity.localities.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FAF8F5] pl-3 pr-1.5 py-1 rounded-xl border border-stone-200 text-xs">
                <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">PIN:</span>
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => {
                    setPincodeInput(e.target.value.replace(/\D/g, ''));
                    setPincodeError(null);
                  }}
                  placeholder="226010"
                  aria-label="Enter 6-digit PIN code"
                  className="w-18 font-mono font-bold text-stone-900 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-[#601A24] hover:bg-[#4a121a] text-white text-[11px] font-semibold transition-colors"
                >
                  {bookingLoc.isLocationConfirmed &&
                  bookingLoc.pincode === pincodeInput &&
                  bookingLoc.city === selectedCity
                    ? 'Confirmed ✓'
                    : 'Check & Confirm'}
                </button>
              </div>
            </div>

            {/* Real-time Status Badge */}
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{currentCity.stylistsCount} Stylists Available</span>
              </span>
              <span className="hidden md:inline text-stone-400">·</span>
              <span className="hidden md:inline font-mono text-stone-700">
                Earliest Slot: <strong className="text-stone-900">{currentCity.nextSlot}</strong>
              </span>
            </div>
          </div>

          {pincodeError && (
            <p className="text-[11px] text-rose-600 font-medium px-1">{pincodeError}</p>
          )}
        </form>

        {/* Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          
          {/* Left Text & Search Block */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#601A24]">
              <span className="w-2 h-2 rounded-full bg-[#601A24]" />
              <span>India's Most Transparent At-Home Salon in {selectedCity}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-stone-900 leading-[1.14] text-balance">
              Salon at home, with 100% sealed branded kits.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
              Book certified women cosmetologists in {selectedLocality}. Authentic mono-dose kits from VLCC, Lotus, and O3+ unsealed before you. Pay only for what you use.
            </p>

            {/* Quick Search Widget */}
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Rica waxing, Lotus facial, hair spa, manicure..."
                  className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm pl-11 pr-28 py-3.5 rounded-xl border border-stone-200/90 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#601A24]/20 focus:border-[#601A24]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-[11px] text-stone-500">
                <span className="font-medium text-stone-400">Popular:</span>
                {['Rica Waxing', 'Lotus Facial', 'Hair Spa', 'D-Tan Cleanup', 'Bridal HD'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/search?q=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200/80">
              <div>
                <span className="font-editorial text-2xl font-bold text-stone-900 tabular-nums block">100%</span>
                <span className="text-[11px] text-stone-500 font-medium">Sealed Mono-Doses</span>
              </div>
              <div>
                <div className="flex items-center gap-1 font-editorial text-2xl font-bold text-stone-900 tabular-nums">
                  <Star className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
                  <span>4.9</span>
                </div>
                <span className="text-[11px] text-stone-500 font-medium">12,000+ Happy Clients</span>
              </div>
              <div>
                <span className="font-editorial text-2xl font-bold text-stone-900 tabular-nums block">₹0</span>
                <span className="text-[11px] text-stone-500 font-medium">Travel & Setup Fee</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-200 aspect-[4/3] bg-stone-100">
              <img
                src="/images/beautiva_hero_luxury_1792923326581.jpg"
                alt="Beautiva luxury at-home parlor therapy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/80 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    ✓ Beautiva Verified Hygiene Protocol
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    Beautician with Sealed Kit & Sanitized Apron
                  </span>
                </div>
                <Link
                  to="/services"
                  className="px-3 py-1.5 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shrink-0 shadow-2xs"
                >
                  Book Slot
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Visual Strip (Interactive Icons Carousel / Grid) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#601A24]" />
              <span>Explore Categories & Treatments</span>
            </span>
            <Link
              to="/services"
              className="text-xs font-semibold text-[#601A24] hover:underline flex items-center gap-1"
            >
              <span>All 30+ Treatments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const iconMeta = CATEGORY_ICONS[cat.slug] || { emoji: '✨', color: 'bg-stone-50 border-stone-200 text-stone-800' };
              return (
                <Link
                  key={cat.id}
                  to={`/services/${cat.slug}`}
                  className="group flex flex-col items-center bg-white hover:bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/90 hover:border-[#601A24]/40 hover:shadow-xs transition-all text-center cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-2 transition-transform group-hover:scale-110 shadow-2xs border ${iconMeta.color}`}>
                    <span>{iconMeta.emoji}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-stone-900 group-hover:text-[#601A24] transition-colors leading-tight truncate w-full">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-stone-400 mt-0.5 font-mono">
                    {cat.itemCount} packages
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
