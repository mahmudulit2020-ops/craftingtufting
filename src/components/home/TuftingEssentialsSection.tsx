import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Star,
  Globe,
  Lock,
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import WeaveReveal from '@/components/motion/WeaveReveal';

export interface TuftingCategoryItem {
  id: string;
  title: string;
  queryParam: string;
  badge?: string;
  icon: (color?: string) => React.ReactNode;
}

export const TUFTING_CATEGORIES: TuftingCategoryItem[] = [
  {
    id: 'guns',
    title: 'Tufting guns',
    queryParam: 'guns',
    badge: '2-Yr Warranty',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Tufting gun profile: handle, motor body, front needle guide */}
        <path d="M12 28h24v12H20l-4 16H8l4-16H8v-8l4-4z" />
        <path d="M36 30h14l4 4v4h-18v-8z" />
        <path d="M54 34h6" />
        <path d="M50 24v6" />
        <circle cx="28" cy="34" r="3" />
        <path d="M20 44h-5" />
        <path d="M16 28v-8h10v8" />
        <line x1="30" y1="20" x2="38" y2="28" />
      </svg>
    ),
  },
  {
    id: 'yarn-nz',
    title: 'Tufting Yarn (Wool of New Zealand)',
    queryParam: 'yarn',
    badge: '100% Pure',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Yarn cone with winding strands */}
        <path d="M26 10h12l8 44H18l8-44z" />
        <path d="M22 22h20" />
        <path d="M20 32h24" />
        <path d="M19 42h26" />
        <ellipse cx="32" cy="10" rx="6" ry="2" />
        <ellipse cx="32" cy="54" rx="14" ry="4" />
      </svg>
    ),
  },
  {
    id: 'primary-canvas',
    title: 'Primary Backing Canvas',
    queryParam: 'canvas',
    badge: 'Guide Lines',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Monks cloth grid pattern with yellow/contrasting lines */}
        <rect x="12" y="12" width="40" height="40" rx="2" />
        <line x1="20" y1="12" x2="20" y2="52" />
        <line x1="28" y1="12" x2="28" y2="52" strokeWidth="2.5" stroke="#C89B3C" />
        <line x1="36" y1="12" x2="36" y2="52" />
        <line x1="44" y1="12" x2="44" y2="52" strokeWidth="2.5" stroke="#C89B3C" />
        <line x1="12" y1="20" x2="52" y2="20" />
        <line x1="12" y1="28" x2="52" y2="28" strokeWidth="2.5" stroke="#C89B3C" />
        <line x1="12" y1="36" x2="52" y2="36" />
        <line x1="12" y1="44" x2="52" y2="44" strokeWidth="2.5" stroke="#C89B3C" />
      </svg>
    ),
  },
  {
    id: 'secondary-backing',
    title: 'Secondary Backing Canvas and Glue',
    queryParam: 'backing',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Layered backing cloth with adhesive bottle */}
        <path d="M12 16h24l12 12v24H12V16z" />
        <path d="M36 16v12h12" />
        <line x1="18" y1="34" x2="32" y2="34" strokeDasharray="3 3" />
        <line x1="18" y1="40" x2="38" y2="40" strokeDasharray="3 3" />
        <line x1="18" y1="46" x2="30" y2="46" strokeDasharray="3 3" />
        {/* Glue nozzle */}
        <path d="M40 38l6-6 4 4-6 6" />
        <path d="M48 30l4-4" />
      </svg>
    ),
  },
  {
    id: 'starter-kits',
    title: 'Starter kits',
    queryParam: 'starter-kits',
    badge: 'Best Value',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Gun + backing cloth bundle */}
        <rect x="24" y="24" width="28" height="28" rx="2" strokeDasharray="2 2" />
        <line x1="32" y1="24" x2="32" y2="52" />
        <line x1="40" y1="24" x2="40" y2="52" />
        <line x1="24" y1="32" x2="52" y2="32" />
        <line x1="24" y1="40" x2="52" y2="40" />
        {/* Tufting gun outline in front */}
        <path d="M10 20h14v8h-6l-2 10h-6l2-10h-2v-8z" />
        <path d="M24 22h8v4h-8z" />
        <circle cx="18" cy="24" r="1.5" />
      </svg>
    ),
  },
  {
    id: 'frames-grippers',
    title: 'Frames and grippers',
    queryParam: 'frames',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Tufting frame with wooden corner joints and micro-grippers */}
        <rect x="12" y="12" width="40" height="40" rx="1" />
        <rect x="18" y="18" width="28" height="28" />
        {/* Corner join pins */}
        <circle cx="15" cy="15" r="1" fill={color} />
        <circle cx="49" cy="15" r="1" fill={color} />
        <circle cx="15" cy="49" r="1" fill={color} />
        <circle cx="49" cy="49" r="1" fill={color} />
        {/* Gripper teeth */}
        <path d="M20 15h24M20 49h24M15 20v24M49 20v24" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    id: 'xxl-cones',
    title: 'XXL cones',
    queryParam: 'xxl-cones',
    badge: '1.5kg Bulk',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Massive oversized yarn cone */}
        <path d="M24 8h16l10 48H14l10-48z" />
        <ellipse cx="32" cy="8" rx="8" ry="3" />
        <ellipse cx="32" cy="56" rx="18" ry="5" />
        {/* Dense cross-wound yarn layers */}
        <path d="M21 20l22 4" />
        <path d="M43 28L19 32" />
        <path d="M18 40l28 4" />
        <path d="M47 48L16 52" />
      </svg>
    ),
  },
  {
    id: 'shearing-trimming',
    title: 'Shearing, Trimming & Rug carving tools',
    queryParam: 'shearing',
    badge: 'Precision',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Electric trimmer on left, duckbill scissors on right */}
        {/* Trimmer */}
        <rect x="14" y="16" width="10" height="28" rx="3" />
        <path d="M16 16v-4h6v4" />
        <line x1="17" y1="12" x2="21" y2="12" />
        <circle cx="19" cy="36" r="1.5" />
        {/* Duckbill / carving scissors */}
        <path d="M38 12l6 14-4 8" />
        <path d="M46 12l-6 14 4 8" />
        <circle cx="36" cy="44" r="5" />
        <circle cx="48" cy="44" r="5" />
      </svg>
    ),
  },
  {
    id: 'essential-tools',
    title: 'Other Essential tools',
    queryParam: 'tools',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Threader loop, lubricant bottle, replacement needle */}
        <path d="M18 20v24" />
        <ellipse cx="18" cy="14" rx="4" ry="6" />
        {/* Oil bottle */}
        <rect x="36" y="26" width="12" height="22" rx="2" />
        <path d="M40 26v-8l2-4 2 4v8" />
        <line x1="42" y1="14" x2="42" y2="10" />
      </svg>
    ),
  },
  {
    id: 'giftshop',
    title: 'Giftshop',
    queryParam: 'giftshop',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Present box with ribbon bow */}
        <rect x="16" y="26" width="32" height="26" rx="2" />
        <rect x="14" y="20" width="36" height="8" rx="2" />
        <line x1="32" y1="20" x2="32" y2="52" />
        <line x1="14" y1="38" x2="48" y2="38" />
        <path d="M32 20c-4-8-12-6-10 0 2 6 10 0 10 0z" />
        <path d="M32 20c4-8 12-6 10 0-2 6-10 0-10 0z" />
      </svg>
    ),
  },
  {
    id: 'wall-hanging',
    title: 'Wall hanging & presentation',
    queryParam: 'display',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Framed rug hung on wall with suspension wire */}
        <rect x="14" y="22" width="36" height="28" rx="1" />
        <path d="M14 22l18-12 18 12" />
        <circle cx="32" cy="10" r="1.5" />
        {/* Mountain/art motif inside rug frame */}
        <path d="M18 44l10-12 8 8 6-6 4 10" />
      </svg>
    ),
  },
  {
    id: 'outlet-sale',
    title: 'Outlet sale',
    queryParam: 'outlet',
    badge: 'Up to -40%',
    icon: (color = '#386641') => (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Sale tag with percentage sign */}
        <path d="M22 14h16l16 16-16 16-24-24V14z" />
        <circle cx="28" cy="22" r="3" />
        <line x1="36" y1="36" x2="44" y2="28" />
        <circle cx="37" cy="29" r="1.5" fill={color} />
        <circle cx="43" cy="35" r="1.5" fill={color} />
      </svg>
    ),
  },
];

export const TuftingEssentialsSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Bulk Deals on Premium Tufting Yarn',
      bullets: [
        'Buy 5+ yarns, 10% off',
        'Buy 10+ yarns, 20% off',
        'Buy 25+ yarns, 30% off',
      ],
      buttonText: 'Buy tufting Wool',
      link: '/tufting-supplies?category=yarn',
      image: 'https://images.pexels.com/photos/6850428/pexels-photo-6850428.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      title: 'AK-I Pro Duo Tufting Guns In Stock',
      bullets: [
        'Cut & Loop pile switchable in 30 seconds',
        'Precision Japanese ball-bearing motor',
        'Includes 2-year warranty & free maintenance kit',
      ],
      buttonText: 'Explore Tufting Guns',
      link: '/tufting-supplies?category=guns',
      image: 'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      title: 'Complete Studio Starter Bundles',
      bullets: [
        'AK-I Gun + Hardwood Frame + Grippers',
        '10x New Zealand Wool Cones included',
        'Primary Monks Cloth & Carving Trimmer',
      ],
      buttonText: 'Shop Starter Kits',
      link: '/tufting-supplies?category=starter-kits',
      image: 'https://images.pexels.com/photos/6850389/pexels-photo-6850389.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ];

  const currentSlide = slides[activeSlide];

  return (
    <section className="bg-white border-y border-sand-200">
      {/* 1. TOP HERO BANNER SLIDER (Bulk Deals & Wool Cones on Shelves) */}
      <div className="relative bg-[#F9F7F3] border-b border-sand-200 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px] lg:min-h-[420px] items-stretch">
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center z-10">
              <WeaveReveal direction="up" delay={0.1}>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-accent mb-3">
                  <Sparkles size={13} />
                  Artist Supply Depot
                </span>
              </WeaveReveal>

              <WeaveReveal direction="up" delay={0.2}>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal-900 font-bold leading-tight mb-5">
                  {currentSlide.title}
                </h2>
              </WeaveReveal>

              <WeaveReveal direction="up" delay={0.3}>
                <ul className="space-y-2 mb-8 text-sm sm:text-base text-charcoal-700">
                  {currentSlide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
                      <span className="font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </WeaveReveal>

              <WeaveReveal direction="up" delay={0.4}>
                <div className="flex items-center gap-4">
                  <Link
                    to={currentSlide.link}
                    className="inline-flex items-center gap-2.5 bg-[#2B2B28] hover:bg-black text-cream px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    <ShoppingCart size={16} />
                    <span>{currentSlide.buttonText}</span>
                  </Link>

                  <Link
                    to="/tufting-supplies"
                    className="text-xs sm:text-sm text-charcoal-700 hover:text-charcoal-900 font-medium underline underline-offset-4 flex items-center gap-1"
                  >
                    View All Supplies <ChevronRight size={14} />
                  </Link>
                </div>
              </WeaveReveal>
            </div>

            {/* Right Visual Column — Wooden Shelves with Yarn Cones & Tools */}
            <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-full bg-sand-200 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform hover:scale-105"
                style={{
                  backgroundImage: `url('${currentSlide.image}')`,
                }}
              >
                {/* Ambient Soft Wood Shelving & Warm Illumination Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F3] via-transparent to-transparent lg:w-40" />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-sand-300">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeSlide === idx
                        ? 'bg-charcoal-900 w-6'
                        : 'bg-sand-400 hover:bg-sand-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Banner: 2-Year Warranty & Spare Parts Guarantee */}
        <div className="bg-[#EBF3EC] border-t border-b border-[#D4E4D7] py-2.5 px-4 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs sm:text-sm font-semibold text-[#255E31]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#255E31]" />
              2-Year Warranty on All Machines
            </span>
            <span className="hidden sm:inline text-sand-400">•</span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-[#255E31]" strokeWidth={3} />
              Original Spare Parts Always in Stock
            </span>
            <span className="hidden sm:inline text-sand-400">•</span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-[#255E31]" strokeWidth={3} />
              Fast Global Dispatch via DHL Express
            </span>
          </div>
        </div>
      </div>

      {/* 2. TRUST & SOCIAL PROOF STRIP */}
      <div className="bg-white border-b border-sand-200 py-6 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand-200">
          {/* Column 1: Reviews */}
          <div className="py-4 md:py-0 md:px-8 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[#F4B400] mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#F4B400" />
              ))}
            </div>
            <p className="font-bold text-sm text-charcoal-900 leading-tight">
              4.8/5 from 2,300+ reviews
            </p>
            <p className="text-xs text-charcoal-500 mt-0.5">Verified tufting artists & studios</p>
          </div>

          {/* Column 2: Global Reach */}
          <div className="py-4 md:py-0 md:px-8 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1.5">
              <Globe size={18} />
            </div>
            <p className="font-bold text-sm text-charcoal-900 leading-tight">
              Trusted by artists
            </p>
            <p className="text-xs text-charcoal-500 mt-0.5">Active in 40+ countries worldwide</p>
          </div>

          {/* Column 3: Secure Checkout & Payment Logos */}
          <div className="py-4 md:py-0 md:px-8 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-sand-100 text-charcoal-800 flex items-center justify-center mb-1.5">
              <Lock size={16} />
            </div>
            <p className="font-bold text-sm text-charcoal-900 leading-tight">
              Secure checkout
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sand-100 border border-sand-300 text-blue-900 rounded-xs">
                PayPal
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-pink-100 border border-pink-300 text-pink-900 rounded-xs">
                Klarna
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xs">
                VISA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xs">
                Mastercard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TUFTING ESSENTIALS FOR EVERY ARTIST — 12 CATEGORIES GRID */}
      <div className="py-16 sm:py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <WeaveReveal direction="up" delay={0.1}>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal-900 font-bold tracking-tight mb-3">
              Tufting Essentials for Every Artist
            </h2>
          </WeaveReveal>
          <WeaveReveal direction="up" delay={0.2}>
            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
              Explore our curated selection of tufting tools and materials. From professional-grade machines to luxurious yarns.
            </p>
          </WeaveReveal>
        </div>

        {/* 12 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {TUFTING_CATEGORIES.map((cat, idx) => (
            <WeaveReveal key={cat.id} direction="up" delay={0.05 * (idx % 6)}>
              <div
                onClick={() => navigate(`/tufting-supplies?category=${cat.queryParam}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/tufting-supplies?category=${cat.queryParam}`);
                  }
                }}
                className="group relative bg-[#F6F5F2] hover:bg-white border border-sand-200 hover:border-charcoal-900 flex flex-col items-center justify-between p-4 sm:p-5 rounded-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer min-h-[190px] sm:min-h-[220px]"
              >
                {/* Optional Badge */}
                {cat.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xs">
                    {cat.badge}
                  </span>
                )}

                {/* SVG Icon Illustration in Forest Green */}
                <div className="flex-1 flex items-center justify-center p-3 text-[#2E6B38] group-hover:scale-110 transition-transform duration-300">
                  {cat.icon('#2E6B38')}
                </div>

                {/* Bottom Label Button Container */}
                <div className="w-full text-center mt-auto pt-2 border-t border-sand-200/60 group-hover:border-sand-300">
                  <span className="text-[11px] sm:text-xs font-semibold text-charcoal-800 group-hover:text-charcoal-900 line-clamp-2 leading-tight">
                    {cat.title}
                  </span>
                </div>
              </div>
            </WeaveReveal>
          ))}
        </div>

        {/* Bottom CTA to Full Catalog */}
        <div className="mt-12 text-center">
          <Link
            to="/tufting-supplies"
            className="inline-flex items-center gap-2 btn-primary !text-xs !py-3 !px-8"
          >
            <span>Browse Complete Supplies Catalog</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TuftingEssentialsSection;
