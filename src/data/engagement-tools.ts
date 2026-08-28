// Engagement tools, chapter 4
// Source: IRENA (2025), Participatory processes for strategic energy planning:
// A toolkit for national energy planners.
//
// Generated from the PDF by scripts/extract-tools.py. Chapter 4 contains no
// bullet lists: it is prose and tables. The markdown transcription turned that
// prose into bullets and reworded it, so each list below is the publication's
// own sentences, split where it ends them.
//
// caseStudyIds is a cross-reference, not a quotation.

import type { EngagementTool, ToolId, Objective, Phase } from '../types/toolkit';

export const engagementTools: EngagementTool[] = [
  {
    id: 'workshops',
    name: 'Workshops',
    category: 'knowledge-gathering',
    toolkitSection: '4.1.1',
    summary: [
      'Workshops provide structured environments for energy planners to facilitate engagement with many different types of stakeholders, to share information, foster discussions and collect feedback.',
      'Workshops help identify and map divergences and convergences between stakeholder groups.',
      'For example, Brazil used virtual debates to identify key disagreements and develop scenarios that reflected different perspectives.',
      'Finland used workshops to foster collaboration and transparency in their carbon neutrality scenarios.',
      'Brazil also held workshops to present their National Energy Plan 2050, while Cyprus used workshops to communicate scenario results to policy makers.',
    ],
    stageApplications: {
      framing: 'Co-define policy questions and targets',
      development: 'Co-develop narratives and define assumptions',
      validation: 'Present preliminary results and encourage feedback for reiteration',
      communication: 'Present results and communicate policy outcomes',
    },
    requirements: [
      'Workshops require dedicated, skilled facilitators with expertise in energy scenario development.',
      'Adequate financial resources are also needed to cover logistics for stakeholder gatherings, including location, technology, facilitation and possibly funding for attendance and related per diem payments.',
      'Access to technology may also be necessary, depending on the format of the workshop.',
      'As demonstrated in the case studies, the ideal format varies by setting.',
      'In some cases, physical meetings may be the most effective way to facilitate participatory processes, fostering transparency and building trust in the process, as was the case for developing the Ghanaian National Energy Plan.',
      'Other instances, like Chile’s long-term energy planning, made use of a variety of online tools and platforms to engage stakeholders at different stages of the energy planning process.',
      'In some instances, countries like Brazil employed a hybrid approach, utilising both online and in-person workshops.',
      'In all cases, it is important to map the required stakeholders depending on the workshop’s objectives, and determine the format most appropriate for the stakeholders invited and the desired outcomes.',
      'Ensuring confidentiality when necessary is also vital for building trust in the process.',
      'A preliminary engagement phase may be useful for non-expert audiences, to build foundational knowledge and enhance participant involvement through courses, tutorials, interviews or a combination of them.',
      'This also informs workshop design and potential sources of tension.',
    ],
    strengths: [
      'Workshops are adaptable and flexible, allowing for diverse formats to meet specific needs.',
      'Their interactive nature encourages active participation and may foster social acceptance.',
      'They engage a wide range of stakeholders and promote social learning.',
      'In-person workshops can also foster informal exchanges and relationships between participants, adding potential value for possible collaborations.',
    ],
    challenges: [
      'Workshops may risk allowing misinformation, manipulation or reinforcement of biases (echo chambers).',
      'Public settings might discourage marginalised voices from speaking up.',
      'Addressing these challenges requires careful facilitation and inclusivity.',
    ],
    limitations: [
      'It might be difficult to translate qualitative discussions into quantitative inputs for scenario development, risking the loss of key data that shape the produced scenarios.',
      'Expert participation can be limited by time and availability, while resource constraints can also pose challenges.',
    ],
    evidence: [
      'Numerous case studies illustrate how workshops have been used in participatory processes for energy planning.',
      'These workshops varied in format, attendees and content.',
      'In Finland, VTT’s workshops focused on vision and storyline development, using creative methods and formats.',
      'Participants, including national industrial federations, contributed low-carbon sectoral roadmaps that fed into the national energy strategy.',
      'Canada’s Energy Modelling Hub hosted workshops for energy modellers, policy makers, regulators and system operators to facilitate discussions on planning for clean energy policies.',
      'In Colombia, multisector dialogue forums were held that effectively brought together various departments under a regional context.',
      'The World Energy Council held global scenario-weaving workshops, gathering stakeholders from academia, government, industry and start-ups to co-create socio-political narratives for global energy scenarios.',
      'Similarly, the Paris Agreement Compatible (PAC) project organised several workshops with CSOs, technical experts and TSOs to develop a Paris-compatible energy scenario for Europe, but also to facilitate exchange of knowledge, discuss methodologies and data, and compare the results of different modelling exercises.',
      'Some workshops addressed specific thematic areas, such as the Cyprus case, where academia, financial institutions and the Ministry of Energy collaborated to prepare sector-specific policy briefs, including on the job impacts of the energy transition.',
      'In the Chilean case, regional workshops and seminars engaged with a wide range of stakeholders to discuss the outcomes of the national energy planning process.',
      'In one project in Ireland, the researcher-led Deliberative Futures Workshops employed creative exercises like community mapping and storyboarding, paired with expert-led presentations on climate issues, to foster informed discussions and scenario creation over two weekends (LTES Network, 2022; Revez et al., 2021).',
    ],
    caseStudyIds: ['brazil', 'finland', 'cyprus', 'canada', 'colombia', 'world-energy-council', 'pac-consortium'],
    boxLabel: 'Box 1 Ideas for interactive workshops',
    box: [
      {
        name: 'World Café',
        description:
          'Participants discuss topics at rotating café-style tables, with hosts summarising previous conversations. This process fosters diverse insights, collaboration and the identification of effective actions.',
      },
      {
        name: 'Transition simulator',
        description:
          'Groups simulate different stakeholders and propose actions in response to various scenarios. Used by the World Energy Council, it helps stakeholders plan actions to meet targets, such as net zero, while balancing their own interests.',
      },
      {
        name: 'Me-We-Us',
        description:
          'This method starts with individual work, moves to group discussions, and ends with a collective conversation, promoting equal participation and improving engagement, as shown in Finland’s case study.',
      },
      {
        name: 'Futures Wheel',
        description:
          'Ideal for complex issues, this involves critical analysis, envisioning potential futures and assessing the practicality of ideas. It promotes social learning and helps drive change, as seen in Finland’s energy transition workshops.',
      },
      {
        name: 'Narrative workshop',
        description:
          'A foresight lab blending scientific, artistic and social elements, this workshop uses storytelling to reimagine energy futures, encouraging participants to integrate personal stories into scenario planning.',
      },
    ],
  },

  {
    id: 'surveys',
    name: 'Surveys and public consultations',
    category: 'knowledge-gathering',
    toolkitSection: '4.1.2',
    summary: [
      'Surveys provide a structured method for national energy planners to gather standardised information and perspectives from a wide range of stakeholders.',
      'They offer a means of understanding public opinion, collecting quantitative and qualitative data, and receiving feedback on energy plans and scenarios.',
      'For example, Finland’s VTT employed large-scale surveys, including consumer surveys, as part of their engagement activities for developing their carbon neutrality scenarios.',
      'The Chilean team also utilised surveys to gather feedback on their energy planning process, aiming to incorporate diverse stakeholder perspectives.',
      'The Ghanian Energy Planning Committee, similarly, leveraged surveys to inform their energy transition planning, focusing on understanding stakeholder opinions and preferences.',
    ],
    stageApplications: {
      framing: 'Co-define policy questions, priorities and targets',
      development: 'Data gathering',
      validation: 'Gathering feedback on results and draft plans',
      communication: 'Gathering feedback on final plan',
    },
    requirements: [
      'To conduct surveys effectively, specialists with expertise in energy scenario development and data collection are essential to define survey questions and guide the design process.',
      'Financial resources are required to facilitate the surveys, particularly for in-person surveys.',
      'Online surveys may offer a lower-cost option, as many surveying tools are free, and can help reach a more geographically dispersed set of stakeholders than who would otherwise be available to attend in-person sessions.',
      'However, facilitating online surveys still requires expertise in survey design, must be mindful of data protection law, and depends upon internet access.',
      'The preparation phase should include defining the survey’s main objectives and identifying the target audience, whether citizens or expert stakeholders, and ensuring this selection constitutes a representative sample.',
      'Thoughtful planning of the survey format (fully online, in-person gatherings, hybrid or by telephone) and method (group discussions or individual responses) will help ensure engagement and relevance.',
      'To maximise the impact of the survey results, planners should also consider how participants will be involved in subsequent stages of energy scenario development.',
    ],
    strengths: [
      'Surveys can engage a diverse group of stakeholders, making them effective for gathering a wide range of perspectives.',
      'They can be tailored to collect valuable data that inform energy scenario modelling, and there are methodologies suited to various formats and contexts to ensure flexibility in approach.',
    ],
    challenges: [
      'Gaining meaningful inputs within a limited interaction period is a core challenge, as is defining a sample that is representative of the broader population, especially if faced with limited participant recruitment.',
      'Surveys may face sampling and framing biases, which could impact the representativeness of the data.',
      'Crafting surveys that accommodate different levels of knowledge, especially for non-expert participants, is essential to gather comprehensive and inclusive feedback.',
      'Longer surveys can help planning teams develop deeper insights, but may be off-putting to respondents.',
      'Survey design must therefore balance the need for data collection against the desirability of concise, targeted surveys or identifying specific audiences to ensure effective engagement and accurate data collection.',
    ],
    limitations: [
      'Accessibility can be an issue, especially for certain citizen groups who may lack access to the necessary technology or resources to respond to these surveys.',
      'Additionally, some topics may need to be simplified, which might exclude certain complexities from the energy modelling discussions.',
    ],
    evidence: [
      'Numerous case studies illustrate how surveys have been applied in participatory processes for energy planning.',
      'These surveys varied in format, focus and target respondents.',
      'In Brazil, online surveys were integrated into the National Energy Plan (PNE) 2050 through a three-month public consultation hosted on the Ministry of Mines and Energy website.',
      'This survey invited feedback on the national energy planning agenda, projections and governance issues, helping guide Brazil’s long-term energy strategy.',
      'The Brazilian team also used surveys to collect feedback on draft energy scenarios, reaching a broad audience beyond workshop participants.',
      'By gathering diverse perspectives through surveys, they ensured that the energy planning process was more inclusive and reflective of stakeholder priorities.',
      'In Finland, survey questions were designed to capture energy consumption patterns, preferences for energy sources and public acceptance of emerging policies.',
      'In Ghana, surveys were employed to understand stakeholder preferences and attitudes towards the energy transition.',
    ],
    caseStudyIds: ['finland', 'chile', 'ghana', 'brazil'],
    boxLabel: 'Box 2 Examples of survey formats',
    box: [
      {
        name: 'Online surveys',
        description:
          'This option can be distinct in its type and audience. Online surveys may be used for the collection of feedback with mass outreach in public consultations, or to reach certain stakeholders in geographically dispersed locations. Their low-cost nature makes them widely used.',
      },
      {
        name: 'Deliberative survey',
        description:
          'These aim to involve participants in an informed and structured dialogue on a specific topic. This approach encourages discussion, the exchange of ideas and the thorough consideration of diverse perspectives before reaching conclusions. They are utilised to foster thoughtful discussions and informed deliberations among participants.',
      },
      {
        name: 'Delphi panels',
        description:
          'An iterative method of conducting surveys, Delphi panels are structured surveying techniques that allows for reconsidering survey responses through different rounds of surveys. This can facilitate social learning and a common understanding of convergences and divergences by experts and policy makers.',
      },
      {
        name: 'Polls and ballots',
        description:
          'These can be quick and convenient methods to gauge participants’ preferences and priorities, without being too time-consuming or requiring details, and can be done either virtually or in-person.',
      },
    ],
  },

  {
    id: 'interviews',
    name: 'Interviews',
    category: 'knowledge-gathering',
    toolkitSection: '4.1.3',
    summary: [
      'Interviews offer energy planners a focused method to deeply explore participants’ perspectives, opinions and experiences in mostly one-on-one settings.',
      'They provide a platform for gaining detailed qualitative insights, fostering a richer understanding of individual motivations and viewpoints, and uncovering nuances that may inform energy plans and scenarios.',
      'The interview format is usually used to engage industry or expert stakeholders as opposed to the general public due to being time-consuming.',
      'The World Energy Council and Finnish energy planning processes both used interviews to understand stakeholder preferences and to draft scenario narratives.',
    ],
    stageApplications: {
      framing: 'Co-define in-depth policy questions, priorities and targets',
      development: 'Data gathering, narrative co-creation',
      validation: 'Feedback gathering and refinement',
      communication: 'Gathering feedback on final plan',
    },
    requirements: [
      'Conducting interviews requires expert support to design the structure and define questions that align with the study’s objectives.',
      'Interviewers play a critical role in guiding dialogue, ensuring constructive dialogue and keeping participants focused on the objectives of the discussion.',
      'In the preparation phase, the primary goals of the interview must be clearly defined and the target groups identified – whether they are citizens, stakeholders or subject matter experts.',
      'Careful planning of the interview approach, including whether it will be structured, semi-structured or informal, is essential to ensure relevance and engagement.',
      'Additionally, it is important to consider how participants’ input will feed into subsequent stages of energy scenario development.',
      'Confidentiality measures should also be established to create a safe and open environment for participants, particularly when sensitive topics are discussed.',
    ],
    strengths: [
      'Interviews allow stakeholders to express their individual views in detail, making them particularly effective for gathering qualitative and descriptive data.',
      'This format fosters meaningful conversations, enabling participants to articulate their motivations and identify potential divergences.',
      'By offering a space for focused discussion, interviews can generate in-depth insights that are valuable for understanding complex issues in energy scenario planning.',
    ],
    challenges: [
      'Interpreting and translating interview findings into actionable insights for quantitative energy scenarios can be complex.',
      'Ensuring balance between diverse opinions within the same stakeholder group is another challenge.',
    ],
    limitations: [
      'One major limitation of interviews is the small number of participants typically involved, which can limit the diversity of perspectives captured.',
      'Interviews are also time-intensive, both in conducting and analysing the discussions, which can strain resources.',
      'Additionally, interviews lack the group dynamics that can reveal new information, help build consensus or evolve collective opinions, potentially leaving gaps in understanding.',
    ],
    evidence: [
      'Interviews are a powerful method for collecting qualitative data and gaining in-depth insights.',
      'Several countries and organisations incorporate them into participatory processes for developing scenarios.',
      'For instance, the United Arab Emirates uses bilateral interviews and discussions to ensure alignment between national long-term energy plans and the mid-term strategies of regional utilities.',
      'Finland’s VTT leverages interviews to capture individual stakeholder perspectives, opinions and experiences.',
      'Similarly, the World Energy Council employs interviews to craft narratives for their energy scenarios.',
    ],
    caseStudyIds: ['world-energy-council', 'finland', 'uae'],
    boxLabel: 'Box 3 Types of interviews',
    box: [
      {
        name: 'Structured interviews',
        description:
          'These are more rigid, with prepared questions, and can target a specific topic or issue. They are useful for collecting consistent and comparable qualitative data, and in some cases structured information can be quantified to support scenario development (Ribeiro et al., 2011).',
      },
      {
        name: 'Semi-structured interviews',
        description:
          'This approach involves following an interview protocol with some prepared questions, and can be more flexible to allow for probing. They are useful for flexible and in-depth exploration of complex issues and assumptions in energy scenarios, barriers to technologies and refinement of models (Fallde et al., 2017; Kurniawan et al., 2022).',
      },
      {
        name: 'Unstructured interviews',
        description:
          'By not following prepared interview questions, this approach can be flexible, although it might allow for drifting to different topics. It is useful for collecting qualitative data, opinions and narratives at the beginning of scenario processes.',
      },
    ],
  },

  {
    id: 'committees',
    name: 'Inter-institutional steering committees, task forces and working groups',
    category: 'co-creation',
    toolkitSection: '4.2.1',
    summary: [
      'Several countries co-ordinate their energy planning through inter-institutional committees (including public and non-public organisations) to bring their unique expertise, data and viewpoints to the table.',
      'Working together helps create a more comprehensive, aligned and interconnected understanding of the long-term energy scenarios, which supports the quantification of socio-political insights and their inclusion in energy scenarios and planning.',
      'Many of these examples are outlined in previous reports (on Africa, Latin America and Asia), as well as in the case studies in this toolkit.',
      'Also, the PAC consortium established an advisory committee consisting of sector experts, which accompanied the project and scenario development and provided commentary, challenged the results and enriched the work with further insights.',
    ],
    stageApplications: {
      framing: 'Co-define policy questions, priorities and targets',
      development: 'Data gathering, narrative co-creation',
      validation: 'Feedback gathering',
      communication: 'Co-created outputs such as policy briefs or results',
    },
    requirements: [
      'Effective inter-institutional planning committees and working groups require dedicated institutional resources to ensure sustained engagement for operational activities and other extraordinary needs.',
      'To function effectively, the planning committee requires: a well-structured core team with clear leadership; secure participation of key ministries, such as energy or environment; and strategic engagement with external technical expertise.',
      'Formalising the committee along with the associated roles, responsibilities, objectives, resources and constraints is crucial to achieving legitimacy and longevity.',
      'Participants should commit to the process for its duration.',
    ],
    strengths: [
      'Committees bring together diverse expertise (Figure 5), making them well-suited to addressing complex issues critical to the energy transition.',
      'Committees’ collaborative nature enables the integration of multiple perspectives, which can foster stronger consensus-building and more comprehensive solutions.',
      'They also have a clear mandate, enhancing communication, reduce the risk of conflicting policies and build a strong case for implementation and funding allocation.',
    ],
    challenges: [
      'Committees may have slow decision-making processes with limited flexibility, and can be resource intensive.',
      'The efficiency and effectiveness of committees may suffer due to internal power dynamics or a lack of mutual understanding among members, which can hinder collaboration.',
      'Sustaining enthusiasm and commitment over a prolonged period is another common challenge.',
      'Additionally, the prioritisation of certain disciplines, sectors or policies over others can reflect self-interest, potentially skewing the outcomes.',
    ],
    limitations: [
      'Large committees or those with disproportionate representation from different energy sectors can limit effectiveness by slowing decision making, narrowing perspectives or creating imbalances in stakeholder influence.',
      'Differences in participants’ knowledge of energy scenario development can also create disparities in contributions.',
      'Impartiality may also be compromised, depending on the leadership and mandate guiding the committee’s work.',
    ],
    evidence: [
      'Countries worldwide have adopted various approaches to structuring transdisciplinary, cross-sectoral and cross-ministerial committees and working groups to promote participatory energy planning.',
      'For instance, Cyprus employs a hierarchical system of technical committees feeding into ministerial decision making, ensuring that insights from diverse domains inform policy.',
      'Ghana’s Energy Planning Committee integrates multiple economic sectors, underscoring a holistic approach.',
      'In another case study presented in LTES activities, Botswana presented a multi-sectoral steering committee, including members from the power utility, environment ministry and private sector, to oversee long-term energy scenario development (IRENA, 2023c).',
      'These examples highlight the significance of inter-sectoral collaboration in crafting effective energy plans.',
      'Figure 5 Possible participants in a working group or steering committee Notes: LT-LEDS = Long-Term Low Emission Development Strategies; NDC = Nationally Determined Contribution.',
    ],
    caseStudyIds: ['cyprus', 'ghana'],
  },

  {
    id: 'networks-hubs',
    name: 'Networks/Hubs',
    category: 'co-creation',
    toolkitSection: '4.2.2',
    summary: [
      'Establishing a network or hub involves the creation of a temporary or permanent structure to co-ordinate activities, share knowledge and build a modelling ecosystem.',
      'Canada leverages its Energy Modelling Hub (EMH), a university-based structure, to connect modelling experts with clean energy policy makers.',
      'This hub fosters dialogue among energy modellers, policy makers and other stakeholders through various engagement activities, including an annual forum, regional and modelling workshops, and thematic committees.',
    ],
    stageApplications: {
      framing: 'Co-development of policy questions and discussion about assumptions',
      development: 'Creation of open-source data platforms Co-development of modelling tools',
      validation: 'Expert peer review and scrutiny in an environment that allows for continuous feedback loops',
      communication: 'Presenting scenarios to experts and modellers Modellers scrutinise policies and scenarios (bilateral)',
    },
    requirements: [
      'Establishing and maintaining collaborative networks requires sustained funding to support both permanent and temporary staff, as well as activities such as workshops and meetings.',
      'Adequate technology infrastructure, including software for online engagement and shared databases, tools or models, is essential for effective co-ordination and collaboration.',
      'A strong governance structure with expertise in relevant topics is necessary to steer activities and provide vision, while open communication channels enable co-ordination and networking among participants.',
      'Political will at various levels is critical to foster connections and ensure alignment with broader goals.',
      'Additionally, recognising and accommodating resource disparities among network members helps maintain inclusivity and balance.',
      'A robust monitoring and evaluation mechanism is also required to assess progress and ensure network/ hub objectives are met.',
    ],
    strengths: [
      'Collaborative networks provide a platform for regular interaction among technical civil servants, policy makers and academics, fostering alignment and avoiding duplication of efforts.',
      'These networks leverage the diverse capacities, strengths and scrutiny of participating institutions, enabling more relevant and impactful contributions to energy planning.',
    ],
    challenges: [
      'Sustained funding requirements can be substantial, posing a barrier to long-term operation.',
      'Differing institutional priorities may complicate co-ordination and alignment of objectives.',
      'Political will is a crucial factor in ensuring the network’s outputs contribute effectively to governmental goals and visions.',
    ],
    limitations: [
      'These networks are best suited for ongoing collaboration rather than singular projects.',
      'The success of formalised networks and hubs relies heavily on the sustained commitment of a broad and diverse group of members, making continuity a potential vulnerability.',
    ],
    evidence: [
      'Canada, the World Energy Council and the PAC consortium all use networks and hubs to support their energy scenario development and communication processes.',
      'Canada’s Energy Modelling Hub (EMH), a university-based network, connects modelling experts with policy makers and stakeholders to build a shared understanding of sustainable energy systems.',
      'This collaborative approach, featuring an annual forum and thematic committees, fosters dialogue and knowledge exchange among a wide range of participants and informs national and provincial energy planning and policy making directly.',
      'The World Energy Council applies a different approach, using its country committees to organise activities and tools to engage stakeholders in interactive simulations and discussions.',
      'These activities allow participants from business, civil society, government and investment sectors to explore different pathways to the energy transition, fostering a shared understanding of the challenges and opportunities involved, showcased in their World Energy Scenarios.',
      'The PAC, focused on a Paris-compatible energy scenario for Europe, leverages its consortium structure, which includes prominent environmental NGOs and TSOs.',
      'This network facilitates knowledge exchange among modellers and system planning experts and empowers civil society organisations to influence policy discussions through developing ambitious Europe-wide net-zero scenarios.',
    ],
    caseStudyIds: ['canada', 'world-energy-council', 'pac-consortium'],
    boxLabel: 'Box 4 Possible activities and outputs',
    box: [
      {
        name: 'Capacity-building sessions',
      },
      {
        name: 'Joint scenario development activities',
      },
      {
        name: 'Model and scenario comparison sessions (e.g. to explore a certain policy or target)',
      },
      {
        name: 'Open-source modelling platforms',
      },
      {
        name: 'Shared datasets for energy modelling',
      },
      {
        name: 'Thematic workshops and forums',
      },
    ],
  },

  {
    id: 'presentations-reports',
    name: 'Public presentations and reports',
    category: 'dissemination',
    toolkitSection: '4.3.1',
    summary: [
      'Scenario practitioners use public presentations as a strategic tool throughout the energy scenario development process to inform, engage and, in many cases, gather feedback from stakeholders.',
      'These presentations, public hearings and reports typically include introductory sessions to outline the process, updates during intermediate stages to share progress and solicit input, and discussions of partial or final outcomes to present findings and encourage dialogue.',
      'Public presentations are essential for effectively communicating with non-expert audiences and fostering broader stakeholder buy-in.',
    ],
    stageApplications: {
      framing: 'Present aims and objectives, timelines, etc.',
      development: 'Present policy questions and other information to stakeholders',
      validation: 'Present draft results',
      communication: 'Present scenarios to all types of stakeholders',
    },
    requirements: [
      'Conducting presentations requires planning teams to deliver clear and engaging content, and calls for skilled communication, possibly through dedicated communication and external relations teams.',
      'Technological support may also be necessary to enhance presentations, especially for online formats.',
      'Specific objectives should be outlined in advance, including introducing the participatory process for energy scenario development, presenting progress, gathering feedback on preliminary results and communicating final outcomes.',
      'Additionally, a well-defined methodology for collecting and incorporating audience feedback is essential to improve the energy scenarios being developed.',
    ],
    strengths: [
      'Presentations provide an opportunity to educate non-expert groups about energy scenario development, fostering greater understanding and engagement.',
      'They also serve as a platform to gather feedback from a broad audience, including stakeholders who might otherwise not participate.',
      'Online presentations, in particular, offer a highly efficient way to reach even larger and more diverse audiences.',
    ],
    challenges: [
      'Crafting an appropriate narrative is key to effectively describing the energy scenario modelling process and its outcomes, especially for non-expert audiences.',
      'Presenters must employ non-technical language and ensure clarity to communicate complex ideas in an accessible manner.',
    ],
    limitations: [
      'Due to the nature of public presentations and the diverse audience, it may be necessary to limit the depth and complexity of the content.',
      'Additionally, the time available for presenting extensive results or content or answering questions can be constrained, potentially limiting the scope of the discussion.',
    ],
    evidence: [
      'Dissemination is a common feature across all case studies, but it is important to note the variation in how countries strategically combined different tools to effectively engage stakeholders.',
      'These tools were tailored to target specific audiences and achieve their objectives while integrating methods such as the workshops, surveys and public consultations discussed earlier.',
      'For example, Cyprus prepared concise policy briefs tailored for ministries and national authorities, as well as sector-specific briefs addressing topics such as employment policy and energy transition impacts.',
      'Brazil leveraged virtual debates during the development of its National Energy Plan 2050 to highlight diverse perspectives and build consensus through participatory processes such as workshops and public consultations.',
      'Additionally, Chile held various public hearings to ensure broad stakeholder engagement.',
    ],
    caseStudyIds: ['cyprus', 'brazil', 'chile'],
    boxLabel: 'Box 5 Tools for publicly presenting and discussing scenarios',
    box: [
      {
        name: 'Public hearings',
        description:
          'Formal gatherings provide a platform for government agencies or other project/scenario developers to present information and proposals related to energy plans or policies to the public. These hearings are also an opportunity for the public to give feedback, express concerns and ask questions. The hearings can also be easily advertised on social media.',
      },
      {
        name: 'Online conferencing tools',
        description:
          'Virtual conferencing tools, such as webinar platforms, can broaden the outreach and delivery of information regarding energy plans and scenarios to a much wider audience as compared to in-person events. Online conferences provide similar opportunities to public hearings with regard to feedback sharing and the ability to ask questions, with potentially lower financial and resource requirements related to hosting the event itself.',
      },
      {
        name: 'Reports and publications',
        description:
          'Written publications can deliver highly detailed information about energy plans and scenarios, providing full narratives, details about the assumptions and data, and visualisations showcasing different scenarios and results. Such reports can be highly useful for stakeholders with the required technical knowledge, and can provide a clear reference for building on this work if needed.',
      },
    ],
  },

  {
    id: 'visualisation-games',
    name: 'Visualisation tools, games and simulations',
    category: 'dissemination',
    toolkitSection: '4.3.2',
    summary: [
      'Detailed energy system plans can be data-heavy and difficult to interpret for non-experts due to the highly technical nature of energy system planning.',
      'Countries have highlighted that visualising data, pathways and results can be vital to communicating complex ideas, policy-making implications and investment needs.',
      'This can be achieved through a variety of methods, including public-oriented charts and graphs, interactive dashboards, and simulations and games.',
    ],
    stageApplications: {
      framing: 'Present data on current statistics and existing scenarios/policies',
      development: 'Test and visualise early results and scenarios',
      validation: 'Present draft results',
      communication: 'Set up dashboards and interactive tools to increase outreach',
    },
    requirements: [
      'Developing and utilising interactive visualisations requires access to appropriate technology, including necessary licences and subscriptions, as well as sufficient knowledge and capacity to create and interpret the tools.',
      'To ensure successful engagement, clear instructions should be provided to the audience on how to interpret and interact with the tools.',
      'It is also essential to define key concepts related to energy scenarios and to highlight the information most relevant to different stakeholder groups.',
      'For example, stakeholders interested in affordability may benefit from having scenario results presented in terms of energy prices and how different scenario developments would affect the average household cost of energy in the short, medium and long term.',
    ],
    strengths: [
      'Interactive visualisations complement and enhance storytelling, capturing the audience’s interest through engaging and dynamic presentations.',
      'They provide an effective way to reach a broader audience, particularly non-expert groups, by making complex information more accessible and interactive.',
    ],
    challenges: [
      'Creating effective visualisations requires dedicated training and expertise, which may not always be available within the planning team.',
      'Alternatively, outsourcing the task to specialised contractors incurs additional financial cost.',
      'Ensuring high-quality visualisation while balancing these personnel and financial constraints can be challenging.',
    ],
    limitations: [
      'Interactive visualisations depend on reliable internet access and may require accompanying educational resources, as seen in the Belgian case for the “My2050” app.',
      'Furthermore, as a one-way communication tool, they may not fully address audience questions or provide opportunities for dialogue, limiting their explanatory potential.',
    ],
    evidence: [
      'It is important to tailor the visualisation of energy scenarios to the objectives and the needs of the target stakeholders.',
      'While experts, academics and financial institutions might benefit from detailed charts with downloadable data for in-depth analysis, non-expert audiences such as students and the general public often find game-like tools and interactive calculators more engaging and accessible.',
      'This flexibility ensures that scenario communication is both effective and inclusive.',
      'For example, most countries employ simple, clear graphs to illustrate the impacts of energy scenarios on factors such as renewable energy share and electricity costs, making the information accessible to a broad audience.',
      'The calculators used by Belgium and Kenya take an interactive approach, enabling users to manipulate variables and assumptions, demonstrating how different inputs influence emissions and energy outcomes.',
      'This hands-on interaction fosters a deeper understanding of energy plans and policies.',
      'Some countries have gone further by “gamifying” scenario communication.',
      'The International Energy Agency (IEA) in collaboration with the Financial Times has developed a climate role-playing online game, while activities like the COP Simulations allow participants to explore different policies and behaviours interactively and in-person.',
      'The United Arab Emirates also built an interactive board game to communicate scenario results to high-level policy makers (IRENA, 2020).',
      'These gamified tools simplify complex technical concepts, making them more engaging and understandable, especially for non-expert audiences.',
      'By presenting the energy transition in an interactive and experiential format, they help demystify intricate processes and foster broader engagement.',
      'Other examples are also showcased in Chapter 7.',
    ],
    caseStudyIds: ['belgium', 'kenya', 'uae'],
    boxLabel: 'Box 6 Tools for visualising and gamifying energy scenarios',
    box: [
      {
        name: 'Data visualisation tools',
        description:
          'Business intelligence (BI) tools, such as Tableau and PowerBI, statistical software such as R and Stata, and other tools such as Excel and Python, have all been used to visualise quantitative data in colourful charts and graphs that can be easily read and navigated when hosted on online platforms such as dashboards, or in static media such as publications.',
      },
      {
        name: 'Energy calculators',
        description:
          'Energy calculators can be used to allow users to manipulate different assumptions and triggers to form their own scenarios. It gives users the ability to see how adjusting different inputs can lead to different results and emissions, giving them a better understanding of plans and policies, as well as giving them an indication of how their own behaviour and role can affect the energy transition.',
      },
      {
        name: 'Simulations and games',
        description:
          'Simulations and games have been developed to “gamify” scenario communication, allowing users to play games that navigate the energy transition by presenting different policies and behaviours in an interactive manner, leading to a better understanding of more technical concepts. These simulations and games can be developed for digital deployment to reach a broad audience and benefit from continuous updating, or can be developed for analogue play to build a general understanding about the trade-offs facing energy system planners.',
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
