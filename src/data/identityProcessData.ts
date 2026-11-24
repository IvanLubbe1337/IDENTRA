export type ProcessPillarId =
  | 'lifecycle'
  | 'access'
  | 'alignment'
  | 'governance'
  | 'incident'
  | 'admin';

export type EcosystemNodeId =
  | 'core'
  | 'people'
  | 'service-accounts'
  | 'entitlements'
  | 'roles'
  | 'applications';

export interface EcosystemNode {
  id: EcosystemNodeId;
  label: string;
  count: string;
  pillar: ProcessPillarId;
  pillarLabel: string;
  position: [number, number, number];
  accent: string;
  summary: string;
  processSteps: string[];
  status: string;
}

export interface ProcessPillar {
  id: ProcessPillarId;
  index: string;
  shortTitle: string;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  subProcesses: {
    name: string;
    detail: string;
  }[];
  flowSteps: [string, string, string];
  metric: {
    value: string;
    label: string;
  };
  scope: string;
}

export interface AttentionItem {
  id: string;
  title: string;
  subtitle: string;
  severity: 'High' | 'Medium';
  pillarTag: string;
  healthBoost: number;
  actionsReduced: number;
  resolutionMessage: string;
}

export interface LifecycleEvent {
  id: string;
  time: string;
  kind: 'Joiner' | 'Mover' | 'Leaver';
  text: string;
  department: string;
}

export interface WorkflowSimulation {
  id: string;
  filename: string;
  pillar: ProcessPillarId;
  title: string;
  triggerLabel: string;
  code: string;
  trace: {
    step: string;
    process: string;
    latency: string;
    outcome: 'PASS' | 'BLOCK' | 'REVOKE' | 'ATTEST';
    detail: string;
  }[];
}

export interface RolloutPhase {
  phase: string;
  title: string;
  duration: string;
  focus: string;
  deliverables: string[];
}

export const ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: 'people',
    label: 'People',
    count: '6,732',
    pillar: 'lifecycle',
    pillarLabel: '01 · Identity Lifecycle (JML)',
    position: [-2.85, 1.15, 0.35],
    accent: '#0EA5E9',
    summary:
      'Employees, contractors, and partners synchronized from HRIS with automated Joiner, Mover, and Leaver workflows.',
    processSteps: ['Onboard from HRIS', 'Adjust on Role Change', 'Instant Leaver Off-board'],
    status: '18 Joiners · 42 Movers · 9 Leavers',
  },
  {
    id: 'service-accounts',
    label: 'Service Accounts',
    count: '1,102',
    pillar: 'admin',
    pillarLabel: '06 · Non-Human & Connectors',
    position: [-2.75, -1.1, 0.45],
    accent: '#0284C7',
    summary:
      'Machine identities, bots, and autonomous AI agents mapped to accountable human owners with automated credential rotation.',
    processSteps: ['Register Owner', 'Scope Least Privilege', 'Auto-Expire Credentials'],
    status: '1,284 Total Non-Human Identities',
  },
  {
    id: 'entitlements',
    label: 'Entitlements',
    count: '12,480',
    pillar: 'governance',
    pillarLabel: '04 · Governance & Attestation',
    position: [0.0, -2.25, 0.65],
    accent: '#06B6D4',
    summary:
      'Granular permissions reconciled continuously between desired policy state and actual target applications.',
    processSteps: ['Continuous Reconcile', 'Periodic Attestation', 'Revoke Drift'],
    status: '87% Reviews Complete · 94% Policy Compliance',
  },
  {
    id: 'roles',
    label: 'Roles',
    count: '737',
    pillar: 'alignment',
    pillarLabel: '03 · Business Alignment & SoD',
    position: [2.8, -1.05, 0.35],
    accent: '#2563EB',
    summary:
      'Business-friendly RBAC bundles with preventative Segregation of Duties (SoD) rules blocking toxic combinations.',
    processSteps: ['Model Business Roles', 'Enforce SoD Policies', 'Context Checks'],
    status: '0 Unmitigated Toxic Pairs',
  },
  {
    id: 'applications',
    label: 'Applications',
    count: '126',
    pillar: 'access',
    pillarLabel: '02 · Access Management',
    position: [2.85, 1.15, 0.25],
    accent: '#0EA5E9',
    summary:
      'Connected SaaS, cloud, ERP, and on-prem apps governed through self-service request, approval, and automated fulfillment.',
    processSteps: ['Self-Service Request', 'Risk-Aware Approval', 'Closed-Loop Provision'],
    status: '126 Connected Systems · Live Sync',
  },
];

export const PROCESS_PILLARS: ProcessPillar[] = [
  {
    id: 'lifecycle',
    index: '01',
    shortTitle: 'Lifecycle (JML)',
    title: 'Identity Lifecycle Management',
    tagline: 'Automated Joiner, Mover, and Leaver orchestration.',
    description:
      'Syncs authoritative HR and contractor feeds directly into IDENTRA so Day-1 onboarding is instant, department transfers strip legacy access, and departures never leave orphaned accounts.',
    accent: '#0EA5E9',
    subProcesses: [
      { name: 'Onboard Identity', detail: 'Automated birthright provisioning on Day 1 from Workday or Entra' },
      { name: 'Change Identity', detail: 'Recalculates business roles on promotion or department transfer' },
      { name: 'Off-board Identity', detail: 'Immediate account deactivation and ownership handover on exit' },
    ],
    flowSteps: ['HRIS Trigger', 'Role Recalculation', 'Auto-Provision / Revoke'],
    metric: { value: '6,732', label: 'Governed People Identities' },
    scope: 'Employees · Contractors · Partners',
  },
  {
    id: 'access',
    index: '02',
    shortTitle: 'Access Management',
    title: 'Self-Service Access Management',
    tagline: 'Simple business catalog with instant approval and fulfillment.',
    description:
      'Empowers employees to request applications and entitlements in plain business terms while automated workflows verify SoD policies, route manager sign-off, and provision access cleanly.',
    accent: '#0284C7',
    subProcesses: [
      { name: 'Request Access', detail: 'Intuitive self-service portal across 126 connected applications' },
      { name: 'Approve Access', detail: 'Context-aware routing to line managers and application owners' },
      { name: 'Fulfill & Provision', detail: 'Closed-loop automated connector fulfillment with JIT expiry' },
    ],
    flowSteps: ['Catalog Request', 'Owner Approval', 'Automated Fulfillment'],
    metric: { value: '126', label: 'Connected Applications' },
    scope: 'Self-Service · JIT Elevation · Closed-Loop Fulfillment',
  },
  {
    id: 'alignment',
    index: '03',
    shortTitle: 'Business Alignment',
    title: 'Business Alignment & SoD Control',
    tagline: 'Clear business roles backed by preventative Segregation of Duties.',
    description:
      'Translates raw technical entitlements into 737 understandable business roles so managers know exactly what they approve—while preventative SoD policies block risky privilege combinations.',
    accent: '#2563EB',
    subProcesses: [
      { name: 'Manage Roles (RBAC)', detail: 'Clean role hierarchy mapped to departments and job functions' },
      { name: 'Manage Policies (SoD)', detail: 'Blocks toxic pairs like vendor creation + payment approval' },
      { name: 'Manage Context', detail: 'Evaluates risk, location, and identity attributes dynamically' },
    ],
    flowSteps: ['Define Business Role', 'Check SoD Matrix', 'Enforce Policy Envelope'],
    metric: { value: '737', label: 'Active Business Roles' },
    scope: 'RBAC · Preventative SoD · Attribute Context',
  },
  {
    id: 'governance',
    index: '04',
    shortTitle: 'Governance & Reviews',
    title: 'Governance, Attestation & Reconciliation',
    tagline: 'Continuous Desired-vs-Actual verification and effortless audits.',
    description:
      'Continuously reconciles all 12,480 entitlements against approved policy, flags anomalies automatically, and streamlines periodic manager attestations for SOX, ISO 27001, and GDPR.',
    accent: '#06B6D4',
    subProcesses: [
      { name: 'Perform Attestation', detail: 'Focused manager review campaigns with clear risk recommendations' },
      { name: 'Reconcile State', detail: 'Continuous Desired vs. Actual drift verification across systems' },
      { name: 'Compliance Reporting', detail: 'One-click immutable audit evidence for regulators and boards' },
    ],
    flowSteps: ['Compare Desired vs Actual', 'Surface Review Items', 'Seal Audit Evidence'],
    metric: { value: '94%', label: 'Policy Compliance Score' },
    scope: 'Access Reviews · Reconciliation · Audit Proof',
  },
  {
    id: 'incident',
    index: '05',
    shortTitle: 'Breach Response',
    title: 'Identity Security & Incident Response',
    tagline: 'Immediate containment when anomalies or orphaned accounts appear.',
    description:
      'Bridges governance with security operations. Automatically detects orphaned accounts, provisioning failures, and suspicious access shifts—suspending risk in milliseconds.',
    accent: '#EF4444',
    subProcesses: [
      { name: 'Detect Anomalies', detail: 'Surfaces orphaned accounts and out-of-band privilege changes' },
      { name: 'Suspend Access', detail: 'Instant kill-switch across IdP sessions, cloud keys, and bots' },
      { name: 'Forensic Audit Trail', detail: 'Complete timeline of who requested, approved, and used access' },
    ],
    flowSteps: ['Detect Orphan / Alert', 'Suspend Active Access', 'Log Forensic Trail'],
    metric: { value: '<140ms', label: 'Automated Containment' },
    scope: 'SIEM Integration · Orphan Cleanup · Session Revocation',
  },
  {
    id: 'admin',
    index: '06',
    shortTitle: 'Non-Human & Ops',
    title: 'Administration, Connectors & Non-Human IDs',
    tagline: 'Unified governance for service accounts, AI agents, and systems.',
    description:
      'Brings 1,284 non-human identities and service accounts under the same Process++ rigor as employees, backed by resilient bidirectional connectors and system classification.',
    accent: '#10B981',
    subProcesses: [
      { name: 'Non-Human Governance', detail: 'Assigns owners, lifecycles, and attestations to bots & AI agents' },
      { name: 'System Classification', detail: 'Tags ERP, cloud vaults, and PII stores by business criticality' },
      { name: 'Connector Fabric', detail: 'Native SCIM, Graph, AWS, SAP, and Snowflake integrations' },
    ],
    flowSteps: ['Discover Accounts', 'Classify Criticality', 'Enforce Continuous Sync'],
    metric: { value: '1,284', label: 'Non-Human Identities Governed' },
    scope: 'Service Accounts · AI Agents · Bidirectional Connectors',
  },
];

export const INITIAL_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: 'att-provisioning',
    title: '3 provisioning failures',
    subtitle: 'Failed to provision accounts in the last 24 hours',
    severity: 'High',
    pillarTag: 'ACCESS MGMT',
    healthBoost: 2,
    actionsReduced: 3,
    resolutionMessage: 'Retried connector queue & fulfilled 3 pending SAP/Okta accounts.',
  },
  {
    id: 'att-reviews',
    title: '12 overdue access reviews',
    subtitle: 'Due for review more than 30 days ago',
    severity: 'Medium',
    pillarTag: 'ATTESTATION',
    healthBoost: 2,
    actionsReduced: 12,
    resolutionMessage: 'Escalated & auto-certified 12 low-risk manager attestations.',
  },
  {
    id: 'att-orphans',
    title: '18 orphaned accounts detected',
    subtitle: 'Accounts with no owner',
    severity: 'Medium',
    pillarTag: 'OFF-BOARD',
    healthBoost: 2,
    actionsReduced: 18,
    resolutionMessage: 'Suspended 18 un-owned leaver accounts via Process++ Off-board.',
  },
];

export const INITIAL_LIFECYCLE_EVENTS: LifecycleEvent[] = [
  {
    id: 'ev-1',
    time: '10:24',
    kind: 'Joiner',
    text: 'New user onboarded: Sarah Mitchell',
    department: 'Finance',
  },
  {
    id: 'ev-2',
    time: '09:47',
    kind: 'Mover',
    text: 'Access updated for John Davies',
    department: 'Sales',
  },
  {
    id: 'ev-3',
    time: '08:32',
    kind: 'Leaver',
    text: 'User deactivated: Mark Wilson',
    department: 'Contractor',
  },
];

export const WORKFLOW_SIMULATIONS: WorkflowSimulation[] = [
  {
    id: 'jml-onboard',
    filename: '01_jml_lifecycle.ippp',
    pillar: 'lifecycle',
    title: 'Joiner / Mover / Leaver',
    triggerLabel: 'HRIS Trigger: Mark Wilson (Contractor) → Off-board',
    code: `process "jml_offboard_leaver" {
  domain  = "IdentityLifecycle.Offboard"
  trigger = hr.workday.on("contract_ended")

  steps {
    1. suspend_idp_sessions(immediate = true)
    2. revoke_business_roles(all = true)
    3. reconcile_orphaned_accounts(targets = all_connected_apps)
    4. write_audit_evidence(retention = "7y")
  }
}`,
    trace: [
      { step: '01', process: 'HRIS SYNC', latency: '14ms', outcome: 'PASS', detail: 'Contract end verified for Mark Wilson (Contractor)' },
      { step: '02', process: 'OFF-BOARD', latency: '36ms', outcome: 'REVOKE', detail: 'Deactivated Okta profile and stripped 4 business roles' },
      { step: '03', process: 'RECONCILE', latency: '42ms', outcome: 'BLOCK', detail: 'Detected & removed 1 orphaned direct AWS account' },
      { step: '04', process: 'AUDIT LOG', latency: '11ms', outcome: 'ATTEST', detail: 'Sealed immutable leaver certificate (103ms total)' },
    ],
  },
  {
    id: 'sod-policy',
    filename: '02_sod_business_policy.ippp',
    pillar: 'alignment',
    title: 'Preventative SoD Policy',
    triggerLabel: 'Access Request: Finance AP + Payment Approver',
    code: `policy "sox_finance_sod_guard" {
  domain   = "BusinessAlignment.ManagePolicy"
  severity = "CRITICAL"

  forbid_pair {
    role_a = "Finance: Create Vendor"
    role_b = "Treasury: Approve Payment"
  }

  on_conflict {
    block_grant   = true
    notify_owner  = "finance.compliance@company.com"
  }
}`,
    trace: [
      { step: '01', process: 'REQUEST ACCESS', latency: '12ms', outcome: 'PASS', detail: 'Received self-service request for Treasury: Approve Payment' },
      { step: '02', process: 'MANAGE POLICY', latency: '24ms', outcome: 'BLOCK', detail: 'Preventative SoD violation: requester holds Finance: Create Vendor' },
      { step: '03', process: 'AUTO-MITIGATE', latency: '28ms', outcome: 'REVOKE', detail: 'Blocked toxic entitlement and proposed clean role swap' },
      { step: '04', process: 'COMPLIANCE', latency: '9ms', outcome: 'ATTEST', detail: 'SOX 404 preventative control logged (73ms total)' },
    ],
  },
  {
    id: 'attestation-reconcile',
    filename: '03_continuous_attestation.ippp',
    pillar: 'governance',
    title: 'Access Reviews & Parity',
    triggerLabel: 'Scheduled Campaign: Q4 Tier-0 Entitlement Review',
    code: `governance "continuous_attestation" {
  domain  = "Governance.PerformAttestation"
  targets = applications.connected(count = 126)

  reconcile {
    compare(desired_roles, actual_entitlements)
    auto_certify(if_risk = "LOW" && active_usage = true)
    escalate_to_owner(if_risk >= "MEDIUM" || orphan = true)
  }
}`,
    trace: [
      { step: '01', process: 'CONNECTOR SYNC', latency: '31ms', outcome: 'PASS', detail: 'Reconciled 12,480 entitlements across 126 applications' },
      { step: '02', process: 'RISK SCORING', latency: '27ms', outcome: 'PASS', detail: 'Auto-certified 87% nominal access with verified usage' },
      { step: '03', process: 'ORPHAN CHECK', latency: '19ms', outcome: 'BLOCK', detail: 'Flagged 18 un-owned accounts for immediate review' },
      { step: '04', process: 'ATTESTATION', latency: '14ms', outcome: 'ATTEST', detail: 'Updated Governance Health score and board report (91ms total)' },
    ],
  },
];

export const IMPLEMENTATION_PHASES: RolloutPhase[] = [
  {
    phase: '01',
    title: 'Prepare & Connect',
    duration: 'Week 1',
    focus: 'Connect authoritative HRIS and directories to establish a clean single source of truth.',
    deliverables: ['People & Non-Human Inventory', '126 App Discovery', 'Baseline Health Score'],
  },
  {
    phase: '02',
    title: 'Model Process++',
    duration: 'Week 2',
    focus: 'Adopt proven out-of-the-box JML, approval, and SoD workflows without starting from scratch.',
    deliverables: ['JML Templates', 'Business Role Catalog', 'SoD Rule Matrix'],
  },
  {
    phase: '03',
    title: 'Automate Fulfillment',
    duration: 'Week 3–4',
    focus: 'Enable closed-loop provisioning and self-service access requests across cloud and ERP.',
    deliverables: ['Self-Service Catalog', 'Automated Connectors', 'JIT Elevation'],
  },
  {
    phase: '04',
    title: 'Reconcile & Attest',
    duration: 'Week 5',
    focus: 'Eliminate orphaned accounts and launch streamlined manager access review campaigns.',
    deliverables: ['Zero Orphan Cleanup', 'Continuous Parity', 'Audit-Ready Reports'],
  },
  {
    phase: '05',
    title: 'Autonomous Operate',
    duration: 'Ongoing',
    focus: 'Maintain >95% governance health continuously with automated breach containment.',
    deliverables: ['Live Governance Health', 'SIEM Containment', 'Continuous Compliance'],
  },
];
