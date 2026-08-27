// Background and closing material: chapter 1 and chapter 6
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.

import type { ContentBlock } from '../types/toolkit';
import type { RationaleSection } from '../types/reference';

/** Chapter 1, opening and background. */
export const backgroundSections: RationaleSection[] = [
  {
    id: 'introduction',
    heading: 'Introduction',
    toolkitSection: '1',
    blocks: [
      {
        text: 'The transition to a more sustainable and cleaner energy future requires strategic energy planning and informed decision making. Energy scenarios are a critical aspect of this planning process, enabling governments to:',
        items: [
          'Prepare for future socio-technical changes and lifestyles',
          'Identify risks and opportunities',
          'Shape effective policies',
        ],
      },
      {
        text: 'Scenarios can also be used as tools to engage with a wide range of stakeholders, from industry experts to the general public, and can become a tool for enhancing the legitimacy of and buy-in to the planning process.',
      },
      {
        text: 'Since 2018 IRENA has operated the Long-Term Energy Scenarios (LTES) Network, where government planning institutions across the world have shared their experiences and practices in developing and using long-term energy scenarios for clean energy policy making and its associated challenges.',
      },
      {
        text: 'Within the LTES Network, members and partners have continuously highlighted participatory processes in scenario development as a priority topic for accelerating the clean energy transition.',
      },
    ],
  },
  {
    id: 'landscape',
    heading: 'The expanding stakeholder landscape',
    toolkitSection: '1',
    blocks: [
      {
        text: 'The accelerated uptake of renewable energy and energy system innovation has brought many new players into the energy landscape. The range of stakeholders who are involved and affected has increased to include:',
        items: [
          'Energy prosumers (individuals or entities that both produce and consume energy)',
          'Energy co-operatives',
          'Local communities',
          'Indigenous and minority groups',
          'Businesses',
        ],
      },
      {
        text: "This brings the importance of energy to the foreground of people's day-to-day lives, increasing their interest in participating in energy-related planning and decision making.",
      },
      {
        text: 'While interest in participatory energy planning continues to grow, meaningful participation remains a challenge that requires deliberate effort.',
      },
      {
        text: 'Energy planning experts have stressed the importance of including the values and insights of different stakeholders in their short- and long-term planning processes to represent the true complexity of an energy system in transition.',
      },
      {
        text: 'IRENA analysis of energy and climate planning alignment has shown that a majority of both energy plans and long-term low emission development strategies (LT-LEDS) have involved participatory processes as part of their development.',
      },
      {
        text: 'These activities have ranged from:',
        items: [
          'Simple surveys and interviews',
          'Years-long agendas involving workshops, committees and other interactive activities aimed at a wide range of stakeholders',
        ],
      },
    ],
  },
];

/** Chapter 1.1 and 1.2: who the toolkit is for and how it was made. */
export const aboutSections: RationaleSection[] = [
  {
    id: 'objective',
    heading: 'Objective of the publication',
    toolkitSection: '1.1',
    blocks: [
      {
        text: 'This toolkit is aimed at scenario practitioners and energy planners in government planning institutions, and establishes the importance of participatory processes in energy planning, especially in the context of the energy transition.',
      },
      {
        text: 'It offers a comprehensive and practical resource for incorporating participatory processes by showcasing country, regional and global experiences.',
      },
      {
        text: 'Building on previously published resources on participatory policy making, community engagement and communication in various fields of planning and project implementation, this publication is intended for national-level energy planners, especially at a time when there is growing emphasis on involving stakeholders in shaping future pathways for a just transition.',
      },
      {
        label: 'At its core, the toolkit highlights:',
        items: [
          'The importance of participatory energy planning',
          'Different lessons, tools and stakeholders that can be engaged at different stages',
          'Practical recommendations for maximising results of participatory approaches',
        ],
      },
    ],
  },
  {
    id: 'development',
    heading: 'How the toolkit was developed',
    toolkitSection: '1.2',
    blocks: [
      {
        text: 'This toolkit has been developed on the basis of collective experiences and participatory processes observed within the LTES Network since 2018.',
      },
      {
        text: 'The activities that provided the content of this report emphasised engagement and collaboration:',
        items: [
          'Thematic workshops, webinars and events facilitated engagement with crucial stakeholders',
          'Over 50 speakers and 300 participants engaged in meaningful discussions on participatory processes and public engagement in energy planning',
          "A scientific advisory committee influenced the report's structure and content",
          'Interactive sessions, literature reviews and expert interviews ensured comprehensive understanding',
        ],
      },
      {
        text: 'This methodology, centred on active participation and expert guidance, has been instrumental in shaping a toolkit that reflects current good practices and innovative strategies in facilitating inclusive participatory processes in LTES.',
      },
    ],
  },
];

/** Chapter 6, Key Takeaways. */
export const keyTakeaways: string[] = [
  'Participatory processes are essential for a clean and just energy transition',
  'Diverse tools and approaches exist to suit different contexts and resources',
  'Learning from others through case studies helps avoid common pitfalls',
  'Continuous improvement of participatory methods is needed',
  'Stakeholder feedback loops should be strengthened',
  'Evaluation mechanisms need development to measure participatory process effectiveness',
];

/** Chapter 6, Future Opportunities and Looking Ahead. */
export const futureOpportunities: ContentBlock[] = [
  {
    text: 'New opportunities and challenges may arise, including:',
  },
  {
    label:
      'Artificial Intelligence (AI): Use of AI, machine learning and natural language processing (NLP) techniques to:',
    items: [
      'Improve and analyse stakeholder priorities and inputs',
      'Design participatory activities',
      'Address stakeholder comments in the scenario development process and results',
    ],
  },
  {
    text: 'As further importance and funding are placed on using participatory methods in scenario design and policy making, we may continue to see these questions being addressed, with innovative solutions and case studies that will continue to be explored within the work of the LTES Network.',
  },
];
