import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Forward,
  GitBranch,
  Inbox,
  KeyRound,
  Plane,
  Settings,
  ShieldAlert,
  ShoppingBag,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import {
  CURRENT_DEMO_USER_PERSON_ID,
  INITIAL_MARKETPLACE_CATALOG,
  type LeaveDelegationConfig,
  type MarketplaceCatalogItem,
} from '@/data/demoSampleData';
import {
  REFERENCE_OBJECTS,
  type ReferenceObject,
} from '@/data/referenceObjectsData';
import { Dialog, Switch, Tabs } from '@/components/ui/Primitives';
import { PersonInspectorDrawer } from '@/demo/views/PersonInspectorDrawer';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type TasksTabId = 'inbox' | 'requests' | 'delegation';

export function MyTasksView() {
  const people = useDemoStore((s) => s.people);
  const accessRequests = useDemoStore((s) => s.accessRequests);
  const reviews = useDemoStore((s) => s.reviews);
  const contractorRequests = useDemoStore((s) => s.contractorRequests);
  const entitlementRequests = useDemoStore((s) => s.entitlementRequests);
  const leaveDelegation = useDemoStore((s) => s.leaveDelegation);
  const platformConfig = useDemoStore((s) => s.platformConfig);
  const searchQuery = useDemoStore((s) => s.searchQuery);

  const advanceAccessRequestApproval = useDemoStore(
    (s) => s.advanceAccessRequestApproval
  );
  const escalateAccessRequest = useDemoStore((s) => s.escalateAccessRequest);
  const decideReviewItem = useDemoStore((s) => s.decideReviewItem);
  const advanceContractorApproval = useDemoStore((s) => s.advanceContractorApproval);
  const advanceEntitlementApproval = useDemoStore((s) => s.advanceEntitlementApproval);
  const updateLeaveDelegation = useDemoStore((s) => s.updateLeaveDelegation);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [activeTab, setActiveTab] = useState<TasksTabId>('inbox');
  const [delegationDraft, setDelegationDraft] =
    useState<LeaveDelegationConfig>(leaveDelegation);

  // Clickable object inspection drawers
  const [inspectPersonId, setInspectPersonId] = useState<string | null>(null);
  const [inspectResource, setInspectResource] = useState<MarketplaceCatalogItem | null>(
    null
  );
  const [inspectRefObj, setInspectRefObj] = useState<ReferenceObject | null>(null);

  useEffect(() => {
    setDelegationDraft(leaveDelegation);
  }, [leaveDelegation]);

  const slaHours = platformConfig.governance.approvalEscalationHours;
  const needle = searchQuery.trim().toLowerCase();

  const pendingAccessApprovals = useMemo(
    () =>
      accessRequests.filter((r) => {
        if (r.status !== 'Pending Approval') return false;
        if (!needle) return true;
        return `${r.requestCode} ${r.targetPersonName} ${r.resourceName} ${r.application}`
          .toLowerCase()
          .includes(needle);
      }),
    [accessRequests, needle]
  );

  const pendingReviewsList = useMemo(
    () => reviews.filter((r) => r.decision === 'Pending'),
    [reviews]
  );

  const pendingContractorApprovals = useMemo(
    () => contractorRequests.filter((r) => r.status === 'Pending Approval'),
    [contractorRequests]
  );

  const pendingEntitlementApprovals = useMemo(
    () => entitlementRequests.filter((r) => r.status === 'Pending Approval'),
    [entitlementRequests]
  );

  const overdueCount = useMemo(
    () =>
      accessRequests.filter(
        (r) => r.status === 'Pending Approval' && r.waitingHours >= slaHours
      ).length,
    [accessRequests, slaHours]
  );

  const totalPendingActions =
    pendingAccessApprovals.length +
    pendingReviewsList.length +
    pendingContractorApprovals.length +
    pendingEntitlementApprovals.length;

  const standInCandidates = useMemo(
    () =>
      people.filter(
        (p) =>
          p.id !== CURRENT_DEMO_USER_PERSON_ID &&
          p.type === 'Employee' &&
          p.jmlStatus !== 'Deactivated'
      ),
    [people]
  );

  const openApproverDetails = (name: string, refId?: string) => {
    if (refId && REFERENCE_OBJECTS[refId]) {
      setInspectRefObj(REFERENCE_OBJECTS[refId]);
      return;
    }
    const person = people.find((p) => p.name === name);
    if (person) {
      setInspectPersonId(person.id);
      return;
    }
    const ref = Object.values(REFERENCE_OBJECTS).find(
      (obj) => obj.name.toLowerCase() === name.toLowerCase()
    );
    if (ref) setInspectRefObj(ref);
  };

  const openResourceDetails = (catalogItemId: string) => {
    const found = INITIAL_MARKETPLACE_CATALOG.find((c) => c.id === catalogItemId);
    if (found) setInspectResource(found);
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
            My Tasks, Requests &amp; Delegation
          </h1>
          <p className="text-sm text-slate-500">
            Track submitted access requests, complete pending approvals and access reviews, escalate overdue approvals, or delegate tasks to a stand-in while on leave.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection('access-marketplace')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Request New Access</span>
          </button>
        </div>
      </div>

      {/* Active Out-of-Office Delegation Banner */}
      {leaveDelegation.enabled && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-xs text-amber-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Plane className="h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <strong>Out-of-Office Stand-In Active:</strong> Tasks &amp; approvals for{' '}
              <strong>{leaveDelegation.delegatorName}</strong> are routing automatically to{' '}
              <button
                type="button"
                onClick={() => openApproverDetails(leaveDelegation.standInName)}
                className="cursor-pointer font-bold text-[#0284C7] underline"
              >
                {leaveDelegation.standInName}
              </button>{' '}
              ({leaveDelegation.startDate} → {leaveDelegation.endDate}).
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('delegation')}
            className="cursor-pointer rounded-lg border border-amber-300 bg-white px-3 py-1 font-semibold text-amber-900 hover:bg-amber-100"
          >
            Manage Delegation
          </button>
        </div>
      )}

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs hover:border-sky-200"
        >
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Pending Tasks &amp; Approvals
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {totalPendingActions}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Reviews · Requests · Onb
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs hover:border-sky-200"
        >
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Tracked Access Requests
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">
              {accessRequests.length}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {pendingAccessApprovals.length} pending
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs hover:border-amber-200"
        >
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Overdue SLA (&ge;{slaHours}h)
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                overdueCount > 0 ? 'text-amber-600' : 'text-emerald-600'
              )}
            >
              {overdueCount}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {overdueCount > 0 ? 'Ready to escalate' : 'All within SLA'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delegation')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs hover:border-sky-200"
        >
          <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Leave Delegation
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-lg font-extrabold',
                leaveDelegation.enabled ? 'text-amber-600' : 'text-slate-700'
              )}
            >
              {leaveDelegation.enabled ? 'Active' : 'Inactive'}
            </span>
            <span className="truncate font-mono text-[10px] text-slate-400">
              {leaveDelegation.enabled ? `→ ${leaveDelegation.standInName}` : 'Configure stand-in'}
            </span>
          </div>
        </button>
      </div>

      {/* Radix Tabs */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TasksTabId)}
        className="space-y-4"
      >
        <Tabs.List className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          <Tabs.Trigger
            value="inbox"
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'inbox'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <Inbox className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Action Inbox ({totalPendingActions})</span>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="requests"
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'requests'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Access Requests &amp; Escalation ({accessRequests.length})</span>
            {overdueCount > 0 && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                {overdueCount} SLA
              </span>
            )}
          </Tabs.Trigger>

          <Tabs.Trigger
            value="delegation"
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'delegation'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <Plane className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Leave Delegation (Stand-In)</span>
          </Tabs.Trigger>
        </Tabs.List>

        {/* ===================== TAB 1: UNIFIED ACTION INBOX ===================== */}
        <Tabs.Content value="inbox" className="space-y-4 focus:outline-none">
          {/* Pending Access Request Approvals */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                Pending Access Marketplace Approvals ({pendingAccessApprovals.length})
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className="cursor-pointer font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
              >
                View All Requests
              </button>
            </div>

            {pendingAccessApprovals.length === 0 ? (
              <p className="text-xs text-slate-500">Zero pending access request approvals.</p>
            ) : (
              <div className="space-y-2.5">
                {pendingAccessApprovals.map((req) => {
                  const activeStage = req.stages.find(
                    (st) => st.status === 'Pending' || st.status === 'Escalated'
                  );
                  return (
                    <div
                      key={req.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/80 bg-[#FBFDFF] p-4 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                            {req.requestCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => openResourceDetails(req.catalogItemId)}
                            className="inline-flex cursor-pointer items-center gap-1 font-heading font-bold text-[#0F172A] hover:text-[#0284C7]"
                          >
                            <span>{req.resourceName}</span>
                            <ArrowUpRight className="h-3 w-3 text-[#0EA5E9]" />
                          </button>
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-800">
                            {req.selectedAccountKind}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          For:{' '}
                          <button
                            type="button"
                            onClick={() => setInspectPersonId(req.targetPersonId)}
                            className="cursor-pointer font-semibold text-[#0284C7] hover:underline"
                          >
                            {req.targetPersonName}
                          </button>{' '}
                          · Account: <span className="font-mono text-[11px]">{req.selectedAccountName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Active Step: <strong>{activeStage?.approverRole}</strong> (
                          <button
                            type="button"
                            onClick={() =>
                              activeStage &&
                              openApproverDetails(
                                activeStage.delegatedTo ?? activeStage.approverName,
                                activeStage.approverRefId
                              )
                            }
                            className="cursor-pointer font-semibold text-[#0284C7] hover:underline"
                          >
                            {activeStage?.delegatedTo
                              ? `${activeStage.delegatedTo} (Stand-In for ${activeStage.approverName})`
                              : activeStage?.approverName}
                          </button>
                          )
                        </div>
                        <div className="italic text-slate-500">&ldquo;{req.motivation}&rdquo;</div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => advanceAccessRequestApproval(req.id, 'reject')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => advanceAccessRequestApproval(req.id, 'approve-stage')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Onboarding Approvals + Access Reviews Snapshot */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Access Reviews Awaiting Certification */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Pending Access Reviews ({pendingReviewsList.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveSection('access-reviews')}
                  className="inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
                >
                  <span>Open Campaign</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {pendingReviewsList.slice(0, 4).map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-[#0F172A]">
                        {rev.identity} · <span className="text-[#0284C7]">{rev.roleOrEntitlement}</span>
                      </div>
                      <div className="truncate font-mono text-[10px] text-slate-400">
                        Reviewer: {rev.reviewer} · {rev.workflowType}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => decideReviewItem(rev.id, 'Approved')}
                        className="cursor-pointer rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => decideReviewItem(rev.id, 'Revoked')}
                        className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Onboarding Approvals */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Pending Onboarding Approvals (
                  {pendingContractorApprovals.length + pendingEntitlementApprovals.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveSection('onboarding')}
                  className="inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] font-semibold text-[#0284C7] hover:underline"
                >
                  <span>Open Onboarding</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {pendingContractorApprovals.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-[#0F172A]">
                        Contractor: {c.firstName} {c.lastName}
                      </div>
                      <div className="truncate font-mono text-[10px] text-slate-400">
                        {c.requestCode} · {c.workflowName}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => advanceContractorApproval(c.id, 'approve-stage')}
                      className="shrink-0 cursor-pointer rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700"
                    >
                      Approve Stage
                    </button>
                  </div>
                ))}
                {pendingEntitlementApprovals.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-mono font-semibold text-[#0F172A]">
                        {e.entitlementName}
                      </div>
                      <div className="truncate font-mono text-[10px] text-slate-400">
                        {e.requestCode} · {e.workflowName}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => advanceEntitlementApproval(e.id, 'approve-stage')}
                      className="shrink-0 cursor-pointer rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700"
                    >
                      Approve Stage
                    </button>
                  </div>
                ))}
                {pendingContractorApprovals.length === 0 &&
                  pendingEntitlementApprovals.length === 0 && (
                    <p className="text-xs text-slate-500">
                      All contractor and entitlement onboarding requests are complete.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* ========== TAB 2: TRACK ACCESS REQUESTS & SLA ESCALATION ========== */}
        <Tabs.Content value="requests" className="space-y-4 focus:outline-none">
          {/* Escalation SLA Configuration Notice Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-[#0EA5E9]" />
              <span>
                Configured Pending Approval Escalation SLA:{' '}
                <strong className="font-mono text-[#0F172A]">{slaHours} hours</strong> — approvals waiting longer than {slaHours}h can be escalated to their backup approver.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('configuration')}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Change SLA in Configuration</span>
            </button>
          </div>

          <div className="space-y-3">
            {accessRequests.map((req) => {
              const isOverdue =
                req.status === 'Pending Approval' && req.waitingHours >= slaHours;
              return (
                <div
                  key={req.id}
                  className={cn(
                    'space-y-3.5 rounded-2xl border bg-white p-5 shadow-xs',
                    req.status === 'Approved & Provisioned'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isOverdue
                        ? 'border-amber-300'
                        : 'border-slate-200'
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          {req.requestCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => openResourceDetails(req.catalogItemId)}
                          className="inline-flex cursor-pointer items-center gap-1 font-heading text-sm font-bold text-[#0F172A] hover:text-[#0284C7]"
                        >
                          <span className="underline decoration-slate-300 decoration-dotted underline-offset-4">
                            {req.resourceName}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#0EA5E9]" />
                        </button>
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                          {req.application}
                        </span>
                        {req.sodStatus !== 'Clean' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800">
                            <ShieldAlert className="h-3 w-3" />
                            {req.sodStatus}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>
                          Target Identity:{' '}
                          <button
                            type="button"
                            onClick={() => setInspectPersonId(req.targetPersonId)}
                            className="cursor-pointer font-semibold text-[#0284C7] hover:underline"
                          >
                            {req.targetPersonName}
                          </button>
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[11px]">
                          Account: <strong>{req.selectedAccountName}</strong> ({req.selectedAccountKind})
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {req.activationDate} → {req.deactivationDate ?? 'Indefinite'}
                        </span>
                      </div>

                      <div className="font-mono text-[10px] text-slate-400">
                        Primary Context: {req.primaryContextLabel} · Submitted {req.submittedAt}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {req.status === 'Pending Approval' && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                            isOverdue
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          <Clock className="h-3 w-3" />
                          <span>
                            Waiting {req.waitingHours}h / SLA {slaHours}h
                          </span>
                        </span>
                      )}
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                          req.status === 'Approved & Provisioned'
                            ? 'bg-emerald-100 text-emerald-700'
                            : req.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-sky-100 text-[#0284C7]'
                        )}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Step Approval Chain with Clickable Approvers */}
                  <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5 text-xs">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold text-slate-400 uppercase">
                        <GitBranch className="h-3 w-3 text-[#0EA5E9]" />
                        <span>
                          Workflow: {req.workflowName} ({req.workflowCode})
                        </span>
                      </span>
                      <span className="text-[11px] italic text-slate-500">
                        Motivation: &ldquo;{req.motivation}&rdquo;
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {req.stages.map((st, idx) => (
                        <div
                          key={`${req.id}-${st.step}-${idx}`}
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                              {st.step} · {st.approverRole}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                openApproverDetails(
                                  st.delegatedTo ?? st.approverName,
                                  st.approverRefId
                                )
                              }
                              className="mt-0.5 inline-flex cursor-pointer items-center gap-1 truncate font-semibold text-[#0284C7] hover:underline"
                            >
                              <span className="truncate">
                                {st.delegatedTo
                                  ? `${st.delegatedTo} (Stand-In)`
                                  : st.approverName}
                              </span>
                              <ArrowUpRight className="h-3 w-3 shrink-0" />
                            </button>
                          </div>
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold',
                              st.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : st.status === 'Escalated'
                                  ? 'bg-amber-100 text-amber-800'
                                  : st.status === 'Pending'
                                    ? 'bg-sky-100 text-[#0284C7]'
                                    : st.status === 'Rejected'
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-slate-100 text-slate-400'
                            )}
                          >
                            {st.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Escalate / Approve Action Strip */}
                  {req.status === 'Pending Approval' && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div>
                        {isOverdue ? (
                          <button
                            type="button"
                            onClick={() => escalateAccessRequest(req.id)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700"
                          >
                            <Forward className="h-3.5 w-3.5" />
                            <span>Escalate Overdue Approval (&ge;{slaHours}h)</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>
                              Escalation unlocks after {slaHours}h ({Math.max(0, slaHours - req.waitingHours)}h remaining)
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => advanceAccessRequestApproval(req.id, 'reject')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => advanceAccessRequestApproval(req.id, 'approve-stage')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve Active Stage</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Tabs.Content>

        {/* ================= TAB 3: OUT-OF-OFFICE LEAVE DELEGATION ================ */}
        <Tabs.Content value="delegation" className="focus:outline-none">
          <div className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-heading text-base font-bold text-[#0F172A]">
                  Out-of-Office Stand-In Delegation
                </h2>
                <p className="text-xs text-slate-500">
                  Going on leave? Delegate all approvals, access reviews, and onboarding tasks assigned to{' '}
                  <strong className="text-slate-700">{delegationDraft.delegatorName}</strong> to an accountable stand-in colleague.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                  {delegationDraft.enabled ? 'Delegation Active' : 'Inactive'}
                </span>
                <Switch.Root
                  checked={delegationDraft.enabled}
                  onCheckedChange={(checked) =>
                    setDelegationDraft((d) => ({ ...d, enabled: checked }))
                  }
                  className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Stand-In Delegate Colleague
                </label>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <select
                    value={delegationDraft.standInPersonId}
                    onChange={(e) => {
                      const chosen = standInCandidates.find(
                        (p) => p.id === e.target.value
                      );
                      if (!chosen) return;
                      setDelegationDraft((d) => ({
                        ...d,
                        standInPersonId: chosen.id,
                        standInName: chosen.name,
                      }));
                    }}
                    className="flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A]"
                  >
                    {standInCandidates.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.title} ({p.department})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setInspectPersonId(delegationDraft.standInPersonId)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0284C7] hover:border-[#0EA5E9]"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Inspect Stand-In</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Leave Start Date
                </label>
                <input
                  type="date"
                  value={delegationDraft.startDate}
                  onChange={(e) =>
                    setDelegationDraft((d) => ({ ...d, startDate: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Return Date (Auto-Expiry)
                </label>
                <input
                  type="date"
                  value={delegationDraft.endDate}
                  onChange={(e) =>
                    setDelegationDraft((d) => ({ ...d, endDate: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Out-of-Office Handover Note
                </label>
                <input
                  type="text"
                  value={delegationDraft.reason}
                  onChange={(e) =>
                    setDelegationDraft((d) => ({ ...d, reason: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                />
              </div>
            </div>

            <div className="space-y-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-xs">
              <div className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                Delegated Governance Scope
              </div>
              {[
                {
                  key: 'delegateApprovals' as const,
                  label: 'Access Marketplace Approvals',
                  desc: 'Forward pending & incoming IT Shop approval steps to stand-in.',
                },
                {
                  key: 'delegateReviews' as const,
                  label: 'Access Reviews & Attestations',
                  desc: 'Reassign pending certification campaigns assigned to you.',
                },
                {
                  key: 'delegateOnboarding' as const,
                  label: 'Contractor & Entitlement Onboarding Approvals',
                  desc: 'Route sponsor & entitlement owner onboarding gates to stand-in.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 border-t border-slate-200/60 pt-2.5 first:border-t-0 first:pt-0"
                >
                  <div>
                    <div className="font-semibold text-[#0F172A]">{item.label}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                  <Switch.Root
                    checked={delegationDraft[item.key]}
                    onCheckedChange={(checked) =>
                      setDelegationDraft((d) => ({ ...d, [item.key]: checked }))
                    }
                    className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                  >
                    <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                  </Switch.Root>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last updated: {leaveDelegation.updatedAt}</span>
              </span>
              <button
                type="button"
                onClick={() => updateLeaveDelegation(delegationDraft)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
              >
                <Plane className="h-3.5 w-3.5" />
                <span>
                  {delegationDraft.enabled
                    ? 'Save & Activate Stand-In Delegation'
                    : 'Save Delegation Settings'}
                </span>
              </button>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

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

                <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-3 font-mono text-[11px]">
                  {inspectResource.technicalId}
                </div>

                <ul className="space-y-1.5">
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
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Clickable Approver Reference Inspector */}
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
