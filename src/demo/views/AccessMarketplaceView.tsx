import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  GitBranch,
  KeyRound,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  UserCheck,
  X,
} from 'lucide-react';
import {
  CURRENT_DEMO_USER_PERSON_ID,
  INITIAL_MARKETPLACE_CATALOG,
  getSelectableAccountsForPerson,
  type MarketplaceCatalogItem,
} from '@/data/demoSampleData';
import {
  REFERENCE_OBJECTS,
  type ReferenceObject,
} from '@/data/referenceObjectsData';
import { Dialog, Switch } from '@/components/ui/Primitives';
import { PersonInspectorDrawer } from '@/demo/views/PersonInspectorDrawer';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const KIND_FILTERS: ('All' | MarketplaceCatalogItem['kind'])[] = [
  'All',
  'Business Role',
  'Entitlement',
  'AD Security Group',
  'Entra ID License',
  'JIT Elevation',
];

const SENSITIVITY_FILTERS: ('All' | MarketplaceCatalogItem['sensitivity'])[] = [
  'All',
  'Standard',
  'High',
  'Critical',
];

export function AccessMarketplaceView() {
  const people = useDemoStore((s) => s.people);
  const leaveDelegation = useDemoStore((s) => s.leaveDelegation);
  const platformConfig = useDemoStore((s) => s.platformConfig);
  const globalSearch = useDemoStore((s) => s.searchQuery);
  const submitAccessRequest = useDemoStore((s) => s.submitAccessRequest);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  // Target Identity (default: yourself -> Priya Nair)
  const [targetPersonId, setTargetPersonId] = useState<string>(
    CURRENT_DEMO_USER_PERSON_ID
  );

  // Catalog Filters
  const [localSearch, setLocalSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<'All' | MarketplaceCatalogItem['kind']>('All');
  const [appFilter, setAppFilter] = useState<string>('All');
  const [sensitivityFilter, setSensitivityFilter] =
    useState<'All' | MarketplaceCatalogItem['sensitivity']>('All');

  // Request Drawer State
  const [requestItem, setRequestItem] = useState<MarketplaceCatalogItem | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [activationDate, setActivationDate] = useState<string>('2026-11-26');
  const [deactivationDate, setDeactivationDate] = useState<string>('2027-02-24');
  const [indefiniteAccess, setIndefiniteAccess] = useState<boolean>(false);
  const [motivation, setMotivation] = useState<string>('');
  const [requestSodException, setRequestSodException] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clickable Object Inspectors
  const [inspectPersonId, setInspectPersonId] = useState<string | null>(null);
  const [inspectResource, setInspectResource] = useState<MarketplaceCatalogItem | null>(null);
  const [inspectRefObj, setInspectRefObj] = useState<ReferenceObject | null>(null);

  const targetPerson = useMemo(
    () =>
      people.find((p) => p.id === targetPersonId) ??
      people.find((p) => p.id === CURRENT_DEMO_USER_PERSON_ID) ??
      people[0],
    [people, targetPersonId]
  );

  const primaryContextId = targetPerson?.contextRefIds[0] ?? 'ctx-sre-jit';
  const primaryContextObj: ReferenceObject | null =
    REFERENCE_OBJECTS[primaryContextId] ?? null;
  const primaryContextLabel = primaryContextObj
    ? `${primaryContextObj.code} · ${primaryContextObj.name}`
    : primaryContextId;

  const selectableAccounts = useMemo(
    () => (targetPerson ? getSelectableAccountsForPerson(targetPerson) : []),
    [targetPerson]
  );

  useEffect(() => {
    if (!requestItem || selectableAccounts.length === 0) return;
    const preferred =
      requestItem.recommendedAccountType === 'Admin'
        ? selectableAccounts.find((a) => a.accountKind === 'Privileged Admin')
        : selectableAccounts.find((a) => a.accountKind === 'Standard User');
    setSelectedAccountId((preferred ?? selectableAccounts[0]).id);
    setIndefiniteAccess(!requestItem.maxDurationDays);
    if (requestItem.maxDurationDays) {
      const end = new Date('2026-11-26');
      end.setDate(end.getDate() + requestItem.maxDurationDays);
      setDeactivationDate(end.toISOString().slice(0, 10));
    } else {
      setDeactivationDate('2027-02-24');
    }
    setMotivation('');
    setRequestSodException(false);
    setFormError(null);
  }, [requestItem, selectableAccounts]);

  const uniqueApps = useMemo(
    () => Array.from(new Set(INITIAL_MARKETPLACE_CATALOG.map((c) => c.application))).sort(),
    []
  );

  const checkSodFor = (item: MarketplaceCatalogItem) => {
    if (!targetPerson || !item.sodConflictRoles?.length) return null;
    const matchedRole = targetPerson.roles.find((r) =>
      item.sodConflictRoles!.some((conflict) =>
        r.toLowerCase().includes(conflict.toLowerCase())
      )
    );
    if (!matchedRole) return null;
    return {
      policyCode: item.sodPolicyCode ?? 'SOX-SOD-402',
      conflictingRole: matchedRole,
      reason:
        item.sodConflictReason ??
        `Conflicts with existing role "${matchedRole}".`,
    };
  };

  const filteredCatalog = useMemo(() => {
    const needle = `${localSearch} ${globalSearch}`.trim().toLowerCase();
    return INITIAL_MARKETPLACE_CATALOG.filter((item) => {
      if (kindFilter !== 'All' && item.kind !== kindFilter) return false;
      if (appFilter !== 'All' && item.application !== appFilter) return false;
      if (sensitivityFilter !== 'All' && item.sensitivity !== sensitivityFilter) return false;
      if (!needle) return true;
      const hay = `${item.code} ${item.name} ${item.kind} ${item.application} ${item.category} ${item.description} ${item.ownerName}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [localSearch, globalSearch, kindFilter, appFilter, sensitivityFilter]);

  const activeRequestSod = requestItem ? checkSodFor(requestItem) : null;

  const resolvedApproverSteps = useMemo(() => {
    if (!requestItem || !targetPerson) return [];
    const steps = requestItem.approvalTemplate.map((tpl, idx) => {
      const name =
        tpl.approverName === 'Target Manager'
          ? targetPerson.manager
          : tpl.approverName;
      const refId =
        tpl.approverName === 'Target Manager'
          ? targetPerson.managerRefId
          : tpl.approverRefId;
      const delegatedTo =
        leaveDelegation.enabled &&
        leaveDelegation.delegateApprovals &&
        name === leaveDelegation.delegatorName
          ? leaveDelegation.standInName
          : undefined;
      return {
        step: `Step ${idx + 1}`,
        role: tpl.approverRole,
        name,
        refId,
        delegatedTo,
      };
    });

    if (activeRequestSod && requestSodException) {
      steps.push({
        step: `Step ${steps.length + 1}`,
        role: 'SoD Risk Exception Approval',
        name: 'David Chen',
        refId: 'mgr-david',
        delegatedTo: undefined,
      });
    }
    return steps;
  }, [requestItem, targetPerson, leaveDelegation, activeRequestSod, requestSodException]);

  const openApproverInfo = (name: string, refId?: string) => {
    if (refId && REFERENCE_OBJECTS[refId]) {
      setInspectRefObj(REFERENCE_OBJECTS[refId]);
      return;
    }
    const personMatch = people.find((p) => p.name === name);
    if (personMatch) {
      setInspectPersonId(personMatch.id);
      return;
    }
    const refMatch = Object.values(REFERENCE_OBJECTS).find(
      (obj) => obj.name.toLowerCase() === name.toLowerCase()
    );
    if (refMatch) {
      setInspectRefObj(refMatch);
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestItem || !targetPerson) return;

    const chosenAccount =
      selectableAccounts.find((a) => a.id === selectedAccountId) ??
      selectableAccounts[0];
    if (!chosenAccount) {
      setFormError('Select a target account for this access request.');
      return;
    }

    if (!activationDate) {
      setFormError('Specify an activation date.');
      return;
    }

    if (!indefiniteAccess) {
      if (!deactivationDate) {
        setFormError('Specify a de-activation date or enable indefinite duration.');
        return;
      }
      if (new Date(deactivationDate) <= new Date(activationDate)) {
        setFormError('De-activation date must be strictly after the activation date.');
        return;
      }
    } else if (requestItem.maxDurationDays) {
      setFormError(
        `${requestItem.name} is time-bound (max ${requestItem.maxDurationDays} days) — a de-activation date is required.`
      );
      return;
    }

    if (activeRequestSod && !requestSodException) {
      setFormError(
        `Blocked by ${activeRequestSod.policyCode}: Resolve conflict or toggle "Request SoD Risk Exception" to route for SOX Risk sign-off.`
      );
      return;
    }

    if (motivation.trim().length < 10) {
      setFormError('Please provide a clear business motivation (at least 10 characters).');
      return;
    }

    submitAccessRequest({
      targetPersonId: targetPerson.id,
      primaryContextId,
      primaryContextLabel,
      selectedAccountId: chosenAccount.id,
      selectedAccountName: chosenAccount.accountName,
      selectedAccountKind: chosenAccount.accountKind,
      catalogItemId: requestItem.id,
      activationDate,
      deactivationDate: indefiniteAccess ? null : deactivationDate,
      motivation,
      sodStatus: activeRequestSod ? 'Violation Flagged (Exception)' : 'Clean',
      sodDetail: activeRequestSod
        ? `${activeRequestSod.policyCode}: ${activeRequestSod.reason}`
        : undefined,
    });

    setRequestItem(null);
  };

  const inspectedPerson = inspectPersonId
    ? (people.find((p) => p.id === inspectPersonId) ?? null)
    : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Access Marketplace (IT Shop)
          </h1>
          <p className="text-sm text-slate-500">
            Self-service access catalog with primary context scoping, multi-account targeting (Standard vs Admin), live SoD checks, and transparent approval workflows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveSection('my-tasks')}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
        >
          <span>Track My Requests &amp; Tasks</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-[#0EA5E9]" />
        </button>
      </div>

      {/* Request For (Default Yourself) + Primary Context Bar */}
      {targetPerson && (
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/40 p-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block font-mono text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                Requesting Access For
              </label>
              <select
                value={targetPerson.id}
                onChange={(e) => setTargetPersonId(e.target.value)}
                className="mt-1 rounded-xl border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:border-[#0EA5E9] focus:outline-none"
              >
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.id === CURRENT_DEMO_USER_PERSON_ID ? ' (Yourself)' : ''} — {p.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setInspectPersonId(targetPerson.id)}
              className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0284C7] hover:border-[#0EA5E9]"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Inspect {targetPerson.name}</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => primaryContextObj && setInspectRefObj(primaryContextObj)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-left transition-colors hover:border-violet-300"
            >
              <Layers className="h-3.5 w-3.5 text-violet-600" />
              <div>
                <span className="block font-mono text-[9px] font-bold text-violet-600 uppercase">
                  Primary Context Scope
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#0F172A]">
                  {primaryContextLabel}
                </span>
              </div>
              <ArrowUpRight className="h-3 w-3 text-slate-400" />
            </button>

            <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5">
              <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase">
                Available Accounts
              </span>
              <span className="font-mono text-[11px] font-semibold text-[#0F172A]">
                {selectableAccounts.length} account{selectableAccounts.length === 1 ? '' : 's'}{' '}
                {selectableAccounts.length > 1 ? '(Standard + Admin)' : '(Standard)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Search & Filter Bar */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter roles, entitlements, SAP, AWS, Snowflake, Copilot..."
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 pr-3 pl-9 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={appFilter}
              onChange={(e) => setAppFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="All">All Applications ({uniqueApps.length})</option>
              {uniqueApps.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1 md:col-span-3 md:justify-end">
            {SENSITIVITY_FILTERS.map((sens) => (
              <button
                key={sens}
                type="button"
                onClick={() => setSensitivityFilter(sens)}
                className={cn(
                  'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  sensitivityFilter === sens
                    ? 'border-[#0F172A] bg-[#0F172A] font-semibold text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {sens}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
          {KIND_FILTERS.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setKindFilter(kind)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                kindFilter === kind
                  ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredCatalog.map((item) => {
          const sod = checkSodFor(item);
          return (
            <div
              key={item.id}
              className={cn(
                'flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all',
                sod
                  ? 'border-rose-200 hover:border-rose-300'
                  : 'border-slate-200 hover:border-sky-200'
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {item.code}
                      </span>
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                        {item.kind}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                          item.sensitivity === 'Critical'
                            ? 'bg-rose-50 text-rose-600'
                            : item.sensitivity === 'High'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {item.sensitivity}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectResource(item)}
                      className="group mt-1.5 inline-flex cursor-pointer items-center gap-1 text-left font-heading text-base font-bold text-[#0F172A] hover:text-[#0284C7]"
                    >
                      <span className="underline decoration-slate-300 decoration-dotted underline-offset-4 group-hover:decoration-[#0EA5E9]">
                        {item.name}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#0EA5E9]" />
                    </button>
                    <div className="text-xs text-slate-500">
                      {item.application} · Owner:{' '}
                      <button
                        type="button"
                        onClick={() => openApproverInfo(item.ownerName, item.ownerRefId)}
                        className="cursor-pointer font-semibold text-slate-700 underline decoration-dotted hover:text-[#0284C7]"
                      >
                        {item.ownerName}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>

                {/* Live Pre-Check SoD Warning */}
                {sod && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-800">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
                    <span>
                      <strong>SoD Violation ({sod.policyCode}):</strong> Conflicts with{' '}
                      <strong>{sod.conflictingRole}</strong> held by {targetPerson?.name}.
                    </span>
                  </div>
                )}

                {/* Workflow Preview */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2 text-[11px]">
                  <GitBranch className="h-3.5 w-3.5 shrink-0 text-[#0EA5E9]" />
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    {item.approvalTemplate.length}-Step Workflow:
                  </span>
                  <span className="font-medium text-slate-700">{item.workflowName}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                <button
                  type="button"
                  onClick={() => setInspectResource(item)}
                  className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-[#0284C7]"
                >
                  Inspect Permissions ({item.includedPermissions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRequestItem(item)}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm',
                    sod
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-[#0EA5E9] hover:bg-[#0284C7]'
                  )}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>{sod ? 'Review SoD & Request' : 'Request Access'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radix Slide-Over: Access Request Checkout Drawer */}
      <Dialog.Root
        open={Boolean(requestItem)}
        onOpenChange={(open) => {
          if (!open) setRequestItem(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {requestItem && targetPerson && (
              <form onSubmit={handleSubmitRequest} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>Access Request</span>
                      <span>·</span>
                      <span>{requestItem.code}</span>
                      <span>·</span>
                      <span>{requestItem.application}</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      <button
                        type="button"
                        onClick={() => setInspectResource(requestItem)}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-left hover:text-[#0284C7]"
                      >
                        <span>{requestItem.name}</span>
                        <ArrowUpRight className="h-4 w-4 text-[#0EA5E9]" />
                      </button>
                    </Dialog.Title>
                    <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                      Configure target account, activation dates, SoD checks, and business motivation.
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close access request drawer"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-xs">
                  {formError && (
                    <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-rose-800">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      <span className="font-medium">{formError}</span>
                    </div>
                  )}

                  {/* Target Identity & Primary Context (Both Clickable!) */}
                  <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 sm:grid-cols-2">
                    <div>
                      <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                        Target Identity (Clickable)
                      </div>
                      <button
                        type="button"
                        onClick={() => setInspectPersonId(targetPerson.id)}
                        className="mt-1 inline-flex cursor-pointer items-center gap-1 font-heading text-sm font-bold text-[#0284C7] hover:underline"
                      >
                        <span>{targetPerson.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                      <div className="font-mono text-[10px] text-slate-500">
                        {targetPerson.employeeNumber} · {targetPerson.title}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                        Primary Context (Clickable)
                      </div>
                      <button
                        type="button"
                        onClick={() => primaryContextObj && setInspectRefObj(primaryContextObj)}
                        className="mt-1 inline-flex cursor-pointer items-center gap-1 text-left font-mono text-xs font-semibold text-violet-700 hover:underline"
                      >
                        <span>{primaryContextLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Multi-Account Selector (Standard User vs Privileged Admin) */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                        Select Target Account ({selectableAccounts.length} Available)
                      </span>
                      {requestItem.recommendedAccountType && (
                        <span className="font-mono text-[10px] text-[#0284C7]">
                          Recommended: {requestItem.recommendedAccountType} Account
                        </span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {selectableAccounts.map((acc) => {
                        const selected = selectedAccountId === acc.id;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => setSelectedAccountId(acc.id)}
                            className={cn(
                              'cursor-pointer rounded-xl border p-3.5 text-left transition-all',
                              selected
                                ? 'border-[#0EA5E9] bg-sky-50/50 ring-1 ring-sky-200'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={cn(
                                  'rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
                                  acc.accountKind === 'Privileged Admin'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                )}
                              >
                                {acc.accountKind}
                              </span>
                              {selected && (
                                <CheckCircle2 className="h-4 w-4 text-[#0EA5E9]" />
                              )}
                            </div>
                            <div className="mt-1.5 truncate font-mono text-xs font-bold text-[#0F172A]">
                              {acc.accountName}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {acc.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activation & De-activation Date */}
                  <div className="space-y-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-500 uppercase">
                        <Calendar className="h-3.5 w-3.5 text-[#0EA5E9]" />
                        <span>Access Validity Window</span>
                      </span>
                      {!requestItem.maxDurationDays && (
                        <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-medium text-slate-600">
                          <span>No de-activation date</span>
                          <Switch.Root
                            checked={indefiniteAccess}
                            onCheckedChange={setIndefiniteAccess}
                            className="relative h-4 w-8 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                          >
                            <Switch.Thumb className="block h-3 w-3 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                          </Switch.Root>
                        </label>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                          Activation Date *
                        </label>
                        <input
                          type="date"
                          value={activationDate}
                          onChange={(e) => setActivationDate(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-[#0F172A]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                          De-activation Date {requestItem.maxDurationDays ? `(Max ${requestItem.maxDurationDays}d) *` : ''}
                        </label>
                        <input
                          type="date"
                          value={indefiniteAccess ? '' : deactivationDate}
                          disabled={indefiniteAccess}
                          onChange={(e) => setDeactivationDate(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-[#0F172A] disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Preventative SoD Check */}
                  {activeRequestSod ? (
                    <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
                      <div className="flex items-start gap-2.5">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                        <div>
                          <div className="font-mono text-[10px] font-bold text-rose-700 uppercase">
                            SoD Policy Violation · {activeRequestSod.policyCode}
                          </div>
                          <p className="mt-0.5 font-semibold">
                            {targetPerson.name} currently holds &quot;{activeRequestSod.conflictingRole}&quot;.
                          </p>
                          <p className="mt-0.5 text-rose-700">{activeRequestSod.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2">
                        <div>
                          <div className="font-semibold text-[#0F172A]">
                            Request Compensating SoD Risk Exception
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Mode: {platformConfig.governance.sodEnforcementMode} · Injects mandatory SOX Risk approver into workflow.
                          </div>
                        </div>
                        <Switch.Root
                          checked={requestSodException}
                          onCheckedChange={setRequestSodException}
                          className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-amber-600"
                        >
                          <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                        </Switch.Root>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-emerald-900">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                      <div>
                        <span className="font-semibold">SoD Check Passed:</span> Zero segregation of duties conflicts detected for{' '}
                        <strong>{targetPerson.name}</strong>.
                      </div>
                    </div>
                  )}

                  {/* Configured Multi-Step Approval Workflow with Clickable Approvers */}
                  <div className="space-y-2.5 rounded-xl border border-sky-200/80 bg-sky-50/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                        <GitBranch className="h-3.5 w-3.5" />
                        <span>Configured Approval Workflow ({requestItem.workflowCode})</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        Click any approver for details
                      </span>
                    </div>

                    <div className="space-y-2">
                      {resolvedApproverSteps.map((st, idx) => (
                        <div
                          key={`${st.step}-${idx}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 font-mono text-[10px] font-bold text-[#0284C7]">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-semibold text-[#0F172A]">{st.role}</div>
                              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openApproverInfo(st.name, st.refId)}
                                  className="inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
                                >
                                  <span>{st.name}</span>
                                  <ArrowUpRight className="h-3 w-3" />
                                </button>
                                {st.delegatedTo && (
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                                    Out-of-Office → Routed to {st.delegatedTo}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">
                            {idx === 0 ? 'First Approver' : `After Step ${idx}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Business Motivation Box */}
                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-500 uppercase">
                      Business Motivation *
                    </label>
                    <textarea
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Motivate why this access is required, including project, audit, or ticket context..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-[#F8FAFC] px-6 py-4">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>

                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Submit Access Request</span>
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Clickable Identity Inspector */}
      <PersonInspectorDrawer
        person={inspectedPerson}
        onClose={() => setInspectPersonId(null)}
      />

      {/* Clickable Resource Inspector */}
      <Dialog.Root
        open={Boolean(inspectResource)}
        onOpenChange={(open) => {
          if (!open) setInspectResource(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            {inspectResource && (
              <div className="space-y-4 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      {inspectResource.code} · {inspectResource.kind} · {inspectResource.application}
                    </div>
                    <Dialog.Title className="mt-1 font-display text-lg font-extrabold text-[#0F172A]">
                      {inspectResource.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-slate-500">
                      {inspectResource.description}
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

                <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5 font-mono text-[11px]">
                  <div className="text-[9px] text-slate-400 uppercase">Technical Identifier</div>
                  <div className="mt-0.5 break-all font-semibold text-[#0F172A]">
                    {inspectResource.technicalId}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                    Included Permissions
                  </div>
                  <ul className="mt-1.5 space-y-1.5">
                    {inspectResource.includedPermissions.map((perm) => (
                      <li
                        key={perm}
                        className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-[#FBFDFF] px-3 py-1.5 font-mono text-[11px] text-slate-700"
                      >
                        <KeyRound className="h-3 w-3 shrink-0 text-[#0EA5E9]" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-slate-500">
                    Owner: <strong className="text-[#0F172A]">{inspectResource.ownerName}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const target = inspectResource;
                      setInspectResource(null);
                      setRequestItem(target);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-[#0EA5E9] px-3.5 py-1.5 font-semibold text-white hover:bg-[#0284C7]"
                  >
                    <span>Request This Resource</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Clickable Approver / Context Reference Inspector */}
      <Dialog.Root
        open={Boolean(inspectRefObj)}
        onOpenChange={(open) => {
          if (!open) setInspectRefObj(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            {inspectRefObj && (
              <div className="space-y-4 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      {inspectRefObj.kind} · {inspectRefObj.code}
                    </div>
                    <Dialog.Title className="mt-1 font-display text-lg font-extrabold text-[#0F172A]">
                      {inspectRefObj.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-slate-500">
                      {inspectRefObj.description}
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

                <div className="space-y-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5">
                  {inspectRefObj.properties.map((prop) => (
                    <div key={prop.label} className="flex justify-between gap-3">
                      <span className="font-mono text-[10px] text-slate-400 uppercase">
                        {prop.label}
                      </span>
                      <span
                        className={cn(
                          'text-right font-semibold text-[#0F172A]',
                          prop.mono && 'font-mono text-[11px]'
                        )}
                      >
                        {prop.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
