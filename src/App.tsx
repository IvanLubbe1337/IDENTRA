import { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { OperationsShowcaseSection } from '@/components/OperationsShowcaseSection';
import { ProcessPillarsSection } from '@/components/ProcessPillarsSection';
import { PolicySimulatorSection } from '@/components/PolicySimulatorSection';
import { MaturityAndFooterSection } from '@/components/MaturityAndFooterSection';
import { EarlyAccessModal } from '@/components/EarlyAccessModal';
import { Tooltip } from '@/components/ui/Primitives';
import { DemoLayout } from '@/demo/DemoLayout';
import { useSceneStore } from '@/store/useSceneStore';

export default function App() {
  const currentPage = useSceneStore((s) => s.currentPage);
  const setCurrentPage = useSceneStore((s) => s.setCurrentPage);

  // Sync browser back/forward and #demo deep links
  useEffect(() => {
    const syncFromHash = () => {
      const next = window.location.hash === '#demo' ? 'demo' : 'landing';
      useSceneStore.setState({ currentPage: next });
    };
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [setCurrentPage]);

  // Smooth inertial scrolling on Landing Page only (standard crisp scroll inside Demo console)
  useEffect(() => {
    if (currentPage !== 'landing') return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [currentPage]);

  if (currentPage === 'demo') {
    return (
      <Tooltip.Provider delayDuration={180}>
        <DemoLayout />
      </Tooltip.Provider>
    );
  }

  return (
    <Tooltip.Provider delayDuration={180}>
      <div className="min-h-screen bg-white text-[#0F172A]">
        <Navbar />
        <main>
          <HeroSection />
          <OperationsShowcaseSection />
          <ProcessPillarsSection />
          <PolicySimulatorSection />
          <MaturityAndFooterSection />
        </main>
        <EarlyAccessModal />
      </div>
    </Tooltip.Provider>
  );
}
