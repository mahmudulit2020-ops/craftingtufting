import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote, MapPin } from 'lucide-react';
import WeaveReveal from '@/components/motion/WeaveReveal';

interface Review {
  id: string;
  author: string;
  location: string;
  countryCode: string;
  rugTitle: string;
  rugSize: string;
  rating: number;
  date: string;
  reviewText: string;
  photoUrl: string;
  verifiedBuyer: boolean;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Elena Rostova',
    location: 'Zurich, Switzerland',
    countryCode: 'CH',
    rugTitle: 'Custom Mihrab Geometric Arch',
    rugSize: '8 × 10 ft (240 × 300 cm)',
    rating: 5,
    date: 'February 2026',
    reviewText:
      'We commissioned this custom arch rug for our lakeside salon. The wool density and 3D hand-carved relief are beyond what heritage European ateliers deliver at triple the price. The 50% deposit structure made the entire bespoke commissioning process transparent and stress-free.',
    photoUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
    verifiedBuyer: true,
  },
  {
    id: 'rev-2',
    author: 'Marcus Sterling',
    location: 'London, United Kingdom',
    countryCode: 'GB',
    rugTitle: 'Sundarbans Hand-Braided Jute Runner',
    rugSize: '3 × 12 ft Hallway Runner',
    rating: 5,
    date: 'January 2026',
    reviewText:
      'The natural golden fiber luster has an organic warmth you simply cannot replicate with factory textiles. It arrived in London via DHL Express in 4 days, immaculately rolled in reusable jute wrap with a certificate of authenticity signed by the lead weaver.',
    photoUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
    verifiedBuyer: true,
  },
  {
    id: 'rev-3',
    author: 'Farhana Ahmed & Tariq Rahman',
    location: 'Gulshan, Dhaka / Dubai UAE',
    countryCode: 'AE',
    rugTitle: 'Nakshi Heritage Contemporary Cut-Pile',
    rugSize: '9 × 12 ft Living Rug',
    rating: 5,
    date: 'December 2025',
    reviewText:
      'Being able to watch the production timeline evolve from yarn pot dyeing in Narayanganj to the loom shearing was utterly mesmerizing. Our guests constantly compliment the tactile bounce underfoot. World-class pride for Bangladeshi craftsmanship.',
    photoUrl: 'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
    verifiedBuyer: true,
  },
];

export default function ReviewsShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? REVIEWS.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i === REVIEWS.length - 1 ? 0 : i + 1));
  };

  const active = REVIEWS[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-ecru border-b border-warm-border relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 pb-6 border-b border-warm-border">
          <div>
            <WeaveReveal direction="up" delay={0.1}>
              <p className="text-xs tracking-[0.25em] uppercase text-ochre font-semibold mb-2">
                Global Residences & Collector Reviews
              </p>
            </WeaveReveal>
            <WeaveReveal direction="up" delay={0.2}>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-bark tracking-tight">
                Curated Reviews & Living Placements
              </h2>
            </WeaveReveal>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous Review"
              className="w-12 h-12 border border-warm-border bg-white text-bark flex items-center justify-center hover:bg-bark hover:text-cream transition-colors duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-mono text-bark/60 px-2">
              {currentIndex + 1} / {REVIEWS.length}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next Review"
              className="w-12 h-12 border border-warm-border bg-white text-bark flex items-center justify-center hover:bg-bark hover:text-cream transition-colors duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-warm-border p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-[0_20px_40px_-20px_rgba(22,21,19,0.06)]"
          >
            {/* Interior Placement Photo */}
            <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden bg-linen border border-warm-border">
              <img
                src={active.photoUrl}
                alt={active.rugTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-bark/85 text-cream text-[10px] tracking-wider uppercase px-3 py-1 backdrop-blur-sm flex items-center gap-1.5">
                <MapPin size={11} className="text-jute-gold" />
                <span>{active.location}</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-jute-gold">
                  {[...Array(active.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <Quote size={28} className="text-warm-border" />
              </div>

              <blockquote className="font-display text-xl sm:text-2xl text-bark leading-relaxed italic">
                "{active.reviewText}"
              </blockquote>

              <div className="pt-6 border-t border-warm-border flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-bark">{active.author}</p>
                    {active.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-sage font-semibold">
                        <CheckCircle2 size={12} /> Verified Atelier Commission
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-bark/60 mt-0.5">
                    {active.rugTitle} · <span className="font-mono">{active.rugSize}</span>
                  </p>
                </div>

                <span className="text-[11px] text-bark/40 font-mono">{active.date}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
