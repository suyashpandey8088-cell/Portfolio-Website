'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

if (typeof window !== 'undefined' && !registered) {
  registered = true;
  gsap.registerPlugin(ScrollTrigger);
  // One shared, conservative config: avoid layout thrash during scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: 'power3.out' });
}

export { gsap, ScrollTrigger };
