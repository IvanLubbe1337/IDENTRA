import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeftRight,
  Bot,
  Box,
  CheckCircle2,
  Clock,
  Info,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  RotateCcw,
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
import { IdentraMark, SectionEyebrow } from '@/components/ui/Primitives';
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
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </svg>
  );
}

/**
 * Clean White-Theme Interactive Dotted Ecosystem Graphic inside the Operations Console,
 * faithfully echoing the reference's circular dotted lines around IDENTRA.
 */
function DottedEcosystemDiagram() {
  const activeNode = useSceneStore((s) => s.activeEcosystemNode);
  const setActiveNode = useSceneStore((s) => s.setActiveEcosystemNode);

  const nodes = [
    { id: 'people' as const, label: 'People', count: '6,732', icon: Users, pos: 'top-3 left-3 sm:left-5' },
    { id: 'applications' as const, label: 'Applications', count: '126', icon: LayoutGrid, pos: 'top-3 right-3 sm:right-5' },
    { id: 'service-accounts' as const, label: 'Service Accounts', count: '1,102', icon: Bot, pos: 'bottom-14 left-2 sm:left-4' },
    { id: 'roles' as const, label: 'Roles', count: '737', icon: Shield, pos: 'bottom-14 right-2 sm:right-4' },
    { id: 'entitlements' as const, label: 'Entitlements', count: '12,480', icon: KeyRound, pos: 'bottom-1 left-1/2 -translate-x-1/2' },
  ];

  return (
    <div className="relative h-[268px] w-full overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-[#F8FBFF] to-white">
      {/* Animated Curved Dotted Connector Lines + Concentric Dotted Halo */}
      <svg
        viewBox="0 0 540 268"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Concentric rotating dotted circles around the center IDENTRA emblem */}
        <g transform="translate(270 116)">
          <circle
            r="58"
            fill="none"
            stroke="#0EA5E9"
            strokeOpacity="0.4"
            strokeWidth="1.4"
            strokeDasharray="2 6"
            className="animate-slow-orbit"
          />
          <circle
            r="74"
            fill="none"
            stroke="#38BDF8"
            strokeOpacity="0.32"
            strokeWidth="1.2"
            strokeDasharray="1.5 8"
            className="animate-slow-orbit-reverse"
          />
          <circle
            r="92"
            fill="none"
            stroke="#94A3B8"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeDasharray="1 10"
          />
        </g>

        {/* 5 Smooth Dotted Bezier Spokes connecting to satellites */}
        <path
          d="M270 116 C 205 104, 165 62, 108 50"
          fill="none"
          stroke={activeNode === 'people' || activeNode === 'core' ? '#0EA5E9' : '#CBD5E1'}
          strokeWidth="1.75"
          strokeDasharray="3 5"
          className="animate-dash-flow"
        />
        <path
          d="M270 116 C 335 104, 375 62, 432 50"
          fill="none"
          stroke={activeNode === 'applications' || activeNode === 'core' ? '#0EA5E9' : '#CBD5E1'}
          strokeWidth="1.75"
          strokeDasharray="3 5"
          className="animate-dash-flow"
        />
        <path
          d="M270 116 C 205 130, 165 162, 105 178"
          fill="none"
          stroke={activeNode === 'service-accounts' || activeNode === 'core' ? '#0EA5E9' : '#CBD5E1'}
          strokeWidth="1.75"
          strokeDasharray="3 5"
          className="animate-dash-flow"
        />
        <path
          d="M270 116 C 335 130, 375 162, 435 178"
          fill="none"
          stroke={activeNode === 'roles' || activeNode === 'core' ? '#0EA5E9' : '#CBD5E1'}
          strokeWidth="1.75"
          strokeDasharray="3 5"
          className="animate-dash-flow"
        />
        <path
          d="M270 116 L 270 226"
          fill="none"
          stroke={activeNode === 'entitlements' || activeNode === 'core' ? '#0EA5E9' : '#CBD5E1'}
          strokeWidth="1.75"
          strokeDasharray="3 5"
          className="animate-dash-flow"
        />
      </svg>

      {/* Center Circular IDENTRA Emblem */}
      <button
        type="button"
        onClick={() => setActiveNode('core')}
        className="absolute top-[116px] left-1/2 z-10 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-[#0EA5E9] bg-white shadow-[0_0_32px_rgba(14,165,233,0.22)] transition-transform hover:scale-105"
      >
        <IdentraMark className="h-8 w-8" />
        <span className="mt-1 font-display text-[10px] font-extrabold tracking-[0.18em] text-[#0F172A]">
          IDENTRA
        </span>
      </button>

      {/* 5 Clickable Satellite Pills */}
      {nodes.map((node) => {
        const Icon = node.icon;
        const selected = activeNode === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => setActiveNode(selected ? 'core' : node.id)}
            className={cn(
              'absolute z-10 flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-all',
              node.pos,
              selected
                ? 'border-[#0EA5E9] bg-sky-50 shadow-md ring-2 ring-[#0EA5E9]/20'
                : 'border-slate-200 bg-white/95 shadow-xs hover:border-[#0EA5E9]/60'
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-50 text-[#0284C7]">
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

export function OperationsShowcaseSection() {
  const resolvedActionIds = useSceneStore((s) => s.resolvedActionIds);
  const lifecycleEvents = useSceneStore((s) => s.lifecycleEvents);
  const joinerCount = useSceneStore((s) => s.joinerCount);
  const moverCount = useSceneStore((s) => s.moverCount);
  const leaverCount = useSceneStore((s) => s.leaverCount);

  const resolveAttentionItem = useSceneStore((s) => s.resolveAttentionItem);
  const resolveAllAttentionItems = useSceneStore((s) => s.resolveAllAttentionItems);
  const resetDashboardDemo = useSceneStore((s) => s.resetDashboardDemo);
  const simulateLifecycleEvent = useSceneStore((s) => s.simulateLifecycleEvent);
  const setCurrentPage = useSceneStore((s) => s.setCurrentPage);
  const setDemoSection = useDemoStore((s) => s.setActiveSection);

  const openInDemo = (section: DemoSectionId) => {
    setDemoSection(section);
    setCurrentPage('demo');
  };

  const healthBoost = INITIAL_ATTENTION_ITEMS.filter((item) =>
    resolvedActionIds.includes(item.id)
  ).reduce((sum, item) => sum + item.healthBoost, 0);

  const actionsReduced = INITIAL_ATTENTION_ITEMS.filter((item) =>
    resolvedActionIds.includes(item.id)
  ).reduce((sum, item) => sum + item.actionsReduced, 0);

  const overallHealth = Math.min(98, 92 + healthBoost);
  const openActions = Math.max(1, 34 - actionsReduced);
  const reviewsComplete = resolvedActionIds.includes('att-reviews') ? 99 : 87;
  const policyCompliance = resolvedActionIds.includes('att-provisioning') ? 98 : 94;
  const orphanCount = resolvedActionIds.includes('att-orphans') ? 0 : 18;
  const allResolved = resolvedActionIds.length === INITIAL_ATTENTION_ITEMS.length;

  const ringCircumference = 2 * Math.PI * 52;
  const ringOffset = ringCircumference * (1 - overallHealth / 100);

  return (
    <section
      id="console"
      className="border-y border-slate-200/80 bg-[#F8FAFC] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow index="02" label="Interactive Operations Console" />
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] sm:text-4xl">
              Identity Operations at a Glance.
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
              Try the live white-mode console below: resolve open governance
              actions to watch your <strong className="text-slate-900">Governance Health</strong>{' '}
              climb in real time, or trigger Joiner, Mover, and Leaver events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => openInDemo('dashboard')}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0EA5E9]"
            >
              <span>Open Full Live Demo →</span>
            </button>

            <button
              type="button"
              onClick={resolveAllAttentionItems}
              disabled={allResolved}
              className={cn(
                'inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all',
                allResolved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-[#0EA5E9] text-white shadow-sm hover:bg-[#0284C7]'
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {allResolved
                  ? 'All Actions Remediated (98%)'
                  : 'Auto-Resolve via Process++'}
              </span>
            </button>

            {resolvedActionIds.length > 0 && (
              <button
                type="button"
                onClick={resetDashboardDemo}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive White Product Frame (Modeled Directly on Reference Architecture) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65 }}
          className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_32px_80px_-34px_rgba(15,23,42,0.16)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Compact Product Sidebar (Echoes Reference Navigation Taxonomy) */}
            <aside className="hidden border-r border-slate-100 bg-[#F8FAFC] p-5 lg:col-span-2 lg:flex lg:flex-col lg:justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <IdentraMark className="h-6 w-6" />
                  <span className="font-display text-xs font-extrabold tracking-[0.16em] text-[#0F172A]">
                    IDENTRA
                  </span>
                </div>

                {[
                  { group: 'OVERVIEW', items: [{ label: 'Dashboard', id: 'dashboard' as DemoSectionId }], active: 'Dashboard' },
                  { group: 'IDENTITIES', items: [{ label: 'People', id: 'people' as DemoSectionId }, { label: 'Non-human IDs', id: 'non-human' as DemoSectionId }] },
                  { group: 'ACCESS', items: [{ label: 'Applications', id: 'applications' as DemoSectionId }, { label: 'Entitlements', id: 'entitlements' as DemoSectionId }, { label: 'Roles', id: 'roles' as DemoSectionId }] },
                  { group: 'GOVERNANCE', items: [{ label: 'Access reviews', id: 'access-reviews' as DemoSectionId }, { label: 'Policies & SoD', id: 'policies-sod' as DemoSectionId }, { label: 'Compliance', id: 'compliance' as DemoSectionId }] },
                  { group: 'AUTOMATION', items: [{ label: 'Lifecycle', id: 'lifecycle' as DemoSectionId }, { label: 'Workflows', id: 'workflows' as DemoSectionId }] },
                ].map((section) => (
                  <div key={section.group}>
                    <div className="font-mono text-[9px] font-semibold tracking-[0.14em] text-slate-400">
                      {section.group}
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => openInDemo(item.id)}
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors',
                              section.active === item.label
                                ? 'bg-sky-50 font-semibold text-[#0284C7]'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
                            )}
                          >
                            {section.active === item.label && (
                              <LayoutDashboard className="h-3.5 w-3.5" />
                            )}
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-slate-200/80 pt-4 text-[11px] font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>All systems operational</span>
              </div>
            </aside>

            {/* Main White Console Workspace */}
            <div className="p-5 sm:p-7 lg:col-span-10">
              {/* Console Sub-header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#0F172A]">
                    Identity Operations
                  </h3>
                  <p className="text-xs text-slate-500">
                    A unified view of identity, access, and governance across your organization.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600">
                    Last 30 days
                  </span>
                  <span className="rounded-lg bg-[#0EA5E9] px-3 py-1.5 font-semibold text-white">
                    Process++ Live
                  </span>
                </div>
              </div>

              {/* Row 1: 4 Reference KPI Cards with Animated Sparklines */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: 'Total identities',
                    value: (8421 + (joinerCount - 18)).toLocaleString(),
                    delta: '↑ +4.8%',
                    deltaColor: 'text-emerald-600',
                    icon: Users,
                    spark: 'M2 22 L18 18 L34 20 L52 12 L70 14 L86 4',
                  },
                  {
                    label: 'Connected applications',
                    value: '126',
                    delta: '↑ +2.1%',
                    deltaColor: 'text-emerald-600',
                    icon: Box,
                    spark: 'M2 23 L20 20 L38 16 L56 17 L72 9 L86 6',
                  },
                  {
                    label: 'Non-human identities',
                    value: '1,284',
                    delta: '↑ +6.3%',
                    deltaColor: 'text-emerald-600',
                    icon: Bot,
                    spark: 'M2 24 L20 19 L36 21 L54 13 L72 10 L86 3',
                  },
                  {
                    label: 'Open governance actions',
                    value: String(openActions),
                    delta: allResolved ? '↓ -97.1%' : '↓ -12.8%',
                    deltaColor: 'text-[#0284C7]',
                    icon: ShieldAlert,
                    spark: 'M2 6 L22 10 L40 12 L58 17 L74 20 L86 24',
                  },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={kpi.label}
                      className="rounded-2xl border border-slate-200/80 bg-[#FBFDFF] p-4 transition-all hover:border-sky-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284C7]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="text-xs font-medium text-slate-500">
                              {kpi.label}
                            </div>
                            <div className="font-display text-2xl font-bold text-[#0F172A]">
                              {kpi.value}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-end justify-between">
                        <span className={cn('font-mono text-xs font-semibold', kpi.deltaColor)}>
                          {kpi.delta}
                        </span>
                        <Sparkline color="#0EA5E9" path={kpi.spark} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Identity Ecosystem (Dotted Lines) + Governance Health Gauge */}
              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 xl:col-span-7">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                      <ShieldCheck className="h-4 w-4 text-[#0EA5E9]" />
                      <span>Identity ecosystem</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#0284C7]">
                      Interactive dotted topology
                    </span>
                  </div>
                  <DottedEcosystemDiagram />
                </div>

                {/* Governance Health Card */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 xl:col-span-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                      <ShieldCheck className="h-4 w-4 text-[#0EA5E9]" />
                      <span>Governance health</span>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                      Live Score
                    </span>
                  </div>

                  <div className="my-4 flex flex-col items-center gap-5 sm:flex-row">
                    {/* Animated Circular Radial Gauge */}
                    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="10"
                        />
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
                        <div className="text-[10px] font-medium text-slate-500">
                          Overall score
                        </div>
                      </div>
                    </div>

                    {/* 3 Sub-bars straight from Reference */}
                    <div className="w-full space-y-3.5 text-xs">
                      <div>
                        <div className="flex items-center justify-between font-medium text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            Access reviews
                          </span>
                          <span className="font-mono text-slate-900">
                            {reviewsComplete}% complete
                          </span>
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
                          <span className="font-mono text-slate-900">
                            {policyCompliance}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            className="h-full rounded-full bg-[#0284C7]"
                            animate={{ width: `${policyCompliance}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
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
                          {orphanCount === 0 ? '0 · Clean' : `${orphanCount} needing review`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Lifecycle Activity (JML) + Attention Required Action Queue */}
              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
                {/* Lifecycle Activity (Joiners / Movers / Leavers) */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 xl:col-span-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                      <Clock className="h-4 w-4 text-[#0EA5E9]" />
                      <span>Lifecycle activity (JML)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {(['Joiner', 'Mover', 'Leaver'] as const).map((kind) => (
                        <button
                          key={kind}
                          type="button"
                          onClick={() => simulateLifecycleEvent(kind)}
                          className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-medium text-slate-700 transition-colors hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
                        >
                          + {kind}
                        </button>
                      ))}
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
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Recent events
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
                            <span className="font-mono text-[11px] text-slate-400">
                              {ev.time}
                            </span>
                            <span className="truncate font-medium text-slate-700">
                              {ev.text}{' '}
                              <span className="text-slate-400">({ev.department})</span>
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Attention Required Interactive Action List */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 xl:col-span-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                      <span>Attention required</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      Click Resolve to trigger Process++
                    </span>
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
                              {resolved ? 'Resolved' : 'Resolve'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
