import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  Mail,
  Palette,
  RefreshCw,
  RotateCcw,
  Save,
  Server,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  INITIAL_PLATFORM_CONFIG,
  MASTER_EMAIL_PRESETS,
  buildBrandedIdentraEmailHtml,
  type MasterEmailTemplateConfig,
  type PlatformConfig,
  type ReviewWorkflowType,
  type SmtpAuthMethod,
  type SmtpConfig,
} from '@/data/demoSampleData';
import { Switch, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type ConfigTabId = 'email-smtp' | 'master-template' | 'provisioning' | 'governance';

const SMTP_AUTH_METHODS: SmtpAuthMethod[] = [
  'OAuth 2.0 / Graph Client Credentials',
  'SMTP AUTH (Username & Password)',
  'API Key Bearer',
  'mTLS Client Certificate',
];

const WORKFLOW_OPTIONS: ReviewWorkflowType[] = [
  'Manager Approval',
  'Entitlement Owner Approval',
  'Application Owner Approval',
  'Dual-Stage (Manager → App Owner)',
  'SOX Control Owner Approval',
  'Data Owner & SecOps Approval',
];

export function ConfigurationView() {
  const platformConfig = useDemoStore((s) => s.platformConfig);
  const emailNotifications = useDemoStore((s) => s.emailNotifications);
  const updateSmtpConfig = useDemoStore((s) => s.updateSmtpConfig);
  const testSmtpConnection = useDemoStore((s) => s.testSmtpConnection);
  const updateMasterEmailTemplate = useDemoStore((s) => s.updateMasterEmailTemplate);
  const updateProvisioningConfig = useDemoStore((s) => s.updateProvisioningConfig);
  const updateGovernanceConfig = useDemoStore((s) => s.updateGovernanceConfig);
  const setActiveSection = useDemoStore((s) => s.setActiveSection);

  const [activeTab, setActiveTab] = useState<ConfigTabId>('email-smtp');
  const [showSecret, setShowSecret] = useState(false);

  // Local editable drafts synced with store
  const [smtpDraft, setSmtpDraft] = useState<SmtpConfig>(platformConfig.smtp);
  const [tplDraft, setTplDraft] = useState<MasterEmailTemplateConfig>(
    platformConfig.emailTemplate
  );
  const [provDraft, setProvDraft] = useState<PlatformConfig['provisioning']>(
    platformConfig.provisioning
  );
  const [govDraft, setGovDraft] = useState<PlatformConfig['governance']>(
    platformConfig.governance
  );

  const [previewEmailId, setPreviewEmailId] = useState<string>(
    emailNotifications[0]?.id ?? ''
  );

  useEffect(() => {
    setSmtpDraft(platformConfig.smtp);
  }, [platformConfig.smtp]);

  useEffect(() => {
    setTplDraft(platformConfig.emailTemplate);
  }, [platformConfig.emailTemplate]);

  useEffect(() => {
    setProvDraft(platformConfig.provisioning);
  }, [platformConfig.provisioning]);

  useEffect(() => {
    setGovDraft(platformConfig.governance);
  }, [platformConfig.governance]);

  const previewNotification = useMemo(
    () =>
      emailNotifications.find((e) => e.id === previewEmailId) ??
      emailNotifications[0] ??
      null,
    [emailNotifications, previewEmailId]
  );

  const livePreviewHtml = useMemo(() => {
    if (!previewNotification) return '';
    return buildBrandedIdentraEmailHtml(previewNotification.templateData, tplDraft);
  }, [previewNotification, tplDraft]);

  const applyPreset = (presetPatch: Partial<MasterEmailTemplateConfig>) => {
    setTplDraft((prev) => ({ ...prev, ...presetPatch }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Platform Configuration
          </h1>
          <p className="text-sm text-slate-500">
            Configure SMTP mail delivery, global inherited Master Email Template styling, provisioning defaults, and governance guardrails across the demo.
          </p>
        </div>
      </div>

      {/* Radix Configuration Tabs */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ConfigTabId)}
        className="space-y-5"
      >
        <Tabs.List className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          {[
            { id: 'email-smtp' as const, label: 'Email & SMTP Relay', icon: Mail },
            { id: 'master-template' as const, label: 'Master Email Template', icon: Palette },
            { id: 'provisioning' as const, label: 'Provisioning & Imports', icon: Cpu },
            { id: 'governance' as const, label: 'Governance & Reviews', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none',
                  active
                    ? 'bg-sky-50 text-[#0284C7] ring-1 ring-sky-200/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-[#0EA5E9]' : 'text-slate-400')} />
                <span>{tab.label}</span>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {/* TAB 1: SMTP SERVICE / HOST & AUTHENTICATION */}
        <Tabs.Content value="email-smtp" className="focus:outline-none">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-[#0F172A]">
                    SMTP Service &amp; Authentication
                  </h2>
                  <p className="text-xs text-slate-500">
                    Outbound mail transport used for Joiner welcome packs, Access Reviews, SoD alerts, and Emergency Deactivation notifications.
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold',
                    platformConfig.smtp.connectionStatus === 'Connected'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  )}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{platformConfig.smtp.connectionStatus}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    SMTP Host / Relay Endpoint
                  </label>
                  <input
                    type="text"
                    value={smtpDraft.host}
                    onChange={(e) => setSmtpDraft((s) => ({ ...s, host: e.target.value }))}
                    placeholder="smtp.office365.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Port
                  </label>
                  <input
                    type="number"
                    value={smtpDraft.port}
                    onChange={(e) =>
                      setSmtpDraft((s) => ({ ...s, port: Number(e.target.value) || 587 }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Transport Encryption
                  </label>
                  <select
                    value={smtpDraft.encryption}
                    onChange={(e) =>
                      setSmtpDraft((s) => ({
                        ...s,
                        encryption: e.target.value as SmtpConfig['encryption'],
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  >
                    <option value="STARTTLS (TLS 1.3)">STARTTLS (TLS 1.3)</option>
                    <option value="SSL/TLS (465)">SSL/TLS (465)</option>
                    <option value="Opportunistic TLS">Opportunistic TLS</option>
                  </select>
                </div>

                <div className="sm:col-span-12">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Authentication Method
                  </label>
                  <select
                    value={smtpDraft.authMethod}
                    onChange={(e) =>
                      setSmtpDraft((s) => ({
                        ...s,
                        authMethod: e.target.value as SmtpAuthMethod,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  >
                    {SMTP_AUTH_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Auth Username / Client ID
                  </label>
                  <input
                    type="text"
                    value={smtpDraft.username}
                    onChange={(e) => setSmtpDraft((s) => ({ ...s, username: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Password / Client Secret / API Key
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={smtpDraft.password}
                      onChange={(e) => setSmtpDraft((s) => ({ ...s, password: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 pr-9 pl-3 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret((v) => !v)}
                      aria-label="Toggle secret visibility"
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700"
                    >
                      {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    value={smtpDraft.fromName}
                    onChange={(e) => setSmtpDraft((s) => ({ ...s, fromName: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    From Address
                  </label>
                  <input
                    type="email"
                    value={smtpDraft.fromEmail}
                    onChange={(e) => setSmtpDraft((s) => ({ ...s, fromEmail: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Reply-To Address
                  </label>
                  <input
                    type="email"
                    value={smtpDraft.replyToEmail}
                    onChange={(e) =>
                      setSmtpDraft((s) => ({ ...s, replyToEmail: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className="font-mono text-[10px] text-slate-400">
                  Last verified handshake: {platformConfig.smtp.lastTestedAt}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateSmtpConfig(smtpDraft);
                      testSmtpConnection();
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Test SMTP Handshake</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSmtpConfig(smtpDraft)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save SMTP Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Side Info Card */}
            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                  <Server className="h-4 w-4 text-[#0EA5E9]" />
                  <span>Active Mail Transport</span>
                </div>
                <div className="mt-3 space-y-2 rounded-xl bg-[#F8FAFC] p-3.5 font-mono text-[11px]">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Host</span>
                    <span className="font-semibold text-[#0F172A]">{smtpDraft.host}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Port</span>
                    <span className="font-semibold text-[#0F172A]">{smtpDraft.port}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">TLS</span>
                    <span className="font-semibold text-emerald-700">{smtpDraft.encryption}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Sender</span>
                    <span className="truncate font-semibold text-[#0284C7]">
                      {smtpDraft.fromEmail}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('email-notifications')}
                  className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                >
                  <span>View Email Notification Logs ({emailNotifications.length})</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* TAB 2: MASTER EMAIL TEMPLATE (INHERITED BY ALL EMAIL NOTIFICATIONS) */}
        <Tabs.Content value="master-template" className="focus:outline-none">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            {/* Master Styling Controls */}
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs xl:col-span-5">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-heading text-base font-bold text-[#0F172A]">
                    Master Email Template
                  </h2>
                  <p className="text-xs text-slate-500">
                    All <strong className="text-slate-700">{emailNotifications.length} email notifications</strong> inherit their header, palette, typography, radius, and footer directly from this master template.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTplDraft(INITIAL_PLATFORM_CONFIG.emailTemplate)}
                  title="Reset draft to IDENTRA default"
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 1-Click Brand Presets */}
              <div>
                <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                  Quick Theme Presets
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {MASTER_EMAIL_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.config)}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-left text-[11px] font-semibold text-slate-700 transition-all hover:border-[#0EA5E9] hover:bg-sky-50/50"
                    >
                      <span
                        className="h-4 w-4 shrink-0 rounded-full ring-1 ring-slate-300"
                        style={{
                          background: `linear-gradient(135deg, ${preset.config.headerBgStart}, ${preset.config.accentColor})`,
                        }}
                      />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Copy */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Brand Wordmark
                  </label>
                  <input
                    type="text"
                    value={tplDraft.brandTitle}
                    onChange={(e) =>
                      setTplDraft((t) => ({ ...t, brandTitle: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Header Subtitle
                  </label>
                  <input
                    type="text"
                    value={tplDraft.brandSubtitle}
                    onChange={(e) =>
                      setTplDraft((t) => ({ ...t, brandSubtitle: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 font-mono text-[11px] text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Controls */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'headerBgStart' as const, label: 'Header Start' },
                  { key: 'headerBgEnd' as const, label: 'Header End' },
                  { key: 'accentColor' as const, label: 'Accent / CTA' },
                  { key: 'canvasBgColor' as const, label: 'Page Canvas' },
                ].map((col) => (
                  <div key={col.key}>
                    <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                      {col.label}
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5">
                      <input
                        type="color"
                        value={tplDraft[col.key]}
                        onChange={(e) =>
                          setTplDraft((t) => ({ ...t, [col.key]: e.target.value }))
                        }
                        className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={tplDraft[col.key]}
                        onChange={(e) =>
                          setTplDraft((t) => ({ ...t, [col.key]: e.target.value }))
                        }
                        className="w-full bg-transparent font-mono text-[11px] text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Header Text Contrast + Typography + Radii */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Header Text
                  </label>
                  <select
                    value={tplDraft.headerTextColor}
                    onChange={(e) =>
                      setTplDraft((t) => ({ ...t, headerTextColor: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  >
                    <option value="#FFFFFF">Light (#FFFFFF)</option>
                    <option value="#0F172A">Dark (#0F172A)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Font Family
                  </label>
                  <select
                    value={tplDraft.fontFamily}
                    onChange={(e) =>
                      setTplDraft((t) => ({
                        ...t,
                        fontFamily: e.target.value as MasterEmailTemplateConfig['fontFamily'],
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="Georgia Serif">Georgia Serif</option>
                    <option value="System UI">System UI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                    Button Shape
                  </label>
                  <select
                    value={tplDraft.buttonRadiusPx}
                    onChange={(e) =>
                      setTplDraft((t) => ({
                        ...t,
                        buttonRadiusPx: Number(e.target.value) as 4 | 10 | 999,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  >
                    <option value={4}>Sharp (4px)</option>
                    <option value={10}>Crisp (10px)</option>
                    <option value={999}>Pill (Full)</option>
                  </select>
                </div>
              </div>

              {/* Footer Text */}
              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Master Footer Brand Line
                </label>
                <input
                  type="text"
                  value={tplDraft.footerBrandText}
                  onChange={(e) =>
                    setTplDraft((t) => ({ ...t, footerBrandText: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#0F172A] focus:border-[#0EA5E9] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Visibility Toggles */}
              <div className="space-y-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3.5 text-xs">
                {[
                  { key: 'showBrandEmblem' as const, label: 'Show IDENTRA Faceted Logo Mark' },
                  { key: 'showCorrelationBadge' as const, label: 'Show Message Code Badge (EML-XXXX)' },
                  { key: 'showDkimFooter' as const, label: 'Show TLS 1.3 · DKIM Signed Footer Stamp' },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-700">{toggle.label}</span>
                    <Switch.Root
                      checked={tplDraft[toggle.key]}
                      onCheckedChange={(checked) =>
                        setTplDraft((t) => ({ ...t, [toggle.key]: checked }))
                      }
                      className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                    >
                      <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveSection('email-notifications')}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <span>Verify in Email Logs</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateMasterEmailTemplate(tplDraft)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Apply to All {emailNotifications.length} Emails</span>
                </button>
              </div>
            </div>

            {/* Live Inherited Email Preview */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs xl:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-[#F8FAFC] px-5 py-3.5">
                <div>
                  <div className="font-heading text-sm font-bold text-[#0F172A]">
                    Live Inherited Template Preview
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Switch between any logged notification to see how it inherits your Master Template styling in real time.
                  </div>
                </div>
                <select
                  value={previewNotification?.id ?? ''}
                  onChange={(e) => setPreviewEmailId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-[#0F172A]"
                >
                  {emailNotifications.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.messageCode} · {e.triggerCategory} ({e.recipientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 bg-slate-100/70 p-4">
                <iframe
                  title="Master Email Template live preview"
                  srcDoc={livePreviewHtml}
                  sandbox=""
                  className="h-[680px] w-full rounded-xl border border-slate-200 bg-white shadow-xs"
                />
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* TAB 3: PROVISIONING & IMPORTS SETTINGS */}
        <Tabs.Content value="provisioning" className="focus:outline-none">
          <div className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-heading text-base font-bold text-[#0F172A]">
                Provisioning Engine &amp; Connector Imports
              </h2>
              <p className="text-xs text-slate-500">
                Control execution mode, delta synchronization cadence, orphan thresholds, and emergency kill-switch behavior.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Default Provisioning Mode
                </label>
                <select
                  value={provDraft.defaultMode}
                  onChange={(e) =>
                    setProvDraft((p) => ({
                      ...p,
                      defaultMode: e.target.value as 'Auto-Provision' | 'Simulation Mode',
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                >
                  <option value="Auto-Provision">Auto-Provision (Live Commit)</option>
                  <option value="Simulation Mode">Simulation Mode (Hold for Approval)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Delta Import Cadence
                </label>
                <select
                  value={provDraft.importDeltaIntervalMins}
                  onChange={(e) =>
                    setProvDraft((p) => ({
                      ...p,
                      importDeltaIntervalMins: Number(e.target.value) as 5 | 15 | 30 | 60,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Hourly (60m)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Orphan Inactivity Flag
                </label>
                <select
                  value={provDraft.orphanThresholdDays}
                  onChange={(e) =>
                    setProvDraft((p) => ({
                      ...p,
                      orphanThresholdDays: Number(e.target.value) as 30 | 60 | 90,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                >
                  <option value={30}>30 days inactive</option>
                  <option value={60}>60 days inactive</option>
                  <option value={90}>90 days inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-xs">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Rollback Staged Import Delta on Connector Error
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Protects desired-state parity whenever an authoritative HRIS or directory sync fails mid-extract.
                  </div>
                </div>
                <Switch.Root
                  checked={provDraft.rollbackImportOnError}
                  onCheckedChange={(checked) =>
                    setProvDraft((p) => ({ ...p, rollbackImportOnError: checked }))
                  }
                  className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3">
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Emergency Deactivation Disables All Connected Target Systems
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Immediately executes disable jobs across AD, Entra ID, SAP, AWS, Snowflake, and Okta when triggered on an identity.
                  </div>
                </div>
                <Switch.Root
                  checked={provDraft.emergencyDisableAllTargets}
                  onCheckedChange={(checked) =>
                    setProvDraft((p) => ({ ...p, emergencyDisableAllTargets: checked }))
                  }
                  className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => updateProvisioningConfig(provDraft)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Provisioning &amp; Import Settings</span>
              </button>
            </div>
          </div>
        </Tabs.Content>

        {/* TAB 4: GOVERNANCE, BIRTHRIGHTS & ACCESS REVIEWS SETTINGS */}
        <Tabs.Content value="governance" className="focus:outline-none">
          <div className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-heading text-base font-bold text-[#0F172A]">
                Governance, Birthrights &amp; Access Review Defaults
              </h2>
              <p className="text-xs text-slate-500">
                Set organization-wide certification workflows, SoD enforcement posture, non-human credential TTLs, and reporting currency.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Default Access Review Workflow
                </label>
                <select
                  value={govDraft.defaultReviewWorkflow}
                  onChange={(e) =>
                    setGovDraft((g) => ({
                      ...g,
                      defaultReviewWorkflow: e.target.value as ReviewWorkflowType,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                >
                  {WORKFLOW_OPTIONS.map((wf) => (
                    <option key={wf} value={wf}>
                      {wf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Review Escalation SLA
                </label>
                <select
                  value={govDraft.reviewEscalationSlaDays}
                  onChange={(e) =>
                    setGovDraft((g) => ({
                      ...g,
                      reviewEscalationSlaDays: Number(e.target.value) as 5 | 7 | 10 | 14,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                >
                  <option value={5}>5 days</option>
                  <option value={7}>7 days</option>
                  <option value={10}>10 days</option>
                  <option value={14}>14 days</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  SoD Enforcement Posture
                </label>
                <select
                  value={govDraft.sodEnforcementMode}
                  onChange={(e) =>
                    setGovDraft((g) => ({
                      ...g,
                      sodEnforcementMode: e.target.value as
                        | 'Preventative Block & Alert'
                        | 'Detective Monitor Only',
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A]"
                >
                  <option value="Preventative Block & Alert">Preventative Block &amp; Alert</option>
                  <option value="Detective Monitor Only">Detective Monitor Only</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Non-Human / AI Max Secret TTL
                </label>
                <select
                  value={govDraft.nhiMaxSecretTtlDays}
                  onChange={(e) =>
                    setGovDraft((g) => ({
                      ...g,
                      nhiMaxSecretTtlDays: Number(e.target.value) as 30 | 60 | 90,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                >
                  <option value={30}>30 days (Strict)</option>
                  <option value={60}>60 days (Standard)</option>
                  <option value={90}>90 days (Extended)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold text-slate-500 uppercase">
                  Reporting &amp; License Currency
                </label>
                <select
                  value={govDraft.currencySymbol}
                  onChange={(e) =>
                    setGovDraft((g) => ({
                      ...g,
                      currencySymbol: e.target.value as 'R' | '€' | '£',
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#0F172A]"
                >
                  <option value="R">R — South African Rand (ZAR)</option>
                  <option value="€">€ — Euro (EUR)</option>
                  <option value="£">£ — British Pound (GBP)</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-xs">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    Auto-Revoke Birthright Grants on Attribute or Context Exit
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Automatically removes derived roles and entitlements whenever an identity no longer satisfies birthright rules.
                  </div>
                </div>
                <Switch.Root
                  checked={govDraft.autoRevokeBirthrightsOnExit}
                  onCheckedChange={(checked) =>
                    setGovDraft((g) => ({ ...g, autoRevokeBirthrightsOnExit: checked }))
                  }
                  className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-slate-200 transition-colors data-[state=checked]:bg-[#0EA5E9]"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => updateGovernanceConfig(govDraft)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0284C7]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Governance Settings</span>
              </button>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
