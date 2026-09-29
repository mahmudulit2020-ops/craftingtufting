import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Scissors, Layers } from 'lucide-react';

interface TuftPoint {
  x: number;
  y: number;
  color: string;
  size: number;
  jitterX: number;
  jitterY: number;
  angle: number;
  timestamp: number;
}

const YARN_PALETTE = [
  { name: 'Ochre Terracotta', hex: '#BD632F', label: 'Terracotta' },
  { name: 'Bengal Jute Gold', hex: '#C89B3C', label: 'Jute Gold' },
  { name: 'Cypress Green', hex: '#2E6B38', label: 'Forest' },
  { name: 'Delta Indigo', hex: '#264653', label: 'Deep Indigo' },
  { name: 'Linen Ecru', hex: '#EAE4D7', label: 'Raw Linen' },
  { name: 'Burgundy Crimson', hex: '#8B263E', label: 'Crimson' },
];

export const TuftingGunMotion: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeColor, setActiveColor] = useState(YARN_PALETTE[0].hex);
  const [pileMode, setPileMode] = useState<'cut' | 'loop'>('cut');
  const [stitchCount, setStitchCount] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Gun position & mechanical state
  const gunState = useRef({
    x: 80,
    y: 120,
    angle: 0,
    needleReciprocate: 0,
    gearAngle: 0,
    targetX: 80,
    targetY: 120,
    isStitching: true,
  });

  // Storage for tufted points
  const tuftsRef = useRef<TuftPoint[]>([]);

  // Automated demonstration trajectory
  const autoTimeRef = useRef(0);

  // Canvas resize and DPI scale
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Reset or clear canvas
  const handleClear = () => {
    tuftsRef.current = [];
    setStitchCount(0);
    autoTimeRef.current = 0;
  };

  // Pre-seed some aesthetic tufted rows to start immediately
  useEffect(() => {
    const initialTufts: TuftPoint[] = [];
    const colors = [YARN_PALETTE[0].hex, YARN_PALETTE[1].hex, YARN_PALETTE[2].hex];

    // Seed an initial wave motif
    for (let row = 0; row < 3; row++) {
      const color = colors[row % colors.length];
      const baseY = 80 + row * 26;
      for (let x = 60; x <= 280; x += 6) {
        const y = baseY + Math.sin(x * 0.035) * 12;
        initialTufts.push({
          x,
          y,
          color,
          size: 11,
          jitterX: (Math.random() - 0.5) * 2,
          jitterY: (Math.random() - 0.5) * 2,
          angle: Math.random() * Math.PI,
          timestamp: Date.now(),
        });
      }
    }
    tuftsRef.current = initialTufts;
    setStitchCount(initialTufts.length);
  }, []);

  // Main Animation Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw Primary Backing Fabric (Monks Cloth texture with yellow guide grid)
      ctx.fillStyle = '#F5F2EB';
      ctx.fillRect(0, 0, width, height);

      // Cloth micro-texture
      ctx.fillStyle = 'rgba(215, 205, 190, 0.4)';
      for (let i = 0; i < width; i += 8) {
        ctx.fillRect(i, 0, 1, height);
      }
      for (let j = 0; j < height; j += 8) {
        ctx.fillRect(0, j, width, 1);
      }

      // Yellow primary canvas reference grid lines (every 48px)
      ctx.strokeStyle = 'rgba(218, 172, 42, 0.5)';
      ctx.lineWidth = 1.2;
      for (let x = 24; x < width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 24; y < height; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Automated path simulation if user is not actively drawing
      if (!isUserInteracting && isPlaying) {
        autoTimeRef.current += 0.024;
        const t = autoTimeRef.current;

        // Multifold continuous spiral / wave path
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const radiusX = Math.min(width * 0.38, 220);
        const radiusY = Math.min(height * 0.34, 130);

        // Fluid figure-8 / Lissajous looping motion
        const nextX = centerX + Math.sin(t * 1.2) * radiusX + Math.cos(t * 2.4) * 25;
        const nextY = centerY + Math.cos(t * 0.8) * radiusY + Math.sin(t * 1.6) * 20;

        gunState.current.targetX = nextX;
        gunState.current.targetY = nextY;
      }

      // Smooth gun follow interpolation
      const dx = gunState.current.targetX - gunState.current.x;
      const dy = gunState.current.targetY - gunState.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        gunState.current.x += dx * 0.16;
        gunState.current.y += dy * 0.16;
        gunState.current.angle = Math.atan2(dy, dx);
      }

      // Oscillate needle and internal gears
      if (isPlaying) {
        gunState.current.needleReciprocate = (gunState.current.needleReciprocate + 0.65) % (Math.PI * 2);
        gunState.current.gearAngle += 0.28;

        // Lay down tuft stitches along the travel path
        if (dist > 3 || Math.sin(gunState.current.needleReciprocate) > 0.85) {
          const needleExtension = Math.sin(gunState.current.needleReciprocate);
          if (needleExtension > 0.7) {
            tuftsRef.current.push({
              x: gunState.current.x + (Math.random() - 0.5) * 4,
              y: gunState.current.y + (Math.random() - 0.5) * 4,
              color: activeColor,
              size: pileMode === 'cut' ? 12 : 9,
              jitterX: (Math.random() - 0.5) * 3,
              jitterY: (Math.random() - 0.5) * 3,
              angle: gunState.current.angle + (Math.random() - 0.5) * 0.6,
              timestamp: Date.now(),
            });

            // Prevent infinite memory bloat
            if (tuftsRef.current.length > 950) {
              tuftsRef.current.shift();
            }
            setStitchCount((c) => c + 1);
          }
        }
      }

      // 3. Render all tufted yarn loops / cut piles on the canvas
      const tufts = tuftsRef.current;
      for (let i = 0; i < tufts.length; i++) {
        const tuft = tufts[i];

        ctx.save();
        ctx.translate(tuft.x + tuft.jitterX, tuft.y + tuft.jitterY);
        ctx.rotate(tuft.angle);

        // Cast shadow of the tuft
        ctx.beginPath();
        ctx.ellipse(2, 3, tuft.size * 0.7, tuft.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(25, 20, 15, 0.18)';
        ctx.fill();

        // Base yarn tuft cluster
        ctx.beginPath();
        ctx.ellipse(0, 0, tuft.size * 0.75, tuft.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = tuft.color;
        ctx.fill();

        // Wool fiber strands / pile highlight
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.beginPath();
        ctx.moveTo(-tuft.size * 0.4, -tuft.size * 0.2);
        ctx.lineTo(tuft.size * 0.3, tuft.size * 0.25);
        ctx.stroke();

        if (pileMode === 'cut') {
          // Extra cut pile flare
          ctx.beginPath();
          ctx.arc(0, -tuft.size * 0.2, tuft.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
          ctx.fill();
        }

        ctx.restore();
      }

      // 4. Render The Animated Tufting Gun (AK-I style Machine)
      const gx = gunState.current.x;
      const gy = gunState.current.y;
      const gAngle = gunState.current.angle;
      const needlePulse = Math.sin(gunState.current.needleReciprocate) * 8; // needle stroke length

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(gAngle);

      // (A) Reciprocating Needle & Foot Guide (front of machine)
      // Guide foot resting on cloth
      ctx.fillStyle = '#6B7280';
      ctx.fillRect(-2, -6, 6, 12);

      // Needle reciprocating in and out of cloth
      ctx.fillStyle = '#D1D5DB';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1.2;
      ctx.fillRect(needlePulse, -2, 14, 4);
      ctx.strokeRect(needlePulse, -2, 14, 4);

      // Needle sharp bevel tip
      ctx.beginPath();
      ctx.moveTo(14 + needlePulse, -2);
      ctx.lineTo(20 + needlePulse, 0);
      ctx.lineTo(14 + needlePulse, 2);
      ctx.fillStyle = '#E5E7EB';
      ctx.fill();
      ctx.stroke();

      // (B) Machine Front Barrel & Drive Shaft
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(-28, -8, 26, 16);
      ctx.fillStyle = '#9CA3AF';
      ctx.fillRect(-32, -6, 4, 12);

      // (C) Motor Body (Matte Cyan / Industrial Green / Obsidian casing)
      ctx.fillStyle = '#164E63'; // deep cyan metallic casing
      ctx.fillRect(-70, -18, 42, 36);

      // Motor cooling vents
      ctx.fillStyle = '#0E3A4A';
      for (let v = 0; v < 4; v++) {
        ctx.fillRect(-64 + v * 8, -14, 4, 28);
      }

      // (D) Rotating Drive Wheel & Cam
      ctx.save();
      ctx.translate(-50, 0);
      ctx.rotate(gunState.current.gearAngle);
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#D97706'; // brass gear
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Gear spokes
      ctx.beginPath();
      ctx.moveTo(-11, 0);
      ctx.lineTo(11, 0);
      ctx.moveTo(0, -11);
      ctx.lineTo(0, 11);
      ctx.stroke();
      ctx.restore();

      // (E) Ergonomic Handle and Trigger
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.moveTo(-54, 18);
      ctx.lineTo(-44, 48);
      ctx.lineTo(-32, 48);
      ctx.lineTo(-40, 18);
      ctx.closePath();
      ctx.fill();

      // Trigger
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-36, 22, 6, 8);

      // (F) Top Yarn Guide Tube and Feeder Eyelet
      ctx.fillStyle = '#9CA3AF';
      ctx.fillRect(-68, -26, 38, 8);
      ctx.beginPath();
      ctx.arc(-30, -22, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F3F4F6';
      ctx.fill();
      ctx.stroke();

      // (G) Yarn Spool Feed Line entering the top guide
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-30, -22);
      ctx.quadraticCurveTo(-20, -50, -60, -90);
      ctx.stroke();

      // Spark / Wool Particle Bursts at needle insertion
      if (isPlaying && Math.random() > 0.4) {
        ctx.fillStyle = activeColor;
        for (let p = 0; p < 3; p++) {
          ctx.fillRect(
            16 + needlePulse + (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 12,
            2,
            2
          );
        }
      }

      ctx.restore();

      // 5. Overhead Yarn Cone (Source of fiber)
      ctx.save();
      const coneX = Math.max(30, Math.min(width - 50, gx - 40));
      const coneY = 28;

      // Cone Bobbin Base
      ctx.fillStyle = '#78350F';
      ctx.fillRect(coneX - 16, coneY + 22, 32, 6);

      // Wool Yarn Cone body
      ctx.beginPath();
      ctx.moveTo(coneX - 14, coneY + 22);
      ctx.lineTo(coneX - 6, coneY - 14);
      ctx.lineTo(coneX + 6, coneY - 14);
      ctx.lineTo(coneX + 14, coneY + 22);
      ctx.closePath();
      ctx.fillStyle = activeColor;
      ctx.fill();

      // Cone core peg
      ctx.fillStyle = '#D1D5DB';
      ctx.fillRect(coneX - 3, coneY - 22, 6, 12);

      // Yarn connecting string from cone to gun
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(coneX, coneY - 14);
      ctx.bezierCurveTo(coneX + 20, coneY + 40, gx - 60, gy - 70, gx - 30, gy - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeColor, pileMode, isUserInteracting]);

  // Handle User Interactive Touch / Mouse Steer
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gunState.current.targetX = x;
    gunState.current.targetY = y;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsUserInteracting(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsUserInteracting(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl border border-sand-300 bg-sand-100/70 overflow-hidden shadow-2xl ${className}`}
    >
      {/* Top Loom Header Bar */}
      <div className="bg-[#2B2925] text-cream px-4 py-2.5 flex items-center justify-between border-b border-sand-800 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono font-bold tracking-wider text-[11px] uppercase text-sand-200">
            AK-I Pro Pneumatic Loom
          </span>
          <span className="hidden sm:inline text-sand-500 text-[10px]">•</span>
          <span className="hidden sm:inline font-mono text-[10px] text-sand-300">
            {stitchCount.toLocaleString()} tufted stitches
          </span>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {/* Pile Mode Selector */}
          <button
            type="button"
            onClick={() => setPileMode(pileMode === 'cut' ? 'loop' : 'cut')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-bark/90 hover:bg-black text-[10px] uppercase font-mono tracking-wider border border-sand-600/40 rounded-xs text-sand-200"
            title="Toggle Cut Pile vs Loop Pile"
          >
            {pileMode === 'cut' ? <Scissors size={11} className="text-amber-400" /> : <Layers size={11} className="text-emerald-400" />}
            <span>{pileMode === 'cut' ? 'Cut Pile' : 'Loop Pile'}</span>
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-bark/90 hover:bg-black text-sand-200 border border-sand-600/40 rounded-xs"
            title={isPlaying ? 'Pause Motion' : 'Play Motion'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>

          {/* Reset Canvas */}
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 bg-bark/90 hover:bg-black text-sand-200 border border-sand-600/40 rounded-xs"
            title="Clear and Re-tuft"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Main Animated Canvas Container */}
      <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block touch-none"
        />

        {/* Interactive Helper Toast Badge */}
        <div className="absolute bottom-3 left-3 bg-bark/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-sand-400/30 text-[10px] text-cream flex items-center gap-2 pointer-events-none select-none">
          <Sparkles size={11} className="text-jute-gold animate-spin" />
          <span>Move cursor or touch frame to steer the tufting gun</span>
        </div>

        {/* Live Fiber Color Switcher floating on right */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-lg border border-sand-300 shadow-md flex flex-col gap-1.5">
          <span className="text-[9px] uppercase tracking-wider text-charcoal-500 font-bold px-1 text-center">
            Yarn
          </span>
          {YARN_PALETTE.map((yarn) => (
            <button
              key={yarn.hex}
              type="button"
              onClick={() => setActiveColor(yarn.hex)}
              className={`w-6 h-6 rounded-full transition-all border ${
                activeColor === yarn.hex
                  ? 'scale-115 ring-2 ring-charcoal-900 border-white shadow-xs'
                  : 'hover:scale-105 border-sand-300 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: yarn.hex }}
              title={yarn.name}
            />
          ))}
        </div>
      </div>

      {/* Sub-bar: Monks Cloth Spec & Crafting Metrics */}
      <div className="bg-[#FAF7F2] border-t border-sand-200 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-charcoal-600">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-charcoal-900">
            Primary Canvas: Monks Cloth (Yellow Grid)
          </span>
          <span className="text-sand-400">•</span>
          <span>100% Spun New Zealand Wool</span>
        </div>
        <div className="font-mono text-[10px] text-accent font-semibold">
          Speed: 32 stitches/sec (Reciprocating Needle Active)
        </div>
      </div>
    </div>
  );
};

export default TuftingGunMotion;
