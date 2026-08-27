// Why participatory processes matter, chapter 2
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.

import type { ContentBlock } from '../types/toolkit';
import type { ParticipationObjective, RationaleSection } from '../types/reference';

export const chapterIntro: ContentBlock[] = [
  {
    text: 'The clean energy transition requires a comprehensive change in policy making and the way investment is channelled. Long-term international and national targets need robust long-term planning that addresses short-, medium- and long-term policy needs, aligned with climate and development strategies, with stakeholders on board to support the smoother and more urgent implementation of measures to reach energy and climate targets.',
  },
  {
    label: 'This chapter introduces:',
    items: [
      'The concepts of long-term energy planning and scenario development',
      'A general definition of participatory processes in the context of energy planning',
      'The objectives and benefits of utilising participatory processes to achieve a faster and more equitable energy transition',
    ],
  },
];

export const rationaleSections: RationaleSection[] = [
  {
    id: 'scope',
    heading: 'Defining the scope of energy planning',
    toolkitSection: '2.1',
    blocks: [
      {
        text: 'Within the context of this report, long-term energy planning is defined as a process that involves the formulation of national or regional energy strategies and investments, guided by quantitative energy sector scenarios, often aided by energy system modelling.',
      },
      {
        text: 'Such approaches can be supported by qualitative scenario-building, and vice versa. This evidence-based process has proven vital for energy policy development globally, supporting investment decisions in the energy sector.',
      },
      {
        text: 'The process, especially when institutionalised and supported with strong governance, involves:',
        items: ['Analytical rigour', 'Effective scenario communication'],
      },
      {
        text: 'Scenario planning enhances policy clarity by translating qualitative aspirations into quantitative pathways and policy options, helping stakeholders to:',
        items: [
          'Confront trade-offs',
          'Negotiate feasible pathways',
          'Move beyond vague consensus to clearer, more actionable visions',
        ],
      },
      {
        text: 'By structuring discussions around measurable outcomes, it ensures that stakeholders develop alignment and realism in decision-making.',
      },
      {
        text: 'Long-term energy scenarios (LTES), projecting over two decades or more, have been a pivotal tool for:',
        items: [
          'Stimulating policy discussions',
          'Shaping informed long-term visions and energy policies',
          'Preparing governments for future policy interventions',
          'Highlighting immediate challenges and opportunities',
          'Informing sectoral policies',
          'Guiding investment directions',
        ],
      },
      {
        text: 'Energy modelling tools can be used to formulate LTES by quantifying technological pathways, enhancing the understanding of energy system complexities and interdependencies.',
      },
    ],
  },

  {
    id: 'responsibility',
    heading: 'Who is responsible for energy planning in governments?',
    toolkitSection: '2.2',
    blocks: [
      {
        text: 'When discussing energy planning in the context of government, various actors are involved in shaping energy policies and strategies.',
      },
      {
        text: 'The primary energy planners are typically government officials and policy makers within:',
        items: ['Energy ministries', 'Specialised energy agencies'],
      },
      {
        label: 'Examples:',
        items: [
          'Chile: Ministry of Energy leads long-term energy planning, including developing energy scenarios and preparing energy planning documents',
          'Denmark: Danish Energy Agency (under the Ministry of Climate, Energy and Utilities) is responsible for informing the policy-making process through energy and climate outlooks',
        ],
      },
      {
        text: 'These government entities often use dedicated in-house teams or agencies with expertise in energy modelling and scenario-building.',
      },
      {
        text: 'Germany Example: While the Ministry for Economic Affairs and Climate Action possesses strong internal scenario development capacity, independent research institutions contribute to scenario studies, providing a broader range of insights.',
      },
      {
        text: 'Energy planning involves multiple actors beyond central government:',
        items: [
          'Regulatory bodies',
          'Transmission system operators (TSOs)',
          'Distribution system operators (DSOs)',
          'Research institutions',
          'Local governments',
          'Other institutions with planning responsibilities',
        ],
      },
      {
        text: 'The allocation of responsibilities varies significantly between countries depending on governance structures, institutional traditions and available resources. Effective collaboration among these various entities is essential for coherent energy planning.',
      },
    ],
    table: {
      caption: 'Three models for energy planning capacity',
      columns: ['Model', 'Description', 'Example'],
      rows: [
        [
          'In-sourcing',
          'LTES capacity allocated solely within ministries or energy agencies',
          'Internal government teams',
        ],
        [
          'Out-sourcing',
          'LTES capacity out-sourced to research/technical institutions or consultancies',
          'External research institutions',
        ],
        [
          '50/50 (Hybrid)',
          'Combination where governments and external institutions work hand-in-hand',
          "Germany's approach",
        ],
      ],
    },
  },

  {
    id: 'definition',
    heading: 'What are participatory processes in the context of energy planning?',
    toolkitSection: '2.3',
    blocks: [
      {
        text: 'Participatory energy planning processes include a set of activities designed to define, design, influence and validate energy plans and their implementation in a collaborative manner.',
      },
      {
        text: 'Participatory processes may also be used to gauge the social acceptance of potential energy sector developments.',
      },
      {
        text: 'This can take the shape of:',
        items: ['Knowledge gathering', 'Co-creation', 'Dissemination activities'],
      },
      {
        text: 'These involve various stakeholder groups participating in the clean energy transition at various stages:',
        items: ['Policy framing', 'Scenario development', 'Validation', 'Communication'],
      },
      {
        text: 'Governments developing national energy strategies and roadmaps have employed various types of participatory activities:',
        items: [
          'Interviews with certain stakeholders',
          'Public hearings',
          'Surveys',
          'Workshops',
          'Online public consultations',
          'Validation of results',
        ],
      },
      {
        text: 'The specific choice of tools and approaches depends on:',
        items: [
          'The planning stage',
          'The stakeholder groups involved',
          'The available resources',
        ],
      },
    ],
  },
];

/** Section 2.4, the four objectives participatory processes serve. */
export const participationObjectives: ParticipationObjective[] = [
  {
    id: 'consensus',
    heading: 'Objective 1: Building Consensus, Trust and Stakeholder Ownership',
    summaryObjective: 'Building consensus',
    summaryBenefit: 'Legitimacy, trust and stakeholder buy-in',
    blocks: [
      {
        text: 'Long-term scenarios, by their data-driven and quantitative nature, face the challenge of reflecting the views of diverse societies, where citizens, public and private entities, policy makers and civil society organisations have various and sometimes conflicting priorities, concerns and beliefs.',
      },
      {
        label: 'Benefits:',
        items: [
          'Building consensus among stakeholders while identifying divergences and potential risks',
          'Enabling stakeholders to understand how plans are created and the trade-offs involved',
          'Cultivating a sense of ownership, enhancing support for the scenarios',
          'Promoting transparency and credibility',
          'Fostering trust and mutual understanding essential for smooth implementation',
        ],
      },
      {
        text: 'Key Insight: This process helps involve stakeholders as drivers of the clean transition through the collective shaping of national plans, rather than as observers on the sidelines.',
      },
      {
        text: 'Countries have acknowledged the value of participatory scenario development in generating credible and widely supported energy scenarios, emphasising the collective wisdom of diverse stakeholders for creating realistic and socially resonant scenarios.',
      },
    ],
  },

  {
    id: 'inputs',
    heading: 'Objective 2: Gathering Diverse Inputs and Identifying Planning Blind Spots',
    summaryObjective: 'Gathering inputs',
    summaryBenefit: 'Robust scenarios that identify blind spots',
    blocks: [
      {
        text: 'Scenario-building requires input from a wide range of stakeholders, including:',
        items: [
          'Sector and industry experts (power, transport, heating and cooling, agriculture, and other sectors)',
          'Policy makers',
          'Civil society organisations',
          'The public',
        ],
      },
      {
        text: 'Key Insight: A just energy transition is deeply rooted in social, procedural and distributional justice. Engaging stakeholders brings to light concerns that may galvanise either support for or opposition to energy and infrastructure projects.',
      },
      {
        text: 'Example: The case studies from Panama and Colombia highlight how countries engage with indigenous communities to develop their national grid modernisation and energy access strategies.',
      },
    ],
    table: {
      caption: 'Types of inputs',
      columns: ['Type', 'Description'],
      rows: [
        [
          'Quantitative data',
          'Energy supply characteristics, demand profiles, behavioural habits',
        ],
        ['Qualitative data', 'Social acceptance of technologies, socio-political issues'],
      ],
    },
  },

  {
    id: 'implementable',
    heading: 'Objective 3: Developing More Implementable and Context-Appropriate Scenarios',
    summaryObjective: 'Context-appropriate planning',
    summaryBenefit: 'Implementable scenarios aligned with local realities',
    blocks: [
      {
        text: 'Scenarios are an important source of data-driven policy advice. Policy decisions, however, are largely determined by:',
        items: [
          'The will of policy makers and their constituents',
          'The capacity and resources of the country',
        ],
      },
      {
        label: 'Benefits of Early Involvement:',
        items: [
          'Defining scenarios relevant to the context (economically, socially or politically)',
          'Focusing on scenarios that can be accepted and adopted by legislators, policy makers, investors',
          'Reflecting local realities',
        ],
      },
      {
        text: 'Note on Exploratory Scenarios: Scenario development is not restricted to only "plausible" or "realistic" scenarios. Exploratory scenarios, including "what if" scenarios and alternative imagined futures, can play an important role in:',
        items: [
          'Raising ambitions',
          'Driving lifestyle and policy changes',
          'Understanding the robustness of energy scenarios against various factors',
        ],
      },
    ],
  },

  {
    id: 'literacy',
    heading: 'Objective 4: Enhancing Energy Literacy and System Understanding',
    summaryObjective: 'Energy literacy',
    summaryBenefit: 'Enhanced understanding across all stakeholder groups',
    blocks: [
      {
        text: 'Experts underscore the critical role of stakeholder engagement in energy scenario planning as a means to:',
        items: [
          'Facilitate dialogue',
          'Foster a common understanding',
          'Simplify complex energy concepts',
        ],
      },
      {
        label: 'Methods for Building Understanding:',
        items: ['Workshops', 'Interactive tools and simulations', 'Structured information exchange'],
      },
      {
        text: 'Key Insight: Such interactive experiences enhance the quality of stakeholder contributions and allows them to envisage different futures, which can spur different stakeholders to action or increase their acceptance of these pathways.',
      },
      {
        text: "Stakeholder contributions also benefit from spontaneous information sharing among stakeholders, which broadens each participant's understanding by exposing them to new viewpoints and expertise.",
      },
    ],
  },
];
