// Engagement tools, chapter 4
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Strings are quoted from the publication. Case study ids link to chapter 5
// entries in case-studies.ts; countries the publication names that are not
// chapter 5 case studies (Botswana, Ireland) appear in the quoted text only.

import type { EngagementTool, ToolId, Objective, Phase } from '../types/toolkit';

export const engagementTools: EngagementTool[] = [
  // ---------------------------------------------------------------- 4.1.1
  {
    id: 'workshops',
    name: 'Workshops',
    category: 'knowledge-gathering',
    toolkitSection: '4.1.1',
    summary: [
      'Workshops provide structured environments for energy planners to facilitate engagement with many different types of stakeholders, to share information, foster discussions and collect feedback. Workshops help identify and map divergences and convergences between stakeholder groups.',
    ],
    stageApplications: {
      framing: 'Co-define policy questions and targets',
      development: 'Co-develop narratives and define assumptions',
      validation: 'Present preliminary results and encourage feedback for reiteration',
      communication: 'Present results and communicate policy outcomes',
    },
    requirements: [
      'Dedicated, skilled facilitators with expertise in energy scenario development',
      'Financial resources for logistics (location, technology, facilitation, attendance funding)',
      'Technology access depending on format',
    ],
    prerequisites: [
      'Map required stakeholders depending on workshop objectives',
      'Determine format most appropriate for stakeholders invited',
      'Ensure confidentiality when necessary',
      'Consider preliminary engagement phase for non-expert audiences',
    ],
    strengths: [
      'Adaptable and flexible, allowing diverse formats',
      'Interactive nature encourages active participation',
      'May foster social acceptance',
      'Engage a wide range of stakeholders and promote social learning',
      'In-person workshops foster informal exchanges and relationships',
    ],
    challenges: [
      'Risk of misinformation, manipulation or reinforcement of biases (echo chambers)',
      'Public settings might discourage marginalised voices',
      'Requires careful facilitation and inclusivity',
    ],
    limitations: [
      'Difficult to translate qualitative discussions into quantitative inputs',
      'Expert participation limited by time and availability',
      'Resource constraints can pose challenges',
    ],
    examples: [
      'Brazil: Virtual debates to identify key disagreements and develop scenarios reflecting different perspectives',
      'Finland: Workshops to foster collaboration and transparency in carbon neutrality scenarios',
      'Cyprus: Workshops to communicate scenario results to policy makers',
    ],
    evidence: [
      'Finland (VTT): Workshops focused on vision and storyline development using creative methods. National industrial federations contributed low-carbon sectoral roadmaps.',
      'Canada (EMH): Workshops for energy modellers, policy makers, regulators and system operators to facilitate discussions on clean energy policies.',
      'Colombia: Multisector dialogue forums bringing together various departments under a regional context.',
      'World Energy Council: Global scenario-weaving workshops gathering stakeholders from academia, government, industry and start-ups to co-create socio-political narratives.',
      'PAC Consortium: Workshops with CSOs, technical experts and TSOs to develop Paris-compatible energy scenarios for Europe.',
      'Ireland: Deliberative Futures Workshops employed creative exercises like community mapping and storyboarding.',
    ],
    caseStudyIds: [
      'brazil',
      'finland',
      'cyprus',
      'canada',
      'colombia',
      'world-energy-council',
      'pac-consortium',
    ],
    lists: [
      {
        label: 'Format considerations',
        items: [
          'Physical meetings: Most effective for fostering transparency and building trust (see Ghana case study)',
          'Online tools and platforms: Effective for engaging stakeholders at different stages (see Chile case study)',
          'Hybrid approach: Combining both (see Brazil case study)',
        ],
      },
    ],
    boxLabel: 'Box 1: Ideas for interactive workshops',
    box: [
      {
        name: 'World Café',
        description:
          'Participants discuss topics at rotating café-style tables, with hosts summarising previous conversations. Fosters diverse insights and collaboration.',
      },
      {
        name: 'Transition Simulator',
        description:
          'Groups simulate different stakeholders and propose actions in response to various scenarios. Helps stakeholders plan actions while balancing their own interests.',
      },
      {
        name: 'Futures Wheel',
        description:
          'Involves critical analysis, envisioning potential futures and assessing practicality. Promotes social learning and helps drive change.',
      },
      {
        name: 'Me-We-Us',
        description:
          'Starts with individual work, moves to group discussions, ends with collective conversation. Promotes equal participation.',
      },
      {
        name: 'Narrative Workshop',
        description:
          'Foresight lab blending scientific, artistic and social elements. Uses storytelling to reimagine energy futures.',
      },
    ],
  },

  // ---------------------------------------------------------------- 4.1.2
  {
    id: 'surveys',
    name: 'Surveys and public consultations',
    category: 'knowledge-gathering',
    toolkitSection: '4.1.2',
    summary: [
      'Surveys provide a structured method for national energy planners to gather standardised information and perspectives from a wide range of stakeholders. They offer a means of understanding public opinion, collecting quantitative and qualitative data, and receiving feedback on energy plans and scenarios.',
    ],
    stageApplications: {
      framing: 'Co-define policy questions, priorities and targets',
      development: 'Data gathering',
      validation: 'Gathering feedback on results and draft plans',
      communication: 'Gathering feedback on final plan',
    },
    requirements: [
      'Specialists with expertise in energy scenario development and data collection',
      'Financial resources (in-person surveys require more)',
      'Online surveys may offer lower-cost option but require survey design expertise',
      'Must be mindful of data protection law',
    ],
    prerequisites: [
      "Define the survey's main objectives",
      'Identify target audience and ensure representative sample',
      'Plan survey format (online, in-person, hybrid, telephone)',
      'Consider how participants will be involved in subsequent stages',
    ],
    strengths: [
      'Can engage a diverse group of stakeholders',
      'Effective for gathering wide range of perspectives',
      'Can be tailored to collect valuable data for energy scenario modelling',
      'Methodologies suited to various formats and contexts',
    ],
    challenges: [
      'Gaining meaningful inputs within limited interaction period',
      'Defining a representative sample',
      'Sampling and framing biases',
      'Crafting surveys that accommodate different levels of knowledge',
    ],
    limitations: [
      'Accessibility issues for certain citizen groups',
      'Some topics may need to be simplified',
      'Survey design must balance data collection needs against respondent engagement',
    ],
    examples: [
      'Finland (VTT): Large-scale surveys including consumer surveys for carbon neutrality scenarios',
      'Chile: Surveys to gather feedback on energy planning process',
      'Ghana: Surveys to inform energy transition planning',
    ],
    evidence: [
      'Brazil: Online surveys integrated into National Energy Plan 2050 through a three-month public consultation. Surveys also used to collect feedback on draft energy scenarios.',
      'Finland: Survey questions captured energy consumption patterns, preferences for energy sources and public acceptance of policies.',
      'Ghana: Surveys to understand stakeholder preferences and attitudes towards energy transition.',
    ],
    caseStudyIds: ['finland', 'chile', 'ghana', 'brazil'],
    boxLabel: 'Box 2: Examples of survey formats',
    box: [
      {
        name: 'Online Surveys',
        description:
          'Low-cost, widely used. Can be used for mass outreach or reaching geographically dispersed stakeholders.',
      },
      {
        name: 'Deliberative Survey',
        description:
          'Involves participants in informed and structured dialogue. Encourages discussion and thorough consideration of diverse perspectives.',
      },
      {
        name: 'Delphi Panels',
        description:
          'Iterative method allowing reconsidering responses through different rounds. Facilitates social learning and common understanding.',
      },
      {
        name: 'Polls and Ballots',
        description:
          'Quick and convenient methods to gauge preferences and priorities. Can be done virtually or in-person.',
      },
    ],
  },

  // ---------------------------------------------------------------- 4.1.3
  {
    id: 'interviews',
    name: 'Interviews',
    category: 'knowledge-gathering',
    toolkitSection: '4.1.3',
    summary: [
      "Interviews offer energy planners a focused method to deeply explore participants' perspectives, opinions and experiences in mostly one-on-one settings. They provide a platform for gaining detailed qualitative insights and uncovering nuances that may inform energy plans and scenarios.",
      'The interview format is usually used to engage industry or expert stakeholders as opposed to the general public due to being time-consuming.',
    ],
    stageApplications: {
      framing: 'Co-define in-depth policy questions, priorities and targets',
      development: 'Data gathering, narrative co-creation',
      validation: 'Feedback gathering and refinement',
      communication: 'Gathering feedback on final plan',
    },
    requirements: [
      'Expert support to design structure and define questions',
      'Interviewers to guide dialogue and keep participants focused',
    ],
    prerequisites: [
      'Clearly define primary goals of the interview',
      'Identify target groups (citizens, stakeholders, subject matter experts)',
      'Plan interview approach (structured, semi-structured, or informal)',
      'Establish confidentiality measures',
    ],
    strengths: [
      'Allow stakeholders to express individual views in detail',
      'Effective for gathering qualitative and descriptive data',
      'Foster meaningful conversations',
      'Enable participants to articulate motivations and identify divergences',
      'Generate in-depth insights for understanding complex issues',
    ],
    challenges: [
      'Interpreting and translating findings into actionable insights for quantitative scenarios',
      'Ensuring balance between diverse opinions within same stakeholder group',
    ],
    limitations: [
      'Small number of participants limits diversity of perspectives',
      'Time-intensive to conduct and analyse',
      'Lack group dynamics that can reveal new information or build consensus',
    ],
    examples: [
      'World Energy Council: Interviews to understand stakeholder preferences and draft scenario narratives',
      'Finland: Interviews to capture individual stakeholder perspectives',
    ],
    evidence: [
      'United Arab Emirates: Bilateral interviews and discussions to ensure alignment between national plans and mid-term strategies of regional utilities.',
      'Finland (VTT): Interviews to capture individual stakeholder perspectives, opinions and experiences.',
      'World Energy Council: Interviews to craft narratives for energy scenarios.',
    ],
    caseStudyIds: ['world-energy-council', 'finland', 'uae'],
    boxLabel: 'Box 3: Types of interviews',
    box: [
      {
        name: 'Structured',
        description: 'Rigid, prepared questions',
        bestFor:
          'Collecting consistent and comparable qualitative data; can be quantified',
      },
      {
        name: 'Semi-structured',
        description:
          'Interview protocol with some prepared questions, flexible for probing',
        bestFor: 'Flexible, in-depth exploration of complex issues and assumptions',
      },
      {
        name: 'Unstructured',
        description: 'No prepared questions, very flexible',
        bestFor:
          'Collecting qualitative data, opinions and narratives at the beginning of scenario processes',
      },
    ],
  },

  // ---------------------------------------------------------------- 4.2.1
  {
    id: 'committees',
    name: 'Inter-institutional steering committees, task forces and working groups',
    category: 'co-creation',
    toolkitSection: '4.2.1',
    summary: [
      'Several countries co-ordinate their energy planning through inter-institutional committees (including public and non-public organisations) to bring their unique expertise, data and viewpoints to the table.',
      'Working together helps create a more comprehensive, aligned and interconnected understanding of the long-term energy scenarios, which supports the quantification of socio-political insights and their inclusion in energy scenarios and planning.',
    ],
    stageApplications: {
      framing: 'Co-define policy questions, priorities and targets',
      development: 'Data gathering, narrative co-creation',
      validation: 'Feedback gathering',
      communication: 'Co-created outputs such as policy briefs or results',
    },
    requirements: [
      'Dedicated institutional resources for sustained engagement',
      'Well-structured core team with clear leadership',
      'Secure participation of key ministries',
      'Strategic engagement with external technical expertise',
    ],
    prerequisites: [
      'Formalise the committee with associated roles, responsibilities, objectives, resources and constraints',
      'Participants should commit to the process for its duration',
    ],
    strengths: [
      'Bring together diverse expertise for complex issues',
      'Collaborative nature enables integration of multiple perspectives',
      'Foster stronger consensus-building and comprehensive solutions',
      'Clear mandate enhances communication and reduces conflicting policies',
    ],
    challenges: [
      'Slow decision-making processes with limited flexibility',
      'Resource intensive',
      'Internal power dynamics or lack of mutual understanding can hinder collaboration',
      'Sustaining enthusiasm and commitment over prolonged period',
      'Prioritisation of certain disciplines, sectors or policies may reflect self-interest',
    ],
    limitations: [
      'Large committees or disproportionate representation can limit effectiveness',
      "Differences in participants' knowledge can create disparities in contributions",
      'Impartiality may be compromised depending on leadership',
    ],
    examples: [],
    evidence: [
      'Cyprus: Hierarchical system of technical committees feeding into ministerial decision making.',
      'Ghana: Energy Planning Committee integrates multiple economic sectors.',
      'Botswana: Multi-sectoral steering committee including power utility, environment ministry and private sector to oversee long-term energy scenario development.',
    ],
    caseStudyIds: ['cyprus', 'ghana'],
    lists: [
      {
        label: 'Possible participants in a working group',
        items: [
          'Energy experts: Expertise on energy system limitations and challenges',
          'Energy system modellers: Research methods and adoption of different models',
          "Community representatives: Citizens' interests",
          'Indigenous groups: Justice for indigenous communities',
          "Youth envoys: Future generations' interests",
          'Utilities: Electricity data and investment plans',
          'Energy regulator: Permit timelines',
          'Climate experts: Compliance with NDCs, LT-LEDS',
          'Statistics departments: Energy and demographic statistics',
          'Social scientists: Quantification of socio-political insights',
          'Finance ministry: Budget realism',
          'Labour representation: Just transition and fair work',
          'Business representatives/associations: Industry perspectives',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 4.2.2
  {
    id: 'networks-hubs',
    name: 'Networks/Hubs',
    category: 'co-creation',
    toolkitSection: '4.2.2',
    summary: [
      'Establishing a network or hub involves the creation of a temporary or permanent structure to co-ordinate activities, share knowledge and build a modelling ecosystem.',
    ],
    stageApplications: {
      framing: 'Co-development of policy questions and discussion about assumptions',
      development:
        'Creation of open-source data platforms, co-development of modelling tools',
      validation: 'Expert peer review and scrutiny with continuous feedback loops',
      communication: 'Presenting scenarios to experts and modellers',
    },
    requirements: [
      'Sustained funding for permanent and temporary staff',
      'Technology infrastructure (software for online engagement, shared databases, tools)',
      'Strong governance structure with expertise in relevant topics',
      'Open communication channels',
      'Political will at various levels',
    ],
    prerequisites: [
      'Recognise and accommodate resource disparities among network members',
      'Robust monitoring and evaluation mechanism',
    ],
    strengths: [
      'Platform for regular interaction among technical civil servants, policy makers and academics',
      'Foster alignment and avoid duplication of efforts',
      'Leverage diverse capacities and strengths of participating institutions',
      'Enable more relevant and impactful contributions',
    ],
    challenges: [
      'Substantial sustained funding requirements',
      'Differing institutional priorities may complicate co-ordination',
      'Political will crucial for ensuring outputs contribute to governmental goals',
    ],
    limitations: [
      'Best suited for ongoing collaboration rather than singular projects',
      'Success relies on sustained commitment of diverse group of members',
    ],
    examples: [
      'A university-based structure connecting modelling experts with clean energy policy makers. Fosters dialogue among energy modellers, policy makers and other stakeholders through various engagement activities.',
    ],
    examplesLabel: "Example: Canada's Energy Modelling Hub (EMH)",
    evidence: [
      'Canada (EMH): University-based network connecting modelling experts with policy makers. Features annual forum and thematic committees.',
      'World Energy Council: Uses country committees to organise activities and tools for interactive simulations and discussions.',
      'PAC Consortium: Leverages consortium structure including prominent environmental NGOs and TSOs to facilitate knowledge exchange and empower civil society organisations.',
    ],
    caseStudyIds: ['canada', 'world-energy-council', 'pac-consortium'],
    lists: [
      {
        label: 'Box 4: Possible activities and outputs',
        items: [
          'Open-source modelling platforms',
          'Capacity-building sessions',
          'Shared datasets for energy modelling',
          'Joint scenario development activities',
          'Thematic workshops and forums',
          'Model and scenario comparison sessions',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 4.3.1
  {
    id: 'presentations-reports',
    name: 'Public presentations and reports',
    category: 'dissemination',
    toolkitSection: '4.3.1',
    summary: [
      'Scenario practitioners use public presentations as a strategic tool throughout the energy scenario development process to inform, engage and gather feedback from stakeholders.',
      'Public presentations are essential for effectively communicating with non-expert audiences and fostering broader stakeholder buy-in.',
    ],
    stageApplications: {
      framing: 'Present aims and objectives, timelines',
      development: 'Present policy questions and other information to stakeholders',
      validation: 'Present draft results',
      communication: 'Present scenarios to all types of stakeholders',
    },
    requirements: [
      'Skilled communication capability (possibly dedicated communication and external relations teams)',
      'Technology support for presentations, especially online formats',
    ],
    prerequisites: [
      'Define specific objectives in advance',
      'Develop well-defined methodology for collecting and incorporating audience feedback',
    ],
    strengths: [
      'Opportunity to educate non-expert groups about energy scenario development',
      'Platform to gather feedback from broad audience',
      'Online presentations reach larger and more diverse audiences',
    ],
    challenges: [
      'Crafting appropriate narrative for non-expert audiences',
      'Employing non-technical language and ensuring clarity',
    ],
    limitations: [
      'May need to limit depth and complexity of content',
      'Time available for presenting and answering questions can be constrained',
    ],
    examples: [],
    evidence: [
      'Cyprus: Concise policy briefs tailored for ministries and national authorities, plus sector-specific briefs.',
      'Brazil: Virtual debates during National Energy Plan 2050 development to highlight diverse perspectives.',
      'Chile: Public hearings to ensure broad stakeholder engagement.',
    ],
    caseStudyIds: ['cyprus', 'brazil', 'chile'],
    lists: [
      {
        label: 'Types of presentations',
        items: [
          'Introductory sessions to outline the process',
          'Updates during intermediate stages to share progress and solicit input',
          'Discussions of partial or final outcomes to present findings and encourage dialogue',
        ],
      },
    ],
    boxLabel: 'Box 5: Tools for publicly presenting and discussing scenarios',
    box: [
      {
        name: 'Public Hearings',
        description:
          'Formal gatherings for government agencies to present information and receive public feedback. Can be advertised on social media.',
      },
      {
        name: 'Online Conferencing',
        description:
          'Virtual tools broaden outreach and delivery with potentially lower resource requirements.',
      },
      {
        name: 'Reports and Publications',
        description:
          'Deliver highly detailed information with full narratives, assumptions, data and visualisations. Useful for stakeholders with technical knowledge.',
      },
    ],
  },

  // ---------------------------------------------------------------- 4.3.2
  {
    id: 'visualisation-games',
    name: 'Visualisation tools, games and simulations',
    category: 'dissemination',
    toolkitSection: '4.3.2',
    summary: [
      'Detailed energy system plans can be data-heavy and difficult to interpret for non-experts due to the highly technical nature of energy system planning.',
    ],
    stageApplications: {
      framing: 'Present data on current statistics and existing scenarios/policies',
      development: 'Test and visualise early results and scenarios',
      validation: 'Present draft results',
      communication: 'Set up dashboards and interactive tools to increase outreach',
    },
    requirements: [
      'Access to appropriate technology (licences, subscriptions)',
      'Knowledge and capacity to create and interpret tools',
    ],
    prerequisites: [
      'Provide clear instructions on how to interpret and interact with tools',
      'Define key concepts related to energy scenarios',
      'Highlight information most relevant to different stakeholder groups',
    ],
    strengths: [
      'Complement and enhance storytelling',
      "Capture audience's interest through engaging presentations",
      'Effective way to reach broader, non-expert audience',
      'Make complex information more accessible and interactive',
    ],
    challenges: [
      'Require dedicated training and expertise',
      'Outsourcing incurs additional financial cost',
      'Balancing quality with resource constraints',
    ],
    limitations: [
      'Depend on reliable internet access',
      'May require accompanying educational resources',
      'As one-way communication tools, may not fully address audience questions',
    ],
    examples: [],
    evidence: [
      'Most Countries: Simple, clear graphs to illustrate impacts of energy scenarios.',
      'Belgium and Kenya: Calculators enabling users to manipulate variables and assumptions, demonstrating how different inputs influence emissions and energy outcomes.',
      'IEA/Financial Times: Climate role-playing online game.',
      'UAE: Interactive board game to communicate scenario results to high-level policy makers.',
    ],
    caseStudyIds: ['belgium', 'kenya', 'uae'],
    lists: [
      {
        label: 'Methods for effective communication',
        items: [
          'Public-oriented charts and graphs',
          'Interactive dashboards',
          'Simulations and games',
        ],
      },
    ],
    boxLabel: 'Box 6: Tools for visualising and gamifying energy scenarios',
    box: [
      {
        name: 'Data Visualisation Tools',
        description:
          'Business intelligence tools (Tableau, PowerBI), statistical software (R, Stata), Excel, Python for colourful charts and graphs on dashboards or in publications',
      },
      {
        name: 'Energy Calculators',
        description:
          'Allow users to manipulate assumptions and triggers to form their own scenarios and understand how their behaviour affects the energy transition',
      },
      {
        name: 'Simulations and Games',
        description:
          '"Gamify" scenario communication, allowing users to navigate the energy transition through interactive policies and behaviours. Can be digital (broad audience, continuous updating) or analogue (build understanding of trade-offs)',
      },
    ],
  },
];

/**
 * Step 4 of the Tool Selection Decision Framework. Labels and the Consider
 * column are quoted; `tools` links the named tools to their sections.
 */
export const objectives: Objective[] = [
  {
    id: 'consensus',
    label: 'Build consensus on policy priorities',
    consider: 'Multi-stakeholder workshops, steering committees',
    tools: ['workshops', 'committees'],
  },
  {
    id: 'technical-input',
    label: 'Gather specialised technical input',
    consider: 'Expert interviews, technical working groups, modelling networks/hubs',
    tools: ['interviews', 'committees', 'networks-hubs'],
  },
  {
    id: 'balance-interests',
    label: 'Balance competing stakeholder interests',
    consider: 'Interdisciplinary committees, workshops',
    tools: ['committees', 'workshops'],
  },
  {
    id: 'communicate-results',
    label: 'Communicate complex scenario results',
    consider: 'Visualisation tools, targeted briefings and reports, presentations',
    tools: ['visualisation-games', 'presentations-reports'],
  },
  {
    id: 'public-acceptance',
    label: 'Understand public acceptance concerns',
    consider: 'Surveys, public hearings, focus groups',
    tools: ['surveys', 'presentations-reports'],
  },
  {
    id: 'long-term',
    label: 'Build long-term engagement',
    consider: 'Networks/hubs; steering committees; working groups; workshops',
    tools: ['networks-hubs', 'committees', 'workshops'],
  },
];

export function getTool(id: ToolId): EngagementTool | undefined {
  return engagementTools.find((t) => t.id === id);
}

export function getToolsForPhase(phase: Phase): EngagementTool[] {
  return engagementTools.filter((t) => t.stageApplications[phase] !== undefined);
}

export function getToolsForObjective(objectiveId: string): EngagementTool[] {
  const objective = objectives.find((o) => o.id === objectiveId);
  if (!objective) return [];
  return objective.tools.map(getTool).filter((t): t is EngagementTool => t !== undefined);
}
