'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Drives the whole page with a single Lenis instance synced to GSAP's ticker.
 * One rAF loop for smoothing + every ScrollTrigger update => no competing loops,
 * no jitter, and animations stay strictly bound to scroll position.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Native scrolling only. ScrollTriggers still work, animations are flattened.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      syncTouch: false, // native momentum on touch = smoother on mobile
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(250, 33);

    // Anchor links -> smooth programmatic scroll
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!el) return;
      const id = el.getAttribute('href')!.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 2, duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    // Fonts change metrics -> recompute trigger geometry once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
