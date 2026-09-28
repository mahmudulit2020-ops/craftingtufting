import { useEffect, useRef, useState } from 'react';

export function useAnimatedNumber(value: number, duration = 500): number {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const animate = (t: number) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = to;
        startRef.current = 0;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return display;
}
