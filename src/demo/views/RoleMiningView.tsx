import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  GitMerge,
  KeyRound,
  Layers,
  Network,
  RefreshCw,
  Scissors,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  INITIAL_ENTITLEMENT_CORRELATIONS,
  type DemoMinedRoleCandidate,
} from '@/data/demoSampleData';
import { Dialog, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type MiningTabId = 'clusters' | 'correlations' | 'outliers' | 'optimisation';

export function RoleMiningView() {
  const minedRoles = useDemoStore((s) => s.minedRoles);
  const miningOutliers = useDemoStore((s) => s.miningOutliers);
  const roleOptimisations = useDemoStore((s) => s.roleOptimisations);
  const searchQuery = useDemoStore((s) => s.searchQuery);

  const runRoleMiningDiscovery = useDemoStore((s) => s.runRoleMiningDiscovery);
  const promoteMinedRole = useDemoStore((s) => s.promoteMinedRole);
  const resolveMiningOutlier = useDemoStore((s) => s.resolveMiningOutlier);
  const applyRoleOptimisation = useDemoStore((s) => s.applyRoleOptimisation);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [activeTab, setActiveTab] = useState<MiningTabId>('clusters');
  const [minConfidence, setMinConfidence] = useState<number>(80);
  const [roleKindFilter, setRoleKindFilter] = useState<'All' | 'Business Role' | 'IT Role'>('All');
  const [simulateRoleId, setSimulateRoleId] = useState<string | null>(null);

  const needle = searchQuery.trim().toLowerCase();

  const filteredCandidates = useMemo(() => {
    return minedRoles.filter((cand) => {
      if (cand.confidenceScore < minConfidence) return false;
      if (roleKindFilter !== 'All' && cand.roleKind !== roleKindFilter) return false;
      if (!needle) return true;
      const hay = [
        cand.code,
        cand.suggestedRoleName,
        cand.roleKind,
        ...cand.attributes.map((a) => `${a.label} ${a.value}`),
        ...cand.entitlements.map((e) => `${e.name} ${e.application}`),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [minedRoles, minConfidence, roleKindFilter, needle]);

  const filteredOutliers = useMemo(() => {
    return miningOutliers.filter((o) => {
      if (!needle) return true;
      return `${o.identityName} ${o.employeeNumber} ${o.peerCluster} ${o.outlierEntitlement} ${o.application} ${o.reason}`
        .toLowerCase()
        .includes(needle);
    });
  }, [miningOutliers, needle]);

  const filteredOptimisations = useMemo(() => {
    return roleOptimisations.filter((opt) => {
      if (!needle) return true;
      return `${opt.category} ${opt.primaryRole} ${opt.comparedRole ?? ''} ${opt.recommendation}`
        .toLowerCase()
        .includes(needle);
    });
  }, [roleOptimisations, needle]);

  const simulatedCandidate: DemoMinedRoleCandidate | null = simulateRoleId
    ? (minedRoles.find((m) => m.id === simulateRoleId) ?? null)
    : null;

  const openOutliersCount = miningOutliers.filter((o) => o.status === 'Flagged').length;
  const openOptimisationsCount = roleOptimisations.filter((o) => o.status === 'Open').length;
  const recommendedCount = minedRoles.filter((m) => m.status === 'Recommended').length;
  const avgConfidence = Math.round(
    minedRoles.reduce((sum, m) => sum + m.confidenceScore, 0) / Math.max(1, minedRoles.length)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Role Mining &amp; Discovery
          </h1>
          <p className="text-sm text-slate-500">
            Analyze <strong className="text-slate-700">500 identities</strong> to discover attribute clusters, correlated entitlements, high-confidence role recommendations, peer outliers, and role optimisations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection('roles')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
          >
            <Shield className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>View Live Roles</span>
          </button>

          <button
            type="button"
            onClick={runRoleMiningDiscovery}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Run Discovery Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Identities Clustered
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">500</span>
            <span className="font-mono text-[11px] text-emerald-600">
              {minedRoles.length} clusters
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Role Recommendations
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {recommendedCount}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Avg {avgConfidence}% confidence
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('outliers')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all hover:border-rose-200"
        >
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Peer Outliers Flagged
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                openOutliersCount > 0 ? 'text-rose-600' : 'text-emerald-600'
              )}
            >
              {openOutliersCount}
            </span>
            <span className="font-mono text-[11px] text-slate-400">Excessive access</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('optimisation')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all hover:border-amber-200"
        >
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Role Optimisations
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                openOptimisationsCount > 0 ? 'text-amber-600' : 'text-emerald-600'
              )}
            >
              {openOptimisationsCount}
            </span>
            <span className="font-mono text-[11px] text-slate-400">Overlap · Redundant</span>
          </div>
        </button>
      </div>

      {/* Radix Tabs covering all 7 Role Mining Capabilities */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as MiningTabId)}
        className="space-y-4"
      >
        <Tabs.List className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          {[
            { id: 'clusters' as const, label: 'Clusters & Role Recommendations', icon: Sparkles, badge: recommendedCount },
            { id: 'correlations' as const, label: 'Entitlement Correlation', icon: Network, badge: null },
            { id: 'outliers' as const, label: 'Outlier Detection', icon: AlertTriangle, badge: openOutliersCount },
            { id: 'optimisation' as const, label: 'Role Optimisation', icon: GitMerge, badge: openOptimisationsCount },
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
                {tab.badge !== null && tab.badge > 0 && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold',
                      tab.id === 'outliers'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-sky-100 text-[#0284C7]'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {/* TAB 1: IDENTITY CLUSTERING, CONFIDENCE SCORING, RECOMMENDATIONS & SIMULATION */}
        <Tabs.Content value="clusters" className="space-y-4 focus:outline-none">
          {/* Confidence Threshold & Role Type Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase">
                Min Confidence Score:
              </span>
              <input
                type="range"
                min={75}
                max={95}
                step={1}
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="h-1.5 w-32 cursor-pointer accent-[#0EA5E9]"
              />
              <span className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-xs font-bold text-[#0284C7]">
                ≥ {minConfidence}%
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Business Role', 'IT Role'] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setRoleKindFilter(kind)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    roleKindFilter === kind
                      ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  )}
                >
                  {kind === 'All' ? 'All Roles' : `${kind}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Role Cards */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredCandidates.map((cand) => {
              const isPromoted = cand.status === 'Promoted';
              return (
                <div
                  key={cand.id}
                  className={cn(
                    'flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all',
                    isPromoted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-sky-200'
                  )}
                >
                  <div>
                    {/* Header: Suggested Role + Confidence Score */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                            {cand.code}
                          </span>
                          <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                            {cand.roleKind}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500">
                            <Users className="h-3 w-3 text-[#0EA5E9]" />
                            {cand.matchedIdentitiesCount} of {cand.analyzedPopulation} identities
                          </span>
                        </div>
                        <h2 className="mt-1.5 font-heading text-base font-bold text-[#0F172A]">
                          {cand.suggestedRoleName}
                        </h2>
                      </div>

                      {/* Role Confidence Score Badge */}
                      <div className="shrink-0 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-1.5 text-right">
                        <div className="font-display text-lg font-extrabold leading-none text-[#0284C7]">
                          {cand.confidenceScore}%
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] font-semibold text-slate-500 uppercase">
                          Confidence
                        </div>
                      </div>
                    </div>

                    {/* Discovered Identity Cluster Pattern */}
                    <div className="mt-3.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5">
                      <div className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                        Identity Cluster · Common Organisational Attributes
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {cand.attributes.map((attr) => (
                          <div
                            key={attr.label}
                            className="rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5"
                          >
                            <div className="font-mono text-[9px] text-slate-400 uppercase">
                              {attr.label}
                            </div>
                            <div className="mt-0.5 text-xs font-semibold text-[#0F172A]">
                              {attr.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Correlated Entitlements with Support % */}
                    <div className="mt-3.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                          Correlated Entitlements ({cand.entitlements.length})
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700">
                          Replaces {cand.directGrantsReplaced} direct grants
                        </span>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {cand.entitlements.map((ent) => (
                          <div
                            key={ent.name}
                            className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 bg-[#FBFDFF] px-3 py-2 text-xs"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <KeyRound className="h-3.5 w-3.5 shrink-0 text-[#0EA5E9]" />
                              <span className="truncate font-semibold text-[#0F172A]">
                                {ent.name}
                              </span>
                              <span className="hidden truncate font-mono text-[10px] text-slate-400 sm:inline">
                                · {ent.application}
                              </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-slate-100 sm:block">
                                <div
                                  className="h-full rounded-full bg-[#0EA5E9]"
                                  style={{ width: `${ent.supportPct}%` }}
                                />
                              </div>
                              <span className="font-mono text-[10px] font-bold text-[#0284C7]">
                                {ent.supportPct}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Simulate & Promote */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>SoD: {cand.sodCheck}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSimulateRoleId(cand.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                      >
                        <FlaskConical className="h-3.5 w-3.5 text-[#0EA5E9]" />
                        <span>Simulate Role</span>
                      </button>

                      {isPromoted ? (
                        <button
                          type="button"
                          onClick={() => setActiveSection('roles')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Promoted · View</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => promoteMinedRole(cand.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0EA5E9] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0284C7]"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Promote to Role</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.Content>

        {/* TAB 2: ENTITLEMENT CORRELATION */}
        <Tabs.Content value="correlations" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                Discovered Entitlement Correlation Patterns
              </h2>
              <p className="text-xs text-slate-500">
                High-lift entitlement sets frequently co-assigned across the 500-identity dataset.
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {INITIAL_ENTITLEMENT_CORRELATIONS.map((corr) => {
                const matchingCand = minedRoles.find((m) => m.code === corr.clusterCode);
                return (
                  <div
                    key={corr.id}
                    className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0284C7]">
                          {corr.clusterCode}
                        </span>
                        <span className="font-heading text-sm font-bold text-[#0F172A]">
                          {corr.suggestedRoleName}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          {corr.coOccurrencePct}% co-occurrence · Lift {corr.liftScore}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {corr.entitlements.map((ent, idx) => (
                          <div key={ent} className="flex items-center gap-1.5">
                            {idx > 0 && (
                              <span className="font-mono text-[10px] font-bold text-slate-300">
                                +
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-slate-700">
                              <Layers className="h-3 w-3 text-[#0EA5E9]" />
                              {ent}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-[#0F172A]">
                          {corr.identityCount}
                        </div>
                        <div className="text-[10px] text-slate-400">Identities</div>
                      </div>
                      {matchingCand && (
                        <button
                          type="button"
                          onClick={() => setSimulateRoleId(matchingCand.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                        >
                          <span>Simulate</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Tabs.Content>

        {/* TAB 3: OUTLIER DETECTION */}
        <Tabs.Content value="outliers" className="focus:outline-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Peer Group Outlier Detection
                </h2>
                <p className="text-xs text-slate-500">
                  Identities holding unusual or excessive privileges compared to their organisational peer cluster.
                </p>
              </div>
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-700">
                {openOutliersCount} flagged outliers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Identity &amp; Peer Cluster</th>
                    <th className="px-4 py-3">Outlier Entitlement</th>
                    <th className="px-4 py-3">Peer Prevalence</th>
                    <th className="px-4 py-3">Anomaly Detail</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOutliers.map((out) => (
                    <tr key={out.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#0F172A]">
                            {out.identityName}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                            {out.employeeNumber}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {out.peerCluster}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-mono font-semibold text-rose-700">
                          {out.outlierEntitlement}
                        </div>
                        <div className="text-[11px] text-slate-500">{out.application}</div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                          {out.peerPrevalencePct}% of peers
                        </span>
                        <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                          {out.peerRatioLabel} · Risk {out.riskScore}
                        </div>
                      </td>

                      <td className="max-w-xs px-4 py-3.5 text-slate-600">{out.reason}</td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {out.status === 'Flagged' ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => resolveMiningOutlier(out.id, 'review')}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                            >
                              <ClipboardCheck className="h-3 w-3" />
                              <span>Send to Review</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => resolveMiningOutlier(out.id, 'revoke')}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                            >
                              <Scissors className="h-3 w-3" />
                              <span>Revoke</span>
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{out.status}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        {/* TAB 4: ROLE OPTIMISATION */}
        <Tabs.Content value="optimisation" className="focus:outline-none">
          <div className="space-y-3">
            {filteredOptimisations.map((opt) => (
              <div
                key={opt.id}
                className={cn(
                  'flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 shadow-xs sm:flex-row sm:items-center',
                  opt.status === 'Optimised'
                    ? 'border-emerald-200 bg-emerald-50/25'
                    : 'border-slate-200'
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase',
                        opt.category === 'Redundant'
                          ? 'bg-rose-50 text-rose-700'
                          : opt.category === 'Overlapping'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {opt.category}
                    </span>
                    <span className="font-heading text-sm font-bold text-[#0F172A]">
                      {opt.primaryRole}
                    </span>
                    {opt.comparedRole && (
                      <span className="font-mono text-[11px] text-slate-500">
                        ↔ {opt.comparedRole} ({opt.overlapPct}% overlap)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{opt.recommendation}</p>
                  <div className="font-mono text-[10px] text-slate-400">
                    {opt.membersAffected} identities affected · Consolidates {opt.entitlementsSaved}{' '}
                    redundant entitlements
                  </div>
                </div>

                <div className="shrink-0">
                  {opt.status === 'Optimised' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Optimised</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => applyRoleOptimisation(opt.id)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0EA5E9]"
                    >
                      <GitMerge className="h-3.5 w-3.5" />
                      <span>
                        {opt.category === 'Underutilised'
                          ? 'Archive Role'
                          : 'Consolidate Role'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Radix Slide-Over Role Simulation Impact Drawer (#6 Role Simulation) */}
      <Dialog.Root
        open={Boolean(simulatedCandidate)}
        onOpenChange={(open) => {
          if (!open) setSimulateRoleId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {simulatedCandidate && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>Role Simulation Preview</span>
                      <span>·</span>
                      <span>{simulatedCandidate.code}</span>
                      <span>·</span>
                      <span>{simulatedCandidate.confidenceScore}% Confidence</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {simulatedCandidate.suggestedRoleName}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-slate-500">
                      Projected identity and entitlement impact across {simulatedCandidate.matchedIdentitiesCount} clustered identities if implemented.
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close role simulation"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-xs">
                  {/* Impact Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                      <div className="font-mono text-[9px] font-semibold text-slate-400 uppercase">
                        Identities Matched
                      </div>
                      <div className="mt-1 font-display text-2xl font-extrabold text-[#0F172A]">
                        {simulatedCandidate.matchedIdentitiesCount}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                      <div className="font-mono text-[9px] font-semibold text-slate-400 uppercase">
                        Direct Grants Replaced
                      </div>
                      <div className="mt-1 font-display text-2xl font-extrabold text-[#0284C7]">
                        {simulatedCandidate.directGrantsReplaced}
                      </div>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                      <div className="font-mono text-[9px] font-semibold text-emerald-700 uppercase">
                        Preventative SoD
                      </div>
                      <div className="mt-1 font-heading text-sm font-bold text-emerald-800">
                        {simulatedCandidate.sodCheck}
                      </div>
                    </div>
                  </div>

                  {/* Role Entitlement Bundle */}
                  <div>
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Entitlements Included in Proposed Role ({simulatedCandidate.entitlements.length})
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {simulatedCandidate.entitlements.map((ent) => (
                        <div
                          key={ent.name}
                          className="rounded-xl border border-sky-100 bg-sky-50/40 p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[#0F172A]">{ent.name}</span>
                            <span className="font-mono text-[10px] font-bold text-[#0284C7]">
                              {ent.supportPct}%
                            </span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {ent.application}
                          </div>
                          <div className="mt-1 truncate font-mono text-[9px] text-slate-400">
                            {ent.technicalId}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Per-Identity Simulation Table */}
                  <div>
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Simulated Provisioning Delta (Sample of {simulatedCandidate.matchedIdentitiesCount} Identities)
                    </div>
                    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] text-slate-500 uppercase">
                          <tr>
                            <th className="px-3.5 py-2.5">Identity</th>
                            <th className="px-3.5 py-2.5">Already Held</th>
                            <th className="px-3.5 py-2.5">Net-New Provisioned</th>
                            <th className="px-3.5 py-2.5 text-right">SoD</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {simulatedCandidate.simulationSample.map((row) => (
                            <tr key={row.id}>
                              <td className="px-3.5 py-2.5">
                                <div className="font-semibold text-[#0F172A]">{row.name}</div>
                                <div className="font-mono text-[10px] text-slate-400">
                                  {row.employeeNumber} · {row.location}
                                </div>
                              </td>
                              <td className="px-3.5 py-2.5 font-mono text-slate-600">
                                {row.existingEntitlementsCount}/{simulatedCandidate.entitlements.length}
                              </td>
                              <td className="px-3.5 py-2.5">
                                {row.netNewEntitlements.length === 0 ? (
                                  <span className="font-mono text-[10px] text-slate-400">
                                    0 new (100% matched)
                                  </span>
                                ) : (
                                  <div className="flex flex-wrap gap-1">
                                    {row.netNewEntitlements.map((e) => (
                                      <span
                                        key={e}
                                        className="rounded bg-sky-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]"
                                      >
                                        + {e}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="px-3.5 py-2.5 text-right">
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                                  {row.sodStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-[#F8FAFC] px-6 py-4">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Close Simulation
                    </button>
                  </Dialog.Close>

                  {simulatedCandidate.status === 'Promoted' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Already Promoted to Roles</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        promoteMinedRole(simulatedCandidate.id);
                        setSimulateRoleId(null);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Promote &amp; Create {simulatedCandidate.roleKind}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
