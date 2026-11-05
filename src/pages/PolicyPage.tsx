import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let activePolicy = 'privacy';
  if (path.includes('terms-of-sale')) activePolicy = 'sale';
  else if (path.includes('terms-of-use')) activePolicy = 'use';
  else if (path.includes('reports-abuse')) activePolicy = 'abuse';

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Legal & Customer Policies</span>
        </nav>

        {/* Policy Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          <Link
            to="/privacy-policy"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activePolicy === 'privacy'
                ? 'bg-[#601A24] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-sale"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activePolicy === 'sale'
                ? 'bg-[#601A24] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Terms of Sale
          </Link>
          <Link
            to="/terms-of-use"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activePolicy === 'use'
                ? 'bg-[#601A24] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Terms of Use
          </Link>
          <Link
            to="/reports-abuse"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activePolicy === 'abuse'
                ? 'bg-[#601A24] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Reports Abuse & Takedown
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed mb-12">
          {activePolicy === 'privacy' && (
            <>
              <div className="pb-4 border-b border-stone-100">
                <h1 className="text-2xl font-editorial font-bold text-stone-900">Privacy Policy</h1>
                <p className="text-xs text-stone-500 mt-1">Sitkan Enterprises / Beautiva.in · Last Revised: October 2026</p>
              </div>
              <p>
                Beautiva ("we", "our", or "us"), operated under Sitkan Enterprises / Sitkan Services Private Limited, respects customer privacy and is committed to protecting the personal data shared when booking home parlor appointments.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">1. Collection of Data</h3>
              <p>
                We collect essential contact information including full name, mobile telephone number, email, and detailed home address solely to dispatch our background-verified beautician to your location and provide transactional booking confirmations.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">2. Security of Customer Information</h3>
              <p>
                We implement industry-standard encryption protocols. We do not sell, rent, or trade your personal data to external third parties. Contact numbers are shared exclusively with the assigned female beautician for doorstep navigation and appointment coordination.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">3. Payment Information</h3>
              <p>
                Beautiva operates primarily on a "Pay-After-Service" model. We never store credit or debit card numbers on our local databases.
              </p>
            </>
          )}

          {activePolicy === 'sale' && (
            <>
              <div className="pb-4 border-b border-stone-100">
                <h1 className="text-2xl font-editorial font-bold text-stone-900">Terms of Sale & Booking Policy</h1>
                <p className="text-xs text-stone-500 mt-1">Sitkan Enterprises / Beautiva.in</p>
              </div>
              <h3 className="font-bold text-stone-900 text-sm">1. Appointment Scheduling & Slot Allotment</h3>
              <p>
                All bookings placed through beautiva.in represent an advance request for doorstep services. Beauticians are allotted based on regional availability across Lucknow, Patna, Kanpur, Gorakhpur, and Varanasi.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">2. Sealed Kit Integrity</h3>
              <p>
                Our therapists carry sealed mono-dose cosmetic kits from VLCC, Lotus Herbals, or O3+. Each sachet or product pack is opened in the customer's presence. In the event of a damaged seal, clients are encouraged to request immediate kit replacement free of charge.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">3. Cancellation & Rescheduling</h3>
              <p>
                Appointments can be rescheduled or cancelled at zero penalty up to 2 hours prior to the scheduled slot time by contacting our support desk at +91 7236851999.
              </p>
            </>
          )}

          {activePolicy === 'use' && (
            <>
              <div className="pb-4 border-b border-stone-100">
                <h1 className="text-2xl font-editorial font-bold text-stone-900">Terms of Use</h1>
                <p className="text-xs text-stone-500 mt-1">Beautiva Web & Service Platform</p>
              </div>
              <p>
                By accessing and using beautiva.in, you agree to comply with all applicable laws of the Republic of India and these terms.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">1. Code of Conduct & Stylist Safety</h3>
              <p>
                Beautiva maintains an absolute zero-tolerance policy against harassment, misconduct, or unsafe behavior directed toward our women service partners. We reserve the immediate right to cancel appointments and take legal recourse if safety standards are violated.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">2. Intellectual Property</h3>
              <p>
                Brand names, trade dress, logos, course materials of the Beautiva Beauty School, and proprietary package compositions remain the intellectual property of Sitkan Enterprises and respective brand partners.
              </p>
            </>
          )}

          {activePolicy === 'abuse' && (
            <>
              <div className="pb-4 border-b border-stone-100">
                <h1 className="text-2xl font-editorial font-bold text-stone-900">Reports Abuse & Takedown Policy</h1>
                <p className="text-xs text-stone-500 mt-1">Compliance & Grievance Redressal</p>
              </div>
              <p>
                In compliance with the Information Technology Act, 2000 and rules made thereunder, Beautiva maintains a dedicated grievance and abuse redressal mechanism.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">Grievance Officer:</h3>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <p><strong>Name:</strong> Grievance Cell, Beautiva, Sitkan Enterprises</p>
                <p><strong>Address:</strong> P.No 1 , KH. NO. 118, NewGulista Colony Faizabad Road, Chinhat, Lucknow , 226028</p>
                <p><strong>Email:</strong> info@beautiva.in / grievance@beautiva.in</p>
                <p><strong>Phone / Call US:</strong> +91 7236851999 / +91 7007017309</p>
              </div>
              <p>
                All complaints concerning copyright infringement, unauthorized listing, or service abuse will be investigated and addressed within 36 hours of receipt.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
