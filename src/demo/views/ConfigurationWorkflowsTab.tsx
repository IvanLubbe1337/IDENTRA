import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Link2,
  Pause,
  Play,
  Plus,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import type {
  CustomWorkflowStage,
  CustomWorkflowTrigger,
  DemoCustomWorkflow,
} from '@/data/demoSampleData';
import { Dialog } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const TRIGGER_OPTIONS: CustomWorkflowTrigger[] = [
  'On Create',
  'On Attribute Change',
  'On Reference Change',
  'On Access Request',
  'On Expiry Approaching',
  'Scheduled Daily',
];

const STAGE_KINDS: CustomWorkflowStage['stageKind'][] = [
  'Approval',
  'Notification',
  'Provisioning Action',
  'Governance Check',
];

export function ConfigurationWorkflowsTab() {
  const schemaObjects = useDemoStore((s) => s.schemaObjects);
  const customWorkflows = useDemoStore((s) => s.customWorkflows);
  const people = useDemoStore((s) => s.people);
  const createCustomWorkflow = useDemoStore((s) => s.createCustomWorkflow);
  const toggleCustomWorkflowStatus = useDemoStore((s) => s.toggleCustomWorkflowStatus);
  const deleteCustomWorkflow = useDemoStore((s) => s.deleteCustomWorkflow);
  const simulateCustomWorkflow = useDemoStore((s) => s.simulateCustomWorkflow);

  const [builderOpen, setBuilderOpen] = useState(false);
  const [simPersonId, setSimPersonId] = useState<string>(people[0]?.id ?? 'p-sarah');
  const [activeSimResult, setActiveSimResult] = useState<{
    workflowCode: string;
    workflowName: string;
    subjectName: string;
    resolvedStages: {
      stepOrder: number;
      stageName: string;
      stageKind: string;
      refPath: string;
      resolvedIdentity: string;
      slaHours: number;
    }[];
  } | null>(null);

  // Dynamically discover ALL "Reference (Identity)" properties across existing & newly created objects!
  const identityReferenceOptions = useMemo(() => {
    const opts: {
      path: string;
      label: string;
      objectName: string;
      fallback: string;
    }[] = [];

    schemaObjects.forEach((obj) => {
      obj.properties
        .filter((p) => p.type === 'Reference (Identity)')
        .forEach((p) => {
          opts.push({
            path: `${obj.apiName}.${p.key}`,
            label: `${obj.name} → ${p.label}`,
            objectName: obj.name,
            fallback: p.defaultSampleValue || 'Claire Vance',
          });
        });
    });
    return opts;
  }, [schemaObjects]);

  // Builder state
  const [wfName, setWfName] = useState('');
  const [wfDesc, setWfDesc] = useState('');
  const [wfSourceObjId, setWfSourceObjId] = useState<string>(
    schemaObjects[0]?.id ?? 'obj-identity'
  );
  const [wfTrigger, setWfTrigger] = useState<CustomWorkflowTrigger>('On Create');
  const [condPropKey, setCondPropKey] = useState<string>('type');
  const [condOp, setCondOp] = useState<
    'equals' | 'not_equals' | 'contains' | 'changed' | 'is_not_empty'
  >('equals');
  const [condValue, setCondValue] = useState<string>('Contractor');

  const [draftStages, setDraftStages] = useState<
    {
      id: string;
      name: string;
      stageKind: CustomWorkflowStage['stageKind'];
      referenceObjectPath: string;
      slaHours: number;
      escalateToReferencePath: string;
    }[]
  >([
    {
      id: 'ds-1',
      name: 'Manager / Sponsor Reference Approval',
      stageKind: 'Approval',
      referenceObjectPath: 'identity.manager',
      slaHours: 24,
      escalateToReferencePath: 'department.departmentHead',
    },
  ]);

  const selectedSourceObject =
    schemaObjects.find((o) => o.id === wfSourceObjId) ?? schemaObjects[0];

  const handleAddDraftStage = () => {
    const defaultRef =
      identityReferenceOptions[draftStages.length % Math.max(1, identityReferenceOptions.length)] ??
      identityReferenceOptions[0];
    setDraftStages((prev) => [
      ...prev,
      {
        id: `ds-${Date.now()}`,
        name: `Stage ${prev.length + 1} Reference Review`,
        stageKind: 'Approval',
        referenceObjectPath: defaultRef?.path ?? 'identity.manager',
        slaHours: 48,
        escalateToReferencePath: '',
      },
    ]);
  };

  const handleCreateWorkflow = () => {
    if (!wfName.trim() || draftStages.length === 0) return;

    const stages: CustomWorkflowStage[] = draftStages.map((st, idx) => {
      const refMeta = identityReferenceOptions.find(
        (o) => o.path === st.referenceObjectPath
      );
      return {
        id: `stg-${Date.now()}-${idx}`,
        stepOrder: idx + 1,
        name: st.name.trim() || `Stage ${idx + 1}`,
        stageKind: st.stageKind,
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: st.referenceObjectPath,
        referenceLabel: refMeta?.label ?? st.referenceObjectPath,
        fallbackIdentityName: refMeta?.fallback ?? 'Claire Vance',
        slaHours: st.slaHours,
        escalateToReferencePath: st.escalateToReferencePath || undefined,
      };
    });

    createCustomWorkflow({
      name: wfName.trim(),
      description:
        wfDesc.trim() ||
        `Custom workflow triggered on ${selectedSourceObject?.name ?? 'Object'} (${wfTrigger}) resolving Identity reference objects.`,
      status: 'Active',
      sourceObjectId: wfSourceObjId,
      triggerEvent: wfTrigger,
      conditions: condPropKey
        ? [
            {
              id: `cond-${Date.now()}`,
              propertyKey: condPropKey,
              operator: condOp,
              value: condValue || '*',
            },
          ]
        : [],
      stages,
    });

    setWfName('');
    setWfDesc('');
    setDraftStages([
      {
        id: 'ds-1',
        name: 'Manager / Sponsor Reference Approval',
        stageKind: 'Approval',
        referenceObjectPath: 'identity.manager',
        slaHours: 24,
        escalateToReferencePath: 'department.departmentHead',
      },
    ]);
    setBuilderOpen(false);
  };

  const runSimulation = (wf: DemoCustomWorkflow) => {
    const person = people.find((p) => p.id === simPersonId) ?? people[0];
    if (!person) return;

    simulateCustomWorkflow(wf.id, person.id);

    const resolvedStages = wf.stages.map((st) => {
      let resolvedIdentity = st.fallbackIdentityName;
      if (st.referenceObjectPath === 'identity.manager') {
        resolvedIdentity = `${person.manager} (Resolved from ${person.name}.manager)`;
      } else if (st.referenceObjectPath === 'department.departmentHead') {
        resolvedIdentity =
          person.department.includes('Finance')
            ? 'David Chen (Resolved from Department Head)'
            : person.department.includes('Data')
              ? 'Hannah Lindqvist (Resolved from Department Head)'
              : 'Alex Carter (Resolved from Department Head)';
      } else if (st.referenceObjectPath === 'department.budgetApprover') {
        resolvedIdentity = `Claire Vance (Resolved from ${person.costCenterCode}.budgetApprover)`;
      } else {
        resolvedIdentity = `${st.fallbackIdentityName} (Resolved via ${st.referenceObjectPath})`;
      }

      return {
        stepOrder: st.stepOrder,
        stageName: st.name,
        stageKind: st.stageKind,
        refPath: st.referenceObjectPath,
        resolvedIdentity,
        slaHours: st.slaHours,
      };
    });

    setActiveSimResult({
      workflowCode: wf.code,
      workflowName: wf.name,
      subjectName: `${person.name} (${person.employeeNumber})`,
      resolvedStages,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header / Simulator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
        <div>
          <h2 className="font-heading text-base font-bold text-[#0F172A]">
            Custom Reference-Object Workflows
          </h2>
          <p className="text-xs text-slate-500">
            Build custom multi-step workflows bound to any Core or Custom Object that dynamically resolve{' '}
            <strong className="text-slate-700">Identity Reference properties</strong> (e.g., Manager, Application Owner, Department Head, or custom Identity references).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs">
            <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
              Simulate For:
            </span>
            <select
              value={simPersonId}
              onChange={(e) => setSimPersonId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#0F172A] focus:outline-none"
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.employeeNumber})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setBuilderOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Custom Workflow</span>
          </button>
        </div>
      </div>

      {/* Live Reference Resolution Simulation Result */}
      {activeSimResult && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Live Reference Resolution Trace · {activeSimResult.workflowCode}</span>
              </div>
              <div className="mt-1 font-heading text-sm font-bold text-[#0F172A]">
                {activeSimResult.workflowName} — Subject: {activeSimResult.subjectName}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveSimResult(null)}
              className="cursor-pointer rounded-lg border border-sky-200 bg-white p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
            {activeSimResult.resolvedStages.map((st) => (
              <div
                key={st.stepOrder}
                className="rounded-xl border border-sky-200/80 bg-white p-3.5 text-xs"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-[#0284C7]">STEP {st.stepOrder}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                    {st.stageKind} · SLA {st.slaHours}h
                  </span>
                </div>
                <div className="mt-1 font-semibold text-[#0F172A]">{st.stageName}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-sky-50 px-1.5 py-0.5 font-mono text-[10px] text-[#0284C7]">
                  <Link2 className="h-2.5 w-2.5" />
                  <span>{st.refPath}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <UserCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>{st.resolvedIdentity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Workflows Grid */}
      <div className="grid grid-cols-1 gap-4">
        {customWorkflows.map((wf) => {
          const srcObj = schemaObjects.find((o) => o.id === wf.sourceObjectId);
          return (
            <div
              key={wf.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-sky-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                      {wf.code}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                        wf.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      )}
                    >
                      {wf.status}
                    </span>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                      Object: {srcObj?.name ?? wf.sourceObjectId}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                      Trigger: {wf.triggerEvent}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-heading text-base font-bold text-[#0F172A]">
                    {wf.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-600">{wf.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => runSimulation(wf)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0F172A] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0EA5E9]"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Simulate Resolution</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCustomWorkflowStatus(wf.id)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-slate-300"
                  >
                    {wf.status === 'Active' ? (
                      <>
                        <Pause className="h-3 w-3" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCustomWorkflow(wf.id)}
                    title="Delete custom workflow"
                    className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Condition Pills */}
              {wf.conditions.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                    Condition:
                  </span>
                  {wf.conditions.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2 py-0.5 font-mono text-[10px] text-slate-700"
                    >
                      {c.propertyKey} <strong className="text-[#0284C7]">{c.operator}</strong>{' '}
                      {c.value}
                    </span>
                  ))}
                </div>
              )}

              {/* Visual Reference Resolution Pipeline */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {wf.stages.map((st, idx) => (
                  <div key={st.id} className="flex items-center gap-2">
                    <div className="rounded-xl border border-slate-200/90 bg-[#FBFDFF] px-3.5 py-2.5 text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="font-bold text-[#0284C7]">Step {st.stepOrder}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-semibold text-slate-600">{st.stageKind}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400">SLA {st.slaHours}h</span>
                      </div>
                      <div className="mt-0.5 font-semibold text-[#0F172A]">{st.name}</div>
                      <div className="mt-1 inline-flex items-center gap-1 rounded bg-sky-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                        <Link2 className="h-2.5 w-2.5" />
                        <span>{st.referenceObjectPath}</span>
                      </div>
                      {st.escalateToReferencePath && (
                        <div className="mt-1 font-mono text-[9px] text-amber-700">
                          Escalates → {st.escalateToReferencePath}
                        </div>
                      )}
                    </div>
                    {idx < wf.stages.length - 1 && (
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 font-mono text-[10px] text-slate-400">
                <span>Created {wf.createdAt}</span>
                <span>
                  {wf.lastSimulatedAt
                    ? `Last simulated: ${wf.lastSimulatedAt}`
                    : 'Ready to simulate against live directory identities'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Custom Reference-Object Workflow */}
      <Dialog.Root open={builderOpen} onOpenChange={setBuilderOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>Custom Workflow Builder</span>
                  </div>
                  <Dialog.Title className="mt-0.5 font-display text-lg font-extrabold text-[#0F172A]">
                    Create Reference-Object Workflow
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500">
                    Bind a workflow to any Core or Custom Object and route approvals or actions dynamically via Identity Reference properties.
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

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Workflow Name *
                    </label>
                    <input
                      type="text"
                      value={wfName}
                      onChange={(e) => setWfName(e.target.value)}
                      placeholder="e.g. Vendor Contract Owner Approval"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Trigger Event
                    </label>
                    <select
                      value={wfTrigger}
                      onChange={(e) =>
                        setWfTrigger(e.target.value as CustomWorkflowTrigger)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                    >
                      {TRIGGER_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Source Object
                  </label>
                  <select
                    value={wfSourceObjId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setWfSourceObjId(nextId);
                      const nextObj = schemaObjects.find((o) => o.id === nextId);
                      if (nextObj?.properties[0]) {
                        setCondPropKey(nextObj.properties[0].key);
                      }
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A]"
                  >
                    {schemaObjects.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.apiName} · {o.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
                  <div className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    Entry Condition (Optional)
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <select
                      value={condPropKey}
                      onChange={(e) => setCondPropKey(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-[#0F172A]"
                    >
                      {(selectedSourceObject?.properties ?? []).map((p) => (
                        <option key={p.id} value={p.key}>
                          {p.label} ({p.key})
                        </option>
                      ))}
                    </select>
                    <select
                      value={condOp}
                      onChange={(e) =>
                        setCondOp(
                          e.target.value as
                            | 'equals'
                            | 'not_equals'
                            | 'contains'
                            | 'changed'
                            | 'is_not_empty'
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-[#0F172A]"
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not_equals</option>
                      <option value="contains">contains</option>
                      <option value="changed">changed</option>
                      <option value="is_not_empty">is_not_empty</option>
                    </select>
                    <input
                      type="text"
                      value={condValue}
                      onChange={(e) => setCondValue(e.target.value)}
                      placeholder="Value (e.g. Contractor)"
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Ordered Stages Resolving Identity Reference Objects */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                      Workflow Stages (Resolve Identity Reference Objects)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddDraftStage}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#0284C7] hover:bg-sky-100"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Stage</span>
                    </button>
                  </div>

                  {draftStages.map((st, idx) => (
                    <div
                      key={st.id}
                      className="space-y-2 rounded-xl border border-slate-200 bg-white p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                          Step {idx + 1}
                        </span>
                        {draftStages.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setDraftStages((prev) =>
                                prev.filter((item) => item.id !== st.id)
                              )
                            }
                            className="cursor-pointer text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) =>
                            setDraftStages((prev) =>
                              prev.map((item) =>
                                item.id === st.id
                                  ? { ...item, name: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Stage title"
                          className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-[#0F172A] sm:col-span-2"
                        />
                        <select
                          value={st.stageKind}
                          onChange={(e) =>
                            setDraftStages((prev) =>
                              prev.map((item) =>
                                item.id === st.id
                                  ? {
                                      ...item,
                                      stageKind: e.target
                                        .value as CustomWorkflowStage['stageKind'],
                                    }
                                  : item
                              )
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2 py-1.5 text-xs text-[#0F172A]"
                        >
                          {STAGE_KINDS.map((sk) => (
                            <option key={sk} value={sk}>
                              {sk}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                        <div className="sm:col-span-6">
                          <label className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                            Resolve Identity Reference Property
                          </label>
                          <select
                            value={st.referenceObjectPath}
                            onChange={(e) =>
                              setDraftStages((prev) =>
                                prev.map((item) =>
                                  item.id === st.id
                                    ? { ...item, referenceObjectPath: e.target.value }
                                    : item
                                )
                              )
                            }
                            className="mt-0.5 w-full rounded-lg border border-sky-200 bg-sky-50/50 px-2 py-1.5 font-mono text-[11px] font-semibold text-[#0284C7]"
                          >
                            {identityReferenceOptions.map((opt) => (
                              <option key={opt.path} value={opt.path}>
                                {opt.label} ({opt.path})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                            Escalate Reference (Optional)
                          </label>
                          <select
                            value={st.escalateToReferencePath}
                            onChange={(e) =>
                              setDraftStages((prev) =>
                                prev.map((item) =>
                                  item.id === st.id
                                    ? {
                                        ...item,
                                        escalateToReferencePath: e.target.value,
                                      }
                                    : item
                                )
                              )
                            }
                            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-2 py-1.5 font-mono text-[10px] text-slate-700"
                          >
                            <option value="">None</option>
                            {identityReferenceOptions.map((opt) => (
                              <option key={opt.path} value={opt.path}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                            SLA (Hrs)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={st.slaHours}
                            onChange={(e) =>
                              setDraftStages((prev) =>
                                prev.map((item) =>
                                  item.id === st.id
                                    ? { ...item, slaHours: Number(e.target.value) || 24 }
                                    : item
                                )
                              )
                            }
                            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-2 py-1.5 font-mono text-xs text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={wfDesc}
                    onChange={(e) => setWfDesc(e.target.value)}
                    placeholder="Describe the governance purpose of this workflow..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="cursor-pointer rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleCreateWorkflow}
                  disabled={!wfName.trim()}
                  className="cursor-pointer rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save &amp; Activate Workflow
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
