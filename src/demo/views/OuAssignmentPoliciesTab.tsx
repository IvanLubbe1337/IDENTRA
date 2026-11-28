import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  FolderTree,
  Info,
  Layers,
  Play,
  Plus,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import {
  evaluateOuAssignmentForProfile,
  type DemoOuAssignmentPolicy,
  type OuAssignmentCondition,
  type OuLifecycleIdentityProfile,
  type OuPolicyAttributeField,
} from '@/data/demoSampleData';
import { Dialog, Switch } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const FIELD_LABELS: Record<OuPolicyAttributeField, string> = {
  department: 'Department',
  company: 'Company',
  employeeType: 'Employee Type',
  lifecycleStatus: 'Lifecycle Status',
  location: 'Location',
};

const LIFECYCLE_PRESETS: {
  id: string;
  label: string;
  identityLabel: string;
  previousOuShort: string;
  profile: OuLifecycleIdentityProfile;
}[] = [
  {
    id: 'mover',
    label: 'Mover: Company A Finance → Company B IT',
    identityLabel: 'Sipho Dlamini (EMP-10691)',
    previousOuShort: 'CompanyA/Finance',
    profile: {
      company: 'Company B',
      department: 'IT',
      employeeType: 'Permanent',
      lifecycleStatus: 'Mover',
      location: 'Johannesburg',
    },
  },
  {
    id: 'joiner',
    label: 'Joiner: Company A Finance (FTE)',
    identityLabel: 'Jane Doe (EMP-10944)',
    previousOuShort: 'New AD Account (Create)',
    profile: {
      company: 'Company A',
      department: 'Finance',
      employeeType: 'Permanent',
      lifecycleStatus: 'Joiner',
      location: 'Johannesburg',
    },
  },
  {
    id: 'leaver',
    label: 'Leaver: Quarantine to DisabledUsers',
    identityLabel: 'Mark Wilson (CTR-90114)',
    previousOuShort: 'External Contractors',
    profile: {
      company: 'Company A',
      department: 'Finance',
      employeeType: 'Contractor',
      lifecycleStatus: 'Leaver',
      location: 'London, UK (HQ)',
    },
  },
  {
    id: 'rehire',
    label: 'Rehire: Restore Company A Finance',
    identityLabel: 'Nadia Patel (EMP-10718)',
    previousOuShort: 'DisabledUsers',
    profile: {
      company: 'Company A',
      department: 'Finance',
      employeeType: 'Permanent',
      lifecycleStatus: 'Rehire',
      location: 'Johannesburg',
    },
  },
  {
    id: 'fallback',
    label: 'Unmatched: Default Fallback OU',
    identityLabel: 'External Intern (INT-2091)',
    previousOuShort: 'New AD Account (Create)',
    profile: {
      company: 'Company C',
      department: 'Legal',
      employeeType: 'Intern',
      lifecycleStatus: 'Active',
      location: 'Cape Town',
    },
  },
];

export function OuAssignmentPoliciesTab({
  onOpenOuProvisioning,
}: {
  onOpenOuProvisioning: () => void;
}) {
  const adOus = useDemoStore((s) => s.adOus);
  const people = useDemoStore((s) => s.people);
  const ouAssignmentPolicies = useDemoStore((s) => s.ouAssignmentPolicies);
  const manualOuOverrides = useDemoStore((s) => s.manualOuOverrides);
  const defaultFallbackOuDn = useDemoStore((s) => s.defaultFallbackOuDn);

  const toggleOuPolicyStatus = useDemoStore((s) => s.toggleOuPolicyStatus);
  const updateOuPolicyPriority = useDemoStore((s) => s.updateOuPolicyPriority);
  const createOuAssignmentPolicy = useDemoStore((s) => s.createOuAssignmentPolicy);
  const commitOuPolicySimulation = useDemoStore((s) => s.commitOuPolicySimulation);
  const executeLifecycleOuMove = useDemoStore((s) => s.executeLifecycleOuMove);
  const updateDefaultFallbackOu = useDemoStore((s) => s.updateDefaultFallbackOu);
  const addManualOuOverride = useDemoStore((s) => s.addManualOuOverride);
  const revokeManualOuOverride = useDemoStore((s) => s.revokeManualOuOverride);

  // Interactive Lifecycle Reassignment Simulator State
  const [simIdentityLabel, setSimIdentityLabel] = useState(
    LIFECYCLE_PRESETS[0].identityLabel
  );
  const [simBeforeOu, setSimBeforeOu] = useState(LIFECYCLE_PRESETS[0].previousOuShort);
  const [simProfile, setSimProfile] = useState<OuLifecycleIdentityProfile>(
    LIFECYCLE_PRESETS[0].profile
  );

  // Modals
  const [simulatePolicyId, setSimulatePolicyId] = useState<string | null>(null);
  const [newPolicyModalOpen, setNewPolicyModalOpen] = useState(false);
  const [newOverrideModalOpen, setNewOverrideModalOpen] = useState(false);

  // New Policy Builder State
  const [draftName, setDraftName] = useState('');
  const [draftPriority, setDraftPriority] = useState(100);
  const [draftTargetOuId, setDraftTargetOuId] = useState('ou-comp-a-fin');
  const [draftFilters, setDraftFilters] = useState<OuAssignmentCondition[]>([
    { id: 'df-1', field: 'department', operator: 'Equals', value: 'Finance' },
    { id: 'df-2', field: 'company', operator: 'Equals', value: 'Company A' },
  ]);

  // New Manual Override State
  const [ovPersonId, setOvPersonId] = useState(people[0]?.id ?? 'p-sarah');
  const [ovTargetOuId, setOvTargetOuId] = useState('ou-fin-lon');
  const [ovReason, setOvReason] = useState('');
  const [ovApprovedBy, setOvApprovedBy] = useState('Claire Vance (Finance Manager)');
  const [ovExpiresOn, setOvExpiresOn] = useState('2027-03-31');

  const managedOus = useMemo(
    () => adOus.filter((o) => o.governanceState === 'Managed'),
    [adOus]
  );

  const liveResolution = useMemo(
    () =>
      evaluateOuAssignmentForProfile(
        simProfile,
        ouAssignmentPolicies,
        defaultFallbackOuDn
      ),
    [simProfile, ouAssignmentPolicies, defaultFallbackOuDn]
  );

  const simulatedPolicy: DemoOuAssignmentPolicy | null = simulatePolicyId
    ? (ouAssignmentPolicies.find((p) => p.id === simulatePolicyId) ?? null)
    : null;

  const handleSaveNewPolicy = () => {
    if (!draftName.trim() || draftFilters.length === 0) return;
    createOuAssignmentPolicy({
      name: draftName,
      priority: draftPriority,
      targetOuId: draftTargetOuId,
      filters: draftFilters,
    });
    setDraftName('');
    setDraftPriority(100);
    setNewPolicyModalOpen(false);
  };

  const handleSaveOverride = () => {
    const person = people.find((p) => p.id === ovPersonId);
    if (!person || !ovReason.trim()) return;
    addManualOuOverride({
      identityName: person.name,
      employeeNumber: person.employeeNumber,
      normalPolicyName: 'Finance – Company A (OUP-101)',
      normalPolicyOuShort: 'CompanyA/Finance',
      overrideTargetOuId: ovTargetOuId,
      reason: ovReason,
      approvedBy: ovApprovedBy,
      expiresOn: ovExpiresOn,
    });
    setOvReason('');
    setNewOverrideModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Architecture Distinction + Default Fallback OU Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-heading text-base font-bold text-[#0F172A]">
              <SlidersHorizontal className="h-4 w-4 text-[#0EA5E9]" />
              <span>Policy-Driven OU Assignment Engine</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Automatically resolves an identity&apos;s AD container location from identity attributes across{' '}
              <strong>Joiners, Movers, Leavers, and Rehires</strong>. An OU is a{' '}
              <strong>container location, not an entitlement</strong> — OU Assignment never silently creates missing OUs (use{' '}
              <button
                type="button"
                onClick={onOpenOuProvisioning}
                className="cursor-pointer font-semibold text-[#0284C7] hover:underline"
              >
                OU Provisioning Requests
              </button>{' '}
              to create new structure).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewPolicyModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New OU Assignment Policy</span>
          </button>
        </div>

        {/* Configurable Default Fallback OU */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0 text-[#0284C7]" />
            <div>
              <span className="font-semibold text-[#0F172A]">Default Fallback OU:</span>{' '}
              <span className="text-slate-500">
                Applied when an identity matches zero active policies (prevents arbitrary placement).
              </span>
            </div>
          </div>
          <select
            aria-label="Default Fallback OU"
            value={defaultFallbackOuDn}
            onChange={(e) => updateDefaultFallbackOu(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-[#0284C7]"
          >
            {managedOus.map((ou) => (
              <option key={ou.id} value={ou.distinguishedName}>
                {ou.distinguishedName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive OU Reassignment Lifecycle Simulator (Before → Policy Evaluation → After) */}
      <div className="rounded-2xl border border-sky-200/80 bg-[#F8FBFF] p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-mono text-[10px] font-bold tracking-wider text-[#0284C7] uppercase">
              Live OU Reassignment Lifecycle Simulator (Joiner · Mover · Leaver · Rehire)
            </div>
            <p className="mt-0.5 text-xs text-slate-600">
              Test how attribute changes re-evaluate OU policies, resolve priority, detect equal-priority conflicts, or fall back to Staging/Unclassified.
            </p>
          </div>
        </div>

        {/* 1-Click Scenario Presets */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {LIFECYCLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setSimIdentityLabel(preset.identityLabel);
                setSimBeforeOu(preset.previousOuShort);
                setSimProfile(preset.profile);
              }}
              className="cursor-pointer rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold text-[#0284C7] transition-colors hover:bg-sky-50"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Live Attribute Controls + Before → Policy Eval → After Flow */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Editable Identity Attributes */}
          <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 text-xs lg:col-span-5">
            <div>
              <label className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                Company
              </label>
              <select
                value={simProfile.company}
                onChange={(e) =>
                  setSimProfile((p) => ({ ...p, company: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-semibold text-[#0F172A]"
              >
                <option value="Company A">Company A</option>
                <option value="Company B">Company B</option>
                <option value="Company C">Company C (Unmatched)</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                Department
              </label>
              <select
                value={simProfile.department}
                onChange={(e) =>
                  setSimProfile((p) => ({ ...p, department: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-semibold text-[#0F172A]"
              >
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                <option value="Legal">Legal (Unmatched)</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                Employee Type
              </label>
              <select
                value={simProfile.employeeType}
                onChange={(e) =>
                  setSimProfile((p) => ({ ...p, employeeType: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-semibold text-[#0F172A]"
              >
                <option value="Permanent">Permanent</option>
                <option value="Contractor">Contractor</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                Lifecycle Status
              </label>
              <select
                value={simProfile.lifecycleStatus}
                onChange={(e) =>
                  setSimProfile((p) => ({
                    ...p,
                    lifecycleStatus: e.target.value as OuLifecycleIdentityProfile['lifecycleStatus'],
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-semibold text-[#0F172A]"
              >
                <option value="Active">Active</option>
                <option value="Joiner">Joiner</option>
                <option value="Mover">Mover</option>
                <option value="Leaver">Leaver</option>
                <option value="Rehire">Rehire</option>
              </select>
            </div>
          </div>

          {/* Before → Evaluation → After Result */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-xs lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">
                  Before: {simBeforeOu}
                </span>
                <ArrowRight className="h-4 w-4 text-[#0EA5E9]" />
                <span
                  className={cn(
                    'rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold',
                    liveResolution.outcome === 'Priority Conflict (Exception)'
                      ? 'bg-rose-100 text-rose-700'
                      : liveResolution.outcome === 'Default Fallback OU'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  )}
                >
                  After: {liveResolution.resolvedOuShort}
                </span>
              </div>

              <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0284C7]">
                {liveResolution.outcome}
              </span>
            </div>

            <div className="mt-2 font-mono text-[11px] text-[#0284C7] break-all">
              Target DN: {liveResolution.resolvedDn}
            </div>
            <p className="mt-1 text-[11px] text-slate-600">{liveResolution.explanation}</p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
              <span className="font-mono text-[10px] text-slate-400">
                Subject: {simIdentityLabel}
              </span>
              {liveResolution.outcome !== 'Priority Conflict (Exception)' && (
                <button
                  type="button"
                  onClick={() => {
                    executeLifecycleOuMove({
                      identityLabel: simIdentityLabel,
                      fromOuShort: simBeforeOu,
                      toOuShort: liveResolution.resolvedOuShort,
                      toDn: liveResolution.resolvedDn,
                      policyCode: liveResolution.winningPolicy?.code ?? 'DEFAULT-FALLBACK',
                    });
                    setSimBeforeOu(liveResolution.resolvedOuShort);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0EA5E9]"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Execute AD Account Move</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OU Assignment Policy Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {ouAssignmentPolicies.map((pol) => {
          const isPaused = pol.status === 'Paused';
          const targetExists = adOus.some((o) => o.id === pol.targetOuId);
          return (
            <div
              key={pol.id}
              className={cn(
                'flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all',
                isPaused
                  ? 'border-slate-200/80 opacity-75'
                  : 'border-slate-200 hover:border-sky-200'
              )}
            >
              <div>
                {/* Policy Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {pol.code}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                          pol.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {pol.status}
                      </span>
                      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700">
                        Priority {pol.priority}
                      </span>
                      {pol.simulationBaseline.conflictsCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {pol.simulationBaseline.conflictsCount} conflicts
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 font-heading text-base font-bold text-[#0F172A]">
                      {pol.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateOuPolicyPriority(pol.id, pol.priority + 10)}
                      title="Increase policy priority by +10"
                      className="cursor-pointer rounded-md border border-slate-200 bg-[#F8FAFC] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                    >
                      +10 Pri
                    </button>
                    <Switch.Root
                      checked={pol.status === 'Active'}
                      onCheckedChange={() => toggleOuPolicyStatus(pol.id)}
                      aria-label={`Toggle ${pol.name}`}
                      className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>
                </div>

                {/* Identity Filters */}
                <div className="mt-3.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
                  <div className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Identity Filters (Match ALL)
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {pol.filters.map((f, idx) => (
                      <div key={f.id} className="inline-flex items-center gap-1.5">
                        {idx > 0 && (
                          <span className="font-mono text-[9px] font-bold text-slate-400">
                            AND
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-700">
                          <strong className="text-[#0F172A]">{FIELD_LABELS[f.field]}</strong>
                          <span className="text-[#0284C7]">{f.operator}</span>
                          <span>&quot;{f.value}&quot;</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target OU Container */}
                <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/40 p-3 text-xs">
                  <div className="flex items-center justify-between font-mono text-[9px] font-bold text-[#0284C7] uppercase">
                    <span className="inline-flex items-center gap-1">
                      <FolderTree className="h-3 w-3" />
                      Target OU Container
                    </span>
                    <span className={targetExists ? 'text-emerald-700' : 'text-rose-600'}>
                      {targetExists ? 'Validated Nested OU Hierarchy' : 'OU Missing — Provision First'}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-semibold text-[#0F172A] break-all">
                    {pol.targetDn}
                  </div>
                </div>

                {/* Assignment Behaviour */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                  {[
                    'Auto-assign on match',
                    'Re-evaluate on attribute change',
                    'Remove previous when inapplicable',
                    'Move AD account automatically',
                  ].map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: Simulation Metrics & CTA */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 text-xs">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span>
                    <strong className="text-[#0F172A]">
                      {pol.simulationBaseline.matchedCount}
                    </strong>{' '}
                    matched
                  </span>
                  <span>·</span>
                  <span
                    className={
                      pol.simulationBaseline.accountsToMove > 0
                        ? 'font-bold text-[#0284C7]'
                        : 'text-emerald-700'
                    }
                  >
                    {pol.simulationBaseline.accountsToMove} to move
                  </span>
                  <span>·</span>
                  <span>{pol.simulationBaseline.alreadyCompliant} compliant</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSimulatePolicyId(pol.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0EA5E9]"
                >
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span>Simulate Policy</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explicit Manual OU Overrides (Governed Exceptions) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Manual OU Overrides (Explicitly Approved Exceptions)</span>
            </div>
            <p className="text-xs text-slate-500">
              Legitimate business exceptions are explicitly tracked with approval reference and expiry — never silently superseding OU Assignment Policies.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNewOverrideModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Approved Override</span>
          </button>
        </div>

        <div className="mt-3 space-y-2.5">
          {manualOuOverrides.map((ov) => (
            <div
              key={ov.id}
              className={cn(
                'flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 text-xs',
                ov.status === 'Active Exception'
                  ? 'border-amber-200 bg-amber-50/40'
                  : 'border-slate-200 bg-slate-50 opacity-65'
              )}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                    {ov.approvalReference}
                  </span>
                  <span className="font-heading font-bold text-[#0F172A]">
                    {ov.identityName} ({ov.employeeNumber})
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
                      ov.status === 'Active Exception'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-600'
                    )}
                  >
                    {ov.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-slate-500">Policy OU: {ov.normalPolicyOuShort}</span>
                  <ArrowRight className="h-3 w-3 text-amber-600" />
                  <span className="font-bold text-amber-900">
                    Override Exception OU: {ov.overrideTargetShort}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  {ov.reason} · Approved by <strong>{ov.approvedBy}</strong> · Expires{' '}
                  <span className="font-mono">{ov.expiresOn}</span>
                </div>
              </div>

              {ov.status === 'Active Exception' && (
                <button
                  type="button"
                  onClick={() => revokeManualOuOverride(ov.id)}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-rose-300 hover:text-rose-600"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Revoke Exception</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Pre-Activation OU Policy Simulation */}
      <Dialog.Root
        open={Boolean(simulatedPolicy)}
        onOpenChange={(open) => {
          if (!open) setSimulatePolicyId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            {simulatedPolicy && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <FlaskConical className="h-3.5 w-3.5" />
                      <span>OU Policy Simulation · {simulatedPolicy.code}</span>
                    </div>
                    <Dialog.Title className="mt-0.5 font-display text-xl font-extrabold text-[#0F172A]">
                      {simulatedPolicy.name}
                    </Dialog.Title>
                    <Dialog.Description className="font-mono text-[11px] text-[#0284C7]">
                      Target: {simulatedPolicy.targetDn} (Priority {simulatedPolicy.priority})
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* 4 Simulation KPI Tiles */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-center">
                    <div className="font-display text-2xl font-extrabold text-[#0F172A]">
                      {simulatedPolicy.simulationBaseline.matchedCount}
                    </div>
                    <div className="text-[11px] text-slate-500">Identities matched</div>
                  </div>
                  <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center">
                    <div className="font-display text-2xl font-extrabold text-rose-600">
                      {simulatedPolicy.simulationBaseline.conflictsCount}
                    </div>
                    <div className="text-[11px] text-rose-700">Conflicts detected</div>
                  </div>
                  <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3 text-center">
                    <div className="font-display text-2xl font-extrabold text-[#0284C7]">
                      {simulatedPolicy.simulationBaseline.accountsToMove}
                    </div>
                    <div className="text-[11px] text-[#0284C7]">Accounts to move</div>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center">
                    <div className="font-display text-2xl font-extrabold text-emerald-700">
                      {simulatedPolicy.simulationBaseline.alreadyCompliant}
                    </div>
                    <div className="text-[11px] text-emerald-700">Already compliant</div>
                  </div>
                </div>

                {simulatedPolicy.simulationBaseline.conflictsCount > 0 && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <span>
                      <strong>
                        {simulatedPolicy.simulationBaseline.conflictsCount} conflicts require resolution:
                      </strong>{' '}
                      Identities matching multiple policies with identical effective priority ({simulatedPolicy.priority}) are placed in an exception hold until policy priority is adjusted.
                    </span>
                  </div>
                )}

                {/* Proposed Changes Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="border-b border-slate-100 bg-[#F8FAFC] px-4 py-2.5 font-mono text-[10px] font-bold text-slate-500 uppercase">
                    Proposed Changes
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 bg-white font-mono text-[10px] text-slate-400 uppercase">
                      <tr>
                        <th className="px-4 py-2.5">Identity</th>
                        <th className="px-4 py-2.5">Current OU</th>
                        <th className="px-4 py-2.5">Target OU</th>
                        <th className="px-4 py-2.5">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {simulatedPolicy.simulationBaseline.proposedMoves.map((mv) => (
                        <tr key={mv.id}>
                          <td className="px-4 py-2.5">
                            <div className="font-semibold text-[#0F172A]">{mv.identityName}</div>
                            <div className="font-mono text-[10px] text-slate-400">
                              {mv.employeeNumber}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-slate-600">
                            {mv.currentOuShort}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-[#0284C7]">
                            {mv.targetOuShort}
                          </td>
                          <td className="px-4 py-2.5">
                            {mv.status === 'Conflict' ? (
                              <span className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                                Conflict Hold
                              </span>
                            ) : (
                              <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                                Move Account
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {simulatedPolicy.simulationBaseline.proposedMoves.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-xs text-emerald-700">
                            All non-conflicting matched accounts are now compliant with {simulatedPolicy.code}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600"
                    >
                      Close
                    </button>
                  </Dialog.Close>
                  {simulatedPolicy.simulationBaseline.accountsToMove > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        commitOuPolicySimulation(simulatedPolicy.id);
                        setSimulatePolicyId(null);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0284C7]"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Execute Proposed AD Moves</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal 2: Create New OU Assignment Policy */}
      <Dialog.Root open={newPolicyModalOpen} onOpenChange={setNewPolicyModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    <Layers className="h-3.5 w-3.5" />
                    <span>New OU Assignment Policy</span>
                  </div>
                  <Dialog.Title className="mt-0.5 font-display text-lg font-extrabold text-[#0F172A]">
                    Define Attribute-Driven OU Policy
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500">
                    Target an existing Managed OU container. Policies cannot auto-create missing OUs.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button type="button" className="cursor-pointer rounded-lg border border-slate-200 p-1 text-slate-400">
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Policy Name *
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="e.g. Finance – Johannesburg"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Priority (Higher Wins)
                  </label>
                  <input
                    type="number"
                    value={draftPriority}
                    onChange={(e) => setDraftPriority(Number(e.target.value) || 100)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Validated Target Managed OU *
                </label>
                <select
                  value={draftTargetOuId}
                  onChange={(e) => setDraftTargetOuId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/40 px-3 py-2 font-mono text-[11px] font-semibold text-[#0284C7]"
                >
                  {managedOus.map((ou) => (
                    <option key={ou.id} value={ou.id}>
                      {ou.distinguishedName}
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[10px] text-slate-500">
                  Need an OU that doesn&apos;t exist yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setNewPolicyModalOpen(false);
                      onOpenOuProvisioning();
                    }}
                    className="cursor-pointer font-semibold text-[#0284C7] hover:underline"
                  >
                    Submit an OU Provisioning Request first →
                  </button>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    Identity Attribute Filters
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftFilters((prev) => [
                        ...prev,
                        {
                          id: `df-${Date.now()}`,
                          field: 'employeeType',
                          operator: 'Equals',
                          value: 'Permanent',
                        },
                      ])
                    }
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[10px] font-semibold text-[#0284C7] ring-1 ring-sky-200"
                  >
                    <Plus className="h-3 w-3" /> Add Filter
                  </button>
                </div>
                {draftFilters.map((f) => (
                  <div key={f.id} className="grid grid-cols-12 gap-1.5">
                    <select
                      value={f.field}
                      onChange={(e) =>
                        setDraftFilters((prev) =>
                          prev.map((row) =>
                            row.id === f.id
                              ? { ...row, field: e.target.value as OuPolicyAttributeField }
                              : row
                          )
                        )
                      }
                      className="col-span-4 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px]"
                    >
                      {(Object.keys(FIELD_LABELS) as OuPolicyAttributeField[]).map((k) => (
                        <option key={k} value={k}>
                          {FIELD_LABELS[k]}
                        </option>
                      ))}
                    </select>
                    <select
                      value={f.operator}
                      onChange={(e) =>
                        setDraftFilters((prev) =>
                          prev.map((row) =>
                            row.id === f.id
                              ? {
                                  ...row,
                                  operator: e.target.value as OuAssignmentCondition['operator'],
                                }
                              : row
                          )
                        )
                      }
                      className="col-span-3 rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[11px]"
                    >
                      <option value="Equals">Equals</option>
                      <option value="Not Equals">Not Equals</option>
                      <option value="Contains">Contains</option>
                    </select>
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) =>
                        setDraftFilters((prev) =>
                          prev.map((row) =>
                            row.id === f.id ? { ...row, value: e.target.value } : row
                          )
                        )
                      }
                      className="col-span-4 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraftFilters((prev) => prev.filter((row) => row.id !== f.id))
                      }
                      disabled={draftFilters.length <= 1}
                      className="col-span-1 cursor-pointer text-slate-400 hover:text-rose-600 disabled:opacity-30"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Dialog.Close asChild>
                  <button type="button" className="cursor-pointer rounded-xl border border-slate-200 px-3.5 py-2 font-semibold text-slate-600">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleSaveNewPolicy}
                  disabled={!draftName.trim()}
                  className="cursor-pointer rounded-xl bg-[#0EA5E9] px-4 py-2 font-semibold text-white hover:bg-[#0284C7] disabled:opacity-50"
                >
                  Save OU Assignment Policy
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal 3: Add Approved Manual OU Override */}
      <Dialog.Root open={newOverrideModalOpen} onOpenChange={setNewOverrideModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] font-bold text-amber-700 uppercase">
                    Approved Exception
                  </div>
                  <Dialog.Title className="font-display text-lg font-extrabold text-[#0F172A]">
                    Add Manual OU Override
                  </Dialog.Title>
                </div>
                <Dialog.Close asChild>
                  <button type="button" className="cursor-pointer rounded-lg border border-slate-200 p-1 text-slate-400">
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Identity
                </label>
                <select
                  value={ovPersonId}
                  onChange={(e) => setOvPersonId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.employeeNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Override Target OU
                </label>
                <select
                  value={ovTargetOuId}
                  onChange={(e) => setOvTargetOuId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-[11px] text-[#0F172A]"
                >
                  {managedOus.map((ou) => (
                    <option key={ou.id} value={ou.id}>
                      {ou.distinguishedName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Approved By
                  </label>
                  <input
                    type="text"
                    value={ovApprovedBy}
                    onChange={(e) => setOvApprovedBy(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Exception Expiry
                  </label>
                  <input
                    type="date"
                    value={ovExpiresOn}
                    onChange={(e) => setOvExpiresOn(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Business Justification *
                </label>
                <textarea
                  rows={2}
                  value={ovReason}
                  onChange={(e) => setOvReason(e.target.value)}
                  placeholder="Why must this identity remain outside standard OU policy?"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Dialog.Close asChild>
                  <button type="button" className="cursor-pointer rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-600">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleSaveOverride}
                  disabled={!ovReason.trim()}
                  className="cursor-pointer rounded-xl bg-amber-600 px-4 py-1.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  Approve Override Exception
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
