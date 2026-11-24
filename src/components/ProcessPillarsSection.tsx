import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  PROCESS_PILLARS,
  type ProcessPillarId,
} from '@/data/identityProcessData';
import { ProcessWheelCanvas3D } from '@/scene/ProcessWheelCanvas3D';
import { SectionEyebrow, Tabs } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/cn';

export function ProcessPillarsSection() {
  const activePillarId = useSceneStore((s) => s.activePillarId);
  const setActivePillarId = useSceneStore((s) => s.setActivePillarId);

  return (
    <section id="pillars" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <SectionEyebrow index="03" label="The 6 Domains of Identity Process++" />
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] sm:text-4xl">
            A Clear, Proven Framework—Automated End to End.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Select any of the 6 Identity Process++ domains below—or click a
            station directly on the 3D dotted wheel—to see the exact workflow,
            controls, and outcomes IDENTRA delivers out of the box.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left 5 Columns: Crisp 3D Dotted-Ring Process++ Wheel */}
          <div className="lg:col-span-5">
            <ProcessWheelCanvas3D />
          </div>

          {/* Right 7 Columns: Crystal-Clear 6-Domain Radix Tabs */}
          <div className="lg:col-span-7">
            <Tabs.Root
              value={activePillarId}
              onValueChange={(val) => setActivePillarId(val as ProcessPillarId)}
            >
              <Tabs.List
                aria-label="Identity Process++ 6 Core Domains"
                className="grid grid-cols-2 gap-2 sm:grid-cols-3"
              >
                {PROCESS_PILLARS.map((pillar) => {
                  const isActive = pillar.id === activePillarId;
                  return (
                    <Tabs.Trigger
                      key={pillar.id}
                      value={pillar.id}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2.5 text-left font-heading text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]',
                        isActive
                          ? 'border-[#0EA5E9] bg-sky-50/90 text-[#0F172A] shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-[#0F172A]'
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: pillar.accent }}
                        />
                        <span className="truncate">{pillar.shortTitle}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {pillar.index}
                      </span>
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>

              {PROCESS_PILLARS.map((pillar) => (
                <Tabs.Content
                  key={pillar.id}
                  value={pillar.id}
                  className="mt-5 focus:outline-none"
                >
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="studio-card rounded-3xl p-6 sm:p-7"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase">
                          <span style={{ color: pillar.accent }}>
                            STAGE {pillar.index}
                          </span>
                          <span className="text-slate-300">/</span>
                          <span className="text-slate-500">{pillar.tagline}</span>
                        </div>
                        <h3 className="mt-1.5 font-display text-2xl font-bold text-[#0F172A]">
                          {pillar.title}
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-right">
                        <div
                          className="font-display text-2xl font-extrabold"
                          style={{ color: pillar.accent }}
                        >
                          {pillar.metric.value}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 uppercase">
                          {pillar.metric.label}
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>

                    {/* Straightforward 3-Step Visual Process Flow */}
                    <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-sky-100 bg-[#F8FBFF] px-4 py-3">
                      {pillar.flowSteps.map((step, idx) => (
                        <div key={step} className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0EA5E9] font-mono text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-[#0F172A]">
                            {step}
                          </span>
                          {idx < pillar.flowSteps.length - 1 && (
                            <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 3 Canonical Sub-Processes */}
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {pillar.subProcesses.map((sp) => (
                        <div
                          key={sp.name}
                          className="rounded-2xl border border-slate-200/80 bg-white p-4"
                        >
                          <div className="flex items-center gap-1.5 font-heading text-xs font-bold text-[#0F172A]">
                            <CheckCircle2
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: pillar.accent }}
                            />
                            <span>{sp.name}</span>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                            {sp.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </div>
        </div>
      </div>
    </section>
  );
}
