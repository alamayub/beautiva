import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  Check, 
  Ban, 
  Truck, 
  Play,
  Calendar,
  CalendarDays,
  CalendarRange,
  Users,
  Sparkles,
  MapPin,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  IndianRupee,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { BookingRecord, StylistRecord } from '../../data/dashboardData';
import { formatCurrency } from '../../lib/currency';
import { useToast } from '../../components/common/ToastProvider';
import { DataTable, ColumnDef, FilterDef } from '../../components/common/DataTable';
import { ActionMenu, ActionMenuItem } from '../../components/common/ActionMenu';

interface AdminBookingsProps {
  bookings: BookingRecord[];
  stylists: StylistRecord[];
  selectedCity: string;
  onUpdateBooking: (updated: BookingRecord) => void;
  onAddBooking: (newBooking: BookingRecord) => void;
}

// Date calculation helpers
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
    month: 'short',
    year: 'numeric'
  });
};

export const AdminBookings: React.FC<AdminBookingsProps> = ({
  bookings,
  stylists,
  selectedCity,
  onUpdateBooking,
  onAddBooking
}) => {
  const { showToast } = useToast();
  
  // Primary Filters
  const [cityFilter, setCityFilter] = useState<string>(selectedCity);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all'); // 'all' | 'unassigned' | stylistId
  const [serviceFilter, setServiceFilter] = useState<string>('all'); // 'all' | serviceName

  // Date Range Filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeDatePreset, setActiveDatePreset] = useState<string>('all');

  // Inspection modal state
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync if selectedCity prop changed from header
  useEffect(() => {
    setCityFilter(selectedCity);
  }, [selectedCity]);

  // Extract all distinct services from bookings with occurrence count
  const serviceOptions = useMemo(() => {
    const countMap: Record<string, number> = {};
    bookings.forEach((b) => {
      b.serviceNames.forEach((s) => {
        countMap[s] = (countMap[s] || 0) + 1;
      });
    });
    return Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [bookings]);

  // Extract staff appointment stats
  const staffOptions = useMemo(() => {
    const unassignedCount = bookings.filter(
      (b) => !b.assignedStylistId && !b.assignedStylistName
    ).length;

    const list = stylists.map((s) => {
      const assignedCount = bookings.filter(
        (b) => b.assignedStylistId === s.id || b.assignedStylistName === s.name
      ).length;
      return {
        ...s,
        assignedCount
      };
    });

    return {
      unassignedCount,
      stylists: list
    };
  }, [bookings, stylists]);

  // Date preset handler
  const handleApplyDatePreset = (preset: 'all' | 'today' | 'tomorrow' | 'next_7' | 'past') => {
    const today = getTodayDateStr();
    setActiveDatePreset(preset);

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
    } else if (preset === 'past') {
      const yesterday = addDaysToStr(today, -1);
      setStartDate(addDaysToStr(today, -30));
      setEndDate(yesterday);
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setActiveDatePreset('custom');
  };

  const handleResetAllFilters = () => {
    setCityFilter('all');
    setStatusFilter('all');
    setStaffFilter('all');
    setServiceFilter('all');
    setStartDate('');
    setEndDate('');
    setActiveDatePreset('all');
    showToast('All filters have been reset');
  };

  const handleAssignStylist = (bookingId: string, stylistId: string) => {
    const stylist = stylists.find((s) => s.id === stylistId);
    if (!stylist) return;
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    const updated: BookingRecord = {
      ...target,
      assignedStylistId: stylist.id,
      assignedStylistName: stylist.name,
      status: target.status === 'pending' ? 'assigned' : target.status,
    };
    onUpdateBooking(updated);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(updated);
    }
    showToast(`Assigned ${stylist.name} to booking ${target.id}`);
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingRecord['status']) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;
    const updated: BookingRecord = { ...target, status: newStatus };
    onUpdateBooking(updated);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(updated);
    }
    showToast(`Updated ${target.id} status to ${newStatus.replace('_', ' ')}`);
  };

  // Multi-dimensional filtered dataset
  const preFilteredData = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Hub City Filter
      if (cityFilter !== 'all' && b.city !== cityFilter) return false;

      // 2. Dispatch Status Filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // 3. Staff / Stylist Filter
      if (staffFilter !== 'all') {
        if (staffFilter === 'unassigned') {
          if (b.assignedStylistId || b.assignedStylistName) return false;
        } else {
          // Compare by ID or name
          const match =
            b.assignedStylistId === staffFilter ||
            b.assignedStylistName === staffFilter ||
            stylists.find((s) => s.id === staffFilter)?.name === b.assignedStylistName;
          if (!match) return false;
        }
      }

      // 4. Service Filter
      if (serviceFilter !== 'all') {
        const hasService = b.serviceNames.some(
          (s) => s.toLowerCase() === serviceFilter.toLowerCase()
        );
        if (!hasService) return false;
      }

      // 5. Date Range Filter
      if (startDate && b.date < startDate) return false;
      if (endDate && b.date > endDate) return false;

      return true;
    });
  }, [bookings, cityFilter, statusFilter, staffFilter, serviceFilter, startDate, endDate, stylists]);

  // Aggregate stats on filtered data
  const filteredTotalValue = useMemo(() => {
    return preFilteredData.reduce((sum, b) => sum + b.totalAmount, 0);
  }, [preFilteredData]);

  const filteredUnassignedCount = useMemo(() => {
    return preFilteredData.filter((b) => !b.assignedStylistId && !b.assignedStylistName).length;
  }, [preFilteredData]);

  // Active filter count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (cityFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (staffFilter !== 'all') count++;
    if (serviceFilter !== 'all') count++;
    if (startDate || endDate) count++;
    return count;
  }, [cityFilter, statusFilter, staffFilter, serviceFilter, startDate, endDate]);

  const handleExportCSV = () => {
    const headers = ['Booking ID,Customer,Phone,City,Locality,Date,Slot,Services,Amount,Status,Stylist,PaymentMethod'];
    const rows = preFilteredData.map(b => 
      `"${b.id}","${b.customerName}","${b.phone}","${b.city}","${b.locality}","${b.date}","${b.timeSlot}","${b.serviceNames.join(' + ')}","${b.totalAmount}","${b.status}","${b.assignedStylistName || 'Unassigned'}","${b.paymentMethod}"`
    );
    const content = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStamp = startDate || getTodayDateStr();
    link.setAttribute('download', `beautiva_appointments_${cityFilter}_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${preFilteredData.length} filtered appointments to CSV`);
  };

  const handleCreateMockBooking = () => {
    const id = `SL-${Math.floor(10000 + Math.random() * 90000)}`;
    const effectiveDate = startDate || getTodayDateStr();
    const newB: BookingRecord = {
      id,
      customerName: 'Aarti Srivastava',
      phone: '+91 94150 99881',
      city: (cityFilter !== 'all' ? cityFilter : 'Lucknow') as BookingRecord['city'],
      locality: 'Gomti Nagar, Viram Khand',
      fullAddress: 'House 5/12, Viram Khand 3, Gomti Nagar',
      serviceNames: ['Lotus WhiteGlow Package', 'Threading'],
      totalAmount: 1290,
      date: effectiveDate,
      timeSlot: '03:30 PM - 05:30 PM',
      status: 'pending',
      paymentMethod: 'UPI on Spot',
      paymentStatus: 'pending',
      specialNotes: 'Sterilized disposables verified booking from operations portal',
      createdAt: 'Just now'
    };
    onAddBooking(newB);
    showToast(`Scheduled new appointment #${id} for ${formatDatePretty(effectiveDate)}`);
  };

  // Define Table Columns with Date & Slot front-and-center
  const columns: ColumnDef<BookingRecord>[] = [
    {
      key: 'id',
      header: 'Booking ID',
      sortable: true,
      cell: (b) => (
        <span className="font-mono font-bold text-stone-900 block">{b.id}</span>
      )
    },
    {
      key: 'date',
      header: 'Date & Slot',
      sortable: true,
      cell: (b) => (
        <div>
          <div className="font-semibold text-stone-900 flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-[#601A24] shrink-0" />
            <span>{formatDatePretty(b.date)}</span>
          </div>
          <div className="text-[11px] text-stone-500 font-mono mt-0.5 whitespace-nowrap">
            {b.timeSlot}
          </div>
        </div>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      cell: (b) => (
        <div>
          <div className="font-semibold text-stone-900">{b.customerName}</div>
          <div className="text-[11px] text-stone-400 font-mono">{b.phone}</div>
        </div>
      )
    },
    {
      key: 'serviceNames',
      header: 'Services',
      cell: (b) => (
        <div className="max-w-[220px]">
          <div className="truncate font-medium text-stone-800" title={b.serviceNames.join(', ')}>
            {b.serviceNames.join(', ')}
          </div>
          <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-[#D47A83]" />
            <span>{b.serviceNames.length} service item(s)</span>
          </div>
        </div>
      )
    },
    {
      key: 'assignedStylistName',
      header: 'Staff Partner',
      sortable: true,
      cell: (b) => {
        return b.assignedStylistName ? (
          <div>
            <div className="font-medium text-stone-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{b.assignedStylistName}</span>
            </div>
            <div className="text-[11px] text-stone-400">{b.city} Hub</div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            Unassigned
          </span>
        );
      }
    },
    {
      key: 'locality',
      header: 'Location',
      sortable: true,
      cell: (b) => (
        <div>
          <div className="font-medium text-stone-800">{b.locality}</div>
          <div className="text-[11px] text-stone-400">{b.city} Hub</div>
        </div>
      )
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      cell: (b) => (
        <span className="font-mono font-medium text-stone-900 tabular-nums">
          {formatCurrency(b.totalAmount)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (b) => {
        const config: Record<string, { dot: string; text: string; label: string }> = {
          completed: { dot: 'bg-emerald-500', text: 'text-stone-800', label: 'Completed' },
          in_progress: { dot: 'bg-indigo-500', text: 'text-stone-800', label: 'In Progress' },
          assigned: { dot: 'bg-sky-500', text: 'text-stone-800', label: 'Assigned' },
          cancelled: { dot: 'bg-rose-500', text: 'text-stone-500', label: 'Cancelled' },
          in_transit: { dot: 'bg-amber-500', text: 'text-stone-800', label: 'In Transit' },
          pending: { dot: 'bg-stone-400', text: 'text-stone-700', label: 'Pending' }
        };
        const item = config[b.status] || { dot: 'bg-stone-400', text: 'text-stone-700', label: b.status.replace('_', ' ') };

        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.text} whitespace-nowrap`}>
            <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />
            <span className="capitalize">{item.label}</span>
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (b) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: 'Inspect & Dispatch',
            icon: Eye,
            onClick: () => {
              setSelectedBooking(b);
              setIsModalOpen(true);
            },
            variant: 'primary'
          },
          {
            label: 'Mark In Transit',
            icon: Truck,
            onClick: () => handleStatusChange(b.id, 'in_transit'),
            disabled: b.status === 'in_transit' || b.status === 'completed' || b.status === 'cancelled'
          },
          {
            label: 'Mark In Progress',
            icon: Play,
            onClick: () => handleStatusChange(b.id, 'in_progress'),
            disabled: b.status === 'in_progress' || b.status === 'completed' || b.status === 'cancelled'
          },
          {
            label: 'Mark Completed',
            icon: Check,
            onClick: () => handleStatusChange(b.id, 'completed'),
            disabled: b.status === 'completed' || b.status === 'cancelled'
          },
          {
            label: 'Cancel Booking',
            icon: Ban,
            onClick: () => handleStatusChange(b.id, 'cancelled'),
            variant: 'danger',
            disabled: b.status === 'cancelled' || b.status === 'completed',
            divider: true
          }
        ];

        return (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => {
                setSelectedBooking(b);
                setIsModalOpen(true);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-[#601A24] bg-stone-100 hover:bg-[#601A24] hover:text-white rounded transition-colors"
            >
              Inspect
            </button>
            <ActionMenu items={menuItems} ariaLabel={`Actions for booking ${b.id}`} />
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-editorial font-bold text-stone-900">
              Live Dispatch & Appointments Ledger
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#601A24] text-white">
              {preFilteredData.length}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Filter doorstep bookings by date range, staff partner, service package, regional hub, and dispatch status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Export currently filtered appointments to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleCreateMockBooking}
            className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Appointment Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Filtered Appointments</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {preFilteredData.length} <span className="text-xs text-stone-400 font-normal font-sans">/ {bookings.length}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Ledger Revenue</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {formatCurrency(filteredTotalValue)}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Pending Assignments</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1 flex items-baseline gap-1.5">
            <span className={filteredUnassignedCount > 0 ? 'text-amber-800' : 'text-stone-900'}>
              {filteredUnassignedCount}
            </span>
            <span className="text-xs text-stone-400 font-normal font-sans">unassigned</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Active Date Scope</span>
          <div className="text-xs font-semibold text-stone-800 mt-2 truncate font-mono">
            {startDate || endDate ? (
              <span>
                {startDate ? formatDatePretty(startDate) : 'Earliest'} → {endDate ? formatDatePretty(endDate) : 'Latest'}
              </span>
            ) : (
              <span className="text-stone-400 font-sans font-normal">All Recorded Dates</span>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar: Integrated single-surface architecture */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        {/* Header line of filter toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#601A24]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Filter Appointments
            </span>
            {activeFiltersCount > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                {activeFiltersCount} active
              </span>
            )}
          </div>

          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-stone-400 mr-1">Presets:</span>
            <div className="inline-flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200/60">
              {[
                { id: 'all', label: 'All Dates' },
                { id: 'today', label: 'Today' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'next_7', label: 'Next 7 Days' },
                { id: 'past', label: 'Past 30d' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyDatePreset(preset.id as any)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeDatePreset === preset.id
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Inputs Grid: Clean fields without card-in-card nesting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Date Range Picker (Start & End) */}
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarRange className="w-3.5 h-3.5 text-[#601A24]" />
                <span>Date Range</span>
              </label>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setActiveDatePreset('all');
                  }}
                  className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  Clear dates
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleCustomDateChange(e.target.value, endDate)}
                  className="w-full bg-[#FAF9F7] hover:bg-[#F6F4F0] focus:bg-white border border-stone-200/90 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 transition-colors focus:outline-none focus:border-[#601A24] cursor-pointer"
                  title="Filter from start date"
                />
                <span className="text-[10px] text-stone-400 block mt-0.5">Start date</span>
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleCustomDateChange(startDate, e.target.value)}
                  className="w-full bg-[#FAF9F7] hover:bg-[#F6F4F0] focus:bg-white border border-stone-200/90 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 transition-colors focus:outline-none focus:border-[#601A24] cursor-pointer"
                  title="Filter to end date"
                />
                <span className="text-[10px] text-stone-400 block mt-0.5">End date</span>
              </div>
            </div>
          </div>

          {/* 2. Staff / Beautician Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#601A24]" />
              <span>Staff / Stylist</span>
            </label>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full bg-[#FAF9F7] hover:bg-[#F6F4F0] focus:bg-white border border-stone-200/90 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 transition-colors focus:outline-none focus:border-[#601A24] cursor-pointer"
            >
              <option value="all">All Staff ({bookings.length} total)</option>
              <option value="unassigned" className="font-semibold text-amber-700">
                ⚠️ Unassigned Queue ({staffOptions.unassignedCount})
              </option>
              <optgroup label="Assigned Stylist Partners">
                {staffOptions.stylists.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city}) · {s.assignedCount} appt(s)
                  </option>
                ))}
              </optgroup>
            </select>
            <span className="text-[10px] text-stone-400 block truncate">
              {staffFilter === 'all'
                ? 'Showing all staff & unassigned'
                : staffFilter === 'unassigned'
                ? 'Filtering unassigned queue'
                : `Filtered by ${stylists.find((s) => s.id === staffFilter)?.name || staffFilter}`}
            </span>
          </div>

          {/* 3. Service Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#601A24]" />
              <span>Service Package</span>
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-[#FAF9F7] hover:bg-[#F6F4F0] focus:bg-white border border-stone-200/90 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 transition-colors focus:outline-none focus:border-[#601A24] cursor-pointer"
            >
              <option value="all">All Service Packages</option>
              {serviceOptions.map((svc) => (
                <option key={svc.name} value={svc.name}>
                  {svc.name} ({svc.count})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-stone-400 block truncate">
              {serviceFilter === 'all' ? 'All catalog services' : serviceFilter}
            </span>
          </div>
        </div>

        {/* Secondary Filter Row: Hub City, Dispatch Status, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Hub City Selector */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-medium text-stone-500">Hub:</span>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-[#FAF9F7] border border-stone-200/90 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#601A24] cursor-pointer"
              >
                <option value="all">All Hub Cities</option>
                <option value="Lucknow">Lucknow Hub</option>
                <option value="Patna">Patna Hub</option>
                <option value="Kanpur">Kanpur Hub</option>
                <option value="Gorakhpur">Gorakhpur Hub</option>
                <option value="Varanasi">Varanasi Hub</option>
              </select>
            </div>

            {/* Dispatch Status Selector */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-medium text-stone-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAF9F7] border border-stone-200/90 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#601A24] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_transit">In Transit</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Reset Filters button */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#601A24] hover:bg-stone-50 rounded-lg border border-[#601A24]/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {/* Active Filter Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Active:
            </span>

            {/* Date Tag */}
            {(startDate || endDate) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-800">
                <Calendar className="w-3 h-3 text-[#601A24]" />
                <span>
                  Date: {startDate ? formatDatePretty(startDate) : 'Any'} → {endDate ? formatDatePretty(endDate) : 'Any'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setActiveDatePreset('all');
                  }}
                  className="hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Staff Tag */}
            {staffFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-800">
                <Users className="w-3 h-3 text-[#601A24]" />
                <span>
                  Staff: {staffFilter === 'unassigned' ? 'Unassigned Only' : (stylists.find((s) => s.id === staffFilter)?.name || staffFilter)}
                </span>
                <button
                  type="button"
                  onClick={() => setStaffFilter('all')}
                  className="hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Service Tag */}
            {serviceFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-800">
                <Sparkles className="w-3 h-3 text-[#601A24]" />
                <span className="truncate max-w-[200px]">Service: {serviceFilter}</span>
                <button
                  type="button"
                  onClick={() => setServiceFilter('all')}
                  className="hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* City Tag */}
            {cityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-800">
                <MapPin className="w-3 h-3 text-[#601A24]" />
                <span>City: {cityFilter} Hub</span>
                <button
                  type="button"
                  onClick={() => setCityFilter('all')}
                  className="hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Status Tag */}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-800">
                <Clock className="w-3 h-3 text-[#601A24]" />
                <span className="capitalize">Status: {statusFilter.replace('_', ' ')}</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Shared DataTable Component */}
      <DataTable<BookingRecord>
        data={preFilteredData}
        columns={columns}
        idField="id"
        searchable={true}
        searchPlaceholder="Search customer, phone, locality, booking ID..."
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        emptyMessage="No appointments match the selected filters"
        emptySubtitle="Try widening your date range, switching staff, or clicking 'Reset All Filters' above."
        onResetFilters={handleResetAllFilters}
      />

      {/* Inspection & Re-assignment Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-mono text-stone-400">DISPATCH INSPECTOR</span>
                <h3 className="text-base font-bold text-stone-900">
                  Appointment {selectedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date & Slot Notice */}
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#601A24]" />
                <span className="font-semibold text-stone-900">
                  {formatDatePretty(selectedBooking.date)}
                </span>
              </div>
              <span className="font-mono text-stone-600 font-medium">
                {selectedBooking.timeSlot}
              </span>
            </div>

            {/* Customer & Location */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs text-stone-700">
              <div className="flex justify-between">
                <span className="font-bold text-stone-900">{selectedBooking.customerName}</span>
                <span className="font-mono text-stone-600">{selectedBooking.phone}</span>
              </div>
              <p className="text-stone-600">
                <strong>Address:</strong> {selectedBooking.fullAddress}
              </p>
              {selectedBooking.specialNotes && (
                <p className="text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 text-[11px]">
                  <strong>Special Notes:</strong> {selectedBooking.specialNotes}
                </p>
              )}
            </div>

            {/* Services & Total */}
            <div className="text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Services Requested</span>
              <p className="font-semibold text-stone-900">{selectedBooking.serviceNames.join(' + ')}</p>
              <div className="flex justify-between pt-1 font-mono">
                <span className="text-stone-500">Payable Amount:</span>
                <span className="font-bold text-stone-900">{formatCurrency(selectedBooking.totalAmount)} ({selectedBooking.paymentMethod})</span>
              </div>
            </div>

            {/* Stylist Re-assignment */}
            <div className="text-xs space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400">Assign Verified Beautician</span>
              <select
                value={selectedBooking.assignedStylistId || ''}
                onChange={(e) => handleAssignStylist(selectedBooking.id, e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#601A24] cursor-pointer"
              >
                <option value="">-- Choose Stylist from {selectedBooking.city} Roster --</option>
                {stylists
                  .filter((s) => s.city === selectedBooking.city)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.specialization}) · Rating: {s.rating}★
                    </option>
                  ))}
              </select>
            </div>

            {/* Change Status */}
            <div className="text-xs space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400">Update Status</span>
              <div className="grid grid-cols-3 gap-2">
                {(['assigned', 'in_transit', 'in_progress', 'completed', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedBooking.id, st)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition-colors cursor-pointer ${
                      selectedBooking.status === st
                        ? 'bg-[#601A24] text-white border-[#601A24]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

