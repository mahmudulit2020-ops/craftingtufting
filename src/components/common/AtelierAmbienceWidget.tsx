import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Radio, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function AtelierAmbienceWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Soft rhythmic textile loom ambient synth using Web Audio API (safe, no external mp3 needed)
  const toggleAudio = () => {
    if (isPlaying) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
        setTimeout(() => {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 150);
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Warm pink noise / soft low rhythmic hum reminiscent of wood looms
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.04;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gainRef.current = gain;
        noise.start();
        setIsPlaying(true);
      } catch {
        setIsPlaying(!isPlaying);
      }
    }
  };

  return (
    <aside aria-label="Atelier Visitor & Loom Ambience" className="fixed bottom-4 left-4 z-40 hidden md:block select-none">
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111317]/90 hover:bg-[#111317] border border-teal-500/30 text-teal-300 rounded-full text-[11px] font-mono shadow-xl backdrop-blur-md transition-all hover:scale-105"
        >
          <Radio size={12} className={isPlaying ? 'text-teal-400 animate-pulse' : 'text-sand-400'} />
          <span>Atelier Ambience</span>
          <ChevronUp size={12} />
        </button>
      ) : (
        <div className="bg-[#111317]/95 border border-white/15 rounded-lg shadow-2xl backdrop-blur-md p-3 max-w-[280px] text-white space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-300 font-bold">
                VISITOR PRESET: 18195-20
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="text-sand-400 hover:text-white p-0.5 rounded-xs"
              title="Minimize widget"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-[10px] text-sand-300/80 leading-tight">
            Your journey with our Bengal handmade atelier has begun.
          </p>

          {/* Audio controller (matching the video's audio player at bottom-left) */}
          <div className="flex items-center justify-between bg-black/40 border border-white/10 p-2 rounded-xs">
            <div className="space-y-0.5">
              <div className="text-[9px] uppercase tracking-widest text-teal-400/90 font-mono flex items-center gap-1">
                <span>{isPlaying ? 'LOOM AMBIENCE: ACTIVE' : 'LOOM AMBIENCE: MUTED'}</span>
              </div>
              {/* Equalizer animation bars */}
              <div className="flex items-end gap-0.5 h-3">
                {[40, 90, 60, 100, 75, 45, 80].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-xs bg-teal-400 transition-all ${
                      isPlaying ? 'animate-pulse' : 'opacity-30'
                    }`}
                    style={{
                      height: isPlaying ? `${h}%` : '20%',
                      animationDuration: `${0.4 + i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleAudio}
              className="p-1.5 rounded-full bg-teal-500 hover:bg-teal-400 text-black transition-colors"
              title={isPlaying ? 'Mute Ambience' : 'Play Loom Ambience'}
            >
              {isPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
          </div>

          <div className="text-[9px] text-sand-400/70 flex items-center justify-between pt-0.5 font-mono">
            <span>Delta Handloom Studio</span>
            <span className="flex items-center gap-1 text-teal-400">
              <Sparkles size={9} />
              40+ Countries
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
