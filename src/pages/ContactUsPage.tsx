import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Send,
  Instagram,
  Facebook
} from 'lucide-react';
import { contactSchema, ContactFormData } from '../lib/validation';
import { useToast } from '../components/common/ToastProvider';
import { WhatsAppButton, WhatsAppIcon } from '../components/common/WhatsAppButton';
import { SEO } from '../components/common/SEO';

export const ContactUsPage: React.FC = () => {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    setSubmitted(true);
    reset();
    showToast('Your message has been sent to our customer care team!');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title="Contact Us & Customer Support - Beautiva Concierge"
        description="Get in touch with Beautiva customer support, Lucknow headquarters, or reach us on WhatsApp at +91 7236851999 for booking help and partnerships."
        canonical="https://beautiva.in/contact-us"
        schema={{
          '@type': 'ContactPage',
          name: 'Contact Beautiva Customer Concierge',
          url: 'https://beautiva.in/contact-us',
          telephone: '+91-7236851999',
          email: 'support@beautiva.in',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Contact Us</span>
        </nav>

        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
            Customer Helpdesk & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 mt-1">
            Get in Touch with Beautiva
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Need assistance with a booking, customized bridal package, or academy admission? Our support team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Direct Help Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-[#141112] text-white p-6 rounded-2xl border border-emerald-800/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Instant Direct Dispatch
                </span>
                <WhatsAppIcon className="w-5 h-5 fill-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white font-editorial">
                Need Instant Help on WhatsApp?
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Chat directly with our Lucknow and Patna concierge team for immediate slot confirmations, bridal queries, and customized packages.
              </p>
              <WhatsAppButton
                variant="inline"
                label="Redirect to WhatsApp (+91 7236851999)"
                message="Hi Beautiva, I am contacting you from the support page to inquire about parlor appointments."
                className="w-full text-center"
              />
            </div>

            {/* Contact Details Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
              {/* Call US */}
              <div className="pb-4 border-b border-stone-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24] flex items-center gap-1.5 mb-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call US</span>
                </span>
                <div className="space-y-1 pl-5">
                  <p>
                    <a href="tel:+917236851999" className="font-mono text-sm font-semibold text-stone-900 hover:text-[#601A24] transition-colors">
                      +91 7236851999
                    </a>
                  </p>
                  <p>
                    <a href="tel:+917007017309" className="font-mono text-sm font-semibold text-stone-900 hover:text-[#601A24] transition-colors">
                      +91 7007017309
                    </a>
                  </p>
                  <span className="text-[11px] text-stone-400 block pt-1">
                    Direct Concierge Support (Mon – Sun: 8:00 AM – 8:00 PM)
                  </span>
                </div>
              </div>

              {/* Write Us */}
              <div className="pb-4 border-b border-stone-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24] flex items-center gap-1.5 mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Write Us</span>
                </span>
                <div className="pl-5">
                  <a href="mailto:info@beautiva.in" className="text-sm font-medium text-stone-900 hover:text-[#601A24] transition-colors">
                    info@beautiva.in
                  </a>
                  <span className="text-[11px] text-stone-400 block pt-1">
                    For booking queries, partnerships, and customer support
                  </span>
                </div>
              </div>

              {/* Head Office. */}
              <div className="pb-4 border-b border-stone-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24] flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Head Office.</span>
                </span>
                <div className="pl-5 text-xs text-stone-700 leading-relaxed space-y-1">
                  <p className="font-bold text-stone-900 text-sm">
                    Beautiva, Sitkan Enterprises
                  </p>
                  <p className="text-stone-600">
                    P.No 1 , KH. NO. 118, NewGulista Colony Faizabad Road, Chinhat, Lucknow , 226028
                  </p>
                </div>
              </div>

              {/* Follow us on Social Media. */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#601A24] block mb-2.5">
                  Follow us on Social Media.
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://instagram.com/beautiva.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">Instagram</span>
                      <span className="text-xs font-bold text-stone-900 font-mono">/beautiva.in</span>
                    </div>
                  </a>

                  <a
                    href="https://facebook.com/beautiva.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">Facebook</span>
                      <span className="text-xs font-bold text-stone-900 font-mono">/beautiva.in</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200/90 space-y-2">
              <h3 className="font-semibold text-stone-900 text-sm">Regional Hubs</h3>
              <p className="text-xs text-stone-600">
                <strong>Lucknow:</strong> Gomti Nagar, Chinhat, Aliganj, Indira Nagar, Hazratganj
              </p>
              <p className="text-xs text-stone-600">
                <strong>Patna:</strong> Patliputra, Boring Road, Bailey Road, Kankarbagh
              </p>
              <p className="text-xs text-stone-600">
                <strong>Other Cities:</strong> Kanpur, Gorakhpur, and Varanasi
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-lg font-bold text-stone-900 mb-1">Send Us a Direct Message</h2>
            <p className="text-xs text-stone-500 mb-6">
              Fill out the form below and we will respond within 2 to 4 business hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  Our customer care officer will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Ritu Keshari"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. ritu@example.com"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">Subject *</label>
                    <input
                      type="text"
                      {...register('subject')}
                      placeholder="e.g. Appointment rescheduling or Bridal query"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Provide details about your query..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
