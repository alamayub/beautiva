import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does the "Freedom of Products" (Bring Your Own Product) work?',
    answer: 'Beautiva gives you the complete freedom to choose. If you already have your favorite facial kit, wax, or hair spa cream at home, you don’t need to pay for products. You only pay a transparent service charge of ₹6 per minute for our certified cosmetologist’s time and skills.'
  },
  {
    question: 'How do you guarantee product authenticity and single-use hygiene?',
    answer: 'We exclusively partner with official brand houses like VLCC, Lotus Herbals, and O3+. All creams and serums come in sealed mono-dose pouches or sealed blisters. The beautician breaks the factory seal exclusively in your presence. We do not use large multi-client tubs.'
  },
  {
    question: 'Are the women beauticians background-verified and safe for home entry?',
    answer: 'Yes, 100%. Every professional undergoes rigorous police background checks, address verification, and continuous training at the Beautiva Beauty School. They carry official ID cards, sanitized protective aprons, and hospital-sterilized tools.'
  },
  {
    question: 'What do I need to provide at home for the appointment?',
    answer: 'Virtually nothing! Your beautician arrives with a complete self-contained parlor kit: disposable bedsheets, single-use spatulas, sanitized towels, equipment, and sealed cosmetics. All we request is a chair/bed, normal room lighting, and access to a power socket.'
  },
  {
    question: 'Are there any hidden travel charges, taxes, or tips?',
    answer: 'None whatsoever. The price you see on the screen includes all taxes, disposables, and travel expenses for bookings above ₹799 in your city hub. Tipping is entirely optional.'
  },
  {
    question: 'What if I need to reschedule or cancel my appointment?',
    answer: 'You can reschedule or cancel free of charge up to 2 hours before the scheduled time slot directly through the app or by messaging our WhatsApp concierge.'
  }
];

export const InteractiveFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24] flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#601A24]" />
            <span>Got Questions?</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Everything you need to know about doorstep beauty pampering with Beautiva.
          </p>
        </div>

        {/* Accordion Cards */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-stone-200/90 overflow-hidden bg-[#FAF8F5] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-stone-900 hover:text-[#601A24] transition-colors cursor-pointer text-xs sm:text-sm"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#601A24]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
