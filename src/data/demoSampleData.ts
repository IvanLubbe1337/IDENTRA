export type DemoSectionId =
  | 'dashboard'
  | 'people'
  | 'non-human'
  | 'applications'
  | 'entitlements'
  | 'roles'
  | 'role-mining'
  | 'birthrights'
  | 'governance-assurance'
  | 'access-reviews'
  | 'policies-sod'
  | 'compliance'
  | 'reporting'
  | 'lifecycle'
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
  changeHistory: IdentityHistoryEntry[];
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
