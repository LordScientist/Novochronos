import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

export interface ScrollState {
  progress: number;
  velocity: number;
  scroll: number;
  direction: number;
}

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    velocity: 0,
    scroll: 0,
    direction: 0,
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    const handleScroll = (e: { progress: number; velocity: number; scroll: number; direction: number }) => {
      setScrollState({
        progress: e.progress,
        velocity: e.velocity,
        scroll: e.scroll,
        direction: e.direction,
      });
    };

    lenis.on('scroll', handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return { lenis: lenisRef.current, ...scrollState };
}
