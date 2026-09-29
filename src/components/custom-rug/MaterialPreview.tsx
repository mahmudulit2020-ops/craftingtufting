import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Sparkles,
  RotateCcw,
  Sun,
  Hand,
  Info,
} from 'lucide-react';
import type { YarnOption, PileHeightOption } from '@/lib/types';

interface MaterialPreviewProps {
  yarnType: YarnOption;
  pileHeight?: PileHeightOption;
  selectedColor?: string;
  className?: string;
}

// Fiber specification profiles
const FIBER_PROFILES: Record<
  YarnOption,
  {
    name: string;
    origin: string;
    micron: string;
    densityRating: string;
    sheen: 'matte' | 'subtle' | 'high-luster' | 'organic-earthy';
    lusterIntensity: number; // 0 to 1
    softness: string;
    tuftCount: string;
    description: string;
    baseColorTint: string;
    fiberThickness: number;
    jitter: number;
    curlFactor: number;
    specularSpread: number;
  }
> = {
  '100% New Zealand Wool': {
    name: 'New Zealand Wool',
    origin: 'South Island, New Zealand',
    micron: '28-32μm Dense Virgin Fleece',
    densityRating: '4,500 g/m² Heavy Contract Grade',
    sheen: 'subtle',
    lusterIntensity: 0.28,
    softness: 'Plush, Springy & Resilient',
    tuftCount: '160,000+ tufts/m²',
    description: 'Natural lanolin-rich sheep wool offering unmatched rebound, natural flame resistance, and acoustic dampening.',
    baseColorTint: '#e8ded0',
    fiberThickness: 1.8,
    jitter: 0.35,
    curlFactor: 0.45,
    specularSpread: 0.2,
  },
  'Mulberry Silk & Wool Blend': {
    name: 'Mulberry Silk & Wool',
    origin: 'Artisanal Silk Cultivation & Alpine Wool',
    micron: '11-14μm Raw Silk Filament Blend',
    densityRating: '5,200 g/m² Ultra-Fine Weave',
    sheen: 'high-luster',
    lusterIntensity: 0.85,
    softness: 'Sensual, Butter-Soft Liquid Drape',
    tuftCount: '240,000+ tufts/m²',
    description: 'Light-refracting silk filaments interwoven with soft wool, shimmering dynamically under moving ambient light.',
    baseColorTint: '#f5efe6',
    fiberThickness: 1.2,
    jitter: 0.15,
    curlFactor: 0.12,
    specularSpread: 0.8,
  },
  'Premium Resilient Acrylic': {
    name: 'Resilient Acrylic',
    origin: 'Industrial High-Tenacity Microfiber',
    micron: '24μm Engineered Fiber',
    densityRating: '3,800 g/m² Active Residential',
    sheen: 'matte',
    lusterIntensity: 0.18,
    softness: 'Crisp, Structured & Hypoallergenic',
    tuftCount: '135,000 tufts/m²',
    description: 'High-chroma synthetic staple yarns that maintain vivid saturated colors and clean edges with zero shedding.',
    baseColorTint: '#e4dfd7',
    fiberThickness: 1.9,
    jitter: 0.22,
    curlFactor: 0.25,
    specularSpread: 0.15,
  },
  'Acrylic Blend': {
    name: 'Acrylic Blend',
    origin: 'High-Tenacity Colorfast Blend',
    micron: '24μm Engineered Fiber',
    densityRating: '3,850 g/m² Active Residential',
    sheen: 'matte',
    lusterIntensity: 0.18,
    softness: 'Crisp, Structured & Hypoallergenic',
    tuftCount: '138,000 tufts/m²',
    description: 'High-chroma synthetic staple yarns that maintain vivid saturated colors and clean edges with zero shedding.',
    baseColorTint: '#e4dfd7',
    fiberThickness: 1.9,
    jitter: 0.22,
    curlFactor: 0.25,
    specularSpread: 0.15,
  },
  'Bamboo Silk': {
    name: 'Bamboo Silk',
    origin: 'Regenerated Cellulose Bamboo Plant Fiber',
    micron: '12-15μm Shimmering Filament',
    densityRating: '5,100 g/m² High-Luster Weave',
    sheen: 'high-luster',
    lusterIntensity: 0.82,
    softness: 'Sensual, Butter-Soft Liquid Drape',
    tuftCount: '230,000+ tufts/m²',
    description: 'Sustainable plant-based silk filaments that reflect ambient light with an exquisite, lustrous velvet-sheen drape.',
    baseColorTint: '#f5efe6',
    fiberThickness: 1.25,
    jitter: 0.16,
    curlFactor: 0.14,
    specularSpread: 0.78,
  },
  'Golden Organic Bengal Jute': {
    name: 'Bengal Golden Fiber (Jute)',
    origin: 'Brahmaputra River Basin, Bangladesh',
    micron: '38-45μm Bast Plant Fiber',
    densityRating: '4,100 g/m² Heavy Braided Knot',
    sheen: 'organic-earthy',
    lusterIntensity: 0.38,
    softness: 'Textured, Rustic & Earth-Grounded',
    tuftCount: '95,000 cords/m²',
    description: '100% biodegradable golden fiber hand-spun into tactile cordage with authentic artisanal flecks and natural striations.',
    baseColorTint: '#c9a263',
    fiberThickness: 3.2,
    jitter: 0.65,
    curlFactor: 0.7,
    specularSpread: 0.3,
  },
};

// Pile height metrics
const PILE_METRICS: Record<
  PileHeightOption,
  {
    depthMm: number;
    shadowDepth: number;
    densityMultiplier: number;
    layerCount: number;
    reliefBevel: boolean;
  }
> = {
  '12mm Standard Low Pile': {
    depthMm: 12,
    shadowDepth: 0.25,
    densityMultiplier: 1.15,
    layerCount: 3,
    reliefBevel: false,
  },
  '16mm Plush Medium Pile': {
    depthMm: 16,
    shadowDepth: 0.42,
    densityMultiplier: 1.0,
    layerCount: 4,
    reliefBevel: false,
  },
  '22mm Luxury Deep Pile': {
    depthMm: 22,
    shadowDepth: 0.65,
    densityMultiplier: 0.85,
    layerCount: 5,
    reliefBevel: false,
  },
  '3D Sculpted Carved Relief': {
    depthMm: 20,
    shadowDepth: 0.8,
    densityMultiplier: 0.95,
    layerCount: 5,
    reliefBevel: true,
  },
};

export default function MaterialPreview({
  yarnType,
  pileHeight = '16mm Plush Medium Pile',
  selectedColor = '#c89b3c',
  className = '',
}: MaterialPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<'1x' | '2x' | '4x'>('1x');
  const [lightAngle, setLightAngle] = useState<number>(45); // degrees
  const [brushing, setBrushing] = useState<boolean>(false);
  const [, setBrushPos] = useState<{ x: number; y: number } | null>(null);
  const [brushDisplacement, setBrushDisplacement] = useState<Array<{ x: number; y: number; force: number }>>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const profile = FIBER_PROFILES[yarnType] || FIBER_PROFILES['100% New Zealand Wool'];
  const pile = PILE_METRICS[pileHeight] || PILE_METRICS['16mm Plush Medium Pile'];

  // Convert hex color to rgb
  const baseRgb = useMemo(() => {
    let hex = selectedColor.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(hex, 16);
    if (isNaN(num)) return { r: 180, g: 150, b: 110 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }, [selectedColor]);

  // Procedural canvas rendering
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Zoom scale factor
    const scale = zoomLevel === '4x' ? 4 : zoomLevel === '2x' ? 2 : 1;

    // Pseudo-random seeded generator for stable rendering per yarn
    let seed = yarnType.length * 1337 + pile.depthMm * 97;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Calculate light vector
    const rad = (lightAngle * Math.PI) / 180;
    const lightX = Math.cos(rad);
    const lightY = Math.sin(rad);

    // Step 1: Base Tuft Canvas / Primary woven fabric backing
    const baseGradient = ctx.createLinearGradient(0, 0, width, height);
    if (yarnType === 'Golden Organic Bengal Jute') {
      baseGradient.addColorStop(0, '#5a462b');
      baseGradient.addColorStop(0.5, '#483720');
      baseGradient.addColorStop(1, '#3b2c18');
    } else {
      baseGradient.addColorStop(0, '#1c1b18');
      baseGradient.addColorStop(0.5, '#282520');
      baseGradient.addColorStop(1, '#1e1c19');
    }
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, width, height);

    // Step 2: Draw woven backing grid in high zoom
    if (scale >= 2) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 16 * scale;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Step 3: Procedural Tuft / Fiber Synthesis
    const baseStep = Math.max(5, Math.floor(10 / (scale * pile.densityMultiplier)));
    const layers = pile.layerCount;

    // Carved Relief 3D trench groove simulation
    const isCarved = pile.reliefBevel;

    for (let layer = 0; layer < layers; layer++) {
      const layerDepth = layer / layers;
      const layerAlpha = 0.25 + layerDepth * 0.75;
      const fiberLength = (pile.depthMm * 0.85 + layer * 3) * (scale * 0.75);

      for (let y = -10; y < height + 10; y += baseStep) {
        for (let x = -10; x < width + 10; x += baseStep) {
          const rand1 = pseudoRandom();
          const rand2 = pseudoRandom();
          const rand3 = pseudoRandom();

          // If 3D carved relief, sculpt channels every 80px
          let carvedOffset = 0;
          let carvedHeightFactor = 1.0;
          if (isCarved) {
            const wave = Math.sin((x + y * 0.5) / (25 * scale));
            if (wave > 0.6) {
              carvedHeightFactor = 0.45; // deeply sheared groove
              carvedOffset = 4;
            } else if (wave > 0.3) {
              carvedHeightFactor = 0.75; // beveled ramp
            }
          }

          // Check brush interactive displacement
          let pushX = 0;
          let pushY = 0;
          if (brushDisplacement.length > 0) {
            for (const b of brushDisplacement) {
              const dx = x - b.x;
              const dy = y - b.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 70) {
                const strength = (1 - dist / 70) * b.force * 18;
                pushX += (dx / (dist || 1)) * strength;
                pushY += (dy / (dist || 1)) * strength;
              }
            }
          }

          const tuftX = x + (rand1 - 0.5) * profile.jitter * 16 * scale + pushX;
          const tuftY = y + (rand2 - 0.5) * profile.jitter * 16 * scale + pushY;

          // Fiber angle with light response
          const naturalAngle =
            Math.PI * 0.5 +
            (rand3 - 0.5) * profile.curlFactor * Math.PI +
            pushX * 0.05;

          const currentLen = fiberLength * carvedHeightFactor * (0.8 + rand1 * 0.4);
          const endX = tuftX + Math.cos(naturalAngle) * currentLen;
          const endY = tuftY - Math.sin(naturalAngle) * currentLen - carvedOffset;

          // Light intensity on fiber tip
          const fiberNormalX = Math.cos(naturalAngle);
          const fiberNormalY = Math.sin(naturalAngle);
          const dot = fiberNormalX * lightX + fiberNormalY * lightY;
          const lightFactor = Math.max(0.1, 0.5 + dot * 0.5);

          // Specular sheen highlight calculation
          const specularPower = profile.sheen === 'high-luster' ? 12 : 4;
          const specular = Math.pow(Math.max(0, dot), specularPower) * profile.lusterIntensity;

          // Color calculation
          let r = Math.min(255, Math.floor(baseRgb.r * (0.4 + layerDepth * 0.6 * lightFactor) + specular * 160));
          let g = Math.min(255, Math.floor(baseRgb.g * (0.4 + layerDepth * 0.6 * lightFactor) + specular * 160));
          let b = Math.min(255, Math.floor(baseRgb.b * (0.4 + layerDepth * 0.6 * lightFactor) + specular * 160));

          // Jute earthy fleck modulation
          if (yarnType === 'Golden Organic Bengal Jute') {
            const fleck = rand1 > 0.8 ? 35 : rand1 < 0.2 ? -25 : 0;
            r = Math.min(255, Math.max(0, r + 25 + fleck));
            g = Math.min(255, Math.max(0, g + 8 + fleck));
            b = Math.min(255, Math.max(0, b - 18 + fleck));
          }

          // Ambient Occlusion drop shadow underneath tufts
          if (layer === 0) {
            ctx.beginPath();
            ctx.ellipse(
              tuftX + lightX * 3,
              tuftY + lightY * 3,
              profile.fiberThickness * scale * 2,
              profile.fiberThickness * scale * 1.2,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(0,0,0,${0.35 * pile.shadowDepth})`;
            ctx.fill();
          }

          // Draw fiber filament / tuft head
          ctx.beginPath();
          ctx.moveTo(tuftX, tuftY);

          if (profile.curlFactor > 0.3) {
            // Curled / crimped yarn (Wool & Jute)
            const midX = (tuftX + endX) / 2 + (rand1 - 0.5) * 8 * scale;
            const midY = (tuftY + endY) / 2 + (rand2 - 0.5) * 4 * scale;
            ctx.quadraticCurveTo(midX, midY, endX, endY);
          } else {
            // Sleek filament (Silk & Acrylic)
            ctx.lineTo(endX, endY);
          }

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${layerAlpha})`;
          ctx.lineWidth = profile.fiberThickness * scale * (0.8 + layerDepth * 0.4);
          ctx.lineCap = 'round';
          ctx.stroke();

          // Silk specular shimmer glint on tips
          if (profile.sheen === 'high-luster' && rand2 > 0.7) {
            ctx.beginPath();
            ctx.arc(endX, endY, 1.2 * scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + specular * 0.6})`;
            ctx.fill();
          }
        }
      }
    }

    // High Zoom Fiber Structure Overlays (Microscopic view)
    if (scale === 4) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.font = '10px monospace';
      ctx.fillText('400% MACRO FIBER ANALYSIS · ' + profile.micron, 16, height - 18);
    }
  }, [yarnType, baseRgb, zoomLevel, lightAngle, brushDisplacement, profile, pile]);

  // Redraw when parameters change
  useEffect(() => {
    const animId = requestAnimationFrame(() => {
      renderCanvas();
    });
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Touch and mouse brushing handler
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setBrushPos({ x, y });

    if (brushing || e.buttons > 0) {
      setBrushDisplacement((prev) => {
        const next = [...prev, { x, y, force: 1.0 }].slice(-15);
        return next;
      });
    }
  };

  const resetPile = () => {
    setBrushDisplacement([]);
  };

  return (
    <div
      className={`bg-white border border-sand-200 overflow-hidden shadow-sm transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="p-3.5 bg-sand-50/80 border-b border-sand-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-charcoal-900">
            Procedural Pile & Fiber Simulator
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-cream border border-sand-200 font-mono text-charcoal-600">
            {profile.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Selector */}
          <div className="inline-flex border border-sand-200 bg-white">
            {(['1x', '2x', '4x'] as const).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoomLevel(z)}
                className={`px-2.5 py-1 text-[10px] font-mono tracking-wider transition-colors ${
                  zoomLevel === z
                    ? 'bg-charcoal-900 text-cream font-bold'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
                title={`Zoom to ${z} magnification`}
              >
                {z}
              </button>
            ))}
          </div>

          {/* Reset brush */}
          <button
            type="button"
            onClick={resetPile}
            title="Reset fiber orientation"
            className="p-1.5 text-charcoal-600 hover:text-charcoal-900 hover:bg-white border border-transparent hover:border-sand-200 transition-colors"
          >
            <RotateCcw size={13} />
          </button>

          {/* Info toggle */}
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            title="View technical fiber specifications"
            className={`p-1.5 transition-colors border ${
              showInfo
                ? 'bg-charcoal-900 text-cream border-charcoal-900'
                : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-white border-sand-200'
            }`}
          >
            <Info size={13} />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with tactile hover */}
      <div className="relative bg-charcoal-950 aspect-[16/10] sm:aspect-[2/1] overflow-hidden select-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={560}
          height={280}
          onPointerDown={(e) => {
            setBrushing(true);
            handlePointerMove(e);
          }}
          onPointerUp={() => setBrushing(false)}
          onPointerLeave={() => {
            setBrushing(false);
            setBrushPos(null);
          }}
          onPointerMove={handlePointerMove}
          className="w-full h-full object-cover touch-none"
        />

        {/* Tactile interaction hint pill */}
        <div className="absolute top-3 left-3 bg-charcoal-900/80 backdrop-blur-sm px-2.5 py-1 border border-cream/15 text-cream text-[10px] tracking-wider flex items-center gap-1.5 pointer-events-none">
          <Hand size={11} className="text-sand-300" />
          <span>Drag or hover to brush pile</span>
        </div>

        {/* Lighting Angle Controller */}
        <div className="absolute top-3 right-3 bg-charcoal-900/80 backdrop-blur-sm p-1.5 border border-cream/15 flex items-center gap-2 text-cream text-[10px]">
          <Sun size={12} className="text-amber-300" />
          <input
            type="range"
            min={0}
            max={180}
            value={lightAngle}
            onChange={(e) => setLightAngle(parseInt(e.target.value))}
            className="w-16 accent-sand-300 cursor-pointer h-1"
            title="Adjust incident sunlight angle"
          />
        </div>

        {/* Live Sheen / Texture Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="bg-charcoal-900/90 backdrop-blur-sm border border-cream/15 px-3 py-1 text-cream text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={11} className="text-sand-300" />
            <span>Sheen: <strong className="text-sand-200 capitalize">{profile.sheen}</strong></span>
          </div>

          <div className="hidden sm:flex bg-charcoal-900/90 backdrop-blur-sm border border-cream/15 px-3 py-1 text-cream text-[10px] tracking-wider font-mono">
            {pile.depthMm}mm · {pile.densityMultiplier >= 1 ? 'High Density' : 'Plush Deep Pile'}
          </div>
        </div>

        {/* Quick color indicator */}
        <div
          className="absolute bottom-3 right-3 w-5 h-5 rounded-full border-2 border-white/60 shadow-md"
          style={{ backgroundColor: selectedColor }}
          title={`Simulating selected dye palette: ${selectedColor}`}
        />
      </div>

      {/* Technical Spec Drawer */}
      {showInfo && (
        <div className="p-4 bg-sand-100/80 border-t border-sand-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fade-in">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block mb-0.5">
              Micron & Fineness
            </span>
            <p className="font-semibold text-charcoal-900">{profile.micron}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block mb-0.5">
              Tuft Density
            </span>
            <p className="font-semibold text-charcoal-900">{profile.tuftCount}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block mb-0.5">
              Hand-Feel Rating
            </span>
            <p className="font-semibold text-charcoal-900">{profile.softness}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block mb-0.5">
              Artisan Provenance
            </span>
            <p className="font-semibold text-charcoal-900">{profile.origin}</p>
          </div>

          <div className="col-span-2 sm:col-span-4 pt-2 border-t border-sand-200/80 text-[11px] text-charcoal-600 leading-relaxed">
            {profile.description}
          </div>
        </div>
      )}

      {/* Bottom Quick Ticker */}
      <div className="px-4 py-2 bg-white border-t border-sand-200 flex flex-wrap items-center justify-between text-[11px] text-charcoal-500 gap-2">
        <span className="italic">
          Real-time procedural simulation of pile reflection, crimp elasticity, and shadow depth.
        </span>
        <span className="font-mono text-charcoal-700">
          Pile: {pileHeight.split(' ')[0]} ({pile.depthMm}mm)
        </span>
      </div>
    </div>
  );
}
