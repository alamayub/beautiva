import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, HelpCircle, Search } from 'lucide-react';
import { faqs } from '../data/faqs';
import { SEO } from '../components/common/SEO';

export const FaqPage: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([faqs[0].id]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const categories = ['all', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((f) => {
    if (activeCategory !== 'all' && f.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title="Frequently Asked Questions (FAQ) - Doorstep Salon Hygiene & Pricing"
        description="Find answers to all questions regarding Beautiva at-home beauty services, single-use mono-dose kits, police background verification, and transparent per-minute charges."
        canonical="https://beautiva.in/faq"
        keywords="salon questions, at-home beauty faq, doorstep parlour hygiene, Beautiva booking help"
        schema={{
          '@type': 'FAQPage',
          mainEntity: faqs.slice(0, 10).map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Frequently Asked Questions</span>
        </nav>

        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
            Help & Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Everything you need to know about our at-home hygiene protocols, genuine products, and booking appointments.
          </p>

          <div className="relative mt-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions on hygiene, products, cities..."
              className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#601A24] shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Categories Segmented Buttons */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-[#601A24] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-stone-900 hover:text-[#601A24] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#601A24]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom prompt */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center space-y-2">
          <h3 className="font-semibold text-stone-900 text-sm">Have more questions?</h3>
          <p className="text-xs text-stone-500">
            Reach out to our customer care team anytime at +91 7236851999 / +91 7007017309 or info@salonline.in
          </p>
          <Link
            to="/contact-us"
            className="inline-block mt-2 px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors"
          >
            Contact Helpdesk
          </Link>
        </div>
      </div>
    </div>
  );
};
