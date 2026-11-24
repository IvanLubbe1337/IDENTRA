import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Download,
  Eye,
  Mail,
  Monitor,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  X,
  XCircle,
} from 'lucide-react';
import type {
  DemoEmailNotification,
  EmailDeliveryStatus,
  EmailTriggerCategory,
} from '@/data/demoSampleData';
import { Dialog, Tabs } from '@/components/ui/Primitives';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

const STATUS_FILTERS: ('All' | EmailDeliveryStatus)[] = [
  'All',
  'Delivered',
  'Queued',
  'Bounced',
  'Failed',
];

const CATEGORY_FILTERS: ('All' | EmailTriggerCategory)[] = [
  'All',
  'JML Lifecycle',
  'Access Review',
  'SoD & Policy',
  'Birthright',
  'Operations',
];

function statusBadge(status: EmailDeliveryStatus) {
  switch (status) {
    case 'Delivered':
      return {
        icon: CheckCircle2,
        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 'Queued':
      return {
        icon: Clock,
        cls: 'bg-sky-50 text-[#0284C7] border-sky-200',
      };
    case 'Bounced':
      return {
        icon: AlertTriangle,
        cls: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'Failed':
      return {
        icon: XCircle,
        cls: 'bg-rose-50 text-rose-700 border-rose-200',
      };
  }
}

function categoryTone(cat: EmailTriggerCategory): string {
  switch (cat) {
    case 'JML Lifecycle':
      return 'bg-emerald-50 text-emerald-700';
    case 'Access Review':
      return 'bg-sky-50 text-[#0284C7]';
    case 'SoD & Policy':
      return 'bg-rose-50 text-rose-600';
    case 'Birthright':
      return 'bg-violet-50 text-violet-700';
    case 'Operations':
      return 'bg-amber-50 text-amber-800';
  }
}

export function EmailNotificationsView() {
  const emailNotifications = useDemoStore((s) => s.emailNotifications);
  const searchQuery = useDemoStore((s) => s.searchQuery);
  const retryEmailNotification = useDemoStore((s) => s.retryEmailNotification);
  const resendEmailNotification = useDemoStore((s) => s.resendEmailNotification);

  const [statusFilter, setStatusFilter] = useState<'All' | EmailDeliveryStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | EmailTriggerCategory>('All');
  const [inspectEmailId, setInspectEmailId] = useState<string | null>(null);
  const [inspectTab, setInspectTab] = useState<'preview' | 'html'>('preview');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedHtml, setCopiedHtml] = useState(false);

  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return emailNotifications.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && item.triggerCategory !== categoryFilter) return false;
      if (!needle) return true;
      const hay = [
        item.messageCode,
        item.timestamp,
        item.status,
        item.trigger,
        item.triggerCategory,
        item.recipientName,
        item.recipientEmail,
        item.recipientRole,
        item.subject,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [emailNotifications, statusFilter, categoryFilter, searchQuery]);

  const inspectedEmail: DemoEmailNotification | null = inspectEmailId
    ? (emailNotifications.find((e) => e.id === inspectEmailId) ?? null)
    : null;

  const counts = useMemo(
    () => ({
      total: emailNotifications.length,
      delivered: emailNotifications.filter((e) => e.status === 'Delivered').length,
      queued: emailNotifications.filter((e) => e.status === 'Queued').length,
      issues: emailNotifications.filter(
        (e) => e.status === 'Bounced' || e.status === 'Failed'
      ).length,
    }),
    [emailNotifications]
  );

  const openInspector = (id: string, tab: 'preview' | 'html' = 'preview') => {
    setInspectEmailId(id);
    setInspectTab(tab);
    setCopiedHtml(false);
  };

  const handleCopyHtml = async (html: string) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopiedHtml(true);
      window.setTimeout(() => setCopiedHtml(false), 2500);
    } catch {
      setCopiedHtml(false);
    }
  };

  const handleDownloadHtml = (email: DemoEmailNotification) => {
    const blob = new Blob([email.htmlBody], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${email.messageCode.toLowerCase()}-identra-notification.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0F172A]">
            Email Notification Logs
          </h1>
          <p className="text-sm text-slate-500">
            Delivery audit log for branded IDENTRA governance emails — inspect any message to preview what the recipient sees and view the raw HTML source.
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Total Dispatched
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0F172A]">
              {counts.total}
            </span>
            <span className="font-mono text-[11px] text-slate-400">DKIM signed</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Delivered
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-emerald-600">
              {counts.delivered}
            </span>
            <span className="font-mono text-[11px] text-slate-400">TLS 1.3 Graph</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Queued
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#0284C7]">
              {counts.queued}
            </span>
            <span className="font-mono text-[11px] text-slate-400">Relay buffer</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Bounced / Failed
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className={cn(
                'font-display text-2xl font-extrabold',
                counts.issues > 0 ? 'text-rose-600' : 'text-emerald-600'
              )}
            >
              {counts.issues}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {counts.issues > 0 ? 'Retry available' : 'All healthy'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Status:
          </span>
          {STATUS_FILTERS.map((st) => {
            const active = statusFilter === st;
            const count =
              st === 'All'
                ? emailNotifications.length
                : emailNotifications.filter((e) => e.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {st} <span className="font-mono text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
          <span className="mr-1 font-mono text-[10px] font-semibold text-slate-400 uppercase">
            Trigger Category:
          </span>
          {CATEGORY_FILTERS.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  active
                    ? 'border-[#0EA5E9] bg-sky-50 font-semibold text-[#0284C7]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Email Notification Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#F8FAFC] font-mono text-[10px] tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3.5">Timestamp &amp; ID</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Trigger &amp; Subject</th>
                <th className="px-4 py-3.5">Sent To</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const badge = statusBadge(item.status);
                const StatusIcon = badge.icon;
                const canRetry =
                  item.status === 'Bounced' ||
                  item.status === 'Failed' ||
                  item.status === 'Queued';

                return (
                  <tr
                    key={item.id}
                    onClick={() => openInspector(item.id, 'preview')}
                    className="cursor-pointer transition-colors hover:bg-sky-50/35"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-[#0F172A]">
                        {item.messageCode}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {item.timestamp}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold',
                          badge.cls
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{item.status}</span>
                      </span>
                      {item.deliveryLatencyMs !== null && (
                        <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                          {item.deliveryLatencyMs}ms
                        </div>
                      )}
                    </td>

                    <td className="max-w-md px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase',
                            categoryTone(item.triggerCategory)
                          )}
                        >
                          {item.triggerCategory}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {item.trigger}
                        </span>
                      </div>
                      <div className="mt-1 truncate font-heading text-xs font-bold text-[#0F172A]">
                        {item.subject}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-[#0F172A]">{item.recipientName}</div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {item.recipientEmail}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.recipientRole}</div>
                    </td>

                    <td
                      className="px-4 py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        {canRetry && (
                          <button
                            type="button"
                            onClick={() => retryEmailNotification(item.id)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#0EA5E9] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0284C7]"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>{item.status === 'Queued' ? 'Deliver' : 'Retry'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openInspector(item.id, 'preview')}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#0EA5E9]" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radix Slide-Over Email Notification Inspector (Recipient Preview + Raw HTML) */}
      <Dialog.Root
        open={Boolean(inspectedEmail)}
        onOpenChange={(open) => {
          if (!open) setInspectEmailId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-4xl flex-col border-l border-slate-200 bg-white shadow-2xl focus:outline-none">
            {inspectedEmail && (
              <>
                {/* Inspector Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase">
                      <span className="text-[#0284C7]">{inspectedEmail.messageCode}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{inspectedEmail.timestamp}</span>
                      <span className="text-slate-300">·</span>
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5',
                          statusBadge(inspectedEmail.status).cls
                        )}
                      >
                        {inspectedEmail.status}
                      </span>
                    </div>
                    <Dialog.Title className="mt-1 truncate font-display text-lg font-extrabold text-[#0F172A]">
                      {inspectedEmail.subject}
                    </Dialog.Title>
                    <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                      Trigger: <strong className="text-slate-700">{inspectedEmail.trigger}</strong>
                    </Dialog.Description>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {inspectedEmail.status !== 'Delivered' ? (
                      <button
                        type="button"
                        onClick={() => retryEmailNotification(inspectedEmail.id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0284C7]"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>
                          {inspectedEmail.status === 'Queued' ? 'Deliver Now' : 'Retry Delivery'}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => resendEmailNotification(inspectedEmail.id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                      >
                        <Send className="h-3.5 w-3.5 text-[#0EA5E9]" />
                        <span>Resend Copy</span>
                      </button>
                    )}

                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close email inspector"
                        className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Envelope Metadata & Diagnostics */}
                <div className="space-y-3 border-b border-slate-100 bg-[#F8FAFC] px-6 py-3.5 text-xs">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                      <span className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                        Sent To
                      </span>
                      <span className="font-semibold text-[#0F172A]">
                        {inspectedEmail.recipientName}
                      </span>{' '}
                      <span className="font-mono text-[11px] text-slate-500">
                        &lt;{inspectedEmail.recipientEmail}&gt;
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                        From
                      </span>
                      <span className="font-mono text-[11px] text-slate-700">
                        {inspectedEmail.from}
                      </span>
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] font-semibold text-slate-400 uppercase">
                        Transport &amp; CC
                      </span>
                      <span className="font-mono text-[11px] text-slate-700">
                        {inspectedEmail.smtpProvider}
                      </span>
                      {inspectedEmail.cc && inspectedEmail.cc.length > 0 && (
                        <div className="font-mono text-[10px] text-slate-400">
                          CC: {inspectedEmail.cc.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {inspectedEmail.errorMessage && (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-amber-900">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <div>
                        <strong className="font-semibold">Delivery Diagnostic:</strong>{' '}
                        {inspectedEmail.errorMessage}
                      </div>
                    </div>
                  )}
                </div>

                {/* Radix Tabs: Rendered Recipient Inbox Preview vs Raw HTML Source */}
                <Tabs.Root
                  value={inspectTab}
                  onValueChange={(v) => setInspectTab(v as 'preview' | 'html')}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-6 py-2.5">
                    <Tabs.List className="inline-flex gap-1 rounded-xl bg-slate-100 p-1">
                      <Tabs.Trigger
                        value="preview"
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none',
                          inspectTab === 'preview'
                            ? 'bg-white text-[#0F172A] shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        )}
                      >
                        <Mail className="h-3.5 w-3.5 text-[#0EA5E9]" />
                        <span>Recipient Inbox Preview</span>
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="html"
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none',
                          inspectTab === 'html'
                            ? 'bg-white text-[#0F172A] shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        )}
                      >
                        <Code2 className="h-3.5 w-3.5 text-[#0EA5E9]" />
                        <span>HTML Source</span>
                      </Tabs.Trigger>
                    </Tabs.List>

                    {inspectTab === 'preview' ? (
                      <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => setViewportMode('desktop')}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold',
                            viewportMode === 'desktop'
                              ? 'bg-sky-50 text-[#0284C7]'
                              : 'text-slate-500 hover:text-slate-800'
                          )}
                        >
                          <Monitor className="h-3.5 w-3.5" />
                          <span>Desktop</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('mobile')}
                          className={cn(
                            'inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold',
                            viewportMode === 'mobile'
                              ? 'bg-sky-50 text-[#0284C7]'
                              : 'text-slate-500 hover:text-slate-800'
                          )}
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          <span>Mobile</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyHtml(inspectedEmail.htmlBody)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0EA5E9] hover:text-[#0284C7]"
                        >
                          {copiedHtml ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>{copiedHtml ? 'Copied HTML' : 'Copy HTML'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadHtml(inspectedEmail)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0EA5E9]"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download .html</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tab 1: Recipient Client Preview */}
                  <Tabs.Content
                    value="preview"
                    className="flex-1 overflow-y-auto bg-slate-100/80 p-5 focus:outline-none"
                  >
                    <div
                      className={cn(
                        'mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all',
                        viewportMode === 'mobile' ? 'max-w-[390px]' : 'max-w-[700px]'
                      )}
                    >
                      {/* Realistic Email Client Inbox Header Chrome */}
                      <div className="border-b border-slate-200 bg-[#F8FAFC] px-4 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F172A] font-display text-[10px] font-extrabold text-[#38BDF8]">
                              ID
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-xs font-bold text-[#0F172A]">
                                  IDENTRA Identity Notifications
                                </span>
                                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-700">
                                  <ShieldCheck className="h-2.5 w-2.5" />
                                  Verified
                                </span>
                              </div>
                              <div className="truncate font-mono text-[10px] text-slate-500">
                                To: {inspectedEmail.recipientName} &lt;{inspectedEmail.recipientEmail}&gt;
                              </div>
                            </div>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] text-slate-400">
                            {inspectedEmail.timestamp}
                          </span>
                        </div>
                        <div className="mt-2 font-heading text-sm font-bold text-[#0F172A]">
                          {inspectedEmail.subject}
                        </div>
                      </div>

                      {/* Sandboxed Branded HTML Email Render */}
                      <iframe
                        title={`Rendered HTML preview for ${inspectedEmail.messageCode}`}
                        srcDoc={inspectedEmail.htmlBody}
                        sandbox=""
                        className="h-[680px] w-full border-0 bg-[#F1F5F9]"
                      />
                    </div>
                  </Tabs.Content>

                  {/* Tab 2: Raw HTML Source */}
                  <Tabs.Content
                    value="html"
                    className="flex-1 overflow-auto bg-[#0F172A] p-5 focus:outline-none"
                  >
                    <pre className="font-mono text-[11px] leading-relaxed text-sky-100 whitespace-pre-wrap break-words">
                      <code>{inspectedEmail.htmlBody}</code>
                    </pre>
                  </Tabs.Content>
                </Tabs.Root>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
