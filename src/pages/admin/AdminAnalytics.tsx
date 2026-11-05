import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Clock, 
  Smile, 
  Package 
} from 'lucide-react';
import { formatCurrency } from '../../lib/currency';

export const AdminAnalytics: React.FC = () => {
  const cityMetrics = [
    { city: 'Lucknow', share: 52, bookings: 198, revenue: 438000, topService: 'Lotus WhiteGlow & VLCC Facial' },
    { city: 'Patna', share: 26, bookings: 98, revenue: 219000, topService: 'O3+ Glowing & SARA Apple' },
    { city: 'Kanpur', share: 12, bookings: 46, revenue: 101000, topService: 'Party Makeup & Hair Spa' },
    { city: 'Varanasi', share: 6, bookings: 24, revenue: 52800, topService: 'Blossom Aroma Magic' },
    { city: 'Gorakhpur', share: 4, bookings: 18, revenue: 39600, topService: 'ALL IN 1 Package' },
  ];

  const popularPackages = [
    { name: 'VLCC Facial Package', count: 124, revenue: 123504, share: 28 },
    { name: 'Lotus WhiteGlow Package', count: 108, revenue: 117720, share: 25 },
    { name: 'ALL IN 1 Package (Rica Wax)', count: 62, revenue: 154938, share: 20 },
    { name: 'O3+ Glowing Package', count: 48, revenue: 91152, share: 15 },
    { name: 'VLCC Hair SPA Package', count: 42, revenue: 37758, share: 12 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-editorial font-bold text-stone-900">
          City Analytics & Operations Quality
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Performance metrics across Lucknow Chinhat HQ, Patna, Kanpur, and North India hubs.
        </p>
      </div>

      {/* High-Level Quality KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Customer CSAT</span>
            <Smile className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">4.92 / 5.0</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Based on 1,420 post-trip reviews</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">98.4%</span>
          <span className="text-[11px] text-stone-500 block mt-1">Zero-cancellation guarantee</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Avg. Dispatch Latency</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">14 mins</span>
          <span className="text-[11px] text-stone-500 block mt-1">Stylist assignment speed</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Re-Booking Frequency</span>
            <TrendingUp className="w-4 h-4 text-[#601A24]" />
          </div>
          <span className="text-2xl font-bold font-mono text-[#601A24] tabular-nums">68% Repeat</span>
          <span className="text-[11px] text-stone-500 block mt-1">Within 45 days interval</span>
        </div>
      </div>

      {/* Grid: City Breakdown + Top Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* City Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-stone-900">
            Regional Hub Dispatch & Revenue Contribution
          </h2>
          <div className="space-y-4 pt-2">
            {cityMetrics.map((c) => (
              <div key={c.city} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#601A24]" />
                    <span className="font-bold text-stone-900">{c.city} Hub</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    {formatCurrency(c.revenue)} ({c.share}%)
                  </span>
                </div>

                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#601A24] h-1.5 rounded-full" style={{ width: `${c.share}%` }} />
                </div>

                <div className="flex justify-between text-[11px] text-stone-500 pt-0.5">
                  <span>{c.bookings} appointments this month</span>
                  <span className="text-stone-700 font-medium">Top: {c.topService}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Packages */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-stone-900">
            Top Booked Packages & Combos
          </h2>
          <div className="divide-y divide-stone-100">
            {popularPackages.map((p, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block truncate max-w-[200px]">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {p.count} bookings ({p.share}% share)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-stone-900">
                    {formatCurrency(p.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
