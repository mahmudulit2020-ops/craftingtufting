import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransitionOverlay() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Trigger smooth transition effect on navigation
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 pointer-events-none bg-[#111317]/95 backdrop-blur-md flex flex-col items-center justify-center text-white"
        >
          {/* Centered Brand Mark matching the video transition (00:11, 00:27, 00:58) */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3"
          >
            {/* Monogram */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0d9488] to-[#14b8a6] p-0.5 shadow-xl shadow-teal-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#111317] rounded-full flex items-center justify-center">
                <span className="font-serif font-black text-2xl text-teal-400">C</span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.16em] text-white">
                CRAFTING <span className="text-teal-400 font-normal">&amp;</span> TUFTING
              </h2>
              <p className="text-[10px] tracking-[0.3em] uppercase text-teal-400/90 font-mono mt-0.5">
                HANDMADE ATELIER · BANGLADESH
              </p>
            </div>

            {/* Glowing sweep progress indicator */}
            <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-3 relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.45, ease: 'easeInOut', repeat: Infinity }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-teal-400 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
