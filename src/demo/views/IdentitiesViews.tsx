import { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Eye,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  UserPlus,
  X,
} from 'lucide-react';
import { maskSensitiveValue } from '@/data/demoSampleData';
import { Dialog } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { PersonInspectorDrawer } from '@/demo/views/PersonInspectorDrawer';
import { cn } from '@/lib/cn';

const EMERGENCY_REASONS = [
  'Suspected credential compromise / account takeover',
  'Involuntary immediate termination (HR Security Escalation)',
  'Lost or stolen corporate device with active tokens',
  'Insider threat / unauthorized data exfiltration alert',
];

export function PeopleView() {
  const people = useDemoStore((s) => s.people);
  const schemaObjects = useDemoStore((s) => s.schemaObjects);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const selectedPersonId = useDemoStore((s) => s.selectedPersonId);
  const setSelectedPersonId = useDemoStore((s) => s.setSelectedPersonId);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);
  const onboardNewJoiner = useDemoStore((s) => s.onboardNewJoiner);
  const openOnboardingTab = useDemoStore((s) => s.openOnboardingTab);
  const emergencyDeactivatePerson = useDemoStore((s) => s.emergencyDeactivatePerson);

  const identitySchema = schemaObjects.find((o) => o.id === 'obj-identity');
  const sensitiveProps = (identitySchema?.properties ?? []).filter((p) => p.sensitive);
  const getIdentityProp = (key: string) =>
    identitySchema?.properties.find((p) => p.key === key);
  const formatPortalField = (key: string, value: string) => {
    const prop = getIdentityProp(key);
    if (prop?.sensitive) {
      return {
        display: maskSensitiveValue(value, prop.maskPattern),
        masked: true,
      };
    }
    return { display: value, masked: false };
  };

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [confirmDeactivateId, setConfirmDeactivateId] = useState<string | null>(null);
  const [deactivateReason, setDeactivateReason] = useState<string>(EMERGENCY_REASONS[0]);

  const filtered = people.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      `${p.name} ${p.email} ${p.upn} ${p.employeeNumber} ${p.department} ${p.orgUnitName} ${p.title}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.jmlStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedPerson = people.find((p) => p.id === selectedPersonId) ?? null;
  const personToDeactivate = people.find((p) => p.id === confirmDeactivateId) ?? null;

  const handleConfirmEmergencyDeactivate = () => {
    if (!personToDeactivate) return;
    emergencyDeactivatePerson(personToDeactivate.id, deactivateReason);
    setConfirmDeactivateId(null);
    setDeactivateReason(EMERGENCY_REASONS[0]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">People Directory</h1>
          <p className="text-sm text-slate-500">
            Inspect any identity for complete HR master data, UPN, contract dates, clickable Org Units &amp; Contexts, source lineage, change history, or trigger emergency deactivation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openOnboardingTab('contractor')}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
          >
            <UserPlus className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Onboard Contractor</span>
          </button>
          <button
            type="button"
            onClick={onboardNewJoiner}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Simulate HRIS Joiner</span>
          </button>
        </div>
      </div>

      {/* Filter pills & Active Sensitive Field Masking Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Active', 'Joiner', 'Mover', 'Leaver', 'Suspended', 'Deactivated'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                statusFilter === st
                  ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {st}
            </button>
          ))}
        </div>

        {sensitiveProps.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveSection('configuration')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-mono text-[10px] font-semibold text-amber-800 hover:bg-amber-100"
          >
            <Lock className="h-3 w-3 text-amber-600" />
            <span>
              {sensitiveProps.length} Sensitive Identity Field{sensitiveProps.length === 1 ? '' : 's'} Masked
            </span>
          </button>
        )}
      </div>

      {/* Clean Full-Width People Directory Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3.5">Identity &amp; Emp #</th>
                <th className="px-4 py-3.5">Organization &amp; Org Unit</th>
                <th className="px-4 py-3.5">Contract &amp; Source</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Risk</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((person) => {
                const isDeactivated = person.jmlStatus === 'Deactivated';
                return (
                  <tr
                    key={person.id}
                    onClick={() => setSelectedPersonId(person.id)}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-sky-50/40',
                      isDeactivated && 'bg-rose-50/20'
                    )}
                  >
                    <td className="px-4 py-3.5">
                      {(() => {
                        const empField = formatPortalField('employeeNumber', person.employeeNumber);
                        const emailField = formatPortalField('email', person.email);
                        const fnameField = formatPortalField('firstName', person.firstName);
                        const lnameField = formatPortalField('lastName', person.lastName);
                        return (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#0F172A]">
                                {fnameField.display} {lnameField.display}
                              </span>
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px]',
                                  empField.masked
                                    ? 'bg-amber-50 font-bold text-amber-800 ring-1 ring-amber-200'
                                    : 'bg-slate-100 text-slate-600'
                                )}
                              >
                                {empField.masked && <Lock className="h-2.5 w-2.5 text-amber-600" />}
                                {empField.display}
                              </span>
                            </div>
                            <div
                              className={cn(
                                'mt-0.5 inline-flex items-center gap-1 font-mono text-[10px]',
                                emailField.masked ? 'font-semibold text-amber-800' : 'text-slate-500'
                              )}
                            >
                              {emailField.masked && <Lock className="h-2.5 w-2.5 text-amber-600" />}
                              <span>{emailField.display}</span>
                            </div>
                          </>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      <div className="font-medium text-[#0F172A]">{person.orgUnitName}</div>
                      <div className="text-[11px] text-slate-500">
                        {person.companyName}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-700">{person.contractType}</div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {person.sourceSystem}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                          person.jmlStatus === 'Deactivated'
                            ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300/70'
                            : person.jmlStatus === 'Joiner'
                              ? 'bg-emerald-50 text-emerald-700'
                              : person.jmlStatus === 'Mover'
                                ? 'bg-sky-50 text-[#0284C7]'
                                : person.jmlStatus === 'Leaver'
                                  ? 'bg-rose-50 text-rose-600'
                                  : person.jmlStatus === 'Suspended'
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-slate-50 text-slate-700'
                        )}
                      >
                        {person.jmlStatus}
                      </span>
                      {person.sodAlert && (
                        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] font-semibold text-rose-600">
                          <ShieldAlert className="h-3 w-3" />
                          <span>SoD Alert</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'font-mono font-bold',
                          person.riskScore >= 70
                            ? 'text-rose-600'
                            : person.riskScore >= 25
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                        )}
                      >
                        {person.riskScore}/100
                      </span>
                    </td>
                    <td
                      className="px-4 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        {!isDeactivated && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeactivateReason(EMERGENCY_REASONS[0]);
                              setConfirmDeactivateId(person.id);
                            }}
                            title="Emergency Deactivate identity across all target systems"
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-600 hover:text-white"
                          >
                            <ShieldOff className="h-3.5 w-3.5" />
                            <span>Emergency Deactivate</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedPersonId(person.id)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Deactivation Confirmation Modal */}
      <Dialog.Root
        open={Boolean(personToDeactivate)}
        onOpenChange={(open) => {
          if (!open) setConfirmDeactivateId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl focus:outline-none">
            {personToDeactivate && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                      <AlertTriangle className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-mono text-[10px] font-bold tracking-wider text-rose-600 uppercase">
                        Emergency Kill-Switch
                      </div>
                      <Dialog.Title className="font-display text-lg font-extrabold text-[#0F172A]">
                        Emergency Deactivate {personToDeactivate.name}?
                      </Dialog.Title>
                      <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                        This immediately disables accounts across all target systems, revokes active sessions &amp; roles, sets status to <strong>Deactivated</strong>, and seals an audit log entry.
                      </Dialog.Description>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Cancel emergency deactivation"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3.5 text-xs">
                  <div className="font-mono text-[9px] font-bold tracking-wider text-rose-700 uppercase">
                    Target Systems To Be Disabled Immediately ({personToDeactivate.applications.length})
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {personToDeactivate.applications.map((app) => (
                      <span
                        key={app}
                        className="rounded-lg border border-rose-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-rose-800"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Audit Reason (Recorded in Identity History &amp; Audit Log)
                  </label>
                  <select
                    value={
                      EMERGENCY_REASONS.includes(deactivateReason)
                        ? deactivateReason
                        : '__custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== '__custom') setDeactivateReason(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-rose-400 focus:bg-white focus:outline-none"
                  >
                    {EMERGENCY_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                    placeholder="Enter incident ticket or justification..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-[#0F172A] focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
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
                    onClick={handleConfirmEmergencyDeactivate}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
                  >
                    <ShieldOff className="h-3.5 w-3.5" />
                    <span>Confirm Emergency Deactivation</span>
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Full Slide-Over Identity Record, Reference Object & Change History Inspector */}
      <PersonInspectorDrawer
        person={selectedPerson}
        onClose={() => setSelectedPersonId(null)}
      />
    </div>
  );
}

export function NonHumanView() {
  const nonHumans = useDemoStore((s) => s.nonHumans);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const rotateNonHumanSecret = useDemoStore((s) => s.rotateNonHumanSecret);
  const remediateNonHumanDrift = useDemoStore((s) => s.remediateNonHumanDrift);

  const filtered = nonHumans.filter(
    (item) =>
      !searchQuery.trim() ||
      `${item.name} ${item.owner} ${item.targetSystem} ${item.kind}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
          Non-Human Identities &amp; AI Agents
        </h1>
        <p className="text-sm text-slate-500">
          1,284 service accounts, autonomous AI agents, and API tokens governed with human ownership and credential rotation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((item) => {
          const isDrift = item.status === 'Shadow Drift';
          return (
            <div
              key={item.id}
              className={cn(
                'rounded-2xl border bg-white p-5 shadow-xs transition-all',
                isDrift ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      isDrift ? 'bg-rose-100 text-rose-600' : 'bg-sky-50 text-[#0284C7]'
                    )}
                  >
                    {item.kind === 'API Token' ? (
                      <KeyRound className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <div className="font-mono text-sm font-bold text-[#0F172A]">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {item.kind} · Target: <strong className="text-slate-700">{item.targetSystem}</strong>
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                    isDrift
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Owner</div>
                  <div className="mt-0.5 font-medium text-slate-800">{item.owner}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Last Rotated</div>
                  <div className="mt-0.5 font-mono text-slate-700">{item.lastRotated}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Risk</div>
                  <div
                    className={cn(
                      'mt-0.5 font-mono font-bold',
                      item.riskScore >= 70 ? 'text-rose-600' : 'text-emerald-600'
                    )}
                  >
                    {item.riskScore}/100
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Scope:</span> {item.privilegeScope}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => rotateNonHumanSecret(item.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Rotate Secret</span>
                </button>
                {isDrift ? (
                  <button
                    type="button"
                    onClick={() => remediateNonHumanDrift(item.id)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0284C7]"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Contain Shadow Drift</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Least-privilege verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
