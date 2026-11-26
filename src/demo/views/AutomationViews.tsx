import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  GitBranch,
  Link2,
  Play,
  ShieldAlert,
  Terminal,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { WORKFLOW_SIMULATIONS } from '@/data/identityProcessData';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

export function LifecycleView() {
  const runPocScenario = useDemoStore((s) => s.runPocScenario);

  const scenarios = [
    {
      id: 'joiner' as const,
      title: 'Scenario 1: Day-1 HRIS Joiner Auto-Onboard',
      domain: '01 · ONBOARD IDENTITY',
      desc: 'Triggers a Workday hire event, creates an identity profile, and provisions Day-1 birthright roles automatically.',
      icon: UserPlus,
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'sod' as const,
      title: 'Scenario 2: Mover SoD Conflict Remediation',
      domain: '03 · MANAGE POLICY (SoD)',
      desc: 'Detects Elena Vance holding both Finance AP-Clerk and Payment Approver after moving departments, and strips legacy risk.',
      icon: ShieldAlert,
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'orphan' as const,
      title: 'Scenario 3: Contractor Leaver + Orphan Key Cleanup',
      domain: '01 · OFF-BOARD & RECONCILE',
      desc: 'Executes immediate off-boarding for Mark Wilson and severs his orphaned direct AWS Prod Vault access key.',
      icon: UserMinus,
      accent: 'text-rose-600 bg-rose-50',
    },
    {
      id: 'ai-agent' as const,
      title: 'Scenario 4: Shadow AI Agent Containment',
      domain: '06 · NON-HUMAN GOVERNANCE',
      desc: 'Contains agent.release-copilot after an out-of-band Snowflake PII grant and enforces least-privilege scope.',
      icon: Bot,
      accent: 'text-[#0284C7] bg-sky-50',
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
          Lifecycle Orchestration &amp; Live Scenarios
        </h1>
        <p className="text-sm text-slate-500">
          Launch interactive Identity Process++ proof-of-concept scenarios and watch IDENTRA update identities, policies, and audit logs live.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          return (
            <div
              key={sc.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', sc.accent)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-mono text-[10px] font-semibold text-slate-400">
                      {sc.domain}
                    </div>
                    <h3 className="font-heading text-sm font-bold text-[#0F172A]">{sc.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">{sc.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => runPocScenario(sc.id)}
                className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0EA5E9]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Live Scenario</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkflowsView() {
  const customWorkflows = useDemoStore((s) => s.customWorkflows);
  const schemaObjects = useDemoStore((s) => s.schemaObjects);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);
  const [selectedId, setSelectedId] = useState(WORKFLOW_SIMULATIONS[0].id);
  const [runCount, setRunCount] = useState(1);

  const current =
    WORKFLOW_SIMULATIONS.find((w) => w.id === selectedId) ?? WORKFLOW_SIMULATIONS[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
          Process++ Workflow Studio
        </h1>
        <p className="text-sm text-slate-500">
          Inspect and execute declarative Identity Process++ automation blueprints.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {WORKFLOW_SIMULATIONS.map((wf) => (
          <button
            key={wf.id}
            type="button"
            onClick={() => setSelectedId(wf.id)}
            className={cn(
              'cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-all',
              selectedId === wf.id
                ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            )}
          >
            {wf.title}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#F8FBFF] px-5 py-3.5">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Terminal className="h-4 w-4 text-[#0284C7]" />
            <span className="font-semibold text-[#0F172A]">{current.filename}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">{current.triggerLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => setRunCount((c) => c + 1)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0F172A] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0EA5E9]"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Execute Trace</span>
          </button>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          <div className="p-5 lg:col-span-6">
            <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 font-mono text-xs leading-relaxed text-slate-800">
              <code>{current.code}</code>
            </pre>
          </div>
          <div className="space-y-2.5 p-5 lg:col-span-6">
            <div className="flex items-center justify-between font-mono text-[10px] font-semibold text-slate-400 uppercase">
              <span>Deterministic Trace</span>
              <span className="text-emerald-600">RUN #{runCount}</span>
            </div>
            {current.trace.map((step, i) => (
              <motion.div
                key={`${current.id}-${runCount}-${step.step}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-slate-200/80 bg-[#FBFDFF] p-3"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-[#0F172A]">
                    {step.step} · {step.process}
                  </span>
                  <span className="text-[#0284C7]">{step.latency}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Reference-Object Workflows Configured in Platform Configuration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
              <GitBranch className="h-4 w-4 text-[#0EA5E9]" />
              <span>Custom Reference-Object Workflows ({customWorkflows.length})</span>
            </div>
            <p className="text-xs text-slate-500">
              Admin-defined workflows resolving Identity Reference properties across Core and Custom Objects.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('configuration')}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-[#0284C7] hover:bg-sky-100"
          >
            <span>Configure in Schema &amp; Workflow Studio</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3.5 space-y-2.5">
          {customWorkflows.map((wf) => {
            const srcObj = schemaObjects.find((o) => o.id === wf.sourceObjectId);
            return (
              <div
                key={wf.id}
                className="rounded-xl border border-slate-200/80 bg-[#FBFDFF] p-3.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                      {wf.code}
                    </span>
                    <span className="font-semibold text-[#0F172A]">{wf.name}</span>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] text-[#0284C7]">
                      {srcObj?.name ?? wf.sourceObjectId} · {wf.triggerEvent}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                      wf.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    )}
                  >
                    {wf.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {wf.stages.map((st, idx) => (
                    <div key={st.id} className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-700">
                        <Link2 className="h-2.5 w-2.5 text-[#0EA5E9]" />
                        <span>
                          {st.stepOrder}. {st.name} ({st.referenceObjectPath})
                        </span>
                      </span>
                      {idx < wf.stages.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-slate-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AuditLogView() {
  const auditLog = useDemoStore((s) => s.auditLog);
  const searchQuery = useDemoStore((s) => s.searchQuery);

  const filtered = auditLog.filter(
    (entry) =>
      !searchQuery.trim() ||
      `${entry.actor} ${entry.processTag} ${entry.action} ${entry.target}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
          Immutable Audit Log
        </h1>
        <p className="text-sm text-slate-500">
          Live cryptographic record of every Identity Process++ event triggered during your demo session.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="divide-y divide-slate-100">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col justify-between gap-2 px-5 py-3.5 text-xs sm:flex-row sm:items-center"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[11px] text-slate-400">{entry.time}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                    entry.tone === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700'
                      : entry.tone === 'rose'
                        ? 'bg-rose-50 text-rose-600'
                        : entry.tone === 'amber'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-sky-50 text-[#0284C7]'
                  )}
                >
                  {entry.processTag}
                </span>
                <span className="font-semibold text-[#0F172A]">{entry.target}</span>
                <span className="text-slate-600">— {entry.action}</span>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-slate-400">
                {entry.actor}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
