import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Box,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Scissors,
  Shield,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';
import type { DemoRole } from '@/data/demoSampleData';
import { Dialog, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

export function ApplicationsView() {
  const applications = useDemoStore((s) => s.applications);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const syncApplication = useDemoStore((s) => s.syncApplication);

  const filtered = applications.filter(
    (app) =>
      !searchQuery.trim() ||
      `${app.name} ${app.category} ${app.connector}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
          Connected Applications (126)
        </h1>
        <p className="text-sm text-slate-500">
          Tier-classified SaaS, cloud, ERP, and directory connectors reconciled continuously by IDENTRA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((app) => {
          const hasDrift = app.status === 'Drift Detected';
          return (
            <div
              key={app.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284C7]">
                      <Box className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-heading text-sm font-bold text-[#0F172A]">
                        {app.name}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {app.category} · {app.tier}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                      hasDrift
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    )}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#F8FAFC] p-3 text-center">
                  <div>
                    <div className="font-mono text-sm font-bold text-[#0F172A]">
                      {app.accounts.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500">Accounts</div>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-[#0F172A]">
                      {app.entitlements.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500">Entitlements</div>
                  </div>
                  <div>
                    <div
                      className={cn(
                        'font-mono text-sm font-bold',
                        app.parity === 100 ? 'text-emerald-600' : 'text-amber-600'
                      )}
                    >
                      {app.parity}%
                    </div>
                    <div className="text-[10px] text-slate-500">Parity</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs">
                <span className="font-mono text-[10px] text-slate-400">
                  {app.connector} · {app.lastSync}
                </span>
                <button
                  type="button"
                  onClick={() => syncApplication(app.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{hasDrift ? 'Reconcile' : 'Sync'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EntitlementsView() {
  const entitlements = useDemoStore((s) => s.entitlements);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const revokeEntitlementDrift = useDemoStore((s) => s.revokeEntitlementDrift);

  const filtered = entitlements.filter(
    (e) =>
      !searchQuery.trim() ||
      `${e.name} ${e.application} ${e.assignedTo}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
          Entitlements Catalog (12,480)
        </h1>
        <p className="text-sm text-slate-500">
          Continuous Desired-vs-Actual comparison isolating direct out-of-band privilege drift.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Entitlement</th>
                <th className="px-4 py-3">Application</th>
                <th className="px-4 py-3">Assigned Identity</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ent) => (
                <tr key={ent.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-mono font-semibold text-[#0F172A]">
                    {ent.name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{ent.application}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{ent.assignedTo}</td>
                  <td className="px-4 py-3.5 text-slate-500">{ent.source}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                        ent.status === 'Drift'
                          ? 'bg-rose-50 text-rose-600'
                          : ent.status === 'Revoked'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {ent.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {ent.status === 'Drift' ? (
                      <button
                        type="button"
                        onClick={() => revokeEntitlementDrift(ent.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 font-semibold text-white hover:bg-rose-700"
                      >
                        <Scissors className="h-3 w-3" />
                        <span>Revoke Drift</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{ent.status === 'Revoked' ? 'Removed' : 'Clean'}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function RolesView() {
  const roles = useDemoStore((s) => s.roles);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);
  const setSelectedPersonId = useDemoStore((s) => s.setSelectedPersonId);

  const [testResult, setTestResult] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<DemoRole | null>(null);
  const [drawerTab, setDrawerTab] = useState<'entitlements' | 'members'>('entitlements');

  const filteredRoles = roles.filter(
    (r) =>
      !searchQuery.trim() ||
      `${r.name} ${r.department} ${r.owner} ${r.includedApps.join(' ')}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const openRoleInspector = (role: DemoRole, tab: 'entitlements' | 'members') => {
    setSelectedRole(role);
    setDrawerTab(tab);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Business Roles (737)
          </h1>
          <p className="text-sm text-slate-500">
            Select <strong className="text-slate-700">members</strong> or{' '}
            <strong className="text-slate-700">entitlements</strong> on any role to inspect its composition and assigned identities.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setTestResult(
              'BLOCKED BY SOX-SOD-402: Assigning "Treasury: Payment Approver" to a holder of "Finance: AP-Clerk" is prevented automatically.'
            )
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Test Preventative SoD Check</span>
        </button>
      </div>

      {testResult && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div className="flex-1 font-medium">{testResult}</div>
          <button
            type="button"
            onClick={() => setTestResult(null)}
            className="cursor-pointer font-mono text-[10px] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-sky-200"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284C7]">
                    <Shield className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-heading text-sm font-bold text-[#0F172A]">
                      {role.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {role.department} · Owner: {role.owner}
                    </div>
                  </div>
                </div>
                {role.sodSensitive && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-700">
                    SoD Guarded
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {role.description}
              </p>

              {/* Selectable Members & Entitlements Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openRoleInspector(role, 'members')}
                  className="group inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 font-mono text-xs font-semibold text-[#0F172A] transition-all hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
                >
                  <Users className="h-3.5 w-3.5 text-[#0EA5E9]" />
                  <span>{role.members} members</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0284C7]" />
                </button>

                <button
                  type="button"
                  onClick={() => openRoleInspector(role, 'entitlements')}
                  className="group inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 font-mono text-xs font-semibold text-[#0F172A] transition-all hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
                >
                  <KeyRound className="h-3.5 w-3.5 text-[#0EA5E9]" />
                  <span>{role.entitlementsCount} entitlements</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0284C7]" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3.5">
              <div className="flex flex-wrap gap-1.5">
                {role.includedApps.map((a) => (
                  <span
                    key={a}
                    className="rounded-lg border border-sky-100 bg-sky-50/60 px-2 py-0.5 text-[11px] font-medium text-[#0284C7]"
                  >
                    {a}
                  </span>
                ))}
              </div>

              {role.conflictsWith && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2 font-mono text-[11px] text-amber-800">
                  SoD conflict pair: <strong>{role.conflictsWith}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Radix Slide-Over Role Composition & Members Drawer */}
      <Dialog.Root
        open={Boolean(selectedRole)}
        onOpenChange={(open) => {
          if (!open) setSelectedRole(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {selectedRole && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>Business Role</span>
                      <span>·</span>
                      <span>{selectedRole.department}</span>
                      <span>·</span>
                      <span>Owner: {selectedRole.owner}</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {selectedRole.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-slate-500">
                      {selectedRole.description}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close role inspector"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {selectedRole.conflictsWith && (
                  <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      <strong>SOX SoD Guardrail:</strong> Mutually exclusive with{' '}
                      <strong>{selectedRole.conflictsWith}</strong>.
                    </span>
                  </div>
                )}

                <Tabs.Root
                  value={drawerTab}
                  onValueChange={(v) => setDrawerTab(v as 'entitlements' | 'members')}
                  className="flex flex-1 flex-col overflow-hidden px-6 pt-4"
                >
                  <Tabs.List className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                    <Tabs.Trigger
                      value="entitlements"
                      className={cn(
                        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all',
                        drawerTab === 'entitlements'
                          ? 'bg-white text-[#0F172A] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      )}
                    >
                      <KeyRound className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      <span>
                        Entitlements ({selectedRole.entitlementList.length} shown of{' '}
                        {selectedRole.entitlementsCount})
                      </span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="members"
                      className={cn(
                        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all',
                        drawerTab === 'members'
                          ? 'bg-white text-[#0F172A] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      )}
                    >
                      <Users className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      <span>
                        Members ({selectedRole.memberList.length} shown of {selectedRole.members})
                      </span>
                    </Tabs.Trigger>
                  </Tabs.List>

                  {/* Entitlements Tab */}
                  <Tabs.Content
                    value="entitlements"
                    className="flex-1 space-y-3 overflow-y-auto py-4 focus:outline-none"
                  >
                    {selectedRole.entitlementList.map((ent) => (
                      <div
                        key={ent.id}
                        className="rounded-xl border border-slate-200/80 bg-[#FBFDFF] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                            {ent.type}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                              ent.sensitivity === 'Critical'
                                ? 'bg-rose-50 text-rose-600'
                                : ent.sensitivity === 'High'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {ent.sensitivity}
                          </span>
                        </div>
                        <div className="mt-2 font-heading text-sm font-bold text-[#0F172A]">
                          {ent.name}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-600">
                          System: {ent.application}
                        </div>
                        <div className="mt-2 rounded-lg bg-slate-100/80 px-2.5 py-1.5 font-mono text-[10px] text-slate-600 break-all">
                          {ent.technicalId}
                        </div>
                      </div>
                    ))}
                  </Tabs.Content>

                  {/* Members Tab */}
                  <Tabs.Content
                    value="members"
                    className="flex-1 space-y-2.5 overflow-y-auto py-4 focus:outline-none"
                  >
                    {selectedRole.memberList.map((member) => (
                      <div
                        key={member.id}
                        className={cn(
                          'flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center',
                          member.status === 'SoD Conflict'
                            ? 'border-rose-200 bg-rose-50/40'
                            : 'border-slate-200/80 bg-[#FBFDFF]'
                        )}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-heading text-sm font-bold text-[#0F172A]">
                              {member.name}
                            </span>
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                                member.status === 'SoD Conflict'
                                  ? 'bg-rose-100 text-rose-700'
                                  : member.status === 'JIT Active'
                                    ? 'bg-sky-100 text-[#0284C7]'
                                    : 'bg-emerald-50 text-emerald-700'
                              )}
                            >
                              {member.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {member.title} · {member.department}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-slate-400">
                            {member.email} · Source: {member.assignmentSource} · Since{' '}
                            {member.grantedOn}
                          </div>
                        </div>

                        {member.personId && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPersonId(member.personId!);
                              setSelectedRole(null);
                              setActiveSection('people');
                            }}
                            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                          >
                            <span>View Profile</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </Tabs.Content>
                </Tabs.Root>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
