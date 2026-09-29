import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Scissors, Layers, Sparkles } from 'lucide-react';

interface TuftNode {
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  pile: 'cut' | 'loop';
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
}

const YARN_COLORS = [
  { name: 'Ochre Terracotta', hex: '#BD632F' },
  { name: 'Bengal Jute Gold', hex: '#C89B3C' },
  { name: 'Cypress Green', hex: '#2E6B38' },
  { name: 'Delta Deep Indigo', hex: '#264653' },
  { name: 'Raw Linen Ecru', hex: '#EBE5D8' },
  { name: 'Rose Clay', hex: '#A35A62' },
];

export const FullHeroTuftingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeColor, setActiveColor] = useState(YARN_COLORS[0].hex);
  const [pileMode, setPileMode] = useState<'cut' | 'loop'>('cut');
  const [totalStitches, setTotalStitches] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Machine physical state
  const gunRef = useRef({
    x: 400,
    y: 300,
    targetX: 450,
    targetY: 300,
    vx: 0,
    vy: 0,
    angle: 0,
    needlePhase: 0,
    gearAngle: 0,
    vibration: 0,
    activeColor: YARN_COLORS[0].hex,
    pileMode: 'cut' as 'cut' | 'loop',
    isPointerGuided: false,
  });

  // Keep ref in sync with state for animation loop
  gunRef.current.activeColor = activeColor;
  gunRef.current.pileMode = pileMode;

  const tuftsRef = useRef<TuftNode[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animTimeRef = useRef(0);
  const lastTuftTimeRef = useRef(0);

  // Resize canvas for sharp rendering on Retina / high-DPI displays
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Seed initial realistic rug design across the canvas
  useEffect(() => {
    const seedCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const seeded: TuftNode[] = [];
      const motifs = [
        { color: '#BD632F', yOffset: h * 0.28, waveFreq: 0.008, waveAmp: 28, startX: w * 0.35, endX: w * 0.92, rows: 3 },
        { color: '#C89B3C', yOffset: h * 0.38, waveFreq: 0.010, waveAmp: 32, startX: w * 0.40, endX: w * 0.95, rows: 2 },
        { color: '#2E6B38', yOffset: h * 0.48, waveFreq: 0.007, waveAmp: 24, startX: w * 0.38, endX: w * 0.90, rows: 3 },
        { color: '#264653', yOffset: h * 0.60, waveFreq: 0.009, waveAmp: 30, startX: w * 0.45, endX: w * 0.94, rows: 2 },
      ];

      motifs.forEach((m) => {
        for (let r = 0; r < m.rows; r++) {
          const rowY = m.yOffset + r * 14;
          for (let x = m.startX; x <= m.endX; x += 7) {
            const y = rowY + Math.sin(x * m.waveFreq + r * 0.5) * m.waveAmp;
            seeded.push({
              x,
              y,
              color: m.color,
              size: 14,
              angle: Math.sin(x * 0.01) * 0.3,
              pile: 'cut',
              opacity: 1,
            });
          }
        }
      });

      tuftsRef.current = seeded;
      setTotalStitches(seeded.length);

      // Start the gun near the end of the last motif
      gunRef.current.x = w * 0.75;
      gunRef.current.y = h * 0.55;
      gunRef.current.targetX = w * 0.75;
      gunRef.current.targetY = h * 0.55;
    };

    const timer = setTimeout(seedCanvas, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClear = () => {
    tuftsRef.current = [];
    particlesRef.current = [];
    setTotalStitches(0);
    animTimeRef.current = 0;
  };

  // Main Render & Physics Loop
  useEffect(() => {
    let animId: number;

    const render = (timestamp: number) => {
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

      // 1. Draw Woven Monks Cloth Primary Backing Across Entire Canvas
      // Base linen tone
      ctx.fillStyle = '#F4F1EA';
      ctx.fillRect(0, 0, width, height);

      // Micro-weave grain
      ctx.fillStyle = 'rgba(210, 200, 185, 0.35)';
      for (let x = 0; x < width; x += 6) {
        ctx.fillRect(x, 0, 1, height);
      }
      for (let y = 0; y < height; y += 6) {
        ctx.fillRect(0, y, width, 1);
      }

      // Yellow Primary Canvas Guide Grid (spaced every 48px)
      ctx.strokeStyle = 'rgba(220, 175, 45, 0.42)';
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

      // 2. Realistic Automated Tufting Trajectory (if user is not manually steering)
      const gun = gunRef.current;

      if (!gun.isPointerGuided && isPlaying) {
        animTimeRef.current += 0.018;
        const t = animTimeRef.current;

        // Smooth flowing artistic trajectory covering wide sweeps of the hero canvas
        const centerX = width * 0.65;
        const centerY = height * 0.52;
        const rx = Math.min(width * 0.28, 380);
        const ry = Math.min(height * 0.32, 220);

        // Harmonious composite path with organic loop turns
        const pathX = centerX + Math.sin(t * 1.1) * rx + Math.cos(t * 2.2) * 50;
        const pathY = centerY + Math.cos(t * 0.85) * ry + Math.sin(t * 1.7) * 40;

        gun.targetX = pathX;
        gun.targetY = pathY;

        // Automatically cycle yarn colors gracefully over time for variety
        const colorIdx = Math.floor((t * 0.35) % YARN_COLORS.length);
        if (YARN_COLORS[colorIdx].hex !== activeColor && !isPointerDown) {
          setActiveColor(YARN_COLORS[colorIdx].hex);
        }
      }

      // Physics easing for the gun movement
      const dx = gun.targetX - gun.x;
      const dy = gun.targetY - gun.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        const ease = gun.isPointerGuided ? 0.22 : 0.09;
        gun.x += dx * ease;
        gun.y += dy * ease;
        const targetAngle = Math.atan2(dy, dx);

        // Smooth angle rotation
        let angleDiff = targetAngle - gun.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        gun.angle += angleDiff * 0.18;
      }

      // Needle cycle & yarn insertion
      if (isPlaying) {
        gun.needlePhase = (gun.needlePhase + 0.8) % (Math.PI * 2);
        gun.gearAngle += 0.32;
        gun.vibration = (Math.random() - 0.5) * 1.8;

        // Punch a new tuft stitch into the canvas
        const needlePunch = Math.sin(gun.needlePhase);
        if (needlePunch > 0.72 && timestamp - lastTuftTimeRef.current > 22) {
          lastTuftTimeRef.current = timestamp;

          // Compute needle tip position
          const needleOffset = 18;
          const tipX = gun.x + Math.cos(gun.angle) * needleOffset;
          const tipY = gun.y + Math.sin(gun.angle) * needleOffset;

          // Add dense plush tuft node
          tuftsRef.current.push({
            x: tipX + (Math.random() - 0.5) * 3,
            y: tipY + (Math.random() - 0.5) * 3,
            color: gun.activeColor,
            size: gun.pileMode === 'cut' ? 14 : 10,
            angle: gun.angle + (Math.random() - 0.5) * 0.4,
            pile: gun.pileMode,
            opacity: 1,
          });

          // Limit memory to keep 60fps steady
          if (tuftsRef.current.length > 2200) {
            tuftsRef.current.shift();
          }

          setTotalStitches((s) => s + 1);

          // Spawn wool fiber particle sparks
          for (let p = 0; p < 2; p++) {
            const pAngle = gun.angle + Math.PI + (Math.random() - 0.5) * 1.5;
            const pSpeed = 1.2 + Math.random() * 2.5;
            particlesRef.current.push({
              x: tipX,
              y: tipY,
              vx: Math.cos(pAngle) * pSpeed,
              vy: Math.sin(pAngle) * pSpeed,
              color: gun.activeColor,
              life: 1,
              size: 1.5 + Math.random() * 2,
            });
          }
        }
      }

      // 3. Render All Dense 3D Tufted Rug Stitches (Making the Tufted Rug)
      const tufts = tuftsRef.current;
      const tLen = tufts.length;

      for (let i = 0; i < tLen; i++) {
        const tuft = tufts[i];

        ctx.save();
        ctx.translate(tuft.x, tuft.y);
        ctx.rotate(tuft.angle);

        // 3D Ambient Drop Shadow under tuft
        ctx.beginPath();
        ctx.ellipse(2.5, 4, tuft.size * 0.75, tuft.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 15, 10, 0.22)';
        ctx.fill();

        // Volumetric Wool Tuft Body
        ctx.beginPath();
        ctx.ellipse(0, 0, tuft.size * 0.78, tuft.size * 0.56, 0, 0, Math.PI * 2);
        ctx.fillStyle = tuft.color;
        ctx.fill();

        // Realistic Wool Pile Highlights & Crimp Texturing
        ctx.beginPath();
        ctx.ellipse(-tuft.size * 0.15, -tuft.size * 0.15, tuft.size * 0.45, tuft.size * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.26)';
        ctx.fill();

        // Cut Pile Sheared Top Center or Loop Fold
        if (tuft.pile === 'cut') {
          ctx.beginPath();
          ctx.ellipse(0, 0, tuft.size * 0.25, tuft.size * 0.18, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
          ctx.fill();
        } else {
          // Loop fold highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, tuft.size * 0.35, 0, Math.PI);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Render Floating Wool Particles
      const particles = particlesRef.current;
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.94;
        pt.vy *= 0.94;
        pt.life -= 0.035;

        if (pt.life <= 0) {
          particles.splice(p, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Render The Realistic AK-I Pro Tufting Machine
      const gx = gun.x + (isPlaying ? gun.vibration : 0);
      const gy = gun.y + (isPlaying ? gun.vibration : 0);
      const needlePulse = Math.sin(gun.needlePhase) * 11; // reciprocating travel distance

      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(gun.angle);

      // (A) Machine Cast Shadow on Canvas
      ctx.save();
      ctx.translate(8, 14);
      ctx.beginPath();
      ctx.ellipse(-30, 8, 48, 18, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 12, 10, 0.25)';
      ctx.fill();
      ctx.restore();

      // (B) Front Foot Glide Plate (rests directly on monks cloth)
      ctx.fillStyle = '#4B5563';
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-2, -8, 8, 16);
      ctx.strokeRect(-2, -8, 8, 16);

      // (C) Reciprocating High-Carbon Steel Needle
      ctx.fillStyle = '#E5E7EB';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1.2;
      ctx.fillRect(needlePulse, -3, 18, 6);
      ctx.strokeRect(needlePulse, -3, 18, 6);

      // Needle Beveled Point with Eyelet Hole
      ctx.beginPath();
      ctx.moveTo(18 + needlePulse, -3);
      ctx.lineTo(26 + needlePulse, 0);
      ctx.lineTo(18 + needlePulse, 3);
      ctx.closePath();
      ctx.fillStyle = '#F3F4F6';
      ctx.fill();
      ctx.stroke();

      // Eyelet hole for yarn
      ctx.beginPath();
      ctx.arc(20 + needlePulse, 0, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = '#1F2937';
      ctx.fill();

      // (D) Machine Barrel & Sliding Needle Guide Rails
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(-34, -10, 32, 20);
      ctx.fillStyle = '#9CA3AF'; // chrome guide rail
      ctx.fillRect(-32, -8, 28, 4);
      ctx.fillRect(-32, 4, 28, 4);

      // (E) Anodized Metal Motor Chassis (Cyan / Teal Industrial Finish)
      ctx.fillStyle = '#0F766E'; // Deep teal aluminum body
      ctx.strokeStyle = '#115E59';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-82, -22, 50, 44);
      ctx.strokeRect(-82, -22, 50, 44);

      // Motor Cooling Vents
      ctx.fillStyle = '#042F2E';
      for (let v = 0; v < 5; v++) {
        ctx.fillRect(-76 + v * 9, -16, 4, 32);
      }

      // (F) Rotating Brass Drive Gear & Eccentric Piston
      ctx.save();
      ctx.translate(-58, 0);
      ctx.rotate(gun.gearAngle);

      // Brass outer gear wheel
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#D97706';
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Gear teeth notches
      for (let g = 0; g < 8; g++) {
        const ga = (g * Math.PI) / 4;
        ctx.fillStyle = '#B45309';
        ctx.fillRect(Math.cos(ga) * 11 - 1.5, Math.sin(ga) * 11 - 1.5, 3, 3);
      }

      // Eccentric connector peg
      ctx.beginPath();
      ctx.arc(6, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#F3F4F6';
      ctx.fill();
      ctx.restore();

      // (G) Ergonomic Handle, Speed Dial, and Red Trigger
      // Main rubber grip
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.moveTo(-64, 22);
      ctx.lineTo(-50, 58);
      ctx.lineTo(-36, 58);
      ctx.lineTo(-46, 22);
      ctx.closePath();
      ctx.fill();

      // Red finger trigger
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-42, 26, 7, 10);

      // Speed control dial at handle base
      ctx.beginPath();
      ctx.arc(-43, 54, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      // (H) Top Yarn Guide Tube & Wire Threader Ring
      ctx.fillStyle = '#6B7280';
      ctx.fillRect(-78, -32, 42, 10);
      ctx.beginPath();
      ctx.arc(-36, -27, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#F9FAFB';
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // (I) Wool Thread Feeding into Machine Eyelet
      ctx.strokeStyle = gun.activeColor;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-36, -27);
      ctx.quadraticCurveTo(-15, -15, 20 + needlePulse, 0);
      ctx.stroke();

      ctx.restore();

      // 5. Overhead Yarn Feed Dynamics (Thread unspooling from off-screen or top bobbin)
      ctx.save();
      const spoolX = Math.max(60, Math.min(width - 80, gx - 120));
      const spoolY = 32;

      // Realistic Yarn Spool at Top Edge
      ctx.fillStyle = '#78350F';
      ctx.fillRect(spoolX - 18, spoolY + 20, 36, 6);

      ctx.beginPath();
      ctx.moveTo(spoolX - 15, spoolY + 20);
      ctx.lineTo(spoolX - 8, spoolY - 14);
      ctx.lineTo(spoolX + 8, spoolY - 14);
      ctx.lineTo(spoolX + 15, spoolY + 20);
      ctx.closePath();
      ctx.fillStyle = gun.activeColor;
      ctx.fill();

      // Dynamic catenary curve thread connecting spool to gun
      ctx.strokeStyle = gun.activeColor;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(spoolX, spoolY - 14);
      ctx.bezierCurveTo(
        spoolX + 60,
        spoolY + 90,
        gx - 80,
        gy - 90,
        gx + Math.cos(gun.angle) * -36 - Math.sin(gun.angle) * -27,
        gy + Math.sin(gun.angle) * -36 + Math.cos(gun.angle) * -27
      );
      ctx.stroke();

      ctx.restore();

      // 6. Subtle Atmospheric Vignette over canvas borders
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.35,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(22, 21, 19, 0.45)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeColor, pileMode, isPointerDown]);

  // Pointer interactions across entire canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gunRef.current.targetX = x;
    gunRef.current.targetY = y;
    gunRef.current.isPointerGuided = true;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsPointerDown(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
    // After 2.5s of inactivity, resume automated artistic trajectory
    setTimeout(() => {
      if (!isPointerDown) {
        gunRef.current.isPointerGuided = false;
      }
    }, 2500);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Full Bleed Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 w-full h-full block cursor-crosshair touch-none"
      />

      {/* Floating Artisan Workshop Controls Pill (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2.5 bg-[#161513]/90 backdrop-blur-md px-4 py-2 rounded-full border border-sand-400/20 shadow-2xl text-cream text-xs">
        {/* Play / Pause */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-full hover:bg-white/10 text-sand-200 transition-colors"
          title={isPlaying ? 'Pause Motion' : 'Start Motion'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>

        {/* Pile Toggle */}
        <button
          type="button"
          onClick={() => setPileMode(pileMode === 'cut' ? 'loop' : 'cut')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] uppercase font-mono tracking-wider transition-colors"
          title="Toggle Cut Pile vs Loop Pile"
        >
          {pileMode === 'cut' ? <Scissors size={11} className="text-amber-400" /> : <Layers size={11} className="text-emerald-400" />}
          <span>{pileMode === 'cut' ? 'Cut Pile' : 'Loop Pile'}</span>
        </button>

        <span className="w-px h-3.5 bg-white/20" />

        {/* Live Yarn Palette Dots */}
        <div className="flex items-center gap-1.5">
          {YARN_COLORS.map((yarn) => (
            <button
              key={yarn.hex}
              type="button"
              onClick={() => setActiveColor(yarn.hex)}
              className={`w-4 h-4 rounded-full transition-transform ${
                activeColor === yarn.hex ? 'scale-125 ring-2 ring-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: yarn.hex }}
              title={yarn.name}
            />
          ))}
        </div>

        <span className="w-px h-3.5 bg-white/20" />

        {/* Stitch Counter */}
        <div className="font-mono text-[11px] text-sand-300">
          {totalStitches.toLocaleString()} sts
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={handleClear}
          className="p-1.5 rounded-full hover:bg-white/10 text-sand-300 transition-colors"
          title="Reset canvas"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Floating Subtle Interaction Hint (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden md:inline-flex items-center gap-2 bg-[#161513]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sand-400/20 text-[11px] text-cream/80">
        <Sparkles size={12} className="text-jute-gold animate-spin" />
        <span>Touch or move cursor anywhere on canvas to steer the tufting gun</span>
      </div>
    </div>
  );
};

export default FullHeroTuftingCanvas;
