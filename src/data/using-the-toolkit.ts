// Guidance on using the toolkit: chapter 1.3 and chapter 6
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// This is operational material rather than reference material, so it sits on
// the plan page next to the checklist.

import type { ContentBlock } from '../types/toolkit';
import type { ReferenceTable } from '../types/reference';

export interface GuidanceStep {
  id: string;
  heading: string;
  blocks: ContentBlock[];
}

/** Chapter 1.3, Using the Toolkit: A Three-Step Guide. */
export const threeStepGuide: GuidanceStep[] = [
  {
    id: 'identify',
    heading: 'Step 1: Identify Approaches That Match Your Planning Context',
    blocks: [
      {
        items: [
          'Review the case studies in Chapter 5 to find examples from countries with similar challenges or objectives',
          'Use the stakeholder mapping guidance in Chapter 3 to identify which stakeholder groups are most critical for your planning process and stage',
          'Consider your objectives, available resources and institutional capacity when selecting tools from Chapter 4',
        ],
      },
    ],
  },
  {
    id: 'design',
    heading: 'Step 2: Design Your Participation Strategy',
    blocks: [
      {
        items: [
          'Begin with the framework in Chapter 2 to understand which benefits of stakeholder participation align with your planning objectives',
          'Use the stakeholder analysis in Chapter 3 to develop targeted engagement approaches',
          'Select appropriate tools from Chapter 4 based on your planning stage and specific needs',
        ],
      },
    ],
  },
  {
    id: 'implement',
    heading: 'Step 3: Implement Effectively',
    blocks: [
      {
        items: [
          'Draw on the practical lessons from case studies in Chapter 5 to anticipate challenges',
          'Adapt the approaches to your institutional context and available resources',
          'Utilise the additional resources in Chapter 7 for detailed implementation guidance',
        ],
      },
    ],
  },
];

export const threeStepIntro: ContentBlock[] = [
  {
    text: 'The toolkit was developed in a modular fashion so that different chapters can be used individually for the different elements of a participatory energy planning strategy.',
  },
];

/** Chapter 6, Using This Toolkit. */
export const usingTheToolkit: GuidanceStep[] = [
  {
    id: 'case-studies',
    heading: 'Identifying Relevant Case Studies',
    blocks: [
      {
        text: 'Planners can examine the detailed examples provided, selecting those that align with their specific objectives and contexts:',
        items: [
          "Improving public engagement: Draw inspiration from Brazil's use of virtual debates and online workshops",
          "Concise policy communication: Benefit from Cyprus's approach to creating clear and effective policy briefs",
        ],
      },
    ],
  },
  {
    id: 'feasibility',
    heading: 'Evaluating Feasibility',
    blocks: [
      {
        text: 'By reviewing the activities and tools showcased in the case studies, planners can evaluate the feasibility of different participatory methods within the constraints of their resources and institutional capabilities.',
      },
      {
        text: 'Example: A country with limited financial resources might prioritise online consultations over more resource-intensive in-person workshops, ensuring practical and efficient implementation.',
      },
    ],
  },
  {
    id: 'best-practices',
    heading: 'Identifying Best Practices',
    blocks: [
      {
        text: 'By analysing successful examples, planners can:',
        items: [
          'Identify best practices for working with specific stakeholder groups',
          'Select tools that align with their desired outcomes',
        ],
      },
    ],
  },
  {
    id: 'anticipating',
    heading: 'Anticipating Challenges',
    blocks: [
      {
        text: 'The toolkit highlights lessons from other countries, enabling planners to anticipate and avoid potential challenges.',
      },
    ],
  },
  {
    id: 'application',
    heading: 'Practical Application',
    blocks: [
      {
        text: 'By leveraging the toolkit as a guide and reference, national energy planners can integrate effective participatory processes into their energy planning. Drawing on real-world examples and tailoring these insights to their unique circumstances, planners can foster a more inclusive, transparent and successful energy planning process.',
      },
    ],
  },
];

/**
 * Chapter 6, Current Challenges. These are the counterweight to a checklist:
 * the publication names box-ticking as a way participation fails.
 */
export const currentChallenges: ReferenceTable = {
  columns: ['Challenge', 'Description'],
  rows: [
    [
      'Feedback mechanisms',
      'Experts highlighted the dearth of existing mechanisms to inform stakeholders about how their participation influenced planning results and project outcomes. A more reciprocal communication style could be key to ensuring stakeholders maintain their interest.',
    ],
    [
      '"Box-ticking" exercises',
      'In some instances, stakeholder engagement could be considered a "box-ticking" exercise, nullifying its alleged purposes and decreasing confidence among stakeholders.',
    ],
    [
      'Inherent biases',
      "Concerns exist regarding the project team's inherent biases affecting inputs and how they are represented within modelling exercises.",
    ],
    [
      'Scaling innovative methodologies',
      'Challenges remain in translating innovative methodologies of public participation within comprehensive national-level planning, where constraints such as resources and/or political will may exist.',
    ],
    [
      'Evaluating outcomes',
      'Challenges exist in evaluating participatory process outcomes, measuring key performance indicators (KPIs), and evaluating benefits of implementing a participatory process versus not conducting one.',
    ],
  ],
};

export const challengesIntro =
  'Such challenges can be worth examining at the project design level, in relation to the project’s purported objectives:';

/** Chapter 6, Questions for Project Design. */
export const projectDesignQuestions: string[] = [
  'Can the challenges be overcome simply by improving the participatory strategy and using the correct tools?',
  'Or are novel methods and frameworks needed?',
];
