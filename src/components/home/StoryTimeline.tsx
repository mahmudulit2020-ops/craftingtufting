import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Palette,
  Sparkles,
  ShieldCheck,
  Scissors,
  Globe,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import WeaveReveal from '@/components/motion/WeaveReveal';

interface TimelineStep {
  id: string;
  stepNumber: string;
  title: string;
  duration: string;
  category: string;
  icon: typeof Layers;
  description: string;
  details: string[];
  image: string;
}

const STEPS: TimelineStep[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    title: 'Raw Fiber Selection',
    duration: 'Day 1–3',
    category: 'Sourcing & Grading',
    icon: Layers,
    description: 'We source only certified 100% New Zealand Virgin Wool and unbleached river-retted golden jute fiber directly from delta growers.',
    details: [
      'Strict micron grading (28–32 microns for maximum pile resiliency)',
      'Zero synthetic fillers or re-spun polyester blends',
      'Naturally hypoallergenic and moisture-regulating fibers',
    ],
    image: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    title: 'Azo-Free Yarn Dyeing',
    duration: 'Day 4–6',
    category: 'Pigment Chemistry',
    icon: Palette,
    description: 'Small-batch pot dyeing using OEKO-TEX certified, azo-free color chemistry formulated to withstand decades of sun exposure.',
    details: [
      'Pantone & custom color-matching for bespoke artwork',
      'Water-saving closed-loop rinse cycles in Narayanganj',
      'Lanolin preservation to retain deep fiber luster',
    ],
    image: 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    title: 'Pneumatic Hand-Tufting',
    duration: 'Day 7–14',
    category: 'Artisan Execution',
    icon: Sparkles,
    description: 'Master tufters project vector designs onto high-density primary backing stretched across heavy timber looms, shooting individual yarn loops with pneumatic needles.',
    details: [
      'Millimeter-accurate tracing of customer logos and motifs',
      'Tightly packed loop clusters delivering over 160,000 tufts/m²',
      'Directional yarn flow to enhance color play under light',
    ],
    image: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    title: 'Natural Latex Backing',
    duration: 'Day 15–17',
    category: 'Structural Curing',
    icon: ShieldCheck,
    description: 'A liquid natural rubber latex vulcanized compound is carefully hand-troweled onto the rear canvas, locking each tuft root permanently.',
    details: [
      'Secondary woven cotton-jute scrim pressed into wet latex',
      'Odor-free, zero-VOC curing in solar-heated chambers',
      'Flexible, anti-skid performance on timber, stone, and tile floors',
    ],
    image: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
  },
  {
    id: 'step-5',
    stepNumber: '05',
    title: '3D Shearing & Hand-Carving',
    duration: 'Day 18–22',
    category: 'Dimensional Sculpting',
    icon: Scissors,
    description: 'Senior craftsmen shave the raw pile with horizontal electric clippers, then use manual duckbill shears to carve 3D relief channels around every color boundary.',
    details: [
      'High-low bevel sculpting up to 22mm pile depth contrast',
      'Crisp letterform and geometric contour separation',
      'Vacuum extraction removing all loose sheared fleece',
    ],
    image: 'https://images.pexels.com/photos/3773439/pexels-photo-3773439.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
  },
  {
    id: 'step-6',
    stepNumber: '06',
    title: 'Quality Audit & Global Export',
    duration: 'Day 23–26',
    category: 'Worldwide Dispatch',
    icon: Globe,
    description: 'Every rug undergoes a 12-point inspection, lint grooming, roll-packaging in breathable waterproof jute sleeves, and DHL Express global dispatch.',
    details: [
      'Hand-signed Atelier Certificate of Authenticity',
      'Real-time DHL/FedEx air freight tracking code issued',
      'Remaining 50% balance cleared prior to doorstep delivery',
    ],
    image: 'https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
  },
];

export default function StoryTimeline() {
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const activeStep = STEPS[activeStepIndex];

  return (
    <section className="py-20 lg:py-28 bg-bark text-cream relative overflow-hidden">
      {/* Background Loom Grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#E8E3D9_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Heading */}
        <div className="max-w-3xl mb-14">
          <WeaveReveal direction="up" delay={0.1}>
            <p className="text-xs tracking-[0.28em] uppercase text-jute-gold font-semibold mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              <span>Heritage & Transparency Interactive Timeline</span>
            </p>
          </WeaveReveal>

          <WeaveReveal direction="up" delay={0.2}>
            <h2 className="font-display text-3xl sm:text-5xl text-cream tracking-tight leading-[1.1]">
              From Delta Riverbanks to Architectural Living Rooms
            </h2>
          </WeaveReveal>

          <WeaveReveal direction="up" delay={0.3}>
            <p className="text-cream/70 text-sm sm:text-base font-light mt-3 leading-relaxed">
              Explore the uncompromising 6-stage lifecycle of your bespoke rug. We believe luxury lies in radical transparency.
            </p>
          </WeaveReveal>
        </div>

        {/* Interactive Step Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 text-left border transition-all duration-300 relative ${
                  isActive
                    ? 'bg-cream text-bark border-jute-gold shadow-[0_12px_24px_-10px_rgba(200,155,60,0.5)]'
                    : 'bg-bark/70 text-cream/70 border-cream/15 hover:border-cream/40 hover:text-cream'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-mono text-[11px] font-bold ${isActive ? 'text-ochre' : 'text-cream/40'}`}>
                    {s.stepNumber}
                  </span>
                  <span className="text-[10px] tracking-wider opacity-70">{s.duration}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={14} className={isActive ? 'text-ochre' : 'text-jute-gold'} />
                  <p className="text-xs font-semibold uppercase tracking-wider truncate">{s.title}</p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeStepIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-jute-gold"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Stage Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-bark/90 border border-cream/20 p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Visual Image */}
            <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden border border-cream/10 bg-bark">
              <img
                src={activeStep.image}
                alt={activeStep.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bark/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-cream/90">
                <span className="bg-bark/80 backdrop-blur-sm px-3 py-1 border border-cream/20">
                  {activeStep.category}
                </span>
                <span className="flex items-center gap-1.5 bg-jute-gold/90 text-bark px-3 py-1 font-bold">
                  <Clock size={12} /> {activeStep.duration}
                </span>
              </div>
            </div>

            {/* Information */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs tracking-[0.25em] uppercase text-jute-gold font-bold">
                  Stage {activeStep.stepNumber} of 06
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-cream font-bold">
                  {activeStep.title}
                </h3>
              </div>

              <p className="text-cream/80 text-sm sm:text-base leading-relaxed font-light">
                {activeStep.description}
              </p>

              <div className="space-y-3 pt-2">
                <p className="text-xs uppercase tracking-widest text-cream/50 font-bold">
                  Atelier Quality Metrics:
                </p>
                <ul className="space-y-2">
                  {activeStep.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-cream/90">
                      <CheckCircle2 size={14} className="text-jute-gold shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-cream/15 flex items-center justify-between">
                <span className="text-xs text-cream/60">
                  Inspected & logged in your real-time Order Tracker
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStepIndex((prev) => (prev + 1) % STEPS.length)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-jute-gold hover:text-white font-bold transition-colors"
                >
                  <span>Next Stage</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
