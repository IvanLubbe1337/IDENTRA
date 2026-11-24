import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Download,
  FileJson,
  FileSpreadsheet,
  GitMerge,
  History,
  KeyRound,
  Link2,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  evaluateBirthrightMatches,
  type IdentityHistoryEntry,
} from '@/data/demoSampleData';
import { Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type ReportTabId =
  | 'entitlements'
  | 'accounts'
  | 'orphaned'
  | 'unapproved'
  | 'identity-changes'
  | 'birthrights'
  | 'executive';

const REPORT_TABS: {
  id: ReportTabId;
  label: string;
  icon: typeof KeyRound;
}[] = [
  { id: 'entitlements', label: 'Entitlements', icon: KeyRound },
  { id: 'accounts', label: 'Accounts', icon: UserCheck },
  { id: 'orphaned', label: 'Orphaned Accounts', icon: UserX },
  { id: 'unapproved', label: 'Not Approved Entitlements', icon: ShieldAlert },
  { id: 'identity-changes', label: 'Identity Changes', icon: History },
  { id: 'birthrights', label: 'Birthright Coverage', icon: GitMerge },
  { id: 'executive', label: 'Executive Summary', icon: BarChart3 },
];

function escapeCsvCell(val: unknown): string {
  const str = String(val ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ReportingView() {
  const people = useDemoStore((s) => s.people);
  const nonHumans = useDemoStore((s) => s.nonHumans);
  const entitlements = useDemoStore((s) => s.entitlements);
  const roles = useDemoStore((s) => s.roles);
  const accounts = useDemoStore((s) => s.accounts);
  const reviews = useDemoStore((s) => s.reviews);
  const policies = useDemoStore((s) => s.policies);
  const birthrights = useDemoStore((s) => s.birthrights);
  const importRuns = useDemoStore((s) => s.importRuns);
  const provisioningJobs = useDemoStore((s) => s.provisioningJobs);
  const searchQuery = useDemoStore((s) => s.searchQuery);

  const revokeEntitlementDrift = useDemoStore((s) => s.revokeEntitlementDrift);
  const quarantineOrphanAccount = useDemoStore((s) => s.quarantineOrphanAccount);
  const linkOrphanAccountToOwner = useDemoStore((s) => s.linkOrphanAccountToOwner);
  const remediateNonHumanDrift = useDemoStore((s) => s.remediateNonHumanDrift);
  const setSelectedPersonId = useDemoStore((s) => s.setSelectedPersonId);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [activeTab, setActiveTab] = useState<ReportTabId>('entitlements');
  const [appFilter, setAppFilter] = useState<string>('All');
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>('ALL');
  const [changeCategoryFilter, setChangeCategoryFilter] = useState<
    'All' | IdentityHistoryEntry['category']
  >('All');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const needle = searchQuery.trim().toLowerCase();

  // 1. Entitlements Report Dataset (Live entitlements + role-derived sample breakdown)
  const entitlementRows = useMemo(() => {
    const directRows = entitlements.map((e) => ({
      id: e.id,
      name: e.name,
      application: e.application,
      assignedTo: e.assignedTo,
      source: e.source,
      sensitivity: e.sensitivity,
      status: e.status,
      approvalState: e.status === 'Drift' ? 'Not Approved' : e.status === 'Revoked' ? 'Revoked' : 'Approved',
      canRevoke: e.status === 'Drift',
    }));

    const roleDerivedRows = roles.flatMap((role) =>
      role.entitlementList.slice(0, 2).map((re) => ({
        id: `role-${role.id}-${re.id}`,
        name: re.name,
        application: re.application,
        assignedTo: `${role.name} (${role.members} members)`,
        source: 'Business Role',
        sensitivity: re.sensitivity,
        status: 'Reconciled' as const,
        approvalState: 'Approved',
        canRevoke: false,
      }))
    );

    return [...directRows, ...roleDerivedRows].filter((row) => {
      if (appFilter !== 'All' && row.application !== appFilter) return false;
      if (!needle) return true;
      return `${row.name} ${row.application} ${row.assignedTo} ${row.source} ${row.status}`
        .toLowerCase()
        .includes(needle);
    });
  }, [entitlements, roles, appFilter, needle]);

  // 2. Accounts Inventory Dataset
  const accountRows = useMemo(() => {
    return accounts.filter((acc) => {
      if (appFilter !== 'All' && acc.application !== appFilter) return false;
      if (!needle) return true;
      return `${acc.accountName} ${acc.application} ${acc.accountType} ${acc.correlatedIdentity ?? 'Unmatched'} ${acc.correlationState}`
        .toLowerCase()
        .includes(needle);
    });
  }, [accounts, appFilter, needle]);

  // 3. Orphaned Accounts Dataset
  const orphanedRows = useMemo(() => {
    return accounts.filter((acc) => {
      if (acc.correlationState !== 'Orphaned') return false;
      if (appFilter !== 'All' && acc.application !== appFilter) return false;
      if (!needle) return true;
      return `${acc.accountName} ${acc.application} ${acc.orphanReason ?? ''} ${acc.correlatedIdentity ?? ''}`
        .toLowerCase()
        .includes(needle);
    });
  }, [accounts, appFilter, needle]);

  // 4. Not Approved Entitlements Dataset (Unreconciled Direct Drift + Pending Reviews + Shadow NHI)
  const unapprovedRows = useMemo(() => {
    const items: {
      id: string;
      entitlement: string;
      application: string;
      identity: string;
      category: 'Unreconciled Direct Grant' | 'Pending Certification' | 'Shadow AI / NHI Grant';
      risk: 'Critical' | 'High' | 'Medium';
      detail: string;
      actionKind: 'revoke-drift' | 'open-review' | 'contain-nhi';
      actionId: string;
    }[] = [];

    entitlements
      .filter((e) => e.status === 'Drift')
      .forEach((e) => {
        items.push({
          id: `unapp-ent-${e.id}`,
          entitlement: e.name,
          application: e.application,
          identity: e.assignedTo,
          category: 'Unreconciled Direct Grant',
          risk: e.sensitivity === 'Critical' ? 'Critical' : 'High',
          detail: `Detected out-of-band without approved role or workflow (${e.source}).`,
          actionKind: 'revoke-drift',
          actionId: e.id,
        });
      });

    reviews
      .filter((r) => r.decision === 'Pending')
      .forEach((r) => {
        items.push({
          id: `unapp-rev-${r.id}`,
          entitlement: r.roleOrEntitlement,
          application: r.application,
          identity: r.identity,
          category: 'Pending Certification',
          risk: r.risk === 'High' ? 'High' : 'Medium',
          detail: `Awaiting ${r.reviewer} attestation · Process++ recommends ${r.aiRecommendation}.`,
          actionKind: 'open-review',
          actionId: r.id,
        });
      });

    nonHumans
      .filter((n) => n.status === 'Shadow Drift')
      .forEach((n) => {
        items.push({
          id: `unapp-nh-${n.id}`,
          entitlement: n.privilegeScope,
          application: n.targetSystem,
          identity: n.name,
          category: 'Shadow AI / NHI Grant',
          risk: 'Critical',
          detail: `Unattested ${n.kind} privilege · Owner: ${n.owner} · Last rotated ${n.lastRotated}.`,
          actionKind: 'contain-nhi',
          actionId: n.id,
        });
      });

    return items.filter((item) => {
      if (appFilter !== 'All' && item.application !== appFilter) return false;
      if (!needle) return true;
      return `${item.entitlement} ${item.application} ${item.identity} ${item.category} ${item.detail}`
        .toLowerCase()
        .includes(needle);
    });
  }, [entitlements, reviews, nonHumans, appFilter, needle]);

  // 5. Per-Identity Change History Report Dataset
  const identityChangeRows = useMemo(() => {
    const targetPeople =
      selectedIdentityId === 'ALL'
        ? people
        : people.filter((p) => p.id === selectedIdentityId);

    const flattened = targetPeople.flatMap((person) =>
      person.changeHistory.flatMap((entry) =>
        entry.changes.map((diff, idx) => ({
          id: `${person.id}-${entry.id}-${idx}`,
          personId: person.id,
          identityName: person.name,
          employeeNumber: person.employeeNumber,
          department: person.department,
          jmlStatus: person.jmlStatus,
          timestamp: entry.timestamp,
          category: entry.category,
          source: entry.source,
          summary: entry.summary,
          field: diff.field,
          before: diff.before ?? '—',
          after: diff.after ?? '—',
        }))
      )
    );

    return flattened
      .filter((row) => {
        if (changeCategoryFilter !== 'All' && row.category !== changeCategoryFilter) {
          return false;
        }
        if (!needle) return true;
        return `${row.identityName} ${row.employeeNumber} ${row.category} ${row.source} ${row.field} ${row.before} ${row.after} ${row.summary}`
          .toLowerCase()
          .includes(needle);
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [people, selectedIdentityId, changeCategoryFilter, needle]);

  // 6. Birthright Coverage Dataset
  const birthrightReportRows = useMemo(() => {
    return birthrights.map((rule) => {
      const matched = evaluateBirthrightMatches(rule, people);
      return {
        id: rule.id,
        code: rule.code,
        name: rule.name,
        scopeMode: rule.scopeMode,
        status: rule.status,
        provisioningMode: rule.provisioningMode,
        matchedCount: matched.length,
        matchedNames: matched.map((m) => m.name).join(', ') || 'None',
        grantsCount: rule.grants.length,
        totalDerivedGrants: matched.length * rule.grants.length,
        autoRevoke: rule.autoRevokeOnExit ? 'Enabled' : 'Disabled',
      };
    });
  }, [birthrights, people]);

  const uniqueApps = useMemo(() => {
    const set = new Set<string>();
    accounts.forEach((a) => set.add(a.application));
    entitlements.forEach((e) => set.add(e.application));
    reviews.forEach((r) => set.add(r.application));
    return Array.from(set).sort();
  }, [accounts, entitlements, reviews]);

  const activeExportPayload = (): { filename: string; rows: Record<string, unknown>[] } => {
    const dateStamp = new Date().toISOString().slice(0, 10);
    switch (activeTab) {
      case 'entitlements':
        return {
          filename: `identra-entitlements-report-${dateStamp}`,
          rows: entitlementRows.map(({ name, application, assignedTo, source, sensitivity, status, approvalState }) => ({
            entitlement: name,
            application,
            assignedTo,
            source,
            sensitivity,
            status,
            approvalState,
          })),
        };
      case 'accounts':
        return {
          filename: `identra-accounts-inventory-${dateStamp}`,
          rows: accountRows.map(({ accountName, application, accountType, correlatedIdentity, correlationState, accountStatus, privileged, lastLogin, riskScore }) => ({
            accountName,
            application,
            accountType,
            correlatedIdentity: correlatedIdentity ?? 'UNMATCHED',
            correlationState,
            accountStatus,
            privileged,
            lastLogin,
            riskScore,
          })),
        };
      case 'orphaned':
        return {
          filename: `identra-orphaned-accounts-${dateStamp}`,
          rows: orphanedRows.map(({ accountName, application, accountType, privileged, daysInactive, orphanReason, riskScore }) => ({
            accountName,
            application,
            accountType,
            privileged,
            daysInactive,
            orphanReason: orphanReason ?? '',
            riskScore,
          })),
        };
      case 'unapproved':
        return {
          filename: `identra-not-approved-entitlements-${dateStamp}`,
          rows: unapprovedRows.map(({ entitlement, application, identity, category, risk, detail }) => ({
            entitlement,
            application,
            identity,
            category,
            risk,
            detail,
          })),
        };
      case 'identity-changes':
        return {
          filename: `identra-identity-changes-${selectedIdentityId.toLowerCase()}-${dateStamp}`,
          rows: identityChangeRows.map(({ timestamp, identityName, employeeNumber, category, source, field, before, after, summary }) => ({
            timestamp,
            identityName,
            employeeNumber,
            category,
            source,
            field,
            before,
            after,
            summary,
          })),
        };
      case 'birthrights':
        return {
          filename: `identra-birthright-coverage-${dateStamp}`,
          rows: birthrightReportRows.map(({ code, name, scopeMode, status, provisioningMode, matchedCount, matchedNames, grantsCount, totalDerivedGrants }) => ({
            code,
            name,
            scopeMode,
            status,
            provisioningMode,
            matchedCount,
            matchedNames,
            grantsCount,
            totalDerivedGrants,
          })),
        };
      case 'executive':
        return {
          filename: `identra-executive-posture-${dateStamp}`,
          rows: [
            { metric: 'Total Managed Identities', value: people.length },
            { metric: 'Total Target Accounts', value: accounts.length },
            { metric: 'Orphaned Accounts', value: accounts.filter((a) => a.correlationState === 'Orphaned').length },
            { metric: 'Not Approved Entitlements', value: unapprovedRows.length },
            { metric: 'Active SoD / Policy Violations', value: policies.reduce((s, p) => s + p.violations, 0) },
            { metric: 'Pending Access Reviews', value: reviews.filter((r) => r.decision === 'Pending').length },
            { metric: 'Shadow AI / NHI Drift', value: nonHumans.filter((n) => n.status === 'Shadow Drift').length },
            { metric: 'Active Birthright Rules', value: birthrights.filter((b) => b.status === 'Active').length },
          ],
        };
    }
  };

  const handleExportCsv = () => {
    const { filename, rows } = activeExportPayload();
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => escapeCsvCell(r[h])).join(',')),
    ].join('\n');
    downloadFile(`${filename}.csv`, csv, 'text/csv;charset=utf-8;');
    setExportFeedback(`Exported ${rows.length} rows to ${filename}.csv`);
    window.setTimeout(() => setExportFeedback(null), 3500);
  };

  const handleExportJson = () => {
    const { filename, rows } = activeExportPayload();
    downloadFile(`${filename}.json`, JSON.stringify(rows, null, 2), 'application/json');
    setExportFeedback(`Exported ${rows.length} records to ${filename}.json`);
    window.setTimeout(() => setExportFeedback(null), 3500);
  };

  const openPersonProfile = (personId: string) => {
    setSelectedPersonId(personId);
    setActiveSection('people');
  };

  const totalOrphans = accounts.filter((a) => a.correlationState === 'Orphaned').length;
  const totalUnapproved = unapprovedRows.length;
  const totalSoDViolations = policies.reduce((s, p) => s + p.violations, 0);
  const totalChangesLogged = people.reduce(
    (sum, p) => sum + p.changeHistory.reduce((cSum, e) => cSum + e.changes.length, 0),
    0
  );

  return (
    <div className="space-y-5">
      {/* Header & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Governance &amp; Identity Reporting
          </h1>
          <p className="text-sm text-slate-500">
            Live audit-ready reports across entitlements, target accounts, orphaned accounts, unapproved grants, and per-identity change history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0EA5E9]"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
          >
            <FileJson className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {exportFeedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
          <Download className="h-3.5 w-3.5 text-emerald-600" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* Executive KPI Summary Bar */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveTab('orphaned')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all hover:border-rose-200"
        >
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Orphaned Accounts
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                totalOrphans > 0 ? 'text-rose-600' : 'text-emerald-600'
              )}
            >
              {totalOrphans}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              of {accounts.length} accounts
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unapproved')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all hover:border-amber-200"
        >
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Not Approved Entitlements
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                totalUnapproved > 0 ? 'text-amber-600' : 'text-emerald-600'
              )}
            >
              {totalUnapproved}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Drift · Pending · Shadow
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identity-changes')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all hover:border-sky-200"
        >
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Audited Identity Changes
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {totalChangesLogged}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              across {people.length} identities
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('executive')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all hover:border-sky-200"
        >
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Active Policy Violations
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                totalSoDViolations > 0 ? 'text-rose-600' : 'text-emerald-600'
              )}
            >
              {totalSoDViolations}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              SOX · JML · AI Guardrails
            </span>
          </div>
        </button>
      </div>

      {/* Radix Tabs Report Switcher */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ReportTabId)}
        className="space-y-4"
      >
        <Tabs.List className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          {REPORT_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const badge =
              tab.id === 'orphaned' && totalOrphans > 0
                ? totalOrphans
                : tab.id === 'unapproved' && totalUnapproved > 0
                  ? totalUnapproved
                  : null;
            return (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all focus:outline-none',
                  active
                    ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-[#0EA5E9]' : 'text-slate-400')} />
                <span>{tab.label}</span>
                {badge !== null && (
                  <span className="rounded-full bg-rose-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-700">
                    {badge}
                  </span>
                )}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {/* Shared Target Application Filter (for App-scoped Reports) */}
        {(activeTab === 'entitlements' ||
          activeTab === 'accounts' ||
          activeTab === 'orphaned' ||
          activeTab === 'unapproved') && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                Application:
              </span>
              {['All', ...uniqueApps].map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setAppFilter(app)}
                  className={cn(
                    'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                    appFilter === app
                      ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  )}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. ENTITLEMENTS REPORT */}
        <Tabs.Content value="entitlements" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Entitlements Assignment Report
                </h2>
                <p className="text-xs text-slate-500">
                  Direct, role-derived, and JIT entitlements reconciled across connected systems.
                </p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-500">
                {entitlementRows.length} rows
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Entitlement</th>
                    <th className="px-4 py-3">Application</th>
                    <th className="px-4 py-3">Assigned To</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Sensitivity</th>
                    <th className="px-4 py-3">Approval State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entitlementRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0F172A]">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.application}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{row.assignedTo}</td>
                      <td className="px-4 py-3 text-slate-500">{row.source}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                            row.sensitivity === 'Critical'
                              ? 'bg-rose-50 text-rose-600'
                              : row.sensitivity === 'High'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {row.sensitivity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                            row.approvalState === 'Not Approved'
                              ? 'bg-rose-50 text-rose-600'
                              : row.approvalState === 'Revoked'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-emerald-50 text-emerald-700'
                          )}
                        >
                          {row.approvalState}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        {/* 2. ACCOUNTS INVENTORY REPORT */}
        <Tabs.Content value="accounts" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Target Accounts Inventory Report
                </h2>
                <p className="text-xs text-slate-500">
                  Human, contractor, service, and AI agent accounts correlated against authoritative identity records.
                </p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-500">
                {accountRows.length} accounts
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Account ID / UPN</th>
                    <th className="px-4 py-3">Application</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Correlated Identity</th>
                    <th className="px-4 py-3">Correlation</th>
                    <th className="px-4 py-3">Status &amp; Last Login</th>
                    <th className="px-4 py-3 text-right">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accountRows.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-[#0F172A]">
                          <span>{acc.accountName}</span>
                          {acc.privileged && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 uppercase">
                              Priv
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{acc.application}</td>
                      <td className="px-4 py-3 text-slate-500">{acc.accountType}</td>
                      <td className="px-4 py-3">
                        {acc.personId && acc.correlatedIdentity ? (
                          <button
                            type="button"
                            onClick={() => openPersonProfile(acc.personId!)}
                            className="inline-flex cursor-pointer items-center gap-1 font-medium text-[#0284C7] hover:underline"
                          >
                            <span>{acc.correlatedIdentity}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="font-mono text-[11px] text-rose-600">
                            {acc.correlatedIdentity ?? 'Unmatched (No Owner)'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                            acc.correlationState === 'Orphaned'
                              ? 'bg-rose-50 text-rose-600'
                              : acc.correlationState === 'Disabled (Leaver)'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-emerald-50 text-emerald-700'
                          )}
                        >
                          {acc.correlationState}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="font-medium text-slate-800">{acc.accountStatus}</span> ·{' '}
                        <span className="font-mono text-[10px] text-slate-400">
                          {acc.lastLogin}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            'font-mono font-bold',
                            acc.riskScore >= 70
                              ? 'text-rose-600'
                              : acc.riskScore >= 30
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                          )}
                        >
                          {acc.riskScore}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        {/* 3. ORPHANED ACCOUNTS REPORT */}
        <Tabs.Content value="orphaned" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Orphaned &amp; Ownerless Accounts Report
                </h2>
                <p className="text-xs text-slate-500">
                  Target accounts with no active authoritative HR identity or terminated owner — remediate directly below.
                </p>
              </div>
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-600">
                {orphanedRows.length} active orphans
              </span>
            </div>

            {orphanedRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
                <div className="font-heading text-sm font-bold text-[#0F172A]">
                  Zero Orphaned Accounts Detected
                </div>
                <p className="text-xs text-slate-500">
                  All target system accounts are correlated or safely quarantined.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Orphaned Account</th>
                      <th className="px-4 py-3">Application</th>
                      <th className="px-4 py-3">Detection Reason</th>
                      <th className="px-4 py-3">Inactivity</th>
                      <th className="px-4 py-3 text-right">Remediation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orphanedRows.map((acc) => (
                      <tr key={acc.id} className="hover:bg-rose-50/20">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 font-mono font-semibold text-[#0F172A]">
                            <span>{acc.accountName}</span>
                            {acc.privileged && (
                              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 uppercase">
                                Privileged
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                            {acc.accountType} · Risk {acc.riskScore}/100
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">
                          {acc.application}
                        </td>
                        <td className="max-w-sm px-4 py-3.5 text-slate-600">
                          {acc.orphanReason}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-600">
                          {acc.daysInactive === 0
                            ? 'Active today'
                            : `${acc.daysInactive}d inactive`}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => linkOrphanAccountToOwner(acc.id, 'p-priya')}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                            >
                              <Link2 className="h-3 w-3" />
                              <span>Assign Steward</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => quarantineOrphanAccount(acc.id)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-700"
                            >
                              <Scissors className="h-3 w-3" />
                              <span>Quarantine</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Tabs.Content>

        {/* 4. NOT APPROVED ENTITLEMENTS REPORT */}
        <Tabs.Content value="unapproved" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Not Approved &amp; Uncertified Entitlements Report
                </h2>
                <p className="text-xs text-slate-500">
                  Consolidates direct out-of-band privilege drift, pending access certifications, and unattested AI/service grants.
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-700">
                {unapprovedRows.length} exceptions
              </span>
            </div>

            {unapprovedRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <div className="font-heading text-sm font-bold text-[#0F172A]">
                  100% Approved Entitlement Baseline
                </div>
                <p className="text-xs text-slate-500">
                  Zero unreconciled direct grants, pending reviews, or shadow AI permissions remain.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Entitlement / Grant</th>
                      <th className="px-4 py-3">Identity</th>
                      <th className="px-4 py-3">Exception Category</th>
                      <th className="px-4 py-3">Governance Detail</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {unapprovedRows.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3.5">
                          <div className="font-mono font-semibold text-[#0F172A]">
                            {item.entitlement}
                          </div>
                          <div className="text-[11px] text-slate-500">{item.application}</div>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-800">
                          {item.identity}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                              item.category === 'Unreconciled Direct Grant'
                                ? 'bg-rose-50 text-rose-600'
                                : item.category === 'Shadow AI / NHI Grant'
                                  ? 'bg-violet-50 text-violet-700'
                                  : 'bg-amber-50 text-amber-700'
                            )}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="max-w-sm px-4 py-3.5 text-slate-600">{item.detail}</td>
                        <td className="px-4 py-3.5 text-right">
                          {item.actionKind === 'revoke-drift' && (
                            <button
                              type="button"
                              onClick={() => revokeEntitlementDrift(item.actionId)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-700"
                            >
                              <Scissors className="h-3 w-3" />
                              <span>Revoke</span>
                            </button>
                          )}
                          {item.actionKind === 'contain-nhi' && (
                            <button
                              type="button"
                              onClick={() => remediateNonHumanDrift(item.actionId)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-violet-700"
                            >
                              <ShieldAlert className="h-3 w-3" />
                              <span>Contain</span>
                            </button>
                          )}
                          {item.actionKind === 'open-review' && (
                            <button
                              type="button"
                              onClick={() => setActiveSection('access-reviews')}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                            >
                              <span>Review</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Tabs.Content>

        {/* 5. PER-IDENTITY CHANGES REPORT */}
        <Tabs.Content value="identity-changes" className="space-y-4 focus:outline-none">
          {/* Identity & Category Filter Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                Identity Scope:
              </label>
              <select
                value={selectedIdentityId}
                onChange={(e) => setSelectedIdentityId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Identities ({people.length})</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.employeeNumber}) — {p.changeHistory.length} event(s)
                  </option>
                ))}
              </select>

              {selectedIdentityId !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => openPersonProfile(selectedIdentityId)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-[#0284C7] hover:bg-sky-100"
                >
                  <span>Inspect Full Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'All',
                  'HRIS Sync',
                  'JML Lifecycle',
                  'Context Change',
                  'Role / SoD',
                  'Provisioning',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setChangeCategoryFilter(cat)}
                  className={cn(
                    'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                    changeCategoryFilter === cat
                      ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Per-Identity Attribute &amp; Lifecycle Change Log
                </h2>
                <p className="text-xs text-slate-500">
                  Field-level audit trail capturing HRIS updates, transfers, context changes, SoD fixes, and provisioning events.
                </p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-500">
                {identityChangeRows.length} field diffs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Identity</th>
                    <th className="px-4 py-3">Category &amp; Source</th>
                    <th className="px-4 py-3">Attribute</th>
                    <th className="px-4 py-3">Before → After</th>
                    <th className="px-4 py-3">Event Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {identityChangeRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-slate-500">
                        {row.timestamp}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openPersonProfile(row.personId)}
                          className="cursor-pointer text-left font-semibold text-[#0284C7] hover:underline"
                        >
                          {row.identityName}
                        </button>
                        <div className="font-mono text-[10px] text-slate-400">
                          {row.employeeNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                          {row.category}
                        </span>
                        <div className="mt-0.5 text-[10px] text-slate-400">{row.source}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#0F172A]">
                        {row.field}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500 line-through">
                            {row.before}
                          </span>
                          <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">
                            {row.after}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-xs px-4 py-3 text-slate-600">{row.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        {/* 6. BIRTHRIGHT COVERAGE REPORT */}
        <Tabs.Content value="birthrights" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Birthright Rule Coverage &amp; Derived Access Report
                </h2>
                <p className="text-xs text-slate-500">
                  Live mapping of attribute-driven, context-driven, and composite birthright policies against the workforce.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('birthrights')}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
              >
                <span>Manage Birthrights</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Rule</th>
                    <th className="px-4 py-3">Targeting Scope</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Matched Identities</th>
                    <th className="px-4 py-3 text-right">Derived Grants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {birthrightReportRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                            {row.code}
                          </span>
                          <span className="font-semibold text-[#0F172A]">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">
                        {row.scopeMode}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                            row.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          )}
                        >
                          {row.status} · {row.provisioningMode}
                        </span>
                      </td>
                      <td className="max-w-xs px-4 py-3.5 text-slate-600">
                        <strong className="font-mono text-[#0F172A]">{row.matchedCount}</strong>{' '}
                        <span className="text-[11px] text-slate-500">({row.matchedNames})</span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-[#0284C7]">
                        {row.totalDerivedGrants}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        {/* 7. EXECUTIVE & DEMO POSTURE SUMMARY */}
        <Tabs.Content value="executive" className="focus:outline-none">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* SoD & Policy Guardrail Posture */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  SoD &amp; Governance Policy Posture
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveSection('policies-sod')}
                  className="inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
                >
                  <span>Policies</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-3 space-y-2.5">
                {policies.map((pol) => (
                  <div
                    key={pol.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3.5 py-2.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A]">
                        <span className="mr-1.5 font-mono text-[10px] text-[#0284C7]">
                          {pol.code}
                        </span>
                        {pol.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {pol.violations > 0 && pol.affectedIdentity
                          ? `Affected: ${pol.affectedIdentity}`
                          : 'Zero active violations'}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                        pol.violations > 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {pol.violations} {pol.violations === 1 ? 'Breach' : 'Breaches'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Human Identities & Operational Pipeline Health */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                    Non-Human &amp; AI Agent Risk Report
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveSection('non-human')}
                    className="inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
                  >
                    <span>Non-human IDs</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {nonHumans.map((nh) => (
                    <div
                      key={nh.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-3.5 py-2 text-xs"
                    >
                      <div>
                        <div className="font-mono font-semibold text-[#0F172A]">{nh.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {nh.kind} · {nh.targetSystem} · Rotated {nh.lastRotated}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                          nh.status === 'Shadow Drift'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        )}
                      >
                        {nh.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Import &amp; Provisioning Pipeline Health
                </h2>
                <div className="mt-3 grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-xl bg-[#F8FAFC] p-3">
                    <div className="font-mono text-lg font-extrabold text-[#0F172A]">
                      {provisioningJobs.filter((j) => j.status === 'Simulation Mode').length}
                    </div>
                    <div className="text-[10px] text-slate-500">Simulated Jobs</div>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] p-3">
                    <div className="font-mono text-lg font-extrabold text-rose-600">
                      {importRuns.filter((r) => r.status === 'Failed').length +
                        provisioningJobs.filter((j) => j.status === 'Failed').length}
                    </div>
                    <div className="text-[10px] text-slate-500">Failed Sync / Jobs</div>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] p-3">
                    <div className="font-mono text-lg font-extrabold text-emerald-600">
                      {reviews.filter((r) => r.decision !== 'Pending').length}/{reviews.length}
                    </div>
                    <div className="text-[10px] text-slate-500">Reviews Certified</div>
                  </div>
                </div>
                {importRuns.some((r) => r.status === 'Failed') && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <span>
                      1 scheduled Entra ID import failed credential handshake — review under Operations → Imports.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
