import { ArrowUpRight, Play } from 'lucide-react';
import { IdentraMark } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';

const NAV_ITEMS = [
  { id: 'hero', label: 'Ecosystem' },
  { id: 'console', label: 'Operations' },
  { id: 'pillars', label: 'Process++' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'blueprint', label: 'Roadmap' },
];

export function Navbar() {
  const setEarlyAccessOpen = useSceneStore((s) => s.setEarlyAccessOpen);
  const setCurrentPage = useSceneStore((s) => s.setCurrentPage);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-10">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('hero');
          }}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <IdentraMark className="h-7 w-7" />
          <span className="font-display text-base font-extrabold tracking-[0.16em] text-[#0F172A]">
            IDENTRA
          </span>
          <span className="hidden rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0284C7] sm:inline-block">
            Process++
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className="cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentPage('demo')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 font-heading text-xs font-semibold text-[#0284C7] transition-all hover:border-[#0EA5E9] hover:bg-sky-100"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Live Demo</span>
          </button>

          <button
            type="button"
            onClick={() => setEarlyAccessOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0EA5E9] px-4 py-2 font-heading text-xs font-semibold text-white shadow-[0_8px_20px_-6px_rgba(14,165,233,0.55)] transition-all hover:bg-[#0284C7]"
          >
            <span>Request Access</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
