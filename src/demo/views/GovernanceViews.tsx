import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  GitBranch,
  KeyRound,
  Layers,
  MapPin,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import type {
  DemoReviewItem,
  ReviewAccessType,
  ReviewWorkflowType,
} from '@/data/demoSampleData';
import { Dialog, Switch } from '@/components/ui/Primitives';
import { PersonInspectorDrawer } from '@/demo/views/PersonInspectorDrawer';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const REVIEW_FILTERS: { id: 'All' | ReviewAccessType; label: string }[] = [
  { id: 'All', label: 'All Reviews' },
  { id: 'AD Security Group', label: 'Active Directory Groups' },
  { id: 'Entra ID License', label: 'Entra ID Licenses' },
  { id: 'Business Role', label: 'Business Roles' },
  { id: 'AI Agent Grant', label: 'AI Agent Grants' },
];

const WORKFLOW_FILTERS: ('All' | ReviewWorkflowType)[] = [
  'All',
  'Manager Approval',
  'Entitlement Owner Approval',
  'Application Owner Approval',
  'Dual-Stage (Manager → App Owner)',
  'SOX Control Owner Approval',
  'Data Owner & SecOps Approval',
];

function workflowBadgeTone(wf: ReviewWorkflowType): string {
  switch (wf) {
    case 'Manager Approval':
      return 'border-sky-200 bg-sky-50 text-[#0284C7]';
    case 'Entitlement Owner Approval':
      return 'border-indigo-200 bg-indigo-50 text-indigo-700';
    case 'Application Owner Approval':
      return 'border-teal-200 bg-teal-50 text-teal-700';
    case 'Dual-Stage (Manager → App Owner)':
      return 'border-violet-200 bg-violet-50 text-violet-700';
    case 'SOX Control Owner Approval':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'Data Owner & SecOps Approval':
      return 'border-rose-200 bg-rose-50 text-rose-700';
  }
}

export function AccessReviewsView() {
  const reviews = useDemoStore((s) => s.reviews);
  const people = useDemoStore((s) => s.people);
  const nonHumans = useDemoStore((s) => s.nonHumans);
  const roles = useDemoStore((s) => s.roles);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const decideReviewItem = useDemoStore((s) => s.decideReviewItem);
  const autoCompleteReviews = useDemoStore((s) => s.autoCompleteReviews);
  const remediateNonHumanDrift = useDemoStore((s) => s.remediateNonHumanDrift);

  const [typeFilter, setTypeFilter] = useState<'All' | ReviewAccessType>('All');
  const [workflowFilter, setWorkflowFilter] = useState<'All' | ReviewWorkflowType>('All');

  // Interactive Detail Drawers
  const [inspectPersonId, setInspectPersonId] = useState<string | null>(null);
  const [inspectFallbackIdentityId, setInspectFallbackIdentityId] = useState<string | null>(null);
  const [inspectEntitlementReviewId, setInspectEntitlementReviewId] = useState<string | null>(null);

  const completed = reviews.filter((r) => r.decision !== 'Pending').length;
  const pct = Math.round((completed / Math.max(1, reviews.length)) * 100);

  const filteredReviews = reviews.filter((item) => {
    if (typeFilter !== 'All' && item.accessType !== typeFilter) return false;
    if (workflowFilter !== 'All' && item.workflowType !== workflowFilter) return false;
    if (searchQuery.trim()) {
      const hay = `${item.identity} ${item.roleOrEntitlement} ${item.technicalId} ${item.application} ${item.parentBusinessRole} ${item.workflowType} ${item.workflowCode} ${item.triggeredBy}`.toLowerCase();
      if (!hay.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const inspectedPerson = inspectPersonId
    ? (people.find((p) => p.id === inspectPersonId) ?? null)
    : null;

  const inspectedFallbackReview: DemoReviewItem | null = inspectFallbackIdentityId
    ? (reviews.find((r) => r.id === inspectFallbackIdentityId) ?? null)
    : null;

  const inspectedFallbackNonHuman = inspectedFallbackReview?.nonHumanId
    ? (nonHumans.find((n) => n.id === inspectedFallbackReview.nonHumanId) ?? null)
    : null;

  const inspectedEntitlementReview: DemoReviewItem | null = inspectEntitlementReviewId
    ? (reviews.find((r) => r.id === inspectEntitlementReviewId) ?? null)
    : null;

  const linkedRole = inspectedEntitlementReview?.roleId
    ? (roles.find((r) => r.id === inspectedEntitlementReview.roleId) ?? null)
    : null;

  const handleSelectIdentity = (item: DemoReviewItem) => {
    if (item.personId && people.some((p) => p.id === item.personId)) {
      setInspectPersonId(item.personId);
    } else {
      setInspectFallbackIdentityId(item.id);
    }
  };

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
            Select any <strong className="text-slate-700">identity</strong> or{' '}
            <strong className="text-slate-700">entitlement / role</strong> to inspect full details and the approval workflow triggered for the review.
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

      {/* Campaign Progress Bar + Category & Workflow Filter Pills */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#0F172A]">
            Q4 Enterprise Access &amp; License Certification Campaign
          </span>
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

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="mr-1 font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Access Type:
          </span>
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

        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
          <span className="mr-1 font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Review Workflow:
          </span>
          {WORKFLOW_FILTERS.map((wf) => {
            const count =
              wf === 'All'
                ? reviews.length
                : reviews.filter((r) => r.workflowType === wf).length;
            const active = workflowFilter === wf;
            return (
              <button
                key={wf}
                type="button"
                onClick={() => setWorkflowFilter(wf)}
                className={cn(
                  'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  active
                    ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {wf} <span className="font-mono text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured, Selectable Access Review Cards */}
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
              {/* Top Bar: Selectable Identity + Selected Workflow + Risk + Decision Buttons */}
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3.5 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectIdentity(item)}
                      title="Inspect identity profile and risk context"
                      className="group inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-50 px-2 py-0.5 font-heading text-sm font-bold text-[#0F172A] ring-1 ring-slate-200/80 transition-all hover:bg-sky-50 hover:text-[#0284C7] hover:ring-sky-200"
                    >
                      {item.nonHumanId ? (
                        <Bot className="h-3.5 w-3.5 text-violet-600" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      )}
                      <span>{item.identity}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0284C7]" />
                    </button>
                    <span className="text-xs text-slate-500">· {item.identityTitle}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-400">
                    <span>Department: {item.department}</span>
                    <span>·</span>
                    <span>Assigned Reviewer: {item.reviewer}</span>
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

              {/* Selected Review Workflow Banner */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Selected Workflow:
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectEntitlementReviewId(item.id)}
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-opacity hover:opacity-85',
                      workflowBadgeTone(item.workflowType)
                    )}
                  >
                    <GitBranch className="h-3 w-3" />
                    <span>{item.workflowType}</span>
                    <span className="opacity-70">({item.workflowCode})</span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Triggered by: <strong className="font-medium text-slate-700">{item.triggeredBy}</strong>
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>{item.triggeredAt}</span>
                </span>
              </div>

              {/* Explicit "What Is Being Reviewed" Structured Breakdown with Selectable Entitlement/Role */}
              <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5 md:grid-cols-12">
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
                  <button
                    type="button"
                    onClick={() => setInspectEntitlementReviewId(item.id)}
                    title="Inspect entitlement/role permissions and approval workflow"
                    className="group mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-left font-heading text-sm font-bold text-[#0F172A] transition-colors hover:text-[#0284C7]"
                  >
                    <span className="underline decoration-slate-300 decoration-dotted underline-offset-4 group-hover:decoration-[#0EA5E9]">
                      {item.roleOrEntitlement}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#0EA5E9] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
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
                  <div className="mt-1.5 font-mono text-[10px] text-slate-400">
                    Owner: {item.entitlementDetails.owner}
                  </div>
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

      {/* Full Person Inspector Drawer (for identities in People Directory) */}
      <PersonInspectorDrawer
        person={inspectedPerson}
        onClose={() => setInspectPersonId(null)}
      />

      {/* Fallback / Non-Human Identity Detail Drawer */}
      <Dialog.Root
        open={Boolean(inspectedFallbackReview)}
        onOpenChange={(open) => {
          if (!open) setInspectFallbackIdentityId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspectedFallbackReview && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>{inspectedFallbackReview.identitySnapshot.employeeNumber}</span>
                      <span>·</span>
                      <span>
                        {inspectedFallbackReview.nonHumanId ? 'Non-Human Identity' : 'Workforce Identity'}
                      </span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {inspectedFallbackReview.identity}
                    </Dialog.Title>
                    <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                      {inspectedFallbackReview.identityTitle} · {inspectedFallbackReview.department}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close identity details"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-xs">
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Email / Owner</div>
                      <div className="mt-0.5 break-all font-mono font-semibold text-[#0F172A]">
                        {inspectedFallbackReview.identitySnapshot.email}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Risk Score</div>
                      <div
                        className={cn(
                          'mt-0.5 font-mono text-sm font-extrabold',
                          inspectedFallbackReview.identitySnapshot.riskScore >= 70
                            ? 'text-rose-600'
                            : inspectedFallbackReview.identitySnapshot.riskScore >= 25
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                        )}
                      >
                        {inspectedFallbackReview.identitySnapshot.riskScore}/100
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Manager / Sponsor</div>
                      <div className="mt-0.5 font-semibold text-slate-800">
                        {inspectedFallbackReview.identitySnapshot.manager}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Location</div>
                      <div className="mt-0.5 inline-flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{inspectedFallbackReview.identitySnapshot.location}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Contract / Kind</div>
                      <div className="mt-0.5 font-medium text-slate-700">
                        {inspectedFallbackReview.identitySnapshot.contractType}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Last Activity</div>
                      <div className="mt-0.5 font-mono text-slate-700">
                        {inspectedFallbackReview.identitySnapshot.lastLogin}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <div className="font-mono text-[9px] font-semibold text-slate-400 uppercase">
                      Entitlement Under Review ({inspectedFallbackReview.identitySnapshot.activeGrantsCount} total active grants)
                    </div>
                    <div className="mt-1.5 font-heading text-sm font-bold text-[#0F172A]">
                      {inspectedFallbackReview.roleOrEntitlement}
                    </div>
                    <div className="mt-0.5 text-slate-500">
                      {inspectedFallbackReview.application} · {inspectedFallbackReview.parentBusinessRole}
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-slate-500">
                      {inspectedFallbackReview.usageSignal}
                    </div>
                  </div>

                  {inspectedFallbackNonHuman &&
                    inspectedFallbackNonHuman.status === 'Shadow Drift' && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                        <div className="flex items-center gap-2 font-semibold text-rose-800">
                          <ShieldAlert className="h-4 w-4 text-rose-600" />
                          <span>Active Non-Human Shadow Drift</span>
                        </div>
                        <p className="mt-1 text-rose-700">
                          Scope: {inspectedFallbackNonHuman.privilegeScope} · Last rotated{' '}
                          {inspectedFallbackNonHuman.lastRotated}.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            remediateNonHumanDrift(inspectedFallbackNonHuman.id);
                            setInspectFallbackIdentityId(null);
                          }}
                          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 font-semibold text-white hover:bg-rose-700"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Contain Shadow Agent &amp; Revoke Grant</span>
                        </button>
                      </div>
                    )}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Entitlement / Role & Triggered Workflow Inspector Drawer */}
      <Dialog.Root
        open={Boolean(inspectedEntitlementReview)}
        onOpenChange={(open) => {
          if (!open) setInspectEntitlementReviewId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspectedEntitlementReview && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>{inspectedEntitlementReview.accessType}</span>
                      <span>·</span>
                      <span>{inspectedEntitlementReview.application}</span>
                      <span>·</span>
                      <span>{inspectedEntitlementReview.entitlementDetails.sensitivity} Sensitivity</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {inspectedEntitlementReview.roleOrEntitlement}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-slate-500">
                      {inspectedEntitlementReview.entitlementDetails.description}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close entitlement inspector"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-xs">
                  {/* SoD / Policy Impact Alert */}
                  {inspectedEntitlementReview.entitlementDetails.sodImpact && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-rose-800">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      <div>
                        <div className="font-semibold">Policy / SoD Impact</div>
                        <div className="mt-0.5">
                          {inspectedEntitlementReview.entitlementDetails.sodImpact}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technical Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                    <div className="col-span-2">
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Technical Identifier
                      </div>
                      <div className="mt-0.5 break-all rounded-lg bg-white px-2.5 py-1.5 font-mono text-[11px] text-slate-700 ring-1 ring-slate-200/70">
                        {inspectedEntitlementReview.technicalId}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Entitlement / Role Owner
                      </div>
                      <div className="mt-0.5 font-semibold text-[#0F172A]">
                        {inspectedEntitlementReview.entitlementDetails.owner}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {inspectedEntitlementReview.entitlementDetails.ownerRole}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">
                        Population Reach
                      </div>
                      <div className="mt-0.5 font-mono font-bold text-[#0F172A]">
                        {inspectedEntitlementReview.entitlementDetails.totalHolders} holders
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {linkedRole
                          ? `${linkedRole.entitlementsCount} bundled entitlements`
                          : inspectedEntitlementReview.monthlyCost
                            ? `License cost: ${inspectedEntitlementReview.monthlyCost}`
                            : 'Across connected tenants'}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Granted On</div>
                      <div className="mt-0.5 font-mono text-slate-700">
                        {inspectedEntitlementReview.entitlementDetails.grantedOn}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Last Used</div>
                      <div className="mt-0.5 font-mono text-slate-700">
                        {inspectedEntitlementReview.entitlementDetails.lastUsed}
                      </div>
                    </div>
                  </div>

                  {/* Underlying Permissions */}
                  <div>
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Underlying Permissions &amp; Capabilities
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {inspectedEntitlementReview.entitlementDetails.nestedPermissions.map((perm) => (
                        <li
                          key={perm}
                          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-[#FBFDFF] px-3 py-2 font-mono text-[11px] text-slate-700"
                        >
                          <KeyRound className="h-3.5 w-3.5 shrink-0 text-[#0EA5E9]" />
                          <span>{perm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Triggered Review Workflow & Approval Chain */}
                  <div className="space-y-3 rounded-2xl border border-sky-200/80 bg-sky-50/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                        <GitBranch className="h-3.5 w-3.5" />
                        <span>Triggered Review Workflow</span>
                      </div>
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                          workflowBadgeTone(inspectedEntitlementReview.workflowType)
                        )}
                      >
                        {inspectedEntitlementReview.workflowType} ·{' '}
                        {inspectedEntitlementReview.workflowCode}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-[11px] text-slate-600 sm:grid-cols-2">
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 uppercase block">
                          Trigger Source
                        </span>
                        <span className="font-semibold text-[#0F172A]">
                          {inspectedEntitlementReview.triggeredBy}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 uppercase block">
                          Escalation &amp; SLA Policy
                        </span>
                        <span className="font-medium text-slate-700">
                          {inspectedEntitlementReview.escalationPolicy}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="font-mono text-[9px] font-semibold text-slate-400 uppercase">
                        Approval Stage Pipeline
                      </div>
                      {inspectedEntitlementReview.workflowStages.map((stage, idx) => {
                        const isDecided = inspectedEntitlementReview.decision !== 'Pending';
                        const resolvedStatus = isDecided ? 'Completed' : stage.status;
                        return (
                          <div
                            key={`${stage.step}-${idx}`}
                            className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2"
                          >
                            <div>
                              <div className="font-semibold text-[#0F172A]">
                                <span className="mr-1.5 font-mono text-[10px] text-[#0284C7]">
                                  {stage.step}
                                </span>
                                {stage.approverRole}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Assignee: {stage.assignee}
                              </div>
                            </div>
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                                resolvedStatus === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : resolvedStatus === 'Active'
                                    ? 'bg-sky-50 text-[#0284C7]'
                                    : 'bg-slate-100 text-slate-500'
                              )}
                            >
                              {resolvedStatus}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Certify / Revoke Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-[#F8FAFC] px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      const target = inspectedEntitlementReview;
                      setInspectEntitlementReviewId(null);
                      handleSelectIdentity(target);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    <span>Inspect {inspectedEntitlementReview.identity}</span>
                  </button>

                  {inspectedEntitlementReview.decision === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          decideReviewItem(inspectedEntitlementReview.id, 'Approved')
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          decideReviewItem(inspectedEntitlementReview.id, 'Revoked')
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Revoke</span>
                      </button>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Decision: {inspectedEntitlementReview.decision}</span>
                    </span>
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
