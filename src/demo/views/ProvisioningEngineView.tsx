import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Eye,
  FlaskConical,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import type {
  DemoProvisioningJob,
  ProvisioningOperation,
  ProvisioningStatus,
} from '@/data/demoSampleData';
import { Dialog } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

export function ProvisioningEngineView() {
  const jobs = useDemoStore((s) => s.provisioningJobs);
  const globalSearch = useDemoStore((s) => s.searchQuery);
  const releaseSimulatedJob = useDemoStore((s) => s.releaseSimulatedJob);
  const releaseSimulatedJobsBatch = useDemoStore((s) => s.releaseSimulatedJobsBatch);
  const discardSimulatedJob = useDemoStore((s) => s.discardSimulatedJob);
  const retryFailedJob = useDemoStore((s) => s.retryFailedJob);

  // Clean Primary Filters
  const [statusFilter, setStatusFilter] = useState<'All' | ProvisioningStatus>('All');
  const [appFilter, setAppFilter] = useState<string>('All');
  const [operationFilter, setOperationFilter] = useState<'All' | ProvisioningOperation>('All');
  const [identityFilter, setIdentityFilter] = useState<string>('All');

  // Granular Attribute Mapping Sub-Filter (expandable so the queue stays visually calm)
  const [showMappingFilter, setShowMappingFilter] = useState(false);
  const [mappingAttr, setMappingAttr] = useState<string>('All');
  const [mappingValue, setMappingValue] = useState<string>('');

  // On-demand Inspect Drawer
  const [inspectJobId, setInspectJobId] = useState<string | null>(null);

  const uniqueApps = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.application))).sort(),
    [jobs]
  );

  const uniqueIdentities = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.identity))).sort(),
    [jobs]
  );

  const uniqueMappingAttrs = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.mappings.forEach((m) => set.add(m.attribute)));
    return Array.from(set).sort();
  }, [jobs]);

  const suggestedMappingValues = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      j.mappings.forEach((m) => {
        if (mappingAttr === 'All' || m.attribute === mappingAttr) {
          if (m.after) set.add(m.after);
        }
      });
    });
    return Array.from(set).sort();
  }, [jobs, mappingAttr]);

  const filteredJobs = useMemo(() => {
    const valNeedle = mappingValue.trim().toLowerCase();
    const searchNeedle = globalSearch.trim().toLowerCase();

    return jobs.filter((job) => {
      if (operationFilter !== 'All' && job.operation !== operationFilter) return false;
      if (appFilter !== 'All' && job.application !== appFilter) return false;
      if (statusFilter !== 'All' && job.status !== statusFilter) return false;
      if (identityFilter !== 'All' && job.identity !== identityFilter) return false;

      if (mappingAttr !== 'All' || valNeedle) {
        const matches = job.mappings.some((m) => {
          const attrOk = mappingAttr === 'All' || m.attribute === mappingAttr;
          if (!attrOk) return false;
          if (!valNeedle) return true;
          return (
            (m.after ?? '').toLowerCase().includes(valNeedle) ||
            (m.before ?? '').toLowerCase().includes(valNeedle)
          );
        });
        if (!matches) return false;
      }

      if (searchNeedle) {
        const hay = [
          job.jobCode,
          job.identity,
          job.identityEmail,
          job.entitlementOrRole,
          job.application,
          job.operation,
          job.status,
          ...job.mappings.map((m) => `${m.attribute} ${m.before ?? ''} ${m.after ?? ''}`),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(searchNeedle)) return false;
      }

      return true;
    });
  }, [
    jobs,
    operationFilter,
    appFilter,
    statusFilter,
    identityFilter,
    mappingAttr,
    mappingValue,
    globalSearch,
  ]);

  const inspectedJob: DemoProvisioningJob | null =
    jobs.find((j) => j.id === inspectJobId) ?? null;

  const counts = useMemo(
    () => ({
      all: jobs.length,
      simulation: jobs.filter((j) => j.status === 'Simulation Mode').length,
      completed: jobs.filter((j) => j.status === 'Completed').length,
      failed: jobs.filter((j) => j.status === 'Failed').length,
    }),
    [jobs]
  );

  const filteredSimulatedIds = filteredJobs
    .filter((j) => j.status === 'Simulation Mode')
    .map((j) => j.id);

  const hasMappingFilter = mappingAttr !== 'All' || mappingValue.trim() !== '';
  const hasAnyFilter =
    statusFilter !== 'All' ||
    appFilter !== 'All' ||
    operationFilter !== 'All' ||
    identityFilter !== 'All' ||
    hasMappingFilter;

  const clearAllFilters = () => {
    setStatusFilter('All');
    setAppFilter('All');
    setOperationFilter('All');
    setIdentityFilter('All');
    setMappingAttr('All');
    setMappingValue('');
  };

  const applyAdDisabledPreset = () => {
    setAppFilter('Active Directory');
    setStatusFilter('Completed');
    setOperationFilter('Update');
    setIdentityFilter('All');
    setMappingAttr('accountStatus');
    setMappingValue('Disabled');
    setShowMappingFilter(true);
  };

  const payloadPreview = inspectedJob
    ? JSON.stringify(
        {
          jobId: inspectedJob.jobCode,
          mode:
            inspectedJob.status === 'Simulation Mode'
              ? 'DRY_RUN_SIMULATION'
              : 'LIVE_COMMIT',
          system: inspectedJob.application,
          operation: inspectedJob.operation.toUpperCase(),
          principal: inspectedJob.identityEmail,
          attributes: Object.fromEntries(
            inspectedJob.mappings.map((m) => [m.attribute, m.after])
          ),
        },
        null,
        2
      )
    : '';

  return (
    <div className="space-y-5">
      {/* Minimal Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Provisioning Queue
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Review outgoing identity changes across target systems and release Simulation Mode jobs when ready.
          </p>
        </div>

        {filteredSimulatedIds.length > 0 && (
          <button
            type="button"
            onClick={() => releaseSimulatedJobsBatch(filteredSimulatedIds)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0284C7]"
          >
            <Send className="h-3.5 w-3.5" />
            <span>
              Release {filteredSimulatedIds.length} Simulated{' '}
              {filteredSimulatedIds.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </button>
        )}
      </div>

      {/* Status Segmented Tabs + Compact Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'All', label: 'All', count: counts.all },
                { id: 'Simulation Mode', label: 'Simulation Mode', count: counts.simulation },
                { id: 'Completed', label: 'Completed', count: counts.completed },
                { id: 'Failed', label: 'Failed', count: counts.failed },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                    active
                      ? 'border-[#0EA5E9] bg-sky-50 text-[#0284C7]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-[#0F172A]'
                  )}
                >
                  <span>{tab.label}</span>
                  <span className="font-mono text-[10px] opacity-70">{tab.count}</span>
                </button>
              );
            })}
          </div>

          {/* Preset & Mapping Sub-Filter Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={applyAdDisabledPreset}
              className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-semibold text-slate-600 transition-colors hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
            >
              Preset: AD · Disabled
            </button>

            <button
              type="button"
              onClick={() => setShowMappingFilter((v) => !v)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                showMappingFilter || hasMappingFilter
                  ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]'
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Attribute Filter</span>
              {hasMappingFilter && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>

            {hasAnyFilter && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean 3-Column Filter Selects */}
        <div className="grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-3 sm:grid-cols-3">
          <select
            aria-label="Filter by system"
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
          >
            <option value="All">System: All Systems</option>
            {uniqueApps.map((app) => (
              <option key={app} value={app}>
                System: {app}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by operation"
            value={operationFilter}
            onChange={(e) =>
              setOperationFilter(e.target.value as 'All' | ProvisioningOperation)
            }
            className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
          >
            <option value="All">Operation: All (Create / Update / Delete)</option>
            <option value="Create">Operation: Create</option>
            <option value="Update">Operation: Update</option>
            <option value="Delete">Operation: Delete</option>
          </select>

          <select
            aria-label="Filter by identity"
            value={identityFilter}
            onChange={(e) => setIdentityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
          >
            <option value="All">Identity: All Identities</option>
            {uniqueIdentities.map((idName) => (
              <option key={idName} value={idName}>
                Identity: {idName}
              </option>
            ))}
          </select>
        </div>

        {/* Expandable Granular Attribute / Mapping Sub-Filter */}
        {(showMappingFilter || hasMappingFilter) && (
          <div className="rounded-xl border border-sky-200/80 bg-[#F8FBFF] p-3">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] font-semibold tracking-wider text-[#0284C7] uppercase">
              <span>Filter by Mapped Attribute &amp; Target Value</span>
              {hasMappingFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setMappingAttr('All');
                    setMappingValue('');
                  }}
                  className="cursor-pointer text-slate-500 hover:text-rose-600"
                >
                  Clear attribute filter
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <select
                  aria-label="Filter by mapping attribute"
                  value={mappingAttr}
                  onChange={(e) => {
                    setMappingAttr(e.target.value);
                    setMappingValue('');
                  }}
                  className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:outline-none"
                >
                  <option value="All">Any Attribute...</option>
                  {uniqueMappingAttrs.map((attr) => (
                    <option key={attr} value={attr}>
                      {attr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={mappingValue}
                  onChange={(e) => setMappingValue(e.target.value)}
                  placeholder="Value (e.g. Disabled, E5, 514, Removed)"
                  className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 font-mono text-xs text-[#0F172A] placeholder:text-slate-400 focus:border-[#0EA5E9] focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:col-span-4">
                {suggestedMappingValues.slice(0, 3).map((val) => {
                  const shortVal = val.length > 20 ? `${val.slice(0, 20)}…` : val;
                  const active = mappingValue.toLowerCase() === val.toLowerCase();
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMappingValue(active ? '' : val)}
                      className={cn(
                        'cursor-pointer rounded-lg border px-2 py-1 font-mono text-[10px] transition-colors',
                        active
                          ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                          : 'border-sky-200 bg-white text-slate-600 hover:border-[#0EA5E9] hover:text-[#0284C7]'
                      )}
                      title={val}
                    >
                      = {shortVal}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Full-Width 5-Column Queue Table + Inspect Action */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">System</th>
                <th className="px-5 py-3.5">Identity</th>
                <th className="px-5 py-3.5">Entitlement / Role</th>
                <th className="px-5 py-3.5">Operation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No provisioning jobs match your filters.{' '}
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="cursor-pointer font-semibold text-[#0284C7] underline"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const isSim = job.status === 'Simulation Mode';
                  const isFailed = job.status === 'Failed';

                  return (
                    <tr
                      key={job.id}
                      onClick={() => setInspectJobId(job.id)}
                      className="cursor-pointer transition-colors hover:bg-slate-50/90"
                    >
                      {/* 1. Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold',
                            isSim
                              ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/70'
                              : isFailed
                                ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/70'
                                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              isSim
                                ? 'bg-violet-500'
                                : isFailed
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                            )}
                          />
                          {job.status}
                        </span>
                      </td>

                      {/* 2. System */}
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#0F172A]">
                        {job.application}
                      </td>

                      {/* 3. Identity */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-[#0F172A]">{job.identity}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {job.identityEmail}
                        </div>
                      </td>

                      {/* 4. Entitlement / Role */}
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {job.entitlementOrRole}
                      </td>

                      {/* 5. Operation */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase',
                            job.operation === 'Create'
                              ? 'bg-emerald-50 text-emerald-700'
                              : job.operation === 'Update'
                                ? 'bg-sky-50 text-[#0284C7]'
                                : 'bg-rose-50 text-rose-600'
                          )}
                        >
                          {job.operation}
                        </span>
                      </td>

                      {/* 6. Clean Actions (Inspect + Inline Release/Retry) */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div
                          className="inline-flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isSim && (
                            <button
                              type="button"
                              onClick={() => releaseSimulatedJob(job.id)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0EA5E9] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#0284C7]"
                            >
                              <Send className="h-3 w-3" />
                              <span>Release</span>
                            </button>
                          )}

                          {isFailed && (
                            <button
                              type="button"
                              onClick={() => retryFailedJob(job.id)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Retry</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setInspectJobId(job.id)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-[#0EA5E9] hover:text-[#0284C7]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radix Slide-Over Inspector Drawer for Deep Attribute & Payload Details */}
      <Dialog.Root
        open={Boolean(inspectedJob)}
        onOpenChange={(open) => {
          if (!open) setInspectJobId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspectedJob && (
              <>
                {/* Drawer Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <span>{inspectedJob.jobCode}</span>
                      <span>·</span>
                      <span>{inspectedJob.operation}</span>
                      <span>·</span>
                      <span>{inspectedJob.application}</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {inspectedJob.entitlementOrRole}
                    </Dialog.Title>
                    <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                      {inspectedJob.identity} ({inspectedJob.identityEmail})
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close inspector"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 text-xs sm:grid-cols-3">
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">Status</div>
                      <div className="mt-1 font-semibold text-[#0F172A]">
                        {inspectedJob.status}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Triggered By
                      </div>
                      <div className="mt-1 font-medium text-slate-700">
                        {inspectedJob.triggeredBy}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Timestamp
                      </div>
                      <div className="mt-1 font-mono text-slate-700">
                        {inspectedJob.timestamp}
                        {inspectedJob.durationMs !== null
                          ? ` (${inspectedJob.durationMs}ms)`
                          : ''}
                      </div>
                    </div>
                  </div>

                  {/* Simulation Mode Approval Gate */}
                  {inspectedJob.status === 'Simulation Mode' && (
                    <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-violet-900">
                        <FlaskConical className="h-4 w-4 text-violet-600" />
                        <span>Simulation Mode — Review Before Target Release</span>
                      </div>
                      <p className="mt-1 text-violet-800/90">
                        Verify the mapped attributes below before committing this{' '}
                        <strong>{inspectedJob.operation}</strong> task to{' '}
                        <strong>{inspectedJob.application}</strong>.
                      </p>
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => releaseSimulatedJob(inspectedJob.id)}
                          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 font-semibold text-white hover:bg-[#0284C7]"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Approve &amp; Release to {inspectedJob.application}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            discardSimulatedJob(inspectedJob.id);
                            setInspectJobId(null);
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3.5 py-2 font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Discard</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Failed Connector Diagnostic */}
                  {inspectedJob.status === 'Failed' && inspectedJob.errorMessage && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                      <div className="flex items-center gap-1.5 font-semibold text-rose-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Connector Error Diagnostic</span>
                      </div>
                      <p className="mt-1.5 font-mono text-[11px]">{inspectedJob.errorMessage}</p>
                      <button
                        type="button"
                        onClick={() => retryFailedJob(inspectedJob.id)}
                        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 font-semibold text-white hover:bg-rose-700"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Retry Provisioning Job</span>
                      </button>
                    </div>
                  )}

                  {/* Completed Confirmation */}
                  {inspectedJob.status === 'Completed' && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs font-medium text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>
                        Committed cleanly to {inspectedJob.application} and sealed in Audit Log.
                      </span>
                    </div>
                  )}

                  {/* Mapped Attributes & Properties Table */}
                  <div>
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Mapped Attributes &amp; Properties ({inspectedJob.mappings.length})
                    </div>
                    <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] text-slate-500 uppercase">
                          <tr>
                            <th className="px-3.5 py-2.5">Attribute</th>
                            <th className="px-3.5 py-2.5">Change (Before → After)</th>
                            <th className="px-3.5 py-2.5">Mapping Rule</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inspectedJob.mappings.map((m, idx) => (
                            <tr key={`${inspectedJob.id}-attr-${m.attribute}-${idx}`}>
                              <td className="px-3.5 py-3 align-top font-mono font-semibold text-[#0F172A]">
                                {m.attribute}
                              </td>
                              <td className="px-3.5 py-3 align-top font-mono text-[11px]">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500 break-all">
                                    {m.before ?? 'null'}
                                  </span>
                                  <ArrowRight className="h-3 w-3 shrink-0 text-[#0EA5E9]" />
                                  <span className="rounded bg-sky-50 px-1.5 py-0.5 font-semibold text-[#0369A1] break-all">
                                    {m.after ?? 'null'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3.5 py-3 align-top font-mono text-[10px] text-slate-500">
                                {m.rule}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Outgoing JSON Payload */}
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      <Code2 className="h-3.5 w-3.5 text-[#0284C7]" />
                      <span>Outgoing Connector Payload</span>
                    </div>
                    <pre className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-[#0F172A] p-4 font-mono text-[11px] leading-relaxed text-sky-100">
                      <code>{payloadPreview}</code>
                    </pre>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
