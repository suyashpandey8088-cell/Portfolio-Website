'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './HowIThink.module.css';

const WORDS = ['BUILD', 'TEST', 'LEARN', 'IMPROVE'];

export default function HowIThink() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const words = q('[data-word]') as HTMLElement[];
        const arrows = q('[data-arrow]') as HTMLElement[];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
          defaults: { ease: 'none' },
        });

        const slot = 0.2;
        words.forEach((w, i) => {
          const at = 0.06 + i * slot;
          tl.fromTo(
            w,
            { opacity: 0, yPercent: 55, scale: 0.86, filter: 'blur(12px)' },
            { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: slot * 0.55 },
            at
          );
          if (arrows[i - 1]) {
            tl.fromTo(
              arrows[i - 1],
              { opacity: 0, x: -14 },
              { opacity: 1, x: 0, duration: slot * 0.3 },
              at - slot * 0.12
            );
          }
        });

        // Final word lands -> the whole frame transforms.
        tl.to(q('[data-wash]'), { opacity: 1, duration: 0.14 }, 0.06 + 3 * slot)
          .fromTo(
            q('[data-caption]'),
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.1 },
            0.06 + 3 * slot + 0.08
          )
          .to(q('[data-words]'), { scale: 1.04, duration: 0.3 }, 0.06 + 3 * slot)
          .to(q('[data-wash]'), { opacity: 0.35, duration: 0.12 }, 0.92);

        gsap.fromTo(
          q('[data-grid]'),
          { yPercent: -6, scale: 1.04 },
          {
            yPercent: 6,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={s.think} ref={root} aria-labelledby="think-title">
      <div className={s.sticky}>
        <div className={s.grid} data-grid aria-hidden="true" />
        <div className={s.wash} data-wash aria-hidden="true" />
        <div className={s.inner}>
          <p className="u-eyebrow">How I think</p>
          <h2 className="u-sr" id="think-title">
            Build, test, learn, improve
          </h2>
          <div className={s.words} data-words>
            {WORDS.map((w, i) => (
              <span className={s.wordWrap} key={w}>
                {i > 0 && (
                  <span className={s.arrow} data-arrow aria-hidden="true">
                    →
                  </span>
                )}
                <span className={s.word} data-word>
                  {w}
                </span>
              </span>
            ))}
          </div>
          <p className={s.caption} data-caption>
            A loop, not a line. Ship something small, measure honestly, keep the parts that survive
            contact with reality — then do it again, faster.
          </p>
        </div>
      </div>
    </section>
  );
}
