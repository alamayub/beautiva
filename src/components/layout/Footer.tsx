import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#201A1B] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone-800 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#601A24]/40 flex items-center justify-center text-rose-300 shrink-0 border border-rose-900/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Genuine Sealed Brands</h4>
              <p className="text-xs text-stone-400 mt-1">
                Authentic mono-dose kits from VLCC, Lotus, and O3+ opened exclusively before you.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#601A24]/40 flex items-center justify-center text-rose-300 shrink-0 border border-rose-900/40">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Verified Women Aestheticians</h4>
              <p className="text-xs text-stone-400 mt-1">
                Background-checked, certified professionals carrying single-use hygiene gear.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#601A24]/40 flex items-center justify-center text-rose-300 shrink-0 border border-rose-900/40">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Beautiva Beauty School</h4>
              <p className="text-xs text-stone-400 mt-1">
                Empowering independent women cosmetologists through certified professional training.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-stone-800">
          {/* Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                Beautiva<span className="text-[#D47A83]">.in</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Beautiva (operated by Sitkan Enterprises) is India’s dedicated doorstep salon and beauty tech platform delivering premium parlor pampering and certified bridal artistry to your living room.
            </p>
            
            <div className="space-y-3 text-xs text-stone-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D47A83] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Beautiva, Sitkan Enterprises</p>
                  <p className="text-stone-400">P.No 1 , KH. NO. 118, NewGulista Colony Faizabad Road, Chinhat, Lucknow , 226028</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D47A83] shrink-0" />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-stone-300">
                  <a href="tel:+917236851999" className="hover:text-white transition-colors">+91 7236851999</a>
                  <span className="text-stone-600">·</span>
                  <a href="tel:+917007017309" className="hover:text-white transition-colors">+91 7007017309</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D47A83] shrink-0" />
                <a href="mailto:info@beautiva.in" className="hover:text-white transition-colors">
                  info@beautiva.in
                </a>
              </div>

              <div className="pt-2 border-t border-stone-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300 block mb-2">
                  Follow us on Social Media
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://instagram.com/beautiva.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs border border-stone-700 transition-colors"
                    aria-label="Follow Beautiva on Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-mono">/beautiva.in</span>
                  </a>
                  <a
                    href="https://facebook.com/beautiva.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs border border-stone-700 transition-colors"
                    aria-label="Follow Beautiva on Facebook"
                  >
                    <Facebook className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-mono">/beautiva.in</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Salon Services
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/services/facials-skincare" className="hover:text-white transition-colors">
                  Facials & Skincare
                </Link>
              </li>
              <li>
                <Link to="/services/hair-services" className="hover:text-white transition-colors">
                  Hair Spa & Styling
                </Link>
              </li>
              <li>
                <Link to="/services/makeup-styling" className="hover:text-white transition-colors">
                  Bridal & Party Makeup
                </Link>
              </li>
              <li>
                <Link to="/services/waxing-grooming" className="hover:text-white transition-colors">
                  Rica Waxing & Grooming
                </Link>
              </li>
              <li>
                <Link to="/services/manicure-pedicure" className="hover:text-white transition-colors">
                  Mani-Pedi Reflexology
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  All Beauty Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Education */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Company & Learning
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/core-values" className="hover:text-white transition-colors">
                  Core Values
                </Link>
              </li>
              <li>
                <Link to="/beauty-school" className="hover:text-white transition-colors">
                  Beautiva Beauty School
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Join As Stylist (Careers)
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Beauty & Skincare Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white transition-colors">
                  Contact Customer Care
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-rose-300 hover:text-white transition-colors font-medium">
                  Operations & Fleet Dashboard ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Customer Policies
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-sale" className="hover:text-white transition-colors">
                  Terms of Sale
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/reports-abuse" className="hover:text-white transition-colors">
                  Reports Abuse & Takedown
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-white transition-colors">
                  Special Offers & Deals
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <span className="text-[11px] font-medium text-stone-400 block mb-1.5">
                Operational Cities
              </span>
              <p className="text-[11px] text-stone-400 leading-normal">
                Lucknow · Patna · Kanpur · Gorakhpur · Varanasi
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Beautiva. Operated by Sitkan Enterprises / Sitkan Services Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
            <Link to="/terms-of-use" className="hover:underline">Terms</Link>
            <Link to="/contact-us" className="hover:underline">Helpdesk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
