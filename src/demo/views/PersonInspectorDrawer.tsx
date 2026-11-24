import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronRight,
  Database,
  History,
  Layers,
  MapPin,
  Network,
  Shield,
  ShieldOff,
  UserCheck,
  UserMinus,
  Wallet,
  X,
} from 'lucide-react';
import type { DemoPerson } from '@/data/demoSampleData';
import {
  REFERENCE_OBJECTS,
  type ReferenceObject,
} from '@/data/referenceObjectsData';
import { Dialog, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

interface PersonInspectorDrawerProps {
  person: DemoPerson | null;
  onClose: () => void;
}

export function PersonInspectorDrawer({ person, onClose }: PersonInspectorDrawerProps) {
  const movePersonDepartment = useDemoStore((s) => s.movePersonDepartment);
  const offboardPerson = useDemoStore((s) => s.offboardPerson);
  const emergencyDeactivatePerson = useDemoStore((s) => s.emergencyDeactivatePerson);
  const mitigatePersonSod = useDemoStore((s) => s.mitigatePersonSod);

  const [activeTab, setActiveTab] = useState<'overview' | 'contexts' | 'access' | 'history'>(
    'overview'
  );
  // Stack of clicked ReferenceObject IDs enabling recursive drill-down & breadcrumb back-navigation
  const [refStack, setRefStack] = useState<string[]>([]);
  const [showEmergencyBar, setShowEmergencyBar] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState(
    'Suspected credential compromise / immediate containment'
  );

  useEffect(() => {
    setActiveTab('overview');
    setRefStack([]);
    setShowEmergencyBar(false);
  }, [person?.id]);

  const activeRefId = refStack.length > 0 ? refStack[refStack.length - 1] : null;
  const activeRef: ReferenceObject | null = activeRefId
    ? (REFERENCE_OBJECTS[activeRefId] ?? null)
    : null;

  const pushRef = (refId: string) => {
    if (!REFERENCE_OBJECTS[refId]) return;
    setRefStack((prev) => [...prev, refId]);
  };

  const popRef = () => {
    setRefStack((prev) => prev.slice(0, -1));
  };

  const openHistory = () => {
    setRefStack([]);
    setActiveTab('history');
  };

  const contexts: ReferenceObject[] = person
    ? person.contextRefIds
        .map((id) => REFERENCE_OBJECTS[id])
        .filter((obj): obj is ReferenceObject => Boolean(obj))
    : [];

  return (
    <Dialog.Root
      open={Boolean(person)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
          {person && (
            <>
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase">
                    <span className="text-[#0284C7]">{person.employeeNumber}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{person.type}</span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5',
                        person.jmlStatus === 'Deactivated'
                          ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300'
                          : person.jmlStatus === 'Joiner'
                            ? 'bg-emerald-50 text-emerald-700'
                            : person.jmlStatus === 'Mover'
                              ? 'bg-sky-50 text-[#0284C7]'
                              : person.jmlStatus === 'Leaver'
                                ? 'bg-rose-50 text-rose-600'
                                : person.jmlStatus === 'Suspended'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {person.jmlStatus}
                    </span>
                  </div>

                  <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                    {person.firstName} {person.lastName}
                  </Dialog.Title>
                  <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                    {person.title} · {person.companyName}
                  </Dialog.Description>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {person.jmlStatus !== 'Deactivated' && (
                    <button
                      type="button"
                      onClick={() => setShowEmergencyBar((v) => !v)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-600 hover:text-white"
                    >
                      <ShieldOff className="h-3.5 w-3.5" />
                      <span>Emergency Deactivate</span>
                    </button>
                  )}

                  {/* Prominent History Button right in the Inspector Header */}
                  <button
                    type="button"
                    onClick={openHistory}
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all',
                      !activeRef && activeTab === 'history'
                        ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]'
                    )}
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>History ({person.changeHistory.length})</span>
                  </button>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close identity inspector"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              {/* Inline Emergency Kill-Switch Confirmation Panel */}
              {showEmergencyBar && person.jmlStatus !== 'Deactivated' && (
                <div className="border-b border-rose-200 bg-rose-50/90 px-6 py-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <div className="flex-1 space-y-2">
                      <div className="font-bold text-rose-900">
                        Emergency Deactivation: Disable all {person.applications.length} target system accounts &amp; set status to Deactivated
                      </div>
                      <input
                        type="text"
                        value={emergencyReason}
                        onChange={(e) => setEmergencyReason(e.target.value)}
                        placeholder="Incident reason recorded in immutable History..."
                        className="w-full rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs text-[#0F172A] focus:border-rose-400 focus:outline-none"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            emergencyDeactivatePerson(person.id, emergencyReason);
                            setShowEmergencyBar(false);
                            setRefStack([]);
                            setActiveTab('history');
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 font-semibold text-white hover:bg-rose-700"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          <span>Confirm &amp; Disable All Target Accounts</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEmergencyBar(false)}
                          className="cursor-pointer rounded-lg border border-rose-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Either Recursive Reference Object Drill-Down View OR Main Tabbed Identity View */}
              {activeRef ? (
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Breadcrumb Trail */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 bg-[#F8FBFF] px-6 py-3 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRefStack([])}
                        className="cursor-pointer font-semibold text-[#0284C7] hover:underline"
                      >
                        {person.name}
                      </button>
                      {refStack.map((id, idx) => {
                        const obj = REFERENCE_OBJECTS[id];
                        if (!obj) return null;
                        const isLast = idx === refStack.length - 1;
                        return (
                          <span key={`${id}-${idx}`} className="inline-flex items-center gap-1.5">
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                            {isLast ? (
                              <span className="font-semibold text-[#0F172A]">
                                {obj.kind}: {obj.name}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setRefStack((prev) => prev.slice(0, idx + 1))}
                                className="cursor-pointer text-[#0284C7] hover:underline"
                              >
                                {obj.name}
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={popRef}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0284C7] hover:bg-sky-50"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  {/* Reference Object Details */}
                  <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    <div className="rounded-2xl border border-sky-200/80 bg-[#F8FBFF] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-md bg-[#0EA5E9] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                          Reference · {activeRef.kind}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                            activeRef.status === 'Expired'
                              ? 'bg-rose-100 text-rose-700'
                              : activeRef.status === 'Restricted'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-700'
                          )}
                        >
                          {activeRef.status}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-bold text-[#0F172A]">
                        {activeRef.name}
                      </h3>
                      <div className="font-mono text-xs text-[#0284C7]">{activeRef.code}</div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {activeRef.description}
                      </p>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Reference Object Properties
                      </div>
                      <div className="mt-2.5 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {activeRef.properties.map((prop) => (
                          <div
                            key={prop.label}
                            className="flex flex-col justify-between gap-1 px-4 py-3 text-xs sm:flex-row sm:items-center"
                          >
                            <span className="font-medium text-slate-500">{prop.label}</span>
                            {prop.refId && REFERENCE_OBJECTS[prop.refId] ? (
                              <button
                                type="button"
                                onClick={() => pushRef(prop.refId!)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-sky-200 bg-sky-50/70 px-2.5 py-1 font-semibold text-[#0284C7] transition-colors hover:bg-[#0EA5E9] hover:text-white"
                              >
                                <span className={prop.mono ? 'font-mono' : undefined}>
                                  {prop.value}
                                </span>
                                <ArrowUpRight className="h-3 w-3" />
                              </button>
                            ) : (
                              <span
                                className={cn(
                                  'font-semibold text-[#0F172A] break-all',
                                  prop.mono && 'font-mono text-[11px]'
                                )}
                              >
                                {prop.value}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeRef.linkedRoles && activeRef.linkedRoles.length > 0 && (
                      <div>
                        <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          Policy-Bound Business Roles ({activeRef.linkedRoles.length})
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {activeRef.linkedRoles.map((r) => (
                            <span
                              key={r}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0F172A]"
                            >
                              <Shield className="h-3.5 w-3.5 text-[#0EA5E9]" />
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Tabs.Root
                  value={activeTab}
                  onValueChange={(v) =>
                    setActiveTab(v as 'overview' | 'contexts' | 'access' | 'history')
                  }
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <div className="border-b border-slate-100 px-6 pt-3 pb-3">
                    <Tabs.List className="grid grid-cols-4 gap-1.5 rounded-xl bg-slate-100 p-1">
                      {[
                        { id: 'overview', label: 'Properties & Org' },
                        { id: 'contexts', label: `Contexts (${contexts.length})` },
                        { id: 'access', label: `Access (${person.roles.length})` },
                        { id: 'history', label: `History (${person.changeHistory.length})` },
                      ].map((t) => (
                        <Tabs.Trigger
                          key={t.id}
                          value={t.id}
                          className={cn(
                            'cursor-pointer rounded-lg py-1.5 text-xs font-semibold transition-all',
                            activeTab === t.id
                              ? 'bg-white text-[#0F172A] shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          )}
                        >
                          {t.label}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>
                  </div>

                  {/* TAB 1: Full Properties, HR Dates, Source & Clickable Org References */}
                  <Tabs.Content
                    value="overview"
                    className="flex-1 space-y-5 overflow-y-auto px-6 py-5 focus:outline-none"
                  >
                    {person.sodAlert && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                          <div>
                            <div className="font-bold">Active Process++ SoD Violation</div>
                            <div className="mt-0.5">{person.sodAlert}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => mitigatePersonSod(person.id)}
                          className="cursor-pointer rounded-xl bg-rose-600 px-3.5 py-1.5 font-semibold text-white hover:bg-rose-700"
                        >
                          Auto-Fix SoD
                        </button>
                      </div>
                    )}

                    {/* Section A: Identity & Directory Properties */}
                    <div>
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Identity &amp; Account Properties
                      </div>
                      <div className="mt-2.5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-[#FBFDFF] p-4 text-xs sm:grid-cols-2">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">First Name</div>
                          <div className="mt-0.5 font-semibold text-[#0F172A]">{person.firstName}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Last Name</div>
                          <div className="mt-0.5 font-semibold text-[#0F172A]">{person.lastName}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Employee Number</div>
                          <div className="mt-0.5 font-mono font-semibold text-[#0F172A]">
                            {person.employeeNumber}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">SAM Account Name</div>
                          <div className="mt-0.5 font-mono font-semibold text-[#0F172A]">
                            {person.samAccountName}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-[10px] text-slate-400 uppercase">Primary Email</div>
                          <div className="mt-0.5 font-mono text-[#0F172A]">{person.email}</div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-[10px] text-slate-400 uppercase">
                            User Principal Name (UPN)
                          </div>
                          <div className="mt-0.5 font-mono text-[#0F172A] break-all">
                            {person.upn}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Work Location</div>
                          <div className="mt-0.5 inline-flex items-center gap-1 font-medium text-slate-700">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{person.location}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Risk Score</div>
                          <div
                            className={cn(
                              'mt-0.5 font-mono font-bold',
                              person.riskScore >= 70
                                ? 'text-rose-600'
                                : person.riskScore >= 25
                                  ? 'text-amber-600'
                                  : 'text-emerald-600'
                            )}
                          >
                            {person.riskScore} / 100
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section B: Contract & HR Lifecycle Dates */}
                    <div>
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Contract &amp; HR Lifecycle Dates
                      </div>
                      <div className="mt-2.5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-[#FBFDFF] p-4 text-xs sm:grid-cols-3">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Contract Type</div>
                          <div className="mt-0.5 font-semibold text-[#0F172A]">
                            {person.contractType}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">HR Start Date</div>
                          <div className="mt-0.5 inline-flex items-center gap-1.5 font-mono font-semibold text-[#0F172A]">
                            <Calendar className="h-3.5 w-3.5 text-[#0EA5E9]" />
                            <span>{person.hrStartDate}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">HR End Date</div>
                          <div
                            className={cn(
                              'mt-0.5 inline-flex items-center gap-1.5 font-mono font-semibold',
                              person.hrEndDate ? 'text-rose-600' : 'text-emerald-700'
                            )}
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{person.hrEndDate ?? 'Indefinite'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section C: Authoritative Identity Source */}
                    <div>
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Authoritative Identity Source
                      </div>
                      <div className="mt-2.5 flex flex-col justify-between gap-3 rounded-2xl border border-sky-200/80 bg-[#F8FBFF] p-4 text-xs sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={() => pushRef(person.sourceRefId)}
                          className="group flex cursor-pointer items-center gap-3 text-left"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0284C7] shadow-2xs ring-1 ring-sky-200">
                            <Database className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="inline-flex items-center gap-1 font-heading font-bold text-[#0F172A] group-hover:text-[#0284C7]">
                              <span>{person.sourceSystem}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-[#0EA5E9]" />
                            </div>
                            <div className="font-mono text-[10px] text-slate-500">
                              External ID: {person.sourceExternalId} · Last Sync: {person.lastHrSync}
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={openHistory}
                          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3 py-1.5 font-semibold text-[#0284C7] hover:bg-sky-50"
                        >
                          <History className="h-3.5 w-3.5" />
                          <span>View Change History</span>
                        </button>
                      </div>
                    </div>

                    {/* Section D: Clickable Organizational Reference Objects */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        <span>Organizational Reference Objects</span>
                        <span className="text-[#0284C7]">Click any object to inspect</span>
                      </div>
                      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {[
                          {
                            label: 'Company / Legal Entity',
                            value: person.companyName,
                            refId: person.companyRefId,
                            icon: Building2,
                          },
                          {
                            label: 'Department',
                            value: person.department,
                            refId: person.departmentRefId,
                            icon: Layers,
                          },
                          {
                            label: 'Org Unit (OU)',
                            value: person.orgUnitName,
                            refId: person.orgUnitRefId,
                            icon: Network,
                          },
                          {
                            label: 'Line Manager / Sponsor',
                            value: person.manager,
                            refId: person.managerRefId,
                            icon: UserCheck,
                          },
                          {
                            label: 'Cost Center',
                            value: person.costCenterCode,
                            refId: person.costCenterRefId,
                            icon: Wallet,
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => pushRef(item.refId)}
                              className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:border-[#0EA5E9] hover:bg-sky-50/50"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#0EA5E9] group-hover:text-white">
                                  <Icon className="h-4 w-4" />
                                </span>
                                <div className="min-w-0">
                                  <div className="font-mono text-[9px] text-slate-400 uppercase">
                                    {item.label}
                                  </div>
                                  <div className="truncate text-xs font-semibold text-[#0F172A] group-hover:text-[#0284C7]">
                                    {item.value}
                                  </div>
                                </div>
                              </div>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-[#0EA5E9]" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section E: Quick Clickable Context Pills */}
                    <div>
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Assigned Identity Contexts ({contexts.length})
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {contexts.map((ctx) => (
                          <button
                            key={ctx.id}
                            type="button"
                            onClick={() => pushRef(ctx.id)}
                            className={cn(
                              'inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all',
                              ctx.status === 'Expired'
                                ? 'border-rose-200 bg-rose-50/60 text-rose-700 hover:border-rose-400'
                                : 'border-sky-200 bg-sky-50/60 text-[#0369A1] hover:border-[#0EA5E9] hover:bg-sky-100/70'
                            )}
                          >
                            <span>{ctx.name}</span>
                            <span className="font-mono text-[10px] opacity-75">({ctx.code})</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </Tabs.Content>

                  {/* TAB 2: Dedicated Identity Contexts View */}
                  <Tabs.Content
                    value="contexts"
                    className="flex-1 space-y-3 overflow-y-auto px-6 py-5 focus:outline-none"
                  >
                    <p className="text-xs text-slate-500">
                      Identity Process++ Contexts bind organizational relationships, validity dates, and automated business roles. Click any context to inspect its full reference properties.
                    </p>
                    {contexts.map((ctx) => (
                      <button
                        key={ctx.id}
                        type="button"
                        onClick={() => pushRef(ctx.id)}
                        className="group block w-full cursor-pointer rounded-2xl border border-slate-200 bg-[#FBFDFF] p-4 text-left transition-all hover:border-[#0EA5E9] hover:bg-sky-50/40"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#0284C7]">
                            {ctx.code}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                              ctx.status === 'Expired'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-50 text-emerald-700'
                            )}
                          >
                            {ctx.status}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="font-heading text-sm font-bold text-[#0F172A] group-hover:text-[#0284C7]">
                            {ctx.name}
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#0EA5E9]" />
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{ctx.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {ctx.properties.slice(1, 4).map((p) => (
                            <span
                              key={p.label}
                              className="rounded-lg bg-white px-2 py-1 font-mono text-[10px] text-slate-600 border border-slate-200/80"
                            >
                              {p.label}: <strong className="text-slate-900">{p.value}</strong>
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </Tabs.Content>

                  {/* TAB 3: Roles, Applications & JML Actions */}
                  <Tabs.Content
                    value="access"
                    className="flex-1 space-y-5 overflow-y-auto px-6 py-5 focus:outline-none"
                  >
                    <div>
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Assigned Business Roles ({person.roles.length})
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {person.roles.length === 0 ? (
                          <span className="text-xs text-slate-400">
                            No active roles (off-boarded)
                          </span>
                        ) : (
                          person.roles.map((r) => (
                            <span
                              key={r}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0F172A]"
                            >
                              <Shield className="h-3.5 w-3.5 text-[#0EA5E9]" />
                              {r}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Connected Target Systems ({person.applications.length})
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {person.applications.length === 0 ? (
                          <span className="text-xs text-slate-400">0 active target accounts</span>
                        ) : (
                          person.applications.map((a) => (
                            <span
                              key={a}
                              className="rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-1.5 text-xs font-medium text-[#0284C7]"
                            >
                              {a}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
                      <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Execute Live Identity Process++ Actions
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Running any action updates this identity&apos;s properties and appends an immutable entry to its History tab.
                      </p>
                      <div className="mt-3.5 flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => movePersonDepartment(person.id)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                          <span>Simulate Org Transfer (Mover)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => offboardPerson(person.id)}
                          disabled={
                            person.jmlStatus === 'Suspended' ||
                            person.jmlStatus === 'Deactivated'
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                          <span>Trigger Immediate Off-board</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEmergencyBar(true)}
                          disabled={person.jmlStatus === 'Deactivated'}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          <span>
                            {person.jmlStatus === 'Deactivated'
                              ? 'Identity Deactivated'
                              : 'Emergency Deactivate'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </Tabs.Content>

                  {/* TAB 4: Full Identity Change History Timeline */}
                  <Tabs.Content
                    value="history"
                    className="flex-1 space-y-3 overflow-y-auto px-6 py-5 focus:outline-none"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Complete attribute, context, and lifecycle audit trail for{' '}
                        <strong className="text-[#0F172A]">{person.name}</strong>.
                      </span>
                      <span className="font-mono text-[10px] text-[#0284C7]">
                        {person.changeHistory.length} events
                      </span>
                    </div>

                    <div className="space-y-3">
                      {person.changeHistory.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-2xl border border-slate-200 bg-[#FBFDFF] p-4 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0284C7]">
                                {entry.category}
                              </span>
                              <span className="font-medium text-slate-600">{entry.source}</span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400">
                              {entry.timestamp}
                            </span>
                          </div>

                          <p className="mt-2 font-medium text-[#0F172A]">{entry.summary}</p>

                          <div className="mt-2.5 space-y-1.5">
                            {entry.changes.map((c, idx) => (
                              <div
                                key={`${entry.id}-${c.field}-${idx}`}
                                className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 font-mono text-[10px]"
                              >
                                <span className="font-bold text-slate-700">{c.field}:</span>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500">
                                  {c.before ?? 'null'}
                                </span>
                                <ArrowRight className="h-3 w-3 text-[#0EA5E9]" />
                                <span className="rounded bg-sky-50 px-1.5 py-0.5 font-semibold text-[#0369A1]">
                                  {c.after ?? 'null'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tabs.Content>
                </Tabs.Root>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
