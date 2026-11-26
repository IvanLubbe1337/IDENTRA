import { useState } from 'react';
import {
  ArrowUpRight,
  Box,
  Database,
  EyeOff,
  KeyRound,
  Link2,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import {
  maskSensitiveValue,
  type DemoSchemaObject,
  type SchemaPropertyType,
  type SensitiveMaskPattern,
} from '@/data/demoSampleData';
import { Dialog, Switch } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const PROPERTY_TYPES: SchemaPropertyType[] = [
  'String',
  'Integer',
  'Boolean',
  'Date',
  'Email',
  'Enum',
  'Reference (Identity)',
  'Reference (Object)',
  'Multi-Value String',
  'Encrypted Secret',
];

const MASK_PATTERNS: SensitiveMaskPattern[] = [
  'Full Mask (••••••••)',
  'Show Last 4 (••••1234)',
  'Partial Email (s***@domain)',
];

export function ConfigurationSchemaTab() {
  const schemaObjects = useDemoStore((s) => s.schemaObjects);
  const createSchemaObject = useDemoStore((s) => s.createSchemaObject);
  const addSchemaProperty = useDemoStore((s) => s.addSchemaProperty);
  const updateSchemaProperty = useDemoStore((s) => s.updateSchemaProperty);
  const deleteSchemaProperty = useDemoStore((s) => s.deleteSchemaProperty);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [selectedObjectId, setSelectedObjectId] = useState<string>(
    schemaObjects[0]?.id ?? 'obj-identity'
  );
  const [newObjDialogOpen, setNewObjDialogOpen] = useState(false);
  const [newPropDialogOpen, setNewPropDialogOpen] = useState(false);

  // Create New Object Form State
  const [objName, setObjName] = useState('');
  const [objApiName, setObjApiName] = useState('');
  const [objCategory, setObjCategory] =
    useState<DemoSchemaObject['category']>('Custom Object');
  const [objDesc, setObjDesc] = useState('');

  // Add Property Form State
  const [propLabel, setPropLabel] = useState('');
  const [propKey, setPropKey] = useState('');
  const [propType, setPropType] = useState<SchemaPropertyType>('String');
  const [propRefTarget, setPropRefTarget] = useState<string>('obj-identity');
  const [propRequired, setPropRequired] = useState(false);
  const [propUnique, setPropUnique] = useState(false);
  const [propSensitive, setPropSensitive] = useState(false);
  const [propMaskPattern, setPropMaskPattern] = useState<SensitiveMaskPattern>(
    'Show Last 4 (••••1234)'
  );
  const [propSample, setPropSample] = useState('');
  const [propDesc, setPropDesc] = useState('');

  const selectedObj =
    schemaObjects.find((o) => o.id === selectedObjectId) ?? schemaObjects[0];

  const totalSensitiveCount = schemaObjects.reduce(
    (sum, o) => sum + o.properties.filter((p) => p.sensitive).length,
    0
  );
  const totalIdentityRefProps = schemaObjects.reduce(
    (sum, o) =>
      sum + o.properties.filter((p) => p.type === 'Reference (Identity)').length,
    0
  );

  const handleCreateObject = () => {
    if (!objName.trim()) return;
    const createdId = createSchemaObject({
      name: objName,
      apiName: objApiName || objName,
      category: objCategory,
      description: objDesc,
    });
    setSelectedObjectId(createdId);
    setObjName('');
    setObjApiName('');
    setObjDesc('');
    setObjCategory('Custom Object');
    setNewObjDialogOpen(false);
  };

  const handleAddProperty = () => {
    if (!selectedObj || !propLabel.trim()) return;
    addSchemaProperty(selectedObj.id, {
      key: propKey || propLabel,
      label: propLabel,
      type: propType,
      referenceTargetObjectId:
        propType === 'Reference (Identity)'
          ? 'obj-identity'
          : propType === 'Reference (Object)'
            ? propRefTarget
            : undefined,
      required: propRequired,
      unique: propUnique,
      sensitive: propSensitive || propType === 'Encrypted Secret',
      maskPattern: propMaskPattern,
      defaultSampleValue: propSample || undefined,
      description: propDesc || undefined,
    });
    setPropLabel('');
    setPropKey('');
    setPropType('String');
    setPropRefTarget('obj-identity');
    setPropRequired(false);
    setPropUnique(false);
    setPropSensitive(false);
    setPropMaskPattern('Show Last 4 (••••1234)');
    setPropSample('');
    setPropDesc('');
    setNewPropDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Action & Posture Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
              Data Model Objects
            </div>
            <div className="font-display text-lg font-extrabold text-[#0F172A]">
              {schemaObjects.length} Objects
            </div>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
              Sensitive Masked Fields
            </div>
            <div className="font-display text-lg font-extrabold text-amber-600">
              {totalSensitiveCount} Protected
            </div>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
              Identity Reference Links
            </div>
            <div className="font-display text-lg font-extrabold text-[#0284C7]">
              {totalIdentityRefProps} Workflow Resolvers
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection('people')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
          >
            <EyeOff className="h-3.5 w-3.5 text-amber-600" />
            <span>Verify Masking in People</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setNewObjDialogOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Object</span>
          </button>
        </div>
      </div>

      {/* Main Split: Object Directory (Left) + Schema Property Editor (Right) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Object List */}
        <div className="space-y-2.5 lg:col-span-4">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Configured Objects ({schemaObjects.length})
          </div>
          {schemaObjects.map((obj) => {
            const active = selectedObj?.id === obj.id;
            const sensitiveInObj = obj.properties.filter((p) => p.sensitive).length;
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => setSelectedObjectId(obj.id)}
                className={cn(
                  'w-full cursor-pointer rounded-2xl border p-4 text-left transition-all',
                  active
                    ? 'border-[#0EA5E9] bg-sky-50/40 ring-1 ring-sky-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                        active
                          ? 'bg-[#0EA5E9] text-white'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {obj.category === 'Custom Object' ? (
                        <Box className="h-4 w-4" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <div className="font-heading text-sm font-bold text-[#0F172A]">
                        {obj.name}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {obj.apiName} · {obj.code}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
                      obj.category === 'Custom Object'
                        ? 'bg-indigo-50 text-indigo-700'
                        : obj.category === 'Reference Object'
                          ? 'bg-sky-50 text-[#0284C7]'
                          : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {obj.category === 'Core System Object'
                      ? 'Core'
                      : obj.category === 'Reference Object'
                        ? 'Ref'
                        : 'Custom'}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-[11px] text-slate-500">
                  {obj.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
                    {obj.properties.length} properties
                  </span>
                  {sensitiveInObj > 0 && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700">
                      <Lock className="h-2.5 w-2.5" />
                      {sensitiveInObj} sensitive
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Object Schema & Property Editor */}
        {selectedObj && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                  <span>{selectedObj.code}</span>
                  <span>·</span>
                  <span>apiName: {selectedObj.apiName}</span>
                  <span>·</span>
                  <span>{selectedObj.category}</span>
                </div>
                <h2 className="mt-1 font-heading text-base font-bold text-[#0F172A]">
                  {selectedObj.name} — Properties &amp; Field Security
                </h2>
                <p className="text-xs text-slate-500">
                  Update property types, bind Identity references for workflows, or mark fields as{' '}
                  <strong className="text-slate-700">Sensitive</strong> to mask values across the portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewPropDialogOpen(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0EA5E9]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Property</span>
              </button>
            </div>

            {selectedObj.id === 'obj-identity' && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 bg-amber-50/50 px-5 py-2.5 text-[11px] text-amber-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Live Portal Enforcement:</strong> Toggling <strong>Sensitive</strong> on Identity fields (e.g., Primary Email, Employee Number, National ID, or custom fields) immediately masks their clear-text values in People Directory and Identity Inspector.
                  </span>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Property &amp; Key</th>
                    <th className="px-4 py-3">Data Type</th>
                    <th className="px-4 py-3">Sensitive Field &amp; Masking</th>
                    <th className="px-4 py-3">Portal Preview</th>
                    <th className="px-4 py-3 text-right">Req / Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedObj.properties.map((prop) => {
                    const sampleVal = prop.defaultSampleValue ?? 'SampleValue-1024';
                    const displayPreview = prop.sensitive
                      ? maskSensitiveValue(sampleVal, prop.maskPattern)
                      : sampleVal;

                    return (
                      <tr
                        key={prop.id}
                        className={cn(
                          'hover:bg-slate-50/70',
                          prop.sensitive && 'bg-amber-50/15'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                            <span>{prop.label}</span>
                            {prop.sensitive && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800 uppercase">
                                <Lock className="h-2.5 w-2.5" />
                                Sensitive
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                            {prop.key}
                            {prop.unique ? ' · Unique' : ''}
                            {!prop.systemProperty ? ' · Custom' : ''}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <select
                            aria-label={`Data type for ${prop.label}`}
                            value={prop.type}
                            onChange={(e) => {
                              const nextType = e.target.value as SchemaPropertyType;
                              updateSchemaProperty(selectedObj.id, prop.id, {
                                type: nextType,
                                referenceTargetObjectId:
                                  nextType === 'Reference (Identity)'
                                    ? 'obj-identity'
                                    : nextType === 'Reference (Object)'
                                      ? prop.referenceTargetObjectId ?? schemaObjects[0]?.id
                                      : undefined,
                                sensitive:
                                  nextType === 'Encrypted Secret' ? true : prop.sensitive,
                              });
                            }}
                            className="w-40 rounded-lg border border-slate-200 bg-[#F8FAFC] px-2 py-1 font-mono text-[11px] font-medium text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                          >
                            {PROPERTY_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>

                          {prop.type === 'Reference (Identity)' && (
                            <div className="mt-1 inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-[#0284C7]">
                              <Link2 className="h-2.5 w-2.5" />
                              <span>→ Identity (Workflow Ready)</span>
                            </div>
                          )}

                          {prop.type === 'Reference (Object)' && (
                            <select
                              aria-label={`Target object for ${prop.label}`}
                              value={prop.referenceTargetObjectId ?? schemaObjects[0]?.id}
                              onChange={(e) =>
                                updateSchemaProperty(selectedObj.id, prop.id, {
                                  referenceTargetObjectId: e.target.value,
                                })
                              }
                              className="mt-1 block w-40 rounded border border-sky-200 bg-sky-50/50 px-1.5 py-0.5 font-mono text-[10px] text-[#0284C7]"
                            >
                              {schemaObjects.map((o) => (
                                <option key={o.id} value={o.id}>
                                  → {o.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Switch.Root
                              checked={prop.sensitive}
                              onCheckedChange={(checked) =>
                                updateSchemaProperty(selectedObj.id, prop.id, {
                                  sensitive: checked,
                                })
                              }
                              aria-label={`Toggle sensitive field masking for ${prop.label}`}
                              className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-amber-500"
                            >
                              <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                            </Switch.Root>
                            <span className="font-mono text-[10px] font-semibold text-slate-600">
                              {prop.sensitive ? 'Masked' : 'Clear Text'}
                            </span>
                          </div>

                          {prop.sensitive && (
                            <select
                              aria-label={`Mask pattern for ${prop.label}`}
                              value={prop.maskPattern}
                              onChange={(e) =>
                                updateSchemaProperty(selectedObj.id, prop.id, {
                                  maskPattern: e.target.value as SensitiveMaskPattern,
                                })
                              }
                              className="mt-1.5 w-44 rounded-lg border border-amber-200 bg-amber-50/60 px-2 py-1 font-mono text-[10px] text-amber-900 focus:outline-none"
                            >
                              {MASK_PATTERNS.map((mp) => (
                                <option key={mp} value={mp}>
                                  {mp}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[11px]',
                              prop.sensitive
                                ? 'border border-amber-200 bg-amber-50 font-bold text-amber-900'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            {prop.sensitive && <KeyRound className="h-3 w-3 text-amber-600" />}
                            <span className="max-w-[140px] truncate">{displayPreview}</span>
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateSchemaProperty(selectedObj.id, prop.id, {
                                  required: !prop.required,
                                })
                              }
                              className={cn(
                                'cursor-pointer rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold',
                                prop.required
                                  ? 'border-sky-200 bg-sky-50 text-[#0284C7]'
                                  : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700'
                              )}
                            >
                              {prop.required ? 'Req' : 'Opt'}
                            </button>
                            {!prop.systemProperty && (
                              <button
                                type="button"
                                onClick={() => deleteSchemaProperty(selectedObj.id, prop.id)}
                                title="Delete custom property"
                                className="cursor-pointer rounded-md border border-slate-200 p-1 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create New Object */}
      <Dialog.Root open={newObjDialogOpen} onOpenChange={setNewObjDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    Schema Studio
                  </div>
                  <Dialog.Title className="font-display text-lg font-extrabold text-[#0F172A]">
                    Create New Data Object
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500">
                    Define a custom governed object (e.g., Vendor Contract, Physical Badge, Data Asset) with an Identity owner reference ready for custom workflows.
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
                      Object Display Name *
                    </label>
                    <input
                      type="text"
                      value={objName}
                      onChange={(e) => setObjName(e.target.value)}
                      placeholder="e.g. Vendor Contract"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      API Identifier
                    </label>
                    <input
                      type="text"
                      value={objApiName}
                      onChange={(e) => setObjApiName(e.target.value)}
                      placeholder="vendor_contract"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Object Classification
                  </label>
                  <select
                    value={objCategory}
                    onChange={(e) =>
                      setObjCategory(e.target.value as DemoSchemaObject['category'])
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    <option value="Custom Object">Custom Object</option>
                    <option value="Reference Object">Reference Object</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={objDesc}
                    onChange={(e) => setObjDesc(e.target.value)}
                    placeholder="Explain what this object models and how identities relate to it..."
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
                  onClick={handleCreateObject}
                  disabled={!objName.trim()}
                  className="cursor-pointer rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create Object
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal: Add Property to Selected Object */}
      <Dialog.Root open={newPropDialogOpen} onOpenChange={setNewPropDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    {selectedObj?.name}
                  </div>
                  <Dialog.Title className="font-display text-lg font-extrabold text-[#0F172A]">
                    Add Property to Schema
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500">
                    Define data type, Identity reference binding, or mark as a Sensitive masked field.
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
                      Display Label *
                    </label>
                    <input
                      type="text"
                      value={propLabel}
                      onChange={(e) => setPropLabel(e.target.value)}
                      placeholder="e.g. Tax Reference Number"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Property Key
                    </label>
                    <input
                      type="text"
                      value={propKey}
                      onChange={(e) => setPropKey(e.target.value)}
                      placeholder="taxNumber"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Property Type
                    </label>
                    <select
                      value={propType}
                      onChange={(e) => {
                        const next = e.target.value as SchemaPropertyType;
                        setPropType(next);
                        if (next === 'Encrypted Secret') setPropSensitive(true);
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {propType === 'Reference (Object)' ? (
                    <div>
                      <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                        Target Reference Object
                      </label>
                      <select
                        value={propRefTarget}
                        onChange={(e) => setPropRefTarget(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/40 px-3 py-2 text-xs text-[#0284C7]"
                      >
                        {schemaObjects.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name} ({o.apiName})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                        Sample / Default Value
                      </label>
                      <input
                        type="text"
                        value={propSample}
                        onChange={(e) => setPropSample(e.target.value)}
                        placeholder="e.g. ZA-TIN-8841209"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 rounded-xl border border-amber-200/80 bg-amber-50/40 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Sensitive Field (Hide Clear Text in Portal)</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Masks values everywhere in the UI with audited temporary reveal only.
                      </div>
                    </div>
                    <Switch.Root
                      checked={propSensitive}
                      onCheckedChange={setPropSensitive}
                      className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-amber-500"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>

                  {propSensitive && (
                    <div>
                      <label className="block font-mono text-[10px] font-semibold text-amber-800 uppercase">
                        Masking Format
                      </label>
                      <select
                        value={propMaskPattern}
                        onChange={(e) =>
                          setPropMaskPattern(e.target.value as SensitiveMaskPattern)
                        }
                        className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-2.5 py-1.5 font-mono text-xs text-amber-900"
                      >
                        {MASK_PATTERNS.map((mp) => (
                          <option key={mp} value={mp}>
                            {mp}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={propRequired}
                      onChange={(e) => setPropRequired(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span>Mandatory field</span>
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={propUnique}
                      onChange={(e) => setPropUnique(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <span>Enforce uniqueness</span>
                  </label>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Description
                  </label>
                  <input
                    type="text"
                    value={propDesc}
                    onChange={(e) => setPropDesc(e.target.value)}
                    placeholder="Optional governance note..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
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
                  onClick={handleAddProperty}
                  disabled={!propLabel.trim()}
                  className="cursor-pointer rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Property
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
