import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ItemState, PlanAdditions, PlanSetup, PlanState } from '../types/checklist';
import { loadPlan, savePlan } from '../utils/plan-storage';

interface PlanContextValue {
  plan: PlanState;
  setMeta: (meta: { name?: string; country?: string }) => void;
  setSetup: (setup: Partial<PlanSetup>) => void;
  setItem: (id: string, patch: Partial<ItemState>) => void;
  replacePlan: (plan: PlanState) => void;
  addAddition: <K extends AdditionKind>(kind: K, value: Omit<PlanAdditions[K][number], 'id'>) => void;
  removeAddition: (kind: AdditionKind, id: string) => void;
}

export type AdditionKind = keyof PlanAdditions;

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

  const addAddition = useCallback(
    <K extends AdditionKind>(kind: K, value: Omit<PlanAdditions[K][number], 'id'>) => {
      setPlan((p) => ({
        ...p,
        additions: { ...p.additions, [kind]: [...p.additions[kind], { ...value, id: newId() }] },
      }));
    },
    []
  );

  // Items linked to a removed group or tool are kept and unlinked: the planner
  // wrote them, and losing them silently would be worse than an orphan.
  const removeAddition = useCallback((kind: AdditionKind, id: string) => {
    setPlan((p) => {
      const additions = {
        ...p.additions,
        [kind]: (p.additions[kind] as { id: string }[]).filter((x) => x.id !== id),
      } as PlanAdditions;
      if (kind === 'stakeholders' || kind === 'tools') {
        const link = kind === 'stakeholders' ? 'stakeholderId' : 'toolId';
        additions.items = additions.items.map((i) => {
          if (i[link] !== id) return i;
          const rest = { ...i };
          delete rest[link];
          return rest;
        });
      }
      const items = { ...p.items };
      if (kind === 'items') delete items[id];
      return { ...p, items, additions };
    });
  }, []);

  const value = useMemo(
    () => ({
      plan,
      setMeta,
      setSetup,
      setItem,
      replacePlan,
      addAddition,
      removeAddition,
    }),
    [plan, setMeta, setSetup, setItem, replacePlan, addAddition, removeAddition]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within a PlanProvider');
  return ctx;
}
