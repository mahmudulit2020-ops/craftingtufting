import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Wrench,
  Sparkles,
  Scissors,
  Moon,
  Compass,
  Heart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AtelierPanoramaHero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse motion values for realistic 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end cinematic inertia
  const springX = useSpring(mouseX, { stiffness: 65, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 65, damping: 22 });

  // Parallax layers
  const skyX = useTransform(springX, [-1, 1], [-8, 8]);
  const skyY = useTransform(springY, [-1, 1], [-5, 5]);

  const moonX = useTransform(springX, [-1, 1], [-18, 18]);
  const moonY = useTransform(springY, [-1, 1], [-12, 12]);

  const skylineX = useTransform(springX, [-1, 1], [-26, 26]);
  const skylineY = useTransform(springY, [-1, 1], [-10, 10]);

  const foliageX = useTransform(springX, [-1, 1], [-38, 38]);
  const foliageY = useTransform(springY, [-1, 1], [-14, 14]);

  const artisansX = useTransform(springX, [-1, 1], [-48, 48]);
  const artisansY = useTransform(springY, [-1, 1], [-18, 18]);

  const [moonGlow, setMoonGlow] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Handle pointer hover across the entire hero section
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setActiveTooltip(null);
  };

  return (
    <section className="relative overflow-hidden bg-[#0d1217] select-none">
      {/* ========================================================
          ILLUSTRATED ATELIER PANORAMA STAGE (NO CANVAS / NO FRAME)
          ======================================================== */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] overflow-hidden"
      >
        {/* Layer 1: Celestial Twilight Sky & Starlight */}
        <motion.div
          style={{ x: skyX, y: skyY }}
          className="absolute inset-0 bg-gradient-to-b from-[#05090e] via-[#0b1622] to-[#122332] pointer-events-none"
        >
          <div className="absolute inset-0 opacity-80">
            {[
              { top: '10%', left: '12%', size: '2px' },
              { top: '20%', left: '25%', size: '3px' },
              { top: '15%', left: '38%', size: '2px' },
              { top: '26%', left: '50%', size: '3px' },
              { top: '8%', left: '65%', size: '2px' },
              { top: '22%', left: '78%', size: '3px' },
              { top: '28%', left: '88%', size: '2px' },
              { top: '14%', left: '6%', size: '2px' },
              { top: '35%', left: '96%', size: '2px' },
            ].map((star, idx) => (
              <span
                key={idx}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  animationDuration: `${1.4 + idx * 0.3}s`,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Layer 2: Luminous Moon with Halo (matching reference image top-left) */}
        <motion.div
          style={{ x: moonX, y: moonY }}
          onClick={() => setMoonGlow(!moonGlow)}
          className="absolute top-8 sm:top-12 left-[10%] sm:left-[15%] z-10 cursor-pointer"
          title="Toggle moon glow"
        >
          <div className="relative">
            <div
              className={`absolute -inset-8 rounded-full bg-teal-300/20 blur-2xl transition-all duration-700 ${
                moonGlow ? 'scale-125 opacity-90' : 'opacity-20'
              }`}
            />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#cbd5e1] via-[#f1f5f9] to-[#ffffff] shadow-[0_0_50px_rgba(255,255,255,0.45)] flex items-center justify-center relative overflow-hidden transition-transform hover:scale-105">
              <div className="w-4 h-4 rounded-full bg-gray-300/60 absolute top-3 left-3" />
              <div className="w-5 h-5 rounded-full bg-gray-300/50 absolute bottom-4 right-3" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300/70 absolute top-8 right-6" />
              <Moon size={16} className="text-gray-400/40" />
            </div>
          </div>
        </motion.div>

        {/* Layer 3: Architectural City Skyline with Lit Atelier Lofts */}
        <motion.div
          style={{ x: skylineX, y: skylineY }}
          className="absolute bottom-16 inset-x-0 h-72 pointer-events-none flex items-end justify-between px-2 sm:px-8 opacity-90"
        >
          {/* Building 1 (Tejgaon Artisan Lofts) */}
          <div className="w-24 sm:w-36 h-60 bg-[#142332] border-t-2 border-[#1f374e] flex flex-col justify-around p-3 relative">
            <div className="grid grid-cols-3 gap-1.5 opacity-70">
              {Array.from({ length: 15 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 rounded-2xs ${
                    i % 3 === 0 ? 'bg-amber-300/80' : i % 5 === 0 ? 'bg-teal-300/70' : 'bg-blue-900/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Building 2 (Central Bengal Loom Tower) */}
          <div className="w-32 sm:w-48 h-76 bg-[#162738] border-t-2 border-teal-500/30 flex flex-col justify-around p-3.5 relative">
            <div className="w-2 h-10 bg-teal-400/60 absolute -top-10 left-6" />
            <div className="grid grid-cols-4 gap-2 opacity-75">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-2xs ${
                    i % 2 === 0 ? 'bg-amber-300/90' : i % 7 === 0 ? 'bg-teal-400/90' : 'bg-slate-700/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Building 3 (Studio Headquarters) */}
          <div className="w-28 sm:w-40 h-68 bg-[#1b2b3a] border-t-2 border-[#2b445c] flex flex-col justify-around p-3 relative">
            <div className="grid grid-cols-3 gap-2 opacity-70">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 rounded-2xs ${
                    i % 4 === 0 ? 'bg-teal-300/80' : 'bg-slate-800/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Building 4 (Export & Logistics Hub) */}
          <div className="w-32 sm:w-44 h-80 bg-[#192634] border-t-2 border-amber-500/20 flex flex-col justify-around p-3.5 relative">
            <div className="grid grid-cols-3 gap-2 opacity-70">
              {Array.from({ length: 21 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-2xs ${
                    i % 3 === 0 ? 'bg-amber-300/80' : 'bg-cyan-900/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Layer 4: Tropical Bengal River Foliage & Greenery */}
        <motion.div
          style={{ x: foliageX, y: foliageY }}
          className="absolute bottom-12 inset-x-0 h-64 pointer-events-none flex items-end justify-between px-4"
        >
          <div className="w-48 sm:w-64 h-52 rounded-t-full bg-gradient-to-t from-[#0e3b2e] to-[#14532d] opacity-90 blur-xs" />
          <div className="w-40 sm:w-56 h-44 rounded-t-full bg-gradient-to-t from-[#0f4435] to-[#166534] opacity-85 -ml-12" />
          <div className="w-44 sm:w-60 h-48 rounded-t-full bg-gradient-to-t from-[#0d3b31] to-[#15803d] opacity-90 -mr-10" />
          <div className="w-56 sm:w-72 h-56 rounded-t-full bg-gradient-to-t from-[#0c3328] to-[#166534] opacity-95" />
        </motion.div>

        {/* Layer 5: ILLUSTRATED ARTISAN HANDICRAFT & TUFTING RUG SCENE (NO CARDS / NO FRAMES) */}
        <motion.div
          style={{ x: artisansX, y: artisansY }}
          className="absolute bottom-6 inset-x-0 h-96 z-20 flex items-end justify-around px-4 sm:px-12 pointer-events-auto"
        >
          {/* ========================================================
              ARTISAN SCENE 1 (LEFT): MASTER HAND-TUFTING RUG ARTISAN
              ======================================================== */}
          <div
            onMouseEnter={() => setActiveTooltip('tufting')}
            onMouseLeave={() => setActiveTooltip(null)}
            className="relative flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            {/* The Tufted Rug being crafted (Bespoke Geometric Waves) */}
            <div className="relative mb-2">
              <div className="w-44 sm:w-56 h-52 rounded-xl bg-gradient-to-b from-[#241d17] to-[#18130f] border border-amber-500/30 p-2.5 shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Woven Wool Rows */}
                <div className="space-y-2 pt-1">
                  <div className="h-6 rounded-lg bg-gradient-to-r from-[#BD632F] via-[#d97706] to-[#BD632F] shadow-sm flex items-center justify-between px-2">
                    <span className="text-[8px] font-mono font-bold text-white tracking-widest uppercase">
                      TERRACOTTA WOOL
                    </span>
                    <span className="w-2 h-2 rounded-full bg-white/70 animate-ping" />
                  </div>
                  <div className="h-6 rounded-lg bg-gradient-to-r from-[#2E6B38] via-[#15803d] to-[#2E6B38] shadow-sm flex items-center justify-between px-2">
                    <span className="text-[8px] font-mono font-bold text-white tracking-widest uppercase">
                      CYPRESS GREEN
                    </span>
                  </div>
                  <div className="h-6 rounded-lg bg-gradient-to-r from-[#C89B3C] via-[#eab308] to-[#C89B3C] shadow-sm flex items-center justify-between px-2">
                    <span className="text-[8px] font-mono font-bold text-bark tracking-widest uppercase">
                      GOLDEN DELTA JUTE
                    </span>
                  </div>
                  <div className="h-6 rounded-lg bg-gradient-to-r from-[#264653] via-[#1d3557] to-[#264653] shadow-sm flex items-center justify-between px-2">
                    <span className="text-[8px] font-mono font-bold text-white tracking-widest uppercase">
                      DELTA INDIGO
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-sand-300/80 border-t border-white/10 pt-1.5">
                  <span className="text-amber-400 font-bold">100% NZ Mountain Wool</span>
                  <span className="text-teal-300">16mm Cut Pile</span>
                </div>
              </div>

              {/* Tufter Figure holding Pneumatic Gun */}
              <div className="absolute -left-5 -bottom-2 flex items-end">
                <div className="w-8 h-20 bg-teal-800 rounded-full shadow-xl border border-teal-400/30 flex flex-col items-center pt-1">
                  <div className="w-4 h-4 rounded-full bg-[#f2c59b] -mt-3 shadow-xs" />
                  {/* Gun arm */}
                  <div className="w-6 h-3 bg-teal-600 rounded-xs mt-4 -mr-4 border border-teal-300 flex items-center px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-sand-300 bg-[#111317]/80 px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>Hand-Tufted Wool Rugs</span>
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'tufting' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-12 z-30 bg-[#111317] border border-teal-400 px-3.5 py-1.5 rounded-full text-xs text-teal-300 font-mono shadow-2xl flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles size={12} className="text-amber-400" />
                <span>Pneumatic Tufting · Dense 3D Cut Pile Loops</span>
              </motion.div>
            )}
          </div>

          {/* ========================================================
              ARTISAN SCENE 2 (CENTER): PRECISION RUG CARVING & SCULPTING
              ======================================================== */}
          <div
            onMouseEnter={() => setActiveTooltip('carving')}
            onMouseLeave={() => setActiveTooltip(null)}
            className="relative flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105 pb-1"
          >
            {/* The Sculpted Rug Motif */}
            <div className="relative mb-2">
              <div className="w-40 sm:w-48 h-44 rounded-2xl bg-gradient-to-tr from-[#3a2818] to-[#251a10] border border-amber-500/40 p-3 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                {/* 3D Beveled Mandala Pattern */}
                <div className="w-24 h-24 rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-[#BD632F] to-[#C89B3C] shadow-lg flex items-center justify-center relative group-hover:rotate-45 transition-transform duration-700">
                  <div className="w-14 h-14 rounded-full border-2 border-white/60 bg-[#1a140e] flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-amber-300">3D RELIEF</span>
                  </div>
                </div>

                <div className="mt-2 text-[9px] font-mono text-sand-300 flex items-center gap-1">
                  <Scissors size={11} className="text-amber-400" />
                  <span>Beveled Carving Relief</span>
                </div>
              </div>

              {/* Artisan Sculptor Figure */}
              <div className="absolute -right-4 -bottom-1 flex items-end">
                <div className="w-8 h-18 bg-amber-900 rounded-full shadow-xl border border-amber-400/30 flex flex-col items-center pt-1">
                  <div className="w-4 h-4 rounded-full bg-[#e8be94] -mt-3 shadow-xs" />
                  <Scissors size={10} className="text-amber-300 mt-4 -ml-3" />
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-sand-300 bg-[#111317]/80 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>3D Rug Carving &amp; Shearing</span>
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'carving' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-12 z-30 bg-[#111317] border border-amber-400 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-mono shadow-2xl flex items-center gap-2 whitespace-nowrap"
              >
                <Scissors size={12} className="text-amber-400" />
                <span>Hand-Sheared Beveling · Architectural Depths</span>
              </motion.div>
            )}
          </div>

          {/* ========================================================
              ARTISAN SCENE 3 (RIGHT): NATURAL GOLDEN JUTE HANDICRAFTS
              ======================================================== */}
          <div
            onMouseEnter={() => setActiveTooltip('jute')}
            onMouseLeave={() => setActiveTooltip(null)}
            className="relative hidden sm:flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            {/* Jute Artifacts Collection: Braided Mandala & Storage Basket */}
            <div className="relative mb-2">
              <div className="w-44 sm:w-52 h-48 rounded-xl bg-gradient-to-b from-[#292015] to-[#1c150c] border border-[#c89b3c]/40 p-2.5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-[8px] font-mono text-amber-400 border-b border-white/10 pb-1">
                  <span>BENGAL GOLDEN FIBER</span>
                  <span className="text-emerald-400">100% ECO</span>
                </div>

                <div className="flex items-center justify-around py-1">
                  {/* Braided Mandala Wall Art */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#c89b3c] bg-gradient-to-tr from-[#92400e] to-[#d97706] shadow-md flex items-center justify-center">
                      <span className="text-[7px] font-mono text-white font-bold">MANDALA</span>
                    </div>
                    <span className="text-[8px] text-sand-300 mt-1 font-mono">Wall Art</span>
                  </div>

                  {/* Jute Basket */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-11 rounded-t-sm border border-amber-400/80 bg-[#b45309] shadow-md flex items-center justify-center">
                      <span className="text-[7px] font-mono text-white font-bold">BASKET</span>
                    </div>
                    <span className="text-[8px] text-sand-300 mt-1 font-mono">Handicraft</span>
                  </div>
                </div>

                <div className="text-[8px] text-sand-400 font-mono text-center border-t border-white/10 pt-1">
                  Biodegradable Delta Fiber Heritage
                </div>
              </div>

              {/* Jute Weaver Figure */}
              <div className="absolute -left-3 -bottom-1 flex items-end">
                <div className="w-8 h-18 bg-[#6b4723] rounded-full shadow-xl border border-amber-500/30 flex flex-col items-center pt-1">
                  <div className="w-4 h-4 rounded-full bg-[#d6a578] -mt-3 shadow-xs" />
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-sand-300 bg-[#111317]/80 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Heritage Jute Handicrafts</span>
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'jute' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-12 z-30 bg-[#111317] border border-[#c89b3c] px-3.5 py-1.5 rounded-full text-xs text-sand-200 font-mono shadow-2xl flex items-center gap-2 whitespace-nowrap"
              >
                <Heart size={12} className="text-rose-400" />
                <span>Delta Riverbank Fiber · Four Centuries Heritage</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Dynamic Diagonal Slice Cut (Matching reference screenshot horizon) */}
        <div
          className="absolute -bottom-1 inset-x-0 h-14 sm:h-18 bg-cream pointer-events-none z-30"
          style={{
            clipPath: 'polygon(0 80%, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      </div>

      {/* ========================================================
          LOWER HERO AREA: BALANCED HEADLINE & 2 BOTTOM CENTER BUTTONS
          ======================================================== */}
      <div className="relative bg-cream text-charcoal-900 pt-6 pb-12 px-6 sm:px-10 z-30 flex flex-col items-center text-center">
        {/* Subtle Decorative Star Sparkle (like reference image) */}
        <div className="flex items-center gap-1.5 text-sand-500 mb-3">
          <span className="text-xs">✦</span>
          <span className="text-xs">✦</span>
        </div>

        {/* Refined Headline (Balanced, Moderate scale - NOT large text) */}
        <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal-900 leading-snug max-w-3xl">
          Crafting &amp; Tufting <span className="font-normal text-sand-600">|</span> Bespoke Rug Atelier &amp; Golden Jute Crafts
        </h1>

        {/* Refined Subtitle */}
        <p className="text-charcoal-600 text-xs sm:text-sm font-normal max-w-2xl mt-2 leading-relaxed">
          Top Hand-Tufting &amp; Natural Fiber Atelier in Bangladesh delivering bespoke custom wool rugs and heritage jute handicrafts for clients in United States, Canada, Europe, Middle East, and worldwide.
        </p>

        {/* ========================================================
            THE 2 BUTTONS IN BOTTOM CENTER (Clean, High-Contrast)
            ======================================================== */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-6">
          {/* Button 1: Custom Rug (Gold Primary) */}
          <Link
            to="/custom-rug"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#C89B3C] hover:bg-[#D5AB4D] text-bark font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] rounded-xs"
          >
            <span>{t('hero.cta_custom')}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <ArrowRight size={14} />
            </motion.span>
          </Link>

          {/* Button 2: Tufting Supplies & Guns */}
          <Link
            to="/tufting-supplies"
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-charcoal-300 text-charcoal-800 hover:bg-charcoal-900 hover:text-white hover:border-charcoal-900 font-medium text-xs tracking-wider uppercase transition-all duration-200 shadow-xs active:scale-[0.98] rounded-xs"
          >
            <Wrench size={13} className="text-sand-600 group-hover:text-amber-400 transition-colors" />
            <span>{t('hero.cta_supplies')}</span>
          </Link>
        </div>

        {/* Atelier Quality Assurance Spec Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-sand-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-600" />
            100% NZ Mountain Wool
          </span>
          <span className="text-sand-300">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-[#C89B3C]" />
            50% Advance Model
          </span>
          <span className="text-sand-300">•</span>
          <span className="flex items-center gap-1.5">
            <Compass size={12} className="text-teal-600" />
            Worldwide Express Freight
          </span>
        </div>
      </div>
    </section>
  );
}
