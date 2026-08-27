import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ItemState, PlanSetup, PlanState } from '../types/checklist';
import { loadPlan, savePlan } from '../utils/plan-storage';

interface PlanContextValue {
  plan: PlanState;
  setMeta: (meta: { name?: string; country?: string }) => void;
  setSetup: (setup: Partial<PlanSetup>) => void;
  setItem: (id: string, patch: Partial<ItemState>) => void;
  replacePlan: (plan: PlanState) => void;
}

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

  const value = useMemo(
    () => ({ plan, setMeta, setSetup, setItem, replacePlan }),
    [plan, setMeta, setSetup, setItem, replacePlan]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within a PlanProvider');
  return ctx;
}
