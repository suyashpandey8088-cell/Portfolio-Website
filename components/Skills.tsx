'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './Skills.module.css';

const GROUPS = [
  { n: '01', title: 'Programming', items: ['Python', 'JavaScript', 'C++', 'SQL'] },
  {
    n: '02',
    title: 'AI / Data',
    items: ['Machine Learning', 'Data Science', 'LLMs', 'RAG', 'AI Agents'],
  },
  { n: '03', title: 'Development', items: ['React', 'Node.js', 'MongoDB', 'APIs'] },
  { n: '04', title: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Figma'] },
];

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(prefers-reduced-motion: no-preference) and (min-width: 861px)',
          mobile: '(prefers-reduced-motion: no-preference) and (max-width: 860px)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (c) => {
          const { desktop, mobile } = c.conditions as Record<string, boolean>;
          const groups = q('[data-group]') as HTMLElement[];

          if (!desktop && !mobile) return;

          if (mobile) {
            groups.forEach((g) => {
              const cards = g.querySelectorAll('[data-card]');
              gsap.fromTo(
                cards,
                { opacity: 0, y: 36, scale: 0.94 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  stagger: 0.06,
                  duration: 0.5,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: g, start: 'top 85%', once: true },
                }
              );
            });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.7,
            },
            defaults: { ease: 'none' },
          });

          const step = 1 / GROUPS.length;

          groups.forEach((g, gi) => {
            const at = gi * step;
            const cards = Array.from(g.querySelectorAll<HTMLElement>('[data-card]'));
            const head = g.querySelector('[data-ghead]');

            tl.fromTo(
              head,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: step * 0.18 },
              at
            );

            // Cards arrive one by one, drifting toward the viewer, then settle.
            cards.forEach((card, i) => {
              const lane = i % 2 === 0 ? 1 : -1;
              const startAt = at + step * (0.08 + i * 0.085);
              tl.fromTo(
                card,
                {
                  opacity: 0,
                  yPercent: 60 + i * 6,
                  xPercent: lane * 7,
                  scale: 0.72,
                  rotate: lane * 3.2,
                  filter: 'blur(9px)',
                },
                {
                  opacity: 1,
                  yPercent: 0,
                  xPercent: 0,
                  scale: 1,
                  rotate: 0,
                  filter: 'blur(0px)',
                  duration: step * 0.26,
                },
                startAt
              )
                // subtle differential parallax while the group is on screen
                .to(
                  card,
                  { yPercent: -4 - (i % 3) * 5, duration: step * 0.5 },
                  startAt + step * 0.26
                );
            });

            // The next category pushes this one away, toward the viewer.
            if (gi < groups.length - 1) {
              tl.to(
                g,
                {
                  opacity: 0,
                  yPercent: -14,
                  scale: 1.18,
                  filter: 'blur(14px)',
                  duration: step * 0.3,
                },
                at + step * 0.72
              );
            }
          });

          gsap.fromTo(
            q('[data-skillglow]'),
            { opacity: 0.2, scale: 0.85 },
            {
              opacity: 0.6,
              scale: 1.2,
              ease: 'none',
              scrollTrigger: {
                trigger: root.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        }
      );
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={s.skills} id="skills" ref={root} aria-labelledby="skills-title">
      <div className={s.glow} data-skillglow aria-hidden="true" />
      <div className={s.sticky}>
        <header className={s.head}>
          <p className="u-eyebrow">03 — Skills</p>
          <h2 className={`${s.title} section-title`} id="skills-title">
            WHAT I WORK WITH
          </h2>
        </header>

        <div className={s.stage}>
          {GROUPS.map((g) => (
            <div className={s.group} data-group key={g.title}>
              <div className={s.ghead} data-ghead>
                <span className={s.gnum}>{g.n}</span>
                <h3 className={s.gtitle}>{g.title}</h3>
                <span className={s.gline} aria-hidden="true" />
              </div>
              <ul className={s.cards}>
                {g.items.map((item) => (
                  <li className={s.card} data-card key={item} data-cursor="">
                    <span className={s.cardDot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
