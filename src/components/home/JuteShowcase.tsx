import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import WeaveReveal from '@/components/motion/WeaveReveal';
import TuftCard from '@/components/motion/TuftCard';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

interface JuteShowcaseProps {
  products: Product[];
}

const JUTE_TABS = ['ALL', 'Baskets', 'Wall Décor', 'Bags', 'Mats'];

export default function JuteShowcase({ products }: JuteShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const juteProducts = products.filter((p) => p.category === 'JUTE HANDCRAFT');

  const filtered = activeCategory === 'ALL'
    ? juteProducts.slice(0, 4)
    : juteProducts.filter((p) => p.subCategory?.toLowerCase().includes(activeCategory.toLowerCase())).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-offwhite border-b border-warm-border relative overflow-hidden">
      {/* Background Subtle Bengal Golden Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C89B3C_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Header with Eco Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pb-6 border-b border-warm-border">
          <div>
            <WeaveReveal direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-jute-gold/15 text-jute-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3 border border-jute-gold/30">
                <Leaf size={13} />
                <span>100% Biodegradable Bengal Golden Fiber</span>
              </div>
            </WeaveReveal>

            <WeaveReveal direction="up" delay={0.2}>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-bark tracking-tight">
                Natural Jute Handicrafts Capsule
              </h2>
            </WeaveReveal>

            <WeaveReveal direction="up" delay={0.3}>
              <p className="text-sm sm:text-base text-bark/70 font-light mt-2 max-w-xl">
                Harvested along the Brahmaputra riverbanks and hand-braided by generational women artisans across Faridpur and Narayanganj.
              </p>
            </WeaveReveal>
          </div>

          <WeaveReveal direction="up" delay={0.25}>
            <Link
              to="/jute-handicrafts"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-bark hover:text-ochre transition-colors pb-1 border-b-2 border-bark hover:border-ochre"
            >
              <span>Explore Jute Emporium</span>
              <ArrowRight size={14} />
            </Link>
          </WeaveReveal>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <TuftCard className="p-6 bg-white border border-warm-border">
            <div className="w-10 h-10 rounded-full bg-jute-gold/15 text-jute-gold flex items-center justify-center mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display text-lg text-bark mb-1">Naturally Golden Luster</h3>
            <p className="text-xs text-bark/70 leading-relaxed">
              Unbleached natural golden fiber cured in slow delta waters, preserving organic strength and amber undertones.
            </p>
          </TuftCard>

          <TuftCard className="p-6 bg-white border border-warm-border">
            <div className="w-10 h-10 rounded-full bg-sage/15 text-sage flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-display text-lg text-bark mb-1">Zero Plastic & Non-Toxic</h3>
            <p className="text-xs text-bark/70 leading-relaxed">
              Stitched with pure cotton warp threads and natural plant latex adhesive. 100% home compostable and vegan.
            </p>
          </TuftCard>

          <TuftCard className="p-6 bg-white border border-warm-border">
            <div className="w-10 h-10 rounded-full bg-ochre/15 text-ochre flex items-center justify-center mb-4">
              <Award size={20} />
            </div>
            <h3 className="font-display text-lg text-bark mb-1">Fair Trade Certified</h3>
            <p className="text-xs text-bark/70 leading-relaxed">
              Direct living wages and safe artisan studio environments for over 280 female master weavers in rural Bengal.
            </p>
          </TuftCard>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {JUTE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 border ${
                activeCategory === tab
                  ? 'bg-bark text-cream border-bark'
                  : 'bg-white text-bark/70 border-warm-border hover:border-bark hover:text-bark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filtered.map((prod) => (
            <WeaveReveal key={prod.id} direction="up" delay={0.1}>
              <ProductCard product={prod} />
            </WeaveReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
