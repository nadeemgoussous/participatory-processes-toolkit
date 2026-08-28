// Stakeholder profiles, chapter 3
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Text is quoted from chapter 3. Colours are presentation values; the icons are
// extracted from the chapter 3 section headings by scripts/extract-figures.py.

import type { StakeholderProfile } from '../types/stakeholder';

export const stakeholderProfiles: StakeholderProfile[] = [
  // ------------------------------------------------------------------ 3.1
  {
    id: 'policy-makers',
    name: 'Policy Makers, Administrators and Regulators',
    toolkitSection: '3.1',
    color: '#c94f4f',
    whoAreThey: [
      {
        text: 'Government officials responsible for laws, policies and regulations and their implementation across sectors, including:',
        items: [
          'Energy',
          'Transport',
          'Industry',
          'Environment',
          'Research and development',
          'Agriculture',
          'Climate-focused departments',
        ],
      },
    ],
    whyEngage: [
      {
        text: 'In policy planning contexts, scenarios are developed to guide policy and strategic decisions at national and sub-national levels. The active involvement of policy makers throughout the scenario development process helps to keep scenarios:',
        items: ['Relevant', 'Realistic', 'Aligned with policy needs'],
      },
      {
        label: 'Participation can range from:',
        items: [
          'Initial discussions to define critical policy questions',
          'Collaborative formulation of scenarios that reflect grounded assumptions',
          'Clear communication of results to inform policy',
        ],
      },
      {
        text: 'Effective cross-sectoral co-ordination among policy makers also supports various data-sharing efforts and the alignment of investment and strategies across a highly interconnected energy system.',
      },
    ],
    benefit: [
      {
        text: 'Understanding the process and limitations of scenario development and trade-offs between scenarios can help decision making, including through assessment of the implications and impacts of policy measures.',
      },
    ],
    challenges: [
      {
        challenge: 'Limited understanding of scenario concept',
        description:
          'Purpose and limitations of scenario analysis as a forecasting, predictive or exploratory tool may not be clear',
      },
      {
        challenge: 'Political perspective',
        description:
          'Balancing different political visions, priorities and insights might prove challenging',
      },
      {
        challenge: 'Knowledge gaps',
        description:
          'Many policy makers who influence energy policy are not necessarily specialists in energy systems',
      },
      {
        challenge: 'Time constraints',
        description:
          'Most policy makers have busy schedules and might not have the ability to engage in long participatory processes or read long reports',
      },
    ],
    goodPractices: [
      "Preparing succinct briefs and visuals that can address policy makers' direct concerns and priorities",
      'Explaining what modelling tools can and cannot do, and which concerns can be addressed within these tools',
      'Using non-biased intermediaries to facilitate discussion with diverse groups of policy makers to avoid perceived bias',
      'Conducting capacity-building exercises for policy makers and their staff to help guide decision making',
    ],
    summary: {
      primaryValue: 'Keep scenarios relevant and aligned with policy needs',
      keyChallenge: 'Time constraints, knowledge gaps',
      criticalGoodPractice: 'Succinct briefs and capacity-building',
    },
  },

  // ------------------------------------------------------------------ 3.2
  {
    id: 'grid-operators',
    name: 'Grid Operators',
    toolkitSection: '3.2',
    color: '#4f7ec9',
    whoAreThey: [
      {
        text: 'Grid system operators refer to the entities responsible for operating and often developing power and gas networks (both transmission and distribution).',
      },
    ],
    whyEngage: [
      {
        text: 'Engaging both electricity and gas grid operators is crucial because of their:',
        items: [
          'Deep understanding of grid dynamics',
          'Knowledge of infrastructure limitations',
          'Understanding of operational challenges posed by the energy transition',
          'Technical expertise',
          'Historical and real-time data',
          'Future expansion plans',
        ],
      },
      {
        text: 'By aligning their scenarios with national energy plans and involving them in public engagement, grid operators help ensure a co-ordinated and resilient transition, particularly as the integration of renewables and decarbonised gases reshapes both power and gas networks.',
      },
    ],
    benefit: [
      {
        text: "Ensuring their development plans and other procedures are considered in the country's long-term plans (and vice versa), and that national plans are consistent and consider infrastructural developments and upgrades as needed.",
      },
    ],
    challenges: [
      {
        challenge: 'Established plans',
        description:
          'System operators have existing mid-term plans for grid expansion and upgrades that might necessitate adjustments to wider long-term energy plans',
      },
      {
        challenge: 'Collaboration across voltage levels',
        description:
          'Collaboration mechanisms across different voltage levels or energy vectors (power and gas) might be weak or non-existent',
      },
      {
        challenge: 'Policy maker awareness',
        description:
          "Electricity and gas grids' pivotal role in the energy transition is often underestimated by policy makers",
      },
      {
        challenge: 'Compatibility of plans',
        description:
          'In countries with many TSOs and DSOs, reconciling plans for different regions, sectors and jurisdictions might be complex',
      },
    ],
    goodPractices: [
      'Engaging early with grid operators to incorporate existing plans and limitations into the planning process',
      'Engaging with distribution-level operators to ensure compatibility with local conditions',
      'Including regulators responsible for issuing permits to grid operators ensures alignment of legal and regulatory frameworks',
      'Involving grid operators can help ensure that the most cost-efficient solutions will be prioritised',
    ],
    summary: {
      primaryValue: 'Technical expertise and infrastructure knowledge',
      keyChallenge: 'Reconciling existing plans',
      criticalGoodPractice: 'Early engagement to incorporate limitations',
    },
  },

  // ------------------------------------------------------------------ 3.3
  {
    id: 'industry',
    name: 'Industry and Business Representatives',
    toolkitSection: '3.3',
    color: '#c98a4f',
    whoAreThey: [
      {
        text: 'A diverse set of stakeholders spanning multiple sectors of the economy encompassing both established players and new entrants, including:',
        items: [
          'Energy-intensive industries',
          'Manufacturers',
          'Logistics companies',
          'Small- and medium-sized enterprises (SMEs)',
          'Renewable energy developers',
          'Energy efficiency solution providers',
          'Carbon capture technology companies',
          'Non-energy sectors',
        ],
      },
    ],
    whyEngage: [
      {
        text: 'Industry players are central to achieving the energy transition because of their:',
        items: [
          'Significant energy use',
          'Emissions footprint',
          'Innovation potential',
          'Technical expertise',
          'Practical experience in implementing low-carbon technologies',
        ],
      },
      {
        text: 'Technology developers contribute detailed knowledge about:',
        items: ['Costs', 'Scalability challenges', 'Technology readiness'],
      },
      {
        text: 'Sectors such as shipping, logistics, aviation, agriculture and automotive provide essential perspectives on sector-specific changes in energy use and technological possibilities.',
      },
    ],
    benefit: [
      {
        items: [
          'Preserving their business interests',
          'Adjusting business models as necessary',
          'Better positioning competitively by anticipating and preparing for strengthening climate policies',
          'Supporting climate-related financial disclosures by aligning business and national targets',
        ],
      },
    ],
    challenges: [
      {
        challenge: 'Diverse interests',
        description: 'Different industrial sectors have varied priorities and challenges',
      },
      {
        challenge: 'Confidentiality concerns',
        description: 'Industries may be reluctant to share proprietary or sensitive information',
      },
      {
        challenge: 'Balancing economic and environmental goals',
        description: 'Especially challenging in fossil-fuel–reliant sectors',
      },
      {
        challenge: 'Communication gap',
        description:
          'Energy experts may lack knowledge of business specificities, while industry may lack understanding of the broader energy system',
      },
      {
        challenge: 'Balancing national and international goals',
        description:
          'Companies bound by foreign parent company targets may struggle to align with national objectives',
      },
      {
        challenge: 'Different time horizons',
        description: 'The private sector typically has a shorter planning time horizon',
      },
    ],
    goodPractices: [
      'Conducting thorough stakeholder mapping to identify relevant stakeholders needed at different stages',
      'Co-developing sector scenarios with associations to incorporate findings into national planning',
      'Placing limits on lobbying influence and balancing views appropriately to avoid unbalanced power dynamics',
    ],
    summary: {
      primaryValue: 'Innovation potential and implementation experience',
      keyChallenge: 'Confidentiality, diverse interests',
      criticalGoodPractice: 'Stakeholder mapping and sector co-development',
    },
  },

  // ------------------------------------------------------------------ 3.4
  {
    id: 'public',
    name: 'General Public and Local Communities',
    toolkitSection: '3.4',
    color: '#4fc98a',
    whoAreThey: [
      {
        text: 'The general public, or sometimes leaders or representatives of communities based on:',
        items: [
          'Locality',
          'Identity (e.g. indigenous groups)',
          'Other means of demographic classification (e.g. age group or income level)',
        ],
      },
      { text: "These usually represent their group's interest." },
    ],
    whyEngage: [
      {
        text: 'Planning for a just energy transition requires a collective effort that is led by the public while also paying attention to the most vulnerable in society.',
      },
      {
        label: 'Key considerations:',
        items: [
          'Social acceptance by communities is vital for renewables and infrastructure project development',
          'Energy efficiency, technology adoption and change in consumer behaviour patterns are key to reaching sectoral targets',
          'The transition will have effects that must be communicated to citizens, such as price changes',
          'They may be voters who can indirectly or directly affect policy decisions',
        ],
      },
    ],
    benefit: [
      {
        text: "Local communities and the public at large can help shape a just transition that considers citizens' needs and concerns, allowing them to learn about their role in facilitating this transition.",
      },
    ],
    challenges: [
      {
        challenge: 'Generating interest',
        description: 'Scenario development processes are unfamiliar to the public',
      },
      {
        challenge: 'Knowledge gaps',
        description:
          'Technical concepts found in energy system analysis might not be familiar to most',
      },
      {
        challenge: 'Time constraints',
        description: 'Jobs, childcare and other responsibilities may limit time available',
      },
      {
        challenge: 'Ensuring inclusivity',
        description:
          'Certain members of the public might be more likely to join, creating an unbalanced snapshot',
      },
    ],
    goodPractices: [
      'Starting discussions from perceived existing issues and concerns, as opposed to simply attempting to visualise a perfectly just scenario',
      'Leveraging existing engagement platforms (local town halls or community spaces)',
      'Identifying and training members of planning staff from local communities to act as focal points',
      'Keeping registries to maintain communication with interested participants and monitor inclusivity',
      'Including decentralised actors, such as community energy projects',
      'Publishing plans online to broaden consultation possibilities',
      'Allocating necessary time to ensure effective engagement',
      'Offering online and in-person options to participate',
    ],
    summary: {
      primaryValue: 'Social acceptance and just transition input',
      keyChallenge: 'Generating interest, inclusivity',
      criticalGoodPractice: 'Focal points and accessible communication',
    },
  },

  // ------------------------------------------------------------------ 3.5
  {
    id: 'csos-ngos',
    name: 'Civil Society Organisations and Non-Governmental Organisations',
    toolkitSection: '3.5',
    color: '#8a4fc9',
    whoAreThey: [
      {
        text: 'Civil society organisations (CSOs) and non-governmental organisations (NGOs) typically denote different types of non-profit institutions such as:',
        items: [
          'Trade unions',
          'Environmental advocacy groups',
          'Humanitarian organisations',
          'Charities',
        ],
      },
    ],
    whyEngage: [
      {
        text: 'CSOs and NGOs typically form a crucial role in representing various interests held by the public.',
      },
      {
        label: 'Examples:',
        items: [
          'Trade unions can represent workers from different sectors affected by the energy transition',
          'Environmental and humanitarian advocacy groups can present evidence-based research and analysis to highlight issues, benefits and impacts',
        ],
      },
    ],
    benefit: [
      {
        text: 'They can ensure the collective representation of the concerns arising from their social and environmental mandates, to help shape a just and sustainable transition.',
      },
    ],
    challenges: [
      {
        challenge: 'Diverse perspectives',
        description: 'Wide array of represented viewpoints can lead to conflicting interests',
      },
      {
        challenge: 'Resource constraints',
        description: 'Many CSOs and NGOs operate with limited resources',
      },
      {
        challenge: 'Communication barriers',
        description:
          'Effective communication between technical experts and representatives can be challenging',
      },
      {
        challenge: 'Inclusivity and representation',
        description:
          'Ensuring all relevant voices, especially from underrepresented groups, is challenging',
      },
    ],
    goodPractices: [
      'Ensuring transparent and consistent communications from the outset over time to build trust, including explaining how inputs are incorporated into the results',
      'Maintaining political neutrality in activities to avoid alienating different groups',
      'Providing technical knowledge through preparatory courses or briefing',
      'Conducting thorough stakeholder mapping to ensure affected stakeholders are engaged',
      'Communicating clearly how inputs will be taken or not taken in the plans',
    ],
    summary: {
      primaryValue: 'Representing diverse societal interests',
      keyChallenge: 'Resource constraints',
      criticalGoodPractice: 'Transparent communication on how inputs are used',
    },
  },

  // ------------------------------------------------------------------ 3.6
  {
    id: 'scientific',
    name: 'Scientific Institutions',
    toolkitSection: '3.6',
    color: '#4fb8c9',
    whoAreThey: [
      {
        text: 'Members of the scientific community, including researchers and experts working at:',
        items: ['Universities', 'Research institutions'],
      },
      {
        text: 'This could include:',
        items: [
          'Energy and power system experts',
          'Economists',
          'Natural scientists',
          'Researchers in the social sciences',
        ],
      },
    ],
    whyEngage: [
      {
        text: 'Scientific institutions play an important role in many national energy planning processes, whether through:',
        items: [
          'Building modelling capacity',
          'Conducting the modelling',
          'Providing system-specific expertise, data and feedback',
        ],
      },
      {
        label: 'Benefits:',
        items: [
          'Enable more robust scenarios through rigorous scientific methodologies and quality assurance',
          'Promote inter-institutional knowledge exchange',
          'Provide key contributions from interdisciplinary experts who can facilitate the inclusion of qualitative socio-political and environmental insights',
        ],
      },
    ],
    benefit: [
      {
        items: [
          'Leverage subject matter expertise and research to contribute to energy planning and create social and policy impact',
          'Access funding opportunities',
          'Strengthen reputations in action-oriented research',
          'Possibly access real-time data',
          'Enhance partnerships with decision makers',
        ],
      },
    ],
    challenges: [
      {
        challenge: 'Professional constraints',
        description:
          'Engaging in consultations might take time away from research, teaching and other professional engagements',
      },
      {
        challenge: 'Balancing independence',
        description:
          'Academics value their independence and might be cautious about processes that appear politically influenced',
      },
      {
        challenge: 'Lack of funding',
        description:
          'Scientists may face a lack of funding for activities not related to their main research grants',
      },
    ],
    goodPractices: [
      'Establishing and providing resources as a mechanism for continuous engagement with the scientific community (see Canada case study)',
      'Promoting transparency and open-source data in scenario modelling, enabling academia and other independent experts to review, validate and contribute',
      'Promoting independent scientific institutions as a conduit for wider stakeholder engagement to increase trust',
      'Providing funding through grants and tenders to ensure continuous and consistent academic engagement',
    ],
    summary: {
      primaryValue: 'Rigorous methodologies and interdisciplinary expertise',
      keyChallenge: 'Professional constraints',
      criticalGoodPractice: 'Mechanisms for continuous engagement',
    },
  },

  // ------------------------------------------------------------------ 3.7
  {
    id: 'finance',
    name: 'Financial Institutions',
    toolkitSection: '3.7',
    color: '#c9a84f',
    whoAreThey: [
      {
        text: 'The finance sector includes a wide range of stakeholders:',
        items: [
          'Public finance ministries',
          'National and international financial institutions',
          'Commercial and development banks',
          'Investment funds',
          'Insurers and reinsurers',
          'Other financial entities engaged in funding and investing activities',
        ],
      },
    ],
    whyEngage: [
      {
        text: 'Financial organisations play a pivotal role in the energy transition due to their capacity to:',
        items: [
          'Mobilise funds',
          'Invest in sustainable energy projects and initiatives',
          'Inject necessary capital into energy transition projects',
        ],
      },
      {
        label: 'Key considerations:',
        items: [
          'Involving banks and insurers is critical for understanding de-risking options',
          'Public finance entities play a pivotal role in aligning national budgetary policy with energy transition goals',
          'Private financial institutions can drive investment in innovative technologies',
        ],
      },
    ],
    benefit: [
      {
        text: 'Involving financial institutions early in energy transition planning ensures they understand the challenges, risks, pathways and opportunities, increasing their willingness to contribute and finance projects. Their input in the context of macroeconomics, project feasibility and risk helps refine the plan.',
      },
    ],
    challenges: [
      {
        challenge: 'Aversion to political processes',
        description:
          'Financial institutions may be reluctant to engage in processes that appear political',
      },
      {
        challenge: 'Diverse mechanisms and interests',
        description: 'Financial entities have varied investment strategies and risk appetites',
      },
    ],
    goodPractices: [
      'Involving key finance departments early in energy planning ensures effective integration of financial and energy policies',
      'Engaging financial institutions early allows the examination of limitations, blind spots and opportunities in supporting low-carbon development',
      'Working together on specialised tools to communicate the financial implications of energy transitions',
    ],
    summary: {
      primaryValue: 'Capital mobilisation and de-risking expertise',
      keyChallenge: 'Aversion to political processes',
      criticalGoodPractice: 'Early involvement in planning',
    },
  },
];

export function getProfile(id: string): StakeholderProfile | undefined {
  return stakeholderProfiles.find((p) => p.id === id);
}
