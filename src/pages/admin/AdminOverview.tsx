import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  CalendarClock, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles,
  Calendar,
  CalendarRange,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { BookingRecord, StylistRecord, InventoryItem } from '../../data/dashboardData';
import { formatCurrency } from '../../lib/currency';
import { ActionMenu } from '../../components/common/ActionMenu';

interface AdminOverviewProps {
  bookings: BookingRecord[];
  stylists: StylistRecord[];
  inventory: InventoryItem[];
  selectedCity: string;
  onUpdateBookingStatus: (id: string, status: BookingRecord['status']) => void;
}

// Date helpers
const getTodayDateStr = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const addDaysToStr = (dateStr: string, days: number) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const ry = dt.getFullYear();
  const rm = String(dt.getMonth() + 1).padStart(2, '0');
  const rd = String(dt.getDate()).padStart(2, '0');
  return `${ry}-${rm}-${rd}`;
};

const formatDatePretty = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });
};

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  bookings,
  stylists,
  inventory,
  selectedCity,
  onUpdateBookingStatus
}) => {
  // Filter states for live appointments
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'tomorrow' | 'next_7' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const filteredBookings = bookings.filter(
    (b) => selectedCity === 'all' || b.city === selectedCity
  );

  const filteredStylists = stylists.filter(
    (s) => selectedCity === 'all' || s.city === selectedCity
  );

  const lowStockItems = inventory.filter((i) => i.status === 'low_stock' || i.currentStock <= i.minThreshold);

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0) + 842000;
  const inProgressCount = filteredBookings.filter((b) => b.status === 'in_progress' || b.status === 'assigned').length;
  const onDutyStylists = filteredStylists.filter((s) => s.status !== 'off_duty').length;
  const totalStockUnits = inventory.reduce((sum, i) => sum + i.currentStock, 0);

  // Available services in current city
  const availableServices = useMemo(() => {
    const set = new Set<string>();
    filteredBookings.forEach((b) => b.serviceNames.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [filteredBookings]);

  // Apply date preset
  const handleDatePreset = (preset: 'all' | 'today' | 'tomorrow' | 'next_7') => {
    const today = getTodayDateStr();
    setDatePreset(preset);
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === 'tomorrow') {
      const tomorrow = addDaysToStr(today, 1);
      setStartDate(tomorrow);
      setEndDate(tomorrow);
    } else if (preset === 'next_7') {
      setStartDate(today);
      setEndDate(addDaysToStr(today, 7));
    }
  };

  // Filtered appointments for overview queue
  const overviewAppointments = useMemo(() => {
    return filteredBookings.filter((b) => {
      if (staffFilter !== 'all') {
        if (staffFilter === 'unassigned') {
          if (b.assignedStylistId || b.assignedStylistName) return false;
        } else {
          if (b.assignedStylistId !== staffFilter && b.assignedStylistName !== staffFilter) {
            return false;
          }
        }
      }
      if (serviceFilter !== 'all') {
        if (!b.serviceNames.some((s) => s.toLowerCase() === serviceFilter.toLowerCase())) {
          return false;
        }
      }
      if (startDate && b.date < startDate) return false;
      if (endDate && b.date > endDate) return false;
      return true;
    });
  }, [filteredBookings, staffFilter, serviceFilter, startDate, endDate]);

  const hasOverviewFilters = staffFilter !== 'all' || serviceFilter !== 'all' || startDate || endDate;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#601A24]">
            Operations Fleet Console
          </span>
          <h1 className="text-2xl font-editorial font-bold text-stone-900 mt-0.5">
            Doorstep Fleet & Dispatch Ledger
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Coordinating doorstep parlor visits, background-verified cosmetologists, and single-use sealed kits across Uttar Pradesh and Bihar hubs.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-all shadow-xs"
          >
            Dispatch Ledger
          </Link>
          <Link
            to="/admin/inventory"
            className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-200 transition-colors border border-stone-200/60"
          >
            Buffer Stock
          </Link>
        </div>
      </div>

      {/* KPI Row (Refined Executive Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Gross Monthly Revenue</span>
            <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/60">+18.4%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight tabular-nums">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Regional fleet billing across all active hubs
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Dispatch Pipeline</span>
            <span className="text-xs font-mono font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">Active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight tabular-nums">
            {inProgressCount} <span className="text-xs font-normal text-stone-400 font-sans">Appointments</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {filteredBookings.filter((b) => b.status === 'pending').length} pending stylist assignment
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Stylists On Field</span>
            <span className="text-xs font-mono font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">Live</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight tabular-nums">
            {onDutyStylists} <span className="text-xs font-normal text-stone-400 font-sans">/ {filteredStylists.length} Active</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            100% Police & Academy Verified Partners
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-stone-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Sealed Kit Buffer</span>
            <span className="text-xs font-mono font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              {lowStockItems.length} Low
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tracking-tight tabular-nums">
            {totalStockUnits} <span className="text-xs font-normal text-stone-400 font-sans">Units</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Mono-dose sterile cosmetic packages
          </p>
        </div>
      </div>

      {/* Main Grid: Live Queue Left + Logistics/Hubs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Bookings Queue with Date/Staff/Service Filters */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Card Header */}
          <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-stone-900">
                  Live Doorstep Appointments ({overviewAppointments.length})
                </h2>
                {hasOverviewFilters && (
                  <span className="text-[10px] bg-rose-50 border border-rose-200 text-[#601A24] font-semibold px-2 py-0.5 rounded-full">
                    Filtered
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Real-time appointment schedule with quick date range, staff, and service filters.
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-[#601A24] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Filter Bar for Overview */}
          <div className="p-3 bg-stone-50/70 border-b border-stone-100 space-y-2.5 text-xs">
            {/* Quick date preset buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#601A24]" />
                  <span>Date:</span>
                </span>
                {[
                  { id: 'all', label: 'All Dates' },
                  { id: 'today', label: 'Today' },
                  { id: 'tomorrow', label: 'Tomorrow' },
                  { id: 'next_7', label: 'Next 7 Days' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleDatePreset(p.id as any)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      datePreset === p.id && !startDate && !endDate
                        ? 'bg-[#601A24] text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Reset filter button */}
              {hasOverviewFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setDatePreset('all');
                    setStartDate('');
                    setEndDate('');
                    setStaffFilter('all');
                    setServiceFilter('all');
                  }}
                  className="text-[11px] text-[#601A24] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Inputs: Date Range + Staff + Service Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {/* Custom Date Range */}
              <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg px-2 py-1">
                <CalendarRange className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full text-[11px] text-stone-700 bg-transparent focus:outline-none cursor-pointer"
                  title="Start Date"
                />
                <span className="text-stone-300 text-[10px]">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full text-[11px] text-stone-700 bg-transparent focus:outline-none cursor-pointer"
                  title="End Date"
                />
              </div>

              {/* Staff Select */}
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2 py-1">
                <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <select
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className="w-full text-[11px] text-stone-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">All Staff Partners</option>
                  <option value="unassigned">⚠️ Unassigned Only</option>
                  {stylists.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Select */}
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2 py-1">
                <Sparkles className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full text-[11px] text-stone-800 bg-transparent focus:outline-none cursor-pointer truncate"
                >
                  <option value="all">All Service Types</option>
                  {availableServices.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* List of Appointments */}
          <div className="divide-y divide-stone-100 overflow-x-auto">
            {overviewAppointments.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                <CalendarRange className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="font-semibold text-stone-700">No appointments found</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Try adjusting the date range, staff, or service filters.
                </p>
              </div>
            ) : (
              overviewAppointments.slice(0, 6).map((booking) => (
                <div key={booking.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-stone-900">{booking.id}</span>
                      <span className="text-[11px] text-stone-400">·</span>
                      <span className="text-xs font-semibold text-stone-800">{booking.customerName}</span>
                      <span className="text-[10px] text-stone-500 font-mono">({booking.phone})</span>
                      {booking.assignedStylistName ? (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {booking.assignedStylistName}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#601A24] font-medium truncate">
                      {booking.serviceNames.join(' + ')}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1 font-semibold text-stone-700">
                        <Calendar className="w-3 h-3 text-[#601A24]" />
                        <span>{formatDatePretty(booking.date)}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{booking.timeSlot}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{booking.locality}, {booking.city}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-stone-900 block">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                      <span className="text-[10px] text-stone-400 capitalize">
                        {booking.paymentMethod}
                      </span>
                    </div>

                    {/* Status Controller */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={booking.status}
                        onChange={(e) => onUpdateBookingStatus(booking.id, e.target.value as any)}
                        className={`text-[11px] font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                          booking.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : booking.status === 'in_progress'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : booking.status === 'assigned'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : booking.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_transit">In Transit</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <ActionMenu
                        items={[
                          {
                            label: 'Set In Progress',
                            onClick: () => onUpdateBookingStatus(booking.id, 'in_progress'),
                            disabled: booking.status === 'in_progress' || booking.status === 'completed'
                          },
                          {
                            label: 'Mark Completed',
                            onClick: () => onUpdateBookingStatus(booking.id, 'completed'),
                            disabled: booking.status === 'completed' || booking.status === 'cancelled'
                          },
                          {
                            label: 'Cancel Appointment',
                            variant: 'danger',
                            onClick: () => onUpdateBookingStatus(booking.id, 'cancelled'),
                            disabled: booking.status === 'cancelled',
                            divider: true
                          }
                        ]}
                        ariaLabel={`Quick actions for booking ${booking.id}`}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Inventory Alerts & City Hub Share */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Alert Box */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Mono-Dose Buffer Watch</span>
              </div>
              <Link to="/admin/inventory" className="text-[11px] text-[#601A24] font-semibold hover:underline">
                Restock →
              </Link>
            </div>

            <p className="text-xs text-stone-500">
              Mono-dose kits that need replenishing from verified distributors:
            </p>

            <div className="space-y-2 pt-1">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-stone-900 block">{item.productName}</span>
                    <span className="text-[10px] text-stone-500 font-mono">Min: {item.minThreshold} {item.unit}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                    {item.currentStock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Hub Share */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              City Booking Volume
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-medium text-stone-800 mb-1">
                  <span>Lucknow (Chinhat HQ, Gomti Nagar)</span>
                  <span className="font-mono font-bold">52%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#601A24] h-1.5 rounded-full" style={{ width: '52%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-stone-800 mb-1">
                  <span>Patna (Patliputra, Boring Rd)</span>
                  <span className="font-mono font-bold">26%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#601A24] h-1.5 rounded-full" style={{ width: '26%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-stone-800 mb-1">
                  <span>Kanpur (Swaroop Nagar)</span>
                  <span className="font-mono font-bold">12%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#601A24] h-1.5 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-stone-800 mb-1">
                  <span>Varanasi & Gorakhpur</span>
                  <span className="font-mono font-bold">10%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#601A24] h-1.5 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
