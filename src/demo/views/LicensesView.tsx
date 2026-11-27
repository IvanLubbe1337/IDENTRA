import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  GitMerge,
  Minus,
  Plus,
  Recycle,
  ShieldAlert,
  Users,
} from 'lucide-react';
import {
  computeLicensedIdentitiesByType,
  evaluateSkuBirthrightDemand,
  type LicenseVendor,
} from '@/data/demoSampleData';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const VENDOR_FILTERS: ('All' | LicenseVendor)[] = [
  'All',
  'Microsoft',
  'SAP',
  'GitHub',
  'Okta',
  'Salesforce',
];

export function LicensesView() {
  const licenseSkus = useDemoStore((s) => s.licenseSkus);
  const birthrights = useDemoStore((s) => s.birthrights);
  const people = useDemoStore((s) => s.people);
  const nonHumans = useDemoStore((s) => s.nonHumans);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const currency = useDemoStore((s) => s.platformConfig.governance.currencySymbol);
  const adjustLicensePool = useDemoStore((s) => s.adjustLicensePool);
  const reclaimInactiveLicenses = useDemoStore((s) => s.reclaimInactiveLicenses);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [vendorFilter, setVendorFilter] = useState<'All' | LicenseVendor>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Warnings Only' | 'Healthy'>('All');

  const evaluations = useMemo(
    () => evaluateSkuBirthrightDemand(licenseSkus, birthrights, people),
    [licenseSkus, birthrights, people]
  );

  const licensedByType = useMemo(
    () => computeLicensedIdentitiesByType(licenseSkus, people, nonHumans),
    [licenseSkus, people, nonHumans]
  );

  const filteredEvaluations = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return evaluations.filter((ev) => {
      if (vendorFilter !== 'All' && ev.sku.vendor !== vendorFilter) return false;
      if (statusFilter === 'Warnings Only' && ev.status === 'Healthy') return false;
      if (statusFilter === 'Healthy' && ev.status !== 'Healthy') return false;
      if (!needle) return true;
      return `${ev.sku.name} ${ev.sku.skuCode} ${ev.sku.vendor} ${ev.sku.application} ${ev.sku.tier}`
        .toLowerCase()
        .includes(needle);
    });
  }, [evaluations, vendorFilter, statusFilter, searchQuery]);

  const totals = useMemo(() => {
    const totalPurchased = licenseSkus.reduce((s, k) => s + k.totalPurchased, 0);
    const totalConsumed = licenseSkus.reduce((s, k) => s + k.consumed, 0);
    const totalAvailable = Math.max(0, totalPurchased - totalConsumed);
    const utilizationPct =
      totalPurchased > 0 ? Math.round((totalConsumed / totalPurchased) * 1000) / 10 : 0;
    const totalMonthlySpend = licenseSkus.reduce(
      (s, k) => s + k.consumed * k.monthlyCostZar,
      0
    );
    const totalReclaimableSeats = licenseSkus.reduce(
      (s, k) => s + k.reclaimableInactive,
      0
    );
    const totalReclaimableMonthlyZar = licenseSkus.reduce(
      (s, k) => s + k.reclaimableInactive * k.monthlyCostZar,
      0
    );
    const exceededList = evaluations.filter((e) => e.exceedsPool);
    const nearLimitList = evaluations.filter((e) => e.status === 'Near Limit');
    return {
      totalPurchased,
      totalConsumed,
      totalAvailable,
      utilizationPct,
      totalMonthlySpend,
      totalReclaimableSeats,
      totalReclaimableMonthlyZar,
      exceededList,
      nearLimitList,
    };
  }, [licenseSkus, evaluations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            License Inventory &amp; Capacity Governance
          </h1>
          <p className="text-sm text-slate-500">
            Track purchased vs. consumed seats per SKU (E3, E5, F3, Copilot, ERP &amp; SaaS), detect Birthright policy capacity overruns, and monitor total licensed identities by type.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveSection('birthrights')}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
        >
          <GitMerge className="h-3.5 w-3.5 text-[#0EA5E9]" />
          <span>Inspect Birthright Policies</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Live Exceedance Warning Banner (Birthright Policy / Consumption Overrun) */}
      {totals.exceededList.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <ShieldAlert className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] font-bold tracking-wider text-rose-700 uppercase">
                  License Pool Exceedance Warning · {totals.exceededList.length} SKU Over Capacity
                </div>
                <div className="mt-0.5 text-sm font-bold text-rose-950">
                  Active Birthright provisioning will exceed purchased license counts unless seats are added or reclaimed.
                </div>
                <div className="mt-2 space-y-1.5">
                  {totals.exceededList.map((ev) => (
                    <div
                      key={ev.sku.id}
                      className="flex flex-wrap items-center gap-2 text-xs text-rose-900"
                    >
                      <span className="rounded bg-rose-200/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-900">
                        {ev.sku.skuCode}
                      </span>
                      <span className="font-semibold">{ev.sku.name}:</span>
                      <span className="font-mono">
                        {ev.sku.consumed.toLocaleString()} consumed + {ev.birthrightProjectedSeats} birthright demand ={' '}
                        <strong>
                          {ev.projectedTotalConsumed.toLocaleString()} /{' '}
                          {ev.sku.totalPurchased.toLocaleString()}
                        </strong>{' '}
                        (shortfall: <strong>-{ev.shortfallSeats} seats</strong> ·{' '}
                        {currency}
                        {ev.projectedOverageMonthlyZar.toLocaleString()}/mo overage)
                      </span>
                      {ev.contributingRules.length > 0 && (
                        <span className="rounded-full bg-white/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-700 ring-1 ring-rose-200">
                          Policy: {ev.contributingRules.map((r) => r.ruleCode).join(', ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {totals.exceededList[0].sku.reclaimableInactive > 0 && (
                <button
                  type="button"
                  onClick={() => reclaimInactiveLicenses(totals.exceededList[0].sku.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                >
                  <Recycle className="h-3.5 w-3.5" />
                  <span>
                    Reclaim {totals.exceededList[0].sku.reclaimableInactive} Inactive{' '}
                    {totals.exceededList[0].sku.shortLabel}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => adjustLicensePool(totals.exceededList[0].sku.id, 25)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add +25 {totals.exceededList[0].sku.shortLabel} Seats</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Executive KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Consumed / Purchased Licenses
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">
              {totals.totalConsumed.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-slate-400">
              / {totals.totalPurchased.toLocaleString()} seats
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0EA5E9] transition-all"
              style={{ width: `${Math.min(100, totals.utilizationPct)}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-slate-500">
            <span>{totals.utilizationPct}% consumed</span>
            <span className="font-semibold text-emerald-700">
              {totals.totalAvailable.toLocaleString()} available
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Capacity &amp; Birthright Alerts
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                totals.exceededList.length > 0
                  ? 'text-rose-600'
                  : totals.nearLimitList.length > 0
                    ? 'text-amber-600'
                    : 'text-emerald-600'
              )}
            >
              {totals.exceededList.length}
            </span>
            <span className="font-mono text-xs text-slate-400">
              exceeded · {totals.nearLimitList.length} near limit
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Evaluated live against {birthrights.filter((b) => b.status === 'Active').length} active Birthright policies
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Total Licensed Identities
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {licensedByType.totalUniqueLicensedIdentities.toLocaleString()}
            </span>
            <span className="font-mono text-xs text-slate-400">
              across 5 identity types
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Employees, Contractors, Privileged, Guests &amp; Non-Humans
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Monthly License Spend &amp; Savings
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">
              {currency}
              {(totals.totalMonthlySpend / 1000000).toFixed(2)}M
            </span>
            <span className="font-mono text-[11px] text-slate-400">/ month</span>
          </div>
          <div className="mt-2 font-mono text-[11px] font-semibold text-emerald-700">
            Reclaimable: {totals.totalReclaimableSeats} seats ({currency}
            {totals.totalReclaimableMonthlyZar.toLocaleString()}/mo)
          </div>
        </div>
      </div>

      {/* SECTION 1: TOTAL LICENSE COUNTS & CONSUMPTION PER SKU */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {VENDOR_FILTERS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVendorFilter(v)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  vendorFilter === v
                    ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {(['All', 'Warnings Only', 'Healthy'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  statusFilter === st
                    ? 'border-[#0F172A] bg-[#0F172A] font-semibold text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#0EA5E9]" />
              <div>
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  License Counts &amp; Consumption per SKU
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time purchased pool, consumed seats, Birthright policy demand projections, and instant seat adjustments.
                </p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-slate-500">
              {filteredEvaluations.length} SKUs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">License SKU &amp; Vendor</th>
                  <th className="px-4 py-3">Consumed / Total Pool</th>
                  <th className="px-4 py-3">Birthright Policy Demand</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Monthly Cost</th>
                  <th className="px-4 py-3 text-right">Pool &amp; Reclaim Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvaluations.map((ev) => {
                  const { sku } = ev;
                  const consumedPct = Math.min(100, ev.utilizationPct);
                  const projectedExtraPct = Math.min(
                    100 - consumedPct,
                    Math.max(0, ev.projectedUtilizationPct - consumedPct)
                  );
                  const monthlySpend = sku.consumed * sku.monthlyCostZar;

                  return (
                    <tr
                      key={sku.id}
                      className={cn(
                        'hover:bg-slate-50/70',
                        ev.exceedsPool && 'bg-rose-50/25'
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-heading font-bold text-[#0F172A]">
                            {sku.name}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                            {sku.skuCode}
                          </span>
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                          {sku.vendor} · {sku.tier} · {currency}
                          {sku.monthlyCostZar.toLocaleString()}/seat/mo
                        </div>
                      </td>

                      <td className="min-w-[210px] px-4 py-3.5">
                        <div className="flex items-baseline justify-between font-mono text-[11px]">
                          <span className="font-bold text-[#0F172A]">
                            {sku.consumed.toLocaleString()}{' '}
                            <span className="font-normal text-slate-400">consumed</span>
                          </span>
                          <span className="text-slate-500">
                            / {sku.totalPurchased.toLocaleString()} total
                          </span>
                        </div>
                        <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              'h-full transition-all',
                              ev.exceedsPool
                                ? 'bg-rose-500'
                                : ev.status === 'Near Limit'
                                  ? 'bg-amber-500'
                                  : 'bg-[#0EA5E9]'
                            )}
                            style={{ width: `${consumedPct}%` }}
                          />
                          {projectedExtraPct > 0 && (
                            <div
                              className="h-full bg-rose-300/90"
                              style={{ width: `${projectedExtraPct}%` }}
                              title="Projected Birthright demand"
                            />
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-slate-500">{ev.utilizationPct}% used</span>
                          <span
                            className={cn(
                              'font-semibold',
                              ev.availableSeats <= 10 ? 'text-rose-600' : 'text-emerald-700'
                            )}
                          >
                            {ev.availableSeats.toLocaleString()} remaining
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {ev.birthrightProjectedSeats > 0 ? (
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                              <span
                                className={cn(
                                  'font-bold',
                                  ev.exceedsPool ? 'text-rose-600' : 'text-[#0284C7]'
                                )}
                              >
                                +{ev.birthrightProjectedSeats} projected
                              </span>
                              <span className="text-slate-400">
                                ({ev.projectedTotalConsumed.toLocaleString()} total)
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {ev.contributingRules.map((r) => (
                                <span
                                  key={r.ruleId}
                                  className="rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#0284C7]"
                                >
                                  {r.ruleCode} (+{r.projectedNewSeats})
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono text-[10px] text-slate-400">
                            No active birthright demand
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {ev.exceedsPool ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Exceeds by {ev.shortfallSeats}</span>
                            </span>
                            <div className="font-mono text-[9px] font-semibold text-rose-600">
                              +{currency}
                              {ev.projectedOverageMonthlyZar.toLocaleString()}/mo risk
                            </div>
                          </div>
                        ) : ev.status === 'Near Limit' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-800">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Near Limit ({ev.projectedUtilizationPct}%)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Healthy</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono">
                        <div className="font-semibold text-[#0F172A]">
                          {currency}
                          {monthlySpend.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">/ month</div>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => adjustLicensePool(sku.id, -25)}
                            title="Simulate reducing purchased pool by 25 seats"
                            className="inline-flex cursor-pointer items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-700"
                          >
                            <Minus className="h-2.5 w-2.5" />
                            <span>25</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustLicensePool(sku.id, 25)}
                            title="Add 25 seats to purchased pool"
                            className="inline-flex cursor-pointer items-center gap-0.5 rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 font-mono text-[10px] font-semibold text-[#0284C7] hover:bg-sky-100"
                          >
                            <Plus className="h-2.5 w-2.5" />
                            <span>25</span>
                          </button>
                          {sku.reclaimableInactive > 0 && (
                            <button
                              type="button"
                              onClick={() => reclaimInactiveLicenses(sku.id)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700"
                            >
                              <Recycle className="h-3 w-3" />
                              <span>Reclaim {sku.reclaimableInactive}</span>
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
      </div>

      {/* SECTION 2: TOTAL LICENSED IDENTITIES PER TYPE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#0EA5E9]" />
            <div>
              <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                Total Licensed Identities by Identity Type
              </h2>
              <p className="text-xs text-slate-500">
                Breakdown of unique licensed identities, total SKU seats consumed, and monthly ZAR spend allocated per identity classification.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 font-mono text-xs font-bold text-[#0284C7]">
            {licensedByType.totalUniqueLicensedIdentities.toLocaleString()} Licensed Identities
          </span>
        </div>

        {/* Stacked Proportional Distribution Bar */}
        <div className="mt-4">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            {licensedByType.rows.map((row) => (
              <div
                key={row.id}
                style={{ width: `${row.sharePct}%`, backgroundColor: row.accentColor }}
                title={`${row.identityType}: ${row.licensedIdentitiesCount.toLocaleString()} (${row.sharePct}%)`}
                className="h-full transition-all duration-500"
              />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-3 text-[11px]">
            {licensedByType.rows.map((row) => (
              <div key={row.id} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: row.accentColor }}
                />
                <span className="font-medium text-slate-700">{row.identityType}</span>
                <span className="font-mono text-slate-400">({row.sharePct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Identity-Type Cards Grid */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {licensedByType.rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-[#FBFDFF] p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: row.accentColor }}
                  />
                  <span className="font-mono text-[10px] font-bold text-slate-500">
                    {row.sharePct}% share
                  </span>
                </div>
                <div className="mt-2 font-heading text-xs font-bold text-[#0F172A]">
                  {row.identityType}
                </div>
                <div className="mt-1 font-display text-2xl font-extrabold text-[#0F172A]">
                  {row.licensedIdentitiesCount.toLocaleString()}
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                  {row.totalSeatsConsumed.toLocaleString()} SKU seats assigned
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  {row.description}
                </p>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-2.5">
                <div className="flex flex-wrap gap-1">
                  {row.topSkus.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-2 font-mono text-[11px] font-bold text-[#0284C7]">
                  {currency}
                  {row.monthlySpendZar.toLocaleString()}/mo
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
