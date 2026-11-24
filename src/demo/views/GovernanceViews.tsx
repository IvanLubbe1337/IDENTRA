import { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Download,
  KeyRound,
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import type { ReviewAccessType } from '@/data/demoSampleData';
import { Switch } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const REVIEW_FILTERS: { id: 'All' | ReviewAccessType; label: string }[] = [
  { id: 'All', label: 'All Reviews' },
  { id: 'AD Security Group', label: 'Active Directory Groups' },
  { id: 'Entra ID License', label: 'Entra ID Licenses' },
  { id: 'Business Role', label: 'Business Roles' },
  { id: 'AI Agent Grant', label: 'AI Agent Grants' },
];

export function AccessReviewsView() {
  const reviews = useDemoStore((s) => s.reviews);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const decideReviewItem = useDemoStore((s) => s.decideReviewItem);
  const autoCompleteReviews = useDemoStore((s) => s.autoCompleteReviews);
  const [typeFilter, setTypeFilter] = useState<'All' | ReviewAccessType>('All');

  const completed = reviews.filter((r) => r.decision !== 'Pending').length;
  const pct = Math.round((completed / Math.max(1, reviews.length)) * 100);

  const filteredReviews = reviews.filter((item) => {
    if (typeFilter !== 'All' && item.accessType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const hay = `${item.identity} ${item.roleOrEntitlement} ${item.technicalId} ${item.application} ${item.parentBusinessRole}`.toLowerCase();
      if (!hay.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const badgeStyle = (type: ReviewAccessType) => {
    switch (type) {
      case 'AD Security Group':
        return { icon: Users, cls: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'Entra ID License':
        return { icon: CreditCard, cls: 'bg-violet-50 text-violet-700 border-violet-200' };
      case 'Business Role':
        return { icon: Shield, cls: 'bg-sky-50 text-[#0284C7] border-sky-200' };
      case 'AI Agent Grant':
        return { icon: KeyRound, cls: 'bg-amber-50 text-amber-800 border-amber-200' };
      default:
        return { icon: Layers, cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Access Reviews &amp; Attestation
          </h1>
          <p className="text-sm text-slate-500">
            Certify specific Active Directory groups, Microsoft Entra ID license SKUs, business roles, and privileged entitlements with full context.
          </p>
        </div>

        <button
          type="button"
          onClick={autoCompleteReviews}
          disabled={completed === reviews.length}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7] disabled:bg-emerald-600"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {completed === reviews.length
              ? 'Campaign 100% Certified'
              : 'Apply Process++ Recommendations'}
          </span>
        </button>
      </div>

      {/* Campaign Progress Bar + Category Filter Pills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#0F172A]">Q4 Enterprise Access &amp; License Certification Campaign</span>
          <span className="font-mono text-[#0284C7]">
            {completed}/{reviews.length} certified ({pct}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#0EA5E9] transition-all duration-500"
            style={{ width: `${Math.max(8, pct)}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {REVIEW_FILTERS.map((f) => {
            const count =
              f.id === 'All'
                ? reviews.length
                : reviews.filter((r) => r.accessType === f.id).length;
            const active = typeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setTypeFilter(f.id)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {f.label} <span className="font-mono text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured, Crystal-Clear Access Review Cards */}
      <div className="space-y-3">
        {filteredReviews.map((item) => {
          const decided = item.decision !== 'Pending';
          const badge = badgeStyle(item.accessType);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={item.id}
              className={cn(
                'rounded-2xl border bg-white p-5 shadow-xs transition-all',
                decided ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
              )}
            >
              {/* Top Bar: Identity + Risk + Decision Buttons */}
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3.5 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-sm font-bold text-[#0F172A]">
                        {item.identity}
                      </span>
                      <span className="text-xs text-slate-500">· {item.identityTitle}</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      Department: {item.department} · Reviewer: {item.reviewer}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                      item.risk === 'High'
                        ? 'bg-rose-50 text-rose-600'
                        : item.risk === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                    )}
                  >
                    {item.risk} Risk
                  </span>

                  {decided ? (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold',
                        item.decision === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{item.decision}</span>
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => decideReviewItem(item.id, 'Approved')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => decideReviewItem(item.id, 'Revoked')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Revoke</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Explicit "What Is Being Reviewed" Structured Breakdown */}
              <div className="mt-3.5 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5 md:grid-cols-12">
                <div className="md:col-span-5">
                  <div className="font-mono text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                    Entitlement / Role Under Review
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold',
                        badge.cls
                      )}
                    >
                      <BadgeIcon className="h-3 w-3" />
                      {item.accessType}
                    </span>
                    {item.monthlyCost && (
                      <span className="rounded-md bg-violet-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-violet-800">
                        {item.monthlyCost}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 font-heading text-sm font-bold text-[#0F172A]">
                    {item.roleOrEntitlement}
                  </div>
                  <div className="mt-0.5 break-all font-mono text-[10px] text-slate-500">
                    {item.technicalId}
                  </div>
                </div>

                <div className="md:col-span-4">
                  <div className="font-mono text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                    Target System &amp; Assignment Source
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-[#0F172A]">
                    {item.application}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">{item.parentBusinessRole}</div>
                </div>

                <div className="md:col-span-3">
                  <div className="font-mono text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                    Usage &amp; Recommendation
                  </div>
                  <div className="mt-1.5 text-xs text-slate-700">{item.usageSignal}</div>
                  <div className="mt-1.5 font-mono text-[10px] font-semibold">
                    Process++ AI:{' '}
                    <span
                      className={
                        item.aiRecommendation === 'Revoke'
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }
                    >
                      Recommend {item.aiRecommendation}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600">
                <strong className="text-slate-800">Rationale:</strong> {item.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PoliciesSodView() {
  const policies = useDemoStore((s) => s.policies);
  const togglePolicyEnforced = useDemoStore((s) => s.togglePolicyEnforced);
  const mitigatePolicyViolation = useDemoStore((s) => s.mitigatePolicyViolation);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
          Policies &amp; Segregation of Duties (SoD)
        </h1>
        <p className="text-sm text-slate-500">
          Preventative &amp; detective Identity Process++ guardrails enforced across human and non-human identities.
        </p>
      </div>

      <div className="space-y-3">
        {policies.map((pol) => (
          <div
            key={pol.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0284C7]">
                  {pol.code}
                </span>
                <span className="font-heading text-sm font-bold text-[#0F172A]">
                  {pol.name}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{pol.domain}</span>
              </div>
              <p className="text-xs text-slate-600">{pol.description}</p>
              {pol.violations > 0 && pol.affectedIdentity && (
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-rose-600">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>
                    {pol.violations} active violation ({pol.affectedIdentity})
                  </span>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-4">
              {pol.violations > 0 ? (
                <button
                  type="button"
                  onClick={() => mitigatePolicyViolation(pol.id)}
                  className="cursor-pointer rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Auto-Mitigate
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                  0 Violations
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500 uppercase">
                  {pol.enforced ? 'Enforced' : 'Monitor'}
                </span>
                <Switch.Root
                  checked={pol.enforced}
                  onCheckedChange={() => togglePolicyEnforced(pol.id)}
                  className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComplianceView() {
  const policies = useDemoStore((s) => s.policies);
  const reviews = useDemoStore((s) => s.reviews);
  const [exported, setExported] = useState(false);

  const violations = policies.reduce((sum, p) => sum + p.violations, 0);
  const reviewsDone = reviews.filter((r) => r.decision !== 'Pending').length;
  const bonus = Math.min(5, (3 - violations) * 2 + Math.floor(reviewsDone / 2));

  const frameworks = [
    { name: 'SOX 404 (Financial Controls)', score: Math.min(100, 93 + bonus), controls: '42 / 44 Passing' },
    { name: 'ISO 27001:2022 Annex A', score: Math.min(100, 95 + Math.floor(bonus / 2)), controls: '89 / 93 Passing' },
    { name: 'GDPR Art. 32 Data Access', score: Math.min(100, 94 + bonus), controls: '31 / 32 Passing' },
    { name: 'NIS2 Identity Resilience', score: Math.min(100, 92 + bonus), controls: '27 / 28 Passing' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Compliance &amp; Audit Readiness
          </h1>
          <p className="text-sm text-slate-500">
            Real-time regulatory posture derived directly from Identity Process++ attestations and SoD controls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExported(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0EA5E9]"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{exported ? 'Audit Evidence Exported ✓' : 'Export Audit Package'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {frameworks.map((fw) => (
          <div key={fw.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="font-heading text-sm font-bold text-[#0F172A]">{fw.name}</div>
              <span className="font-display text-2xl font-extrabold text-[#0284C7]">
                {fw.score}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0EA5E9] transition-all duration-500"
                style={{ width: `${fw.score}%` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>{fw.controls}</span>
              <span className="text-emerald-600">Continuous Evidence Ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
