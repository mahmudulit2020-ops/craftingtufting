import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'dark'; // 'dark' = dark text for light backgrounds (navbar), 'light' = white text for dark backgrounds (footer)
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'stacked';
  showSubtitle?: boolean;
  className?: string;
  asLink?: boolean;
}

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  layout = 'horizontal',
  showSubtitle = false,
  className = '',
  asLink = true,
}: BrandLogoProps) {
  const isLight = variant === 'light'; // White on dark background

  // Heights configuration
  const heights = {
    sm: layout === 'stacked' ? 'h-9 sm:h-10' : 'h-8 sm:h-9',
    md: layout === 'stacked' ? 'h-11 sm:h-13' : 'h-9 sm:h-11',
    lg: layout === 'stacked' ? 'h-14 sm:h-16' : 'h-12 sm:h-14',
    xl: layout === 'stacked' ? 'h-20 sm:h-24' : 'h-16 sm:h-20',
  };

  const primaryText = isLight ? '#FFFFFF' : '#14171C';
  const secondaryText = isLight ? '#F3F4F6' : '#1F2937';
  const goldAccent = '#C89B3C'; // Warm Bengal Brass Gold
  const gunBody = isLight ? '#F9FAFB' : '#1F2937';
  const gunMetal = isLight ? '#D1D5DB' : '#4B5563';

  // Precision Tufting Gun Vector Graphic (matching reference image)
  const TuftingGunIcon = ({ width = 36, height = 36 }: { width?: number; height?: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Top Yarn Spool Cone */}
      <rect x="26" y="4" width="12" height="10" rx="2" fill="#D97706" />
      <rect x="25" y="2" width="14" height="2.5" rx="1" fill={gunMetal} />
      <line x1="27" y1="7" x2="37" y2="9" stroke="#FEF3C7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27" y1="11" x2="37" y2="13" stroke="#FEF3C7" strokeWidth="1.2" strokeLinecap="round" />

      {/* Main Machine Chassis */}
      <rect x="12" y="14" width="26" height="15" rx="3" fill={gunBody} stroke={gunMetal} strokeWidth="1.2" />
      <line x1="16" y1="18" x2="22" y2="18" stroke={gunMetal} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="21" x2="22" y2="21" stroke={gunMetal} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="24" x2="22" y2="24" stroke={gunMetal} strokeWidth="1.2" strokeLinecap="round" />

      {/* Gear Pivot */}
      <circle cx="29" cy="21" r="3.5" fill="#111827" />
      <circle cx="29" cy="21" r="1.5" fill={goldAccent} />

      {/* Pistol Grip Handle */}
      <path
        d="M17 29 L14 41 C13.5 43 15 44.5 17 44.5 L20 44 C22 43.5 23 42 23.5 40 L25 29 Z"
        fill={gunBody}
        stroke={gunMetal}
        strokeWidth="1.2"
      />
      {/* Red Trigger */}
      <rect x="25" y="32" width="2.5" height="4.5" rx="1" fill="#DC2626" />

      {/* Front Guide Rods & Bearings */}
      <line x1="38" y1="18" x2="44" y2="18" stroke={gunMetal} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="38" y1="24" x2="44" y2="24" stroke={gunMetal} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="40" y="16.5" width="3" height="3" rx="0.8" fill={goldAccent} />
      <rect x="40" y="22.5" width="3" height="3" rx="0.8" fill={goldAccent} />

      {/* Tufting Needle Tip */}
      <polygon points="44,20 48,21 44,22" fill={gunMetal} />

      {/* Curving Thread Loop emerging from needle */}
      <path
        d="M46 21 Q49 21 50 24 Q51 28 48 31 Q46 34 48 37"
        stroke={goldAccent}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  // Content for Horizontal Lockup
  const HorizontalLockup = (
    <div className={`inline-flex items-center gap-3.5 ${heights[size]} ${className}`}>
      {/* Tufting Gun Graphic Badge - Significantly Larger, Clearer & High-Definition */}
      <div className="relative shrink-0 flex items-center justify-center p-2 rounded-md bg-[#12151B] border-2 border-[#C89B3C] shadow-sm">
        <TuftingGunIcon
          width={size === 'sm' ? 36 : size === 'lg' ? 52 : size === 'xl' ? 62 : 44}
          height={size === 'sm' ? 36 : size === 'lg' ? 52 : size === 'xl' ? 62 : 44}
        />
      </div>

      {/* Brand Text: CRAFTING & TUFTING - Large, Bold, Eye-Catching Dark Color */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
          <span
            className="font-display font-black tracking-tight"
            style={{
              color: isLight ? '#FFFFFF' : '#080A0E', // Deep eye-catching dark obsidian
              fontSize: size === 'sm' ? '18px' : size === 'lg' ? '28px' : size === 'xl' ? '34px' : '23px',
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            CRAFTING
          </span>
          <span
            className="font-display font-black"
            style={{
              color: '#C89B3C', // Eye-catching Bengal Brass Gold
              fontSize: size === 'sm' ? '19px' : size === 'lg' ? '29px' : size === 'xl' ? '35px' : '24px',
            }}
          >
            &amp;
          </span>
          <span
            className="font-display font-black tracking-tight"
            style={{
              color: isLight ? '#F3F4F6' : '#080A0E', // Deep eye-catching dark obsidian
              fontSize: size === 'sm' ? '18px' : size === 'lg' ? '28px' : size === 'xl' ? '34px' : '23px',
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            TUFTING
          </span>
        </div>

        <span
          className="block tracking-[0.26em] uppercase font-mono font-bold text-[8.5px] sm:text-[9.5px] mt-1"
          style={{ color: isLight ? '#F59E0B' : '#78350F' }}
        >
          BESPOKE RUG ATELIER
        </span>
      </div>
    </div>
  );

  // Content for Stacked Lockup (matching the reference image style)
  const StackedLockup = (
    <div className={`inline-flex flex-col leading-tight ${className}`}>
      <div className="flex items-center gap-2">
        <span
          className="font-display font-extrabold tracking-tight"
          style={{
            color: primaryText,
            fontSize: size === 'sm' ? '15px' : size === 'lg' ? '26px' : size === 'xl' ? '34px' : '20px',
            fontFamily: "'Plus Jakarta Sans', 'Archivo Black', -apple-system, sans-serif",
          }}
        >
          CRAFTING
        </span>
        <TuftingGunIcon width={size === 'sm' ? 22 : size === 'lg' ? 32 : size === 'xl' ? 40 : 26} height={size === 'sm' ? 22 : size === 'lg' ? 32 : size === 'xl' ? 40 : 26} />
      </div>

      <div className="flex items-center gap-1.5 -mt-0.5">
        <span
          className="font-display font-black"
          style={{
            color: goldAccent,
            fontSize: size === 'sm' ? '15px' : size === 'lg' ? '26px' : size === 'xl' ? '34px' : '20px',
          }}
        >
          &amp;
        </span>
        <span
          className="font-display font-extrabold tracking-tight"
          style={{
            color: secondaryText,
            fontSize: size === 'sm' ? '15px' : size === 'lg' ? '26px' : size === 'xl' ? '34px' : '20px',
            fontFamily: "'Plus Jakarta Sans', 'Archivo Black', -apple-system, sans-serif",
          }}
        >
          TUFTING
        </span>
      </div>

      {showSubtitle && (
        <span
          className={`block tracking-[0.25em] uppercase font-mono text-[8px] mt-0.5 ${
            isLight ? 'text-sand-300' : 'text-charcoal-500'
          }`}
        >
          Bespoke Rug Atelier
        </span>
      )}
    </div>
  );

  const content = layout === 'stacked' ? StackedLockup : HorizontalLockup;

  if (!asLink) {
    return content;
  }

  return (
    <Link
      to="/"
      aria-label="CRAFTING & TUFTING Homepage"
      className="inline-flex items-center transition-transform duration-200 hover:scale-[1.02] focus:outline-hidden"
    >
      {content}
    </Link>
  );
}
