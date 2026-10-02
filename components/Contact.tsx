'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsoLayoutEffect } from '@/lib/useIsoLayoutEffect';
import s from './Contact.module.css';

const LINKS = [
  { label: 'Email', href: 'mailto:suyashpandey8088@gmail.com', handle: 'suyashpandey8088@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', handle: '/in/suyashpandey' },
  { label: 'GitHub', href: 'https://github.com/suyashpandey8088-cell', handle: '@suyashpandey8088-cell' },
  { label: 'Instagram', href: 'https://instagram.com/suyash_s_pandey', handle: '@suyash_s_pandey' },
];

const HEADING = ["LET'S", 'BUILD', 'SOMETHING.'];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The world gets lighter as the journey resolves.
        gsap.fromTo(
          q('[data-lift]'),
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'center center',
              scrub: 0.7,
            },
          }
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 78%',
            end: 'center 54%',
            scrub: 0.6,
          },
          defaults: { ease: 'none' },
        });

        tl.fromTo(q('[data-ctawrap]'), { scale: 0.8 }, { scale: 1, duration: 1 }, 0)
          .fromTo(
            q('[data-ctaword]'),
            { opacity: 0, yPercent: 60, filter: 'blur(10px)' },
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.12, duration: 0.42 },
            0
          )
          .fromTo(q('[data-ctasub]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 0.5)
          .fromTo(
            q('[data-ctabtn]'),
            { opacity: 0, y: 56 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.62
          )
          .fromTo(
            q('[data-ctalink]'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.07, duration: 0.26 },
            0.76
          );
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={s.contact} id="contact" ref={root} aria-labelledby="contact-title">
      <div className={s.lift} data-lift aria-hidden="true" />
      <div className={s.inner}>
        <p className="u-eyebrow">06 — Contact</p>
        <div className={s.ctawrap} data-ctawrap>
          <h2 className={s.title} id="contact-title">
            {HEADING.map((w) => (
              <span className={s.wordMask} key={w}>
                <span className={s.word} data-ctaword>
                  {w}
                </span>
              </span>
            ))}
          </h2>
        </div>
        <p className={s.sub} data-ctasub>
          Have an idea, project, or challenge?
        </p>
        <a className={s.btn} href="mailto:suyashpandey8088@gmail.com" data-ctabtn data-cursor="open">
          <span>START A CONVERSATION</span>
          <span className={s.arrow} aria-hidden="true">
            →
          </span>
        </a>
        <ul className={s.links}>
          {LINKS.map((l) => (
            <li key={l.label} data-ctalink>
              <a
                href={l.href}
                className={s.link}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                data-cursor="open"
              >
                <span className={s.linkLabel}>{l.label}</span>
                <span className={s.linkHandle}>{l.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
