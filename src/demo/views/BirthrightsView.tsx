import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  GitMerge,
  KeyRound,
  Layers,
  Play,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  BIRTHRIGHT_ATTRIBUTE_OPTIONS,
  evaluateBirthrightMatches,
  type BirthrightAttributeCondition,
  type BirthrightAttributeField,
  type BirthrightAttributeOperator,
  type BirthrightContextClause,
  type BirthrightContextOperator,
  type BirthrightGrant,
  type BirthrightScopeMode,
  type DemoBirthrightRule,
} from '@/data/demoSampleData';
import { REFERENCE_OBJECTS } from '@/data/referenceObjectsData';
import { Dialog, Switch } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const SCOPE_FILTERS: ('All' | BirthrightScopeMode)[] = [
  'All',
  'Identity Attributes',
  'Single Context',
  'Context Combination',
  'Hybrid (Attributes + Contexts)',
];

const CONTEXT_OBJECTS = Object.values(REFERENCE_OBJECTS).filter(
  (obj) => obj.kind === 'Context'
);

const CONTEXT_OPERATOR_LABEL: Record<BirthrightContextOperator, string> = {
  ALL_OF: 'ALL OF (AND)',
  ANY_OF: 'ANY OF (OR)',
  NONE_OF: 'NONE OF (EXCLUDE)',
};

const ATTR_OPERATOR_LABEL: Record<BirthrightAttributeOperator, string> = {
  equals: '=',
  not_equals: '≠',
  contains: 'contains',
};

const TARGET_SYSTEMS = [
  'Active Directory',
  'Microsoft Entra ID',
  'Okta Workforce Cloud',
  'SAP S/4HANA Finance',
  'AWS Prod Vault',
  'Snowflake PII Lake',
  'GitHub Enterprise',
];

function fieldLabel(field: BirthrightAttributeField): string {
  return (
    BIRTHRIGHT_ATTRIBUTE_OPTIONS.find((opt) => opt.field === field)?.label ?? field
  );
}

function contextName(ctxId: string): { code: string; name: string; status: string } {
  const ref = REFERENCE_OBJECTS[ctxId];
  if (!ref) return { code: ctxId, name: ctxId, status: 'Active' };
  return { code: ref.code, name: ref.name, status: ref.status };
}

function scopeBadgeTone(mode: BirthrightScopeMode): string {
  switch (mode) {
    case 'Identity Attributes':
      return 'border-sky-200 bg-sky-50 text-[#0284C7]';
    case 'Single Context':
      return 'border-indigo-200 bg-indigo-50 text-indigo-700';
    case 'Context Combination':
      return 'border-violet-200 bg-violet-50 text-violet-700';
    case 'Hybrid (Attributes + Contexts)':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
}

export function BirthrightsView() {
  const birthrights = useDemoStore((s) => s.birthrights);
  const people = useDemoStore((s) => s.people);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const toggleBirthrightStatus = useDemoStore((s) => s.toggleBirthrightStatus);
  const addBirthrightRule = useDemoStore((s) => s.addBirthrightRule);
  const deleteBirthrightRule = useDemoStore((s) => s.deleteBirthrightRule);
  const runBirthrightReconciliation = useDemoStore((s) => s.runBirthrightReconciliation);
  const setSelectedPersonId = useDemoStore((s) => s.setSelectedPersonId);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [scopeFilter, setScopeFilter] = useState<'All' | BirthrightScopeMode>('All');
  const [inspectRuleId, setInspectRuleId] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);

  // Builder state
  const [draftName, setDraftName] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftOwner, setDraftOwner] = useState('Identity Operations');
  const [draftScopeMode, setDraftScopeMode] =
    useState<BirthrightScopeMode>('Hybrid (Attributes + Contexts)');
  const [draftCombinator, setDraftCombinator] = useState<'ALL' | 'ANY'>('ALL');
  const [draftProvisioningMode, setDraftProvisioningMode] = useState<
    'Auto-Provision' | 'Simulation Mode'
  >('Auto-Provision');
  const [draftAutoRevoke, setDraftAutoRevoke] = useState(true);
  const [draftAttributes, setDraftAttributes] = useState<BirthrightAttributeCondition[]>([
    { id: 'draft-ac-1', field: 'department', operator: 'equals', value: 'Corporate Finance & Treasury' },
  ]);
  const [draftContextClauses, setDraftContextClauses] = useState<BirthrightContextClause[]>([
    { id: 'draft-cc-1', operator: 'ANY_OF', contextIds: ['ctx-fin-uk-fte'] },
  ]);
  const [draftGrants, setDraftGrants] = useState<BirthrightGrant[]>([
    {
      id: 'draft-g-1',
      kind: 'Business Role',
      name: 'Finance: Base Ledger Read',
      targetSystem: 'SAP S/4HANA Finance',
    },
  ]);

  const evaluatedMap = useMemo(() => {
    const map = new Map<string, typeof people>();
    birthrights.forEach((rule) => {
      map.set(rule.id, evaluateBirthrightMatches(rule, people));
    });
    return map;
  }, [birthrights, people]);

  const filteredRules = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return birthrights.filter((rule) => {
      if (scopeFilter !== 'All' && rule.scopeMode !== scopeFilter) return false;
      if (!needle) return true;
      const hay = [
        rule.code,
        rule.name,
        rule.description,
        rule.scopeMode,
        rule.owner,
        ...rule.attributeConditions.map((a) => `${a.field} ${a.value}`),
        ...rule.contextClauses.flatMap((c) =>
          c.contextIds.map((id) => `${id} ${contextName(id).name} ${contextName(id).code}`)
        ),
        ...rule.grants.map((g) => `${g.name} ${g.targetSystem}`),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [birthrights, scopeFilter, searchQuery]);

  const activeCount = birthrights.filter((b) => b.status === 'Active').length;
  const contextDrivenCount = birthrights.filter(
    (b) => b.contextClauses.length > 0
  ).length;
  const totalGrantAssignments = useMemo(() => {
    return birthrights.reduce((sum, rule) => {
      if (rule.status !== 'Active') return sum;
      const matched = evaluatedMap.get(rule.id)?.length ?? 0;
      return sum + matched * rule.grants.length;
    }, 0);
  }, [birthrights, evaluatedMap]);

  const inspectedRule: DemoBirthrightRule | null =
    birthrights.find((b) => b.id === inspectRuleId) ?? null;
  const inspectedMatches = inspectedRule ? evaluatedMap.get(inspectedRule.id) ?? [] : [];

  // Live preview rule inside Builder Modal
  const draftRulePreview: DemoBirthrightRule = useMemo(() => {
    const useAttrs =
      draftScopeMode === 'Identity Attributes' ||
      draftScopeMode === 'Hybrid (Attributes + Contexts)';
    const useCtx =
      draftScopeMode === 'Single Context' ||
      draftScopeMode === 'Context Combination' ||
      draftScopeMode === 'Hybrid (Attributes + Contexts)';

    return {
      id: 'preview',
      code: 'PREVIEW',
      name: draftName || 'Untitled Birthright Rule',
      description: draftDesc,
      scopeMode: draftScopeMode,
      combinator: draftCombinator,
      attributeConditions: useAttrs ? draftAttributes : [],
      contextClauses: useCtx ? draftContextClauses : [],
      grants: draftGrants,
      provisioningMode: draftProvisioningMode,
      autoRevokeOnExit: draftAutoRevoke,
      status: 'Active',
      owner: draftOwner,
      lastEvaluated: 'Live preview',
    };
  }, [
    draftName,
    draftDesc,
    draftScopeMode,
    draftCombinator,
    draftAttributes,
    draftContextClauses,
    draftGrants,
    draftProvisioningMode,
    draftAutoRevoke,
    draftOwner,
  ]);

  const previewMatches = useMemo(
    () => evaluateBirthrightMatches(draftRulePreview, people),
    [draftRulePreview, people]
  );

  const resetBuilder = () => {
    setDraftName('');
    setDraftDesc('');
    setDraftOwner('Identity Operations');
    setDraftScopeMode('Hybrid (Attributes + Contexts)');
    setDraftCombinator('ALL');
    setDraftProvisioningMode('Auto-Provision');
    setDraftAutoRevoke(true);
    setDraftAttributes([
      {
        id: `draft-ac-${Date.now()}`,
        field: 'department',
        operator: 'equals',
        value: 'Corporate Finance & Treasury',
      },
    ]);
    setDraftContextClauses([
      {
        id: `draft-cc-${Date.now()}`,
        operator: 'ANY_OF',
        contextIds: ['ctx-fin-uk-fte'],
      },
    ]);
    setDraftGrants([
      {
        id: `draft-g-${Date.now()}`,
        kind: 'Business Role',
        name: 'Finance: Base Ledger Read',
        targetSystem: 'SAP S/4HANA Finance',
      },
    ]);
  };

  const handleScopeChange = (nextMode: BirthrightScopeMode) => {
    setDraftScopeMode(nextMode);
    if (nextMode === 'Single Context') {
      setDraftContextClauses([
        {
          id: `draft-cc-${Date.now()}`,
          operator: 'ALL_OF',
          contextIds: [draftContextClauses[0]?.contextIds[0] ?? 'ctx-fin-uk-fte'],
        },
      ]);
    } else if (nextMode === 'Context Combination' && draftContextClauses.length === 0) {
      setDraftContextClauses([
        {
          id: `draft-cc-${Date.now()}`,
          operator: 'ANY_OF',
          contextIds: ['ctx-sre-jit', 'ctx-data-steward'],
        },
      ]);
    }
  };

  const toggleClauseContext = (clauseId: string, ctxId: string) => {
    setDraftContextClauses((prev) =>
      prev.map((clause) => {
        if (clause.id !== clauseId) return clause;
        if (draftScopeMode === 'Single Context') {
          return { ...clause, operator: 'ALL_OF', contextIds: [ctxId] };
        }
        const exists = clause.contextIds.includes(ctxId);
        return {
          ...clause,
          contextIds: exists
            ? clause.contextIds.filter((id) => id !== ctxId)
            : [...clause.contextIds, ctxId],
        };
      })
    );
  };

  const handleSaveRule = () => {
    const cleanName = draftName.trim();
    if (!cleanName) return;

    const useAttrs =
      draftScopeMode === 'Identity Attributes' ||
      draftScopeMode === 'Hybrid (Attributes + Contexts)';
    const useCtx =
      draftScopeMode === 'Single Context' ||
      draftScopeMode === 'Context Combination' ||
      draftScopeMode === 'Hybrid (Attributes + Contexts)';

    const cleanAttrs = useAttrs
      ? draftAttributes.filter((a) => a.value.trim() !== '')
      : [];
    const cleanCtx = useCtx
      ? draftContextClauses.filter((c) => c.contextIds.length > 0)
      : [];
    const cleanGrants = draftGrants.filter((g) => g.name.trim() !== '');

    if ((cleanAttrs.length === 0 && cleanCtx.length === 0) || cleanGrants.length === 0) {
      return;
    }

    addBirthrightRule({
      name: cleanName,
      description:
        draftDesc.trim() ||
        `Dynamic ${draftScopeMode.toLowerCase()} birthright policy provisioning ${cleanGrants.length} access grant(s).`,
      scopeMode: draftScopeMode,
      combinator: draftCombinator,
      attributeConditions: cleanAttrs,
      contextClauses: cleanCtx,
      grants: cleanGrants,
      provisioningMode: draftProvisioningMode,
      autoRevokeOnExit: draftAutoRevoke,
      status: 'Active',
      owner: draftOwner.trim() || 'Identity Operations',
    });

    setBuilderOpen(false);
    resetBuilder();
  };

  const showAttributeSection =
    draftScopeMode === 'Identity Attributes' ||
    draftScopeMode === 'Hybrid (Attributes + Contexts)';
  const showContextSection =
    draftScopeMode === 'Single Context' ||
    draftScopeMode === 'Context Combination' ||
    draftScopeMode === 'Hybrid (Attributes + Contexts)';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Birthright Access Policies
          </h1>
          <p className="text-sm text-slate-500">
            Declarative Day-1 &amp; continuous access rules evaluated live on{' '}
            <strong className="text-slate-700">identity attributes</strong>,{' '}
            <strong className="text-slate-700">Process++ contexts</strong>, or{' '}
            <strong className="text-slate-700">combinations of contexts</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetBuilder();
            setBuilderOpen(true);
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Birthright Rule</span>
        </button>
      </div>

      {/* Compact Live KPI Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Active Birthrights
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">
              {activeCount}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              / {birthrights.length} rules
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Context-Driven Policies
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-indigo-600">
              {contextDrivenCount}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Single / Combo / Hybrid
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Derived Entitlement Grants
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {totalGrantAssignments}
            </span>
            <span className="font-mono text-[11px] text-emerald-600">
              Live evaluated
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Auto-Revoke on Exit
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-emerald-600">
              100%
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Zero stale drift
            </span>
          </div>
        </div>
      </div>

      {/* Scope Mode Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {SCOPE_FILTERS.map((mode) => {
          const count =
            mode === 'All'
              ? birthrights.length
              : birthrights.filter((b) => b.scopeMode === mode).length;
          const active = scopeFilter === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setScopeFilter(mode)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {mode}{' '}
              <span className="font-mono text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Birthright Policy Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filteredRules.map((rule) => {
          const matches = evaluatedMap.get(rule.id) ?? [];
          const isPaused = rule.status === 'Paused';

          return (
            <div
              key={rule.id}
              className={cn(
                'flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all',
                isPaused
                  ? 'border-slate-200/80 opacity-75'
                  : 'border-slate-200 hover:border-sky-200'
              )}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {rule.code}
                      </span>
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold',
                          scopeBadgeTone(rule.scopeMode)
                        )}
                      >
                        {rule.scopeMode}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                          rule.provisioningMode === 'Simulation Mode'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        )}
                      >
                        {rule.provisioningMode}
                      </span>
                    </div>
                    <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                      {rule.name}
                    </h2>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {rule.status}
                    </span>
                    <Switch.Root
                      checked={rule.status === 'Active'}
                      onCheckedChange={() => toggleBirthrightStatus(rule.id)}
                      aria-label={`Toggle ${rule.name}`}
                      className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {rule.description}
                </p>

                {/* Structured Criteria Expression Block */}
                <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                      <SlidersHorizontal className="h-3 w-3 text-[#0EA5E9]" />
                      Eligibility Criteria ({rule.combinator === 'ALL' ? 'Match ALL' : 'Match ANY'})
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Owner: {rule.owner}
                    </span>
                  </div>

                  {/* Identity Property / Attribute Conditions */}
                  {rule.attributeConditions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-sky-100/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#0284C7] uppercase">
                        Attr
                      </span>
                      {rule.attributeConditions.map((cond, idx) => (
                        <div key={cond.id} className="flex items-center gap-1.5">
                          {idx > 0 && (
                            <span className="font-mono text-[9px] font-bold text-slate-400">
                              {rule.combinator === 'ALL' ? 'AND' : 'OR'}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-700">
                            <strong className="text-[#0F172A]">{fieldLabel(cond.field)}</strong>
                            <span className="text-[#0284C7]">
                              {ATTR_OPERATOR_LABEL[cond.operator]}
                            </span>
                            <span>&quot;{cond.value}&quot;</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Context / Multi-Context Combination Clauses */}
                  {rule.contextClauses.length > 0 && (
                    <div className="space-y-1.5">
                      {rule.contextClauses.map((clause, idx) => (
                        <div key={clause.id} className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded bg-violet-100/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-violet-700 uppercase">
                            <Layers className="h-2.5 w-2.5" />
                            {clause.operator === 'NONE_OF'
                              ? 'Exclude Context'
                              : idx > 0
                                ? `${rule.combinator} Context`
                                : 'Context'}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-violet-600">
                            {CONTEXT_OPERATOR_LABEL[clause.operator]}
                          </span>
                          {clause.contextIds.map((ctxId) => {
                            const info = contextName(ctxId);
                            return (
                              <span
                                key={ctxId}
                                title={info.name}
                                className={cn(
                                  'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 font-mono text-[10px] font-medium',
                                  clause.operator === 'NONE_OF'
                                    ? 'border-rose-200 bg-rose-50/70 text-rose-700'
                                    : 'border-violet-200 bg-white text-violet-900'
                                )}
                              >
                                <span>{info.code}</span>
                                <span className="hidden text-slate-400 sm:inline">
                                  · {info.name}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Provisioned Grants */}
                <div className="mt-3.5">
                  <div className="font-mono text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                    Automatically Provisioned Access ({rule.grants.length})
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {rule.grants.map((grant) => (
                      <span
                        key={grant.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-100 bg-sky-50/60 px-2.5 py-1 text-[11px] font-medium text-[#0284C7]"
                      >
                        <KeyRound className="h-3 w-3 shrink-0 text-[#0EA5E9]" />
                        <span className="font-semibold text-[#0F172A]">{grant.name}</span>
                        <span className="font-mono text-[9px] text-slate-500">
                          ({grant.targetSystem})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectRuleId(rule.id)}
                    className="group inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 font-mono text-xs font-semibold text-[#0F172A] transition-all hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
                  >
                    <Users className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    <span>
                      {matches.length} matched{' '}
                      {matches.length === 1 ? 'identity' : 'identities'}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-[#0284C7]" />
                  </button>

                  {rule.autoRevokeOnExit && (
                    <span className="hidden items-center gap-1 font-mono text-[10px] text-emerald-700 sm:inline-flex">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Auto-revoke
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">
                    {rule.lastEvaluated}
                  </span>
                  <button
                    type="button"
                    onClick={() => runBirthrightReconciliation(rule.id)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                  >
                    <Play className="h-3 w-3 fill-current text-[#0EA5E9]" />
                    <span>Evaluate</span>
                  </button>
                  {!rule.id.startsWith('br-00') && (
                    <button
                      type="button"
                      onClick={() => deleteBirthrightRule(rule.id)}
                      title="Delete custom birthright rule"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radix Slide-Over Birthright Rule & Live Match Inspector */}
      <Dialog.Root
        open={Boolean(inspectedRule)}
        onOpenChange={(open) => {
          if (!open) setInspectRuleId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspectedRule && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>{inspectedRule.code}</span>
                      <span>·</span>
                      <span>{inspectedRule.scopeMode}</span>
                      <span>·</span>
                      <span>{inspectedRule.provisioningMode}</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {inspectedRule.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-slate-500">
                      {inspectedRule.description}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close birthright inspector"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                  {/* Provisioned Pack Summary */}
                  <div>
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Granted Access Bundle ({inspectedRule.grants.length})
                    </div>
                    <div className="mt-2 space-y-2">
                      {inspectedRule.grants.map((grant) => (
                        <div
                          key={grant.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-[#FBFDFF] px-3.5 py-2.5"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#0F172A]">{grant.name}</div>
                            <div className="font-mono text-[10px] text-slate-500">
                              {grant.targetSystem}
                            </div>
                          </div>
                          <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                            {grant.kind}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Matched Identities */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Live Matched Identities ({inspectedMatches.length} of {people.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => runBirthrightReconciliation(inspectedRule.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0EA5E9] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#0284C7]"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Run Reconciliation</span>
                      </button>
                    </div>

                    {inspectedMatches.length === 0 ? (
                      <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                        No identities currently satisfy all criteria for {inspectedRule.code}.
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2.5">
                        {inspectedMatches.map((person) => (
                          <div
                            key={person.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-heading text-sm font-bold text-[#0F172A]">
                                  {person.name}
                                </span>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                                  {person.employeeNumber}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                                  {person.jmlStatus}
                                </span>
                              </div>
                              <div className="mt-0.5 text-xs text-slate-500">
                                {person.title} · {person.department} · {person.location}
                              </div>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {person.contextRefIds.map((ctxId) => {
                                  const info = contextName(ctxId);
                                  return (
                                    <span
                                      key={ctxId}
                                      className="rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-violet-700"
                                    >
                                      {info.code}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPersonId(person.id);
                                setInspectRuleId(null);
                                setActiveSection('people');
                              }}
                              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                            >
                              <span>Profile</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </button>
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

      {/* Radix Modal: Create New Birthright Rule Builder */}
      <Dialog.Root open={builderOpen} onOpenChange={setBuilderOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl focus:outline-none">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                  <GitMerge className="h-3.5 w-3.5" />
                  <span>Birthright Policy Designer</span>
                </div>
                <Dialog.Title className="mt-0.5 font-display text-lg font-extrabold text-[#0F172A]">
                  Create Attribute &amp; Context Birthright Rule
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500">
                  Target identities by HR attributes, a single context, or a combination of contexts with live match simulation.
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close builder"
                  className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* Rule Metadata */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="e.g. UK Engineering SRE Baseline"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Policy Owner
                  </label>
                  <input
                    type="text"
                    value={draftOwner}
                    onChange={(e) => setDraftOwner(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Description
                  </label>
                  <input
                    type="text"
                    value={draftDesc}
                    onChange={(e) => setDraftDesc(e.target.value)}
                    placeholder="Explain what this birthright grants and why..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Scope Mode Selector */}
              <div>
                <div className="font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Targeting Scope Mode
                </div>
                <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    [
                      'Identity Attributes',
                      'Single Context',
                      'Context Combination',
                      'Hybrid (Attributes + Contexts)',
                    ] as BirthrightScopeMode[]
                  ).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleScopeChange(mode)}
                      className={cn(
                        'cursor-pointer rounded-xl border px-3 py-2 text-left text-[11px] font-semibold transition-all',
                        draftScopeMode === mode
                          ? 'border-[#0EA5E9] bg-sky-50 text-[#0284C7] ring-1 ring-sky-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Combinator + Provisioning Options */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Evaluate Clauses:
                  </span>
                  {(['ALL', 'ANY'] as const).map((comb) => (
                    <button
                      key={comb}
                      type="button"
                      onClick={() => setDraftCombinator(comb)}
                      className={cn(
                        'cursor-pointer rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold',
                        draftCombinator === comb
                          ? 'bg-[#0F172A] text-white'
                          : 'bg-white text-slate-600 ring-1 ring-slate-200'
                      )}
                    >
                      {comb === 'ALL' ? 'ALL (AND)' : 'ANY (OR)'}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <select
                    value={draftProvisioningMode}
                    onChange={(e) =>
                      setDraftProvisioningMode(
                        e.target.value as 'Auto-Provision' | 'Simulation Mode'
                      )
                    }
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    <option value="Auto-Provision">Auto-Provision</option>
                    <option value="Simulation Mode">Simulation Mode</option>
                  </select>

                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={draftAutoRevoke}
                      onChange={(e) => setDraftAutoRevoke(e.target.checked)}
                      className="rounded border-slate-300 text-[#0EA5E9]"
                    />
                    <span>Auto-revoke on exit</span>
                  </label>
                </div>
              </div>

              {/* Identity Properties / Attributes Builder */}
              {showAttributeSection && (
                <div className="space-y-2.5 rounded-xl border border-sky-200/70 bg-sky-50/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      Identity Properties &amp; Attributes
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftAttributes((prev) => [
                          ...prev,
                          {
                            id: `draft-ac-${Date.now()}`,
                            field: 'location',
                            operator: 'equals',
                            value: 'London, UK (HQ)',
                          },
                        ])
                      }
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0284C7] ring-1 ring-sky-200 hover:bg-sky-50"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Attribute</span>
                    </button>
                  </div>

                  {draftAttributes.map((cond) => {
                    const attrMeta = BIRTHRIGHT_ATTRIBUTE_OPTIONS.find(
                      (o) => o.field === cond.field
                    );
                    return (
                      <div
                        key={cond.id}
                        className="grid grid-cols-1 gap-2 sm:grid-cols-12"
                      >
                        <select
                          value={cond.field}
                          onChange={(e) => {
                            const nextField = e.target.value as BirthrightAttributeField;
                            const firstVal =
                              BIRTHRIGHT_ATTRIBUTE_OPTIONS.find((o) => o.field === nextField)
                                ?.sampleValues[0] ?? '';
                            setDraftAttributes((prev) =>
                              prev.map((row) =>
                                row.id === cond.id
                                  ? { ...row, field: nextField, value: firstVal }
                                  : row
                              )
                            );
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 sm:col-span-4"
                        >
                          {BIRTHRIGHT_ATTRIBUTE_OPTIONS.map((opt) => (
                            <option key={opt.field} value={opt.field}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <select
                          value={cond.operator}
                          onChange={(e) =>
                            setDraftAttributes((prev) =>
                              prev.map((row) =>
                                row.id === cond.id
                                  ? {
                                      ...row,
                                      operator: e.target.value as BirthrightAttributeOperator,
                                    }
                                  : row
                              )
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-800 sm:col-span-3"
                        >
                          <option value="equals">equals (=)</option>
                          <option value="not_equals">not equals (≠)</option>
                          <option value="contains">contains</option>
                        </select>

                        <div className="flex gap-1.5 sm:col-span-5">
                          <input
                            type="text"
                            list={`vals-${cond.id}`}
                            value={cond.value}
                            onChange={(e) =>
                              setDraftAttributes((prev) =>
                                prev.map((row) =>
                                  row.id === cond.id ? { ...row, value: e.target.value } : row
                                )
                              )
                            }
                            placeholder="Attribute value..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                          />
                          <datalist id={`vals-${cond.id}`}>
                            {(attrMeta?.sampleValues ?? []).map((val) => (
                              <option key={val} value={val} />
                            ))}
                          </datalist>
                          {draftAttributes.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setDraftAttributes((prev) =>
                                  prev.filter((row) => row.id !== cond.id)
                                )
                              }
                              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-slate-400 hover:text-rose-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Contexts & Context Combination Builder */}
              {showContextSection && (
                <div className="space-y-3 rounded-xl border border-violet-200/80 bg-violet-50/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-violet-700 uppercase">
                      {draftScopeMode === 'Single Context'
                        ? 'Target Process++ Context'
                        : 'Context Combination Clauses'}
                    </span>
                    {draftScopeMode !== 'Single Context' && (
                      <button
                        type="button"
                        onClick={() =>
                          setDraftContextClauses((prev) => [
                            ...prev,
                            {
                              id: `draft-cc-${Date.now()}`,
                              operator: 'NONE_OF',
                              contextIds: ['ctx-ext-audit'],
                            },
                          ])
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Context Clause</span>
                      </button>
                    )}
                  </div>

                  {draftContextClauses.map((clause) => (
                    <div
                      key={clause.id}
                      className="space-y-2 rounded-xl border border-violet-100 bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {draftScopeMode === 'Single Context' ? (
                          <span className="font-mono text-[10px] font-semibold text-violet-700">
                            Select one active context:
                          </span>
                        ) : (
                          <select
                            value={clause.operator}
                            onChange={(e) =>
                              setDraftContextClauses((prev) =>
                                prev.map((row) =>
                                  row.id === clause.id
                                    ? {
                                        ...row,
                                        operator: e.target.value as BirthrightContextOperator,
                                      }
                                    : row
                                )
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 font-mono text-[11px] font-semibold text-violet-800"
                          >
                            <option value="ALL_OF">ALL OF (Identity holds every selected context)</option>
                            <option value="ANY_OF">ANY OF (Identity holds at least one selected context)</option>
                            <option value="NONE_OF">NONE OF (Exclude identities holding selected contexts)</option>
                          </select>
                        )}

                        {draftContextClauses.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setDraftContextClauses((prev) =>
                                prev.filter((row) => row.id !== clause.id)
                              )
                            }
                            className="cursor-pointer rounded p-1 text-slate-400 hover:text-rose-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {CONTEXT_OBJECTS.map((ctx) => {
                          const selected = clause.contextIds.includes(ctx.id);
                          return (
                            <button
                              key={ctx.id}
                              type="button"
                              onClick={() => toggleClauseContext(clause.id, ctx.id)}
                              className={cn(
                                'cursor-pointer rounded-lg border px-2.5 py-1 text-left font-mono text-[10px] transition-all',
                                selected
                                  ? clause.operator === 'NONE_OF'
                                    ? 'border-rose-300 bg-rose-50 font-bold text-rose-700'
                                    : 'border-violet-400 bg-violet-100/80 font-bold text-violet-900'
                                  : 'border-slate-200 bg-[#F8FAFC] text-slate-600 hover:border-violet-200'
                              )}
                            >
                              {ctx.code} · {ctx.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grants Builder */}
              <div className="space-y-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">
                    Entitlements / Roles Granted
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftGrants((prev) => [
                        ...prev,
                        {
                          id: `draft-g-${Date.now()}`,
                          kind: 'Entitlement',
                          name: '',
                          targetSystem: 'Active Directory',
                        },
                      ])
                    }
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:border-[#0EA5E9]"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Grant</span>
                  </button>
                </div>

                {draftGrants.map((grant) => (
                  <div key={grant.id} className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                    <select
                      value={grant.kind}
                      onChange={(e) =>
                        setDraftGrants((prev) =>
                          prev.map((row) =>
                            row.id === grant.id
                              ? { ...row, kind: e.target.value as BirthrightGrant['kind'] }
                              : row
                          )
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 sm:col-span-3"
                    >
                      <option value="Business Role">Business Role</option>
                      <option value="Entitlement">Entitlement</option>
                      <option value="Application Account">Application Account</option>
                      <option value="License SKU">License SKU</option>
                    </select>

                    <input
                      type="text"
                      value={grant.name}
                      onChange={(e) =>
                        setDraftGrants((prev) =>
                          prev.map((row) =>
                            row.id === grant.id ? { ...row, name: e.target.value } : row
                          )
                        )
                      }
                      placeholder="Role / group / license name..."
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 sm:col-span-5"
                    />

                    <div className="flex gap-1.5 sm:col-span-4">
                      <select
                        value={grant.targetSystem}
                        onChange={(e) =>
                          setDraftGrants((prev) =>
                            prev.map((row) =>
                              row.id === grant.id
                                ? { ...row, targetSystem: e.target.value }
                                : row
                            )
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                      >
                        {TARGET_SYSTEMS.map((sys) => (
                          <option key={sys} value={sys}>
                            {sys}
                          </option>
                        ))}
                      </select>

                      {draftGrants.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraftGrants((prev) => prev.filter((row) => row.id !== grant.id))
                          }
                          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-slate-400 hover:text-rose-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Match Preview & Save Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-[#F8FAFC] px-6 py-4">
              <div className="flex items-center gap-2 text-xs">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-[#0F172A]">
                  Live Simulation: {previewMatches.length} matched
                </span>
                {previewMatches.length > 0 && (
                  <span className="hidden font-mono text-[11px] text-slate-500 sm:inline">
                    ({previewMatches.map((p) => p.name).join(', ')})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
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
                  onClick={handleSaveRule}
                  disabled={!draftName.trim()}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save Birthright Rule</span>
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
