import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CustomItem, CustomStakeholder, ItemState, PlanSetup, PlanState } from '../types/checklist';
import { loadPlan, savePlan } from '../utils/plan-storage';

interface PlanContextValue {
  plan: PlanState;
  setMeta: (meta: { name?: string; country?: string }) => void;
  setSetup: (setup: Partial<PlanSetup>) => void;
  setItem: (id: string, patch: Partial<ItemState>) => void;
  replacePlan: (plan: PlanState) => void;
  addStakeholder: (s: Omit<CustomStakeholder, 'id'>) => void;
  removeStakeholder: (id: string) => void;
  addItem: (i: Omit<CustomItem, 'id'>) => void;
  removeItem: (id: string) => void;
}

// crypto.randomUUID needs a secure context, which a page opened from file://
// is not guaranteed to be; the offline build runs from there.
const newId = () => `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanState>(() => loadPlan());

  // Persist on change. Writes are cheap and infrequent, so there is no debounce.
  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  const setMeta = useCallback((meta: { name?: string; country?: string }) => {
    setPlan((p) => ({ ...p, ...meta }));
  }, []);

  const setSetup = useCallback((setup: Partial<PlanSetup>) => {
    setPlan((p) => ({ ...p, setup: { ...p.setup, ...setup } }));
  }, []);

  const setItem = useCallback((id: string, patch: Partial<ItemState>) => {
    setPlan((p) => {
      const current: ItemState = p.items[id] ?? { done: false, note: '', updatedAt: '' };
      return {
        ...p,
        items: {
          ...p.items,
          [id]: { ...current, ...patch, updatedAt: new Date().toISOString() },
        },
      };
    });
  }, []);

  const replacePlan = useCallback((next: PlanState) => setPlan(next), []);

  const addStakeholder = useCallback((s: Omit<CustomStakeholder, 'id'>) => {
    setPlan((p) => ({
      ...p,
      additions: { ...p.additions, stakeholders: [...p.additions.stakeholders, { ...s, id: newId() }] },
    }));
  }, []);

  // Items linked to a removed group are kept and unlinked: the planner wrote
  // them, and losing them silently would be worse than an orphan.
  const removeStakeholder = useCallback((id: string) => {
    setPlan((p) => ({
      ...p,
      additions: {
        stakeholders: p.additions.stakeholders.filter((s) => s.id !== id),
        items: p.additions.items.map((i) =>
          i.stakeholderId === id ? { id: i.id, text: i.text, phases: i.phases } : i
        ),
      },
    }));
  }, []);

  const addItem = useCallback((i: Omit<CustomItem, 'id'>) => {
    setPlan((p) => ({
      ...p,
      additions: { ...p.additions, items: [...p.additions.items, { ...i, id: newId() }] },
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setPlan((p) => {
      const items = { ...p.items };
      delete items[id];
      return {
        ...p,
        items,
        additions: { ...p.additions, items: p.additions.items.filter((i) => i.id !== id) },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      plan,
      setMeta,
      setSetup,
      setItem,
      replacePlan,
      addStakeholder,
      removeStakeholder,
      addItem,
      removeItem,
    }),
    [plan, setMeta, setSetup, setItem, replacePlan, addStakeholder, removeStakeholder, addItem, removeItem]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within a PlanProvider');
  return ctx;
}
