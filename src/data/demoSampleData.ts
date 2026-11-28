export type DemoSectionId =
  | 'dashboard'
  | 'my-tasks'
  | 'people'
  | 'non-human'
  | 'orphan-adoption'
  | 'applications'
  | 'entitlements'
  | 'roles'
  | 'role-mining'
  | 'birthrights'
  | 'licenses'
  | 'access-marketplace'
  | 'governance-assurance'
  | 'ad-structural-governance'
  | 'access-reviews'
  | 'policies-sod'
  | 'compliance'
  | 'reporting'
  | 'lifecycle'
  | 'onboarding'
  | 'workflows'
  | 'provisioning-engine'
  | 'imports'
  | 'email-notifications'
  | 'audit-log'
  | 'configuration';

export type ImportStatus = 'Completed' | 'Failed' | 'Completed with Warnings';

export interface ImportStageLog {
  stage: string;
  duration: string;
  status: 'Passed' | 'Failed' | 'Warning';
  detail: string;
}

export interface DemoImportRun {
  id: string;
  runCode: string;
  system: 'Microsoft Entra ID' | 'Workday HRIS (HR)' | 'Active Directory';
  connector: string;
  mode: 'Scheduled Delta' | 'Nightly Full' | 'Manual Delta';
  triggeredAt: string;
  completedAt: string;
  duration: string;
  status: ImportStatus;
  recordsRead: number;
  created: number;
  updated: number;
  warnings: number;
  errors: number;
  errorCode?: string;
  errorMessage?: string;
  errorEndpoint?: string;
  recommendedFix?: string;
  stages: ImportStageLog[];
}

export type ProvisioningOperation = 'Create' | 'Update' | 'Delete';
export type ProvisioningStatus = 'Completed' | 'Failed' | 'Simulation Mode';

export interface ProvisioningMapping {
  attribute: string;
  before: string | null;
  after: string | null;
  rule: string;
}

export interface DemoProvisioningJob {
  id: string;
  jobCode: string;
  identity: string;
  identityEmail: string;
  entitlementOrRole: string;
  application:
    | 'Active Directory'
    | 'Microsoft Entra ID'
    | 'SAP S/4HANA Finance'
    | 'AWS Prod Vault'
    | 'Snowflake PII Lake'
    | 'Okta Workforce';
  operation: ProvisioningOperation;
  status: ProvisioningStatus;
  triggeredBy: string;
  timestamp: string;
  durationMs: number | null;
  errorMessage?: string;
  mappings: ProvisioningMapping[];
}

export interface IdentityHistoryChange {
  field: string;
  before: string | null;
  after: string | null;
}

export interface IdentityHistoryEntry {
  id: string;
  timestamp: string;
  source: string;
  category:
    | 'HRIS Sync'
    | 'JML Lifecycle'
    | 'Role / SoD'
    | 'Context Change'
    | 'Provisioning'
    | 'Emergency Deactivation';
  summary: string;
  changes: IdentityHistoryChange[];
}

export interface DemoPerson {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  employeeNumber: string;
  email: string;
  upn: string;
  samAccountName: string;
  title: string;
  department: string;
  departmentRefId: string;
  companyName: string;
  companyRefId: string;
  orgUnitName: string;
  orgUnitRefId: string;
  costCenterCode: string;
  costCenterRefId: string;
  location: string;
  type: 'Employee' | 'Contractor';
  contractType: string;
  hrStartDate: string;
  hrEndDate: string | null;
  sourceSystem: string;
  sourceRefId: string;
  sourceExternalId: string;
  lastHrSync: string;
  jmlStatus: 'Active' | 'Joiner' | 'Mover' | 'Leaver' | 'Suspended' | 'Deactivated';
  riskScore: number;
  roles: string[];
  applications: string[];
  manager: string;
  managerRefId: string;
  contextRefIds: string[];
  lastAttestation: string;
  sodAlert?: string;
  provenance?: IdentityProvenance;
  changeHistory: IdentityHistoryEntry[];
}

export interface IdentityProvenance {
  creationMethod: 'Orphaned account adoption' | 'Authoritative HRIS Sync' | 'Contractor Onboarding';
  creationSource: string;
  authoritativeSource: string;
  accountCorrelationSource: string;
  originalAccountId: string;
  adoptedBy: string;
  adoptionDate: string;
  approvalReference: string;
}

export interface DemoNonHuman {
  id: string;
  name: string;
  kind: 'AI Agent' | 'Service Account' | 'API Token';
  owner: string;
  targetSystem: string;
  privilegeScope: string;
  status: 'Governed' | 'Shadow Drift' | 'Rotated' | 'Suspended';
  riskScore: number;
  lastRotated: string;
}

export interface DemoApplication {
  id: string;
  name: string;
  category: 'ERP' | 'Cloud' | 'Data' | 'IdP' | 'Engineering' | 'HRIS';
  tier: 'Tier-0' | 'Tier-1';
  accounts: number;
  entitlements: number;
  connector: string;
  parity: number;
  status: 'Synced' | 'Syncing' | 'Drift Detected';
  lastSync: string;
}

export interface DemoEntitlement {
  id: string;
  name: string;
  application: string;
  assignedTo: string;
  source: 'Business Role' | 'Direct (Unreconciled)' | 'JIT Request';
  sensitivity: 'Critical' | 'High' | 'Standard';
  status: 'Reconciled' | 'Drift' | 'Revoked';
}

export interface DemoRoleMember {
  id: string;
  personId?: string;
  name: string;
  email: string;
  title: string;
  department: string;
  assignmentSource: 'Birthright (HRIS)' | 'Approved Request' | 'JIT (4h)' | 'Legacy Transfer (SoD)';
  grantedOn: string;
  status: 'Active' | 'SoD Conflict' | 'JIT Active';
}

export interface DemoRoleEntitlement {
  id: string;
  name: string;
  application: string;
  type:
    | 'AD Security Group'
    | 'Entra ID License'
    | 'SAP Role'
    | 'AWS Permission Set'
    | 'Snowflake Privilege'
    | 'App Permission';
  technicalId: string;
  sensitivity: 'Critical' | 'High' | 'Standard';
}

export interface DemoRole {
  id: string;
  name: string;
  department: string;
  description: string;
  members: number;
  entitlementsCount: number;
  owner: string;
  sodSensitive: boolean;
  conflictsWith?: string;
  includedApps: string[];
  memberList: DemoRoleMember[];
  entitlementList: DemoRoleEntitlement[];
}

export type ReviewAccessType =
  | 'AD Security Group'
  | 'Entra ID License'
  | 'Business Role'
  | 'Direct Entitlement'
  | 'AI Agent Grant';

export type ReviewWorkflowType =
  | 'Manager Approval'
  | 'Entitlement Owner Approval'
  | 'Application Owner Approval'
  | 'Dual-Stage (Manager → App Owner)'
  | 'SOX Control Owner Approval'
  | 'Data Owner & SecOps Approval';

export interface ReviewWorkflowStage {
  step: string;
  approverRole: string;
  assignee: string;
  status: 'Active' | 'Completed' | 'Queued';
}

export interface ReviewIdentitySnapshot {
  employeeNumber: string;
  email: string;
  location: string;
  contractType: string;
  manager: string;
  riskScore: number;
  lastLogin: string;
  activeGrantsCount: number;
}

export interface ReviewEntitlementDetails {
  description: string;
  owner: string;
  ownerRole: string;
  sensitivity: 'Critical' | 'High' | 'Standard';
  grantedOn: string;
  lastUsed: string;
  totalHolders: number;
  sodImpact?: string;
  nestedPermissions: string[];
}

export interface DemoReviewItem {
  id: string;
  personId?: string;
  nonHumanId?: string;
  roleId?: string;
  identity: string;
  identityTitle: string;
  department: string;
  accessType: ReviewAccessType;
  roleOrEntitlement: string;
  technicalId: string;
  parentBusinessRole: string;
  application: string;
  reviewer: string;
  workflowType: ReviewWorkflowType;
  workflowCode: string;
  triggeredBy: string;
  triggeredAt: string;
  escalationPolicy: string;
  workflowStages: ReviewWorkflowStage[];
  identitySnapshot: ReviewIdentitySnapshot;
  entitlementDetails: ReviewEntitlementDetails;
  risk: 'High' | 'Medium' | 'Low';
  usageSignal: string;
  monthlyCost?: string;
  aiRecommendation: 'Approve' | 'Revoke';
  reason: string;
  decision: 'Pending' | 'Approved' | 'Revoked';
}

export interface DemoPolicy {
  id: string;
  code: string;
  name: string;
  domain: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium';
  enforced: boolean;
  violations: number;
  affectedIdentity?: string;
}

export interface DemoAuditEntry {
  id: string;
  time: string;
  actor: string;
  processTag: string;
  tone: 'sky' | 'emerald' | 'amber' | 'rose';
  action: string;
  target: string;
}

export const INITIAL_DEMO_PEOPLE: DemoPerson[] = [
  {
    id: 'p-sarah',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    name: 'Sarah Mitchell',
    employeeNumber: 'EMP-10841',
    email: 'sarah.mitchell@identra-corp.io',
    upn: 'smitchell@corp.identra.net',
    samAccountName: 'smitchell',
    title: 'Financial Analyst',
    department: 'Corporate Finance & Treasury',
    departmentRefId: 'dept-finance',
    companyName: 'IDENTRA Global Holdings Ltd',
    companyRefId: 'comp-identra-uk',
    orgUnitName: 'EMEA Finance Operations',
    orgUnitRefId: 'ou-fin-analysts',
    costCenterCode: 'CC-4100-FIN',
    costCenterRefId: 'cc-4100',
    location: 'London, UK (HQ)',
    type: 'Employee',
    contractType: 'Full-Time Permanent (FTE)',
    hrStartDate: '2026-11-23',
    hrEndDate: null,
    sourceSystem: 'Workday HRIS Core',
    sourceRefId: 'src-workday',
    sourceExternalId: 'WD-99412',
    lastHrSync: 'Today · 10:24:12',
    jmlStatus: 'Joiner',
    riskScore: 14,
    roles: ['Finance: Base Ledger Read', 'Corporate SSO Standard'],
    applications: ['SAP S/4HANA', 'Active Directory', 'Microsoft Entra ID', 'Workday'],
    manager: 'Claire Vance',
    managerRefId: 'mgr-claire',
    contextRefIds: ['ctx-fin-uk-fte'],
    lastAttestation: 'Onboarded today 10:24',
    changeHistory: [
      {
        id: 'h-sarah-1',
        timestamp: '2026-11-23 10:24:12',
        source: 'Workday HRIS Core',
        category: 'JML Lifecycle',
        summary: 'Day-1 Joiner identity created and birthright Finance context assigned.',
        changes: [
          { field: 'jmlStatus', before: null, after: 'Joiner' },
          { field: 'orgUnit', before: null, after: 'OU-FIN-OPS-EMEA' },
          { field: 'hrStartDate', before: null, after: '2026-11-23' },
        ],
      },
      {
        id: 'h-sarah-2',
        timestamp: '2026-11-23 10:24:18',
        source: 'Provisioning Engine',
        category: 'Provisioning',
        summary: 'Provisioned Active Directory account & SG-Finance-Ledger-Readers.',
        changes: [
          { field: 'sAMAccountName', before: null, after: 'smitchell' },
          { field: 'accountStatus', before: null, after: 'Enabled' },
        ],
      },
    ],
  },
  {
    id: 'p-john',
    firstName: 'John',
    lastName: 'Davies',
    name: 'John Davies',
    employeeNumber: 'EMP-10394',
    email: 'john.davies@identra-corp.io',
    upn: 'jdavies@corp.identra.net',
    samAccountName: 'jdavies',
    title: 'Enterprise Account Director',
    department: 'Global Revenue & Enterprise Sales',
    departmentRefId: 'dept-sales',
    companyName: 'IDENTRA North America Inc.',
    companyRefId: 'comp-identra-us',
    orgUnitName: 'Enterprise Sales EMEA',
    orgUnitRefId: 'ou-sales-emea',
    costCenterCode: 'CC-2200-REV',
    costCenterRefId: 'cc-2200',
    location: 'New York, US',
    type: 'Employee',
    contractType: 'Full-Time Permanent (FTE)',
    hrStartDate: '2024-04-01',
    hrEndDate: null,
    sourceSystem: 'Workday HRIS Core',
    sourceRefId: 'src-workday',
    sourceExternalId: 'WD-72188',
    lastHrSync: 'Today · 09:47:05',
    jmlStatus: 'Mover',
    riskScore: 28,
    roles: ['Sales: Regional CRM Lead', 'Deal Desk Approver'],
    applications: ['Salesforce CRM', 'Microsoft Entra ID', 'Okta Workforce', 'Snowflake Analytics'],
    manager: 'Marcus Bell',
    managerRefId: 'mgr-marcus',
    contextRefIds: ['ctx-sales-emea'],
    lastAttestation: 'Updated today 09:47',
    changeHistory: [
      {
        id: 'h-john-1',
        timestamp: '2026-11-23 09:47:05',
        source: 'Workday HRIS Core',
        category: 'HRIS Sync',
        summary: 'Promotion synced: Account Executive → Enterprise Account Director.',
        changes: [
          { field: 'title', before: 'Senior Account Executive', after: 'Enterprise Account Director' },
          { field: 'orgUnit', before: 'OU-SLS-MID-US', after: 'OU-SLS-ENT-EMEA' },
        ],
      },
      {
        id: 'h-john-2',
        timestamp: '2026-11-23 10:12:33',
        source: 'Access Reviews',
        category: 'Provisioning',
        summary: 'Queued M365 E5 → E3 license optimization job in Simulation Mode.',
        changes: [
          { field: 'assignedLicenses', before: 'Microsoft 365 E5 (SPE_E5)', after: 'Pending Downgrade to E3' },
        ],
      },
    ],
  },
  {
    id: 'p-elena',
    firstName: 'Elena',
    lastName: 'Vance',
    name: 'Elena Vance',
    employeeNumber: 'EMP-10219',
    email: 'elena.vance@identra-corp.io',
    upn: 'evance@corp.identra.net',
    samAccountName: 'evance',
    title: 'Treasury Operations Lead',
    department: 'Corporate Finance & Treasury',
    departmentRefId: 'dept-finance',
    companyName: 'IDENTRA Global Holdings Ltd',
    companyRefId: 'comp-identra-uk',
    orgUnitName: 'EMEA Treasury & Payments',
    orgUnitRefId: 'ou-fin-treasury',
    costCenterCode: 'CC-4100-FIN',
    costCenterRefId: 'cc-4100',
    location: 'London, UK (HQ)',
    type: 'Employee',
    contractType: 'Full-Time Permanent (FTE)',
    hrStartDate: '2024-03-14',
    hrEndDate: null,
    sourceSystem: 'Workday HRIS Core',
    sourceRefId: 'src-workday',
    sourceExternalId: 'WD-68304',
    lastHrSync: 'Today · 08:15:19',
    jmlStatus: 'Mover',
    riskScore: 86,
    roles: ['Finance: AP-Clerk (Legacy)', 'Treasury: Payment Approver'],
    applications: ['SAP S/4HANA', 'Active Directory', 'Workday', 'Okta Workforce'],
    manager: 'David Chen',
    managerRefId: 'mgr-david',
    contextRefIds: ['ctx-treasury-emea', 'ctx-legacy-ap'],
    lastAttestation: '12 days ago',
    sodAlert: 'SOX-402 Toxic Combination: AP-Clerk + Payment Approver',
    changeHistory: [
      {
        id: 'h-elena-1',
        timestamp: '2026-11-11 08:00:00',
        source: 'Workday HRIS Core',
        category: 'Context Change',
        summary: 'Internal transfer from AP Operations into EMEA Treasury & Payments.',
        changes: [
          { field: 'orgUnit', before: 'OU-FIN-OPS-EMEA', after: 'OU-FIN-TREASURY-EMEA' },
          { field: 'manager', before: 'Claire Vance', after: 'David Chen' },
          { field: 'title', before: 'Senior AP Specialist', after: 'Treasury Operations Lead' },
        ],
      },
      {
        id: 'h-elena-2',
        timestamp: '2026-11-23 08:15:19',
        source: 'SOX-SOD-402 Policy Engine',
        category: 'Role / SoD',
        summary: 'Flagged toxic combination after legacy AP-Clerk role persisted past transfer.',
        changes: [
          { field: 'riskScore', before: '18', after: '86' },
          { field: 'sodViolation', before: 'None', after: 'SOX-SOD-402 (AP-Clerk ∧ Payment Approver)' },
        ],
      },
    ],
  },
  {
    id: 'p-mark',
    firstName: 'Mark',
    lastName: 'Wilson',
    name: 'Mark Wilson',
    employeeNumber: 'CTR-90114',
    email: 'mark.wilson@ext-audit.io',
    upn: 'mwilson_ext#EXT#@corp.identra.net',
    samAccountName: 'mwilson_ext',
    title: 'External Cloud Auditor',
    department: 'External Assurance & Contractors',
    departmentRefId: 'dept-contractor',
    companyName: 'Vanguard External Assurance LLP',
    companyRefId: 'comp-ext-audit',
    orgUnitName: 'External Contractors & Auditors',
    orgUnitRefId: 'ou-ext-contractors',
    costCenterCode: 'CC-9001-EXT',
    costCenterRefId: 'cc-9001',
    location: 'Remote (UK / B2B)',
    type: 'Contractor',
    contractType: 'Fixed-Term External Contractor (90d)',
    hrStartDate: '2026-08-22',
    hrEndDate: '2026-11-21',
    sourceSystem: 'B2B Partner Lifecycle Portal',
    sourceRefId: 'src-b2b',
    sourceExternalId: 'B2B-4412-EXT',
    lastHrSync: 'Today · 08:32:44',
    jmlStatus: 'Leaver',
    riskScore: 91,
    roles: ['Suspended Contractor Profile'],
    applications: ['AWS Prod Vault (Orphan Key)', 'Active Directory (Disabled)'],
    manager: 'Priya Nair',
    managerRefId: 'mgr-priya',
    contextRefIds: ['ctx-ext-audit'],
    lastAttestation: 'Deactivated 08:32 · Orphan key flagged',
    changeHistory: [
      {
        id: 'h-mark-1',
        timestamp: '2026-11-21 23:59:59',
        source: 'B2B Partner Lifecycle Portal',
        category: 'HRIS Sync',
        summary: 'Contractor fixed-term end date reached; Leaver event emitted.',
        changes: [
          { field: 'jmlStatus', before: 'Active', after: 'Leaver' },
          { field: 'contractStatus', before: 'In-Term', after: 'Expired (2026-11-21)' },
        ],
      },
      {
        id: 'h-mark-2',
        timestamp: '2026-11-23 08:32:44',
        source: 'Provisioning Engine',
        category: 'Provisioning',
        summary: 'Disabled Active Directory account and moved DN to OU=DisabledUsers.',
        changes: [
          { field: 'accountStatus', before: 'Enabled', after: 'Disabled' },
          { field: 'userAccountControl', before: '512', after: '514' },
          { field: 'distinguishedName', before: 'OU=Contractors', after: 'OU=DisabledUsers' },
        ],
      },
    ],
  },
  {
    id: 'p-priya',
    firstName: 'Priya',
    lastName: 'Nair',
    name: 'Priya Nair',
    employeeNumber: 'EMP-10105',
    email: 'priya.nair@identra-corp.io',
    upn: 'pnair@corp.identra.net',
    samAccountName: 'pnair',
    title: 'Principal Platform Engineer',
    department: 'Platform & Cloud Engineering',
    departmentRefId: 'dept-eng',
    companyName: 'IDENTRA Global Holdings Ltd',
    companyRefId: 'comp-identra-uk',
    orgUnitName: 'Platform SRE & Cloud Infra',
    orgUnitRefId: 'ou-eng-platform',
    costCenterCode: 'CC-3010-ENG',
    costCenterRefId: 'cc-3010',
    location: 'London, UK (HQ)',
    type: 'Employee',
    contractType: 'Full-Time Permanent (FTE)',
    hrStartDate: '2023-09-01',
    hrEndDate: null,
    sourceSystem: 'Workday HRIS Core',
    sourceRefId: 'src-workday',
    sourceExternalId: 'WD-51209',
    lastHrSync: 'Today · 07:00:00',
    jmlStatus: 'Active',
    riskScore: 16,
    roles: ['Prod K8s Operator (JIT)', 'GitHub Org Maintainer'],
    applications: ['AWS Prod Vault', 'GitHub Enterprise', 'Active Directory', 'Okta Workforce'],
    manager: 'Alex Carter',
    managerRefId: 'mgr-alex',
    contextRefIds: ['ctx-sre-jit'],
    lastAttestation: 'Certified 4 days ago',
    changeHistory: [
      {
        id: 'h-priya-1',
        timestamp: '2026-11-19 14:10:00',
        source: 'Access Reviews',
        category: 'Role / SoD',
        summary: 'Q4 access certification approved for Prod K8s Operator (JIT).',
        changes: [
          { field: 'lastAttestation', before: '2026-08-19', after: '2026-11-19 (Approved)' },
        ],
      },
    ],
  },
  {
    id: 'p-lucas',
    firstName: 'Lucas',
    lastName: 'Meyer',
    name: 'Lucas Meyer',
    employeeNumber: 'EMP-10277',
    email: 'lucas.meyer@identra-corp.io',
    upn: 'lmeyer@corp.identra.net',
    samAccountName: 'lmeyer',
    title: 'Head of Data Governance',
    department: 'Data Governance & Analytics',
    departmentRefId: 'dept-data',
    companyName: 'IDENTRA Global Holdings Ltd',
    companyRefId: 'comp-identra-uk',
    orgUnitName: 'Enterprise Data Stewardship',
    orgUnitRefId: 'ou-data-gov',
    costCenterCode: 'CC-3400-DAT',
    costCenterRefId: 'cc-3400',
    location: 'Zurich, CH',
    type: 'Employee',
    contractType: 'Full-Time Permanent (FTE)',
    hrStartDate: '2024-06-15',
    hrEndDate: null,
    sourceSystem: 'Workday HRIS Core',
    sourceRefId: 'src-workday',
    sourceExternalId: 'WD-64901',
    lastHrSync: 'Today · 07:00:00',
    jmlStatus: 'Active',
    riskScore: 19,
    roles: ['Snowflake Data Steward', 'Compliance Auditor'],
    applications: ['Snowflake PII', 'Okta Workforce', 'GitHub Enterprise'],
    manager: 'Hannah Lindqvist',
    managerRefId: 'mgr-cdo',
    contextRefIds: ['ctx-data-steward'],
    lastAttestation: 'Certified 6 days ago',
    changeHistory: [
      {
        id: 'h-lucas-1',
        timestamp: '2026-11-17 11:05:22',
        source: 'Governance Engine',
        category: 'Role / SoD',
        summary: 'Recertified Tier-0 PII Data Stewardship context.',
        changes: [
          { field: 'contextStatus', before: 'Due for Review', after: 'Certified (GDPR Art. 32)' },
        ],
      },
    ],
  },
];

export const INITIAL_DEMO_NON_HUMAN: DemoNonHuman[] = [
  {
    id: 'nh-deploy',
    name: 'agent.release-copilot',
    kind: 'AI Agent',
    owner: 'Priya Nair',
    targetSystem: 'Snowflake PII',
    privilegeScope: 'Direct SELECT_PII (Unattested)',
    status: 'Shadow Drift',
    riskScore: 88,
    lastRotated: '14 days ago',
  },
  {
    id: 'nh-etl',
    name: 'svc.finance-ledger-etl',
    kind: 'Service Account',
    owner: 'Lucas Meyer',
    targetSystem: 'SAP S/4HANA',
    privilegeScope: 'Scoped Batch Read-Only',
    status: 'Governed',
    riskScore: 12,
    lastRotated: '2 days ago',
  },
  {
    id: 'nh-triage',
    name: 'agent.soc-incident-bot',
    kind: 'AI Agent',
    owner: 'Security Ops',
    targetSystem: 'Okta Workforce',
    privilegeScope: 'JIT Session Revoke (MCP)',
    status: 'Governed',
    riskScore: 18,
    lastRotated: '6 hours ago',
  },
  {
    id: 'nh-legacy',
    name: 'api.legacy-billing-sync',
    kind: 'API Token',
    owner: 'Unassigned (Orphan)',
    targetSystem: 'AWS Prod Vault',
    privilegeScope: 'Wildcard S3 + Secrets Read',
    status: 'Shadow Drift',
    riskScore: 92,
    lastRotated: '194 days ago',
  },
];

export const INITIAL_DEMO_APPS: DemoApplication[] = [
  {
    id: 'app-sap',
    name: 'SAP S/4HANA Finance',
    category: 'ERP',
    tier: 'Tier-0',
    accounts: 1420,
    entitlements: 3840,
    connector: 'SAP BAPI / SCIM',
    parity: 96,
    status: 'Drift Detected',
    lastSync: '2m ago',
  },
  {
    id: 'app-aws',
    name: 'AWS Prod Vault',
    category: 'Cloud',
    tier: 'Tier-0',
    accounts: 648,
    entitlements: 2910,
    connector: 'AWS IAM Identity Center',
    parity: 94,
    status: 'Drift Detected',
    lastSync: '1m ago',
  },
  {
    id: 'app-snowflake',
    name: 'Snowflake PII Lake',
    category: 'Data',
    tier: 'Tier-0',
    accounts: 892,
    entitlements: 2140,
    connector: 'Snowflake Governance API',
    parity: 97,
    status: 'Drift Detected',
    lastSync: '4m ago',
  },
  {
    id: 'app-okta',
    name: 'Okta Workforce Cloud',
    category: 'IdP',
    tier: 'Tier-0',
    accounts: 6732,
    entitlements: 1620,
    connector: 'Okta System API v2',
    parity: 100,
    status: 'Synced',
    lastSync: '18s ago',
  },
  {
    id: 'app-github',
    name: 'GitHub Enterprise',
    category: 'Engineering',
    tier: 'Tier-1',
    accounts: 1185,
    entitlements: 1350,
    connector: 'GitHub SCIM Bridge',
    parity: 100,
    status: 'Synced',
    lastSync: '3m ago',
  },
  {
    id: 'app-workday',
    name: 'Workday HRIS Core',
    category: 'HRIS',
    tier: 'Tier-0',
    accounts: 6732,
    entitlements: 620,
    connector: 'Workday Authoritative Feed',
    parity: 100,
    status: 'Synced',
    lastSync: '30s ago',
  },
];

export const INITIAL_DEMO_ENTITLEMENTS: DemoEntitlement[] = [
  {
    id: 'ent-1',
    name: 'AWS:IAM::ProdAdminAccessKey',
    application: 'AWS Prod Vault',
    assignedTo: 'Mark Wilson (Leaver)',
    source: 'Direct (Unreconciled)',
    sensitivity: 'Critical',
    status: 'Drift',
  },
  {
    id: 'ent-2',
    name: 'SAP:FI_VENDOR_CREATE',
    application: 'SAP S/4HANA Finance',
    assignedTo: 'Elena Vance (Mover)',
    source: 'Direct (Unreconciled)',
    sensitivity: 'Critical',
    status: 'Drift',
  },
  {
    id: 'ent-3',
    name: 'SNOWFLAKE:RAW_PII_SELECT',
    application: 'Snowflake PII Lake',
    assignedTo: 'agent.release-copilot',
    source: 'Direct (Unreconciled)',
    sensitivity: 'Critical',
    status: 'Drift',
  },
  {
    id: 'ent-4',
    name: 'SAP:FI_WIRE_APPROVE_50K',
    application: 'SAP S/4HANA Finance',
    assignedTo: 'Elena Vance',
    source: 'Business Role',
    sensitivity: 'High',
    status: 'Reconciled',
  },
  {
    id: 'ent-5',
    name: 'EKS:PROD_CLUSTER_OPERATOR_4H',
    application: 'AWS Prod Vault',
    assignedTo: 'Priya Nair',
    source: 'JIT Request',
    sensitivity: 'High',
    status: 'Reconciled',
  },
  {
    id: 'ent-6',
    name: 'GITHUB:CORE_REPO_MAINTAIN',
    application: 'GitHub Enterprise',
    assignedTo: 'Priya Nair',
    source: 'Business Role',
    sensitivity: 'Standard',
    status: 'Reconciled',
  },
];

export const INITIAL_DEMO_ROLES: DemoRole[] = [
  {
    id: 'r-ap',
    name: 'Finance: AP-Clerk',
    department: 'Finance',
    description:
      'Accounts Payable specialists responsible for vendor master onboarding, invoice entry, and ledger reconciliation.',
    members: 44,
    entitlementsCount: 12,
    owner: 'Controller Office',
    sodSensitive: true,
    conflictsWith: 'Treasury: Payment Approver',
    includedApps: ['SAP S/4HANA', 'Active Directory', 'Microsoft Entra ID', 'Workday'],
    memberList: [
      {
        id: 'rm-ap-1',
        personId: 'p-elena',
        name: 'Elena Vance',
        email: 'elena.vance@identra-corp.io',
        title: 'Treasury Operations Lead',
        department: 'Finance',
        assignmentSource: 'Legacy Transfer (SoD)',
        grantedOn: '2024-03-14',
        status: 'SoD Conflict',
      },
      {
        id: 'rm-ap-2',
        personId: 'p-sarah',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@identra-corp.io',
        title: 'Financial Analyst',
        department: 'Finance',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2026-11-23',
        status: 'Active',
      },
      {
        id: 'rm-ap-3',
        name: 'Owen Gallagher',
        email: 'owen.gallagher@identra-corp.io',
        title: 'AP Specialist',
        department: 'Finance',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2025-02-11',
        status: 'Active',
      },
      {
        id: 'rm-ap-4',
        name: 'Nadia Patel',
        email: 'nadia.patel@identra-corp.io',
        title: 'Senior AP Accountant',
        department: 'Finance',
        assignmentSource: 'Approved Request',
        grantedOn: '2025-07-03',
        status: 'Active',
      },
    ],
    entitlementList: [
      {
        id: 're-ap-1',
        name: 'SAP: Create & Edit Vendor Master',
        application: 'SAP S/4HANA Finance',
        type: 'SAP Role',
        technicalId: 'SAP_ROLE: Z_FI_AP_VENDOR_CREATE',
        sensitivity: 'Critical',
      },
      {
        id: 're-ap-2',
        name: 'SAP: Post Supplier Invoices',
        application: 'SAP S/4HANA Finance',
        type: 'SAP Role',
        technicalId: 'SAP_ROLE: Z_FI_AP_INVOICE_POST',
        sensitivity: 'High',
      },
      {
        id: 're-ap-3',
        name: 'SG-Finance-AP-Clerks',
        application: 'Active Directory',
        type: 'AD Security Group',
        technicalId: 'CN=SG-Finance-AP-Clerks,OU=Finance,DC=identra,DC=corp',
        sensitivity: 'Standard',
      },
      {
        id: 're-ap-4',
        name: 'Microsoft 365 E3 (Finance Baseline)',
        application: 'Microsoft Entra ID',
        type: 'Entra ID License',
        technicalId: 'SKU: SPE_E3 (05e9a617-0261-4cee-bb44-138d3ef5d965)',
        sensitivity: 'Standard',
      },
    ],
  },
  {
    id: 'r-pay',
    name: 'Treasury: Payment Approver',
    department: 'Finance',
    description:
      'Authorized Treasury approvers permitted to release outbound supplier wire batches and dual-sign payments above R50k.',
    members: 18,
    entitlementsCount: 9,
    owner: 'Treasury Director',
    sodSensitive: true,
    conflictsWith: 'Finance: AP-Clerk',
    includedApps: ['SAP S/4HANA', 'Active Directory', 'Microsoft Entra ID', 'Okta Workforce'],
    memberList: [
      {
        id: 'rm-pay-1',
        personId: 'p-elena',
        name: 'Elena Vance',
        email: 'elena.vance@identra-corp.io',
        title: 'Treasury Operations Lead',
        department: 'Finance',
        assignmentSource: 'Approved Request',
        grantedOn: '2026-11-11',
        status: 'SoD Conflict',
      },
      {
        id: 'rm-pay-2',
        name: 'Claire Brooks',
        email: 'claire.brooks@identra-corp.io',
        title: 'VP Financial Planning',
        department: 'Finance',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2024-09-01',
        status: 'Active',
      },
      {
        id: 'rm-pay-3',
        name: 'David Chen',
        email: 'david.chen@identra-corp.io',
        title: 'Treasury Director',
        department: 'Finance',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2023-05-19',
        status: 'Active',
      },
    ],
    entitlementList: [
      {
        id: 're-pay-1',
        name: 'SAP: Approve & Release Wire >R50k',
        application: 'SAP S/4HANA Finance',
        type: 'SAP Role',
        technicalId: 'SAP_ROLE: Z_TR_PAYMENT_APPROVER',
        sensitivity: 'Critical',
      },
      {
        id: 're-pay-2',
        name: 'SG-Treasury-Payment-Signers',
        application: 'Active Directory',
        type: 'AD Security Group',
        technicalId: 'CN=SG-Treasury-Payment-Signers,OU=Treasury,DC=identra,DC=corp',
        sensitivity: 'Critical',
      },
      {
        id: 're-pay-3',
        name: 'Microsoft 365 E5 + Entra ID P2',
        application: 'Microsoft Entra ID',
        type: 'Entra ID License',
        technicalId: 'SKU: SPE_E5 (06ebc4ee-1bb5-47dd-8120-11324bc54e06)',
        sensitivity: 'High',
      },
      {
        id: 're-pay-4',
        name: 'Okta: Phishing-Resistant FIDO2 Policy',
        application: 'Okta Workforce',
        type: 'App Permission',
        technicalId: 'OKTA_GROUP: GRP-TREASURY-MFA-HIGH',
        sensitivity: 'High',
      },
    ],
  },
  {
    id: 'r-k8s',
    name: 'Prod K8s Operator (JIT)',
    department: 'Engineering',
    description:
      'Time-bound 4-hour ephemeral SRE role granting audited Kubernetes cluster access with zero standing production privilege.',
    members: 62,
    entitlementsCount: 15,
    owner: 'SRE Leadership',
    sodSensitive: false,
    includedApps: ['AWS Prod Vault', 'Active Directory', 'GitHub Enterprise'],
    memberList: [
      {
        id: 'rm-k8s-1',
        personId: 'p-priya',
        name: 'Priya Nair',
        email: 'priya.nair@identra-corp.io',
        title: 'Principal Platform Engineer',
        department: 'Engineering',
        assignmentSource: 'JIT (4h)',
        grantedOn: '2026-11-23',
        status: 'JIT Active',
      },
      {
        id: 'rm-k8s-2',
        name: 'Hannah Brooks',
        email: 'hannah.brooks@identra-corp.io',
        title: 'Cloud Security Engineer',
        department: 'Engineering',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2026-11-23',
        status: 'Active',
      },
      {
        id: 'rm-k8s-3',
        name: 'James Thornton',
        email: 'james.thornton@identra-corp.io',
        title: 'Senior Systems Engineer',
        department: 'Infrastructure',
        assignmentSource: 'Approved Request',
        grantedOn: '2025-10-08',
        status: 'Active',
      },
    ],
    entitlementList: [
      {
        id: 're-k8s-1',
        name: 'AWS EKS Prod Cluster Operator (4h JIT)',
        application: 'AWS Prod Vault',
        type: 'AWS Permission Set',
        technicalId: 'arn:aws:sso:::permissionSet/k8s-jit-4h',
        sensitivity: 'Critical',
      },
      {
        id: 're-k8s-2',
        name: 'SG-Platform-Engineering',
        application: 'Active Directory',
        type: 'AD Security Group',
        technicalId: 'CN=SG-Platform-Engineering,OU=Eng,DC=identra,DC=corp',
        sensitivity: 'Standard',
      },
      {
        id: 're-k8s-3',
        name: 'GitHub: Core Infra Maintainer',
        application: 'GitHub Enterprise',
        type: 'App Permission',
        technicalId: 'GH_TEAM: identra-corp/platform-sre',
        sensitivity: 'High',
      },
    ],
  },
  {
    id: 'r-steward',
    name: 'Snowflake Data Steward',
    department: 'Data',
    description:
      'Data governance owners overseeing masked PII schemas, row-level access policies, and analytics catalog certifications.',
    members: 29,
    entitlementsCount: 18,
    owner: 'Chief Data Officer',
    sodSensitive: false,
    includedApps: ['Snowflake PII Lake', 'Active Directory', 'Okta Workforce'],
    memberList: [
      {
        id: 'rm-st-1',
        personId: 'p-lucas',
        name: 'Lucas Meyer',
        email: 'lucas.meyer@identra-corp.io',
        title: 'Head of Data Governance',
        department: 'Data',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2024-06-15',
        status: 'Active',
      },
      {
        id: 'rm-st-2',
        name: 'Sofia Alvarez',
        email: 'sofia.alvarez@identra-corp.io',
        title: 'Analytics Engineer',
        department: 'Data',
        assignmentSource: 'Approved Request',
        grantedOn: '2025-09-20',
        status: 'Active',
      },
    ],
    entitlementList: [
      {
        id: 're-st-1',
        name: 'Snowflake: MASKED_PII_STEWARD',
        application: 'Snowflake PII Lake',
        type: 'Snowflake Privilege',
        technicalId: 'GRANT ROLE MASKED_PII_STEWARD ON DATABASE PROD_LAKE',
        sensitivity: 'High',
      },
      {
        id: 're-st-2',
        name: 'Snowflake: Row-Level Policy Admin',
        application: 'Snowflake PII Lake',
        type: 'Snowflake Privilege',
        technicalId: 'GRANT APPLY ROW ACCESS POLICY ON ACCOUNT',
        sensitivity: 'Critical',
      },
      {
        id: 're-st-3',
        name: 'SG-Data-Stewards',
        application: 'Active Directory',
        type: 'AD Security Group',
        technicalId: 'CN=SG-Data-Stewards,OU=Data,DC=identra,DC=corp',
        sensitivity: 'Standard',
      },
    ],
  },
  {
    id: 'r-sales',
    name: 'Sales: Regional CRM Lead',
    department: 'Sales',
    description:
      'Regional enterprise sales directors managing pipeline forecasts, customer contracts, and analytics dashboards.',
    members: 112,
    entitlementsCount: 14,
    owner: 'VP Revenue Ops',
    sodSensitive: false,
    includedApps: ['Salesforce CRM', 'Microsoft Entra ID', 'Snowflake Analytics'],
    memberList: [
      {
        id: 'rm-sa-1',
        personId: 'p-john',
        name: 'John Davies',
        email: 'john.davies@identra-corp.io',
        title: 'Enterprise Account Director',
        department: 'Sales',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2026-11-23',
        status: 'Active',
      },
      {
        id: 'rm-sa-2',
        name: 'Marcus Bell',
        email: 'marcus.bell@identra-corp.io',
        title: 'VP Enterprise Sales',
        department: 'Sales',
        assignmentSource: 'Birthright (HRIS)',
        grantedOn: '2023-11-04',
        status: 'Active',
      },
    ],
    entitlementList: [
      {
        id: 're-sa-1',
        name: 'Salesforce: Regional Pipeline Director',
        application: 'Salesforce CRM',
        type: 'App Permission',
        technicalId: 'SFDC_PERMSET: EMEA_Regional_Lead',
        sensitivity: 'Standard',
      },
      {
        id: 're-sa-2',
        name: 'Microsoft 365 E3 (Sales Standard)',
        application: 'Microsoft Entra ID',
        type: 'Entra ID License',
        technicalId: 'SKU: SPE_E3 (05e9a617-0261-4cee-bb44-138d3ef5d965)',
        sensitivity: 'Standard',
      },
      {
        id: 're-sa-3',
        name: 'Snowflake: Aggregated Revenue Read',
        application: 'Snowflake Analytics',
        type: 'Snowflake Privilege',
        technicalId: 'GRANT SELECT ON VIEW ANALYTICS.REVENUE_SUMMARY',
        sensitivity: 'Standard',
      },
    ],
  },
];

export const INITIAL_DEMO_REVIEWS: DemoReviewItem[] = [
  {
    id: 'rev-ad-1',
    personId: 'p-mark',
    identity: 'Mark Wilson (Contractor)',
    identityTitle: 'External Cloud Auditor · Terminated',
    department: 'Contractor',
    accessType: 'AD Security Group',
    roleOrEntitlement: 'SG-AWS-Prod-Vault-Admins',
    technicalId: 'CN=SG-AWS-Prod-Vault-Admins,OU=Privileged,DC=identra,DC=corp',
    parentBusinessRole: 'Direct Assignment (Orphaned — No Role Owner)',
    application: 'Active Directory',
    reviewer: 'Priya Nair',
    workflowType: 'Entitlement Owner Approval',
    workflowCode: 'WF-REV-ENT-04',
    triggeredBy: 'Event: Contractor Expiry & Orphaned Privilege Alert',
    triggeredAt: '2026-11-23 08:33',
    escalationPolicy: 'Auto-revoke after 24h SLA (Tier-0 Privileged Group)',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Entitlement Owner (Cloud Vault)', assignee: 'Priya Nair', status: 'Active' },
      { step: 'Stage 2', approverRole: 'Security Operations Sign-Off', assignee: 'SecOps On-Call', status: 'Queued' },
    ],
    identitySnapshot: {
      employeeNumber: 'CTR-90114',
      email: 'mark.wilson@ext-audit.io',
      location: 'Remote (UK / B2B)',
      contractType: 'Fixed-Term External Contractor (90d)',
      manager: 'Priya Nair (Sponsor)',
      riskScore: 91,
      lastLogin: '3 days ago',
      activeGrantsCount: 2,
    },
    entitlementDetails: {
      description: 'Tier-0 Active Directory security group mapped via SAML federation to AWS Production Vault administrative roles.',
      owner: 'Priya Nair',
      ownerRole: 'Entitlement Owner · Cloud Security',
      sensitivity: 'Critical',
      grantedOn: '2026-08-24',
      lastUsed: '2026-11-20',
      totalHolders: 7,
      sodImpact: 'Subject to JML-OFF-001 (Zero-Orphan Leaver Policy) and ACC-JIT-118.',
      nestedPermissions: [
        'SAML Federation → AWS Prod Vault Admin Role',
        'KMS Key Policy Read/Decrypt (Prod)',
        'SecretsManager:ListSecrets & GetSecretValue',
      ],
    },
    risk: 'High',
    usageSignal: 'Contract ended 48h ago · 0 valid sessions',
    aiRecommendation: 'Revoke',
    reason: 'Contractor terminated in Workday; privileged AD security group grants federated AWS Prod access.',
    decision: 'Pending',
  },
  {
    id: 'rev-ad-2',
    identity: 'James Thornton',
    identityTitle: 'Senior Systems Engineer',
    department: 'Infrastructure',
    accessType: 'AD Security Group',
    roleOrEntitlement: 'SG-Domain-Tier1-ServerAdmins',
    technicalId: 'CN=SG-Domain-Tier1-ServerAdmins,OU=Infra,DC=identra,DC=corp',
    parentBusinessRole: 'Direct Assignment (Legacy Ticket #IT-4821)',
    application: 'Active Directory',
    reviewer: 'Marcus Bell',
    workflowType: 'Dual-Stage (Manager → App Owner)',
    workflowCode: 'WF-REV-DUAL-02',
    triggeredBy: 'Scheduled Q4 Privileged Access Certification',
    triggeredAt: '2026-11-22 06:00',
    escalationPolicy: 'Auto-revoke after 7d if uncertified; notify Infrastructure VP',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Line Manager Approval', assignee: 'Marcus Bell', status: 'Active' },
      { step: 'Stage 2', approverRole: 'Application Owner (Active Directory)', assignee: 'AD Platform Team', status: 'Queued' },
    ],
    identitySnapshot: {
      employeeNumber: 'EMP-10412',
      email: 'james.thornton@identra-corp.io',
      location: 'London, UK (HQ)',
      contractType: 'Full-Time Permanent (FTE)',
      manager: 'Marcus Bell',
      riskScore: 64,
      lastLogin: 'Today 08:11',
      activeGrantsCount: 11,
    },
    entitlementDetails: {
      description: 'Grants standing local administrator rights across Tier-1 Windows application and file servers in DC=identra,DC=corp.',
      owner: 'AD Platform Team',
      ownerRole: 'Application Owner · Active Directory',
      sensitivity: 'Critical',
      grantedOn: '2025-03-19',
      lastUsed: '2026-08-21 (94d ago)',
      totalHolders: 14,
      sodImpact: 'Conflicts with Zero Standing Privilege baseline (ACC-JIT-118).',
      nestedPermissions: [
        'Local Administrator on OU=Tier1-Servers',
        'RDP & WinRM Interactive Logon',
        'Service Control Manager Write Access',
      ],
    },
    risk: 'High',
    usageSignal: 'Last Kerberos elevation: 94 days ago',
    aiRecommendation: 'Revoke',
    reason: 'Standing privileged AD server admin group unused for >90 days; replace with JIT elevation.',
    decision: 'Pending',
  },
  {
    id: 'rev-entra-1',
    personId: 'p-john',
    identity: 'John Davies',
    identityTitle: 'Enterprise Account Director',
    department: 'Sales',
    accessType: 'Entra ID License',
    roleOrEntitlement: 'Microsoft 365 E5 (Full Suite)',
    technicalId: 'SKU: SPE_E5 (06ebc4ee-1bb5-47dd-8120-11324bc54e06)',
    parentBusinessRole: 'Group-Based License: LIC-M365-E5-All',
    application: 'Microsoft Entra ID',
    reviewer: 'Marcus Bell',
    workflowType: 'Manager Approval',
    workflowCode: 'WF-REV-MGR-01',
    triggeredBy: 'Scheduled Quarterly SaaS License Optimization Review',
    triggeredAt: '2026-11-23 07:00',
    escalationPolicy: 'Auto-downgrade to M365 E3 after 10d SLA (R385/mo savings)',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Line Manager Approval', assignee: 'Marcus Bell', status: 'Active' },
    ],
    identitySnapshot: {
      employeeNumber: 'EMP-10394',
      email: 'john.davies@identra-corp.io',
      location: 'New York, US',
      contractType: 'Full-Time Permanent (FTE)',
      manager: 'Marcus Bell',
      riskScore: 28,
      lastLogin: 'Today 09:50',
      activeGrantsCount: 9,
    },
    entitlementDetails: {
      description: 'Full Microsoft 365 E5 enterprise license SKU including Power BI Pro, Audio Conferencing, Defender Suite, and Purview eDiscovery.',
      owner: 'Modern Workplace IT',
      ownerRole: 'Application Owner · Microsoft Entra ID',
      sensitivity: 'Standard',
      grantedOn: '2024-04-01',
      lastUsed: 'E5 add-ons unused 118d',
      totalHolders: 384,
      nestedPermissions: [
        'Microsoft 365 Apps for Enterprise',
        'Power BI Pro & Audio Conferencing (Unused)',
        'Microsoft Purview Compliance & Defender Plan 2',
      ],
    },
    risk: 'Medium',
    usageSignal: 'E5 features (PowerBI Pro / Audio Conf) unused 118 days',
    monthlyCost: 'R1,050/mo',
    aiRecommendation: 'Revoke',
    reason: 'Zero E5-tier workload activity in 4 months; reclaim E5 license and downgrade to M365 E3.',
    decision: 'Pending',
  },
  {
    id: 'rev-entra-2',
    identity: 'Daniel Foster',
    identityTitle: 'Regional Marketing Lead',
    department: 'Marketing',
    accessType: 'Entra ID License',
    roleOrEntitlement: 'Microsoft Entra ID P2',
    technicalId: 'SKU: AAD_PREMIUM_P2 (eec0eb4f-6444-4f95-aba0-50c24d67f998)',
    parentBusinessRole: 'Direct License Assignment',
    application: 'Microsoft Entra ID',
    reviewer: 'Claire Vance',
    workflowType: 'Application Owner Approval',
    workflowCode: 'WF-REV-APP-03',
    triggeredBy: 'Scheduled Quarterly SaaS License Optimization Review',
    triggeredAt: '2026-11-23 07:00',
    escalationPolicy: 'Reclaim unused P2 add-on after 14d SLA',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Application Owner (Entra ID)', assignee: 'Claire Vance', status: 'Active' },
    ],
    identitySnapshot: {
      employeeNumber: 'EMP-10588',
      email: 'daniel.foster@identra-corp.io',
      location: 'London, UK (HQ)',
      contractType: 'Full-Time Permanent (FTE)',
      manager: 'Claire Vance',
      riskScore: 18,
      lastLogin: 'Today 09:12',
      activeGrantsCount: 6,
    },
    entitlementDetails: {
      description: 'Entra ID P2 add-on license enabling Privileged Identity Management (PIM) and Identity Protection risk policies.',
      owner: 'Identity Platform Engineering',
      ownerRole: 'Application Owner · Microsoft Entra ID',
      sensitivity: 'Standard',
      grantedOn: '2025-05-11',
      lastUsed: '0 PIM activations in 180d',
      totalHolders: 142,
      nestedPermissions: [
        'Microsoft Entra Privileged Identity Management (PIM)',
        'Risk-Based Conditional Access Policies',
        'Access Reviews Reviewer Capability',
      ],
    },
    risk: 'Medium',
    usageSignal: '0 PIM activations or Identity Protection reviews in 180 days',
    monthlyCost: 'R165/mo',
    aiRecommendation: 'Revoke',
    reason: 'Non-privileged marketing user holding Entra ID P2 add-on with no PIM role eligibility.',
    decision: 'Pending',
  },
  {
    id: 'rev-entra-3',
    identity: 'Claire Brooks',
    identityTitle: 'VP Financial Planning',
    department: 'Finance',
    accessType: 'Entra ID License',
    roleOrEntitlement: 'Microsoft 365 Copilot',
    technicalId: 'SKU: Microsoft_365_Copilot (639dec6b-bb19-468b-871c-c5c441c4b0cb)',
    parentBusinessRole: 'Business Role: Finance Leadership Pack',
    application: 'Microsoft Entra ID',
    reviewer: 'David Chen',
    workflowType: 'Manager Approval',
    workflowCode: 'WF-REV-MGR-01',
    triggeredBy: 'Scheduled Q4 AI License Utilization Campaign',
    triggeredAt: '2026-11-23 07:00',
    escalationPolicy: 'Auto-approve if usage > 15 days/month and role valid',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Line Manager Approval', assignee: 'David Chen', status: 'Active' },
    ],
    identitySnapshot: {
      employeeNumber: 'EMP-10074',
      email: 'claire.brooks@identra-corp.io',
      location: 'London, UK (HQ)',
      contractType: 'Full-Time Permanent (FTE)',
      manager: 'David Chen',
      riskScore: 11,
      lastLogin: 'Today 10:02',
      activeGrantsCount: 8,
    },
    entitlementDetails: {
      description: 'Enterprise AI assistant SKU integrated into Excel, Teams, Outlook, and PowerPoint with tenant data boundary protection.',
      owner: 'AI Governance & Workplace IT',
      ownerRole: 'Entitlement Owner · M365 AI Licensing',
      sensitivity: 'Standard',
      grantedOn: '2026-02-01',
      lastUsed: 'Today 09:48 (24/30d active)',
      totalHolders: 96,
      nestedPermissions: [
        'Copilot in Excel & Financial Modeling',
        'Copilot in Teams Meeting Recaps',
        'Enterprise Graph Grounding (Scoped to User ACLs)',
      ],
    },
    risk: 'Low',
    usageSignal: 'Active 24 of last 30 days (Excel + Teams)',
    monthlyCost: 'R550/mo',
    aiRecommendation: 'Approve',
    reason: 'High daily adoption matching approved Finance Leadership role allocation.',
    decision: 'Pending',
  },
  {
    id: 'rev-ad-3',
    personId: 'p-sarah',
    identity: 'Sarah Mitchell',
    identityTitle: 'Financial Analyst · Joiner',
    department: 'Finance',
    accessType: 'AD Security Group',
    roleOrEntitlement: 'SG-Finance-Ledger-Readers',
    technicalId: 'CN=SG-Finance-Ledger-Readers,OU=Finance,DC=identra,DC=corp',
    parentBusinessRole: 'Business Role: Finance: Base Ledger Read',
    application: 'Active Directory',
    reviewer: 'Claire Vance',
    workflowType: 'Manager Approval',
    workflowCode: 'WF-REV-MGR-01',
    triggeredBy: 'Event: Day-1 Joiner Birthright Verification (BR-002)',
    triggeredAt: '2026-11-23 10:25',
    escalationPolicy: 'Remind manager after 5d; standard Day-1 attestation',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Line Manager Approval', assignee: 'Claire Vance', status: 'Active' },
    ],
    identitySnapshot: {
      employeeNumber: 'EMP-10841',
      email: 'sarah.mitchell@identra-corp.io',
      location: 'London, UK (HQ)',
      contractType: 'Full-Time Permanent (FTE)',
      manager: 'Claire Vance',
      riskScore: 14,
      lastLogin: 'Today 10:28',
      activeGrantsCount: 4,
    },
    entitlementDetails: {
      description: 'Read-only Active Directory security group provisioned via birthright policy BR-002 for EMEA Finance Operations analysts.',
      owner: 'Claire Vance',
      ownerRole: 'Entitlement Owner · Finance Operations',
      sensitivity: 'Standard',
      grantedOn: '2026-11-23',
      lastUsed: 'Today 10:31',
      totalHolders: 68,
      nestedPermissions: [
        'Read Access on \\\\fin-dfs\\GL-Reports',
        'SAP S/4HANA Base Ledger View Federation',
        'Finance SharePoint Workspace Member',
      ],
    },
    risk: 'Low',
    usageSignal: 'Provisioned via Day-1 HRIS birthright · Active today',
    aiRecommendation: 'Approve',
    reason: 'Standard birthright AD security group matching HR Finance job code; zero SoD conflicts.',
    decision: 'Pending',
  },
  {
    id: 'rev-1',
    personId: 'p-elena',
    roleId: 'r-ap',
    identity: 'Elena Vance',
    identityTitle: 'Treasury Operations Lead · Mover',
    department: 'Finance',
    accessType: 'Business Role',
    roleOrEntitlement: 'Finance: AP-Clerk (Legacy)',
    technicalId: 'SAP_ROLE: Z_FI_AP_VENDOR_CREATE',
    parentBusinessRole: 'Retained Legacy Role (Prior Dept: AP Ops)',
    application: 'SAP S/4HANA Finance',
    reviewer: 'David Chen',
    workflowType: 'SOX Control Owner Approval',
    workflowCode: 'WF-REV-SOX-09',
    triggeredBy: 'Event: SOX-SOD-402 Toxic Combination Alert (Mover Transfer)',
    triggeredAt: '2026-11-23 08:16',
    escalationPolicy: 'Mandatory 48h SOX remediation SLA; escalates to Controller Office',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'SOX Control Owner (Treasury)', assignee: 'David Chen', status: 'Active' },
      { step: 'Stage 2', approverRole: 'Application Owner (SAP S/4HANA)', assignee: 'ERP Governance Team', status: 'Queued' },
    ],
    identitySnapshot: {
      employeeNumber: 'EMP-10219',
      email: 'elena.vance@identra-corp.io',
      location: 'London, UK (HQ)',
      contractType: 'Full-Time Permanent (FTE)',
      manager: 'David Chen',
      riskScore: 86,
      lastLogin: 'Today 08:40',
      activeGrantsCount: 7,
    },
    entitlementDetails: {
      description: 'Accounts Payable business role granting SAP vendor master creation, invoice posting, and supplier bank detail updates.',
      owner: 'Controller Office',
      ownerRole: 'Business Role Owner · Financial Controls',
      sensitivity: 'Critical',
      grantedOn: '2024-03-14',
      lastUsed: '2026-11-09 (Pre-transfer)',
      totalHolders: 44,
      sodImpact: 'SOX-SOD-402 Breach: Mutually exclusive with Treasury: Payment Approver.',
      nestedPermissions: [
        'SAP T-Code XK01 / BP (Create & Modify Vendor Master)',
        'SAP T-Code FB60 (Post Vendor Invoices)',
        'SG-Finance-AP-Specialists (AD Security Group)',
      ],
    },
    risk: 'High',
    usageSignal: 'Conflicting SoD pair with Treasury: Payment Approver',
    aiRecommendation: 'Revoke',
    reason: 'Violates SOX-SOD-402 after transfer to Treasury Approvals; strip legacy vendor creation role.',
    decision: 'Pending',
  },
  {
    id: 'rev-3',
    nonHumanId: 'nh-deploy',
    identity: 'agent.release-copilot',
    identityTitle: 'Autonomous Release AI Agent',
    department: 'Engineering (AI)',
    accessType: 'AI Agent Grant',
    roleOrEntitlement: 'SNOWFLAKE:RAW_PII_SELECT',
    technicalId: 'GRANT SELECT ON SCHEMA PROD_PII.* TO ROLE AGENT_RELEASE',
    parentBusinessRole: 'Out-of-Band Direct Grant (Bypassed Approval)',
    application: 'Snowflake PII Lake',
    reviewer: 'Lucas Meyer',
    workflowType: 'Data Owner & SecOps Approval',
    workflowCode: 'WF-REV-AI-07',
    triggeredBy: 'Event: NHI-AI-209 Shadow AI Privilege Drift Detection',
    triggeredAt: '2026-11-23 09:05',
    escalationPolicy: 'Auto-contain & strip grant after 12h if unapproved',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Data Owner (Snowflake PII)', assignee: 'Lucas Meyer', status: 'Active' },
      { step: 'Stage 2', approverRole: 'AI / NHI Security Governance', assignee: 'Platform Security', status: 'Queued' },
    ],
    identitySnapshot: {
      employeeNumber: 'NHI-AI-0041',
      email: 'owner: priya.nair@identra-corp.io',
      location: 'Cloud · EU-West-1',
      contractType: 'Autonomous AI Agent (MCP)',
      manager: 'Priya Nair (Accountable Owner)',
      riskScore: 88,
      lastLogin: 'Today 10:15 (42 queries)',
      activeGrantsCount: 3,
    },
    entitlementDetails: {
      description: 'Direct unmasked SELECT privilege across all customer PII tables in Snowflake PROD_PII schema.',
      owner: 'Lucas Meyer',
      ownerRole: 'Data Owner · Enterprise Data Governance',
      sensitivity: 'Critical',
      grantedOn: '2026-11-21 (Out-of-band)',
      lastUsed: 'Today 10:15',
      totalHolders: 3,
      sodImpact: 'Violates NHI-AI-209 (AI Agent Raw PII Isolation) & GDPR Art. 32.',
      nestedPermissions: [
        'SELECT on PROD_PII.CUSTOMERS_UNMASKED',
        'SELECT on PROD_PII.PAYMENT_INSTRUMENTS',
        'Bypass Dynamic Masking Policy MASK_PII_STANDARD',
      ],
    },
    risk: 'High',
    usageSignal: '42 unmasked queries in last 24h · Outside CI/CD scope',
    aiRecommendation: 'Revoke',
    reason: 'Autonomous release bot holds direct PII read access violating NHI-AI-209 isolation policy.',
    decision: 'Pending',
  },
  {
    id: 'rev-5',
    personId: 'p-priya',
    roleId: 'r-k8s',
    identity: 'Priya Nair',
    identityTitle: 'Principal Platform Engineer',
    department: 'Engineering',
    accessType: 'Business Role',
    roleOrEntitlement: 'Prod K8s Operator (JIT)',
    technicalId: 'AWS_PERM_SET: arn:aws:sso:::permissionSet/k8s-jit-4h',
    parentBusinessRole: 'Business Role: Platform SRE Core',
    application: 'AWS Prod Vault',
    reviewer: 'Alex Carter',
    workflowType: 'Application Owner Approval',
    workflowCode: 'WF-REV-APP-05',
    triggeredBy: 'Scheduled Q4 Tier-0 Cloud JIT Eligibility Certification',
    triggeredAt: '2026-11-22 06:00',
    escalationPolicy: 'Suspend JIT eligibility after 14d SLA if uncertified',
    workflowStages: [
      { step: 'Stage 1', approverRole: 'Application Owner (AWS Prod Vault)', assignee: 'Alex Carter', status: 'Active' },
    ],
    identitySnapshot: {
      employeeNumber: 'EMP-10105',
      email: 'priya.nair@identra-corp.io',
      location: 'London, UK (HQ)',
      contractType: 'Full-Time Permanent (FTE)',
      manager: 'Alex Carter',
      riskScore: 16,
      lastLogin: 'Yesterday 18:15',
      activeGrantsCount: 6,
    },
    entitlementDetails: {
      description: 'Zero-standing-privilege business role granting time-bound 4-hour EKS production cluster operator elevation via AWS IAM Identity Center.',
      owner: 'Alex Carter',
      ownerRole: 'Application Owner · Cloud Infrastructure',
      sensitivity: 'High',
      grantedOn: '2023-09-01',
      lastUsed: 'Yesterday 18:15 (4h JIT session)',
      totalHolders: 18,
      nestedPermissions: [
        'AWS SSO Permission Set: EKS-Prod-Operator (4h TTL)',
        'CloudWatch & Audit Session Recording Required',
        'Break-Glass Ticket Correlation (Jira / ServiceNow)',
      ],
    },
    risk: 'Low',
    usageSignal: 'Time-bound 4h JIT elevation · 0 standing privileges',
    aiRecommendation: 'Approve',
    reason: 'Compliant ephemeral JIT role with full audit trail and manager sign-off.',
    decision: 'Pending',
  },
];

export const INITIAL_PROVISIONING_JOBS: DemoProvisioningJob[] = [
  {
    id: 'job-101',
    jobCode: 'PRV-9041',
    identity: 'Mark Wilson',
    identityEmail: 'mark.wilson@ext-audit.io',
    entitlementOrRole: 'AD Account · Disable & Move OU',
    application: 'Active Directory',
    operation: 'Update',
    status: 'Completed',
    triggeredBy: 'Workday Leaver Off-board',
    timestamp: '10:18:04',
    durationMs: 312,
    mappings: [
      { attribute: 'accountStatus', before: 'Enabled', after: 'Disabled', rule: 'JML.Leaver.DisableAD' },
      { attribute: 'userAccountControl', before: '512', after: '514', rule: 'AD.UAC.ACCOUNTDISABLE' },
      {
        attribute: 'distinguishedName',
        before: 'CN=Mark Wilson,OU=Contractors,DC=identra,DC=corp',
        after: 'CN=Mark Wilson,OU=DisabledUsers,DC=identra,DC=corp',
        rule: 'AD.OU.MoveOnOffboard',
      },
    ],
  },
  {
    id: 'job-102',
    jobCode: 'PRV-9042',
    identity: 'Rachel Grant',
    identityEmail: 'rachel.grant@identra-corp.io',
    entitlementOrRole: 'AD Account · Disable & Hide GAL',
    application: 'Active Directory',
    operation: 'Update',
    status: 'Completed',
    triggeredBy: 'Workday Termination Sync',
    timestamp: '09:42:19',
    durationMs: 284,
    mappings: [
      { attribute: 'accountStatus', before: 'Enabled', after: 'Disabled', rule: 'JML.Leaver.DisableAD' },
      { attribute: 'userAccountControl', before: '512', after: '514', rule: 'AD.UAC.ACCOUNTDISABLE' },
      { attribute: 'msExchHideFromAddressLists', before: 'FALSE', after: 'TRUE', rule: 'AD.Exchange.HideLeaver' },
    ],
  },
  {
    id: 'job-103',
    jobCode: 'PRV-9043',
    identity: 'Hannah Brooks',
    identityEmail: 'hannah.brooks@identra-corp.io',
    entitlementOrRole: 'AD Account + SG-Platform-Engineering',
    application: 'Active Directory',
    operation: 'Create',
    status: 'Simulation Mode',
    triggeredBy: 'HRIS Pre-Hire Joiner (Starts Mon)',
    timestamp: '10:26:50',
    durationMs: null,
    mappings: [
      { attribute: 'sAMAccountName', before: null, after: 'hbrooks', rule: 'AD.Naming.FirstInitialLast' },
      { attribute: 'accountStatus', before: null, after: 'Enabled', rule: 'JML.Joiner.EnableOnStart' },
      { attribute: 'department', before: null, after: 'Engineering', rule: 'HRIS.DeptSync' },
      { attribute: 'memberOf', before: null, after: 'CN=SG-Platform-Engineering,OU=Eng,DC=identra,DC=corp', rule: 'RBAC.BirthrightGroup' },
    ],
  },
  {
    id: 'job-104',
    jobCode: 'PRV-9044',
    identity: 'Sarah Mitchell',
    identityEmail: 'sarah.mitchell@identra-corp.io',
    entitlementOrRole: 'Microsoft 365 E5 License (SPE_E5)',
    application: 'Microsoft Entra ID',
    operation: 'Update',
    status: 'Simulation Mode',
    triggeredBy: 'Finance Joiner License Policy',
    timestamp: '10:25:12',
    durationMs: null,
    mappings: [
      { attribute: 'assignedLicenses', before: 'None', after: 'Microsoft 365 E5 (SPE_E5)', rule: 'Entra.License.FinanceTier' },
      { attribute: 'usageLocation', before: null, after: 'GB', rule: 'HRIS.CountryCode' },
      { attribute: 'accountEnabled', before: 'false', after: 'true', rule: 'JML.Joiner.ActivateCloud' },
    ],
  },
  {
    id: 'job-105',
    jobCode: 'PRV-9045',
    identity: 'John Davies',
    identityEmail: 'john.davies@identra-corp.io',
    entitlementOrRole: 'License Downgrade · M365 E5 → E3',
    application: 'Microsoft Entra ID',
    operation: 'Update',
    status: 'Simulation Mode',
    triggeredBy: 'Access Review License Reclamation',
    timestamp: '10:12:33',
    durationMs: null,
    mappings: [
      { attribute: 'assignedLicenses', before: 'Microsoft 365 E5 (SPE_E5)', after: 'Microsoft 365 E3 (SPE_E3)', rule: 'Entra.License.ReclaimUnusedE5' },
      { attribute: 'department', before: 'Sales', after: 'Enterprise Sales EMEA', rule: 'HRIS.OrgRealign' },
    ],
  },
  {
    id: 'job-106',
    jobCode: 'PRV-9046',
    identity: 'Elena Vance',
    identityEmail: 'elena.vance@identra-corp.io',
    entitlementOrRole: 'Role Swap · AP-Clerk → Payment Approver',
    application: 'SAP S/4HANA Finance',
    operation: 'Update',
    status: 'Simulation Mode',
    triggeredBy: 'SOX-SOD-402 Auto-Remediation',
    timestamp: '10:05:41',
    durationMs: null,
    mappings: [
      { attribute: 'sapRole', before: 'Z_FI_AP_VENDOR_CREATE', after: 'Removed', rule: 'SoD.StripConflictingLegacy' },
      { attribute: 'sapRole', before: 'None', after: 'Z_TR_PAYMENT_APPROVER', rule: 'RBAC.MoverGrant' },
    ],
  },
  {
    id: 'job-107',
    jobCode: 'PRV-9047',
    identity: 'Mark Wilson',
    identityEmail: 'mark.wilson@ext-audit.io',
    entitlementOrRole: 'AWS IAM Orphan Access Key (AKIA...9F2A)',
    application: 'AWS Prod Vault',
    operation: 'Delete',
    status: 'Simulation Mode',
    triggeredBy: 'Orphan Key Reconciliation',
    timestamp: '09:58:17',
    durationMs: null,
    mappings: [
      { attribute: 'iamAccessKeyState', before: 'Active (AKIA...9F2A)', after: 'Deleted', rule: 'Orphan.PurgeDirectKey' },
      { attribute: 'accountStatus', before: 'Active', after: 'Deleted', rule: 'JML.Leaver.DeleteCloudAccount' },
    ],
  },
  {
    id: 'job-108',
    jobCode: 'PRV-9048',
    identity: 'James Thornton',
    identityEmail: 'james.thornton@identra-corp.io',
    entitlementOrRole: 'Revoke SG-Domain-Tier1-ServerAdmins',
    application: 'Active Directory',
    operation: 'Update',
    status: 'Failed',
    triggeredBy: 'Privileged Group Revocation',
    timestamp: '09:31:08',
    durationMs: 1420,
    errorMessage: 'LDAP_INSUFFICIENT_ACCESS: Protected AdminSDHolder object requires Tier-0 connector elevation.',
    mappings: [
      { attribute: 'memberOf', before: 'CN=SG-Domain-Tier1-ServerAdmins,OU=Infra,DC=identra,DC=corp', after: 'Removed', rule: 'Attestation.RevokeUnusedAdmin' },
    ],
  },
  {
    id: 'job-109',
    jobCode: 'PRV-9049',
    identity: 'Claire Brooks',
    identityEmail: 'claire.brooks@identra-corp.io',
    entitlementOrRole: 'Microsoft 365 Copilot License Add-On',
    application: 'Microsoft Entra ID',
    operation: 'Update',
    status: 'Completed',
    triggeredBy: 'Self-Service Catalog Approval',
    timestamp: '09:14:22',
    durationMs: 418,
    mappings: [
      { attribute: 'assignedLicenses', before: 'Microsoft 365 E5 (SPE_E5)', after: 'Microsoft 365 E5 + Copilot', rule: 'Catalog.ApproveCopilotSKU' },
    ],
  },
  {
    id: 'job-110',
    jobCode: 'PRV-9050',
    identity: 'agent.release-copilot',
    identityEmail: 'agent.release-copilot@nhi.identra.io',
    entitlementOrRole: 'Revoke Role RAW_PII_READER',
    application: 'Snowflake PII Lake',
    operation: 'Delete',
    status: 'Failed',
    triggeredBy: 'NHI-AI-209 Containment Policy',
    timestamp: '08:55:49',
    durationMs: 2105,
    errorMessage: 'SNOWFLAKE_LOCK_TIMEOUT: Active query session #8821 held role lock during REVOKE.',
    mappings: [
      { attribute: 'grantedRole', before: 'RAW_PII_READER', after: 'Deleted', rule: 'NHI.RevokeShadowPII' },
      { attribute: 'accountStatus', before: 'Active', after: 'Disabled', rule: 'Incident.SuspendAgent' },
    ],
  },
  {
    id: 'job-111',
    jobCode: 'PRV-9051',
    identity: 'Sarah Mitchell',
    identityEmail: 'sarah.mitchell@identra-corp.io',
    entitlementOrRole: 'AD Account + SG-Finance-Ledger-Readers',
    application: 'Active Directory',
    operation: 'Create',
    status: 'Completed',
    triggeredBy: 'Workday Day-1 Joiner',
    timestamp: '08:24:09',
    durationMs: 365,
    mappings: [
      { attribute: 'sAMAccountName', before: null, after: 'smitchell', rule: 'AD.Naming.FirstInitialLast' },
      { attribute: 'accountStatus', before: null, after: 'Enabled', rule: 'JML.Joiner.EnableAD' },
      { attribute: 'department', before: null, after: 'Finance', rule: 'HRIS.DeptSync' },
      { attribute: 'memberOf', before: null, after: 'CN=SG-Finance-Ledger-Readers,OU=Finance,DC=identra,DC=corp', rule: 'RBAC.BirthrightGroup' },
    ],
  },
  {
    id: 'job-112',
    jobCode: 'PRV-9052',
    identity: 'Daniel Foster',
    identityEmail: 'daniel.foster@identra-corp.io',
    entitlementOrRole: 'AD Account · Temporary LOA Disable',
    application: 'Active Directory',
    operation: 'Update',
    status: 'Completed',
    triggeredBy: 'Leave of Absence Policy',
    timestamp: '07:50:11',
    durationMs: 249,
    mappings: [
      { attribute: 'accountStatus', before: 'Enabled', after: 'Disabled', rule: 'HRIS.LOA.TemporaryDisable' },
      { attribute: 'userAccountControl', before: '512', after: '514', rule: 'AD.UAC.ACCOUNTDISABLE' },
    ],
  },
];

export const INITIAL_IMPORT_RUNS: DemoImportRun[] = [
  {
    id: 'imp-4108',
    runCode: 'IMP-4108',
    system: 'Microsoft Entra ID',
    connector: 'Microsoft Graph API v1.0',
    mode: 'Scheduled Delta',
    triggeredAt: '2026-11-24 07:45:00',
    completedAt: '2026-11-24 07:46:14',
    duration: '1m 14s',
    status: 'Failed',
    recordsRead: 1284,
    created: 0,
    updated: 0,
    warnings: 0,
    errors: 1,
    errorCode: 'GRAPH_AUTH_EXPIRED (HTTP 401 Unauthorized)',
    errorMessage:
      'App registration client secret for tenant identra-corp.onmicrosoft.com expired at 07:30 UTC while fetching /v1.0/subscribedSkus delta page #3. Import aborted safely without modifying existing identities.',
    errorEndpoint: 'GET https://graph.microsoft.com/v1.0/users/delta?$select=userPrincipalName,assignedLicenses,accountEnabled',
    recommendedFix:
      'Rotate Entra ID connector credential in Vault or switch connector auth to Federated Managed Identity, then re-run import.',
    stages: [
      { stage: '1. Connector Handshake', duration: '0.4s', status: 'Passed', detail: 'Connected to tenant identra-corp.onmicrosoft.com' },
      { stage: '2. Extract Users & Licenses', duration: '1m 13s', status: 'Failed', detail: 'HTTP 401 Unauthorized on page #3 — token renewal rejected (expired client secret)' },
      { stage: '3. Schema & Identity Match', duration: '0.0s', status: 'Failed', detail: 'Skipped — extract stage failed; staged delta rolled back cleanly' },
      { stage: '4. Process++ Trigger', duration: '0.0s', status: 'Failed', detail: 'Aborted to protect existing desired-state graph' },
    ],
  },
  {
    id: 'imp-4107',
    runCode: 'IMP-4107',
    system: 'Workday HRIS (HR)',
    connector: 'Workday RaaS + Event Feed v42',
    mode: 'Scheduled Delta',
    triggeredAt: '2026-11-24 07:30:00',
    completedAt: '2026-11-24 07:30:42',
    duration: '42s',
    status: 'Completed',
    recordsRead: 6732,
    created: 3,
    updated: 14,
    warnings: 0,
    errors: 0,
    stages: [
      { stage: '1. Connector Handshake', duration: '0.6s', status: 'Passed', detail: 'Authenticated via OAuth2 ISU_IDENTRA_SYNC' },
      { stage: '2. Extract Worker Delta', duration: '18.4s', status: 'Passed', detail: 'Fetched 6,732 authoritative worker & contract records' },
      { stage: '3. Schema & Identity Match', duration: '14.2s', status: 'Passed', detail: 'Matched 100% by employeeNumber; 3 Joiners, 12 Movers, 1 Leaver detected' },
      { stage: '4. Process++ Trigger', duration: '8.8s', status: 'Passed', detail: 'Emitted 16 JML lifecycle events to Provisioning Engine' },
    ],
  },
  {
    id: 'imp-4106',
    runCode: 'IMP-4106',
    system: 'Active Directory',
    connector: 'LDAPS Global Catalog Bridge',
    mode: 'Scheduled Delta',
    triggeredAt: '2026-11-24 07:15:00',
    completedAt: '2026-11-24 07:16:08',
    duration: '1m 08s',
    status: 'Completed',
    recordsRead: 7834,
    created: 2,
    updated: 29,
    warnings: 0,
    errors: 0,
    stages: [
      { stage: '1. Connector Handshake', duration: '0.3s', status: 'Passed', detail: 'TLS 1.3 bind to dc01.identra.corp:636 succeeded' },
      { stage: '2. Extract Accounts & Groups', duration: '34.1s', status: 'Passed', detail: 'Read 6,732 user accounts, 1,102 service accounts, 737 security groups' },
      { stage: '3. Reconciliation Diff', duration: '26.0s', status: 'Passed', detail: 'Verified uSNChanged watermark; 29 attribute updates reconciled' },
      { stage: '4. Commit Snapshot', duration: '7.6s', status: 'Passed', detail: 'Updated AD directory state in IDENTRA identity graph' },
    ],
  },
  {
    id: 'imp-4105',
    runCode: 'IMP-4105',
    system: 'Microsoft Entra ID',
    connector: 'Microsoft Graph API v1.0',
    mode: 'Scheduled Delta',
    triggeredAt: '2026-11-24 06:45:00',
    completedAt: '2026-11-24 06:45:51',
    duration: '51s',
    status: 'Completed',
    recordsRead: 6732,
    created: 1,
    updated: 8,
    warnings: 0,
    errors: 0,
    stages: [
      { stage: '1. Connector Handshake', duration: '0.5s', status: 'Passed', detail: 'Graph API token acquired for identra-corp.onmicrosoft.com' },
      { stage: '2. Extract Users & Licenses', duration: '28.9s', status: 'Passed', detail: 'Synced 6,732 Entra accounts and 12 subscribed license SKUs' },
      { stage: '3. Reconciliation Diff', duration: '16.4s', status: 'Passed', detail: 'Detected 2 unused M365 E5 licenses for Access Review campaign' },
      { stage: '4. Commit Snapshot', duration: '5.2s', status: 'Passed', detail: 'Entra ID delta committed cleanly' },
    ],
  },
  {
    id: 'imp-4104',
    runCode: 'IMP-4104',
    system: 'Active Directory',
    connector: 'LDAPS Global Catalog Bridge',
    mode: 'Nightly Full',
    triggeredAt: '2026-11-24 02:00:00',
    completedAt: '2026-11-24 02:04:36',
    duration: '4m 36s',
    status: 'Completed with Warnings',
    recordsRead: 7834,
    created: 0,
    updated: 41,
    warnings: 2,
    errors: 0,
    recommendedFix:
      'Review 2 unmatched direct AD accounts in OU=Contractors that have no active Workday worker ID.',
    stages: [
      { stage: '1. Connector Handshake', duration: '0.4s', status: 'Passed', detail: 'TLS 1.3 bind to dc01.identra.corp:636 succeeded' },
      { stage: '2. Full Directory Scan', duration: '2m 48s', status: 'Passed', detail: 'Scanned all 7,834 objects and nested group memberships' },
      { stage: '3. Correlation & Orphan Check', duration: '1m 22s', status: 'Warning', detail: '2 legacy contractor accounts lacked matching HR employeeNumber; flagged as Orphan Drift' },
      { stage: '4. Commit Snapshot', duration: '25.6s', status: 'Passed', detail: 'Full AD snapshot committed and alerts sent to Governance Health' },
    ],
  },
  {
    id: 'imp-4103',
    runCode: 'IMP-4103',
    system: 'Workday HRIS (HR)',
    connector: 'Workday RaaS + Event Feed v42',
    mode: 'Nightly Full',
    triggeredAt: '2026-11-24 01:30:00',
    completedAt: '2026-11-24 01:32:19',
    duration: '2m 19s',
    status: 'Completed',
    recordsRead: 6732,
    created: 0,
    updated: 19,
    warnings: 0,
    errors: 0,
    stages: [
      { stage: '1. Connector Handshake', duration: '0.7s', status: 'Passed', detail: 'Authenticated via OAuth2 ISU_IDENTRA_SYNC' },
      { stage: '2. Full Organization & Worker Load', duration: '1m 21s', status: 'Passed', detail: 'Loaded 6,732 workers, 18 Org Units, 5 Cost Centers, 3 Legal Entities' },
      { stage: '3. Schema & Context Sync', duration: '44.0s', status: 'Passed', detail: 'Validated start/end dates and refreshed active Process++ Contexts' },
      { stage: '4. Commit Snapshot', duration: '13.3s', status: 'Passed', detail: 'Authoritative HR baseline verified at 100% integrity' },
    ],
  },
];

export const INITIAL_DEMO_POLICIES: DemoPolicy[] = [
  {
    id: 'pol-sod-402',
    code: 'SOX-SOD-402',
    name: 'Forbid Vendor Creation + Wire Approval',
    domain: '03 · Business Alignment',
    description:
      'Prevents any identity from simultaneously holding Finance: AP-Clerk and Treasury: Payment Approver.',
    severity: 'Critical',
    enforced: true,
    violations: 1,
    affectedIdentity: 'Elena Vance',
  },
  {
    id: 'pol-jml-001',
    code: 'JML-OFF-001',
    name: 'Zero-Orphan Leaver Deprovisioning',
    domain: '01 · Identity Lifecycle',
    description:
      'Automatically revokes all IdP sessions, business roles, and direct cloud keys within 60 seconds of HR termination.',
    severity: 'Critical',
    enforced: true,
    violations: 1,
    affectedIdentity: 'Mark Wilson (Contractor)',
  },
  {
    id: 'pol-ai-209',
    code: 'NHI-AI-209',
    name: 'AI Agent Raw PII Isolation',
    domain: '06 · Non-Human Governance',
    description:
      'Blocks autonomous agents and MCP bots from acquiring direct unmasked reads on Tier-0 PII stores.',
    severity: 'High',
    enforced: true,
    violations: 1,
    affectedIdentity: 'agent.release-copilot',
  },
  {
    id: 'pol-jit-118',
    code: 'ACC-JIT-118',
    name: 'Zero Standing Production Admin',
    domain: '02 · Access Management',
    description:
      'Enforces maximum 4-hour ephemeral elevation with manager sign-off for AWS Prod Vault and K8s admin roles.',
    severity: 'High',
    enforced: true,
    violations: 0,
  },
];

export const INITIAL_DEMO_AUDIT: DemoAuditEntry[] = [
  {
    id: 'aud-1',
    time: '10:24:12',
    actor: 'Process++ JML Engine',
    processTag: 'ONBOARD',
    tone: 'emerald',
    action: 'Provisioned birthright Finance roles from Workday trigger',
    target: 'Sarah Mitchell',
  },
  {
    id: 'aud-2',
    time: '09:47:05',
    actor: 'Process++ Role Engine',
    processTag: 'CHANGE',
    tone: 'sky',
    action: 'Updated Sales CRM roles following regional transfer',
    target: 'John Davies',
  },
  {
    id: 'aud-3',
    time: '08:32:44',
    actor: 'Process++ Off-board',
    processTag: 'OFF-BOARD',
    tone: 'amber',
    action: 'Deactivated contractor IdP profile; flagged 1 direct AWS key',
    target: 'Mark Wilson',
  },
  {
    id: 'aud-4',
    time: '08:15:19',
    actor: 'SOX-SOD-402 Monitor',
    processTag: 'SOD-ALERT',
    tone: 'rose',
    action: 'Detected toxic role overlap: AP-Clerk + Payment Approver',
    target: 'Elena Vance',
  },
];

/* -------------------------------------------------------------------------- */
/* Birthrights Rules Engine (Attributes, Contexts & Multi-Context Logic)      */
/* -------------------------------------------------------------------------- */

export type BirthrightScopeMode =
  | 'Identity Attributes'
  | 'Single Context'
  | 'Context Combination'
  | 'Hybrid (Attributes + Contexts)';

export type BirthrightAttributeField =
  | 'type'
  | 'contractType'
  | 'department'
  | 'companyName'
  | 'orgUnitName'
  | 'costCenterCode'
  | 'location'
  | 'title'
  | 'jmlStatus'
  | 'sourceSystem';

export type BirthrightAttributeOperator = 'equals' | 'not_equals' | 'contains';

export interface BirthrightAttributeCondition {
  id: string;
  field: BirthrightAttributeField;
  operator: BirthrightAttributeOperator;
  value: string;
}

export type BirthrightContextOperator = 'ALL_OF' | 'ANY_OF' | 'NONE_OF';

export interface BirthrightContextClause {
  id: string;
  operator: BirthrightContextOperator;
  contextIds: string[];
}

export interface BirthrightGrant {
  id: string;
  kind: 'Business Role' | 'Entitlement' | 'Application Account' | 'License SKU';
  name: string;
  targetSystem: string;
}

export interface DemoBirthrightRule {
  id: string;
  code: string;
  name: string;
  description: string;
  scopeMode: BirthrightScopeMode;
  combinator: 'ALL' | 'ANY';
  attributeConditions: BirthrightAttributeCondition[];
  contextClauses: BirthrightContextClause[];
  grants: BirthrightGrant[];
  provisioningMode: 'Auto-Provision' | 'Simulation Mode';
  autoRevokeOnExit: boolean;
  status: 'Active' | 'Paused';
  owner: string;
  lastEvaluated: string;
}

export const BIRTHRIGHT_ATTRIBUTE_OPTIONS: {
  field: BirthrightAttributeField;
  label: string;
  sampleValues: string[];
}[] = [
  {
    field: 'type',
    label: 'Identity Type',
    sampleValues: ['Employee', 'Contractor'],
  },
  {
    field: 'contractType',
    label: 'Contract Type',
    sampleValues: ['Full-Time Permanent (FTE)', 'Fixed-Term External Contractor (90d)'],
  },
  {
    field: 'department',
    label: 'Department',
    sampleValues: [
      'Corporate Finance & Treasury',
      'Global Revenue & Enterprise Sales',
      'Platform & Cloud Engineering',
      'Data Governance & Analytics',
      'External Assurance & Contractors',
    ],
  },
  {
    field: 'companyName',
    label: 'Legal Entity / Company',
    sampleValues: [
      'IDENTRA Global Holdings Ltd',
      'IDENTRA North America Inc.',
      'Vanguard External Assurance LLP',
    ],
  },
  {
    field: 'orgUnitName',
    label: 'Org Unit',
    sampleValues: [
      'EMEA Finance Operations',
      'EMEA Treasury & Payments',
      'Enterprise Sales EMEA',
      'Platform SRE & Cloud Infra',
      'Enterprise Data Stewardship',
      'External Contractors & Auditors',
    ],
  },
  {
    field: 'costCenterCode',
    label: 'Cost Center',
    sampleValues: ['CC-4100-FIN', 'CC-2200-REV', 'CC-3010-ENG', 'CC-3400-DAT', 'CC-9001-EXT'],
  },
  {
    field: 'location',
    label: 'Location',
    sampleValues: ['London, UK (HQ)', 'New York, US', 'Zurich, CH', 'Remote (UK / B2B)'],
  },
  {
    field: 'title',
    label: 'Job Title',
    sampleValues: [
      'Financial Analyst',
      'Enterprise Account Director',
      'Treasury Operations Lead',
      'Principal Platform Engineer',
      'Head of Data Governance',
      'External Cloud Auditor',
    ],
  },
  {
    field: 'jmlStatus',
    label: 'JML Lifecycle Status',
    sampleValues: ['Active', 'Joiner', 'Mover', 'Leaver', 'Suspended'],
  },
  {
    field: 'sourceSystem',
    label: 'Authoritative Source',
    sampleValues: ['Workday HRIS Core', 'B2B Partner Lifecycle Portal'],
  },
];

export function evaluateBirthrightForPerson(
  rule: DemoBirthrightRule,
  person: DemoPerson
): boolean {
  const attrResults = rule.attributeConditions.map((cond) => {
    const raw = String(person[cond.field] ?? '').toLowerCase();
    const expected = cond.value.trim().toLowerCase();
    if (!expected) return true;
    if (cond.operator === 'equals') return raw === expected;
    if (cond.operator === 'not_equals') return raw !== expected;
    return raw.includes(expected);
  });

  const ctxResults = rule.contextClauses
    .filter((clause) => clause.contextIds.length > 0)
    .map((clause) => {
      const personContexts = new Set(person.contextRefIds);
      if (clause.operator === 'ALL_OF') {
        return clause.contextIds.every((id) => personContexts.has(id));
      }
      if (clause.operator === 'ANY_OF') {
        return clause.contextIds.some((id) => personContexts.has(id));
      }
      return clause.contextIds.every((id) => !personContexts.has(id));
    });

  const allChecks = [...attrResults, ...ctxResults];
  if (allChecks.length === 0) return false;
  return rule.combinator === 'ALL'
    ? allChecks.every(Boolean)
    : allChecks.some(Boolean);
}

export function evaluateBirthrightMatches(
  rule: DemoBirthrightRule,
  people: DemoPerson[]
): DemoPerson[] {
  return people.filter((person) => evaluateBirthrightForPerson(rule, person));
}

export const INITIAL_DEMO_BIRTHRIGHTS: DemoBirthrightRule[] = [
  {
    id: 'br-001',
    code: 'BR-001',
    name: 'Global FTE Day-1 Enterprise Baseline',
    description:
      'Automatically provisions core SSO, Active Directory account, and Microsoft 365 E3 for all non-suspended permanent employees across IDENTRA legal entities.',
    scopeMode: 'Identity Attributes',
    combinator: 'ALL',
    attributeConditions: [
      { id: 'ac-1', field: 'type', operator: 'equals', value: 'Employee' },
      { id: 'ac-2', field: 'companyName', operator: 'contains', value: 'IDENTRA' },
      { id: 'ac-3', field: 'jmlStatus', operator: 'not_equals', value: 'Suspended' },
    ],
    contextClauses: [],
    grants: [
      { id: 'g-1', kind: 'Business Role', name: 'Corporate SSO Standard', targetSystem: 'Okta Workforce Cloud' },
      { id: 'g-2', kind: 'Application Account', name: 'AD Standard User (OU=Users)', targetSystem: 'Active Directory' },
      { id: 'g-3', kind: 'License SKU', name: 'Microsoft 365 E3 (SPE_E3)', targetSystem: 'Microsoft Entra ID' },
    ],
    provisioningMode: 'Auto-Provision',
    autoRevokeOnExit: true,
    status: 'Active',
    owner: 'Identity Operations',
    lastEvaluated: '2m ago',
  },
  {
    id: 'br-002',
    code: 'BR-002',
    name: 'EMEA Finance Operations Context Birthright',
    description:
      'Grants read-only SAP S/4HANA general ledger access and Finance AD security groups whenever an identity holds the Primary Employment · Finance UK context.',
    scopeMode: 'Single Context',
    combinator: 'ALL',
    attributeConditions: [],
    contextClauses: [
      { id: 'cc-1', operator: 'ALL_OF', contextIds: ['ctx-fin-uk-fte'] },
    ],
    grants: [
      { id: 'g-4', kind: 'Business Role', name: 'Finance: Base Ledger Read', targetSystem: 'SAP S/4HANA Finance' },
      { id: 'g-5', kind: 'Entitlement', name: 'SG-Finance-Ledger-Readers', targetSystem: 'Active Directory' },
      { id: 'g-6', kind: 'Application Account', name: 'SAP Dialog User (Read-Only)', targetSystem: 'SAP S/4HANA Finance' },
    ],
    provisioningMode: 'Auto-Provision',
    autoRevokeOnExit: true,
    status: 'Active',
    owner: 'Claire Vance',
    lastEvaluated: '4m ago',
  },
  {
    id: 'br-003',
    code: 'BR-003',
    name: 'Tier-0 Technical & Data Steward Security Pack',
    description:
      'Applies phishing-resistant FIDO2 authentication, GitHub Enterprise access, and Vault read-only audit telemetry to identities holding either SRE JIT or PII Stewardship contexts.',
    scopeMode: 'Context Combination',
    combinator: 'ALL',
    attributeConditions: [],
    contextClauses: [
      { id: 'cc-2', operator: 'ANY_OF', contextIds: ['ctx-sre-jit', 'ctx-data-steward'] },
      { id: 'cc-3', operator: 'NONE_OF', contextIds: ['ctx-ext-audit'] },
    ],
    grants: [
      { id: 'g-7', kind: 'Entitlement', name: 'Okta FIDO2 Phishing-Resistant Policy', targetSystem: 'Okta Workforce Cloud' },
      { id: 'g-8', kind: 'Application Account', name: 'GitHub Enterprise SSO Member', targetSystem: 'GitHub Enterprise' },
      { id: 'g-9', kind: 'Entitlement', name: 'VAULT:AUDIT_TELEMETRY_READ', targetSystem: 'AWS Prod Vault' },
    ],
    provisioningMode: 'Auto-Provision',
    autoRevokeOnExit: true,
    status: 'Active',
    owner: 'Alex Carter',
    lastEvaluated: '1m ago',
  },
  {
    id: 'br-004',
    code: 'BR-004',
    name: 'Dual-Context Treasury Transfer Quarantine',
    description:
      'Detects identities simultaneously holding both active Treasury Wire Signer and expired Legacy AP Ops contexts, applying temporary dual-control read-only guardrails until SoD is cleared.',
    scopeMode: 'Context Combination',
    combinator: 'ALL',
    attributeConditions: [],
    contextClauses: [
      { id: 'cc-4', operator: 'ALL_OF', contextIds: ['ctx-treasury-emea', 'ctx-legacy-ap'] },
    ],
    grants: [
      { id: 'g-10', kind: 'Entitlement', name: 'SOX-402 Dual-Control Review Hold', targetSystem: 'SAP S/4HANA Finance' },
      { id: 'g-11', kind: 'Entitlement', name: 'Treasury Wire Approval Step-Up MFA', targetSystem: 'Okta Workforce Cloud' },
    ],
    provisioningMode: 'Simulation Mode',
    autoRevokeOnExit: true,
    status: 'Active',
    owner: 'David Chen',
    lastEvaluated: 'Just now',
  },
  {
    id: 'br-005',
    code: 'BR-005',
    name: 'London HQ Finance M365 E5 & Analytics Uplift',
    description:
      'Combines location and cost center identity attributes with active EMEA Finance or Treasury contexts to automatically assign Microsoft 365 E5 compliance licensing.',
    scopeMode: 'Hybrid (Attributes + Contexts)',
    combinator: 'ALL',
    attributeConditions: [
      { id: 'ac-4', field: 'location', operator: 'equals', value: 'London, UK (HQ)' },
      { id: 'ac-5', field: 'costCenterCode', operator: 'equals', value: 'CC-4100-FIN' },
    ],
    contextClauses: [
      { id: 'cc-5', operator: 'ANY_OF', contextIds: ['ctx-fin-uk-fte', 'ctx-treasury-emea'] },
    ],
    grants: [
      { id: 'g-12', kind: 'License SKU', name: 'Microsoft 365 E5 (SPE_E5)', targetSystem: 'Microsoft Entra ID' },
      { id: 'g-13', kind: 'Entitlement', name: 'SAP:FIORI_ANALYTICS_VIEWER', targetSystem: 'SAP S/4HANA Finance' },
    ],
    provisioningMode: 'Auto-Provision',
    autoRevokeOnExit: true,
    status: 'Active',
    owner: 'David Chen',
    lastEvaluated: '3m ago',
  },
  {
    id: 'br-006',
    code: 'BR-006',
    name: 'External B2B Contractor Restricted Sandbox',
    description:
      'Isolates external contractors sourced from the B2B Partner Lifecycle Portal into quarantined OU=Contractors with strict 90-day auto-expiry.',
    scopeMode: 'Identity Attributes',
    combinator: 'ALL',
    attributeConditions: [
      { id: 'ac-6', field: 'type', operator: 'equals', value: 'Contractor' },
      { id: 'ac-7', field: 'sourceSystem', operator: 'equals', value: 'B2B Partner Lifecycle Portal' },
    ],
    contextClauses: [],
    grants: [
      { id: 'g-14', kind: 'Application Account', name: 'Entra B2B Guest (#EXT#)', targetSystem: 'Microsoft Entra ID' },
      { id: 'g-15', kind: 'Entitlement', name: 'AD OU=Contractors Restricted Policy', targetSystem: 'Active Directory' },
    ],
    provisioningMode: 'Auto-Provision',
    autoRevokeOnExit: true,
    status: 'Active',
    owner: 'Priya Nair',
    lastEvaluated: '6m ago',
  },
];

/* -------------------------------------------------------------------------- */
/* Target Accounts & Orphaned Account Inventory (Reporting)                   */
/* -------------------------------------------------------------------------- */

export type AccountCorrelationState = 'Correlated' | 'Orphaned' | 'Disabled (Leaver)';

export interface DemoTargetAccount {
  id: string;
  accountName: string;
  application: string;
  accountType: 'Human' | 'Contractor' | 'Service Account' | 'AI Agent' | 'API Token';
  personId?: string;
  correlatedIdentity: string | null;
  correlationState: AccountCorrelationState;
  accountStatus: 'Enabled' | 'Disabled' | 'Quarantined';
  privileged: boolean;
  lastLogin: string;
  daysInactive: number;
  orphanReason?: string;
  riskScore: number;
  rawAttributes?: Record<string, string | null>;
}

export const INITIAL_DEMO_ACCOUNTS: DemoTargetAccount[] = [
  {
    id: 'acc-1',
    accountName: 'smitchell@corp.identra.net',
    application: 'Active Directory',
    accountType: 'Human',
    personId: 'p-sarah',
    correlatedIdentity: 'Sarah Mitchell',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: 'Today 10:28',
    daysInactive: 0,
    riskScore: 10,
  },
  {
    id: 'acc-2',
    accountName: 'SAP_SMITCHELL',
    application: 'SAP S/4HANA Finance',
    accountType: 'Human',
    personId: 'p-sarah',
    correlatedIdentity: 'Sarah Mitchell',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: 'Today 10:31',
    daysInactive: 0,
    riskScore: 12,
  },
  {
    id: 'acc-3',
    accountName: 'jdavies@corp.identra.net',
    application: 'Microsoft Entra ID',
    accountType: 'Human',
    personId: 'p-john',
    correlatedIdentity: 'John Davies',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: 'Today 09:50',
    daysInactive: 0,
    riskScore: 22,
  },
  {
    id: 'acc-4',
    accountName: 'SAP_EVANCE',
    application: 'SAP S/4HANA Finance',
    accountType: 'Human',
    personId: 'p-elena',
    correlatedIdentity: 'Elena Vance',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: 'Today 08:40',
    daysInactive: 0,
    riskScore: 84,
  },
  {
    id: 'acc-5',
    accountName: 'pnair_jit@aws-prod',
    application: 'AWS Prod Vault',
    accountType: 'Human',
    personId: 'p-priya',
    correlatedIdentity: 'Priya Nair',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: 'Yesterday 18:15',
    daysInactive: 1,
    riskScore: 18,
  },
  {
    id: 'acc-6',
    accountName: 'lmeyer_steward',
    application: 'Snowflake PII Lake',
    accountType: 'Human',
    personId: 'p-lucas',
    correlatedIdentity: 'Lucas Meyer',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: 'Today 07:45',
    daysInactive: 0,
    riskScore: 19,
  },
  {
    id: 'acc-7',
    accountName: 'mwilson_ext',
    application: 'Active Directory',
    accountType: 'Contractor',
    personId: 'p-mark',
    correlatedIdentity: 'Mark Wilson',
    correlationState: 'Disabled (Leaver)',
    accountStatus: 'Disabled',
    privileged: false,
    lastLogin: '3 days ago',
    daysInactive: 3,
    riskScore: 8,
  },
  {
    id: 'acc-8',
    accountName: 'AKIA-MWILSON-PROD-09',
    application: 'AWS Prod Vault',
    accountType: 'Contractor',
    personId: 'p-mark',
    correlatedIdentity: 'Mark Wilson (Terminated)',
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: 'Yesterday 22:14',
    daysInactive: 1,
    orphanReason: 'Contractor HR end date expired (2026-11-21); direct IAM access key left active.',
    riskScore: 95,
  },
  {
    id: 'acc-jsmith',
    accountName: 'j.smith',
    application: 'Active Directory',
    accountType: 'Human',
    correlatedIdentity: null,
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: 'Today 09:14',
    daysInactive: 0,
    orphanReason:
      'Active Directory account imported from OU=Finance with no matching Workday employeeNumber or manager correlation.',
    riskScore: 74,
    rawAttributes: {
      sAMAccountName: 'j.smith',
      givenName: 'John',
      sn: 'Smith',
      mail: 'john.smith@company.com',
      department: 'Finance',
      employeeNumber: null,
      manager: null,
    },
  },
  {
    id: 'acc-jdavies-dup',
    accountName: 'j.davies_legacy',
    application: 'Active Directory',
    accountType: 'Human',
    correlatedIdentity: null,
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: 'Yesterday 16:40',
    daysInactive: 1,
    orphanReason:
      'Uncorrelated regional AD account — matches existing identity attributes for John Davies (potential duplicate).',
    riskScore: 68,
    rawAttributes: {
      sAMAccountName: 'j.davies_legacy',
      givenName: 'John',
      sn: 'Davies',
      mail: 'john.davies@identra-corp.io',
      department: 'Global Revenue & Enterprise Sales',
      employeeNumber: 'EMP-10394',
      manager: 'Marcus Bell',
    },
  },
  {
    id: 'acc-9',
    accountName: 'adm_jhenderson',
    application: 'Active Directory',
    accountType: 'Contractor',
    correlatedIdentity: null,
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: '118 days ago',
    daysInactive: 118,
    orphanReason: 'Unmatched OU=Contractors account with no Workday employeeNumber (flagged in IMP-4104).',
    riskScore: 91,
    rawAttributes: {
      sAMAccountName: 'adm_jhenderson',
      givenName: 'James',
      sn: 'Henderson',
      mail: 'james.henderson@ext-infra.co.za',
      department: 'External Assurance & Contractors',
      employeeNumber: null,
      manager: null,
    },
  },
  {
    id: 'acc-10',
    accountName: 'ext_kpatel_tmp',
    application: 'Active Directory',
    accountType: 'Contractor',
    correlatedIdentity: null,
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: '64 days ago',
    daysInactive: 64,
    orphanReason: 'Legacy vendor account without B2B sponsor or HRIS correlation record (IMP-4104).',
    riskScore: 76,
    rawAttributes: {
      sAMAccountName: 'ext_kpatel_tmp',
      givenName: 'Kiran',
      sn: 'Patel',
      mail: 'kiran.patel@vanguard-ext.co.za',
      department: 'External Assurance & Contractors',
      employeeNumber: null,
      manager: null,
    },
  },
  {
    id: 'acc-11',
    accountName: 'SAP_BATCH_LEGACY04',
    application: 'SAP S/4HANA Finance',
    accountType: 'Service Account',
    correlatedIdentity: null,
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: '42 days ago',
    daysInactive: 42,
    orphanReason: 'Ownerless SAP batch user holding FI_POSTING privilege; original owner departed Q2.',
    riskScore: 88,
    rawAttributes: {
      BNAME: 'SAP_BATCH_LEGACY04',
      NAME_FIRST: 'SAP Batch',
      NAME_LAST: 'Posting Engine',
      SMTP_ADDR: 'sap-batch-fin@identra-corp.io',
      DEPARTMENT: 'Corporate Finance & Treasury',
      PERNR: null,
      KOSTL: 'CC-4100-FIN',
    },
  },
  {
    id: 'acc-12',
    accountName: 'api.legacy-billing-sync',
    application: 'AWS Prod Vault',
    accountType: 'API Token',
    correlatedIdentity: null,
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: 'Today 04:00',
    daysInactive: 0,
    orphanReason: 'Unassigned non-human API token with wildcard S3 + Secrets Read; unrotated for 194 days.',
    riskScore: 92,
    rawAttributes: {
      iamUserName: 'api.legacy-billing-sync',
      'tag:FirstName': null,
      'tag:LastName': null,
      'tag:Email': null,
      'tag:Owner': null,
      'tag:Scope': 'Wildcard S3 + Secrets Read',
    },
  },
  {
    id: 'acc-13',
    accountName: 'sf_bi_extract_old',
    application: 'Snowflake PII Lake',
    accountType: 'Service Account',
    correlatedIdentity: null,
    correlationState: 'Orphaned',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: '87 days ago',
    daysInactive: 87,
    orphanReason: 'Decommissioned BI connector account never linked to an accountable steward.',
    riskScore: 72,
    rawAttributes: {
      LOGIN_NAME: 'sf_bi_extract_old',
      FIRST_NAME: 'Snowflake BI',
      LAST_NAME: 'Extract Connector',
      EMAIL: 'bi-ops@identra-corp.io',
      COMMENT_OWNER: null,
    },
  },
  {
    id: 'acc-14',
    accountName: 'agent.release-copilot',
    application: 'Snowflake PII Lake',
    accountType: 'AI Agent',
    correlatedIdentity: 'Priya Nair (Owner)',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: true,
    lastLogin: 'Today 10:15',
    daysInactive: 0,
    riskScore: 88,
  },
  {
    id: 'acc-15',
    accountName: 'svc.finance-ledger-etl',
    application: 'SAP S/4HANA Finance',
    accountType: 'Service Account',
    correlatedIdentity: 'Lucas Meyer (Owner)',
    correlationState: 'Correlated',
    accountStatus: 'Enabled',
    privileged: false,
    lastLogin: 'Today 06:00',
    daysInactive: 0,
    riskScore: 12,
  },
];

/* -------------------------------------------------------------------------- */
/* Email Notification Logs & Branded HTML Email Templates                     */
/* -------------------------------------------------------------------------- */

export type EmailDeliveryStatus = 'Delivered' | 'Queued' | 'Bounced' | 'Failed';
export type EmailTriggerCategory =
  | 'JML Lifecycle'
  | 'Access Review'
  | 'SoD & Policy'
  | 'Birthright'
  | 'Operations';

export type SmtpAuthMethod =
  | 'OAuth 2.0 / Graph Client Credentials'
  | 'SMTP AUTH (Username & Password)'
  | 'API Key Bearer'
  | 'mTLS Client Certificate';

export interface SmtpConfig {
  host: string;
  port: number;
  encryption: 'STARTTLS (TLS 1.3)' | 'SSL/TLS (465)' | 'Opportunistic TLS';
  authMethod: SmtpAuthMethod;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  lastTestedAt: string;
  connectionStatus: 'Connected' | 'Untested' | 'Error';
}

export interface MasterEmailTemplateConfig {
  brandTitle: string;
  brandSubtitle: string;
  headerBgStart: string;
  headerBgEnd: string;
  headerTextColor: string;
  accentColor: string;
  canvasBgColor: string;
  cardBgColor: string;
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Georgia Serif' | 'System UI';
  cardRadiusPx: 8 | 14 | 18 | 24;
  buttonRadiusPx: 4 | 10 | 999;
  showBrandEmblem: boolean;
  showCorrelationBadge: boolean;
  showDkimFooter: boolean;
  footerBrandText: string;
  footerDisclaimer: string;
}

export interface PlatformConfig {
  smtp: SmtpConfig;
  emailTemplate: MasterEmailTemplateConfig;
  provisioning: {
    defaultMode: 'Auto-Provision' | 'Simulation Mode';
    importDeltaIntervalMins: 5 | 15 | 30 | 60;
    orphanThresholdDays: 30 | 60 | 90;
    rollbackImportOnError: boolean;
    emergencyDisableAllTargets: boolean;
  };
  governance: {
    defaultReviewWorkflow: ReviewWorkflowType;
    reviewEscalationSlaDays: 5 | 7 | 10 | 14;
    approvalEscalationHours: 12 | 24 | 48 | 72;
    autoRevokeBirthrightsOnExit: boolean;
    sodEnforcementMode: 'Preventative Block & Alert' | 'Detective Monitor Only';
    nhiMaxSecretTtlDays: 30 | 60 | 90;
    currencySymbol: 'R' | '€' | '£';
  };
}

export const MASTER_EMAIL_PRESETS: {
  id: string;
  label: string;
  config: Partial<MasterEmailTemplateConfig>;
}[] = [
  {
    id: 'identra-obsidian',
    label: 'IDENTRA Obsidian & Sky',
    config: {
      headerBgStart: '#0F172A',
      headerBgEnd: '#0C4A6E',
      headerTextColor: '#FFFFFF',
      accentColor: '#0EA5E9',
      canvasBgColor: '#F1F5F9',
      cardBgColor: '#FFFFFF',
      cardRadiusPx: 18,
      buttonRadiusPx: 10,
    },
  },
  {
    id: 'emerald-trust',
    label: 'Corporate Slate & Emerald',
    config: {
      headerBgStart: '#064E3B',
      headerBgEnd: '#0F172A',
      headerTextColor: '#FFFFFF',
      accentColor: '#10B981',
      canvasBgColor: '#ECFDF5',
      cardBgColor: '#FFFFFF',
      cardRadiusPx: 14,
      buttonRadiusPx: 10,
    },
  },
  {
    id: 'executive-indigo',
    label: 'Executive Indigo & Violet',
    config: {
      headerBgStart: '#1E1B4B',
      headerBgEnd: '#312E81',
      headerTextColor: '#FFFFFF',
      accentColor: '#6366F1',
      canvasBgColor: '#EEF2FF',
      cardBgColor: '#FFFFFF',
      cardRadiusPx: 18,
      buttonRadiusPx: 999,
    },
  },
  {
    id: 'minimal-daylight',
    label: 'Minimalist Daylight',
    config: {
      headerBgStart: '#FFFFFF',
      headerBgEnd: '#F8FAFC',
      headerTextColor: '#0F172A',
      accentColor: '#0284C7',
      canvasBgColor: '#F8FAFC',
      cardBgColor: '#FFFFFF',
      cardRadiusPx: 8,
      buttonRadiusPx: 4,
    },
  },
];

export const INITIAL_PLATFORM_CONFIG: PlatformConfig = {
  smtp: {
    host: 'smtp.office365.com',
    port: 587,
    encryption: 'STARTTLS (TLS 1.3)',
    authMethod: 'OAuth 2.0 / Graph Client Credentials',
    username: 'svc-identra-mailer@identra-corp.io',
    password: '••••••••••••••••••••••••',
    fromName: 'IDENTRA Identity Notifications',
    fromEmail: 'no-reply@identra-corp.io',
    replyToEmail: 'iam-ops@identra-corp.io',
    lastTestedAt: '2026-11-24 09:30:00',
    connectionStatus: 'Connected',
  },
  emailTemplate: {
    brandTitle: 'IDENTRA',
    brandSubtitle: 'IGA SUITE · IDENTITY PROCESS++',
    headerBgStart: '#0F172A',
    headerBgEnd: '#0C4A6E',
    headerTextColor: '#FFFFFF',
    accentColor: '#0EA5E9',
    canvasBgColor: '#F1F5F9',
    cardBgColor: '#FFFFFF',
    fontFamily: 'Inter',
    cardRadiusPx: 18,
    buttonRadiusPx: 10,
    showBrandEmblem: true,
    showCorrelationBadge: true,
    showDkimFooter: true,
    footerBrandText: 'IDENTRA Autonomous IGA · Automated Governance Notification',
    footerDisclaimer: 'Inherited automatically from the IDENTRA Master Email Template.',
  },
  provisioning: {
    defaultMode: 'Auto-Provision',
    importDeltaIntervalMins: 15,
    orphanThresholdDays: 60,
    rollbackImportOnError: true,
    emergencyDisableAllTargets: true,
  },
  governance: {
    defaultReviewWorkflow: 'Manager Approval',
    reviewEscalationSlaDays: 10,
    approvalEscalationHours: 48,
    autoRevokeBirthrightsOnExit: true,
    sodEnforcementMode: 'Preventative Block & Alert',
    nhiMaxSecretTtlDays: 60,
    currencySymbol: 'R',
  },
};

export interface BrandedEmailTemplateInput {
  badgeText: string;
  badgeTone: 'sky' | 'emerald' | 'amber' | 'rose';
  headline: string;
  greeting: string;
  intro: string;
  metadataRows: { label: string; value: string; mono?: boolean }[];
  calloutTitle?: string;
  calloutText?: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryNote?: string;
  messageCode: string;
  timestamp: string;
}

export interface DemoEmailNotification {
  id: string;
  messageCode: string;
  timestamp: string;
  status: EmailDeliveryStatus;
  trigger: string;
  triggerCategory: EmailTriggerCategory;
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  cc?: string[];
  from: string;
  subject: string;
  smtpProvider: string;
  deliveryLatencyMs: number | null;
  errorMessage?: string;
  templateData: BrandedEmailTemplateInput;
  htmlBody: string;
}

function resolveEmailFontStack(font: MasterEmailTemplateConfig['fontFamily']): string {
  switch (font) {
    case 'Plus Jakarta Sans':
      return "'Plus Jakarta Sans','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
    case 'Georgia Serif':
      return "Georgia,'Times New Roman',Times,serif";
    case 'System UI':
      return "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
    default:
      return "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  }
}

export function buildBrandedIdentraEmailHtml(
  input: BrandedEmailTemplateInput,
  master: MasterEmailTemplateConfig = INITIAL_PLATFORM_CONFIG.emailTemplate
): string {
  const tonePalette = {
    sky: { bg: '#E0F2FE', border: '#BAE6FD', text: '#0369A1', accent: master.accentColor },
    emerald: { bg: '#DCFCE7', border: '#BBF7D0', text: '#047857', accent: '#10B981' },
    amber: { bg: '#FEF3C7', border: '#FDE68A', text: '#B45309', accent: '#F59E0B' },
    rose: { bg: '#FFE4E6', border: '#FECDD3', text: '#BE123C', accent: '#E11D48' },
  }[input.badgeTone];

  const fontStack = resolveEmailFontStack(master.fontFamily);
  const isLightHeader =
    master.headerTextColor.toLowerCase() === '#0f172a' ||
    master.headerBgStart.toLowerCase() === '#ffffff';
  const subtitleColor = isLightHeader ? master.accentColor : '#7DD3FC';
  const badgeBg = isLightHeader ? '#F1F5F9' : 'rgba(255,255,255,0.14)';
  const badgeBorder = isLightHeader ? '#CBD5E1' : 'rgba(255,255,255,0.28)';
  const badgeColor = isLightHeader ? '#0F172A' : '#FFFFFF';

  const rowsHtml = input.metadataRows
    .map(
      (row) => `
                <tr>
                  <td style="padding:10px 14px;border-bottom:1px solid #E2E8F0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748B;width:36%;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;">
                    ${row.label}
                  </td>
                  <td style="padding:10px 14px;border-bottom:1px solid #E2E8F0;font-size:13px;font-weight:600;color:#0F172A;${
                    row.mono
                      ? "font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;"
                      : `font-family:${fontStack};`
                  }">
                    ${row.value}
                  </td>
                </tr>`
    )
    .join('');

  const calloutHtml =
    input.calloutTitle && input.calloutText
      ? `
              <div style="margin-top:20px;padding:14px 16px;border-radius:12px;background-color:${tonePalette.bg};border:1px solid ${tonePalette.border};">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${tonePalette.text};font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;">
                  ${input.calloutTitle}
                </div>
                <p style="margin:6px 0 0 0;font-size:13px;line-height:1.55;color:#1E293B;">
                  ${input.calloutText}
                </p>
              </div>`
      : '';

  const emblemHtml = master.showBrandEmblem
    ? `<td style="vertical-align:middle;padding-right:10px;">
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 4L6 34H13.2L20 18.8V4Z" fill="${master.accentColor}" />
                              <path d="M20 4L34 34H26.6L20 18.8V4Z" fill="#2563EB" />
                              <path d="M14.8 26.2L20 22.8L25.2 26.2L22.5 29.6H17.5L14.8 26.2Z" fill="${master.accentColor}" />
                            </svg>
                          </td>`
    : '';

  const correlationBadgeHtml = master.showCorrelationBadge
    ? `<td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;padding:4px 10px;border-radius:999px;background-color:${badgeBg};border:1px solid ${badgeBorder};color:${badgeColor};font-size:10px;font-weight:700;letter-spacing:0.08em;font-family:'JetBrains Mono',ui-monospace,monospace;">
                        ${input.messageCode}
                      </span>
                    </td>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${input.headline} — ${master.brandTitle}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${master.canvasBgColor};font-family:${fontStack};color:#0F172A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${master.canvasBgColor};padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:${master.cardBgColor};border-radius:${master.cardRadiusPx}px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 10px 30px rgba(15,23,42,0.06);">
            <!-- Master Template Brand Header -->
            <tr>
              <td style="background:linear-gradient(135deg,${master.headerBgStart} 0%,${master.headerBgEnd} 100%);padding:22px 28px;${isLightHeader ? 'border-bottom:1px solid #E2E8F0;' : ''}">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          ${emblemHtml}
                          <td style="vertical-align:middle;">
                            <div style="font-size:15px;font-weight:800;letter-spacing:0.18em;color:${master.headerTextColor};line-height:1.1;">${master.brandTitle}</div>
                            <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;color:${subtitleColor};text-transform:uppercase;margin-top:2px;font-family:'JetBrains Mono',ui-monospace,monospace;">${master.brandSubtitle}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    ${correlationBadgeHtml}
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Inherited Accent Strip -->
            <tr>
              <td style="height:4px;background-color:${master.accentColor};font-size:0;line-height:0;">&nbsp;</td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding:28px;">
                <span style="display:inline-block;padding:4px 11px;border-radius:999px;background-color:${tonePalette.bg};border:1px solid ${tonePalette.border};color:${tonePalette.text};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-family:'JetBrains Mono',ui-monospace,monospace;">
                  ${input.badgeText}
                </span>

                <h1 style="margin:14px 0 8px 0;font-size:21px;font-weight:800;line-height:1.3;color:#0F172A;letter-spacing:-0.01em;">
                  ${input.headline}
                </h1>

                <p style="margin:0 0 10px 0;font-size:14px;line-height:1.6;color:#334155;">
                  ${input.greeting}
                </p>
                <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#475569;">
                  ${input.intro}
                </p>

                <!-- Structured Metadata Table -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;background-color:#F8FAFC;">
                  ${rowsHtml}
                </table>

                ${calloutHtml}

                <!-- Primary Action CTA (Inherits Master Accent & Button Radius) -->
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;">
                  <tr>
                    <td style="border-radius:${master.buttonRadiusPx}px;background-color:${master.accentColor};">
                      <a href="${input.ctaUrl}" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.01em;">
                        ${input.ctaLabel} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                ${
                  input.secondaryNote
                    ? `<p style="margin:18px 0 0 0;font-size:12px;line-height:1.55;color:#64748B;">${input.secondaryNote}</p>`
                    : ''
                }
              </td>
            </tr>

            <!-- Inherited Master Governance Footer -->
            <tr>
              <td style="background-color:#F8FAFC;border-top:1px solid #E2E8F0;padding:18px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-size:11px;line-height:1.5;color:#64748B;">
                      <strong style="color:#0F172A;">${master.footerBrandText}</strong><br />
                      Dispatched ${input.timestamp} UTC · Correlation ID <span style="font-family:'JetBrains Mono',ui-monospace,monospace;color:${master.accentColor};">${input.messageCode}</span>
                      ${
                        master.footerDisclaimer
                          ? `<br /><span style="font-size:10px;color:#94A3B8;">${master.footerDisclaimer}</span>`
                          : ''
                      }
                    </td>
                    ${
                      master.showDkimFooter
                        ? `<td align="right" style="font-size:10px;color:#94A3B8;font-family:'JetBrains Mono',ui-monospace,monospace;vertical-align:top;">
                      TLS 1.3 · DKIM Signed
                    </td>`
                        : ''
                    }
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function makeEmailNotification(
  meta: Omit<DemoEmailNotification, 'templateData' | 'htmlBody'>,
  templateData: BrandedEmailTemplateInput,
  master: MasterEmailTemplateConfig = INITIAL_PLATFORM_CONFIG.emailTemplate
): DemoEmailNotification {
  return {
    ...meta,
    templateData,
    htmlBody: buildBrandedIdentraEmailHtml(templateData, master),
  };
}

export const INITIAL_EMAIL_NOTIFICATIONS: DemoEmailNotification[] = [
  makeEmailNotification(
    {
      id: 'eml-7048',
      messageCode: 'EML-7048',
      timestamp: '2026-11-24 10:24:19',
      status: 'Delivered',
      trigger: 'Day-1 HRIS Joiner Onboarding · Birthright BR-002',
      triggerCategory: 'JML Lifecycle',
      recipientName: 'Sarah Mitchell',
      recipientEmail: 'sarah.mitchell@identra-corp.io',
      recipientRole: 'New Joiner (Financial Analyst)',
      cc: ['claire.vance@identra-corp.io'],
      from: 'IDENTRA Identity Notifications <no-reply@identra-corp.io>',
      subject: 'Welcome to IDENTRA — Your Day-1 Accounts & Finance Access Are Ready',
      smtpProvider: 'smtp.office365.com:587 · STARTTLS (TLS 1.3)',
      deliveryLatencyMs: 284,
    },
    {
      badgeText: 'DAY-1 JOINER PROVISIONED',
      badgeTone: 'emerald',
      headline: 'Your Day-1 Identity & Finance Access Are Ready',
      greeting: 'Hi Sarah Mitchell,',
      intro:
        'Welcome to IDENTRA Global Holdings Ltd. Based on your authoritative Workday HRIS record and Primary Employment · Finance UK context (CTX-EMP-FIN-UK), your Day-1 birthright accounts and business roles have been provisioned automatically.',
      metadataRows: [
        { label: 'Employee #', value: 'EMP-10841', mono: true },
        { label: 'Corporate UPN', value: 'smitchell@corp.identra.net', mono: true },
        { label: 'Birthright Policy', value: 'BR-001 + BR-002 (EMEA Finance Operations)', mono: true },
        { label: 'Provisioned Roles', value: 'Finance: Base Ledger Read · Corporate SSO Standard' },
        { label: 'AD Security Group', value: 'SG-Finance-Ledger-Readers', mono: true },
        { label: 'Line Manager', value: 'Claire Vance (Finance Operations Manager)' },
      ],
      calloutTitle: 'First Sign-In Security Requirement',
      calloutText:
        'Please enroll your phishing-resistant FIDO2 passkey or Microsoft Authenticator within 24 hours to activate SSO across SAP S/4HANA and Microsoft 365.',
      ctaLabel: 'Activate Corporate SSO',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      secondaryNote:
        'Need additional application access? Submit a self-service request in the IDENTRA Access Portal — Preventative SoD checks run automatically.',
      messageCode: 'EML-7048',
      timestamp: '2026-11-24 10:24:19',
    }
  ),
  makeEmailNotification(
    {
      id: 'eml-7047',
      messageCode: 'EML-7047',
      timestamp: '2026-11-24 09:47:12',
      status: 'Delivered',
      trigger: 'Access Review Triggered · Manager Approval (WF-REV-MGR-01)',
      triggerCategory: 'Access Review',
      recipientName: 'Marcus Bell',
      recipientEmail: 'marcus.bell@identra-corp.io',
      recipientRole: 'Line Manager (VP Enterprise Sales)',
      from: 'IDENTRA Identity Notifications <no-reply@identra-corp.io>',
      subject: 'Action Required: Certify M365 E5 License & Privileged Access for Your Team',
      smtpProvider: 'smtp.office365.com:587 · STARTTLS (TLS 1.3)',
      deliveryLatencyMs: 318,
    },
    {
      badgeText: 'ACCESS REVIEW · MANAGER APPROVAL',
      badgeTone: 'sky',
      headline: 'Quarterly Access & License Review Assigned to You',
      greeting: 'Hi Marcus Bell,',
      intro:
        'You have been assigned as the certifying reviewer under workflow WF-REV-MGR-01 (Manager Approval) for the Q4 Enterprise Access & License Certification Campaign. Process++ usage analytics identified an unused Microsoft 365 E5 license eligible for reclamation.',
      metadataRows: [
        { label: 'Selected Workflow', value: 'Manager Approval (WF-REV-MGR-01)', mono: true },
        { label: 'Subject Identity', value: 'John Davies · Enterprise Account Director' },
        { label: 'Item Under Review', value: 'Microsoft 365 E5 (Full Suite) — R1,050/mo' },
        { label: 'Target System', value: 'Microsoft Entra ID (SKU: SPE_E5)', mono: true },
        { label: 'AI Usage Signal', value: '0 E5 workload activations in 118 days · Recommend Revoke' },
        { label: 'Certification SLA', value: '10 days remaining (Auto-downgrade to E3 on expiry)' },
      ],
      calloutTitle: 'Cost Optimization Opportunity',
      calloutText:
        'Revoking the unused E5 add-on and downgrading to M365 E3 preserves full Salesforce and Teams productivity while saving R4,620/year on CC-2200-REV.',
      ctaLabel: 'Open Access Review Task',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      secondaryNote:
        'All certification decisions are cryptographically sealed into the IDENTRA SOX/ISO 27001 audit trail.',
      messageCode: 'EML-7047',
      timestamp: '2026-11-24 09:47:12',
    }
  ),
  makeEmailNotification(
    {
      id: 'eml-7046',
      messageCode: 'EML-7046',
      timestamp: '2026-11-24 09:05:44',
      status: 'Delivered',
      trigger: 'Shadow AI Agent Drift Alert · Policy NHI-AI-209',
      triggerCategory: 'SoD & Policy',
      recipientName: 'Lucas Meyer',
      recipientEmail: 'lucas.meyer@identra-corp.io',
      recipientRole: 'Data Owner (Head of Data Governance)',
      cc: ['secops@identra-corp.io', 'priya.nair@identra-corp.io'],
      from: 'IDENTRA Identity Notifications <no-reply@identra-corp.io>',
      subject: '[CRITICAL] Shadow AI Agent Grant Detected on Snowflake PROD_PII',
      smtpProvider: 'smtp.office365.com:587 · STARTTLS (TLS 1.3)',
      deliveryLatencyMs: 196,
    },
    {
      badgeText: 'CRITICAL · NHI-AI-209 VIOLATION',
      badgeTone: 'rose',
      headline: 'Unattested AI Agent Acquired Raw PII Read Access',
      greeting: 'Attention Lucas Meyer,',
      intro:
        'IDENTRA continuous reconciliation detected an out-of-band direct privilege grant on Snowflake PII Lake for autonomous agent agent.release-copilot. A Data Owner & SecOps review workflow (WF-REV-AI-07) has been triggered immediately.',
      metadataRows: [
        { label: 'Non-Human Identity', value: 'agent.release-copilot (AI Agent · MCP)', mono: true },
        { label: 'Policy Violated', value: 'NHI-AI-209 · AI Agent Raw PII Isolation', mono: true },
        { label: 'Detected Grant', value: 'SNOWFLAKE:RAW_PII_SELECT (PROD_PII.*)', mono: true },
        { label: 'Selected Workflow', value: 'Data Owner & SecOps Approval (WF-REV-AI-07)' },
        { label: 'Observed Activity', value: '42 unmasked queries in last 24h (Outside CI/CD)' },
        { label: 'Accountable Owner', value: 'Priya Nair · Principal Platform Engineer' },
      ],
      calloutTitle: 'Automatic Containment SLA: 12 Hours',
      calloutText:
        'If not explicitly approved with an exception ticket within 12 hours, IDENTRA will automatically revoke SELECT_PII and revert agent.release-copilot to Scoped Least-Privilege Read.',
      ctaLabel: 'Contain Shadow AI Agent',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      secondaryNote:
        'Triggered by Identity Process++ Domain 06 (Non-Human Governance) & GDPR Art. 32 enforcement.',
      messageCode: 'EML-7046',
      timestamp: '2026-11-24 09:05:44',
    }
  ),
  makeEmailNotification(
    {
      id: 'eml-7045',
      messageCode: 'EML-7045',
      timestamp: '2026-11-24 08:33:08',
      status: 'Bounced',
      trigger: 'Contractor Off-board Confirmation · Mark Wilson (B2B Expiry)',
      triggerCategory: 'JML Lifecycle',
      recipientName: 'Mark Wilson',
      recipientEmail: 'mark.wilson@ext-audit.io',
      recipientRole: 'External Contractor (Terminated)',
      cc: ['priya.nair@identra-corp.io'],
      from: 'IDENTRA Identity Notifications <no-reply@identra-corp.io>',
      subject: 'Access Termination Notice — Vanguard External Assurance Q4 Engagement',
      smtpProvider: 'smtp.office365.com:587 · STARTTLS (TLS 1.3)',
      deliveryLatencyMs: null,
      errorMessage:
        'SMTP 550 5.1.1 Mailbox unavailable on ext-audit.io — delivery automatically escalated to Sponsor Priya Nair (priya.nair@identra-corp.io).',
    },
    {
      badgeText: 'CONTRACTOR OFF-BOARD NOTICE',
      badgeTone: 'amber',
      headline: 'Engagement Access Deactivated & Credentials Revoked',
      greeting: 'Hello Mark Wilson,',
      intro:
        'Your fixed-term engagement with IDENTRA Global Holdings Ltd concluded on 2026-11-21. In accordance with policy JML-OFF-001, your federated Active Directory account has been disabled and moved to OU=DisabledUsers.',
      metadataRows: [
        { label: 'Contractor ID', value: 'CTR-90114 · Vanguard External Assurance LLP', mono: true },
        { label: 'Contract End Date', value: '2026-11-21 (Expired)', mono: true },
        { label: 'AD Account Action', value: 'Disabled & moved to OU=DisabledUsers', mono: true },
        { label: 'Orphaned Key Flag', value: 'AKIA-MWILSON-PROD-09 queued for revocation', mono: true },
        { label: 'Internal Sponsor', value: 'Priya Nair (priya.nair@identra-corp.io)' },
      ],
      calloutTitle: 'Orphaned Privileged Key Escalation',
      calloutText:
        'An active direct AWS Prod Vault access key and AD group SG-AWS-Prod-Vault-Admins were flagged during reconciliation. An Entitlement Owner review (WF-REV-ENT-04) has been dispatched to Priya Nair.',
      ctaLabel: 'View Off-board Audit Record',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      secondaryNote:
        'If an engagement extension has been approved, your sponsor must update the B2B Partner Lifecycle Portal.',
      messageCode: 'EML-7045',
      timestamp: '2026-11-24 08:33:08',
    }
  ),
  makeEmailNotification(
    {
      id: 'eml-7044',
      messageCode: 'EML-7044',
      timestamp: '2026-11-24 08:16:02',
      status: 'Delivered',
      trigger: 'SOX-SOD-402 Toxic Combination Alert · Mover Transfer',
      triggerCategory: 'SoD & Policy',
      recipientName: 'David Chen',
      recipientEmail: 'david.chen@identra-corp.io',
      recipientRole: 'SOX Control Owner (Treasury Director)',
      cc: ['controller-office@identra-corp.io'],
      from: 'IDENTRA Identity Notifications <no-reply@identra-corp.io>',
      subject: '[SOX-402 BREACH] Toxic Role Conflict Detected for Elena Vance',
      smtpProvider: 'smtp.office365.com:587 · STARTTLS (TLS 1.3)',
      deliveryLatencyMs: 241,
    },
    {
      badgeText: 'SOX-SOD-402 VIOLATION · 48H SLA',
      badgeTone: 'rose',
      headline: 'Segregation of Duties Breach Requires Remediation',
      greeting: 'Hi David Chen,',
      intro:
        'Following Elena Vance’s transfer into EMEA Treasury & Payments, her legacy Accounts Payable role remained active alongside her new wire approval authority. Review workflow WF-REV-SOX-09 (SOX Control Owner Approval) has been opened.',
      metadataRows: [
        { label: 'Identity', value: 'Elena Vance (EMP-10219) · Treasury Operations Lead' },
        { label: 'Policy Code', value: 'SOX-SOD-402 · Forbid Vendor Create + Wire Approve', mono: true },
        { label: 'Conflicting Pair', value: 'Finance: AP-Clerk (Legacy) ∧ Treasury: Payment Approver' },
        { label: 'Selected Workflow', value: 'SOX Control Owner Approval (WF-REV-SOX-09)', mono: true },
        { label: 'Target Application', value: 'SAP S/4HANA Finance (Z_FI_AP_VENDOR_CREATE)', mono: true },
        { label: 'Recommended Fix', value: 'Auto-strip Finance: AP-Clerk & retire CTX-FIN-AP-LEGACY' },
      ],
      calloutTitle: 'Dual-Context Quarantine Active (BR-004)',
      calloutText:
        'Birthright rule BR-004 detected overlap between CTX-FIN-TREASURY and CTX-FIN-AP-LEGACY and placed wire approvals in step-up MFA hold until the legacy AP role is revoked.',
      ctaLabel: 'Auto-Mitigate SOX Breach',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      secondaryNote:
        'Unresolved SOX-402 violations automatically escalate to the Controller Office after 48 hours.',
      messageCode: 'EML-7044',
      timestamp: '2026-11-24 08:16:02',
    }
  ),
  makeEmailNotification(
    {
      id: 'eml-7043',
      messageCode: 'EML-7043',
      timestamp: '2026-11-24 08:00:19',
      status: 'Delivered',
      trigger: 'Scheduled Connector Import Failed · Microsoft Entra ID (IMP-4108)',
      triggerCategory: 'Operations',
      recipientName: 'Identity Platform Ops',
      recipientEmail: 'iam-ops@identra-corp.io',
      recipientRole: 'Operations On-Call Distribution',
      from: 'IDENTRA Identity Notifications <no-reply@identra-corp.io>',
      subject: '[ALERT] Entra ID Delta Import IMP-4108 Failed (HTTP 401 Graph Token)',
      smtpProvider: 'smtp.office365.com:587 · STARTTLS (TLS 1.3)',
      deliveryLatencyMs: 175,
    },
    {
      badgeText: 'CONNECTOR IMPORT FAILURE',
      badgeTone: 'amber',
      headline: 'Scheduled Delta Import IMP-4108 Aborted Cleanly',
      greeting: 'Hello Identity Platform Ops,',
      intro:
        'The scheduled Microsoft Entra ID delta import failed during Stage 2 (Extract Users & Licenses) due to an expired Graph API client secret. IDENTRA rolled back the staged delta automatically to protect desired-state graph parity.',
      metadataRows: [
        { label: 'Import Run Code', value: 'IMP-4108 (Scheduled Delta)', mono: true },
        { label: 'Connector', value: 'Microsoft Graph API v1.0', mono: true },
        { label: 'Error Code', value: 'HTTP 401 · AADSTS7000215 (Invalid Client Secret)', mono: true },
        { label: 'Graph Integrity', value: 'Protected · Staged delta rolled back cleanly' },
        { label: 'Recommended Fix', value: 'Rotate Managed Identity credential & retry IMP-4108' },
      ],
      calloutTitle: '1-Click Recovery Available',
      calloutText:
        'Navigate to Operations → Imports and select Retry with Refreshed Credential to restore 100% Entra ID license synchronization.',
      ctaLabel: 'Open Import Diagnostics',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: 'EML-7043',
      timestamp: '2026-11-24 08:00:19',
    }
  ),
  makeEmailNotification(
    {
      id: 'eml-7042',
      messageCode: 'EML-7042',
      timestamp: '2026-11-24 07:45:05',
      status: 'Queued',
      trigger: 'Birthright Evaluation · BR-005 (London HQ Finance M365 E5 Uplift)',
      triggerCategory: 'Birthright',
      recipientName: 'Claire Vance',
      recipientEmail: 'claire.vance@identra-corp.io',
      recipientRole: 'Finance Operations Manager',
      from: 'IDENTRA Identity Notifications <no-reply@identra-corp.io>',
      subject: 'Birthright Summary: 2 Identities Matched BR-005 (M365 E5 & SAP Fiori)',
      smtpProvider: 'smtp.office365.com:587 · STARTTLS (TLS 1.3)',
      deliveryLatencyMs: null,
    },
    {
      badgeText: 'BIRTHRIGHT POLICY DIGEST',
      badgeTone: 'sky',
      headline: 'Hybrid Birthright Rule BR-005 Evaluated Successfully',
      greeting: 'Hi Claire Vance,',
      intro:
        'Hybrid birthright policy BR-005 (Location = London HQ ∧ Cost Center = CC-4100-FIN ∧ Context ∈ {CTX-EMP-FIN-UK, CTX-FIN-TREASURY}) evaluated cleanly against the live workforce graph.',
      metadataRows: [
        { label: 'Policy Code', value: 'BR-005 · Hybrid (Attributes + Contexts)', mono: true },
        { label: 'Matched Identities', value: 'Sarah Mitchell (EMP-10841), Elena Vance (EMP-10219)' },
        { label: 'Granted Access', value: 'Microsoft 365 E5 (SPE_E5) · SAP:FIORI_ANALYTICS_VIEWER' },
        { label: 'Provisioning Mode', value: 'Auto-Provision · Auto-Revoke on Exit Enabled' },
      ],
      ctaLabel: 'Inspect Birthright Policy',
      ctaUrl: 'https://identra-two.vercel.app/#demo',
      messageCode: 'EML-7042',
      timestamp: '2026-11-24 07:45:05',
    }
  ),
];

/* -------------------------------------------------------------------------- */
/* Governance Assurance & Configurable Governance Controls                    */
/* -------------------------------------------------------------------------- */

export type GovernanceControlDomain =
  | 'Ownership'
  | 'Identity Hygiene'
  | 'Account Integrity'
  | 'Access Hygiene'
  | 'Non-Human Governance';

export interface GovernanceControlViolation {
  id: string;
  objectName: string;
  objectType: 'Application' | 'Identity' | 'Account' | 'Entitlement' | 'Non-Human ID' | 'Role';
  detail: string;
  detectedAt: string;
  suggestedFix: string;
  resolved: boolean;
  /** Optional link to an imported zero-member entitlement for target-system deletion remediation */
  emptyEntitlementId?: string;
  targetSystem?: DemoProvisioningJob['application'];
  technicalId?: string;
  daysEmpty?: number;
  deletableInTarget?: boolean;
  nonDeletableReason?: string;
  deletionJobId?: string;
  deletionJobCode?: string;
  remediationOutcome?: string;
}

export interface DemoGovernanceControl {
  id: string;
  code: string;
  name: string;
  description: string;
  domain: GovernanceControlDomain;
  severity: 'Critical' | 'High' | 'Medium';
  preventativeEnabled: boolean;
  detectiveEnabled: boolean;
  totalEvaluated: number;
  evaluatedUnit: string;
  lastScanAt: string;
  preventativeTestExample: {
    attemptedAction: string;
    blockedMessage: string;
    allowedMessage: string;
  };
  violations: GovernanceControlViolation[];
}

export const INITIAL_GOVERNANCE_CONTROLS: DemoGovernanceControl[] = [
  {
    id: 'ga-ent-owner',
    code: 'GA-CTRL-01',
    name: 'Entitlement Ownership',
    description: 'Every entitlement must have an assigned owner.',
    domain: 'Ownership',
    severity: 'High',
    preventativeEnabled: true,
    detectiveEnabled: true,
    totalEvaluated: 12480,
    evaluatedUnit: 'entitlements',
    lastScanAt: '2m ago',
    preventativeTestExample: {
      attemptedAction: 'Create entitlement "SAP:FI_GL_OVERRIDE" with owner = null',
      blockedMessage:
        'BLOCKED BY GA-CTRL-01 (Preventative): Entitlement creation rejected because no accountable Entitlement Owner was assigned.',
      allowedMessage:
        'ALLOWED (Preventative Off): Entitlement created without owner — Detective scan will flag this as an Ownership violation.',
    },
    violations: [],
  },
  {
    id: 'ga-app-owner',
    code: 'GA-CTRL-02',
    name: 'Application Ownership',
    description: 'Every connected system must have an accountable owner.',
    domain: 'Ownership',
    severity: 'Critical',
    preventativeEnabled: true,
    detectiveEnabled: true,
    totalEvaluated: 126,
    evaluatedUnit: 'connected apps',
    lastScanAt: '2m ago',
    preventativeTestExample: {
      attemptedAction: 'Onboard connector "Legacy ERP Bridge" without Application Owner',
      blockedMessage:
        'BLOCKED BY GA-CTRL-02 (Preventative): Target system registration halted — an active Application Owner must be bound before activation.',
      allowedMessage:
        'ALLOWED (Preventative Off): Connector registered without owner — flagged for Detective remediation.',
    },
    violations: [
      {
        id: 'gv-app-1',
        objectName: 'Legacy Payroll SFTP Bridge',
        objectType: 'Application',
        detail: 'Previous Application Owner left the organization 18 days ago; no fallback steward assigned.',
        detectedAt: '2026-11-24 07:30',
        suggestedFix: 'Assign Claire Vance as accountable Application Owner',
        resolved: false,
      },
      {
        id: 'gv-app-2',
        objectName: 'Snowflake Analytics Staging',
        objectType: 'Application',
        detail: 'Connected data warehouse onboarded via API without owner metadata populated.',
        detectedAt: '2026-11-24 07:30',
        suggestedFix: 'Assign Lucas Meyer (Data Governance) as Application Owner',
        resolved: false,
      },
      {
        id: 'gv-app-3',
        objectName: 'Regional CRM Sandbox',
        objectType: 'Application',
        detail: 'Owner attribute references inactive employee record EMP-09411.',
        detectedAt: '2026-11-23 19:15',
        suggestedFix: 'Reassign ownership to Marcus Bell (VP Enterprise Sales)',
        resolved: false,
      },
      {
        id: 'gv-app-4',
        objectName: 'B2B Vendor Document Vault',
        objectType: 'Application',
        detail: 'Owner handoff request pending acceptance for >30 days.',
        detectedAt: '2026-11-23 14:00',
        suggestedFix: 'Assign Priya Nair as interim Application Owner',
        resolved: false,
      },
    ],
  },
  {
    id: 'ga-id-mgr',
    code: 'GA-CTRL-03',
    name: 'Identity Manager Assignment',
    description: 'Every active identity must have a valid manager.',
    domain: 'Identity Hygiene',
    severity: 'High',
    preventativeEnabled: false,
    detectiveEnabled: true,
    totalEvaluated: 6732,
    evaluatedUnit: 'active identities',
    lastScanAt: '2m ago',
    preventativeTestExample: {
      attemptedAction: 'Import active identity "EMP-10940" with empty managerRefId',
      blockedMessage:
        'BLOCKED BY GA-CTRL-03 (Preventative): Identity activation held in staging until a valid active Line Manager is resolved from Workday.',
      allowedMessage:
        'ALLOWED (Preventative Off): Identity activated with null manager — Detective control flagged violation for HR/IAM remediation.',
    },
    violations: [
      {
        id: 'gv-mgr-1',
        objectName: "Liam O'Connor (EMP-10644)",
        objectType: 'Identity',
        detail: 'Assigned line manager was off-boarded in Workday; reporting line broken.',
        detectedAt: '2026-11-24 08:05',
        suggestedFix: 'Re-parent reporting line to Alex Carter (VP Engineering)',
        resolved: false,
      },
      {
        id: 'gv-mgr-2',
        objectName: 'Nadia Patel (EMP-10718)',
        objectType: 'Identity',
        detail: 'Missing managerRefId following EMEA commercial org restructure.',
        detectedAt: '2026-11-24 08:05',
        suggestedFix: 'Bind Marcus Bell as valid Line Manager',
        resolved: false,
      },
      {
        id: 'gv-mgr-3',
        objectName: 'External Auditor Pool #04 (CTR-90201)',
        objectType: 'Identity',
        detail: 'Active external contractor identity lacks a valid internal sponsor/manager.',
        detectedAt: '2026-11-23 22:00',
        suggestedFix: 'Assign Priya Nair as accountable Contractor Sponsor',
        resolved: false,
      },
      {
        id: 'gv-mgr-4',
        objectName: 'Tomasz Nowak (EMP-10519)',
        objectType: 'Identity',
        detail: 'Assigned manager is on extended leave with no approval delegate configured.',
        detectedAt: '2026-11-23 16:40',
        suggestedFix: 'Assign Claire Vance as delegated approving manager',
        resolved: false,
      },
      {
        id: 'gv-mgr-5',
        objectName: 'Rachel Cho (EMP-10802)',
        objectType: 'Identity',
        detail: 'Workday supervisor ID failed correlation during last delta import.',
        detectedAt: '2026-11-23 11:20',
        suggestedFix: 'Sync supervisor record to Hannah Lindqvist (CDO)',
        resolved: false,
      },
    ],
  },
  {
    id: 'ga-orphans',
    code: 'GA-CTRL-04',
    name: 'Orphaned Accounts',
    description: 'Every account must be linked to an identity or have an approved exception.',
    domain: 'Account Integrity',
    severity: 'Critical',
    preventativeEnabled: true,
    detectiveEnabled: true,
    totalEvaluated: 18420,
    evaluatedUnit: 'target accounts',
    lastScanAt: '2m ago',
    preventativeTestExample: {
      attemptedAction: 'Provision AD account "tmp_ops99" without authoritative personId link',
      blockedMessage:
        'BLOCKED BY GA-CTRL-04 (Preventative): Uncorrelated account creation blocked — link to an authoritative identity or attach an approved exception ticket.',
      allowedMessage:
        'ALLOWED (Preventative Off): Unlinked target account created — Detective scan will quarantine unless an approved exception is registered.',
    },
    violations: [],
  },
  {
    id: 'ga-nhi-steward',
    code: 'GA-CTRL-05',
    name: 'Non-Human Identity Stewardship',
    description: 'Every AI agent, service account, and API token must have a human steward and rotation TTL.',
    domain: 'Non-Human Governance',
    severity: 'Critical',
    preventativeEnabled: true,
    detectiveEnabled: true,
    totalEvaluated: 1284,
    evaluatedUnit: 'non-human IDs',
    lastScanAt: '2m ago',
    preventativeTestExample: {
      attemptedAction: 'Register MCP AI agent "agent.invoice-bot" without human steward',
      blockedMessage:
        'BLOCKED BY GA-CTRL-05 (Preventative): Non-human credential issuance denied until a verified human owner and ≤60d rotation TTL are bound.',
      allowedMessage:
        'ALLOWED (Preventative Off): Ownerless AI agent registered — flagged immediately by Detective Non-Human scan.',
    },
    violations: [
      {
        id: 'gv-nhi-1',
        objectName: 'api.legacy-billing-sync',
        objectType: 'Non-Human ID',
        detail: 'Unassigned API token with wildcard S3 access; secret unrotated for 194 days.',
        detectedAt: '2026-11-24 06:00',
        suggestedFix: 'Bind Platform Security as steward & rotate API secret',
        resolved: false,
      },
      {
        id: 'gv-nhi-2',
        objectName: 'svc.reporting-webhook-prod',
        objectType: 'Non-Human ID',
        detail: 'Production webhook service account missing designated human steward.',
        detectedAt: '2026-11-23 18:10',
        suggestedFix: 'Assign Lucas Meyer as steward & enforce 60d TTL',
        resolved: false,
      },
    ],
  },
  {
    id: 'ga-priv-recert',
    code: 'GA-CTRL-06',
    name: 'Privileged Role Recertification SLA',
    description: 'Every Tier-0 privileged role must be recertified within its 90-day governance window.',
    domain: 'Access Hygiene',
    severity: 'High',
    preventativeEnabled: false,
    detectiveEnabled: true,
    totalEvaluated: 737,
    evaluatedUnit: 'business roles',
    lastScanAt: '2m ago',
    preventativeTestExample: {
      attemptedAction: 'Extend standing Tier-0 AD group membership past 90-day certification SLA',
      blockedMessage:
        'BLOCKED BY GA-CTRL-06 (Preventative): Standing extension denied — Tier-0 privileges require active recertification or JIT elevation.',
      allowedMessage:
        'ALLOWED (Preventative Off): Standing privilege extended past SLA — Detective monitor opened a compliance violation.',
    },
    violations: [
      {
        id: 'gv-rec-1',
        objectName: 'SG-Domain-Tier1-ServerAdmins',
        objectType: 'Role',
        detail: '94 days since last certification sign-off; exceeds mandatory 90-day Tier-0 SLA.',
        detectedAt: '2026-11-24 06:00',
        suggestedFix: 'Trigger immediate Access Review (WF-REV-DUAL-02) & convert to JIT',
        resolved: false,
      },
    ],
  },
  {
    id: 'ga-empty-entitlements',
    code: 'GA-CTRL-07',
    name: 'Empty Target Entitlements',
    description:
      'Entitlements imported from connected target systems with zero active members past the 30-day retention threshold must be decommissioned via a target deletion task or hold an approved exception.',
    domain: 'Access Hygiene',
    severity: 'Medium',
    preventativeEnabled: true,
    detectiveEnabled: true,
    totalEvaluated: 12480,
    evaluatedUnit: 'imported entitlements',
    lastScanAt: '2m ago',
    preventativeTestExample: {
      attemptedAction:
        'Import & publish unmanaged AD group "SG-Temp-FY25-Migration" (0 members) into Access Marketplace or remove last remaining member without lifecycle decommission check',
      blockedMessage:
        'BLOCKED BY GA-CTRL-07 (Preventative): Zero-member entitlement cannot be published to catalog or left orphaned after last-member removal — assign initial members, attach a retention exception, or trigger a Target System Deletion Task.',
      allowedMessage:
        'ALLOWED (Preventative Off): Zero-member entitlement accepted into catalog — Detective scan will flag it for target-system deletion after the 30-day empty threshold.',
    },
    violations: [
      {
        id: 'gv-emp-1',
        objectName: 'SG-Legacy-Q3-Audit-Temp',
        objectType: 'Entitlement',
        detail:
          'Imported from Active Directory with 0 members for 142 days (last member removed 2026-07-06). No active birthright or role reference.',
        detectedAt: '2026-11-25 06:15',
        suggestedFix: 'Trigger Active Directory LDAP group deletion task',
        resolved: false,
        emptyEntitlementId: 'emp-ent-1',
        targetSystem: 'Active Directory',
        technicalId: 'CN=SG-Legacy-Q3-Audit-Temp,OU=LegacyGroups,DC=corp,DC=identra,DC=net',
        daysEmpty: 142,
        deletableInTarget: true,
      },
      {
        id: 'gv-emp-2',
        objectName: 'SAP:Z_FI_LEGACY_MIGRATION_2024',
        objectType: 'Entitlement',
        detail:
          'Imported from SAP S/4HANA Finance with 0 assigned users for 218 days following ERP chart-of-accounts cutover.',
        detectedAt: '2026-11-25 06:15',
        suggestedFix: 'Trigger SAP BAPI / SCIM role deletion task',
        resolved: false,
        emptyEntitlementId: 'emp-ent-2',
        targetSystem: 'SAP S/4HANA Finance',
        technicalId: 'AGR_NAME=Z_FI_LEGACY_MIGRATION_2024',
        daysEmpty: 218,
        deletableInTarget: true,
      },
      {
        id: 'gv-emp-3',
        objectName: 'AWS-Sandbox-Legacy-ReadOnly',
        objectType: 'Entitlement',
        detail:
          'Imported from AWS Prod Vault (IAM Identity Center) with 0 principals bound for 95 days; legacy sandbox account retired.',
        detectedAt: '2026-11-25 06:15',
        suggestedFix: 'Trigger AWS IAM Permission Set deletion task',
        resolved: false,
        emptyEntitlementId: 'emp-ent-3',
        targetSystem: 'AWS Prod Vault',
        technicalId: 'arn:aws:iam::904128301:policy/AWS-Sandbox-Legacy-ReadOnly',
        daysEmpty: 95,
        deletableInTarget: true,
      },
      {
        id: 'gv-emp-4',
        objectName: 'SF_ROLE_TEMP_MIGRATION_Q1',
        objectType: 'Entitlement',
        detail:
          'Imported from Snowflake PII Lake with 0 granted users or parent roles for 64 days since Q1 warehouse backfill completed.',
        detectedAt: '2026-11-25 06:15',
        suggestedFix: 'Trigger Snowflake DROP ROLE deletion task',
        resolved: false,
        emptyEntitlementId: 'emp-ent-4',
        targetSystem: 'Snowflake PII Lake',
        technicalId: 'SNOWFLAKE.ROLE.SF_ROLE_TEMP_MIGRATION_Q1',
        daysEmpty: 64,
        deletableInTarget: true,
      },
      {
        id: 'gv-emp-5',
        objectName: 'ENTRA-GRP-DECOMM-SHAREPOINT',
        objectType: 'Entitlement',
        detail:
          'Imported from Microsoft Entra ID with 0 members for 187 days; backing SharePoint site collection archived.',
        detectedAt: '2026-11-25 06:15',
        suggestedFix: 'Trigger Microsoft Graph DELETE /groups/{id} task',
        resolved: false,
        emptyEntitlementId: 'emp-ent-5',
        targetSystem: 'Microsoft Entra ID',
        technicalId: 'aad-grp-9f41b2c8-decomm-spo-01',
        daysEmpty: 187,
        deletableInTarget: true,
      },
      {
        id: 'gv-emp-6',
        objectName: 'SG-BuiltIn-Emergency-BreakGlass',
        objectType: 'Entitlement',
        detail:
          'Imported from Active Directory with 0 standing members (410 days empty). Marked as Protected Break-Glass object — target deletion disabled.',
        detectedAt: '2026-11-25 06:15',
        suggestedFix: 'Approve Standing Governance Exception (Protected Break-Glass)',
        resolved: false,
        emptyEntitlementId: 'emp-ent-6',
        targetSystem: 'Active Directory',
        technicalId: 'CN=SG-BuiltIn-Emergency-BreakGlass,OU=Tier0,DC=corp,DC=identra,DC=net',
        daysEmpty: 410,
        deletableInTarget: false,
        nonDeletableReason:
          'Protected Tier-0 Break-Glass group (zero standing members by design). Target-system deletion is blocked; approve a Governance Exception instead.',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Role Mining Engine (Clustering, Correlation, Outliers, Simulation & Opt)   */
/* -------------------------------------------------------------------------- */

export interface MinedEntitlementSupport {
  name: string;
  application: string;
  technicalId: string;
  supportPct: number; // % of identities in this cluster holding this entitlement
}

export interface RoleSimulationIdentityImpact {
  id: string;
  name: string;
  employeeNumber: string;
  title: string;
  location: string;
  existingEntitlementsCount: number;
  netNewEntitlements: string[];
  sodStatus: 'Clean' | 'Blocked';
}

export interface DemoMinedRoleCandidate {
  id: string;
  code: string;
  suggestedRoleName: string;
  roleKind: 'Business Role' | 'IT Role';
  confidenceScore: number; // 0-100
  matchedIdentitiesCount: number;
  analyzedPopulation: number;
  attributes: { label: string; value: string }[];
  entitlements: MinedEntitlementSupport[];
  directGrantsReplaced: number;
  sodCheck: 'Passed (0 Conflicts)' | 'Requires Review';
  status: 'Recommended' | 'Promoted' | 'Dismissed';
  simulationSample: RoleSimulationIdentityImpact[];
}

export interface DemoEntitlementCorrelation {
  id: string;
  clusterCode: string;
  suggestedRoleName: string;
  entitlements: string[];
  coOccurrencePct: number;
  identityCount: number;
  liftScore: string;
}

export interface DemoMiningOutlier {
  id: string;
  identityName: string;
  employeeNumber: string;
  peerCluster: string;
  outlierEntitlement: string;
  application: string;
  peerPrevalencePct: number; // e.g. 3% (1 of 34 peers)
  peerRatioLabel: string;
  riskScore: number;
  reason: string;
  status: 'Flagged' | 'Revoked' | 'Sent to Review';
}

export interface DemoRoleOptimisationItem {
  id: string;
  category: 'Overlapping' | 'Redundant' | 'Underutilised';
  primaryRole: string;
  comparedRole?: string;
  overlapPct: number;
  membersAffected: number;
  entitlementsSaved: number;
  recommendation: string;
  status: 'Open' | 'Optimised';
}

export const INITIAL_MINED_ROLES: DemoMinedRoleCandidate[] = [
  {
    id: 'rm-fin-jhb',
    code: 'RM-001',
    suggestedRoleName: 'Finance – Financial Accountant',
    roleKind: 'Business Role',
    confidenceScore: 96,
    matchedIdentitiesCount: 34,
    analyzedPopulation: 500,
    attributes: [
      { label: 'Department', value: 'Finance' },
      { label: 'Job title', value: 'Financial Accountant' },
      { label: 'Location', value: 'Johannesburg' },
    ],
    entitlements: [
      {
        name: 'SAP Finance',
        application: 'SAP S/4HANA Finance',
        technicalId: 'SAP_ROLE: Z_FI_GL_ACCOUNTANT_JHB',
        supportPct: 100,
      },
      {
        name: 'SharePoint Finance',
        application: 'Microsoft 365 SharePoint',
        technicalId: 'SPO_SITE: /sites/finance-za-members',
        supportPct: 97,
      },
      {
        name: 'Finance Reporting',
        application: 'Power BI / Reporting Suite',
        technicalId: 'PBI_WORKSPACE: FIN_STATUTORY_REPORTING',
        supportPct: 94,
      },
      {
        name: 'Finance Shared Drive',
        application: 'Active Directory',
        technicalId: 'CN=SG-Finance-SharedDrive-JHB,OU=Finance,DC=identra,DC=corp',
        supportPct: 94,
      },
    ],
    directGrantsReplaced: 131,
    sodCheck: 'Passed (0 Conflicts)',
    status: 'Recommended',
    simulationSample: [
      {
        id: 'sim-1',
        name: 'Lerato Dlamini',
        employeeNumber: 'EMP-11204',
        title: 'Financial Accountant',
        location: 'Johannesburg',
        existingEntitlementsCount: 4,
        netNewEntitlements: [],
        sodStatus: 'Clean',
      },
      {
        id: 'sim-2',
        name: 'Pieter van der Merwe',
        employeeNumber: 'EMP-11219',
        title: 'Financial Accountant',
        location: 'Johannesburg',
        existingEntitlementsCount: 3,
        netNewEntitlements: ['Finance Reporting'],
        sodStatus: 'Clean',
      },
      {
        id: 'sim-3',
        name: 'Aisha Patel',
        employeeNumber: 'EMP-11242',
        title: 'Financial Accountant',
        location: 'Johannesburg',
        existingEntitlementsCount: 3,
        netNewEntitlements: ['Finance Shared Drive'],
        sodStatus: 'Clean',
      },
      {
        id: 'sim-4',
        name: 'Sipho Ndlovu',
        employeeNumber: 'EMP-11288',
        title: 'Financial Accountant',
        location: 'Johannesburg',
        existingEntitlementsCount: 2,
        netNewEntitlements: ['SharePoint Finance', 'Finance Reporting'],
        sodStatus: 'Clean',
      },
    ],
  },
  {
    id: 'rm-eng-sre',
    code: 'RM-002',
    suggestedRoleName: 'Engineering – Cloud Platform SRE',
    roleKind: 'Business Role',
    confidenceScore: 93,
    matchedIdentitiesCount: 28,
    analyzedPopulation: 500,
    attributes: [
      { label: 'Department', value: 'Platform & Cloud Engineering' },
      { label: 'Job title', value: 'Platform Engineer' },
      { label: 'Location', value: 'Cape Town / London' },
    ],
    entitlements: [
      {
        name: 'AWS Prod Read-Only',
        application: 'AWS Prod Vault',
        technicalId: 'AWS_PERM_SET: arn:aws:sso:::permissionSet/prod-ro',
        supportPct: 100,
      },
      {
        name: 'GitHub Enterprise Org Member',
        application: 'GitHub Enterprise',
        technicalId: 'GH_TEAM: identra/platform-sre',
        supportPct: 96,
      },
      {
        name: 'Kubernetes Non-Prod Deploy',
        application: 'AWS Prod Vault',
        technicalId: 'EKS_RBAC: cluster-staging-deployer',
        supportPct: 89,
      },
      {
        name: 'Observability Telemetry Read',
        application: 'Okta Workforce Cloud',
        technicalId: 'APP_ROLE: Datadog-SRE-Viewer',
        supportPct: 89,
      },
    ],
    directGrantsReplaced: 105,
    sodCheck: 'Passed (0 Conflicts)',
    status: 'Recommended',
    simulationSample: [
      {
        id: 'sim-5',
        name: 'Priya Nair',
        employeeNumber: 'EMP-10105',
        title: 'Principal Platform Engineer',
        location: 'London, UK (HQ)',
        existingEntitlementsCount: 4,
        netNewEntitlements: [],
        sodStatus: 'Clean',
      },
      {
        id: 'sim-6',
        name: 'Ruan Botha',
        employeeNumber: 'EMP-11310',
        title: 'Platform Engineer',
        location: 'Cape Town',
        existingEntitlementsCount: 3,
        netNewEntitlements: ['Observability Telemetry Read'],
        sodStatus: 'Clean',
      },
      {
        id: 'sim-7',
        name: 'Zanele Khumalo',
        employeeNumber: 'EMP-11327',
        title: 'Platform Engineer',
        location: 'Cape Town',
        existingEntitlementsCount: 3,
        netNewEntitlements: ['Kubernetes Non-Prod Deploy'],
        sodStatus: 'Clean',
      },
    ],
  },
  {
    id: 'rm-it-sd2',
    code: 'RM-003',
    suggestedRoleName: 'IT – Service Desk Tier 2 Support',
    roleKind: 'IT Role',
    confidenceScore: 91,
    matchedIdentitiesCount: 22,
    analyzedPopulation: 500,
    attributes: [
      { label: 'Department', value: 'IT Operations' },
      { label: 'Job title', value: 'Support Analyst' },
      { label: 'Location', value: 'Johannesburg' },
    ],
    entitlements: [
      {
        name: 'AD Password Reset Delegated',
        application: 'Active Directory',
        technicalId: 'CN=SG-IT-Helpdesk-PwdReset,OU=IT,DC=identra,DC=corp',
        supportPct: 100,
      },
      {
        name: 'Entra ID Helpdesk Administrator',
        application: 'Microsoft Entra ID',
        technicalId: 'ENTRA_ROLE: 729827e3-9c14-49f7-bb1b-9608f156bbb8',
        supportPct: 95,
      },
      {
        name: 'ServiceNow Incident Resolver',
        application: 'Okta Workforce Cloud',
        technicalId: 'SNOW_GROUP: IT_Tier2_Resolvers',
        supportPct: 91,
      },
      {
        name: 'Intune Endpoint Diagnostics',
        application: 'Microsoft Entra ID',
        technicalId: 'INTUNE_ROLE: Endpoint-Helpdesk-Read',
        supportPct: 82,
      },
    ],
    directGrantsReplaced: 81,
    sodCheck: 'Passed (0 Conflicts)',
    status: 'Recommended',
    simulationSample: [
      {
        id: 'sim-8',
        name: 'Kabelo Maseko',
        employeeNumber: 'EMP-11402',
        title: 'Support Analyst',
        location: 'Johannesburg',
        existingEntitlementsCount: 4,
        netNewEntitlements: [],
        sodStatus: 'Clean',
      },
      {
        id: 'sim-9',
        name: 'Chantal Pretorius',
        employeeNumber: 'EMP-11415',
        title: 'Support Analyst',
        location: 'Johannesburg',
        existingEntitlementsCount: 3,
        netNewEntitlements: ['Intune Endpoint Diagnostics'],
        sodStatus: 'Clean',
      },
    ],
  },
  {
    id: 'rm-sls-ae',
    code: 'RM-004',
    suggestedRoleName: 'Sales – Enterprise Account Executive',
    roleKind: 'Business Role',
    confidenceScore: 86,
    matchedIdentitiesCount: 41,
    analyzedPopulation: 500,
    attributes: [
      { label: 'Department', value: 'Enterprise Sales' },
      { label: 'Job title', value: 'Account Executive' },
      { label: 'Location', value: 'Johannesburg / New York' },
    ],
    entitlements: [
      {
        name: 'Salesforce CRM Enterprise',
        application: 'Salesforce CRM',
        technicalId: 'SFDC_PERMSET: Enterprise_AE_Core',
        supportPct: 98,
      },
      {
        name: 'Deal Desk Quote Portal',
        application: 'Okta Workforce Cloud',
        technicalId: 'APP_ROLE: DealDesk-Submitter',
        supportPct: 85,
      },
      {
        name: 'Revenue BI Dashboard',
        application: 'Snowflake PII Lake',
        technicalId: 'GRANT SELECT ON VIEW ANALYTICS.PIPELINE_SUMMARY',
        supportPct: 78,
      },
    ],
    directGrantsReplaced: 107,
    sodCheck: 'Passed (0 Conflicts)',
    status: 'Recommended',
    simulationSample: [
      {
        id: 'sim-10',
        name: 'John Davies',
        employeeNumber: 'EMP-10394',
        title: 'Enterprise Account Director',
        location: 'New York, US',
        existingEntitlementsCount: 3,
        netNewEntitlements: [],
        sodStatus: 'Clean',
      },
      {
        id: 'sim-11',
        name: 'Nomsa Zulu',
        employeeNumber: 'EMP-11490',
        title: 'Account Executive',
        location: 'Johannesburg',
        existingEntitlementsCount: 2,
        netNewEntitlements: ['Revenue BI Dashboard'],
        sodStatus: 'Clean',
      },
    ],
  },
];

export const INITIAL_ENTITLEMENT_CORRELATIONS: DemoEntitlementCorrelation[] = [
  {
    id: 'corr-1',
    clusterCode: 'RM-001',
    suggestedRoleName: 'Finance – Financial Accountant',
    entitlements: ['SAP Finance', 'SharePoint Finance', 'Finance Reporting', 'Finance Shared Drive'],
    coOccurrencePct: 94,
    identityCount: 34,
    liftScore: '6.8×',
  },
  {
    id: 'corr-2',
    clusterCode: 'RM-002',
    suggestedRoleName: 'Engineering – Cloud Platform SRE',
    entitlements: ['AWS Prod Read-Only', 'GitHub Enterprise Org Member', 'Kubernetes Non-Prod Deploy', 'Observability Telemetry Read'],
    coOccurrencePct: 89,
    identityCount: 28,
    liftScore: '5.9×',
  },
  {
    id: 'corr-3',
    clusterCode: 'RM-003',
    suggestedRoleName: 'IT – Service Desk Tier 2 Support',
    entitlements: ['AD Password Reset Delegated', 'Entra ID Helpdesk Administrator', 'ServiceNow Incident Resolver', 'Intune Endpoint Diagnostics'],
    coOccurrencePct: 86,
    identityCount: 22,
    liftScore: '7.4×',
  },
  {
    id: 'corr-4',
    clusterCode: 'RM-004',
    suggestedRoleName: 'Sales – Enterprise Account Executive',
    entitlements: ['Salesforce CRM Enterprise', 'Deal Desk Quote Portal', 'Revenue BI Dashboard'],
    coOccurrencePct: 81,
    identityCount: 41,
    liftScore: '4.7×',
  },
];

export const INITIAL_MINING_OUTLIERS: DemoMiningOutlier[] = [
  {
    id: 'out-1',
    identityName: 'Thabo Mokoena',
    employeeNumber: 'EMP-11209',
    peerCluster: 'Finance · Financial Accountant · Johannesburg (34 peers)',
    outlierEntitlement: 'SAP:FI_WIRE_APPROVE_50K',
    application: 'SAP S/4HANA Finance',
    peerPrevalencePct: 3,
    peerRatioLabel: '1 of 34 peers',
    riskScore: 89,
    reason: 'Holds Tier-0 Treasury wire release authority while 97% of Financial Accountant peers only hold base SAP Finance.',
    status: 'Flagged',
  },
  {
    id: 'out-2',
    identityName: 'Elena Vance',
    employeeNumber: 'EMP-10219',
    peerCluster: 'Finance · Treasury Operations · London (12 peers)',
    outlierEntitlement: 'SAP:FI_VENDOR_CREATE',
    application: 'SAP S/4HANA Finance',
    peerPrevalencePct: 8,
    peerRatioLabel: '1 of 12 peers',
    riskScore: 86,
    reason: 'Retained legacy Accounts Payable vendor creation grant after department transfer; triggers SOX-SOD-402.',
    status: 'Flagged',
  },
  {
    id: 'out-3',
    identityName: 'Kagiso Sithole',
    employeeNumber: 'EMP-11408',
    peerCluster: 'IT Operations · Support Analyst · Johannesburg (22 peers)',
    outlierEntitlement: 'SG-Domain-Tier1-ServerAdmins',
    application: 'Active Directory',
    peerPrevalencePct: 5,
    peerRatioLabel: '1 of 22 peers',
    riskScore: 84,
    reason: 'Standing Tier-1 AD server admin privilege granted via ad-hoc ticket; 95% of Tier 2 Support peers do not hold this group.',
    status: 'Flagged',
  },
  {
    id: 'out-4',
    identityName: 'Nomsa Zulu',
    employeeNumber: 'EMP-11490',
    peerCluster: 'Enterprise Sales · Account Executive · Johannesburg (41 peers)',
    outlierEntitlement: 'SNOWFLAKE:RAW_PII_SELECT',
    application: 'Snowflake PII Lake',
    peerPrevalencePct: 2,
    peerRatioLabel: '1 of 41 peers',
    riskScore: 82,
    reason: 'Direct unmasked customer PII query access far outside standard Account Executive Revenue BI scope.',
    status: 'Flagged',
  },
];

export const INITIAL_ROLE_OPTIMISATIONS: DemoRoleOptimisationItem[] = [
  {
    id: 'opt-1',
    category: 'Overlapping',
    primaryRole: 'Finance: JHB General Ledger',
    comparedRole: 'Finance: Base Ledger Read',
    overlapPct: 92,
    membersAffected: 34,
    entitlementsSaved: 11,
    recommendation:
      'Merge overlapping JHB General Ledger role into the newly mined "Finance – Financial Accountant" business role.',
    status: 'Open',
  },
  {
    id: 'opt-2',
    category: 'Redundant',
    primaryRole: 'Sales: Regional Pipeline Viewer (Legacy)',
    comparedRole: 'Sales: Regional CRM Lead',
    overlapPct: 100,
    membersAffected: 19,
    entitlementsSaved: 6,
    recommendation:
      '100% entitlement subset of Regional CRM Lead — retire duplicate legacy role and remap 19 members automatically.',
    status: 'Open',
  },
  {
    id: 'opt-3',
    category: 'Underutilised',
    primaryRole: 'IT: Legacy VPN Contractors 2023',
    overlapPct: 14,
    membersAffected: 2,
    entitlementsSaved: 5,
    recommendation:
      'Only 2 members remaining across 500 identities (0 logins in 120d) — archive role and transition to B2B birthright.',
    status: 'Open',
  },
  {
    id: 'opt-4',
    category: 'Overlapping',
    primaryRole: 'Engineering: AWS Staging DevOps',
    comparedRole: 'Prod K8s Operator (JIT)',
    overlapPct: 84,
    membersAffected: 28,
    entitlementsSaved: 9,
    recommendation:
      'Consolidate shared AWS/GitHub baseline into "Engineering – Cloud Platform SRE" and keep Prod K8s strictly JIT.',
    status: 'Open',
  },
];

/* -------------------------------------------------------------------------- */
/* Contractor Onboarding & Entitlement Onboarding Processes                   */
/* -------------------------------------------------------------------------- */

export interface OnboardingApprovalStage {
  step: string;
  approverRole: string;
  assignee: string;
  status: 'Approved' | 'Pending' | 'Queued' | 'Rejected';
  decidedAt?: string;
}

export interface OnboardingWorkflowOption {
  id: string;
  code: string;
  name: string;
  description: string;
  tierRequirement?: 'Any' | 'Elevated / Critical';
  stages: { approverRole: string; assignee: string }[];
}

export const CONTRACTOR_ONBOARDING_WORKFLOWS: OnboardingWorkflowOption[] = [
  {
    id: 'wf-ctr-sponsor',
    code: 'WF-CTR-01',
    name: 'Sponsor Approval Only',
    description: 'Single-stage sign-off by the accountable internal sponsor (for standard ≤90d engagements).',
    tierRequirement: 'Any',
    stages: [{ approverRole: 'Internal Sponsor Approval', assignee: 'Selected Sponsor' }],
  },
  {
    id: 'wf-ctr-sponsor-iam',
    code: 'WF-CTR-02',
    name: 'Sponsor → IAM & Security Governance',
    description: 'Two-stage workflow combining sponsor verification with IAM least-privilege review.',
    tierRequirement: 'Any',
    stages: [
      { approverRole: 'Internal Sponsor Approval', assignee: 'Selected Sponsor' },
      { approverRole: 'IAM & Security Governance', assignee: 'Platform Security' },
    ],
  },
  {
    id: 'wf-ctr-tier0',
    code: 'WF-CTR-03',
    name: 'Sponsor → Vendor Procurement → InfoSec (Tier-0)',
    description: 'Three-stage high-assurance approval required for >90d or privileged vendor engagements.',
    tierRequirement: 'Elevated / Critical',
    stages: [
      { approverRole: 'Internal Sponsor Approval', assignee: 'Selected Sponsor' },
      { approverRole: 'Vendor Procurement Check', assignee: 'Third-Party Risk Office' },
      { approverRole: 'InfoSec Tier-0 Sign-Off', assignee: 'CISO Assurance Desk' },
    ],
  },
  {
    id: 'wf-ctr-dept-iam',
    code: 'WF-CTR-04',
    name: 'Department Head → IAM Operations',
    description: 'Executive department approval followed by automated B2B federation readiness check.',
    tierRequirement: 'Any',
    stages: [
      { approverRole: 'Department Head Approval', assignee: 'Department Executive' },
      { approverRole: 'IAM Operations Verification', assignee: 'Identity Operations' },
    ],
  },
];

export const ENTITLEMENT_ONBOARDING_WORKFLOWS: OnboardingWorkflowOption[] = [
  {
    id: 'wf-ent-app',
    code: 'WF-ENT-01',
    name: 'Application Owner Approval',
    description: 'Single-stage sign-off by the connected system owner (Standard sensitivity only).',
    tierRequirement: 'Any',
    stages: [{ approverRole: 'Application Owner Approval', assignee: 'Application Owner' }],
  },
  {
    id: 'wf-ent-owner-app',
    code: 'WF-ENT-02',
    name: 'Entitlement Owner → Application Owner',
    description: 'Two-stage validation confirming both business ownership and target system schema.',
    tierRequirement: 'Any',
    stages: [
      { approverRole: 'Entitlement Owner Sign-Off', assignee: 'Selected Owner' },
      { approverRole: 'Application Owner Approval', assignee: 'Target App Owner' },
    ],
  },
  {
    id: 'wf-ent-sec-sod',
    code: 'WF-ENT-03',
    name: 'App Owner → Security & SoD Governance',
    description: 'Required for High/Critical privileges to validate SoD conflict matrices before onboarding.',
    tierRequirement: 'Elevated / Critical',
    stages: [
      { approverRole: 'Application Owner Approval', assignee: 'Target App Owner' },
      { approverRole: 'Security & SoD Risk Review', assignee: 'Governance Assurance Team' },
    ],
  },
  {
    id: 'wf-ent-sox',
    code: 'WF-ENT-04',
    name: 'App Owner → SOX Control Owner → IAM Architecture',
    description: 'Three-stage regulated financial/Tier-0 workflow sealing full SOX 404 evidence.',
    tierRequirement: 'Elevated / Critical',
    stages: [
      { approverRole: 'Application Owner Approval', assignee: 'Target App Owner' },
      { approverRole: 'SOX Control Owner Approval', assignee: 'David Chen (Controller Office)' },
      { approverRole: 'IAM Architecture Board', assignee: 'Principal IAM Architect' },
    ],
  },
];

export interface DemoContractorOnboardingRequest {
  id: string;
  requestCode: string;
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
  workflowCode: string;
  workflowName: string;
  stages: OnboardingApprovalStage[];
  status: 'Pending Approval' | 'Approved & Created' | 'Rejected';
  submittedAt: string;
  createdPersonId?: string;
}

export interface DemoEntitlementOnboardingRequest {
  id: string;
  requestCode: string;
  entitlementName: string;
  technicalId: string;
  application: string;
  entitlementType:
    | 'AD Security Group'
    | 'SAP Role'
    | 'AWS Permission Set'
    | 'Snowflake Privilege'
    | 'Entra ID License'
    | 'App Permission';
  owner: string;
  sensitivity: 'Standard' | 'High' | 'Critical';
  recertificationDays: 90 | 180 | 365;
  requestableInCatalog: boolean;
  sodChecked: boolean;
  sodConflictNote?: string;
  description: string;
  workflowId: string;
  workflowCode: string;
  workflowName: string;
  stages: OnboardingApprovalStage[];
  status: 'Pending Approval' | 'Approved & Created' | 'Rejected';
  submittedAt: string;
  createdEntitlementId?: string;
}

export const INITIAL_CONTRACTOR_REQUESTS: DemoContractorOnboardingRequest[] = [
  {
    id: 'ctr-req-1',
    requestCode: 'CTR-REQ-401',
    firstName: 'Thandi',
    lastName: 'Khumalo',
    email: 'thandi.khumalo@vanguard-ext.co.za',
    vendorCompany: 'Vanguard External Assurance LLP',
    title: 'Cloud Compliance Specialist',
    department: 'External Assurance & Contractors',
    departmentRefId: 'dept-contractor',
    costCenterCode: 'CC-9001-EXT',
    location: 'Johannesburg (Hybrid / B2B)',
    sponsorName: 'Priya Nair',
    sponsorRefId: 'mgr-priya',
    startDate: '2026-11-25',
    endDate: '2027-02-23',
    durationDays: 90,
    ndaVerified: true,
    justification: 'Q1 ISO 27001 cloud control evidence audit across AWS non-prod and Snowflake reporting.',
    workflowId: 'wf-ctr-sponsor-iam',
    workflowCode: 'WF-CTR-02',
    workflowName: 'Sponsor → IAM & Security Governance',
    stages: [
      {
        step: 'Stage 1',
        approverRole: 'Internal Sponsor Approval',
        assignee: 'Priya Nair',
        status: 'Approved',
        decidedAt: '2026-11-24 09:12',
      },
      {
        step: 'Stage 2',
        approverRole: 'IAM & Security Governance',
        assignee: 'Platform Security',
        status: 'Pending',
      },
    ],
    status: 'Pending Approval',
    submittedAt: '2026-11-24 08:50',
  },
];

export const INITIAL_ENTITLEMENT_REQUESTS: DemoEntitlementOnboardingRequest[] = [
  {
    id: 'ent-req-1',
    requestCode: 'ENT-REQ-809',
    entitlementName: 'SAP:FI_STATUTORY_AUDIT_RO',
    technicalId: 'SAP_ROLE: Z_FI_STATUTORY_AUDIT_READONLY',
    application: 'SAP S/4HANA Finance',
    entitlementType: 'SAP Role',
    owner: 'Claire Vance',
    sensitivity: 'High',
    recertificationDays: 90,
    requestableInCatalog: true,
    sodChecked: true,
    sodConflictNote: 'Read-only scope verified — 0 SOX-SOD-402 conflicts.',
    description:
      'Read-only statutory general ledger audit role for external auditors and Finance Operations reviewers in Johannesburg and London.',
    workflowId: 'wf-ent-sec-sod',
    workflowCode: 'WF-ENT-03',
    workflowName: 'App Owner → Security & SoD Governance',
    stages: [
      {
        step: 'Stage 1',
        approverRole: 'Application Owner Approval',
        assignee: 'ERP Governance Team',
        status: 'Approved',
        decidedAt: '2026-11-24 09:40',
      },
      {
        step: 'Stage 2',
        approverRole: 'Security & SoD Risk Review',
        assignee: 'Governance Assurance Team',
        status: 'Pending',
      },
    ],
    status: 'Pending Approval',
    submittedAt: '2026-11-24 09:15',
  },
];

/* -------------------------------------------------------------------------- */
/* Access Marketplace (IT Shop), Multi-Account Targets & Leave Delegation     */
/* -------------------------------------------------------------------------- */

export interface MarketplaceApproverStep {
  step: string;
  approverRole: string;
  approverName: string;
  approverRefId?: string;
  personId?: string;
  escalationBackup: string;
  status: 'Approved' | 'Pending' | 'Queued' | 'Escalated' | 'Rejected';
  delegatedTo?: string;
  decidedAt?: string;
}

export interface MarketplaceCatalogItem {
  id: string;
  code: string;
  name: string;
  kind: 'Business Role' | 'Entitlement' | 'AD Security Group' | 'Entra ID License' | 'JIT Elevation';
  application: string;
  category: 'Finance & ERP' | 'Cloud & DevOps' | 'Data & Analytics' | 'Collaboration & M365' | 'Commercial & CRM';
  sensitivity: 'Standard' | 'High' | 'Critical';
  ownerName: string;
  ownerRefId?: string;
  technicalId: string;
  description: string;
  includedPermissions: string[];
  supportsAccountSelection: boolean;
  recommendedAccountType?: 'Standard' | 'Admin';
  maxDurationDays?: number;
  sodConflictRoles?: string[]; // Conflicts if target identity holds any role matching these strings
  sodPolicyCode?: string;
  sodConflictReason?: string;
  workflowName: string;
  workflowCode: string;
  approvalTemplate: {
    approverRole: string;
    approverName: string;
    approverRefId?: string;
    escalationBackup: string;
  }[];
}

export interface PersonSelectableAccount {
  id: string;
  accountName: string;
  accountKind: 'Standard User' | 'Privileged Admin';
  directory: string;
  description: string;
}

export interface DemoAccessRequest {
  id: string;
  requestCode: string;
  requestedByName: string;
  requestedByPersonId: string;
  targetPersonId: string;
  targetPersonName: string;
  primaryContextId: string;
  primaryContextLabel: string;
  selectedAccountId: string;
  selectedAccountName: string;
  selectedAccountKind: 'Standard User' | 'Privileged Admin';
  catalogItemId: string;
  resourceName: string;
  resourceKind: MarketplaceCatalogItem['kind'];
  application: string;
  activationDate: string;
  deactivationDate: string | null;
  motivation: string;
  sodStatus: 'Clean' | 'Violation Flagged (Exception)' | 'Blocked';
  sodDetail?: string;
  workflowCode: string;
  workflowName: string;
  stages: MarketplaceApproverStep[];
  status: 'Pending Approval' | 'Approved & Provisioned' | 'Rejected';
  submittedAt: string;
  waitingHours: number;
  escalatedCount: number;
}

export interface LeaveDelegationConfig {
  enabled: boolean;
  delegatorPersonId: string;
  delegatorName: string;
  standInPersonId: string;
  standInName: string;
  standInRefId?: string;
  startDate: string;
  endDate: string;
  reason: string;
  delegateApprovals: boolean;
  delegateReviews: boolean;
  delegateOnboarding: boolean;
  updatedAt: string;
}

export const CURRENT_DEMO_USER_PERSON_ID = 'p-priya';

export function getSelectableAccountsForPerson(person: DemoPerson): PersonSelectableAccount[] {
  const baseAccounts: PersonSelectableAccount[] = [
    {
      id: `${person.id}-std`,
      accountName: person.upn,
      accountKind: 'Standard User',
      directory: 'Active Directory / Entra ID (Standard)',
      description: 'Day-to-day corporate user account for standard business apps & SSO.',
    },
  ];

  // Provide dedicated Privileged Admin account option for eligible engineering, finance, data, and sales leads
  if (person.type === 'Employee' && person.jmlStatus !== 'Deactivated') {
    baseAccounts.push({
      id: `${person.id}-adm`,
      accountName: `adm-${person.samAccountName}@priv.identra.net`,
      accountKind: 'Privileged Admin',
      directory: 'Tier-0 Privileged Access Directory (PAW)',
      description: 'Dedicated administrative account for elevated infrastructure, ERP, or PII operations (FIDO2 required).',
    });
  }

  return baseAccounts;
}

export const INITIAL_MARKETPLACE_CATALOG: MarketplaceCatalogItem[] = [
  {
    id: 'cat-fin-ap',
    code: 'CAT-101',
    name: 'Finance: AP-Clerk',
    kind: 'Business Role',
    application: 'SAP S/4HANA Finance',
    category: 'Finance & ERP',
    sensitivity: 'Critical',
    ownerName: 'Claire Vance',
    ownerRefId: 'mgr-claire',
    technicalId: 'SAP_ROLE: Z_FI_AP_VENDOR_CREATE',
    description:
      'Accounts Payable business role enabling supplier master onboarding, invoice entry, and AP sub-ledger reconciliation.',
    includedPermissions: [
      'SAP T-Code XK01 / BP (Vendor Master Maintenance)',
      'SAP T-Code FB60 (Post Vendor Invoices)',
      'AD Group: SG-Finance-AP-Specialists',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Standard',
    sodConflictRoles: ['Treasury: Payment Approver'],
    sodPolicyCode: 'SOX-SOD-402',
    sodConflictReason:
      'Mutually exclusive with Treasury: Payment Approver (forbids vendor creation + outbound wire release).',
    workflowName: 'Manager → SOX Control Owner Approval',
    workflowCode: 'WF-REQ-SOX-01',
    approvalTemplate: [
      {
        approverRole: 'Line Manager Approval',
        approverName: 'Target Manager',
        escalationBackup: 'David Chen (Treasury Director)',
      },
      {
        approverRole: 'SOX Control Owner Approval',
        approverName: 'David Chen',
        approverRefId: 'mgr-david',
        escalationBackup: 'Controller Office',
      },
    ],
  },
  {
    id: 'cat-treasury-pay',
    code: 'CAT-102',
    name: 'Treasury: Payment Approver',
    kind: 'Business Role',
    application: 'SAP S/4HANA Finance',
    category: 'Finance & ERP',
    sensitivity: 'Critical',
    ownerName: 'David Chen',
    ownerRefId: 'mgr-david',
    technicalId: 'SAP_ROLE: Z_TR_WIRE_APPROVE_50K',
    description:
      'Authorizes dual-signature outbound supplier wire release above R50k in SAP S/4HANA Treasury.',
    includedPermissions: [
      'SAP T-Code F110 (Payment Run Approval)',
      'Dual-Signature Treasury Wire Release (>R50k)',
      'FIDO2 Step-Up Authentication Enforcement',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Admin',
    sodConflictRoles: ['Finance: AP-Clerk'],
    sodPolicyCode: 'SOX-SOD-402',
    sodConflictReason:
      'Cannot be granted to holders of Finance: AP-Clerk under SOX-404 Segregation of Duties.',
    workflowName: 'Manager → Entitlement Owner → SOX Control',
    workflowCode: 'WF-REQ-SOX-02',
    approvalTemplate: [
      {
        approverRole: 'Line Manager Approval',
        approverName: 'Target Manager',
        escalationBackup: 'Claire Vance',
      },
      {
        approverRole: 'Entitlement Owner Approval',
        approverName: 'David Chen',
        approverRefId: 'mgr-david',
        escalationBackup: 'Controller Office',
      },
      {
        approverRole: 'Security & SOX Sign-Off',
        approverName: 'Priya Nair',
        approverRefId: 'mgr-priya',
        escalationBackup: 'Alex Carter',
      },
    ],
  },
  {
    id: 'cat-aws-k8s',
    code: 'CAT-103',
    name: 'AWS Prod Vault · EKS Cluster Admin (JIT)',
    kind: 'JIT Elevation',
    application: 'AWS Prod Vault',
    category: 'Cloud & DevOps',
    sensitivity: 'Critical',
    ownerName: 'Alex Carter',
    ownerRefId: 'mgr-alex',
    technicalId: 'AWS_PERM_SET: arn:aws:sso:::permissionSet/eks-prod-admin-jit',
    description:
      'Time-bound production Kubernetes cluster administration via AWS IAM Identity Center with full session recording.',
    includedPermissions: [
      'EKS:ProdClusterAdmin (Session-Recorded)',
      'AWS CloudWatch & Pod Diagnostics',
      'Mandatory Privileged Admin Account Binding',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Admin',
    maxDurationDays: 30,
    sodConflictRoles: ['External B2B Guest Profile', 'Suspended Contractor Profile'],
    sodPolicyCode: 'ACC-JIT-118',
    sodConflictReason:
      'External contractor profiles cannot hold direct Tier-0 AWS Production Cluster Admin.',
    workflowName: 'Manager → Cloud App Owner Approval',
    workflowCode: 'WF-REQ-CLD-03',
    approvalTemplate: [
      {
        approverRole: 'Line Manager Approval',
        approverName: 'Target Manager',
        escalationBackup: 'Alex Carter',
      },
      {
        approverRole: 'Application Owner (AWS Prod Vault)',
        approverName: 'Alex Carter',
        approverRefId: 'mgr-alex',
        escalationBackup: 'Priya Nair',
      },
    ],
  },
  {
    id: 'cat-sf-pii',
    code: 'CAT-104',
    name: 'Snowflake: Customer Analytics Masked Read',
    kind: 'Entitlement',
    application: 'Snowflake PII Lake',
    category: 'Data & Analytics',
    sensitivity: 'High',
    ownerName: 'Hannah Lindqvist',
    ownerRefId: 'mgr-cdo',
    technicalId: 'SNOWFLAKE_ROLE: ANALYTICS_MASKED_READER',
    description:
      'GDPR-compliant read access to masked customer datasets with dynamic PII tokenization enabled.',
    includedPermissions: [
      'SELECT on PROD_ANALYTICS.MASKED_CUSTOMERS',
      'Dynamic PII Masking Policy Enforced',
      'Query Audit Trail Export to SIEM',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Standard',
    workflowName: 'Manager → Data Owner Approval',
    workflowCode: 'WF-REQ-DAT-04',
    approvalTemplate: [
      {
        approverRole: 'Line Manager Approval',
        approverName: 'Target Manager',
        escalationBackup: 'Hannah Lindqvist',
      },
      {
        approverRole: 'Data Owner Approval (Snowflake)',
        approverName: 'Hannah Lindqvist',
        approverRefId: 'mgr-cdo',
        escalationBackup: 'Lucas Meyer',
      },
    ],
  },
  {
    id: 'cat-m365-copilot',
    code: 'CAT-105',
    name: 'Microsoft 365 Copilot Enterprise',
    kind: 'Entra ID License',
    application: 'Microsoft Entra ID',
    category: 'Collaboration & M365',
    sensitivity: 'Standard',
    ownerName: 'Claire Vance',
    ownerRefId: 'mgr-claire',
    technicalId: 'SKU: Microsoft_365_Copilot (R550/mo)',
    description:
      'Enterprise AI productivity license across Teams, Excel, Word, and Outlook scoped strictly to user ACLs.',
    includedPermissions: [
      'Copilot for Microsoft 365 Apps (R550/mo)',
      'Enterprise Commercial Data Protection',
      '90-Day Usage Telemetry Reclamation Policy',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Standard',
    workflowName: 'Manager Approval Only',
    workflowCode: 'WF-REQ-MGR-05',
    approvalTemplate: [
      {
        approverRole: 'Line Manager Approval',
        approverName: 'Target Manager',
        escalationBackup: 'Claire Vance',
      },
    ],
  },
  {
    id: 'cat-ad-sec-ops',
    code: 'CAT-106',
    name: 'SG-Tier1-Server-Operators',
    kind: 'AD Security Group',
    application: 'Active Directory',
    category: 'Cloud & DevOps',
    sensitivity: 'High',
    ownerName: 'Priya Nair',
    ownerRefId: 'mgr-priya',
    technicalId: 'CN=SG-Tier1-Server-Operators,OU=Infra,DC=identra,DC=corp',
    description:
      'Delegated server operator security group for patching, service restarts, and event log diagnostics.',
    includedPermissions: [
      'Restart Windows Services on OU=Tier1-Servers',
      'Read Security & Application Event Logs',
      'Recommended for Privileged Admin Account',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Admin',
    maxDurationDays: 90,
    workflowName: 'Manager → Entitlement Owner Approval',
    workflowCode: 'WF-REQ-AD-06',
    approvalTemplate: [
      {
        approverRole: 'Line Manager Approval',
        approverName: 'Target Manager',
        escalationBackup: 'Alex Carter',
      },
      {
        approverRole: 'Entitlement Owner (AD Infra)',
        approverName: 'Priya Nair',
        approverRefId: 'mgr-priya',
        escalationBackup: 'Alex Carter',
      },
    ],
  },
  {
    id: 'cat-gh-maint',
    code: 'CAT-107',
    name: 'GitHub Enterprise · Core Repo Maintainer',
    kind: 'Business Role',
    application: 'GitHub Enterprise',
    category: 'Cloud & DevOps',
    sensitivity: 'High',
    ownerName: 'Alex Carter',
    ownerRefId: 'mgr-alex',
    technicalId: 'GH_TEAM: identra/core-platform-maintainers',
    description:
      'Grants branch protection review, release tag publishing, and workflow dispatch on core repositories.',
    includedPermissions: [
      'Pull Request Merge Approval on protected branches',
      'Release Pipeline Dispatch & Tag Signing',
      'Read-Only Repository Security Advisories',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Standard',
    workflowName: 'Application Owner Approval',
    workflowCode: 'WF-REQ-APP-07',
    approvalTemplate: [
      {
        approverRole: 'Application Owner (GitHub)',
        approverName: 'Alex Carter',
        approverRefId: 'mgr-alex',
        escalationBackup: 'Priya Nair',
      },
    ],
  },
  {
    id: 'cat-sfdc-deal',
    code: 'CAT-108',
    name: 'Salesforce · Deal Desk Approver',
    kind: 'Business Role',
    application: 'Salesforce CRM',
    category: 'Commercial & CRM',
    sensitivity: 'High',
    ownerName: 'Marcus Bell',
    ownerRefId: 'mgr-marcus',
    technicalId: 'SFDC_PERMSET: DealDesk_Discount_Approver',
    description:
      'Authorizes commercial quote approvals and enterprise contract discounting workflows in Salesforce.',
    includedPermissions: [
      'Approve Enterprise Quotes & Multi-Year Pricing',
      'View Regional Pipeline & Margin Analytics',
      'Audit-Logged Quote Sign-Off',
    ],
    supportsAccountSelection: true,
    recommendedAccountType: 'Standard',
    workflowName: 'Manager → Commercial Owner Approval',
    workflowCode: 'WF-REQ-CRM-08',
    approvalTemplate: [
      {
        approverRole: 'Line Manager Approval',
        approverName: 'Target Manager',
        escalationBackup: 'Marcus Bell',
      },
      {
        approverRole: 'Application Owner (Salesforce)',
        approverName: 'Marcus Bell',
        approverRefId: 'mgr-marcus',
        escalationBackup: 'David Chen',
      },
    ],
  },
];

export const INITIAL_ACCESS_REQUESTS: DemoAccessRequest[] = [
  {
    id: 'req-mkt-1',
    requestCode: 'REQ-5104',
    requestedByName: 'Priya Nair',
    requestedByPersonId: 'p-priya',
    targetPersonId: 'p-priya',
    targetPersonName: 'Priya Nair',
    primaryContextId: 'ctx-sre-jit',
    primaryContextLabel: 'CTX-ENG-SRE-JIT · Platform SRE · On-Call JIT Eligibility',
    selectedAccountId: 'p-priya-adm',
    selectedAccountName: 'adm-pnair@priv.identra.net',
    selectedAccountKind: 'Privileged Admin',
    catalogItemId: 'cat-aws-k8s',
    resourceName: 'AWS Prod Vault · EKS Cluster Admin (JIT)',
    resourceKind: 'JIT Elevation',
    application: 'AWS Prod Vault',
    activationDate: '2026-11-25',
    deactivationDate: '2026-12-09',
    motivation: 'Required on privileged admin account to lead Q4 zero-downtime EKS v1.31 cluster upgrade.',
    sodStatus: 'Clean',
    workflowCode: 'WF-REQ-CLD-03',
    workflowName: 'Manager → Cloud App Owner Approval',
    stages: [
      {
        step: 'Stage 1',
        approverRole: 'Line Manager Approval',
        approverName: 'Alex Carter',
        approverRefId: 'mgr-alex',
        escalationBackup: 'Hannah Lindqvist',
        status: 'Approved',
        decidedAt: '2026-11-23 11:10',
      },
      {
        step: 'Stage 2',
        approverRole: 'Application Owner (AWS Prod Vault)',
        approverName: 'Alex Carter',
        approverRefId: 'mgr-alex',
        escalationBackup: 'David Chen',
        status: 'Pending',
      },
    ],
    status: 'Pending Approval',
    submittedAt: '2026-11-23 09:00',
    waitingHours: 54,
    escalatedCount: 0,
  },
  {
    id: 'req-mkt-2',
    requestCode: 'REQ-5103',
    requestedByName: 'Sarah Mitchell',
    requestedByPersonId: 'p-sarah',
    targetPersonId: 'p-sarah',
    targetPersonName: 'Sarah Mitchell',
    primaryContextId: 'ctx-fin-uk-fte',
    primaryContextLabel: 'CTX-EMP-FIN-UK · Primary Employment · Finance UK',
    selectedAccountId: 'p-sarah-std',
    selectedAccountName: 'smitchell@corp.identra.net',
    selectedAccountKind: 'Standard User',
    catalogItemId: 'cat-ad-sec-ops',
    resourceName: 'SG-Tier1-Server-Operators',
    resourceKind: 'AD Security Group',
    application: 'Active Directory',
    activationDate: '2026-11-26',
    deactivationDate: '2027-01-25',
    motivation: 'Temporarily assisting Finance reporting server log diagnostics during year-end ledger batch runs.',
    sodStatus: 'Clean',
    workflowCode: 'WF-REQ-AD-06',
    workflowName: 'Manager → Entitlement Owner Approval',
    stages: [
      {
        step: 'Stage 1',
        approverRole: 'Line Manager Approval',
        approverName: 'Claire Vance',
        approverRefId: 'mgr-claire',
        escalationBackup: 'David Chen',
        status: 'Approved',
        decidedAt: '2026-11-24 14:15',
      },
      {
        step: 'Stage 2',
        approverRole: 'Entitlement Owner (AD Infra)',
        approverName: 'Priya Nair',
        approverRefId: 'mgr-priya',
        personId: 'p-priya',
        escalationBackup: 'Alex Carter',
        status: 'Pending',
      },
    ],
    status: 'Pending Approval',
    submittedAt: '2026-11-24 13:40',
    waitingHours: 24,
    escalatedCount: 0,
  },
  {
    id: 'req-mkt-3',
    requestCode: 'REQ-5102',
    requestedByName: 'Priya Nair',
    requestedByPersonId: 'p-priya',
    targetPersonId: 'p-lucas',
    targetPersonName: 'Lucas Meyer',
    primaryContextId: 'ctx-data-steward',
    primaryContextLabel: 'CTX-DAT-PII-GOV · Tier-0 PII Data Stewardship',
    selectedAccountId: 'p-lucas-std',
    selectedAccountName: 'lmeyer@corp.identra.net',
    selectedAccountKind: 'Standard User',
    catalogItemId: 'cat-m365-copilot',
    resourceName: 'Microsoft 365 Copilot Enterprise',
    resourceKind: 'Entra ID License',
    application: 'Microsoft Entra ID',
    activationDate: '2026-11-20',
    deactivationDate: null,
    motivation: 'Enable AI-assisted GDPR policy documentation and data lineage review summaries.',
    sodStatus: 'Clean',
    workflowCode: 'WF-REQ-MGR-05',
    workflowName: 'Manager Approval Only',
    stages: [
      {
        step: 'Stage 1',
        approverRole: 'Line Manager Approval',
        approverName: 'Hannah Lindqvist',
        approverRefId: 'mgr-cdo',
        escalationBackup: 'Claire Vance',
        status: 'Approved',
        decidedAt: '2026-11-20 15:22',
      },
    ],
    status: 'Approved & Provisioned',
    submittedAt: '2026-11-20 14:05',
    waitingHours: 0,
    escalatedCount: 0,
  },
];

export const INITIAL_LEAVE_DELEGATION: LeaveDelegationConfig = {
  enabled: false,
  delegatorPersonId: 'p-priya',
  delegatorName: 'Priya Nair',
  standInPersonId: 'p-lucas',
  standInName: 'Lucas Meyer',
  standInRefId: 'mgr-alex',
  startDate: '2026-12-15',
  endDate: '2027-01-04',
  reason: 'Annual Year-End Leave — routing all governance approvals & reviews to stand-in.',
  delegateApprovals: true,
  delegateReviews: true,
  delegateOnboarding: true,
  updatedAt: 'Not active',
};

/* -------------------------------------------------------------------------- */
/* Orphaned Account Adoption (Mappings, Policies, Provenance & Rollback)      */
/* -------------------------------------------------------------------------- */

export type AdoptionActionKind =
  | 'Promote to Identity'
  | 'Correlate to Existing'
  | 'Classify as Non-Human';

export type AdoptionHumanClassification =
  | 'Employee'
  | 'Contractor'
  | 'External Consultant';

export type AdoptionNhiClassification =
  | 'Service Account'
  | 'Application Account'
  | 'Shared Mailbox'
  | 'Technical Integration'
  | 'API Token';

export interface AdoptionAttributeMappingRule {
  id: string;
  sourceAttribute: string;
  identityAttribute:
    | 'accountRef'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'department'
    | 'employeeNumber'
    | 'manager';
  identityLabel: string;
  requiredForPromotion: boolean;
}

export interface SystemAdoptionMapping {
  systemName: string;
  rules: AdoptionAttributeMappingRule[];
}

export interface AdoptionPolicyConfig {
  mode:
    | 'Immediate (Permitted)'
    | 'Require Approval (Manager / System Owner)'
    | 'Restricted (Governance Admins Only)';
  duplicateRules: {
    matchEmail: boolean;
    matchEmployeeNumber: boolean;
    matchUsername: boolean;
    matchFullName: boolean;
  };
  requireContractorExpiry: boolean;
  requireOwnershipValidation: boolean;
  defaultAuthoritativeSource:
    | 'Manual / Pending HRIS Link'
    | 'Workday HRIS Core (Reconcile Next Sync)'
    | 'B2B Partner Lifecycle Portal'
    | 'Active Directory (Temporary)';
}

export interface DemoAdoptionRecord {
  id: string;
  approvalReference: string;
  actionKind: AdoptionActionKind;
  classification: string;
  originalAccountId: string;
  originalAccountName: string;
  originalSource: string;
  targetIdentityName: string;
  createdPersonId?: string;
  createdNonHumanId?: string;
  correlatedPersonId?: string;
  adoptedBy: string;
  adoptionDate: string;
  creationSource: string;
  authoritativeSource: string;
  accountCorrelationSource: string;
  expiryDate?: string | null;
  status: 'Completed' | 'Pending Approval' | 'Rolled Back';
  pendingPayload?: {
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
  };
}

export const INITIAL_SYSTEM_ADOPTION_MAPPINGS: SystemAdoptionMapping[] = [
  {
    systemName: 'Active Directory',
    rules: [
      { id: 'ad-1', sourceAttribute: 'sAMAccountName', identityAttribute: 'accountRef', identityLabel: 'Account reference', requiredForPromotion: false },
      { id: 'ad-2', sourceAttribute: 'givenName', identityAttribute: 'firstName', identityLabel: 'First name', requiredForPromotion: true },
      { id: 'ad-3', sourceAttribute: 'sn', identityAttribute: 'lastName', identityLabel: 'Last name', requiredForPromotion: true },
      { id: 'ad-4', sourceAttribute: 'mail', identityAttribute: 'email', identityLabel: 'Email', requiredForPromotion: true },
      { id: 'ad-5', sourceAttribute: 'department', identityAttribute: 'department', identityLabel: 'Department', requiredForPromotion: false },
      { id: 'ad-6', sourceAttribute: 'employeeNumber', identityAttribute: 'employeeNumber', identityLabel: 'Employee number', requiredForPromotion: true },
      { id: 'ad-7', sourceAttribute: 'manager', identityAttribute: 'manager', identityLabel: 'Manager', requiredForPromotion: true },
    ],
  },
  {
    systemName: 'SAP S/4HANA Finance',
    rules: [
      { id: 'sap-1', sourceAttribute: 'BNAME', identityAttribute: 'accountRef', identityLabel: 'Account reference', requiredForPromotion: false },
      { id: 'sap-2', sourceAttribute: 'NAME_FIRST', identityAttribute: 'firstName', identityLabel: 'First name', requiredForPromotion: true },
      { id: 'sap-3', sourceAttribute: 'NAME_LAST', identityAttribute: 'lastName', identityLabel: 'Last name', requiredForPromotion: true },
      { id: 'sap-4', sourceAttribute: 'SMTP_ADDR', identityAttribute: 'email', identityLabel: 'Email', requiredForPromotion: true },
      { id: 'sap-5', sourceAttribute: 'DEPARTMENT', identityAttribute: 'department', identityLabel: 'Department', requiredForPromotion: false },
      { id: 'sap-6', sourceAttribute: 'PERNR', identityAttribute: 'employeeNumber', identityLabel: 'Employee number', requiredForPromotion: true },
    ],
  },
  {
    systemName: 'AWS Prod Vault',
    rules: [
      { id: 'aws-1', sourceAttribute: 'iamUserName', identityAttribute: 'accountRef', identityLabel: 'Account reference', requiredForPromotion: false },
      { id: 'aws-2', sourceAttribute: 'tag:FirstName', identityAttribute: 'firstName', identityLabel: 'First name', requiredForPromotion: true },
      { id: 'aws-3', sourceAttribute: 'tag:LastName', identityAttribute: 'lastName', identityLabel: 'Last name', requiredForPromotion: true },
      { id: 'aws-4', sourceAttribute: 'tag:Email', identityAttribute: 'email', identityLabel: 'Email', requiredForPromotion: true },
      { id: 'aws-5', sourceAttribute: 'tag:Owner', identityAttribute: 'manager', identityLabel: 'Manager / Owner', requiredForPromotion: true },
    ],
  },
  {
    systemName: 'Snowflake PII Lake',
    rules: [
      { id: 'sf-1', sourceAttribute: 'LOGIN_NAME', identityAttribute: 'accountRef', identityLabel: 'Account reference', requiredForPromotion: false },
      { id: 'sf-2', sourceAttribute: 'FIRST_NAME', identityAttribute: 'firstName', identityLabel: 'First name', requiredForPromotion: true },
      { id: 'sf-3', sourceAttribute: 'LAST_NAME', identityAttribute: 'lastName', identityLabel: 'Last name', requiredForPromotion: true },
      { id: 'sf-4', sourceAttribute: 'EMAIL', identityAttribute: 'email', identityLabel: 'Email', requiredForPromotion: true },
      { id: 'sf-5', sourceAttribute: 'COMMENT_OWNER', identityAttribute: 'manager', identityLabel: 'Manager / Steward', requiredForPromotion: true },
    ],
  },
];

export const INITIAL_ADOPTION_POLICY: AdoptionPolicyConfig = {
  mode: 'Immediate (Permitted)',
  duplicateRules: {
    matchEmail: true,
    matchEmployeeNumber: true,
    matchUsername: true,
    matchFullName: true,
  },
  requireContractorExpiry: true,
  requireOwnershipValidation: true,
  defaultAuthoritativeSource: 'Manual / Pending HRIS Link',
};

export const INITIAL_ADOPTION_RECORDS: DemoAdoptionRecord[] = [
  {
    id: 'adp-hist-1',
    approvalReference: 'APR-10241',
    actionKind: 'Classify as Non-Human',
    classification: 'Service Account',
    originalAccountId: 'acc-15',
    originalAccountName: 'svc.finance-ledger-etl',
    originalSource: 'SAP S/4HANA Finance',
    targetIdentityName: 'svc.finance-ledger-etl (Owner: Lucas Meyer)',
    createdNonHumanId: 'nh-etl',
    adoptedBy: 'Ivan Lubbe',
    adoptionDate: '24/11/2026',
    creationSource: 'Orphaned account adoption · SAP S/4HANA Finance',
    authoritativeSource: 'IDENTRA NHI Registry',
    accountCorrelationSource: 'SAP S/4HANA Finance',
    status: 'Completed',
  },
];

/* -------------------------------------------------------------------------- */
/* Imported Target-System Entitlements Without Members (Zero-Member Hygiene)  */
/* -------------------------------------------------------------------------- */

export type EmptyEntitlementStatus =
  | 'Empty (Flagged)'
  | 'Deletion Queued'
  | 'Deleted in Target'
  | 'Exception Approved';

export interface DemoEmptyEntitlement {
  id: string;
  name: string;
  technicalId: string;
  application: DemoProvisioningJob['application'];
  entitlementType:
    | 'AD Security Group'
    | 'SAP Role'
    | 'AWS IAM Policy'
    | 'Snowflake Role'
    | 'Entra ID Security Group'
    | 'Okta App Group';
  connectorAction: string;
  importedFrom: string;
  importedAt: string;
  memberCount: number;
  daysEmpty: number;
  lastMemberRemovedAt: string;
  owner: string | null;
  sensitivity: 'Critical' | 'High' | 'Standard';
  deletableInTarget: boolean;
  nonDeletableReason?: string;
  status: EmptyEntitlementStatus;
  governanceViolationId: string;
  deletionJobId?: string;
  deletionJobCode?: string;
  exceptionReason?: string;
}

export const INITIAL_EMPTY_ENTITLEMENTS: DemoEmptyEntitlement[] = [
  {
    id: 'emp-ent-1',
    name: 'SG-Legacy-Q3-Audit-Temp',
    technicalId: 'CN=SG-Legacy-Q3-Audit-Temp,OU=LegacyGroups,DC=corp,DC=identra,DC=net',
    application: 'Active Directory',
    entitlementType: 'AD Security Group',
    connectorAction: 'LDAP DELETE objectClass=group',
    importedFrom: 'Active Directory Delta Import (IMP-8841)',
    importedAt: '2026-11-25 06:02',
    memberCount: 0,
    daysEmpty: 142,
    lastMemberRemovedAt: '2026-07-06',
    owner: 'Claire Vance',
    sensitivity: 'Standard',
    deletableInTarget: true,
    status: 'Empty (Flagged)',
    governanceViolationId: 'gv-emp-1',
  },
  {
    id: 'emp-ent-2',
    name: 'SAP:Z_FI_LEGACY_MIGRATION_2024',
    technicalId: 'AGR_NAME=Z_FI_LEGACY_MIGRATION_2024',
    application: 'SAP S/4HANA Finance',
    entitlementType: 'SAP Role',
    connectorAction: 'SAP BAPI PRGN_ROLE_DELETE',
    importedFrom: 'SAP BAPI / SCIM Full Recon (IMP-8837)',
    importedAt: '2026-11-25 05:40',
    memberCount: 0,
    daysEmpty: 218,
    lastMemberRemovedAt: '2026-04-21',
    owner: 'David Chen',
    sensitivity: 'High',
    deletableInTarget: true,
    status: 'Empty (Flagged)',
    governanceViolationId: 'gv-emp-2',
  },
  {
    id: 'emp-ent-3',
    name: 'AWS-Sandbox-Legacy-ReadOnly',
    technicalId: 'arn:aws:iam::904128301:policy/AWS-Sandbox-Legacy-ReadOnly',
    application: 'AWS Prod Vault',
    entitlementType: 'AWS IAM Policy',
    connectorAction: 'AWS IAM DeletePolicy / DeletePermissionSet',
    importedFrom: 'AWS IAM Identity Center Recon (IMP-8835)',
    importedAt: '2026-11-25 05:15',
    memberCount: 0,
    daysEmpty: 95,
    lastMemberRemovedAt: '2026-08-22',
    owner: 'Priya Nair',
    sensitivity: 'Standard',
    deletableInTarget: true,
    status: 'Empty (Flagged)',
    governanceViolationId: 'gv-emp-3',
  },
  {
    id: 'emp-ent-4',
    name: 'SF_ROLE_TEMP_MIGRATION_Q1',
    technicalId: 'SNOWFLAKE.ROLE.SF_ROLE_TEMP_MIGRATION_Q1',
    application: 'Snowflake PII Lake',
    entitlementType: 'Snowflake Role',
    connectorAction: 'SQL DROP ROLE IF EXISTS SF_ROLE_TEMP_MIGRATION_Q1',
    importedFrom: 'Snowflake Governance API Sync (IMP-8833)',
    importedAt: '2026-11-25 04:50',
    memberCount: 0,
    daysEmpty: 64,
    lastMemberRemovedAt: '2026-09-22',
    owner: 'Lucas Meyer',
    sensitivity: 'High',
    deletableInTarget: true,
    status: 'Empty (Flagged)',
    governanceViolationId: 'gv-emp-4',
  },
  {
    id: 'emp-ent-5',
    name: 'ENTRA-GRP-DECOMM-SHAREPOINT',
    technicalId: 'aad-grp-9f41b2c8-decomm-spo-01',
    application: 'Microsoft Entra ID',
    entitlementType: 'Entra ID Security Group',
    connectorAction: 'Microsoft Graph DELETE /v1.0/groups/{id}',
    importedFrom: 'Microsoft Entra ID Scheduled Delta (IMP-8830)',
    importedAt: '2026-11-25 04:12',
    memberCount: 0,
    daysEmpty: 187,
    lastMemberRemovedAt: '2026-05-22',
    owner: null,
    sensitivity: 'Standard',
    deletableInTarget: true,
    status: 'Empty (Flagged)',
    governanceViolationId: 'gv-emp-5',
  },
  {
    id: 'emp-ent-6',
    name: 'SG-BuiltIn-Emergency-BreakGlass',
    technicalId: 'CN=SG-BuiltIn-Emergency-BreakGlass,OU=Tier0,DC=corp,DC=identra,DC=net',
    application: 'Active Directory',
    entitlementType: 'AD Security Group',
    connectorAction: 'PROTECTED — Target Deletion Disabled',
    importedFrom: 'Active Directory Delta Import (IMP-8841)',
    importedAt: '2026-11-25 06:02',
    memberCount: 0,
    daysEmpty: 410,
    lastMemberRemovedAt: '2025-10-11',
    owner: 'Security Ops',
    sensitivity: 'Critical',
    deletableInTarget: false,
    nonDeletableReason:
      'Protected Tier-0 Break-Glass group (0 standing members by design). Target-system deletion is not applicable; approve a Governance Exception.',
    status: 'Empty (Flagged)',
    governanceViolationId: 'gv-emp-6',
  },
];

/* -------------------------------------------------------------------------- */
/* Configurable Data Objects, Properties, Types & Sensitive Field Masking     */
/* -------------------------------------------------------------------------- */

export type SchemaPropertyType =
  | 'String'
  | 'Integer'
  | 'Boolean'
  | 'Date'
  | 'Email'
  | 'Enum'
  | 'Reference (Identity)'
  | 'Reference (Object)'
  | 'Multi-Value String'
  | 'Encrypted Secret';

export type SensitiveMaskPattern =
  | 'Full Mask (••••••••)'
  | 'Show Last 4 (••••1234)'
  | 'Partial Email (s***@domain)';

export interface DemoSchemaProperty {
  id: string;
  key: string;
  label: string;
  type: SchemaPropertyType;
  referenceTargetObjectId?: string;
  required: boolean;
  unique: boolean;
  sensitive: boolean;
  maskPattern: SensitiveMaskPattern;
  systemProperty?: boolean;
  defaultSampleValue?: string;
  description?: string;
}

export interface DemoSchemaObject {
  id: string;
  code: string;
  name: string;
  apiName: string;
  category: 'Core System Object' | 'Reference Object' | 'Custom Object';
  description: string;
  recordCount: number;
  properties: DemoSchemaProperty[];
}

export function maskSensitiveValue(
  rawValue: string | null | undefined,
  pattern: SensitiveMaskPattern = 'Full Mask (••••••••)'
): string {
  const val = String(rawValue ?? '').trim();
  if (!val) return '••••••••';

  if (pattern === 'Partial Email (s***@domain)' && val.includes('@')) {
    const [local, domain] = val.split('@');
    const prefix = local.slice(0, 1) || '*';
    return `${prefix}••••@${domain}`;
  }

  if (pattern === 'Show Last 4 (••••1234)') {
    if (val.length <= 4) return '••••';
    return `••••••••${val.slice(-4)}`;
  }

  return '••••••••••••';
}

export function getIdentityExtendedSampleValue(
  person: DemoPerson,
  key: string,
  fallback?: string
): string {
  const numSeed =
    person.employeeNumber.replace(/\D/g, '').slice(-4).padStart(4, '4') || '8421';
  if (key === 'nationalId') return `900412582${numSeed}`;
  if (key === 'privateMobile') return `+27 82 554 ${numSeed}`;
  if (key === 'taxNumber') return `ZA-TIN-0491${numSeed}`;
  if (key === 'securityClearance') return person.riskScore < 25 ? 'Tier-2 Verified' : 'Standard';
  return fallback?.trim() || `Configured (${key})`;
}

export const INITIAL_SCHEMA_OBJECTS: DemoSchemaObject[] = [
  {
    id: 'obj-identity',
    code: 'OBJ-IDENTITY',
    name: 'Identity (Person)',
    apiName: 'identity',
    category: 'Core System Object',
    description:
      'Authoritative human identity master record synchronized from HRIS, Contractor Onboarding, or Orphaned Account Adoption.',
    recordCount: 8421,
    properties: [
      {
        id: 'prop-id-fname',
        key: 'firstName',
        label: 'First Name',
        type: 'String',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'Sarah',
        description: 'Legal or preferred given name.',
      },
      {
        id: 'prop-id-lname',
        key: 'lastName',
        label: 'Last Name',
        type: 'String',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'Mitchell',
        description: 'Legal family surname.',
      },
      {
        id: 'prop-id-empnum',
        key: 'employeeNumber',
        label: 'Employee Number',
        type: 'String',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Show Last 4 (••••1234)',
        systemProperty: true,
        defaultSampleValue: 'EMP-10841',
        description: 'Unique HRIS employee or contractor reference.',
      },
      {
        id: 'prop-id-email',
        key: 'email',
        label: 'Primary Email',
        type: 'Email',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Partial Email (s***@domain)',
        systemProperty: true,
        defaultSampleValue: 'sarah.mitchell@identra-corp.io',
        description: 'Primary corporate email address.',
      },
      {
        id: 'prop-id-upn',
        key: 'upn',
        label: 'User Principal Name (UPN)',
        type: 'Email',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Partial Email (s***@domain)',
        systemProperty: true,
        defaultSampleValue: 'smitchell@corp.identra.net',
        description: 'Directory authentication identifier.',
      },
      {
        id: 'prop-id-sam',
        key: 'samAccountName',
        label: 'SAM Account Name',
        type: 'String',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'smitchell',
        description: 'Active Directory logon reference.',
      },
      {
        id: 'prop-id-manager',
        key: 'manager',
        label: 'Line Manager / Sponsor',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'Claire Vance',
        description: 'Identity reference used for Manager Approval & Escalation workflows.',
      },
      {
        id: 'prop-id-national',
        key: 'nationalId',
        label: 'National ID / Passport Number',
        type: 'Encrypted Secret',
        required: false,
        unique: true,
        sensitive: true,
        maskPattern: 'Show Last 4 (••••1234)',
        systemProperty: false,
        defaultSampleValue: '9004125820841',
        description: 'POPIA/GDPR regulated national identifier — masked across the portal by default.',
      },
      {
        id: 'prop-id-mobile',
        key: 'privateMobile',
        label: 'Private MFA Mobile Number',
        type: 'String',
        required: false,
        unique: false,
        sensitive: true,
        maskPattern: 'Show Last 4 (••••1234)',
        systemProperty: false,
        defaultSampleValue: '+27 82 554 0841',
        description: 'Personal mobile number for out-of-band MFA recovery — hidden from clear text.',
      },
      {
        id: 'prop-id-hrstart',
        key: 'hrStartDate',
        label: 'HR Start Date',
        type: 'Date',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: '2026-11-23',
        description: 'Effective Joiner start date.',
      },
    ],
  },
  {
    id: 'obj-application',
    code: 'OBJ-APPLICATION',
    name: 'Connected Application',
    apiName: 'application',
    category: 'Core System Object',
    description:
      'Connected enterprise system or target directory managed by IDENTRA connectors and Governance Controls.',
    recordCount: 126,
    properties: [
      {
        id: 'prop-app-name',
        key: 'name',
        label: 'Application Name',
        type: 'String',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'SAP S/4HANA Finance',
      },
      {
        id: 'prop-app-owner',
        key: 'applicationOwner',
        label: 'Application Owner',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'David Chen',
        description: 'Accountable business owner (Identity reference) for Application Owner Approvals.',
      },
      {
        id: 'prop-app-tech-owner',
        key: 'technicalSteward',
        label: 'Technical Steward',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: false,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: false,
        defaultSampleValue: 'Priya Nair',
        description: 'Secondary technical identity reference for connector operations.',
      },
      {
        id: 'prop-app-tier',
        key: 'tier',
        label: 'Criticality Tier',
        type: 'Enum',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'Tier-0',
      },
      {
        id: 'prop-app-secret',
        key: 'connectorClientSecret',
        label: 'Connector Client Secret',
        type: 'Encrypted Secret',
        required: true,
        unique: false,
        sensitive: true,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'scim_live_94k2f8a19c0d',
        description: 'Encrypted connector API credential.',
      },
    ],
  },
  {
    id: 'obj-entitlement',
    code: 'OBJ-ENTITLEMENT',
    name: 'Entitlement',
    apiName: 'entitlement',
    category: 'Core System Object',
    description:
      'Fine-grained target-system permission, AD group, SAP role, or cloud policy governed in the catalog.',
    recordCount: 12480,
    properties: [
      {
        id: 'prop-ent-name',
        key: 'name',
        label: 'Entitlement Name',
        type: 'String',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'SAP:FI_AP_PAYMENT_RELEASE',
      },
      {
        id: 'prop-ent-owner',
        key: 'entitlementOwner',
        label: 'Entitlement Owner',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'Claire Vance',
        description: 'Identity reference required by GA-CTRL-01 and Entitlement Owner approval workflows.',
      },
      {
        id: 'prop-ent-app',
        key: 'applicationRef',
        label: 'Parent Application',
        type: 'Reference (Object)',
        referenceTargetObjectId: 'obj-application',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'SAP S/4HANA Finance',
      },
      {
        id: 'prop-ent-priv',
        key: 'isPrivileged',
        label: 'Privileged Access Flag',
        type: 'Boolean',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'true',
      },
    ],
  },
  {
    id: 'obj-department',
    code: 'OBJ-DEPARTMENT',
    name: 'Department / Cost Center',
    apiName: 'department',
    category: 'Reference Object',
    description:
      'Organizational reference object linking cost centers, departments, and budget approvers.',
    recordCount: 42,
    properties: [
      {
        id: 'prop-dept-code',
        key: 'costCenterCode',
        label: 'Cost Center Code',
        type: 'String',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'CC-4100-FIN',
      },
      {
        id: 'prop-dept-head',
        key: 'departmentHead',
        label: 'Department Head',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'David Chen',
        description: 'Identity reference for department-level sign-off workflows.',
      },
      {
        id: 'prop-dept-delegate',
        key: 'budgetApprover',
        label: 'Budget / License Approver',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: false,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: false,
        defaultSampleValue: 'Claire Vance',
        description: 'Identity reference used for high-cost ZAR license approvals.',
      },
    ],
  },
  {
    id: 'obj-ou',
    code: 'OBJ-ORG-UNIT',
    name: 'Organizational Unit (AD)',
    apiName: 'organizational_unit',
    category: 'Core System Object',
    description:
      'Hierarchical Active Directory container governed by AD Structural Governance and correlated via immutable objectGUID.',
    recordCount: 11,
    properties: [
      {
        id: 'prop-ou-guid',
        key: 'objectGuid',
        label: 'Object GUID (Immutable Key)',
        type: 'String',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'a4f8c910-7b2e-4f19-9c04-18273645abcd',
        description: 'Immutable AD correlation identifier resilient to OU renames and moves.',
      },
      {
        id: 'prop-ou-dn',
        key: 'distinguishedName',
        label: 'Distinguished Name (DN)',
        type: 'String',
        required: true,
        unique: true,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'OU=Departments,DC=corp,DC=identra,DC=net',
      },
      {
        id: 'prop-ou-owner',
        key: 'businessOwner',
        label: 'OU Business Owner (Managed By)',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'Claire Vance',
        description: 'Accountable Business Owner Identity reference for OU approvals & attestations.',
      },
      {
        id: 'prop-ou-custodian',
        key: 'technicalCustodian',
        label: 'AD Technical Custodian',
        type: 'Reference (Identity)',
        referenceTargetObjectId: 'obj-identity',
        required: true,
        unique: false,
        sensitive: false,
        maskPattern: 'Full Mask (••••••••)',
        systemProperty: true,
        defaultSampleValue: 'Alex Carter',
        description: 'Infrastructure Identity reference approving AD structural changes.',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Custom Workflows Targeting Reference Objects (Identities & Custom Objects) */
/* -------------------------------------------------------------------------- */

export type CustomWorkflowTrigger =
  | 'On Create'
  | 'On Attribute Change'
  | 'On Reference Change'
  | 'On Access Request'
  | 'On Expiry Approaching'
  | 'Scheduled Daily';

export interface CustomWorkflowCondition {
  id: string;
  propertyKey: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'changed' | 'is_not_empty';
  value: string;
}

export interface CustomWorkflowStage {
  id: string;
  stepOrder: number;
  name: string;
  stageKind: 'Approval' | 'Notification' | 'Provisioning Action' | 'Governance Check';
  resolverMode: 'Reference Property (Identity)' | 'Specific Identity' | 'Dynamic Role / Group';
  /** e.g., "identity.manager", "application.applicationOwner", "department.departmentHead" */
  referenceObjectPath: string;
  referenceLabel: string;
  fallbackIdentityName: string;
  slaHours: number;
  escalateToReferencePath?: string;
}

export interface DemoCustomWorkflow {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft' | 'Paused';
  sourceObjectId: string;
  triggerEvent: CustomWorkflowTrigger;
  conditions: CustomWorkflowCondition[];
  stages: CustomWorkflowStage[];
  createdAt: string;
  lastSimulatedAt?: string;
}

export const INITIAL_CUSTOM_WORKFLOWS: DemoCustomWorkflow[] = [
  {
    id: 'cwf-1',
    code: 'WF-CUST-001',
    name: 'Privileged Access Dual-Reference Approval',
    description:
      'Resolves the requesting identity’s Line Manager reference first, then routes to the target Application Owner identity reference with automatic skip-level escalation.',
    status: 'Active',
    sourceObjectId: 'obj-identity',
    triggerEvent: 'On Access Request',
    conditions: [
      {
        id: 'cond-1',
        propertyKey: 'isPrivileged',
        operator: 'equals',
        value: 'true',
      },
    ],
    stages: [
      {
        id: 'stg-1',
        stepOrder: 1,
        name: 'Line Manager Sign-Off',
        stageKind: 'Approval',
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: 'identity.manager',
        referenceLabel: 'Identity → Line Manager / Sponsor',
        fallbackIdentityName: 'Claire Vance',
        slaHours: 24,
        escalateToReferencePath: 'department.departmentHead',
      },
      {
        id: 'stg-2',
        stepOrder: 2,
        name: 'Application Owner Governance Approval',
        stageKind: 'Approval',
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: 'application.applicationOwner',
        referenceLabel: 'Connected Application → Application Owner',
        fallbackIdentityName: 'David Chen',
        slaHours: 48,
        escalateToReferencePath: 'application.technicalSteward',
      },
      {
        id: 'stg-3',
        stepOrder: 3,
        name: 'Provision & Notify Entitlement Owner',
        stageKind: 'Provisioning Action',
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: 'entitlement.entitlementOwner',
        referenceLabel: 'Entitlement → Entitlement Owner',
        fallbackIdentityName: 'Priya Nair',
        slaHours: 1,
      },
    ],
    createdAt: '2026-11-24',
  },
  {
    id: 'cwf-2',
    code: 'WF-CUST-002',
    name: 'Contractor Sponsor & Department Budget Sign-Off',
    description:
      'Triggered when a Contractor identity is created or extended; resolves the assigned Sponsor identity reference and Department Budget Approver identity reference.',
    status: 'Active',
    sourceObjectId: 'obj-identity',
    triggerEvent: 'On Create',
    conditions: [
      {
        id: 'cond-2',
        propertyKey: 'type',
        operator: 'equals',
        value: 'Contractor',
      },
    ],
    stages: [
      {
        id: 'stg-2-1',
        stepOrder: 1,
        name: 'Internal Sponsor Verification',
        stageKind: 'Approval',
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: 'identity.manager',
        referenceLabel: 'Identity → Line Manager / Sponsor',
        fallbackIdentityName: 'Priya Nair',
        slaHours: 24,
      },
      {
        id: 'stg-2-2',
        stepOrder: 2,
        name: 'Department Budget Approver Check',
        stageKind: 'Approval',
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: 'department.budgetApprover',
        referenceLabel: 'Department / Cost Center → Budget / License Approver',
        fallbackIdentityName: 'Claire Vance',
        slaHours: 48,
      },
    ],
    createdAt: '2026-11-25',
  },
  {
    id: 'cwf-3',
    code: 'WF-CUST-003',
    name: 'Sensitive Identity Field Change Alert',
    description:
      'Monitors updates to sensitive properties (e.g., National ID or Private MFA Mobile) and alerts both the Line Manager identity reference and Security Operations.',
    status: 'Active',
    sourceObjectId: 'obj-identity',
    triggerEvent: 'On Attribute Change',
    conditions: [
      {
        id: 'cond-3',
        propertyKey: 'nationalId',
        operator: 'changed',
        value: '*',
      },
    ],
    stages: [
      {
        id: 'stg-3-1',
        stepOrder: 1,
        name: 'Governance Integrity Validation',
        stageKind: 'Governance Check',
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: 'identity.manager',
        referenceLabel: 'Identity → Line Manager / Sponsor',
        fallbackIdentityName: 'Lucas Meyer',
        slaHours: 4,
      },
      {
        id: 'stg-3-2',
        stepOrder: 2,
        name: 'Notify Technical Steward',
        stageKind: 'Notification',
        resolverMode: 'Reference Property (Identity)',
        referenceObjectPath: 'application.technicalSteward',
        referenceLabel: 'Connected Application → Technical Steward',
        fallbackIdentityName: 'Priya Nair',
        slaHours: 1,
      },
    ],
    createdAt: '2026-11-25',
  },
];

/* -------------------------------------------------------------------------- */
/* License SKU Inventory, Consumption, Birthright Capacity & Identity Types   */
/* -------------------------------------------------------------------------- */

export type LicenseVendor = 'Microsoft' | 'SAP' | 'GitHub' | 'Okta' | 'Salesforce';

export interface DemoLicenseSku {
  id: string;
  skuCode: string;
  name: string;
  shortLabel: string;
  vendor: LicenseVendor;
  application: string;
  tier: 'Enterprise' | 'Frontline' | 'AI Add-On' | 'ERP' | 'Developer' | 'IdP';
  totalPurchased: number;
  consumed: number;
  reclaimableInactive: number;
  monthlyCostZar: number;
  warningThresholdPct: number;
  /** Enterprise workforce projection factor per matched sample identity in birthright simulation */
  birthrightProjectionScale: number;
  licensedIdentityBreakdown: {
    employees: number;
    contractors: number;
    nonHumans: number;
    privilegedAdmins: number;
    externalGuests: number;
  };
}

export const INITIAL_LICENSE_SKUS: DemoLicenseSku[] = [
  {
    id: 'lic-m365-e5',
    skuCode: 'SPE_E5',
    name: 'Microsoft 365 E5 (SPE_E5)',
    shortLabel: 'M365 E5',
    vendor: 'Microsoft',
    application: 'Microsoft Entra ID',
    tier: 'Enterprise',
    totalPurchased: 1200,
    consumed: 1192,
    reclaimableInactive: 18,
    monthlyCostZar: 1050,
    warningThresholdPct: 90,
    birthrightProjectionScale: 7,
    licensedIdentityBreakdown: {
      employees: 1046,
      contractors: 48,
      nonHumans: 14,
      privilegedAdmins: 84,
      externalGuests: 0,
    },
  },
  {
    id: 'lic-m365-e3',
    skuCode: 'SPE_E3',
    name: 'Microsoft 365 E3 (SPE_E3)',
    shortLabel: 'M365 E3',
    vendor: 'Microsoft',
    application: 'Microsoft Entra ID',
    tier: 'Enterprise',
    totalPurchased: 5000,
    consumed: 4810,
    reclaimableInactive: 64,
    monthlyCostZar: 680,
    warningThresholdPct: 90,
    birthrightProjectionScale: 4,
    licensedIdentityBreakdown: {
      employees: 4320,
      contractors: 382,
      nonHumans: 36,
      privilegedAdmins: 72,
      externalGuests: 0,
    },
  },
  {
    id: 'lic-m365-f3',
    skuCode: 'SPE_F3',
    name: 'Microsoft 365 F3 Frontline (SPE_F3)',
    shortLabel: 'M365 F3',
    vendor: 'Microsoft',
    application: 'Microsoft Entra ID',
    tier: 'Frontline',
    totalPurchased: 1500,
    consumed: 1140,
    reclaimableInactive: 22,
    monthlyCostZar: 160,
    warningThresholdPct: 90,
    birthrightProjectionScale: 5,
    licensedIdentityBreakdown: {
      employees: 790,
      contractors: 240,
      nonHumans: 0,
      privilegedAdmins: 0,
      externalGuests: 110,
    },
  },
  {
    id: 'lic-m365-copilot',
    skuCode: 'M365_COPILOT',
    name: 'Microsoft 365 Copilot Enterprise',
    shortLabel: 'M365 Copilot',
    vendor: 'Microsoft',
    application: 'Microsoft Entra ID',
    tier: 'AI Add-On',
    totalPurchased: 300,
    consumed: 296,
    reclaimableInactive: 9,
    monthlyCostZar: 560,
    warningThresholdPct: 90,
    birthrightProjectionScale: 6,
    licensedIdentityBreakdown: {
      employees: 262,
      contractors: 12,
      nonHumans: 6,
      privilegedAdmins: 16,
      externalGuests: 0,
    },
  },
  {
    id: 'lic-sap-pro',
    skuCode: 'SAP_S4_PRO',
    name: 'SAP S/4HANA Professional User',
    shortLabel: 'SAP S/4 Pro',
    vendor: 'SAP',
    application: 'SAP S/4HANA Finance',
    tier: 'ERP',
    totalPurchased: 1450,
    consumed: 1388,
    reclaimableInactive: 26,
    monthlyCostZar: 2450,
    warningThresholdPct: 92,
    birthrightProjectionScale: 5,
    licensedIdentityBreakdown: {
      employees: 1210,
      contractors: 94,
      nonHumans: 42,
      privilegedAdmins: 42,
      externalGuests: 0,
    },
  },
  {
    id: 'lic-github-ent',
    skuCode: 'GH_ENT_CLOUD',
    name: 'GitHub Enterprise Cloud Seat',
    shortLabel: 'GitHub Ent',
    vendor: 'GitHub',
    application: 'GitHub Enterprise',
    tier: 'Developer',
    totalPurchased: 1200,
    consumed: 1164,
    reclaimableInactive: 19,
    monthlyCostZar: 390,
    warningThresholdPct: 90,
    birthrightProjectionScale: 8,
    licensedIdentityBreakdown: {
      employees: 890,
      contractors: 162,
      nonHumans: 68,
      privilegedAdmins: 44,
      externalGuests: 0,
    },
  },
  {
    id: 'lic-okta-wf',
    skuCode: 'OKTA_WF_SSO',
    name: 'Okta Workforce Identity & MFA',
    shortLabel: 'Okta SSO+MFA',
    vendor: 'Okta',
    application: 'Okta Workforce Cloud',
    tier: 'IdP',
    totalPurchased: 7500,
    consumed: 6732,
    reclaimableInactive: 41,
    monthlyCostZar: 115,
    warningThresholdPct: 92,
    birthrightProjectionScale: 5,
    licensedIdentityBreakdown: {
      employees: 5490,
      contractors: 718,
      nonHumans: 146,
      privilegedAdmins: 188,
      externalGuests: 190,
    },
  },
  {
    id: 'lic-sfdc-ent',
    skuCode: 'SFDC_ENT',
    name: 'Salesforce Enterprise CRM License',
    shortLabel: 'Salesforce Ent',
    vendor: 'Salesforce',
    application: 'Salesforce CRM',
    tier: 'Enterprise',
    totalPurchased: 650,
    consumed: 598,
    reclaimableInactive: 14,
    monthlyCostZar: 2950,
    warningThresholdPct: 90,
    birthrightProjectionScale: 6,
    licensedIdentityBreakdown: {
      employees: 524,
      contractors: 48,
      nonHumans: 12,
      privilegedAdmins: 14,
      externalGuests: 0,
    },
  },
];

export interface BirthrightLicenseContributor {
  ruleId: string;
  ruleCode: string;
  ruleName: string;
  matchedSampleCount: number;
  projectedNewSeats: number;
}

export interface SkuBirthrightEvaluation {
  sku: DemoLicenseSku;
  availableSeats: number;
  utilizationPct: number;
  birthrightProjectedSeats: number;
  projectedTotalConsumed: number;
  projectedUtilizationPct: number;
  exceedsPool: boolean;
  shortfallSeats: number;
  projectedOverageMonthlyZar: number;
  status: 'Exceeded' | 'Near Limit' | 'Healthy';
  contributingRules: BirthrightLicenseContributor[];
}

export function matchGrantToLicenseSku(
  grant: BirthrightGrant,
  skus: DemoLicenseSku[]
): DemoLicenseSku | null {
  if (grant.kind !== 'License SKU') return null;
  const needle = grant.name.trim().toLowerCase();
  return (
    skus.find(
      (s) =>
        s.name.toLowerCase() === needle ||
        needle.includes(s.skuCode.toLowerCase()) ||
        needle.includes(s.shortLabel.toLowerCase())
    ) ?? null
  );
}

export function evaluateSkuBirthrightDemand(
  skus: DemoLicenseSku[],
  birthrights: DemoBirthrightRule[],
  people: DemoPerson[]
): SkuBirthrightEvaluation[] {
  const activeRules = birthrights.filter((r) => r.status === 'Active');

  return skus.map((sku) => {
    const contributors: BirthrightLicenseContributor[] = [];

    activeRules.forEach((rule) => {
      const grantsSku = rule.grants.some(
        (g) => matchGrantToLicenseSku(g, [sku]) !== null
      );
      if (!grantsSku) return;

      const matched = evaluateBirthrightMatches(rule, people).length;
      if (matched === 0) return;

      const projectedNewSeats = matched * sku.birthrightProjectionScale;
      contributors.push({
        ruleId: rule.id,
        ruleCode: rule.code,
        ruleName: rule.name,
        matchedSampleCount: matched,
        projectedNewSeats,
      });
    });

    const birthrightProjectedSeats = contributors.reduce(
      (sum, c) => sum + c.projectedNewSeats,
      0
    );
    const availableSeats = Math.max(0, sku.totalPurchased - sku.consumed);
    const utilizationPct =
      sku.totalPurchased > 0
        ? Math.round((sku.consumed / sku.totalPurchased) * 1000) / 10
        : 0;
    const projectedTotalConsumed = sku.consumed + birthrightProjectedSeats;
    const projectedUtilizationPct =
      sku.totalPurchased > 0
        ? Math.round((projectedTotalConsumed / sku.totalPurchased) * 1000) / 10
        : 0;
    const exceedsPool = projectedTotalConsumed > sku.totalPurchased;
    const shortfallSeats = Math.max(0, projectedTotalConsumed - sku.totalPurchased);
    const projectedOverageMonthlyZar = shortfallSeats * sku.monthlyCostZar;

    const status: SkuBirthrightEvaluation['status'] = exceedsPool
      ? 'Exceeded'
      : projectedUtilizationPct >= sku.warningThresholdPct ||
          utilizationPct >= sku.warningThresholdPct
        ? 'Near Limit'
        : 'Healthy';

    return {
      sku,
      availableSeats,
      utilizationPct,
      birthrightProjectedSeats,
      projectedTotalConsumed,
      projectedUtilizationPct,
      exceedsPool,
      shortfallSeats,
      projectedOverageMonthlyZar,
      status,
      contributingRules: contributors,
    };
  });
}

export interface DraftBirthrightLicenseWarning {
  skuId: string;
  skuCode: string;
  skuName: string;
  consumed: number;
  totalPurchased: number;
  availableSeats: number;
  projectedRuleSeats: number;
  projectedTotal: number;
  exceedsPool: boolean;
  nearLimit: boolean;
  shortfallSeats: number;
  overageMonthlyZar: number;
}

export function evaluateDraftBirthrightLicenseWarnings(
  draftGrants: BirthrightGrant[],
  matchedCount: number,
  skus: DemoLicenseSku[]
): DraftBirthrightLicenseWarning[] {
  const warnings: DraftBirthrightLicenseWarning[] = [];
  const seen = new Set<string>();

  draftGrants.forEach((grant) => {
    const sku = matchGrantToLicenseSku(grant, skus);
    if (!sku || seen.has(sku.id)) return;
    seen.add(sku.id);

    const projectedRuleSeats = Math.max(1, matchedCount) * sku.birthrightProjectionScale;
    const projectedTotal = sku.consumed + projectedRuleSeats;
    const availableSeats = Math.max(0, sku.totalPurchased - sku.consumed);
    const exceedsPool = projectedTotal > sku.totalPurchased;
    const nearLimit =
      !exceedsPool &&
      sku.totalPurchased > 0 &&
      (projectedTotal / sku.totalPurchased) * 100 >= sku.warningThresholdPct;
    const shortfallSeats = Math.max(0, projectedTotal - sku.totalPurchased);

    warnings.push({
      skuId: sku.id,
      skuCode: sku.skuCode,
      skuName: sku.name,
      consumed: sku.consumed,
      totalPurchased: sku.totalPurchased,
      availableSeats,
      projectedRuleSeats,
      projectedTotal,
      exceedsPool,
      nearLimit,
      shortfallSeats,
      overageMonthlyZar: shortfallSeats * sku.monthlyCostZar,
    });
  });

  return warnings;
}

export interface LicensedIdentityTypeSummary {
  id: string;
  identityType:
    | 'Permanent Employees (FTE)'
    | 'External Contractors'
    | 'Non-Human Identities (Service / AI)'
    | 'Privileged / Admin Identities'
    | 'B2B Guests & Partners';
  description: string;
  licensedIdentitiesCount: number;
  totalSeatsConsumed: number;
  sharePct: number;
  monthlySpendZar: number;
  topSkus: string[];
  accentColor: string;
}

export function computeLicensedIdentitiesByType(
  skus: DemoLicenseSku[],
  people: DemoPerson[],
  nonHumans: DemoNonHuman[]
): {
  totalUniqueLicensedIdentities: number;
  rows: LicensedIdentityTypeSummary[];
} {
  // Base unique licensed identity counts scaled dynamically with live store changes
  const extraEmployees = Math.max(
    0,
    people.filter((p) => p.type === 'Employee' && p.jmlStatus !== 'Deactivated').length - 5
  );
  const extraContractors = Math.max(
    0,
    people.filter((p) => p.type === 'Contractor' && p.jmlStatus !== 'Deactivated').length - 1
  );
  const extraNhi = Math.max(0, nonHumans.length - 4);

  const empSeats = skus.reduce((s, k) => s + k.licensedIdentityBreakdown.employees, 0);
  const ctrSeats = skus.reduce((s, k) => s + k.licensedIdentityBreakdown.contractors, 0);
  const nhiSeats = skus.reduce((s, k) => s + k.licensedIdentityBreakdown.nonHumans, 0);
  const privSeats = skus.reduce((s, k) => s + k.licensedIdentityBreakdown.privilegedAdmins, 0);
  const guestSeats = skus.reduce((s, k) => s + k.licensedIdentityBreakdown.externalGuests, 0);

  const empSpend = skus.reduce(
    (s, k) => s + k.licensedIdentityBreakdown.employees * k.monthlyCostZar,
    0
  );
  const ctrSpend = skus.reduce(
    (s, k) => s + k.licensedIdentityBreakdown.contractors * k.monthlyCostZar,
    0
  );
  const nhiSpend = skus.reduce(
    (s, k) => s + k.licensedIdentityBreakdown.nonHumans * k.monthlyCostZar,
    0
  );
  const privSpend = skus.reduce(
    (s, k) => s + k.licensedIdentityBreakdown.privilegedAdmins * k.monthlyCostZar,
    0
  );
  const guestSpend = skus.reduce(
    (s, k) => s + k.licensedIdentityBreakdown.externalGuests * k.monthlyCostZar,
    0
  );

  // Unique licensed identities per type (an identity typically holds 1-3 SKUs)
  const uniqueEmployees =
    Math.max(
      ...skus.map((k) => k.licensedIdentityBreakdown.employees),
      5490
    ) + extraEmployees;
  const uniqueContractors =
    Math.max(
      ...skus.map((k) => k.licensedIdentityBreakdown.contractors),
      718
    ) + extraContractors;
  const uniqueNhi =
    Math.max(
      ...skus.map((k) => k.licensedIdentityBreakdown.nonHumans),
      146
    ) + extraNhi;
  const uniquePriv = Math.max(
    ...skus.map((k) => k.licensedIdentityBreakdown.privilegedAdmins),
    188
  );
  const uniqueGuests = Math.max(
    ...skus.map((k) => k.licensedIdentityBreakdown.externalGuests),
    190
  );

  const totalUnique =
    uniqueEmployees + uniqueContractors + uniqueNhi + uniquePriv + uniqueGuests;

  const pct = (n: number) =>
    totalUnique > 0 ? Math.round((n / totalUnique) * 1000) / 10 : 0;

  return {
    totalUniqueLicensedIdentities: totalUnique,
    rows: [
      {
        id: 'type-fte',
        identityType: 'Permanent Employees (FTE)',
        description: 'Full-time staff consuming corporate productivity, ERP, and SSO licenses.',
        licensedIdentitiesCount: uniqueEmployees,
        totalSeatsConsumed: empSeats,
        sharePct: pct(uniqueEmployees),
        monthlySpendZar: empSpend,
        topSkus: ['M365 E3', 'M365 E5', 'SAP S/4 Pro', 'Okta SSO+MFA'],
        accentColor: '#0EA5E9',
      },
      {
        id: 'type-contractor',
        identityType: 'External Contractors',
        description: 'Fixed-term external consultants & developers with expiry-bound licenses.',
        licensedIdentitiesCount: uniqueContractors,
        totalSeatsConsumed: ctrSeats,
        sharePct: pct(uniqueContractors),
        monthlySpendZar: ctrSpend,
        topSkus: ['M365 E3', 'M365 F3', 'GitHub Ent', 'Okta SSO+MFA'],
        accentColor: '#6366F1',
      },
      {
        id: 'type-priv',
        identityType: 'Privileged / Admin Identities',
        description: 'Dedicated Tier-0/Tier-1 administrative identities holding E5 security & PAM seats.',
        licensedIdentitiesCount: uniquePriv,
        totalSeatsConsumed: privSeats,
        sharePct: pct(uniquePriv),
        monthlySpendZar: privSpend,
        topSkus: ['M365 E5', 'Okta SSO+MFA', 'GitHub Ent', 'SAP S/4 Pro'],
        accentColor: '#F59E0B',
      },
      {
        id: 'type-guests',
        identityType: 'B2B Guests & Partners',
        description: 'External partner collaborators consuming Frontline & B2B federated licenses.',
        licensedIdentitiesCount: uniqueGuests,
        totalSeatsConsumed: guestSeats,
        sharePct: pct(uniqueGuests),
        monthlySpendZar: guestSpend,
        topSkus: ['Okta SSO+MFA', 'M365 F3'],
        accentColor: '#10B981',
      },
      {
        id: 'type-nhi',
        identityType: 'Non-Human Identities (Service / AI)',
        description: 'Governed service accounts, bots, and AI copilots consuming dedicated seats.',
        licensedIdentitiesCount: uniqueNhi,
        totalSeatsConsumed: nhiSeats,
        sharePct: pct(uniqueNhi),
        monthlySpendZar: nhiSpend,
        topSkus: ['Okta SSO+MFA', 'GitHub Ent', 'SAP S/4 Pro', 'M365 Copilot'],
        accentColor: '#8B5CF6',
      },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* Predicted / Future Leavers & Calculated Exit Impact Engine                 */
/* -------------------------------------------------------------------------- */

export type PredictedChangeCategory =
  | 'Account Disable'
  | 'Role / Entitlement Revoke'
  | 'License Reclaim'
  | 'Ownership Handoff';

export interface PredictedExitChange {
  id: string;
  category: PredictedChangeCategory;
  targetSystem: DemoProvisioningJob['application'] | 'IDENTRA Governance';
  objectName: string;
  operation: 'Disable' | 'Delete' | 'Revoke' | 'Reclaim' | 'Reassign';
  beforeValue: string;
  afterValue: string;
  detail: string;
  monthlySavingsZar?: number;
  skuId?: string;
}

export interface DemoPredictedLeaver {
  id: string;
  personId?: string;
  identityName: string;
  employeeNumber: string;
  email: string;
  title: string;
  department: string;
  identityType: 'Employee' | 'Contractor';
  manager: string;
  scheduledExitDate: string;
  daysUntilExit: number;
  predictionSource:
    | 'Workday HRIS Scheduled Termination'
    | 'B2B Contractor End Date'
    | 'Fixed-Term Contract Expiry';
  confidencePct: number;
  status: 'Predicted' | 'Pre-Staged (Simulation)' | 'Offboarded';
  stagedJobCodes?: string[];
  calculatedChanges: PredictedExitChange[];
}

export const INITIAL_PREDICTED_LEAVERS: DemoPredictedLeaver[] = [
  {
    id: 'pl-1',
    identityName: 'Thabo Mokoena',
    employeeNumber: 'CTR-90342',
    email: 'thabo.mokoena@cloudpartners.co.za',
    title: 'Senior DevOps Contractor',
    department: 'Platform & Cloud Engineering',
    identityType: 'Contractor',
    manager: 'Priya Nair',
    scheduledExitDate: '2026-12-01',
    daysUntilExit: 4,
    predictionSource: 'B2B Contractor End Date',
    confidencePct: 100,
    status: 'Predicted',
    calculatedChanges: [
      {
        id: 'pc-1-1',
        category: 'Account Disable',
        targetSystem: 'Active Directory',
        objectName: 'tmokoena_ext (OU=Contractors)',
        operation: 'Disable',
        beforeValue: 'Enabled (UAC 512) · OU=Contractors',
        afterValue: 'Disabled (UAC 514) · OU=DisabledUsers',
        detail: 'Disable AD account at 17:00 SAST on 2026-12-01 and relocate DN to DisabledUsers.',
      },
      {
        id: 'pc-1-2',
        category: 'Account Disable',
        targetSystem: 'AWS Prod Vault',
        objectName: 'aws.tmokoena-sre-contractor',
        operation: 'Delete',
        beforeValue: 'Active IAM Identity Center + 1 Access Key',
        afterValue: 'Access Key Deleted · SSO Session Revoked',
        detail: 'Immediately delete standing programmatic access key and terminate AWS SSO assignment.',
      },
      {
        id: 'pc-1-3',
        category: 'Role / Entitlement Revoke',
        targetSystem: 'Active Directory',
        objectName: 'Prod K8s Operator (JIT) + SG-DevOps-Deploy',
        operation: 'Revoke',
        beforeValue: '2 Active Roles / Groups',
        afterValue: '0 Active Assignments',
        detail: 'Strip privileged deployment groups and auto-revoke birthright BR-006 contractor sandbox.',
      },
      {
        id: 'pc-1-4',
        category: 'License Reclaim',
        targetSystem: 'Microsoft Entra ID',
        objectName: 'Microsoft 365 E3 (SPE_E3)',
        operation: 'Reclaim',
        beforeValue: 'Assigned (Active)',
        afterValue: 'Returned to Pool (+1 seat)',
        detail: 'Harvest paid M365 E3 license back into enterprise pool on exit.',
        monthlySavingsZar: 680,
        skuId: 'lic-m365-e3',
      },
      {
        id: 'pc-1-5',
        category: 'License Reclaim',
        targetSystem: 'Okta Workforce',
        objectName: 'GitHub Enterprise Cloud Seat',
        operation: 'Reclaim',
        beforeValue: 'Assigned (Active)',
        afterValue: 'Returned to Pool (+1 seat)',
        detail: 'Reclaim GitHub Enterprise seat and revoke org SSH signing keys.',
        monthlySavingsZar: 390,
        skuId: 'lic-github-ent',
      },
    ],
  },
  {
    id: 'pl-2',
    identityName: 'Annelize Botha',
    employeeNumber: 'EMP-10488',
    email: 'annelize.botha@identra-corp.io',
    title: 'Senior Financial Controller',
    department: 'Corporate Finance & Treasury',
    identityType: 'Employee',
    manager: 'David Chen',
    scheduledExitDate: '2026-12-08',
    daysUntilExit: 11,
    predictionSource: 'Workday HRIS Scheduled Termination',
    confidencePct: 100,
    status: 'Predicted',
    calculatedChanges: [
      {
        id: 'pc-2-1',
        category: 'Account Disable',
        targetSystem: 'SAP S/4HANA Finance',
        objectName: 'ABOTHA_FIN (SAP Dialog)',
        operation: 'Disable',
        beforeValue: 'Valid Until 9999-12-31 · Unlocked',
        afterValue: 'Valid To 2026-12-08 · Locked (Code 64)',
        detail: 'Set SAP user validity end date and lock dialog logon via SAP BAPI.',
      },
      {
        id: 'pc-2-2',
        category: 'Account Disable',
        targetSystem: 'Microsoft Entra ID',
        objectName: 'abotha@corp.identra.net',
        operation: 'Disable',
        beforeValue: 'accountEnabled = true',
        afterValue: 'accountEnabled = false · Refresh Tokens Revoked',
        detail: 'Block Entra ID sign-in, revoke OAuth refresh tokens, and convert mailbox to Shared.',
      },
      {
        id: 'pc-2-3',
        category: 'Role / Entitlement Revoke',
        targetSystem: 'SAP S/4HANA Finance',
        objectName: 'Finance: Base Ledger Read + SAP:FIORI_ANALYTICS_VIEWER',
        operation: 'Revoke',
        beforeValue: '3 SAP & Birthright Roles (BR-002, BR-005)',
        afterValue: 'Revoked on Exit (Auto-Revoke)',
        detail: 'Remove SAP general ledger roles and auto-revoke Finance birthrights.',
      },
      {
        id: 'pc-2-4',
        category: 'License Reclaim',
        targetSystem: 'Microsoft Entra ID',
        objectName: 'Microsoft 365 E5 (SPE_E5)',
        operation: 'Reclaim',
        beforeValue: 'Assigned (E5 Pool Near/Over Limit)',
        afterValue: 'Returned to Pool (+1 E5 seat)',
        detail: 'Frees 1 scarce SPE_E5 license seat, easing BR-005 capacity pressure.',
        monthlySavingsZar: 1050,
        skuId: 'lic-m365-e5',
      },
      {
        id: 'pc-2-5',
        category: 'License Reclaim',
        targetSystem: 'SAP S/4HANA Finance',
        objectName: 'SAP S/4HANA Professional User',
        operation: 'Reclaim',
        beforeValue: 'Assigned (Professional Tier)',
        afterValue: 'Returned to Pool (+1 SAP seat)',
        detail: 'Reclaim high-cost SAP S/4HANA Professional User license.',
        monthlySavingsZar: 2450,
        skuId: 'lic-sap-pro',
      },
      {
        id: 'pc-2-6',
        category: 'Ownership Handoff',
        targetSystem: 'IDENTRA Governance',
        objectName: '3 Direct Reports & 2 Owned Entitlements',
        operation: 'Reassign',
        beforeValue: 'Manager / Owner: Annelize Botha',
        afterValue: 'Re-parent to Claire Vance (Prevents GA-CTRL-01 & GA-CTRL-03 violations)',
        detail: 'Proactively reassign direct reports and Finance entitlement ownership prior to exit date.',
      },
    ],
  },
  {
    id: 'pl-3',
    identityName: 'Kagiso Mahlangu',
    employeeNumber: 'EMP-10712',
    email: 'kagiso.mahlangu@identra-corp.io',
    title: 'Enterprise Data Engineer',
    department: 'Data Governance & Analytics',
    identityType: 'Employee',
    manager: 'Lucas Meyer',
    scheduledExitDate: '2026-12-15',
    daysUntilExit: 18,
    predictionSource: 'Workday HRIS Scheduled Termination',
    confidencePct: 100,
    status: 'Predicted',
    calculatedChanges: [
      {
        id: 'pc-3-1',
        category: 'Account Disable',
        targetSystem: 'Snowflake PII Lake',
        objectName: 'KMAHLANGU_DATA',
        operation: 'Disable',
        beforeValue: 'ACTIVE · Role: PII_ANALYTICS_WRITER',
        afterValue: 'DISABLED = TRUE · Sessions Terminated',
        detail: 'Disable Snowflake account and drop standing PII warehouse session tokens.',
      },
      {
        id: 'pc-3-2',
        category: 'Account Disable',
        targetSystem: 'Okta Workforce',
        objectName: 'kagiso.mahlangu@identra-corp.io',
        operation: 'Disable',
        beforeValue: 'ACTIVE · FIDO2 Enrolled',
        afterValue: 'DEPROVISIONED · All App Tokens Cleared',
        detail: 'Deactivate Okta Workforce identity and revoke all SAML/OIDC federation sessions.',
      },
      {
        id: 'pc-3-3',
        category: 'License Reclaim',
        targetSystem: 'Microsoft Entra ID',
        objectName: 'Microsoft 365 Copilot Enterprise',
        operation: 'Reclaim',
        beforeValue: 'Assigned (Copilot Pool 98.7% full)',
        afterValue: 'Returned to Pool (+1 Copilot seat)',
        detail: 'Reclaim high-demand M365 Copilot add-on license back to pool.',
        monthlySavingsZar: 560,
        skuId: 'lic-m365-copilot',
      },
      {
        id: 'pc-3-4',
        category: 'Ownership Handoff',
        targetSystem: 'IDENTRA Governance',
        objectName: 'Steward of svc.analytics-dbt-runner (NHI)',
        operation: 'Reassign',
        beforeValue: 'Human Steward: Kagiso Mahlangu',
        afterValue: 'Transfer Steward to Lucas Meyer (GA-CTRL-05)',
        detail: 'Prevent service account from becoming an ownerless Non-Human Identity upon exit.',
      },
    ],
  },
  {
    id: 'pl-4',
    identityName: 'Sophia Lindstrom',
    employeeNumber: 'CTR-90405',
    email: 'sophia.lindstrom@nordic-advisory.eu',
    title: 'CRM Commercial Consultant',
    department: 'Global Revenue & Enterprise Sales',
    identityType: 'Contractor',
    manager: 'Marcus Bell',
    scheduledExitDate: '2026-12-31',
    daysUntilExit: 34,
    predictionSource: 'Fixed-Term Contract Expiry',
    confidencePct: 95,
    status: 'Predicted',
    calculatedChanges: [
      {
        id: 'pc-4-1',
        category: 'Account Disable',
        targetSystem: 'Microsoft Entra ID',
        objectName: 'slindstrom_ext#EXT#@corp.identra.net',
        operation: 'Disable',
        beforeValue: 'Active B2B Guest Account',
        afterValue: 'Disabled · Guest Sign-In Blocked',
        detail: 'Disable Entra ID B2B guest account on contract expiration date.',
      },
      {
        id: 'pc-4-2',
        category: 'Role / Entitlement Revoke',
        targetSystem: 'Okta Workforce',
        objectName: 'Sales: Regional CRM Lead + Deal Desk Read',
        operation: 'Revoke',
        beforeValue: '2 Commercial CRM Roles',
        afterValue: 'Revoked on 2026-12-31',
        detail: 'Revoke CRM and deal-desk access groups automatically at term end.',
      },
      {
        id: 'pc-4-3',
        category: 'License Reclaim',
        targetSystem: 'Okta Workforce',
        objectName: 'Salesforce Enterprise CRM License',
        operation: 'Reclaim',
        beforeValue: 'Assigned (Salesforce Enterprise)',
        afterValue: 'Returned to Pool (+1 SFDC seat)',
        detail: 'Reclaim high-value Salesforce Enterprise seat immediately on expiry.',
        monthlySavingsZar: 2950,
        skuId: 'lic-sfdc-ent',
      },
      {
        id: 'pc-4-4',
        category: 'License Reclaim',
        targetSystem: 'Microsoft Entra ID',
        objectName: 'Microsoft 365 F3 Frontline (SPE_F3)',
        operation: 'Reclaim',
        beforeValue: 'Assigned',
        afterValue: 'Returned to Pool (+1 F3 seat)',
        detail: 'Reclaim contractor Frontline license.',
        monthlySavingsZar: 160,
        skuId: 'lic-m365-f3',
      },
    ],
  },
  {
    id: 'pl-5',
    identityName: 'Willem Pretorius',
    employeeNumber: 'EMP-10190',
    email: 'willem.pretorius@identra-corp.io',
    title: 'Regional Infrastructure Architect',
    department: 'Platform & Cloud Engineering',
    identityType: 'Employee',
    manager: 'Alex Carter',
    scheduledExitDate: '2027-01-15',
    daysUntilExit: 49,
    predictionSource: 'Workday HRIS Scheduled Termination',
    confidencePct: 100,
    status: 'Predicted',
    calculatedChanges: [
      {
        id: 'pc-5-1',
        category: 'Account Disable',
        targetSystem: 'Active Directory',
        objectName: 'wpretorius + adm-wpretorius (Tier-1 Admin)',
        operation: 'Disable',
        beforeValue: '2 Accounts Enabled (Standard + Admin)',
        afterValue: 'Both Accounts Disabled & Moved to OU=DisabledUsers',
        detail: 'Coordinated dual-account disable across both standard and privileged admin AD accounts.',
      },
      {
        id: 'pc-5-2',
        category: 'Role / Entitlement Revoke',
        targetSystem: 'AWS Prod Vault',
        objectName: 'SG-Domain-Tier1-ServerAdmins + AWS Infra Admin',
        operation: 'Revoke',
        beforeValue: 'Tier-1 Privileged Standing & JIT Roles',
        afterValue: 'Revoked Across AD & AWS',
        detail: 'Strip all privileged infrastructure roles and expire standing certificates.',
      },
      {
        id: 'pc-5-3',
        category: 'License Reclaim',
        targetSystem: 'Microsoft Entra ID',
        objectName: 'Microsoft 365 E5 (SPE_E5)',
        operation: 'Reclaim',
        beforeValue: 'Assigned',
        afterValue: 'Returned to Pool (+1 E5 seat)',
        detail: 'Reclaim E5 security & compliance license seat.',
        monthlySavingsZar: 1050,
        skuId: 'lic-m365-e5',
      },
      {
        id: 'pc-5-4',
        category: 'Ownership Handoff',
        targetSystem: 'IDENTRA Governance',
        objectName: 'Application Owner: Legacy Payroll SFTP Bridge',
        operation: 'Reassign',
        beforeValue: 'App Owner: Willem Pretorius',
        afterValue: 'Handover to Priya Nair before 2027-01-15 (GA-CTRL-02)',
        detail: 'Reassign connected application ownership to maintain Governance Assurance compliance.',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Per-Identity Lifecycle Timeline & Access Reconstruction Engine             */
/* -------------------------------------------------------------------------- */

export type LifecycleTimelineEventKind =
  | 'Employment Change'
  | 'Account Creation'
  | 'Access Grant'
  | 'Approval'
  | 'Manager Change'
  | 'Transfer'
  | 'Termination'
  | 'Exception';

export interface IdentityLifecycleTimelineEvent {
  id: string;
  timestamp: string;
  kind: LifecycleTimelineEventKind;
  title: string;
  detail: string;
  actor: string;
  system: string;
  referenceCode?: string;
  accessArtifact?: string;
  stillActiveToday?: boolean;
  changes?: { field: string; before: string | null; after: string | null }[];
}

export interface AccessOriginReconstruction {
  artifact: string;
  originType:
    | 'Birthright Policy'
    | 'Approved Request'
    | 'Transfer / Legacy Retention'
    | 'Governance Exception'
    | 'Orphan Adoption'
    | 'Baseline Provisioning';
  grantedOn: string;
  approvedOrTriggeredBy: string;
  referenceCode: string;
  whyStillHeldToday: string;
  riskNote?: string;
}

export function buildIdentityLifecycleTimeline(
  person: DemoPerson,
  accessRequests: DemoAccessRequest[],
  reviews: DemoReviewItem[]
): IdentityLifecycleTimelineEvent[] {
  const events: IdentityLifecycleTimelineEvent[] = [];

  // 1. Rich historical baseline tailored per identity
  if (person.id === 'p-elena') {
    events.push(
      {
        id: 'tl-elena-1',
        timestamp: '2024-03-14 08:00:00',
        kind: 'Employment Change',
        title: 'Permanent Employment Hire (Senior AP Specialist)',
        detail: 'Authoritative Workday HRIS hire record synchronized into IDENTRA under EMEA Finance Operations.',
        actor: 'Workday HRIS Core',
        system: 'Workday HRIS',
        referenceCode: 'WD-68304',
        changes: [
          { field: 'employmentStatus', before: null, after: 'Active (FTE)' },
          { field: 'title', before: null, after: 'Senior AP Specialist' },
          { field: 'department', before: null, after: 'Corporate Finance & Treasury' },
        ],
      },
      {
        id: 'tl-elena-2',
        timestamp: '2024-03-14 08:04:12',
        kind: 'Account Creation',
        title: 'Target Accounts Provisioned (AD, SAP S/4HANA, Okta)',
        detail: 'Automated Day-1 account creation across Active Directory (evance), Okta Workforce, and SAP S/4HANA.',
        actor: 'Provisioning Engine',
        system: 'Active Directory · SAP S/4HANA',
        referenceCode: 'PRV-4102',
        accessArtifact: 'AD: evance · SAP: EVANCE_FIN',
        stillActiveToday: true,
      },
      {
        id: 'tl-elena-3',
        timestamp: '2024-03-14 08:06:30',
        kind: 'Access Grant',
        title: 'Granted Finance: AP-Clerk (Birthright & Onboarding)',
        detail: 'Assigned AP vendor master creation & invoice posting access for AP Operations role.',
        actor: 'Birthright Engine (BR-002)',
        system: 'SAP S/4HANA Finance',
        referenceCode: 'BR-002',
        accessArtifact: 'Finance: AP-Clerk (Legacy)',
        stillActiveToday: person.roles.some((r) => r.includes('AP-Clerk')),
      },
      {
        id: 'tl-elena-4',
        timestamp: '2024-03-15 10:22:00',
        kind: 'Approval',
        title: 'Manager Approval Completed for SAP Vendor Creation',
        detail: 'Claire Vance approved elevated SAP T-Code XK01/FB60 entitlement under WF-AP-01.',
        actor: 'Claire Vance (Line Manager)',
        system: 'IDENTRA Approvals',
        referenceCode: 'APR-7814',
        accessArtifact: 'Finance: AP-Clerk (Legacy)',
        stillActiveToday: person.roles.some((r) => r.includes('AP-Clerk')),
      },
      {
        id: 'tl-elena-5',
        timestamp: '2026-11-11 08:00:00',
        kind: 'Transfer',
        title: 'Internal Transfer: AP Operations → EMEA Treasury & Payments',
        detail: 'Promoted to Treasury Operations Lead; organizational unit updated in Workday HRIS.',
        actor: 'Workday HRIS Core',
        system: 'Workday HRIS',
        referenceCode: 'WD-TRF-992',
        changes: [
          { field: 'orgUnit', before: 'OU-FIN-OPS-EMEA', after: 'OU-FIN-TREASURY-EMEA' },
          { field: 'title', before: 'Senior AP Specialist', after: 'Treasury Operations Lead' },
        ],
      },
      {
        id: 'tl-elena-6',
        timestamp: '2026-11-11 08:00:15',
        kind: 'Manager Change',
        title: 'Line Manager Reassigned: Claire Vance → David Chen',
        detail: 'Reporting line transferred to Treasury Director David Chen following internal move.',
        actor: 'Workday HRIS Core',
        system: 'IDENTRA Identity Graph',
        referenceCode: 'MGR-CHG-118',
        changes: [{ field: 'manager', before: 'Claire Vance', after: 'David Chen' }],
      },
      {
        id: 'tl-elena-7',
        timestamp: '2026-11-11 11:45:00',
        kind: 'Approval',
        title: 'Dual-Stage Approval for Treasury: Payment Approver',
        detail: 'David Chen (Manager) and Treasury Risk Committee approved outbound wire release authority.',
        actor: 'David Chen · Risk Committee',
        system: 'IDENTRA Approvals',
        referenceCode: 'REQ-8821',
        accessArtifact: 'Treasury: Payment Approver',
        stillActiveToday: person.roles.some((r) => r.includes('Payment Approver')),
      },
      {
        id: 'tl-elena-8',
        timestamp: '2026-11-11 11:46:10',
        kind: 'Access Grant',
        title: 'Provisioned Treasury: Payment Approver Role',
        detail: 'Granted SAP Treasury payment release entitlements; legacy AP-Clerk remained attached during 14-day handover.',
        actor: 'Provisioning Engine',
        system: 'SAP S/4HANA Finance',
        referenceCode: 'PRV-8849',
        accessArtifact: 'Treasury: Payment Approver',
        stillActiveToday: person.roles.some((r) => r.includes('Payment Approver')),
      },
      {
        id: 'tl-elena-9',
        timestamp: '2026-11-12 09:00:00',
        kind: 'Exception',
        title: 'Temporary 10-Day Handover Exception (EXPIRED)',
        detail: 'Short-term dual-access handover window granted for month-end AP close; expired 2026-11-22 leaving SOX-SOD-402 toxic combination open.',
        actor: 'SOX Governance Committee',
        system: 'Policies & SoD Engine',
        referenceCode: 'EXC-SOX-402',
        accessArtifact: 'Finance: AP-Clerk (Legacy)',
        stillActiveToday: Boolean(person.sodAlert),
      }
    );
  } else if (person.id === 'p-sarah') {
    events.push(
      {
        id: 'tl-sarah-1',
        timestamp: '2026-11-23 10:24:12',
        kind: 'Employment Change',
        title: 'Day-1 Joiner Hire (Financial Analyst · FTE)',
        detail: 'New permanent hire synced from Workday HRIS into EMEA Finance Operations (London HQ).',
        actor: 'Workday HRIS Core',
        system: 'Workday HRIS',
        referenceCode: 'WD-99412',
        changes: [
          { field: 'jmlStatus', before: null, after: 'Joiner' },
          { field: 'costCenter', before: null, after: 'CC-4100-FIN' },
        ],
      },
      {
        id: 'tl-sarah-2',
        timestamp: '2026-11-23 10:24:18',
        kind: 'Account Creation',
        title: 'Automated Day-1 Accounts Created (AD, Entra ID, SAP)',
        detail: 'Provisioned sAMAccountName smitchell, UPN smitchell@corp.identra.net, and SAP Dialog read-only account.',
        actor: 'Provisioning Engine',
        system: 'Active Directory · Entra ID · SAP',
        referenceCode: 'PRV-9001',
        accessArtifact: 'AD: smitchell · Entra: smitchell@corp.identra.net',
        stillActiveToday: true,
      },
      {
        id: 'tl-sarah-3',
        timestamp: '2026-11-23 10:24:25',
        kind: 'Access Grant',
        title: 'Birthright Pack Provisioned (BR-001, BR-002, BR-005)',
        detail: 'Automatically assigned Corporate SSO Standard, Finance: Base Ledger Read, and M365 E3/E5 baseline based on Finance UK context.',
        actor: 'Birthright Engine',
        system: 'SAP S/4HANA · Okta · Entra ID',
        referenceCode: 'BR-002',
        accessArtifact: 'Finance: Base Ledger Read',
        stillActiveToday: true,
      },
      {
        id: 'tl-sarah-4',
        timestamp: '2026-11-23 11:05:00',
        kind: 'Approval',
        title: 'Line Manager Onboarding Attestation Approved',
        detail: 'Claire Vance confirmed Finance UK context binding and Day-1 least-privilege scope.',
        actor: 'Claire Vance (Line Manager)',
        system: 'IDENTRA Approvals',
        referenceCode: 'APR-9941',
        accessArtifact: 'Corporate SSO Standard',
        stillActiveToday: true,
      }
    );
  } else if (person.id === 'p-mark') {
    events.push(
      {
        id: 'tl-mark-1',
        timestamp: '2026-08-22 08:00:00',
        kind: 'Employment Change',
        title: 'Fixed-Term External Contractor Onboarded (90 Days)',
        detail: 'Vanguard External Assurance LLP auditor onboarded via B2B Partner Lifecycle Portal with hard expiry 2026-11-21.',
        actor: 'B2B Partner Lifecycle Portal',
        system: 'Partner Onboarding',
        referenceCode: 'B2B-4412-EXT',
      },
      {
        id: 'tl-mark-2',
        timestamp: '2026-08-22 08:15:00',
        kind: 'Approval',
        title: 'Sponsor & SecOps Approval Completed',
        detail: 'Priya Nair (Sponsor) and Cloud SecOps approved scoped 90-day external cloud audit access.',
        actor: 'Priya Nair · Cloud SecOps',
        system: 'IDENTRA Approvals',
        referenceCode: 'APR-8102',
        accessArtifact: 'AWS Prod Vault (Audit Read)',
      },
      {
        id: 'tl-mark-3',
        timestamp: '2026-08-22 08:20:00',
        kind: 'Account Creation',
        title: 'Created AD Contractor & AWS Audit Accounts',
        detail: 'Provisioned mwilson_ext in OU=Contractors and federated AWS Prod Vault read account.',
        actor: 'Provisioning Engine',
        system: 'Active Directory · AWS Prod Vault',
        referenceCode: 'PRV-7410',
        accessArtifact: 'AD: mwilson_ext · AWS Key',
      },
      {
        id: 'tl-mark-4',
        timestamp: '2026-10-04 16:40:00',
        kind: 'Exception',
        title: 'Direct Out-of-Band AWS Access Key Detected (Unapproved)',
        detail: 'Direct IAM access key created outside IDENTRA workflow; flagged as high-risk orphan persistence.',
        actor: 'Drift Detection Scanner',
        system: 'AWS Prod Vault',
        referenceCode: 'DRF-902',
        accessArtifact: 'AWS Prod Vault (Orphan Key)',
        stillActiveToday: person.jmlStatus !== 'Suspended' && person.jmlStatus !== 'Deactivated',
      },
      {
        id: 'tl-mark-5',
        timestamp: '2026-11-21 23:59:59',
        kind: 'Termination',
        title: 'Contractor Fixed-Term End Date Reached — Offboarding Initiated',
        detail: 'Contract expired; Active Directory account disabled and moved to OU=DisabledUsers while orphaned AWS key flagged for revocation.',
        actor: 'B2B Partner Lifecycle Portal',
        system: 'Active Directory · IDENTRA JML',
        referenceCode: 'JML-TERM-441',
        changes: [
          { field: 'jmlStatus', before: 'Active', after: 'Leaver' },
          { field: 'accountStatus', before: 'Enabled', after: 'Disabled (AD)' },
        ],
      }
    );
  } else if (person.id === 'p-john') {
    events.push(
      {
        id: 'tl-john-1',
        timestamp: '2024-04-01 09:00:00',
        kind: 'Employment Change',
        title: 'Permanent Hire (Senior Account Executive · New York)',
        detail: 'Onboarded via Workday HRIS under Global Revenue & Enterprise Sales.',
        actor: 'Workday HRIS Core',
        system: 'Workday HRIS',
        referenceCode: 'WD-72188',
      },
      {
        id: 'tl-john-2',
        timestamp: '2024-04-01 09:05:00',
        kind: 'Account Creation',
        title: 'Provisioned Entra ID, Okta, Salesforce & Snowflake Accounts',
        detail: 'Baseline commercial accounts provisioned with M365 E5 and Salesforce Enterprise CRM.',
        actor: 'Provisioning Engine',
        system: 'Salesforce · Entra ID · Okta',
        referenceCode: 'PRV-5120',
        accessArtifact: 'Sales: Regional CRM Lead',
        stillActiveToday: true,
      },
      {
        id: 'tl-john-3',
        timestamp: '2026-11-23 09:47:05',
        kind: 'Transfer',
        title: 'Promotion & Regional Transfer: US Mid-Market → Enterprise Sales EMEA',
        detail: 'Promoted to Enterprise Account Director; org unit updated to OU-SLS-ENT-EMEA.',
        actor: 'Workday HRIS Core',
        system: 'Workday HRIS',
        referenceCode: 'WD-PROM-309',
        changes: [
          { field: 'title', before: 'Senior Account Executive', after: 'Enterprise Account Director' },
          { field: 'orgUnit', before: 'OU-SLS-MID-US', after: 'OU-SLS-ENT-EMEA' },
        ],
      },
      {
        id: 'tl-john-4',
        timestamp: '2026-11-23 10:02:00',
        kind: 'Approval',
        title: 'Approved Deal Desk Approver Authority',
        detail: 'Marcus Bell (VP Enterprise Sales) approved elevated Deal Desk Approver role for EMEA enterprise contracts.',
        actor: 'Marcus Bell (Line Manager)',
        system: 'IDENTRA Approvals',
        referenceCode: 'REQ-8910',
        accessArtifact: 'Deal Desk Approver',
        stillActiveToday: true,
      },
      {
        id: 'tl-john-5',
        timestamp: '2026-11-23 10:04:00',
        kind: 'Access Grant',
        title: 'Provisioned Deal Desk Approver Role',
        detail: 'Role granted in Salesforce CRM & Snowflake Analytics following manager approval.',
        actor: 'Provisioning Engine',
        system: 'Salesforce CRM · Snowflake',
        referenceCode: 'PRV-9015',
        accessArtifact: 'Deal Desk Approver',
        stillActiveToday: true,
      }
    );
  } else if (person.id === 'p-priya') {
    events.push(
      {
        id: 'tl-priya-1',
        timestamp: '2023-09-01 08:30:00',
        kind: 'Employment Change',
        title: 'Permanent Hire (Principal Platform Engineer)',
        detail: 'Onboarded into Platform SRE & Cloud Infrastructure under Alex Carter.',
        actor: 'Workday HRIS Core',
        system: 'Workday HRIS',
        referenceCode: 'WD-51209',
      },
      {
        id: 'tl-priya-2',
        timestamp: '2023-09-01 08:35:00',
        kind: 'Account Creation',
        title: 'Provisioned Standard & Privileged Admin Accounts',
        detail: 'Created pnair@corp.identra.net and separate Tier-1 admin identity adm-pnair@corp.identra.net.',
        actor: 'Provisioning Engine',
        system: 'Active Directory · AWS · GitHub',
        referenceCode: 'PRV-3188',
        accessArtifact: 'GitHub Org Maintainer',
        stillActiveToday: true,
      },
      {
        id: 'tl-priya-3',
        timestamp: '2023-09-04 14:20:00',
        kind: 'Access Grant',
        title: 'Assigned Prod K8s Operator (JIT) & GitHub Org Maintainer',
        detail: 'Granted via Tier-0 SRE Birthright (BR-003) and Alex Carter approval.',
        actor: 'Birthright Engine (BR-003)',
        system: 'AWS Prod Vault · GitHub Enterprise',
        referenceCode: 'BR-003',
        accessArtifact: 'Prod K8s Operator (JIT)',
        stillActiveToday: true,
      },
      {
        id: 'tl-priya-4',
        timestamp: '2026-11-19 14:10:00',
        kind: 'Approval',
        title: 'Q4 Privileged Access Certification Approved',
        detail: 'Alex Carter recertified Prod K8s Operator (JIT) eligibility under 90-day Tier-0 SLA.',
        actor: 'Alex Carter (VP Engineering)',
        system: 'Access Reviews',
        referenceCode: 'REV-Q4-019',
        accessArtifact: 'Prod K8s Operator (JIT)',
        stillActiveToday: true,
      }
    );
  } else if (person.id === 'p-lucas') {
    events.push(
      {
        id: 'tl-lucas-1',
        timestamp: '2024-06-15 08:00:00',
        kind: 'Employment Change',
        title: 'Permanent Hire (Head of Data Governance · Zurich)',
        detail: 'Authoritative hire synced into Enterprise Data Stewardship reporting to CDO Hannah Lindqvist.',
        actor: 'Workday HRIS Core',
        system: 'Workday HRIS',
        referenceCode: 'WD-64901',
      },
      {
        id: 'tl-lucas-2',
        timestamp: '2024-06-15 08:08:00',
        kind: 'Account Creation',
        title: 'Provisioned Snowflake PII Lake, Okta & GitHub Accounts',
        detail: 'Created governed Snowflake data stewardship account with hardware FIDO2 enforcement.',
        actor: 'Provisioning Engine',
        system: 'Snowflake PII Lake · Okta',
        referenceCode: 'PRV-5902',
        accessArtifact: 'Snowflake Data Steward',
        stillActiveToday: true,
      },
      {
        id: 'tl-lucas-3',
        timestamp: '2024-06-16 11:00:00',
        kind: 'Approval',
        title: 'Data Owner & SecOps Approval for Tier-0 PII Stewardship',
        detail: 'Hannah Lindqvist & Data Protection Officer approved GDPR Art. 32 PII access.',
        actor: 'Hannah Lindqvist · DPO',
        system: 'IDENTRA Approvals',
        referenceCode: 'APR-6204',
        accessArtifact: 'Snowflake Data Steward',
        stillActiveToday: true,
      },
      {
        id: 'tl-lucas-4',
        timestamp: '2026-11-17 11:05:22',
        kind: 'Access Grant',
        title: 'Recertified Snowflake Data Steward & Compliance Auditor',
        detail: 'Annual compliance attestation renewed with zero SoD conflicts.',
        actor: 'Governance Engine',
        system: 'Snowflake PII Lake',
        referenceCode: 'REV-GDPR-88',
        accessArtifact: 'Compliance Auditor',
        stillActiveToday: true,
      }
    );
  } else {
    // Dynamically generated baseline for newly onboarded, simulated, or adopted identities
    events.push({
      id: `tl-dyn-hire-${person.id}`,
      timestamp: `${person.hrStartDate} 09:00:00`,
      kind: person.provenance ? 'Exception' : 'Employment Change',
      title: person.provenance
        ? `Identity Adopted From Orphaned Account (${person.provenance.originalAccountId})`
        : `${person.type} Identity Created (${person.title})`,
      detail: person.provenance
        ? `Adopted by ${person.provenance.adoptedBy} from ${person.provenance.accountCorrelationSource}; authoritative source set to ${person.provenance.authoritativeSource}.`
        : `Synchronized from ${person.sourceSystem} under ${person.department} reporting to ${person.manager}.`,
      actor: person.provenance ? person.provenance.adoptedBy : person.sourceSystem,
      system: person.sourceSystem,
      referenceCode: person.provenance?.approvalReference ?? person.sourceExternalId,
      accessArtifact: person.roles[0],
      stillActiveToday: true,
    });
  }

  // 2. Append any live session changeHistory events not already duplicated
  person.changeHistory.forEach((ch) => {
    const alreadyCovered = events.some((e) => e.timestamp === ch.timestamp);
    if (alreadyCovered) return;
    let kind: LifecycleTimelineEventKind = 'Employment Change';
    if (ch.category === 'Emergency Deactivation') kind = 'Termination';
    else if (ch.category === 'Provisioning') kind = 'Account Creation';
    else if (ch.category === 'Context Change') kind = 'Transfer';
    else if (ch.category === 'Role / SoD') kind = 'Access Grant';
    else if (ch.summary.toLowerCase().includes('manager')) kind = 'Manager Change';

    events.push({
      id: `tl-hist-${ch.id}`,
      timestamp: ch.timestamp,
      kind,
      title: ch.summary,
      detail: `Live session event recorded by ${ch.source} (${ch.category}).`,
      actor: ch.source,
      system: ch.source,
      changes: ch.changes,
      stillActiveToday: kind === 'Access Grant',
    });
  });

  // 3. Append any live Access Marketplace requests for this person
  accessRequests
    .filter((req) => req.targetPersonId === person.id)
    .forEach((req) => {
      events.push({
        id: `tl-req-${req.id}`,
        timestamp: req.submittedAt.includes('-') ? req.submittedAt : `2026-11-27 ${req.submittedAt}`,
        kind: req.status === 'Approved & Provisioned' ? 'Access Grant' : 'Approval',
        title: `${req.status}: ${req.resourceName} (${req.selectedAccountKind})`,
        detail: `Requested by ${req.requestedByName} via ${req.workflowName}. Motivation: "${req.motivation}"`,
        actor: req.requestedByName,
        system: req.application,
        referenceCode: req.requestCode,
        accessArtifact: req.resourceName,
        stillActiveToday: req.status === 'Approved & Provisioned',
      });
    });

  // 4. Append completed Access Review certifications for this person
  reviews
    .filter((rev) => rev.personId === person.id && rev.decision !== 'Pending')
    .forEach((rev) => {
      events.push({
        id: `tl-rev-${rev.id}`,
        timestamp: rev.triggeredAt.includes('-') ? rev.triggeredAt : `2026-11-26 12:00:00`,
        kind: 'Approval',
        title: `Access Review ${rev.decision}: ${rev.roleOrEntitlement}`,
        detail: `${rev.workflowType} completed by ${rev.reviewer}.`,
        actor: rev.reviewer,
        system: rev.application,
        referenceCode: rev.workflowCode,
        accessArtifact: rev.roleOrEntitlement,
        stillActiveToday: rev.decision === 'Approved',
      });
    });

  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function reconstructAccessLineage(
  person: DemoPerson,
  timeline: IdentityLifecycleTimelineEvent[]
): AccessOriginReconstruction[] {
  return person.roles.map((roleName) => {
    const matchEvent =
      timeline.find(
        (e) =>
          e.accessArtifact &&
          (e.accessArtifact.toLowerCase().includes(roleName.toLowerCase()) ||
            roleName.toLowerCase().includes(e.accessArtifact.toLowerCase()))
      ) ?? timeline[timeline.length - 1];

    let originType: AccessOriginReconstruction['originType'] = 'Baseline Provisioning';
    if (person.provenance && roleName === 'Corporate SSO Standard') {
      originType = 'Orphan Adoption';
    } else if (roleName.toLowerCase().includes('legacy')) {
      originType = 'Transfer / Legacy Retention';
    } else if (matchEvent?.referenceCode?.startsWith('BR-')) {
      originType = 'Birthright Policy';
    } else if (matchEvent?.kind === 'Exception') {
      originType = 'Governance Exception';
    } else if (matchEvent?.kind === 'Approval' || matchEvent?.referenceCode?.startsWith('REQ-')) {
      originType = 'Approved Request';
    }

    const isLegacyConflict =
      roleName.toLowerCase().includes('legacy') && Boolean(person.sodAlert);

    return {
      artifact: roleName,
      originType,
      grantedOn: matchEvent?.timestamp.slice(0, 10) ?? person.hrStartDate,
      approvedOrTriggeredBy: matchEvent?.actor ?? person.sourceSystem,
      referenceCode: matchEvent?.referenceCode ?? person.sourceExternalId,
      whyStillHeldToday: isLegacyConflict
        ? `Retained after transfer from AP Operations; temporary handover exception expired and triggered ${person.sodAlert}.`
        : originType === 'Birthright Policy'
          ? `Identity still satisfies active ${matchEvent?.referenceCode ?? 'Birthright'} attribute/context criteria.`
          : originType === 'Orphan Adoption'
            ? `Granted during governed orphaned account adoption (${person.provenance?.approvalReference ?? 'APR'}) with provenance preserved.`
            : `Approved via ${matchEvent?.actor ?? person.manager} and remains certified (${person.lastAttestation}).`,
      riskNote: isLegacyConflict ? 'SoD Conflict — Recommended for Revocation' : undefined,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Peer-Based Access Recommendations (Position, Dept, Responsibilities, Loc)  */
/* -------------------------------------------------------------------------- */

export interface PeerAccessRecommendation {
  id: string;
  resourceName: string;
  resourceKind: MarketplaceCatalogItem['kind'];
  application: string;
  catalogItemId?: string;
  confidencePct: number;
  peerAdoptionRatio: string;
  matchingDimensions: {
    dimension: 'Position' | 'Department' | 'Responsibilities' | 'Location';
    value: string;
  }[];
  samplePeers: { name: string; title: string; location: string }[];
  rationale: string;
  sodRisk: 'Clean' | 'SoD Caution';
}

export function getPeerAccessRecommendations(
  person: DemoPerson
): PeerAccessRecommendation[] {
  const deptLower = person.department.toLowerCase();
  const titleLower = person.title.toLowerCase();
  const existingLower = person.roles.map((r) => r.toLowerCase());

  const alreadyHas = (name: string) =>
    existingLower.some(
      (r) => r.includes(name.toLowerCase()) || name.toLowerCase().includes(r)
    );

  const recs: PeerAccessRecommendation[] = [];

  if (deptLower.includes('finance') || titleLower.includes('financial') || titleLower.includes('treasury')) {
    if (!alreadyHas('Copilot')) {
      recs.push({
        id: `rec-${person.id}-copilot`,
        resourceName: 'Microsoft 365 Copilot Enterprise',
        resourceKind: 'Entra ID License',
        application: 'Microsoft Entra ID',
        catalogItemId: 'cat-m365-copilot',
        confidencePct: 94,
        peerAdoptionRatio: '16 of 17 peers (94%)',
        matchingDimensions: [
          { dimension: 'Position', value: person.title },
          { dimension: 'Department', value: person.department },
          { dimension: 'Location', value: person.location },
        ],
        samplePeers: [
          { name: 'Claire Vance', title: 'Finance Operations Lead', location: 'London, UK (HQ)' },
          { name: 'Lerato Dlamini', title: 'Financial Accountant', location: 'Johannesburg' },
        ],
        rationale: `94% of colleagues in ${person.department} at ${person.location} use M365 Copilot for automated variance analysis & board pack drafting.`,
        sodRisk: 'Clean',
      });
    }
    if (!alreadyHas('Snowflake')) {
      recs.push({
        id: `rec-${person.id}-sf-fin`,
        resourceName: 'Snowflake: Customer Analytics Masked Read',
        resourceKind: 'Entitlement',
        application: 'Snowflake PII Lake',
        catalogItemId: 'cat-sf-pii',
        confidencePct: 91,
        peerAdoptionRatio: '31 of 34 peers (91%)',
        matchingDimensions: [
          { dimension: 'Position', value: person.title },
          { dimension: 'Responsibilities', value: person.orgUnitName },
          { dimension: 'Department', value: person.department },
        ],
        samplePeers: [
          { name: 'Pieter van der Merwe', title: 'Financial Accountant', location: 'Johannesburg' },
          { name: 'David Chen', title: 'Treasury Director', location: 'London, UK (HQ)' },
        ],
        rationale: `Shared by 91% of peers with ${person.orgUnitName} responsibilities for masked financial analytics — zero SoD risk.`,
        sodRisk: 'Clean',
      });
    }
    if (!alreadyHas('Deal Desk')) {
      recs.push({
        id: `rec-${person.id}-deal`,
        resourceName: 'Salesforce · Deal Desk Approver',
        resourceKind: 'Business Role',
        application: 'Salesforce CRM',
        catalogItemId: 'cat-sfdc-deal',
        confidencePct: 83,
        peerAdoptionRatio: '10 of 12 peers (83%)',
        matchingDimensions: [
          { dimension: 'Department', value: person.department },
          { dimension: 'Responsibilities', value: 'Commercial Margin & Pricing Sign-Off' },
          { dimension: 'Location', value: person.location },
        ],
        samplePeers: [
          { name: 'Aisha Patel', title: 'Financial Analyst', location: 'London, UK (HQ)' },
          { name: 'Sipho Ndlovu', title: 'Financial Analyst', location: 'Johannesburg' },
        ],
        rationale: `Used by 83% of Finance peers supporting commercial contract pricing approvals.`,
        sodRisk: 'Clean',
      });
    }
  } else if (deptLower.includes('engineering') || deptLower.includes('platform') || titleLower.includes('engineer')) {
    recs.push(
      {
        id: `rec-${person.id}-aws-jit`,
        resourceName: 'AWS Prod Vault · EKS Cluster Admin (JIT)',
        resourceKind: 'JIT Elevation',
        application: 'AWS Prod Vault',
        catalogItemId: 'cat-aws-k8s',
        confidencePct: 95,
        peerAdoptionRatio: '19 of 20 peers (95%)',
        matchingDimensions: [
          { dimension: 'Position', value: person.title },
          { dimension: 'Department', value: person.department },
          { dimension: 'Responsibilities', value: person.orgUnitName },
          { dimension: 'Location', value: person.location },
        ],
        samplePeers: [
          { name: 'Alex Carter', title: 'VP Platform Engineering', location: 'London, UK (HQ)' },
          { name: 'Willem Pretorius', title: 'Regional Infra Architect', location: 'Johannesburg' },
        ],
        rationale: `95% of Platform SRE peers hold time-bound JIT cluster elevation for incident diagnostics without standing privilege risk.`,
        sodRisk: 'Clean',
      },
      {
        id: `rec-${person.id}-sf-eng`,
        resourceName: 'Snowflake: Customer Analytics Masked Read',
        resourceKind: 'Entitlement',
        application: 'Snowflake PII Lake',
        catalogItemId: 'cat-sf-pii',
        confidencePct: 86,
        peerAdoptionRatio: '12 of 14 peers (86%)',
        matchingDimensions: [
          { dimension: 'Position', value: person.title },
          { dimension: 'Responsibilities', value: 'Telemetry & Incident Analytics' },
          { dimension: 'Location', value: person.location },
        ],
        samplePeers: [
          { name: 'Lucas Meyer', title: 'Head of Data Governance', location: 'Zurich, CH' },
          { name: 'Kagiso Mahlangu', title: 'Enterprise Data Engineer', location: 'Johannesburg' },
        ],
        rationale: `Frequently granted to senior engineering leads for production SLA & pipeline observability queries.`,
        sodRisk: 'Clean',
      },
      {
        id: `rec-${person.id}-tier1-ad`,
        resourceName: 'SG-Tier1-Server-Operators',
        resourceKind: 'AD Security Group',
        application: 'Active Directory',
        catalogItemId: 'cat-ad-sec-ops',
        confidencePct: 79,
        peerAdoptionRatio: '11 of 14 peers (79%)',
        matchingDimensions: [
          { dimension: 'Department', value: person.department },
          { dimension: 'Responsibilities', value: person.orgUnitName },
        ],
        samplePeers: [
          { name: 'Alex Carter', title: 'VP Platform Engineering', location: 'London, UK (HQ)' },
        ],
        rationale: `Assigned to 79% of infrastructure leads (requires Privileged Admin account targeting & dual-stage approval).`,
        sodRisk: 'SoD Caution',
      }
    );
  } else if (deptLower.includes('sales') || deptLower.includes('revenue')) {
    recs.push(
      {
        id: `rec-${person.id}-sf-rev`,
        resourceName: 'Snowflake: Customer Analytics Masked Read',
        resourceKind: 'Entitlement',
        application: 'Snowflake PII Lake',
        catalogItemId: 'cat-sf-pii',
        confidencePct: 92,
        peerAdoptionRatio: '22 of 24 peers (92%)',
        matchingDimensions: [
          { dimension: 'Position', value: person.title },
          { dimension: 'Department', value: person.department },
          { dimension: 'Location', value: person.location },
        ],
        samplePeers: [
          { name: 'Marcus Bell', title: 'VP Enterprise Sales', location: 'New York, US' },
          { name: 'Sophia Lindstrom', title: 'CRM Commercial Consultant', location: 'EMEA' },
        ],
        rationale: `92% of Enterprise Account Directors use masked Snowflake pipeline analytics for quarterly ARR forecasting.`,
        sodRisk: 'Clean',
      },
      {
        id: `rec-${person.id}-copilot-sls`,
        resourceName: 'Microsoft 365 Copilot Enterprise',
        resourceKind: 'Entra ID License',
        application: 'Microsoft Entra ID',
        catalogItemId: 'cat-m365-copilot',
        confidencePct: 88,
        peerAdoptionRatio: '15 of 17 peers (88%)',
        matchingDimensions: [
          { dimension: 'Position', value: person.title },
          { dimension: 'Responsibilities', value: person.orgUnitName },
        ],
        samplePeers: [
          { name: 'Marcus Bell', title: 'VP Enterprise Sales', location: 'New York, US' },
        ],
        rationale: `88% of Enterprise Sales Directors hold Copilot for customer proposal generation and meeting recaps.`,
        sodRisk: 'Clean',
      }
    );
  } else {
    recs.push(
      {
        id: `rec-${person.id}-sf-gen`,
        resourceName: 'Snowflake: Customer Analytics Masked Read',
        resourceKind: 'Entitlement',
        application: 'Snowflake PII Lake',
        catalogItemId: 'cat-sf-pii',
        confidencePct: 89,
        peerAdoptionRatio: '16 of 18 peers (89%)',
        matchingDimensions: [
          { dimension: 'Position', value: person.title },
          { dimension: 'Department', value: person.department },
          { dimension: 'Location', value: person.location },
        ],
        samplePeers: [
          { name: 'Lucas Meyer', title: 'Head of Data Governance', location: 'Zurich, CH' },
          { name: 'Priya Nair', title: 'Principal Platform Engineer', location: 'London, UK (HQ)' },
        ],
        rationale: `Held by 89% of peers in ${person.department} with overlapping governance & analytics responsibilities.`,
        sodRisk: 'Clean',
      },
      {
        id: `rec-${person.id}-gh-gen`,
        resourceName: 'GitHub Enterprise · Core Repo Maintainer',
        resourceKind: 'Business Role',
        application: 'GitHub Enterprise',
        catalogItemId: 'cat-gh-maint',
        confidencePct: 82,
        peerAdoptionRatio: '9 of 11 peers (82%)',
        matchingDimensions: [
          { dimension: 'Responsibilities', value: person.orgUnitName },
          { dimension: 'Location', value: person.location },
        ],
        samplePeers: [
          { name: 'Priya Nair', title: 'Principal Platform Engineer', location: 'London, UK (HQ)' },
        ],
        rationale: `Commonly held by peers in ${person.orgUnitName} managing policy-as-code repositories.`,
        sodRisk: 'Clean',
      }
    );
  }

  return recs;
}

/* -------------------------------------------------------------------------- */
/* Active Directory Structural Governance (Managed Organizational Units)      */
/* -------------------------------------------------------------------------- */

export type OuGovernanceState = 'Managed' | 'Discovered' | 'Non-Compliant';

export interface OuDelegatedPermission {
  id: string;
  principal: string;
  principalType: 'Group' | 'User' | 'Service Account';
  rights: string;
  inherited: boolean;
  excessive: boolean;
  reviewedOn: string;
}

export interface OuGpoLink {
  name: string;
  enforced: boolean;
  status: 'Enabled' | 'Link Disabled';
}

export interface OuDriftEvent {
  detectedAt: string;
  kind:
    | 'Out-of-Band Create'
    | 'Renamed Outside Process'
    | 'Moved Outside Process'
    | 'Unexpected Delegation'
    | 'Deleted in AD';
  detail: string;
  previousDn?: string;
}

export interface DemoOrganizationalUnit {
  id: string;
  objectGuid: string;
  name: string;
  distinguishedName: string;
  parentOuId: string | null;
  parentDn: string;
  description: string;
  domain: string;
  businessOwner: string | null;
  technicalCustodian: string | null;
  createdDate: string;
  lastModified: string;
  childCounts: {
    users: number;
    groups: number;
    computers: number;
  };
  governanceState: OuGovernanceState;
  riskScore: number;
  containsPrivilegedAccounts: boolean;
  namingCompliant: boolean;
  inheritanceBlocked: boolean;
  gpoLinks: OuGpoLink[];
  delegatedPermissions: OuDelegatedPermission[];
  driftEvent?: OuDriftEvent;
  complianceFlags: string[];
  lastAttestedAt: string | null;
}

export interface OuProvisioningStage {
  stepOrder: number;
  label: string;
  actor: string;
  status: 'Completed' | 'Active' | 'Pending';
}

export interface DemoOuProvisioningRequest {
  id: string;
  requestCode: string;
  ouName: string;
  parentOuId: string;
  parentDn: string;
  targetDn: string;
  businessOwner: string;
  technicalCustodian: string;
  purpose: string;
  requestedBy: string;
  submittedAt: string;
  namingCheckPassed: boolean;
  status: 'Pending Approval' | 'Provisioned & Governed' | 'Rejected';
  provisionedOuId?: string;
  provisionedGuid?: string;
  stages: OuProvisioningStage[];
}

export const INITIAL_AD_OUS: DemoOrganizationalUnit[] = [
  {
    id: 'ou-root-depts',
    objectGuid: '7b41a9e0-3d21-4c88-b102-99401f01a001',
    name: 'Departments',
    distinguishedName: 'OU=Departments,DC=corp,DC=identra,DC=net',
    parentOuId: null,
    parentDn: 'DC=corp,DC=identra,DC=net',
    description: 'Top-level governed container for regional corporate business units and departments.',
    domain: 'corp.identra.net',
    businessOwner: 'Claire Vance',
    technicalCustodian: 'Alex Carter',
    createdDate: '2022-01-10',
    lastModified: '2026-11-18',
    childCounts: { users: 14, groups: 8, computers: 0 },
    governanceState: 'Managed',
    riskScore: 14,
    containsPrivilegedAccounts: false,
    namingCompliant: true,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-Baseline-Workstation-Hardening', enforced: true, status: 'Enabled' },
      { name: 'GPO-Enterprise-Audit-Logging', enforced: false, status: 'Enabled' },
    ],
    delegatedPermissions: [
      {
        id: 'del-1',
        principal: 'SG-AD-Identity-Provisioning-Engine',
        principalType: 'Service Account',
        rights: 'Create/Delete User & Group Objects (Scoped)',
        inherited: false,
        excessive: false,
        reviewedOn: '2026-11-01',
      },
    ],
    complianceFlags: [],
    lastAttestedAt: '2026-11-12',
  },
  {
    id: 'ou-fin-lon',
    objectGuid: '8c52b0f1-4e32-4d99-c213-88512e02b002',
    name: 'Finance - London',
    distinguishedName: 'OU=Finance - London,OU=Departments,DC=corp,DC=identra,DC=net',
    parentOuId: 'ou-root-depts',
    parentDn: 'OU=Departments,DC=corp,DC=identra,DC=net',
    description: 'EMEA Finance & Treasury employees based at London HQ.',
    domain: 'corp.identra.net',
    businessOwner: 'Claire Vance',
    technicalCustodian: 'Priya Nair',
    createdDate: '2022-03-14',
    lastModified: '2026-11-23',
    childCounts: { users: 142, groups: 24, computers: 138 },
    governanceState: 'Managed',
    riskScore: 18,
    containsPrivilegedAccounts: false,
    namingCompliant: true,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-SOX-Finance-Session-Timeout', enforced: true, status: 'Enabled' },
      { name: 'GPO-Baseline-Workstation-Hardening', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [
      {
        id: 'del-2',
        principal: 'SG-Helpdesk-EMEA-L1',
        principalType: 'Group',
        rights: 'Reset Password & Unlock Account Only',
        inherited: false,
        excessive: false,
        reviewedOn: '2026-11-10',
      },
    ],
    complianceFlags: [],
    lastAttestedAt: '2026-11-15',
  },
  {
    id: 'ou-eng-lon',
    objectGuid: '9d63c1a2-5f43-4eaa-d324-77623d03c003',
    name: 'Engineering - London',
    distinguishedName: 'OU=Engineering - London,OU=Departments,DC=corp,DC=identra,DC=net',
    parentOuId: 'ou-root-depts',
    parentDn: 'OU=Departments,DC=corp,DC=identra,DC=net',
    description: 'Platform SRE and Cloud Engineering staff accounts.',
    domain: 'corp.identra.net',
    businessOwner: 'Alex Carter',
    technicalCustodian: 'Priya Nair',
    createdDate: '2022-02-01',
    lastModified: '2026-11-20',
    childCounts: { users: 218, groups: 39, computers: 240 },
    governanceState: 'Managed',
    riskScore: 22,
    containsPrivilegedAccounts: false,
    namingCompliant: true,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-Engineering-FIDO2-Required', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [
      {
        id: 'del-3',
        principal: 'SG-AD-Identity-Provisioning-Engine',
        principalType: 'Service Account',
        rights: 'Create/Delete User & Group Objects (Scoped)',
        inherited: true,
        excessive: false,
        reviewedOn: '2026-11-01',
      },
    ],
    complianceFlags: [],
    lastAttestedAt: '2026-11-08',
  },
  {
    id: 'ou-sales-ny',
    objectGuid: 'ae74d2b3-6054-4fbb-e435-66734c04d004',
    name: 'Sales - New York',
    distinguishedName: 'OU=Sales - New York,OU=Departments,DC=corp,DC=identra,DC=net',
    parentOuId: 'ou-root-depts',
    parentDn: 'OU=Departments,DC=corp,DC=identra,DC=net',
    description: 'North America Enterprise Sales & Revenue operations.',
    domain: 'corp.identra.net',
    businessOwner: 'Marcus Bell',
    technicalCustodian: 'Alex Carter',
    createdDate: '2023-05-19',
    lastModified: '2026-11-24',
    childCounts: { users: 196, groups: 19, computers: 190 },
    governanceState: 'Non-Compliant',
    riskScore: 76,
    containsPrivilegedAccounts: false,
    namingCompliant: true,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-Commercial-Laptop-BitLocker', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [
      {
        id: 'del-4',
        principal: 'SG-Regional-IT-Support-US',
        principalType: 'Group',
        rights: 'GenericAll (Full Control on All Descendant Objects)',
        inherited: false,
        excessive: true,
        reviewedOn: '2025-11-04',
      },
      {
        id: 'del-5',
        principal: 'j.davies_legacy (Orphaned User)',
        principalType: 'User',
        rights: 'WriteDacl & Reset Password (Unintended Direct Grant)',
        inherited: false,
        excessive: true,
        reviewedOn: 'Never',
      },
    ],
    driftEvent: {
      detectedAt: '2026-11-24 14:22',
      kind: 'Unexpected Delegation',
      detail:
        'Direct WriteDacl delegation added to "SG-Regional-IT-Support-US" outside approved IGA workflow.',
    },
    complianceFlags: [
      'Excessive Delegated Control (GenericAll / WriteDacl)',
      'Out-of-Band Delegation Drift',
    ],
    lastAttestedAt: '2026-08-19',
  },
  {
    id: 'ou-tier0',
    objectGuid: 'bf85e3c4-7165-40cc-f546-55845b05e005',
    name: 'Tier0 - Privileged',
    distinguishedName: 'OU=Tier0 - Privileged,DC=corp,DC=identra,DC=net',
    parentOuId: null,
    parentDn: 'DC=corp,DC=identra,DC=net',
    description: 'Restricted Tier-0 container for Privileged Access Workstations, Break-Glass groups, and Domain Admins.',
    domain: 'corp.identra.net',
    businessOwner: 'Alex Carter',
    technicalCustodian: 'Security Ops',
    createdDate: '2022-01-05',
    lastModified: '2026-11-19',
    childCounts: { users: 18, groups: 12, computers: 22 },
    governanceState: 'Managed',
    riskScore: 34,
    containsPrivilegedAccounts: true,
    namingCompliant: true,
    inheritanceBlocked: true,
    gpoLinks: [
      { name: 'GPO-Tier0-PAW-Isolation-Strict', enforced: true, status: 'Enabled' },
      { name: 'GPO-Tier0-CredentialGuard-Enforced', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [
      {
        id: 'del-6',
        principal: 'SG-Tier0-PAM-Vault-Engines',
        principalType: 'Group',
        rights: 'JIT Password Rotation Only (Protected ACL)',
        inherited: false,
        excessive: false,
        reviewedOn: '2026-11-19',
      },
    ],
    complianceFlags: [],
    lastAttestedAt: '2026-11-19',
  },
  {
    id: 'ou-tier0-admins',
    objectGuid: 'c096f4d5-8276-41dd-0657-44956a06f006',
    name: 'Admin Accounts',
    distinguishedName: 'OU=Admin Accounts,OU=Tier0 - Privileged,DC=corp,DC=identra,DC=net',
    parentOuId: 'ou-tier0',
    parentDn: 'OU=Tier0 - Privileged,DC=corp,DC=identra,DC=net',
    description: 'Dedicated adm-* privileged accounts governed by PAM and 90-day recertification.',
    domain: 'corp.identra.net',
    businessOwner: 'Alex Carter',
    technicalCustodian: 'Priya Nair',
    createdDate: '2022-01-06',
    lastModified: '2026-11-19',
    childCounts: { users: 16, groups: 4, computers: 0 },
    governanceState: 'Managed',
    riskScore: 28,
    containsPrivilegedAccounts: true,
    namingCompliant: true,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-Tier0-PAW-Isolation-Strict', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [
      {
        id: 'del-7',
        principal: 'SG-Tier0-PAM-Vault-Engines',
        principalType: 'Group',
        rights: 'JIT Password Rotation Only (Inherited)',
        inherited: true,
        excessive: false,
        reviewedOn: '2026-11-19',
      },
    ],
    complianceFlags: [],
    lastAttestedAt: '2026-11-19',
  },
  {
    id: 'ou-contractors',
    objectGuid: 'd1a705e6-9387-42ee-1768-33a679070007',
    name: 'External Contractors',
    distinguishedName: 'OU=External Contractors,DC=corp,DC=identra,DC=net',
    parentOuId: null,
    parentDn: 'DC=corp,DC=identra,DC=net',
    description: 'Isolated OU for fixed-term B2B contractors and external auditors with hard expiry controls.',
    domain: 'corp.identra.net',
    businessOwner: 'Priya Nair',
    technicalCustodian: 'Alex Carter',
    createdDate: '2023-02-12',
    lastModified: '2026-11-21',
    childCounts: { users: 84, groups: 9, computers: 12 },
    governanceState: 'Managed',
    riskScore: 24,
    containsPrivilegedAccounts: false,
    namingCompliant: true,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-Contractor-Restricted-Clipboard-USB', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [
      {
        id: 'del-8',
        principal: 'SG-Contractor-Onboarding-Operators',
        principalType: 'Group',
        rights: 'Enable/Disable & Set Account Expiry',
        inherited: false,
        excessive: false,
        reviewedOn: '2026-11-05',
      },
    ],
    complianceFlags: [],
    lastAttestedAt: '2026-11-05',
  },
  {
    id: 'ou-disabled',
    objectGuid: 'e2b816f7-a498-43ff-2879-22b788081008',
    name: 'DisabledUsers',
    distinguishedName: 'OU=DisabledUsers,DC=corp,DC=identra,DC=net',
    parentOuId: null,
    parentDn: 'DC=corp,DC=identra,DC=net',
    description: 'Quarantine container for off-boarded Leavers and Emergency Deactivated identities.',
    domain: 'corp.identra.net',
    businessOwner: 'Identity Operations',
    technicalCustodian: 'Alex Carter',
    createdDate: '2022-01-10',
    lastModified: '2026-11-25',
    childCounts: { users: 412, groups: 0, computers: 31 },
    governanceState: 'Managed',
    riskScore: 10,
    containsPrivilegedAccounts: false,
    namingCompliant: true,
    inheritanceBlocked: true,
    gpoLinks: [
      { name: 'GPO-Deny-All-Logon-Quarantine', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [],
    complianceFlags: [],
    lastAttestedAt: '2026-11-20',
  },
  {
    id: 'ou-shadow-ops',
    objectGuid: 'f3c92708-b5a9-4400-398a-11c897092009',
    name: 'tmp_infra_migration_2026',
    distinguishedName: 'OU=tmp_infra_migration_2026,DC=corp,DC=identra,DC=net',
    parentOuId: null,
    parentDn: 'DC=corp,DC=identra,DC=net',
    description: 'Temporary migration container created directly in ADUC without change ticket.',
    domain: 'corp.identra.net',
    businessOwner: null,
    technicalCustodian: null,
    createdDate: '2026-11-22',
    lastModified: '2026-11-26',
    childCounts: { users: 5, groups: 3, computers: 2 },
    governanceState: 'Non-Compliant',
    riskScore: 91,
    containsPrivilegedAccounts: true,
    namingCompliant: false,
    inheritanceBlocked: true,
    gpoLinks: [],
    delegatedPermissions: [
      {
        id: 'del-9',
        principal: 'Domain Users (Misconfigured ACL)',
        principalType: 'Group',
        rights: 'Create Child Computer & Write Properties',
        inherited: false,
        excessive: true,
        reviewedOn: 'Never',
      },
    ],
    driftEvent: {
      detectedAt: '2026-11-26 06:10',
      kind: 'Out-of-Band Create',
      detail:
        'Created directly in Active Directory outside IGA provisioning. Contains 2 privileged server admin accounts with GPO inheritance blocked.',
    },
    complianceFlags: [
      'Missing Accountable Owner',
      'Out-of-Band Structural Create',
      'Outside Approved Naming Convention',
      'Privileged Account in Unexpected OU',
      'Block Inheritance Bypassing Baseline GPOs',
    ],
    lastAttestedAt: null,
  },
  {
    id: 'ou-legacy-empty',
    objectGuid: '04da3819-c6ba-4511-4a9b-00d9a60a3010',
    name: 'Legacy_Branches_2023',
    distinguishedName: 'OU=Legacy_Branches_2023,OU=Departments,DC=corp,DC=identra,DC=net',
    parentOuId: 'ou-root-depts',
    parentDn: 'OU=Departments,DC=corp,DC=identra,DC=net',
    description: 'Decommissioned regional branch container — zero users, groups, or computers remaining.',
    domain: 'corp.identra.net',
    businessOwner: null,
    technicalCustodian: 'Alex Carter',
    createdDate: '2023-01-18',
    lastModified: '2025-04-02',
    childCounts: { users: 0, groups: 0, computers: 0 },
    governanceState: 'Non-Compliant',
    riskScore: 54,
    containsPrivilegedAccounts: false,
    namingCompliant: false,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-Legacy-Branch-Proxy', enforced: false, status: 'Link Disabled' },
    ],
    delegatedPermissions: [],
    driftEvent: {
      detectedAt: '2026-11-20 06:00',
      kind: 'Renamed Outside Process',
      detail: 'Renamed from "OU=Regional_Branches" outside IGA workflow; tracked cleanly via immutable objectGUID.',
      previousDn: 'OU=Regional_Branches,OU=Departments,DC=corp,DC=identra,DC=net',
    },
    complianceFlags: [
      'Empty / Abandoned OU (0 Child Objects)',
      'Missing Accountable Owner',
      'Outside Approved Naming Convention',
    ],
    lastAttestedAt: null,
  },
  {
    id: 'ou-discovered-cpt',
    objectGuid: '15eb492a-d7cb-4622-5bac-ffea550b4011',
    name: 'Operations - Cape Town',
    distinguishedName: 'OU=Operations - Cape Town,OU=Departments,DC=corp,DC=identra,DC=net',
    parentOuId: 'ou-root-depts',
    parentDn: 'OU=Departments,DC=corp,DC=identra,DC=net',
    description: 'Newly discovered AD OU for Cape Town regional operations — awaiting formal governance onboarding.',
    domain: 'corp.identra.net',
    businessOwner: null,
    technicalCustodian: null,
    createdDate: '2026-11-25',
    lastModified: '2026-11-27',
    childCounts: { users: 28, groups: 6, computers: 24 },
    governanceState: 'Discovered',
    riskScore: 42,
    containsPrivilegedAccounts: false,
    namingCompliant: true,
    inheritanceBlocked: false,
    gpoLinks: [
      { name: 'GPO-Baseline-Workstation-Hardening', enforced: true, status: 'Enabled' },
    ],
    delegatedPermissions: [],
    complianceFlags: ['Discovered in AD — Not Yet Formally Governed (Owner Unassigned)'],
    lastAttestedAt: null,
  },
];

export const INITIAL_OU_REQUESTS: DemoOuProvisioningRequest[] = [
  {
    id: 'ou-req-jhb-fin',
    requestCode: 'OUR-2041',
    ouName: 'Finance - Johannesburg',
    parentOuId: 'ou-root-depts',
    parentDn: 'OU=Departments,DC=corp,DC=identra,DC=net',
    targetDn: 'OU=Finance - Johannesburg,OU=Departments,DC=corp,DC=identra,DC=net',
    businessOwner: 'Claire Vance (Finance Manager)',
    technicalCustodian: 'Priya Nair',
    purpose: 'Organisational container for Johannesburg finance employees.',
    requestedBy: 'Lerato Dlamini',
    submittedAt: '2026-11-27 14:15',
    namingCheckPassed: true,
    status: 'Pending Approval',
    stages: [
      {
        stepOrder: 1,
        label: 'Business Owner Approval',
        actor: 'Claire Vance (Finance Manager)',
        status: 'Active',
      },
      {
        stepOrder: 2,
        label: 'AD Infrastructure Approval',
        actor: 'Alex Carter (AD Infrastructure Lead)',
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
  },
];
