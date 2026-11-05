import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
              Customer Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Loved by Women Across UP & Bihar
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Read authentic feedback from regular clients in Lucknow, Patna, and Kanpur.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={prev}
              className="p-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
              aria-label="Previous customer story"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
              aria-label="Next customer story"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel / Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{item.author}</h4>
                  <span className="text-[11px] text-stone-500">{item.city}</span>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
