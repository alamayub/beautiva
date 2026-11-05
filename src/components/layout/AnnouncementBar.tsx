import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, Phone } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#601A24] text-rose-50 text-xs py-2 px-4 border-b border-[#722F37]/30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <Sparkles className="w-3.5 h-3.5 text-rose-200 shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-white">Doorstep Salon & Beauty Care:</strong> Serving Lucknow, Patna, Kanpur & Varanasi with sealed single-use brand kits.
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-stone-200">
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-rose-200 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-colors"
          >
            <span>Ops Dashboard</span>
          </Link>
          <a
            href="tel:+917236851999"
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-rose-300" />
            <span className="font-mono tabular-nums">+91 7236851999</span>
          </a>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
