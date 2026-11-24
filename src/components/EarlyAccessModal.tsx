import { useState, type FormEvent } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { Dialog, IdentraMark } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/cn';

const SOURCES = ['Workday + Okta', 'Microsoft Entra ID', 'AWS IAM + K8s', 'AI & Service Accounts'];
const PRIORITIES = [
  'JML Lifecycle Automation',
  'Access Reviews & Compliance',
  'Business Roles & SoD',
  'Orphan Account Cleanup',
];

export function EarlyAccessModal() {
  const open = useSceneStore((s) => s.earlyAccessOpen);
  const setOpen = useSceneStore((s) => s.setEarlyAccessOpen);
  const triggerPulse = useSceneStore((s) => s.triggerPulse);

  const [email, setEmail] = useState('');
  const [source, setSource] = useState(SOURCES[0]);
  const [priority, setPriority] = useState(PRIORITIES[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    triggerPulse();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      window.setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 220);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <IdentraMark className="h-7 w-7" />
              <div>
                <Dialog.Title className="font-display text-xl font-bold text-[#0F172A]">
                  Request IDENTRA Preview
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                  Deploy the Identity Process++ platform for your organization.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close modal"
                className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
              <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-600" />
              <h3 className="mt-3 font-heading text-lg font-bold text-[#0F172A]">
                You&apos;re on the Preview List
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                We&apos;ve registered <span className="font-mono font-semibold text-slate-900">{email}</span>{' '}
                with focus on <span className="font-semibold text-[#0284C7]">{priority}</span> ({source}).
              </p>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-5 cursor-pointer rounded-full bg-[#0F172A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0EA5E9]"
              >
                Back to IDENTRA
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="work-email"
                  className="block font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase"
                >
                  Work Email
                </label>
                <input
                  id="work-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
                />
              </div>

              <div>
                <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  Primary Identity Stack
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {SOURCES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSource(item)}
                      className={cn(
                        'cursor-pointer rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all',
                        source === item
                          ? 'border-[#0EA5E9] bg-sky-50 text-[#0284C7]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  Top Process++ Priority
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PRIORITIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPriority(item)}
                      className={cn(
                        'cursor-pointer rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all',
                        priority === item
                          ? 'border-[#2563EB] bg-blue-50 text-[#1D4ED8]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0EA5E9] px-6 py-3.5 font-heading text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition-all hover:bg-[#0284C7]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Request Early Access</span>
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
