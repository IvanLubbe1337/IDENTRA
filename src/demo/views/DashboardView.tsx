import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  GitMerge,
  Inbox,
  Info,
  KeyRound,
  LayoutGrid,
  Mail,
  Plane,
  Radar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { INITIAL_ATTENTION_ITEMS } from '@/data/identityProcessData';
import {
  evaluateBirthrightMatches,
  evaluateSkuBirthrightDemand,
  type DemoSectionId,
} from '@/data/demoSampleData';
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
  const appCount = useDemoStore((s) => 120 + s.applications.length);
  const roleCount = useDemoStore((s) => 731 + s.roles.length);
  const driftCount = useDemoStore(
    (s) => s.entitlements.filter((e) => e.status === 'Drift').length
  );
  const emptyEntCount = useDemoStore(
    (s) => s.emptyEntitlements.filter((e) => e.status === 'Empty (Flagged)').length
  );

  const nodes: {
    id: DemoSectionId;
    label: string;
    count: string;
    icon: typeof Users;
    pos: string;
  }[] = [
    { id: 'people', label: 'People', count: peopleCount.toLocaleString(), icon: Users, pos: 'top-3 left-3 sm:left-5' },
    { id: 'applications', label: 'Applications', count: appCount.toLocaleString(), icon: LayoutGrid, pos: 'top-3 right-3 sm:right-5' },
    { id: 'non-human', label: 'Non-Human IDs', count: nhCount.toLocaleString(), icon: Bot, pos: 'bottom-14 left-2 sm:left-4' },
    { id: 'roles', label: 'Roles', count: roleCount.toLocaleString(), icon: Shield, pos: 'bottom-14 right-2 sm:right-4' },
    { id: 'entitlements', label: 'Entitlements', count: '12,480', icon: KeyRound, pos: 'bottom-1 left-1/2 -translate-x-1/2' },
  ];

  const hasEntitlementAlert = driftCount > 0 || emptyEntCount > 0;

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
        <path d="M270 118 L 270 232" fill="none" stroke={hasEntitlementAlert ? '#F59E0B' : '#0EA5E9'} strokeWidth="1.75" strokeDasharray="3 5" className="animate-dash-flow" />
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
  const openReportingTab = useDemoStore((s) => s.openReportingTab);
  const openOnboardingTab = useDemoStore((s) => s.openOnboardingTab);
  const onboardNewJoiner = useDemoStore((s) => s.onboardNewJoiner);
  const movePersonDepartment = useDemoStore((s) => s.movePersonDepartment);
  const offboardPerson = useDemoStore((s) => s.offboardPerson);

  const reviews = useDemoStore((s) => s.reviews);
  const policies = useDemoStore((s) => s.policies);
  const people = useDemoStore((s) => s.people);
  const accounts = useDemoStore((s) => s.accounts);
  const entitlements = useDemoStore((s) => s.entitlements);
  const emptyEntitlements = useDemoStore((s) => s.emptyEntitlements);
  const governanceControls = useDemoStore((s) => s.governanceControls);
  const minedRoles = useDemoStore((s) => s.minedRoles);
  const miningOutliers = useDemoStore((s) => s.miningOutliers);
  const roleOptimisations = useDemoStore((s) => s.roleOptimisations);
  const birthrights = useDemoStore((s) => s.birthrights);
  const licenseSkus = useDemoStore((s) => s.licenseSkus);
  const predictedLeavers = useDemoStore((s) => s.predictedLeavers);
  const currency = useDemoStore((s) => s.platformConfig.governance.currencySymbol);
  const accessRequests = useDemoStore((s) => s.accessRequests);
  const contractorRequests = useDemoStore((s) => s.contractorRequests);
  const entitlementRequests = useDemoStore((s) => s.entitlementRequests);
  const leaveDelegation = useDemoStore((s) => s.leaveDelegation);
  const adoptionRecords = useDemoStore((s) => s.adoptionRecords);
  const provisioningJobs = useDemoStore((s) => s.provisioningJobs);
  const emailNotifications = useDemoStore((s) => s.emailNotifications);

  const completedReviews = reviews.filter((r) => r.decision !== 'Pending').length;
  const pendingReviews = reviews.filter((r) => r.decision === 'Pending').length;
  const activeViolations = policies.reduce((acc, p) => acc + p.violations, 0);

  // Live Governance Assurance metrics
  const assuranceViolations = governanceControls.reduce(
    (sum, c) => sum + (c.detectiveEnabled ? c.violations.filter((v) => !v.resolved).length : 0),
    0
  );
  const preventativeActiveCount = governanceControls.filter((c) => c.preventativeEnabled).length;
  const detectiveActiveCount = governanceControls.filter((c) => c.detectiveEnabled).length;
  const assuranceCompliancePct = Math.max(
    75,
    Math.min(100, Math.round(100 - assuranceViolations * (2 / 12)))
  );

  // Live Hygiene & Lifecycle metrics
  const orphanAccountsCount = accounts.filter((a) => a.correlationState === 'Orphaned').length;
  const emptyFlaggedCount = emptyEntitlements.filter((e) => e.status === 'Empty (Flagged)').length;
  const emptyDeletableCount = emptyEntitlements.filter(
    (e) => e.status === 'Empty (Flagged)' && e.deletableInTarget
  ).length;
  const emptyDeletedCount = emptyEntitlements.filter(
    (e) => e.status === 'Deleted in Target' || e.status === 'Deletion Queued'
  ).length;
  const driftCount = entitlements.filter((e) => e.status === 'Drift').length;
  const emergencyDeactivatedCount = people.filter((p) => p.jmlStatus === 'Deactivated').length;

  // Live Tasks, Marketplace, Onboarding & Operations
  const pendingAccessReqs = accessRequests.filter((r) => r.status === 'Pending Approval').length;
  const escalatedAccessReqs = accessRequests.filter((r) => r.escalatedCount > 0).length;
  const pendingContractorReqs = contractorRequests.filter(
    (r) => r.status === 'Pending Approval'
  ).length;
  const pendingEntReqs = entitlementRequests.filter(
    (r) => r.status === 'Pending Approval'
  ).length;
  const totalPendingOnboarding = pendingContractorReqs + pendingEntReqs;
  const totalMyTasks = pendingAccessReqs + pendingReviews + totalPendingOnboarding;

  const simJobsCount = provisioningJobs.filter((j) => j.status === 'Simulation Mode').length;
  const deleteJobsCount = provisioningJobs.filter((j) => j.operation === 'Delete').length;
  const failedEmailsCount = emailNotifications.filter(
    (e) => e.status === 'Bounced' || e.status === 'Failed'
  ).length;

  // Live Role Mining & Birthrights
  const recommendedMinedRoles = minedRoles.filter((r) => r.status === 'Recommended').length;
  const flaggedOutliersCount = miningOutliers.filter((o) => o.status === 'Flagged').length;
  const openOptimisationsCount = roleOptimisations.filter((o) => o.status === 'Open').length;
  const activeBirthrights = birthrights.filter((b) => b.status === 'Active');
  const totalBirthrightDerivedGrants = activeBirthrights.reduce(
    (sum, rule) => sum + evaluateBirthrightMatches(rule, people).length * rule.grants.length,
    0
  );
  const licenseEvaluations = evaluateSkuBirthrightDemand(licenseSkus, birthrights, people);
  const totalLicensesConsumed = licenseSkus.reduce((s, k) => s + k.consumed, 0);
  const totalLicensesPurchased = licenseSkus.reduce((s, k) => s + k.totalPurchased, 0);
  const licenseOverrunSkus = licenseEvaluations.filter((e) => e.exceedsPool);
  const upcomingPredictedLeavers = predictedLeavers.filter((l) => l.status !== 'Offboarded');
  const predictedExitChangesCount = upcomingPredictedLeavers.reduce(
    (sum, l) => sum + l.calculatedChanges.length,
    0
  );
  const predictedLeaverSavingsZar = upcomingPredictedLeavers.reduce(
    (sum, l) =>
      sum + l.calculatedChanges.reduce((cSum, c) => cSum + (c.monthlySavingsZar ?? 0), 0),
    0
  );

  const healthBoost =
    INITIAL_ATTENTION_ITEMS.filter((i) => resolvedActionIds.includes(i.id)).reduce(
      (sum, i) => sum + i.healthBoost,
      0
    ) +
    Math.min(2, Math.floor(completedReviews / 2)) +
    (emptyFlaggedCount === 0 ? 1 : 0);

  const overallHealth = Math.min(100, Math.round((91 + healthBoost + assuranceCompliancePct) / 2));
  const reviewsComplete = Math.min(
    100,
    87 + Math.round((completedReviews / Math.max(1, reviews.length)) * 13)
  );
  const policyCompliance = activeViolations === 0 ? 100 : Math.max(91, 100 - activeViolations * 2);
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
          {leaveDelegation.enabled && (
            <button
              type="button"
              onClick={() => setActiveSection('my-tasks')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <Plane className="h-3.5 w-3.5" />
              <span>Stand-In Active: {leaveDelegation.standInName}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveSection('access-marketplace')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0EA5E9] hover:text-[#0284C7]"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Access Marketplace</span>
          </button>
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

      {/* Row 1: 4 Live Executive KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total identities',
            value: (8415 + people.length).toLocaleString(),
            delta:
              emergencyDeactivatedCount > 0
                ? `${emergencyDeactivatedCount} emergency deactivated`
                : `↑ +4.8% · ${adoptionRecords.length} adopted`,
            deltaColor:
              emergencyDeactivatedCount > 0 ? 'text-rose-600' : 'text-emerald-600',
            icon: Users,
            target: 'people' as DemoSectionId,
            spark: 'M2 22 L18 18 L34 20 L52 12 L70 14 L86 4',
          },
          {
            label: 'Governance compliance',
            value: `${assuranceCompliancePct}%`,
            delta:
              assuranceViolations === 0
                ? '✓ 0 control violations'
                : `${assuranceViolations} violations · ${preventativeActiveCount}P/${detectiveActiveCount}D`,
            deltaColor:
              assuranceViolations === 0 ? 'text-emerald-600' : 'text-amber-600',
            icon: ShieldCheck,
            target: 'governance-assurance' as DemoSectionId,
            spark: 'M2 20 L20 17 L38 15 L56 12 L72 9 L86 5',
          },
          {
            label: 'My tasks & approvals',
            value: String(totalMyTasks),
            delta:
              escalatedAccessReqs > 0
                ? `${escalatedAccessReqs} escalated · ${pendingAccessReqs} requests`
                : `${pendingAccessReqs} reqs · ${pendingReviews} reviews · ${totalPendingOnboarding} onb`,
            deltaColor:
              escalatedAccessReqs > 0 ? 'text-rose-600' : 'text-[#0284C7]',
            icon: Inbox,
            target: 'my-tasks' as DemoSectionId,
            spark: 'M2 18 L20 14 L36 16 L54 11 L72 13 L86 8',
          },
          {
            label: 'Hygiene & orphan queue',
            value: String(orphanAccountsCount + emptyFlaggedCount),
            delta:
              orphanAccountsCount + emptyFlaggedCount === 0
                ? '✓ Zero orphans & empty grants'
                : `${orphanAccountsCount} orphans · ${emptyFlaggedCount} empty ents`,
            deltaColor:
              orphanAccountsCount + emptyFlaggedCount === 0
                ? 'text-emerald-600'
                : 'text-rose-600',
            icon: ShieldAlert,
            target: (orphanAccountsCount > 0
              ? 'orphan-adoption'
              : 'governance-assurance') as DemoSectionId,
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
              onClick={() => setActiveSection('governance-assurance')}
              className="cursor-pointer font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
            >
              Assurance →
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

            <div className="w-full space-y-3 text-xs">
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
                    Policy &amp; SoD compliance
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

              <div className="grid grid-cols-1 gap-2 pt-0.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveSection('orphan-adoption')}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 transition-colors hover:border-sky-200"
                >
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    {orphanAccountsCount === 0 ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <UserCheck className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    <span className="truncate">Orphans</span>
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[11px] font-semibold',
                      orphanAccountsCount === 0 ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  >
                    {orphanAccountsCount === 0 ? '0' : `${orphanAccountsCount} adopt`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openReportingTab('empty-entitlements')}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 transition-colors hover:border-amber-200"
                >
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    {emptyFlaggedCount === 0 ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    <span className="truncate">0-Member</span>
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[11px] font-semibold',
                      emptyFlaggedCount === 0 ? 'text-emerald-600' : 'text-amber-600'
                    )}
                  >
                    {emptyFlaggedCount === 0 ? '0' : `${emptyFlaggedCount} empty`}
                  </span>
                </button>
              </div>
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

          {/* Predicted / Future Leavers Callout */}
          <button
            type="button"
            onClick={() => setActiveSection('lifecycle')}
            className="mt-3 flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-amber-200/80 bg-amber-50/50 px-3.5 py-2.5 text-left text-xs transition-colors hover:border-amber-300 hover:bg-amber-50"
          >
            <div>
              <div className="font-semibold text-[#0F172A]">
                {upcomingPredictedLeavers.length} Predicted Future Leavers
              </div>
              <div className="font-mono text-[10px] text-slate-600">
                {predictedExitChangesCount} calculated exit changes · {currency}
                {predictedLeaverSavingsZar.toLocaleString()}/mo license reclaim
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 font-mono text-[10px] font-bold text-amber-800 ring-1 ring-amber-200">
              <span>Inspect Plan</span>
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </button>

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

      {/* Row 4: Live Governance Assurance, Access Intelligence & Operational Pulse */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Card 1: Governance Assurance & Target Hygiene */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                <Radar className="h-4 w-4 text-indigo-500" />
                <span>Assurance &amp; Target Hygiene</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('governance-assurance')}
                className="cursor-pointer font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
              >
                Controls →
              </button>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveSection('governance-assurance')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-sky-200"
              >
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Configurable Controls ({governanceControls.length})
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    {preventativeActiveCount} Preventative · {detectiveActiveCount} Detective active
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                    assuranceViolations > 0
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {assuranceViolations} open
                </span>
              </button>

              <button
                type="button"
                onClick={() => openReportingTab('empty-entitlements')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-amber-200"
              >
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Empty Target Entitlements (GA-CTRL-07)
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    {emptyDeletableCount} deletable in target · {emptyDeletedCount} deletion tasks sent
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                    emptyFlaggedCount > 0
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {emptyFlaggedCount} flagged
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('orphan-adoption')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-sky-200"
              >
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Orphaned Account Adoption
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    {adoptionRecords.length} governed adoption(s) in provenance ledger
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                    orphanAccountsCount > 0
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {orphanAccountsCount} orphans
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[10px] text-slate-400">
            <span>Direct drift grants: {driftCount}</span>
            <button
              type="button"
              onClick={() => openReportingTab('empty-entitlements')}
              className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#0284C7] hover:underline"
            >
              <span>Audit Reports</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Role Mining & Birthright Intelligence */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                <Sparkles className="h-4 w-4 text-[#0EA5E9]" />
                <span>Role Mining &amp; Birthrights</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('role-mining')}
                className="cursor-pointer font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
              >
                Role Mining →
              </button>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveSection('role-mining')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-sky-100 bg-sky-50/40 px-3 py-2.5 text-left transition-colors hover:border-sky-300"
              >
                <div className="min-w-0 pr-2">
                  <div className="truncate font-semibold text-[#0F172A]">
                    {recommendedMinedRoles} Recommended Business/IT Roles
                  </div>
                  <div className="truncate font-mono text-[10px] text-slate-500">
                    Top cluster: Finance – Financial Accountant (96%)
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0284C7]">
                  Simulate
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('role-mining')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-amber-200"
              >
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Outlier &amp; Role Optimisation Signals
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    {openOptimisationsCount} overlapping/redundant role opportunity
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                    flaggedOutliersCount > 0
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {flaggedOutliersCount} outliers
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('birthrights')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-sky-200"
              >
                <div className="flex items-center gap-2">
                  <GitMerge className="h-3.5 w-3.5 shrink-0 text-[#0284C7]" />
                  <div>
                    <div className="font-semibold text-[#0F172A]">
                      Active Birthright Policies ({activeBirthrights.length})
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      Attribute &amp; multi-context auto-provisioning
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                  {totalBirthrightDerivedGrants} grants
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => setActiveSection('licenses')}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1 font-semibold hover:underline',
                licenseOverrunSkus.length > 0 ? 'text-rose-600' : 'text-slate-500'
              )}
            >
              <span>
                Licenses: {totalLicensesConsumed.toLocaleString()}/
                {totalLicensesPurchased.toLocaleString()}
                {licenseOverrunSkus.length > 0
                  ? ` · ${licenseOverrunSkus.length} SKU overrun`
                  : ''}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('licenses')}
              className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#0284C7] hover:underline"
            >
              <span>Licenses</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Self-Service, Onboarding & Operations Pulse */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                <Cpu className="h-4 w-4 text-[#0284C7]" />
                <span>Requests, Onboarding &amp; Ops</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('my-tasks')}
                className="cursor-pointer font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
              >
                My Tasks →
              </button>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <button
                type="button"
                onClick={() => openOnboardingTab('contractor')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-sky-200"
              >
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Guided Onboarding Approvals
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    {pendingContractorReqs} contractor · {pendingEntReqs} entitlement requests
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                    totalPendingOnboarding > 0
                      ? 'bg-sky-50 text-[#0284C7]'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {totalPendingOnboarding} pending
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('provisioning-engine')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-sky-200"
              >
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Provisioning &amp; Target Deletion Queue
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    {simJobsCount} in Simulation Mode · {deleteJobsCount} Delete task(s)
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                  {provisioningJobs.length} jobs
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('email-notifications')}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2.5 text-left transition-colors hover:border-sky-200"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#0284C7]" />
                  <div>
                    <div className="font-semibold text-[#0F172A]">
                      Branded Email Notifications
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      Master template synced · {emailNotifications.length} logged
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                    failedEmailsCount > 0
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {failedEmailsCount > 0 ? `${failedEmailsCount} failed` : 'Healthy'}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[10px] text-slate-400">
            <span>
              Leave stand-in:{' '}
              {leaveDelegation.enabled ? leaveDelegation.standInName : 'Not active'}
            </span>
            <button
              type="button"
              onClick={() => setActiveSection('configuration')}
              className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#0284C7] hover:underline"
            >
              <span>Configuration</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
