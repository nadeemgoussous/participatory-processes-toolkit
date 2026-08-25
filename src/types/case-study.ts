// Case Study Schema
// Based on IRENA Participatory Processes Toolkit Chapter 5

/**
 * Engagement methods used in case studies
 * Maps to toolkit dissemination and knowledge gathering approaches
 */
export type EngagementMethod =
  | 'interactive-calculator'    // Belgium, Kenya
  | 'policy-brief'              // Cyprus
  | 'workshop'                  // Finland, Chile, Ghana, Colombia
  | 'public-hearing'            // Chile, Panama
  | 'survey'                    // Finland
  | 'virtual-debate'            // Brazil
  | 'consultation-registry'     // Chile
  | 'focal-points'              // Colombia
  | 'modelling-hub'             // Canada
  | 'task-force'                // UAE
  | 'visualisation-tool'        // Cyprus, Kenya
  | 'board-game'                // Mentioned in toolkit
  | 'sector-roadmap'            // Finland
  | 'white-paper';              // Panama, Brazil

/**
 * Geographic regions for filtering
 */
export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Global';

/**
 * Budget categories for resource planning
 */
export type BudgetLevel = 'low' | 'medium' | 'high' | 'not-specified';

/**
 * Complete case study from toolkit Chapter 5
 */
export interface CaseStudy {
  id: string;
  country: string;
  flagEmoji: string;
  title: string;                  // Short title (e.g., "My2050 Youth Engagement")
  subtitle?: string;              // Longer context (e.g., "Scenarios as a Communication Tool")

  // Executive Summary Elements
  governance: string;             // Who coordinated the process
  scope: string;                  // Geographic and sector scope
  objectives: string;             // Purpose of the participatory process

  // Stakeholders and Methods
  stakeholdersEngaged: string[];  // Maps to our 9 stakeholder IDs
  engagementMethods: EngagementMethod[];

  // Outcomes and Resources
  keyOutcomes: string[];
  resources: {
    budget?: string;              // e.g., "USD 284,736", "CAD 5 million"
    budgetLevel: BudgetLevel;     // For filtering
    staff?: string;               // e.g., "6 permanent staff"
    timeline?: string;            // e.g., "2017-2023"
    participants?: string;        // e.g., "28,000 pupils"
  };

  // Learning Elements
  highlight: string;              // Main takeaway (1-2 sentences)
  lessonsLearnt: string[];        // Numbered lessons from toolkit
  transferableElements: string[]; // What can be applied elsewhere

  // Metadata for filtering
  region: Region;
  planningContext: string;        // e.g., "Net-zero transition", "Energy access"

  // Links to toolkit
  toolkitSection?: string;        // e.g., "5.1"
  toolkitChapter?: string;        // Always "chapter-5-case-studies.md"
}

/**
 * Mapping of stakeholder IDs to which case studies engaged them
 */
export const STAKEHOLDER_CASE_STUDY_MAP: Record<string, string[]> = {
  'policy-makers': ['belgium', 'brazil', 'canada', 'chile', 'colombia', 'cyprus', 'finland', 'ghana', 'panama', 'uae', 'kenya'],
  'grid-operators': ['uae', 'pac-consortium'],
  'industry': ['brazil', 'canada', 'finland', 'uae', 'world-energy-council'],
  'public': ['belgium', 'chile', 'panama', 'finland'],
  'csos-ngos': ['chile', 'ghana', 'panama', 'pac-consortium'],
  'scientific': ['brazil', 'canada', 'finland', 'kenya', 'world-energy-council'],
  'finance': ['brazil', 'cyprus', 'kenya'],
  'regional': ['pac-consortium', 'world-energy-council'],
  'development-partners': ['brazil', 'kenya'],
};

/**
 * Mapping of engagement methods to case studies that used them
 */
export const METHOD_CASE_STUDY_MAP: Record<EngagementMethod, string[]> = {
  'interactive-calculator': ['belgium', 'kenya'],
  'policy-brief': ['cyprus'],
  'workshop': ['brazil', 'canada', 'chile', 'colombia', 'finland', 'ghana', 'pac-consortium', 'world-energy-council'],
  'public-hearing': ['chile', 'panama'],
  'survey': ['finland'],
  'virtual-debate': ['brazil'],
  'consultation-registry': ['chile'],
  'focal-points': ['colombia'],
  'modelling-hub': ['canada'],
  'task-force': ['uae'],
  'visualisation-tool': ['cyprus', 'kenya'],
  'board-game': [], // Mentioned in toolkit but no specific case study
  'sector-roadmap': ['finland'],
  'white-paper': ['panama', 'brazil'],
};
