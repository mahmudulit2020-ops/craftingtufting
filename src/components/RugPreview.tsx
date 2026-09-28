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
}

export default function RugPreview({
  shape,
  width,
  length,
  diameter,
  unit,
  colors,
  rugType,
}: PreviewProps) {
  const maxDim = 400;
  const scale = 30;

  const wPx = Math.min(width * scale, maxDim);
  const lPx = Math.min(length * scale, maxDim);
  const dPx = Math.min(diameter * scale, maxDim);
  const sqPx = Math.min(width * scale, maxDim);

  const bg = colors.background || (rugType === 'jute' ? '#C9B291' : '#EBE0D0');
  const primary = colors.primary || (rugType === 'jute' ? '#8A663E' : '#4A4A46');
  const secondary = colors.secondary || (rugType === 'jute' ? '#B89968' : '#8B6F47');
  const accent = colors.accent || (rugType === 'jute' ? '#6B4F31' : '#242421');

  const labelW = `${width} ${unit}`;
  const labelL = `${length} ${unit}`;
  const labelD = `${diameter} ${unit}`;

  const pattern = rugType === 'jute' ? (
    <pattern id="jute-weave" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill={bg} />
      <path d="M0 4 L8 4 M4 0 L4 8" stroke={secondary} strokeWidth="1.5" opacity="0.4" />
    </pattern>
  ) : (
    <pattern id="tuft-texture" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill={bg} />
      <circle cx="3" cy="3" r="1.5" fill={primary} opacity="0.3" />
      <circle cx="9" cy="9" r="1.5" fill={secondary} opacity="0.3" />
      <circle cx="9" cy="3" r="1" fill={accent} opacity="0.2" />
    </pattern>
  );

  const patternId = rugType === 'jute' ? 'url(#jute-weave)' : 'url(#tuft-texture)';

  const borderStyle = {
    filter: 'drop-shadow(0 8px 24px rgba(36,36,33,0.15))',
    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
  } as const;

  return (
    <div className="flex items-center justify-center min-h-[320px] py-8">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 400"
        style={{ maxWidth: '500px' }}
        className="overflow-visible"
      >
        <defs>
          {pattern}
        </defs>

        {/* Shadow ground */}
        <ellipse cx="250" cy="360" rx="180" ry="12" fill="rgba(36,36,33,0.08)" />

        {shape === 'rectangle' && (
          <g style={borderStyle} transform={`translate(${250 - wPx / 2}, ${200 - lPx / 2})`}>
            <rect width={wPx} height={lPx} fill={patternId} stroke={accent} strokeWidth="2" rx="2" />
            <rect width={wPx} height={lPx} fill={primary} opacity="0.08" rx="2" />
            <text x={wPx / 2} y={-12} textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>{labelW}</text>
            <text x={wPx + 14} y={lPx / 2} textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif', transform: 'rotate(90deg)' }}>{labelL}</text>
          </g>
        )}

        {shape === 'square' && (
          <g style={borderStyle} transform={`translate(${250 - sqPx / 2}, ${200 - sqPx / 2})`}>
            <rect width={sqPx} height={sqPx} fill={patternId} stroke={accent} strokeWidth="2" rx="2" />
            <rect width={sqPx} height={sqPx} fill={primary} opacity="0.08" rx="2" />
            <text x={sqPx / 2} y={-12} textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>{labelW}</text>
          </g>
        )}

        {shape === 'circle' && (
          <g style={borderStyle} transform={`translate(250, 200)`}>
            <circle r={dPx / 2} fill={patternId} stroke={accent} strokeWidth="2" />
            <circle r={dPx / 2} fill={primary} opacity="0.08" />
            <text x="0" y={-dPx / 2 - 12} textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>Ø {labelD}</text>
          </g>
        )}

        {shape === 'oval' && (
          <g style={borderStyle} transform={`translate(250, 200)`}>
            <ellipse rx={wPx / 2} ry={lPx / 2} fill={patternId} stroke={accent} strokeWidth="2" />
            <ellipse rx={wPx / 2} ry={lPx / 2} fill={primary} opacity="0.08" />
            <text x="0" y={-lPx / 2 - 12} textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>{labelW}</text>
            <text x={wPx / 2 + 14} y="4" textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>{labelL}</text>
          </g>
        )}

        {shape === 'custom' && (
          <g style={borderStyle} transform={`translate(${250 - wPx / 2}, ${200 - lPx / 2})`}>
            <path
              d={`M0,0 L${wPx * 0.7},0 L${wPx},${lPx * 0.3} L${wPx},${lPx} L${wPx * 0.2},${lPx} L0,${lPx * 0.7} Z`}
              fill={patternId}
              stroke={accent}
              strokeWidth="2"
            />
            <path
              d={`M0,0 L${wPx * 0.7},0 L${wPx},${lPx * 0.3} L${wPx},${lPx} L${wPx * 0.2},${lPx} L0,${lPx * 0.7} Z`}
              fill={primary}
              opacity="0.08"
            />
            <text x={wPx / 2} y={-12} textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>{labelW}</text>
            <text x={wPx + 14} y={lPx / 2} textAnchor="middle" className="fill-charcoal-600 text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>{labelL}</text>
          </g>
        )}
      </svg>
    </div>
  );
}
