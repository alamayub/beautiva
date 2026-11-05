import React from 'react';
import { 
  CalendarCheck, 
  PackageOpen, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Trash2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: CalendarCheck,
      title: 'Pick Your Service & Slot',
      description: 'Choose your desired facial, waxing, or bridal combo. Select your preferred date and time slot from 8:00 AM to 8:00 PM.'
    },
    {
      number: '02',
      icon: PackageOpen,
      title: 'Sealed Kit Unsealed in Front of You',
      description: 'Your verified woman cosmetologist arrives with a hospital-sterilized toolkit and brand mono-dose kit opened exclusively before your eyes.'
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'Relax & Pay After Full Satisfaction',
      description: 'Experience salon luxury in your living room. The aesthetician cleans up all disposables mess-free. Pay securely only after complete satisfaction.'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
            Hassle-Free Doorstep Care
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
            How Beautiva Works in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            No salon queues, no traffic, no unhygienic product tubs. Pure comfort at home.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between relative group hover:border-[#601A24]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-bold text-[#601A24]/20 group-hover:text-[#601A24] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-[#601A24] group-hover:bg-[#601A24] group-hover:text-white transition-all shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-stone-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>100% Money-Back Satisfaction Guarantee:</strong> If kit is not opened in front of you, the service is completely on us.
            </span>
          </div>

          <Link
            to="/services"
            className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Book In 60 Seconds</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
