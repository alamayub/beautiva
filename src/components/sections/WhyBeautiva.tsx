import React from 'react';
import { ShieldCheck, UserCheck, PackageCheck, Sparkles, MapPin, Award } from 'lucide-react';

export const WhyBeautiva: React.FC = () => {
  const trustPoints = [
    {
      icon: PackageCheck,
      title: '100% Sealed Mono-Dose Kits',
      description: 'Factory-sealed cosmetics from VLCC, Lotus, and O3+ are unsealed exclusively in front of you. Zero unhygienic tub dipping.'
    },
    {
      icon: UserCheck,
      title: 'Verified Women Stylists',
      description: 'Every beautician undergoes police background verification and rigorous training at the Beautiva Beauty School.'
    },
    {
      icon: ShieldCheck,
      title: 'Hospital-Grade Sanitization',
      description: 'Single-use bedsheets, disposable wooden spatulas, sterilized stainless tools, and protective aprons for complete hygiene.'
    },
    {
      icon: Sparkles,
      title: 'Mess-Free Post-Cleanup',
      description: 'We pack away all used disposables and cleanup materials leaving your home spotless, so you just relax and enjoy your glow.'
    },
    {
      icon: MapPin,
      title: 'On-Time Doorstep Arrival',
      description: 'Serving key residential hubs across Lucknow, Patna, Kanpur, and Varanasi with flexible booking slots from 8 AM to 8 PM.'
    },
    {
      icon: Award,
      title: 'Fair & Transparent Pricing',
      description: 'No hidden parlor overhead charges or unexpected travel fees. What you see on the app is exactly what you pay.'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
            The Beautiva Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
            Why Thousands of Families Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
            We reimagined parlor visits from the ground up: uncompromising clinical hygiene, branded integrity, and the ultimate comfort of your own home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point, idx) => {
            const Icon = point.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#601A24]/10 text-[#601A24] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-stone-900 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
