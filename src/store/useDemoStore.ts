import { create } from 'zustand';
import {
  CONTRACTOR_ONBOARDING_WORKFLOWS,
  CURRENT_DEMO_USER_PERSON_ID,
  ENTITLEMENT_ONBOARDING_WORKFLOWS,
  INITIAL_ACCESS_REQUESTS,
  INITIAL_AD_OUS,
  INITIAL_ADOPTION_POLICY,
  INITIAL_ADOPTION_RECORDS,
  INITIAL_CONTRACTOR_REQUESTS,
  INITIAL_CUSTOM_WORKFLOWS,
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
  INITIAL_EMPTY_ENTITLEMENTS,
  INITIAL_ENTITLEMENT_REQUESTS,
  INITIAL_GOVERNANCE_CONTROLS,
  INITIAL_IMPORT_RUNS,
  INITIAL_LEAVE_DELEGATION,
  INITIAL_LICENSE_SKUS,
  INITIAL_MARKETPLACE_CATALOG,
  INITIAL_MINED_ROLES,
  INITIAL_MINING_OUTLIERS,
  INITIAL_OU_REQUESTS,
  INITIAL_PLATFORM_CONFIG,
  INITIAL_PREDICTED_LEAVERS,
  INITIAL_PROVISIONING_JOBS,
  INITIAL_ROLE_OPTIMISATIONS,
  INITIAL_SCHEMA_OBJECTS,
  INITIAL_SYSTEM_ADOPTION_MAPPINGS,
  buildBrandedIdentraEmailHtml,
  evaluateBirthrightMatches,
  type AdoptionHumanClassification,
  type AdoptionNhiClassification,
  type AdoptionPolicyConfig,
  type BrandedEmailTemplateInput,
  type DemoAccessRequest,
  type DemoAdoptionRecord,
  type DemoApplication,
  type DemoAuditEntry,
  type DemoBirthrightRule,
  type DemoContractorOnboardingRequest,
  type DemoCustomWorkflow,
  type DemoEmailNotification,
  type DemoEmptyEntitlement,
  type DemoEntitlement,
  type DemoEntitlementOnboardingRequest,
  type DemoGovernanceControl,
  type DemoImportRun,
  type DemoLicenseSku,
  type DemoMinedRoleCandidate,
  type DemoMiningOutlier,
  type DemoNonHuman,
  type DemoOrganizationalUnit,
  type DemoOuProvisioningRequest,
  type DemoPerson,
  type DemoPolicy,
  type DemoPredictedLeaver,
  type DemoProvisioningJob,
  type DemoReviewItem,
  type DemoRole,
  type DemoRoleOptimisationItem,
  type DemoSchemaObject,
  type DemoSchemaProperty,
  type DemoSectionId,
  type DemoTargetAccount,
  type GovernanceControlDomain,
  type IdentityProvenance,
  type LeaveDelegationConfig,
  type MarketplaceApproverStep,
  type MasterEmailTemplateConfig,
  type OnboardingApprovalStage,
  type PlatformConfig,
  type SmtpConfig,
  type SystemAdoptionMapping,
} from '@/data/demoSampleData';
import { useSceneStore } from '@/store/useSceneStore';

function timeNow(): string {
  return new Date().toTimeString().slice(0, 8);
}

interface DemoStore {
  activeSection: DemoSectionId;
  onboardingTab: 'contractor' | 'entitlement';
  reportingTab:
    | 'entitlements'
    | 'empty-entitlements'
    | 'accounts'
    | 'orphaned'
    | 'unapproved'
    | 'identity-changes'
    | 'birthrights'
    | 'executive';
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
  licenseSkus: DemoLicenseSku[];
  predictedLeavers: DemoPredictedLeaver[];
  accounts: DemoTargetAccount[];
  reviews: DemoReviewItem[];
  policies: DemoPolicy[];
  governanceControls: DemoGovernanceControl[];
  adOus: DemoOrganizationalUnit[];
  ouRequests: DemoOuProvisioningRequest[];
  emptyEntitlements: DemoEmptyEntitlement[];
  contractorRequests: DemoContractorOnboardingRequest[];
  entitlementRequests: DemoEntitlementOnboardingRequest[];
  accessRequests: DemoAccessRequest[];
  leaveDelegation: LeaveDelegationConfig;
  adoptionMappings: SystemAdoptionMapping[];
  adoptionPolicy: AdoptionPolicyConfig;
  adoptionRecords: DemoAdoptionRecord[];
  pendingAdoptAccountId: string | null;
  provisioningJobs: DemoProvisioningJob[];
  importRuns: DemoImportRun[];
  emailNotifications: DemoEmailNotification[];
  platformConfig: PlatformConfig;
  schemaObjects: DemoSchemaObject[];
  customWorkflows: DemoCustomWorkflow[];
  auditLog: DemoAuditEntry[];

  setActiveSection: (section: DemoSectionId) => void;
  openOnboardingTab: (tab: 'contractor' | 'entitlement') => void;
  openReportingTab: (tab: DemoStore['reportingTab']) => void;
  setSearchQuery: (q: string) => void;
  setSelectedPersonId: (id: string | null) => void;
  clearToast: () => void;

  // Orphaned Account Adoption actions
  openOrphanAdoptionForAccount: (accountId: string | null) => void;
  updateAdoptionPolicy: (patch: Partial<AdoptionPolicyConfig>) => void;
  updateSystemMappingRule: (
    systemName: string,
    ruleId: string,
    sourceAttribute: string
  ) => void;
  adoptPromoteToIdentity: (input: {
    accountId: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    employeeNumber: string;
    manager: string;
    managerRefId: string;
    classification: AdoptionHumanClassification;
    expiryDate: string | null;
    authoritativeSource: string;
  }) => void;
  approvePendingAdoption: (recordId: string) => void;
  adoptCorrelateExisting: (accountId: string, personId: string) => void;
  adoptClassifyNonHuman: (input: {
    accountId: string;
    nhiKind: AdoptionNhiClassification;
    ownerName: string;
    privilegeScope: string;
  }) => void;
  bulkAdoptOrphans: (accountIds: string[], defaultOwner: string) => void;
  rollbackAdoption: (recordId: string) => void;

  // Access Marketplace, Escalation & Leave Delegation actions
  submitAccessRequest: (input: {
    targetPersonId: string;
    primaryContextId: string;
    primaryContextLabel: string;
    selectedAccountId: string;
    selectedAccountName: string;
    selectedAccountKind: 'Standard User' | 'Privileged Admin';
    catalogItemId: string;
    activationDate: string;
    deactivationDate: string | null;
    motivation: string;
    sodStatus: 'Clean' | 'Violation Flagged (Exception)';
    sodDetail?: string;
  }) => void;
  advanceAccessRequestApproval: (
    requestId: string,
    decision: 'approve-stage' | 'reject'
  ) => void;
  escalateAccessRequest: (requestId: string) => void;
  updateLeaveDelegation: (patch: Partial<LeaveDelegationConfig>) => void;

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
  triggerEmptyEntitlementDeletion: (
    emptyEntitlementId: string,
    executionMode?: 'immediate' | 'simulation'
  ) => void;
  bulkDeleteEmptyEntitlements: (
    emptyEntitlementIds: string[],
    executionMode?: 'immediate' | 'simulation'
  ) => void;
  approveEmptyEntitlementException: (
    emptyEntitlementId: string,
    reason?: string
  ) => void;
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

  // Data Objects, Schema Properties & Sensitive Field Masking actions
  createSchemaObject: (input: {
    name: string;
    apiName: string;
    category: DemoSchemaObject['category'];
    description: string;
    initialProperties?: Omit<DemoSchemaProperty, 'id'>[];
  }) => string;
  addSchemaProperty: (
    objectId: string,
    prop: Omit<DemoSchemaProperty, 'id'>
  ) => void;
  updateSchemaProperty: (
    objectId: string,
    propertyId: string,
    patch: Partial<Omit<DemoSchemaProperty, 'id'>>
  ) => void;
  deleteSchemaProperty: (objectId: string, propertyId: string) => void;
  logSensitiveFieldReveal: (identityName: string, fieldLabel: string) => void;

  // Custom Reference-Object Workflows actions
  createCustomWorkflow: (
    input: Omit<DemoCustomWorkflow, 'id' | 'code' | 'createdAt' | 'lastSimulatedAt'>
  ) => void;
  toggleCustomWorkflowStatus: (workflowId: string) => void;
  deleteCustomWorkflow: (workflowId: string) => void;
  simulateCustomWorkflow: (workflowId: string, targetPersonId: string) => void;

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

  // License SKU Inventory & Capacity actions
  adjustLicensePool: (skuId: string, deltaSeats: number) => void;
  reclaimInactiveLicenses: (skuId: string) => void;
  updateLicenseSkuConfig: (
    skuId: string,
    patch: { totalPurchased?: number; warningThresholdPct?: number }
  ) => void;

  // Predicted / Future Leavers actions
  stagePredictedLeaverInSimulation: (leaverId: string) => void;
  executePredictedLeaverExitNow: (leaverId: string) => void;

  // Active Directory Structural Governance (OU Management) actions
  runAdOuDiscoveryScan: () => void;
  governOrganizationalUnit: (
    ouId: string,
    businessOwner: string,
    technicalCustodian: string
  ) => void;
  attestOuOwnership: (ouId: string) => void;
  revokeOuDelegation: (ouId: string, delegationId: string) => void;
  reconcileOuDrift: (ouId: string) => void;
  relocateOrganizationalUnit: (ouId: string, newParentOuId: string | null) => void;
  decommissionEmptyOu: (ouId: string) => void;
  submitOuProvisioningRequest: (input: {
    ouName: string;
    parentOuId: string;
    businessOwner: string;
    technicalCustodian: string;
    purpose: string;
  }) => void;
  advanceOuRequestApproval: (
    requestId: string,
    decision: 'approve-stage' | 'approve-all' | 'reject'
  ) => void;

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
  reportingTab: 'entitlements',
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
  licenseSkus: INITIAL_LICENSE_SKUS,
  predictedLeavers: INITIAL_PREDICTED_LEAVERS,
  accounts: INITIAL_DEMO_ACCOUNTS,
  reviews: INITIAL_DEMO_REVIEWS,
  policies: INITIAL_DEMO_POLICIES,
  governanceControls: INITIAL_GOVERNANCE_CONTROLS,
  adOus: INITIAL_AD_OUS,
  ouRequests: INITIAL_OU_REQUESTS,
  emptyEntitlements: INITIAL_EMPTY_ENTITLEMENTS,
  contractorRequests: INITIAL_CONTRACTOR_REQUESTS,
  entitlementRequests: INITIAL_ENTITLEMENT_REQUESTS,
  accessRequests: INITIAL_ACCESS_REQUESTS,
  leaveDelegation: INITIAL_LEAVE_DELEGATION,
  adoptionMappings: INITIAL_SYSTEM_ADOPTION_MAPPINGS,
  adoptionPolicy: INITIAL_ADOPTION_POLICY,
  adoptionRecords: INITIAL_ADOPTION_RECORDS,
  pendingAdoptAccountId: null,
  provisioningJobs: INITIAL_PROVISIONING_JOBS,
  importRuns: INITIAL_IMPORT_RUNS,
  emailNotifications: INITIAL_EMAIL_NOTIFICATIONS,
  platformConfig: INITIAL_PLATFORM_CONFIG,
  schemaObjects: INITIAL_SCHEMA_OBJECTS,
  customWorkflows: INITIAL_CUSTOM_WORKFLOWS,
  auditLog: INITIAL_DEMO_AUDIT,

  setActiveSection: (section) => set({ activeSection: section }),
  openOnboardingTab: (tab) => set({ activeSection: 'onboarding', onboardingTab: tab }),
  openReportingTab: (tab) => set({ activeSection: 'reporting', reportingTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedPersonId: (id) => set({ selectedPersonId: id }),
  clearToast: () => set({ toastMessage: null }),

  openOrphanAdoptionForAccount: (accountId) =>
    set({
      pendingAdoptAccountId: accountId,
      activeSection: 'orphan-adoption',
    }),

  updateAdoptionPolicy: (patch) => {
    const nextPolicy: AdoptionPolicyConfig = {
      ...get().adoptionPolicy,
      ...patch,
      duplicateRules: {
        ...get().adoptionPolicy.duplicateRules,
        ...(patch.duplicateRules ?? {}),
      },
    };
    set((s) => ({
      adoptionPolicy: nextPolicy,
      toastMessage: `Updated Orphaned Account Adoption policy (${nextPolicy.mode}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: timeNow(),
          actor: 'Governance Config',
          processTag: 'ADP-POL',
          tone: 'sky',
          action: `Updated Adoption Policy mode to "${nextPolicy.mode}"`,
          target: 'Orphaned Account Adoption',
        },
        ...s.auditLog,
      ],
    }));
  },

  updateSystemMappingRule: (systemName, ruleId, sourceAttribute) => {
    set((s) => ({
      adoptionMappings: s.adoptionMappings.map((sys) =>
        sys.systemName === systemName
          ? {
              ...sys,
              rules: sys.rules.map((r) =>
                r.id === ruleId ? { ...r, sourceAttribute } : r
              ),
            }
          : sys
      ),
      toastMessage: `Updated attribute mapping on ${systemName} → ${sourceAttribute}.`,
    }));
  },

  adoptPromoteToIdentity: (input) => {
    const acc = get().accounts.find((a) => a.id === input.accountId);
    if (!acc) return;

    const todayIso = new Date().toISOString().slice(0, 10);
    const todayDisplay = todayIso.split('-').reverse().join('/');
    const stamp = timeNow();
    const approvalRef = `APR-${10245 + get().adoptionRecords.length}`;
    const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`;
    const policy = get().adoptionPolicy;

    // If policy requires approval, hold in Pending Approval before creating identity
    if (policy.mode === 'Require Approval (Manager / System Owner)') {
      const pendingRecord: DemoAdoptionRecord = {
        id: `adp-${Date.now()}`,
        approvalReference: approvalRef,
        actionKind: 'Promote to Identity',
        classification: input.classification,
        originalAccountId: acc.id,
        originalAccountName: acc.accountName,
        originalSource: acc.application,
        targetIdentityName: fullName,
        adoptedBy: 'Ivan Lubbe',
        adoptionDate: todayDisplay,
        creationSource: `Orphaned account adoption · ${acc.application}`,
        authoritativeSource: input.authoritativeSource,
        accountCorrelationSource: acc.application,
        expiryDate: input.expiryDate,
        status: 'Pending Approval',
        pendingPayload: {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.trim(),
          department: input.department.trim() || 'Corporate Finance & Treasury',
          employeeNumber: input.employeeNumber.trim(),
          manager: input.manager,
          managerRefId: input.managerRefId,
          classification: input.classification,
          expiryDate: input.expiryDate,
          authoritativeSource: input.authoritativeSource,
        },
      };

      set((s) => ({
        adoptionRecords: [pendingRecord, ...s.adoptionRecords],
        toastMessage: `Adoption ${approvalRef} for "${acc.accountName}" queued for Manager/Owner approval before creating ${fullName}.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: 'Orphan Adoption',
            processTag: 'ADP-REQ',
            tone: 'amber',
            action: `Queued orphaned account adoption (${approvalRef}) for ${acc.accountName} awaiting approval`,
            target: fullName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    const newPersonId = `p-adp-${Date.now()}`;
    const isContractor = input.classification !== 'Employee';
    const provenance: IdentityProvenance = {
      creationMethod: 'Orphaned account adoption',
      creationSource: `Orphaned account adoption · ${acc.application}`,
      authoritativeSource: input.authoritativeSource,
      accountCorrelationSource: acc.application,
      originalAccountId: acc.accountName,
      adoptedBy: 'Ivan Lubbe',
      adoptionDate: todayDisplay,
      approvalReference: approvalRef,
    };

    const newPerson: DemoPerson = {
      id: newPersonId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      name: fullName,
      employeeNumber: input.employeeNumber.trim(),
      email: input.email.trim().toLowerCase(),
      upn: `${acc.accountName}@corp.identra.net`,
      samAccountName: acc.accountName,
      title: isContractor ? input.classification : `${input.department || 'Finance'} Specialist`,
      department: input.department.trim() || 'Corporate Finance & Treasury',
      departmentRefId: input.department.toLowerCase().includes('finance')
        ? 'dept-finance'
        : isContractor
          ? 'dept-contractor'
          : 'dept-eng',
      companyName: isContractor ? 'External Partner (Adopted)' : 'IDENTRA Global Holdings Ltd',
      companyRefId: isContractor ? 'comp-ext-audit' : 'comp-identra-uk',
      orgUnitName: isContractor ? 'External Contractors & Auditors' : 'EMEA Finance Operations',
      orgUnitRefId: isContractor ? 'ou-ext-contractors' : 'ou-fin-analysts',
      costCenterCode: isContractor ? 'CC-9001-EXT' : 'CC-4100-FIN',
      costCenterRefId: isContractor ? 'cc-9001' : 'cc-4100',
      location: 'Johannesburg / HQ',
      type: isContractor ? 'Contractor' : 'Employee',
      contractType: isContractor
        ? `Adopted ${input.classification} (Expires ${input.expiryDate ?? '90d'})`
        : 'Full-Time Permanent (Adopted)',
      hrStartDate: todayIso,
      hrEndDate: input.expiryDate,
      sourceSystem: input.authoritativeSource,
      sourceRefId: 'src-workday',
      sourceExternalId: approvalRef,
      lastHrSync: `Adopted ${todayDisplay} · ${stamp}`,
      jmlStatus: 'Active',
      riskScore: 18,
      roles: ['Corporate SSO Standard'],
      applications: [acc.application],
      manager: input.manager,
      managerRefId: input.managerRefId,
      contextRefIds: [isContractor ? 'ctx-ext-audit' : 'ctx-fin-uk-fte'],
      lastAttestation: `Adopted from ${acc.application} (${approvalRef})`,
      provenance,
      changeHistory: [
        {
          id: `h-adp-${Date.now()}`,
          timestamp: `${todayIso} ${stamp}`,
          source: `Orphaned Account Adoption (${approvalRef})`,
          category: 'JML Lifecycle',
          summary: `Identity adopted from orphaned ${acc.application} account "${acc.accountName}" by Ivan Lubbe. Authoritative source set to ${input.authoritativeSource}.`,
          changes: [
            { field: 'creationMethod', before: null, after: 'Orphaned account adoption' },
            { field: 'originalAccount', before: 'Orphaned', after: `${acc.accountName} (${acc.application})` },
            { field: 'authoritativeSource', before: null, after: input.authoritativeSource },
            { field: 'manager', before: 'Missing', after: input.manager },
            { field: 'employeeNumber', before: 'Missing', after: input.employeeNumber.trim() },
          ],
        },
      ],
    };

    const completedRecord: DemoAdoptionRecord = {
      id: `adp-${Date.now()}`,
      approvalReference: approvalRef,
      actionKind: 'Promote to Identity',
      classification: input.classification,
      originalAccountId: acc.id,
      originalAccountName: acc.accountName,
      originalSource: acc.application,
      targetIdentityName: fullName,
      createdPersonId: newPersonId,
      adoptedBy: 'Ivan Lubbe',
      adoptionDate: todayDisplay,
      creationSource: `Orphaned account adoption · ${acc.application}`,
      authoritativeSource: input.authoritativeSource,
      accountCorrelationSource: acc.application,
      expiryDate: input.expiryDate,
      status: 'Completed',
    };

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const mgrEmail = `${input.manager.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`;
    const tplData: BrandedEmailTemplateInput = {
      badgeText: `ORPHAN ADOPTED · ${approvalRef}`,
      badgeTone: 'emerald',
      headline: `Orphaned Account "${acc.accountName}" Adopted Into Governance`,
      greeting: `Hi ${input.manager},`,
      intro: `Orphaned ${acc.application} account "${acc.accountName}" has been promoted to a governed ${input.classification} identity (${fullName}) and correlated under your management.`,
      metadataRows: [
        { label: 'Approval Reference', value: approvalRef, mono: true },
        { label: 'Created Identity', value: `${fullName} (${input.employeeNumber.trim()})` },
        { label: 'Original Source Account', value: `${acc.accountName} (${acc.application})`, mono: true },
        { label: 'Creation Source', value: `Orphaned account adoption · ${acc.application}` },
        { label: 'Authoritative Source', value: input.authoritativeSource },
        { label: 'Adopted By', value: `Ivan Lubbe · ${todayDisplay}` },
      ],
      calloutTitle: 'Authoritative Source Separation Preserved',
      calloutText: `${acc.application} was recorded as the creation and correlation source only — authoritative maintenance remains assigned to "${input.authoritativeSource}".`,
      ctaLabel: 'Inspect Adopted Identity',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${todayIso} ${stamp}`,
    };

    const adoptEmail: DemoEmailNotification = {
      id: `eml-adp-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${todayIso} ${stamp}`,
      status: 'Delivered',
      trigger: `Orphaned Account Adoption · ${acc.accountName} (${approvalRef})`,
      triggerCategory: 'JML Lifecycle',
      recipientName: input.manager,
      recipientEmail: mgrEmail,
      recipientRole: 'Assigned Manager / Owner',
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Orphaned Account Adopted (${approvalRef}): ${fullName} ← ${acc.accountName}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 184,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      people: [newPerson, ...s.people],
      accounts: s.accounts.map((a) =>
        a.id === acc.id
          ? {
              ...a,
              personId: newPersonId,
              correlatedIdentity: fullName,
              correlationState: 'Correlated',
              orphanReason: undefined,
              riskScore: 18,
            }
          : a
      ),
      adoptionRecords: [completedRecord, ...s.adoptionRecords],
      emailNotifications: [adoptEmail, ...s.emailNotifications],
      pendingAdoptAccountId: null,
      toastMessage: `Adopted "${acc.accountName}" → created ${fullName} (${input.employeeNumber.trim()}) and correlated account (${approvalRef}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Ivan Lubbe (Adoption)',
          processTag: 'ADP-NEW',
          tone: 'emerald',
          action: `Promoted orphaned ${acc.application} account "${acc.accountName}" to ${input.classification} (${approvalRef})`,
          target: fullName,
        },
        ...s.auditLog,
      ],
    }));
  },

  approvePendingAdoption: (recordId) => {
    const rec = get().adoptionRecords.find((r) => r.id === recordId);
    if (!rec || rec.status !== 'Pending Approval' || !rec.pendingPayload) return;

    const payload = rec.pendingPayload;
    const prevMode = get().adoptionPolicy.mode;
    // Temporarily execute immediate creation while preserving approval ref
    set((s) => ({
      adoptionRecords: s.adoptionRecords.filter((r) => r.id !== recordId),
      adoptionPolicy: { ...s.adoptionPolicy, mode: 'Immediate (Permitted)' },
    }));
    get().adoptPromoteToIdentity({
      accountId: rec.originalAccountId,
      ...payload,
    });
    set((s) => ({
      adoptionPolicy: { ...s.adoptionPolicy, mode: prevMode },
    }));
  },

  adoptCorrelateExisting: (accountId, personId) => {
    const acc = get().accounts.find((a) => a.id === accountId);
    const person = get().people.find((p) => p.id === personId);
    if (!acc || !person) return;

    const todayIso = new Date().toISOString().slice(0, 10);
    const todayDisplay = todayIso.split('-').reverse().join('/');
    const stamp = timeNow();
    const approvalRef = `APR-${10245 + get().adoptionRecords.length}`;

    const record: DemoAdoptionRecord = {
      id: `adp-cor-${Date.now()}`,
      approvalReference: approvalRef,
      actionKind: 'Correlate to Existing',
      classification: `${person.type} (Existing Identity)`,
      originalAccountId: acc.id,
      originalAccountName: acc.accountName,
      originalSource: acc.application,
      targetIdentityName: person.name,
      correlatedPersonId: person.id,
      adoptedBy: 'Ivan Lubbe',
      adoptionDate: todayDisplay,
      creationSource: `Manual correlation · ${acc.application}`,
      authoritativeSource: person.sourceSystem,
      accountCorrelationSource: acc.application,
      status: 'Completed',
    };

    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === acc.id
          ? {
              ...a,
              personId: person.id,
              correlatedIdentity: person.name,
              correlationState: 'Correlated',
              orphanReason: undefined,
              riskScore: Math.min(a.riskScore, 20),
            }
          : a
      ),
      people: s.people.map((p) =>
        p.id === person.id
          ? {
              ...p,
              applications: p.applications.includes(acc.application)
                ? p.applications
                : [...p.applications, acc.application],
              changeHistory: [
                {
                  id: `h-cor-${Date.now()}`,
                  timestamp: `${todayIso} ${stamp}`,
                  source: `Orphaned Account Correlation (${approvalRef})`,
                  category: 'Provisioning',
                  summary: `Correlated orphaned ${acc.application} account "${acc.accountName}" to existing identity (duplicate prevented).`,
                  changes: [
                    { field: 'correlatedAccount', before: 'Orphaned', after: `${acc.accountName} (${acc.application})` },
                    { field: 'approvalReference', before: null, after: approvalRef },
                  ],
                },
                ...p.changeHistory,
              ],
            }
          : p
      ),
      adoptionRecords: [record, ...s.adoptionRecords],
      pendingAdoptAccountId: null,
      toastMessage: `Correlated "${acc.accountName}" (${acc.application}) to existing identity ${person.name} — duplicate avoided (${approvalRef}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Ivan Lubbe (Adoption)',
          processTag: 'ADP-COR',
          tone: 'sky',
          action: `Correlated orphaned account "${acc.accountName}" to existing identity (${approvalRef})`,
          target: person.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  adoptClassifyNonHuman: (input) => {
    const acc = get().accounts.find((a) => a.id === input.accountId);
    if (!acc) return;

    const todayIso = new Date().toISOString().slice(0, 10);
    const todayDisplay = todayIso.split('-').reverse().join('/');
    const stamp = timeNow();
    const approvalRef = `APR-${10245 + get().adoptionRecords.length}`;
    const newNhiId = `nh-adp-${Date.now()}`;

    const mappedKind: DemoNonHuman['kind'] =
      input.nhiKind === 'API Token' ? 'API Token' : 'Service Account';

    const newNhi: DemoNonHuman = {
      id: newNhiId,
      name: acc.accountName,
      kind: mappedKind,
      owner: input.ownerName,
      targetSystem: acc.application,
      privilegeScope: input.privilegeScope || `${input.nhiKind} · Governed via Adoption`,
      status: 'Governed',
      riskScore: 16,
      lastRotated: 'Registered just now',
    };

    const record: DemoAdoptionRecord = {
      id: `adp-nhi-${Date.now()}`,
      approvalReference: approvalRef,
      actionKind: 'Classify as Non-Human',
      classification: input.nhiKind,
      originalAccountId: acc.id,
      originalAccountName: acc.accountName,
      originalSource: acc.application,
      targetIdentityName: `${acc.accountName} (Owner: ${input.ownerName})`,
      createdNonHumanId: newNhiId,
      adoptedBy: 'Ivan Lubbe',
      adoptionDate: todayDisplay,
      creationSource: `Orphaned account adoption · ${acc.application}`,
      authoritativeSource: 'IDENTRA NHI Registry',
      accountCorrelationSource: acc.application,
      status: 'Completed',
    };

    set((s) => ({
      nonHumans: s.nonHumans.some((n) => n.name === acc.accountName)
        ? s.nonHumans.map((n) =>
            n.name === acc.accountName
              ? { ...n, owner: input.ownerName, status: 'Governed', riskScore: 16 }
              : n
          )
        : [newNhi, ...s.nonHumans],
      accounts: s.accounts.map((a) =>
        a.id === acc.id
          ? {
              ...a,
              correlatedIdentity: `${input.ownerName} (NHI Owner)`,
              correlationState: 'Correlated',
              orphanReason: undefined,
              riskScore: 16,
            }
          : a
      ),
      adoptionRecords: [record, ...s.adoptionRecords],
      pendingAdoptAccountId: null,
      toastMessage: `Classified "${acc.accountName}" as Non-Human Identity (${input.nhiKind}) with accountable owner ${input.ownerName} (${approvalRef}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Ivan Lubbe (Adoption)',
          processTag: 'ADP-NHI',
          tone: 'emerald',
          action: `Classified orphaned ${acc.application} account as ${input.nhiKind} · Owner: ${input.ownerName} (${approvalRef})`,
          target: acc.accountName,
        },
        ...s.auditLog,
      ],
    }));
  },

  bulkAdoptOrphans: (accountIds, defaultOwner) => {
    const targets = get().accounts.filter(
      (a) => accountIds.includes(a.id) && a.correlationState === 'Orphaned'
    );
    if (targets.length === 0) return;

    targets.forEach((acc) => {
      if (
        acc.accountType === 'Service Account' ||
        acc.accountType === 'API Token' ||
        acc.accountType === 'AI Agent'
      ) {
        get().adoptClassifyNonHuman({
          accountId: acc.id,
          nhiKind: acc.accountType === 'API Token' ? 'API Token' : 'Service Account',
          ownerName: defaultOwner,
          privilegeScope: `Bulk-adopted ${acc.accountType} on ${acc.application}`,
        });
      } else {
        const raw = acc.rawAttributes ?? {};
        const first = raw.givenName || raw.NAME_FIRST || acc.accountName.split('.')[0] || 'Adopted';
        const last = raw.sn || raw.NAME_LAST || 'User';
        const mail = raw.mail || raw.SMTP_ADDR || `${acc.accountName}@company.com`;
        const empNo = raw.employeeNumber || `ADP-${Math.floor(10000 + Math.random() * 89999)}`;
        get().adoptPromoteToIdentity({
          accountId: acc.id,
          firstName: first,
          lastName: last,
          email: mail,
          department: raw.department || 'Corporate Finance & Treasury',
          employeeNumber: empNo,
          manager: defaultOwner,
          managerRefId: 'mgr-claire',
          classification: acc.accountType === 'Contractor' ? 'Contractor' : 'Employee',
          expiryDate: acc.accountType === 'Contractor' ? '2027-02-23' : null,
          authoritativeSource: get().adoptionPolicy.defaultAuthoritativeSource,
        });
      }
    });

    set({
      toastMessage: `Bulk adoption processed ${targets.length} orphaned account(s) using per-system mappings and default owner ${defaultOwner}.`,
    });
  },

  rollbackAdoption: (recordId) => {
    const rec = get().adoptionRecords.find((r) => r.id === recordId);
    if (!rec || rec.status !== 'Completed') return;

    const stamp = timeNow();
    set((s) => ({
      adoptionRecords: s.adoptionRecords.map((r) =>
        r.id === recordId ? { ...r, status: 'Rolled Back' } : r
      ),
      accounts: s.accounts.map((a) =>
        a.id === rec.originalAccountId
          ? {
              ...a,
              personId: undefined,
              correlatedIdentity: null,
              correlationState: 'Orphaned',
              orphanReason: `Adoption ${rec.approvalReference} rolled back on ${new Date().toISOString().slice(0, 10)}; awaiting re-classification.`,
              riskScore: 74,
            }
          : a
      ),
      people: rec.createdPersonId
        ? s.people.filter((p) => p.id !== rec.createdPersonId)
        : s.people,
      nonHumans: rec.createdNonHumanId
        ? s.nonHumans.filter((n) => n.id !== rec.createdNonHumanId)
        : s.nonHumans,
      toastMessage: `Rolled back adoption ${rec.approvalReference} ("${rec.originalAccountName}") — account returned to Orphaned queue and audit history preserved.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Ivan Lubbe (Rollback)',
          processTag: 'ADP-UNDO',
          tone: 'amber',
          action: `Rolled back ${rec.actionKind} (${rec.approvalReference}); restored "${rec.originalAccountName}" to Orphaned`,
          target: rec.targetIdentityName,
        },
        ...s.auditLog,
      ],
    }));
  },

  submitAccessRequest: (input) => {
    const targetPerson = get().people.find((p) => p.id === input.targetPersonId);
    const catalogItem = INITIAL_MARKETPLACE_CATALOG.find(
      (c) => c.id === input.catalogItemId
    );
    if (!targetPerson || !catalogItem) return;

    const currentUser =
      get().people.find((p) => p.id === CURRENT_DEMO_USER_PERSON_ID) ?? targetPerson;
    const delegation = get().leaveDelegation;
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const reqCode = `REQ-${5105 + get().accessRequests.length}`;

    const baseStages: MarketplaceApproverStep[] = catalogItem.approvalTemplate.map(
      (tpl, idx) => {
        const resolvedName =
          tpl.approverName === 'Target Manager'
            ? targetPerson.manager
            : tpl.approverName;
        const resolvedRef =
          tpl.approverName === 'Target Manager'
            ? targetPerson.managerRefId
            : tpl.approverRefId;
        const delegatedTo =
          delegation.enabled &&
          delegation.delegateApprovals &&
          resolvedName === delegation.delegatorName
            ? delegation.standInName
            : undefined;

        return {
          step: `Stage ${idx + 1}`,
          approverRole: tpl.approverRole,
          approverName: resolvedName,
          approverRefId: resolvedRef,
          escalationBackup: tpl.escalationBackup,
          status: idx === 0 ? 'Pending' : 'Queued',
          delegatedTo,
        };
      }
    );

    if (input.sodStatus === 'Violation Flagged (Exception)') {
      baseStages.push({
        step: `Stage ${baseStages.length + 1}`,
        approverRole: 'SoD Risk Exception Approval',
        approverName: 'David Chen',
        approverRefId: 'mgr-david',
        escalationBackup: 'Controller Office',
        status: 'Queued',
      });
    }

    const newReq: DemoAccessRequest = {
      id: `req-mkt-${Date.now()}`,
      requestCode: reqCode,
      requestedByName: currentUser.name,
      requestedByPersonId: currentUser.id,
      targetPersonId: targetPerson.id,
      targetPersonName: targetPerson.name,
      primaryContextId: input.primaryContextId,
      primaryContextLabel: input.primaryContextLabel,
      selectedAccountId: input.selectedAccountId,
      selectedAccountName: input.selectedAccountName,
      selectedAccountKind: input.selectedAccountKind,
      catalogItemId: catalogItem.id,
      resourceName: catalogItem.name,
      resourceKind: catalogItem.kind,
      application: catalogItem.application,
      activationDate: input.activationDate,
      deactivationDate: input.deactivationDate,
      motivation: input.motivation.trim(),
      sodStatus: input.sodStatus,
      sodDetail: input.sodDetail,
      workflowCode: catalogItem.workflowCode,
      workflowName: catalogItem.workflowName,
      stages: baseStages,
      status: 'Pending Approval',
      submittedAt: `${today} ${stamp.slice(0, 5)}`,
      waitingHours: 0,
      escalatedCount: 0,
    };

    const stage1 = baseStages[0];
    const effectiveRecipient = stage1.delegatedTo ?? stage1.approverName;
    const recipientEmail = `${effectiveRecipient.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`;
    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const tplData: BrandedEmailTemplateInput = {
      badgeText: stage1.delegatedTo
        ? `DELEGATED APPROVAL · ${catalogItem.workflowCode}`
        : `ACCESS REQUEST · ${catalogItem.workflowCode}`,
      badgeTone: input.sodStatus === 'Clean' ? 'sky' : 'amber',
      headline: `Access Approval Required: ${catalogItem.name}`,
      greeting: stage1.delegatedTo
        ? `Hi ${stage1.delegatedTo} (Stand-In for ${stage1.approverName}),`
        : `Hi ${stage1.approverName},`,
      intro: `${currentUser.name} submitted Access Marketplace request ${reqCode} for ${targetPerson.name} targeting account ${input.selectedAccountName} (${input.selectedAccountKind}).`,
      metadataRows: [
        { label: 'Request Code', value: reqCode, mono: true },
        { label: 'Target Identity', value: `${targetPerson.name} (${targetPerson.employeeNumber})` },
        { label: 'Primary Context', value: input.primaryContextLabel },
        { label: 'Target Account', value: `${input.selectedAccountName} (${input.selectedAccountKind})`, mono: true },
        { label: 'Requested Resource', value: `${catalogItem.name} · ${catalogItem.application}` },
        {
          label: 'Validity Window',
          value: `${input.activationDate} → ${input.deactivationDate ?? 'Indefinite'}`,
          mono: true,
        },
        { label: 'SoD Check', value: input.sodStatus },
      ],
      calloutTitle: 'Requester Business Motivation',
      calloutText: input.motivation.trim(),
      ctaLabel: 'Open My Tasks & Approve',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const approvalEmail: DemoEmailNotification = {
      id: `eml-req-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Access Marketplace Request · ${reqCode} (${catalogItem.workflowName})`,
      triggerCategory: 'Access Review',
      recipientName: effectiveRecipient,
      recipientEmail,
      recipientRole: stage1.delegatedTo
        ? `Stand-In Delegate for ${stage1.approverName}`
        : stage1.approverRole,
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Approval Needed (${reqCode}): ${catalogItem.name} for ${targetPerson.name}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 188,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      accessRequests: [newReq, ...s.accessRequests],
      emailNotifications: [approvalEmail, ...s.emailNotifications],
      toastMessage: `Submitted ${reqCode} for ${targetPerson.name} (${input.selectedAccountKind}) — routed to ${effectiveRecipient}. Track it under My Tasks & Requests.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: currentUser.name,
          processTag: 'MKT-REQ',
          tone: input.sodStatus === 'Clean' ? 'sky' : 'amber',
          action: `Requested "${catalogItem.name}" on ${input.selectedAccountName} (${reqCode})`,
          target: targetPerson.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  advanceAccessRequestApproval: (requestId, decision) => {
    const req = get().accessRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending Approval') return;

    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const activeIdx = req.stages.findIndex(
      (st) => st.status === 'Pending' || st.status === 'Escalated'
    );
    if (activeIdx === -1) return;

    const activeStage = req.stages[activeIdx];
    const actingApprover = activeStage.delegatedTo
      ? `${activeStage.delegatedTo} (Stand-In)`
      : activeStage.approverName;

    if (decision === 'reject') {
      const nextStages = req.stages.map((st, idx) =>
        idx === activeIdx
          ? { ...st, status: 'Rejected' as const, decidedAt: `${today} ${stamp.slice(0, 5)}` }
          : st
      );
      set((s) => ({
        accessRequests: s.accessRequests.map((r) =>
          r.id === requestId ? { ...r, stages: nextStages, status: 'Rejected' } : r
        ),
        toastMessage: `Rejected access request ${req.requestCode} (${req.resourceName}) for ${req.targetPersonName}.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: actingApprover,
            processTag: 'REQ-REJ',
            tone: 'rose',
            action: `Rejected ${req.requestCode} ("${req.resourceName}") at ${activeStage.step}`,
            target: req.targetPersonName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    const nextStages: MarketplaceApproverStep[] = req.stages.map((st, idx) => {
      if (idx === activeIdx) {
        return { ...st, status: 'Approved', decidedAt: `${today} ${stamp.slice(0, 5)}` };
      }
      if (idx === activeIdx + 1) {
        return { ...st, status: 'Pending' };
      }
      return st;
    });

    const allDone = nextStages.every((st) => st.status === 'Approved');

    if (!allDone) {
      const nextStage = nextStages.find((st) => st.status === 'Pending');
      set((s) => ({
        accessRequests: s.accessRequests.map((r) =>
          r.id === requestId ? { ...r, stages: nextStages, waitingHours: 0 } : r
        ),
        toastMessage: `Approved ${activeStage.step} of ${req.requestCode} — routed to ${nextStage?.delegatedTo ?? nextStage?.approverName}.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: actingApprover,
            processTag: 'REQ-APR',
            tone: 'sky',
            action: `Approved ${activeStage.step} of ${req.requestCode}; routed to ${nextStage?.approverRole}`,
            target: req.targetPersonName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    // Final stage approved -> Provision to target person & selected account!
    const provApp: DemoProvisioningJob['application'] =
      req.application === 'Active Directory' ||
      req.application === 'Microsoft Entra ID' ||
      req.application === 'SAP S/4HANA Finance' ||
      req.application === 'AWS Prod Vault' ||
      req.application === 'Snowflake PII Lake'
        ? req.application
        : 'Okta Workforce';

    const newProvJob: DemoProvisioningJob = {
      id: `job-req-${Date.now()}`,
      jobCode: `PRV-${9180 + get().provisioningJobs.length}`,
      identity: req.targetPersonName,
      identityEmail: req.selectedAccountName,
      entitlementOrRole: `${req.resourceName} (${req.selectedAccountKind})`,
      application: provApp,
      operation: 'Update',
      status: 'Completed',
      triggeredBy: `Access Marketplace (${req.requestCode})`,
      timestamp: stamp,
      durationMs: 230,
      mappings: [
        {
          attribute: 'targetAccount',
          before: null,
          after: `${req.selectedAccountName} (${req.selectedAccountKind})`,
          rule: 'ITShop.MultiAccount.Bind',
        },
        {
          attribute: 'validityWindow',
          before: null,
          after: `${req.activationDate} → ${req.deactivationDate ?? 'Indefinite'}`,
          rule: 'ITShop.TimeBound.Schedule',
        },
      ],
    };

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const targetPerson = get().people.find((p) => p.id === req.targetPersonId);
    const tplData: BrandedEmailTemplateInput = {
      badgeText: 'ACCESS PROVISIONED',
      badgeTone: 'emerald',
      headline: `Your Access Request ${req.requestCode} Is Now Active`,
      greeting: `Hi ${req.targetPersonName},`,
      intro: `All approval stages for "${req.resourceName}" have been completed. Access has been provisioned to your selected ${req.selectedAccountKind} account.`,
      metadataRows: [
        { label: 'Request Code', value: req.requestCode, mono: true },
        { label: 'Resource Granted', value: `${req.resourceName} (${req.application})` },
        { label: 'Bound Account', value: `${req.selectedAccountName} (${req.selectedAccountKind})`, mono: true },
        { label: 'Primary Context', value: req.primaryContextLabel },
        {
          label: 'Active Window',
          value: `${req.activationDate} → ${req.deactivationDate ?? 'Indefinite'}`,
          mono: true,
        },
      ],
      ctaLabel: 'View My Access',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const fulfilledEmail: DemoEmailNotification = {
      id: `eml-req-ok-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Access Request Fulfilled · ${req.requestCode}`,
      triggerCategory: 'Access Review',
      recipientName: req.targetPersonName,
      recipientEmail: targetPerson?.email ?? req.selectedAccountName,
      recipientRole: 'Access Recipient',
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `Access Provisioned (${req.requestCode}): ${req.resourceName}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 165,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      accessRequests: s.accessRequests.map((r) =>
        r.id === requestId
          ? { ...r, stages: nextStages, status: 'Approved & Provisioned', waitingHours: 0 }
          : r
      ),
      people: s.people.map((p) =>
        p.id === req.targetPersonId
          ? {
              ...p,
              roles: p.roles.includes(req.resourceName)
                ? p.roles
                : [...p.roles, req.resourceName],
              changeHistory: [
                {
                  id: `h-req-${Date.now()}`,
                  timestamp: `${today} ${stamp}`,
                  source: `Access Marketplace (${req.requestCode})`,
                  category: 'Provisioning',
                  summary: `Provisioned "${req.resourceName}" to ${req.selectedAccountName} (${req.selectedAccountKind}) for ${req.activationDate} → ${req.deactivationDate ?? 'Indefinite'}.`,
                  changes: [
                    { field: 'grantedResource', before: null, after: req.resourceName },
                    { field: 'targetAccount', before: null, after: `${req.selectedAccountName} (${req.selectedAccountKind})` },
                  ],
                },
                ...p.changeHistory,
              ],
            }
          : p
      ),
      provisioningJobs: [newProvJob, ...s.provisioningJobs],
      emailNotifications: [fulfilledEmail, ...s.emailNotifications],
      toastMessage: `Approved ${req.requestCode} — provisioned "${req.resourceName}" to ${req.selectedAccountName}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: actingApprover,
          processTag: 'REQ-OK',
          tone: 'emerald',
          action: `Final approval & provisioning of "${req.resourceName}" on ${req.selectedAccountName}`,
          target: req.targetPersonName,
        },
        ...s.auditLog,
      ],
    }));
  },

  escalateAccessRequest: (requestId) => {
    const req = get().accessRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending Approval') return;
    const pendingIdx = req.stages.findIndex(
      (st) => st.status === 'Pending' || st.status === 'Escalated'
    );
    if (pendingIdx === -1) return;

    const currentStage = req.stages[pendingIdx];
    const slaHours = get().platformConfig.governance.approvalEscalationHours;
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();

    const escalatedStages = req.stages.map((st, idx) =>
      idx === pendingIdx
        ? {
            ...st,
            status: 'Escalated' as const,
            approverName: st.escalationBackup,
            delegatedTo: undefined,
          }
        : st
    );

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const backupEmail = `${currentStage.escalationBackup.split('(')[0].trim().toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`;
    const tplData: BrandedEmailTemplateInput = {
      badgeText: `SLA ESCALATION · >${slaHours}H OVERDUE`,
      badgeTone: 'amber',
      headline: `Escalated Approval Required: ${req.requestCode} (${req.resourceName})`,
      greeting: `Hi ${currentStage.escalationBackup},`,
      intro: `Pending approval ${req.requestCode} waited ${req.waitingHours}h (exceeding the configured ${slaHours}h escalation SLA) without action from ${currentStage.approverName}. It has been escalated to you as backup approver.`,
      metadataRows: [
        { label: 'Request Code', value: req.requestCode, mono: true },
        { label: 'Target Identity', value: req.targetPersonName },
        { label: 'Requested Resource', value: `${req.resourceName} (${req.application})` },
        { label: 'Original Approver', value: currentStage.approverName },
        { label: 'Time Elapsed', value: `${req.waitingHours} hours (SLA: ${slaHours}h)`, mono: true },
      ],
      calloutTitle: 'Escalated Approval SLA Active',
      calloutText: `Business motivation: "${req.motivation}"`,
      ctaLabel: 'Action Escalated Approval',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
    };

    const escalationEmail: DemoEmailNotification = {
      id: `eml-esc-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${today} ${stamp}`,
      status: 'Delivered',
      trigger: `Approval SLA Escalation (>${slaHours}h) · ${req.requestCode}`,
      triggerCategory: 'Operations',
      recipientName: currentStage.escalationBackup,
      recipientEmail: backupEmail,
      recipientRole: 'Escalation Backup Approver',
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `[ESCALATED >${slaHours}h] Pending Approval ${req.requestCode}: ${req.resourceName}`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 152,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      accessRequests: s.accessRequests.map((r) =>
        r.id === requestId
          ? { ...r, stages: escalatedStages, escalatedCount: r.escalatedCount + 1 }
          : r
      ),
      emailNotifications: [escalationEmail, ...s.emailNotifications],
      toastMessage: `Escalated ${req.requestCode} from ${currentStage.approverName} to backup approver ${currentStage.escalationBackup} (SLA: ${slaHours}h).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'SLA Escalation Engine',
          processTag: 'ESC-APR',
          tone: 'amber',
          action: `Escalated overdue ${req.requestCode} (${req.waitingHours}h > ${slaHours}h SLA) to ${currentStage.escalationBackup}`,
          target: req.resourceName,
        },
        ...s.auditLog,
      ],
    }));
  },

  updateLeaveDelegation: (patch) => {
    const today = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const nextDelegation: LeaveDelegationConfig = {
      ...get().leaveDelegation,
      ...patch,
      updatedAt: `${today} ${stamp.slice(0, 5)}`,
    };

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const standInEmail = `${nextDelegation.standInName.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`;

    const delegationEmail: DemoEmailNotification | null = nextDelegation.enabled
      ? (() => {
          const tplData: BrandedEmailTemplateInput = {
            badgeText: 'OUT-OF-OFFICE DELEGATION ACTIVE',
            badgeTone: 'sky',
            headline: `You Are Designated Stand-In Delegate for ${nextDelegation.delegatorName}`,
            greeting: `Hi ${nextDelegation.standInName},`,
            intro: `${nextDelegation.delegatorName} has activated Out-of-Office Delegation from ${nextDelegation.startDate} to ${nextDelegation.endDate}. All selected governance approvals and tasks routed to ${nextDelegation.delegatorName} will automatically forward to your queue.`,
            metadataRows: [
              { label: 'Delegator', value: nextDelegation.delegatorName },
              { label: 'Stand-In Delegate', value: nextDelegation.standInName },
              {
                label: 'Leave Window',
                value: `${nextDelegation.startDate} → ${nextDelegation.endDate}`,
                mono: true,
              },
              {
                label: 'Delegated Scope',
                value: [
                  nextDelegation.delegateApprovals ? 'Access Request Approvals' : null,
                  nextDelegation.delegateReviews ? 'Access Reviews' : null,
                  nextDelegation.delegateOnboarding ? 'Onboarding Approvals' : null,
                ]
                  .filter(Boolean)
                  .join(' · '),
              },
            ],
            calloutTitle: 'Leave Note',
            calloutText: nextDelegation.reason,
            ctaLabel: 'Open Delegated Task Inbox',
            ctaUrl: 'https://identra-two.vercel.app/#demo',
            messageCode: msgCode,
            timestamp: `${today} ${stamp}`,
          };
          return {
            id: `eml-del-${Date.now()}`,
            messageCode: msgCode,
            timestamp: `${today} ${stamp}`,
            status: 'Delivered',
            trigger: `Leave Delegation Activated · ${nextDelegation.delegatorName} → ${nextDelegation.standInName}`,
            triggerCategory: 'Operations',
            recipientName: nextDelegation.standInName,
            recipientEmail: standInEmail,
            recipientRole: 'Designated Stand-In Delegate',
            cc: [`${nextDelegation.delegatorName.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`],
            from: `${smtp.fromName} <${smtp.fromEmail}>`,
            subject: `Out-of-Office Delegation: Acting Stand-In for ${nextDelegation.delegatorName}`,
            smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
            deliveryLatencyMs: 179,
            templateData: tplData,
            htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
          };
        })()
      : null;

    set((s) => ({
      leaveDelegation: nextDelegation,
      // Automatically route pending access request approvals for delegator -> stand-in
      accessRequests: s.accessRequests.map((req) => ({
        ...req,
        stages: req.stages.map((st) => {
          if (st.approverName !== nextDelegation.delegatorName) return st;
          if (st.status !== 'Pending' && st.status !== 'Queued') return st;
          return {
            ...st,
            delegatedTo:
              nextDelegation.enabled && nextDelegation.delegateApprovals
                ? nextDelegation.standInName
                : undefined,
          };
        }),
      })),
      // Route pending access reviews if delegateReviews is enabled
      reviews: s.reviews.map((rev) => {
        const isOwnedByDelegator =
          rev.reviewer === nextDelegation.delegatorName ||
          rev.reviewer.includes(`(Stand-In for ${nextDelegation.delegatorName})`);
        if (!isOwnedByDelegator || rev.decision !== 'Pending') return rev;
        return {
          ...rev,
          reviewer:
            nextDelegation.enabled && nextDelegation.delegateReviews
              ? `${nextDelegation.standInName} (Stand-In for ${nextDelegation.delegatorName})`
              : nextDelegation.delegatorName,
        };
      }),
      emailNotifications: delegationEmail
        ? [delegationEmail, ...s.emailNotifications]
        : s.emailNotifications,
      toastMessage: nextDelegation.enabled
        ? `Leave Delegation active: tasks & approvals for ${nextDelegation.delegatorName} now route to ${nextDelegation.standInName} (${nextDelegation.startDate} → ${nextDelegation.endDate}).`
        : `Leave Delegation disabled — tasks & approvals now route directly to ${nextDelegation.delegatorName}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: nextDelegation.delegatorName,
          processTag: nextDelegation.enabled ? 'DEL-ON' : 'DEL-OFF',
          tone: nextDelegation.enabled ? 'sky' : 'amber',
          action: nextDelegation.enabled
            ? `Delegated all pending approvals & tasks to stand-in ${nextDelegation.standInName} (${nextDelegation.startDate} → ${nextDelegation.endDate})`
            : 'Revoked Out-of-Office stand-in delegation',
          target: nextDelegation.standInName,
        },
        ...s.auditLog,
      ],
    }));
  },

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

    // Delegate zero-member entitlement violations to target deletion / exception actions
    if (viol.emptyEntitlementId) {
      if (viol.deletableInTarget) {
        get().triggerEmptyEntitlementDeletion(viol.emptyEntitlementId, 'immediate');
      } else {
        get().approveEmptyEntitlementException(
          viol.emptyEntitlementId,
          viol.nonDeletableReason ?? 'Approved Governance Exception (Target Deletion Not Applicable)'
        );
      }
      return;
    }

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
    const openViolations = ctrl.violations.filter((v) => !v.resolved);
    if (openViolations.length === 0) return;

    if (controlId === 'ga-empty-entitlements') {
      const deletableIds = openViolations
        .filter((v) => v.emptyEntitlementId && v.deletableInTarget)
        .map((v) => v.emptyEntitlementId as string);
      const exceptionIds = openViolations
        .filter((v) => v.emptyEntitlementId && !v.deletableInTarget)
        .map((v) => v.emptyEntitlementId as string);

      if (deletableIds.length > 0) {
        get().bulkDeleteEmptyEntitlements(deletableIds, 'immediate');
      }
      exceptionIds.forEach((eid) => {
        get().approveEmptyEntitlementException(
          eid,
          'Protected system/break-glass entitlement — approved exception under GA-CTRL-07'
        );
      });
      return;
    }

    const openCount = openViolations.length;
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

  triggerEmptyEntitlementDeletion: (emptyEntitlementId, executionMode = 'immediate') => {
    const ent = get().emptyEntitlements.find((e) => e.id === emptyEntitlementId);
    if (!ent) return;

    if (!ent.deletableInTarget) {
      set({
        toastMessage: `Target deletion blocked for "${ent.name}": ${ent.nonDeletableReason ?? 'Protected entitlement — approve a governance exception instead.'}`,
      });
      return;
    }

    if (ent.status === 'Deleted in Target' || ent.status === 'Deletion Queued') {
      return;
    }

    const stamp = timeNow();
    const todayIso = new Date().toISOString().slice(0, 10);
    const jobNumber = 9050 + get().provisioningJobs.length;
    const jobCode = `PRV-${jobNumber}`;
    const jobId = `prv-del-ent-${Date.now()}`;
    const isSimulation = executionMode === 'simulation';

    const deletionJob: DemoProvisioningJob = {
      id: jobId,
      jobCode,
      identity: `Target Entitlement (0 Members)`,
      identityEmail: ent.owner
        ? `${ent.owner.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`
        : 'iam-ops@identra-corp.io',
      entitlementOrRole: ent.name,
      application: ent.application,
      operation: 'Delete',
      status: isSimulation ? 'Simulation Mode' : 'Completed',
      triggeredBy: 'Governance Assurance · GA-CTRL-07 (Empty Entitlement Hygiene)',
      timestamp: stamp,
      durationMs: isSimulation ? null : 240 + Math.floor(Math.random() * 140),
      mappings: [
        {
          attribute: 'technicalId',
          before: ent.technicalId,
          after: null,
          rule: `Target Deletion (${ent.connectorAction})`,
        },
        {
          attribute: 'memberCount',
          before: '0 active members',
          after: 'Decommissioned',
          rule: `GA-CTRL-07 Empty Threshold (${ent.daysEmpty}d > 30d)`,
        },
        {
          attribute: 'objectState',
          before: `Active in ${ent.application}`,
          after: isSimulation ? 'Pending Release (Simulation)' : 'Deleted in Target System',
          rule: isSimulation
            ? 'Queued in Provisioning Engine Simulation Gate'
            : 'Direct Target Connector Decommission',
        },
      ],
    };

    const nextStatus = isSimulation ? 'Deletion Queued' : 'Deleted in Target';
    const outcomeLabel = isSimulation
      ? `Deletion task ${jobCode} queued in Provisioning Engine (Simulation Mode)`
      : `Deleted in ${ent.application} via target connector task ${jobCode}`;

    const { smtp, emailTemplate } = get().platformConfig;
    const msgCode = `EML-${7049 + get().emailNotifications.length}`;
    const recipientName = ent.owner ?? 'IAM Operations';
    const recipientEmail = ent.owner
      ? `${ent.owner.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`
      : 'iam-ops@identra-corp.io';

    const tplData: BrandedEmailTemplateInput = {
      badgeText: isSimulation
        ? `DELETION QUEUED · ${jobCode}`
        : `TARGET ENTITLEMENT DELETED · ${jobCode}`,
      badgeTone: isSimulation ? 'amber' : 'emerald',
      headline: isSimulation
        ? `Target Deletion Task Queued for Empty Entitlement "${ent.name}"`
        : `Empty Entitlement "${ent.name}" Deleted from ${ent.application}`,
      greeting: `Hi ${recipientName},`,
      intro: `Governance Assurance control GA-CTRL-07 (Empty Target Entitlements) triggered a target-system deletion task for "${ent.name}", which had 0 active members for ${ent.daysEmpty} days.`,
      metadataRows: [
        { label: 'Provisioning Task', value: `${jobCode} (${isSimulation ? 'Simulation Mode' : 'Executed'})`, mono: true },
        { label: 'Target System', value: ent.application },
        { label: 'Entitlement', value: ent.name, mono: true },
        { label: 'Technical ID', value: ent.technicalId, mono: true },
        { label: 'Connector Operation', value: ent.connectorAction, mono: true },
        { label: 'Days With 0 Members', value: `${ent.daysEmpty} days (Last removed ${ent.lastMemberRemovedAt})` },
      ],
      calloutTitle: isSimulation
        ? 'Awaiting Simulation Release in Provisioning Engine'
        : 'Target System Hygiene Restored',
      calloutText: isSimulation
        ? `Inspect and release ${jobCode} under Operations → Provisioning Engine to commit the DELETE operation to ${ent.application}.`
        : `${ent.application} confirmed removal of "${ent.name}". Governance Assurance violation ${ent.governanceViolationId} has been marked Resolved.`,
      ctaLabel: 'Open Provisioning Engine',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: msgCode,
      timestamp: `${todayIso} ${stamp}`,
    };

    const deletionEmail: DemoEmailNotification = {
      id: `eml-del-ent-${Date.now()}`,
      messageCode: msgCode,
      timestamp: `${todayIso} ${stamp}`,
      status: 'Delivered',
      trigger: `GA-CTRL-07 Target Entitlement Deletion · ${ent.name} (${jobCode})`,
      triggerCategory: 'Operations',
      recipientName,
      recipientEmail,
      recipientRole: ent.owner ? 'Entitlement Owner' : 'IAM Operations',
      from: `${smtp.fromName} <${smtp.fromEmail}>`,
      subject: `[${jobCode}] ${isSimulation ? 'Queued Deletion' : 'Deleted Empty Entitlement'}: ${ent.name} (${ent.application})`,
      smtpProvider: `${smtp.host}:${smtp.port} · ${smtp.encryption}`,
      deliveryLatencyMs: 162,
      templateData: tplData,
      htmlBody: buildBrandedIdentraEmailHtml(tplData, emailTemplate),
    };

    set((s) => ({
      provisioningJobs: [deletionJob, ...s.provisioningJobs],
      emptyEntitlements: s.emptyEntitlements.map((item) =>
        item.id === emptyEntitlementId
          ? {
              ...item,
              status: nextStatus,
              deletionJobId: jobId,
              deletionJobCode: jobCode,
            }
          : item
      ),
      governanceControls: s.governanceControls.map((ctrl) =>
        ctrl.id === 'ga-empty-entitlements'
          ? {
              ...ctrl,
              lastScanAt: 'Just now',
              violations: ctrl.violations.map((v) =>
                v.emptyEntitlementId === emptyEntitlementId
                  ? {
                      ...v,
                      resolved: true,
                      deletionJobId: jobId,
                      deletionJobCode: jobCode,
                      remediationOutcome: outcomeLabel,
                    }
                  : v
              ),
            }
          : ctrl
      ),
      emailNotifications: [deletionEmail, ...s.emailNotifications],
      toastMessage: isSimulation
        ? `Queued target deletion task ${jobCode} for "${ent.name}" (${ent.application}) in Provisioning Engine Simulation Mode.`
        : `Triggered target deletion task ${jobCode} — removed empty entitlement "${ent.name}" from ${ent.application}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Governance Assurance',
          processTag: 'GA-DEL',
          tone: isSimulation ? 'amber' : 'emerald',
          action: `${isSimulation ? 'Queued simulated' : 'Executed'} target deletion task ${jobCode} (${ent.connectorAction}) for 0-member entitlement`,
          target: `${ent.name} · ${ent.application}`,
        },
        ...s.auditLog,
      ],
    }));
  },

  bulkDeleteEmptyEntitlements: (emptyEntitlementIds, executionMode = 'immediate') => {
    const eligible = get().emptyEntitlements.filter(
      (e) =>
        emptyEntitlementIds.includes(e.id) &&
        e.deletableInTarget &&
        e.status === 'Empty (Flagged)'
    );
    if (eligible.length === 0) return;

    const stamp = timeNow();
    const isSimulation = executionMode === 'simulation';
    const baseNum = 9050 + get().provisioningJobs.length;

    const newJobs: DemoProvisioningJob[] = [];
    const jobByEntId = new Map<string, { id: string; code: string }>();

    eligible.forEach((ent, idx) => {
      const jobCode = `PRV-${baseNum + idx}`;
      const jobId = `prv-del-ent-${Date.now()}-${idx}`;
      jobByEntId.set(ent.id, { id: jobId, code: jobCode });
      newJobs.push({
        id: jobId,
        jobCode,
        identity: 'Target Entitlement (0 Members)',
        identityEmail: ent.owner
          ? `${ent.owner.toLowerCase().replace(/\s+/g, '.')}@identra-corp.io`
          : 'iam-ops@identra-corp.io',
        entitlementOrRole: ent.name,
        application: ent.application,
        operation: 'Delete',
        status: isSimulation ? 'Simulation Mode' : 'Completed',
        triggeredBy: 'Governance Assurance · GA-CTRL-07 Batch Remediation',
        timestamp: stamp,
        durationMs: isSimulation ? null : 210 + idx * 35,
        mappings: [
          {
            attribute: 'technicalId',
            before: ent.technicalId,
            after: null,
            rule: `Target Deletion (${ent.connectorAction})`,
          },
          {
            attribute: 'memberCount',
            before: '0 active members',
            after: 'Decommissioned',
            rule: `GA-CTRL-07 Empty Threshold (${ent.daysEmpty}d > 30d)`,
          },
        ],
      });
    });

    const nextStatus = isSimulation ? 'Deletion Queued' : 'Deleted in Target';

    set((s) => ({
      provisioningJobs: [...newJobs, ...s.provisioningJobs],
      emptyEntitlements: s.emptyEntitlements.map((ent) => {
        const ref = jobByEntId.get(ent.id);
        if (!ref) return ent;
        return {
          ...ent,
          status: nextStatus,
          deletionJobId: ref.id,
          deletionJobCode: ref.code,
        };
      }),
      governanceControls: s.governanceControls.map((ctrl) =>
        ctrl.id === 'ga-empty-entitlements'
          ? {
              ...ctrl,
              lastScanAt: 'Just now',
              violations: ctrl.violations.map((v) => {
                if (!v.emptyEntitlementId) return v;
                const ref = jobByEntId.get(v.emptyEntitlementId);
                if (!ref) return v;
                return {
                  ...v,
                  resolved: true,
                  deletionJobId: ref.id,
                  deletionJobCode: ref.code,
                  remediationOutcome: isSimulation
                    ? `Batch deletion task ${ref.code} queued (Simulation Mode)`
                    : `Deleted in ${v.targetSystem} via batch task ${ref.code}`,
                };
              }),
            }
          : ctrl
      ),
      toastMessage: `${isSimulation ? 'Queued' : 'Executed'} ${eligible.length} target-system deletion task(s) (${newJobs.map((j) => j.jobCode).join(', ')}) for empty entitlements.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Governance Assurance',
          processTag: 'GA-DEL',
          tone: isSimulation ? 'amber' : 'emerald',
          action: `${isSimulation ? 'Queued' : 'Executed'} batch target deletion for ${eligible.length} zero-member entitlements (${newJobs.map((j) => j.jobCode).join(', ')})`,
          target: 'GA-CTRL-07 · Target Connectors',
        },
        ...s.auditLog,
      ],
    }));
  },

  approveEmptyEntitlementException: (emptyEntitlementId, reason) => {
    const ent = get().emptyEntitlements.find((e) => e.id === emptyEntitlementId);
    if (!ent) return;
    const stamp = timeNow();
    const note =
      reason?.trim() ||
      ent.nonDeletableReason ||
      'Approved standing retention exception under GA-CTRL-07 (reviewed by IAM Governance).';

    set((s) => ({
      emptyEntitlements: s.emptyEntitlements.map((item) =>
        item.id === emptyEntitlementId
          ? {
              ...item,
              status: 'Exception Approved',
              exceptionReason: note,
            }
          : item
      ),
      governanceControls: s.governanceControls.map((ctrl) =>
        ctrl.id === 'ga-empty-entitlements'
          ? {
              ...ctrl,
              lastScanAt: 'Just now',
              violations: ctrl.violations.map((v) =>
                v.emptyEntitlementId === emptyEntitlementId
                  ? {
                      ...v,
                      resolved: true,
                      remediationOutcome: `Governance Exception Approved — retained without target deletion`,
                    }
                  : v
              ),
            }
          : ctrl
      ),
      toastMessage: `Approved governance exception for empty entitlement "${ent.name}" (${ent.application}) — target deletion skipped.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Governance Assurance',
          processTag: 'GA-EXC',
          tone: 'sky',
          action: `Approved GA-CTRL-07 retention exception for 0-member entitlement`,
          target: `${ent.name} · ${ent.application}`,
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

  createSchemaObject: (input) => {
    const id = `obj-custom-${Date.now()}`;
    const cleanApi =
      input.apiName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, '_')
        .replace(/^_+|_+$/g, '') || `custom_obj_${get().schemaObjects.length + 1}`;
    const code = `OBJ-${cleanApi.toUpperCase().slice(0, 14)}`;
    const stamp = timeNow();

    const defaultProps: DemoSchemaProperty[] =
      input.initialProperties && input.initialProperties.length > 0
        ? input.initialProperties.map((p, i) => ({ ...p, id: `prop-${Date.now()}-${i}` }))
        : [
            {
              id: `prop-${Date.now()}-0`,
              key: 'name',
              label: 'Object Name',
              type: 'String',
              required: true,
              unique: true,
              sensitive: false,
              maskPattern: 'Full Mask (••••••••)',
              systemProperty: false,
              defaultSampleValue: `Sample ${input.name.trim()}`,
              description: 'Primary display name.',
            },
            {
              id: `prop-${Date.now()}-1`,
              key: 'ownerIdentity',
              label: 'Accountable Owner (Identity)',
              type: 'Reference (Identity)',
              referenceTargetObjectId: 'obj-identity',
              required: true,
              unique: false,
              sensitive: false,
              maskPattern: 'Full Mask (••••••••)',
              systemProperty: false,
              defaultSampleValue: 'Claire Vance',
              description: 'Reference to an Identity record usable in custom workflows.',
            },
          ];

    const newObj: DemoSchemaObject = {
      id,
      code,
      name: input.name.trim(),
      apiName: cleanApi,
      category: input.category,
      description: input.description.trim() || `Custom governed object "${input.name.trim()}".`,
      recordCount: 0,
      properties: defaultProps,
    };

    set((s) => ({
      schemaObjects: [...s.schemaObjects, newObj],
      toastMessage: `Created new schema object "${newObj.name}" (${newObj.code}) with ${defaultProps.length} properties.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Schema Studio',
          processTag: 'OBJ-NEW',
          tone: 'emerald',
          action: `Created new ${newObj.category} "${newObj.name}" (${newObj.apiName})`,
          target: newObj.code,
        },
        ...s.auditLog,
      ],
    }));

    return id;
  },

  addSchemaProperty: (objectId, prop) => {
    const obj = get().schemaObjects.find((o) => o.id === objectId);
    if (!obj) return;

    const cleanKey =
      prop.key
        .trim()
        .replace(/[^a-zA-Z0-9_]/g, '') ||
      prop.label
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '');

    const newProp: DemoSchemaProperty = {
      ...prop,
      id: `prop-${Date.now()}`,
      key: cleanKey,
      label: prop.label.trim() || cleanKey,
      systemProperty: false,
    };
    const stamp = timeNow();

    set((s) => ({
      schemaObjects: s.schemaObjects.map((o) =>
        o.id === objectId ? { ...o, properties: [...o.properties, newProp] } : o
      ),
      toastMessage: `Added property "${newProp.label}" (${newProp.type}${newProp.sensitive ? ' · Sensitive Masked' : ''}) to ${obj.name}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Schema Studio',
          processTag: 'PROP-ADD',
          tone: newProp.sensitive ? 'amber' : 'sky',
          action: `Added ${newProp.type} property "${newProp.key}"${newProp.sensitive ? ' [SENSITIVE MASKED]' : ''}`,
          target: obj.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  updateSchemaProperty: (objectId, propertyId, patch) => {
    const obj = get().schemaObjects.find((o) => o.id === objectId);
    const prop = obj?.properties.find((p) => p.id === propertyId);
    if (!obj || !prop) return;
    const stamp = timeNow();

    const updatedProp: DemoSchemaProperty = { ...prop, ...patch };
    const sensitivityChanged =
      patch.sensitive !== undefined && patch.sensitive !== prop.sensitive;
    const typeChanged = patch.type !== undefined && patch.type !== prop.type;

    set((s) => ({
      schemaObjects: s.schemaObjects.map((o) =>
        o.id === objectId
          ? {
              ...o,
              properties: o.properties.map((p) =>
                p.id === propertyId ? updatedProp : p
              ),
            }
          : o
      ),
      toastMessage: sensitivityChanged
        ? `${updatedProp.sensitive ? 'Enabled Sensitive Field masking' : 'Disabled masking'} on ${obj.name}.${updatedProp.label} across portal views.`
        : typeChanged
          ? `Updated ${obj.name}.${updatedProp.label} data type to ${updatedProp.type}.`
          : `Updated property "${updatedProp.label}" on ${obj.name}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Schema Studio',
          processTag: sensitivityChanged ? 'SENS-CFG' : 'PROP-UPD',
          tone: sensitivityChanged && updatedProp.sensitive ? 'amber' : 'sky',
          action: sensitivityChanged
            ? `${updatedProp.sensitive ? 'Marked' : 'Unmarked'} "${updatedProp.key}" as Sensitive (${updatedProp.maskPattern})`
            : `Updated "${updatedProp.key}" → type: ${updatedProp.type}, required: ${updatedProp.required}`,
          target: obj.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  deleteSchemaProperty: (objectId, propertyId) => {
    const obj = get().schemaObjects.find((o) => o.id === objectId);
    const prop = obj?.properties.find((p) => p.id === propertyId);
    if (!obj || !prop || prop.systemProperty) return;
    const stamp = timeNow();

    set((s) => ({
      schemaObjects: s.schemaObjects.map((o) =>
        o.id === objectId
          ? { ...o, properties: o.properties.filter((p) => p.id !== propertyId) }
          : o
      ),
      toastMessage: `Removed custom property "${prop.label}" from ${obj.name}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Schema Studio',
          processTag: 'PROP-DEL',
          tone: 'amber',
          action: `Removed custom property "${prop.key}"`,
          target: obj.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  logSensitiveFieldReveal: (identityName, fieldLabel) => {
    const stamp = timeNow();
    set((s) => ({
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Ivan Lubbe (Portal Admin)',
          processTag: 'SENS-VIEW',
          tone: 'amber',
          action: `Temporarily revealed masked sensitive field "${fieldLabel}"`,
          target: identityName,
        },
        ...s.auditLog,
      ],
    }));
  },

  createCustomWorkflow: (input) => {
    const nextNum = get().customWorkflows.length + 1;
    const code = `WF-CUST-${String(nextNum).padStart(3, '0')}`;
    const todayIso = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    const srcObj = get().schemaObjects.find((o) => o.id === input.sourceObjectId);

    const newWorkflow: DemoCustomWorkflow = {
      ...input,
      id: `cwf-${Date.now()}`,
      code,
      createdAt: todayIso,
    };

    set((s) => ({
      customWorkflows: [newWorkflow, ...s.customWorkflows],
      toastMessage: `Created custom workflow ${code} ("${newWorkflow.name}") bound to ${srcObj?.name ?? 'Object'} with ${newWorkflow.stages.length} stage(s).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Workflow Designer',
          processTag: 'WF-NEW',
          tone: 'emerald',
          action: `Created custom reference workflow ${code} (${newWorkflow.triggerEvent} · ${newWorkflow.stages.length} stages)`,
          target: newWorkflow.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  toggleCustomWorkflowStatus: (workflowId) => {
    const wf = get().customWorkflows.find((w) => w.id === workflowId);
    if (!wf) return;
    const nextStatus: DemoCustomWorkflow['status'] =
      wf.status === 'Active' ? 'Paused' : 'Active';
    set((s) => ({
      customWorkflows: s.customWorkflows.map((w) =>
        w.id === workflowId ? { ...w, status: nextStatus } : w
      ),
      toastMessage: `${nextStatus === 'Active' ? 'Activated' : 'Paused'} custom workflow ${wf.code} (${wf.name}).`,
    }));
  },

  deleteCustomWorkflow: (workflowId) => {
    const wf = get().customWorkflows.find((w) => w.id === workflowId);
    if (!wf) return;
    set((s) => ({
      customWorkflows: s.customWorkflows.filter((w) => w.id !== workflowId),
      toastMessage: `Deleted custom workflow ${wf.code} (${wf.name}).`,
    }));
  },

  simulateCustomWorkflow: (workflowId, targetPersonId) => {
    const wf = get().customWorkflows.find((w) => w.id === workflowId);
    const person = get().people.find((p) => p.id === targetPersonId);
    if (!wf || !person) return;
    const stamp = timeNow();

    set((s) => ({
      customWorkflows: s.customWorkflows.map((w) =>
        w.id === workflowId ? { ...w, lastSimulatedAt: `Today · ${stamp}` } : w
      ),
      toastMessage: `Simulated ${wf.code} against ${person.name} — resolved ${wf.stages.length} Identity reference stage(s).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Workflow Simulator',
          processTag: 'WF-SIM',
          tone: 'sky',
          action: `Simulated ${wf.code} (${wf.name}) resolving ${wf.stages.map((st) => st.referenceObjectPath).join(' → ')}`,
          target: person.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  adjustLicensePool: (skuId, deltaSeats) => {
    const sku = get().licenseSkus.find((s) => s.id === skuId);
    if (!sku) return;
    const nextTotal = Math.max(10, sku.totalPurchased + deltaSeats);
    const actualDelta = nextTotal - sku.totalPurchased;
    if (actualDelta === 0) return;
    const stamp = timeNow();

    set((s) => ({
      licenseSkus: s.licenseSkus.map((item) =>
        item.id === skuId ? { ...item, totalPurchased: nextTotal } : item
      ),
      toastMessage: `${actualDelta > 0 ? `Added +${actualDelta}` : `Reduced ${actualDelta}`} seats on ${sku.shortLabel} (${sku.skuCode}) — pool is now ${nextTotal.toLocaleString()} seats.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'License Management',
          processTag: 'LIC-POOL',
          tone: actualDelta > 0 ? 'emerald' : 'amber',
          action: `Adjusted ${sku.skuCode} purchased pool from ${sku.totalPurchased.toLocaleString()} → ${nextTotal.toLocaleString()} seats`,
          target: sku.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  reclaimInactiveLicenses: (skuId) => {
    const sku = get().licenseSkus.find((s) => s.id === skuId);
    if (!sku || sku.reclaimableInactive <= 0) return;
    const reclaimed = sku.reclaimableInactive;
    const monthlySavings = reclaimed * sku.monthlyCostZar;
    const stamp = timeNow();

    const empCut = Math.min(sku.licensedIdentityBreakdown.employees, Math.ceil(reclaimed * 0.7));
    const ctrCut = Math.min(sku.licensedIdentityBreakdown.contractors, reclaimed - empCut);

    set((s) => ({
      licenseSkus: s.licenseSkus.map((item) =>
        item.id === skuId
          ? {
              ...item,
              consumed: Math.max(0, item.consumed - reclaimed),
              reclaimableInactive: 0,
              licensedIdentityBreakdown: {
                ...item.licensedIdentityBreakdown,
                employees: Math.max(0, item.licensedIdentityBreakdown.employees - empCut),
                contractors: Math.max(0, item.licensedIdentityBreakdown.contractors - ctrCut),
              },
            }
          : item
      ),
      toastMessage: `Reclaimed ${reclaimed} inactive ${sku.shortLabel} (${sku.skuCode}) seat(s) — saving R${monthlySavings.toLocaleString()}/mo.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'License Harvester',
          processTag: 'LIC-RECL',
          tone: 'emerald',
          action: `Reclaimed ${reclaimed} inactive ${sku.skuCode} seats (R${monthlySavings.toLocaleString()}/mo saved)`,
          target: sku.name,
        },
        ...s.auditLog,
      ],
    }));
  },

  updateLicenseSkuConfig: (skuId, patch) => {
    const sku = get().licenseSkus.find((s) => s.id === skuId);
    if (!sku) return;
    set((s) => ({
      licenseSkus: s.licenseSkus.map((item) =>
        item.id === skuId
          ? {
              ...item,
              totalPurchased:
                patch.totalPurchased !== undefined
                  ? Math.max(10, patch.totalPurchased)
                  : item.totalPurchased,
              warningThresholdPct:
                patch.warningThresholdPct !== undefined
                  ? Math.min(99, Math.max(50, patch.warningThresholdPct))
                  : item.warningThresholdPct,
            }
          : item
      ),
      toastMessage: `Updated license capacity settings for ${sku.shortLabel} (${sku.skuCode}).`,
    }));
  },

  stagePredictedLeaverInSimulation: (leaverId) => {
    const leaver = get().predictedLeavers.find((l) => l.id === leaverId);
    if (!leaver || leaver.status !== 'Predicted') return;

    const stamp = timeNow();
    const baseNum = 9050 + get().provisioningJobs.length;
    const targetChanges = leaver.calculatedChanges.filter(
      (c) => c.targetSystem !== 'IDENTRA Governance'
    );

    const stagedJobs: DemoProvisioningJob[] = targetChanges.map((chg, idx) => ({
      id: `prv-pleave-${Date.now()}-${idx}`,
      jobCode: `PRV-${baseNum + idx}`,
      identity: `${leaver.identityName} (Exit ${leaver.scheduledExitDate})`,
      identityEmail: leaver.email,
      entitlementOrRole: chg.objectName,
      application: chg.targetSystem as DemoProvisioningJob['application'],
      operation: chg.operation === 'Delete' || chg.operation === 'Revoke' || chg.operation === 'Reclaim' ? 'Delete' : 'Update',
      status: 'Simulation Mode',
      triggeredBy: `Predicted Leaver Pre-Stage (${leaver.predictionSource})`,
      timestamp: stamp,
      durationMs: null,
      mappings: [
        {
          attribute: chg.category,
          before: chg.beforeValue,
          after: chg.afterValue,
          rule: `Scheduled Exit ${leaver.scheduledExitDate} (${leaver.daysUntilExit}d remaining)`,
        },
      ],
    }));

    const jobCodes = stagedJobs.map((j) => j.jobCode);

    set((s) => ({
      provisioningJobs: [...stagedJobs, ...s.provisioningJobs],
      predictedLeavers: s.predictedLeavers.map((l) =>
        l.id === leaverId
          ? { ...l, status: 'Pre-Staged (Simulation)', stagedJobCodes: jobCodes }
          : l
      ),
      toastMessage: `Pre-staged ${stagedJobs.length} calculated exit change(s) (${jobCodes.join(', ')}) for ${leaver.identityName} in Provisioning Engine Simulation Mode.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Lifecycle Engine',
          processTag: 'JML-PRE',
          tone: 'sky',
          action: `Pre-staged ${stagedJobs.length} predicted leaver jobs (${jobCodes.join(', ')}) for scheduled exit ${leaver.scheduledExitDate}`,
          target: leaver.identityName,
        },
        ...s.auditLog,
      ],
    }));
  },

  executePredictedLeaverExitNow: (leaverId) => {
    const leaver = get().predictedLeavers.find((l) => l.id === leaverId);
    if (!leaver || leaver.status === 'Offboarded') return;

    const stamp = timeNow();
    const reclaimedSkuIds = leaver.calculatedChanges
      .map((c) => c.skuId)
      .filter((id): id is string => Boolean(id));
    const totalSavedZar = leaver.calculatedChanges.reduce(
      (sum, c) => sum + (c.monthlySavingsZar ?? 0),
      0
    );

    const baseNum = 9050 + get().provisioningJobs.length;
    const completedJobs: DemoProvisioningJob[] = leaver.calculatedChanges
      .filter((c) => c.targetSystem !== 'IDENTRA Governance')
      .map((chg, idx) => ({
        id: `prv-exit-${Date.now()}-${idx}`,
        jobCode: `PRV-${baseNum + idx}`,
        identity: leaver.identityName,
        identityEmail: leaver.email,
        entitlementOrRole: chg.objectName,
        application: chg.targetSystem as DemoProvisioningJob['application'],
        operation:
          chg.operation === 'Delete' || chg.operation === 'Revoke' || chg.operation === 'Reclaim'
            ? 'Delete'
            : 'Update',
        status: 'Completed',
        triggeredBy: `Early Leaver Execution (${leaver.employeeNumber})`,
        timestamp: stamp,
        durationMs: 220 + idx * 35,
        mappings: [
          {
            attribute: chg.category,
            before: chg.beforeValue,
            after: chg.afterValue,
            rule: 'Process++ Coordinated Leaver Offboarding',
          },
        ],
      }));

    set((s) => ({
      predictedLeavers: s.predictedLeavers.map((l) =>
        l.id === leaverId
          ? {
              ...l,
              status: 'Offboarded',
              stagedJobCodes: completedJobs.map((j) => j.jobCode),
            }
          : l
      ),
      provisioningJobs: [...completedJobs, ...s.provisioningJobs],
      licenseSkus: s.licenseSkus.map((sku) =>
        reclaimedSkuIds.includes(sku.id)
          ? {
              ...sku,
              consumed: Math.max(0, sku.consumed - 1),
              licensedIdentityBreakdown: {
                ...sku.licensedIdentityBreakdown,
                employees:
                  leaver.identityType === 'Employee'
                    ? Math.max(0, sku.licensedIdentityBreakdown.employees - 1)
                    : sku.licensedIdentityBreakdown.employees,
                contractors:
                  leaver.identityType === 'Contractor'
                    ? Math.max(0, sku.licensedIdentityBreakdown.contractors - 1)
                    : sku.licensedIdentityBreakdown.contractors,
              },
            }
          : sku
      ),
      toastMessage: `Executed all ${leaver.calculatedChanges.length} calculated exit changes for ${leaver.identityName}${totalSavedZar > 0 ? ` — reclaimed R${totalSavedZar.toLocaleString()}/mo in licenses` : ''}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'Lifecycle Engine',
          processTag: 'JML-EXIT',
          tone: 'emerald',
          action: `Executed ${leaver.calculatedChanges.length} calculated leaver changes${totalSavedZar > 0 ? ` & reclaimed R${totalSavedZar.toLocaleString()}/mo` : ''}`,
          target: leaver.identityName,
        },
        ...s.auditLog,
      ],
    }));
  },

  runAdOuDiscoveryScan: () => {
    const stamp = timeNow();
    const todayIso = new Date().toISOString().slice(0, 10);
    const alreadyDiscoveredDbn = get().adOus.some((o) => o.id === 'ou-disc-dbn');

    const newDiscoveredOu: DemoOrganizationalUnit = {
      id: 'ou-disc-dbn',
      objectGuid: '26fc5a3b-e8dc-4733-6cbd-00fb661c5012',
      name: 'Marketing - Durban',
      distinguishedName: 'OU=Marketing - Durban,OU=Departments,DC=corp,DC=identra,DC=net',
      parentOuId: 'ou-root-depts',
      parentDn: 'OU=Departments,DC=corp,DC=identra,DC=net',
      description: 'Automatically discovered via AD LDAP delta scan — awaiting owner assignment.',
      domain: 'corp.identra.net',
      businessOwner: null,
      technicalCustodian: null,
      createdDate: todayIso,
      lastModified: todayIso,
      childCounts: { users: 19, groups: 4, computers: 16 },
      governanceState: 'Discovered',
      riskScore: 38,
      containsPrivilegedAccounts: false,
      namingCompliant: true,
      inheritanceBlocked: false,
      gpoLinks: [
        { name: 'GPO-Baseline-Workstation-Hardening', enforced: true, status: 'Enabled' },
      ],
      delegatedPermissions: [],
      complianceFlags: ['Discovered in AD — Not Yet Formally Governed (Owner Unassigned)'],
      lastAttestedAt: null,
    };

    const nextOus = alreadyDiscoveredDbn
      ? get().adOus
      : [...get().adOus, newDiscoveredOu];
    const nonComp = nextOus.filter((o) => o.governanceState === 'Non-Compliant').length;
    const disc = nextOus.filter((o) => o.governanceState === 'Discovered').length;

    set((s) => ({
      adOus: nextOus,
      toastMessage: alreadyDiscoveredDbn
        ? `AD OU Discovery complete (${nextOus.length} OUs correlated via objectGUID · ${nonComp} Non-Compliant · ${disc} Discovered).`
        : `AD OU Discovery found 1 new unmanaged OU ("Marketing - Durban") correlated by objectGUID — marked Discovered (not implicitly approved).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'AD Structural Scanner',
          processTag: 'OU-SCAN',
          tone: alreadyDiscoveredDbn ? 'sky' : 'amber',
          action: alreadyDiscoveredDbn
            ? `Scanned & correlated ${nextOus.length} AD OUs via immutable objectGUID`
            : `Discovered new unmanaged AD OU "Marketing - Durban" (objectGUID ${newDiscoveredOu.objectGuid.slice(0, 8)}…)`,
          target: 'corp.identra.net',
        },
        ...s.auditLog,
      ],
    }));
  },

  governOrganizationalUnit: (ouId, businessOwner, technicalCustodian) => {
    const ou = get().adOus.find((o) => o.id === ouId);
    if (!ou) return;
    const todayIso = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();

    const remainingFlags = ou.complianceFlags.filter(
      (f) => !f.toLowerCase().includes('owner') && !f.toLowerCase().includes('discovered')
    );
    const hasExcessive = ou.delegatedPermissions.some((d) => d.excessive);
    const nextState: DemoOrganizationalUnit['governanceState'] =
      remainingFlags.length === 0 && !hasExcessive && !ou.driftEvent
        ? 'Managed'
        : 'Non-Compliant';

    set((s) => ({
      adOus: s.adOus.map((item) =>
        item.id === ouId
          ? {
              ...item,
              businessOwner,
              technicalCustodian,
              governanceState: nextState,
              complianceFlags: remainingFlags,
              lastAttestedAt: todayIso,
              lastModified: todayIso,
              riskScore: Math.max(12, item.riskScore - 24),
            }
          : item
      ),
      toastMessage: `Assigned Business Owner (${businessOwner}) & Technical Custodian (${technicalCustodian}) to "${ou.name}" — status: ${nextState}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'AD Structural Gov',
          processTag: 'OU-GOV',
          tone: 'emerald',
          action: `Brought OU under governance (Owner: ${businessOwner} · Custodian: ${technicalCustodian} · State: ${nextState})`,
          target: ou.distinguishedName,
        },
        ...s.auditLog,
      ],
    }));
  },

  attestOuOwnership: (ouId) => {
    const ou = get().adOus.find((o) => o.id === ouId);
    if (!ou) return;
    const todayIso = new Date().toISOString().slice(0, 10);
    const stamp = timeNow();
    set((s) => ({
      adOus: s.adOus.map((item) =>
        item.id === ouId ? { ...item, lastAttestedAt: todayIso } : item
      ),
      toastMessage: `Completed OU ownership attestation for "${ou.name}" (${ou.businessOwner ?? 'Unassigned'}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: ou.businessOwner ?? 'Governance Admin',
          processTag: 'OU-ATT',
          tone: 'emerald',
          action: `Attested OU ownership and structural compliance for "${ou.name}"`,
          target: ou.distinguishedName,
        },
        ...s.auditLog,
      ],
    }));
  },

  revokeOuDelegation: (ouId, delegationId) => {
    const ou = get().adOus.find((o) => o.id === ouId);
    const del = ou?.delegatedPermissions.find((d) => d.id === delegationId);
    if (!ou || !del) return;

    const stamp = timeNow();
    const todayIso = new Date().toISOString().slice(0, 10);
    const jobCode = `PRV-${9050 + get().provisioningJobs.length}`;

    const nextDels = ou.delegatedPermissions.filter((d) => d.id !== delegationId);
    const stillExcessive = nextDels.some((d) => d.excessive);
    const nextFlags = stillExcessive
      ? ou.complianceFlags
      : ou.complianceFlags.filter(
          (f) => !f.toLowerCase().includes('delegat')
        );
    const nextDrift =
      ou.driftEvent?.kind === 'Unexpected Delegation' && !stillExcessive
        ? undefined
        : ou.driftEvent;
    const nextState: DemoOrganizationalUnit['governanceState'] =
      ou.businessOwner && nextFlags.length === 0 && !stillExcessive && !nextDrift
        ? 'Managed'
        : ou.governanceState;

    const aclJob: DemoProvisioningJob = {
      id: `prv-ou-acl-${Date.now()}`,
      jobCode,
      identity: del.principal,
      identityEmail: 'ad-infra@identra-corp.io',
      entitlementOrRole: `Revoke AD ACL: ${del.rights}`,
      application: 'Active Directory',
      operation: 'Delete',
      status: 'Completed',
      triggeredBy: `AD Structural Governance (${ou.name})`,
      timestamp: stamp,
      durationMs: 215,
      mappings: [
        {
          attribute: 'nTSecurityDescriptor',
          before: `${del.principal} → ${del.rights}`,
          after: 'ACE Removed (Least Privilege Enforced)',
          rule: `OU Delegation Governance · objectGUID ${ou.objectGuid.slice(0, 8)}`,
        },
      ],
    };

    set((s) => ({
      provisioningJobs: [aclJob, ...s.provisioningJobs],
      adOus: s.adOus.map((item) =>
        item.id === ouId
          ? {
              ...item,
              delegatedPermissions: nextDels,
              complianceFlags: nextFlags,
              driftEvent: nextDrift,
              governanceState: nextState,
              lastModified: todayIso,
              riskScore: Math.max(14, item.riskScore - 28),
            }
          : item
      ),
      toastMessage: `Revoked excessive delegation "${del.principal}" on "${ou.name}" via Active Directory job ${jobCode}.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'AD Structural Gov',
          processTag: 'OU-ACL',
          tone: 'emerald',
          action: `Revoked excessive AD delegation "${del.principal}" (${jobCode})`,
          target: ou.distinguishedName,
        },
        ...s.auditLog,
      ],
    }));
  },

  reconcileOuDrift: (ouId) => {
    const ou = get().adOus.find((o) => o.id === ouId);
    if (!ou || !ou.driftEvent) return;
    const driftKind = ou.driftEvent.kind;
    const stamp = timeNow();
    const todayIso = new Date().toISOString().slice(0, 10);
    const nextFlags = ou.complianceFlags.filter(
      (f) => !f.toLowerCase().includes('drift') && !f.toLowerCase().includes('out-of-band')
    );
    const hasExcessive = ou.delegatedPermissions.some((d) => d.excessive);
    const nextState: DemoOrganizationalUnit['governanceState'] =
      ou.businessOwner && nextFlags.length === 0 && !hasExcessive
        ? 'Managed'
        : ou.governanceState;

    set((s) => ({
      adOus: s.adOus.map((item) =>
        item.id === ouId
          ? {
              ...item,
              driftEvent: undefined,
              complianceFlags: nextFlags,
              governanceState: nextState,
              lastModified: todayIso,
              riskScore: Math.max(15, item.riskScore - 20),
            }
          : item
      ),
      toastMessage: `Reconciled structural drift (${driftKind}) on "${ou.name}" — objectGUID baseline updated.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'AD Structural Gov',
          processTag: 'OU-DRF',
          tone: 'emerald',
          action: `Reconciled AD structural drift (${driftKind}) correlated by objectGUID`,
          target: ou.distinguishedName,
        },
        ...s.auditLog,
      ],
    }));
  },

  relocateOrganizationalUnit: (ouId, newParentOuId) => {
    const ou = get().adOus.find((o) => o.id === ouId);
    if (!ou || ou.parentOuId === newParentOuId || ou.id === newParentOuId) return;
    const newParent = newParentOuId
      ? get().adOus.find((o) => o.id === newParentOuId)
      : null;
    const nextParentDn = newParent ? newParent.distinguishedName : 'DC=corp,DC=identra,DC=net';
    const nextDn = `OU=${ou.name},${nextParentDn}`;
    const stamp = timeNow();
    const todayIso = new Date().toISOString().slice(0, 10);
    const jobCode = `PRV-${9050 + get().provisioningJobs.length}`;

    const moveJob: DemoProvisioningJob = {
      id: `prv-ou-move-${Date.now()}`,
      jobCode,
      identity: `OU: ${ou.name}`,
      identityEmail: 'ad-infra@identra-corp.io',
      entitlementOrRole: `Governed OU Relocation (LDAP MODDN)`,
      application: 'Active Directory',
      operation: 'Update',
      status: 'Completed',
      triggeredBy: 'AD Structural Governance (Relocation Workflow)',
      timestamp: stamp,
      durationMs: 260,
      mappings: [
        {
          attribute: 'distinguishedName',
          before: ou.distinguishedName,
          after: nextDn,
          rule: `Immutable correlation preserved via objectGUID ${ou.objectGuid}`,
        },
      ],
    };

    set((s) => ({
      provisioningJobs: [moveJob, ...s.provisioningJobs],
      adOus: s.adOus.map((item) =>
        item.id === ouId
          ? {
              ...item,
              parentOuId: newParentOuId,
              parentDn: nextParentDn,
              distinguishedName: nextDn,
              lastModified: todayIso,
            }
          : item
      ),
      toastMessage: `Relocated "${ou.name}" to ${nextParentDn} (${jobCode}) — objectGUID correlation preserved intact.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'AD Structural Gov',
          processTag: 'OU-MOVE',
          tone: 'sky',
          action: `Governed OU relocation (${jobCode}): ${ou.distinguishedName} → ${nextDn}`,
          target: ou.objectGuid,
        },
        ...s.auditLog,
      ],
    }));
  },

  decommissionEmptyOu: (ouId) => {
    const ou = get().adOus.find((o) => o.id === ouId);
    if (!ou) return;
    const totalChildren =
      ou.childCounts.users + ou.childCounts.groups + ou.childCounts.computers;
    if (totalChildren > 0) {
      set({
        toastMessage: `Cannot delete "${ou.name}": OU still contains ${totalChildren} child object(s).`,
      });
      return;
    }

    const stamp = timeNow();
    const jobCode = `PRV-${9050 + get().provisioningJobs.length}`;
    const delJob: DemoProvisioningJob = {
      id: `prv-ou-del-${Date.now()}`,
      jobCode,
      identity: `Empty OU: ${ou.name}`,
      identityEmail: 'ad-infra@identra-corp.io',
      entitlementOrRole: `LDAP DELETE organizationalUnit`,
      application: 'Active Directory',
      operation: 'Delete',
      status: 'Completed',
      triggeredBy: 'AD Structural Governance (Empty OU Cleanup)',
      timestamp: stamp,
      durationMs: 195,
      mappings: [
        {
          attribute: 'distinguishedName',
          before: ou.distinguishedName,
          after: null,
          rule: `Decommissioned abandoned 0-object OU (${ou.objectGuid})`,
        },
      ],
    };

    set((s) => ({
      provisioningJobs: [delJob, ...s.provisioningJobs],
      adOus: s.adOus.filter((item) => item.id !== ouId),
      toastMessage: `Decommissioned empty abandoned OU "${ou.name}" from Active Directory (${jobCode}).`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'AD Structural Gov',
          processTag: 'OU-DEL',
          tone: 'emerald',
          action: `Deleted empty abandoned OU "${ou.name}" via Active Directory job ${jobCode}`,
          target: ou.distinguishedName,
        },
        ...s.auditLog,
      ],
    }));
  },

  submitOuProvisioningRequest: (input) => {
    const parent = get().adOus.find((o) => o.id === input.parentOuId);
    const parentDn = parent ? parent.distinguishedName : 'DC=corp,DC=identra,DC=net';
    const cleanName = input.ouName.trim();
    const namingOk = /^[A-Z][A-Za-z0-9]+(\s-\s[A-Z][A-Za-z0-9 ]+)?$/.test(cleanName);
    const stamp = timeNow();
    const todayIso = new Date().toISOString().slice(0, 10);
    const reqCode = `OUR-${2041 + get().ouRequests.length}`;

    const newReq: DemoOuProvisioningRequest = {
      id: `ou-req-${Date.now()}`,
      requestCode: reqCode,
      ouName: cleanName,
      parentOuId: input.parentOuId,
      parentDn,
      targetDn: `OU=${cleanName},${parentDn}`,
      businessOwner: input.businessOwner.trim(),
      technicalCustodian: input.technicalCustodian.trim() || 'Alex Carter',
      purpose: input.purpose.trim(),
      requestedBy: 'Ivan Lubbe',
      submittedAt: `${todayIso} ${stamp.slice(0, 5)}`,
      namingCheckPassed: namingOk,
      status: 'Pending Approval',
      stages: [
        {
          stepOrder: 1,
          label: 'Business Owner Approval',
          actor: input.businessOwner.trim(),
          status: 'Active',
        },
        {
          stepOrder: 2,
          label: 'AD Infrastructure Approval',
          actor: `${input.technicalCustodian.trim() || 'Alex Carter'} (AD Infrastructure)`,
          status: 'Pending',
        },
        {
          stepOrder: 3,
          label: 'IGA Automatically Provisions OU in AD',
          actor: 'Provisioning Engine (LDAP CREATE)',
          status: 'Pending',
        },
        {
          stepOrder: 4,
          label: 'Discover & Correlate via objectGUID · Activate Governance',
          actor: 'AD Structural Governance Engine',
          status: 'Pending',
        },
      ],
    };

    set((s) => ({
      ouRequests: [newReq, ...s.ouRequests],
      toastMessage: `Submitted OU Provisioning Request ${reqCode} ("${cleanName}") — routed to ${newReq.businessOwner} for Business Owner approval.`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'OU Request Portal',
          processTag: 'OU-REQ',
          tone: 'sky',
          action: `Submitted governed OU creation request ${reqCode} (${newReq.targetDn})`,
          target: cleanName,
        },
        ...s.auditLog,
      ],
    }));
  },

  advanceOuRequestApproval: (requestId, decision) => {
    const req = get().ouRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending Approval') return;
    const stamp = timeNow();
    const todayIso = new Date().toISOString().slice(0, 10);

    if (decision === 'reject') {
      set((s) => ({
        ouRequests: s.ouRequests.map((r) =>
          r.id === requestId ? { ...r, status: 'Rejected' } : r
        ),
        toastMessage: `Rejected OU Provisioning Request ${req.requestCode} ("${req.ouName}").`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: 'AD Structural Gov',
            processTag: 'OU-REJ',
            tone: 'rose',
            action: `Rejected OU creation request ${req.requestCode}`,
            target: req.targetDn,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    const activeIdx = req.stages.findIndex((st) => st.status === 'Active');
    const willCompleteApprovals = decision === 'approve-all' || activeIdx >= 1;

    if (!willCompleteApprovals) {
      // Advance Step 1 (Business Owner) → Step 2 (AD Infrastructure)
      set((s) => ({
        ouRequests: s.ouRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                stages: r.stages.map((st, idx) =>
                  idx === 0
                    ? { ...st, status: 'Completed' }
                    : idx === 1
                      ? { ...st, status: 'Active' }
                      : st
                ),
              }
            : r
        ),
        toastMessage: `${req.requestCode}: Business Owner Approval completed — routed to AD Infrastructure Approval.`,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            time: stamp,
            actor: req.businessOwner,
            processTag: 'OU-APR',
            tone: 'sky',
            action: `Approved Business Owner stage on ${req.requestCode}; advancing to AD Infrastructure`,
            target: req.ouName,
          },
          ...s.auditLog,
        ],
      }));
      return;
    }

    // Complete approvals → Auto-provision OU in AD → Discover & Correlate objectGUID → Activate Governance!
    const newGuid = `${Math.random().toString(16).slice(2, 10)}-4f91-4b88-9a21-${Date.now().toString(16).slice(-12)}`;
    const newOuId = `ou-prov-${Date.now()}`;
    const jobCode = `PRV-${9050 + get().provisioningJobs.length}`;

    const createdOu: DemoOrganizationalUnit = {
      id: newOuId,
      objectGuid: newGuid,
      name: req.ouName,
      distinguishedName: req.targetDn,
      parentOuId: req.parentOuId,
      parentDn: req.parentDn,
      description: req.purpose,
      domain: 'corp.identra.net',
      businessOwner: req.businessOwner,
      technicalCustodian: req.technicalCustodian,
      createdDate: todayIso,
      lastModified: todayIso,
      childCounts: { users: 0, groups: 0, computers: 0 },
      governanceState: 'Managed',
      riskScore: 10,
      containsPrivilegedAccounts: false,
      namingCompliant: req.namingCheckPassed,
      inheritanceBlocked: false,
      gpoLinks: [
        { name: 'GPO-Baseline-Workstation-Hardening', enforced: true, status: 'Enabled' },
      ],
      delegatedPermissions: [
        {
          id: `del-prov-${Date.now()}`,
          principal: 'SG-AD-Identity-Provisioning-Engine',
          principalType: 'Service Account',
          rights: 'Create/Delete User & Group Objects (Scoped)',
          inherited: true,
          excessive: false,
          reviewedOn: todayIso,
        },
      ],
      complianceFlags: [],
      lastAttestedAt: todayIso,
    };

    const provJob: DemoProvisioningJob = {
      id: `prv-ou-new-${Date.now()}`,
      jobCode,
      identity: `OU: ${req.ouName}`,
      identityEmail: 'ad-infra@identra-corp.io',
      entitlementOrRole: `LDAP CREATE organizationalUnit (${req.requestCode})`,
      application: 'Active Directory',
      operation: 'Create',
      status: 'Completed',
      triggeredBy: `OU Provisioning Workflow (${req.requestCode})`,
      timestamp: stamp,
      durationMs: 280,
      mappings: [
        {
          attribute: 'distinguishedName',
          before: null,
          after: req.targetDn,
          rule: `Approved by ${req.businessOwner} + AD Infrastructure`,
        },
        {
          attribute: 'objectGUID',
          before: null,
          after: newGuid,
          rule: 'Discovered & Correlated Automatically Post-Create',
        },
        {
          attribute: 'managedBy',
          before: null,
          after: req.businessOwner,
          rule: 'Active Structural Governance Binding',
        },
      ],
    };

    set((s) => ({
      adOus: [...s.adOus, createdOu],
      provisioningJobs: [provJob, ...s.provisioningJobs],
      ouRequests: s.ouRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Provisioned & Governed',
              provisionedOuId: newOuId,
              provisionedGuid: newGuid,
              stages: r.stages.map((st) => ({ ...st, status: 'Completed' })),
            }
          : r
      ),
      toastMessage: `Provisioned "${req.ouName}" in Active Directory (${jobCode}), correlated via objectGUID, and activated Managed Governance!`,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          time: stamp,
          actor: 'AD Structural Gov',
          processTag: 'OU-PROV',
          tone: 'emerald',
          action: `Provisioned & correlated new Managed OU "${req.ouName}" (${jobCode} · objectGUID ${newGuid.slice(0, 8)}…)`,
          target: req.targetDn,
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
      emptyEntitlements: s.emptyEntitlements.map((e) =>
        e.deletionJobId === jobId ? { ...e, status: 'Deleted in Target' } : e
      ),
      governanceControls: s.governanceControls.map((c) =>
        c.id === 'ga-empty-entitlements'
          ? {
              ...c,
              violations: c.violations.map((v) =>
                v.deletionJobId === jobId
                  ? {
                      ...v,
                      resolved: true,
                      remediationOutcome: `Deleted in ${job.application} via released task ${job.jobCode}`,
                    }
                  : v
              ),
            }
          : c
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
      emptyEntitlements: s.emptyEntitlements.map((e) =>
        e.deletionJobId && jobIds.includes(e.deletionJobId)
          ? { ...e, status: 'Deleted in Target' }
          : e
      ),
      governanceControls: s.governanceControls.map((c) =>
        c.id === 'ga-empty-entitlements'
          ? {
              ...c,
              violations: c.violations.map((v) =>
                v.deletionJobId && jobIds.includes(v.deletionJobId)
                  ? {
                      ...v,
                      resolved: true,
                      remediationOutcome: `Deleted in ${v.targetSystem} via released task ${v.deletionJobCode}`,
                    }
                  : v
              ),
            }
          : c
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
      emptyEntitlements: s.emptyEntitlements.map((e) =>
        e.deletionJobId === jobId
          ? {
              ...e,
              status: 'Empty (Flagged)',
              deletionJobId: undefined,
              deletionJobCode: undefined,
            }
          : e
      ),
      governanceControls: s.governanceControls.map((c) =>
        c.id === 'ga-empty-entitlements'
          ? {
              ...c,
              violations: c.violations.map((v) =>
                v.deletionJobId === jobId
                  ? {
                      ...v,
                      resolved: false,
                      deletionJobId: undefined,
                      deletionJobCode: undefined,
                      remediationOutcome: undefined,
                    }
                  : v
              ),
            }
          : c
      ),
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
      licenseSkus: INITIAL_LICENSE_SKUS,
      predictedLeavers: INITIAL_PREDICTED_LEAVERS,
      accounts: INITIAL_DEMO_ACCOUNTS,
      reviews: INITIAL_DEMO_REVIEWS,
      policies: INITIAL_DEMO_POLICIES,
      governanceControls: INITIAL_GOVERNANCE_CONTROLS,
      adOus: INITIAL_AD_OUS,
      ouRequests: INITIAL_OU_REQUESTS,
      emptyEntitlements: INITIAL_EMPTY_ENTITLEMENTS,
      contractorRequests: INITIAL_CONTRACTOR_REQUESTS,
      entitlementRequests: INITIAL_ENTITLEMENT_REQUESTS,
      accessRequests: INITIAL_ACCESS_REQUESTS,
      leaveDelegation: INITIAL_LEAVE_DELEGATION,
      adoptionMappings: INITIAL_SYSTEM_ADOPTION_MAPPINGS,
      adoptionPolicy: INITIAL_ADOPTION_POLICY,
      adoptionRecords: INITIAL_ADOPTION_RECORDS,
      pendingAdoptAccountId: null,
      provisioningJobs: INITIAL_PROVISIONING_JOBS,
      importRuns: INITIAL_IMPORT_RUNS,
      emailNotifications: INITIAL_EMAIL_NOTIFICATIONS,
      platformConfig: INITIAL_PLATFORM_CONFIG,
      schemaObjects: INITIAL_SCHEMA_OBJECTS,
      customWorkflows: INITIAL_CUSTOM_WORKFLOWS,
      auditLog: INITIAL_DEMO_AUDIT,
      selectedPersonId: null,
      toastMessage: 'Reset all IDENTRA proof-of-concept sample data to initial baseline.',
    });
  },
}));
