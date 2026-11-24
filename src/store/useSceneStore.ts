import { create } from 'zustand';
import {
  INITIAL_ATTENTION_ITEMS,
  INITIAL_LIFECYCLE_EVENTS,
  type EcosystemNodeId,
  type LifecycleEvent,
  type ProcessPillarId,
} from '@/data/identityProcessData';

export type AppPage = 'landing' | 'demo';

interface SceneStore {
  currentPage: AppPage;
  activeEcosystemNode: EcosystemNodeId;
  activePillarId: ProcessPillarId;
  resolvedActionIds: string[];
  lifecycleEvents: LifecycleEvent[];
  joinerCount: number;
  moverCount: number;
  leaverCount: number;
  pulseCounter: number;
  earlyAccessOpen: boolean;

  setCurrentPage: (page: AppPage) => void;
  setActiveEcosystemNode: (node: EcosystemNodeId) => void;
  setActivePillarId: (pillar: ProcessPillarId) => void;
  resolveAttentionItem: (id: string) => void;
  resolveAllAttentionItems: () => void;
  resetDashboardDemo: () => void;
  simulateLifecycleEvent: (kind: LifecycleEvent['kind']) => void;
  triggerPulse: () => void;
  setEarlyAccessOpen: (open: boolean) => void;
}

const SAMPLE_EVENTS: Record<LifecycleEvent['kind'], { text: string; department: string }[]> = {
  Joiner: [
    { text: 'New user onboarded: Priya Patel', department: 'Engineering' },
    { text: 'New user onboarded: Lucas Meyer', department: 'Product' },
  ],
  Mover: [
    { text: 'Role updated for Claire Brooks', department: 'Treasury' },
    { text: 'Transfer synced for Daniel Kim', department: 'Security' },
  ],
  Leaver: [
    { text: 'User deactivated: Alex Rivera', department: 'Contractor' },
    { text: 'Access revoked: Hannah Cole', department: 'Operations' },
  ],
};

function currentHHMM(): string {
  return new Date().toTimeString().slice(0, 5);
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  currentPage:
    typeof window !== 'undefined' && window.location.hash === '#demo'
      ? 'demo'
      : 'landing',
  activeEcosystemNode: 'core',
  activePillarId: 'lifecycle',
  resolvedActionIds: [],
  lifecycleEvents: INITIAL_LIFECYCLE_EVENTS,
  joinerCount: 18,
  moverCount: 42,
  leaverCount: 9,
  pulseCounter: 0,
  earlyAccessOpen: false,

  setCurrentPage: (page) => {
    if (typeof window !== 'undefined') {
      const targetHash = page === 'demo' ? '#demo' : '#top';
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', page === 'demo' ? '#demo' : window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    set({ currentPage: page });
  },

  setActiveEcosystemNode: (node) =>
    set((s) => ({
      activeEcosystemNode: node,
      pulseCounter: s.pulseCounter + 1,
    })),

  setActivePillarId: (pillar) =>
    set((s) => ({
      activePillarId: pillar,
      pulseCounter: s.pulseCounter + 1,
    })),

  resolveAttentionItem: (id) => {
    const state = get();
    if (state.resolvedActionIds.includes(id)) return;
    set({
      resolvedActionIds: [...state.resolvedActionIds, id],
      pulseCounter: state.pulseCounter + 1,
    });
  },

  resolveAllAttentionItems: () =>
    set((s) => ({
      resolvedActionIds: INITIAL_ATTENTION_ITEMS.map((item) => item.id),
      pulseCounter: s.pulseCounter + 1,
    })),

  resetDashboardDemo: () =>
    set((s) => ({
      resolvedActionIds: [],
      lifecycleEvents: INITIAL_LIFECYCLE_EVENTS,
      joinerCount: 18,
      moverCount: 42,
      leaverCount: 9,
      pulseCounter: s.pulseCounter + 1,
    })),

  simulateLifecycleEvent: (kind) => {
    const pool = SAMPLE_EVENTS[kind];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const newEvent: LifecycleEvent = {
      id: `ev-${Date.now()}`,
      time: currentHHMM(),
      kind,
      text: pick.text,
      department: pick.department,
    };

    set((s) => ({
      lifecycleEvents: [newEvent, ...s.lifecycleEvents].slice(0, 4),
      joinerCount: kind === 'Joiner' ? s.joinerCount + 1 : s.joinerCount,
      moverCount: kind === 'Mover' ? s.moverCount + 1 : s.moverCount,
      leaverCount: kind === 'Leaver' ? s.leaverCount + 1 : s.leaverCount,
      activePillarId: 'lifecycle',
      pulseCounter: s.pulseCounter + 1,
    }));
  },

  triggerPulse: () => set((s) => ({ pulseCounter: s.pulseCounter + 1 })),
  setEarlyAccessOpen: (open) => set({ earlyAccessOpen: open }),
}));
