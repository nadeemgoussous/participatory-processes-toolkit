// Case Studies Data
// Source: IRENA Participatory Processes Toolkit Chapter 5
// 13 real-world examples of stakeholder engagement in energy planning

import type { CaseStudy } from '../types/case-study';

export const caseStudies: CaseStudy[] = [
  {
    id: 'belgium',
    country: 'Belgium',
    flagEmoji: '🇧🇪',
    title: 'My2050 Youth Engagement',
    subtitle: 'Scenarios as a Communication Tool',
    governance: 'Climate Change Department of the Federal Public Service Health',
    scope: 'National and local; Transport, buildings, industry, energy, agriculture',
    objectives: 'Engage citizens, particularly secondary school students, in dialogue on transitioning to net-zero',
    stakeholdersEngaged: ['public', 'policy-makers'],
    engagementMethods: ['interactive-calculator', 'workshop'],
    keyOutcomes: [
      'More than 1,400 sessions and interactive discussions conducted nationwide',
      'Over 28,000 pupils engaged since 2017',
      'Teachers equipped with comprehensive manual for classroom use',
      'Students inspired to contribute to climate-neutral society'
    ],
    resources: {
      budget: 'Government-funded with NGO partnership',
      budgetLevel: 'medium',
      staff: 'Climate coaches trained annually',
      timeline: '2017-2023 ongoing',
      participants: '28,000+ students'
    },
    highlight: 'Outreach to students through an interactive tool ensures planners reach a broad slice of society who will be active changemakers in the years to come.',
    lessonsLearnt: [
      'Engaging school children ensures broader citizen participation and enhances knowledge and awareness of the energy transition',
      'Transfer of training and teaching knowledge from energy planners to teachers can ensure long-term sustainability and broader reach',
      'Discussing climate neutrality scenarios with pupils is an effective way to communicate important information to both parents and children'
    ],
    transferableElements: [
      'Interactive calculator methodology for non-expert audiences',
      'Youth engagement strategy through education system',
      'Partnership with NGO for implementation and reach',
      'Training-the-trainer approach for sustainability'
    ],
    region: 'Europe',
    planningContext: 'Net-zero by 2050, youth education',
    toolkitSection: '5.1'
  },

  {
    id: 'brazil',
    country: 'Brazil',
    flagEmoji: '🇧🇷',
    title: 'Energy Transition Programme (PTE)',
    subtitle: 'Partnerships for Stakeholder-Led Net-Zero Scenarios',
    governance: 'Jointly run by EPE, IDB (multilateral financing institution) and CEBRI; modelling by CENERGIA',
    scope: 'National; Energy and climate with focus on land use',
    objectives: 'Build consensus by supporting analysis of critical uncertainties, exploring scenarios and addressing divergences',
    stakeholdersEngaged: ['policy-makers', 'finance', 'industry', 'scientific', 'development-partners'],
    engagementMethods: ['virtual-debate', 'workshop', 'white-paper'],
    keyOutcomes: [
      'Three different scenarios converging on Brazil reaching zero-net greenhouse gas emissions in 2050',
      'White paper consolidating insights from diverse stakeholders',
      'Nine policy recommendations developed through consensus'
    ],
    resources: {
      budget: 'USD 284,736',
      budgetLevel: 'low',
      staff: 'Multi-institutional team',
      timeline: 'Phase 1 completed',
      participants: 'Government, finance, private sector, academia'
    },
    highlight: 'A jointly developed scenario study between government, a multilateral finance institution and a think tank leveraged the strengths of each institution in a collaborative manner.',
    lessonsLearnt: [
      'Online tools for virtual conferencing and polling were highly effective for reaching stakeholders across the country',
      'Completing surveys within a workshop was more effective than outside workshop hours',
      'Workshop design should be compatible with specific objectives (informing vs. promoting deep exploration and debate)'
    ],
    transferableElements: [
      'Multi-institutional partnership model (government + finance + think tank)',
      'Virtual engagement methodology for large countries',
      'Divergence-to-convergence process design',
      'Integration of private sector funding with public goals'
    ],
    region: 'Americas',
    planningContext: 'Net-zero by 2050, land use integration',
    toolkitSection: '5.2'
  },

  {
    id: 'canada',
    country: 'Canada',
    flagEmoji: '🇨🇦',
    title: 'Energy Modelling Hub',
    subtitle: 'Collaboration with the Scientific Community',
    governance: 'University-based structure overseen by independent advisory board (academia, government, private sector)',
    scope: 'Federal and provincial level; Power, energy and climate',
    objectives: 'Expand access to energy models, data and expertise; strengthen independent modelling capabilities; promote collaborative net-zero efforts',
    stakeholdersEngaged: ['scientific', 'policy-makers', 'industry'],
    engagementMethods: ['modelling-hub', 'workshop'],
    keyOutcomes: [
      '1,400 participants reached through 24 engagement activities',
      '50 experts from 30+ organisations in thematic committees',
      '150+ experts listed in national inventory',
      '123 models inventoried and 10+ open-source models developed',
      'National network for evidence-based policy making established'
    ],
    resources: {
      budget: 'CAD 5 million from NRCan plus foundation contributions',
      budgetLevel: 'high',
      staff: '6 permanent staff supported by volunteers',
      timeline: '2022 onwards',
      participants: '1,400+ across 24 activities'
    },
    highlight: 'The EMH Forum and workshops successfully convened hundreds of energy modellers, government civil servants and policy makers, fostering direct exchange of insights within the national modelling ecosystem.',
    lessonsLearnt: [
      'An institutional approach combined with "co-operative federalism" aligns effectively with Canada\'s constitutional requirements',
      'The rapid pace of technical change demands input from diverse experts (labour, supply chains, land use)',
      'Open-source models and data play a critical role in enhancing transparency and credibility',
      'Longer-term funding commitments are essential to sustain progress'
    ],
    transferableElements: [
      'Modelling hub structure for federal countries',
      'Scientific community engagement framework',
      'Open-source model development approach',
      'Multi-level governance coordination (federal + provincial)'
    ],
    region: 'Americas',
    planningContext: 'Net-zero transition, federal coordination',
    toolkitSection: '5.3'
  },

  {
    id: 'chile',
    country: 'Chile',
    flagEmoji: '🇨🇱',
    title: 'Citizen Consultation Registry',
    subtitle: 'Prioritising Public Engagement in Energy Planning',
    governance: 'Led by Ministry of Energy, engaging Mining, Environment and Agriculture ministries',
    scope: 'National and territorial; Energy and power',
    objectives: 'Achieve transparency and citizen legitimacy; obtain robust results with diverse perspectives; enhance acceptance of policy decisions',
    stakeholdersEngaged: ['public', 'policy-makers', 'csos-ngos', 'industry'],
    engagementMethods: ['workshop', 'public-hearing', 'consultation-registry'],
    keyOutcomes: [
      'Citizen Consultation Registry with 706 registrations',
      '84% individuals, 16% organisations participated',
      'Documented views, interests, trends and limitations',
      'Enhanced legitimacy of Long-Term Energy Plan (PELP)'
    ],
    resources: {
      budget: 'Internal Ministry of Energy resources',
      budgetLevel: 'medium',
      staff: 'Dedicated team within ministry',
      timeline: '2021-2024',
      participants: '706 registered participants'
    },
    highlight: 'Chile\'s Citizen Consultation Registry is an online platform where individuals and organisations formally register to participate, enabling the government to monitor representation and improve participation from underrepresented segments.',
    lessonsLearnt: [
      'Multidisciplinary teams integrating technical and social disciplines are essential for success',
      'Participation\'s impact relies on the chosen methodology of engagement',
      'This approach has successfully advanced citizen involvement by enabling the ministry to collect input from traditionally underrepresented groups'
    ],
    transferableElements: [
      'Online consultation registry platform',
      'Demographic tracking for representative participation',
      'Sequential workshop and public hearing design',
      'Integration of technical and social expertise'
    ],
    region: 'Americas',
    planningContext: 'Long-term energy planning, public trust',
    toolkitSection: '5.4'
  },

  {
    id: 'colombia',
    country: 'Colombia',
    flagEmoji: '🇨🇴',
    title: 'Territorial Focal Points',
    subtitle: 'Shifting from National to Territorial Focus',
    governance: 'Planning workshops led by UPME, with multi-sector involvement across ministries, regional authorities and communities',
    scope: 'National with regional and territorial disaggregation; Energy sector linked to mining, climate action and social development',
    objectives: 'Shift from centralised to territorial framework; incorporate social dialogue; ensure energy planning contributes to socio-economic development while promoting climate action',
    stakeholdersEngaged: ['policy-makers', 'public'],
    engagementMethods: ['workshop', 'focal-points'],
    keyOutcomes: [
      'Over 1,100 participants engaged across 30 departments and 34 municipalities',
      'Social and environmental variables integrated into energy planning models',
      'Comprehensive planning framework with equity and sustainability principles',
      'Continuous dialogue channels with previously underrepresented regions'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'not-specified',
      staff: 'Dedicated staff for regional engagement, territorial focal points',
      timeline: '2023 onwards',
      participants: '1,100+ across 30 departments'
    },
    highlight: 'Colombia\'s innovative "focal points" strategy places UPME staff members directly within communities across the country, creating continuous channels of communication with previously underrepresented regions.',
    lessonsLearnt: [
      'Shifting from purely technical to integrated territorial framework requires multi-sectoral dialogue and strategic deployment of focal points',
      'Incorporating socio-environmental variables into models is essential for a just transition',
      'A skilled moderator is vital to ensure engagements with communities are efficient and gather useful insights',
      'The territorial framework must be constantly revised for continuity and stability'
    ],
    transferableElements: [
      'Territorial focal points strategy',
      'Integration of social and environmental variables in models',
      'Multi-sectoral dialogue forums',
      'Three-level cost/benefit analysis (customer, system, society)'
    ],
    region: 'Americas',
    planningContext: 'Just energy transition, territorial inclusion',
    toolkitSection: '5.5'
  },

  {
    id: 'cyprus',
    country: 'Cyprus',
    flagEmoji: '🇨🇾',
    title: 'Policy Briefs for Decision Makers',
    subtitle: 'Reports and Briefs for Delivering Information',
    governance: 'Ministries of Finance and Environment co-ordinate; The Cyprus Institute conducts scenario development and outreach',
    scope: 'National, aligned with EU targets; Energy and climate',
    objectives: 'Effectively communicate energy scenarios, investment requirements and policy impacts; facilitate informed decision making',
    stakeholdersEngaged: ['policy-makers', 'finance'],
    engagementMethods: ['policy-brief', 'visualization-tool'],
    keyOutcomes: [
      'Enhanced understanding and decision-making capacity through targeted communication',
      'Successful alignment of financial strategies with energy policies',
      'Strong stakeholder engagement breaking down silos within state departments'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'not-specified',
      staff: 'Teams from technical committees across ministries',
      timeline: 'Ongoing',
      participants: 'Ministries and national authorities'
    },
    highlight: 'The Cyprus Institute produces short and concise briefs that provide model-supported insights into proposed policies and measures, frequently targeting specific sectors.',
    lessonsLearnt: [
      'Involving key government departments (like Finance Ministry) ensures streamlined communication and effective integration of financial considerations',
      'Clear and concise communication tools (policy briefs with key indicators and simple visuals) are essential for conveying complex scenarios',
      'Enhanced stakeholder participation supports proactive planning'
    ],
    transferableElements: [
      'Short, sector-specific policy brief format',
      'Model-supported policy impact assessment',
      'Finance ministry integration approach',
      'Simple visualization for complex scenarios'
    ],
    region: 'Europe',
    planningContext: 'EU alignment, policy communication',
    toolkitSection: '5.6'
  },

  {
    id: 'finland',
    country: 'Finland',
    flagEmoji: '🇫🇮',
    title: 'Industry Sector Roadmaps',
    subtitle: 'Research Institutions as Primary Conveners',
    governance: 'NECP, LT-LEDS and LTES led by Ministry of Economic Affairs and Employment, conducted by VTT',
    scope: 'National; All energy and greenhouse gas emission sectors, land-use sector, national economy',
    objectives: 'Formulate shared vision with stakeholders; create alternative pathways; develop environment for learning',
    stakeholdersEngaged: ['industry', 'policy-makers', 'scientific', 'public'],
    engagementMethods: ['workshop', 'survey', 'sector-roadmap'],
    keyOutcomes: [
      'Development of Long-Term Energy Scenarios and Carbon Neutrality Roadmaps',
      'National industrial federations created their own low-carbon roadmaps as inputs',
      'Long tradition of active dialogue increased transparency and acceptance'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'not-specified',
      staff: 'VTT research team',
      timeline: 'Ongoing',
      participants: '80 workshop participants, 1,000 consumer survey'
    },
    highlight: 'A long-standing history of facilitating active dialogue has encouraged stakeholders from different industries to consistently engage in planning activities, showcasing how local industries can effectively contribute to energy planning.',
    lessonsLearnt: [
      'A well-structured process is key, covering scenario formulation, data gathering, analysis and feedback loops',
      'LTES development, being complex and multidisciplinary, demands multidisciplinary skills',
      'Involving stakeholders, including citizens, is vital; effective prioritisation of engagement at different stages is essential given limited resources'
    ],
    transferableElements: [
      'Interactive workshop methods (World Cafés, Futures Wheel, Me-We-Us)',
      'Industry-led sector roadmap development',
      'Research institution as neutral convener',
      'Combination of qualitative foresight and quantitative modelling'
    ],
    region: 'Europe',
    planningContext: 'Carbon neutrality by 2035',
    toolkitSection: '5.7'
  },

  {
    id: 'ghana',
    country: 'Ghana',
    flagEmoji: '🇬🇭',
    title: 'Energy Planning Committee',
    subtitle: 'Consultation as a Strategic Approach',
    governance: 'Energy Planning Committee under Energy Commission; High-level Steering Committee; Technical Committee of sectoral experts',
    scope: 'National; Energy',
    objectives: 'Develop consensus across the energy sector',
    stakeholdersEngaged: ['policy-makers', 'csos-ngos'],
    engagementMethods: ['workshop'],
    keyOutcomes: [
      'Collaborative and consensus-driven path towards Ghana\'s energy transition goals',
      'Final National Energy Plan with stakeholder feedback incorporated',
      'Strategic stakeholder mapping and targeted engagement'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'not-specified',
      staff: 'Energy Commission team',
      timeline: 'Ongoing',
      participants: 'Targeted organisations across categories'
    },
    highlight: 'Clear stakeholder mapping and identification allowed a targeted approach to engaging stakeholders. The Energy Commission identified and invited specific organisations strategically assigned to relevant committees based on technical expertise.',
    lessonsLearnt: [
      'Physical meetings with stakeholders are the most effective way to facilitate participatory processes in Ghana',
      'Engaging in participatory processes allows for analysis of various risks and uncertainties',
      'Building relationships and trust with stakeholders is time-consuming but crucial'
    ],
    transferableElements: [
      'Structured committee approach (steering + technical)',
      'Strategic stakeholder mapping methodology',
      'Consensus-driven planning process',
      'Targeted assignment to committees by expertise'
    ],
    region: 'Africa',
    planningContext: 'Climate neutrality by 2070',
    toolkitSection: '5.8'
  },

  {
    id: 'panama',
    country: 'Panama',
    flagEmoji: '🇵🇦',
    title: '15,000 Hours of Consultations',
    subtitle: 'Stakeholder Consultation to Democratise Energy Planning',
    governance: 'Led by Panama\'s Secretariat of Energy',
    scope: 'National level with insights from local communities',
    objectives: 'Democratise Panama\'s energy transition; secure societal acceptance for robust, sustainable energy policy and grid expansion',
    stakeholdersEngaged: ['public', 'csos-ngos', 'policy-makers'],
    engagementMethods: ['public-hearing', 'workshop', 'white-paper'],
    keyOutcomes: [
      'Development of transformative law to democratise energy transition',
      'Regulatory adjustments affecting 30% of 242 action lines',
      'Creation of strategic innovation plan for grid system',
      'Extensive inclusion of marginalized groups including indigenous communities'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'high',
      staff: 'Secretariat of Energy team',
      timeline: '3 years, 15,000 hours consultations',
      participants: 'Civil society, private sector, indigenous communities'
    },
    highlight: 'Extensive consultations across the country with often-neglected groups, within a clear framing of democratising the energy transition in Panama.',
    lessonsLearnt: [
      'Investing significant time and resources in consultations ensures issues like energy access and poverty are addressed comprehensively',
      'Explicitly including marginalised groups promotes democratic transition and ensures representation',
      'Prioritising public acceptance and support is critical for grid expansion and renewable energy projects'
    ],
    transferableElements: [
      'Energy democratisation framework',
      'Indigenous and marginalized community engagement',
      'Online public review of proposed legislation',
      'Extensive time investment approach (15,000 hours)'
    ],
    region: 'Americas',
    planningContext: 'Grid expansion, energy access, energy poverty',
    toolkitSection: '5.9'
  },

  {
    id: 'uae',
    country: 'United Arab Emirates',
    flagEmoji: '🇦🇪',
    title: 'Bottom-Up and Top-Down Approach',
    subtitle: 'Leveraging Dual Stakeholder Engagement',
    governance: 'Ministry of Energy and Infrastructure led formation of task forces and working groups with utilities and local authorities',
    scope: 'National level with insights from local level in emirates',
    objectives: 'Balance immediate operational realities of utilities with long-term vision (triple renewable capacity by 2030, net-zero by 2050)',
    stakeholdersEngaged: ['policy-makers', 'grid-operators', 'industry'],
    engagementMethods: ['task-force', 'workshop'],
    keyOutcomes: [
      'Successfully integrated stakeholder perspectives into UAE Energy Strategy 2050',
      'Balanced ambitious targets with current planning and operational context',
      'Continuous feedback and scenario analysis established'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'not-specified',
      staff: 'Ministry team with task forces',
      timeline: 'Ongoing',
      participants: 'Utilities, ministries, industries, technical partners'
    },
    highlight: 'Early and proactive engagement with utilities enables the UAE to integrate existing plans while establishing clear strategic targets, ensuring alignment with long-term emission reduction and energy transition goals.',
    lessonsLearnt: [
      'A dual approach combining bottom-up (short- to medium-term) and top-down (long-term) ensures adaptability and sustainability',
      'Early and thorough engagement with utilities and industry is essential for aligning ambitious targets with operational realities',
      'Continuous stakeholder feedback enables dynamic adjustments'
    ],
    transferableElements: [
      'Dual bottom-up/top-down approach',
      'Utility alignment methodology',
      'Three-phase engagement (identification, assessment, engagement)',
      'Integration of short-term operations with long-term vision'
    ],
    region: 'Asia',
    planningContext: 'Net-zero by 2050, utility alignment',
    toolkitSection: '5.10'
  },

  {
    id: 'kenya',
    country: 'Kenya',
    flagEmoji: '🇰🇪',
    title: 'KCERT 2050 Calculator',
    subtitle: 'Scientific Expertise in Scenario Communication',
    governance: 'Joint efforts between academia and government departments, led by Ministry of Energy',
    scope: 'National; Energy',
    objectives: 'Provide decision makers and public with accessible tools for understanding energy transition and sectoral emission reduction',
    stakeholdersEngaged: ['scientific', 'policy-makers', 'development-partners', 'finance'],
    engagementMethods: ['interactive-calculator', 'visualization-tool', 'workshop'],
    keyOutcomes: [
      'Different versions of KCERT 2050: visual web tool, gamified and detailed spreadsheet-based models',
      'Improved capacity among Kenyan government technocrats and policy makers',
      'Over 200 representatives from government, private sector, CSOs and academia engaged',
      'Data-driven evidence-based decision making fostered'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'low',
      staff: 'Academic and government collaboration',
      timeline: 'Development and launch completed',
      participants: '200+ representatives'
    },
    highlight: 'Using a multitude of visualisation tools catered for different audiences to communicate national scenarios effectively for decarbonisation strategies, educational purposes, and investment objectives.',
    lessonsLearnt: [
      'Developing audience-specific tools (spreadsheet-based to visualisation-based) improves communication and data transparency',
      'Ongoing refinement of tools driven by data ensures policies stay relevant',
      'Collaborative efforts between academia and government are vital for national capacity building',
      'These dynamic tools transform citizen engagement and participation'
    ],
    transferableElements: [
      'Multi-version tool strategy (web, gamified, spreadsheet)',
      'Academia-government collaboration model',
      'Audience-specific tool design',
      'International 2050 Calculator programme methodology'
    ],
    region: 'Africa',
    planningContext: 'Energy security, decarbonisation',
    toolkitSection: '5.11'
  },

  {
    id: 'pac-consortium',
    country: 'European Union',
    flagEmoji: '🇪🇺',
    title: 'PAC Scenario Consortium',
    subtitle: 'Leveraging Civil Society Participation for Ambitious Scenarios',
    governance: 'Consortium of Climate Action Network Europe, European Environmental Bureau, Renewables Grid Initiative, REN21',
    scope: 'Europe-wide and European national level',
    objectives: 'Review European scenario-building process; develop Paris-compatible energy scenario; facilitate knowledge exchange; empower NGOs in policy discussions',
    stakeholdersEngaged: ['csos-ngos', 'grid-operators', 'regional'],
    engagementMethods: ['workshop'],
    keyOutcomes: [
      'PAC scenario outlines 65% emissions cut by 2030, climate neutrality and 100% renewables by 2040',
      'Input into European grid planning process (TYNDP)',
      'Over 600 participants, 150+ CSO members and experts engaged',
      'Publication of insights on hydrogen, power grids, citizen engagement'
    ],
    resources: {
      budget: 'Financed by German Federal Ministry',
      budgetLevel: 'medium',
      staff: '~10 people representing consortium organisations',
      timeline: '2019-2024 (Phase 1 and 2)',
      participants: '600+ total, 150+ CSO members'
    },
    highlight: 'Active contributions, centred on modelling, from civil society in political and system planning discussions provided added value by presenting alternatives for future energy system design.',
    lessonsLearnt: [
      'The PAC project demonstrates the importance and added value of bringing civil society perspective into policy making, scenario-building and grid planning',
      'Adequate resources must be dedicated to establish meaningful relationships with diverse stakeholders maintained throughout the entire process',
      'Publishing datasets in open source increases transparency and allows external validation'
    ],
    transferableElements: [
      'Civil society participation framework',
      'Multi-organization consortium structure',
      'Modeller exchange workshops',
      'Open-source publication for transparency'
    ],
    region: 'Europe',
    planningContext: 'Paris Agreement compatibility, grid planning',
    toolkitSection: '5.12'
  },

  {
    id: 'world-energy-council',
    country: 'Global',
    flagEmoji: '🌍',
    title: 'World Energy Scenarios',
    subtitle: 'Global Engagement to Define Regional Priorities',
    governance: 'WEC secretariat manages process; regional activities organised through national member committees',
    scope: 'Global with regional activities; Energy',
    objectives: 'Reflect global priorities and challenges; develop plausible scenarios reflecting socio-political realities',
    stakeholdersEngaged: ['regional', 'scientific', 'industry', 'policy-makers'],
    engagementMethods: ['workshop'],
    keyOutcomes: [
      'Participatory process to develop plausible narratives supporting business and government planning',
      'Regional narratives capturing diverse global perspectives',
      'Publication of World Energy Scenarios and Insight Briefs',
      'Interactive exercises examining stakeholder roles in transitions'
    ],
    resources: {
      budget: 'Not specified',
      budgetLevel: 'not-specified',
      staff: 'Regional and country member committees plus secretariat',
      timeline: 'Ongoing',
      participants: 'Hundreds across regions'
    },
    highlight: 'WEC\'s thorough and diverse workshops leverage strong facilitation to co-create socio-political narratives for global scenarios, combined with interactive exercises that allow stakeholders to examine their own roles within the changes exemplified.',
    lessonsLearnt: [
      'Ensuring diverse participation from across sectors (academia, government, industry, start-ups) and regions is critical for capturing global energy priorities',
      'Employing diverse tools (policy simulators, frameworks, interactive workshops) helps cater to varying stakeholder needs',
      'Narrative-based scenarios considering socio-political realities alongside technical and economic factors provide actionable insights'
    ],
    transferableElements: [
      'Regional deep dive methodology',
      'World Energy Trilemma framework',
      'Policy simulator tools',
      'Narrative-based scenario development with socio-political context'
    ],
    region: 'Global',
    planningContext: 'Global scenarios, regional priorities',
    toolkitSection: '5.13'
  },
];

/**
 * Get case studies relevant to a specific stakeholder
 */
export function getCaseStudiesForStakeholder(stakeholderId: string): CaseStudy[] {
  return caseStudies.filter(cs => cs.stakeholdersEngaged.includes(stakeholderId));
}

/**
 * Get case studies that used a specific engagement method
 */
export function getCaseStudiesByMethod(method: string): CaseStudy[] {
  return caseStudies.filter(cs => cs.engagementMethods.includes(method as any));
}

/**
 * Get case studies by region
 */
export function getCaseStudiesByRegion(region: string): CaseStudy[] {
  return caseStudies.filter(cs => cs.region === region);
}

/**
 * Get case studies by budget level
 */
export function getCaseStudiesByBudget(budgetLevel: string): CaseStudy[] {
  return caseStudies.filter(cs => cs.resources.budgetLevel === budgetLevel);
}
