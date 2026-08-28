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
  /** Heading used in the Tool Description Dimensions section. */
  label: string;
  /** Description from the Step 1 table. */
  description: string;
  /** Definition from the Implementation Stage section. */
  detail: string;
}

export const PHASES: PhaseInfo[] = [
  {
    id: 'framing',
    label: 'Policy framing',
    description: 'Co-define policy questions and targets',
    detail:
      'Defining policy questions and clear objectives, outlining methodologies, assembling initial data',
  },
  {
    id: 'development',
    label: 'Scenario development',
    description: 'Create narratives, gather data, develop scenarios',
    detail:
      'Putting methodologies into action, collecting information including assumptions and input data, creating narratives and scenarios',
  },
  {
    id: 'validation',
    label: 'Validation',
    description: 'Present results and gather feedback for iteration',
    detail: 'After scenario formulation, stakeholder inputs for feedback',
  },
  {
    id: 'communication',
    label: 'Communication',
    description: 'Share final results with stakeholders',
    detail: 'Sharing the results with stakeholders',
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
  label: string;
  description: string;
  toolkitSection: string;
}

export const TOOL_CATEGORIES: ToolCategoryInfo[] = [
  {
    id: 'knowledge-gathering',
    label: 'Knowledge gathering',
    description:
      'Tools and activities primarily designed to collect insights, perspectives and information from stakeholders. These approaches enable planners to access diverse knowledge and viewpoints that enhance the quality and relevance of energy scenarios.',
    toolkitSection: '4.1',
  },
  {
    id: 'co-creation',
    label: 'Co-creation',
    description:
      'Tools and activities that enable stakeholders to actively participate in shaping the planning process and its outcomes. These approaches establish collaborative environments where stakeholders work alongside planners to develop scenarios, explore trade-offs and build consensus.',
    toolkitSection: '4.2',
  },
  {
    id: 'dissemination',
    label: 'Knowledge dissemination',
    description:
      'Tools and activities that focus on communicating energy planning concepts, scenarios and implications to various audiences. These approaches transform complex technical information into accessible formats tailored to different stakeholder needs.',
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
