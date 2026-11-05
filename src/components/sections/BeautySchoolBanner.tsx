import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const BeautySchoolBanner: React.FC = () => {
  return (
    <section className="py-14 sm:py-18 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#401218] to-[#250A0E] text-white p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-rose-200">
                <GraduationCap className="w-4 h-4 text-[#D47A83]" />
                <span>Beautiva Academy & Vocational Institute</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-white leading-tight">
                Empower your passion at the Beautiva Beauty School
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Learn government-recognized, industry-standard beauty technology, cosmetology, advanced bridal makeup, and hair science. Get 100% hands-on salon apprenticeships and direct placement in our doorstep fleet.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D47A83] shrink-0" />
                  <span>Master Cosmetology Diploma</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D47A83] shrink-0" />
                  <span>Bridal Airbrush Artistry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D47A83] shrink-0" />
                  <span>Placement Assistance</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 lg:text-right space-y-3">
              <Link
                to="/beauty-school"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#401218] font-bold text-sm rounded-lg hover:bg-rose-50 transition-colors shadow-sm w-full sm:w-auto"
              >
                <span>Explore Academy Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-stone-400">
                Next batch registrations open in Lucknow & Patna
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
