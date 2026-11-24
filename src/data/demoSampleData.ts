export type DemoSectionId =
  | 'dashboard'
  | 'people'
  | 'non-human'
  | 'applications'
  | 'entitlements'
  | 'roles'
  | 'birthrights'
  | 'access-reviews'
  | 'policies-sod'
  | 'compliance'
  | 'reporting'
  | 'lifecycle'
  | 'workflows'
  | 'provisioning-engine'
  | 'imports'
  | 'audit-log';

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
  category: 'HRIS Sync' | 'JML Lifecycle' | 'Role / SoD' | 'Context Change' | 'Provisioning';
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
  jmlStatus: 'Active' | 'Joiner' | 'Mover' | 'Leaver' | 'Suspended';
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

export interface DemoReviewItem {
  id: string;
  identity: string;
  identityTitle: string;
  department: string;
  accessType: ReviewAccessType;
  roleOrEntitlement: string;
  technicalId: string;
  parentBusinessRole: string;
  application: string;
  reviewer: string;
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
      'Authorized Treasury approvers permitted to release outbound supplier wire batches and dual-sign payments above $50k.',
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
        name: 'SAP: Approve & Release Wire >$50k',
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
    identity: 'Mark Wilson (Contractor)',
    identityTitle: 'External Cloud Auditor · Terminated',
    department: 'Contractor',
    accessType: 'AD Security Group',
    roleOrEntitlement: 'SG-AWS-Prod-Vault-Admins',
    technicalId: 'CN=SG-AWS-Prod-Vault-Admins,OU=Privileged,DC=identra,DC=corp',
    parentBusinessRole: 'Direct Assignment (Orphaned — No Role Owner)',
    application: 'Active Directory',
    reviewer: 'Priya Nair',
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
    risk: 'High',
    usageSignal: 'Last Kerberos elevation: 94 days ago',
    aiRecommendation: 'Revoke',
    reason: 'Standing privileged AD server admin group unused for >90 days; replace with JIT elevation.',
    decision: 'Pending',
  },
  {
    id: 'rev-entra-1',
    identity: 'John Davies',
    identityTitle: 'Enterprise Account Director',
    department: 'Sales',
    accessType: 'Entra ID License',
    roleOrEntitlement: 'Microsoft 365 E5 (Full Suite)',
    technicalId: 'SKU: SPE_E5 (06ebc4ee-1bb5-47dd-8120-11324bc54e06)',
    parentBusinessRole: 'Group-Based License: LIC-M365-E5-All',
    application: 'Microsoft Entra ID',
    reviewer: 'Marcus Bell',
    risk: 'Medium',
    usageSignal: 'E5 features (PowerBI Pro / Audio Conf) unused 118 days',
    monthlyCost: '$57/mo',
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
    risk: 'Medium',
    usageSignal: '0 PIM activations or Identity Protection reviews in 180 days',
    monthlyCost: '$9/mo',
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
    risk: 'Low',
    usageSignal: 'Active 24 of last 30 days (Excel + Teams)',
    monthlyCost: '$30/mo',
    aiRecommendation: 'Approve',
    reason: 'High daily adoption matching approved Finance Leadership role allocation.',
    decision: 'Pending',
  },
  {
    id: 'rev-ad-3',
    identity: 'Sarah Mitchell',
    identityTitle: 'Financial Analyst · Joiner',
    department: 'Finance',
    accessType: 'AD Security Group',
    roleOrEntitlement: 'SG-Finance-Ledger-Readers',
    technicalId: 'CN=SG-Finance-Ledger-Readers,OU=Finance,DC=identra,DC=corp',
    parentBusinessRole: 'Business Role: Finance: Base Ledger Read',
    application: 'Active Directory',
    reviewer: 'Claire Vance',
    risk: 'Low',
    usageSignal: 'Provisioned via Day-1 HRIS birthright · Active today',
    aiRecommendation: 'Approve',
    reason: 'Standard birthright AD security group matching HR Finance job code; zero SoD conflicts.',
    decision: 'Pending',
  },
  {
    id: 'rev-1',
    identity: 'Elena Vance',
    identityTitle: 'Treasury Operations Lead · Mover',
    department: 'Finance',
    accessType: 'Business Role',
    roleOrEntitlement: 'Finance: AP-Clerk (Legacy)',
    technicalId: 'SAP_ROLE: Z_FI_AP_VENDOR_CREATE',
    parentBusinessRole: 'Retained Legacy Role (Prior Dept: AP Ops)',
    application: 'SAP S/4HANA Finance',
    reviewer: 'David Chen',
    risk: 'High',
    usageSignal: 'Conflicting SoD pair with Treasury: Payment Approver',
    aiRecommendation: 'Revoke',
    reason: 'Violates SOX-SOD-402 after transfer to Treasury Approvals; strip legacy vendor creation role.',
    decision: 'Pending',
  },
  {
    id: 'rev-3',
    identity: 'agent.release-copilot',
    identityTitle: 'Autonomous Release AI Agent',
    department: 'Engineering (AI)',
    accessType: 'AI Agent Grant',
    roleOrEntitlement: 'SNOWFLAKE:RAW_PII_SELECT',
    technicalId: 'GRANT SELECT ON SCHEMA PROD_PII.* TO ROLE AGENT_RELEASE',
    parentBusinessRole: 'Out-of-Band Direct Grant (Bypassed Approval)',
    application: 'Snowflake PII Lake',
    reviewer: 'Lucas Meyer',
    risk: 'High',
    usageSignal: '42 unmasked queries in last 24h · Outside CI/CD scope',
    aiRecommendation: 'Revoke',
    reason: 'Autonomous release bot holds direct PII read access violating NHI-AI-209 isolation policy.',
    decision: 'Pending',
  },
  {
    id: 'rev-5',
    identity: 'Priya Nair',
    identityTitle: 'Principal Platform Engineer',
    department: 'Engineering',
    accessType: 'Business Role',
    roleOrEntitlement: 'Prod K8s Operator (JIT)',
    technicalId: 'AWS_PERM_SET: arn:aws:sso:::permissionSet/k8s-jit-4h',
    parentBusinessRole: 'Business Role: Platform SRE Core',
    application: 'AWS Prod Vault',
    reviewer: 'VP Engineering',
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
