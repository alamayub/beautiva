import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isCartDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (isCartDrawerOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 sm:bottom-24 sm:right-7 z-30"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll smoothly to top"
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-stone-700 hover:text-[#601A24] border border-stone-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_22px_rgba(96,26,36,0.18)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            title="Smooth scroll to top"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
