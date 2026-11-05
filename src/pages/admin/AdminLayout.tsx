import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  Package, 
  GraduationCap, 
  BarChart3, 
  ArrowUpRight, 
  Bell, 
  Menu, 
  X, 
  ChevronRight,
  MapPin,
  Sparkles,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft
} from 'lucide-react';
import { useToast } from '../../components/common/ToastProvider';

interface AdminLayoutProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  bookingCount: number;
  lowStockCount: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  selectedCity,
  setSelectedCity,
  bookingCount,
  lowStockCount
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Mobile drawer open state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop collapsed (icon-only rail) state - persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('beautiva_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [notificationOpen, setNotificationOpen] = useState(false);

  // Toggle collapsed state and persist
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('beautiva_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut (Cmd+B or Ctrl+B) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      to: '/admin',
      label: 'Ops Overview',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      exact: true
    },
    {
      to: '/admin/bookings',
      label: 'Live Dispatch & Bookings',
      shortLabel: 'Bookings',
      icon: CalendarClock,
      badge: bookingCount > 0 ? bookingCount : undefined,
      badgeColor: 'bg-[#601A24] text-white'
    },
    {
      to: '/admin/stylists',
      label: 'Stylist Fleet (Partners)',
      shortLabel: 'Stylists',
      icon: Users,
    },
    {
      to: '/admin/catalog',
      label: 'Service Catalog (CRUD)',
      shortLabel: 'Catalog',
      icon: Sparkles,
    },
    {
      to: '/admin/inventory',
      label: 'Sealed Kit Inventory',
      shortLabel: 'Inventory',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      to: '/admin/academy',
      label: 'Beauty School Academy',
      shortLabel: 'Academy',
      icon: GraduationCap,
    },
    {
      to: '/admin/analytics',
      label: 'City Analytics & Growth',
      shortLabel: 'Analytics',
      icon: BarChart3,
    }
  ];

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p === '/admin') return 'Overview';
    if (p.includes('/bookings')) return 'Live Bookings & Dispatch';
    if (p.includes('/catalog')) return 'Service Catalog (CRUD)';
    if (p.includes('/stylists')) return 'Stylist Fleet';
    if (p.includes('/inventory')) return 'Sealed Kit Inventory';
    if (p.includes('/academy')) return 'Beauty School Trainees';
    if (p.includes('/analytics')) return 'City Analytics';
    return 'Console';
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-stone-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 h-screen bg-[#141112] text-stone-300 flex flex-col justify-between z-50 transition-all duration-300 ease-in-out border-r border-[#261F21] shrink-0 select-none ${
          // Mobile open/close
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop expanded vs collapsed width
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-3' : 'p-5'}`}>
          {/* Brand Wordmark & Collapse Button Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#261F21] mb-5 min-h-[52px]">
            {isCollapsed ? (
              // Collapsed Header View (Icon + Expand Toggle)
              <div className="w-full flex flex-col items-center gap-2">
                <img
                  src="/images/beautiva_icon.jpg"
                  alt="Beautiva Operations"
                  title="Beautiva Operations"
                  className="w-10 h-10 rounded-xl object-cover border border-[#7A222F]/60 shadow-xs"
                />
                <button
                  onClick={toggleCollapse}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-stone-400 hover:text-white hover:bg-[#261F21] transition-colors"
                  title="Expand sidebar (Ctrl+B)"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Expanded Header View
              <>
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/beautiva_icon.jpg"
                    alt="Beautiva"
                    className="w-9 h-9 rounded-xl object-cover border border-[#7A222F]/60 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-editorial text-xl font-bold tracking-tight text-white">
                        Beautiva
                      </span>
                      <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#D47A83] pl-2 border-l border-stone-700">
                        OPS
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 truncate max-w-[140px]">
                      Sitkan Enterprises Console
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Desktop collapse toggle */}
                  <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-stone-400 hover:text-white hover:bg-[#261F21] transition-colors"
                    title="Collapse sidebar to icons (Ctrl+B)"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                  {/* Mobile close toggle */}
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Regional Hub Selector */}
          {isCollapsed ? (
            <div className="mb-5 relative group flex justify-center">
              <div 
                className="w-11 h-11 rounded-xl bg-[#1D1819] border border-[#2B2224] flex items-center justify-center text-stone-300 hover:text-white hover:border-stone-600 transition-colors relative cursor-pointer shadow-xs"
                title={`Active Regional Hub: ${selectedCity === 'all' ? 'All Operational Cities' : selectedCity}`}
              >
                <MapPin className="w-4 h-4 text-[#D47A83]" />
                <span className="sr-only">Active Hub</span>
                {/* Invisible select over icon to permit direct city switching even in collapsed state */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-xs"
                  title="Click to switch city hub"
                >
                  <option value="all" className="bg-[#141112] text-white">All Cities</option>
                  <option value="Lucknow" className="bg-[#141112] text-white">Lucknow Hub</option>
                  <option value="Patna" className="bg-[#141112] text-white">Patna Hub</option>
                  <option value="Kanpur" className="bg-[#141112] text-white">Kanpur Hub</option>
                  <option value="Gorakhpur" className="bg-[#141112] text-white">Gorakhpur Hub</option>
                  <option value="Varanasi" className="bg-[#141112] text-white">Varanasi Hub</option>
                </select>
              </div>
              {/* Tooltip on hover */}
              <div className="hidden group-hover:flex items-center absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1C1819] text-white text-xs font-semibold rounded-lg shadow-xl border border-stone-800 whitespace-nowrap z-50 pointer-events-none">
                <span>Hub: {selectedCity === 'all' ? 'All Cities' : `${selectedCity} Hub`}</span>
                <span className="text-[10px] text-stone-400 ml-1.5">(Click to switch)</span>
              </div>
            </div>
          ) : (
            <div className="mb-5 p-2.5 rounded-xl bg-[#1D1819] border border-[#2B2224]">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Active Regional Hub
              </span>
              <div className="flex items-center gap-1.5 text-xs text-white">
                <MapPin className="w-3.5 h-3.5 text-[#D47A83] shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs text-white font-medium focus:outline-none w-full cursor-pointer"
                >
                  <option value="all" className="bg-[#141112] text-white">All Operational Cities</option>
                  <option value="Lucknow" className="bg-[#141112] text-white">Lucknow Hub (HQ)</option>
                  <option value="Patna" className="bg-[#141112] text-white">Patna Hub</option>
                  <option value="Kanpur" className="bg-[#141112] text-white">Kanpur Hub</option>
                  <option value="Gorakhpur" className="bg-[#141112] text-white">Gorakhpur Hub</option>
                  <option value="Varanasi" className="bg-[#141112] text-white">Varanasi Hub</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              if (isCollapsed) {
                // Collapsed: Icon-Only Rail with Floating Tooltips
                return (
                  <div key={item.to} className="group relative flex justify-center">
                    <Link
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all relative ${
                        isActive
                          ? 'bg-[#601A24] text-white shadow-xs border border-[#7A222F]/60'
                          : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                      }`}
                      aria-label={item.label}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {item.badge && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D47A83] border border-[#141112]" />
                      )}
                    </Link>

                    {/* Floating Hover Tooltip */}
                    <div className="hidden group-hover:flex items-center absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1C1819] text-white text-xs font-semibold rounded-lg shadow-xl border border-stone-800 whitespace-nowrap z-50 pointer-events-none">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-[#601A24] text-rose-200 font-mono font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              // Expanded: Standard Full Width Navigation Item
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#601A24] text-white shadow-xs border border-[#7A222F]/60 font-semibold'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${item.badgeColor || 'bg-stone-800 text-stone-300'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Storefront, Profile & Sidebar Toggle Control */}
        <div className={`border-t border-[#261F21] bg-[#110E0F] ${isCollapsed ? 'p-2.5 space-y-2' : 'p-3.5 space-y-3'}`}>
          {/* Public Storefront Link */}
          {isCollapsed ? (
            <div className="group relative flex justify-center">
              <Link
                to="/"
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#1D1819] hover:bg-stone-800 text-rose-200 border border-[#2B2224] transition-colors"
                aria-label="Public Storefront"
              >
                <Sparkles className="w-4 h-4 text-[#D47A83]" />
              </Link>
              <div className="hidden group-hover:flex items-center gap-1.5 absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1C1819] text-white text-xs font-semibold rounded-lg shadow-xl border border-stone-800 whitespace-nowrap z-50 pointer-events-none">
                <span>Public Storefront</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#1A1617] hover:bg-stone-800/80 text-xs font-medium text-rose-200 transition-colors border border-[#2B2224]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D47A83]" />
                Public Storefront
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          )}

          {/* Profile & Sign Out */}
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2 pt-1 border-t border-stone-800/60">
              <div
                className="w-9 h-9 rounded-full bg-[#601A24] text-white flex items-center justify-center font-bold text-[11px] shadow-xs cursor-default"
                title="Sitkan Ops (Chief Coordinator)"
              >
                SE
              </div>
              <button
                onClick={() => {
                  showToast('Signed out of admin console');
                  navigate('/');
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                title="Sign Out to Public Site"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Bottom Expand Toggle in Collapsed Mode */}
              <button
                onClick={toggleCollapse}
                className="w-9 h-9 rounded-xl hidden lg:flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs truncate">
                  <div className="w-7 h-7 rounded-full bg-[#601A24] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    SE
                  </div>
                  <div className="truncate max-w-[120px]">
                    <p className="text-white font-semibold truncate leading-tight">Sitkan Ops</p>
                    <p className="text-[10px] text-stone-400">Chief Coordinator</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('Signed out of admin console');
                    navigate('/');
                  }}
                  className="text-stone-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-stone-900 transition-colors"
                  title="Sign Out to Public Site"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Collapse Toggle Row */}
              <button
                onClick={toggleCollapse}
                className="w-full hidden lg:flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-stone-400 hover:text-white hover:bg-stone-900 border border-stone-800/50 transition-colors"
                title="Collapse sidebar (Ctrl+B)"
              >
                <span className="flex items-center gap-1.5">
                  <PanelLeftClose className="w-3.5 h-3.5 text-stone-500" />
                  <span>Collapse Sidebar</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500 bg-stone-800 px-1.5 py-0.5 rounded">
                  Ctrl+B
                </span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <span className="hidden sm:inline font-medium">Beautiva Ops</span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="font-bold text-stone-900">{getBreadcrumb()}</span>
              {selectedCity !== 'all' && (
                <span className="text-[11px] font-semibold text-[#601A24] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded ml-2">
                  {selectedCity} Hub
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Public Link */}
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <span>View Customer Site</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#601A24]" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50 text-xs">
                  <div className="font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center justify-between">
                    <span>Recent Operational Alerts</span>
                    <span className="text-[10px] text-stone-400 font-mono">Live</span>
                  </div>
                  <div className="divide-y divide-stone-100 py-1 space-y-1">
                    <div className="py-1.5">
                      <p className="font-semibold text-stone-800">New Booking: Kavita M.</p>
                      <p className="text-[11px] text-stone-500">Gomti Nagar, Lucknow · Lotus WhiteGlow</p>
                    </div>
                    <div className="py-1.5">
                      <p className="font-semibold text-amber-700">Low Stock: O3+ Derma Mono-dose</p>
                      <p className="text-[11px] text-stone-500">Current stock: 9 kits (Reorder triggered)</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-stone-100 text-center">
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="text-[11px] font-semibold text-[#601A24] hover:underline"
                    >
                      Dismiss Alerts
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

