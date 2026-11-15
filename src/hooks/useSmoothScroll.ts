import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';

export interface ScrollState {
  progress: number;
  velocity: number;
  scroll: number;
  direction: number;
}

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    velocity: 0,
    scroll: 0,
    direction: 0,
  });

  useEffect(() => {
    // Primary Lenis smoother for 60/120fps end-to-end fluid motion
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true, // Native-feel inertial momentum on touch/trackpads
      wheelMultiplier: 1.0,
      touchMultiplier: 1.3,
      autoRaf: true,
    });

    lenisRef.current = instance;
    setLenis(instance);
    if (typeof window !== 'undefined') {
      (window as any).__lenis = instance;
    }

    const handleScroll = (e: { progress: number; velocity: number; scroll: number; direction: number }) => {
      setScrollState({
        progress: e.progress,
        velocity: e.velocity,
        scroll: e.scroll,
        direction: e.direction,
      });
    };

    instance.on('scroll', handleScroll);

    return () => {
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      if (typeof window !== 'undefined') {
        (window as any).__lenis = null;
      }
    };
  }, []);

  const scrollToProgress = useCallback((targetProgress: number, duration = 1.2) => {
    if (!lenisRef.current) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const clamped = Math.max(0, Math.min(1, targetProgress));
    lenisRef.current.scrollTo(clamped * maxScroll, { duration });
  }, []);

  const scrollTo = useCallback((target: number | HTMLElement | string, options?: any) => {
    if (!lenisRef.current) return;
    lenisRef.current.scrollTo(target, options);
  }, []);

  return { lenis, scrollToProgress, scrollTo, ...scrollState };
}
