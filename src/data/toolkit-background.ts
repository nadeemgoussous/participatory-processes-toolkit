// Background: chapter 1, and the closing prose of chapter 6
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Chapter 1 is prose. The markdown transcription turned its sentences into
// bullet lists and reworded them, and added a six-point "Key takeaways" list to
// chapter 6 that the publication does not contain. Both are corrected here.

import type { ContentBlock } from '../types/toolkit';
import type { RationaleSection } from '../types/reference';

export const backgroundSections: RationaleSection[] = [
  {
    id: 'introduction',
    heading: 'Introduction',
    toolkitSection: '1',
    blocks: [
      {
        text: 'The transition to a more sustainable and cleaner energy future requires strategic energy planning and informed decision making.',
      },
      {
        text: 'Energy scenarios are a critical aspect of this planning process, enabling governments to prepare for future socio-technical changes and lifestyles, identify risks and opportunities, and shape effective policies.',
      },
      {
        text: 'Scenarios can also be used as tools to engage with a wide range of stakeholders, from industry experts to the general public, and can become a tool for enhancing the legitimacy of and buy-in to the planning process (IRENA, 2020).',
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
        text: 'The accelerated uptake of renewable energy and energy system innovation around it has brought many new players into the energy landscape.',
      },
      {
        text: 'The extent of the energy transition goes far beyond the traditional power generation and transmission dynamics and incumbent (mainly fossil fuel) providers and companies.',
      },
      {
        text: "The range of stakeholders who are involved and affected has increased to include energy prosumers, energy co-operatives, local communities, indigenous and minority groups, and businesses, bringing the importance of energy to the foreground of people's day-to-day lives, and increasing their interest in participating in energy-related planning and decision making (Wahlund and Palm, 2022; Dawson, 2020).",
      },
      {
        text: 'And while interest in participatory energy planning continues to grow, meaningful participation remains a challenge that requires deliberate effort (Knudsen et al., 2015).',
      },
      {
        text: 'IRENA analysis of energy and climate planning alignment has shown that a majority of both energy plans and long-term low emission development strategies (LT-LEDS) have involved participatory processes as part of their development.',
      },
      {
        text: 'These activities have ranged from simple surveys and interviews to years-long agendas that involve workshops, committees and other interactive activities aimed at a wide range of stakeholders.',
      },
      {
        text: 'The findings of this toolkit stem from a collaborative process, using experience-sharing activities and practitioner insights from around the world.',
      },
      {
        text: 'Despite the prevalence of these participatory processes, a comprehensive overview of approaches and best practices at the national energy planning level is lacking.',
      },
    ],
  },
];

export const aboutSections: RationaleSection[] = [
  {
    id: 'objective',
    heading: 'Objective of the publication',
    toolkitSection: '1.1',
    blocks: [
      {
        text: 'This toolkit aims to both showcase the relevance of participatory energy planning for a clean and just transition, and provide resources for national government energy planners (and other planners more broadly) to refer to as they design participatory activities for their planning process.',
      },
      {
        text: 'Following this introductory chapter, Chapter 2 introduces the concepts of energy planning, energy scenarios and how participatory processes are used to support planning processes.',
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
        text: 'The activities that have provided the content of this report emphasised engagement and collaboration, key to understanding and improving participatory processes in LTES planning processes.',
      },
      {
        text: 'A variety of thematic workshops, webinars and events facilitated engagement with crucial stakeholders for understanding the landscape of this topic for this report, involving over 50 speakers and 300 participants in meaningful discussions on participatory processes and public engagement in energy planning, which can be explored in the Appendix.',
      },
    ],
  },
];

/** Chapter 6, on what may come next. */
export const futureOpportunities: ContentBlock[] = [
  {
    text: 'New opportunities and challenges may also arise, including the use of artificial intelligence (AI), machine learning and natural language processing (NLP) techniques to improve and analyse stakeholder priorities and inputs into designing the participatory activities, as well as addressing their comments in the scenario development process and results.',
  },
  {
    text: 'As further importance and funding are placed on using participatory methods in scenario design and policy making, we may continue to see these questions being addressed, with innovative solutions and case studies that will continue to be explored within the work of the LTES Network.',
  },
];
