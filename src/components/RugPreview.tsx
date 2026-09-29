import type { RugShape, Unit } from '@/lib/types';

interface PreviewProps {
  shape: RugShape;
  width: number;
  length: number;
  diameter: number;
  unit: Unit;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  rugType: 'tufting' | 'jute';
  artworkUrl?: string | null;
}

export default function RugPreview({
  shape,
  width,
  length,
  diameter,
  unit,
  colors,
  rugType,
  artworkUrl,
}: PreviewProps) {
  const maxDim = 320;
  const rawW = shape === 'circle' ? diameter : width;
  const rawL = shape === 'circle' ? diameter : shape === 'square' ? width : length;

  const aspect = rawW > 0 && rawL > 0 ? rawW / rawL : 1;
  let wPx = 240;
  let lPx = 240;

  if (aspect >= 1) {
    wPx = Math.min(280, maxDim);
    lPx = Math.max(120, Math.min(maxDim, wPx / aspect));
  } else {
    lPx = Math.min(280, maxDim);
    wPx = Math.max(120, Math.min(maxDim, lPx * aspect));
  }

  const dPx = Math.min(260, maxDim);

  const bg = colors.background || (rugType === 'jute' ? '#C9B291' : '#FAF7F2');
  const primary = colors.primary || (rugType === 'jute' ? '#8A663E' : '#4A4A46');
  const secondary = colors.secondary || (rugType === 'jute' ? '#B89968' : '#8B6F47');
  const accent = colors.accent || (rugType === 'jute' ? '#6B4F31' : '#242421');

  const labelW = `${width} ${unit}`;
  const labelL = `${length} ${unit}`;
  const labelD = `${diameter} ${unit}`;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[360px] py-6 select-none bg-gradient-to-b from-sand-50/50 to-sand-100/40 border border-sand-200/80">
      {/* Visual background floor texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none jamdani-bg" />

      {/* SVG Canvas */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 380"
        style={{ maxWidth: '480px' }}
        className="overflow-visible relative z-10"
      >
        <defs>
          <filter id="tuft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1A1A18" floodOpacity="0.18" />
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1A1A18" floodOpacity="0.1" />
          </filter>

          {/* Jute Weave Texture Pattern */}
          <pattern id="jute-weave" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill={bg} />
            <path d="M0 6 L12 6 M6 0 L6 12" stroke={secondary} strokeWidth="1.8" opacity="0.45" />
            <path d="M2 2 L10 10 M10 2 L2 10" stroke={primary} strokeWidth="0.8" opacity="0.25" />
          </pattern>

          {/* Tufted Wool Cloud Pattern */}
          <pattern id="tuft-wool-texture" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill={bg} />
            <circle cx="4" cy="4" r="2.2" fill={primary} opacity="0.2" />
            <circle cx="12" cy="12" r="2.2" fill={secondary} opacity="0.2" />
            <circle cx="12" cy="4" r="1.5" fill={accent} opacity="0.15" />
            <circle cx="4" cy="12" r="1.5" fill={accent} opacity="0.15" />
          </pattern>

          {/* Clip Paths for Shapes */}
          <clipPath id="clip-rect">
            <rect x={250 - wPx / 2} y={185 - lPx / 2} width={wPx} height={lPx} rx="6" />
          </clipPath>
          <clipPath id="clip-circle">
            <circle cx="250" cy="185" r={dPx / 2} />
          </clipPath>
          <clipPath id="clip-oval">
            <ellipse cx="250" cy="185" rx={wPx / 2} ry={lPx / 2} />
          </clipPath>
          <clipPath id="clip-custom">
            <path
              d={`M ${250 - wPx / 2 + 20} ${185 - lPx / 2} 
                 Q 250 ${185 - lPx / 2 - 15}, ${250 + wPx / 2 - 20} ${185 - lPx / 2} 
                 Q ${250 + wPx / 2 + 15} 185, ${250 + wPx / 2 - 15} ${185 + lPx / 2} 
                 Q 250 ${185 + lPx / 2 + 15}, ${250 - wPx / 2 + 15} ${185 + lPx / 2} 
                 Q ${250 - wPx / 2 - 15} 185, ${250 - wPx / 2 + 20} ${185 - lPx / 2} Z`}
            />
          </clipPath>
        </defs>

        {/* Floor Ambient Drop Shadow */}
        <ellipse cx="250" cy="335" rx={Math.max(wPx * 0.65, 120)} ry="18" fill="rgba(36,36,33,0.12)" />

        {/* Render Rug Shape */}
        {shape === 'rectangle' && (
          <g filter="url(#tuft-shadow)">
            <rect
              x={250 - wPx / 2}
              y={185 - lPx / 2}
              width={wPx}
              height={lPx}
              fill={rugType === 'jute' ? 'url(#jute-weave)' : 'url(#tuft-wool-texture)'}
              stroke={accent}
              strokeWidth="2.5"
              rx="6"
            />
            {artworkUrl && artworkUrl !== 'pdf' && (
              <image
                href={artworkUrl}
                x={250 - wPx / 2}
                y={185 - lPx / 2}
                width={wPx}
                height={lPx}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip-rect)"
                opacity="0.88"
              />
            )}
            {/* Dimension Indicators */}
            <text x={250} y={185 - lPx / 2 - 14} textAnchor="middle" className="fill-charcoal-700 text-[11px] font-mono tracking-wider font-semibold">
              ← {labelW} →
            </text>
            <text x={250 + wPx / 2 + 18} y={190} textAnchor="start" className="fill-charcoal-700 text-[11px] font-mono tracking-wider font-semibold">
              ↕ {labelL}
            </text>
          </g>
        )}

        {shape === 'square' && (
          <g filter="url(#tuft-shadow)">
            <rect
              x={250 - wPx / 2}
              y={185 - wPx / 2}
              width={wPx}
              height={wPx}
              fill={rugType === 'jute' ? 'url(#jute-weave)' : 'url(#tuft-wool-texture)'}
              stroke={accent}
              strokeWidth="2.5"
              rx="6"
            />
            {artworkUrl && artworkUrl !== 'pdf' && (
              <image
                href={artworkUrl}
                x={250 - wPx / 2}
                y={185 - wPx / 2}
                width={wPx}
                height={wPx}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip-rect)"
                opacity="0.88"
              />
            )}
            <text x={250} y={185 - wPx / 2 - 14} textAnchor="middle" className="fill-charcoal-700 text-[11px] font-mono tracking-wider font-semibold">
              ← {labelW} × {labelW} →
            </text>
          </g>
        )}

        {shape === 'circle' && (
          <g filter="url(#tuft-shadow)">
            <circle
              cx="250"
              cy="185"
              r={dPx / 2}
              fill={rugType === 'jute' ? 'url(#jute-weave)' : 'url(#tuft-wool-texture)'}
              stroke={accent}
              strokeWidth="2.5"
            />
            {artworkUrl && artworkUrl !== 'pdf' && (
              <image
                href={artworkUrl}
                x={250 - dPx / 2}
                y={185 - dPx / 2}
                width={dPx}
                height={dPx}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip-circle)"
                opacity="0.88"
              />
            )}
            <text x={250} y={185 - dPx / 2 - 14} textAnchor="middle" className="fill-charcoal-700 text-[11px] font-mono tracking-wider font-semibold">
              ⌀ {labelD} Diameter
            </text>
          </g>
        )}

        {shape === 'oval' && (
          <g filter="url(#tuft-shadow)">
            <ellipse
              cx="250"
              cy="185"
              rx={wPx / 2}
              ry={lPx / 2}
              fill={rugType === 'jute' ? 'url(#jute-weave)' : 'url(#tuft-wool-texture)'}
              stroke={accent}
              strokeWidth="2.5"
            />
            {artworkUrl && artworkUrl !== 'pdf' && (
              <image
                href={artworkUrl}
                x={250 - wPx / 2}
                y={185 - lPx / 2}
                width={wPx}
                height={lPx}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip-oval)"
                opacity="0.88"
              />
            )}
            <text x={250} y={185 - lPx / 2 - 14} textAnchor="middle" className="fill-charcoal-700 text-[11px] font-mono tracking-wider font-semibold">
              ← {labelW} × {labelL} Oval →
            </text>
          </g>
        )}

        {shape === 'custom' && (
          <g filter="url(#tuft-shadow)">
            <path
              d={`M ${250 - wPx / 2 + 20} ${185 - lPx / 2} 
                 Q 250 ${185 - lPx / 2 - 15}, ${250 + wPx / 2 - 20} ${185 - lPx / 2} 
                 Q ${250 + wPx / 2 + 15} 185, ${250 + wPx / 2 - 15} ${185 + lPx / 2} 
                 Q 250 ${185 + lPx / 2 + 15}, ${250 - wPx / 2 + 15} ${185 + lPx / 2} 
                 Q ${250 - wPx / 2 - 15} 185, ${250 - wPx / 2 + 20} ${185 - lPx / 2} Z`}
              fill={rugType === 'jute' ? 'url(#jute-weave)' : 'url(#tuft-wool-texture)'}
              stroke={accent}
              strokeWidth="2.5"
            />
            {artworkUrl && artworkUrl !== 'pdf' && (
              <image
                href={artworkUrl}
                x={250 - wPx / 2}
                y={185 - lPx / 2}
                width={wPx}
                height={lPx}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip-custom)"
                opacity="0.88"
              />
            )}
            <text x={250} y={185 - lPx / 2 - 14} textAnchor="middle" className="fill-charcoal-700 text-[11px] font-mono tracking-wider font-semibold">
              ✦ Die-Cut Silhouette ({labelW} × {labelL})
            </text>
          </g>
        )}
      </svg>

      {/* Floating Info Pill */}
      <div className="mt-4 flex items-center gap-3 text-[11px] text-charcoal-500 uppercase tracking-wider font-medium">
        <span>Artisan Loom Preview</span>
        <span aria-hidden="true">·</span>
        <span>{rugType === 'tufting' ? 'Hand-Tufted Wool Pile' : 'Golden Bengal Jute'}</span>
        {artworkUrl && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-terracotta">Custom Artwork Overlaid</span>
          </>
        )}
      </div>
    </div>
  );
}
