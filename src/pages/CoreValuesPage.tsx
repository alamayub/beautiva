import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Heart, Sparkles, Award, Users, Smile } from 'lucide-react';

export const CoreValuesPage: React.FC = () => {
  const values = [
    {
      icon: ShieldCheck,
      title: '1. Uncompromising Clinical Hygiene',
      description: 'Single-use disposables, sealed mono-dose kits, and sterilized stainless tools are mandatory for every customer visit. We treat your living room with the same cleanliness standards as a high-end spa suite.'
    },
    {
      icon: Award,
      title: '2. 100% Brand Authenticity',
      description: 'No counterfeit cosmetics, no refilled generic jars. We partner directly with VLCC, Lotus Herbals, Blossom Kochhar, and O3+ so you receive genuine formulations formulated for Indian skin.'
    },
    {
      icon: Users,
      title: '3. Dignity & Growth for Women Stylists',
      description: 'We enable independent female beauty professionals to earn fair incomes, receive continuous skill upgradation at our Beauty School, and work with total personal safety.'
    },
    {
      icon: Smile,
      title: '4. Transparent & Honest Pricing',
      description: 'No hidden travel charges, no unexpected parlor upsells at the door. Clear prices, genuine discounts, and upfront package durations are our bedrock.'
    },
    {
      icon: Heart,
      title: '5. Customer Comfort & Punctuality',
      description: 'We respect your time. Stylists arrive equipped and on-schedule, ready to deliver a relaxing, zero-mess parlor experience in your preferred surroundings.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Core Values</span>
        </nav>

        <div className="bg-white rounded-2xl p-6 sm:p-12 border border-stone-200 shadow-xs mb-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
              Our Guiding Principles
            </span>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900">
              The Values That Drive Beautiva
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every appointment we book and every student we train is guided by five foundational values of safety, authenticity, dignity, and reliability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#601A24]/10 text-[#601A24] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
