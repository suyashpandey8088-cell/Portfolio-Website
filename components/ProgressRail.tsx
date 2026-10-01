'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import { SECTIONS } from '@/lib/sections';
import s from './ProgressRail.module.css';

/**
 * Desktop: thin vertical rail on the right with 01—INTRO … 06—CONTACT.
 * Mobile: slim horizontal bar pinned to the top.
 * The travelling line + active highlight are tweened (never snapped).
 */
export default function ProgressRail() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const setY = gsap.quickTo(line.current, 'scaleY', { duration: 0.45, ease: 'power3.out' });
      const setX = gsap.quickTo(line.current, 'scaleX', { duration: 0.45, ease: 'power3.out' });
      const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const p = Math.max(0.001, self.progress);
          if (isMobile()) setX(p);
          else setY(p);
        },
      });

      SECTIONS.forEach((sec, i) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          refreshPriority: -10,
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className={s.rail} ref={root} aria-hidden="true">
      <div className={s.track}>
        <span className={s.fill} ref={line} />
      </div>
      <ul className={s.list}>
        {SECTIONS.map((sec, i) => (
          <li key={sec.id} className={`${s.item} ${i === active ? s.on : ''}`}>
            <a href={`#${sec.id}`} className={s.link} tabIndex={-1}>
              <span className={s.num}>{sec.index}</span>
              <span className={s.dash}>—</span>
              <span className={s.label}>{sec.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className={s.mobileLabel}>
        <span>{SECTIONS[active].index}</span> {SECTIONS[active].label}
      </p>
    </div>
  );
}
