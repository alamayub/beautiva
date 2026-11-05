import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  STANDARD_TIME_SLOTS, 
  checkSlotAvailability, 
  getDayAvailability, 
  formatDateToReadable,
  SlotAvailabilityResult 
} from '../../lib/slotAvailability';

interface SlotBookingCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: string; // e.g. "09:00 AM - 11:30 AM"
  city?: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
  className?: string;
}

export const SlotBookingCalendar: React.FC<SlotBookingCalendarProps> = ({
  selectedDate,
  selectedSlot,
  city = 'Lucknow',
  onSelectDate,
  onSelectSlot,
  className = '',
}) => {
  // Calendar month state
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Sync calendar month when selectedDate changes externally
  useEffect(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        setCurrentYear(y);
        setCurrentMonth(m - 1);
      }
    }
  }, [selectedDate]);

  // Calculate days in current month view
  const { monthName, daysInMonth, startWeekday, isPrevMonthDisabled } = useMemo(() => {
    const dateObj = new Date(currentYear, currentMonth, 1);
    const monthName = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun

    const isPrevMonthDisabled =
      currentYear < today.getFullYear() ||
      (currentYear === today.getFullYear() && currentMonth <= today.getMonth());

    return {
      monthName,
      daysInMonth,
      startWeekday,
      isPrevMonthDisabled,
    };
  }, [currentYear, currentMonth, today]);

  // Navigate months
  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onSelectDate(todayStr);
  };

  // Compute availability for each day in this month view
  const monthDaysAvailability = useMemo(() => {
    const map: Record<string, ReturnType<typeof getDayAvailability>> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      map[dateStr] = getDayAvailability(dateStr, city);
    }
    return map;
  }, [currentYear, currentMonth, daysInMonth, city]);

  // Compute availability for all time slots on the selected date
  const slotResults = useMemo<SlotAvailabilityResult[]>(() => {
    if (!selectedDate) return [];
    return STANDARD_TIME_SLOTS.map((slot) =>
      checkSlotAvailability(selectedDate, slot.label, city)
    );
  }, [selectedDate, city]);

  // Group slots by period (Morning, Afternoon, Evening)
  const groupedSlots = useMemo(() => {
    const morning = slotResults.filter((s) => s.period === 'morning');
    const afternoon = slotResults.filter((s) => s.period === 'afternoon');
    const evening = slotResults.filter((s) => s.period === 'evening');
    return { morning, afternoon, evening };
  }, [slotResults]);

  // Selected date availability summary
  const selectedDaySummary = selectedDate ? monthDaysAvailability[selectedDate] : null;

  // Find next available date if current date is full or past
  const nextAvailableDate = useMemo(() => {
    const startDt = new Date();
    for (let i = 0; i < 30; i++) {
      const dt = new Date(startDt);
      dt.setDate(dt.getDate() + i);
      const str = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
      const avail = getDayAvailability(str, city);
      if (avail.availableCount > 0) {
        return str;
      }
    }
    return null;
  }, [city]);

  return (
    <div className={`bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden ${className}`}>
      
      {/* Calendar Header with Navigation */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5]/80">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#601A24]" />
          <h3 className="font-editorial text-base sm:text-lg font-bold text-stone-900">
            {monthName}
          </h3>
          <span className="text-[11px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
            {city} Hub
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleJumpToToday}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center bg-white rounded-lg border border-stone-200 p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isPrevMonthDisabled}
              className={`p-1 rounded transition-colors ${
                isPrevMonthDisabled
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'text-stone-700 hover:bg-stone-100 cursor-pointer'
              }`}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Grid View */}
      <div className="p-4 sm:p-5">
        
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd, i) => (
            <span
              key={wd}
              className={`text-[11px] font-bold uppercase tracking-wider py-1 ${
                i === 0 || i === 6 ? 'text-stone-400' : 'text-stone-600'
              }`}
            >
              {wd}
            </span>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty spacer cells before month start */}
          {Array.from({ length: startWeekday }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 sm:h-12" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const avail = monthDaysAvailability[dateStr];
            const isSelected = selectedDate === dateStr;
            const isPast = avail?.isPast;
            const isToday = dateStr === todayStr;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(dateStr)}
                className={`relative h-11 sm:h-13 rounded-xl flex flex-col items-center justify-between py-1.5 px-1 transition-all text-left ${
                  isPast
                    ? 'bg-stone-50 text-stone-300 cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'bg-[#601A24] text-white shadow-sm ring-2 ring-[#601A24]/30 cursor-pointer'
                    : 'bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 border border-stone-200/60 hover:border-stone-300 cursor-pointer'
                }`}
                title={
                  isPast
                    ? 'Date has passed'
                    : `${formatDateToReadable(dateStr)}: ${avail?.availableCount ?? 0} slots open`
                }
              >
                {/* Day Number and Today badge */}
                <div className="flex items-center gap-0.5">
                  <span className={`text-xs sm:text-sm font-semibold font-mono ${isSelected ? 'text-white' : ''}`}>
                    {dayNum}
                  </span>
                  {isToday && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#601A24]" title="Today" />
                  )}
                </div>

                {/* Availability status micro indicator */}
                {!isPast && avail && (
                  <div className="flex items-center gap-1 mt-auto">
                    {avail.status === 'sold_out' ? (
                      <span className={`text-[9px] font-bold uppercase leading-none font-mono ${isSelected ? 'text-red-200' : 'text-rose-600'}`}>
                        Full
                      </span>
                    ) : avail.status === 'low' ? (
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-amber-500'}`} />
                        <span className={`hidden sm:inline text-[9px] font-mono leading-none ${isSelected ? 'text-white' : 'text-stone-500'}`}>
                          {avail.availableCount} left
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                        <span className={`hidden sm:inline text-[9px] font-mono leading-none ${isSelected ? 'text-white' : 'text-stone-500'}`}>
                          {avail.availableCount} open
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-stone-100 text-[11px] text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Fast Filling</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Full / Sold Out</span>
            </span>
          </div>

          <span className="font-mono text-[10px] text-stone-400">
            Capacity: 2-4 verified cosmetologists per slot
          </span>
        </div>
      </div>

      {/* Time Slot Availability Section for Selected Date */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#FAF8F5]/80 to-white border-t border-stone-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Available Slots for {formatDateToReadable(selectedDate)}</span>
            </span>
            <p className="text-xs text-stone-500 mt-0.5">
              {selectedDaySummary?.availableCount ? (
                <span>
                  <strong>{selectedDaySummary.availableCount}</strong> of {selectedDaySummary.totalCount} slots currently open in {city}.
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">
                  All slots are currently booked for this date in {city}.
                </span>
              )}
            </p>
          </div>

          {/* Jump to next available slot if date is full */}
          {selectedDaySummary?.availableCount === 0 && nextAvailableDate && (
            <button
              type="button"
              onClick={() => onSelectDate(nextAvailableDate)}
              className="text-xs font-semibold text-[#601A24] bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Jump to next open date ({formatDateToReadable(nextAvailableDate)})</span>
            </button>
          )}
        </div>

        {/* Slot Grid by Session Periods */}
        <div className="space-y-3">
          
          {/* Morning Slots */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Morning Sessions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groupedSlots.morning.map((slotRes) => (
                <SlotCard
                  key={slotRes.slot}
                  slotRes={slotRes}
                  isSelected={selectedSlot === slotRes.slot}
                  onSelectSlot={onSelectSlot}
                />
              ))}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1.5">
              <Sunset className="w-3.5 h-3.5 text-orange-500" />
              <span>Afternoon Sessions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groupedSlots.afternoon.map((slotRes) => (
                <SlotCard
                  key={slotRes.slot}
                  slotRes={slotRes}
                  isSelected={selectedSlot === slotRes.slot}
                  onSelectSlot={onSelectSlot}
                />
              ))}
            </div>
          </div>

          {/* Evening Slots */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Evening Sessions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groupedSlots.evening.map((slotRes) => (
                <SlotCard
                  key={slotRes.slot}
                  slotRes={slotRes}
                  isSelected={selectedSlot === slotRes.slot}
                  onSelectSlot={onSelectSlot}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Active Selection Summary Confirmation */}
        {selectedSlot && (
          <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900">
                  Confirmed Slot: {selectedSlot}
                </span>
                <span className="text-stone-500 block text-[11px]">
                  {formatDateToReadable(selectedDate)} · Doorstep arrival with sealed kit
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Open
            </span>
          </div>
        )}

      </div>

    </div>
  );
};

interface SlotCardProps {
  slotRes: SlotAvailabilityResult;
  isSelected: boolean;
  onSelectSlot: (slot: string) => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ slotRes, isSelected, onSelectSlot }) => {
  const { slot, isAvailable, status, badgeLabel } = slotRes;

  return (
    <button
      type="button"
      disabled={!isAvailable}
      onClick={() => isAvailable && onSelectSlot(slot)}
      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
        !isAvailable
          ? 'bg-stone-50 border-stone-200/60 opacity-60 cursor-not-allowed text-stone-400'
          : isSelected
          ? 'bg-[#601A24] border-[#601A24] text-white shadow-sm ring-2 ring-[#601A24]/20 cursor-pointer'
          : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-300 cursor-pointer shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-2">
        <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-stone-400'}`} />
        <span className={`text-xs font-semibold font-mono ${isSelected ? 'text-white' : 'text-stone-900'}`}>
          {slot}
        </span>
      </div>

      <div>
        {!isAvailable ? (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono">
            {badgeLabel}
          </span>
        ) : status === 'filling_fast' ? (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
              isSelected
                ? 'bg-amber-400/30 text-amber-100 border border-amber-300/40'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {badgeLabel}
          </span>
        ) : (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
              isSelected
                ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {badgeLabel}
          </span>
        )}
      </div>
    </button>
  );
};
