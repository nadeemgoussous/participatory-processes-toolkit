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
  /** A table the section presents, where it has one. */
  table?: ReferenceTable;
}

/** One of the four objectives in section 2.4. */
export interface ParticipationObjective {
  id: string;
  /** Heading, for example "Objective 1: Building Consensus, Trust and Stakeholder Ownership". */
  heading: string;
  blocks: ContentBlock[];
  table?: ReferenceTable;
  /** The Objective column of the Summary: Benefits of Participatory Processes table. */
  summaryObjective: string;
  /** The Key Benefit column of that table. */
  summaryBenefit: string;
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
  /** A numbered list the entry presents, where it has one. */
  points?: string[];
  links: { label?: string; url: string }[];
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
  /**
   * The 7.2 heading this group sits under, where it has one: Survey Platforms,
   * Co-Creation Platforms or Data Visualisation.
   */
  parent?: string;
  /** The line introducing the group, where it has one. */
  intro?: string;
  /** Set when the group is presented as a table with descriptions and links. */
  detailed?: boolean;
  entries: ResourceEntry[];
}

/** A framework in 7.2. */
export interface Framework {
  id: string;
  name: string;
  source: string;
  description: string;
  /** The numbered dimensions the framework assesses. */
  dimensions: string[];
  /** The closing note on how the framework is used. */
  note: string;
  url: string;
}
