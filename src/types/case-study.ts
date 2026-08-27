// Case studies, chapter 5
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Chapter 5 gives each case study the same components: an executive summary
// (governance, scope, objectives), engagement activities, key outcomes,
// resources, a highlight and lessons learnt. The Summary Table of Case Studies
// adds five further columns, held in `summary`.

import type { ContentBlock, ToolId } from './toolkit';
import type { StakeholderId } from './stakeholder';

/** Grouping used for filtering. Not a classification the publication makes. */
export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Global';

/** Row from the Summary Table of Case Studies. */
export interface CaseStudySummary {
  planningContext: string;
  primaryObjectives: string;
  keyStakeholders: string;
  methodsUsed: string;
  transferableElements: string;
}

export interface CaseStudy {
  id: string;
  /** Section heading, for example "Belgium". */
  name: string;
  /** Sub-heading, for example "Scenarios as a Communication Tool: Youth Engagement via My2050". */
  title: string;
  toolkitSection: string;

  /** Opening paragraphs of the section. */
  intro: string[];

  overview: {
    governance: string;
    scope: string;
    objectives: string;
  };

  engagementActivities: ContentBlock[];
  keyOutcomes: ContentBlock[];
  resources: string[];

  highlight: string;
  lessonsLearnt: string[];

  summary: CaseStudySummary;

  /**
   * Filtering metadata, derived from the Key Stakeholders and Methods Used
   * columns of the summary table. Not displayed as publication text.
   */
  region: Region;
  stakeholderIds: StakeholderId[];
  toolIds: ToolId[];
}
