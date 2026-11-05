import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title="About Us - Lucknow's Doorstep Salon Pioneer"
        description="Learn about Beautiva (Sitkan Enterprises), founded in 2017 to bring authentic brand cosmetics and hospital-sterilized beauty care to women at home."
        canonical="https://beautiva.in/about-us"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">About Beautiva</span>
        </nav>

        {/* Hero */}
        <div className="bg-white rounded-2xl p-6 sm:p-12 border border-stone-200 shadow-xs mb-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
              Founded 2017 · Lucknow, India
            </span>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 leading-tight">
              Reimagining Salon Care in the Privacy of Your Home
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Beautiva (legally operated under <strong>Sitkan Enterprises / Sitkan Services Private Limited</strong>) was founded in Lucknow with a simple yet transformative vision: women shouldn't have to navigate city traffic, endure noisy waiting lobbies, or compromise on hygiene just to get a haircut, facial, or wax.
            </p>
          </div>
        </div>

        {/* Content Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h2 className="text-xl font-editorial font-bold text-stone-900">
              Our Journey: From Chinhat to Across North India
            </h2>
            <p>
              Starting from our primary headquarters at Chinhat, Faizabad Road in Lucknow, Beautiva pioneered doorstep salon services in Uttar Pradesh and Bihar. We recognized early on that trust in home services is earned through two strict non-negotiables: <strong>absolute hygiene</strong> and <strong>100% genuine sealed branded cosmetics</strong>.
            </p>
            <p>
              Unlike conventional parlors where large salon tubs are repeatedly double-dipped, Beautiva mandates single-use mono-dose kits from certified beauty giants—including <strong>VLCC, Lotus Herbals, Blossom Kochhar Aroma Magic, and O3+</strong>. Every kit is opened right in front of the customer.
            </p>

            <h2 className="text-xl font-editorial font-bold text-stone-900 pt-4">
              Stylist Empowerment & The Beautiva Beauty School
            </h2>
            <p>
              We believe a service platform is only as good as the professionals behind it. Through our accredited <strong>Beautiva Beauty School</strong>, we have trained hundreds of women in advanced cosmetology, scientific skin anatomy, and bridal artistry, providing them dignified, safe, and lucrative livelihoods with complete schedule autonomy.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200/90 space-y-3">
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Company Details
              </h3>
              <div className="space-y-2 text-xs text-stone-600">
                <p><strong>Legal Entity:</strong> Beautiva, Sitkan Enterprises</p>
                <p><strong>Head Office:</strong> P.No 1 , KH. NO. 118, NewGulista Colony Faizabad Road, Chinhat, Lucknow , 226028</p>
                <p><strong>Founded:</strong> 2017</p>
                <p><strong>Operating Regions:</strong> Lucknow, Patna, Kanpur, Gorakhpur, Varanasi</p>
                <p><strong>Call US:</strong> +91 7236851999 / +91 7007017309</p>
                <p><strong>Write Us:</strong> info@beautiva.in</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
                Our Sister Initiatives
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
                <li>• Beautiva Beauty School (Vocational Academy)</li>
                <li>• नारी (Nari) Herbal & Ayurvedic Formulations</li>
                <li>• Certified Bridal Hair & Makeup Fleet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
