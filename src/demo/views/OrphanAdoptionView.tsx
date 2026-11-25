import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Database,
  GitMerge,
  History,
  Link2,
  RotateCcw,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  UserX,
  X,
} from 'lucide-react';
import type {
  AdoptionActionKind,
  AdoptionHumanClassification,
  AdoptionNhiClassification,
  AdoptionPolicyConfig,
  DemoPerson,
  DemoTargetAccount,
} from '@/data/demoSampleData';
import { Dialog, Switch, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type AdoptionTabId = 'orphans' | 'provenance' | 'mappings';

const MANAGERS = [
  { id: 'mgr-claire', name: 'Claire Vance', dept: 'Corporate Finance & Treasury' },
  { id: 'mgr-david', name: 'David Chen', dept: 'Corporate Finance & Treasury' },
  { id: 'mgr-marcus', name: 'Marcus Bell', dept: 'Global Revenue & Enterprise Sales' },
  { id: 'mgr-priya', name: 'Priya Nair', dept: 'Platform & Cloud Engineering' },
  { id: 'mgr-alex', name: 'Alex Carter', dept: 'Platform & Cloud Engineering' },
  { id: 'mgr-cdo', name: 'Hannah Lindqvist', dept: 'Data Governance & Analytics' },
];

const NHI_CLASSIFICATIONS: AdoptionNhiClassification[] = [
  'Service Account',
  'Application Account',
  'Shared Mailbox',
  'Technical Integration',
  'API Token',
];

const AUTHORITATIVE_SOURCES: AdoptionPolicyConfig['defaultAuthoritativeSource'][] = [
  'Manual / Pending HRIS Link',
  'Workday HRIS Core (Reconcile Next Sync)',
  'B2B Partner Lifecycle Portal',
  'Active Directory (Temporary)',
];

interface DuplicateMatch {
  person: DemoPerson;
  reasons: string[];
}

export function OrphanAdoptionView() {
  const accounts = useDemoStore((s) => s.accounts);
  const people = useDemoStore((s) => s.people);
  const adoptionMappings = useDemoStore((s) => s.adoptionMappings);
  const adoptionPolicy = useDemoStore((s) => s.adoptionPolicy);
  const adoptionRecords = useDemoStore((s) => s.adoptionRecords);
  const pendingAdoptAccountId = useDemoStore((s) => s.pendingAdoptAccountId);
  const searchQuery = useDemoStore((s) => s.searchQuery);

  const openOrphanAdoptionForAccount = useDemoStore(
    (s) => s.openOrphanAdoptionForAccount
  );
  const updateAdoptionPolicy = useDemoStore((s) => s.updateAdoptionPolicy);
  const updateSystemMappingRule = useDemoStore((s) => s.updateSystemMappingRule);
  const adoptPromoteToIdentity = useDemoStore((s) => s.adoptPromoteToIdentity);
  const approvePendingAdoption = useDemoStore((s) => s.approvePendingAdoption);
  const adoptCorrelateExisting = useDemoStore((s) => s.adoptCorrelateExisting);
  const adoptClassifyNonHuman = useDemoStore((s) => s.adoptClassifyNonHuman);
  const bulkAdoptOrphans = useDemoStore((s) => s.bulkAdoptOrphans);
  const rollbackAdoption = useDemoStore((s) => s.rollbackAdoption);
  const setSelectedPersonId = useDemoStore((s) => s.setSelectedPersonId);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [activeTab, setActiveTab] = useState<AdoptionTabId>('orphans');
  const [selectedMappingSystem, setSelectedMappingSystem] = useState<string>('Active Directory');

  // Bulk adoption state
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [bulkOwner, setBulkOwner] = useState<string>('Claire Vance');

  // Active 5-step wizard drawer state
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<AdoptionActionKind>('Promote to Identity');

  // Promote to Identity fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [managerRefId, setManagerRefId] = useState('');
  const [humanClass, setHumanClass] = useState<AdoptionHumanClassification>('Employee');
  const [expiryDate, setExpiryDate] = useState('2027-02-23');
  const [authoritativeSource, setAuthoritativeSource] = useState<string>(
    adoptionPolicy.defaultAuthoritativeSource
  );
  const [enrichedBanner, setEnrichedBanner] = useState(false);

  // Correlate to Existing Identity state
  const [correlateSearch, setCorrelateSearch] = useState('');
  const [correlatePersonId, setCorrelatePersonId] = useState<string>('');

  // Classify as Non-Human Identity state
  const [nhiKind, setNhiKind] = useState<AdoptionNhiClassification>('Service Account');
  const [nhiOwner, setNhiOwner] = useState('Priya Nair');
  const [nhiScope, setNhiScope] = useState('');

  const orphanedAccounts = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return accounts.filter((a) => {
      if (a.correlationState !== 'Orphaned') return false;
      if (!needle) return true;
      return `${a.accountName} ${a.application} ${a.accountType} ${a.orphanReason ?? ''}`
        .toLowerCase()
        .includes(needle);
    });
  }, [accounts, searchQuery]);

  const activeAccount: DemoTargetAccount | null = activeAccountId
    ? (accounts.find((a) => a.id === activeAccountId) ?? null)
    : null;

  const extractMappedValues = (acc: DemoTargetAccount) => {
    const sysMap =
      adoptionMappings.find((m) => m.systemName === acc.application) ??
      adoptionMappings[0];
    const raw = acc.rawAttributes ?? {};
    const out: Record<string, string> = {};
    sysMap.rules.forEach((rule) => {
      const val = raw[rule.sourceAttribute];
      if (val) out[rule.identityAttribute] = val;
    });
    return { sysMap, mapped: out };
  };

  const detectDuplicates = (candidate: {
    email?: string;
    employeeNumber?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }): DuplicateMatch[] => {
    const rules = adoptionPolicy.duplicateRules;
    const matches: DuplicateMatch[] = [];

    people.forEach((p) => {
      const reasons: string[] = [];
      if (
        rules.matchEmail &&
        candidate.email &&
        p.email.toLowerCase() === candidate.email.trim().toLowerCase()
      ) {
        reasons.push(`Email match (${p.email})`);
      }
      if (
        rules.matchEmployeeNumber &&
        candidate.employeeNumber &&
        p.employeeNumber.toLowerCase() === candidate.employeeNumber.trim().toLowerCase()
      ) {
        reasons.push(`Employee # match (${p.employeeNumber})`);
      }
      if (
        rules.matchUsername &&
        candidate.username &&
        (p.samAccountName.toLowerCase() === candidate.username.trim().toLowerCase() ||
          candidate.username.toLowerCase().includes(p.samAccountName.toLowerCase()))
      ) {
        reasons.push(`Username match (${p.samAccountName})`);
      }
      if (
        rules.matchFullName &&
        candidate.firstName &&
        candidate.lastName &&
        p.firstName.toLowerCase() === candidate.firstName.trim().toLowerCase() &&
        p.lastName.toLowerCase() === candidate.lastName.trim().toLowerCase()
      ) {
        reasons.push(`Full name match (${p.name})`);
      }

      if (reasons.length > 0) {
        matches.push({ person: p, reasons });
      }
    });

    return matches;
  };

  const openWizard = (acc: DemoTargetAccount, initialAction: AdoptionActionKind) => {
    const { mapped } = extractMappedValues(acc);
    setActiveAccountId(acc.id);
    setActionMode(initialAction);
    setFirstName(mapped.firstName ?? '');
    setLastName(mapped.lastName ?? '');
    setEmail(mapped.email ?? '');
    setDepartment(mapped.department ?? '');
    setEmployeeNumber(mapped.employeeNumber ?? '');

    const matchedMgr = MANAGERS.find(
      (m) => m.name.toLowerCase() === (mapped.manager ?? '').toLowerCase()
    );
    setManagerRefId(matchedMgr?.id ?? '');
    setHumanClass(acc.accountType === 'Contractor' ? 'Contractor' : 'Employee');
    setExpiryDate('2027-02-23');
    setAuthoritativeSource(adoptionPolicy.defaultAuthoritativeSource);
    setEnrichedBanner(false);

    const dups = detectDuplicates({
      email: mapped.email,
      employeeNumber: mapped.employeeNumber,
      username: acc.accountName,
      firstName: mapped.firstName,
      lastName: mapped.lastName,
    });
    setCorrelatePersonId(dups[0]?.person.id ?? '');
    setCorrelateSearch('');

    setNhiKind(
      acc.accountType === 'API Token'
        ? 'API Token'
        : acc.accountType === 'Service Account'
          ? 'Service Account'
          : 'Application Account'
    );
    setNhiOwner('Priya Nair');
    setNhiScope(acc.orphanReason ?? `Governed ${acc.application} technical account`);
  };

  // Auto-open drawer when navigated from Reporting → Orphaned Accounts
  useEffect(() => {
    if (!pendingAdoptAccountId) return;
    const acc = accounts.find((a) => a.id === pendingAdoptAccountId);
    if (acc && acc.correlationState === 'Orphaned') {
      const recommendedAction: AdoptionActionKind =
        acc.accountType === 'Service Account' ||
        acc.accountType === 'API Token' ||
        acc.accountType === 'AI Agent'
          ? 'Classify as Non-Human'
          : 'Promote to Identity';
      openWizard(acc, recommendedAction);
      openOrphanAdoptionForAccount(null);
    }
  }, [pendingAdoptAccountId, accounts]);

  const activeMappingBundle = activeAccount ? extractMappedValues(activeAccount) : null;

  const liveDuplicates = useMemo(() => {
    if (!activeAccount) return [];
    return detectDuplicates({
      email,
      employeeNumber,
      username: activeAccount.accountName,
      firstName,
      lastName,
    });
  }, [activeAccount, email, employeeNumber, firstName, lastName, people, adoptionPolicy.duplicateRules]);

  const requiredChecks = useMemo(() => {
    const needsExpiry =
      humanClass !== 'Employee' && adoptionPolicy.requireContractorExpiry;
    const list = [
      { label: 'First name', ok: firstName.trim().length > 0 },
      { label: 'Last name', ok: lastName.trim().length > 0 },
      { label: 'Email address', ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) },
      { label: 'Employee number', ok: employeeNumber.trim().length >= 3 },
      {
        label: 'Manager',
        ok: !adoptionPolicy.requireOwnershipValidation || managerRefId.length > 0,
      },
    ];
    if (needsExpiry) {
      list.push({ label: 'Expiry date', ok: expiryDate.trim().length > 0 });
    }
    const done = list.filter((c) => c.ok).length;
    return { list, done, total: list.length, complete: done === list.length };
  }, [
    firstName,
    lastName,
    email,
    employeeNumber,
    managerRefId,
    humanClass,
    expiryDate,
    adoptionPolicy.requireContractorExpiry,
    adoptionPolicy.requireOwnershipValidation,
  ]);

  const activeStepNumber = useMemo(() => {
    if (actionMode === 'Correlate to Existing') {
      return correlatePersonId ? 5 : 3;
    }
    if (actionMode === 'Classify as Non-Human') {
      return nhiOwner ? 5 : 3;
    }
    if (!requiredChecks.complete) return 3;
    if (liveDuplicates.length > 0) return 4;
    return 5;
  }, [actionMode, correlatePersonId, nhiOwner, requiredChecks.complete, liveDuplicates.length]);

  const handleEnrichAttributes = () => {
    if (!employeeNumber.trim()) {
      setEmployeeNumber(`EMP-${10950 + people.length}`);
    }
    if (!managerRefId) {
      setManagerRefId(
        department.toLowerCase().includes('finance') ? 'mgr-claire' : 'mgr-priya'
      );
    }
    setEnrichedBanner(true);
  };

  const handleExecuteAdoption = () => {
    if (!activeAccount) return;
    if (actionMode === 'Promote to Identity') {
      if (!requiredChecks.complete || liveDuplicates.length > 0) return;
      const mgr = MANAGERS.find((m) => m.id === managerRefId) ?? MANAGERS[0];
      adoptPromoteToIdentity({
        accountId: activeAccount.id,
        firstName,
        lastName,
        email,
        department,
        employeeNumber,
        manager: mgr.name,
        managerRefId: mgr.id,
        classification: humanClass,
        expiryDate: humanClass === 'Employee' ? null : expiryDate,
        authoritativeSource,
      });
      setActiveAccountId(null);
      return;
    }

    if (actionMode === 'Correlate to Existing') {
      if (!correlatePersonId) return;
      adoptCorrelateExisting(activeAccount.id, correlatePersonId);
      setActiveAccountId(null);
      return;
    }

    if (actionMode === 'Classify as Non-Human') {
      if (!nhiOwner) return;
      adoptClassifyNonHuman({
        accountId: activeAccount.id,
        nhiKind,
        ownerName: nhiOwner,
        privilegeScope: nhiScope,
      });
      setActiveAccountId(null);
    }
  };

  const toggleBulkId = (id: string) => {
    setBulkSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const pendingApprovalsCount = adoptionRecords.filter(
    (r) => r.status === 'Pending Approval'
  ).length;
  const completedAdoptionsCount = adoptionRecords.filter(
    (r) => r.status === 'Completed'
  ).length;
  const orphansWithPotentialDuplicate = orphanedAccounts.filter((acc) => {
    const { mapped } = extractMappedValues(acc);
    return (
      detectDuplicates({
        email: mapped.email,
        employeeNumber: mapped.employeeNumber,
        username: acc.accountName,
        firstName: mapped.firstName,
        lastName: mapped.lastName,
      }).length > 0
    );
  }).length;

  const currentSystemMapping =
    adoptionMappings.find((m) => m.systemName === selectedMappingSystem) ??
    adoptionMappings[0];

  const correlateFilteredPeople = people.filter(
    (p) =>
      !correlateSearch.trim() ||
      `${p.name} ${p.employeeNumber} ${p.email} ${p.department}`
        .toLowerCase()
        .includes(correlateSearch.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Orphaned Account Adoption
          </h1>
          <p className="text-sm text-slate-500">
            Governed 5-step lifecycle adoption bringing unmanaged accounts under governance via{' '}
            <strong className="text-slate-700">Promote to Identity</strong>,{' '}
            <strong className="text-slate-700">Correlate to Existing</strong>, or{' '}
            <strong className="text-slate-700">Classify as Non-Human (NHI)</strong>.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 font-mono text-[11px] font-semibold text-[#0284C7]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Policy: {adoptionPolicy.mode}</span>
        </span>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Uncorrelated Orphans
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                orphanedAccounts.length > 0 ? 'text-rose-600' : 'text-emerald-600'
              )}
            >
              {orphanedAccounts.length}
            </span>
            <span className="font-mono text-[11px] text-slate-400">Ready for adoption</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Duplicate Safeguard Hits
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-amber-600">
              {orphansWithPotentialDuplicate}
            </span>
            <span className="font-mono text-[11px] text-slate-400">Correlate recommended</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Governed Adoptions
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-emerald-600">
              {completedAdoptionsCount}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {pendingApprovalsCount > 0
                ? `${pendingApprovalsCount} awaiting approval`
                : 'Provenance sealed'}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            System Attribute Maps
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {adoptionMappings.length}
            </span>
            <span className="font-mono text-[11px] text-slate-400">Connected systems</span>
          </div>
        </div>
      </div>

      {/* Radix Tabs */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as AdoptionTabId)}
        className="space-y-4"
      >
        <Tabs.List className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          <Tabs.Trigger
            value="orphans"
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'orphans'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <UserX className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Orphaned Accounts Queue ({orphanedAccounts.length})</span>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="provenance"
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'provenance'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <History className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Provenance Ledger &amp; Rollback ({adoptionRecords.length})</span>
            {pendingApprovalsCount > 0 && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                {pendingApprovalsCount}
              </span>
            )}
          </Tabs.Trigger>

          <Tabs.Trigger
            value="mappings"
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'mappings'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <Settings2 className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Attribute Mappings &amp; Adoption Policy</span>
          </Tabs.Trigger>
        </Tabs.List>

        {/* ===================== TAB 1: ORPHANED ACCOUNTS QUEUE ===================== */}
        <Tabs.Content value="orphans" className="space-y-4 focus:outline-none">
          {/* Bulk Adoption Bar */}
          {bulkSelectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 font-semibold text-[#0F172A]">
                <span>{bulkSelectedIds.length} orphaned account(s) selected for Bulk Adoption</span>
                <select
                  value={bulkOwner}
                  onChange={(e) => setBulkOwner(e.target.value)}
                  className="rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {MANAGERS.map((m) => (
                    <option key={m.id} value={m.name}>
                      Default Manager/Owner: {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkSelectedIds([])}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    bulkAdoptOrphans(bulkSelectedIds, bulkOwner);
                    setBulkSelectedIds([]);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0EA5E9] px-3.5 py-1.5 font-semibold text-white hover:bg-[#0284C7]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Bulk Adopt Using System Mappings</span>
                </button>
              </div>
            </div>
          )}

          {orphanedAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-12 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div className="font-heading text-base font-bold text-[#0F172A]">
                Zero Uncorrelated Orphaned Accounts Remaining
              </div>
              <p className="text-xs text-slate-600">
                Every discovered account is now adopted, correlated to an existing identity, or classified as a governed Non-Human Identity.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orphanedAccounts.map((acc) => {
                const { mapped } = extractMappedValues(acc);
                const dups = detectDuplicates({
                  email: mapped.email,
                  employeeNumber: mapped.employeeNumber,
                  username: acc.accountName,
                  firstName: mapped.firstName,
                  lastName: mapped.lastName,
                });
                const isNhiLikely =
                  acc.accountType === 'Service Account' ||
                  acc.accountType === 'API Token' ||
                  acc.accountType === 'AI Agent';
                const checked = bulkSelectedIds.includes(acc.id);

                return (
                  <div
                    key={acc.id}
                    className={cn(
                      'rounded-2xl border bg-white p-5 shadow-xs transition-all',
                      dups.length > 0
                        ? 'border-amber-200 hover:border-amber-300'
                        : 'border-slate-200 hover:border-sky-200'
                    )}
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBulkId(acc.id)}
                          aria-label={`Select ${acc.accountName} for bulk adoption`}
                          className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-[#0EA5E9]"
                        />

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#0F172A]">
                              {acc.accountName}
                            </span>
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                              Uncorrelated
                            </span>
                            <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                              {acc.application}
                            </span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                              Detected: {acc.accountType}
                            </span>
                            {acc.privileged && (
                              <span className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-700 uppercase">
                                Privileged
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600">{acc.orphanReason}</p>

                          {/* Mapped vs Missing Source Attributes Snapshot */}
                          <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
                            {mapped.firstName && (
                              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-800">
                                Name: {mapped.firstName} {mapped.lastName ?? ''}
                              </span>
                            )}
                            {mapped.email && (
                              <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[#0284C7]">
                                Email: {mapped.email}
                              </span>
                            )}
                            {mapped.department && (
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700">
                                Dept: {mapped.department}
                              </span>
                            )}
                            {!mapped.manager && !isNhiLikely && (
                              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-800">
                                Manager: Missing
                              </span>
                            )}
                            {!mapped.employeeNumber && !isNhiLikely && (
                              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-800">
                                Emp #: Missing
                              </span>
                            )}
                          </div>

                          {dups.length > 0 && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-900">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                              <span>
                                <strong>Duplicate Safeguard:</strong> Matches existing identity{' '}
                                <strong>
                                  {dups[0].person.name} ({dups[0].person.employeeNumber})
                                </strong>{' '}
                                — recommend correlating instead of creating a duplicate.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Three Distinct Governed Adoption Actions */}
                      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openWizard(acc, 'Promote to Identity')}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                            !isNhiLikely && dups.length === 0
                              ? 'bg-[#0EA5E9] text-white shadow-xs hover:bg-[#0284C7]'
                              : 'border border-slate-200 bg-white text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]'
                          )}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>Promote to Identity</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openWizard(acc, 'Correlate to Existing')}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                            dups.length > 0
                              ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700'
                              : 'border border-slate-200 bg-white text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]'
                          )}
                        >
                          <Link2 className="h-3.5 w-3.5" />
                          <span>Correlate to Existing</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openWizard(acc, 'Classify as Non-Human')}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                            isNhiLikely
                              ? 'bg-violet-600 text-white shadow-xs hover:bg-violet-700'
                              : 'border border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-violet-700'
                          )}
                        >
                          <Bot className="h-3.5 w-3.5" />
                          <span>Classify as NHI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Tabs.Content>

        {/* ========== TAB 2: PROVENANCE LEDGER, APPROVALS & ROLLBACK ========== */}
        <Tabs.Content value="provenance" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                Adoption Provenance Ledger &amp; Rollback Controls
              </h2>
              <p className="text-xs text-slate-500">
                Full audit provenance distinguishing Creation Source, Authoritative Source, and Account Correlation Source — with reversible rollback.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Approval Ref &amp; Date</th>
                    <th className="px-4 py-3">Action &amp; Classification</th>
                    <th className="px-4 py-3">Original Account &amp; Source</th>
                    <th className="px-4 py-3">Adopted Identity / NHI</th>
                    <th className="px-4 py-3">Authoritative Source</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adoptionRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#0284C7]">
                          {rec.approvalReference}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {rec.adoptionDate} · {rec.adoptedBy}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#0F172A]">{rec.actionKind}</div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {rec.classification}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-semibold text-[#0F172A]">
                          {rec.originalAccountName}
                        </div>
                        <div className="text-[11px] text-slate-500">{rec.originalSource}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {rec.createdPersonId || rec.correlatedPersonId ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPersonId(
                                rec.createdPersonId ?? rec.correlatedPersonId!
                              );
                              setActiveSection('people');
                            }}
                            className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#0284C7] hover:underline"
                          >
                            <span>{rec.targetIdentityName}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <span>{rec.targetIdentityName}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-700">
                          {rec.authoritativeSource}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          Created via: {rec.originalSource}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                            rec.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : rec.status === 'Pending Approval'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-500'
                          )}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {rec.status === 'Pending Approval' && (
                          <button
                            type="button"
                            onClick={() => approvePendingAdoption(rec.id)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Approve Adoption</span>
                          </button>
                        )}
                        {rec.status === 'Completed' && (
                          <button
                            type="button"
                            onClick={() => rollbackAdoption(rec.id)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Rollback</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        {/* ======= TAB 3: PER-SYSTEM ATTRIBUTE MAPPINGS & ADOPTION POLICY ======= */}
        <Tabs.Content value="mappings" className="focus:outline-none">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            {/* Configurable Per-System Attribute Mappings */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs xl:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-[#0F172A]">
                    Per-System Attribute Mappings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure how source attributes from each connected system prepopulate identity fields during adoption.
                  </p>
                </div>
                <select
                  value={selectedMappingSystem}
                  onChange={(e) => setSelectedMappingSystem(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0F172A]"
                >
                  {adoptionMappings.map((m) => (
                    <option key={m.systemName} value={m.systemName}>
                      {m.systemName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Source Attribute ({currentSystemMapping.systemName})</th>
                      <th className="px-4 py-2.5">Identity Attribute</th>
                      <th className="px-4 py-2.5 text-right">Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentSystemMapping.rules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            value={rule.sourceAttribute}
                            onChange={(e) =>
                              updateSystemMappingRule(
                                currentSystemMapping.systemName,
                                rule.id,
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-[#0F172A]">
                          {rule.identityLabel}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                              rule.requiredForPromotion
                                ? 'bg-sky-50 text-[#0284C7]'
                                : 'bg-slate-100 text-slate-500'
                            )}
                          >
                            {rule.requiredForPromotion ? 'Mandatory' : 'Optional'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Adoption Governance Policy */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs xl:col-span-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-heading text-base font-bold text-[#0F172A]">
                  Adoption Governance Policy
                </h2>
                <p className="text-xs text-slate-500">
                  Control approval gates, duplicate detection rules, contractor expiry, and authoritative source defaults.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Adoption Authorization Mode
                  </label>
                  <select
                    value={adoptionPolicy.mode}
                    onChange={(e) =>
                      updateAdoptionPolicy({
                        mode: e.target.value as AdoptionPolicyConfig['mode'],
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A]"
                  >
                    <option value="Immediate (Permitted)">Immediate (Permitted)</option>
                    <option value="Require Approval (Manager / System Owner)">
                      Require Approval (Manager / System Owner)
                    </option>
                    <option value="Restricted (Governance Admins Only)">
                      Restricted (Governance Admins Only)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Default Authoritative Source (Separated from Account Source)
                  </label>
                  <select
                    value={adoptionPolicy.defaultAuthoritativeSource}
                    onChange={(e) =>
                      updateAdoptionPolicy({
                        defaultAuthoritativeSource: e.target
                          .value as AdoptionPolicyConfig['defaultAuthoritativeSource'],
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    {AUTHORITATIVE_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duplicate Detection Rules */}
                <div className="space-y-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5">
                  <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                    Duplicate Detection Matching Rules
                  </div>
                  {(
                    [
                      { key: 'matchEmail', label: 'Email address' },
                      { key: 'matchEmployeeNumber', label: 'Employee number' },
                      { key: 'matchUsername', label: 'Username / sAMAccountName' },
                      { key: 'matchFullName', label: 'First name + Last name' },
                    ] as const
                  ).map((rule) => (
                    <div key={rule.key} className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">{rule.label}</span>
                      <Switch.Root
                        checked={adoptionPolicy.duplicateRules[rule.key]}
                        onCheckedChange={(checked) =>
                          updateAdoptionPolicy({
                            duplicateRules: {
                              ...adoptionPolicy.duplicateRules,
                              [rule.key]: checked,
                            },
                          })
                        }
                        className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                      >
                        <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                      </Switch.Root>
                    </div>
                  ))}
                </div>

                {/* Lifecycle Safeguards */}
                <div className="space-y-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-700">
                      Require expiry date for adopted contractors
                    </span>
                    <Switch.Root
                      checked={adoptionPolicy.requireContractorExpiry}
                      onCheckedChange={(checked) =>
                        updateAdoptionPolicy({ requireContractorExpiry: checked })
                      }
                      className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-200/70 pt-2.5">
                    <span className="font-medium text-slate-700">
                      Mandatory manager / owner validation
                    </span>
                    <Switch.Root
                      checked={adoptionPolicy.requireOwnershipValidation}
                      onCheckedChange={(checked) =>
                        updateAdoptionPolicy({ requireOwnershipValidation: checked })
                      }
                      className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* ============== 5-STEP GUIDED ORPHANED ACCOUNT ADOPTION DRAWER ============== */}
      <Dialog.Root
        open={Boolean(activeAccount)}
        onOpenChange={(open) => {
          if (!open) setActiveAccountId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-4xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {activeAccount && activeMappingBundle && (
              <>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>Orphaned Account Adoption</span>
                      <span>·</span>
                      <span>{activeAccount.application}</span>
                      <span>·</span>
                      <span className="text-rose-600">Uncorrelated</span>
                    </div>
                    <Dialog.Title className="mt-0.5 font-display text-xl font-extrabold text-[#0F172A]">
                      {activeAccount.accountName}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-500">
                      {activeAccount.orphanReason}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close adoption wizard"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* 5-Step Progress Indicator */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-[#F8FAFC] px-6 py-3 font-mono text-[10px]">
                  {[
                    { n: 1, label: 'Identify Orphan' },
                    { n: 2, label: 'Map Attributes' },
                    { n: 3, label: 'Classify & Complete' },
                    { n: 4, label: 'Validate & Duplicates' },
                    { n: 5, label: 'Create & Correlate' },
                  ].map((st, idx) => (
                    <div key={st.n} className="flex items-center gap-1.5">
                      {idx > 0 && <ArrowRight className="h-3 w-3 text-slate-300" />}
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 font-bold',
                          activeStepNumber > st.n
                            ? 'bg-emerald-100 text-emerald-700'
                            : activeStepNumber === st.n
                              ? 'bg-[#0EA5E9] text-white'
                              : 'bg-slate-200 text-slate-500'
                        )}
                      >
                        {st.n}. {st.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Mode Switcher (3 Distinct Governed Actions) */}
                <div className="grid grid-cols-1 gap-2 border-b border-slate-100 px-6 py-3 sm:grid-cols-3">
                  {(
                    [
                      {
                        id: 'Promote to Identity' as const,
                        icon: UserPlus,
                        sub: 'Creates new human identity',
                      },
                      {
                        id: 'Correlate to Existing' as const,
                        icon: Link2,
                        sub: 'Links to existing identity (no duplicate)',
                      },
                      {
                        id: 'Classify as Non-Human' as const,
                        icon: Bot,
                        sub: 'Registers as governed NHI with owner',
                      },
                    ] as const
                  ).map((opt) => {
                    const Icon = opt.icon;
                    const active = actionMode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setActionMode(opt.id)}
                        className={cn(
                          'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all',
                          active
                            ? 'border-[#0EA5E9] bg-sky-50/70 ring-1 ring-sky-200'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            active ? 'text-[#0284C7]' : 'text-slate-400'
                          )}
                        />
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">{opt.id}</div>
                          <div className="text-[10px] text-slate-500">{opt.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Main Drawer Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 text-xs">
                  {/* ===== MODE 1: PROMOTE TO IDENTITY (Side-by-Side Account vs Identity) ===== */}
                  {actionMode === 'Promote to Identity' && (
                    <div className="space-y-5">
                      {/* Duplicate Safeguard Alert */}
                      {liveDuplicates.length > 0 && (
                        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center">
                          <div className="flex items-start gap-2.5">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <div>
                              <div className="font-mono text-[10px] font-bold text-amber-800 uppercase">
                                Duplicate Identity Safeguard Triggered
                              </div>
                              <div className="mt-0.5 font-semibold">
                                Potential match found:{' '}
                                {liveDuplicates[0].person.name} (
                                {liveDuplicates[0].person.employeeNumber}) —{' '}
                                {liveDuplicates[0].reasons.join(', ')}.
                              </div>
                              <div className="mt-0.5 text-[11px] text-amber-800">
                                Promotion is blocked until ambiguity is resolved. Correlate this orphaned account to the existing identity instead.
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCorrelatePersonId(liveDuplicates[0].person.id);
                              setActionMode('Correlate to Existing');
                            }}
                            className="shrink-0 cursor-pointer rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                          >
                            Correlate to {liveDuplicates[0].person.name}
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Left Column: Orphaned Account Source Attributes (Step 2) */}
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 lg:col-span-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-heading text-sm font-bold text-[#0F172A]">
                                Orphaned Account
                              </div>
                              <div className="font-mono text-[10px] text-slate-400">
                                Mapped via {activeMappingBundle.sysMap.systemName} rules
                              </div>
                            </div>
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-700">
                              Uncorrelated
                            </span>
                          </div>

                          <div className="divide-y divide-slate-200/70 rounded-xl border border-slate-200 bg-white">
                            {[
                              { label: 'Username', value: activeAccount.accountName, mono: true },
                              { label: 'Source system', value: activeAccount.application },
                              ...activeMappingBundle.sysMap.rules
                                .filter((r) => r.identityAttribute !== 'accountRef')
                                .map((rule) => {
                                  const val = activeAccount.rawAttributes?.[rule.sourceAttribute];
                                  return {
                                    label: `${rule.identityLabel}`,
                                    sourceHint: rule.sourceAttribute,
                                    value: val ?? null,
                                    mono: rule.identityAttribute === 'email',
                                  };
                                }),
                            ].map((row) => (
                              <div
                                key={row.label}
                                className="flex items-center justify-between gap-2 px-3 py-2"
                              >
                                <div>
                                  <div className="text-[11px] font-medium text-slate-500">
                                    {row.label}
                                  </div>
                                  {'sourceHint' in row && row.sourceHint && (
                                    <div className="font-mono text-[9px] text-slate-400">
                                      {row.sourceHint}
                                    </div>
                                  )}
                                </div>
                                {row.value ? (
                                  <span
                                    className={cn(
                                      'text-right font-semibold text-[#0F172A]',
                                      row.mono && 'font-mono text-[11px]'
                                    )}
                                  >
                                    {row.value}
                                  </span>
                                ) : (
                                  <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-600">
                                    Missing
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={handleEnrichAttributes}
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3 py-2 text-[11px] font-semibold text-[#0284C7] hover:bg-sky-50"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Enrich Missing Fields from Secondary Sources</span>
                          </button>

                          {enrichedBanner && (
                            <div className="rounded-lg bg-emerald-50 px-3 py-1.5 font-mono text-[10px] text-emerald-700">
                              Enriched missing employee # &amp; manager from Entra/HR cache.
                            </div>
                          )}
                        </div>

                        {/* Right Column: Identity Information Form (Step 3 & 4) */}
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-7">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <div className="font-heading text-sm font-bold text-[#0F172A]">
                                Identity Information
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Prepopulated automatically — supply only genuinely missing mandatory fields.
                              </div>
                            </div>

                            <span
                              className={cn(
                                'rounded-full px-2.5 py-1 font-mono text-[10px] font-bold',
                                requiredChecks.complete
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-800'
                              )}
                            >
                              Required: {requiredChecks.done}/{requiredChecks.total}{' '}
                              {requiredChecks.complete ? 'Ready' : 'Incomplete'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                First name *
                              </label>
                              <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                Last name *
                              </label>
                              <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                Email address *
                              </label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                Employee number *
                              </label>
                              <input
                                type="text"
                                value={employeeNumber}
                                onChange={(e) => setEmployeeNumber(e.target.value)}
                                placeholder="e.g. EMP-10955"
                                className={cn(
                                  'mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                                  !employeeNumber.trim()
                                    ? 'border-amber-300 bg-amber-50/40'
                                    : 'border-slate-200 bg-[#F8FAFC] focus:border-[#0EA5E9]'
                                )}
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                Manager *
                              </label>
                              <select
                                value={managerRefId}
                                onChange={(e) => setManagerRefId(e.target.value)}
                                className={cn(
                                  'mt-1 w-full rounded-xl border px-3 py-2 text-xs text-[#0F172A]',
                                  !managerRefId
                                    ? 'border-amber-300 bg-amber-50/40'
                                    : 'border-slate-200 bg-[#F8FAFC]'
                                )}
                              >
                                <option value="">Select manager...</option>
                                {MANAGERS.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                Identity classification *
                              </label>
                              <select
                                value={humanClass}
                                onChange={(e) =>
                                  setHumanClass(
                                    e.target.value as AdoptionHumanClassification
                                  )
                                }
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A]"
                              >
                                <option value="Employee">Employee</option>
                                <option value="Contractor">Contractor (Expiry Required)</option>
                                <option value="External Consultant">
                                  External Consultant (Expiry Required)
                                </option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                Department
                              </label>
                              <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                              />
                            </div>

                            {humanClass !== 'Employee' && (
                              <div className="sm:col-span-2">
                                <label className="block font-mono text-[10px] font-semibold text-amber-700 uppercase">
                                  Mandatory Contractor / Consultant Expiry Date *
                                </label>
                                <input
                                  type="date"
                                  value={expiryDate}
                                  onChange={(e) => setExpiryDate(e.target.value)}
                                  className="mt-1 w-full rounded-xl border border-amber-300 bg-amber-50/30 px-3 py-2 font-mono text-xs text-[#0F172A]"
                                />
                              </div>
                            )}

                            {/* Explicit Authoritative vs Creation Source Distinction (Consideration E) */}
                            <div className="sm:col-span-2">
                              <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                                Identity Authoritative Source (Account Is NOT Made Authoritative)
                              </label>
                              <select
                                value={authoritativeSource}
                                onChange={(e) => setAuthoritativeSource(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                              >
                                {AUTHORITATIVE_SOURCES.map((src) => (
                                  <option key={src} value={src}>
                                    {src}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Provenance Preview (Consideration D) */}
                          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-3 text-[11px]">
                            <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-[#0284C7] uppercase">
                              <Database className="h-3 w-3" />
                              <span>Recorded Identity Provenance</span>
                            </div>
                            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] text-slate-600">
                              <span>
                                Creation method: <strong className="text-[#0F172A]">Orphaned account adoption</strong>
                              </span>
                              <span>
                                Adopted by: <strong className="text-[#0F172A]">Ivan Lubbe</strong>
                              </span>
                              <span>
                                Creation source: <strong className="text-[#0F172A]">{activeAccount.application}</strong>
                              </span>
                              <span>
                                Authoritative: <strong className="text-[#0284C7]">{authoritativeSource}</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== MODE 2: CORRELATE TO EXISTING IDENTITY ===== */}
                  {actionMode === 'Correlate to Existing' && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-sky-200/80 bg-sky-50/40 p-4 text-xs text-slate-700">
                        <strong className="text-[#0F172A]">No new identity created:</strong> Search
                        and select an existing governed identity to bind orphaned account{' '}
                        <span className="font-mono font-bold text-[#0284C7]">
                          {activeAccount.accountName}
                        </span>{' '}
                        ({activeAccount.application}).
                      </div>

                      <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={correlateSearch}
                          onChange={(e) => setCorrelateSearch(e.target.value)}
                          placeholder="Search existing identities by name, employee #, email, or department..."
                          className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 pr-3 pl-9 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        {correlateFilteredPeople.map((person) => {
                          const isMatch = liveDuplicates.some((d) => d.person.id === person.id);
                          const selected = correlatePersonId === person.id;
                          return (
                            <button
                              key={person.id}
                              type="button"
                              onClick={() => setCorrelatePersonId(person.id)}
                              className={cn(
                                'flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all',
                                selected
                                  ? 'border-[#0EA5E9] bg-sky-50/60 ring-1 ring-sky-200'
                                  : isMatch
                                    ? 'border-amber-200 bg-amber-50/40 hover:border-amber-300'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                              )}
                            >
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-heading text-sm font-bold text-[#0F172A]">
                                    {person.name}
                                  </span>
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                                    {person.employeeNumber}
                                  </span>
                                  {isMatch && (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                                      Recommended Match
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5 text-[11px] text-slate-500">
                                  {person.email} · {person.title} · {person.department}
                                </div>
                              </div>
                              {selected && (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0EA5E9]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ===== MODE 3: CLASSIFY AS NON-HUMAN IDENTITY (NHI) ===== */}
                  {actionMode === 'Classify as Non-Human' && (
                    <div className="max-w-xl space-y-4">
                      <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-xs text-violet-950">
                        <strong>Non-Human Identity (NHI) Classification:</strong> Register{' '}
                        <span className="font-mono font-bold">{activeAccount.accountName}</span>{' '}
                        under Non-Human Governance with an accountable human owner rather than promoting it as an employee.
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                          Non-Human Classification *
                        </label>
                        <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {NHI_CLASSIFICATIONS.map((kind) => (
                            <button
                              key={kind}
                              type="button"
                              onClick={() => setNhiKind(kind)}
                              className={cn(
                                'cursor-pointer rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all',
                                nhiKind === kind
                                  ? 'border-violet-400 bg-violet-50 text-violet-900 ring-1 ring-violet-200'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                              )}
                            >
                              {kind}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                          Accountable Human Owner (GA-CTRL-05) *
                        </label>
                        <select
                          value={nhiOwner}
                          onChange={(e) => setNhiOwner(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A]"
                        >
                          {MANAGERS.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name} ({m.dept})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                          Privilege Scope &amp; Purpose
                        </label>
                        <textarea
                          rows={2}
                          value={nhiScope}
                          onChange={(e) => setNhiScope(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Drawer Action Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-[#F8FAFC] px-6 py-4">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>

                  <button
                    type="button"
                    onClick={handleExecuteAdoption}
                    disabled={
                      (actionMode === 'Promote to Identity' &&
                        (!requiredChecks.complete || liveDuplicates.length > 0)) ||
                      (actionMode === 'Correlate to Existing' && !correlatePersonId) ||
                      (actionMode === 'Classify as Non-Human' && !nhiOwner)
                    }
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50',
                      actionMode === 'Classify as Non-Human'
                        ? 'bg-violet-600 hover:bg-violet-700'
                        : 'bg-[#0EA5E9] hover:bg-[#0284C7]'
                    )}
                  >
                    {actionMode === 'Promote to Identity' && (
                      <>
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>
                          {adoptionPolicy.mode === 'Require Approval (Manager / System Owner)'
                            ? 'Submit Adoption for Approval'
                            : 'Promote to Identity & Correlate'}
                        </span>
                      </>
                    )}
                    {actionMode === 'Correlate to Existing' && (
                      <>
                        <GitMerge className="h-3.5 w-3.5" />
                        <span>Correlate Account to Existing Identity</span>
                      </>
                    )}
                    {actionMode === 'Classify as Non-Human' && (
                      <>
                        <Bot className="h-3.5 w-3.5" />
                        <span>Register as Governed Non-Human Identity</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
