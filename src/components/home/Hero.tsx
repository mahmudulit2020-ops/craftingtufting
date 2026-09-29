import React from 'react';
import AtelierHeroSlider from './AtelierHeroSlider';
import { ShieldCheck, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative w-full">
      {/* 1. Designer Atelier Hero Slider with user-requested image, touch/click slide controls, and luxury action buttons */}
      <AtelierHeroSlider />

      {/* 2. Floating Bottom Atelier Metrics Strip */}
      <div className="relative border-t border-sand-300/40 bg-sand-100/90 text-charcoal-700 backdrop-blur-md z-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <ShieldCheck size={14} className="text-[#C89B3C]" />
            <span>Handmade in Dhaka &amp; Narayanganj Textile Workshops</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-wider font-mono text-charcoal-500">
            <span>Virgin NZ Wool</span>
            <span className="text-sand-300">•</span>
            <span>Delta Golden Jute</span>
            <span className="text-sand-300">•</span>
            <span>Azo-Free Pigments</span>
            <span className="text-sand-300">•</span>
            <span>Insured Global Courier</span>
          </div>

          <Link
            to="/track-order"
            className="text-teal-700 hover:text-teal-900 transition-colors tracking-wider uppercase text-[11px] font-semibold flex items-center gap-1.5"
          >
            <Compass size={13} />
            <span>Track Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
