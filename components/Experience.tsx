'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './Experience.module.css';

const ITEMS = [
  {
    n: 'Internship 01',
    role: 'AI Intern',
    period: 'AI / ML',
    body: 'First hands-on exposure to applied AI: preparing and cleaning data, working with models, and learning how much of the result depends on what goes in rather than the architecture on top.',
    tags: ['Machine learning', 'Data preparation', 'Experimentation'],
  },
  {
    n: 'Internship 02',
    role: 'Data Entry Intern',
    period: 'Operations',
    body: 'High-volume, high-accuracy record handling. Unglamorous, and the clearest lesson I have had in why data quality decides whether anything built on top of it can be trusted.',
    tags: ['Accuracy', 'Validation', 'Process discipline'],
  },
  {
    n: 'Internship 03',
    role: 'AI Intern',
    period: 'AI / ML',
    body: 'Back to AI with more ownership — taking tasks from problem statement to working prototype, evaluating results honestly and iterating instead of settling for the first thing that ran.',
    tags: ['Model workflows', 'Evaluation', 'Iteration'],
  },
  {
    n: 'Internship 04',
    role: 'Web Developer Intern',
    period: 'Engineering',
    body: 'Building interfaces for real users: reusable components, wiring front-ends to APIs, and caring about responsiveness and performance rather than only whether the page renders.',
    tags: ['Front-end', 'APIs', 'Responsive UI'],
  },
  {
    n: 'Internship 05',
    role: 'Solution Developer Intern',
    period: 'Product',
    body: 'Translating requirements into working software end to end — understanding the actual problem first, then choosing the simplest build that solves it and seeing it through.',
    tags: ['Problem solving', 'End-to-end delivery', 'Ownership'],
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
