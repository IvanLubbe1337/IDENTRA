import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DownloadCloud,
  Eye,
  Play,
  RefreshCw,
  X,
  XCircle,
} from 'lucide-react';
import type { DemoImportRun, ImportStatus } from '@/data/demoSampleData';
import { Dialog } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

export function ImportsView() {
  const importRuns = useDemoStore((s) => s.importRuns);
  const globalSearch = useDemoStore((s) => s.searchQuery);
  const triggerManualImport = useDemoStore((s) => s.triggerManualImport);
  const retryFailedImport = useDemoStore((s) => s.retryFailedImport);

  const [statusFilter, setStatusFilter] = useState<'All' | ImportStatus>('All');
  const [systemFilter, setSystemFilter] = useState<string>('All');
  const [inspectId, setInspectId] = useState<string | null>(null);

  const filteredRuns = useMemo(() => {
    const needle = globalSearch.trim().toLowerCase();
    return importRuns.filter((run) => {
      if (statusFilter !== 'All' && run.status !== statusFilter) return false;
      if (systemFilter !== 'All' && run.system !== systemFilter) return false;
      if (needle) {
        const hay = `${run.runCode} ${run.system} ${run.connector} ${run.mode} ${run.status} ${run.errorCode ?? ''} ${run.errorMessage ?? ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [importRuns, statusFilter, systemFilter, globalSearch]);

  const inspectedRun: DemoImportRun | null =
    importRuns.find((r) => r.id === inspectId) ?? null;

  const counts = useMemo(
    () => ({
      all: importRuns.length,
      completed: importRuns.filter((r) => r.status === 'Completed').length,
      failed: importRuns.filter((r) => r.status === 'Failed').length,
      warning: importRuns.filter((r) => r.status === 'Completed with Warnings').length,
    }),
    [importRuns]
  );

  return (
    <div className="space-y-5">
      {/* Header + Quick Manual Import Triggers */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            System Imports
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Track scheduled and manual data imports from HR, Active Directory, and Microsoft Entra ID—inspect run durations, record deltas, and failure diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            ['Workday HRIS (HR)', 'Active Directory', 'Microsoft Entra ID'] as const
          ).map((sys) => (
            <button
              key={sys}
              type="button"
              onClick={() => triggerManualImport(sys)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-[#0EA5E9] hover:bg-sky-50 hover:text-[#0284C7]"
            >
              <Play className="h-3 w-3 fill-current text-[#0EA5E9]" />
              <span>Run {sys === 'Workday HRIS (HR)' ? 'HR' : sys === 'Microsoft Entra ID' ? 'Entra ID' : 'AD'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'All', label: 'All Imports', count: counts.all },
              { id: 'Failed', label: 'Failed', count: counts.failed },
              { id: 'Completed', label: 'Completed', count: counts.completed },
              { id: 'Completed with Warnings', label: 'Warnings', count: counts.warning },
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

        <select
          aria-label="Filter imports by system"
          value={systemFilter}
          onChange={(e) => setSystemFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
        >
          <option value="All">System: All Sources</option>
          <option value="Workday HRIS (HR)">Workday HRIS (HR)</option>
          <option value="Active Directory">Active Directory</option>
          <option value="Microsoft Entra ID">Microsoft Entra ID</option>
        </select>
      </div>

      {/* Clean Full-Width Imports Table — fits cleanly without horizontal scrolling */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full table-fixed text-left text-xs">
          <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="w-[14%] px-4 py-3.5">Status</th>
              <th className="w-[31%] px-3 py-3.5">Source System</th>
              <th className="w-[14%] px-3 py-3.5">Start Time</th>
              <th className="w-[14%] px-3 py-3.5">End Time</th>
              <th className="w-[11%] px-3 py-3.5">Duration</th>
              <th className="w-[16%] px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRuns.map((run) => {
              const isFailed = run.status === 'Failed';
              const isWarning = run.status === 'Completed with Warnings';
              const [startDate, startClock] = run.triggeredAt.split(' ');
              const [endDate, endClock] = run.completedAt.split(' ');

              return (
                <tr
                  key={run.id}
                  onClick={() => setInspectId(run.id)}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-slate-50/90',
                    isFailed && 'bg-rose-50/25 hover:bg-rose-50/45'
                  )}
                >
                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      title={run.status}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold',
                        isFailed
                          ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                          : isWarning
                            ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
                            : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 shrink-0 rounded-full',
                          isFailed
                            ? 'bg-rose-500'
                            : isWarning
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        )}
                      />
                      <span className="truncate">
                        {isWarning ? 'Warning' : run.status}
                      </span>
                    </span>
                  </td>

                  {/* Source System + Compact Delta / Error Summary */}
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-[#0F172A]">
                        {run.system}
                      </span>
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                        {run.runCode}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-slate-500">
                      {isFailed ? (
                        <span className="font-mono text-[10px] font-semibold text-rose-600">
                          {run.mode} · {run.errorCode ?? 'Import Failed'}
                        </span>
                      ) : (
                        <span>
                          {run.mode} · {run.recordsRead.toLocaleString()} read (+{run.created} / ~{run.updated})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Start Time */}
                  <td className="px-3 py-3.5 font-mono">
                    <div className="text-[11px] font-semibold text-[#0F172A]">
                      {startClock ?? run.triggeredAt}
                    </div>
                    <div className="text-[10px] text-slate-400">{startDate}</div>
                  </td>

                  {/* End Time */}
                  <td className="px-3 py-3.5 font-mono">
                    <div className="text-[11px] font-semibold text-[#0F172A]">
                      {endClock ?? run.completedAt}
                    </div>
                    <div className="text-[10px] text-slate-400">{endDate}</div>
                  </td>

                  {/* Duration */}
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                      <Clock className="h-3 w-3 shrink-0 text-slate-400" />
                      <span>{run.duration}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div
                      className="inline-flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isFailed && (
                        <button
                          type="button"
                          onClick={() => retryFailedImport(run.id)}
                          title="Retry failed import"
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-600 px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Retry</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setInspectId(run.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
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

      {/* Radix Slide-Over Import Run Inspector Drawer */}
      <Dialog.Root
        open={Boolean(inspectedRun)}
        onOpenChange={(open) => {
          if (!open) setInspectId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspectedRun && (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                      <DownloadCloud className="h-3.5 w-3.5" />
                      <span>{inspectedRun.runCode}</span>
                      <span>·</span>
                      <span>{inspectedRun.mode}</span>
                    </div>
                    <Dialog.Title className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {inspectedRun.system}
                    </Dialog.Title>
                    <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                      Connector: {inspectedRun.connector}
                    </Dialog.Description>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close import inspector"
                      className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                  {/* Timing & Status Summary */}
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 text-xs sm:grid-cols-3">
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Triggered At
                      </div>
                      <div className="mt-1 font-mono font-semibold text-[#0F172A]">
                        {inspectedRun.triggeredAt}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Completed At
                      </div>
                      <div className="mt-1 font-mono font-semibold text-[#0F172A]">
                        {inspectedRun.completedAt}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase">
                        Total Duration
                      </div>
                      <div className="mt-1 font-mono font-bold text-[#0284C7]">
                        {inspectedRun.duration}
                      </div>
                    </div>
                  </div>

                  {/* Error Details Card (when Failed) */}
                  {inspectedRun.status === 'Failed' && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs">
                      <div className="flex items-center gap-2 font-bold text-rose-800">
                        <XCircle className="h-4 w-4 text-rose-600" />
                        <span>{inspectedRun.errorCode}</span>
                      </div>
                      <p className="mt-2 leading-relaxed text-rose-900">
                        {inspectedRun.errorMessage}
                      </p>
                      {inspectedRun.errorEndpoint && (
                        <div className="mt-2.5 rounded-xl bg-rose-950/90 p-3 font-mono text-[10px] text-rose-100 break-all">
                          {inspectedRun.errorEndpoint}
                        </div>
                      )}
                      {inspectedRun.recommendedFix && (
                        <div className="mt-3 rounded-xl border border-rose-200 bg-white px-3 py-2 text-[11px] text-slate-700">
                          <strong className="text-slate-900">Recommended Action:</strong>{' '}
                          {inspectedRun.recommendedFix}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => retryFailedImport(inspectedRun.id)}
                        className="mt-3.5 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Rotate Secret &amp; Retry Import</span>
                      </button>
                    </div>
                  )}

                  {/* Warning Callout */}
                  {inspectedRun.status === 'Completed with Warnings' &&
                    inspectedRun.recommendedFix && (
                      <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <div>
                          <div className="font-bold">Import Completed with Warnings</div>
                          <p className="mt-1">{inspectedRun.recommendedFix}</p>
                        </div>
                      </div>
                    )}

                  {/* Record Counters */}
                  <div className="grid grid-cols-4 gap-2.5 text-center">
                    {[
                      { label: 'Records Read', val: inspectedRun.recordsRead.toLocaleString(), cls: 'text-[#0F172A]' },
                      { label: 'Created', val: `+${inspectedRun.created}`, cls: 'text-emerald-700' },
                      { label: 'Updated', val: String(inspectedRun.updated), cls: 'text-[#0284C7]' },
                      { label: 'Errors', val: String(inspectedRun.errors), cls: inspectedRun.errors > 0 ? 'text-rose-600' : 'text-slate-500' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <div className={cn('font-display text-lg font-extrabold', stat.cls)}>
                          {stat.val}
                        </div>
                        <div className="font-mono text-[9px] text-slate-400 uppercase">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pipeline Stage Breakdown */}
                  <div>
                    <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Import Pipeline Execution Stages
                    </div>
                    <div className="mt-2.5 space-y-2.5">
                      {inspectedRun.stages.map((st) => (
                        <div
                          key={st.stage}
                          className={cn(
                            'rounded-xl border p-3.5 text-xs',
                            st.status === 'Failed'
                              ? 'border-rose-200 bg-rose-50/40'
                              : st.status === 'Warning'
                                ? 'border-amber-200 bg-amber-50/40'
                                : 'border-slate-200/80 bg-[#FBFDFF]'
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F172A]">
                              {st.status === 'Failed' ? (
                                <XCircle className="h-3.5 w-3.5 text-rose-500" />
                              ) : st.status === 'Warning' ? (
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              )}
                              {st.stage}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {st.duration}
                            </span>
                          </div>
                          <p className="mt-1 text-slate-600">{st.detail}</p>
                        </div>
                      ))}
                    </div>
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
