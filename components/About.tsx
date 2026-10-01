'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './About.module.css';

const STATES = [
  {
    k: 'LEARN',
    n: '01',
    body: "I'm an AI & Data Science student who treats learning as a daily practice — papers, docs, lectures and a lot of trial and error, turned into working intuition about how modern systems actually behave.",
  },
  {
    k: 'BUILD',
    n: '02',
    body: 'I build things end to end: data pipelines, models, APIs and the interfaces on top of them. Shipping something real is the fastest way I know to understand a problem properly.',
  },
  {
    k: 'EXPERIMENT',
    n: '03',
    body: 'LLMs, retrieval, agents, embeddings, evaluation. I run small focused experiments, measure what changed, keep what works and throw away the rest without getting attached.',
  },
  {
    k: 'CREATE',
    n: '04',
    body: 'Technology only matters when someone can feel it. I care about the last mile — motion, clarity, performance and the small details that make a product worth returning to.',
  },
];

const STATS = [
  { v: 'AI & Data Science', l: 'Field of study' },
  { v: '5', l: 'Internships' },
  { v: 'Multiple', l: 'Projects shipped' },
  { v: 'Hackathons', l: '& tech events' },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference) and (min-width: 861px)',
          mobile: '(prefers-reduced-motion: no-preference) and (max-width: 860px)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (c) => {
          const { motion, mobile } = c.conditions as Record<string, boolean>;
          const states = q('[data-state]') as HTMLElement[];

          if (!motion && !mobile) {
            gsap.set(states, { opacity: 1, y: 0, filter: 'none', position: 'relative' });
            return;
          }

          // Section-wide ambient drift, scrubbed.
          gsap.fromTo(
            q('[data-aura]'),
            { yPercent: -8, scale: 0.9, opacity: 0.35 },
            {
              yPercent: 8,
              scale: 1.15,
              opacity: 0.75,
              ease: 'none',
              scrollTrigger: {
                trigger: root.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );

          if (mobile) {
            states.forEach((el) => {
              gsap.fromTo(
                el,
                { opacity: 0.1, y: 40 },
                {
                  opacity: 1,
                  y: 0,
                  ease: 'none',
                  scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: 0.5 },
                }
              );
            });
            return;
          }

          // Desktop: one scrubbed timeline cross-fading the 4 states.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
            },
            defaults: { ease: 'none' },
          });

          const step = 1 / STATES.length;
          states.forEach((el, i) => {
            const at = i * step;
            if (i > 0) {
              tl.fromTo(
                el,
                { opacity: 0, y: 70, filter: 'blur(10px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: step * 0.45 },
                at
              );
            } else {
              tl.set(el, { opacity: 1, y: 0, filter: 'blur(0px)' }, 0);
            }
            if (i < states.length - 1) {
              tl.to(
                el,
                { opacity: 0, y: -70, filter: 'blur(10px)', duration: step * 0.45 },
                at + step * 0.55
              );
            }
          });

          // Progress ticks beside the sticky heading.
          q('[data-tick]').forEach((tick: HTMLElement, i: number) => {
            tl.to(tick, { opacity: 1, scaleX: 1, duration: step * 0.4 }, i * step);
            if (i < STATES.length - 1) {
              tl.to(tick, { opacity: 0.25, scaleX: 0.4, duration: step * 0.4 }, (i + 1) * step);
            }
          });
        }
      );
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={s.about} id="about" ref={root} aria-labelledby="about-title">
      <div className={s.aura} data-aura aria-hidden="true" />
      <div className={s.sticky}>
        <div className={s.grid}>
          <div className={s.left}>
            <p className="u-eyebrow">02 — About</p>
            <h2 className={`${s.title} section-title`} id="about-title">
              WHO
              <br />
              AM&nbsp;I?
            </h2>
            <ul className={s.ticks} aria-hidden="true">
              {STATES.map((st) => (
                <li key={st.k}>
                  <span className={s.tick} data-tick />
                  <span className={s.tickLabel}>{st.k}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.right}>
            <p className={s.lede}>
              I&apos;m an AI &amp; Data Science student passionate about building useful technology,
              experimenting with artificial intelligence, and creating digital experiences.
            </p>

            <div className={s.stage}>
              {STATES.map((st) => (
                <article className={s.state} data-state key={st.k}>
                  <p className={s.stateNum}>{st.n}</p>
                  <h3 className={s.stateKey}>{st.k}</h3>
                  <p className={s.stateBody}>{st.body}</p>
                </article>
              ))}
            </div>

            <ul className={s.stats}>
              {STATS.map((st) => (
                <li key={st.l}>
                  <span className={s.statV}>{st.v}</span>
                  <span className={s.statL}>{st.l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
