import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  ChevronRight, 
  CheckCircle2, 
  IndianRupee, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Send 
} from 'lucide-react';
import { useToast } from '../components/common/ToastProvider';

export const CareersPage: React.FC = () => {
  const { showToast } = useToast();
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerCity, setPartnerCity] = useState('Lucknow');
  const [partnerExp, setPartnerExp] = useState('1-3');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerPhone) {
      showToast('Please fill in your name and phone number', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Application received! Our partner team will call you for an interview.');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Careers & Partner Stylists</span>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#601A24] to-[#3B151A] text-white rounded-2xl p-6 sm:p-12 mb-12 shadow-lg">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-rose-200">
              <Briefcase className="w-4 h-4 text-[#D47A83]" />
              <span>Partner With Beautiva</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white leading-tight">
              Earn ₹35,000 – ₹50,000 Monthly as a Doorstep Beauty Partner
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              Be your own boss. Enjoy complete schedule flexibility, weekly direct-to-bank settlements, and safety-verified bookings in your own neighborhood.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
            <h3 className="text-base font-bold text-stone-900">High Take-Home Earnings</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Retain the highest percentage in the industry with regular service performance bonuses and festive incentives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#601A24]/10 text-[#601A24] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Flexible Work Timings</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Choose your own working hours and localities. Perfect for balancing family commitments with professional independence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">100% Verified Safety</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Female-only customer base, real-time safety tracking, and complimentary branded uniform and sanitization kit.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-10 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-editorial font-bold text-stone-900">
              Join Our Beautician Fleet Today
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Active openings across Lucknow, Patna, Kanpur, Gorakhpur, and Varanasi.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Application Submitted!</h4>
              <p className="text-xs text-emerald-800">
                Our HR coordinator will connect with you on {partnerPhone} for an onboarding demonstration.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Rekha Sharma"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">Operating City</label>
                  <select
                    value={partnerCity}
                    onChange={(e) => setPartnerCity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                  >
                    <option value="Lucknow">Lucknow</option>
                    <option value="Patna">Patna</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Gorakhpur">Gorakhpur</option>
                    <option value="Varanasi">Varanasi</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">Parlor Experience</label>
                  <select
                    value={partnerExp}
                    onChange={(e) => setPartnerExp(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                  >
                    <option value="fresher">Fresher (Want training)</option>
                    <option value="1-3">1 to 3 Years</option>
                    <option value="3-5">3 to 5 Years</option>
                    <option value="5+">5+ Years (Senior / Bridal)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Partner Application</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
