import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 pb-12 sm:pb-16 lg:pb-20 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase text-[#601A24]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#601A24]" />
              <span>Doorstep Salon Care · Lucknow · Patna · Kanpur</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-stone-900 leading-[1.15] text-balance">
              The salon experience, tailored strictly for the sanctuary of your home.
            </h1>

            <p className="text-base text-stone-600 max-w-xl leading-relaxed">
              Experience certified aesthetic treatments, VLCC & Lotus herbal facials, painless waxing, and bridal artistry performed by background-verified women stylists using single-use sealed kits.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/services"
                className="px-6 py-3.5 bg-[#601A24] text-white text-sm font-semibold rounded-lg hover:bg-[#4a121a] transition-all shadow-xs flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Packages</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/brands"
                className="px-6 py-3.5 bg-white text-stone-800 text-sm font-semibold rounded-lg hover:bg-stone-50 transition-colors border border-stone-300 cursor-pointer"
              >
                Browse Brands
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-200">
              <div>
                <span className="font-editorial text-2xl font-bold text-stone-900 block tabular-nums">100%</span>
                <span className="text-xs text-stone-500 font-medium mt-0.5 block">Sealed Mono-Doses</span>
              </div>
              <div>
                <div className="flex items-center gap-1 font-editorial text-2xl font-bold text-stone-900 tabular-nums">
                  <Star className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
                  <span>4.9</span>
                  <span className="text-xs text-stone-400 font-sans font-normal ml-0.5">/ 5.0</span>
                </div>
                <span className="text-xs text-stone-500 font-medium mt-0.5 block">Verified Rating</span>
              </div>
              <div>
                <span className="font-editorial text-2xl font-bold text-stone-900 block tabular-nums">12,000+</span>
                <span className="text-xs text-stone-500 font-medium mt-0.5 block">At-Home Sessions</span>
              </div>
            </div>
          </div>

          {/* Right Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-200/90 aspect-[4/3] lg:aspect-[4/3] bg-stone-100">
              <img
                src="/images/salonline_hero_luxury_1792923326581.jpg"
                alt="Beautiva luxury at-home parlor therapy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Subtle Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block">
                    Verified Hygiene Protocol
                  </span>
                  <span className="text-xs font-semibold text-stone-900">
                    Single-Use Disposables & Sterilized Kits
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
