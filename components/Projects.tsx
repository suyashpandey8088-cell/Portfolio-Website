'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import { PROJECTS } from '@/lib/projects';
import s from './Projects.module.css';

/**
 * Desktop: the section pins and vertical scroll is translated 1:1 into
 * horizontal travel of the track (never a manually scrollable carousel).
 * Per-card scale / blur / opacity / lift are derived from each card's distance
 * to the viewport centre, computed from cached geometry (no per-frame reflow).
 * The run ends with the last card unfolding into a full-screen detail panel.
 */
export default function Projects() {
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
          const cards = q('[data-pcard]') as HTMLElement[];

          if (!desktop && !mobile) return;

          if (mobile) {
            cards.forEach((card) => {
              gsap.fromTo(
                card,
                { opacity: 0, y: 48, scale: 0.96 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  ease: 'power3.out',
                  duration: 0.7,
                  scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                }
              );
            });
            gsap.fromTo(
              q('[data-detail]'),
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                scrollTrigger: { trigger: q('[data-detail]'), start: 'top 85%', once: true },
              }
            );
            return;
          }

          // ---------------- desktop pinned horizontal run ----------------
          const pin = q('[data-pin]')[0] as HTMLElement;
          const track = q('[data-track]')[0] as HTMLElement;
          const detail = q('[data-detail]')[0] as HTMLElement;
          const bar = q('[data-pbar]')[0] as HTMLElement;
          const counter = q('[data-counter]')[0] as HTMLElement;

          const geo: { c: number; w: number }[] = [];
          let travel = 0;
          // clip-path matching the last card's on-screen box, so the detail
          // panel literally unfolds *from* that card instead of fading in.
          let seedClip = 'inset(26% 33% 26% 33% round 28px)';

          /** Offset of `el` relative to the pinned container, across offsetParents. */
          const topWithin = (el: HTMLElement, stop: HTMLElement) => {
            let y = 0;
            let node: HTMLElement | null = el;
            while (node && node !== stop) {
              y += node.offsetTop;
              node = node.offsetParent as HTMLElement | null;
            }
            return y;
          };

          const measure = () => {
            geo.length = 0;
            cards.forEach((card) =>
              geo.push({ c: card.offsetLeft + card.offsetWidth / 2, w: card.offsetWidth })
            );

            const lastCard = cards[cards.length - 1];
            // Travel exactly far enough to centre the last card (scrollWidth
            // drops the track's trailing padding, so never trust it here).
            travel = Math.max(
              0,
              lastCard.offsetLeft + lastCard.offsetWidth / 2 - window.innerWidth / 2
            );

            const pinH = pin.offsetHeight || window.innerHeight;
            const pinW = pin.offsetWidth || window.innerWidth;
            const cardTop = topWithin(lastCard, pin);
            const top = (cardTop / pinH) * 100;
            const bottom = ((pinH - cardTop - lastCard.offsetHeight) / pinH) * 100;
            const side = (((pinW - lastCard.offsetWidth) / 2) / pinW) * 100;
            seedClip = `inset(${top.toFixed(2)}% ${side.toFixed(2)}% ${Math.max(
              0,
              bottom
            ).toFixed(2)}% ${side.toFixed(2)}% round 28px)`;
          };
          measure();

          // One batched css setter per card: no per-frame reads, no layout.
          const setters = cards.map((card) => ({
            set: gsap.quickSetter(card, 'css') as (vars: Record<string, unknown>) => void,
            el: card,
            lastFocus: false,
          }));

          const paint = (x: number) => {
            const mid = window.innerWidth / 2;
            for (let i = 0; i < setters.length; i++) {
              const g = geo[i];
              if (!g) continue;
              const d = Math.min(1, Math.abs(g.c + x - mid) / (g.w * 1.15));
              const e = d * d * (3 - 2 * d); // smoothstep
              setters[i].set({
                scale: 1 - 0.15 * e,
                y: 28 * e,
                opacity: 1 - 0.55 * e,
                // quantised: a new blur radius forces a re-raster, so step it
                filter: e < 0.08 ? 'none' : `blur(${(Math.round(e * 6) / 2).toFixed(1)}px)`,
              });
              const focused = e < 0.25;
              if (focused !== setters[i].lastFocus) {
                setters[i].lastFocus = focused;
                setters[i].el.classList.toggle(s.focused, focused);
              }
            }
          };

          const detailRun = window.innerHeight * 1.25;

          const st = ScrollTrigger.create({
            trigger: root.current,
            start: 'top top',
            end: () => `+=${travel + detailRun}`,
            pin: pin,
            pinSpacing: true,
            anticipatePin: 1,
            refreshPriority: 10,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: measure,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${travel + detailRun}`,
              scrub: 0.5,
              invalidateOnRefresh: true,
              refreshPriority: 9,
            },
            defaults: { ease: 'none' },
          });

          const ratio = () => travel / (travel + detailRun);

          // 1 — horizontal travel driven strictly by scroll
          tl.fromTo(
            track,
            { x: 0 },
            {
              x: () => -travel,
              duration: ratio(),
              onUpdate: () => paint(Number(gsap.getProperty(track, 'x'))),
            },
            0
          )
            .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: ratio() }, 0)

            // 2 — the final card unfolds into a full-screen project page
            .fromTo(
              detail,
              { clipPath: () => seedClip, pointerEvents: 'none' },
              {
                clipPath: 'inset(0% 0% 0% 0% round 0px)',
                pointerEvents: 'auto',
                duration: (1 - ratio()) * 0.7,
              },
              ratio()
            )
            // solid immediately: it is the card, not a cross-fade
            .fromTo(detail, { opacity: 0 }, { opacity: 1, duration: (1 - ratio()) * 0.12 }, ratio())
            .fromTo(
              q('[data-dimg]'),
              { scale: 1.35, opacity: 0.35 },
              { scale: 1, opacity: 1, duration: (1 - ratio()) * 0.7 },
              ratio()
            )
            .to(track, { opacity: 0.12, filter: 'blur(10px)', duration: (1 - ratio()) * 0.5 }, ratio())
            .to(q('[data-phead]'), { opacity: 0, y: -30, duration: (1 - ratio()) * 0.35 }, ratio())
            .fromTo(
              q('[data-dline]'),
              { opacity: 0, y: 34 },
              { opacity: 1, y: 0, stagger: (1 - ratio()) * 0.06, duration: (1 - ratio()) * 0.3 },
              ratio() + (1 - ratio()) * 0.35
            );

          // live counter, tied to horizontal progress
          const stCounter = ScrollTrigger.create({
            trigger: root.current,
            start: 'top top',
            end: () => `+=${travel + detailRun}`,
            refreshPriority: 9,
            onUpdate: (sfl) => {
              const p = Math.min(1, sfl.progress / ratio());
              const i = Math.min(PROJECTS.length, Math.round(p * (PROJECTS.length - 1)) + 1);
              const next = String(i).padStart(2, '0');
              if (counter.textContent !== next) counter.textContent = next;
            },
          });

          paint(0);
          return () => {
            st.kill();
            stCounter.kill();
          };
        }
      );
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  const last = PROJECTS[PROJECTS.length - 1];

  return (
    <section className={s.projects} id="projects" ref={root} aria-labelledby="projects-title">
      <div className={s.pin} data-pin>
        <header className={s.head} data-phead>
          <div>
            <p className="u-eyebrow">04 — Work</p>
            <h2 className={`${s.title} section-title`} id="projects-title">
              SELECTED PROJECTS
            </h2>
          </div>
          <div className={s.meter}>
            <span className={s.counter} data-counter>
              01
            </span>
            <span className={s.counterTotal}>/ {String(PROJECTS.length).padStart(2, '0')}</span>
            <span className={s.barTrack}>
              <span className={s.bar} data-pbar />
            </span>
          </div>
        </header>

        <div className={s.viewport}>
          <ul className={s.track} data-track>
            {PROJECTS.map((p) => (
              <li className={s.card} data-pcard key={p.n}>
                <article className={s.cardInner}>
                  <div className={s.media}>
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 860px) 92vw, 46vw"
                      className={s.img}
                      priority={p.n === '01'}
                    />
                    <span className={s.mediaGlow} style={{ background: p.accent }} aria-hidden="true" />
                  </div>
                  <div className={s.body}>
                    <p className={s.num} style={{ color: p.accent }}>
                      PROJECT {p.n}
                    </p>
                    <h3 className={s.cardTitle}>{p.title}</h3>
                    <p className={s.blurb}>{p.blurb}</p>
                    <ul className={s.stack}>
                      {p.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {/* final card -> full screen project page */}
        <div className={s.detail} data-detail aria-hidden="false">
          <div className={s.detailMedia} data-dimg>
            <Image src={last.image} alt={last.alt} fill sizes="100vw" className={s.img} />
          </div>
          <div className={s.detailBody}>
            <p className="u-eyebrow" data-dline>
              Project {last.n} — Case study
            </p>
            <h3 className={s.detailTitle} data-dline>
              {last.title}
            </h3>
            <p className={s.detailText} data-dline>
              An interactive web experience built around scroll-driven storytelling: a single
              timeline maps user input to motion, so every transition is something the visitor
              performs rather than watches.
            </p>
            <ul className={s.detailFacts} data-dline>
              <li>
                <span>Role</span>Design &amp; Front-end
              </li>
              <li>
                <span>Stack</span>Next.js · TypeScript · GSAP
              </li>
              <li>
                <span>Focus</span>Motion · Performance · A11y
              </li>
            </ul>
            <a className={s.detailCta} href="#experience" data-dline data-cursor="open">
              Continue the story
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
