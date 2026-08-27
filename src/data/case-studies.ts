// Case studies, chapter 5
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Text is quoted from chapter 5 and from the Summary Table of Case Studies.
// Region, stakeholderIds and toolIds are filtering metadata.

import type { CaseStudy } from '../types/case-study';

export const caseStudies: CaseStudy[] = [
  {
    id: 'belgium',
    name: 'Belgium',
    title: 'Scenarios as a Communication Tool: Youth Engagement via My2050',
    toolkitSection: '5.1',
    intro: [
      'Youth constitute a vital driver for the energy transition. The Climate Change Department of the Federal Public Service Health, Food Chain Safety and Environment aimed to develop a strategy to engage citizens, especially youth, through its energy and climate scenario work.',
      'Under the "Low Carbon Belgium by 2050" initiative, the Belgian government developed their version of My2050, a "calculator" tool enabling citizens and students to envision their own transition scenarios towards a sustainable future.',
      'In 2023, the My2050 tool was updated to allow students to explore net-zero scenarios for Belgium by 2050.',
    ],
    overview: {
      governance: 'Climate Change Department of the Federal Public Service Health',
      scope: 'National and local levels; Transport, buildings, industry, energy and agriculture',
      objectives:
        'Engage citizens, particularly secondary school students, in dialogue on transitioning to net-zero',
    },
    engagementActivities: [
      {
        items: [
          'Nationwide, more than 1,400 sessions and interactive discussions conducted',
          'More than 28,000 pupils have benefited from the support of a climate coach since 2017',
          'Teachers equipped with comprehensive manual to utilise the tool in classroom settings',
        ],
      },
    ],
    keyOutcomes: [
      {
        text: 'The climate coach project aims to inspire and prepare students to make an active contribution to building a climate-neutral society by developing their understanding of the transitioning process.',
      },
    ],
    resources: [
      'Climate Change Department provides financial backing and develops/oversees the project',
      'GoodPlanet (NGO) manages logistics through partnership agreement',
      'Young professional coaches receive training at the start of each year',
    ],
    highlight:
      'Outreach to students through an interactive tool ensures planners reach a broad slice of society who will be active changemakers in the years to come.',
    lessonsLearnt: [
      'Engaging school children ensures broader citizen participation and enhances knowledge and awareness of the energy transition',
      'Transfer of training and teaching knowledge from energy planners to teachers can ensure long-term sustainability and broader reach',
      'Discussing climate neutrality scenarios with pupils is an effective way to communicate important information to both parents and children',
    ],
    summary: {
      planningContext: 'My2050 energy transition education',
      primaryObjectives: 'Build public literacy, engage youth',
      keyStakeholders: 'Students, teachers, general public',
      methodsUsed: 'Interactive calculator, classroom activities',
      transferableElements: 'Educational calculator methodology; youth engagement',
    },
    region: 'Europe',
    stakeholderIds: ['public', 'policy-makers'],
    toolIds: ['visualisation-games'],
  },

  {
    id: 'brazil',
    name: 'Brazil',
    title: 'Partnerships for Stakeholder-Led Net-Zero Scenarios',
    toolkitSection: '5.2',
    intro: [
      "The first phase of the Energy Transition Programme (PTE), run jointly by the Inter-American Development Bank (IDB), the Brazilian Centre for International Relations (CEBRI) and the Energy Research Office (EPE), was established to assess the constraints and potential of Brazil's energy transition.",
    ],
    overview: {
      governance:
        'Jointly run by EPE, IDB (multilateral financing institution) and CEBRI; modelling by CENERGIA',
      scope: 'National; Energy and climate with focus on land use',
      objectives:
        'Build consensus by supporting analysis of critical uncertainties, exploring scenarios and addressing divergences',
    },
    engagementActivities: [
      {
        items: [
          'Partner meetings to validate results',
          'Virtual debates with wide range of stakeholders to map major divergences',
          'Virtual debates to understand convergences and form logic for scenarios',
          'Workshops and webinars to disseminate results',
        ],
      },
    ],
    keyOutcomes: [
      {
        text: 'Three different scenarios converging on Brazil reaching zero-net greenhouse gas emissions in 2050:',
        items: ['Brazil transition', 'Alternative transition', 'Global transition'],
      },
    ],
    resources: ['Total budget for PTE1: USD 284,736 (from IDB, CEBRI, private entities and EPE)'],
    highlight:
      'A jointly developed scenario study between government, a multilateral finance institution and a think tank leveraged the strengths of each institution in a collaborative manner.',
    lessonsLearnt: [
      'Online tools for virtual conferencing and polling were highly effective for reaching stakeholders across the country',
      'Completing surveys within a workshop was more effective than outside workshop hours',
      'Workshop design should be compatible with specific objectives (informing vs. promoting deep exploration and debate)',
    ],
    summary: {
      planningContext: 'Energy Transition Programme',
      primaryObjectives: 'Build consensus by exploring scenarios',
      keyStakeholders: 'Government, finance, private sector, academia',
      methodsUsed: 'Virtual debates, workshops, webinars',
      transferableElements: 'Multi-institutional partnership; virtual engagement',
    },
    region: 'Americas',
    stakeholderIds: ['policy-makers', 'finance', 'industry', 'scientific'],
    toolIds: ['workshops', 'surveys', 'presentations-reports'],
  },

  {
    id: 'canada',
    name: 'Canada',
    title: 'Collaboration with the Scientific Community: The Energy Modelling Hub',
    toolkitSection: '5.3',
    intro: [
      'With the second-largest land mass in the world and a diverse range of energy resources, Canada faces unique challenges in transforming its energy system. Its federal structure adds complexity to national energy planning.',
      'In response, Natural Resources Canada (NRCan) established the Energy Modelling Hub (EMH) in 2022 as a national forum to co-ordinate energy modelling efforts.',
    ],
    overview: {
      governance:
        'University-based structure overseen by independent advisory board (academia, government, private sector)',
      scope: 'Federal and provincial level; Power, energy and climate',
      objectives:
        'Expand access to energy models, data and expertise; strengthen independent modelling capabilities; promote collaborative net-zero efforts',
    },
    engagementActivities: [
      {
        items: [
          'Annual forum',
          'Multi-model comparison forum',
          'Regional and modelling workshops',
          'Technical advisory committees',
          'Open calls to modelling community for model development and applications',
          'Open-source models and tools (IDEA visualisation tool, M3 Platform)',
        ],
      },
    ],
    keyOutcomes: [
      {
        items: [
          'Influenced specific policy developments and energy strategies',
          'Enhanced decision-making through informed insights',
          'Promoted "co-operative federalism" concept',
        ],
      },
    ],
    resources: [
      'CAD 5 million from NRCan',
      'Additional contributions from private foundations and other federal agencies',
      'Permanent staff of six, supported by volunteers from thematic committees',
      'Partners from different universities',
    ],
    highlight:
      'The EMH Forum and workshops successfully convened hundreds of energy modellers, government civil servants and policy makers, fostering direct exchange of insights within the national modelling ecosystem.',
    lessonsLearnt: [
      'An institutional approach combined with "co-operative federalism" aligns effectively with Canada\'s constitutional requirements',
      'The rapid pace of technical change demands input from diverse experts (labour, supply chains, land use)',
      'Open-source models and data play a critical role in enhancing transparency and credibility',
      'Longer-term funding commitments are essential to sustain progress',
    ],
    summary: {
      planningContext: 'Net-zero transition',
      primaryObjectives: 'Co-ordinate modelling activities; foster dialogue',
      keyStakeholders: 'Academia, government, private sector, modellers',
      methodsUsed: 'Energy Modelling Hub, annual forum, committees',
      transferableElements: 'Modelling hub structure; scientific community engagement',
    },
    region: 'Americas',
    stakeholderIds: ['scientific', 'policy-makers', 'industry'],
    toolIds: ['networks-hubs', 'workshops', 'committees'],
  },

  {
    id: 'chile',
    name: 'Chile',
    title: 'Prioritising Public Engagement in Energy Planning',
    toolkitSection: '5.4',
    intro: [
      "Chile's Ministry of Energy aims to enhance citizen and minority involvement in shaping public policy. This commitment was critical to the development of the Long-Term Energy Plan (PELP), which includes developing LTES, pinpointing development zones, and forecasting energy demand and supply.",
    ],
    overview: {
      governance:
        'Led by Ministry of Energy, engaging Mining, Environment and Agriculture ministries; working group with citizens, public institutions and academic support',
      scope: 'National and territorial; Energy and power',
      objectives:
        'Achieve transparency and citizen legitimacy; obtain robust results with diverse perspectives; enhance acceptance of policy decisions',
    },
    engagementActivities: [
      {
        items: [
          'Focused workshops on scenarios, projections and development zones',
          'Public hearings',
          'Consultations and online surveys',
          'Citizen Consultation Registry',
        ],
      },
    ],
    keyOutcomes: [
      {
        text: 'Citizen engagement has been a key feature in the national effort to legitimise the decision-making process and integrate community input.',
      },
    ],
    resources: ['Internal resources of the Ministry of Energy', 'Dedicated team within the ministry'],
    highlight:
      "Chile's Citizen Consultation Registry is an online platform where individuals and organisations formally register to participate. Registrants gain access to all PELP documents and can submit suggestions throughout the process. The registry collects data on region, gender and organisational affiliation, allowing the government to monitor representation and improve participation from underrepresented segments.",
    lessonsLearnt: [
      'Multidisciplinary teams integrating technical and social disciplines are essential for success',
      "Participation's impact relies on the chosen methodology of engagement",
      'This approach has successfully advanced citizen involvement by enabling the ministry to collect input from traditionally underrepresented groups',
    ],
    summary: {
      planningContext: 'National energy planning',
      primaryObjectives: 'Build public trust; ensure inclusive representation',
      keyStakeholders: 'General public, industry, regional communities',
      methodsUsed: 'Workshops, public hearings, consultation registry',
      transferableElements: 'Consultation registry approach; regional workshops',
    },
    region: 'Americas',
    stakeholderIds: ['public', 'industry', 'policy-makers', 'csos-ngos'],
    toolIds: ['workshops', 'surveys', 'presentations-reports'],
  },

  {
    id: 'colombia',
    name: 'Colombia',
    title: 'Shifting from National to Territorial Focus',
    toolkitSection: '5.5',
    intro: [
      "Colombia's energy sector is transitioning from a focus primarily on energy reliability and maximising revenue from coal and oil, to addressing climate goals while ensuring development across all regions.",
      'UPME (Mining Energy Planning Unit) leads this transformation with a participatory approach emphasising territorial inclusion, particularly for previously marginalised regions and indigenous communities.',
    ],
    overview: {
      governance:
        'Planning workshops led by UPME, with multi-sector involvement across ministries, regional authorities and communities',
      scope:
        'National with regional and territorial disaggregation; Energy sector linked to mining, climate action and social development',
      objectives:
        'Shift from centralised to territorial framework; incorporate social dialogue; ensure energy planning contributes to socio-economic development while promoting climate action',
    },
    engagementActivities: [
      {
        items: [
          'Multi-sectoral dialogue forums and workshops across departments and municipalities',
          'Educational and training activities about energy planning processes',
          'Active community involvement in plan development and validation',
          'Collaborative research with universities and regional institutions',
          'Deployment of focal points in key territories',
        ],
      },
    ],
    keyOutcomes: [
      {
        text: 'Since 2023, UPME has engaged:',
        items: ['Over 1,100 participants', 'Across 30 departments and 34 municipalities'],
      },
      {
        text: 'The process has integrated social and environmental variables into energy planning models.',
      },
    ],
    resources: [
      'Dedicated staff for regional engagement',
      'Focal points strategically positioned in key territories',
    ],
    highlight:
      'Colombia\'s innovative "focal points" strategy places UPME staff members directly within communities across the country, creating continuous channels of communication. These focal points belong to the communities they serve, enabling ongoing dialogue with previously underrepresented regions.',
    lessonsLearnt: [
      'Shifting from purely technical to integrated territorial framework requires multi-sectoral dialogue and strategic deployment of focal points',
      'Incorporating socio-environmental variables into models is essential for a just transition',
      'A skilled moderator is vital to ensure engagements with communities are efficient and gather useful insights',
      'The territorial framework must be constantly revised for continuity and stability',
    ],
    summary: {
      planningContext: 'Just energy transition',
      primaryObjectives: 'Incorporate social dialogue; territorial focus',
      keyStakeholders: 'Ministries, indigenous communities, civil society',
      methodsUsed: 'Multi-sectoral forums, territorial focal points',
      transferableElements: 'Territorial focal point strategy',
    },
    region: 'Americas',
    stakeholderIds: ['policy-makers', 'public', 'csos-ngos', 'scientific'],
    toolIds: ['workshops'],
  },

  {
    id: 'cyprus',
    name: 'Cyprus',
    title: 'Reports and Briefs for Delivering Information',
    toolkitSection: '5.6',
    intro: [
      'Policy makers and finance ministries sometimes have limited time to read and analyse energy and climate plans. The Cyprus National Energy and Climate Plan involves comprehensive stakeholder engagement and information dissemination, focused on energy transition and financing intricacies.',
    ],
    overview: {
      governance:
        'Ministries of Finance and Environment co-ordinate; The Cyprus Institute conducts scenario development and outreach; supported by Energy and Transport ministries',
      scope: 'National, aligned with EU targets; Energy and climate',
      objectives:
        'Effectively communicate energy scenarios, investment requirements and policy impacts; facilitate informed decision making',
    },
    engagementActivities: [
      {
        items: [
          'Short, concise policy briefs tailored to inform different stakeholders',
          'Clear, simple graphs and visualisation tools to illustrate complex scenarios',
          'Raising public awareness about cost-effective energy measures',
          'Addressing financial needs of vulnerable households',
        ],
      },
    ],
    keyOutcomes: [
      {
        items: [
          'Enhanced understanding and decision-making capacity through targeted communication',
          'Successful alignment of financial strategies with energy policies',
          'Strong stakeholder engagement breaking down silos within state departments',
        ],
      },
    ],
    resources: [
      'Teams from various technical committees across ministries and national authorities',
      'Co-ordinated by Directorate-General for Growth in the Ministry of Finance and Ministry of Environment',
    ],
    highlight:
      'The Cyprus Institute produces short and concise briefs that provide model-supported insights into proposed policies and measures, frequently targeting specific sectors. For example, for advising on suggested increase in biofuel blend, the institute produces a brief on projected impact on automotive fuel prices.',
    lessonsLearnt: [
      'Involving key government departments (like Finance Ministry) ensures streamlined communication and effective integration of financial considerations',
      'Clear and concise communication tools (policy briefs with key indicators and simple visuals) are essential for conveying complex scenarios',
      'Enhanced stakeholder participation supports proactive planning',
    ],
    summary: {
      planningContext: 'National Energy and Climate Plan',
      primaryObjectives: 'Communicate scenarios to policy makers',
      keyStakeholders: 'Ministries, national authorities, vulnerable households',
      methodsUsed: 'Policy briefs, visualisation tools',
      transferableElements: 'Policy brief development; sector-specific communication',
    },
    region: 'Europe',
    stakeholderIds: ['policy-makers', 'finance', 'public'],
    toolIds: ['presentations-reports', 'visualisation-games', 'committees'],
  },

  {
    id: 'finland',
    name: 'Finland',
    title: 'Research Institutions as Primary Conveners',
    toolkitSection: '5.7',
    intro: [
      'Finland has an ambitious target to reach net-zero by 2035. VTT Technical Research Centre of Finland, a state-owned research company, supports the government by combining qualitative foresight methods with quantitative scenario modelling in interactive processes.',
    ],
    overview: {
      governance:
        'NECP, LT-LEDS and LTES led by Ministry of Economic Affairs and Employment, conducted by VTT',
      scope:
        'National; All energy and greenhouse gas emission sectors, land-use sector, national economy',
      objectives:
        'Formulate shared vision with stakeholders; create alternative pathways; develop environment for learning',
    },
    engagementActivities: [
      {
        items: [
          'Interactive workshops for vision and storyline formulation (World Cafés, Futures Wheel, Me-We-Us, PESTEL templates)',
          'Stakeholder and expert interviews and large surveys (consumer surveys)',
          'Intermediate and final seminars for validation and feedback',
          'Publication of synthesis reports and sectoral reports',
          'National industrial federations created their own low-carbon roadmaps as inputs',
        ],
      },
    ],
    keyOutcomes: [
      {
        text: 'Development of various LTES and Carbon Neutrality for 2035 Roadmaps. Finland has a long tradition of active dialogue between policy makers, stakeholders and research organisations, with increased transparency and acceptance of plans.',
      },
    ],
    resources: [],
    highlight:
      'A long-standing history of facilitating active dialogue has encouraged stakeholders from different industries to consistently engage in planning activities, showcasing how local industries can effectively contribute to energy planning.',
    lessonsLearnt: [
      'A well-structured process is key, covering scenario formulation, data gathering, analysis and feedback loops',
      'LTES development, being complex and multidisciplinary, demands multidisciplinary skills',
      'Involving stakeholders, including citizens, is vital; effective prioritisation of engagement at different stages is essential given limited resources',
    ],
    summary: {
      planningContext: 'Carbon neutrality by 2035',
      primaryObjectives: 'Create shared vision; develop sector roadmaps',
      keyStakeholders: 'Industry federations, government, citizens',
      methodsUsed: 'Interactive workshops, surveys, sector roadmaps',
      transferableElements: 'Interactive workshop methods; sector roadmap process',
    },
    region: 'Europe',
    stakeholderIds: ['scientific', 'industry', 'policy-makers', 'public'],
    toolIds: ['workshops', 'surveys', 'interviews', 'presentations-reports'],
  },

  {
    id: 'ghana',
    name: 'Ghana',
    title: 'Consultation as a Strategic Approach',
    toolkitSection: '5.8',
    intro: [
      'Ghana has a Strategic National Energy Plan initiative, led by the Ministry of Energy, demonstrating commitment to achieving climate neutrality by 2070.',
      'The Energy Commission provides technical support for modelling, scenario development and analysis. The process is characterised by intensive stakeholder engagement.',
    ],
    overview: {
      governance:
        'Energy Planning Committee formed under Energy Commission; High-level Steering Committee (including Ministries of Energy and Finance); Technical Committee of sectoral experts',
      scope: 'National; Energy',
      objectives: 'Develop consensus across the energy sector',
    },
    engagementActivities: [
      {
        items: [
          'Setting up the Energy Planning Committee comprising technical and steering committees',
          'Engaging stakeholders in scenario development through workshops',
          'Gathering feedback, refining plans, and consensus-building for finalisation',
        ],
      },
    ],
    keyOutcomes: [
      {
        text: "Collaborative and consensus-driven path towards realisation of Ghana's energy transition goals.",
      },
    ],
    resources: [],
    highlight:
      'Clear stakeholder mapping and identification allowed a targeted approach to engaging stakeholders. The Energy Commission identified and invited specific organisations from different categories (government ministries, regulatory bodies, state enterprises, private sector, NGOs, academic institutions, media). Participants are strategically assigned to relevant committees based on technical expertise.',
    lessonsLearnt: [
      'Physical meetings with stakeholders are the most effective way to facilitate participatory processes in Ghana',
      'Engaging in participatory processes allows for analysis of various risks and uncertainties',
      'Building relationships and trust with stakeholders is time-consuming but crucial',
    ],
    summary: {
      planningContext: 'Strategic National Energy Plan',
      primaryObjectives: 'Develop sector-wide consensus',
      keyStakeholders: 'Regulatory agencies, utilities, policy makers, CSOs',
      methodsUsed: 'Energy Planning Committee, workshops, feedback sessions',
      transferableElements: 'Structured committee approach; stakeholder mapping',
    },
    region: 'Africa',
    stakeholderIds: ['policy-makers', 'grid-operators', 'csos-ngos', 'industry'],
    toolIds: ['committees', 'workshops', 'surveys'],
  },

  {
    id: 'panama',
    name: 'Panama',
    title: 'Stakeholder Consultation to Democratise Energy Planning',
    toolkitSection: '5.9',
    intro: [
      'Under its National Energy Plan (PEN) and Energy Transition Agenda (ATE), Panama aimed to achieve societal buy-in for grid expansion and renewable energy to address energy access and energy poverty.',
      'The Secretariat of Energy initiated a robust engagement process, investing 15,000 hours in consultations.',
    ],
    overview: {
      governance: "Led by Panama's Secretariat of Energy",
      scope: 'National level with insights from local communities',
      objectives:
        "Democratise Panama's energy transition; secure societal acceptance for robust, sustainable energy policy and grid expansion",
    },
    engagementActivities: [
      {
        items: [
          '15,000 hours of consultations over three years',
          'Creation of white paper for grid innovation',
          'Nationwide discussions with civil society, private sector, utilities, indigenous communities, local leaders and technical partners',
          'Online public review of proposed energy bill',
        ],
      },
    ],
    keyOutcomes: [
      {
        items: [
          "Development of transformative law to democratise Panama's energy transition",
          'Identification of necessary regulatory adjustments',
          'Creation of strategic innovation plan for grid system',
          'Societal inclusion effort leading to adapted bill ready for presidential approval',
        ],
      },
      {
        text: "Panama's consultative approach directly resulted in concrete policy outcomes, including regulatory adjustments affecting 30% of the 242 action lines identified across their energy transition strategies.",
      },
    ],
    resources: [],
    highlight:
      'Extensive consultations across the country with often-neglected groups, within a clear framing of democratising the energy transition in Panama.',
    lessonsLearnt: [
      'Investing significant time and resources in consultations ensures issues like energy access and poverty are addressed comprehensively',
      'Explicitly including marginalised groups promotes democratic transition and ensures representation',
      'Prioritising public acceptance and support is critical for grid expansion and renewable energy projects',
    ],
    summary: {
      planningContext: 'Grid expansion and renewable energy',
      primaryObjectives: 'Democratise energy planning; address energy access',
      keyStakeholders: 'Civil society, private sector, indigenous communities',
      methodsUsed: '15,000 hours consultations, white paper, nationwide discussions',
      transferableElements: 'Energy democratisation framework; indigenous engagement',
    },
    region: 'Americas',
    stakeholderIds: ['csos-ngos', 'public', 'industry', 'grid-operators'],
    toolIds: ['surveys', 'presentations-reports'],
  },

  {
    id: 'uae',
    name: 'United Arab Emirates',
    title: 'Leveraging Bottom-Up and Top-Down Stakeholder Engagement',
    toolkitSection: '5.10',
    intro: [
      'For its UAE Energy Strategy 2050, the UAE needed to include existing grid expansion plans and limitations within their long-term energy scenarios.',
      'The Ministry of Energy and Infrastructure implemented a sophisticated stakeholder engagement process, utilising a bottom-up approach for short- to medium-term goals and a top-down approach for long-term objectives.',
    ],
    overview: {
      governance:
        'Ministry of Energy and Infrastructure led formation of task forces and working groups with key utility stakeholders and local authorities',
      scope: 'National level with insights from local level in emirates',
      objectives:
        'Balance immediate operational realities of utilities with long-term vision (triple renewable capacity by 2030, net-zero by 2050)',
    },
    engagementActivities: [
      {
        label: 'Three phases:',
        items: [
          'Identification: Map key stakeholders and define engagement scope',
          'Assessment/Communication: Map data requirements, evaluate scenarios, identify resilience opportunities',
          'Engagement: Structured dialogues with public and private stakeholders, aligning with national priorities (UAE Centennial 2071, Net Zero by 2050, Energy Strategy 2050)',
        ],
      },
      { text: 'Continuous feedback and scenario analysis.' },
    ],
    keyOutcomes: [
      {
        text: "Successfully integrated key stakeholders' perspectives into UAE Energy Strategy 2050, ensuring targets were ambitious yet grounded in current planning and operational context.",
      },
    ],
    resources: [],
    highlight:
      'Early and proactive engagement with utilities enables the UAE to integrate existing plans while establishing clear strategic targets. This approach ensures alignment with long-term emission reduction and energy transition goals.',
    lessonsLearnt: [
      'A dual approach combining bottom-up (short- to medium-term) and top-down (long-term) ensures adaptability and sustainability',
      'Early and thorough engagement with utilities and industry is essential for aligning ambitious targets with operational realities',
      'Continuous stakeholder feedback enables dynamic adjustments',
    ],
    summary: {
      planningContext: '2050 National Energy Strategy',
      primaryObjectives: 'Align utility plans with national targets',
      keyStakeholders: 'Utilities, ministries, local authorities, task forces',
      methodsUsed: 'Bottom-up and top-down approach, task forces',
      transferableElements: 'Dual approach methodology; utility alignment',
    },
    region: 'Asia',
    stakeholderIds: ['grid-operators', 'policy-makers', 'industry'],
    toolIds: ['committees', 'interviews', 'visualisation-games'],
  },

  {
    id: 'kenya',
    name: 'Kenya (KCERT 2050)',
    title: 'Scientific Expertise in Scenario Communication',
    toolkitSection: '5.11',
    intro: [
      "The collaboration between academia and government in Kenya showcases innovative approaches to support the country's energy transition.",
      'The KCERT 2050 project (Kenya Carbon Emission Reduction Tool) represents the first interactive energy model of its kind in East Africa, designed to help identify energy-secure pathways between 2015 and 2050.',
    ],
    overview: {
      governance:
        'Joint efforts between academia and government departments, led by Ministry of Energy',
      scope: 'National; Energy',
      objectives:
        'Provide decision makers and public with accessible tools for understanding energy transition and sectoral emission reduction',
    },
    engagementActivities: [
      {
        text: 'The International 2050 Calculator programme involves creating user-friendly versions of energy transition tools for various audiences.',
      },
    ],
    keyOutcomes: [
      {
        items: [
          'Different versions of KCERT 2050: visual web tool, gamified and detailed spreadsheet-based models',
          'Improved capacity among Kenyan government technocrats and policy makers',
          'Enhanced ability to simulate different scenarios and visualise energy needs',
          'Fostering data-driven evidence-based decision making',
          'Breaking down silos within government departments',
        ],
      },
    ],
    resources: [],
    highlight:
      'Using a multitude of visualisation tools catered for different audiences to communicate national scenarios effectively for decarbonisation strategies, educational purposes, and investment objectives.',
    lessonsLearnt: [
      'Developing audience-specific tools (spreadsheet-based to visualisation-based) improves communication and data transparency',
      'Ongoing refinement of tools driven by data ensures policies stay relevant',
      'Collaborative efforts between academia and government are vital for national capacity building',
      'These dynamic tools transform citizen engagement and participation',
    ],
    summary: {
      planningContext: 'Energy transition and financial decisions',
      primaryObjectives: 'Enhance scenario communication; support financing',
      keyStakeholders: 'Policy makers, finance ministry, local communities',
      methodsUsed: 'Interactive calculator',
      transferableElements: 'Financial visualisation methodology',
    },
    region: 'Africa',
    stakeholderIds: ['scientific', 'policy-makers', 'finance', 'public'],
    toolIds: ['visualisation-games'],
  },

  {
    id: 'pac-consortium',
    name: 'Paris Agreement Compatible (PAC) Scenario Consortium',
    title: 'Leveraging Civil Society Participation for Ambitious Scenarios',
    toolkitSection: '5.12',
    intro: [
      'A coalition of NGOs, supported by TSOs and technical institutions, aimed to enhance European decarbonisation ambitions in relation to infrastructure planning by developing a scenario aligned with Paris Agreement goals.',
      'The PAC Scenario process leveraged thorough engagement with diverse organisations to present an ambitious pathway for meeting climate neutrality in Europe by 2040.',
    ],
    overview: {
      governance:
        'Consortium includes Climate Action Network Europe (200+ NGO members), European Environmental Bureau (170+ members), Renewables Grid Initiative (31 members including NGOs and TSOs), REN21 (107 international members)',
      scope: 'Europe-wide and European national level',
      objectives:
        'Review European scenario-building process; develop Paris-compatible energy scenario; facilitate knowledge exchange; empower NGOs in policy discussions',
    },
    engagementActivities: [
      {
        items: [
          '13 workshops including scenario-building and modeller exchanges',
          'Face-to-face, hybrid and online sessions for national and European-level actors',
          'Publications on hydrogen, energy crisis, power grids, nature-positive renewables, socio-economic benefits, and citizen engagement',
        ],
      },
    ],
    keyOutcomes: [
      {
        items: [
          'PAC project outlines Paris-aligned European energy scenario targeting 65% emissions cut by 2030, climate neutrality and 100% renewables by 2040',
          'Input into European grid planning process (TYNDP)',
        ],
      },
    ],
    resources: [
      'Financed by German Federal Ministry for Economic Affairs and Climate Action',
      'Team of around 10 people representing all consortium organisations',
    ],
    highlight:
      'Active contributions, centred on modelling, from civil society in political and system planning discussions provided added value by presenting alternatives for future energy system design. This enriched discussions, improved modelling quality, empowered civil society actors, and made decision makers appear more open and transparent.',
    lessonsLearnt: [
      'The PAC project demonstrates the importance and added value of bringing civil society perspective into policy making, scenario-building and grid planning',
      'Adequate resources must be dedicated to establish meaningful relationships with diverse stakeholders maintained throughout the entire process',
      'Publishing datasets in open source increases transparency and allows external validation',
    ],
    summary: {
      planningContext: 'European grid planning',
      primaryObjectives: 'Enhance decarbonisation ambition',
      keyStakeholders: 'NGOs, TSOs, technical institutions',
      methodsUsed: 'Workshops, modeller exchanges, publications',
      transferableElements: 'Civil society participation framework',
    },
    region: 'Europe',
    stakeholderIds: ['csos-ngos', 'grid-operators', 'scientific'],
    toolIds: ['workshops', 'networks-hubs', 'presentations-reports'],
  },

  {
    id: 'world-energy-council',
    name: 'World Energy Council',
    title: 'Global Engagement to Define Regional Priorities',
    toolkitSection: '5.13',
    intro: [
      'The World Energy Council (WEC) conducts a rigorous stakeholder engagement process leading to its World Energy Scenarios publication. The process involves hundreds of stakeholders through regional deep dives and other activities.',
    ],
    overview: {
      governance:
        'WEC secretariat manages the process; regional activities organised through national member committees',
      scope: 'Global with regional activities; Energy',
      objectives:
        'Reflect global priorities and challenges; develop plausible scenarios reflecting socio-political realities',
    },
    engagementActivities: [
      {
        label:
          'Engaging stakeholders in scenario narrative foresight development through tools such as:',
        items: [
          'World Energy Trilemma',
          'Trilemma Framework',
          'Horizon-scanning tools (World Energy Pulse, Issues Monitor)',
          'Policy simulator',
        ],
      },
      {
        items: [
          'Regional workshops with scenario refresh sessions',
          'Narrative development in interactive formats (World Cafés)',
          'Interviews and targeted desktop research',
          'Collaboration with scientific institutions (Paul Scherrer Institute) for quantifying insights',
        ],
      },
    ],
    keyOutcomes: [
      {
        text: 'Participatory process to develop plausible narratives supporting business and government in their own planning, deriving insights from diverse stakeholders.',
      },
    ],
    resources: [
      'Human and financial resources from regional and country member committees, as well as secretariat',
    ],
    highlight:
      "WEC's thorough and diverse workshops leverage strong facilitation to co-create socio-political narratives for global scenarios, combined with interactive exercises that allow stakeholders to examine their own roles within the changes exemplified.",
    lessonsLearnt: [
      'Ensuring diverse participation from across sectors (academia, government, industry, start-ups) and regions is critical for capturing global energy priorities',
      'Employing diverse tools (policy simulators, frameworks, interactive workshops) helps cater to varying stakeholder needs',
      'Narrative-based scenarios considering socio-political realities alongside technical and economic factors provide actionable insights',
    ],
    summary: {
      planningContext: 'Global energy scenarios',
      primaryObjectives: 'Identify regional priorities; create narratives',
      keyStakeholders: 'Academia, government, industry, start-ups',
      methodsUsed: 'Regional deep dives, policy simulator, Trilemma',
      transferableElements: 'Socio-political framework; simulation tools',
    },
    region: 'Global',
    stakeholderIds: ['scientific', 'policy-makers', 'industry'],
    toolIds: ['workshops', 'interviews', 'networks-hubs', 'visualisation-games'],
  },
];

export function getCaseStudy(id: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.id === id);
}

export function getCaseStudiesForStakeholder(stakeholderId: string): CaseStudy[] {
  return caseStudies.filter((c) => c.stakeholderIds.includes(stakeholderId as never));
}

export function getCaseStudiesForTool(toolId: string): CaseStudy[] {
  return caseStudies.filter((c) => c.toolIds.includes(toolId as never));
}
