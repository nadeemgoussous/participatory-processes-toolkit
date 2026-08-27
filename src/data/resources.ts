// Additional material, chapter 7
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Links are the ones the publication lists. Nothing is fetched from them at
// runtime; they open only when the reader clicks.

import type { Framework, Publication, ResourceGroup } from '../types/reference';

export const publications: Publication[] = [
  {
    id: 'participatory-methods-toolkit',
    title: "Participatory Methods Toolkit: A Practitioner's Manual",
    author: 'Dr Nikki Slocum – UN University – CRIS',
    description:
      "Designed for both new and experienced practitioners, this toolkit includes detailed fiches on 10 methods, an overview of 40 others, and general guidelines. The manual's format is adaptable for easy use and customisation, serving as a dynamic resource for sharing practical knowledge in the field of participatory approaches.",
    links: [{ url: 'https://archive.unu.edu/hq/library/Collection/PDF_files/CRIS/PMT.pdf' }],
  },
  {
    id: 'deliberative-futures-toolkit',
    title: "Deliberative Futures Toolkit: Toward 'Future-Oriented' Communities and Decision Making",
    author: 'MaREI Centre',
    description:
      'This toolkit offers future-thinking strategies to tackle climate change, focusing on inclusive and sustainable decision making. It includes scenario analysis, modelling tools and practical guides for various stakeholders like educators, activists and community practitioners.',
    links: [
      {
        url: 'https://www.ucc.ie/en/media/projectsandcentres/imagining2050/Imagining2050Toolkit.pdf',
      },
    ],
  },
  {
    id: 'community-energy-planning',
    title:
      "Community Energy Planning: Best Practices and Lessons Learnt in NREL's Work with Communities",
    author: 'NREL',
    description:
      'A best practice guide focused on community energy planning, informed by expert interviews and literature reviews. Outlines five key practices:',
    points: [
      'Thorough preparation',
      'Authenticity in community interactions',
      'Respecting community agency',
      'Meeting specific community needs',
      'Promoting inclusive participation',
    ],
    links: [{ url: 'https://www.nrel.gov/docs/fy22osti/82937.pdf' }],
  },
  {
    id: 'participatory-methods-review',
    title: 'Participatory Methods in Energy System Modelling and Planning – A Review',
    author: 'Connor McGookin, Brian Ó Gallachóir and Edmond Byrne',
    description:
      'Reviews participatory methods in energy system modelling and planning, analysing 59 studies. Focuses on stakeholder engagement and its integration with quantitative analysis, highlighting differences in approaches at national and subnational levels.',
    links: [
      { url: 'https://www.sciencedirect.com/science/article/pii/S1364032121007838' },
    ],
  },
  {
    id: 'advancing-participatory-modelling',
    title: 'Advancing Participatory Energy Systems Modelling',
    author: 'Connor McGookin, Diana Süsser, Georgios Xexakis, et al.',
    description:
      'Emphasises the need for integrating diverse perspectives into energy system models. Addresses the lack of structured participatory processes in energy modelling by offering good practice guidance. The proposed framework provides various entry points for participatory elements.',
    links: [{ url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4509315' }],
  },
  {
    id: 'robust-decision-making',
    title: 'Using Robust Decision-Making to Develop Long-Term Strategies – A Practical Guide',
    author:
      'Jairo Quirós-Tortós, Luis Víctor-Gallardo, Mariana Rodríguez-Arce and Alejandra Soto-Rodríguez',
    description:
      'Robust decision-making (RDM) offers an adaptive approach, engaging stakeholders to create flexible, resilient strategies. This RDM Guide provides a ten-step framework, informed by Latin American and Caribbean experiences.',
    links: [
      {
        url: 'https://2050pathways.org/wp-content/uploads/2024/09/2050PP_RDMReport_FINAL092624Pages.pdf',
      },
    ],
  },
  {
    id: 'ltes-series',
    title: 'Scenarios for the Energy Transition (LTES Network Publication Series)',
    author: 'IRENA',
    description:
      'Publications containing numerous case studies on good practices and experiences shared by experts throughout engagements and activities within the LTES Network.',
    links: [
      {
        label: 'Global',
        url: 'https://www.irena.org/publications/2020/Sep/Scenarios-for-the-Energy-Transition-Global-experience-and-best-practices',
      },
      {
        label: 'Africa',
        url: 'https://www.irena.org/Publications/2023/Jan/Scenarios-for-the-energy-transition-Experience-and-good-practices-in-Africa',
      },
      {
        label: 'Latin America & Caribbean',
        url: 'https://www.irena.org/publications/2022/Jul/Scenarios-for-the-Energy-Transition-LAC',
      },
    ],
  },
];

export const resourceGroups: ResourceGroup[] = [
  {
    id: 'repositories',
    label: 'Repositories',
    detailed: true,
    entries: [
      {
        name: 'Facilitator School',
        description:
          'Repository of templates for facilitating workshops and meetings, guidelines, tips, and links to helpful applications',
        url: 'https://www.facilitator.school',
      },
      {
        name: 'URBACT Toolbox',
        description:
          'Resources including tools, templates and guidance for participatory, integrated action (designed for urban planning, adaptable for national contexts)',
        url: 'https://urbact.eu/toolbox-home',
      },
      {
        name: 'ILO International Training Centre',
        description:
          'Repository of methodologies to facilitate in-person participatory meetings including icebreakers and creative co-creation methods',
        url: 'https://www.itcilo.org/methods',
      },
      {
        name: 'USYS Transdisciplinarity Lab',
        description:
          'Toolbox for co-production of knowledge between scientific disciplines and between science and society',
        url: 'https://tdlab.usys.ethz.ch/toolbox.html',
      },
      {
        name: 'Guidelines for Public Engagement in Energy Infrastructure (IEECP and RGI)',
        description:
          'Interactive tool with tailored recommendations for engaging in energy projects around four principles: early engagement, transparency, inclusiveness and trust',
        url: 'https://renewables-grid.eu/activities/engage4energy.html',
      },
      {
        name: 'Electricity Transition Playbook',
        description:
          'Tool to help policy makers build and deliver plans for clean electricity transition, including section on public participation',
        url: 'https://www.greengridsinitiative.net/general-8',
      },
      {
        name: 'IIASA Scenario Ensembles and Database Resources',
        description:
          'Large number of scenario explorers, visualisations and databases from the integrated assessment modelling community',
        url: 'https://iiasa.ac.at/scenario-ensembles-and-database-resources',
      },
      {
        name: 'Callio.pe',
        description:
          'Scenario visualisation tool for navigating hundreds of alternative energy system configurations (SPORES) for European carbon neutrality',
        url: 'https://explore.callio.pe/',
      },
      {
        name: 'Decision Theatre',
        description:
          'Participatory approach combining interactive visualisation, data, modelling and structured dialogue among stakeholders',
        url: 'https://dt.asu.edu/publications',
      },
    ],
  },
  {
    id: 'online-surveys',
    parent: 'Survey platforms',
    label: 'Online surveys',
    intro: 'For surveys that need time to complete:',
    entries: [
      { name: 'Microsoft Forms' },
      { name: 'Google Forms' },
      { name: 'SurveyMonkey' },
      { name: 'Qualtrics' },
    ],
  },
  {
    id: 'real-time-polling',
    parent: 'Survey platforms',
    label: 'Real-time polling',
    intro: 'For use during events and webinars for real-time interaction:',
    entries: [
      { name: 'Mentimeter' },
      { name: 'Slido' },
      { name: 'Kahoot' },
      { name: 'Prezi' },
      { name: 'Ahaslides' },
    ],
  },
  {
    id: 'brainstorming',
    parent: 'Co-creation platforms',
    label: 'Brainstorming',
    intro: 'For group co-creating and deliberation in online settings:',
    entries: [{ name: 'Miro' }, { name: 'Mural' }, { name: 'Microsoft Whiteboard' }],
  },
  {
    id: 'virtual-workshops',
    parent: 'Co-creation platforms',
    label: 'Virtual workshops',
    intro:
      'Video conferencing platforms with facilities for webinars, meetings and break-out groups:',
    entries: [{ name: 'Zoom' }, { name: 'Microsoft Teams' }, { name: 'Webex' }],
  },
  {
    id: 'dashboards',
    parent: 'Data visualisation',
    label: 'Dashboards',
    intro: 'For interactive data visualisation platforms:',
    entries: [{ name: 'PowerBI' }, { name: 'Tableau' }, { name: 'Looker Studio' }],
  },
  {
    id: 'charts',
    parent: 'Data visualisation',
    label: 'Charts',
    entries: [
      { name: 'Microsoft Excel' },
      { name: 'Google Sheets' },
      { name: 'Python/Stata' },
      { name: 'R' },
      { name: 'Canva' },
    ],
  },
];

export const frameworks: Framework[] = [
  {
    id: 'trilemma',
    name: 'World Energy Trilemma Index',
    source: 'World Energy Council',
    description:
      'Assessment tool analysing national energy systems across three key dimensions:',
    dimensions: ['Security', 'Equity', 'Sustainability'],
    note: 'Can be utilised to jointly evaluate various indicators and understand their policy implications, assisting stakeholders in shaping and refining energy strategies.',
    url: 'https://www.worldenergy.org/transition-toolkit/world-energy-trilemma-index',
  },
  {
    id: 'social-acceptance',
    name: 'Social Acceptance of Renewable Energy',
    source: 'Wüstenhagen et al. (2007)',
    description:
      'Framework for understanding social acceptance of renewable energy from three perspectives:',
    dimensions: ['Socio-political acceptance', 'Community acceptance', 'Market acceptance'],
    note: 'Helpful in guiding discussions with citizens and CSOs on their perspectives on energy developments.',
    url: 'https://www.researchgate.net/publication/227997801_Social_Acceptance_of_Renewable_Energy_Innovation_An_Introduction_to_the_Concept',
  },
];

/** Quick Reference: Tool Categories. */
export const quickReference: { need: string; tools: string }[] = [
  { need: 'Survey design', tools: 'SurveyMonkey, Qualtrics, Google Forms' },
  { need: 'Live polling', tools: 'Mentimeter, Slido, Kahoot' },
  { need: 'Collaborative brainstorming', tools: 'Miro, Mural' },
  { need: 'Virtual workshops', tools: 'Zoom, Microsoft Teams' },
  { need: 'Data dashboards', tools: 'PowerBI, Tableau' },
  { need: 'Scenario visualisation', tools: 'Callio.pe, IIASA resources' },
  { need: 'Facilitation methods', tools: 'Facilitator School, ILO Training Centre' },
  { need: 'Energy sector frameworks', tools: 'World Energy Trilemma Index' },
];
