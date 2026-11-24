import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowUpRight,
  Bot,
  Box,
  CheckCircle2,
  Clock,
  Info,
  KeyRound,
  LayoutGrid,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { INITIAL_ATTENTION_ITEMS } from '@/data/identityProcessData';
import type { DemoSectionId } from '@/data/demoSampleData';
import { IdentraMark } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

function Sparkline({ color, path }: { color: string; path: string }) {
  return (
    <svg viewBox="0 0 88 28" className="h-7 w-20 overflow-visible" aria-hidden="true">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </svg>
  );
}

function InteractiveEcosystemPanel() {
  const setActiveSection = useDemoStore((s) => s.setActiveSection);
  const peopleCount = useDemoStore((s) => 6726 + s.people.length);
  const nhCount = useDemoStore((s) => 1098 + s.nonHumans.length);
  const driftCount = useDemoStore(
    (s) => s.entitlements.filter((e) => e.status === 'Drift').length
  );

  const nodes: {
    id: DemoSectionId;
    label: string;
    count: string;
    icon: typeof Users;
    pos: string;
  }[] = [
    { id: 'people', label: 'People', count: peopleCount.toLocaleString(), icon: Users, pos: 'top-3 left-3 sm:left-5' },
    { id: 'applications', label: 'Applications', count: '126', icon: LayoutGrid, pos: 'top-3 right-3 sm:right-5' },
    { id: 'non-human', label: 'Service Accounts', count: nhCount.toLocaleString(), icon: Bot, pos: 'bottom-14 left-2 sm:left-4' },
    { id: 'roles', label: 'Roles', count: '737', icon: Shield, pos: 'bottom-14 right-2 sm:right-4' },
    { id: 'entitlements', label: 'Entitlements', count: '12,480', icon: KeyRound, pos: 'bottom-1 left-1/2 -translate-x-1/2' },
  ];

  return (
    <div className="relative h-[276px] w-full overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-[#F8FBFF] to-white">
      <svg
        viewBox="0 0 540 276"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Concentric rotating dotted circles around the IDENTRA hub */}
        <g transform="translate(270 118)">
          <circle
            r="58"
            fill="none"
            stroke="#0EA5E9"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            className="animate-slow-orbit"
          />
          <circle
            r="75"
            fill="none"
            stroke="#38BDF8"
            strokeOpacity="0.34"
            strokeWidth="1.2"
            strokeDasharray="1.5 8"
            className="animate-slow-orbit-reverse"
          />
          <circle
            r="94"
            fill="none"
            stroke="#94A3B8"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeDasharray="1 10"
          />
        </g>

        <path d="M270 118 C 205 104, 165 62, 108 50" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeDasharray="3 5" className="animate-dash-flow" />
        <path d="M270 118 C 335 104, 375 62, 432 50" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeDasharray="3 5" className="animate-dash-flow" />
        <path d="M270 118 C 205 130, 165 162, 105 182" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeDasharray="3 5" className="animate-dash-flow" />
        <path d="M270 118 C 335 130, 375 162, 435 182" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeDasharray="3 5" className="animate-dash-flow" />
        <path d="M270 118 L 270 232" fill="none" stroke={driftCount > 0 ? '#F59E0B' : '#0EA5E9'} strokeWidth="1.75" strokeDasharray="3 5" className="animate-dash-flow" />
      </svg>

      {/* Center Circular IDENTRA Emblem */}
      <button
        type="button"
        onClick={() => setActiveSection('lifecycle')}
        title="Open Identity Process++ Lifecycle"
        className="absolute top-[118px] left-1/2 z-10 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-[#0EA5E9] bg-white shadow-[0_0_32px_rgba(14,165,233,0.22)] transition-transform hover:scale-105"
      >
        <IdentraMark className="h-8 w-8" />
        <span className="mt-1 font-display text-[10px] font-extrabold tracking-[0.18em] text-[#0F172A]">
          IDENTRA
        </span>
      </button>

      {/* 5 Interactive Satellites — clicking jumps directly into that module */}
      {nodes.map((node) => {
        const Icon = node.icon;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => setActiveSection(node.id)}
            className={cn(
              'group absolute z-10 flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-2.5 py-1.5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#0EA5E9] hover:shadow-md',
              node.pos
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-50 text-[#0284C7] transition-colors group-hover:bg-[#0EA5E9] group-hover:text-white">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold text-[#0F172A]">
                {node.label}
              </span>
              <span className="block font-mono text-[10px] text-slate-500">
                ({node.count})
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function DashboardView() {
  const resolvedActionIds = useSceneStore((s) => s.resolvedActionIds);
  const lifecycleEvents = useSceneStore((s) => s.lifecycleEvents);
  const joinerCount = useSceneStore((s) => s.joinerCount);
  const moverCount = useSceneStore((s) => s.moverCount);
  const leaverCount = useSceneStore((s) => s.leaverCount);
  const resolveAttentionItem = useSceneStore((s) => s.resolveAttentionItem);
  const resolveAllAttentionItems = useSceneStore((s) => s.resolveAllAttentionItems);

  const setActiveSection = useDemoStore((s) => s.setActiveSection);
  const onboardNewJoiner = useDemoStore((s) => s.onboardNewJoiner);
  const movePersonDepartment = useDemoStore((s) => s.movePersonDepartment);
  const offboardPerson = useDemoStore((s) => s.offboardPerson);
  const reviews = useDemoStore((s) => s.reviews);
  const policies = useDemoStore((s) => s.policies);
  const people = useDemoStore((s) => s.people);

  const completedReviews = reviews.filter((r) => r.decision !== 'Pending').length;
  const activeViolations = policies.reduce((acc, p) => acc + p.violations, 0);

  const healthBoost =
    INITIAL_ATTENTION_ITEMS.filter((i) => resolvedActionIds.includes(i.id)).reduce(
      (sum, i) => sum + i.healthBoost,
      0
    ) + Math.min(2, Math.floor(completedReviews / 2));

  const overallHealth = Math.min(99, 92 + healthBoost);
  const actionsReduced = INITIAL_ATTENTION_ITEMS.filter((i) =>
    resolvedActionIds.includes(i.id)
  ).reduce((sum, i) => sum + i.actionsReduced, 0);
  const openActions = Math.max(0, 34 - actionsReduced - completedReviews);

  const reviewsComplete = Math.min(
    100,
    87 + Math.round((completedReviews / Math.max(1, reviews.length)) * 13)
  );
  const policyCompliance = activeViolations === 0 ? 100 : Math.max(91, 100 - activeViolations * 2);
  const orphanCount =
    resolvedActionIds.includes('att-orphans') ||
    people.find((p) => p.id === 'p-mark')?.jmlStatus === 'Suspended'
      ? 0
      : 18;
  const allResolved = resolvedActionIds.length === INITIAL_ATTENTION_ITEMS.length;

  const ringCircumference = 2 * Math.PI * 52;
  const ringOffset = ringCircumference * (1 - overallHealth / 100);

  return (
    <div className="space-y-6">
      {/* Header Row matching Item 02 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Identity Operations
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            A unified view of identity, access, and governance across your organization.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={resolveAllAttentionItems}
            disabled={allResolved}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
              allResolved
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default'
                : 'bg-[#0EA5E9] text-white shadow-sm hover:bg-[#0284C7]'
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {allResolved ? 'All Governance Alerts Cleared' : 'Auto-Resolve via Process++'}
            </span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Reference KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total identities',
            value: (8415 + people.length).toLocaleString(),
            delta: '↑ +4.8%',
            deltaColor: 'text-emerald-600',
            icon: Users,
            target: 'people' as DemoSectionId,
            spark: 'M2 22 L18 18 L34 20 L52 12 L70 14 L86 4',
          },
          {
            label: 'Connected applications',
            value: '126',
            delta: '↑ +2.1%',
            deltaColor: 'text-emerald-600',
            icon: Box,
            target: 'applications' as DemoSectionId,
            spark: 'M2 23 L20 20 L38 16 L56 17 L72 9 L86 6',
          },
          {
            label: 'Non-human identities',
            value: '1,284',
            delta: '↑ +6.3%',
            deltaColor: 'text-emerald-600',
            icon: Bot,
            target: 'non-human' as DemoSectionId,
            spark: 'M2 24 L20 19 L36 21 L54 13 L72 10 L86 3',
          },
          {
            label: 'Open governance actions',
            value: String(openActions),
            delta: openActions === 0 ? '✓ All Clear' : '↓ -12.8%',
            deltaColor: openActions === 0 ? 'text-emerald-600' : 'text-[#0284C7]',
            icon: ShieldAlert,
            target: 'access-reviews' as DemoSectionId,
            spark: 'M2 6 L22 10 L40 12 L58 17 L74 20 L86 24',
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={() => setActiveSection(kpi.target)}
              className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284C7] transition-colors group-hover:bg-[#0EA5E9] group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-slate-500">{kpi.label}</div>
                    <div className="font-display text-2xl font-bold text-[#0F172A]">
                      {kpi.value}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#0EA5E9]" />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <span className={cn('font-mono text-xs font-semibold', kpi.deltaColor)}>
                  {kpi.delta}
                </span>
                <Sparkline color="#0EA5E9" path={kpi.spark} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Row 2: Interactive Identity Ecosystem + Governance Health Gauge */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs xl:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
              <ShieldCheck className="h-4 w-4 text-[#0EA5E9]" />
              <span>Identity ecosystem</span>
            </div>
            <span className="font-mono text-[11px] text-[#0284C7]">
              Click any node to drill down →
            </span>
          </div>
          <InteractiveEcosystemPanel />
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs xl:col-span-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
              <ShieldCheck className="h-4 w-4 text-[#0EA5E9]" />
              <span>Governance health</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('compliance')}
              className="cursor-pointer font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
            >
              Compliance →
            </button>
          </div>

          <div className="my-4 flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute text-center">
                <div className="font-display text-2xl font-extrabold text-[#0F172A]">
                  {overallHealth}%
                </div>
                <div className="text-[10px] font-medium text-slate-500">Overall score</div>
              </div>
            </div>

            <div className="w-full space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Access reviews
                  </span>
                  <span className="font-mono text-slate-900">{reviewsComplete}% complete</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-[#0EA5E9]"
                    animate={{ width: `${reviewsComplete}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Policy compliance
                  </span>
                  <span className="font-mono text-slate-900">{policyCompliance}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-[#0284C7]"
                    animate={{ width: `${policyCompliance}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSection('people')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 transition-colors hover:border-sky-200"
              >
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  {orphanCount === 0 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  Orphaned accounts
                </span>
                <span
                  className={cn(
                    'font-mono font-semibold',
                    orphanCount === 0 ? 'text-emerald-600' : 'text-amber-600'
                  )}
                >
                  {orphanCount === 0 ? '0 · Clean' : `${orphanCount} needing attention`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Lifecycle Activity (JML) + Attention Required Action Queue */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs xl:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
              <Clock className="h-4 w-4 text-[#0EA5E9]" />
              <span>Lifecycle activity (JML)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onboardNewJoiner}
                className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-medium text-slate-700 transition-colors hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
              >
                + Joiner
              </button>
              <button
                type="button"
                onClick={() => movePersonDepartment('p-john')}
                className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-medium text-slate-700 transition-colors hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
              >
                + Mover
              </button>
              <button
                type="button"
                onClick={() => offboardPerson('p-mark')}
                className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-medium text-slate-700 transition-colors hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
              >
                + Leaver
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-[#F8FAFC] py-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <UserPlus className="h-3.5 w-3.5 text-[#0EA5E9]" />
                <span>Joiners</span>
              </div>
              <div className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                {joinerCount}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <ArrowLeftRight className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Movers</span>
              </div>
              <div className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                {moverCount}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <UserMinus className="h-3.5 w-3.5 text-slate-500" />
                <span>Leavers</span>
              </div>
              <div className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                {leaverCount}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              <span>Recent events</span>
              <button
                type="button"
                onClick={() => setActiveSection('audit-log')}
                className="cursor-pointer text-[#0284C7] hover:underline"
              >
                View audit log →
              </button>
            </div>
            <div className="mt-2.5 space-y-2">
              <AnimatePresence initial={false}>
                {lifecycleEvents.slice(0, 3).map((ev) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 text-xs"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#0EA5E9]" />
                    <span className="font-mono text-[11px] text-slate-400">{ev.time}</span>
                    <span className="truncate font-medium text-slate-700">
                      {ev.text} <span className="text-slate-400">({ev.department})</span>
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Attention Required Queue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs xl:col-span-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <span>Attention required</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('access-reviews')}
              className="cursor-pointer font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
            >
              Open queue →
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {INITIAL_ATTENTION_ITEMS.map((item) => {
              const resolved = resolvedActionIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-all',
                    resolved
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-200/80 bg-[#FBFDFF]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                        resolved
                          ? 'bg-emerald-100 text-emerald-600'
                          : item.severity === 'High'
                            ? 'bg-rose-50 text-rose-500'
                            : item.id === 'att-reviews'
                              ? 'bg-amber-50 text-amber-500'
                              : 'bg-sky-50 text-[#0284C7]'
                      )}
                    >
                      {resolved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : item.severity === 'High' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : item.id === 'att-reviews' ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-[#0F172A]">
                        {resolved ? item.resolutionMessage : item.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {resolved ? `Completed via ${item.pillarTag}` : item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!resolved && (
                      <span
                        className={cn(
                          'hidden rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold sm:inline-block',
                          item.severity === 'High'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-amber-50 text-amber-700'
                        )}
                      >
                        {item.severity}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => resolveAttentionItem(item.id)}
                      disabled={resolved}
                      className={cn(
                        'cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                        resolved
                          ? 'border-emerald-200 bg-white text-emerald-700 cursor-default'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]'
                      )}
                    >
                      {resolved ? 'Resolved' : 'Review'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
