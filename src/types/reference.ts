// Reference material: chapters 2 and 7
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.

import type { ContentBlock } from './toolkit';

// --------------------------------------------------------------- chapter 2

/** A numbered section of chapter 2. */
export interface RationaleSection {
  id: string;
  /** Section heading. */
  heading: string;
  /** Section number, for example "2.1". */
  toolkitSection: string;
  blocks: ContentBlock[];
}

/** One of the four objectives in section 2.4. */
export interface ParticipationObjective {
  id: string;
  /** The number the publication gives it in 2.4. */
  number: number;
  heading: string;
  blocks: ContentBlock[];
}

export interface ReferenceTable {
  caption?: string;
  columns: string[];
  rows: string[][];
}

// --------------------------------------------------------------- chapter 7

/** An entry in 7.1 Publications. */
export interface Publication {
  id: string;
  title: string;
  /** The Author or Authors line. */
  author: string;
  description: string;
  links: { url: string }[];
}

/** A named tool or platform in 7.2. */
export interface ResourceEntry {
  name: string;
  description?: string;
  url?: string;
}

/** A group of entries in 7.2, such as Repositories or Online Surveys. */
export interface ResourceGroup {
  id: string;
  label: string;
  /** Set when the group is presented as a table with descriptions and links. */
  detailed?: boolean;
  entries: ResourceEntry[];
}

/** A framework in 7.2. */
export interface Framework {
  id: string;
  name: string;
  description: string;
  url?: string;
}
