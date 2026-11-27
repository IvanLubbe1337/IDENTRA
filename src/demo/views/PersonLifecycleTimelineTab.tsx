import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpDown,
  Briefcase,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import {
  buildIdentityLifecycleTimeline,
  reconstructAccessLineage,
  type DemoPerson,
  type LifecycleTimelineEventKind,
} from '@/data/demoSampleData';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const EVENT_FILTERS: ('All' | LifecycleTimelineEventKind)[] = [
  'All',
  'Employment Change',
  'Account Creation',
  'Access Grant',
  'Approval',
  'Manager Change',
  'Transfer',
  'Termination',
  'Exception',
];

function eventVisual(kind: LifecycleTimelineEventKind): {
  icon: typeof Briefcase;
  dotClass: string;
  badgeClass: string;
} {
  switch (kind) {
    case 'Employment Change':
      return {
        icon: Briefcase,
        dotClass: 'bg-sky-100 text-[#0284C7] ring-sky-200',
        badgeClass: 'bg-sky-50 text-[#0284C7]',
      };
    case 'Account Creation':
      return {
        icon: UserPlus,
        dotClass: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
        badgeClass: 'bg-indigo-50 text-indigo-700',
      };
    case 'Access Grant':
      return {
        icon: KeyRound,
        dotClass: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
        badgeClass: 'bg-emerald-50 text-emerald-700',
      };
    case 'Approval':
      return {
        icon: ShieldCheck,
        dotClass: 'bg-teal-100 text-teal-700 ring-teal-200',
        badgeClass: 'bg-teal-50 text-teal-700',
      };
    case 'Manager Change':
      return {
        icon: UserCheck,
        dotClass: 'bg-violet-100 text-violet-700 ring-violet-200',
        badgeClass: 'bg-violet-50 text-violet-700',
      };
    case 'Transfer':
      return {
        icon: ArrowLeftRight,
        dotClass: 'bg-blue-100 text-blue-700 ring-blue-200',
        badgeClass: 'bg-blue-50 text-blue-700',
      };
    case 'Termination':
      return {
        icon: UserMinus,
        dotClass: 'bg-rose-100 text-rose-700 ring-rose-200',
        badgeClass: 'bg-rose-50 text-rose-700',
      };
    case 'Exception':
      return {
        icon: ShieldAlert,
        dotClass: 'bg-amber-100 text-amber-800 ring-amber-200',
        badgeClass: 'bg-amber-50 text-amber-800',
      };
  }
}

export function PersonLifecycleTimelineTab({ person }: { person: DemoPerson }) {
  const accessRequests = useDemoStore((s) => s.accessRequests);
  const reviews = useDemoStore((s) => s.reviews);

  const [kindFilter, setKindFilter] = useState<'All' | LifecycleTimelineEventKind>('All');
  const [artifactFilter, setArtifactFilter] = useState<string | null>(null);
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest');

  const fullTimeline = useMemo(
    () => buildIdentityLifecycleTimeline(person, accessRequests, reviews),
    [person, accessRequests, reviews]
  );

  const accessOrigins = useMemo(
    () => reconstructAccessLineage(person, fullTimeline),
    [person, fullTimeline]
  );

  const displayedEvents = useMemo(() => {
    const filtered = fullTimeline.filter((ev) => {
      if (kindFilter !== 'All' && ev.kind !== kindFilter) return false;
      if (artifactFilter) {
        const hay = `${ev.accessArtifact ?? ''} ${ev.title} ${ev.detail}`.toLowerCase();
        if (!hay.includes(artifactFilter.toLowerCase())) return false;
      }
      return true;
    });
    return order === 'oldest' ? [...filtered].reverse() : filtered;
  }, [fullTimeline, kindFilter, artifactFilter, order]);

  return (
    <div className="space-y-5">
      {/* Access Reconstruction Card: "Why Does This Identity Have Access Today?" */}
      <div className="rounded-2xl border border-sky-200/80 bg-[#F8FBFF] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-mono text-[10px] font-bold tracking-wider text-[#0284C7] uppercase">
              Access Lineage Reconstruction · Why {person.firstName} Has Access Today
            </div>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Click any active role below to isolate its exact grant, approval, transfer, or exception history on the timeline.
            </p>
          </div>
          {artifactFilter && (
            <button
              type="button"
              onClick={() => setArtifactFilter(null)}
              className="cursor-pointer rounded-lg border border-sky-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-[#0284C7] hover:bg-sky-50"
            >
              Clear Filter
            </button>
          )}
        </div>

        {accessOrigins.length === 0 ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500">
            Zero active roles held today ({person.jmlStatus}). Inspect timeline below for termination &amp; revocation history.
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {accessOrigins.map((item) => {
              const selected = artifactFilter === item.artifact;
              return (
                <button
                  key={item.artifact}
                  type="button"
                  onClick={() =>
                    setArtifactFilter(selected ? null : item.artifact)
                  }
                  className={cn(
                    'block w-full cursor-pointer rounded-xl border p-3 text-left text-xs transition-all',
                    selected
                      ? 'border-[#0EA5E9] bg-white ring-1 ring-sky-200'
                      : item.riskNote
                        ? 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
                        : 'border-slate-200/80 bg-white hover:border-sky-200'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-heading font-bold text-[#0F172A]">
                        {item.artifact}
                      </span>
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#0284C7]">
                        {item.originType}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-600">
                        {item.referenceCode}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      Since {item.grantedOn}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600">
                    {item.whyStillHeldToday}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-slate-400">
                    <span>Approved / Triggered by: {item.approvedOrTriggeredBy}</span>
                    {item.riskNote && (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                        <AlertTriangle className="h-3 w-3" />
                        {item.riskNote}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Pills + Order Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {EVENT_FILTERS.map((kind) => {
            const count =
              kind === 'All'
                ? fullTimeline.length
                : fullTimeline.filter((e) => e.kind === kind).length;
            if (kind !== 'All' && count === 0) return null;
            const active = kindFilter === kind;
            return (
              <button
                key={kind}
                type="button"
                onClick={() => setKindFilter(kind)}
                className={cn(
                  'cursor-pointer rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors',
                  active
                    ? 'border-[#0EA5E9] bg-sky-50 text-[#0284C7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {kind} ({count})
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-600 hover:border-[#0EA5E9] hover:text-[#0284C7]"
        >
          <ArrowUpDown className="h-3 w-3" />
          <span>{order === 'newest' ? 'Newest First' : 'Origin → Today'}</span>
        </button>
      </div>

      {/* Vertical Lifecycle Timeline Rail */}
      <div className="relative space-y-3 pl-5 before:absolute before:top-3 before:bottom-3 before:left-[15px] before:w-px before:bg-slate-200">
        {displayedEvents.map((ev) => {
          const vis = eventVisual(ev.kind);
          const Icon = vis.icon;
          return (
            <div key={ev.id} className="relative pl-5">
              <span
                className={cn(
                  'absolute top-3 -left-[20px] flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white',
                  vis.dotClass
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>

              <div className="rounded-2xl border border-slate-200 bg-[#FBFDFF] p-3.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
                        vis.badgeClass
                      )}
                    >
                      {ev.kind}
                    </span>
                    {ev.referenceCode && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-600">
                        {ev.referenceCode}
                      </span>
                    )}
                    {ev.stillActiveToday && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Active Today
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    {ev.timestamp}
                  </span>
                </div>

                <div className="mt-1.5 font-heading font-bold text-[#0F172A]">
                  {ev.title}
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                  {ev.detail}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-400">
                  <span>Actor: {ev.actor}</span>
                  <span>·</span>
                  <span>System: {ev.system}</span>
                </div>

                {ev.changes && ev.changes.length > 0 && (
                  <div className="mt-2.5 space-y-1 rounded-xl border border-slate-100 bg-white p-2.5 font-mono text-[10px]">
                    {ev.changes.map((c, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-600">{c.field}:</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500 line-through">
                          {c.before ?? '∅'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">
                          {c.after ?? '∅'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
