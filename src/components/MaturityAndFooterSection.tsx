import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { IMPLEMENTATION_PHASES } from '@/data/identityProcessData';
import { IdentraMark, SectionEyebrow } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/cn';

export function MaturityAndFooterSection() {
  const [activePhase, setActivePhase] = useState(0);
  const setEarlyAccessOpen = useSceneStore((s) => s.setEarlyAccessOpen);

  return (
    <section id="blueprint" className="bg-white pt-20 pb-14 sm:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* 5-Phase Rollout Blueprint */}
        <SectionEyebrow index="05" label="Identity Process++ Rollout Roadmap" />
        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] sm:text-4xl">
            From Day-One Visibility to Continuous Governance in Weeks.
          </h2>
          <p className="max-w-md text-sm text-slate-600">
            Adopt proven Identity Process++ workflows step by step—delivering
            measurable compliance and security wins from week one.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5">
          {IMPLEMENTATION_PHASES.map((item, idx) => {
            const selected = activePhase === idx;
            return (
              <button
                key={item.phase}
                type="button"
                onClick={() => setActivePhase(idx)}
                className={cn(
                  'flex cursor-pointer flex-col justify-between rounded-2xl border p-5 text-left transition-all',
                  selected
                    ? 'studio-card-elevated border-[#0EA5E9]'
                    : 'border-slate-200 bg-white hover:border-sky-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span
                      className={cn(
                        'font-bold',
                        selected ? 'text-[#0284C7]' : 'text-slate-400'
                      )}
                    >
                      PHASE {item.phase}
                    </span>
                    <span className="text-slate-400">{item.duration}</span>
                  </div>
                  <h3 className="mt-3 font-heading text-base font-bold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.focus}
                  </p>
                </div>

                <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-3.5 text-xs text-slate-700">
                  {item.deliverables.map((del) => (
                    <div key={del} className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={cn(
                          'h-3.5 w-3.5 shrink-0',
                          selected ? 'text-[#0EA5E9]' : 'text-slate-300'
                        )}
                      />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Clean Luminous CTA Banner with Signature Dotted Concentric Motif */}
        <div className="relative mt-20 overflow-hidden rounded-3xl border border-sky-200/80 bg-gradient-to-br from-[#F0F9FF] via-white to-[#EFF6FF] px-8 py-14 text-center sm:px-14 sm:py-16">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-45"
            viewBox="0 0 420 420"
            fill="none"
          >
            <circle
              cx="210"
              cy="210"
              r="140"
              stroke="#0EA5E9"
              strokeWidth="1.2"
              strokeDasharray="2 8"
              className="animate-slow-orbit"
            />
            <circle
              cx="210"
              cy="210"
              r="185"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeDasharray="2 10"
              className="animate-slow-orbit-reverse"
            />
          </svg>

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200 bg-white shadow-sm">
              <IdentraMark className="h-8 w-8" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] sm:text-5xl">
              Bring Clarity to Every Identity in Your Organization.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Join the IDENTRA private preview and deploy best-practice Identity
              Process++ governance across people, service accounts, roles, and
              applications.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setEarlyAccessOpen(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0EA5E9] px-7 py-3.5 font-heading text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(14,165,233,0.65)] transition-all hover:bg-[#0284C7]"
              >
                <span>Request Private Preview</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Enterprise Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <IdentraMark className="h-5 w-5" />
            <span className="font-display font-extrabold tracking-[0.16em] text-[#0F172A]">
              IDENTRA
            </span>
            <span className="text-slate-300">|</span>
            <span>Identity Process++ Platform</span>
          </div>
          <div className="flex items-center gap-5 font-mono text-[11px]">
            <span>SOX · ISO 27001 · GDPR</span>
            <span className="text-slate-300">|</span>
            <span>© {new Date().getFullYear()} IDENTRA</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
