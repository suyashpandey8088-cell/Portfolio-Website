'use client';

import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './Cursor.module.css';

const LABELS: Record<string, string> = {
  view: 'VIEW',
  open: 'OPEN',
  go: 'GO',
  top: 'TOP',
};

/**
 * Small dot cursor that grows into a labelled disc over interactive elements.
 * Fine-pointer devices only; fully skipped for touch + reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useIsoLayoutEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const el = dot.current!;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>(
        '[data-cursor], a, button, input, textarea'
      );
      const key = t?.dataset.cursor;
      setLabel(t ? LABELS[key ?? ''] ?? '' : '');
      el.classList.toggle(s.hot, !!t);
      el.classList.toggle(s.wide, !!(t && key && LABELS[key]));
    };
    const onLeave = () => gsap.to(el, { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to(el, { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div className={s.cursor} ref={dot} aria-hidden="true">
      <span className={s.text}>{label}</span>
    </div>
  );
}
