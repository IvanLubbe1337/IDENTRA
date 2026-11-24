import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  GitBranch,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserPlus,
  XCircle,
} from 'lucide-react';
import {
  CONTRACTOR_ONBOARDING_WORKFLOWS,
  ENTITLEMENT_ONBOARDING_WORKFLOWS,
  type DemoEntitlementOnboardingRequest,
} from '@/data/demoSampleData';
import { Switch, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const SPONSORS = [
  { id: 'mgr-priya', name: 'Priya Nair', role: 'Principal Platform Engineer' },
  { id: 'mgr-claire', name: 'Claire Vance', role: 'Finance Operations Manager' },
  { id: 'mgr-david', name: 'David Chen', role: 'Treasury Director' },
  { id: 'mgr-marcus', name: 'Marcus Bell', role: 'VP Enterprise Sales' },
  { id: 'mgr-alex', name: 'Alex Carter', role: 'VP Engineering' },
  { id: 'mgr-cdo', name: 'Hannah Lindqvist', role: 'Chief Data Officer' },
];

const DEPARTMENTS = [
  { refId: 'dept-contractor', name: 'External Assurance & Contractors', cc: 'CC-9001-EXT' },
  { refId: 'dept-eng', name: 'Platform & Cloud Engineering', cc: 'CC-3010-ENG' },
  { refId: 'dept-finance', name: 'Corporate Finance & Treasury', cc: 'CC-4100-FIN' },
  { refId: 'dept-data', name: 'Data Governance & Analytics', cc: 'CC-3400-DAT' },
  { refId: 'dept-sales', name: 'Global Revenue & Enterprise Sales', cc: 'CC-2200-REV' },
];

const TIER0_APPS = new Set([
  'SAP S/4HANA Finance',
  'AWS Prod Vault',
  'Snowflake PII Lake',
  'Okta Workforce Cloud',
  'Workday HRIS Core',
]);

const TARGET_APPS = [
  'Active Directory',
  'Microsoft Entra ID',
  'SAP S/4HANA Finance',
  'AWS Prod Vault',
  'Snowflake PII Lake',
  'Okta Workforce Cloud',
  'GitHub Enterprise',
  'Workday HRIS Core',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INTERNAL_DOMAINS = ['@identra-corp.io', '@corp.identra.net'];

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return -1;
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function OnboardingView() {
  const onboardingTab = useDemoStore((s) => s.onboardingTab);
  const people = useDemoStore((s) => s.people);
  const entitlements = useDemoStore((s) => s.entitlements);
  const contractorRequests = useDemoStore((s) => s.contractorRequests);
  const entitlementRequests = useDemoStore((s) => s.entitlementRequests);

  const submitContractorOnboarding = useDemoStore((s) => s.submitContractorOnboarding);
  const advanceContractorApproval = useDemoStore((s) => s.advanceContractorApproval);
  const submitEntitlementOnboarding = useDemoStore((s) => s.submitEntitlementOnboarding);
  const advanceEntitlementApproval = useDemoStore((s) => s.advanceEntitlementApproval);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);
  const setSelectedPersonId = useDemoStore((s) => s.setSelectedPersonId);

  const [activeTab, setActiveTab] = useState<'contractor' | 'entitlement'>(onboardingTab);

  useEffect(() => {
    setActiveTab(onboardingTab);
  }, [onboardingTab]);

  /* ------------------ Contractor Onboarding Form State ------------------ */
  const [cFirst, setCFirst] = useState('');
  const [cLast, setCLast] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cVendor, setCVendor] = useState('Vanguard External Assurance LLP');
  const [cTitle, setCTitle] = useState('');
  const [cDeptRef, setCDeptRef] = useState('dept-contractor');
  const [cLocation, setCLocation] = useState('Johannesburg (Hybrid / B2B)');
  const [cSponsorRef, setCSponsorRef] = useState('mgr-priya');
  const [cStartDate, setCStartDate] = useState('2026-11-25');
  const [cEndDate, setCEndDate] = useState('2027-02-23');
  const [cNdaVerified, setCNdaVerified] = useState(false);
  const [cJustification, setCJustification] = useState('');
  const [cWorkflowId, setCWorkflowId] = useState(CONTRACTOR_ONBOARDING_WORKFLOWS[1].id);
  const [cTouched, setCTouched] = useState(false);

  /* ------------------ Entitlement Onboarding Form State ----------------- */
  const [eName, setEName] = useState('');
  const [eTechId, setETechId] = useState('');
  const [eApp, setEApp] = useState('SAP S/4HANA Finance');
  const [eType, setEType] =
    useState<DemoEntitlementOnboardingRequest['entitlementType']>('SAP Role');
  const [eOwner, setEOwner] = useState('Claire Vance');
  const [eSensitivity, setESensitivity] = useState<'Standard' | 'High' | 'Critical'>('High');
  const [eRecertDays, setERecertDays] = useState<90 | 180 | 365>(90);
  const [eRequestable, setERequestable] = useState(true);
  const [eSodChecked, setESodChecked] = useState(false);
  const [eSodNote, setESodNote] = useState('');
  const [eDesc, setEDesc] = useState('');
  const [eWorkflowId, setEWorkflowId] = useState(ENTITLEMENT_ONBOARDING_WORKFLOWS[2].id);
  const [eTouched, setETouched] = useState(false);

  /* ------------------ Contractor Live Validations ----------------------- */
  const contractorDuration = useMemo(
    () => daysBetween(cStartDate, cEndDate),
    [cStartDate, cEndDate]
  );

  const contractorErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    const emailLower = cEmail.trim().toLowerCase();

    if (!cFirst.trim()) errs.firstName = 'First name is required.';
    if (!cLast.trim()) errs.lastName = 'Last name is required.';

    if (!emailLower) {
      errs.email = 'External partner email is required.';
    } else if (!EMAIL_REGEX.test(emailLower)) {
      errs.email = 'Enter a valid email address (e.g. name@vendor-domain.co.za).';
    } else if (INTERNAL_DOMAINS.some((dom) => emailLower.endsWith(dom))) {
      errs.email =
        'External contractors cannot use internal @identra-corp.io / @corp.identra.net domains.';
    } else if (
      people.some((p) => p.email.toLowerCase() === emailLower) ||
      contractorRequests.some(
        (r) => r.status === 'Pending Approval' && r.email.toLowerCase() === emailLower
      )
    ) {
      errs.email = 'An active identity or pending onboarding request already uses this email.';
    }

    if (!cVendor.trim()) errs.vendor = 'Vendor / partner organization is required.';
    if (!cTitle.trim()) errs.title = 'Engagement title / role is required.';
    if (!cSponsorRef) {
      errs.sponsor = 'GA-CTRL-03: Every contractor must have an accountable internal sponsor.';
    }

    if (!cStartDate || !cEndDate) {
      errs.dates = 'Fixed contract start and end dates are mandatory for contractors.';
    } else if (contractorDuration <= 0) {
      errs.dates = 'Contract end date must be strictly after the start date.';
    } else if (contractorDuration > 180) {
      errs.dates = `Duration is ${contractorDuration} days — maximum allowed B2B contractor engagement is 180 days.`;
    }

    if (
      contractorDuration > 90 &&
      contractorDuration <= 180 &&
      cWorkflowId === 'wf-ctr-sponsor'
    ) {
      errs.workflow =
        'Engagements over 90 days require multi-stage approval (WF-CTR-02, WF-CTR-03, or WF-CTR-04).';
    }

    if (!cNdaVerified) {
      errs.nda = 'Confirm signed NDA and vendor security clearance before onboarding.';
    }

    if (cJustification.trim().length < 12) {
      errs.justification = 'Provide a business justification (at least 12 characters).';
    }

    return errs;
  }, [
    cFirst,
    cLast,
    cEmail,
    cVendor,
    cTitle,
    cSponsorRef,
    cStartDate,
    cEndDate,
    contractorDuration,
    cWorkflowId,
    cNdaVerified,
    cJustification,
    people,
    contractorRequests,
  ]);

  /* ------------------ Entitlement Live Validations ---------------------- */
  const entitlementErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    const cleanName = eName.trim();

    if (!cleanName) {
      errs.name = 'Entitlement name is required.';
    } else if (cleanName.length < 4) {
      errs.name = 'Entitlement name must be at least 4 characters.';
    } else if (!/^[A-Za-z0-9:_\-/\s.]+$/.test(cleanName)) {
      errs.name = 'Use only alphanumeric characters and : _ - / . separators.';
    } else if (
      entitlements.some(
        (e) =>
          e.name.toLowerCase() === cleanName.toLowerCase() &&
          e.application === eApp
      ) ||
      entitlementRequests.some(
        (r) =>
          r.status === 'Pending Approval' &&
          r.entitlementName.toLowerCase() === cleanName.toLowerCase() &&
          r.application === eApp
      )
    ) {
      errs.name = `"${cleanName}" already exists or is pending onboarding on ${eApp}.`;
    }

    if (eTechId.trim().length < 5) {
      errs.techId = 'Provide a valid technical identifier, AD DN, SAP role code, or ARN (min 5 chars).';
    }

    if (!eOwner.trim()) {
      errs.owner = 'GA-CTRL-01 (Preventative): Every entitlement must have an assigned owner.';
    }

    if (eSensitivity === 'Critical' && eRecertDays !== 90) {
      errs.recert = 'Critical entitlements must enforce a 90-day quarterly recertification SLA.';
    }

    if (
      eSensitivity === 'Critical' &&
      (eWorkflowId === 'wf-ent-app' || eWorkflowId === 'wf-ent-owner-app')
    ) {
      errs.workflow =
        'Critical sensitivity entitlements require Security/SoD or SOX approval workflow (WF-ENT-03 or WF-ENT-04).';
    }

    if ((TIER0_APPS.has(eApp) || eSensitivity !== 'Standard') && !eSodChecked) {
      errs.sod = `SoD conflict matrix declaration is mandatory for ${eSensitivity} / Tier-0 (${eApp}) entitlements.`;
    }

    if (eDesc.trim().length < 15) {
      errs.description = 'Describe the exact privilege scope and business purpose (min 15 chars).';
    }

    return errs;
  }, [
    eName,
    eTechId,
    eApp,
    eOwner,
    eSensitivity,
    eRecertDays,
    eWorkflowId,
    eSodChecked,
    eDesc,
    entitlements,
    entitlementRequests,
  ]);

  const selectedContractorWf =
    CONTRACTOR_ONBOARDING_WORKFLOWS.find((w) => w.id === cWorkflowId) ??
    CONTRACTOR_ONBOARDING_WORKFLOWS[0];
  const selectedEntitlementWf =
    ENTITLEMENT_ONBOARDING_WORKFLOWS.find((w) => w.id === eWorkflowId) ??
    ENTITLEMENT_ONBOARDING_WORKFLOWS[0];

  const handleContractorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCTouched(true);
    if (Object.keys(contractorErrors).length > 0) return;

    const dept = DEPARTMENTS.find((d) => d.refId === cDeptRef) ?? DEPARTMENTS[0];
    const sponsor = SPONSORS.find((s) => s.id === cSponsorRef) ?? SPONSORS[0];

    submitContractorOnboarding({
      firstName: cFirst,
      lastName: cLast,
      email: cEmail,
      vendorCompany: cVendor,
      title: cTitle,
      department: dept.name,
      departmentRefId: dept.refId,
      costCenterCode: dept.cc,
      location: cLocation,
      sponsorName: sponsor.name,
      sponsorRefId: sponsor.id,
      startDate: cStartDate,
      endDate: cEndDate,
      durationDays: contractorDuration,
      ndaVerified: cNdaVerified,
      justification: cJustification,
      workflowId: cWorkflowId,
    });

    setCFirst('');
    setCLast('');
    setCEmail('');
    setCTitle('');
    setCJustification('');
    setCNdaVerified(false);
    setCTouched(false);
  };

  const handleEntitlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setETouched(true);
    if (Object.keys(entitlementErrors).length > 0) return;

    submitEntitlementOnboarding({
      entitlementName: eName,
      technicalId: eTechId,
      application: eApp,
      entitlementType: eType,
      owner: eOwner,
      sensitivity: eSensitivity,
      recertificationDays: eRecertDays,
      requestableInCatalog: eRequestable,
      sodChecked: eSodChecked,
      sodConflictNote: eSodNote.trim() || undefined,
      description: eDesc,
      workflowId: eWorkflowId,
    });

    setEName('');
    setETechId('');
    setEDesc('');
    setESodNote('');
    setESodChecked(false);
    setETouched(false);
  };

  const fillContractorSample = () => {
    setCFirst('Sipho');
    setCLast('Mabaso');
    setCEmail('sipho.mabaso@deloitte-cyber.co.za');
    setCVendor('Deloitte Cyber Advisory SA');
    setCTitle('IAM Integration Architect');
    setCDeptRef('dept-eng');
    setCLocation('Johannesburg (Hybrid / B2B)');
    setCSponsorRef('mgr-alex');
    setCStartDate('2026-11-26');
    setCEndDate('2027-02-24');
    setCNdaVerified(true);
    setCJustification(
      '90-day SCIM connector integration and AWS IAM Identity Center rollout for Johannesburg engineering squad.'
    );
    setCWorkflowId('wf-ctr-sponsor-iam');
    setCTouched(false);
  };

  const fillEntitlementSample = () => {
    setEName('AWS:IAM::FinanceDataLakeReadOnly');
    setETechId('arn:aws:sso:::permissionSet/fin-datalake-ro-jhb');
    setEApp('AWS Prod Vault');
    setEType('AWS Permission Set');
    setEOwner('Lucas Meyer');
    setESensitivity('Critical');
    setERecertDays(90);
    setERequestable(true);
    setESodChecked(true);
    setESodNote('Verified read-only S3/Athena policy — no write or payment release overlap.');
    setEDesc(
      'Read-only governed permission set allowing Finance analysts to query masked statutory datasets in AWS Prod Vault.'
    );
    setEWorkflowId('wf-ent-sec-sod');
    setETouched(false);
  };

  const pendingContractors = contractorRequests.filter(
    (r) => r.status === 'Pending Approval'
  ).length;
  const pendingEntitlements = entitlementRequests.filter(
    (r) => r.status === 'Pending Approval'
  ).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Guided Onboarding &amp; Approval Workflows
          </h1>
          <p className="text-sm text-slate-500">
            Validated <strong className="text-slate-700">Contractor Onboarding</strong> and{' '}
            <strong className="text-slate-700">Entitlement Onboarding</strong> gated by selectable approval workflows before records are created.
          </p>
        </div>
      </div>

      {/* Radix Tabs: Contractor Onboarding vs Entitlement Onboarding */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'contractor' | 'entitlement')}
        className="space-y-5"
      >
        <Tabs.List className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          <Tabs.Trigger
            value="contractor"
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'contractor'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
            )}
          >
            <Briefcase className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Contractor Onboarding</span>
            {pendingContractors > 0 && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                {pendingContractors} pending
              </span>
            )}
          </Tabs.Trigger>

          <Tabs.Trigger
            value="entitlement"
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-none',
              activeTab === 'entitlement'
                ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
            )}
          >
            <KeyRound className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Entitlement Onboarding</span>
            {pendingEntitlements > 0 && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                {pendingEntitlements} pending
              </span>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        {/* ===================== TAB 1: CONTRACTOR ONBOARDING ===================== */}
        <Tabs.Content value="contractor" className="focus:outline-none">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            {/* Validated Request Form */}
            <form
              onSubmit={handleContractorSubmit}
              className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs xl:col-span-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-[#0F172A]">
                    New External Contractor Request
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enforces external vendor domain, fixed contract TTL (≤180d), accountable sponsor (GA-CTRL-03), NDA sign-off, and approval workflow before creation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillContractorSample}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#0284C7] hover:bg-sky-100"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Load Valid Sample</span>
                </button>
              </div>

              {cTouched && Object.keys(contractorErrors).length > 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div>
                    <strong className="font-semibold">
                      Validation blocked submission ({Object.keys(contractorErrors).length} issue
                      {Object.keys(contractorErrors).length === 1 ? '' : 's'}):
                    </strong>{' '}
                    Fix the highlighted governance requirements below.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={cFirst}
                    onChange={(e) => setCFirst(e.target.value)}
                    placeholder="e.g. Sipho"
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      cTouched && contractorErrors.firstName
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {cTouched && contractorErrors.firstName && (
                    <p className="mt-1 text-[11px] text-rose-600">{contractorErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={cLast}
                    onChange={(e) => setCLast(e.target.value)}
                    placeholder="e.g. Mabaso"
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      cTouched && contractorErrors.lastName
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {cTouched && contractorErrors.lastName && (
                    <p className="mt-1 text-[11px] text-rose-600">{contractorErrors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    External Vendor Email *
                  </label>
                  <input
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="name@vendor-partner.co.za"
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      cTouched && contractorErrors.email
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {cTouched && contractorErrors.email && (
                    <p className="mt-1 text-[11px] text-rose-600">{contractorErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Vendor / Partner Company *
                  </label>
                  <input
                    type="text"
                    value={cVendor}
                    onChange={(e) => setCVendor(e.target.value)}
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      cTouched && contractorErrors.vendor
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {cTouched && contractorErrors.vendor && (
                    <p className="mt-1 text-[11px] text-rose-600">{contractorErrors.vendor}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Engagement Role / Title *
                  </label>
                  <input
                    type="text"
                    value={cTitle}
                    onChange={(e) => setCTitle(e.target.value)}
                    placeholder="e.g. Cloud Security Consultant"
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      cTouched && contractorErrors.title
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {cTouched && contractorErrors.title && (
                    <p className="mt-1 text-[11px] text-rose-600">{contractorErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Accountable Internal Sponsor *
                  </label>
                  <select
                    value={cSponsorRef}
                    onChange={(e) => setCSponsorRef(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    <option value="">-- Select Accountable Sponsor --</option>
                    {SPONSORS.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name} ({sp.role})
                      </option>
                    ))}
                  </select>
                  {cTouched && contractorErrors.sponsor && (
                    <p className="mt-1 text-[11px] text-rose-600">{contractorErrors.sponsor}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Department &amp; Cost Center
                  </label>
                  <select
                    value={cDeptRef}
                    onChange={(e) => setCDeptRef(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.refId} value={d.refId}>
                        {d.name} ({d.cc})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Location
                  </label>
                  <input
                    type="text"
                    value={cLocation}
                    onChange={(e) => setCLocation(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Contract Start Date *
                  </label>
                  <input
                    type="date"
                    value={cStartDate}
                    onChange={(e) => setCStartDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      Contract End Date (Max 180d) *
                    </label>
                    {contractorDuration > 0 && (
                      <span
                        className={cn(
                          'font-mono text-[10px] font-bold',
                          contractorDuration > 180
                            ? 'text-rose-600'
                            : contractorDuration > 90
                              ? 'text-amber-700'
                              : 'text-emerald-600'
                        )}
                      >
                        {contractorDuration} days
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    value={cEndDate}
                    onChange={(e) => setCEndDate(e.target.value)}
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]',
                      cTouched && contractorErrors.dates
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200'
                    )}
                  />
                </div>
                {cTouched && contractorErrors.dates && (
                  <p className="text-[11px] text-rose-600 sm:col-span-2">
                    {contractorErrors.dates}
                  </p>
                )}

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Business Justification &amp; Scope *
                  </label>
                  <textarea
                    rows={2}
                    value={cJustification}
                    onChange={(e) => setCJustification(e.target.value)}
                    placeholder="Specify engagement deliverables and systems required..."
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      cTouched && contractorErrors.justification
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {cTouched && contractorErrors.justification && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      {contractorErrors.justification}
                    </p>
                  )}
                </div>
              </div>

              {/* NDA Compliance Gate */}
              <div
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl border p-3.5 text-xs',
                  cTouched && contractorErrors.nda
                    ? 'border-rose-300 bg-rose-50/50'
                    : 'border-slate-200 bg-[#F8FAFC]'
                )}
              >
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    NDA &amp; Background Clearance Verified *
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Mandatory legal gate prior to B2B identity creation.
                  </div>
                  {cTouched && contractorErrors.nda && (
                    <div className="mt-1 text-[11px] font-medium text-rose-600">
                      {contractorErrors.nda}
                    </div>
                  )}
                </div>
                <Switch.Root
                  checked={cNdaVerified}
                  onCheckedChange={setCNdaVerified}
                  className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>

              {/* Selectable Approval Workflow Picker */}
              <div className="space-y-2.5 rounded-xl border border-sky-200/80 bg-sky-50/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>Select Pre-Creation Approval Workflow *</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {selectedContractorWf.stages.length} stage
                    {selectedContractorWf.stages.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CONTRACTOR_ONBOARDING_WORKFLOWS.map((wf) => (
                    <button
                      key={wf.id}
                      type="button"
                      onClick={() => setCWorkflowId(wf.id)}
                      className={cn(
                        'cursor-pointer rounded-xl border p-3 text-left transition-all',
                        cWorkflowId === wf.id
                          ? 'border-[#0EA5E9] bg-white ring-1 ring-sky-200'
                          : 'border-slate-200 bg-white/70 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold text-[#0284C7]">
                          {wf.code}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] text-slate-600">
                          {wf.stages.length} stage{wf.stages.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-bold text-[#0F172A]">{wf.name}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{wf.description}</div>
                    </button>
                  ))}
                </div>

                {cTouched && contractorErrors.workflow && (
                  <p className="text-[11px] font-semibold text-rose-600">
                    {contractorErrors.workflow}
                  </p>
                )}

                {/* Visual Stage Pipeline */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  {selectedContractorWf.stages.map((st, idx) => (
                    <div key={st.approverRole} className="flex items-center gap-1.5">
                      {idx > 0 && <ArrowRight className="h-3 w-3 text-slate-400" />}
                      <span className="rounded-lg border border-sky-200 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0F172A]">
                        {idx + 1}. {st.approverRole}
                      </span>
                    </div>
                  ))}
                  <ArrowRight className="h-3 w-3 text-emerald-500" />
                  <span className="rounded-lg bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                    Create Contractor
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Submit Contractor for Approval</span>
                </button>
              </div>
            </form>

            {/* Live Contractor Approval Queue */}
            <div className="space-y-3 xl:col-span-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Contractor Approval Queue ({contractorRequests.length})
                </h2>
                <span className="font-mono text-[10px] text-slate-400">
                  Created only after final approval
                </span>
              </div>

              {contractorRequests.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'space-y-3 rounded-2xl border bg-white p-4 shadow-xs',
                    req.status === 'Approved & Created'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : req.status === 'Rejected'
                        ? 'border-rose-200 bg-rose-50/20'
                        : 'border-slate-200'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          {req.requestCode}
                        </span>
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                          {req.workflowCode}
                        </span>
                      </div>
                      <div className="mt-1 font-heading text-sm font-bold text-[#0F172A]">
                        {req.firstName} {req.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {req.title} · {req.vendorCompany}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {req.email} · {req.startDate} → {req.endDate} ({req.durationDays}d)
                      </div>
                    </div>

                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                        req.status === 'Approved & Created'
                          ? 'bg-emerald-100 text-emerald-700'
                          : req.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {req.status}
                    </span>
                  </div>

                  {/* Stage-by-Stage Approval Progress */}
                  <div className="space-y-1.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
                    <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                      Workflow: {req.workflowName}
                    </div>
                    {req.stages.map((st) => (
                      <div
                        key={st.step}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-mono text-[10px] font-bold text-[#0284C7]">
                            {st.step}:
                          </span>{' '}
                          <span className="font-medium text-[#0F172A]">{st.approverRole}</span>{' '}
                          <span className="text-[11px] text-slate-400">({st.assignee})</span>
                        </div>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[9px] font-bold',
                            st.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : st.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : st.status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-200 text-slate-500'
                          )}
                        >
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {req.status === 'Pending Approval' ? (
                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => advanceContractorApproval(req.id, 'reject')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => advanceContractorApproval(req.id, 'approve-stage')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve Next Stage</span>
                      </button>
                    </div>
                  ) : (
                    req.createdPersonId && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPersonId(req.createdPersonId!);
                            setActiveSection('people');
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          <span>Inspect Created Contractor in People</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>

        {/* ===================== TAB 2: ENTITLEMENT ONBOARDING ==================== */}
        <Tabs.Content value="entitlement" className="focus:outline-none">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            {/* Validated Entitlement Request Form */}
            <form
              onSubmit={handleEntitlementSubmit}
              className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs xl:col-span-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-[#0F172A]">
                    New Entitlement Catalog Onboarding
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enforces naming conventions, duplicate prevention, mandatory owner (GA-CTRL-01), Critical 90d SLA &amp; multi-stage SoD approval before publishing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillEntitlementSample}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#0284C7] hover:bg-sky-100"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Load Valid Sample</span>
                </button>
              </div>

              {eTouched && Object.keys(entitlementErrors).length > 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div>
                    <strong className="font-semibold">
                      Governance validation blocked submission ({Object.keys(entitlementErrors).length}{' '}
                      issue{Object.keys(entitlementErrors).length === 1 ? '' : 's'}):
                    </strong>{' '}
                    Resolve all policy checks below before routing for approval.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Entitlement Name *
                  </label>
                  <input
                    type="text"
                    value={eName}
                    onChange={(e) => setEName(e.target.value)}
                    placeholder="e.g. AWS:IAM::FinanceDataLakeReadOnly"
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      eTouched && entitlementErrors.name
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {eTouched && entitlementErrors.name && (
                    <p className="mt-1 text-[11px] text-rose-600">{entitlementErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Target Connected Application *
                  </label>
                  <select
                    value={eApp}
                    onChange={(e) => setEApp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    {TARGET_APPS.map((app) => (
                      <option key={app} value={app}>
                        {app} {TIER0_APPS.has(app) ? '(Tier-0)' : '(Tier-1)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Technical Identifier (DN / ARN / SAP Role / SKU) *
                  </label>
                  <input
                    type="text"
                    value={eTechId}
                    onChange={(e) => setETechId(e.target.value)}
                    placeholder="e.g. arn:aws:sso:::permissionSet/fin-datalake-ro-jhb"
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      eTouched && entitlementErrors.techId
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {eTouched && entitlementErrors.techId && (
                    <p className="mt-1 text-[11px] text-rose-600">{entitlementErrors.techId}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Entitlement Type
                  </label>
                  <select
                    value={eType}
                    onChange={(e) =>
                      setEType(
                        e.target.value as DemoEntitlementOnboardingRequest['entitlementType']
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    <option value="SAP Role">SAP Role</option>
                    <option value="AD Security Group">AD Security Group</option>
                    <option value="AWS Permission Set">AWS Permission Set</option>
                    <option value="Snowflake Privilege">Snowflake Privilege</option>
                    <option value="Entra ID License">Entra ID License</option>
                    <option value="App Permission">App Permission</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Accountable Entitlement Owner (GA-CTRL-01) *
                  </label>
                  <select
                    value={eOwner}
                    onChange={(e) => setEOwner(e.target.value)}
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]',
                      eTouched && entitlementErrors.owner
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200'
                    )}
                  >
                    <option value="">-- Select Accountable Owner --</option>
                    {SPONSORS.map((sp) => (
                      <option key={sp.id} value={sp.name}>
                        {sp.name} ({sp.role})
                      </option>
                    ))}
                  </select>
                  {eTouched && entitlementErrors.owner && (
                    <p className="mt-1 text-[11px] text-rose-600">{entitlementErrors.owner}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Sensitivity Classification *
                  </label>
                  <select
                    value={eSensitivity}
                    onChange={(e) =>
                      setESensitivity(e.target.value as 'Standard' | 'High' | 'Critical')
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                  >
                    <option value="Standard">Standard</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Requires 90d SLA + SoD Workflow)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Recertification Cadence *
                  </label>
                  <select
                    value={eRecertDays}
                    onChange={(e) =>
                      setERecertDays(Number(e.target.value) as 90 | 180 | 365)
                    }
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]',
                      eTouched && entitlementErrors.recert
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200'
                    )}
                  >
                    <option value={90}>90 days (Quarterly)</option>
                    <option value={180}>180 days (Semi-Annual)</option>
                    <option value={365}>365 days (Annual)</option>
                  </select>
                  {eTouched && entitlementErrors.recert && (
                    <p className="mt-1 text-[11px] text-rose-600">{entitlementErrors.recert}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Business Description &amp; Privilege Scope *
                  </label>
                  <textarea
                    rows={2}
                    value={eDesc}
                    onChange={(e) => setEDesc(e.target.value)}
                    placeholder="Document exact permissions granted and intended business personas..."
                    className={cn(
                      'mt-1 w-full rounded-xl border bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none',
                      eTouched && entitlementErrors.description
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-200 focus:border-[#0EA5E9]'
                    )}
                  />
                  {eTouched && entitlementErrors.description && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      {entitlementErrors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* SoD Declaration & Catalog Toggles */}
              <div className="space-y-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#0F172A]">
                      SoD Conflict Matrix Assessed *
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mandatory for Tier-0 applications and High/Critical entitlements.
                    </div>
                    {eTouched && entitlementErrors.sod && (
                      <div className="mt-1 text-[11px] font-medium text-rose-600">
                        {entitlementErrors.sod}
                      </div>
                    )}
                  </div>
                  <Switch.Root
                    checked={eSodChecked}
                    onCheckedChange={setESodChecked}
                    className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                  >
                    <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                  </Switch.Root>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3">
                  <div>
                    <div className="font-semibold text-[#0F172A]">
                      Publish to Self-Service Request Catalog
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Allow eligible identities to request this entitlement post-approval.
                    </div>
                  </div>
                  <Switch.Root
                    checked={eRequestable}
                    onCheckedChange={setERequestable}
                    className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                  >
                    <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                  </Switch.Root>
                </div>
              </div>

              {/* Selectable Entitlement Approval Workflow */}
              <div className="space-y-2.5 rounded-xl border border-sky-200/80 bg-sky-50/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#0284C7] uppercase">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>Select Pre-Creation Approval Workflow *</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {selectedEntitlementWf.stages.length} stage
                    {selectedEntitlementWf.stages.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {ENTITLEMENT_ONBOARDING_WORKFLOWS.map((wf) => (
                    <button
                      key={wf.id}
                      type="button"
                      onClick={() => setEWorkflowId(wf.id)}
                      className={cn(
                        'cursor-pointer rounded-xl border p-3 text-left transition-all',
                        eWorkflowId === wf.id
                          ? 'border-[#0EA5E9] bg-white ring-1 ring-sky-200'
                          : 'border-slate-200 bg-white/70 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold text-[#0284C7]">
                          {wf.code}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] text-slate-600">
                          {wf.stages.length} stage{wf.stages.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-bold text-[#0F172A]">{wf.name}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{wf.description}</div>
                    </button>
                  ))}
                </div>

                {eTouched && entitlementErrors.workflow && (
                  <p className="text-[11px] font-semibold text-rose-600">
                    {entitlementErrors.workflow}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  {selectedEntitlementWf.stages.map((st, idx) => (
                    <div key={st.approverRole} className="flex items-center gap-1.5">
                      {idx > 0 && <ArrowRight className="h-3 w-3 text-slate-400" />}
                      <span className="rounded-lg border border-sky-200 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0F172A]">
                        {idx + 1}. {st.approverRole}
                      </span>
                    </div>
                  ))}
                  <ArrowRight className="h-3 w-3 text-emerald-500" />
                  <span className="rounded-lg bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                    Publish Entitlement
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Submit Entitlement for Approval</span>
                </button>
              </div>
            </form>

            {/* Live Entitlement Approval Queue */}
            <div className="space-y-3 xl:col-span-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-[#0F172A]">
                  Entitlement Approval Queue ({entitlementRequests.length})
                </h2>
                <span className="font-mono text-[10px] text-slate-400">
                  Published only after final approval
                </span>
              </div>

              {entitlementRequests.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'space-y-3 rounded-2xl border bg-white p-4 shadow-xs',
                    req.status === 'Approved & Created'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : req.status === 'Rejected'
                        ? 'border-rose-200 bg-rose-50/20'
                        : 'border-slate-200'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          {req.requestCode}
                        </span>
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7]">
                          {req.workflowCode}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                            req.sensitivity === 'Critical'
                              ? 'bg-rose-50 text-rose-600'
                              : req.sensitivity === 'High'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {req.sensitivity}
                        </span>
                      </div>
                      <div className="mt-1 truncate font-mono text-xs font-bold text-[#0F172A]">
                        {req.entitlementName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {req.application} · Owner: {req.owner} · {req.recertificationDays}d SLA
                      </div>
                    </div>

                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold',
                        req.status === 'Approved & Created'
                          ? 'bg-emerald-100 text-emerald-700'
                          : req.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {req.status}
                    </span>
                  </div>

                  {/* Stage Progress */}
                  <div className="space-y-1.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
                    <div className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                      Workflow: {req.workflowName}
                    </div>
                    {req.stages.map((st) => (
                      <div
                        key={st.step}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-mono text-[10px] font-bold text-[#0284C7]">
                            {st.step}:
                          </span>{' '}
                          <span className="font-medium text-[#0F172A]">{st.approverRole}</span>{' '}
                          <span className="text-[11px] text-slate-400">({st.assignee})</span>
                        </div>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[9px] font-bold',
                            st.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : st.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : st.status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-200 text-slate-500'
                          )}
                        >
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {req.status === 'Pending Approval' ? (
                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => advanceEntitlementApproval(req.id, 'reject')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => advanceEntitlementApproval(req.id, 'approve-stage')}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve Next Stage</span>
                      </button>
                    </div>
                  ) : (
                    req.createdEntitlementId && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveSection('entitlements')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          <span>View Published Entitlement in Catalog</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
