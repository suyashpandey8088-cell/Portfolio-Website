import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import HowIThink from '@/components/HowIThink';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import ProgressRail from '@/components/ProgressRail';

// Cursor is desktop-only chrome: keep it out of the critical bundle.
const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false });

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <ProgressRail />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <HowIThink />
        <Contact />
      </main>
      <Footer />
      <div className="vignette" aria-hidden="true" />
      <div className="atmosphere" aria-hidden="true" />
    </>
  );
}
