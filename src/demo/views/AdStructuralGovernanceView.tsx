import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FolderGit2,
  FolderPlus,
  FolderTree,
  GitBranch,
  Info,
  KeyRound,
  Lock,
  MoveRight,
  Network,
  Radar,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import type {
  DemoOrganizationalUnit,
  OuGovernanceState,
} from '@/data/demoSampleData';
import { Dialog, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type TabId = 'hierarchy' | 'provisioning' | 'compliance';
type StateFilter = 'All' | OuGovernanceState | 'Privileged' | 'Empty';

const OWNER_OPTIONS = [
  'Claire Vance (Finance Manager)',
  'Alex Carter (VP Engineering)',
  'Priya Nair (Principal Platform Engineer)',
  'David Chen (Treasury Director)',
  'Marcus Bell (VP Enterprise Sales)',
  'Lucas Meyer (Head of Data Governance)',
  'Identity Operations',
];

function stateBadge(state: OuGovernanceState): string {
  switch (state) {
    case 'Managed':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    case 'Discovered':
      return 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200';
    case 'Non-Compliant':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
  }
}

export function AdStructuralGovernanceView() {
  const adOus = useDemoStore((s) => s.adOus);
  const ouRequests = useDemoStore((s) => s.ouRequests);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const runAdOuDiscoveryScan = useDemoStore((s) => s.runAdOuDiscoveryScan);
  const governOrganizationalUnit = useDemoStore((s) => s.governOrganizationalUnit);
  const attestOuOwnership = useDemoStore((s) => s.attestOuOwnership);
  const revokeOuDelegation = useDemoStore((s) => s.revokeOuDelegation);
  const reconcileOuDrift = useDemoStore((s) => s.reconcileOuDrift);
  const relocateOrganizationalUnit = useDemoStore((s) => s.relocateOrganizationalUnit);
  const decommissionEmptyOu = useDemoStore((s) => s.decommissionEmptyOu);
  const submitOuProvisioningRequest = useDemoStore((s) => s.submitOuProvisioningRequest);
  const advanceOuRequestApproval = useDemoStore((s) => s.advanceOuRequestApproval);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [activeTab, setActiveTab] = useState<TabId>('hierarchy');
  const [stateFilter, setStateFilter] = useState<StateFilter>('All');
  const [selectedOuId, setSelectedOuId] = useState<string>(adOus[0]?.id ?? 'ou-root-depts');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'ou-root-depts': true,
    'ou-tier0': true,
  });

  // Modals: Request New OU, Govern/Assign Owner, Relocate OU
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [governModalOpen, setGovernModalOpen] = useState(false);
  const [relocateModalOpen, setRelocateModalOpen] = useState(false);

  // Request New OU Form
  const [reqOuName, setReqOuName] = useState('');
  const [reqParentId, setReqParentId] = useState('ou-root-depts');
  const [reqOwner, setReqOwner] = useState(OWNER_OPTIONS[0]);
  const [reqCustodian, setReqCustodian] = useState('Priya Nair (Principal Platform Engineer)');
  const [reqPurpose, setReqPurpose] = useState('');

  // Assign Owner Form
  const [assignOwner, setAssignOwner] = useState(OWNER_OPTIONS[0]);
  const [assignCustodian, setAssignCustodian] = useState('Alex Carter (VP Engineering)');

  // Relocate OU Form
  const [relocateParentId, setRelocateParentId] = useState<string>('ROOT');

  const selectedOu = adOus.find((o) => o.id === selectedOuId) ?? adOus[0] ?? null;

  const childOusOf = (parentId: string | null) =>
    adOus.filter((o) => o.parentOuId === parentId);

  const metrics = useMemo(() => {
    const managed = adOus.filter((o) => o.governanceState === 'Managed').length;
    const discovered = adOus.filter((o) => o.governanceState === 'Discovered').length;
    const nonCompliant = adOus.filter((o) => o.governanceState === 'Non-Compliant').length;
    const missingOwner = adOus.filter((o) => !o.businessOwner).length;
    const driftCount = adOus.filter((o) => Boolean(o.driftEvent)).length;
    const excessiveDels = adOus.reduce(
      (s, o) => s + o.delegatedPermissions.filter((d) => d.excessive).length,
      0
    );
    const pendingReqs = ouRequests.filter((r) => r.status === 'Pending Approval').length;
    return {
      total: adOus.length,
      managed,
      discovered,
      nonCompliant,
      missingOwner,
      driftCount,
      excessiveDels,
      pendingReqs,
    };
  }, [adOus, ouRequests]);

  const matchesFilter = (ou: DemoOrganizationalUnit): boolean => {
    const needle = searchQuery.trim().toLowerCase();
    if (stateFilter === 'Managed' && ou.governanceState !== 'Managed') return false;
    if (stateFilter === 'Discovered' && ou.governanceState !== 'Discovered') return false;
    if (stateFilter === 'Non-Compliant' && ou.governanceState !== 'Non-Compliant') return false;
    if (stateFilter === 'Privileged' && !ou.containsPrivilegedAccounts) return false;
    if (
      stateFilter === 'Empty' &&
      ou.childCounts.users + ou.childCounts.groups + ou.childCounts.computers > 0
    ) {
      return false;
    }
    if (!needle) return true;
    return `${ou.name} ${ou.distinguishedName} ${ou.objectGuid} ${ou.businessOwner ?? ''} ${ou.description}`
      .toLowerCase()
      .includes(needle);
  };

  const namingPreviewValid =
    reqOuName.trim() === '' ||
    /^[A-Z][A-Za-z0-9]+(\s-\s[A-Z][A-Za-z0-9 ]+)?$/.test(reqOuName.trim());

  const handleCreateOuRequest = () => {
    if (!reqOuName.trim() || !reqPurpose.trim()) return;
    submitOuProvisioningRequest({
      ouName: reqOuName,
      parentOuId: reqParentId,
      businessOwner: reqOwner,
      technicalCustodian: reqCustodian,
      purpose: reqPurpose,
    });
    setReqOuName('');
    setReqPurpose('');
    setRequestModalOpen(false);
    setActiveTab('provisioning');
  };

  const renderTreeNodes = (parentId: string | null, depth = 0) => {
    const nodes = childOusOf(parentId);
    return nodes.map((ou) => {
      const children = childOusOf(ou.id);
      const hasChildren = children.length > 0;
      const isExpanded = expandedIds[ou.id] ?? true;
      const isSelected = selectedOu?.id === ou.id;
      const selfMatches = matchesFilter(ou);
      const anyChildMatches = children.some((c) => matchesFilter(c));

      if (!selfMatches && !anyChildMatches) return null;

      const totalObjects =
        ou.childCounts.users + ou.childCounts.groups + ou.childCounts.computers;

      return (
        <div key={ou.id}>
          <div
            style={{ paddingLeft: `${depth * 18 + 8}px` }}
            className={cn(
              'group flex cursor-pointer items-center justify-between gap-2 rounded-xl py-2 pr-2.5 text-xs transition-all',
              isSelected
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200'
                : 'text-slate-700 hover:bg-slate-50'
            )}
            onClick={() => setSelectedOuId(ou.id)}
          >
            <div className="flex min-w-0 items-center gap-1.5">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIds((prev) => ({ ...prev, [ou.id]: !isExpanded }));
                  }}
                  className="cursor-pointer rounded p-0.5 text-slate-400 hover:bg-slate-200/70"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
              ) : (
                <span className="inline-block w-4 shrink-0" />
              )}

              <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  ou.governanceState === 'Managed'
                    ? 'bg-emerald-500'
                    : ou.governanceState === 'Discovered'
                      ? 'bg-sky-500'
                      : 'bg-rose-500'
                )}
              />
              <span className="truncate font-semibold">{ou.name}</span>
              {ou.containsPrivilegedAccounts && (
                <Lock
                  className="h-3 w-3 shrink-0 text-amber-600"
                  aria-label="Contains privileged accounts"
                />
              )}
              {ou.driftEvent && (
                <AlertTriangle
                  className="h-3 w-3 shrink-0 text-rose-500"
                  aria-label="Structural drift detected"
                />
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px]">
              <span className="text-slate-400">{totalObjects}</span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[9px] font-bold',
                  ou.governanceState === 'Managed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : ou.governanceState === 'Discovered'
                      ? 'bg-sky-100 text-[#0284C7]'
                      : 'bg-rose-100 text-rose-700'
                )}
              >
                {ou.governanceState === 'Non-Compliant'
                  ? 'Risk'
                  : ou.governanceState === 'Discovered'
                    ? 'New'
                    : 'OK'}
              </span>
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div className="mt-0.5 space-y-0.5">{renderTreeNodes(ou.id, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Active Directory Structural Governance
          </h1>
          <p className="text-sm text-slate-500">
            Discover, correlate by immutable <span className="font-mono text-xs text-[#0284C7]">objectGUID</span>, govern ownership &amp; delegated ACLs, detect out-of-band OU drift, and provision new Organizational Units through approval workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runAdOuDiscoveryScan}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Scan AD OU Structure</span>
          </button>
          <button
            type="button"
            onClick={() => setRequestModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Request New OU</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            OU Inventory (objectGUID)
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">
              {metrics.total}
            </span>
            <span className="font-mono text-[11px] text-emerald-700">
              {metrics.managed} Managed · {metrics.discovered} Discovered
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Non-Compliant &amp; Ownerless
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                metrics.nonCompliant > 0 ? 'text-rose-600' : 'text-emerald-600'
              )}
            >
              {metrics.nonCompliant}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {metrics.missingOwner} missing owner
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Drift &amp; Excessive ACLs
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                metrics.driftCount + metrics.excessiveDels > 0
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              )}
            >
              {metrics.driftCount + metrics.excessiveDels}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {metrics.driftCount} drift · {metrics.excessiveDels} excessive ACLs
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            OU Provisioning Requests
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {metrics.pendingReqs}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              awaiting approval
            </span>
          </div>
        </div>
      </div>

      {/* Radix Tabs */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabId)}
        className="space-y-4"
      >
        <Tabs.List className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          {[
            {
              id: 'hierarchy' as const,
              label: 'OU Hierarchy & Inspector',
              icon: FolderTree,
              badge: metrics.total,
            },
            {
              id: 'provisioning' as const,
              label: 'OU Provisioning Requests',
              icon: FolderPlus,
              badge: metrics.pendingReqs > 0 ? metrics.pendingReqs : null,
            },
            {
              id: 'compliance' as const,
              label: 'Drift, Delegations & Cleanup',
              icon: ShieldAlert,
              badge:
                metrics.nonCompliant + metrics.discovered > 0
                  ? metrics.nonCompliant + metrics.discovered
                  : null,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
                  active
                    ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-[#0EA5E9]' : 'text-slate-400')} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-700">
                    {tab.badge}
                  </span>
                )}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {/* TAB 1: HIERARCHICAL OU TREE & GOVERNANCE INSPECTOR */}
        <Tabs.Content value="hierarchy" className="space-y-4 focus:outline-none">
          {/* Governance State Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {(
                ['All', 'Managed', 'Discovered', 'Non-Compliant', 'Privileged', 'Empty'] as StateFilter[]
              ).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStateFilter(st)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    stateFilter === st
                      ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  )}
                >
                  {st === 'Empty' ? 'Empty / Abandoned' : st}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Managed
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-sky-500" /> Discovered
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Non-Compliant
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left: Hierarchical AD OU Tree */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#0F172A]">
                  <Network className="h-4 w-4 text-[#0EA5E9]" />
                  <span>DC=corp,DC=identra,DC=net</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Hierarchical Tree</span>
              </div>

              <div className="mt-3 space-y-0.5">{renderTreeNodes(null, 0)}</div>
            </div>

            {/* Right: Selected OU Managed Object Inspector */}
            {selectedOu && (
              <div className="space-y-4 lg:col-span-7">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  {/* Top Banner */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                            stateBadge(selectedOu.governanceState)
                          )}
                        >
                          {selectedOu.governanceState}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                          Risk {selectedOu.riskScore}/100
                        </span>
                        {selectedOu.containsPrivilegedAccounts && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800">
                            <Lock className="h-2.5 w-2.5" />
                            Privileged OU
                          </span>
                        )}
                      </div>
                      <h2 className="mt-1.5 font-display text-xl font-extrabold text-[#0F172A]">
                        {selectedOu.name}
                      </h2>
                      <div className="mt-0.5 font-mono text-[11px] text-[#0284C7] break-all">
                        {selectedOu.distinguishedName}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAssignOwner(selectedOu.businessOwner ?? OWNER_OPTIONS[0]);
                          setAssignCustodian(
                            selectedOu.technicalCustodian ?? 'Alex Carter (VP Engineering)'
                          );
                          setGovernModalOpen(true);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0EA5E9] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0284C7]"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>
                          {selectedOu.governanceState === 'Discovered'
                            ? 'Govern OU'
                            : 'Assign Owner'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRelocateParentId(selectedOu.parentOuId ?? 'ROOT');
                          setRelocateModalOpen(true);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                      >
                        <MoveRight className="h-3.5 w-3.5" />
                        <span>Relocate</span>
                      </button>
                      {selectedOu.businessOwner && (
                        <button
                          type="button"
                          onClick={() => attestOuOwnership(selectedOu.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Attest</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Drift Alert if present */}
                  {selectedOu.driftEvent && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-950">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                        <div>
                          <div className="font-mono text-[10px] font-bold text-rose-700 uppercase">
                            OU Drift Detected · {selectedOu.driftEvent.kind} ({selectedOu.driftEvent.detectedAt})
                          </div>
                          <div className="mt-0.5">{selectedOu.driftEvent.detail}</div>
                          {selectedOu.driftEvent.previousDn && (
                            <div className="mt-0.5 font-mono text-[10px] text-rose-700">
                              Previous DN: {selectedOu.driftEvent.previousDn}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => reconcileOuDrift(selectedOu.id)}
                        className="shrink-0 cursor-pointer rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                      >
                        Reconcile Drift
                      </button>
                    </div>
                  )}

                  {/* Compliance Flags */}
                  {selectedOu.complianceFlags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedOu.complianceFlags.map((flag) => (
                        <span
                          key={flag}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 font-mono text-[10px] font-semibold text-amber-900"
                        >
                          <ShieldAlert className="h-3 w-3 text-amber-600" />
                          <span>{flag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Full 11 Managed Object Attributes */}
                  <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-xs sm:grid-cols-2">
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Object GUID (Immutable Correlation Key)
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] font-bold text-[#0284C7]">
                        {selectedOu.objectGuid}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Domain</div>
                      <div className="mt-0.5 font-mono font-semibold text-[#0F172A]">
                        {selectedOu.domain}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Parent OU</div>
                      <div className="mt-0.5 font-mono text-[11px] text-slate-700">
                        {selectedOu.parentDn}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Managed By (Business Owner)
                      </div>
                      <div className="mt-0.5 font-semibold text-[#0F172A]">
                        {selectedOu.businessOwner ?? (
                          <span className="font-mono text-rose-600">Unassigned (Violation)</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Technical Custodian
                      </div>
                      <div className="mt-0.5 font-semibold text-[#0F172A]">
                        {selectedOu.technicalCustodian ?? (
                          <span className="font-mono text-amber-600">Unassigned</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Child Objects (Users / Groups / Computers)
                      </div>
                      <div className="mt-0.5 font-mono font-semibold text-[#0F172A]">
                        {selectedOu.childCounts.users} users · {selectedOu.childCounts.groups} groups ·{' '}
                        {selectedOu.childCounts.computers} computers
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Child OUs &amp; Timestamps
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-slate-700">
                        {childOusOf(selectedOu.id).length} nested OU(s) · Created {selectedOu.createdDate} · Mod{' '}
                        {selectedOu.lastModified}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        AD Description &amp; Last Attestation
                      </div>
                      <div className="mt-0.5 text-slate-600">
                        {selectedOu.description}{' '}
                        <span className="font-mono text-[10px] text-slate-400">
                          · Last attested: {selectedOu.lastAttestedAt ?? 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty OU Cleanup Recommendation */}
                  {selectedOu.childCounts.users +
                    selectedOu.childCounts.groups +
                    selectedOu.childCounts.computers ===
                    0 &&
                    childOusOf(selectedOu.id).length === 0 && (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs">
                        <div>
                          <div className="font-semibold text-amber-950">
                            OU Cleanup Recommendation: 0 Child Objects
                          </div>
                          <div className="text-[11px] text-amber-800">
                            This OU is empty and can be safely decommissioned via an Active Directory deletion task.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => decommissionEmptyOu(selectedOu.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Trigger OU Cleanup Delete</span>
                        </button>
                      </div>
                    )}
                </div>

                {/* Delegated Administration & Inheritance Analysis */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                      <KeyRound className="h-4 w-4 text-[#0EA5E9]" />
                      <span>Delegated Administration &amp; ACL Inheritance</span>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                        selectedOu.inheritanceBlocked
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {selectedOu.inheritanceBlocked
                        ? 'GPO / ACL Inheritance Blocked'
                        : 'Inheritance Active'}
                    </span>
                  </div>

                  {selectedOu.delegatedPermissions.length === 0 ? (
                    <div className="mt-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-xs text-slate-500">
                      No custom delegated ACL entries on this OU (inherits domain defaults only).
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {selectedOu.delegatedPermissions.map((del) => (
                        <div
                          key={del.id}
                          className={cn(
                            'flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-xs',
                            del.excessive
                              ? 'border-rose-200 bg-rose-50/50'
                              : 'border-slate-100 bg-[#F8FAFC]'
                          )}
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono font-bold text-[#0F172A]">
                                {del.principal}
                              </span>
                              <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[9px] text-slate-600 ring-1 ring-slate-200">
                                {del.principalType}
                              </span>
                              <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[9px] text-slate-500 ring-1 ring-slate-200">
                                {del.inherited ? 'Inherited' : 'Direct'}
                              </span>
                              {del.excessive && (
                                <span className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-700">
                                  Excessive / Unintended Control
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-600">{del.rights}</div>
                            <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                              Last reviewed: {del.reviewedOn}
                            </div>
                          </div>
                          {del.excessive && (
                            <button
                              type="button"
                              onClick={() => revokeOuDelegation(selectedOu.id, del.id)}
                              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Revoke ACL</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* GPO Association Visibility (with architectural distinction) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                    <FolderGit2 className="h-4 w-4 text-indigo-500" />
                    <span>Linked GPO Visibility ({selectedOu.gpoLinks.length})</span>
                  </div>
                  <div className="mt-2 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50/50 px-3 py-2 text-[11px] text-slate-600">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0284C7]" />
                    <span>
                      <strong>Architectural distinction:</strong> GPOs are distinct AD policy objects linked to OUs (not OU objects themselves); IDENTRA reads GPO link metadata and inheritance blocks via AD Policy integration.
                    </span>
                  </div>
                  {selectedOu.gpoLinks.length === 0 ? (
                    <div className="mt-3 text-xs text-slate-500">
                      No direct GPO links attached to this container.
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedOu.gpoLinks.map((gpo) => (
                        <span
                          key={gpo.name}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 font-mono text-[11px] text-[#0F172A]"
                        >
                          <span className="font-semibold">{gpo.name}</span>
                          {gpo.enforced && (
                            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                              Enforced
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">({gpo.status})</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Tabs.Content>

        {/* TAB 2: GOVERNED OU PROVISIONING THROUGH IGA */}
        <Tabs.Content value="provisioning" className="space-y-4 focus:outline-none">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
            <div>
              <h2 className="font-heading text-base font-bold text-[#0F172A]">
                Governed OU Creation &amp; Provisioning Workflow
              </h2>
              <p className="text-xs text-slate-500">
                Replace manual ADUC OU creation with naming-validated business requests, dual-stage approvals, automated AD provisioning, and immediate objectGUID correlation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRequestModalOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0284C7]"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>New OU Request</span>
            </button>
          </div>

          <div className="space-y-4">
            {ouRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {req.requestCode}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                          req.status === 'Provisioned & Governed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : req.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-800'
                        )}
                      >
                        {req.status}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                          req.namingCheckPassed
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        )}
                      >
                        {req.namingCheckPassed
                          ? 'Naming Convention Passed'
                          : 'Naming Convention Violation'}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-lg font-extrabold text-[#0F172A]">
                      {req.ouName}
                    </h3>
                    <div className="font-mono text-[11px] text-[#0284C7]">{req.targetDn}</div>
                    <p className="mt-1 text-xs text-slate-600">{req.purpose}</p>
                    <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] text-slate-500">
                      <span>Business Owner: <strong>{req.businessOwner}</strong></span>
                      <span>Technical Custodian: <strong>{req.technicalCustodian}</strong></span>
                      <span>Requested by: {req.requestedBy} · {req.submittedAt}</span>
                    </div>
                  </div>

                  {req.status === 'Pending Approval' ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => advanceOuRequestApproval(req.id, 'approve-stage')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-[#0EA5E9] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0284C7]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve Current Stage</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => advanceOuRequestApproval(req.id, 'approve-all')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        <span>Approve &amp; Auto-Provision</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => advanceOuRequestApproval(req.id, 'reject')}
                        className="cursor-pointer rounded-xl border border-rose-200 bg-white px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    req.provisionedOuId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOuId(req.provisionedOuId!);
                          setActiveTab('hierarchy');
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-[#0284C7] hover:bg-sky-100"
                      >
                        <span>Inspect Governed OU in Tree</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )
                  )}
                </div>

                {/* 4-Stage Automated Provisioning Pipeline */}
                <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-4">
                  {req.stages.map((st) => (
                    <div
                      key={st.stepOrder}
                      className={cn(
                        'rounded-xl border p-3 text-xs',
                        st.status === 'Completed'
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : st.status === 'Active'
                            ? 'border-[#0EA5E9] bg-sky-50/50 ring-1 ring-sky-200'
                            : 'border-slate-200 bg-[#F8FAFC] opacity-75'
                      )}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-[#0F172A]">STEP {st.stepOrder}</span>
                        <span
                          className={cn(
                            'font-bold uppercase',
                            st.status === 'Completed'
                              ? 'text-emerald-700'
                              : st.status === 'Active'
                                ? 'text-[#0284C7]'
                                : 'text-slate-400'
                          )}
                        >
                          {st.status}
                        </span>
                      </div>
                      <div className="mt-1 font-semibold text-[#0F172A]">{st.label}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-slate-500">{st.actor}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        {/* TAB 3: DRIFT, DELEGATIONS & COMPLIANCE REMEDIATION QUEUE */}
        <Tabs.Content value="compliance" className="space-y-3 focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  AD Structural Compliance, Drift &amp; Unmanaged OU Findings
                </h2>
                <p className="text-xs text-slate-500">
                  Prioritized governance queue for unmanaged discovered OUs, missing owners, out-of-band structural drift, excessive delegated control, and empty OUs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('provisioning-engine')}
                className="inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
              >
                <span>Provisioning Engine</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {adOus
                .filter((o) => o.governanceState !== 'Managed')
                .map((ou) => (
                  <div
                    key={ou.id}
                    className="flex flex-wrap items-start justify-between gap-3 p-4 text-xs hover:bg-slate-50/70"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold',
                            stateBadge(ou.governanceState)
                          )}
                        >
                          {ou.governanceState}
                        </span>
                        <span className="font-heading text-sm font-bold text-[#0F172A]">
                          {ou.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Risk {ou.riskScore}/100 · GUID {ou.objectGuid.slice(0, 8)}…
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-[#0284C7]">
                        {ou.distinguishedName}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {ou.complianceFlags.map((flag) => (
                          <span
                            key={flag}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-900"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOuId(ou.id);
                          setActiveTab('hierarchy');
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                      >
                        <span>Inspect in Tree</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      {!ou.businessOwner && (
                        <button
                          type="button"
                          onClick={() =>
                            governOrganizationalUnit(
                              ou.id,
                              'Claire Vance (Finance Manager)',
                              'Alex Carter (VP Engineering)'
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0EA5E9] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0284C7]"
                        >
                          <Users className="h-3 w-3" />
                          <span>Assign Owner &amp; Govern</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              {adOus.every((o) => o.governanceState === 'Managed') && (
                <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  <div className="font-heading text-sm font-bold text-[#0F172A]">
                    100% Managed Active Directory Structure
                  </div>
                  <p className="text-xs text-slate-500">
                    Every discovered OU has an accountable owner, clean delegations, and zero unapproved drift.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Modal 1: Request New OU */}
      <Dialog.Root open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>Governed OU Provisioning</span>
                  </div>
                  <Dialog.Title className="mt-0.5 font-display text-lg font-extrabold text-[#0F172A]">
                    New Organizational Unit Request
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500">
                    Routes through Business Owner Approval → AD Infrastructure Approval → Automated AD Creation → objectGUID Correlation.
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

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    OU Name * (Naming Convention: Department - Location)
                  </label>
                  <input
                    type="text"
                    value={reqOuName}
                    onChange={(e) => setReqOuName(e.target.value)}
                    placeholder="e.g. Legal - Pretoria"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                  {!namingPreviewValid && (
                    <div className="mt-1 font-mono text-[10px] font-semibold text-amber-700">
                      Warning: Does not match standard &quot;Department - Location&quot; naming policy.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Parent OU Container
                  </label>
                  <select
                    value={reqParentId}
                    onChange={(e) => setReqParentId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                  >
                    {adOus.map((ou) => (
                      <option key={ou.id} value={ou.id}>
                        {ou.distinguishedName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Business Owner
                    </label>
                    <select
                      value={reqOwner}
                      onChange={(e) => setReqOwner(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                    >
                      {OWNER_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Technical Custodian
                    </label>
                    <select
                      value={reqCustodian}
                      onChange={(e) => setReqCustodian(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                    >
                      {OWNER_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Business Purpose *
                  </label>
                  <textarea
                    rows={2}
                    value={reqPurpose}
                    onChange={(e) => setReqPurpose(e.target.value)}
                    placeholder="Organisational container for..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="cursor-pointer rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleCreateOuRequest}
                  disabled={!reqOuName.trim() || !reqPurpose.trim()}
                  className="cursor-pointer rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0284C7] disabled:opacity-50"
                >
                  Submit OU Request
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal 2: Assign Owner & Bring Under Governance */}
      <Dialog.Root open={governModalOpen} onOpenChange={setGovernModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            {selectedOu && (
              <div className="space-y-4 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      OU Ownership Governance
                    </div>
                    <Dialog.Title className="font-display text-lg font-extrabold text-[#0F172A]">
                      Govern &quot;{selectedOu.name}&quot;
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
                    Accountable Business Owner
                  </label>
                  <select
                    value={assignOwner}
                    onChange={(e) => setAssignOwner(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    {OWNER_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Technical Custodian
                  </label>
                  <select
                    value={assignCustodian}
                    onChange={(e) => setAssignCustodian(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    {OWNER_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <Dialog.Close asChild>
                    <button type="button" className="cursor-pointer rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-600">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={() => {
                      governOrganizationalUnit(selectedOu.id, assignOwner, assignCustodian);
                      setGovernModalOpen(false);
                    }}
                    className="cursor-pointer rounded-xl bg-[#0EA5E9] px-4 py-1.5 font-semibold text-white hover:bg-[#0284C7]"
                  >
                    Save Ownership
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal 3: Governed OU Relocation */}
      <Dialog.Root open={relocateModalOpen} onOpenChange={setRelocateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            {selectedOu && (
              <div className="space-y-4 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <Radar className="h-3.5 w-3.5" />
                      <span>OU Relocation Workflow</span>
                    </div>
                    <Dialog.Title className="mt-0.5 font-display text-lg font-extrabold text-[#0F172A]">
                      Move &quot;{selectedOu.name}&quot;
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-500">
                      Relocates this OU in Active Directory while preserving immutable objectGUID correlation ({selectedOu.objectGuid.slice(0, 8)}…).
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="cursor-pointer rounded-lg border border-slate-200 p-1 text-slate-400">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Destination Parent Container
                  </label>
                  <select
                    value={relocateParentId}
                    onChange={(e) => setRelocateParentId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                  >
                    <option value="ROOT">DC=corp,DC=identra,DC=net (Domain Root)</option>
                    {adOus
                      .filter((o) => o.id !== selectedOu.id)
                      .map((ou) => (
                        <option key={ou.id} value={ou.id}>
                          {ou.distinguishedName}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <Dialog.Close asChild>
                    <button type="button" className="cursor-pointer rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-600">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={() => {
                      relocateOrganizationalUnit(
                        selectedOu.id,
                        relocateParentId === 'ROOT' ? null : relocateParentId
                      );
                      setRelocateModalOpen(false);
                    }}
                    className="cursor-pointer rounded-xl bg-[#0EA5E9] px-4 py-1.5 font-semibold text-white hover:bg-[#0284C7]"
                  >
                    Execute Governed Move
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
