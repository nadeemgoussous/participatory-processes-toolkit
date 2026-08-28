// Toolkit core types
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners. Chapter 4.
//
// Text in the data files is quoted from the publication. Where the publication
// does not state something, the field does not exist.

/** Implementation stages, chapter 4. */
export type Phase = 'framing' | 'development' | 'validation' | 'communication';

export interface PhaseInfo {
  id: Phase;
  /**
   * Label as printed. Step 1 of the decision framework lists the four phases
   * by name only, so there is no short description field: the publication does
   * not provide one.
   */
  label: string;
  /** Definition from the Implementation stage dimension. */
  detail: string;
}

export const PHASES: PhaseInfo[] = [
  {
    id: 'framing',
    label: 'Policy framing',
    detail:
      'This stage initiates the process by defining policy questions and clear objectives, outlining methodologies, and assembling initial data as critical inputs to scenario design.',
  },
  {
    id: 'development',
    label: 'Scenario development',
    detail:
      'Methodologies are put into action, essential information is defined and collected, including assumptions and input data, and narratives and scenarios are created (sometimes through the use of modelling tools).',
  },
  {
    id: 'validation',
    label: 'Validation',
    detail:
      'After the formulation of energy scenarios and potential policies, the validation stage follows. This might be before publication or at the point of a draft publication. Stakeholder inputs are valuable for feedback at this stage.',
  },
  {
    id: 'communication',
    label: 'Communication',
    detail:
      'Outcomes derived from the scenario-building require effective communication. The communication stage involves sharing the results with stakeholders.',
  },
];

/**
 * A run of content from a section: a paragraph, a list, or a labelled list.
 * Sections mix all three, so they are stored in the order they appear.
 */
export interface ContentBlock {
  /** Paragraph text. */
  text?: string;
  /** Heading introducing a list, where the section uses one. */
  label?: string;
  /** List items. */
  items?: string[];
}

/** The three categories in the chapter 4 overview. */
export type ToolCategory = 'knowledge-gathering' | 'co-creation' | 'dissemination';

export interface ToolCategoryInfo {
  id: ToolCategory;
  /**
   * The publication names the three categories in Figure 4 and does not
   * describe them, so there is no description field.
   */
  label: string;
  toolkitSection: string;
}

export const TOOL_CATEGORIES: ToolCategoryInfo[] = [
  {
    id: 'knowledge-gathering',
    label: 'Knowledge gathering',
    toolkitSection: '4.1',
  },
  {
    id: 'co-creation',
    label: 'Co-creation',
    toolkitSection: '4.2',
  },
  {
    id: 'dissemination',
    label: 'Knowledge dissemination',
    toolkitSection: '4.3',
  },
];

/** The seven tools described in chapter 4. */
export type ToolId =
  | 'workshops'
  | 'surveys'
  | 'interviews'
  | 'committees'
  | 'networks-hubs'
  | 'presentations-reports'
  | 'visualisation-games';

/** A row from one of the chapter 4 boxes. */
export interface ToolVariant {
  name: string;
  /** Box 4 lists activities without describing them. */
  description?: string;
  /** Present only where the box has a "Best For" column (Box 3). */
  bestFor?: string;
}

/**
 * One engagement tool. The publication describes every tool against the same
 * dimensions: implementation stage, resource requirements, prerequisites and
 * practical considerations.
 */
export interface EngagementTool {
  id: ToolId;
  /** Section heading. */
  name: string;
  category: ToolCategory;
  toolkitSection: string;

  /** Opening prose of the section, by sentence. */
  summary: string[];

  /** Application per stage, from the Implementation Stage table. */
  stageApplications: Partial<Record<Phase, string>>;

  /**
   * Resource requirements and prerequisites. The publication runs these
   * together in one section of prose, so they are one list.
   */
  requirements: string[];

  strengths: string[];
  challenges: string[];
  limitations: string[];

  /** Implementation evidence. */
  evidence: string[];
  /** Ids of case studies in chapter 5 named in the two sections above. */
  caseStudyIds: string[];

  /** Box content, where the section has one. */
  boxLabel?: string;
  box?: ToolVariant[];
}

/**
 * Step 4 of the Tool Selection Decision Framework: the objective to tool
 * mapping.
 */
export interface Objective {
  id: string;
  /** "If Your Objective Is..." column. */
  label: string;
  /** "Consider..." column, as written. */
  consider: string;
  /** Tools in this app that the Consider column names. */
  tools: ToolId[];
}
