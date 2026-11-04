// Participatory process checklist
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Item text is taken from the publication. Each item records the section it
// comes from.

import type { Phase, ToolId } from './toolkit';
import type { StakeholderId } from './stakeholder';

export type ChecklistGroup =
  | 'framework'
  | 'stakeholders'
  | 'tools'
  | 'resources'
  | 'evaluation';

export const CHECKLIST_GROUPS: { id: ChecklistGroup; label: string }[] = [
  { id: 'framework', label: 'Tool selection' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'tools', label: 'Prerequisites' },
  { id: 'resources', label: 'Resource requirements' },
  { id: 'evaluation', label: 'Evaluation' },
];

export interface ChecklistItem {
  id: string;
  group: ChecklistGroup;

  /** Text as it appears in the publication. */
  text: string;
  /** Section reference, for example "4.1.1 Prerequisites". */
  source: string;

  /** Phases the item applies to. Empty means all phases. */
  phases: Phase[];

  /** Set when the item comes from a specific tool or stakeholder section. */
  toolId?: ToolId;
  stakeholderId?: StakeholderId;

  /** Case studies named in the same section. */
  caseStudyIds?: string[];
}

export interface ItemState {
  done: boolean;
  note: string;
  updatedAt: string;
}

/** Answers to steps 1 to 4 of the Tool Selection Decision Framework. */
export interface PlanSetup {
  phases: Phase[];
  stakeholders: StakeholderId[];
  objectiveId?: string;
  tools: ToolId[];
}

/**
 * A stakeholder group entered by the planner. Not publication content: always
 * rendered with the additions marker, never mixed into chapter 3 lists.
 */
export interface CustomStakeholder {
  id: string;
  name: string;
  description: string;
}

/** A checklist item entered by the planner. Rendered like CustomStakeholder. */
export interface CustomItem {
  id: string;
  text: string;
  /** Empty means all phases. */
  phases: Phase[];
  /** A chapter 3 group or a CustomStakeholder id. */
  stakeholderId?: string;
}

export interface PlanAdditions {
  stakeholders: CustomStakeholder[];
  items: CustomItem[];
}

export interface PlanState {
  version: 1;
  name: string;
  country: string;
  setup: PlanSetup;
  /** Ticks and notes, for publication items and custom items alike. */
  items: Record<string, ItemState>;
  additions: PlanAdditions;
  createdAt: string;
  updatedAt: string;
}

export function emptyPlan(): PlanState {
  const now = new Date().toISOString();
  return {
    version: 1,
    name: '',
    country: '',
    setup: { phases: [], stakeholders: [], tools: [] },
    items: {},
    additions: { stakeholders: [], items: [] },
    createdAt: now,
    updatedAt: now,
  };
}
