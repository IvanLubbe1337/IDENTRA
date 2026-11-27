import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Eye,
  FlaskConical,
  KeyRound,
  Play,
  ShieldAlert,
  UserMinus,
  Users,
  X,
} from 'lucide-react';
import type {
  DemoPredictedLeaver,
  PredictedChangeCategory,
} from '@/data/demoSampleData';
import { Dialog } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type HorizonFilter = 'All' | '7d' | '30d' | '90d';

function categoryBadgeClass(cat: PredictedChangeCategory): string {
  switch (cat) {
    case 'Account Disable':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Role / Entitlement Revoke':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'License Reclaim':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Ownership Handoff':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }
}

export function PredictedLeaversPanel() {
  const predictedLeavers = useDemoStore((s) => s.predictedLeavers);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const currency = useDemoStore((s) => s.platformConfig.governance.currencySymbol);
  const stagePredictedLeaverInSimulation = useDemoStore(
    (s) => s.stagePredictedLeaverInSimulation
  );
  const executePredictedLeaverExitNow = useDemoStore(
    (s) => s.executePredictedLeaverExitNow
  );
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [horizon, setHorizon] = useState<HorizonFilter>('All');
  const [inspectId, setInspectId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return predictedLeavers.filter((item) => {
      if (horizon === '7d' && item.daysUntilExit > 7) return false;
      if (horizon === '30d' && item.daysUntilExit > 30) return false;
      if (horizon === '90d' && item.daysUntilExit > 90) return false;
      if (!needle) return true;
      return `${item.identityName} ${item.employeeNumber} ${item.department} ${item.title} ${item.predictionSource} ${item.calculatedChanges.map((c) => `${c.objectName} ${c.targetSystem}`).join(' ')}`
        .toLowerCase()
        .includes(needle);
    });
  }, [predictedLeavers, horizon, searchQuery]);

  const activeUpcoming = useMemo(
    () => predictedLeavers.filter((l) => l.status !== 'Offboarded'),
    [predictedLeavers]
  );

  const summary = useMemo(() => {
    const allChanges = activeUpcoming.flatMap((l) => l.calculatedChanges);
    const accountDisables = allChanges.filter((c) => c.category === 'Account Disable').length;
    const roleRevokes = allChanges.filter((c) => c.category === 'Role / Entitlement Revoke').length;
    const licenseReclaims = allChanges.filter((c) => c.category === 'License Reclaim');
    const handoffs = allChanges.filter((c) => c.category === 'Ownership Handoff').length;
    const monthlySavings = licenseReclaims.reduce(
      (sum, c) => sum + (c.monthlySavingsZar ?? 0),
      0
    );

    return {
      upcomingCount: activeUpcoming.length,
      within14Days: activeUpcoming.filter((l) => l.daysUntilExit <= 14).length,
      totalChanges: allChanges.length,
      accountDisables,
      roleRevokes,
      licenseReclaimCount: licenseReclaims.length,
      handoffs,
      monthlySavings,
    };
  }, [activeUpcoming]);

  const inspected: DemoPredictedLeaver | null =
    predictedLeavers.find((l) => l.id === inspectId) ?? null;

  return (
    <div className="space-y-4">
      {/* Header + Horizon Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <CalendarClock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-[#0F172A]">
              Predicted / Future Leavers &amp; Calculated Offboarding Changes
            </h2>
            <p className="text-xs text-slate-500">
              Proactively calculates every target account disable, role revocation, license reclaim, and governance ownership handoff before scheduled exit dates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'All', label: 'All Upcoming' },
              { id: '7d', label: 'Next 7d' },
              { id: '30d', label: 'Next 30d' },
              { id: '90d', label: 'Next 90d' },
            ] as const
          ).map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setHorizon(h.id)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                horizon === h.id
                  ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Predictive Impact KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Predicted Future Leavers
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">
              {summary.upcomingCount}
            </span>
            <span className="font-mono text-[11px] font-semibold text-amber-600">
              {summary.within14Days} within 14d
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Total Calculated Changes
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {summary.totalChanges}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {summary.accountDisables} accts · {summary.roleRevokes} roles
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Licenses Scheduled for Reclaim
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-emerald-600">
              {summary.licenseReclaimCount}
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-700">
              {currency}
              {summary.monthlySavings.toLocaleString()}/mo saved
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Ownership Handoffs Required
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                summary.handoffs > 0 ? 'text-indigo-600' : 'text-emerald-600'
              )}
            >
              {summary.handoffs}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Reports, Apps &amp; NHIs
            </span>
          </div>
        </div>
      </div>

      {/* Predicted Leavers Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Predicted Leaver</th>
                <th className="px-4 py-3">Scheduled Exit &amp; Source</th>
                <th className="px-4 py-3">Calculated Exit Changes</th>
                <th className="px-4 py-3">License Savings</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((leaver) => {
                const acctCount = leaver.calculatedChanges.filter(
                  (c) => c.category === 'Account Disable'
                ).length;
                const roleCount = leaver.calculatedChanges.filter(
                  (c) => c.category === 'Role / Entitlement Revoke'
                ).length;
                const licCount = leaver.calculatedChanges.filter(
                  (c) => c.category === 'License Reclaim'
                ).length;
                const handoffCount = leaver.calculatedChanges.filter(
                  (c) => c.category === 'Ownership Handoff'
                ).length;
                const savings = leaver.calculatedChanges.reduce(
                  (sum, c) => sum + (c.monthlySavingsZar ?? 0),
                  0
                );

                return (
                  <tr
                    key={leaver.id}
                    className={cn(
                      'hover:bg-slate-50/70',
                      leaver.daysUntilExit <= 7 &&
                        leaver.status === 'Predicted' &&
                        'bg-amber-50/20'
                    )}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-heading font-bold text-[#0F172A]">
                          {leaver.identityName}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                          {leaver.employeeNumber}
                        </span>
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#0284C7]">
                          {leaver.identityType}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        {leaver.title} · {leaver.department}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#0F172A]">
                          {leaver.scheduledExitDate}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                            leaver.daysUntilExit <= 7
                              ? 'bg-rose-100 text-rose-700'
                              : leaver.daysUntilExit <= 21
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          in {leaver.daysUntilExit}d
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {leaver.predictionSource} ({leaver.confidencePct}%)
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#0F172A]">
                          {leaver.calculatedChanges.length} total:
                        </span>
                        {acctCount > 0 && (
                          <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-rose-700">
                            {acctCount} Account{acctCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {roleCount > 0 && (
                          <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber-800">
                            {roleCount} Role{roleCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {licCount > 0 && (
                          <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-700">
                            {licCount} License{licCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {handoffCount > 0 && (
                          <span className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-indigo-700">
                            {handoffCount} Handoff
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <span className="font-bold text-emerald-700">
                        {currency}
                        {savings.toLocaleString()}/mo
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                          leaver.status === 'Offboarded'
                            ? 'bg-emerald-50 text-emerald-700'
                            : leaver.status === 'Pre-Staged (Simulation)'
                              ? 'bg-sky-50 text-[#0284C7]'
                              : 'bg-amber-50 text-amber-700'
                        )}
                      >
                        {leaver.status}
                      </span>
                      {leaver.stagedJobCodes && leaver.stagedJobCodes.length > 0 && (
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() => setActiveSection('provisioning-engine')}
                            className="inline-flex cursor-pointer items-center gap-0.5 font-mono text-[10px] font-semibold text-[#0284C7] hover:underline"
                          >
                            <span>{leaver.stagedJobCodes.length} Provisioning Job(s)</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setInspectId(leaver.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Calculated Changes</span>
                        </button>
                        {leaver.status === 'Predicted' && (
                          <button
                            type="button"
                            onClick={() => stagePredictedLeaverInSimulation(leaver.id)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#0284C7] hover:bg-sky-100"
                          >
                            <FlaskConical className="h-3 w-3" />
                            <span>Pre-Stage</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radix Slide-Over: Detailed Calculated Exit Changes Inspector */}
      <Dialog.Root
        open={Boolean(inspected)}
        onOpenChange={(open) => {
          if (!open) setInspectId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspected && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>{inspected.employeeNumber}</span>
                      <span>·</span>
                      <span>{inspected.identityType}</span>
                      <span>·</span>
                      <span className="text-amber-700">
                        Exit {inspected.scheduledExitDate} (in {inspected.daysUntilExit}d)
                      </span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {inspected.identityName} — Calculated Exit Plan
                    </Dialog.Title>
                    <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                      {inspected.title} · {inspected.department} · Manager: {inspected.manager} · Source: {inspected.predictionSource}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close calculated exit changes"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-xs">
                  <div className="grid grid-cols-3 gap-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5 text-center">
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Calculated Actions
                      </div>
                      <div className="mt-0.5 font-display text-xl font-extrabold text-[#0F172A]">
                        {inspected.calculatedChanges.length}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Monthly Savings
                      </div>
                      <div className="mt-0.5 font-display text-xl font-extrabold text-emerald-600">
                        {currency}
                        {inspected.calculatedChanges
                          .reduce((s, c) => s + (c.monthlySavingsZar ?? 0), 0)
                          .toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Execution State
                      </div>
                      <div className="mt-1 font-mono text-xs font-bold text-[#0284C7]">
                        {inspected.status}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Target System &amp; Governance Changes Calculated ({inspected.calculatedChanges.length})
                    </div>

                    {inspected.calculatedChanges.map((chg) => (
                      <div
                        key={chg.id}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
                                categoryBadgeClass(chg.category)
                              )}
                            >
                              {chg.category === 'Account Disable' && (
                                <UserMinus className="h-2.5 w-2.5" />
                              )}
                              {chg.category === 'Role / Entitlement Revoke' && (
                                <KeyRound className="h-2.5 w-2.5" />
                              )}
                              {chg.category === 'License Reclaim' && (
                                <CreditCard className="h-2.5 w-2.5" />
                              )}
                              {chg.category === 'Ownership Handoff' && (
                                <Users className="h-2.5 w-2.5" />
                              )}
                              <span>{chg.category}</span>
                            </span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                              {chg.targetSystem}
                            </span>
                          </div>
                          {chg.monthlySavingsZar && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                              +{currency}
                              {chg.monthlySavingsZar.toLocaleString()}/mo saved
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 font-heading text-sm font-bold text-[#0F172A]">
                          {chg.objectName}
                        </div>
                        <p className="mt-0.5 text-slate-600">{chg.detail}</p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 rounded-lg bg-[#F8FAFC] px-3 py-2 font-mono text-[11px]">
                          <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-slate-600 line-through">
                            {chg.beforeValue}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-800">
                            {chg.afterValue}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-[#F8FAFC] px-6 py-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    {inspected.status === 'Offboarded' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-emerald-700">
                          All calculated exit actions executed cleanly.
                        </span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <span>
                          Pre-stage jobs in Simulation Mode or execute early offboard now.
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {inspected.status === 'Predicted' && (
                      <button
                        type="button"
                        onClick={() => stagePredictedLeaverInSimulation(inspected.id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0284C7] hover:bg-sky-50"
                      >
                        <FlaskConical className="h-3.5 w-3.5" />
                        <span>Stage in Simulation</span>
                      </button>
                    )}
                    {inspected.status !== 'Offboarded' && (
                      <button
                        type="button"
                        onClick={() => executePredictedLeaverExitNow(inspected.id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Execute Offboard Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
