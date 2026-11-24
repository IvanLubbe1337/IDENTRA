import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Terminal } from 'lucide-react';
import { WORKFLOW_SIMULATIONS } from '@/data/identityProcessData';
import { SectionEyebrow, Tabs } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/cn';

export function PolicySimulatorSection() {
  const [selectedId, setSelectedId] = useState(WORKFLOW_SIMULATIONS[0].id);
  const [runCount, setRunCount] = useState(1);

  const setActivePillarId = useSceneStore((s) => s.setActivePillarId);
  const triggerPulse = useSceneStore((s) => s.triggerPulse);

  const current =
    WORKFLOW_SIMULATIONS.find((w) => w.id === selectedId) ?? WORKFLOW_SIMULATIONS[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const wf = WORKFLOW_SIMULATIONS.find((w) => w.id === id);
    if (wf) setActivePillarId(wf.pillar);
  };

  const handleExecute = () => {
    setRunCount((c) => c + 1);
    setActivePillarId(current.pillar);
    triggerPulse();
  };

  return (
    <section
      id="workflows"
      className="border-y border-slate-200/80 bg-[#F8FAFC] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <SectionEyebrow index="04" label="Automated Process++ Workflows" />
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] sm:text-4xl">
            Readable Policies. Deterministic Audit Trails.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Every Identity Process++ rule runs transparently and logs every
            decision with sub-second latency. Click{' '}
            <strong className="text-slate-900">Run Workflow</strong> to watch
            each step execute.
          </p>
        </div>

        <Tabs.Root
          value={selectedId}
          onValueChange={handleSelect}
          className="mt-8"
        >
          <Tabs.List
            aria-label="Identity Process++ Workflows"
            className="flex flex-wrap gap-2"
          >
            {WORKFLOW_SIMULATIONS.map((wf) => (
              <Tabs.Trigger
                key={wf.id}
                value={wf.id}
                className={cn(
                  'cursor-pointer rounded-full border px-4 py-2 font-heading text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]',
                  selectedId === wf.id
                    ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-[#0F172A]'
                )}
              >
                {wf.title}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {WORKFLOW_SIMULATIONS.map((wf) => (
            <Tabs.Content
              key={wf.id}
              value={wf.id}
              className="mt-6 focus:outline-none"
            >
              <div className="studio-card overflow-hidden rounded-3xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#F8FBFF] px-6 py-4">
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <Terminal className="h-4 w-4 text-[#0284C7]" />
                    <span className="font-semibold text-[#0F172A]">{wf.filename}</span>
                    <span className="hidden text-slate-300 sm:inline">|</span>
                    <span className="hidden text-slate-500 sm:inline">
                      {wf.triggerLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecute}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0F172A] px-4 py-2 font-heading text-xs font-semibold text-white transition-all hover:bg-[#0EA5E9]"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Run Workflow</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                  <div className="overflow-x-auto bg-white p-6 lg:col-span-6">
                    <div className="mb-3 font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Declarative Rule
                    </div>
                    <pre className="rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-5 font-mono text-[12px] leading-relaxed text-slate-800">
                      <code>{wf.code}</code>
                    </pre>
                  </div>

                  <div className="bg-white p-6 lg:col-span-6">
                    <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-wider uppercase">
                      <span className="text-slate-400">Live Execution Trace</span>
                      <span className="text-emerald-600">RUN #{runCount} · VERIFIED</span>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {wf.trace.map((step, i) => (
                        <motion.div
                          key={`${wf.id}-${runCount}-${step.step}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.09, duration: 0.26 }}
                          className="rounded-2xl border border-slate-200/80 bg-[#FBFDFF] p-3.5"
                        >
                          <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">{step.step}</span>
                              <span className="font-semibold text-[#0F172A]">
                                {step.process}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">{step.latency}</span>
                              <span
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-[9px] font-bold',
                                  step.outcome === 'BLOCK'
                                    ? 'bg-rose-50 text-rose-600'
                                    : step.outcome === 'REVOKE'
                                      ? 'bg-amber-50 text-amber-700'
                                      : step.outcome === 'ATTEST'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-sky-50 text-[#0284C7]'
                                )}
                              >
                                {step.outcome}
                              </span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{step.detail}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}
