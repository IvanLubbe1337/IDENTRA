import { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Eye,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { PersonInspectorDrawer } from '@/demo/views/PersonInspectorDrawer';
import { cn } from '@/lib/cn';

export function PeopleView() {
  const people = useDemoStore((s) => s.people);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const selectedPersonId = useDemoStore((s) => s.selectedPersonId);
  const setSelectedPersonId = useDemoStore((s) => s.setSelectedPersonId);
  const onboardNewJoiner = useDemoStore((s) => s.onboardNewJoiner);

  const [statusFilter, setStatusFilter] = useState<string>('All');

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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">People Directory</h1>
          <p className="text-sm text-slate-500">
            Inspect any identity for complete HR master data, UPN, contract dates, clickable Org Units &amp; Contexts, source lineage, and change history.
          </p>
        </div>
        <button
          type="button"
          onClick={onboardNewJoiner}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Simulate HRIS Joiner</span>
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {['All', 'Active', 'Joiner', 'Mover', 'Leaver', 'Suspended'].map((st) => (
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
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((person) => (
                <tr
                  key={person.id}
                  onClick={() => setSelectedPersonId(person.id)}
                  className="cursor-pointer transition-colors hover:bg-sky-50/40"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0F172A]">{person.name}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                        {person.employeeNumber}
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                      {person.email}
                    </div>
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
                        person.jmlStatus === 'Joiner'
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
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPersonId(person.id);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
