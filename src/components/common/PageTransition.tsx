import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Top Route Loading Progress Bar
 * Provides instant tactile feedback during page navigation
 */
export const RouteProgressBar: React.FC = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress on pathname change
    setIsNavigating(true);
    setProgress(30);

    const t1 = setTimeout(() => {
      setProgress(75);
    }, 100);

    const t2 = setTimeout(() => {
      setProgress(100);
    }, 240);

    const t3 = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname, location.search]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[120] pointer-events-none h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#8B2635] via-[#601A24] to-[#C59B27] transition-all ease-out shadow-[0_1px_8px_rgba(96,26,36,0.6)]"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '150ms' : '220ms',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
};

/**
 * Animated Page Transition Wrapper
 * Soft fade & subtle vertical lift without jarring layout shifts
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.22,
          ease: [0.22, 1, 0.36, 1], // Luxury cubic-bezier
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
