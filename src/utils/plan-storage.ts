// Plan persistence
//
// The plan lives in localStorage. Reads and writes are wrapped because storage
// throws in private windows and when site data is blocked.

import type { CustomItem, CustomStakeholder, PlanAdditions, PlanState } from '../types/checklist';
import { emptyPlan } from '../types/checklist';
import { PHASES } from '../types/toolkit';
import type { Phase } from '../types/toolkit';

const KEY = 'irena-participatory-plan';

export function loadPlan(): PlanState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyPlan();
    const parsed = JSON.parse(raw) as PlanState;
    if (parsed.version !== 1) return emptyPlan();
    return withDefaults(parsed);
  } catch {
    return emptyPlan();
  }
}

/**
 * Plans saved before additions existed have no `additions` field, and an
 * imported file is whatever the user picked, so additions are rebuilt field by
 * field and anything malformed is dropped.
 */
function withDefaults(parsed: PlanState): PlanState {
  return { ...emptyPlan(), ...parsed, additions: normaliseAdditions(parsed.additions) };
}

function normaliseAdditions(raw: unknown): PlanAdditions {
  const obj = (raw ?? {}) as Partial<Record<keyof PlanAdditions, unknown>>;
  const list = (v: unknown): Record<string, unknown>[] =>
    Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object') : [];
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const phaseIds = PHASES.map((p) => p.id);

  const stakeholders: CustomStakeholder[] = list(obj.stakeholders)
    .filter((s) => str(s.id) && str(s.name).trim())
    .map((s) => ({ id: str(s.id), name: str(s.name), description: str(s.description) }));

  const items: CustomItem[] = list(obj.items)
    .filter((i) => str(i.id) && str(i.text).trim())
    .map((i) => ({
      id: str(i.id),
      text: str(i.text),
      phases: Array.isArray(i.phases)
        ? (i.phases.filter((p) => phaseIds.includes(p as Phase)) as Phase[])
        : [],
      ...(str(i.stakeholderId) ? { stakeholderId: str(i.stakeholderId) } : {}),
    }));

  return { stakeholders, items };
}

export function savePlan(plan: PlanState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...plan, updatedAt: new Date().toISOString() }));
  } catch {
    // Nothing to do: the plan stays in memory for this session.
  }
}

export function clearPlan(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignored, as above.
  }
}

/** File name for an exported plan, based on the plan name and today's date. */
function exportName(plan: PlanState): string {
  const slug =
    plan.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'participation-plan';
  return `${slug}-${new Date().toISOString().slice(0, 10)}.json`;
}

/** Downloads the plan as JSON. */
export function exportPlan(plan: PlanState): void {
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = exportName(plan);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoking synchronously can cancel the download before the browser has read
  // the blob. Release it on a later task instead.
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** Reads a plan from a file chosen by the user. Rejects anything else. */
export async function importPlan(file: File): Promise<PlanState> {
  const text = await file.text();
  const parsed = JSON.parse(text) as PlanState;
  if (parsed.version !== 1 || typeof parsed.items !== 'object' || parsed.items === null) {
    throw new Error('This file is not a participation plan.');
  }
  return withDefaults(parsed);
}
