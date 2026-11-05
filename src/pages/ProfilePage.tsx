import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, updateProfile } from '../store/features/auth/authSlice';
import { useToast } from '../components/common/ToastProvider';
import { formatCurrency } from '../lib/currency';
import { Order } from '../types/order';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const user = useAppSelector((state) => state.auth.user);

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const [editName, setEditName] = useState(user?.name || 'Priya Verma');
  const [editEmail, setEditEmail] = useState(user?.email || 'priya.verma@example.com');
  const [editPhone, setEditPhone] = useState(user?.phone || '9876543210');
  const [editAddress, setEditAddress] = useState(user?.address || 'Flat 402, Shalimar Gallant, Mahanagar, Lucknow');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('beautiva_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Mock seed sample order if none
        const sampleOrder: Order = {
          id: 'SL-783921',
          date: '16 Oct 2026',
          items: [
            {
              product: {
                id: 'lotus-whiteglow-package',
                slug: 'lotus-whiteglow-package',
                title: 'Lotus WhiteGlow Package',
                brand: 'Lotus Herbals',
                category: 'Facial & Skincare',
                categoryId: 'facials-skincare',
                price: 1090,
                originalPrice: 1850,
                discountPercent: 41,
                durationMinutes: 90,
                description: '',
                shortDescription: 'Lotus WhiteGlow Skin Whitening Facial + Face & Neck Bleach + Threading.',
                image: '/images/beautiva_hero_luxury_1792923326581.jpg',
                inclusions: [],
                safetyProtocol: []
              },
              quantity: 1
            }
          ],
          address: {
            fullName: user?.name || 'Priya Verma',
            phone: user?.phone || '9876543210',
            email: user?.email || 'priya.verma@example.com',
            houseFlat: 'Flat 402',
            streetArea: 'Shalimar Gallant, Mahanagar',
            city: 'Lucknow',
            pincode: '226006',
            serviceDate: '2026-10-28',
            serviceTimeSlot: '11:30 AM - 02:00 PM'
          },
          subtotal: 1090,
          discount: 760,
          tax: 0,
          total: 1090,
          status: 'confirmed',
          assignedBeautician: {
            name: 'Pooja Rawat (Senior Stylist)',
            verified: true,
            rating: 4.9
          }
        };
        setOrders([sampleOrder]);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
      })
    );
    showToast('Profile information updated successfully');
  };

  const handleLogout = () => {
    dispatch(logout());
    showToast('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Customer Account</span>
        </nav>

        {/* User Card Top */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#601A24] text-white flex items-center justify-center font-bold text-lg font-editorial">
              {(user?.name || 'Priya Verma').charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-editorial font-bold text-stone-900">
                {user?.name || 'Priya Verma'}
              </h1>
              <p className="text-xs text-stone-500">
                {user?.email || 'priya.verma@example.com'} · {user?.city || 'Lucknow'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/wishlist"
              className="px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Wishlist</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Controls (Zero-pill compliant segmented buttons) */}
        <div className="flex items-center gap-2 p-1 bg-stone-200/60 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Bookings ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved Details & Address
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
                <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h3 className="font-semibold text-stone-800 text-base">No appointments yet</h3>
                <p className="text-xs text-stone-500 mt-1">Book your first doorstep salon package.</p>
                <Link
                  to="/services"
                  className="mt-4 inline-block px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a]"
                >
                  Browse Packages
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {order.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">Booked on {order.date}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-stone-900 font-mono">
                        {formatCurrency(order.total)}
                      </span>
                      <span className="text-[11px] text-stone-400 block">Pay on service</span>
                    </div>
                  </div>

                  {/* Stylist & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                        Assigned Stylist
                      </span>
                      <p className="font-semibold text-stone-900">
                        {order.assignedBeautician?.name || 'Pooja Rawat (Senior Stylist)'}
                      </p>
                      <p className="text-stone-500">Sanitized gear & sealed kits</p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                        Scheduled Slot & Address
                      </span>
                      <p className="font-semibold text-stone-900">
                        {order.address.serviceDate} · {order.address.serviceTimeSlot}
                      </p>
                      <p className="text-stone-500 truncate">
                        {order.address.houseFlat}, {order.address.streetArea}, {order.address.city}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 pt-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-stone-700">
                        <span>
                          {item.quantity}x {item.product.title}
                          {item.selectedOption ? ` (${item.selectedOption.name})` : ''}
                        </span>
                        <span className="font-mono text-stone-900">
                          {formatCurrency((item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">Free cancellation up to 2 hours before slot</span>
                    <Link
                      to="/services"
                      className="text-xs font-semibold text-[#601A24] hover:underline"
                    >
                      Book Again →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-4 max-w-2xl">
            <h2 className="text-base font-bold text-stone-900 mb-2">Edit Account & Delivery Info</h2>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Default Service Address</label>
              <textarea
                rows={3}
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-xs"
            >
              Save Profile Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
