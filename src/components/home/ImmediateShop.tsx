import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Leaf } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import WeaveReveal from '@/components/motion/WeaveReveal';
import type { Product } from '@/lib/types';

interface ImmediateShopProps {
  products: Product[];
}

export default function ImmediateShop({ products }: ImmediateShopProps) {
  const [activeTab, setActiveTab] = useState<'TUFTING RUGS' | 'JUTE HANDCRAFT'>('TUFTING RUGS');

  const tuftedProducts = products.filter((p) => p.category === 'TUFTING RUGS').slice(0, 4);
  const juteProducts = products.filter((p) => p.category === 'JUTE HANDCRAFT').slice(0, 4);

  const displayedList = activeTab === 'TUFTING RUGS' ? tuftedProducts : juteProducts;

  return (
    <section className="py-20 lg:py-28 max-w-[1440px] mx-auto px-6 lg:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pb-6 border-b border-warm-border">
        <div>
          <WeaveReveal direction="up" delay={0.1}>
            <p className="text-xs tracking-[0.25em] uppercase text-ochre font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={13} />
              <span>Immediate Atelier Shopping</span>
            </p>
          </WeaveReveal>
          <WeaveReveal direction="up" delay={0.2}>
            <h2 className="font-display text-3xl sm:text-5xl text-bark font-bold">
              Shop Handcrafted Collections
            </h2>
          </WeaveReveal>
        </div>

        {/* Fluid Tabbed Showcase: Artisan Tufted Rugs vs Natural Jute Crafts */}
        <WeaveReveal direction="left" delay={0.25}>
          <div className="flex items-center p-1.5 bg-ecru border border-warm-border rounded-none">
            <button
              onClick={() => setActiveTab('TUFTING RUGS')}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center gap-2 ${
                activeTab === 'TUFTING RUGS'
                  ? 'bg-bark text-cream shadow-sm'
                  : 'text-charcoal-600 hover:text-bark'
              }`}
            >
              <Layers size={13} />
              <span>Artisan Tufted Rugs</span>
            </button>
            <button
              onClick={() => setActiveTab('JUTE HANDCRAFT')}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center gap-2 ${
                activeTab === 'JUTE HANDCRAFT'
                  ? 'bg-bark text-cream shadow-sm'
                  : 'text-charcoal-600 hover:text-bark'
              }`}
            >
              <Leaf size={13} />
              <span>Natural Jute Crafts</span>
            </button>
          </div>
        </WeaveReveal>
      </div>

      {/* Grid of Product Cards with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {displayedList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Footer link to view full category */}
      <div className="mt-12 pt-6 border-t border-warm-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p className="text-charcoal-500">
          Showing 4 highlighted creations from our {activeTab === 'TUFTING RUGS' ? 'Tufting Atelier' : 'Golden Jute Collective'}.
        </p>
        <Link
          to={activeTab === 'TUFTING RUGS' ? '/shop?category=TUFTING+RUGS' : '/jute-handicrafts'}
          className="text-ochre hover:text-bark transition-colors uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-1.5"
        >
          <span>View All {activeTab === 'TUFTING RUGS' ? 'Tufted Rugs' : 'Jute Crafts'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
