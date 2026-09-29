import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import AtelierStudioScene, { type StudioStyle } from './AtelierStudioScene';

export interface AtelierSlide {
  id: string;
  style: StudioStyle;
  title: string;
}

export const ATELIER_SLIDES: AtelierSlide[] = [
  {
    id: 'scandi-pine-studio',
    style: 'scandi',
    title: 'Cozy Sunlit Pine Studio & Colorful Abstract Rug Loom',
  },
  {
    id: 'industrial-brick-loft',
    style: 'industrial',
    title: 'Industrial Brick Loft Atelier & Bauhaus Modernist Rugs',
  },
  {
    id: 'boho-delta-sanctuary',
    style: 'boho',
    title: 'Bohemian Golden Jute & Botanical Earth Tone Atelier',
  },
  {
    id: 'japandi-zen-craft',
    style: 'japandi',
    title: 'Japandi Hinoki Craft Studio & Organic Curved Stone Rugs',
  },
  {
    id: 'pop-art-color-lab',
    style: 'pop',
    title: 'Vibrant Memphis Pop Art Rug Tufting Lab',
  },
];

export default function AtelierHeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const slide = ATELIER_SLIDES[currentIndex];

  const handleNext = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % ATELIER_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + ATELIER_SLIDES.length) % ATELIER_SLIDES.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Auto-play (pauses when hovering)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext]);

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section className="relative w-full bg-[#101317] overflow-hidden select-none">
      {/* ========================================================
          SLIDER CAROUSEL: COZY TUFTING STUDIOS IN 5 DISTINCT STYLES
          (Clean visual scenes matching user reference, no text overlays)
          ======================================================== */}
      <div
        className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] xl:h-[700px] overflow-hidden group cursor-grab active:cursor-grabbing bg-[#0d0f12]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction === 'right' ? 70 : -70, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction === 'right' ? -70 : 70, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The Tufting & Crafting Studio Workshop Scene in Distinct Style */}
            <AtelierStudioScene style={slide.style} />

            {/* Subtle atmospheric vignette framing */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* ========================================================
            PREV & NEXT FLOATING ARROW BUTTONS
            ======================================================== */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/85 border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl hover:border-amber-400"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/85 border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl hover:border-amber-400"
        >
          <ChevronRight size={24} />
        </button>

        {/* Clean Slide Dots at Bottom Center of Slider */}
        <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center gap-2.5">
          {ATELIER_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDirection(idx > currentIndex ? 'right' : 'left');
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================
          ONLY TWO BUTTONS: "Shop Now" & "Custom Rugs"
          (Clean, Luxurious, Centered, No extra text)
          ======================================================== */}
      <div className="bg-cream py-8 sm:py-10 px-6 border-t border-sand-300">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {/* BUTTON 1: Shop Now */}
          <Link
            to="/shop"
            className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 bg-[#161a20] hover:bg-[#222730] text-white font-bold text-xs sm:text-sm tracking-widest uppercase rounded-xs shadow-md hover:shadow-xl transition-all duration-300 active:scale-[0.98] border border-white/10"
          >
            <ShoppingBag size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Shop Now</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* BUTTON 2: Custom Rugs */}
          <Link
            to="/custom-rug"
            className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 bg-gradient-to-r from-[#C89B3C] via-[#D8AA47] to-[#C89B3C] hover:from-[#DFB352] hover:to-[#D8AA47] text-bark font-bold text-xs sm:text-sm tracking-widest uppercase rounded-xs shadow-[0_10px_25px_-5px_rgba(200,155,60,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(200,155,60,0.5)] transition-all duration-300 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <Sparkles size={16} className="text-bark/80 group-hover:rotate-12 transition-transform" />
            <span>Custom Rugs</span>
            <ArrowRight size={15} className="text-bark group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
