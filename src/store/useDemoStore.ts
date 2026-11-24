import { create } from 'zustand';
import {
  CONTRACTOR_ONBOARDING_WORKFLOWS,
  ENTITLEMENT_ONBOARDING_WORKFLOWS,
  INITIAL_CONTRACTOR_REQUESTS,
  INITIAL_DEMO_ACCOUNTS,
  INITIAL_DEMO_APPS,
  INITIAL_DEMO_AUDIT,
  INITIAL_DEMO_BIRTHRIGHTS,
  INITIAL_DEMO_ENTITLEMENTS,
  INITIAL_DEMO_NON_HUMAN,
  INITIAL_DEMO_PEOPLE,
  INITIAL_DEMO_POLICIES,
  INITIAL_DEMO_REVIEWS,
  INITIAL_DEMO_ROLES,
  INITIAL_EMAIL_NOTIFICATIONS,
  INITIAL_ENTITLEMENT_REQUESTS,
  INITIAL_GOVERNANCE_CONTROLS,
  INITIAL_IMPORT_RUNS,
  INITIAL_MINED_ROLES,
  INITIAL_MINING_OUTLIERS,
  INITIAL_PLATFORM_CONFIG,
  INITIAL_PROVISIONING_JOBS,
  INITIAL_ROLE_OPTIMISATIONS,
  buildBrandedIdentraEmailHtml,
  evaluateBirthrightMatches,
  type BrandedEmailTemplateInput,
  type DemoApplication,
  type DemoAuditEntry,
  type DemoBirthrightRule,
  type DemoContractorOnboardingRequest,
  type DemoEmailNotification,
  type DemoEntitlement,
  type DemoEntitlementOnboardingRequest,
  type DemoGovernanceControl,
  type DemoImportRun,
  type DemoMinedRoleCandidate,
  type DemoMiningOutlier,
  type DemoNonHuman,
  type DemoPerson,
  type DemoPolicy,
  type DemoProvisioningJob,
  type DemoReviewItem,
  type DemoRole,
  type DemoRoleOptimisationItem,
  type DemoSectionId,
  type DemoTargetAccount,
  type GovernanceControlDomain,
  type MasterEmailTemplateConfig,
  type OnboardingApprovalStage,
  type PlatformConfig,
  type SmtpConfig,
} from '@/data/demoSampleData';
import { useSceneStore } from '@/store/useSceneStore';

function timeNow(): string {
  return new Date().toTimeString().slice(0, 8);
}

interface DemoStore {
  activeSection: DemoSectionId;
  onboardingTab: 'contractor' | 'entitlement';
  searchQuery: string;
  selectedPersonId: string | null;
  toastMessage: string | null;

  people: DemoPerson[];
  nonHumans: DemoNonHuman[];
  applications: DemoApplication[];
  entitlements: DemoEntitlement[];
  roles: DemoRole[];
  minedRoles: DemoMinedRoleCandidate[];
  miningOutliers: DemoMiningOutlier[];
  roleOptimisations: DemoRoleOptimisationItem[];
  birthrights: DemoBirthrightRule[];
  accounts: DemoTargetAccount[];
  reviews: DemoReviewItem[];
  policies: DemoPolicy[];
  governanceControls: DemoGovernanceControl[];
  contractorRequests: DemoContractorOnboardingRequest[];
  entitlementRequests: DemoEntitlementOnboardingRequest[];
  provisioningJobs: DemoProvisioningJob[];
  importRuns: DemoImportRun[];
  emailNotifications: DemoEmailNotification[];
  platformConfig: PlatformConfig;
  auditLog: DemoAuditEntry[];

  setActiveSection: (section: DemoSectionId) => void;
  openOnboardingTab: (tab: 'contractor' | 'entitlement') => void;
  setSearchQuery: (q: string) => void;
  setSelectedPersonId: (id: string | null) => void;
  clearToast: () => void;

  // Contractor & Entitlement Onboarding Approval Workflow actions
  submitContractorOnboarding: (input: {
    firstName: string;
    lastName: string;
    email: string;
    vendorCompany: string;
    title: string;
    department: string;
    departmentRefId: string;
    costCenterCode: string;
    location: string;
    sponsorName: string;
    sponsorRefId: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    ndaVerified: boolean;
    justification: string;
    workflowId: string;
  }) => void;
  advanceContractorApproval: (
    requestId: string,
    decision: 'approve-stage' | 'approve-all' | 'reject'
  ) => void;

  submitEntitlementOnboarding: (input: {
    entitlementName: string;
    technicalId: string;
    application: string;
    entitlementType: DemoEntitlementOnboardingRequest['entitlementType'];
    owner: string;
    sensitivity: 'Standard' | 'High' | 'Critical';
    recertificationDays: 90 | 180 | 365;
    requestableInCatalog: boolean;
    sodChecked: boolean;
    sodConflictNote?: string;
    description: string;
    workflowId: string;
  }) => void;
  advanceEntitlementApproval: (
    requestId: string,
    decision: 'approve-stage' | 'approve-all' | 'reject'
  ) => void;

  // Governance Assurance actions
  toggleGovernanceControlEnforcement: (
    controlId: string,
    level: 'preventative' | 'detective'
  ) => void;
  remediateGovernanceViolation: (controlId: string, violationId: string) => void;
  remediateAllControlViolations: (controlId: string) => void;
  runGovernanceDetectiveScan: () => void;
  addGovernanceControl: (input: {
    name: string;
    description: string;
    domain: GovernanceControlDomain;
    severity: 'Critical' | 'High' | 'Medium';
    preventativeEnabled: boolean;
    detectiveEnabled: boolean;
  }) => void;

  // Platform Configuration actions (SMTP, Master Email Template, Provisioning & Governance)
  updateSmtpConfig: (patch: Partial<SmtpConfig>) => void;
  testSmtpConnection: () => void;
  updateMasterEmailTemplate: (patch: Partial<MasterEmailTemplateConfig>) => void;
  updateProvisioningConfig: (patch: Partial<PlatformConfig['provisioning']>) => void;
  updateGovernanceConfig: (patch: Partial<PlatformConfig['governance']>) => void;

  // Email Notification Log actions
  retryEmailNotification: (emailId: string) => void;
  resendEmailNotification: (emailId: string) => void;

  // Role Mining actions
  runRoleMiningDiscovery: () => void;
  promoteMinedRole: (candidateId: string) => void;
  resolveMiningOutlier: (outlierId: string, action: 'revoke' | 'review') => void;
  applyRoleOptimisation: (optId: string) => void;

  // Birthright Engine actions
  toggleBirthrightStatus: (ruleId: string) => void;
  addBirthrightRule: (
    rule: Omit<DemoBirthrightRule, 'id' | 'code' | 'lastEvaluated'>
  ) => void;
  deleteBirthrightRule: (ruleId: string) => void;
  runBirthrightReconciliation: (ruleId: string) => void;

  // Account & Orphan Remediation actions (Reporting)
  quarantineOrphanAccount: (accountId: string) => void;
  linkOrphanAccountToOwner: (accountId: string, personId: string) => void;

  // Import runs actions
  triggerManualImport: (system: DemoImportRun['system']) => void;
  retryFailedImport: (importId: string) => void;

  // Provisioning Engine actions
  releaseSimulatedJob: (jobId: string) => void;
  releaseSimulatedJobsBatch: (jobIds: string[]) => void;
  discardSimulatedJob: (jobId: string) => void;
  retryFailedJob: (jobId: string) => void;

  // Interactive POC actions
  onboardNewJoiner: () => void;
  movePersonDepartment: (personId: string) => void;
  offboardPerson: (personId: string) => void;
  emergencyDeactivatePerson: (personId: string, reason?: string) => void;
  mitigatePersonSod: (personId: string) => void;

  rotateNonHumanSecret: (id: string) => void;
  remediateNonHumanDrift: (id: string) => void;

  syncApplication: (appId: string) => void;
  revokeEntitlementDrift: (entId: string) => void;

  decideReviewItem: (reviewId: string, decision: 'Approved' | 'Revoked') => void;
  autoCompleteReviews: () => void;

  togglePolicyEnforced: (policyId: string) => void;
  mitigatePolicyViolation: (policyId: string) => void;

  runPocScenario: (scenario: 'joiner' | 'sod' | 'orphan' | 'ai-agent') => void;
  resetAllDemoData: () => void;
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  activeSection: 'dashboard',
  onboardingTab: 'contractor',
  searchQuery: '',
  selectedPersonId: null,
  toastMessage: null,

  people: INITIAL_DEMO_PEOPLE,
  nonHumans: INITIAL_DEMO_NON_HUMAN,
  applications: INITIAL_DEMO_APPS,
  entitlements: INITIAL_DEMO_ENTITLEMENTS,
  roles: INITIAL_DEMO_ROLES,
  minedRoles: INITIAL_MINED_ROLES,
  miningOutliers: INITIAL_MINING_OUTLIERS,
  roleOptimisations: INITIAL_ROLE_OPTIMISATIONS,
  birthrights: INITIAL_DEMO_BIRTHRIGHTS,
  accounts: INITIAL_DEMO_ACCOUNTS,
  reviews: INITIAL_DEMO_REVIEWS,
  policies: INITIAL_DEMO_POLICIES,
  governanceControls: INITIAL_GOVERNANCE_CONTROLS,
  contractorRequests: INITIAL_CONTRACTOR_REQUESTS,
  entitlementRequests: INITIAL_ENTITLEMENT_REQUESTS,
  provisioningJobs: INITIAL_PROVISIONING_JOBS,
  importRuns: INITIAL_IMPORT_RUNS,
  emailNotifications: INITIAL_EMAIL_NOTIFICATIONS,
  platformConfig: INITIAL_PLATFORM_CONFIG,
  auditLog: INITIAL_DEMO_AUDIT,

  setActiveSection: (section) => set({ activeSection: section }),
  openOnboardingTab: (tab) => set({ activeSection: 'onboarding', onboardingTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedPersonId: (id) => set({ selectedPersonId: id }),
  clearToast: () => set({ toastMessage: null }),

  submitContractorOnboarding: (input) => {
    const wf =
      CONTRACTOR_ONBOARDING_WORKFLOWS.find((w) => w.id === input.workflowId) ??
      CONTRACTOR_ONBOARDING_WORKFLOWS[0];
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const reqCode = `CTR-REQ-${402 + get().contractorRequests.length}`;
    const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`;

    const stages: OnboardingApprovalStage[] = wf.stages.map((st, idx) => ({
      step: `Stage ${idx + 1}`,
      approverRole: st.approverRole,
      assignee: st.assignee === 'Selected Sponsor' ? input.sponsorName : st.assignee,
      status: idx === 0 ? 'Pending' : 'Queued',
    }));

    const newReq: DemoContractorOnboardingRequest = {
      id: `ctr-req-${Date.now()}`,
      requestCode: reqCode,
      ...input,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      workflowCode: wf.code,
      workflowName: wf.name,
      stages,
      status: 'Pending Approval',
      submittedAt: `${today} ${stamp.slice(0, 5)}`,
    };

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const sponsorEmail = `${input.sponsorName.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`;
    const tplData: BrandedEmailTemplateInput = {
      badgeText: `APPROVAL REQUIRED · ${wf.code}`,
      badgeTone: 'sky',
      headline: `Contractor Onboarding Approval Needed: ${fullName}`,
      greeting: `Hi ${stages[0].assignee},`,
      intro: `A new external contractor onboarding request (${reqCode}) has been submitted and requires your Stage 1 approval under workflow "${wf.name}" before the identity is created.`,
      metadataRows: [
        { label: 'Request Code', value: reqCode, mono: true },
        { label: 'Contractor', value: `${fullName} (${input.title})` },
        { label: 'Vendor Partner', value: input.vendorCompany },
        { label: 'Contract Window', value: `${input.startDate} → ${input.endDate} (${input.durationDays}d)`, mono: true },
        { label: 'Selected Workflow', value: `${wf.name} (${wf.code})`, mono: true },
        { label: 'Internal Sponsor', value: input.sponsorName },
      ],
      calloutTitle: 'Pre-Creation Governance Gate Active',
      calloutText: `No accounts will be created until all ${stages.length} approval stage(s) are completed. NDA & background clearance verified.`,
      ctaLabel: 'Review & Approve Onboarding',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const emailNotif: DemoEmailNotification = {
      id: `eml-ctr-req-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Contractor Onboarding Submitted · ${wf.name} (${wf.code})`,
      triggerCategory: 'JML Lifecycle',
      recipientName: stages[0].assignee,
      recipientEmail: sponsorEmail,
      recipientRole: stages[0].approverRole,
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Approval Required (${reqCode}): Onboard Contractor ${fullName}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 205,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      contractorRequests: [newReq, ...s.contractorRequests],
      emailNotifications: [emailNotif, ...s.emailNotifications],
      toastMessage: `Submitted ${reqCode} for ${fullName} — awaiting ${wf.name} approval before contractor creation.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Onboarding Portal',
          processTag: 'CTR-REQ',
          tone: 'sky',
          action: `Submitted contractor onboarding (${reqCode}) via ${wf.code} (${wf.name})`,
          target: fullName,
        },
        ...s.auditLog,
      ],
    }));
  },

  advanceContractorApproval: (requestId, decision) => {
    const req = get().contractorRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending Approval') return;

    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const fullName = `${req.firstName} ${req.lastName}`;
    const pendingIdx = req.stages.findIndex((st) => st.status === 'Pending');
    if (pendingIdx === -1) return;

    if (decision === 'reject') {
      const rejectedStages = req.stages.map((st, idx) =>
        idx === pendingIdx
          ? { ...st, status: 'Rejected' as const, decidedAt: `${today} ${stamp.slice(0, 5)}` }
          : st
      );
      set((s) => ({
        contractorRequests: s.contractorRequests.map((r) =>
          r.id === requestId
            ? { ...r, stages: rejectedStages, status: 'Rejected' }
            : r
        ),
        toastMessage: `Rejected contractor onboarding ${req.requestCode} (${fullName}) — no identity or accounts created.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: req.stages[pendingIdx].assignee,
            processTag: 'CTR-REJ',
            tone: 'rose',
            action: `Rejected ${req.requestCode} at ${req.stages[pendingIdx].step} (${req.workflowCode})`,
            target: fullName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    const approveAll = decision === 'approve-all';
    const nextStages: OnboardingApprovalStage[] = req.stages.map((st, idx) => {
      if (approveAll) {
        return st.status === 'Approved'
          ? st
          : { ...st, status: 'Approved', decidedAt: `${today} ${stamp.slice(0, 5)}` };
      }
      if (idx === pendingIdx) {
        return { ...st, status: 'Approved', decidedAt: `${today} ${stamp.slice(0, 5)}` };
      }
      if (idx === pendingIdx + 1) {
        return { ...st, status: 'Pending' };
      }
      return st;
    });

    const allApproved = nextStages.every((st) => st.status === 'Approved');

    if (!allApproved) {
      const nextPending = nextStages.find((st) => st.status === 'Pending');
      set((s) => ({
        contractorRequests: s.contractorRequests.map((r) =>
          r.id === requestId ? { ...r, stages: nextStages } : r
        ),
        toastMessage: `Approved ${req.stages[pendingIdx].step} for ${req.requestCode} — routed to ${nextPending?.approverRole ?? 'next stage'}.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: req.stages[pendingIdx].assignee,
            processTag: 'CTR-APR',
            tone: 'sky',
            action: `Approved ${req.stages[pendingIdx].step} of ${req.requestCode}; awaiting ${nextPending?.approverRole}`,
            target: fullName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    // Final stage approved -> CREATE the Contractor identity, account, provisioning job & confirmation email!
    const ctrNumber = `CTR-${90220 + get().people.length}`;
    const sam = `${req.firstName[0] ?? 'c'}${req.lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '') + '_ext';
    const newPersonId = `p-ctr-${Date.now()}`;
    const newContractor: DemoPerson = {
      id: newPersonId,
      firstName: req.firstName,
      lastName: req.lastName,
      name: fullName,
      employeeNumber: ctrNumber,
      email: req.email,
      upn: `${sam}#EXT#@corp.identra.net`,
      samAccountName: sam,
      title: req.title,
      department: req.department,
      departmentRefId: req.departmentRefId,
      companyName: req.vendorCompany,
      companyRefId: 'comp-ext-audit',
      orgUnitName: 'External Contractors & Auditors',
      orgUnitRefId: 'ou-ext-contractors',
      costCenterCode: req.costCenterCode,
      costCenterRefId: 'cc-9001',
      location: req.location,
      type: 'Contractor',
      contractType: `Fixed-Term External Contractor (${req.durationDays}d)`,
      hrStartDate: req.startDate,
      hrEndDate: req.endDate,
      sourceSystem: 'B2B Partner Lifecycle Portal',
      sourceRefId: 'src-b2b',
      sourceExternalId: req.requestCode,
      lastHrSync: `Today · ${stamp}`,
      jmlStatus: 'Joiner',
      riskScore: 18,
      roles: ['External B2B Guest Profile', 'Corporate SSO Standard'],
      applications: ['Active Directory', 'Microsoft Entra ID'],
      manager: req.sponsorName,
      managerRefId: req.sponsorRefId,
      contextRefIds: ['ctx-ext-audit'],
      lastAttestation: `Approved via ${req.workflowCode} (${req.workflowName})`,
      changeHistory: [
        {
          id: `h-ctr-${Date.now()}`,
          timestamp: `${today} ${stamp}`,
          source: `Contractor Onboarding (${req.workflowCode})`,
          category: 'JML Lifecycle',
          summary: `Contractor ${ctrNumber} created after completing ${req.stages.length}-stage workflow "${req.workflowName}". Auto-expiry locked to ${req.endDate}.`,
          changes: [
            { field: 'identityType', before: null, after: 'Contractor (B2B)' },
            { field: 'approvalWorkflow', before: null, after: `${req.workflowName} (${req.workflowCode})` },
            { field: 'contractWindow', before: null, after: `${req.startDate} → ${req.endDate}` },
            { field: 'sponsor', before: null, after: req.sponsorName },
          ],
        },
      ],
    };

    const newAccount: DemoTargetAccount = {
      id: `acc-ctr-${Date.now()}`,
      accountName: newContractor.upn,
      application: 'Microsoft Entra ID',
      accountType: 'Contractor',
      personId: newPersonId,
      correlatedIdentity: fullName,
      correlationState: 'Correlated',
      accountStatus: 'Enabled',
      privileged: false,
      lastLogin: 'Provisioned just now',
      daysInactive: 0,
      riskScore: 18,
    };

    const newProvJob: DemoProvisioningJob = {
      id: `job-ctr-${Date.now()}`,
      jobCode: `PRV-${9140 + get().provisioningJobs.length}`,
      identity: fullName,
      identityEmail: req.email,
      entitlementOrRole: `Entra B2B Guest + AD OU=Contractors (${req.requestCode})`,
      application: 'Active Directory',
      operation: 'Create',
      status: 'Completed',
      triggeredBy: `Contractor Onboarding (${req.workflowCode})`,
      timestamp: stamp,
      durationMs: 245,
      mappings: [
        { attribute: 'sAMAccountName', before: null, after: sam, rule: 'B2B.Contractor.SamGen' },
        { attribute: 'accountExpires', before: null, after: req.endDate, rule: 'B2B.HardExpiry.Enforced' },
        { attribute: 'distinguishedName', before: null, after: 'OU=Contractors,DC=identra,DC=corp', rule: 'BR-006.QuarantineOU' },
      ],
    };

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const tplData: BrandedEmailTemplateInput = {
      badgeText: 'CONTRACTOR ONBOARDED',
      badgeTone: 'emerald',
      headline: `Welcome ${req.firstName} — Your B2B Contractor Account Is Active`,
      greeting: `Hello ${fullName},`,
      intro: `All approval stages under ${req.workflowName} (${req.workflowCode}) have been completed. Your federated contractor identity (${ctrNumber}) has been provisioned in OU=Contractors with hard expiry on ${req.endDate}.`,
      metadataRows: [
        { label: 'Contractor ID', value: ctrNumber, mono: true },
        { label: 'Federated UPN', value: newContractor.upn, mono: true },
        { label: 'Vendor Partner', value: req.vendorCompany },
        { label: 'Accountable Sponsor', value: req.sponsorName },
        { label: 'Auto-Offboard Date', value: req.endDate, mono: true },
      ],
      calloutTitle: 'Time-Bound Access Governance',
      calloutText: `In accordance with policy JML-OFF-001, your access will automatically deactivate at 23:59 UTC on ${req.endDate} unless extended by ${req.sponsorName}.`,
      ctaLabel: 'Activate B2B Guest Access',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const welcomeEmail: DemoEmailNotification = {
      id: `eml-ctr-ok-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Contractor Approved & Created · ${req.requestCode} (${req.workflowCode})`,
      triggerCategory: 'JML Lifecycle',
      recipientName: fullName,
      recipientEmail: req.email,
      recipientRole: `External Contractor (${req.vendorCompany})`,
      cc: [`${req.sponsorName.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`],
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Contractor Onboarding Complete — ${fullName} (${ctrNumber})`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 218,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      contractorRequests: s.contractorRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              stages: nextStages,
              status: 'Approved & Created',
              createdPersonId: newPersonId,
            }
          : r
      ),
      people: [newContractor, ...s.people],
      accounts: [newAccount, ...s.accounts],
      provisioningJobs: [newProvJob, ...s.provisioningJobs],
      emailNotifications: [welcomeEmail, ...s.emailNotifications],
      toastMessage: `Approved ${req.requestCode} — created contractor ${fullName} (${ctrNumber}) in People & provisioned B2B accounts.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Contractor Onboarding',
          processTag: 'CTR-NEW',
          tone: 'emerald',
          action: `Completed ${req.workflowCode} approval & created contractor ${ctrNumber} (expires ${req.endDate})`,
          target: fullName,
        },
        ...s.auditLog,
      ],
    }));
  },

  submitEntitlementOnboarding: (input) => {
    const wf =
      ENTITLEMENT_ONBOARDING_WORKFLOWS.find((w) => w.id === input.workflowId) ??
      ENTITLEMENT_ONBOARDING_WORKFLOWS[0];
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const reqCode = `ENT-REQ-${810 + get().entitlementRequests.length}`;

    const stages: OnboardingApprovalStage[] = wf.stages.map((st, idx) => ({
      step: `Stage ${idx + 1}`,
      approverRole: st.approverRole,
      assignee: st.assignee === 'Selected Owner' ? input.owner : st.assignee,
      status: idx === 0 ? 'Pending' : 'Queued',
    }));

    const newReq: DemoEntitlementOnboardingRequest = {
      id: `ent-req-${Date.now()}`,
      requestCode: reqCode,
      ...input,
      entitlementName: input.entitlementName.trim(),
      technicalId: input.technicalId.trim(),
      workflowCode: wf.code,
      workflowName: wf.name,
      stages,
      status: 'Pending Approval',
      submittedAt: `${today} ${stamp.slice(0, 5)}`,
    };

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const tplData: BrandedEmailTemplateInput = {
      badgeText: `ENTITLEMENT APPROVAL · ${wf.code}`,
      badgeTone: input.sensitivity === 'Critical' ? 'amber' : 'sky',
      headline: `New Entitlement Onboarding Request: ${newReq.entitlementName}`,
      greeting: `Hi ${stages[0].assignee},`,
      intro: `A request to onboard "${newReq.entitlementName}" into the IDENTRA Entitlements Catalog has passed pre-submission governance validation and requires your approval under "${wf.name}".`,
      metadataRows: [
        { label: 'Request Code', value: reqCode, mono: true },
        { label: 'Entitlement Name', value: newReq.entitlementName, mono: true },
        { label: 'Target Application', value: newReq.application },
        { label: 'Accountable Owner', value: newReq.owner },
        { label: 'Sensitivity & SLA', value: `${newReq.sensitivity} · Recertify every ${newReq.recertificationDays}d`, mono: true },
        { label: 'Selected Workflow', value: `${wf.name} (${wf.code})`, mono: true },
      ],
      calloutTitle: 'Governance Assurance GA-CTRL-01 Verified',
      calloutText: `Accountable owner (${newReq.owner}), technical ID, and sensitivity recertification cadence validated before approval routing.`,
      ctaLabel: 'Review Entitlement Request',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const emailNotif: DemoEmailNotification = {
      id: `eml-ent-req-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Entitlement Onboarding Submitted · ${wf.name} (${wf.code})`,
      triggerCategory: 'Access Review',
      recipientName: stages[0].assignee,
      recipientEmail: 'app-governance@identra-corp.io',
      recipientRole: stages[0].approverRole,
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Approval Required (${reqCode}): Onboard Entitlement ${newReq.entitlementName}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 189,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      entitlementRequests: [newReq, ...s.entitlementRequests],
      emailNotifications: [emailNotif, ...s.emailNotifications],
      toastMessage: `Submitted ${reqCode} for "${newReq.entitlementName}" — awaiting ${wf.name} approval before catalog creation.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Entitlement Onboarding',
          processTag: 'ENT-REQ',
          tone: 'sky',
          action: `Submitted entitlement onboarding (${reqCode}) via ${wf.code} (${wf.name})`,
          target: newReq.entitlementName,
        },
        ...s.auditLog,
      ],
    }));
  },

  advanceEntitlementApproval: (requestId, decision) => {
    const req = get().entitlementRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending Approval') return;

    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const pendingIdx = req.stages.findIndex((st) => st.status === 'Pending');
    if (pendingIdx === -1) return;

    if (decision === 'reject') {
      const rejectedStages = req.stages.map((st, idx) =>
        idx === pendingIdx
          ? { ...st, status: 'Rejected' as const, decidedAt: `${today} ${stamp.slice(0, 5)}` }
          : st
      );
      set((s) => ({
        entitlementRequests: s.entitlementRequests.map((r) =>
          r.id === requestId
            ? { ...r, stages: rejectedStages, status: 'Rejected' }
            : r
        ),
        toastMessage: `Rejected entitlement onboarding ${req.requestCode} (${req.entitlementName}) — not added to catalog.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: req.stages[pendingIdx].assignee,
            processTag: 'ENT-REJ',
            tone: 'rose',
            action: `Rejected ${req.requestCode} at ${req.stages[pendingIdx].step} (${req.workflowCode})`,
            target: req.entitlementName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    const approveAll = decision === 'approve-all';
    const nextStages: OnboardingApprovalStage[] = req.stages.map((st, idx) => {
      if (approveAll) {
        return st.status === 'Approved'
          ? st
          : { ...st, status: 'Approved', decidedAt: `${today} ${stamp.slice(0, 5)}` };
      }
      if (idx === pendingIdx) {
        return { ...st, status: 'Approved', decidedAt: `${today} ${stamp.slice(0, 5)}` };
      }
      if (idx === pendingIdx + 1) {
        return { ...st, status: 'Pending' };
      }
      return st;
    });

    const allApproved = nextStages.every((st) => st.status === 'Approved');

    if (!allApproved) {
      const nextPending = nextStages.find((st) => st.status === 'Pending');
      set((s) => ({
        entitlementRequests: s.entitlementRequests.map((r) =>
          r.id === requestId ? { ...r, stages: nextStages } : r
        ),
        toastMessage: `Approved ${req.stages[pendingIdx].step} for ${req.requestCode} — routed to ${nextPending?.approverRole ?? 'next stage'}.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: req.stages[pendingIdx].assignee,
            processTag: 'ENT-APR',
            tone: 'sky',
            action: `Approved ${req.stages[pendingIdx].step} of ${req.requestCode}; awaiting ${nextPending?.approverRole}`,
            target: req.entitlementName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    // Final stage approved -> CREATE live DemoEntitlement in Entitlements catalog!
    const newEntId = `ent-onb-${Date.now()}`;
    const createdEntitlement: DemoEntitlement = {
      id: newEntId,
      name: req.entitlementName,
      application: req.application,
      assignedTo: `Catalog Ready · Owner: ${req.owner}`,
      source: 'Business Role',
      sensitivity: req.sensitivity,
      status: 'Reconciled',
    };

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const ownerEmail = `${req.owner.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`;
    const tplData: BrandedEmailTemplateInput = {
      badgeText: 'ENTITLEMENT PUBLISHED',
      badgeTone: 'emerald',
      headline: `Entitlement Onboarded to Catalog: ${req.entitlementName}`,
      greeting: `Hi ${req.owner},`,
      intro: `All approval stages under ${req.workflowName} (${req.workflowCode}) have passed. "${req.entitlementName}" is now live and governed in the IDENTRA Entitlements Catalog.`,
      metadataRows: [
        { label: 'Request Code', value: req.requestCode, mono: true },
        { label: 'Entitlement', value: req.entitlementName, mono: true },
        { label: 'Technical ID', value: req.technicalId, mono: true },
        { label: 'Target System', value: req.application },
        { label: 'Sensitivity & Review', value: `${req.sensitivity} · Every ${req.recertificationDays} days`, mono: true },
        { label: 'Self-Service Catalog', value: req.requestableInCatalog ? 'Enabled' : 'Restricted (Role-Only)' },
      ],
      ctaLabel: 'View Entitlements Catalog',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const notifEmail: DemoEmailNotification = {
      id: `eml-ent-ok-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Entitlement Approved & Published · ${req.requestCode} (${req.workflowCode})`,
      triggerCategory: 'Access Review',
      recipientName: req.owner,
      recipientEmail: ownerEmail,
      recipientRole: 'Entitlement Owner',
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Entitlement Onboarded: ${req.entitlementName} (${req.application})`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 174,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      entitlementRequests: s.entitlementRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              stages: nextStages,
              status: 'Approved & Created',
              createdEntitlementId: newEntId,
            }
          : r
      ),
      entitlements: [createdEntitlement, ...s.entitlements],
      applications: s.applications.map((app) =>
        app.name === req.application
          ? { ...app, entitlements: app.entitlements + 1 }
          : app
      ),
      emailNotifications: [notifEmail, ...s.emailNotifications],
      toastMessage: `Approved ${req.requestCode} — published "${req.entitlementName}" to Entitlements Catalog (Owner: ${req.owner}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Entitlement Onboarding',
          processTag: 'ENT-NEW',
          tone: 'emerald',
          action: `Completed ${req.workflowCode} approval & published entitlement (${req.sensitivity}, ${req.recertificationDays}d SLA)`,
          target: req.entitlementName,
        },
        ...s.auditLog,
      ],
    }));
  },

  runRoleMiningDiscovery: () => {
    const candidates = get().minedRoles.filter((m) => m.status === 'Recommended').length;
    const outliers = get().miningOutliers.filter((o) => o.status === 'Flagged').length;
    set((s) => ({
      toastMessage: `Role Mining analyzed 500 identities: ${candidates} role recommendation(s) and ${outliers} peer outlier(s) refreshed.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Role Mining Engine',
          processTag: 'MINE-RUN',
          tone: 'sky',
          action: `Clustered 500 identities · ${candidates} recommended roles · ${outliers} outliers flagged`,
          target: 'Entitlement Graph',
        },
        ...s.auditLog,
      ],
    }));
  },

  promoteMinedRole: (candidateId) => {
    const cand = get().minedRoles.find((m) => m.id === candidateId);
    if (!cand || cand.status === 'Promoted') return;

    const today = new Date().toISOString().slice(0, 10);
    const deptAttr =
      cand.attributes.find((a) => a.label.toLowerCase().includes('department'))?.value ??
      'Enterprise';

    const newBusinessRole: DemoRole = {
      id: `r-mined-${Date.now()}`,
      name: cand.suggestedRoleName,
      department: deptAttr,
      description: `Promoted from Role Mining cluster ${cand.code} (${cand.confidenceScore}% confidence across ${cand.matchedIdentitiesCount} identities: ${cand.attributes.map((a) => `${a.label}=${a.value}`).join(', ')}).`,
      members: cand.matchedIdentitiesCount,
      entitlementsCount: cand.entitlements.length,
      owner: 'Role Mining Governance',
      sodSensitive: false,
      includedApps: Array.from(new Set(cand.entitlements.map((e) => e.application))),
      memberList: cand.simulationSample.map((sim, idx) => ({
        id: `rm-mined-${Date.now()}-${idx}`,
        name: sim.name,
        email: `${sim.name.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`,
        title: sim.title,
        department: deptAttr,
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: today,
        status: 'Active',
      })),
      entitlementList: cand.entitlements.map((ent, idx) => ({
        id: `re-mined-${Date.now()}-${idx}`,
        name: ent.name,
        application: ent.application,
        type: ent.application.includes('SAP')
          ? 'SAP Role'
          : ent.application.includes('Active Directory')
            ? 'AD Security Group'
            : ent.application.includes('AWS')
              ? 'AWS Permission Set'
              : 'App Permission',
        technicalId: ent.technicalId,
        sensitivity: 'Standard',
      })),
    };

    set((s) => ({
      minedRoles: s.minedRoles.map((m) =>
        m.id === candidateId ? { ...m, status: 'Promoted' } : m
      ),
      roles: [newBusinessRole, ...s.roles],
      toastMessage: `Promoted "${cand.suggestedRoleName}" to live ${cand.roleKind}s (${cand.matchedIdentitiesCount} identities · ${cand.entitlements.length} entitlements).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Role Mining Engine',
          processTag: 'ROLE-NEW',
          tone: 'emerald',
          action: `Promoted mined cluster ${cand.code} (${cand.confidenceScore}% confidence) into governed role`,
          target: cand.suggestedRoleName,
        },
        ...s.auditLog,
      ],
    }));
  },

  resolveMiningOutlier: (outlierId, action) => {
    const out = get().miningOutliers.find((o) => o.id === outlierId);
    if (!out || out.status !== 'Flagged') return;

    const stamp = timeNow();
    const today = new Date().toISOString().slice(0, 10);

    const newReview: DemoReviewItem | null =
      action === 'review'
        ? {
            id: `rev-out-${Date.now()}`,
            identity: out.identityName,
            identityTitle: out.peerCluster.split('(')[0].trim(),
            department: out.peerCluster.split('·')[0].trim(),
            accessType: 'Direct Entitlement',
            roleOrEntitlement: out.outlierEntitlement,
            technicalId: `OUTLIER_GRANT: ${out.outlierEntitlement}`,
            parentBusinessRole: `Peer Outlier (${out.peerRatioLabel})`,
            application: out.application,
            reviewer: 'Line Manager',
            workflowType: 'Manager Approval',
            workflowCode: 'WF-REV-OUT-08',
            triggeredBy: `Event: Role Mining Outlier Detection (${out.peerPrevalencePct}% peer prevalence)`,
            triggeredAt: `${today} ${stamp.slice(0, 5)}`,
            escalationPolicy: 'Auto-revoke after 5d SLA if uncertified',
            workflowStages: [
              { step: 'Stage 1', approverRole: 'Line Manager Approval', assignee: 'Department Manager', status: 'Active' },
            ],
            identitySnapshot: {
              employeeNumber: out.employeeNumber,
              email: `${out.identityName.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`,
              location: 'Johannesburg',
              contractType: 'Full-Time Permanent (FTE)',
              manager: 'Department Manager',
              riskScore: out.riskScore,
              lastLogin: 'Today',
              activeGrantsCount: 5,
            },
            entitlementDetails: {
              description: out.reason,
              owner: 'Application Governance',
              ownerRole: 'Entitlement Owner',
              sensitivity: 'Critical',
              grantedOn: 'Ad-hoc Direct Assignment',
              lastUsed: 'Flagged by Peer Outlier Model',
              totalHolders: 1,
              nestedPermissions: [out.outlierEntitlement],
            },
            risk: 'High',
            usageSignal: `Only ${out.peerRatioLabel} (${out.peerPrevalencePct}%) hold this entitlement`,
            aiRecommendation: 'Revoke',
            reason: out.reason,
            decision: 'Pending',
          }
        : null;

    set((s) => ({
      miningOutliers: s.miningOutliers.map((o) =>
        o.id === outlierId
          ? { ...o, status: action === 'revoke' ? 'Revoked' : 'Sent to Review' }
          : o
      ),
      reviews: newReview ? [newReview, ...s.reviews] : s.reviews,
      toastMessage:
        action === 'revoke'
          ? `Revoked outlier entitlement ${out.outlierEntitlement} from ${out.identityName}.`
          : `Queued ${out.identityName}'s outlier access (${out.outlierEntitlement}) in Access Reviews.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Role Mining Outliers',
          processTag: action === 'revoke' ? 'OUT-CUT' : 'OUT-REV',
          tone: action === 'revoke' ? 'emerald' : 'amber',
          action:
            action === 'revoke'
              ? `Stripped peer outlier entitlement ${out.outlierEntitlement} (${out.peerRatioLabel})`
              : `Escalated peer outlier ${out.outlierEntitlement} to Access Reviews`,
          target: out.identityName,
        },
        ...s.auditLog,
      ],
    }));
  },

  applyRoleOptimisation: (optId) => {
    const opt = get().roleOptimisations.find((o) => o.id === optId);
    if (!opt || opt.status === 'Optimised') return;

    set((s) => ({
      roleOptimisations: s.roleOptimisations.map((o) =>
        o.id === optId ? { ...o, status: 'Optimised' } : o
      ),
      toastMessage: `Applied ${opt.category.toLowerCase()} role optimisation for "${opt.primaryRole}" (${opt.membersAffected} members remapped).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Role Optimisation',
          processTag: 'ROLE-OPT',
          tone: 'emerald',
          action: `Consolidated/retired ${opt.category.toLowerCase()} role (${opt.entitlementsSaved} redundant grants removed)`,
          target: opt.primaryRole,
        },
        ...s.auditLog,
      ],
    }));
  },

  toggleGovernanceControlEnforcement: (controlId, level) => {
    const ctrl = get().governanceControls.find((c) => c.id === controlId);
    if (!ctrl) return;
    const nextVal =
      level === 'preventative' ? !ctrl.preventativeEnabled : !ctrl.detectiveEnabled;
    const label = level === 'preventative' ? 'Preventative' : 'Detective';

    set((s) => ({
      governanceControls: s.governanceControls.map((c) =>
        c.id === controlId
          ? level === 'preventative'
            ? { ...c, preventativeEnabled: nextVal }
            : { ...c, detectiveEnabled: nextVal, lastScanAt: nextVal ? 'Just now' : c.lastScanAt }
          : c
      ),
      toastMessage: `${nextVal ? 'Enabled' : 'Disabled'} ${label} enforcement on ${ctrl.code} (${ctrl.name}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Governance Assurance',
          processTag: 'GA-CTRL',
          tone: nextVal ? 'emerald' : 'amber',
          action: `${nextVal ? 'Enabled' : 'Disabled'} ${label} control mode on ${ctrl.code}`,
          target: ctrl.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  remediateGovernanceViolation: (controlId, violationId) => {
    const ctrl = get().governanceControls.find((c) => c.id === controlId);
    const viol = ctrl?.violations.find((v) => v.id === violationId);
    if (!ctrl || !viol || viol.resolved) return;

    set((s) => ({
      governanceControls: s.governanceControls.map((c) =>
        c.id === controlId
          ? {
              ...c,
              lastScanAt: 'Just now',
              violations: c.violations.map((v) =>
                v.id === violationId ? { ...v, resolved: true } : v
              ),
            }
          : c
      ),
      toastMessage: `Remediated ${ctrl.code} violation on "${viol.objectName}": ${viol.suggestedFix}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Governance Assurance',
          processTag: 'GA-FIX',
          tone: 'emerald',
          action: `Resolved ${ctrl.code} (${ctrl.name}) — ${viol.suggestedFix}`,
          target: viol.objectName,
        },
        ...s.auditLog,
      ],
    }));
  },

  remediateAllControlViolations: (controlId) => {
    const ctrl = get().governanceControls.find((c) => c.id === controlId);
    if (!ctrl) return;
    const openCount = ctrl.violations.filter((v) => !v.resolved).length;
    if (openCount === 0) return;

    set((s) => ({
      governanceControls: s.governanceControls.map((c) =>
        c.id === controlId
          ? {
              ...c,
              lastScanAt: 'Just now',
              violations: c.violations.map((v) => ({ ...v, resolved: true })),
            }
          : c
      ),
      toastMessage: `Auto-remediated all ${openCount} violation(s) for ${ctrl.code} (${ctrl.name}) — control is now Compliant.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Governance Assurance',
          processTag: 'GA-BATCH',
          tone: 'emerald',
          action: `Remediated ${openCount} violations on ${ctrl.code}; status restored to Compliant`,
          target: ctrl.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  runGovernanceDetectiveScan: () => {
    const controls = get().governanceControls;
    const detectiveCount = controls.filter((c) => c.detectiveEnabled).length;
    const activeViolations = controls.reduce(
      (sum, c) =>
        sum + (c.detectiveEnabled ? c.violations.filter((v) => !v.resolved).length : 0),
      0
    );

    set((s) => ({
      governanceControls: s.governanceControls.map((c) =>
        c.detectiveEnabled ? { ...c, lastScanAt: 'Just now' } : c
      ),
      toastMessage: `Completed Detective Assurance scan across ${detectiveCount} controls — ${activeViolations} active governance violation(s) flagged.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Assurance Scanner',
          processTag: 'GA-SCAN',
          tone: activeViolations === 0 ? 'emerald' : 'sky',
          action: `Completed full Detective scan across ${detectiveCount} controls (${activeViolations} violations)`,
          target: 'Platform Health',
        },
        ...s.auditLog,
      ],
    }));
  },

  addGovernanceControl: (input) => {
    const nextNum = get().governanceControls.length + 1;
    const code = `GA-CTRL-${String(nextNum).padStart(2, '0')}`;
    const newControl: DemoGovernanceControl = {
      id: `ga-custom-${Date.now()}`,
      code,
      name: input.name,
      description: input.description,
      domain: input.domain,
      severity: input.severity,
      preventativeEnabled: input.preventativeEnabled,
      detectiveEnabled: input.detectiveEnabled,
      totalEvaluated: 1420,
      evaluatedUnit: 'governed objects',
      lastScanAt: 'Just now',
      preventativeTestExample: {
        attemptedAction: `Submit non-compliant record violating "${input.name}"`,
        blockedMessage: `BLOCKED BY ${code} (Preventative): Change rejected automatically to preserve "${input.name}".`,
        allowedMessage: `ALLOWED (Preventative Off): Non-compliant record saved — Detective scan will flag violation under ${code}.`,
      },
      violations: [],
    };

    set((s) => ({
      governanceControls: [newControl, ...s.governanceControls],
      toastMessage: `Created configurable Governance Control ${code} (${newControl.name}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Governance Assurance',
          processTag: 'GA-NEW',
          tone: 'sky',
          action: `Created Governance Control ${code} (Prev: ${newControl.preventativeEnabled ? 'ON' : 'OFF'} · Det: ${newControl.detectiveEnabled ? 'ON' : 'OFF'})`,
          target: newControl.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  updateSmtpConfig: (patch) => {
    const nextSmtp: SmtpConfig = {
      ...get().platformConfig.smtp,
      ...patch,
    };
    const stamp = timeNow();
    set((s) => ({
      platformConfig: {
        ...s.platformConfig,
        smtp: nextSmtp,
      },
      toastMessage: `Saved SMTP mail relay configuration (${nextSmtp.host}:${nextSmtp.port} · ${nextSmtp.authMethod}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Platform Config',
          processTag: 'SMTP-CFG',
          tone: 'sky',
          action: `Updated SMTP relay (${nextSmtp.host}:${nextSmtp.port} · ${nextSmtp.encryption})`,
          target: nextSmtp.fromEmail,
        },
        ...s.auditLog,
      ],
    }));
  },

  testSmtpConnection: () => {
    const smtp = get().platformConfig.smtp;
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const ok = smtp.host.trim().length > 0 && smtp.port > 0;
    set((s) => ({
      platformConfig: {
        ...s.platformConfig,
        smtp: {
          ...s.platformConfig.smtp,
          lastTestedAt: `${today} ${stamp}`,
          connectionStatus: ok ? 'Connected' : 'Error',
        },
      },
      toastMessage: ok
        ? `SMTP handshake succeeded with ${smtp.host}:${smtp.port} (${smtp.encryption} · 142ms).`
        : 'SMTP test failed — please enter a valid SMTP host and port.',
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'SMTP Health Check',
          processTag: ok ? 'SMTP-OK' : 'SMTP-ERR',
          tone: ok ? 'emerald' : 'rose',
          action: ok
            ? `Verified SMTP TLS handshake (${smtp.authMethod})`
            : 'SMTP handshake test failed due to missing host',
          target: `${smtp.host || 'unset'}:${smtp.port}`,
        },
        ...s.auditLog,
      ],
    }));
  },

  updateMasterEmailTemplate: (patch) => {
    const nextTemplate: MasterEmailTemplateConfig = {
      ...get().platformConfig.emailTemplate,
      ...patch,
    };
    const stamp = timeNow();
    const totalUpdated = get().emailNotifications.length;

    set((s) => ({
      platformConfig: {
        ...s.platformConfig,
        emailTemplate: nextTemplate,
      },
      // Propagate master styling automatically to ALL email notifications
      emailNotifications: s.emailNotifications.map((email) => ({
        ...email,
        htmlBody: buildBrandedIdentraEmailHtml(email.templateData, nextTemplate),
      })),
      toastMessage: `Master Email Template updated — all ${totalUpdated} email notifications inherited the new styling automatically.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Email Branding Engine',
          processTag: 'TPL-SYNC',
          tone: 'emerald',
          action: `Updated Master Email Template (${nextTemplate.brandTitle} · ${nextTemplate.accentColor}); re-rendered ${totalUpdated} notifications`,
          target: 'All Email Notifications',
        },
        ...s.auditLog,
      ],
    }));
  },

  updateProvisioningConfig: (patch) => {
    const stamp = timeNow();
    set((s) => ({
      platformConfig: {
        ...s.platformConfig,
        provisioning: {
          ...s.platformConfig.provisioning,
          ...patch,
        },
      },
      toastMessage: 'Saved Provisioning & Import Engine configuration.',
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Platform Config',
          processTag: 'PRV-CFG',
          tone: 'sky',
          action: 'Updated Provisioning & Import Engine settings',
          target: 'Operations Pipeline',
        },
        ...s.auditLog,
      ],
    }));
  },

  updateGovernanceConfig: (patch) => {
    const stamp = timeNow();
    set((s) => ({
      platformConfig: {
        ...s.platformConfig,
        governance: {
          ...s.platformConfig.governance,
          ...patch,
        },
      },
      toastMessage: 'Saved Governance, Birthrights & Access Review settings.',
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Platform Config',
          processTag: 'GOV-CFG',
          tone: 'sky',
          action: 'Updated Governance, Review SLA & SoD configuration',
          target: 'Governance Engine',
        },
        ...s.auditLog,
      ],
    }));
  },

  retryEmailNotification: (emailId) => {
    const email = get().emailNotifications.find((e) => e.id === emailId);
    if (!email) return;
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const targetEmail =
      email.status === 'Bounced' && email.cc?.[0] ? email.cc[0] : email.recipientEmail;
    const targetName =
      email.status === 'Bounced' && email.cc?.[0]
        ? `${email.recipientName} (Rerouted → Sponsor)`
        : email.recipientName;

    set((s) => ({
      emailNotifications: s.emailNotifications.map((e) =>
        e.id === emailId
          ? {
              ...e,
              status: 'Delivered',
              timestamp: `${today} ${stamp}`,
              recipientEmail: targetEmail,
              recipientName: targetName,
              deliveryLatencyMs: 210 + Math.floor(Math.random() * 90),
              errorMessage: undefined,
            }
          : e
      ),
      toastMessage: `Retried ${email.messageCode}: delivered cleanly to ${targetEmail}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Notification Engine',
          processTag: 'EMAIL-OK',
          tone: 'emerald',
          action: `Retried & delivered ${email.messageCode} (${email.triggerCategory})`,
          target: targetEmail,
        },
        ...s.auditLog,
      ],
    }));
  },

  resendEmailNotification: (emailId) => {
    const email = get().emailNotifications.find((e) => e.id === emailId);
    if (!email) return;
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const { smtp, emailTemplate } = get().platformConfig;
    const nextCode = `EML-${7049 + get().emailNotifications.length}`;
    const nextTemplateData: BrandedEmailTemplateInput = {
      ...email.templateData,
      messageCode: nextCode,
      timestamp: `${today} ${stamp}`,
    };
    const copy: DemoEmailNotification = {
      ...email,
      id: `eml-resend-${Date.now()}`,
      messageCode: nextCode,
      timestamp: `${today} ${stamp}`,
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      status: 'Delivered',
      deliveryLatencyMs: 195 + Math.floor(Math.random() * 85),
      errorMessage: undefined,
      templateData: nextTemplateData,
      htmlBody: buildBrandedIdentraEmailHtml(nextTemplateData, emailTemplate),
    };

    set((s) => ({
      emailNotifications: [copy, ...s.emailNotifications],
      toastMessage: `Dispatched fresh branded email ${nextCode} to ${email.recipientEmail}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Notification Engine',
          processTag: 'EMAIL-SENT',
          tone: 'sky',
          action: `Resent notification ${nextCode} (copy of ${email.messageCode})`,
          target: email.recipientEmail,
        },
        ...s.auditLog,
      ],
    }));
  },

  toggleBirthrightStatus: (ruleId) => {
    const rule = get().birthrights.find((b) => b.id === ruleId);
    if (!rule) return;
    const nextStatus = rule.status === 'Active' ? 'Paused' : 'Active';
    set((s) => ({
      birthrights: s.birthrights.map((b) =>
        b.id === ruleId ? { ...b, status: nextStatus, lastEvaluated: 'Just now' } : b
      ),
      toastMessage: `${nextStatus === 'Active' ? 'Activated' : 'Paused'} birthright rule ${rule.code} (${rule.name}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Birthright Engine',
          processTag: 'BIRTHRIGHT',
          tone: nextStatus === 'Active' ? 'emerald' : 'amber',
          action: `${nextStatus === 'Active' ? 'Activated' : 'Paused'} birthright policy ${rule.code}`,
          target: rule.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  addBirthrightRule: (input) => {
    const existing = get().birthrights;
    const nextCode = `BR-${String(existing.length + 1).padStart(3, '0')}`;
    const newRule: DemoBirthrightRule = {
      ...input,
      id: `br-${Date.now()}`,
      code: nextCode,
      lastEvaluated: 'Just now',
    };
    const matchedCount = evaluateBirthrightMatches(newRule, get().people).length;

    set((s) => ({
      birthrights: [newRule, ...s.birthrights],
      toastMessage: `Created birthright rule ${nextCode} (${newRule.name}) — matched ${matchedCount} ${matchedCount === 1 ? 'identity' : 'identities'}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Birthright Engine',
          processTag: 'BR-CREATE',
          tone: 'sky',
          action: `Created ${newRule.scopeMode} birthright ${nextCode} (${matchedCount} matched)`,
          target: newRule.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  deleteBirthrightRule: (ruleId) => {
    const rule = get().birthrights.find((b) => b.id === ruleId);
    if (!rule) return;
    set((s) => ({
      birthrights: s.birthrights.filter((b) => b.id !== ruleId),
      toastMessage: `Removed birthright rule ${rule.code} (${rule.name}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Birthright Engine',
          processTag: 'BR-DELETE',
          tone: 'amber',
          action: `Deleted birthright rule ${rule.code}`,
          target: rule.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  runBirthrightReconciliation: (ruleId) => {
    const rule = get().birthrights.find((b) => b.id === ruleId);
    if (!rule) return;
    const matches = evaluateBirthrightMatches(rule, get().people);
    const stamp = timeNow();
    const firstMatch = matches[0];
    const firstGrant = rule.grants[0];

    const newJob: DemoProvisioningJob | null =
      firstMatch && firstGrant
        ? {
            id: `job-br-${Date.now()}`,
            jobCode: `PRV-${8840 + get().provisioningJobs.length}`,
            identity: firstMatch.name,
            identityEmail: firstMatch.email,
            entitlementOrRole: `${rule.code}: ${firstGrant.name}`,
            application:
              firstGrant.targetSystem === 'Active Directory' ||
              firstGrant.targetSystem === 'Microsoft Entra ID' ||
              firstGrant.targetSystem === 'SAP S/4HANA Finance' ||
              firstGrant.targetSystem === 'AWS Prod Vault' ||
              firstGrant.targetSystem === 'Snowflake PII Lake'
                ? firstGrant.targetSystem
                : 'Okta Workforce',
            operation: 'Update',
            status: rule.provisioningMode === 'Simulation Mode' ? 'Simulation Mode' : 'Completed',
            triggeredBy: `Birthright Engine (${rule.code})`,
            timestamp: stamp,
            durationMs: rule.provisioningMode === 'Simulation Mode' ? null : 215,
            mappings: [
              {
                attribute: 'birthrightRule',
                before: null,
                after: `${rule.code} (${rule.scopeMode})`,
                rule: 'Dynamic Birthright Expression',
              },
              {
                attribute: 'grantedAccess',
                before: null,
                after: rule.grants.map((g) => g.name).join(', '),
                rule: 'Desired-State Entitlement Expansion',
              },
            ],
          }
        : null;

    set((s) => ({
      birthrights: s.birthrights.map((b) =>
        b.id === ruleId ? { ...b, lastEvaluated: 'Just now' } : b
      ),
      provisioningJobs: newJob ? [newJob, ...s.provisioningJobs] : s.provisioningJobs,
      toastMessage:
        matches.length > 0
          ? `Evaluated ${rule.code}: reconciled ${rule.grants.length} grants across ${matches.length} matched ${matches.length === 1 ? 'identity' : 'identities'} (${rule.provisioningMode}).`
          : `Evaluated ${rule.code}: 0 identities currently match the criteria.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Birthright Engine',
          processTag: 'BR-EVAL',
          tone: 'emerald',
          action: `Evaluated ${rule.code} (${matches.length} matched · ${rule.grants.length} grants · ${rule.provisioningMode})`,
          target: rule.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  quarantineOrphanAccount: (accountId) => {
    const acc = get().accounts.find((a) => a.id === accountId);
    if (!acc) return;
    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === accountId
          ? {
              ...a,
              accountStatus: 'Quarantined',
              correlationState: 'Disabled (Leaver)',
              riskScore: 6,
            }
          : a
      ),
      toastMessage: `Quarantined & disabled orphaned account ${acc.accountName} on ${acc.application}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Orphan Remediation',
          processTag: 'ORPHAN-CUT',
          tone: 'emerald',
          action: `Disabled & quarantined orphaned account on ${acc.application}`,
          target: acc.accountName,
        },
        ...s.auditLog,
      ],
    }));
  },

  linkOrphanAccountToOwner: (accountId, personId) => {
    const acc = get().accounts.find((a) => a.id === accountId);
    const owner = get().people.find((p) => p.id === personId);
    if (!acc || !owner) return;
    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === accountId
          ? {
              ...a,
              personId: owner.id,
              correlatedIdentity: `${owner.name} (Steward)`,
              correlationState: 'Correlated',
              orphanReason: undefined,
              riskScore: Math.min(a.riskScore, 24),
            }
          : a
      ),
      toastMessage: `Correlated ${acc.accountName} (${acc.application}) to accountable owner ${owner.name}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Identity Correlation',
          processTag: 'CORRELATE',
          tone: 'sky',
          action: `Linked orphaned account ${acc.accountName} to steward ${owner.name}`,
          target: acc.application,
        },
        ...s.auditLog,
      ],
    }));
  },

  triggerManualImport: (system) => {
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const nextNum = 4109 + get().importRuns.length;
    const connectorMap: Record<DemoImportRun['system'], string> = {
      'Microsoft Entra ID': 'Microsoft Graph API v1.0',
      'Workday HRIS (HR)': 'Workday RaaS + Event Feed v42',
      'Active Directory': 'LDAPS Global Catalog Bridge',
    };
    const newRun: DemoImportRun = {
      id: `imp-man-${Date.now()}`,
      runCode: `IMP-${nextNum}`,
      system,
      connector: connectorMap[system],
      mode: 'Manual Delta',
      triggeredAt: `${today} ${stamp}`,
      completedAt: `${today} ${stamp}`,
      duration: system === 'Workday HRIS (HR)' ? '36s' : '49s',
      status: 'Completed',
      recordsRead: system === 'Active Directory' ? 7834 : 6732,
      created: 1,
      updated: 6,
      warnings: 0,
      errors: 0,
      stages: [
        { stage: '1. Connector Handshake', duration: '0.4s', status: 'Passed', detail: `Authenticated cleanly via ${connectorMap[system]}` },
        { stage: '2. Extract Delta Objects', duration: '21.2s', status: 'Passed', detail: 'Pulled latest incremental object delta with zero throttling' },
        { stage: '3. Schema & Identity Match', duration: '11.8s', status: 'Passed', detail: '100% correlation rate · 1 created, 6 updated' },
        { stage: '4. Process++ Trigger', duration: '4.1s', status: 'Passed', detail: 'Reconciled state and updated IDENTRA identity graph' },
      ],
    };

    set((s) => ({
      importRuns: [newRun, ...s.importRuns],
      toastMessage: `Manual delta import ${newRun.runCode} for ${system} completed cleanly in ${newRun.duration}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Import Engine',
          processTag: 'IMPORT-OK',
          tone: 'emerald',
          action: `Completed manual delta import (${newRun.runCode}) · ${newRun.recordsRead.toLocaleString()} records`,
          target: system,
        },
        ...s.auditLog,
      ],
    }));
  },

  retryFailedImport: (importId) => {
    const existing = get().importRuns.find((r) => r.id === importId);
    if (!existing) return;

    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();

    set((s) => ({
      importRuns: s.importRuns.map((run) =>
        run.id === importId
          ? {
              ...run,
              status: 'Completed',
              completedAt: `${today} ${stamp}`,
              duration: '54s',
              recordsRead: 6732,
              updated: 9,
              errors: 0,
              errorCode: undefined,
              errorMessage: undefined,
              errorEndpoint: undefined,
              recommendedFix: undefined,
              stages: [
                { stage: '1. Connector Handshake', duration: '0.4s', status: 'Passed', detail: 'Authenticated using rotated Managed Identity credential' },
                { stage: '2. Extract Users & Licenses', duration: '31.5s', status: 'Passed', detail: 'Fetched all 6,732 Entra accounts and 12 license SKUs cleanly' },
                { stage: '3. Schema & Identity Match', duration: '16.2s', status: 'Passed', detail: 'Reconciled 9 license & attribute updates with 0 errors' },
                { stage: '4. Process++ Trigger', duration: '5.9s', status: 'Passed', detail: 'Graph parity restored to 100%' },
              ],
            }
          : run
      ),
      toastMessage: `Retried ${existing.runCode} (${existing.system}) — import completed cleanly with 0 errors.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Import Engine',
          processTag: 'IMPORT-OK',
          tone: 'emerald',
          action: `Retried failed import (${existing.runCode}) with refreshed credentials`,
          target: existing.system,
        },
        ...s.auditLog,
      ],
    }));
  },

  releaseSimulatedJob: (jobId) => {
    const job = get().provisioningJobs.find((j) => j.id === jobId);
    if (!job || job.status !== 'Simulation Mode') return;

    set((s) => ({
      provisioningJobs: s.provisioningJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'Completed',
              timestamp: timeNow(),
              durationMs: 265 + Math.floor(Math.random() * 190),
            }
          : j
      ),
      toastMessage: `Released ${job.jobCode} (${job.operation} on ${job.application}) for ${job.identity} to target connector.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Provisioning Engine',
          processTag: 'RELEASE',
          tone: 'emerald',
          action: `Approved & released simulated ${job.operation} job (${job.jobCode}) to ${job.application}`,
          target: job.identity,
        },
        ...s.auditLog,
      ],
    }));
  },

  releaseSimulatedJobsBatch: (jobIds) => {
    const matching = get().provisioningJobs.filter(
      (j) => jobIds.includes(j.id) && j.status === 'Simulation Mode'
    );
    if (matching.length === 0) return;

    set((s) => ({
      provisioningJobs: s.provisioningJobs.map((j) =>
        jobIds.includes(j.id) && j.status === 'Simulation Mode'
          ? {
              ...j,
              status: 'Completed',
              timestamp: timeNow(),
              durationMs: 290 + Math.floor(Math.random() * 160),
            }
          : j
      ),
      toastMessage: `Approved & released ${matching.length} simulated provisioning jobs to target applications.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Provisioning Engine',
          processTag: 'BATCH-REL',
          tone: 'emerald',
          action: `Released ${matching.length} simulated jobs (${matching.map((m) => m.jobCode).join(', ')})`,
          target: 'Target Connector Fabric',
        },
        ...s.auditLog,
      ],
    }));
  },

  discardSimulatedJob: (jobId) => {
    const job = get().provisioningJobs.find((j) => j.id === jobId);
    if (!job) return;
    set((s) => ({
      provisioningJobs: s.provisioningJobs.filter((j) => j.id !== jobId),
      toastMessage: `Discarded simulated job ${job.jobCode} for ${job.identity} — no changes sent to ${job.application}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Provisioning Engine',
          processTag: 'DISCARD',
          tone: 'amber',
          action: `Rejected simulated ${job.operation} payload (${job.jobCode}) prior to commit`,
          target: job.identity,
        },
        ...s.auditLog,
      ],
    }));
  },

  retryFailedJob: (jobId) => {
    const job = get().provisioningJobs.find((j) => j.id === jobId);
    if (!job || job.status !== 'Failed') return;

    set((s) => ({
      provisioningJobs: s.provisioningJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'Completed',
              errorMessage: undefined,
              timestamp: timeNow(),
              durationMs: 340,
            }
          : j
      ),
      toastMessage: `Retried ${job.jobCode} on ${job.application} — job completed cleanly.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Provisioning Engine',
          processTag: 'RETRY-OK',
          tone: 'emerald',
          action: `Retried failed ${job.operation} job (${job.jobCode}) on ${job.application}`,
          target: job.identity,
        },
        ...s.auditLog,
      ],
    }));
  },

  onboardNewJoiner: () => {
    const idx = get().people.length + 1;
    const names = [
      {
        first: 'Hannah',
        last: 'Brooks',
        sam: 'hbrooks',
        dept: 'Platform & Cloud Engineering',
        deptRef: 'dept-eng',
        ou: 'Platform SRE & Cloud Infra',
        ouRef: 'ou-eng-platform',
        cc: 'CC-3010-ENG',
        ccRef: 'cc-3010',
        mgr: 'Alex Carter',
        mgrRef: 'mgr-alex',
        ctx: 'ctx-sre-jit',
        title: 'Cloud Security Engineer',
        role: 'Prod K8s Operator (JIT)',
      },
      {
        first: 'Daniel',
        last: 'Kim',
        sam: 'dkim',
        dept: 'Corporate Finance & Treasury',
        deptRef: 'dept-finance',
        ou: 'EMEA Finance Operations',
        ouRef: 'ou-fin-analysts',
        cc: 'CC-4100-FIN',
        ccRef: 'cc-4100',
        mgr: 'Claire Vance',
        mgrRef: 'mgr-claire',
        ctx: 'ctx-fin-uk-fte',
        title: 'FP&A Specialist',
        role: 'Finance: Base Ledger Read',
      },
      {
        first: 'Sofia',
        last: 'Alvarez',
        sam: 'salvarez',
        dept: 'Data Governance & Analytics',
        deptRef: 'dept-data',
        ou: 'Enterprise Data Stewardship',
        ouRef: 'ou-data-gov',
        cc: 'CC-3400-DAT',
        ccRef: 'cc-3400',
        mgr: 'Hannah Lindqvist',
        mgrRef: 'mgr-cdo',
        ctx: 'ctx-data-steward',
        title: 'Analytics Engineer',
        role: 'Snowflake Data Steward',
      },
    ];
    const pick = names[idx % names.length];
    const fullName = `${pick.first} ${pick.last}`;
    const today = new Date().toISOString().slice(0, 10);
    const empNo = `EMP-${10900 + idx}`;

    const newPerson: DemoPerson = {
      id: `p-new-${Date.now()}`,
      firstName: pick.first,
      lastName: pick.last,
      name: fullName,
      employeeNumber: empNo,
      email: `${pick.first.toLowerCase()}.${pick.last.toLowerCase()}@identra-corp.io`,
      upn: `${pick.sam}@corp.identra.net`,
      samAccountName: pick.sam,
      title: pick.title,
      department: pick.dept,
      departmentRefId: pick.deptRef,
      companyName: 'IDENTRA Global Holdings Ltd',
      companyRefId: 'comp-identra-uk',
      orgUnitName: pick.ou,
      orgUnitRefId: pick.ouRef,
      costCenterCode: pick.cc,
      costCenterRefId: pick.ccRef,
      location: 'London, UK (HQ)',
      type: 'Employee',
      contractType: 'Full-Time Permanent (FTE)',
      hrStartDate: today,
      hrEndDate: null,
      sourceSystem: 'Workday HRIS Core',
      sourceRefId: 'src-workday',
      sourceExternalId: `WD-${99500 + idx}`,
      lastHrSync: `Today · ${timeNow()}`,
      jmlStatus: 'Joiner',
      riskScore: 11,
      roles: [pick.role, 'Corporate SSO Standard'],
      applications: ['Active Directory', 'Microsoft Entra ID', 'Okta Workforce', 'Workday'],
      manager: pick.mgr,
      managerRefId: pick.mgrRef,
      contextRefIds: [pick.ctx],
      lastAttestation: 'Auto-onboarded just now',
      changeHistory: [
        {
          id: `h-new-${Date.now()}`,
          timestamp: `${today} ${timeNow()}`,
          source: 'Workday HRIS Core',
          category: 'JML Lifecycle',
          summary: `New employee onboarded (${empNo}) with Day-1 birthright role "${pick.role}".`,
          changes: [
            { field: 'jmlStatus', before: null, after: 'Joiner' },
            { field: 'orgUnit', before: null, after: pick.ou },
            { field: 'hrStartDate', before: null, after: today },
          ],
        },
      ],
    };

    useSceneStore.getState().simulateLifecycleEvent('Joiner');
    const joinerStamp = timeNow();
    const { smtp, emailTemplate } = get().platformConfig;
    const joinerMsgCode = `EML-${7049 + get().emailNotifications.length}`;
    const joinerTemplateData: BrandedEmailTemplateInput = {
      badgeText: 'DAY-1 JOINER PROVISIONED',
      badgeTone: 'emerald',
      headline: `Welcome ${pick.first} — Your Day-1 Identity & Roles Are Active`,
      greeting: `Hi ${fullName},`,
      intro: `Your authoritative Workday HRIS joiner record (${empNo}) has been processed automatically. Your Day-1 birthright accounts and business role have been provisioned with zero manual tickets.`,
      metadataRows: [
        { label: 'Employee #', value: empNo, mono: true },
        { label: 'Corporate UPN', value: newPerson.upn, mono: true },
        { label: 'Department', value: pick.dept },
        { label: 'Org Unit', value: pick.ou },
        { label: 'Provisioned Role', value: `${pick.role} · Corporate SSO Standard` },
        { label: 'Line Manager', value: pick.mgr },
      ],
      calloutTitle: 'Zero-Trust First Sign-In',
      calloutText:
        'Enroll your phishing-resistant FIDO2 passkey on first sign-in to unlock SSO across your target applications.',
      ctaLabel: 'Activate Corporate SSO',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: joinerMsgCode,
      timestamp: `${today} ${joinerStamp}`,
    };
    const joinerEmailNotif: DemoEmailNotification = {
      id: `eml-joiner-${Date.now()}`,
      messageCode: joinerMsgCode,
      timestamp: `${today} ${joinerStamp}`,
      status: 'Delivered',
      trigger: `Day-1 HRIS Joiner Onboarding · ${pick.dept}`,
      triggerCategory: 'JML Lifecycle',
      recipientName: fullName,
      recipientEmail: newPerson.email,
      recipientRole: `New Joiner (${pick.title})`,
      cc: [`${pick.mgr.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`],
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Welcome to ${emailTemplate.brandTitle} — Your Day-1 Access (${pick.role}) Is Ready`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 224,
      templateData: joinerTemplateData,
      htmlBody: buildBrandedIdentraEmailHtml(joinerTemplateData, emailTemplate),
    };

    set((s) => ({
      people: [newPerson, ...s.people],
      emailNotifications: [joinerEmailNotif, ...s.emailNotifications],
      accounts: [
        {
          id: `acc-new-${Date.now()}`,
          accountName: `${pick.sam}@corp.identra.net`,
          application: 'Active Directory',
          accountType: 'Human',
          personId: newPerson.id,
          correlatedIdentity: fullName,
          correlationState: 'Correlated',
          accountStatus: 'Enabled',
          privileged: false,
          lastLogin: 'Just provisioned',
          daysInactive: 0,
          riskScore: 11,
        },
        ...s.accounts,
      ],
      toastMessage: `Onboarded ${fullName} (${pick.dept}) with Day-1 birthright roles via Workday HRIS.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Process++ JML Engine',
          processTag: 'ONBOARD',
          tone: 'emerald',
          action: `Auto-provisioned birthright role "${pick.role}"`,
          target: fullName,
        },
        ...s.auditLog,
      ],
    }));
  },

  movePersonDepartment: (personId) => {
    const person = get().people.find((p) => p.id === personId);
    if (!person) return;

    useSceneStore.getState().simulateLifecycleEvent('Mover');
    const today = new Date().toISOString().slice(0, 10);
    const nextDept =
      person.departmentRefId === 'dept-sales'
        ? { name: 'Platform & Cloud Engineering', ref: 'dept-eng', ou: 'Platform SRE & Cloud Infra', ouRef: 'ou-eng-platform' }
        : { name: 'Data Governance & Analytics', ref: 'dept-data', ou: 'Enterprise Data Stewardship', ouRef: 'ou-data-gov' };

    set((s) => ({
      people: s.people.map((p) =>
        p.id === personId
          ? {
              ...p,
              jmlStatus: 'Mover',
              department: nextDept.name,
              departmentRefId: nextDept.ref,
              orgUnitName: nextDept.ou,
              orgUnitRefId: nextDept.ouRef,
              roles: ['Corporate SSO Standard', 'Department Lead Access'],
              riskScore: Math.max(12, p.riskScore - 8),
              sodAlert: undefined,
              lastAttestation: 'Recalculated just now',
              changeHistory: [
                {
                  id: `h-mov-${Date.now()}`,
                  timestamp: `${today} ${timeNow()}`,
                  source: 'Process++ Change Engine',
                  category: 'Context Change',
                  summary: `Organizational transfer completed: stripped legacy entitlements and updated Org Unit.`,
                  changes: [
                    { field: 'department', before: p.department, after: nextDept.name },
                    { field: 'orgUnit', before: p.orgUnitName, after: nextDept.ou },
                  ],
                },
                ...p.changeHistory,
              ],
            }
          : p
      ),
      toastMessage: `Recalculated roles for ${person.name}: stripped legacy entitlements and granted new department access.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Process++ Change Engine',
          processTag: 'CHANGE',
          tone: 'sky',
          action: 'Stripped legacy permissions & provisioned updated business role',
          target: person.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  offboardPerson: (personId) => {
    const person = get().people.find((p) => p.id === personId);
    if (!person) return;

    useSceneStore.getState().simulateLifecycleEvent('Leaver');
    if (personId === 'p-mark') {
      useSceneStore.getState().resolveAttentionItem('att-orphans');
    }
    const today = new Date().toISOString().slice(0, 10);

    set((s) => ({
      people: s.people.map((p) =>
        p.id === personId
          ? {
              ...p,
              jmlStatus: 'Suspended',
              hrEndDate: p.hrEndDate ?? today,
              riskScore: 4,
              roles: [],
              applications: [],
              sodAlert: undefined,
              lastAttestation: 'Off-boarded & reconciled · 0 active grants',
              changeHistory: [
                {
                  id: `h-off-${Date.now()}`,
                  timestamp: `${today} ${timeNow()}`,
                  source: 'Process++ Off-board',
                  category: 'JML Lifecycle',
                  summary: 'Immediate off-board executed: revoked all active roles, sessions, and orphaned keys.',
                  changes: [
                    { field: 'jmlStatus', before: p.jmlStatus, after: 'Suspended' },
                    { field: 'hrEndDate', before: p.hrEndDate ?? 'Indefinite', after: p.hrEndDate ?? today },
                    { field: 'activeRoles', before: String(p.roles.length), after: '0' },
                  ],
                },
                ...p.changeHistory,
              ],
            }
          : p
      ),
      entitlements: s.entitlements.map((e) =>
        e.assignedTo.includes(person.name) ? { ...e, status: 'Revoked' } : e
      ),
      accounts: s.accounts.map((a) =>
        a.personId === personId
          ? {
              ...a,
              accountStatus: 'Disabled',
              correlationState: 'Disabled (Leaver)',
              riskScore: 4,
            }
          : a
      ),
      policies: s.policies.map((pol) =>
        pol.affectedIdentity?.includes(person.name) ? { ...pol, violations: 0 } : pol
      ),
      toastMessage: `Off-boarded ${person.name}: revoked all roles, active sessions, and orphaned target keys.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Process++ Off-board',
          processTag: 'OFF-BOARD',
          tone: 'emerald',
          action: 'Terminated sessions & removed all active + orphaned grants',
          target: person.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  emergencyDeactivatePerson: (personId, reason) => {
    const person = get().people.find((p) => p.id === personId);
    if (!person || person.jmlStatus === 'Deactivated') return;

    useSceneStore.getState().simulateLifecycleEvent('Leaver');
    if (personId === 'p-mark') {
      useSceneStore.getState().resolveAttentionItem('att-orphans');
    }

    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const cleanReason =
      reason?.trim() || 'Emergency security deactivation triggered by Administrator';
    const cleanTargetSystems = Array.from(
      new Set(
        person.applications.map((app) =>
          app.replace(/\s*\((Disabled|Orphan Key)\)/gi, '').trim()
        )
      )
    );
    const systemsToDisable =
      cleanTargetSystems.length > 0
        ? cleanTargetSystems
        : ['Active Directory', 'Microsoft Entra ID', 'Okta Workforce'];

    const mapToProvApp = (name: string): DemoProvisioningJob['application'] => {
      if (name.includes('Active Directory')) return 'Active Directory';
      if (name.includes('Entra')) return 'Microsoft Entra ID';
      if (name.includes('SAP')) return 'SAP S/4HANA Finance';
      if (name.includes('AWS')) return 'AWS Prod Vault';
      if (name.includes('Snowflake')) return 'Snowflake PII Lake';
      return 'Okta Workforce';
    };

    const existingJobBase = 9100 + get().provisioningJobs.length;
    const emergencyJobs: DemoProvisioningJob[] = systemsToDisable.map((sys, idx) => ({
      id: `job-emrg-${Date.now()}-${idx}`,
      jobCode: `PRV-${existingJobBase + idx}`,
      identity: person.name,
      identityEmail: person.email,
      entitlementOrRole: `Emergency Kill-Switch · Disable ${sys} Account`,
      application: mapToProvApp(sys),
      operation: 'Update',
      status: 'Completed',
      triggeredBy: 'Emergency Deactivation Kill-Switch',
      timestamp: stamp,
      durationMs: 120 + idx * 35,
      mappings: [
        {
          attribute: 'accountStatus',
          before: 'Enabled',
          after: 'Disabled (Emergency Lock)',
          rule: 'SEC.EmergencyDeactivate.DisableAccount',
        },
        {
          attribute: 'activeSessions',
          before: 'Active',
          after: 'Revoked & Tokens Invalidated',
          rule: 'SEC.EmergencyDeactivate.RevokeTokens',
        },
      ],
    }));

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const mgrEmail = `${person.manager.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`;
    const alertTemplateData: BrandedEmailTemplateInput = {
      badgeText: 'EMERGENCY DEACTIVATION EXECUTED',
      badgeTone: 'rose',
      headline: `Identity Emergency Deactivated: ${person.name}`,
      greeting: `Attention ${person.manager} & Security Operations,`,
      intro: `An emergency deactivation kill-switch was executed for ${person.name} (${person.employeeNumber}). All connected target system accounts have been immediately disabled, active sessions revoked, and the identity status set to Deactivated.`,
      metadataRows: [
        { label: 'Identity', value: `${person.name} (${person.employeeNumber})`, mono: true },
        { label: 'New Identity Status', value: 'Deactivated (Locked)', mono: true },
        { label: 'Disabled Target Systems', value: systemsToDisable.join(' · ') },
        { label: 'Revoked Roles', value: `${person.roles.length} active role(s) stripped` },
        { label: 'Reason', value: cleanReason },
        { label: 'Executed By', value: 'Administrator (Emergency Kill-Switch)' },
      ],
      calloutTitle: 'All Target Accounts Disabled',
      calloutText: `Provisioning Engine executed ${emergencyJobs.length} immediate disable jobs across ${systemsToDisable.join(', ')}. An immutable audit record has been sealed in the identity Change History.`,
      ctaLabel: 'Inspect Identity Audit History',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const emergencyEmail: DemoEmailNotification = {
      id: `eml-emrg-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Emergency Identity Deactivation · ${person.name} (${person.employeeNumber})`,
      triggerCategory: 'SoD & Policy',
      recipientName: person.manager,
      recipientEmail: mgrEmail,
      recipientRole: 'Line Manager / Escalation Contact',
      cc: ['secops@identra-corp.io', 'iam-ops@identra-corp.io'],
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `[EMERGENCY] Identity Deactivated & All Target Accounts Disabled — ${person.name}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 148,
      templateData: alertTemplateData,
      htmlBody: buildBrandedIdentraEmailHtml(alertTemplateData, emailTemplate),
    };

    set((s) => {
      const updatedExistingAccounts = s.accounts.map((a) =>
        a.personId === personId ||
        (a.correlatedIdentity && a.correlatedIdentity.includes(person.name))
          ? {
              ...a,
              accountStatus: 'Disabled' as const,
              correlationState: 'Disabled (Leaver)' as const,
              riskScore: 0,
            }
          : a
      );

      // Ensure every target system on the identity has a disabled account entry in Accounts inventory
      const existingAppsForPerson = new Set(
        updatedExistingAccounts
          .filter((a) => a.personId === personId)
          .map((a) => a.application.toLowerCase())
      );

      const extraDisabledAccounts: DemoTargetAccount[] = systemsToDisable
        .filter((sys) => !existingAppsForPerson.has(sys.toLowerCase()))
        .map((sys, idx) => ({
          id: `acc-emrg-${Date.now()}-${idx}`,
          accountName: person.upn,
          application: sys,
          accountType: person.type === 'Contractor' ? 'Contractor' : 'Human',
          personId: person.id,
          correlatedIdentity: person.name,
          correlationState: 'Disabled (Leaver)',
          accountStatus: 'Disabled',
          privileged: false,
          lastLogin: `Locked ${stamp}`,
          daysInactive: 0,
          riskScore: 0,
        }));

      return {
        people: s.people.map((p) =>
          p.id === personId
            ? {
                ...p,
                jmlStatus: 'Deactivated',
                hrEndDate: p.hrEndDate ?? today,
                riskScore: 0,
                roles: [],
                applications: systemsToDisable.map((sys) => `${sys} (Disabled)`),
                sodAlert: undefined,
                lastAttestation: `Emergency deactivated ${stamp} · ${systemsToDisable.length} target accounts disabled`,
                changeHistory: [
                  {
                    id: `h-emrg-${Date.now()}`,
                    timestamp: `${today} ${stamp}`,
                    source: 'Emergency Kill-Switch (Admin)',
                    category: 'Emergency Deactivation',
                    summary: `Emergency deactivation executed: disabled accounts across all ${systemsToDisable.length} target systems (${systemsToDisable.join(', ')}). Reason: ${cleanReason}.`,
                    changes: [
                      { field: 'identityStatus', before: p.jmlStatus, after: 'Deactivated' },
                      {
                        field: 'targetAccounts',
                        before: `${systemsToDisable.length} Enabled (${systemsToDisable.join(', ')})`,
                        after: 'All Target Accounts Disabled',
                      },
                      {
                        field: 'activeRoles',
                        before: p.roles.length > 0 ? p.roles.join(', ') : 'None',
                        after: '0 (All Revoked)',
                      },
                      { field: 'emergencyReason', before: null, after: cleanReason },
                    ],
                  },
                  ...p.changeHistory,
                ],
              }
            : p
        ),
        accounts: [...extraDisabledAccounts, ...updatedExistingAccounts],
        entitlements: s.entitlements.map((e) =>
          e.assignedTo.includes(person.name) ? { ...e, status: 'Revoked' } : e
        ),
        policies: s.policies.map((pol) =>
          pol.affectedIdentity?.includes(person.name) ? { ...pol, violations: 0 } : pol
        ),
        provisioningJobs: [...emergencyJobs, ...s.provisioningJobs],
        emailNotifications: [emergencyEmail, ...s.emailNotifications],
        toastMessage: `Emergency deactivated ${person.name}: disabled accounts across all ${systemsToDisable.length} target systems and logged audit history.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: 'Emergency Kill-Switch',
            processTag: 'EMRG-DEACT',
            tone: 'rose',
            action: `Emergency deactivated identity & disabled ${systemsToDisable.length} target system accounts (${cleanReason})`,
            target: person.name,
          },
          ...s.auditLog,
        ],
      };
    });
  },

  mitigatePersonSod: (personId) => {
    const person = get().people.find((p) => p.id === personId);
    if (!person) return;

    useSceneStore.getState().resolveAttentionItem('att-provisioning');
    const today = new Date().toISOString().slice(0, 10);

    set((s) => ({
      people: s.people.map((p) =>
        p.id === personId
          ? {
              ...p,
              riskScore: 15,
              roles: p.roles.filter((r) => !r.includes('Legacy')),
              contextRefIds: p.contextRefIds.filter((c) => c !== 'ctx-legacy-ap'),
              sodAlert: undefined,
              lastAttestation: 'SoD remediated just now',
              changeHistory: [
                {
                  id: `h-sod-${Date.now()}`,
                  timestamp: `${today} ${timeNow()}`,
                  source: 'SOX-SOD-402 Engine',
                  category: 'Role / SoD',
                  summary: 'Revoked conflicting legacy Finance: AP-Clerk role and retired legacy context.',
                  changes: [
                    { field: 'riskScore', before: String(p.riskScore), after: '15' },
                    { field: 'roles', before: 'Finance: AP-Clerk (Legacy)', after: 'Revoked' },
                  ],
                },
                ...p.changeHistory,
              ],
            }
          : p
      ),
      entitlements: s.entitlements.map((e) =>
        e.id === 'ent-2' ? { ...e, status: 'Revoked' } : e
      ),
      policies: s.policies.map((pol) =>
        pol.id === 'pol-sod-402' ? { ...pol, violations: 0 } : pol
      ),
      reviews: s.reviews.map((rev) =>
        rev.id === 'rev-1' ? { ...rev, decision: 'Revoked' } : rev
      ),
      toastMessage: `Resolved SOX-402 SoD conflict for ${person.name} by revoking legacy Finance: AP-Clerk.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'SOX-SOD-402 Engine',
          processTag: 'SOD-FIX',
          tone: 'emerald',
          action: 'Stripped conflicting legacy AP-Clerk role; SOX compliance restored',
          target: person.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  rotateNonHumanSecret: (id) => {
    const nh = get().nonHumans.find((n) => n.id === id);
    if (!nh) return;
    set((s) => ({
      nonHumans: s.nonHumans.map((item) =>
        item.id === id
          ? { ...item, lastRotated: 'Just now', status: 'Rotated', riskScore: Math.min(item.riskScore, 22) }
          : item
      ),
      toastMessage: `Rotated cryptographic credentials for ${nh.name} with zero downtime.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Non-Human Vault',
          processTag: 'ROTATE',
          tone: 'sky',
          action: 'Rotated API credentials and updated secret TTL',
          target: nh.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  remediateNonHumanDrift: (id) => {
    const nh = get().nonHumans.find((n) => n.id === id);
    if (!nh) return;
    set((s) => ({
      nonHumans: s.nonHumans.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Governed',
              owner: item.owner.includes('Unassigned') ? 'Platform Security' : item.owner,
              privilegeScope: 'Scoped Least-Privilege Role (Reconciled)',
              riskScore: 14,
              lastRotated: 'Just now',
            }
          : item
      ),
      entitlements: s.entitlements.map((e) =>
        e.assignedTo === nh.name ? { ...e, status: 'Revoked' } : e
      ),
      accounts: s.accounts.map((a) =>
        a.accountName === nh.name
          ? {
              ...a,
              correlatedIdentity:
                nh.owner.includes('Unassigned') ? 'Platform Security (Steward)' : `${nh.owner} (Owner)`,
              correlationState: 'Correlated',
              orphanReason: undefined,
              riskScore: 14,
            }
          : a
      ),
      policies: s.policies.map((pol) =>
        pol.affectedIdentity === nh.name ? { ...pol, violations: 0 } : pol
      ),
      reviews: s.reviews.map((rev) =>
        rev.identity === nh.name ? { ...rev, decision: 'Revoked' } : rev
      ),
      toastMessage: `Contained ${nh.name}: revoked out-of-band shadow grant and bound least-privilege policy.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'NHI Governance',
          processTag: 'CONTAIN',
          tone: 'emerald',
          action: 'Revoked shadow drift grant and assigned accountable owner',
          target: nh.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  syncApplication: (appId) => {
    const app = get().applications.find((a) => a.id === appId);
    if (!app) return;

    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === appId
          ? { ...a, parity: 100, status: 'Synced', lastSync: 'Just now' }
          : a
      ),
      toastMessage: `Reconciled ${app.name}: Desired == Actual parity verified at 100%.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Connector Fabric',
          processTag: 'RECONCILE',
          tone: 'emerald',
          action: `Completed bidirectional sync (${app.connector}) · 100% parity`,
          target: app.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  revokeEntitlementDrift: (entId) => {
    const ent = get().entitlements.find((e) => e.id === entId);
    if (!ent) return;
    set((s) => ({
      entitlements: s.entitlements.map((e) =>
        e.id === entId ? { ...e, status: 'Revoked' } : e
      ),
      toastMessage: `Revoked unreconciled entitlement ${ent.name} from ${ent.assignedTo}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Process++ Reconcile',
          processTag: 'REVOKE',
          tone: 'amber',
          action: `Removed direct entitlement ${ent.name}`,
          target: ent.assignedTo,
        },
        ...s.auditLog,
      ],
    }));
  },

  decideReviewItem: (reviewId, decision) => {
    const item = get().reviews.find((r) => r.id === reviewId);
    if (!item) return;

    const updatedReviews = get().reviews.map((r) =>
      r.id === reviewId ? { ...r, decision } : r
    );
    const allDone = updatedReviews.every((r) => r.decision !== 'Pending');
    if (allDone) {
      useSceneStore.getState().resolveAttentionItem('att-reviews');
    }

    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const { smtp, emailTemplate } = get().platformConfig;
    const revMsgCode = `EML-${7049 + get().emailNotifications.length}`;
    const reviewTemplateData: BrandedEmailTemplateInput = {
      badgeText: `CERTIFICATION ${decision.toUpperCase()}`,
      badgeTone: decision === 'Approved' ? 'emerald' : 'amber',
      headline: `Your Access to ${item.roleOrEntitlement} Was ${decision}`,
      greeting: `Hello ${item.identity},`,
      intro: `Reviewer ${item.reviewer} has finalized an attestation decision under workflow ${item.workflowType} (${item.workflowCode}).`,
      metadataRows: [
        { label: 'Decision', value: decision, mono: true },
        { label: 'Entitlement / Role', value: item.roleOrEntitlement },
        { label: 'Target System', value: item.application },
        { label: 'Selected Workflow', value: `${item.workflowType} (${item.workflowCode})`, mono: true },
        { label: 'Certifying Reviewer', value: item.reviewer },
      ],
      calloutTitle:
        decision === 'Revoked' ? 'Automated Deprovisioning Triggered' : 'Audit Proof Sealed',
      calloutText:
        decision === 'Revoked'
          ? `IDENTRA Provisioning Engine has queued automatic revocation of ${item.roleOrEntitlement} on ${item.application}.`
          : 'No action is required on your part. Your certified access remains active through the next quarterly cycle.',
      ctaLabel: 'View Certification Receipt',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: revMsgCode,
      timestamp: `${today} ${stamp}`,
    };
    const reviewNotif: DemoEmailNotification = {
      id: `eml-rev-${Date.now()}`,
      messageCode: revMsgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Access Review ${decision} · ${item.workflowType} (${item.workflowCode})`,
      triggerCategory: 'Access Review',
      recipientName: item.identity,
      recipientEmail: item.identitySnapshot.email.replace(/^owner:\s*/i, ''),
      recipientRole: item.identityTitle,
      cc: [`${item.reviewer.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`],
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Access Certification ${decision}: ${item.roleOrEntitlement}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 212,
      templateData: reviewTemplateData,
      htmlBody: buildBrandedIdentraEmailHtml(reviewTemplateData, emailTemplate),
    };

    set((s) => ({
      reviews: updatedReviews,
      emailNotifications: [reviewNotif, ...s.emailNotifications],
      toastMessage: `${decision} "${item.roleOrEntitlement}" for ${item.identity}. Audit proof sealed.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: item.reviewer,
          processTag: 'ATTEST',
          tone: decision === 'Approved' ? 'emerald' : 'amber',
          action: `${decision} access to ${item.roleOrEntitlement}`,
          target: item.identity,
        },
        ...s.auditLog,
      ],
    }));
  },

  autoCompleteReviews: () => {
    useSceneStore.getState().resolveAttentionItem('att-reviews');
    set((s) => ({
      reviews: s.reviews.map((r) =>
        r.decision === 'Pending'
          ? { ...r, decision: r.aiRecommendation === 'Approve' ? 'Approved' : 'Revoked' }
          : r
      ),
      toastMessage: 'Completed all pending Access Reviews using Process++ risk recommendations.',
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Process++ Attestation',
          processTag: 'ATTEST',
          tone: 'emerald',
          action: 'Auto-completed 5 campaign reviews (3 high-risk revoked, 2 nominal approved)',
          target: 'Q4 Certification Campaign',
        },
        ...s.auditLog,
      ],
    }));
  },

  togglePolicyEnforced: (policyId) => {
    set((s) => ({
      policies: s.policies.map((p) =>
        p.id === policyId ? { ...p, enforced: !p.enforced } : p
      ),
    }));
  },

  mitigatePolicyViolation: (policyId) => {
    const pol = get().policies.find((p) => p.id === policyId);
    if (!pol) return;

    if (policyId === 'pol-sod-402') {
      get().mitigatePersonSod('p-elena');
      return;
    }
    if (policyId === 'pol-jml-001') {
      get().offboardPerson('p-mark');
      return;
    }
    if (policyId === 'pol-ai-209') {
      get().remediateNonHumanDrift('nh-deploy');
      return;
    }
  },

  runPocScenario: (scenario) => {
    if (scenario === 'joiner') {
      get().onboardNewJoiner();
      set({ activeSection: 'people' });
    } else if (scenario === 'sod') {
      get().mitigatePersonSod('p-elena');
      set({ activeSection: 'policies-sod' });
    } else if (scenario === 'orphan') {
      get().offboardPerson('p-mark');
      set({ activeSection: 'people', selectedPersonId: 'p-mark' });
    } else if (scenario === 'ai-agent') {
      get().remediateNonHumanDrift('nh-deploy');
      set({ activeSection: 'non-human' });
    }
  },

  resetAllDemoData: () => {
    useSceneStore.getState().resetDashboardDemo();
    set({
      people: INITIAL_DEMO_PEOPLE,
      nonHumans: INITIAL_DEMO_NON_HUMAN,
      applications: INITIAL_DEMO_APPS,
      entitlements: INITIAL_DEMO_ENTITLEMENTS,
      roles: INITIAL_DEMO_ROLES,
      minedRoles: INITIAL_MINED_ROLES,
      miningOutliers: INITIAL_MINING_OUTLIERS,
      roleOptimisations: INITIAL_ROLE_OPTIMISATIONS,
      birthrights: INITIAL_DEMO_BIRTHRIGHTS,
      accounts: INITIAL_DEMO_ACCOUNTS,
      reviews: INITIAL_DEMO_REVIEWS,
      policies: INITIAL_DEMO_POLICIES,
      governanceControls: INITIAL_GOVERNANCE_CONTROLS,
      contractorRequests: INITIAL_CONTRACTOR_REQUESTS,
      entitlementRequests: INITIAL_ENTITLEMENT_REQUESTS,
      provisioningJobs: INITIAL_PROVISIONING_JOBS,
      importRuns: INITIAL_IMPORT_RUNS,
      emailNotifications: INITIAL_EMAIL_NOTIFICATIONS,
      platformConfig: INITIAL_PLATFORM_CONFIG,
      auditLog: INITIAL_DEMO_AUDIT,
      selectedPersonId: null,
      toastMessage: 'Reset all IDENTRA proof-of-concept sample data to initial baseline.',
    });
  },
}));
