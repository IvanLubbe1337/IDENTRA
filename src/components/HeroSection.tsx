import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ECOSYSTEM_NODES } from '@/data/identityProcessData';
import { EcosystemCanvas3D } from '@/scene/EcosystemCanvas3D';
import { SectionEyebrow } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';

export function HeroSection() {
  const activeNodeId = useSceneStore((s) => s.activeEcosystemNode);
  const setEarlyAccessOpen = useSceneStore((s) => s.setEarlyAccessOpen);

  const selectedNode =
    ECOSYSTEM_NODES.find((n) => n.id === activeNodeId) ?? null;

  const scrollToConsole = () => {
    const el = document.getElementById('console');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      {/* Subtle dotted wave contour accent in upper right (inspired by reference) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 right-0 h-[460px] w-[720px] opacity-60"
        viewBox="0 0 720 460"
        fill="none"
      >
        {[0, 1, 2, 3, 4].map((row) => (
          <path
            key={row}
            d={`M-40 ${90 + row * 38} C 180 ${30 + row * 28}, 410 ${190 + row * 24}, 760 ${70 + row * 34}`}
            stroke="#0EA5E9"
            strokeOpacity={0.22 - row * 0.03}
            strokeWidth="1.25"
            strokeDasharray="3 7"
            className="animate-dash-flow"
          />
        ))}
      </svg>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-12">
        {/* Left Editorial Column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <SectionEyebrow
            index="01"
            label="Built on Identity Process++"
          />

          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] text-[#0F172A] sm:text-5xl lg:text-[3.35rem]">
            Unified Identity Governance,{' '}
            <span className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#2563EB] bg-clip-text text-transparent">
              Clear by Design.
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            A unified view of identity, access, and governance across your
            organization. Built natively on the{' '}
            <span className="font-semibold text-slate-900">Identity Process++</span>{' '}
            framework to automate Joiner-Mover-Leaver lifecycles, business roles,
            access reviews, and non-human identities.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToConsole}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0F172A] px-6 py-3.5 font-heading text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-[#0EA5E9]"
            >
              <span>Explore Live Operations</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setEarlyAccessOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 font-heading text-sm font-semibold text-slate-700 transition-all hover:border-[#0EA5E9] hover:text-[#0284C7]"
            >
              <Sparkles className="h-4 w-4 text-[#0EA5E9]" />
              <span>Request Early Access</span>
            </button>
          </div>

          {/* Dynamic Clarity Card synced to clicking nodes in the 3D Ecosystem */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="studio-card-elevated rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-[#0284C7] uppercase">
                      {selectedNode.pillarLabel}
                    </span>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0369A1]">
                      {selectedNode.count} Active
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-heading text-base font-bold text-[#0F172A]">
                    {selectedNode.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {selectedNode.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedNode.processSteps.map((step) => (
                      <span
                        key={step}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#0EA5E9]" />
                        {step}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="core-summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-4"
                >
                  <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    Interactive 3D Hub
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Click <strong className="text-slate-900">People</strong>,{' '}
                    <strong className="text-slate-900">Service Accounts</strong>,{' '}
                    <strong className="text-slate-900">Entitlements</strong>,{' '}
                    <strong className="text-slate-900">Roles</strong>, or{' '}
                    <strong className="text-slate-900">Applications</strong> in
                    the 3D ecosystem to see how IDENTRA governs each layer via
                    Identity Process++.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right 7 Columns: Dedicated Clean 3D Dotted-Ring Ecosystem Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <EcosystemCanvas3D />
        </motion.div>
      </div>
    </section>
  );
}
