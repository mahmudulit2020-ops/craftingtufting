import React from 'react';

export type StudioStyle = 'scandi' | 'industrial' | 'boho' | 'japandi' | 'pop';

interface AtelierStudioSceneProps {
  style: StudioStyle;
}

export default function AtelierStudioScene({ style }: AtelierStudioSceneProps) {
  // Theme palette definitions for each distinct style
  const themes = {
    // 1. Scandi Warm Pine (Matches user's reference image directly)
    scandi: {
      wallBg: 'linear-gradient(135deg, #FAF7F2 0%, #F0ECE1 100%)',
      wallAccent: '#E5DFD1',
      woodTone: '#E2B078', // Warm natural pine
      woodDark: '#C4945A',
      floorColor: '#DEBC91', // Light oak floor
      floorLine: '#CEAA7F',
      windowGlow: 'rgba(255, 248, 230, 0.45)',
      loomColor: '#E2B078',
      loomWoodAccent: '#BA884F',
      rug1Palette: ['#3B82F6', '#F59E0B', '#EC4899', '#10B981', '#6366F1'], // Colorful abstract
      rug2Palette: ['#1E3A8A', '#047857', '#B45309', '#F97316', '#E0E7FF'], // Wavy landscape
      yarnCones: ['#EAB308', '#EC4899', '#3B82F6', '#10B981', '#F97316', '#8B5CF6', '#14B8A6'],
      cartColor: '#EA580C', // Orange rolling cart
      stoolCushion: '#F3E8D6',
      stoolMotif: '#2563EB',
      hasCat: true,
      windowView: '#D1E7DD',
    },

    // 2. Industrial Brick & Steel Loft
    industrial: {
      wallBg: 'linear-gradient(135deg, #78350F 0%, #451A03 50%, #271302 100%)', // Exposed brick feel
      wallAccent: '#9A3412',
      woodTone: '#78350F', // Dark reclaimed walnut
      woodDark: '#451A03',
      floorColor: '#374151', // Polished dark concrete
      floorLine: '#1F2937',
      windowGlow: 'rgba(254, 215, 170, 0.3)',
      loomColor: '#92400E',
      loomWoodAccent: '#451A03',
      rug1Palette: ['#DC2626', '#1E40AF', '#FACC15', '#171717', '#FAFAFA'], // Bold Bauhaus geometric
      rug2Palette: ['#991B1B', '#1E3A8A', '#D97706', '#0F172A', '#E2E8F0'], // Mondrian-style bold lines
      yarnCones: ['#DC2626', '#2563EB', '#F59E0B', '#10B981', '#9333EA', '#0284C7', '#EA580C'],
      cartColor: '#1F2937', // Matte black industrial cart
      stoolCushion: '#B45309',
      stoolMotif: '#FEF3C7',
      hasCat: false,
      windowView: '#9CA3AF',
    },

    // 3. Earthy Bohemian & Golden Delta Jute
    boho: {
      wallBg: 'linear-gradient(135deg, #EFECE6 0%, #DFD7C7 100%)', // Lime-washed warm plaster
      wallAccent: '#C9BEA8',
      woodTone: '#C28D53', // Golden teak & rattan
      woodDark: '#936434',
      floorColor: '#C49864', // Weathered timber boards
      floorLine: '#A87D4B',
      windowGlow: 'rgba(255, 237, 213, 0.45)',
      loomColor: '#C28D53',
      loomWoodAccent: '#936434',
      rug1Palette: ['#78350F', '#B45309', '#065F46', '#D97706', '#FEF3C7'], // Earthy botanical flora
      rug2Palette: ['#92400E', '#047857', '#A16207', '#C2410C', '#FEF08A'], // Golden delta mandala
      yarnCones: ['#B45309', '#047857', '#D97706', '#78350F', '#15803D', '#CA8A04', '#EA580C'],
      cartColor: '#B45309', // Terracotta clay cart
      stoolCushion: '#E6D5B8',
      stoolMotif: '#78350F',
      hasCat: true,
      windowView: '#D1FAE5',
    },

    // 4. Japandi Zen Craft Atelier
    japandi: {
      wallBg: 'linear-gradient(135deg, #F5F5F0 0%, #E8E8E0 100%)', // Wabi-sabi serene pale clay
      wallAccent: '#D8D8CC',
      woodTone: '#D4B996', // Light Japanese Hinoki & Ash
      woodDark: '#A88D6A',
      floorColor: '#E0CEB5', // Pale tatami / light maple
      floorLine: '#C7B59C',
      windowGlow: 'rgba(255, 255, 255, 0.55)',
      loomColor: '#D4B996',
      loomWoodAccent: '#B89C77',
      rug1Palette: ['#292524', '#78716C', '#15803D', '#D6D3D1', '#F5F5F4'], // Zen organic curved stone
      rug2Palette: ['#1C1917', '#57534E', '#047857', '#A8A29E', '#FAFAF9'], // Sculptural wavy wave
      yarnCones: ['#44403C', '#15803D', '#A8A29E', '#78716C', '#292524', '#047857', '#D6D3D1'],
      cartColor: '#78716C', // Warm stone grey cart
      stoolCushion: '#E7E5E4',
      stoolMotif: '#292524',
      hasCat: true,
      windowView: '#E2E8F0',
    },

    // 5. Vibrant Memphis Pop Art Color Lab
    pop: {
      wallBg: 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 50%, #F5D0FE 100%)', // Lavender pastel
      wallAccent: '#E879F9',
      woodTone: '#FDE047', // Playful canary yellow framing
      woodDark: '#EAB308',
      floorColor: '#F3E8FF', // Cheerful lilac studio floor
      floorLine: '#D8B4FE',
      windowGlow: 'rgba(244, 114, 182, 0.3)',
      loomColor: '#FACC15',
      loomWoodAccent: '#EAB308',
      rug1Palette: ['#EC4899', '#8B5CF6', '#06B6D4', '#F43F5E', '#FBBF24'], // Pop art psychedelic swirl
      rug2Palette: ['#D946EF', '#3B82F6', '#10B981', '#FB923C', '#F472B6'], // Wavy checkered squiggle
      yarnCones: ['#EC4899', '#8B5CF6', '#06B6D4', '#EAB308', '#10B981', '#F97316', '#A855F7'],
      cartColor: '#06B6D4', // Cyan electric cart
      stoolCushion: '#FDF2F8',
      stoolMotif: '#EC4899',
      hasCat: false,
      windowView: '#BAE6FD',
    },
  };

  const t = themes[style] || themes.scandi;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: t.wallBg }}
    >
      <svg
        viewBox="0 0 1200 675"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sunlight Gradient pouring from Window on Left */}
          <linearGradient id={`sunRay-${style}`} x1="0%" y1="0%" x2="70%" y2="80%">
            <stop offset="0%" stopColor={t.windowGlow} />
            <stop offset="50%" stopColor={t.windowGlow} stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Tufting Rug 1 Pattern Gradient */}
          <linearGradient id={`rug1Grad-${style}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={t.rug1Palette[0]} />
            <stop offset="25%" stopColor={t.rug1Palette[1]} />
            <stop offset="50%" stopColor={t.rug1Palette[2]} />
            <stop offset="75%" stopColor={t.rug1Palette[3]} />
            <stop offset="100%" stopColor={t.rug1Palette[4]} />
          </linearGradient>

          {/* Rug 2 Landscape Gradient */}
          <linearGradient id={`rug2Grad-${style}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={t.rug2Palette[0]} />
            <stop offset="25%" stopColor={t.rug2Palette[1]} />
            <stop offset="50%" stopColor={t.rug2Palette[2]} />
            <stop offset="75%" stopColor={t.rug2Palette[3]} />
            <stop offset="100%" stopColor={t.rug2Palette[4]} />
          </linearGradient>

          {/* Wood grain pattern */}
          <pattern id={`woodGrain-${style}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="20" y2="10" stroke={t.woodDark} strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>

        {/* ========================================================
            1. STUDIO FLOOR (Hardwood / Concrete / Tatami)
            ======================================================== */}
        <polygon points="0,480 1200,480 1200,675 0,675" fill={t.floorColor} />
        {/* Floor Plank Seams */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`plank-${i}`}
            x1={i * 105}
            y1="480"
            x2={i * 115 - 50}
            y2="675"
            stroke={t.floorLine}
            strokeWidth="1.5"
            opacity="0.4"
          />
        ))}

        {/* Baseboard along wall */}
        <rect x="0" y="470" width="1200" height="10" fill={t.woodDark} opacity="0.6" />

        {/* ========================================================
            2. LARGE SUNLIT WINDOW (Left side, matching reference)
            ======================================================== */}
        {/* Window Frame Outer */}
        <rect x="20" y="20" width="150" height="420" fill="#FFFFFF" rx="4" stroke="#CBD5E1" strokeWidth="6" />
        {/* Window Glass Pane with outdoor landscape */}
        <rect x="30" y="30" width="130" height="400" fill={t.windowView} />
        {/* Window Mullions */}
        <line x1="95" y1="30" x2="95" y2="430" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="30" y1="160" x2="160" y2="160" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="30" y1="300" x2="160" y2="300" stroke="#FFFFFF" strokeWidth="6" />
        {/* Window Sill */}
        <rect x="10" y="430" width="170" height="16" rx="2" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1.5" />

        {/* Sleeping Studio Cat on Window Sill (if enabled) */}
        {t.hasCat && (
          <g transform="translate(45, 400)">
            {/* Pillow Cushion */}
            <ellipse cx="40" cy="28" rx="34" ry="10" fill="#FCE7F3" stroke="#F472B6" strokeWidth="1" />
            {/* Sleeping Cat Body */}
            <ellipse cx="40" cy="22" rx="22" ry="12" fill="#78350F" />
            <ellipse cx="40" cy="22" rx="19" ry="10" fill="#F97316" />
            {/* White belly patches */}
            <ellipse cx="38" cy="24" rx="10" ry="6" fill="#FFFFFF" />
            {/* Head tucked in */}
            <circle cx="56" cy="18" r="9" fill="#78350F" />
            <polygon points="58,10 64,15 56,14" fill="#F97316" />
            <polygon points="52,10 56,15 50,14" fill="#F97316" />
            {/* Sleeping closed eye curve */}
            <path d="M 55 18 Q 58 20 61 18" stroke="#1F2937" strokeWidth="1.2" fill="none" />
            {/* Tail curled around body */}
            <path d="M 20 25 Q 16 30 25 32 Q 35 32 38 29" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Sunbeams Pouring into Studio */}
        <polygon points="20,20 170,20 700,675 0,675" fill={`url(#sunRay-${style})`} />

        {/* ========================================================
            3. WALL HUNG TUFTED ARTWORK & LOGO RUG (Top Left)
            ======================================================== */}
        <g transform="translate(240, 30)">
          {/* Wooden Hanger Rod */}
          <rect x="-10" y="0" width="160" height="8" rx="3" fill={t.woodTone} />
          {/* Framed Wall Rug Canvas */}
          <rect x="0" y="8" width="140" height="130" rx="6" fill="#FFFFFF" stroke={t.woodDark} strokeWidth="3" />
          {/* Colorful Tufted Motif on Wall Rug */}
          <rect x="10" y="18" width="120" height="110" rx="4" fill={`url(#rug1Grad-${style})`} />
          <rect x="25" y="35" width="90" height="75" rx="3" fill="#1E293B" opacity="0.85" />
          {/* Stenciled Brand Text "Crafting & Tufting" */}
          <text x="70" y="65" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            CRAFTING
          </text>
          <text x="70" y="80" fill={t.rug1Palette[1]} fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            &amp; TUFTING
          </text>
          <text x="70" y="96" fill="#CBD5E1" fontSize="7" letterSpacing="1" fontFamily="sans-serif" textAnchor="middle">
            STUDIO ATELIER
          </text>
        </g>

        {/* Wall Hanging 2: Organic Narrow Runner Rug (Left of Wall Rug) */}
        <g transform="translate(190, 60)">
          <rect x="0" y="0" width="36" height="120" rx="4" fill="#FFFFFF" stroke={t.woodDark} strokeWidth="2" />
          <path d="M 6 10 Q 30 30 10 60 Q 30 90 12 110" stroke={t.rug1Palette[2]} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 22 20 Q 8 50 24 80" stroke={t.rug1Palette[0]} strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>

        {/* ========================================================
            4. WOODEN YARN SHELVES & WOOD STORAGE CRATES (Top Center)
            ======================================================== */}
        {/* Top Shelf */}
        <rect x="420" y="35" width="230" height="8" rx="2" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1" />
        {/* Shelf Metal Brackets */}
        <polygon points="440,43 440,65 446,65 446,43" fill="#64748B" />
        <polygon points="620,43 620,65 626,65 626,43" fill="#64748B" />

        {/* Colorful Wool Cones on Top Shelf */}
        {t.yarnCones.map((coneColor, i) => (
          <g key={`topcone-${i}`} transform={`translate(${435 + i * 30}, 8)`}>
            {/* Yarn Cone Body */}
            <polygon points="4,27 22,27 18,3 8,3" fill={coneColor} />
            {/* Spool Cap */}
            <rect x="9" y="0" width="8" height="3" rx="1" fill="#E2E8F0" />
            {/* Thread stripes */}
            <line x1="6" y1="12" x2="20" y2="15" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
            <line x1="6" y1="20" x2="20" y2="23" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
          </g>
        ))}

        {/* Second Shelf with Wooden Storage Boxes */}
        <rect x="420" y="90" width="230" height="8" rx="2" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1" />
        {/* Wooden Storage Boxes "Crafting & Tufting Bulk Yarn Packs" */}
        {[0, 1, 2].map((boxIdx) => (
          <g key={`box-${boxIdx}`} transform={`translate(${430 + boxIdx * 72}, 48)`}>
            <rect x="0" y="0" width="66" height="42" rx="2" fill="#E8C39E" stroke="#B88A58" strokeWidth="1.5" />
            <rect x="8" y="12" width="50" height="2" fill="#B88A58" opacity="0.4" />
            <text x="33" y="22" fill="#78350F" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              Crafting
            </text>
            <text x="33" y="30" fill="#78350F" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              &amp; Tufting
            </text>
            <text x="33" y="37" fill="#92400E" fontSize="4.5" fontFamily="sans-serif" textAnchor="middle">
              Yarn Packs
            </text>
          </g>
        ))}

        {/* Third Lower Shelf with Pastel Yarn Cones */}
        <rect x="420" y="145" width="230" height="8" rx="2" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1" />
        {t.yarnCones.slice().reverse().map((coneColor, i) => (
          <g key={`midcone-${i}`} transform={`translate(${440 + i * 32}, 118)`}>
            <polygon points="4,27 22,27 18,4 8,4" fill={coneColor} />
            <rect x="9" y="1" width="8" height="3" rx="1" fill="#FEF08A" />
          </g>
        ))}

        {/* ========================================================
            5. PEGBOARD & WORKBENCH WITH CRAFT TOOLS (Center Background)
            ======================================================== */}
        {/* Pegboard Panel */}
        <rect x="470" y="170" width="130" height="90" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" rx="2" />
        {/* Pegboard Holes Grid */}
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => (
            <circle key={`peg-${r}-${c}`} cx={485 + c * 13} cy={182 + r * 13} r="1.5" fill="#94A3B8" opacity="0.5" />
          ))
        )}

        {/* Hanging Tools on Pegboard: Scissors, Shears, Pliers, Duckbill Clippers */}
        {/* Orange Scissors */}
        <g transform="translate(490, 185)">
          <line x1="8" y1="0" x2="2" y2="28" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="0" x2="8" y2="28" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="2" cy="30" r="4" fill="none" stroke="#EA580C" strokeWidth="2" />
          <circle cx="9" cy="30" r="4" fill="none" stroke="#EA580C" strokeWidth="2" />
        </g>
        {/* Blue Duckbill Shears */}
        <g transform="translate(525, 185)">
          <path d="M 0 0 L 14 26" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          <path d="M 14 0 L 0 26" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          <polygon points="12,24 22,24 16,14" fill="#94A3B8" />
        </g>
        {/* Hanging Wire Threaders & Pliers */}
        <g transform="translate(565, 185)">
          <path d="M 0 0 L 8 24 L 16 0" stroke="#EAB308" strokeWidth="2.5" fill="none" />
        </g>

        {/* Main Solid Wood Workbench (Behind tufting loom) */}
        <g transform="translate(220, 270)">
          {/* Tabletop */}
          <rect x="0" y="0" width="410" height="20" rx="3" fill={t.woodTone} stroke={t.woodDark} strokeWidth="2" />
          {/* Table Legs */}
          <rect x="15" y="20" width="20" height="190" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1.5" />
          <rect x="375" y="20" width="20" height="190" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1.5" />
          {/* Lower Storage Shelf */}
          <rect x="10" y="140" width="390" height="12" fill={t.woodDark} opacity="0.8" />

          {/* Clear Plastic Storage Bins with Labels on Lower Shelf */}
          {[
            { label: 'Tufting Needles', x: 25 },
            { label: 'Carpet Glue', x: 120 },
            { label: 'Seaming Tape', x: 215 },
            { label: 'Duckbill Shears', x: 310 },
          ].map((bin, bi) => (
            <g key={`bin-${bi}`} transform={`translate(${bin.x}, 92)`}>
              <rect x="0" y="0" width="80" height="48" rx="4" fill="#FFFFFF" opacity="0.8" stroke="#94A3B8" strokeWidth="1.5" />
              <rect x="4" y="2" width="72" height="6" rx="2" fill="#3B82F6" opacity="0.6" />
              {/* White Label Tag */}
              <rect x="15" y="18" width="50" height="18" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="40" y="30" fill="#1E293B" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                {bin.label}
              </text>
            </g>
          ))}
        </g>

        {/* ========================================================
            6. MAIN ATELIER CENTERPIECE:
               UPRIGHT WOODEN TUFTING FRAME WITH RUG IN PROGRESS
               & BLUE ELECTRIC TUFTING GUN (Center Stage)
            ======================================================== */}
        <g transform="translate(560, 160)">
          {/* Vertical Frame Uprights (Timber) */}
          <rect x="0" y="0" width="22" height="340" rx="3" fill={t.loomColor} stroke={t.loomWoodAccent} strokeWidth="2" />
          <rect x="238" y="0" width="22" height="340" rx="3" fill={t.loomColor} stroke={t.loomWoodAccent} strokeWidth="2" />
          {/* Horizontal Frame Crossbars */}
          <rect x="0" y="0" width="260" height="22" rx="3" fill={t.loomColor} stroke={t.loomWoodAccent} strokeWidth="2" />
          <rect x="0" y="318" width="260" height="22" rx="3" fill={t.loomColor} stroke={t.loomWoodAccent} strokeWidth="2" />

          {/* Stainless Steel Gripper Strip Teeth along inside perimeter */}
          <line x1="22" y1="22" x2="238" y2="22" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="22" y1="318" x2="238" y2="318" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />

          {/* White Primary Monks Cloth Canvas Stretched on Frame */}
          <rect x="22" y="22" width="216" height="296" fill="#F8FAFC" />
          {/* Subtle Yellow Guide Lines on Canvas */}
          <line x1="22" y1="90" x2="238" y2="90" stroke="#FDE047" strokeWidth="1" opacity="0.6" />
          <line x1="22" y1="160" x2="238" y2="160" stroke="#FDE047" strokeWidth="1" opacity="0.6" />
          <line x1="22" y1="230" x2="238" y2="230" stroke="#FDE047" strokeWidth="1" opacity="0.6" />
          <line x1="90" y1="22" x2="90" y2="318" stroke="#FDE047" strokeWidth="1" opacity="0.6" />
          <line x1="160" y1="22" x2="160" y2="318" stroke="#FDE047" strokeWidth="1" opacity="0.6" />

          {/* Beautiful Custom In-Progress Rug Being Tufted */}
          <g transform="translate(32, 60)">
            {/* Organic Tufted Rug Silhouette */}
            <path
              d="M 10 30 Q 50 0 100 20 Q 170 10 185 60 Q 200 130 170 180 Q 120 220 70 190 Q 0 170 10 100 Z"
              fill={`url(#rug1Grad-${style})`}
              stroke={t.rug1Palette[2]}
              strokeWidth="3"
            />
            {/* Cut-pile tuft texture details */}
            <path d="M 30 50 Q 80 40 120 70 Q 150 110 120 150" stroke="#FFFFFF" strokeWidth="8" fill="none" opacity="0.75" />
            <path d="M 60 70 Q 90 90 100 130" stroke={t.rug1Palette[1]} strokeWidth="14" fill="none" opacity="0.85" />
            <circle cx="85" cy="110" r="16" fill={t.rug1Palette[3]} />
          </g>

          {/* Top Yarn Spool Mount Holder with Live Feed Thread */}
          <rect x="-10" y="-30" width="60" height="8" rx="2" fill={t.loomWoodAccent} />
          {/* Active Yarn Cones on Spool Rack */}
          <polygon points="5,-5 25,-5 21,-28 9,-28" fill={t.rug1Palette[1]} />
          <polygon points="32,-5 52,-5 48,-28 36,-28" fill={t.rug1Palette[0]} />

          {/* ========================================================
              BLUE ELECTRIC TUFTING MACHINE (GUN)
              Mounted on the frame with yarn feeding into needle
              ======================================================== */}
          <g transform="translate(90, 155)">
            {/* Yarn Thread feeding down from spool */}
            <path d="M -70 -160 Q -20 -90 15 -10" stroke={t.rug1Palette[1]} strokeWidth="1.8" fill="none" />
            <path d="M -40 -160 Q -5 -90 18 -10" stroke={t.rug1Palette[0]} strokeWidth="1.8" fill="none" />

            {/* Tufting Gun Main Blue Body */}
            <rect x="0" y="0" width="70" height="28" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
            <rect x="8" y="5" width="24" height="4" rx="1" fill="#93C5FD" />
            <rect x="8" y="12" width="24" height="4" rx="1" fill="#93C5FD" />
            <rect x="8" y="19" width="24" height="4" rx="1" fill="#93C5FD" />

            {/* Brass / Silver Mechanical Rods & Bearings */}
            <rect x="68" y="6" width="30" height="4" fill="#E2E8F0" />
            <rect x="68" y="18" width="30" height="4" fill="#E2E8F0" />
            <rect x="76" y="3" width="8" height="22" rx="2" fill="#F59E0B" />
            <polygon points="98,11 110,14 98,17" fill="#64748B" />

            {/* Ergonomic Pistol Handle */}
            <path d="M 12 28 L 5 62 Q 8 68 18 67 L 26 65 L 30 28 Z" fill="#1E293B" />
            {/* Red Trigger */}
            <rect x="29" y="34" width="4" height="8" rx="1" fill="#DC2626" />
            {/* Power Cable Dropping */}
            <path d="M 10 66 Q 5 95 20 130 Q 30 160 25 180" stroke="#0F172A" strokeWidth="2.5" fill="none" />
          </g>

          {/* Wooden Easel Support Struts at Base */}
          <polygon points="-15,340 0,320 0,340" fill={t.loomWoodAccent} />
          <polygon points="275,340 260,320 260,340" fill={t.loomWoodAccent} />
          {/* Base Stand Feet */}
          <rect x="-30" y="338" width="80" height="16" rx="3" fill={t.loomColor} stroke={t.loomWoodAccent} strokeWidth="1.5" />
          <rect x="210" y="338" width="80" height="16" rx="3" fill={t.loomColor} stroke={t.loomWoodAccent} strokeWidth="1.5" />
        </g>

        {/* ========================================================
            7. SECOND WOODEN EASEL: COMPLETED CARVED LANDSCAPE RUG (Right Side)
            ======================================================== */}
        <g transform="translate(890, 180)">
          {/* Large A-Frame Timber Easel */}
          <polygon points="20,0 35,0 15,380 0,380" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1.5" />
          <polygon points="220,0 235,0 255,380 240,380" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1.5" />
          {/* Horizontal Easel Shelf Support */}
          <rect x="-10" y="300" width="275" height="18" rx="3" fill={t.woodTone} stroke={t.woodDark} strokeWidth="2" />

          {/* Completed High-End Hand-Carved Wavy Landscape Rug */}
          <g transform="translate(15, 30)">
            {/* Rug Backing Canvas Overhang with fringes */}
            <rect x="-10" y="-10" width="240" height="270" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            {/* Multi-layered Sculptural Landscape Rug */}
            <rect x="0" y="0" width="220" height="250" rx="6" fill={`url(#rug2Grad-${style})`} />

            {/* Carved 3D Wavy Topographic Mountain Strata (High relief) */}
            <path
              d="M 0 50 Q 60 10 110 40 Q 170 70 220 30 L 220 0 L 0 0 Z"
              fill={t.rug2Palette[4]}
              opacity="0.9"
            />
            <path
              d="M 0 100 Q 70 60 130 90 Q 180 120 220 80 L 220 40 Q 170 80 110 50 Q 60 20 0 60 Z"
              fill={t.rug2Palette[3]}
              opacity="0.95"
            />
            <path
              d="M 0 160 Q 60 120 120 150 Q 180 170 220 140 L 220 90 Q 180 130 130 100 Q 70 70 0 110 Z"
              fill={t.rug2Palette[2]}
            />
            <path
              d="M 0 210 Q 70 170 140 200 Q 190 220 220 190 L 220 150 Q 180 180 120 160 Q 60 130 0 170 Z"
              fill={t.rug2Palette[1]}
            />
            <path
              d="M 0 250 L 220 250 L 220 200 Q 190 230 140 210 Q 70 180 0 220 Z"
              fill={t.rug2Palette[0]}
            />

            {/* Carving Grooves Shading (gives deep 3D relief feel) */}
            <path d="M 0 50 Q 60 10 110 40 Q 170 70 220 30" stroke="#000000" strokeWidth="3" fill="none" opacity="0.35" />
            <path d="M 0 100 Q 70 60 130 90 Q 180 120 220 80" stroke="#000000" strokeWidth="3" fill="none" opacity="0.35" />
            <path d="M 0 160 Q 60 120 120 150 Q 180 170 220 140" stroke="#000000" strokeWidth="3" fill="none" opacity="0.35" />
            <path d="M 0 210 Q 70 170 140 200 Q 190 220 220 190" stroke="#000000" strokeWidth="3" fill="none" opacity="0.35" />
          </g>
        </g>

        {/* ========================================================
            8. TUFTED ARTISAN STOOL & WORK TABLE (Foreground Center)
            ======================================================== */}
        <g transform="translate(580, 480)">
          {/* Round Tufted Stool Cushion with Gun Motif */}
          <ellipse cx="60" cy="20" rx="55" ry="24" fill={t.stoolCushion} stroke={t.woodDark} strokeWidth="2" />
          <ellipse cx="60" cy="18" rx="46" ry="18" fill="#FFFFFF" opacity="0.85" />
          {/* Tufted Gun Silhouette on Stool Cushion (Matching reference) */}
          <g transform="translate(38, 8) scale(0.4)">
            <rect x="0" y="5" width="70" height="24" rx="4" fill={t.stoolMotif} />
            <rect x="15" y="29" width="16" height="30" rx="2" fill={t.stoolMotif} />
            <rect x="70" y="11" width="30" height="6" fill={t.stoolMotif} />
          </g>

          {/* Stool Timber Legs */}
          <line x1="25" y1="36" x2="10" y2="150" stroke={t.woodTone} strokeWidth="9" strokeLinecap="round" />
          <line x1="50" y1="40" x2="45" y2="155" stroke={t.woodDark} strokeWidth="8" strokeLinecap="round" />
          <line x1="75" y1="40" x2="80" y2="155" stroke={t.woodDark} strokeWidth="8" strokeLinecap="round" />
          <line x1="95" y1="36" x2="115" y2="150" stroke={t.woodTone} strokeWidth="9" strokeLinecap="round" />
          {/* Stool Foot Rung Rings */}
          <ellipse cx="62" cy="100" rx="44" ry="10" fill="none" stroke={t.woodTone} strokeWidth="5" />
        </g>

        {/* Small Table Beside Stool with Yarn Cones & Scissors */}
        <g transform="translate(730, 430)">
          <rect x="0" y="0" width="130" height="15" rx="3" fill={t.woodTone} stroke={t.woodDark} strokeWidth="1.5" />
          <line x1="15" y1="15" x2="10" y2="170" stroke={t.woodTone} strokeWidth="8" strokeLinecap="round" />
          <line x1="115" y1="15" x2="120" y2="170" stroke={t.woodTone} strokeWidth="8" strokeLinecap="round" />
          {/* Yarn Cones Resting on Table */}
          <polygon points="25,0 45,0 40,-35 30,-35" fill={t.rug1Palette[0]} />
          <polygon points="50,0 70,0 65,-40 55,-40" fill={t.rug1Palette[1]} />
          <polygon points="75,0 95,0 90,-35 80,-35" fill={t.rug1Palette[2]} />
          {/* Small Yellow Snips */}
          <polygon points="100,-4 120,-8 105,-1" fill="#EAB308" />
        </g>

        {/* ========================================================
            9. ROLLING TROLLEY WITH COLORFUL YARN BALLS (Foreground Left)
            ======================================================== */}
        <g transform="translate(100, 370)">
          {/* Rolling Metal Cart Frame */}
          <rect x="0" y="0" width="105" height="150" rx="6" fill="none" stroke={t.cartColor} strokeWidth="3" />
          {/* Handle */}
          <path d="M 0 10 L -12 10 L -12 35" stroke={t.cartColor} strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Cart Tray 1 (Top) */}
          <rect x="4" y="10" width="97" height="35" rx="3" fill={t.cartColor} />
          {/* Fluffy Balls of Wool Yarn in Top Tray */}
          <circle cx="22" cy="18" r="14" fill="#F43F5E" />
          <circle cx="45" cy="16" r="15" fill="#38BDF8" />
          <circle cx="70" cy="18" r="14" fill="#FBBF24" />
          <circle cx="88" cy="22" r="12" fill="#34D399" />
          <circle cx="34" cy="24" r="13" fill="#A855F7" />

          {/* Cart Tray 2 (Middle) */}
          <rect x="4" y="60" width="97" height="35" rx="3" fill={t.cartColor} />
          <circle cx="25" cy="68" r="14" fill="#F97316" />
          <circle cx="52" cy="66" r="15" fill="#EC4899" />
          <circle cx="80" cy="70" r="14" fill="#3B82F6" />

          {/* Cart Tray 3 (Bottom) */}
          <rect x="4" y="110" width="97" height="35" rx="3" fill={t.cartColor} />
          <circle cx="30" cy="118" r="14" fill="#10B981" />
          <circle cx="60" cy="116" r="15" fill="#F59E0B" />
          <circle cx="85" cy="120" r="13" fill="#6366F1" />

          {/* Rolling Wheels */}
          <circle cx="10" cy="154" r="6" fill="#1E293B" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="95" cy="154" r="6" fill="#1E293B" stroke="#CBD5E1" strokeWidth="1" />
        </g>

        {/* ========================================================
            10. GEOMETRIC ACCENT RUG ON THE FLOOR (Foreground)
            ======================================================== */}
        <g transform="translate(340, 560)">
          {/* Floor Tufted Runner Rug */}
          <polygon points="0,30 200,0 230,80 30,110" fill="#FFFFFF" stroke={t.woodDark} strokeWidth="1.5" />
          {/* Diamond Geometric Carved Pattern */}
          <polygon points="30,45 80,35 100,75 50,85" fill={t.rug1Palette[0]} />
          <polygon points="50,55 70,50 80,68 60,73" fill={t.rug1Palette[1]} />
          <polygon points="110,30 160,20 180,60 130,70" fill={t.rug1Palette[2]} />
          <polygon points="130,40 150,35 160,53 140,58" fill={t.rug1Palette[3]} />
        </g>

        {/* ========================================================
            11. OFFICIAL BRAND LOGO (Top Right Corner - matching reference image)
            "Crafting [Tufting Gun]
             & Tufting"
            ======================================================== */}
        <g transform="translate(890, 45)">
          {/* Subtle translucent backdrop badge for legibility */}
          <rect x="-15" y="-12" width="285" height="100" rx="8" fill="rgba(0,0,0,0.18)" />

          {/* Top Line: Crafting */}
          <text
            x="0"
            y="35"
            fill="#FFFFFF"
            fontSize="38"
            fontWeight="900"
            fontFamily="'Plus Jakarta Sans', 'Playfair Display', Georgia, serif"
            letterSpacing="-0.5"
          >
            Crafting
          </text>

          {/* Tufting Gun Line Art on right of Crafting */}
          <g transform="translate(162, 5) scale(0.75)">
            <rect x="26" y="4" width="12" height="10" rx="2" fill="#D97706" />
            <rect x="25" y="2" width="14" height="2.5" rx="1" fill="#FFFFFF" />
            <rect x="12" y="14" width="26" height="15" rx="3" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" />
            <circle cx="29" cy="21" r="3.5" fill="#C89B3C" />
            <path d="M17 29 L14 41 C13.5 43 15 44.5 17 44.5 L20 44 C22 43.5 23 42 23.5 40 L25 29 Z" fill="#FFFFFF" />
            <line x1="38" y1="18" x2="44" y2="18" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="38" y1="24" x2="44" y2="24" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            <polygon points="44,20 48,21 44,22" fill="#C89B3C" />
            <path d="M46 21 Q49 21 50 24 Q51 28 48 31 Q46 34 48 37" stroke="#C89B3C" strokeWidth="2" fill="none" />
          </g>

          {/* Bottom Line: & Tufting */}
          <text
            x="0"
            y="75"
            fill="#FFFFFF"
            fontSize="38"
            fontWeight="900"
            fontFamily="'Plus Jakarta Sans', 'Playfair Display', Georgia, serif"
            letterSpacing="-0.5"
          >
            <tspan fill="#C89B3C">&amp; </tspan>Tufting
          </text>
        </g>
      </svg>
    </div>
  );
}
