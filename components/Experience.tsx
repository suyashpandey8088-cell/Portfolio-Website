'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './Experience.module.css';

const ITEMS = [
  {
    n: 'Internship 01',
    role: 'Software Testing Intern',
    period: '2024',
    body: 'First exposure to a real engineering workflow: writing structured test cases, reproducing defects precisely and learning why reliability is a feature, not an afterthought.',
    tags: ['Manual QA', 'Test cases', 'Bug triage'],
  },
  {
    n: 'Internship 02',
    role: 'Software Testing Intern',
    period: '2025',
    body: 'Moved from finding bugs to preventing them — regression suites, edge-case hunting and tighter feedback loops with developers during active feature work.',
    tags: ['Regression', 'Automation basics', 'Reporting'],
  },
  {
    n: 'Internship 03',
    role: 'Software Testing Intern',
    period: '2025',
    body: 'Owned quality for assigned modules end to end, documented findings for the team and brought the same rigour back into my own AI and web projects.',
    tags: ['Ownership', 'Documentation', 'Quality metrics'],
  },
];

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = q('[data-exp]') as HTMLElement[];

        // The spine illuminates strictly in step with scroll: 0 -> 100%.
        gsap.fromTo(
          q('[data-spine]'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: q('[data-list]')[0],
              start: 'top 72%',
              end: 'bottom 72%',
              scrub: 0.5,
            },
          }
        );

        items.forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0.12, scale: 0.95, y: 46, filter: 'blur(6px)' },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 52%', scrub: 0.5 },
            }
          );

          // Earlier entries stay readable but recede.
          if (i < items.length - 1) {
            gsap.to(el, {
              opacity: 0.45,
              scale: 0.975,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 34%', end: 'top 2%', scrub: 0.5 },
            });
          }

          gsap.fromTo(
            el.querySelector('[data-dot]'),
            { scale: 0.4, backgroundColor: '#2a3040' },
            {
              scale: 1,
              backgroundColor: '#5b8cff',
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 60%', scrub: 0.4 },
            }
          );
        });

        gsap.fromTo(
          q('[data-expcount]'),
          { textContent: 0 },
          {
            textContent: 100,
            snap: { textContent: 1 },
            ease: 'none',
            scrollTrigger: {
              trigger: q('[data-list]')[0],
              start: 'top 72%',
              end: 'bottom 72%',
              scrub: 0.5,
            },
          }
        );
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={s.exp} id="experience" ref={root} aria-labelledby="exp-title">
      <div className={s.head}>
        <p className="u-eyebrow">05 — Experience</p>
        <h2 className={`${s.title} section-title`} id="exp-title">
          EXPERIENCE
        </h2>
        <p className={s.meta}>
          Timeline completion <span data-expcount>0</span>%
        </p>
      </div>

      <ol className={s.list} data-list>
        <span className={s.rail} aria-hidden="true">
          <span className={s.spine} data-spine />
        </span>
        {ITEMS.map((it) => (
          <li className={s.item} data-exp key={it.n}>
            <span className={s.dot} data-dot aria-hidden="true" />
            <article className={s.card}>
              <header className={s.cardHead}>
                <p className={s.n}>{it.n}</p>
                <p className={s.period}>{it.period}</p>
              </header>
              <h3 className={s.role}>{it.role}</h3>
              <p className={s.body}>{it.body}</p>
              <ul className={s.tags}>
                {it.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
