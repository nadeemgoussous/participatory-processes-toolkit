// Checklist items
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Items are built from the text already held in engagement-tools.ts and
// stakeholder-profiles.ts, plus the six steps of the Tool Selection Decision
// Framework. Building them rather than restating them keeps the checklist and
// the reference sections on the same wording.

import { engagementTools } from './engagement-tools';
import { stakeholderProfiles } from './stakeholder-profiles';
import type { ChecklistItem } from '../types/checklist';
import type { Phase, ToolId } from '../types/toolkit';
import type { StakeholderId } from '../types/stakeholder';

const ALL_PHASES: Phase[] = ['framing', 'development', 'validation', 'communication'];

/** Chapter 4, Tool Selection Decision Framework. */
const frameworkItems: ChecklistItem[] = [
  {
    id: 'framework-1',
    group: 'framework',
    text: 'Define your planning objective and phase',
    source: '4 Tool Selection Decision Framework, Step 1',
    phases: ALL_PHASES,
  },
  {
    id: 'framework-2',
    group: 'framework',
    text: 'For each planning phase, identify which stakeholder groups are most critical.',
    source: '4 Tool Selection Decision Framework, Step 2',
    phases: ALL_PHASES,
  },
  {
    id: 'framework-3',
    group: 'framework',
    text: 'Evaluate the resources you can commit to participatory tools and activities.',
    source: '4 Tool Selection Decision Framework, Step 3',
    phases: ALL_PHASES,
  },
  {
    id: 'framework-4',
    group: 'framework',
    text: 'Select appropriate tools',
    source: '4 Tool Selection Decision Framework, Step 4',
    phases: ALL_PHASES,
  },
  {
    id: 'framework-5',
    group: 'framework',
    text: "Explore good practices and prerequisites identified in each tool's subsection.",
    source: '4 Tool Selection Decision Framework, Step 5',
    phases: ALL_PHASES,
  },
  {
    id: 'framework-6',
    group: 'framework',
    text: 'Develop and compare indicators to help measure the success of the choice to the planning process.',
    source: '4 Tool Selection Decision Framework, Step 6',
    phases: ALL_PHASES,
  },
];

/** Prerequisites and resource requirements, one item per bullet, per tool. */
const toolItems: ChecklistItem[] = engagementTools.flatMap((tool) => {
  const phases = ALL_PHASES.filter((p) => tool.stageApplications[p] !== undefined);

  const prerequisites = tool.prerequisites.map((text, i) => ({
    id: `${tool.id}-prereq-${i + 1}`,
    group: 'tools' as const,
    text,
    source: `${tool.toolkitSection} Prerequisites`,
    phases,
    toolId: tool.id as ToolId,
    caseStudyIds: tool.caseStudyIds,
  }));

  const requirements = tool.requirements.map((text, i) => ({
    id: `${tool.id}-req-${i + 1}`,
    group: 'resources' as const,
    text,
    source: `${tool.toolkitSection} Resource Requirements`,
    phases,
    toolId: tool.id as ToolId,
    caseStudyIds: tool.caseStudyIds,
  }));

  return [...prerequisites, ...requirements];
});

/** Good practices from the chapter 3 stakeholder sections. */
const stakeholderItems: ChecklistItem[] = stakeholderProfiles.flatMap((profile) =>
  profile.goodPractices.map((text, i) => ({
    id: `${profile.id}-practice-${i + 1}`,
    group: 'stakeholders' as const,
    text,
    source: `3 ${profile.name}, Good Practices`,
    phases: ALL_PHASES,
    stakeholderId: profile.id as StakeholderId,
  }))
);

export const checklistItems: ChecklistItem[] = [
  ...frameworkItems,
  ...stakeholderItems,
  ...toolItems,
];

/**
 * Items relevant to one plan. Framework items always apply. Tool and
 * stakeholder items appear once the plan includes that tool or stakeholder,
 * and are filtered to the selected phases.
 */
export function selectItems(setup: {
  phases: Phase[];
  stakeholders: StakeholderId[];
  tools: ToolId[];
}): ChecklistItem[] {
  const inPhase = (item: ChecklistItem) =>
    setup.phases.length === 0 || item.phases.some((p) => setup.phases.includes(p));

  return checklistItems.filter((item) => {
    if (item.toolId) return setup.tools.includes(item.toolId) && inPhase(item);
    if (item.stakeholderId) return setup.stakeholders.includes(item.stakeholderId);
    return true;
  });
}
