import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FlaskConical,
  Plus,
  Radar,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  DemoGovernanceControl,
  GovernanceControlDomain,
} from '@/data/demoSampleData';
import { Dialog, Switch } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type StatusFilter = 'All' | 'Violation' | 'Compliant';
type EnforcementFilter =
  | 'All'
  | 'Both Active'
  | 'Preventative Active'
  | 'Detective Only';

const DOMAINS: GovernanceControlDomain[] = [
  'Ownership',
  'Identity Hygiene',
  'Account Integrity',
  'Access Hygiene',
  'Non-Human Governance',
];

export function GovernanceAssuranceView() {
  const governanceControls = useDemoStore((s) => s.governanceControls);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const toggleGovernanceControlEnforcement = useDemoStore(
    (s) => s.toggleGovernanceControlEnforcement
  );
  const remediateGovernanceViolation = useDemoStore(
    (s) => s.remediateGovernanceViolation
  );
  const remediateAllControlViolations = useDemoStore(
    (s) => s.remediateAllControlViolations
  );
  const runGovernanceDetectiveScan = useDemoStore(
    (s) => s.runGovernanceDetectiveScan
  );
  const addGovernanceControl = useDemoStore((s) => s.addGovernanceControl);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [enforcementFilter, setEnforcementFilter] =
    useState<EnforcementFilter>('All');
  const [inspectControlId, setInspectControlId] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);

  // Live preventative test banner state
  const [preventativeTestBanner, setPreventativeTestBanner] = useState<{
    code: string;
    name: string;
    blocked: boolean;
    attemptedAction: string;
    outcome: string;
  } | null>(null);

  // New Control Builder state
  const [draftName, setDraftName] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftDomain, setDraftDomain] = useState<GovernanceControlDomain>('Ownership');
  const [draftSeverity, setDraftSeverity] = useState<'Critical' | 'High' | 'Medium'>('High');
  const [draftPrev, setDraftPrev] = useState(true);
  const [draftDet, setDraftDet] = useState(true);

  const openViolationsFor = (ctrl: DemoGovernanceControl) =>
    ctrl.detectiveEnabled ? ctrl.violations.filter((v) => !v.resolved) : [];

  const metrics = useMemo(() => {
    const totalViolations = governanceControls.reduce(
      (sum, ctrl) => sum + openViolationsFor(ctrl).length,
      0
    );
    const preventativeActive = governanceControls.filter(
      (c) => c.preventativeEnabled
    ).length;
    const detectiveActive = governanceControls.filter(
      (c) => c.detectiveEnabled
    ).length;
    // Calibrated so 12 baseline violations = 98% Governance compliance, 0 violations = 100%
    const compliancePct = Math.max(
      75,
      Math.min(100, Math.round(100 - totalViolations * (2 / 12)))
    );

    return {
      totalViolations,
      compliancePct,
      preventativeActive,
      detectiveActive,
      totalControls: governanceControls.length,
    };
  }, [governanceControls]);

  const filteredControls = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return governanceControls.filter((ctrl) => {
      const openCount = openViolationsFor(ctrl).length;
      const isViolation = openCount > 0;

      if (statusFilter === 'Violation' && !isViolation) return false;
      if (statusFilter === 'Compliant' && isViolation) return false;

      if (
        enforcementFilter === 'Both Active' &&
        !(ctrl.preventativeEnabled && ctrl.detectiveEnabled)
      ) {
        return false;
      }
      if (
        enforcementFilter === 'Preventative Active' &&
        !ctrl.preventativeEnabled
      ) {
        return false;
      }
      if (
        enforcementFilter === 'Detective Only' &&
        !(ctrl.detectiveEnabled && !ctrl.preventativeEnabled)
      ) {
        return false;
      }

      if (!needle) return true;
      const hay = [
        ctrl.code,
        ctrl.name,
        ctrl.description,
        ctrl.domain,
        ...ctrl.violations.map((v) => `${v.objectName} ${v.detail}`),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [governanceControls, statusFilter, enforcementFilter, searchQuery]);

  const inspectedControl: DemoGovernanceControl | null = inspectControlId
    ? (governanceControls.find((c) => c.id === inspectControlId) ?? null)
    : null;

  const runPreventativeGateTest = (ctrl: DemoGovernanceControl) => {
    setPreventativeTestBanner({
      code: ctrl.code,
      name: ctrl.name,
      blocked: ctrl.preventativeEnabled,
      attemptedAction: ctrl.preventativeTestExample.attemptedAction,
      outcome: ctrl.preventativeEnabled
        ? ctrl.preventativeTestExample.blockedMessage
        : ctrl.preventativeTestExample.allowedMessage,
    });
  };

  const handleSaveNewControl = () => {
    if (!draftName.trim() || !draftDescription.trim()) return;
    addGovernanceControl({
      name: draftName.trim(),
      description: draftDescription.trim(),
      domain: draftDomain,
      severity: draftSeverity,
      preventativeEnabled: draftPrev,
      detectiveEnabled: draftDet,
    });
    setDraftName('');
    setDraftDescription('');
    setDraftDomain('Ownership');
    setDraftSeverity('High');
    setDraftPrev(true);
    setDraftDet(true);
    setBuilderOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Governance Assurance
          </h1>
          <p className="text-sm text-slate-500">
            Configurable <strong className="text-slate-700">Governance Controls</strong> with independent{' '}
            <strong className="text-slate-700">Preventative</strong> (write-blocking) and{' '}
            <strong className="text-slate-700">Detective</strong> (continuous scan &amp; remediation) enforcement levels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runGovernanceDetectiveScan}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Run Detective Scan</span>
          </button>

          <button
            type="button"
            onClick={() => setBuilderOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Control</span>
          </button>
        </div>
      </div>

      {/* Platform Health Assurance Hero Strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
              Platform Health · Continuous Assurance Posture
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            {metrics.totalControls} Configurable Governance Controls
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Primary Metric 1: 98% Governance compliance */}
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-extrabold text-[#0284C7]">
                {metrics.compliancePct}%
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                {metrics.compliancePct === 100 ? 'Optimal' : 'Healthy'}
              </span>
            </div>
            <div className="mt-1 text-xs font-semibold text-[#0F172A]">
              Governance compliance
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-sky-100">
              <div
                className="h-full rounded-full bg-[#0EA5E9] transition-all duration-500"
                style={{ width: `${metrics.compliancePct}%` }}
              />
            </div>
          </div>

          {/* Primary Metric 2: 12 Governance violations */}
          <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4">
            <div className="flex items-baseline justify-between">
              <span
                className={cn(
                  'font-display text-3xl font-extrabold',
                  metrics.totalViolations > 0 ? 'text-rose-600' : 'text-emerald-600'
                )}
              >
                {metrics.totalViolations}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {metrics.totalViolations > 0 ? 'Flagged for action' : 'Zero open'}
              </span>
            </div>
            <div className="mt-1 text-xs font-semibold text-[#0F172A]">
              Governance violations
            </div>
            <div className="mt-1.5 text-[11px] text-slate-500">
              Detected across apps, identities &amp; NHIs
            </div>
          </div>

          {/* Enforcement Level 1: Preventative */}
          <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-extrabold text-[#0F172A]">
                {metrics.preventativeActive}
                <span className="text-base font-semibold text-slate-400">
                  /{metrics.totalControls}
                </span>
              </span>
              <ShieldCheck className="h-4 w-4 text-[#0EA5E9]" />
            </div>
            <div className="mt-1 text-xs font-semibold text-[#0F172A]">
              Preventative controls
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Stops violating creates &amp; modifications
            </div>
          </div>

          {/* Enforcement Level 2: Detective */}
          <div className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-extrabold text-[#0F172A]">
                {metrics.detectiveActive}
                <span className="text-base font-semibold text-slate-400">
                  /{metrics.totalControls}
                </span>
              </span>
              <Radar className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-1 text-xs font-semibold text-[#0F172A]">
              Detective controls
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Continuously scans existing data
            </div>
          </div>
        </div>
      </div>

      {/* Live Preventative Gate Simulation Result Banner */}
      {preventativeTestBanner && (
        <div
          className={cn(
            'flex items-start justify-between gap-3 rounded-2xl border px-4 py-3.5 text-xs shadow-xs',
            preventativeTestBanner.blocked
              ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
              : 'border-amber-200 bg-amber-50 text-amber-950'
          )}
        >
          <div className="flex items-start gap-2.5">
            {preventativeTestBanner.blocked ? (
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            )}
            <div className="space-y-0.5">
              <div className="font-mono text-[10px] font-bold uppercase">
                Preventative Gate Test · {preventativeTestBanner.code} ({preventativeTestBanner.name})
              </div>
              <div className="font-mono text-[11px] opacity-80">
                Attempted: {preventativeTestBanner.attemptedAction}
              </div>
              <div className="font-semibold">{preventativeTestBanner.outcome}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPreventativeTestBanner(null)}
            className="cursor-pointer rounded p-1 opacity-70 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Clean Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Violation', 'Compliant'] as StatusFilter[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                statusFilter === st
                  ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {st === 'All' ? 'All Controls' : st === 'Violation' ? 'Violations' : 'Compliant'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              'All',
              'Both Active',
              'Preventative Active',
              'Detective Only',
            ] as EnforcementFilter[]
          ).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setEnforcementFilter(mode)}
              className={cn(
                'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                enforcementFilter === mode
                  ? 'border-[#0F172A] bg-[#0F172A] font-semibold text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {mode === 'All' ? 'All Enforcement Levels' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Configurable Governance Control Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filteredControls.map((ctrl) => {
          const openViolations = openViolationsFor(ctrl);
          const hasViolation = openViolations.length > 0;

          return (
            <div
              key={ctrl.id}
              className={cn(
                'flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all',
                hasViolation
                  ? 'border-rose-200/80 hover:border-rose-300'
                  : 'border-slate-200 hover:border-sky-200'
              )}
            >
              <div>
                {/* Top Row: Code + Name + Compliant/Violation Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {ctrl.code}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                        {ctrl.domain}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                          ctrl.severity === 'Critical'
                            ? 'bg-rose-50 text-rose-600'
                            : ctrl.severity === 'High'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {ctrl.severity}
                      </span>
                    </div>
                    <h2 className="mt-1.5 font-heading text-base font-bold text-[#0F172A]">
                      {ctrl.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-600">{ctrl.description}</p>
                  </div>

                  {hasViolation ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-mono text-[11px] font-bold text-rose-700 ring-1 ring-rose-200">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>
                        Violation ({openViolations.length})
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Compliant</span>
                    </span>
                  )}
                </div>

                {/* Configurable Two-Level Enforcement Panel */}
                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {/* Level 1: Preventative */}
                  <div
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-xl border p-3 transition-colors',
                      ctrl.preventativeEnabled
                        ? 'border-sky-200/80 bg-sky-50/40'
                        : 'border-slate-200/70 bg-[#F8FAFC]'
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0F172A] uppercase">
                        <ShieldCheck
                          className={cn(
                            'h-3.5 w-3.5',
                            ctrl.preventativeEnabled ? 'text-[#0EA5E9]' : 'text-slate-400'
                          )}
                        />
                        <span>1. Preventative</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        Blocks violating writes
                      </div>
                    </div>
                    <Switch.Root
                      checked={ctrl.preventativeEnabled}
                      onCheckedChange={() =>
                        toggleGovernanceControlEnforcement(ctrl.id, 'preventative')
                      }
                      aria-label={`Toggle Preventative enforcement for ${ctrl.name}`}
                      className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>

                  {/* Level 2: Detective */}
                  <div
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-xl border p-3 transition-colors',
                      ctrl.detectiveEnabled
                        ? 'border-indigo-200/80 bg-indigo-50/40'
                        : 'border-slate-200/70 bg-[#F8FAFC]'
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0F172A] uppercase">
                        <Radar
                          className={cn(
                            'h-3.5 w-3.5',
                            ctrl.detectiveEnabled ? 'text-indigo-600' : 'text-slate-400'
                          )}
                        />
                        <span>2. Detective</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        Scans &amp; flags existing data
                      </div>
                    </div>
                    <Switch.Root
                      checked={ctrl.detectiveEnabled}
                      onCheckedChange={() =>
                        toggleGovernanceControlEnforcement(ctrl.id, 'detective')
                      }
                      aria-label={`Toggle Detective enforcement for ${ctrl.name}`}
                      className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-indigo-600"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 text-xs">
                <span className="font-mono text-[10px] text-slate-400">
                  {ctrl.totalEvaluated.toLocaleString()} {ctrl.evaluatedUnit} · Scanned{' '}
                  {ctrl.lastScanAt}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => runPreventativeGateTest(ctrl)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                  >
                    <FlaskConical className="h-3 w-3 text-[#0EA5E9]" />
                    <span>Test Preventative</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectControlId(ctrl.id)}
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors',
                      hasViolation
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'border border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]'
                    )}
                  >
                    <span>{hasViolation ? 'Remediate' : 'Inspect'}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radix Slide-Over Control Inspector & Violation Remediation Drawer */}
      <Dialog.Root
        open={Boolean(inspectedControl)}
        onOpenChange={(open) => {
          if (!open) setInspectControlId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspectedControl && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>{inspectedControl.code}</span>
                      <span>·</span>
                      <span>{inspectedControl.domain}</span>
                      <span>·</span>
                      <span>{inspectedControl.severity} Severity</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {inspectedControl.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-slate-500">
                      {inspectedControl.description}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close governance control inspector"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-xs">
                  {/* Enforcement Configuration Summary */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-mono text-[10px] font-bold text-[#0F172A] uppercase">
                          Preventative
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {inspectedControl.preventativeEnabled ? 'Blocking writes' : 'Disabled'}
                        </div>
                      </div>
                      <Switch.Root
                        checked={inspectedControl.preventativeEnabled}
                        onCheckedChange={() =>
                          toggleGovernanceControlEnforcement(inspectedControl.id, 'preventative')
                        }
                        className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                      >
                        <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                      </Switch.Root>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-l border-slate-200 pl-3">
                      <div>
                        <div className="font-mono text-[10px] font-bold text-[#0F172A] uppercase">
                          Detective
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {inspectedControl.detectiveEnabled ? 'Scanning continuously' : 'Paused'}
                        </div>
                      </div>
                      <Switch.Root
                        checked={inspectedControl.detectiveEnabled}
                        onCheckedChange={() =>
                          toggleGovernanceControlEnforcement(inspectedControl.id, 'detective')
                        }
                        className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-indigo-600"
                      >
                        <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                      </Switch.Root>
                    </div>
                  </div>

                  {/* Detective Findings & Remediation Queue */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Detective Scan Findings ({openViolationsFor(inspectedControl).length} Open)
                      </span>
                      {openViolationsFor(inspectedControl).length > 0 && (
                        <button
                          type="button"
                          onClick={() => remediateAllControlViolations(inspectedControl.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0EA5E9] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#0284C7]"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Auto-Remediate All</span>
                        </button>
                      )}
                    </div>

                    {!inspectedControl.detectiveEnabled ? (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                        <ShieldOff className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>
                          Detective scanning is paused for this control. Enable <strong>Detective</strong> above to continuously flag existing data violations.
                        </span>
                      </div>
                    ) : inspectedControl.violations.length === 0 ||
                      openViolationsFor(inspectedControl).length === 0 ? (
                      <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                        <div className="font-heading text-sm font-bold text-[#0F172A]">
                          100% Compliant Across {inspectedControl.totalEvaluated.toLocaleString()}{' '}
                          {inspectedControl.evaluatedUnit}
                        </div>
                        <p className="text-xs text-slate-600">
                          Zero unresolved governance violations detected under {inspectedControl.code}.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2.5">
                        {inspectedControl.violations.map((v) => (
                          <div
                            key={v.id}
                            className={cn(
                              'rounded-xl border p-4 transition-all',
                              v.resolved
                                ? 'border-emerald-200 bg-emerald-50/40'
                                : 'border-rose-200/80 bg-white'
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-600 uppercase">
                                    {v.objectType}
                                  </span>
                                  <span className="font-heading text-sm font-bold text-[#0F172A]">
                                    {v.objectName}
                                  </span>
                                </div>
                                <p className="mt-1 text-slate-600">{v.detail}</p>
                                <div className="mt-1.5 font-mono text-[10px] text-slate-400">
                                  Detected: {v.detectedAt} · Suggested Fix:{' '}
                                  <span className="font-semibold text-slate-700">
                                    {v.suggestedFix}
                                  </span>
                                </div>
                              </div>

                              {v.resolved ? (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Resolved</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    remediateGovernanceViolation(inspectedControl.id, v.id)
                                  }
                                  className="shrink-0 cursor-pointer rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                                >
                                  Remediate
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Radix Modal: Create Configurable Governance Control */}
      <Dialog.Root open={builderOpen} onOpenChange={setBuilderOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    Governance Assurance
                  </div>
                  <Dialog.Title className="font-display text-lg font-extrabold text-[#0F172A]">
                    New Governance Control
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500">
                    Define a custom assurance rule and select Preventative and/or Detective enforcement.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close control builder"
                    className="cursor-pointer rounded-lg border border-slate-200 p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Control Name *
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="e.g. Contractor End Date Mandatory"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Governance Requirement *
                  </label>
                  <input
                    type="text"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="e.g. Every external contractor must have a fixed HR end date ≤ 90 days."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Domain
                    </label>
                    <select
                      value={draftDomain}
                      onChange={(e) =>
                        setDraftDomain(e.target.value as GovernanceControlDomain)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                    >
                      {DOMAINS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Severity
                    </label>
                    <select
                      value={draftSeverity}
                      onChange={(e) =>
                        setDraftSeverity(e.target.value as 'Critical' | 'High' | 'Medium')
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-[#0F172A]">1. Preventative Control</div>
                      <div className="text-[11px] text-slate-500">
                        Stop users from creating or modifying violating records
                      </div>
                    </div>
                    <Switch.Root
                      checked={draftPrev}
                      onCheckedChange={setDraftPrev}
                      className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-200/70 pt-2.5">
                    <div>
                      <div className="font-semibold text-[#0F172A]">2. Detective Control</div>
                      <div className="text-[11px] text-slate-500">
                        Continuously scan existing data &amp; flag violations
                      </div>
                    </div>
                    <Switch.Root
                      checked={draftDet}
                      onCheckedChange={setDraftDet}
                      className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-indigo-600"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleSaveNewControl}
                  disabled={!draftName.trim() || !draftDescription.trim()}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7] disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Create Control</span>
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
