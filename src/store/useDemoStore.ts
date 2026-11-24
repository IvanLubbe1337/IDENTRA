import { create } from 'zustand';
import {
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
  INITIAL_IMPORT_RUNS,
  INITIAL_PROVISIONING_JOBS,
  evaluateBirthrightMatches,
  type DemoApplication,
  type DemoAuditEntry,
  type DemoBirthrightRule,
  type DemoEntitlement,
  type DemoImportRun,
  type DemoNonHuman,
  type DemoPerson,
  type DemoPolicy,
  type DemoProvisioningJob,
  type DemoReviewItem,
  type DemoRole,
  type DemoSectionId,
  type DemoTargetAccount,
} from '@/data/demoSampleData';
import { useSceneStore } from '@/store/useSceneStore';

function timeNow(): string {
  return new Date().toTimeString().slice(0, 8);
}

interface DemoStore {
  activeSection: DemoSectionId;
  searchQuery: string;
  selectedPersonId: string | null;
  toastMessage: string | null;

  people: DemoPerson[];
  nonHumans: DemoNonHuman[];
  applications: DemoApplication[];
  entitlements: DemoEntitlement[];
  roles: DemoRole[];
  birthrights: DemoBirthrightRule[];
  accounts: DemoTargetAccount[];
  reviews: DemoReviewItem[];
  policies: DemoPolicy[];
  provisioningJobs: DemoProvisioningJob[];
  importRuns: DemoImportRun[];
  auditLog: DemoAuditEntry[];

  setActiveSection: (section: DemoSectionId) => void;
  setSearchQuery: (q: string) => void;
  setSelectedPersonId: (id: string | null) => void;
  clearToast: () => void;

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
  searchQuery: '',
  selectedPersonId: null,
  toastMessage: null,

  people: INITIAL_DEMO_PEOPLE,
  nonHumans: INITIAL_DEMO_NON_HUMAN,
  applications: INITIAL_DEMO_APPS,
  entitlements: INITIAL_DEMO_ENTITLEMENTS,
  roles: INITIAL_DEMO_ROLES,
  birthrights: INITIAL_DEMO_BIRTHRIGHTS,
  accounts: INITIAL_DEMO_ACCOUNTS,
  reviews: INITIAL_DEMO_REVIEWS,
  policies: INITIAL_DEMO_POLICIES,
  provisioningJobs: INITIAL_PROVISIONING_JOBS,
  importRuns: INITIAL_IMPORT_RUNS,
  auditLog: INITIAL_DEMO_AUDIT,

  setActiveSection: (section) => set({ activeSection: section }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedPersonId: (id) => set({ selectedPersonId: id }),
  clearToast: () => set({ toastMessage: null }),

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

    set((s) => ({
      people: [newPerson, ...s.people],
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

    set((s) => ({
      reviews: updatedReviews,
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
      birthrights: INITIAL_DEMO_BIRTHRIGHTS,
      accounts: INITIAL_DEMO_ACCOUNTS,
      reviews: INITIAL_DEMO_REVIEWS,
      policies: INITIAL_DEMO_POLICIES,
      provisioningJobs: INITIAL_PROVISIONING_JOBS,
      importRuns: INITIAL_IMPORT_RUNS,
      auditLog: INITIAL_DEMO_AUDIT,
      selectedPersonId: null,
      toastMessage: 'Reset all IDENTRA proof-of-concept sample data to initial baseline.',
    });
  },
}));
