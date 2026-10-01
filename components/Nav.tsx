'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import { SECTIONS } from '@/lib/sections';
import s from './Nav.module.css';

const ITEMS = SECTIONS.filter((x) => x.nav);

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const [condensed, setCondensed] = useState(false);
  const [active, setActive] = useState<string>('');

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80',
        end: 'max',
        onToggle: (self) => setCondensed(self.isActive),
      });

      ITEMS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          refreshPriority: -10,
          onToggle: (self) => self.isActive && setActive(sec.id),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <header className={`${s.nav} ${condensed ? s.small : ''}`} ref={root}>
      <a className={s.mark} href="#intro" data-cursor="top">
        SP<span>.</span>
      </a>
      <nav aria-label="Primary">
        <ul className={s.list}>
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${s.link} ${active === item.id ? s.on : ''}`}
                aria-current={active === item.id ? 'true' : undefined}
                data-cursor="go"
              >
                {item.nav}
                <span className={s.ul} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
