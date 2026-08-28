// Stakeholder profiles, chapter 3
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Generated from the PDF by scripts/extract-stakeholders.py. The markdown
// transcription reworded this chapter, turned prose into bullet lists that the
// publication does not have, and invented a summary matrix, so the text here
// comes from the publication itself.
//
// Colours are presentation values. Icons come from the section headings, via
// scripts/extract-figures.py.

import type { StakeholderProfile } from '../types/stakeholder';

export const stakeholderProfiles: StakeholderProfile[] = [
  {
    id: 'policy-makers',
    name: 'Policy Makers, Administrators and Regulators',
    toolkitSection: '3.1',
    color: '#c94f4f',
    whoAreThey: [
      {
        text:
          'Government officials responsible for laws, policies and regulations and their implementation across sectors, including energy, transport, industry, environment, research and development, agriculture and climate-focused departments.',
      },
    ],
    whyEngage: [
      {
        text:
          'In policy planning contexts, scenarios are developed to guide policy and strategic decisions at national and sub-national levels. The active involvement of policy makers throughout the scenario development process helps to keep scenarios relevant, realistic and aligned with policy needs. The participation of policy makers and regulators with the energy planning teams can range from initial discussions to define critical policy questions to collaborative formulation of scenarios that reflect grounded assumptions, and ultimately to clear communication of results to inform policy. Effective cross-sectoral co‑ordination among policy makers also supports various data-sharing efforts and the alignment of investment and strategies across a highly interconnected energy system.',
      },
    ],
    benefit: [
      {
        text:
          'Understanding the process and limitations of scenario development and trade-offs between scenarios can help decision making, including through assessment of the implications and impacts of policy measures.',
      },
    ],
    challenges: [
      {
        challenge: 'Limited understanding of scenario concept',
        description:
          'Purpose and limitations of scenario analysis as a forecasting, predictive or exploratory tool may not be clear, which may affect policy makers’ expectations for the use of the scenarios.',
      },
      {
        challenge: 'Political perspective',
        description:
          'Balancing different political visions, priorities and insights might prove challenging.',
      },
      {
        challenge: 'Knowledge gaps',
        description:
          'Many policy makers and sector experts who influence energy policy are not necessarily specialists in energy systems. Bridging this gap through education - or less technical communication - can help ensure more informed decision making.',
      },
      {
        challenge: 'Time constraints',
        description:
          'Most policy makers have busy schedules and might not have the ability to engage in long participatory processes or read long reports.',
      },
    ],
    goodPractices: [
      'Preparing succinct briefs and visuals that can address policy makers’ direct concerns and priorities.',
      'Explaining what modelling tools can and cannot do, and which concerns can be addressed within these tools.',
      'Using non-biased intermediaries to facilitate discussion with diverse groups of policy makers to avoid perceived bias.',
      'Conducting capacity-building exercises for policy makers and their staff to help guide decision making.',
    ],
  },

  {
    id: 'grid-operators',
    name: 'Grid Operators',
    toolkitSection: '3.2',
    color: '#4f7ec9',
    whoAreThey: [
      {
        text:
          'Grid system operators refer to the entities responsible for operating and often developing power and gas networks (both transmission and distribution).',
      },
    ],
    whyEngage: [
      {
        text:
          'Engaging both electricity and gas grid operators is crucial because of their deep understanding of grid dynamics, infrastructure limitations and the operational challenges posed by the energy transition. Their technical expertise, historical and real-time data, and future expansion plans make them key players in ensuring grid stability and security as energy systems evolve towards a higher share of variable renewable energy (VRE). By aligning their scenarios with national energy plans and involving them in public engagement, grid operators help ensure a co‑ordinated and resilient transition, particularly as the integration of renewables and decarbonised gases reshapes both power and gas networks.',
      },
    ],
    benefit: [
      {
        text:
          'Ensuring their development plans and other procedures are considered in the country’s long-term plans (and vice versa), and that national plans are consistent and consider infrastructural developments and upgrades as needed.',
      },
    ],
    challenges: [
      {
        challenge: 'Established plans',
        description:
          'System operators have existing mid-term plans for grid expansion and upgrades that might necessitate adjustments to wider long-term energy plans. Gas grids may need to accommodate decarbonised gases, requiring infrastructure investment.',
      },
      {
        challenge: 'Collaboration across voltage levels and energy vectors',
        description:
          'Collaboration mechanisms across different voltage levels or energy vectors (power and gas) might be weak or non-existent, especially with distribution-level operators who could provide robust demand data.',
      },
      {
        challenge: 'Policy maker awareness and perception',
        description:
          'Electricity and gas grids’ pivotal role in the energy transition is often underestimated by policy makers, who have only recently begun to prioritise it, viewing it more as an obstacle to renewables than an enabler. Although infrastructure lock-ins are possible, gas infrastructure could also play a role in transporting decarbonised gases and balancing renewable energy supply.',
      },
      {
        challenge: 'Compatibility of plans',
        description:
          'In countries with many TSOs and DSOs, reconciling plans for different regions, sectors and jurisdictions might be a complex task (IRENA, 2020).',
      },
    ],
    goodPractices: [
      'Engaging early with grid operators to incorporate existing plans and limitations into the planning process.',
      'Engaging with distribution-level operators to ensure compatibility with local conditions and identify any vital issues (e.g. technical) that might affect planning.',
      'Including regulators responsible for issuing permits to grid operators ensures that the energy system’s legal and regulatory framework aligns with national scenarios and transition goals. This approach also aids in streamlining approvals for necessary infrastructure upgrades and expansions.',
      'Involving grid operators can help to ensure that the most cost-efficient solutions will be prioritised, reducing the costs of the energy system at large.',
    ],
  },

  {
    id: 'industry',
    name: 'Industry and Business Representatives',
    toolkitSection: '3.3',
    color: '#c98a4f',
    whoAreThey: [
      {
        text:
          'A diverse set of stakeholders spanning multiple sectors of the economy encompassing both established players and new entrants, including energy-intensive industries, manufacturers, logistics companies, small- and medium-sized enterprises (SMEs), renewable energy developers, energy efficiency solution providers, and carbon capture technology companies, as well as non-energy sectors.',
      },
    ],
    whyEngage: [
      {
        text:
          'Industry players are central to achieving the energy transition because of their significant energy use, emissions footprint and innovation potential. Their technical expertise and practical experience in implementing low-carbon technologies provide crucial insights into decarbonisation barriers and opportunities. Technology developers contribute detailed knowledge about costs, scalability challenges and technology readiness, enabling the creation of more comprehensive and realistic transition scenarios that reflect their future pathways and strategies. Sectors such as shipping, logistics, aviation, agriculture and automotive provide essential perspectives on sector-specific changes in energy use and technological possibilities, helping to shape more robust energy plans and pathways. Their understanding of supply chains and market dynamics is vital for identifying intervention points for emissions reduction. Countries have also engaged with industry players to develop consensus on national plans and understand the vision of various sectors for incorporation within these strategies.',
      },
    ],
    benefit: [
      {
        text:
          'Engagement helps them preserve their business interests and adjust their business models as necessary. Companies can better position themselves competitively by anticipating and preparing for strengthening climate policies and changing market demands. Climate-related financial disclosures could also be supported by aligning business and national targets and plans.',
      },
    ],
    challenges: [
      {
        challenge: 'Diverse interests and priorities',
        description:
          'Different industrial sectors have varied priorities and challenges, making it difficult to develop a one-size-fits-all approach to the scenario process.',
      },
      {
        challenge: 'Confidentiality concerns',
        description:
          'Industries may be reluctant to share proprietary or sensitive information that could be crucial for accurate scenario modelling.',
      },
      {
        challenge: 'Balancing economic and environmental goals',
        description:
          'Balancing industrial growth and competitiveness with sustainability goals is challenging, especially in fossil-fuel–reliant sectors, compromising buy-in.',
      },
      {
        challenge: 'Communication gap',
        description:
          'Energy experts may lack knowledge of business specificities, while industry may lack understanding of the broader energy system.',
      },
      {
        challenge: 'Balancing national and international goals',
        description:
          'Companies bound by foreign parent company targets may struggle to align with national government objectives.',
      },
      {
        challenge: 'Different time horizons',
        description:
          'The private sector typically has a shorter planning time horizon and may not see value in long-term planning.',
      },
    ],
    goodPractices: [
      'Conducting thorough stakeholder mapping to identify relevant stakeholders needed at the different stages.',
      'Co-developing sector scenarios with associations to incorporate findings into national planning.',
      'Placing limits on lobbying influence and balancing views appropriately to avoid unbalanced power dynamics.',
    ],
  },

  {
    id: 'public',
    name: 'General Public and Local Communities',
    toolkitSection: '3.4',
    color: '#4fc98a',
    whoAreThey: [
      {
        text:
          'The general public, or sometimes leaders or representatives of communities based on locality, identity (e.g. indigenous groups) or other means of demographic classification (e.g. age group or income level), who usually represent their group’s interest.',
      },
    ],
    whyEngage: [
      {
        text:
          'Planning for a just energy transition requires a collective effort that is led by the public while also paying attention to the most vulnerable in society. Social acceptance by communities, for instance, is vital for renewables and accompanying infrastructure project development. Energy efficiency, technology adoption and change in consumer behaviour patterns are also key to reaching sectoral targets in the residential and transport sectors. The transition will also have effects that must be communicated to citizens, such as price changes and other policy shifts. They may also be voters who can indirectly or directly affect policy decisions.',
      },
    ],
    benefit: [
      {
        text:
          'Local communities and the public at large can help shape a just transition that considers citizens’ needs and concerns, allowing them to learn about their role in facilitating this transition.',
      },
    ],
    challenges: [
      {
        challenge: 'Generating interest',
        description:
          'Scenario development processes are unfamiliar to the public and inviting participants requires a clear framing of the objectives of such projects.',
      },
      {
        challenge: 'Knowledge gaps',
        description:
          'Technical concepts found in energy system analysis might not be familiar to most, and such gaps might affect the quality of participation in the process.',
      },
      {
        challenge: 'Time constraints',
        description:
          'Jobs, childcare and other responsibilities may limit the time that members of the public can afford for these processes, especially affecting the most vulnerable.',
      },
      {
        challenge: 'Ensuring inclusivity',
        description:
          'Certain members of the public (e.g. those with more time available) might be more likely to join, creating an unbalanced snapshot of societal perspectives.',
      },
    ],
    goodPractices: [
      'Starting discussions from perceived existing issues and concerns, as opposed to simply attempting to visualise a perfectly just scenario.',
      'Leveraging existing engagement platforms (local town halls or community spaces) to secure stakeholder participation in a familiar environment.',
      'Identifying and training members of planning staff from local communities to act as focal points to enable continuous dialogue and address community concerns.',
      'Keeping registries to maintain communication with interested participants and monitor inclusivity and the diversity of representatives.',
      'Including decentralised actors, such as community energy projects, in the public engagement.',
      'Publishing plans online to broaden consultation possibilities for the general public.',
      'Allocating the necessary time to ensure effective engagement with local communities.',
      'Offering online and in-person options to participate in participatory activities.',
    ],
  },

  {
    id: 'csos-ngos',
    name: 'Civil Society Organisations and Non-Governmental Organisations',
    toolkitSection: '3.5',
    color: '#8a4fc9',
    whoAreThey: [
      {
        text:
          'Civil society organisations (CSOs) and non-governmental organisations (NGOs) typically denote different types of non-profit institutions such as trade unions, environmental advocacy groups, humanitarian organisations, charities and others.',
      },
    ],
    whyEngage: [
      {
        text:
          'CSOs and NGOs typically form a crucial role in representing various interests held by the public. For example, trade unions can represent workers from different sectors, many of which will be affected by the energy transition, and thus have a critical stake in delivering the insights of their constituents to the energy planning process to ensure a just transition. Similarly, environmental and humanitarian advocacy groups can present evidence-based research and analysis to highlight issues, benefits and impacts that should be accounted for in long-term national energy plan.',
      },
    ],
    benefit: [
      {
        text:
          'They can ensure the collective representation of the concerns arising from their social and environmental mandates, to help shape a just and sustainable transition.',
      },
    ],
    challenges: [
      {
        challenge: 'Diverse perspectives',
        description:
          'The wide array of represented viewpoints can lead to conflicting interests and priorities, making consensus-building a complex task.',
      },
      {
        challenge: 'Resource constraints',
        description:
          'Many CSOs and NGOs operate with limited resources, which might restrict their ability to participate effectively in lengthy or demanding processes.',
      },
      {
        challenge: 'Communication barriers',
        description:
          'Effective communication between technical experts and representatives can be challenging due to differences in expertise and focus areas.',
      },
      {
        challenge: 'Inclusivity and representation',
        description:
          'Ensuring that all relevant voices, especially those from underrepresented groups, are included in the participatory process can be challenging.',
      },
    ],
    goodPractices: [
      'Ensuring transparent and consistent communications from the outset over time to build trust, including explaining how inputs are incorporated into the results.',
      'Maintaining political neutrality in activities to avoid alienating different groups.',
      'Providing technical knowledge through preparatory courses or briefing to allow for more meaningful engagement.',
      'Conducting thorough stakeholder mapping to ensure affected stakeholders are engaged.',
      'Communicating clearly how inputs will be taken or not taken in the plans.',
    ],
  },

  {
    id: 'scientific',
    name: 'Scientific Institutions',
    toolkitSection: '3.6',
    color: '#4fb8c9',
    whoAreThey: [
      {
        text:
          'Members of the scientific community, including researchers and experts working at universities and research institutions. They could include energy and power system experts, economists and natural scientists, as well as researchers in the social sciences.',
      },
    ],
    whyEngage: [
      {
        text:
          'Scientific institutions play an important role in many national energy planning processes, whether through building modelling capacity, conducting the modelling, or providing system-specific expertise, data and feedback throughout the process, leading to an expansion of the scope of discussion. Stronger systemic engagement with the scientific community can enable more robust scenarios through rigorous scientific methodologies and quality assurance, promote inter-institutional knowledge exchange, and provide key contributions from interdisciplinary experts who can facilitate the inclusion of qualitative socio-political and environmental insights in these scenarios.',
      },
    ],
    benefit: [
      {
        text:
          'They are able to leverage their subject matter expertise and research to contribute to energy planning and create social and policy impact. It also enables them to access funding opportunities, strengthen reputations in action-oriented research, possibly access real-time data and enhance partnerships with decision makers.',
      },
    ],
    challenges: [
      {
        challenge: 'Professional constraints',
        description:
          'Engaging in stakeholder consultations might be a time-consuming activity that takes time away from research, teaching and other professional engagements.',
      },
      {
        challenge: 'Balancing independence',
        description:
          'Academics value their independence. They might be cautious about engaging in processes that appear to be politically influenced.',
      },
      {
        challenge: 'Lack of funding',
        description:
          'Scientists may face a lack of funding for activities not related to some of their main research grants and, as such, may find it difficult to prioritise attending such national planning-related engagements if alternative funding is unavailable.',
      },
    ],
    goodPractices: [
      'Establishing and providing resources as a mechanism for continuous engagement with the scientific community (see section 5.3 case study).',
      'Promoting transparency and open-source data in scenario modelling, enabling academia, research institutes and other independent experts to review, validate and contribute evidence-based feedback that strengthens the national planning process and informs decision making.',
      'Promoting independent scientific institutions as a conduit for wider stakeholder engagement to increase trust and avoid perception of political bias.',
      'Providing funding through grants and tenders to ensure continuous and consistent academic engagement.',
    ],
  },

  {
    id: 'finance',
    name: 'Financial Institutions',
    toolkitSection: '3.7',
    color: '#c9a84f',
    whoAreThey: [
      {
        text:
          'The finance sector includes a wide range of stakeholders, such as public finance ministries, national and international financial institutions, commercial and development banks, investment funds, insurers and reinsurers, and other financial entities engaged in funding and investing activities.',
      },
    ],
    whyEngage: [
      {
        text:
          'Financial organisations play a pivotal role in the energy transition due to their capacity to mobilise funds and invest in sustainable energy projects and initiatives. Their involvement is crucial for injecting the necessary capital into energy transition projects, such as renewable energy deployment, energy efficiency improvements, infrastructure upgrades and new technology deployment. Involving banks and insurers is critical for understanding the de-risking options, which may be particularly important when developing new technologies or pursuing system development in countries facing multiple endemic risks (Lonergan et al., 2023b; Steckel and Jakob, 2018). Public finance entities, such as finance ministries, play a pivotal role in aligning national budgetary policy with energy transition goals, while private financial institutions can drive investment in innovative technologies and sustainable projects.',
      },
    ],
    benefit: [
      {
        text:
          'Involving financial institutions early in energy transition planning ensures they understand the challenges, risks, pathways and opportunities, increasing their willingness to contribute and finance projects. Their input in the context of macroeconomics, project feasibility and risk helps refine the plan, making it attractive to investors and minimising transition risks.',
      },
    ],
    challenges: [
      {
        challenge: 'Aversion to political processes',
        description:
          'Financial institutions may be reluctant to engage in processes that appear political, and they might be unwilling to co-create scenarios with national energy planners, fearing potential reputational risks.',
      },
      {
        challenge: 'Diverse mechanisms and interests',
        description:
          'Financial entities have varied investment strategies and risk appetites, which may make the alignment of priorities challenging for energy planners.',
      },
    ],
    goodPractices: [
      'Involving key finance departments early in energy planning ensures effective integration of financial and energy policies. This approach facilitates streamlined communication and strategic alignment.',
      'Engaging financial institutions early allows the examination of limitations, blind spots and opportunities in supporting low-carbon development.',
      'There is benefit in working together on specialised tools to communicate the financial implications of energy transitions to financial entities, investors and policy makers outside the planning team (see section 4.3.2).',
    ],
  },

];

export function getProfile(id: string): StakeholderProfile | undefined {
  return stakeholderProfiles.find((p) => p.id === id);
}
