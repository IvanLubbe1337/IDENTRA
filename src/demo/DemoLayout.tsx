import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Box,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  CreditCard,
  DownloadCloud,
  FileCheck2,
  GitBranch,
  GitMerge,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Mail,
  Menu,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  evaluateSkuBirthrightDemand,
  type DemoSectionId,
} from '@/data/demoSampleData';
import { IdentraMark } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { useSceneStore } from '@/store/useSceneStore';
import { DashboardView } from '@/demo/views/DashboardView';
import { MyTasksView } from '@/demo/views/MyTasksView';
import { NonHumanView, PeopleView } from '@/demo/views/IdentitiesViews';
import { OrphanAdoptionView } from '@/demo/views/OrphanAdoptionView';
import {
  ApplicationsView,
  EntitlementsView,
  RolesView,
} from '@/demo/views/AccessViews';
import { AccessMarketplaceView } from '@/demo/views/AccessMarketplaceView';
import { RoleMiningView } from '@/demo/views/RoleMiningView';
import { BirthrightsView } from '@/demo/views/BirthrightsView';
import { LicensesView } from '@/demo/views/LicensesView';
import {
  AccessReviewsView,
  ComplianceView,
  PoliciesSodView,
} from '@/demo/views/GovernanceViews';
import { GovernanceAssuranceView } from '@/demo/views/GovernanceAssuranceView';
import { ReportingView } from '@/demo/views/ReportingView';
import {
  AuditLogView,
  LifecycleView,
  WorkflowsView,
} from '@/demo/views/AutomationViews';
import { OnboardingView } from '@/demo/views/OnboardingView';
import { ProvisioningEngineView } from '@/demo/views/ProvisioningEngineView';
import { ImportsView } from '@/demo/views/ImportsView';
import { EmailNotificationsView } from '@/demo/views/EmailNotificationsView';
import { ConfigurationView } from '@/demo/views/ConfigurationView';
import { cn } from '@/lib/cn';

interface NavGroup {
  group: string;
  items: {
    id: DemoSectionId;
    label: string;
    icon: typeof LayoutDashboard;
  }[];
}

const SIDEBAR_NAV: NavGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'my-tasks', label: 'My Tasks & Requests', icon: Inbox },
    ],
  },
  {
    group: 'IDENTITIES',
    items: [
      { id: 'people', label: 'People', icon: Users },
      { id: 'non-human', label: 'Non-human IDs', icon: Bot },
      { id: 'orphan-adoption', label: 'Orphan Adoption', icon: UserCheck },
    ],
  },
  {
    group: 'ACCESS',
    items: [
      { id: 'access-marketplace', label: 'Access Marketplace', icon: ShoppingBag },
      { id: 'applications', label: 'Applications', icon: Box },
      { id: 'entitlements', label: 'Entitlements', icon: KeyRound },
      { id: 'roles', label: 'Roles', icon: Shield },
      { id: 'role-mining', label: 'Role Mining', icon: Sparkles },
      { id: 'birthrights', label: 'Birthrights', icon: GitMerge },
      { id: 'licenses', label: 'Licenses', icon: CreditCard },
    ],
  },
  {
    group: 'GOVERNANCE',
    items: [
      { id: 'governance-assurance', label: 'Governance Assurance', icon: ShieldCheck },
      { id: 'access-reviews', label: 'Access reviews', icon: ClipboardCheck },
      { id: 'policies-sod', label: 'Policies & SoD', icon: ShieldAlert },
      { id: 'compliance', label: 'Compliance', icon: FileCheck2 },
      { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    ],
  },
  {
    group: 'AUTOMATION',
    items: [
      { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
      { id: 'lifecycle', label: 'Lifecycle', icon: RefreshCw },
      { id: 'workflows', label: 'Workflows', icon: GitBranch },
    ],
  },
  {
    group: 'OPERATIONS',
    items: [
      { id: 'provisioning-engine', label: 'Provisioning Engine', icon: Cpu },
      { id: 'imports', label: 'Imports', icon: DownloadCloud },
      { id: 'email-notifications', label: 'Email Notifications', icon: Mail },
      { id: 'audit-log', label: 'Audit log', icon: BookOpen },
    ],
  },
  {
    group: 'CONFIGURATION',
    items: [
      { id: 'configuration', label: 'Configuration', icon: Settings },
    ],
  },
];

function getBreadcrumb(section: DemoSectionId): { group: string; label: string } {
  for (const g of SIDEBAR_NAV) {
    const found = g.items.find((i) => i.id === section);
    if (found) {
      return {
        group: g.group.charAt(0) + g.group.slice(1).toLowerCase(),
        label: found.label,
      };
    }
  }
  return { group: 'Overview', label: 'Dashboard' };
}

export function DemoLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const setCurrentPage = useSceneStore((s) => s.setCurrentPage);
  const activeSection = useDemoStore((s) => s.activeSection);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const setSearchQuery = useDemoStore((s) => s.setSearchQuery);
  const toastMessage = useDemoStore((s) => s.toastMessage);
  const clearToast = useDemoStore((s) => s.clearToast);
  const runPocScenario = useDemoStore((s) => s.runPocScenario);
  const resetAllDemoData = useDemoStore((s) => s.resetAllDemoData);

  const pendingReviews = useDemoStore(
    (s) => s.reviews.filter((r) => r.decision === 'Pending').length
  );
  const activeViolations = useDemoStore((s) =>
    s.policies.reduce((sum, p) => sum + p.violations, 0)
  );
  const driftEntitlements = useDemoStore(
    (s) => s.entitlements.filter((e) => e.status === 'Drift').length
  );
  const pendingProvisioning = useDemoStore(
    (s) =>
      s.provisioningJobs.filter(
        (j) => j.status === 'Simulation Mode' || j.status === 'Failed'
      ).length
  );
  const failedImports = useDemoStore(
    (s) => s.importRuns.filter((r) => r.status === 'Failed').length
  );
  const orphanedAccounts = useDemoStore(
    (s) => s.accounts.filter((a) => a.correlationState === 'Orphaned').length
  );
  const failedEmails = useDemoStore(
    (s) =>
      s.emailNotifications.filter(
        (e) => e.status === 'Bounced' || e.status === 'Failed'
      ).length
  );
  const assuranceViolations = useDemoStore((s) =>
    s.governanceControls.reduce(
      (sum, c) =>
        sum + (c.detectiveEnabled ? c.violations.filter((v) => !v.resolved).length : 0),
      0
    )
  );
  const miningOutliersCount = useDemoStore(
    (s) => s.miningOutliers.filter((o) => o.status === 'Flagged').length
  );
  const pendingOnboarding = useDemoStore(
    (s) =>
      s.contractorRequests.filter((r) => r.status === 'Pending Approval').length +
      s.entitlementRequests.filter((r) => r.status === 'Pending Approval').length
  );
  const pendingAccessRequests = useDemoStore(
    (s) => s.accessRequests.filter((r) => r.status === 'Pending Approval').length
  );
  const licenseOverrunCount = useDemoStore(
    (s) =>
      evaluateSkuBirthrightDemand(s.licenseSkus, s.birthrights, s.people).filter(
        (e) => e.exceedsPool
      ).length
  );
  const predictedLeaversCount = useDemoStore(
    (s) => s.predictedLeavers.filter((l) => l.status !== 'Offboarded').length
  );
  const totalMyTasksCount = pendingAccessRequests + pendingReviews + pendingOnboarding;

  // Auto-dismiss live Process++ toast notifications
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => clearToast(), 4500);
    return () => window.clearTimeout(timer);
  }, [toastMessage, clearToast]);

  const crumb = getBreadcrumb(activeSection);

  const badgeFor = (id: DemoSectionId): number | null => {
    if (id === 'my-tasks' && totalMyTasksCount > 0) return totalMyTasksCount;
    if (id === 'orphan-adoption' && orphanedAccounts > 0) return orphanedAccounts;
    if (id === 'onboarding' && pendingOnboarding > 0) return pendingOnboarding;
    if (id === 'lifecycle' && predictedLeaversCount > 0) return predictedLeaversCount;
    if (id === 'role-mining' && miningOutliersCount > 0) return miningOutliersCount;
    if (id === 'licenses' && licenseOverrunCount > 0) return licenseOverrunCount;
    if (id === 'governance-assurance' && assuranceViolations > 0) return assuranceViolations;
    if (id === 'access-reviews' && pendingReviews > 0) return pendingReviews;
    if (id === 'policies-sod' && activeViolations > 0) return activeViolations;
    if (id === 'entitlements' && driftEntitlements > 0) return driftEntitlements;
    if (id === 'reporting' && orphanedAccounts > 0) return orphanedAccounts;
    if (id === 'provisioning-engine' && pendingProvisioning > 0) return pendingProvisioning;
    if (id === 'imports' && failedImports > 0) return failedImports;
    if (id === 'email-notifications' && failedEmails > 0) return failedEmails;
    return null;
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'my-tasks':
        return <MyTasksView />;
      case 'people':
        return <PeopleView />;
      case 'non-human':
        return <NonHumanView />;
      case 'orphan-adoption':
        return <OrphanAdoptionView />;
      case 'access-marketplace':
        return <AccessMarketplaceView />;
      case 'applications':
        return <ApplicationsView />;
      case 'entitlements':
        return <EntitlementsView />;
      case 'roles':
        return <RolesView />;
      case 'role-mining':
        return <RoleMiningView />;
      case 'birthrights':
        return <BirthrightsView />;
      case 'licenses':
        return <LicensesView />;
      case 'governance-assurance':
        return <GovernanceAssuranceView />;
      case 'access-reviews':
        return <AccessReviewsView />;
      case 'policies-sod':
        return <PoliciesSodView />;
      case 'compliance':
        return <ComplianceView />;
      case 'reporting':
        return <ReportingView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'lifecycle':
        return <LifecycleView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'provisioning-engine':
        return <ProvisioningEngineView />;
      case 'imports':
        return <ImportsView />;
      case 'email-notifications':
        return <EmailNotificationsView />;
      case 'audit-log':
        return <AuditLogView />;
      case 'configuration':
        return <ConfigurationView />;
    }
  };

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#F8FAFC] p-5">
      <div className="space-y-5 overflow-y-auto pr-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentPage('landing')}
            className="flex cursor-pointer items-center gap-2.5 text-left"
            title="Return to IDENTRA homepage"
          >
            <IdentraMark className="h-7 w-7" />
            <div>
              <span className="block font-display text-sm font-extrabold tracking-[0.16em] text-[#0F172A]">
                IDENTRA
              </span>
              <span className="block font-mono text-[9px] font-semibold tracking-wider text-[#0284C7] uppercase">
                Live POC Demo
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg border border-slate-200 p-1 text-slate-500 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Exact Item 02 Sidebar Navigation Groups */}
        {SIDEBAR_NAV.map((group) => (
          <div key={group.group}>
            <div className="px-2.5 font-mono text-[9px] font-semibold tracking-[0.14em] text-slate-400">
              {group.group}
            </div>
            <ul className="mt-1.5 space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const count = badgeFor(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        'flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all',
                        isActive
                          ? 'bg-sky-50 font-semibold text-[#0284C7] shadow-2xs ring-1 ring-sky-200/70'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'h-4 w-4',
                            isActive ? 'text-[#0EA5E9]' : 'text-slate-400'
                          )}
                        />
                        <span>{item.label}</span>
                      </span>
                      {count !== null && (
                        <span className="rounded-full bg-rose-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-600">
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Operational Status & Back Link */}
      <div className="space-y-3 border-t border-slate-200/80 pt-4">
        <div className="flex items-center gap-2 px-1 text-[11px] font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>All systems operational</span>
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage('landing')}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0EA5E9] hover:text-[#0284C7]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Landing Page</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Fixed Left Sidebar (Desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200/80 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 h-full w-64 border-r border-slate-200 bg-[#F8FAFC] shadow-2xl"
            >
              {SidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Operational Utility Bar (Matching Reference Top Chrome in Crisp White) */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-600 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">{crumb.group}</span>
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-[#0F172A]">{crumb.label}</span>
              </div>
            </div>

            {/* Global Search */}
            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search identities, apps, entitlements..."
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-1.5 pr-3 pl-9 text-xs text-[#0F172A] placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Quick Interactive Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetAllDemoData}
                title="Reset all demo sample data"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-[#0F172A]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Data</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('access-reviews')}
                className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                title="Open pending governance reviews"
              >
                <Bell className="h-4 w-4" />
                {pendingReviews + activeViolations > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[9px] font-bold text-white">
                    {pendingReviews + activeViolations}
                  </span>
                )}
              </button>

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0EA5E9] font-mono text-[10px] font-bold text-white">
                  AA
                </span>
                <span className="text-xs font-medium text-slate-700">Administrator</span>
              </div>
            </div>
          </div>

          {/* 1-Click Proof-of-Concept Scenario Launcher Strip */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Run Live Scenario:
            </span>
            {[
              { id: 'joiner' as const, label: 'Day-1 HRIS Joiner' },
              { id: 'sod' as const, label: 'Fix SOX SoD Breach' },
              { id: 'orphan' as const, label: 'Off-board & Cut Orphan' },
              { id: 'ai-agent' as const, label: 'Contain Shadow AI Agent' },
            ].map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => runPocScenario(sc.id)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-sky-200/80 bg-sky-50/70 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#0284C7] transition-colors hover:bg-[#0EA5E9] hover:text-white"
              >
                <Play className="h-2.5 w-2.5 fill-current" />
                <span>{sc.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Live Action Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-900 shadow-xs sm:mx-7"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={clearToast}
                className="cursor-pointer rounded p-0.5 text-emerald-700 hover:bg-emerald-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Module Workspace */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-7">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
