import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  ShieldCheck,
  Heart,
  Star,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import SkylineWave from './SkylineWave';
import BrandLogo from './common/BrandLogo';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative bg-[#111317] text-white overflow-hidden">
      {/* 1. Iconic Skyline Equalizer Transition Wave on Top of Footer */}
      <SkylineWave />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-14 pb-8 relative z-10">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Brand Logo, Quote & Satisfaction Guarantee Seal (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Logo with Tufting Machine & Stencil Typography */}
            <BrandLogo variant="light" size="lg" />

            {/* Brand Quote */}
            <p className="text-sand-200/80 text-xs sm:text-sm leading-relaxed max-w-md italic">
              &ldquo;{t('brandQuote', 'Crafting & Tufting delivers bespoke handmade rugs & golden delta handicrafts that outshine industry standards. Our commitment to delta fiber excellence and precision hand-tufting ensures each custom project achieves exceptional results and lasting impact.')}&rdquo;
            </p>

            {/* Circular Social Media Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { name: 'Facebook', icon: 'f', href: 'https://facebook.com' },
                { name: 'X / Twitter', icon: '𝕏', href: 'https://twitter.com' },
                { name: 'Instagram', icon: '📸', href: 'https://instagram.com' },
                { name: 'Pinterest', icon: '📌', href: 'https://pinterest.com' },
                { name: 'YouTube', icon: '▶', href: 'https://youtube.com' },
                { name: 'WhatsApp', icon: '💬', href: 'https://whatsapp.com' },
                { name: 'LinkedIn', icon: 'in', href: 'https://linkedin.com' },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-full border border-teal-500/40 bg-teal-950/30 hover:bg-teal-500 hover:border-teal-400 hover:text-black text-teal-300 flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110 shadow-xs"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Satisfaction Guaranteed Seal */}
            <div className="pt-2 flex items-center gap-3.5 bg-white/5 border border-white/10 p-3.5 rounded-lg max-w-md">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/60 flex items-center justify-center flex-shrink-0 text-amber-400">
                <Star size={18} className="fill-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
                  {t('satisfactionGuaranteed', 'Satisfaction Guaranteed')}
                </h4>
                <p className="text-[11px] text-sand-300/80 leading-snug">
                  {t('satisfactionGuaranteedDesc', 'Begin your journey — where brilliant bespoke ideas meet flawless artisan execution.')}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                {t('quickLinks', 'Quick Links')}
              </h3>
              <div className="w-8 h-0.5 bg-teal-400 mt-1.5" />
            </div>
            <ul className="space-y-2 text-xs text-sand-300/80">
              <li>
                <Link to="/shop" className="hover:text-teal-300 transition-colors">
                  {t('exploreCollection', 'Explore Collections')}
                </Link>
              </li>
              <li>
                <Link to="/custom-rug" className="hover:text-teal-300 transition-colors">
                  {t('customRugStudio', 'Custom Rug Studio')}
                </Link>
              </li>
              <li>
                <Link to="/tufting-supplies" className="hover:text-teal-300 transition-colors">
                  {t('tuftingSupplies', 'Tufting Supplies')}
                </Link>
              </li>
              <li>
                <Link to="/jute-handicrafts" className="hover:text-teal-300 transition-colors">
                  {t('juteHandicrafts', 'Jute Handicrafts')}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-teal-300 transition-colors">
                  {t('trackOrder', 'Live Order Tracker')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-300 transition-colors">
                  {t('aboutAtelier', 'Atelier Story & Heritage')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                Useful Links
              </h3>
              <div className="w-8 h-0.5 bg-teal-400 mt-1.5" />
            </div>
            <ul className="space-y-2 text-xs text-sand-300/80">
              <li>
                <Link to="/about" className="hover:text-teal-300 transition-colors">
                  Atelier Work Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-300 transition-colors">
                  Refund &amp; 50% Advance Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-300 transition-colors">
                  Privacy &amp; Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-300 transition-colors">
                  Fair-Trade Certification
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-300 transition-colors">
                  DMCA Copyright Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-300 transition-colors">
                  International Shipping FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Join Newsletter (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                {t('newsletterTitle', 'Join Newsletter')}
              </h3>
              <div className="w-8 h-0.5 bg-teal-400 mt-1.5" />
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-[#1b1f24] border border-white/15 focus:border-teal-400 px-3.5 py-2.5 text-xs text-white placeholder:text-sand-400/60 rounded-xs outline-hidden transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 active:scale-[0.98]"
              >
                <span>{subscribed ? t('subscribed', 'Subscribed!') : t('subscribe', 'Subscribe')}</span>
                <Send size={13} />
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-1.5 text-teal-400 text-[11px]">
                <CheckCircle2 size={13} />
                <span>Thank you! 10% discount code sent to your inbox.</span>
              </div>
            )}

            <p className="text-[11px] text-sand-400/80 leading-relaxed">
              {t('newsletterDesc', 'Stay updated with our latest releases and studio offers. No spam, unsubscribe anytime. Trust our artisan team.')}
            </p>
          </div>
        </div>

        {/* Support, Charities & DMCA Strip */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 text-xs">
          {/* Charitable Foundation Support */}
          <div className="flex items-center gap-3">
            <span className="text-teal-400 font-mono text-[11px] tracking-wider uppercase font-semibold">
              WE SUPPORT:
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-sand-200 hover:border-teal-400 transition-colors">
              <Heart size={12} className="text-rose-400 fill-rose-400" />
              <span>Donate to DeltaCraft &amp; Artisan Families</span>
              <span className="text-[10px] text-teal-300 uppercase font-mono px-1.5 py-0.2 bg-teal-900/50 rounded-xs">
                Charitable Organizations
              </span>
            </div>
          </div>

          {/* DMCA & SSL Badges */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1b1f24] border border-teal-500/30 rounded-xs text-[11px] text-teal-300 font-mono">
              <ShieldCheck size={13} className="text-teal-400" />
              <span>DMCA.COM PROTECTED</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-xs text-[11px] text-sand-300 font-mono">
              <Lock size={12} className="text-amber-400" />
              <span>256-Bit SSL</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright & Payment Icons Strip */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <div>
            <p className="text-[11px] text-sand-400/90">
              Copyright &copy; 2018 &ndash; {new Date().getFullYear()} Crafting &amp; Tufting. {t('allRightsReserved', 'All rights reserved. Handcrafted with passion in Bangladesh.')}
            </p>
          </div>

          {/* Realistic Payment Method Badges (bKash, Nagad, VISA, Mastercard, Amex, PayPal, Klarna, Apple Pay) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-[#E2136E] text-white text-[10px] font-black rounded-xs shadow-xs">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-[#F7941D] text-white text-[10px] font-black rounded-xs shadow-xs">
              Nagad
            </span>
            <span className="px-2 py-0.5 bg-[#1A1F71] text-white text-[10px] font-black rounded-xs italic">
              VISA
            </span>
            <span className="px-2 py-0.5 bg-[#EB001B] text-white text-[10px] font-black rounded-xs">
              Mastercard
            </span>
            <span className="px-2 py-0.5 bg-[#002663] text-white text-[10px] font-black rounded-xs">
              AMEX
            </span>
            <span className="px-2 py-0.5 bg-[#003087] text-white text-[10px] font-black rounded-xs">
              PayPal
            </span>
            <span className="px-2 py-0.5 bg-[#FFB3C7] text-black text-[10px] font-black rounded-xs">
              Klarna
            </span>
            <span className="px-2 py-0.5 bg-black border border-white/20 text-white text-[10px] font-bold rounded-xs">
               Pay
            </span>
          </div>
        </div>
      </div>

      {/* Iconic Geometric Bottom Diagonal Ribbon Fold Accent (seen at bottom of video) */}
      <div className="w-full flex items-center justify-between h-4 bg-[#0a0b0d] border-t border-white/5 px-6">
        <div className="w-16 h-2 bg-gradient-to-r from-teal-500/20 to-transparent transform -skew-x-12" />
        <span className="text-[9px] font-mono text-sand-500/60 uppercase tracking-widest">
          + CRAFTING &amp; TUFTING DELTA ATELIER +
        </span>
        <div className="w-16 h-2 bg-gradient-to-l from-teal-500/20 to-transparent transform skew-x-12" />
      </div>
    </footer>
  );
}
