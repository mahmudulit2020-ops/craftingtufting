import React from 'react';

export default function SkylineWave() {
  // Generates the iconic jagged architectural skyline silhouette seen in the video
  const skylineBars = [
    { height: 42, color: '#0d9488' },
    { height: 75, color: '#14b8a6' },
    { height: 110, color: '#1f2937' },
    { height: 85, color: '#0f766e' },
    { height: 135, color: '#111827' },
    { height: 95, color: '#2dd4bf' },
    { height: 60, color: '#134e4a' },
    { height: 120, color: '#1f2937' },
    { height: 145, color: '#0f766e' },
    { height: 90, color: '#14b8a6' },
    { height: 50, color: '#111827' },
    { height: 105, color: '#0d9488' },
    { height: 160, color: '#1f2937' },
    { height: 130, color: '#2dd4bf' },
    { height: 80, color: '#134e4a' },
    { height: 115, color: '#0f766e' },
    { height: 70, color: '#111827' },
    { height: 140, color: '#14b8a6' },
    { height: 100, color: '#1f2937' },
    { height: 65, color: '#0d9488' },
    { height: 125, color: '#134e4a' },
    { height: 175, color: '#111827' },
    { height: 140, color: '#2dd4bf' },
    { height: 95, color: '#0f766e' },
    { height: 55, color: '#14b8a6' },
    { height: 110, color: '#1f2937' },
    { height: 135, color: '#0d9488' },
    { height: 85, color: '#134e4a' },
    { height: 150, color: '#111827' },
    { height: 105, color: '#2dd4bf' },
    { height: 70, color: '#0f766e' },
    { height: 125, color: '#14b8a6' },
    { height: 90, color: '#1f2937' },
    { height: 165, color: '#0d9488' },
    { height: 130, color: '#134e4a' },
    { height: 75, color: '#111827' },
    { height: 115, color: '#2dd4bf' },
    { height: 145, color: '#0f766e' },
    { height: 95, color: '#14b8a6' },
    { height: 60, color: '#1f2937' },
    { height: 130, color: '#0d9488' },
    { height: 170, color: '#111827' },
    { height: 100, color: '#134e4a' },
    { height: 80, color: '#2dd4bf' },
    { height: 120, color: '#0f766e' },
    { height: 155, color: '#14b8a6' },
    { height: 90, color: '#1f2937' },
    { height: 65, color: '#0d9488' },
    { height: 110, color: '#111827' },
    { height: 140, color: '#2dd4bf' },
    { height: 85, color: '#134e4a' },
    { height: 125, color: '#0f766e' },
    { height: 160, color: '#1f2937' },
    { height: 105, color: '#14b8a6' },
    { height: 70, color: '#0d9488' },
    { height: 135, color: '#111827' },
    { height: 95, color: '#2dd4bf' },
    { height: 50, color: '#134e4a' },
    { height: 115, color: '#0f766e' },
    { height: 150, color: '#14b8a6' },
  ];

  return (
    <div className="w-full overflow-hidden bg-transparent leading-none select-none relative -mb-1">
      {/* Dynamic Skyline Equalizer Silhouettes */}
      <div className="w-full flex items-end justify-between h-28 sm:h-36 px-0 opacity-95">
        {skylineBars.map((bar, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-500 hover:opacity-80"
            style={{
              height: `${(bar.height / 175) * 100}%`,
              backgroundColor: bar.color,
              marginRight: '1px',
            }}
          >
            {/* Subtle illuminated windows / stitch nodes */}
            {bar.height > 100 && (
              <div className="flex flex-col items-center gap-1.5 pt-2 opacity-60">
                <span className="w-1 h-1 bg-amber-200/70 rounded-xs" />
                <span className="w-1 h-1 bg-amber-200/50 rounded-xs" />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Seamless blend line connecting into the dark footer */}
      <div className="w-full h-1 bg-[#111215]" />
    </div>
  );
}
