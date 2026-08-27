// Stakeholder profiles, chapter 3
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Chapter 3 gives each group the same five sections: Who Are They?, Why Engage
// Them?, What Is the Benefit for Them?, Challenges in Engaging and Good
// Practices. The shape below follows that.

/**
 * Ids for the seven groups in chapter 3.
 *
 * `regional-bodies` and `development-partners` are not chapter 3 groups. They
 * were added for this application and are referenced by the chapter 5 case
 * study data, so the id type still admits them.
 */
export type StakeholderId =
  | 'policy-makers'
  | 'grid-operators'
  | 'industry'
  | 'public'
  | 'csos-ngos'
  | 'scientific'
  | 'finance'
  | 'regional-bodies'
  | 'development-partners';

/** The seven groups described in chapter 3. */
export const TOOLKIT_STAKEHOLDER_IDS: StakeholderId[] = [
  'policy-makers',
  'grid-operators',
  'industry',
  'public',
  'csos-ngos',
  'scientific',
  'finance',
];

/**
 * A run of content from a chapter 3 section: a paragraph, a list, or a labelled
 * list. Sections mix all three, so they are stored in the order they appear.
 */
export interface ContentBlock {
  /** Paragraph text. */
  text?: string;
  /** Heading introducing a list, where the section uses one. */
  label?: string;
  /** Bullet list items. */
  items?: string[];
}

/** A row from a Challenges in Engaging table. */
export interface Challenge {
  challenge: string;
  description: string;
}

export interface StakeholderProfile {
  id: StakeholderId;
  /** Section heading. */
  name: string;
  /** Section number, for example "3.1". */
  toolkitSection: string;
  icon: string;
  color: string;

  whoAreThey: ContentBlock[];
  whyEngage: ContentBlock[];
  benefit: ContentBlock[];
  challenges: Challenge[];
  goodPractices: string[];

  /** Row from the Summary: Stakeholder Engagement Matrix. */
  summary: {
    primaryValue: string;
    keyChallenge: string;
    criticalGoodPractice: string;
  };
}
