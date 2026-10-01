'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './Hero.module.css';

/**
 * Three scroll stages inside one sticky viewport:
 *  1. the name shrinks / tracks out / dims, subtitle lifts, radial glow blooms
 *  2. hero text recedes behind an emerging orb (0.5 -> 1 -> 1.5, de-blurring)
 *  3. the orb opens up and hands over to About — no hard cut
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 861px)',
          mobile: '(max-width: 860px)',
        },
        (c) => {
          const { motion, mobile } = c.conditions as Record<string, boolean>;
          if (!motion) {
            gsap.set(q('[data-orb]'), { opacity: 0.5, scale: 1, filter: 'blur(0px)' });
            gsap.set(q('[data-glow]'), { opacity: 0.8 });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
            },
            defaults: { ease: 'none' },
          });

          // ---- Stage 1 : the name recedes -------------------------------
          tl.fromTo(
            // The name holds its exact size and tracking all the way through;
            // only its opacity moves, so it never reflows or shortens.
            q('[data-name]'),
            { opacity: 1 },
            { opacity: 0.35, duration: 0.4 },
            0
          )
            .fromTo(
              // small drift only: the name keeps its full size now, so a big
              // upward move would run the subtitle straight into it
              q('[data-sub]'),
              { y: 0, opacity: 1 },
              { y: mobile ? -8 : -12, opacity: 0, duration: 0.26 },
              0
            )
            .fromTo(
              q('[data-desc]'),
              { y: 0, opacity: 1 },
              { y: -40, opacity: 0, duration: 0.26 },
              0
            )
            .fromTo(q('[data-cue]'), { opacity: 1, y: 0 }, { opacity: 0, y: 24, duration: 0.14 }, 0)
            .fromTo(
              q('[data-glow]'),
              { opacity: 0, scale: 0.6 },
              { opacity: 1, scale: 1.15, duration: 0.5 },
              0
            )

            // ---- Stage 2 : the object emerges from behind ---------------
            .fromTo(
              q('[data-orb]'),
              { scale: 0.5, rotate: 0, opacity: 0, filter: 'blur(42px)' },
              { scale: 1, rotate: 70, opacity: 1, filter: 'blur(0px)', duration: 0.42 },
              0.28
            )
            .to(q('[data-content]'), { opacity: 0.12, duration: 0.3 }, 0.34)
            .to(q('[data-orb]'), { scale: 1.5, rotate: 150, duration: 0.3 }, 0.7)
            .to(q('[data-ring]'), { rotate: -120, duration: 1 }, 0)

            // ---- Stage 3 : dissolve forward into About ------------------
            // Stage 3 never empties the frame: the orb stays as the carrier
            // element and the natural sticky release hands it to About.
            .to(q('[data-orb]'), { scale: 2.1, opacity: 0.55, filter: 'blur(6px)', duration: 0.22 }, 0.78)
            .to(q('[data-glow]'), { opacity: 0.7, scale: 1.7, duration: 0.22 }, 0.78)
            .to(q('[data-content]'), { opacity: 0, duration: 0.12 }, 0.72);
        }
      );
      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className={s.hero} id="intro" ref={root} aria-label="Introduction">
      <div className={s.sticky}>
        <div className={s.glow} data-glow aria-hidden="true" />

        <div className={s.orbWrap} data-orb aria-hidden="true">
          <div className={s.orbCore} />
          <svg className={s.orbRings} viewBox="0 0 400 400" data-ring>
            <defs>
              <linearGradient id="ringA" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5b8cff" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#8f6bff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#5b8cff" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="178" fill="none" stroke="url(#ringA)" strokeWidth="1" />
            <circle
              cx="200"
              cy="200"
              r="140"
              fill="none"
              stroke="url(#ringA)"
              strokeWidth="1"
              strokeDasharray="6 14"
            />
            <circle
              cx="200"
              cy="200"
              r="104"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="200"
              r="178"
              fill="none"
              stroke="#5b8cff"
              strokeWidth="2"
              strokeDasharray="90 1030"
              strokeLinecap="round"
            />
            <g stroke="rgba(255,255,255,0.14)" strokeWidth="1">
              <line x1="200" y1="22" x2="200" y2="378" />
              <line x1="22" y1="200" x2="378" y2="200" />
            </g>
          </svg>
        </div>

        <div className={s.content} data-content>
          <p className="u-eyebrow" data-cue-top>
            Portfolio — 2026
          </p>
          <h1 className={s.name} data-name>
            SUYASH PANDEY
          </h1>
          <p className={s.sub} data-sub>
            AI &amp; Data Science Student <span>•</span> Developer <span>•</span> Builder
          </p>
          <p className={s.desc} data-desc>
            I build intelligent digital experiences by combining AI, technology, design, and
            experimentation.
          </p>
          <a className={s.cue} href="#about" data-cue data-cursor="go">
            <span>SCROLL TO EXPLORE</span>
            <span className={s.arrow} aria-hidden="true">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
