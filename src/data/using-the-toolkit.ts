// Guidance on using the toolkit: sections 1.3 and 6
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Chapter 6 is continuous prose. The markdown transcription split it under five
// sub-headings it does not have and turned its challenges into a table, so the
// text here is taken from the publication and kept as sentences.

import type { ContentBlock } from '../types/toolkit';

export interface GuidanceStep {
  id: string;
  heading: string;
  blocks: ContentBlock[];
}

export const threeStepIntro: ContentBlock[] = [
  {
    text: 'This toolkit was developed in a modular fashion so that different chapters can be used individually for the different elements of a participatory energy planning strategy.',
  },
  { text: 'Planners can use the toolkit in the following way:' },
];

/** Section 1.3, the three ways in that the publication numbers. */
export const threeStepGuide: GuidanceStep[] = [
  {
    id: 'identify',
    heading: 'Identify approaches that match your planning context',
    blocks: [
      {
        items: [
          'Review the case studies in Chapter 5 to find examples from countries with similar challenges or objectives.',
          'Use the stakeholder mapping guidance in Chapter 3 to identify and determine which stakeholder groups are most critical for your planning process and stage.',
          'Consider your objectives, available resources and institutional capacity when selecting tools from Chapter 4.',
        ],
      },
    ],
  },
  {
    id: 'design',
    heading: 'Design your participation strategy',
    blocks: [
      {
        items: [
          'Begin with the framework in Chapter 2 to understand which benefits of stakeholder participation align with your planning objectives.',
          'Use the stakeholder analysis in Chapter 3 to develop targeted engagement approaches.',
          'Select appropriate tools from Chapter 4 based on your planning stage and specific needs.',
        ],
      },
    ],
  },
  {
    id: 'implement',
    heading: 'Implement effectively',
    blocks: [
      {
        items: [
          'Draw on the practical lessons from case studies in Chapter 5 to anticipate challenges.',
          'Adapt the approaches to your institutional context and available resources.',
          'Utilise the additional resources in Chapter 7 for detailed implementation guidance.',
        ],
      },
    ],
  },
];

/** Chapter 6, on how the toolkit is meant to be used. */
export const usingTheToolkit: string[] = [
  'This toolkit, designed for scenario planners in government planning institutions, but relevant also for other actors involved in scenario building and energy system modelling, provides a versatile resource for planners to enhance their energy scenario development processes.',
  'It offers a range of tools, case studies, and insights that can be applied in several practical ways.',
  'One key use of the toolkit is identifying relevant case studies.',
  'Planners can examine the detailed examples provided, selecting those that align with their specific objectives and contexts.',
  "For instance, a country aiming to improve public engagement might draw inspiration from Brazil's use of virtual debates and online workshops.",
  "Similarly, another focusing on concise policy communication could benefit from Cyprus's approach to creating clear and effective policy briefs.",
  'By reviewing the activities and tools showcased in the case studies, planners can evaluate the feasibility of the different participatory methods within the constraints of their resources and institutional capabilities.',
  'For example, a country with limited financial resources might prioritise online consultations over more resource-intensive in-person workshops, ensuring practical and efficient implementation.',
  'By analysing successful examples, planners can also identify best practices for working with specific stakeholder groups and select tools that align with their desired outcomes.',
  'The toolkit also highlights lessons from other countries, enabling planners to anticipate and avoid potential challenges.',
  'By leveraging the toolkit as a guide and reference, national energy planners can integrate effective participatory processes into their energy planning.',
  'Drawing on real-world examples and tailoring these insights to their unique circumstances, planners can foster a more inclusive, transparent and successful energy planning process.',
];

/**
 * Chapter 6, on what remains unsolved. These are the counterweight to a
 * checklist: the publication names box-ticking as a way participation fails.
 */
export const currentChallenges: string[] = [
  'However, overarching challenges and gaps remain that warrant further research and implementation.',
  'For example, during our activities, experts highlighted the dearth of existing mechanisms to inform stakeholders about how their participation influenced planning results and project outcomes.',
  'A more reciprocal communication style could be key to ensuring stakeholders maintain their interest in participating in such activities.',
  'Other experts also highlighted that in some instances, stakeholder engagement could be considered a "box-ticking" exercise, nullifying its alleged purposes and decreasing confidence among stakeholders.',
  "Some experts also shared concerns regarding the project team's inherent biases affecting inputs and the way they are represented within modelling exercises.",
  'Challenges also remain in translating some innovative methodologies of public participation within a comprehensive national-level planning process, where constraints such as resources and/or political will may exist, limiting the potential of stakeholder engagement in national scenarios.',
  'Others highlighted the challenge of evaluating the participatory process outcomes, measuring key performance indicators (KPIs), and evaluating the benefits of implementing a participatory process versus not conducting one.',
];

export const challengesIntro =
  "Such challenges can be worth examining at the project design level, in relation to the project's purported objectives.";

export const projectDesignQuestions: string[] = [
  'Can the challenges be overcome simply by improving the participatory strategy and using the correct tools?',
  'Or are novel methods and frameworks needed?',
];
