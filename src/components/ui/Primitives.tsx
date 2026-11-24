import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/cn';

export { Dialog, Tabs, Switch, Tooltip };

/**
 * Signature IDENTRA geometric faceted "A" emblem modeled directly on the reference brand mark.
 */
export function IdentraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="identraLeft" x1="6" y1="34" x2="22" y2="5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="55%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="identraRight" x1="20" y1="5" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Left leg of faceted A */}
      <path d="M20 4L6 34H13.2L20 18.8L20 4Z" fill="url(#identraLeft)" />
      {/* Right leg of faceted A */}
      <path d="M20 4L34 34H26.6L20 18.8L20 4Z" fill="url(#identraRight)" />
      {/* Inner precision bridge chevron */}
      <path d="M14.8 26.2L20 22.8L25.2 26.2L22.5 29.6H17.5L14.8 26.2Z" fill="#0EA5E9" />
    </svg>
  );
}

export function SectionEyebrow({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3.5 py-1 font-mono text-[11px] font-medium tracking-[0.12em] text-[#0369A1] uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9]" />
      <span>{index}</span>
      <span className="text-[#7DD3FC]">/</span>
      <span>{label}</span>
    </div>
  );
}
