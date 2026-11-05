import { initialBookings, BookingRecord } from '../data/dashboardData';

export interface TimeSlotConfig {
  id: string;
  label: string; // e.g. "09:00 AM - 11:30 AM"
  period: 'morning' | 'afternoon' | 'evening';
  startHour: number; // 24-hr format
  startMinute: number;
  endHour: number;
  endMinute: number;
  windowMinutes: number;
}

export const STANDARD_TIME_SLOTS: TimeSlotConfig[] = [
  {
    id: 'slot-m1',
    label: '09:00 AM - 11:30 AM',
    period: 'morning',
    startHour: 9,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    windowMinutes: 150,
  },
  {
    id: 'slot-m2',
    label: '11:30 AM - 02:00 PM',
    period: 'morning',
    startHour: 11,
    startMinute: 30,
    endHour: 14,
    endMinute: 0,
    windowMinutes: 150,
  },
  {
    id: 'slot-a1',
    label: '02:30 PM - 05:00 PM',
    period: 'afternoon',
    startHour: 14,
    startMinute: 30,
    endHour: 17,
    endMinute: 0,
    windowMinutes: 150,
  },
  {
    id: 'slot-a2',
    label: '04:00 PM - 06:30 PM',
    period: 'afternoon',
    startHour: 16,
    startMinute: 0,
    endHour: 18,
    endMinute: 30,
    windowMinutes: 150,
  },
  {
    id: 'slot-e1',
    label: '05:30 PM - 08:00 PM',
    period: 'evening',
    startHour: 17,
    startMinute: 30,
    endHour: 20,
    endMinute: 0,
    windowMinutes: 150,
  },
  {
    id: 'slot-e2',
    label: '07:00 PM - 09:30 PM',
    period: 'evening',
    startHour: 19,
    startMinute: 0,
    endHour: 21,
    endMinute: 30,
    windowMinutes: 150,
  },
];

export const EXTENDED_TIME_SLOTS: TimeSlotConfig[] = [
  {
    id: 'slot-ext-m',
    label: '09:00 AM - 01:00 PM',
    period: 'morning',
    startHour: 9,
    startMinute: 0,
    endHour: 13,
    endMinute: 0,
    windowMinutes: 240,
  },
  {
    id: 'slot-ext-a',
    label: '02:00 PM - 06:00 PM',
    period: 'afternoon',
    startHour: 14,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    windowMinutes: 240,
  },
  {
    id: 'slot-ext-e',
    label: '05:30 PM - 09:30 PM',
    period: 'evening',
    startHour: 17,
    startMinute: 30,
    endHour: 21,
    endMinute: 30,
    windowMinutes: 240,
  },
];

export const getSlotsForDuration = (totalDurationMinutes: number = 60): TimeSlotConfig[] => {
  if (totalDurationMinutes > 150) {
    return EXTENDED_TIME_SLOTS;
  }
  return STANDARD_TIME_SLOTS;
};

export const formatSessionEndTime = (
  startHour: number,
  startMinute: number,
  durationMinutes: number
): string => {
  const totalStartMins = startHour * 60 + startMinute;
  const totalEndMins = totalStartMins + Math.max(15, durationMinutes);
  const endH = Math.floor(totalEndMins / 60) % 24;
  const endM = totalEndMins % 60;
  const period = endH >= 12 ? 'PM' : 'AM';
  const displayH = endH % 12 === 0 ? 12 : endH % 12;
  return `${String(displayH).padStart(2, '0')}:${String(endM).padStart(2, '0')} ${period}`;
};

export const formatStartTime = (startHour: number, startMinute: number): string => {
  const period = startHour >= 12 ? 'PM' : 'AM';
  const displayH = startHour % 12 === 0 ? 12 : startHour % 12;
  return `${String(displayH).padStart(2, '0')}:${String(startMinute).padStart(2, '0')} ${period}`;
};

// Capacity per slot per city (number of concurrent cosmetologists available)
export const CITY_SLOT_CAPACITY: Record<string, number> = {
  Lucknow: 3,
  Patna: 2,
  Kanpur: 2,
  Gorakhpur: 2,
  Varanasi: 2,
  'New Delhi NCR': 4,
};

export const getStoredBookings = (): BookingRecord[] => {
  try {
    const raw = localStorage.getItem('beautiva_admin_bookings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return initialBookings;
};

export const saveBookingRecord = (booking: BookingRecord) => {
  try {
    const current = getStoredBookings();
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
    localStorage.setItem('beautiva_admin_bookings', JSON.stringify(updated));
  } catch {
    // ignore
  }
};

export interface SlotAvailabilityResult {
  slot: string;
  sessionWindowLabel: string;
  period: 'morning' | 'afternoon' | 'evening';
  isAvailable: boolean;
  status: 'available' | 'filling_fast' | 'sold_out' | 'passed';
  availableSpots: number;
  totalCapacity: number;
  badgeLabel: string;
}

export const checkSlotAvailability = (
  dateStr: string, // YYYY-MM-DD
  timeSlotLabel: string,
  city: string = 'Lucknow',
  totalDurationMinutes: number = 60
): SlotAvailabilityResult => {
  const allBookings = getStoredBookings();
  const capacity = CITY_SLOT_CAPACITY[city] || 2;

  // Filter matching active bookings (excluding cancelled)
  const matchingBookings = allBookings.filter(
    (b) =>
      b.date === dateStr &&
      b.city.toLowerCase() === city.toLowerCase() &&
      b.timeSlot === timeSlotLabel &&
      b.status !== 'cancelled'
  );

  const bookedCount = matchingBookings.length;
  const allSlots = [...STANDARD_TIME_SLOTS, ...EXTENDED_TIME_SLOTS];
  const slotCfg = allSlots.find((s) => s.label === timeSlotLabel);
  const period = slotCfg?.period || 'morning';
  const sessionWindowLabel = slotCfg
    ? `${formatStartTime(slotCfg.startHour, slotCfg.startMinute)} – ${formatSessionEndTime(
        slotCfg.startHour,
        slotCfg.startMinute,
        totalDurationMinutes
      )}`
    : timeSlotLabel;

  // Check if date and time have already passed
  const now = new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (targetDate < todayDate) {
    return {
      slot: timeSlotLabel,
      sessionWindowLabel,
      period,
      isAvailable: false,
      status: 'passed',
      availableSpots: 0,
      totalCapacity: capacity,
      badgeLabel: 'Date Passed',
    };
  }

  // If target date is today, check if start hour is past
  if (targetDate.getTime() === todayDate.getTime() && slotCfg) {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (
      currentHour > slotCfg.startHour ||
      (currentHour === slotCfg.startHour && currentMinute >= slotCfg.startMinute)
    ) {
      return {
        slot: timeSlotLabel,
        sessionWindowLabel,
        period,
        isAvailable: false,
        status: 'passed',
        availableSpots: 0,
        totalCapacity: capacity,
        badgeLabel: 'Slot Expired Today',
      };
    }
  }

  const remaining = Math.max(0, capacity - bookedCount);

  if (remaining === 0) {
    return {
      slot: timeSlotLabel,
      sessionWindowLabel,
      period,
      isAvailable: false,
      status: 'sold_out',
      availableSpots: 0,
      totalCapacity: capacity,
      badgeLabel: 'Sold Out',
    };
  }

  if (remaining === 1) {
    return {
      slot: timeSlotLabel,
      sessionWindowLabel,
      period,
      isAvailable: true,
      status: 'filling_fast',
      availableSpots: 1,
      totalCapacity: capacity,
      badgeLabel: '1 Beautician Free',
    };
  }

  return {
    slot: timeSlotLabel,
    sessionWindowLabel,
    period,
    isAvailable: true,
    status: 'available',
    availableSpots: remaining,
    totalCapacity: capacity,
    badgeLabel: `${remaining} Beauticians Free`,
  };
};

export interface DayAvailabilitySummary {
  date: string;
  isPast: boolean;
  isToday: boolean;
  availableCount: number;
  totalCount: number;
  status: 'high' | 'medium' | 'low' | 'sold_out' | 'past';
}

export const getDayAvailability = (
  dateStr: string,
  city: string = 'Lucknow',
  totalDurationMinutes: number = 60
): DayAvailabilitySummary => {
  const now = new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isPast = targetDate < todayDate;
  const isToday = targetDate.getTime() === todayDate.getTime();
  const slotsForDuration = getSlotsForDuration(totalDurationMinutes);

  if (isPast) {
    return {
      date: dateStr,
      isPast: true,
      isToday: false,
      availableCount: 0,
      totalCount: slotsForDuration.length,
      status: 'past',
    };
  }

  let availableCount = 0;
  slotsForDuration.forEach((slot) => {
    const res = checkSlotAvailability(dateStr, slot.label, city, totalDurationMinutes);
    if (res.isAvailable) availableCount++;
  });

  const total = slotsForDuration.length;
  let status: DayAvailabilitySummary['status'] = 'high';
  if (availableCount === 0) status = 'sold_out';
  else if (availableCount <= 2) status = 'low';
  else if (availableCount <= 4) status = 'medium';

  return {
    date: dateStr,
    isPast: false,
    isToday,
    availableCount,
    totalCount: total,
    status,
  };
};

export const formatDateToReadable = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
