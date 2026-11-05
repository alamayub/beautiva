import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CalendarCheck, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown,
  MapPin
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openCartDrawer } from '../../store/features/cart/cartSlice';
import { AnnouncementBar } from './AnnouncementBar';
import { CartDrawer } from './CartDrawer';
import { categories } from '../../data/categories';
import { formatDuration } from '../../lib/duration';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const user = useAppSelector((state) => state.auth.user);
  const bookingLoc = useAppSelector((state) => state.booking);

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalMinutes = cartItems.reduce(
    (acc, i) => acc + i.product.durationMinutes * i.quantity,
    0
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for category dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-18">
            {/* Zone 1: Wordmark */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <img
                  src="/images/beautiva_logo.jpg"
                  alt="Beautiva Logo"
                  className="w-8 h-8 rounded-lg object-cover border border-stone-200 shadow-2xs"
                />
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#601A24] group-hover:text-[#4a121a] transition-colors whitespace-nowrap">
                  Beautiva<span className="text-[#D47A83]">.in</span>
                </span>
              </Link>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
              <div className="relative" ref={categoryMenuRef}>
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex items-center gap-1 hover:text-[#601A24] transition-colors py-2 whitespace-nowrap"
                  aria-expanded={categoryDropdownOpen}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 mt-1 z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        At-Home Categories
                      </span>
                    </div>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/services/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-[#FAF8F5] transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-stone-900">{cat.name}</p>
                          <p className="text-xs text-stone-500">{cat.tagline}</p>
                        </div>
                        <span className="text-xs font-mono text-stone-400">
                          {cat.itemCount}
                        </span>
                      </Link>
                    ))}
                    <div className="px-4 pt-2 pb-1 border-t border-stone-100">
                      <Link
                        to="/services"
                        className="text-xs font-semibold text-[#601A24] hover:underline block text-center py-1"
                      >
                        View All Services & Packages →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/services" className="hover:text-[#601A24] transition-colors whitespace-nowrap">
                Packages
              </Link>
              <Link to="/brands" className="hover:text-[#601A24] transition-colors whitespace-nowrap">
                Brands
              </Link>
              <Link to="/offers" className="hover:text-[#601A24] transition-colors whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D47A83]" />
                <span>Offers</span>
              </Link>
              <Link to="/beauty-school" className="hover:text-[#601A24] transition-colors whitespace-nowrap">
                Beauty School
              </Link>
              <Link 
                to="/admin" 
                className="text-xs px-2.5 py-1 rounded-md bg-[#601A24]/10 hover:bg-[#601A24] text-[#601A24] hover:text-white transition-colors whitespace-nowrap font-bold"
              >
                Ops Dashboard
              </Link>
            </nav>

            {/* Zone 3: Actions (Location, Wishlist, User, Booking) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Location Pill */}
              <Link
                to="/services"
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  bookingLoc.isLocationConfirmed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
                title="Confirm or change your city & PIN code"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[130px]">
                  {bookingLoc.isLocationConfirmed
                    ? `${bookingLoc.city} · ${bookingLoc.pincode}`
                    : 'Check PIN'}
                </span>
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D47A83] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                to={user?.isLoggedIn ? '/profile' : '/login'}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg transition-colors flex items-center gap-1.5"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
                {user?.isLoggedIn && (
                  <span className="hidden md:inline text-xs font-medium text-stone-700 truncate max-w-[80px]">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </Link>

              {/* Booking Drawer Trigger */}
              <button
                onClick={() => dispatch(openCartDrawer())}
                className="flex items-center gap-2 bg-[#601A24] text-white px-3.5 py-2 rounded-lg hover:bg-[#4a121a] transition-colors shadow-sm"
                aria-label="Open service booking drawer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span className="text-xs font-semibold hidden sm:inline">Booking</span>
                <span className="bg-white/20 text-white text-xs px-1.5 py-0.2 rounded font-mono font-semibold">
                  {totalCartCount}
                  {totalMinutes > 0 ? ` · ${formatDuration(totalMinutes)}` : ''}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/services"
                className="p-2.5 rounded-lg bg-stone-50 font-medium text-stone-800 hover:bg-stone-100"
              >
                All Packages
              </Link>
              <Link
                to="/brands"
                className="p-2.5 rounded-lg bg-stone-50 font-medium text-stone-800 hover:bg-stone-100"
              >
                Top Brands
              </Link>
              <Link
                to="/offers"
                className="p-2.5 rounded-lg bg-stone-50 font-medium text-stone-800 hover:bg-stone-100"
              >
                Exclusive Offers
              </Link>
              <Link
                to="/beauty-school"
                className="p-2.5 rounded-lg bg-stone-50 font-medium text-stone-800 hover:bg-stone-100"
              >
                Beauty School
              </Link>
              <Link
                to="/admin"
                className="p-2.5 rounded-lg bg-[#601A24] font-bold text-white hover:bg-[#4a121a] col-span-2 text-center shadow-xs"
              >
                Open Operations & Dispatch Dashboard ↗
              </Link>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Popular Categories
              </p>
              <div className="space-y-1">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/services/${c.slug}`}
                    className="block py-1.5 text-sm text-stone-700 hover:text-[#601A24]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1 text-xs text-stone-500">
              <span>Customer Care: +91 7236851999 / +91 7007017309</span>
              <Link to="/contact-us" className="text-[#601A24] font-medium">
                Support Helpdesk
              </Link>
            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
};
