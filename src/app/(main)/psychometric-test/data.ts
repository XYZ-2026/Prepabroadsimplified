// ============================================================
// ASSESSMENT DATA — extracted from PSY.html
// Color theme mapped to project palette (#690B1B, #C9A55D)
// ============================================================

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  trait: string;
  option_types?: string[];
  reverse?: boolean;
  /** 'standard' (default MCQ/choice), 'symbol-pattern', 'drag-match', 'sequence-fill' */
  questionType?: 'standard' | 'symbol-pattern' | 'drag-match' | 'sequence-fill';
  /** For symbol-pattern: the emoji/symbol clues shown as a visual panel above the question */
  symbolDefs?: Array<{ sym: string; value: string }>;
  /** For drag-match: pairs to match — left[] matches right[] by index */
  pairs?: { left: string; right: string }[];
}

export interface Section {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'mcq' | 'likert' | 'choice';
  description: string;
  questions: Question[];
}

export interface CareerCluster {
  name: string;
  codes: string[];
  color: string;
  streams: string[];
}

export interface SectionMeta {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: string;
  desc: string;
  why: string;
  whyPoints: string[];
}

export const SEC_META: SectionMeta[] = [
  {
    id: 1, name: 'Aptitude Assessment', icon: '🧠', color: '#690B1B', type: 'mcq',
    desc: 'Tests your cognitive abilities and problem-solving skills.',
    why: 'Aptitude scores reveal your natural cognitive strengths — verbal, numerical, reasoning, and spatial — that predict academic and career success across disciplines.',
    whyPoints: [
      'Identifies which subjects and careers align with your natural abilities',
      'Verbal aptitude predicts success in communication, law, humanities, and media',
      'Numerical aptitude is essential for engineering, finance, medicine, and science',
      'Reasoning and spatial abilities are key indicators of problem-solving potential'
    ]
  },
  {
    id: 2, name: 'Personality Profile', icon: '🌟', color: '#7E3AF2', type: 'likert',
    desc: 'Explores your personality traits based on the Big Five model.',
    why: 'Personality traits are the most reliable long-term predictors of career satisfaction. The Big Five model is used by leading universities and Fortune 500 companies in career matching.',
    whyPoints: [
      'High Openness → thrives in creative, research-driven roles',
      'High Conscientiousness → excels in structured professions like medicine, law, engineering',
      'High Extraversion → suited to leadership, sales, communication, and social work',
      'Emotional Stability → critical for high-pressure careers like surgery, law, and finance'
    ]
  },
  {
    id: 3, name: 'Interest Inventory', icon: '🎯', color: '#057A55', type: 'choice',
    desc: 'Maps your career interests using the internationally recognised RIASEC framework.',
    why: "Developed by Dr. John Holland, RIASEC is the world's most widely used career interest model, adopted by universities and career counselors globally. Your top two RIASEC codes form your \"Holland Code\".",
    whyPoints: [
      'R (Realistic) → hands-on, technical, engineering, and outdoor careers',
      'I (Investigative) → science, research, medicine, and analytical careers',
      'A (Artistic) → design, media, performing arts, and creative writing',
      'S (Social) → education, healthcare, counselling, and social work',
      'E (Enterprising) → business, entrepreneurship, law, and leadership',
      'C (Conventional) → finance, accounting, administration, and data management'
    ]
  },
  {
    id: 4, name: 'Learning Style Analysis', icon: '📚', color: '#C9A55D', type: 'choice',
    desc: 'Identifies your preferred learning modality using the VARK model.',
    why: 'Understanding how you learn allows you to choose the right study strategies, academic environments, and even careers that suit your natural style. The VARK model is used globally in educational psychology.',
    whyPoints: [
      'Visual learners → thrive with diagrams, videos, and concept maps',
      'Auditory learners → excel through discussions, podcasts, and verbal explanation',
      'Reading/Writing → strongest through notes, textbooks, and written practice',
      'Kinesthetic → learn best through hands-on experience, labs, and practice'
    ]
  },
  {
    id: 5, name: 'Career Values Explorer', icon: '💼', color: '#690B1B', type: 'choice',
    desc: 'Clarifies what matters most to you in a career through structured value prioritisation.',
    why: 'Career values are the invisible compass that determines long-term job satisfaction. Research shows that value-job alignment is a stronger predictor of fulfillment than salary or prestige alone.',
    whyPoints: [
      'Creativity values → flourish in artistic, design, media, and entrepreneurial roles',
      'Helping values → driven by social work, medicine, education, and NGO careers',
      'Financial values → motivated in finance, investment banking, and consulting',
      'Leadership values → thrive in management, politics, law, and strategy roles'
    ]
  }
];

export const FBQ: { sections: Section[] } = {
  sections: [
    // ─── SECTION 1 — APTITUDE (20 MCQ, Grade 8-12 depth) ───────────────────────
    {
      id: 1, name: 'Aptitude Assessment', icon: '🧠', color: '#690B1B', type: 'mcq',
      description: 'Tests cognitive abilities and problem-solving skills.',
      questions: [
        // VERBAL (5)
        { id: 1,  text: 'Choose the word closest in meaning to "Ephemeral":', options: ['Eternal', 'Short-lived', 'Powerful', 'Ambiguous'], correct: 1, trait: 'verbal' },
        { id: 2,  text: 'Photosynthesis is to Plants as Cellular Respiration is to ___:', options: ['Fungi only', 'Animals only', 'Plants only', 'All living organisms'], correct: 3, trait: 'verbal' },
        { id: 3,  text: 'Find the word that does NOT belong in the group: Osmosis, Mitosis, Meiosis, Binary Fission', options: ['Osmosis', 'Mitosis', 'Meiosis', 'Binary Fission'], correct: 0, trait: 'verbal' },
        { id: 4,  text: '"Neither the students nor the teacher ___ present." Which verb correctly completes this sentence?', options: ['were', 'was', 'are', 'have been'], correct: 1, trait: 'verbal' },
        { id: 5,  text: 'Parliament is to India as Congress is to ___:', options: ['France', 'United Kingdom', 'United States of America', 'Japan'], correct: 2, trait: 'verbal' },
        // NUMERICAL (7)
        { id: 6,  text: 'What is the compound interest on ₹10,000 at 10% per annum compounded annually for 2 years?', options: ['₹1,900', '₹2,000', '₹2,100', '₹2,200'], correct: 2, trait: 'numerical' },
        { id: 7,  text: 'If sin θ = 3/5 and θ is an acute angle, what is the value of cos θ?', options: ['4/5', '3/4', '5/4', '5/3'], correct: 0, trait: 'numerical' },
        { id: 8,  text: 'A 40-litre mixture has milk and water in ratio 3:1. How many litres of water must be added to make the ratio 3:2?', options: ['8 L', '10 L', '12 L', '15 L'], correct: 1, trait: 'numerical' },
        { id: 9,  text: 'For the quadratic equation 2x² − 5x + 3 = 0, what is the sum of its roots?', options: ['5/2', '−5/2', '3/2', '−3/2'], correct: 0, trait: 'numerical' },
        { id: 10, text: 'What is the value of log₂(8) + log₃(27)?', options: ['5', '6', '7', '8'], correct: 1, trait: 'numerical' },
        { id: 11, text: 'At what rate of simple interest per annum will ₹5,000 double itself in 10 years?', options: ['8%', '10%', '12%', '15%'], correct: 1, trait: 'numerical' },
        { id: 12, text: 'A train 150 m long passes a platform 250 m long in 20 seconds. What is the speed of the train in km/h?', options: ['54 km/h', '60 km/h', '72 km/h', '80 km/h'], correct: 2, trait: 'numerical' },
        // REASONING (5)
        { id: 13, text: 'Find the next term in the series: 2, 5, 10, 17, 26, ___', options: ['35', '37', '39', '41'], correct: 1, trait: 'reasoning' },
        { id: 14, text: 'If PHYSICS is coded by shifting each letter forward by 1 (A→B, B→C…), how is BIOLOGY coded?', options: ['CJPMOHZ', 'CJPMPHZ', 'DJPMPHZ', 'CJOMPHZ'], correct: 1, trait: 'reasoning' },
        { id: 15, text: 'Using the rule n ★ m = n² − m, and given 5 ★ 3 = 22 and 4 ★ 2 = 14, what is 6 ★ 4?', options: ['28', '30', '32', '34'], correct: 2, trait: 'reasoning' },
        { id: 16, text: '"All scientists are creative. Some creative people are artists." Which conclusion definitely follows?', options: ['All scientists are artists', 'Some scientists may be artists', 'No scientist is an artist', 'All artists are scientists'], correct: 1, trait: 'reasoning' },
        { id: 17, text: '"No doctor is illiterate. Some educated people are doctors." Which statement is definitely true?', options: ['All educated people are literate', 'Some educated people are literate', 'No educated person is illiterate', 'All doctors are educated'], correct: 1, trait: 'reasoning' },
        // SPATIAL (3)
        { id: 18, text: 'A cube of side 4 cm is painted on all faces and then cut into 64 unit cubes of side 1 cm. How many unit cubes have NO face painted?', options: ['4', '8', '16', '24'], correct: 1, trait: 'spatial' },
        { id: 19, text: 'A rectangle has a perimeter of 54 cm and its length is twice its breadth. What is the area of the rectangle?', options: ['108 cm²', '144 cm²', '162 cm²', '180 cm²'], correct: 2, trait: 'spatial' },
        { id: 20, text: 'Which 3D geometric shape has exactly 5 faces, 9 edges, and 6 vertices?', options: ['Triangular prism', 'Square pyramid', 'Rectangular prism', 'Pentagonal prism'], correct: 0, trait: 'spatial' },
      ]
    },

    // ─── SECTION 2 — PERSONALITY PROFILE (20 Likert, Big Five, Grade 8-12 depth) ─
    {
      id: 2, name: 'Personality Profile', icon: '🌟', color: '#7E3AF2', type: 'likert',
      description: 'Big Five personality traits assessment.',
      questions: [
        // OPENNESS (4 fwd + 1 rev)
        { id: 21, text: 'When I encounter a completely unfamiliar problem, I feel curious and intellectually excited rather than anxious.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness' },
        { id: 22, text: 'I actively seek out books, documentaries, or experiences that are well outside my usual interests or comfort zone.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness' },
        { id: 23, text: 'I enjoy engaging with abstract philosophical or theoretical ideas even when they have no immediate practical application.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness' },
        { id: 24, text: 'I rarely question established rules or conventional approaches — I prefer sticking to what is proven to work.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness', reverse: true },
        { id: 25, text: 'I find it difficult to appreciate art, music, or literature that doesn\'t have a clear, logical structure or purpose.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness', reverse: true },
        // CONSCIENTIOUSNESS (4 fwd + 1 rev)
        { id: 26, text: 'I set specific, measurable study goals each week and consistently review whether I have achieved them.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness' },
        { id: 27, text: 'After every exam or assessment, I systematically analyse my errors to understand where I went wrong and why.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness' },
        { id: 28, text: 'I maintain a detailed planner or schedule and rarely deviate from it without good reason.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness' },
        { id: 29, text: 'I often skip thoroughly revising a topic if I feel I have a rough understanding of it, without verifying my mastery.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness', reverse: true },
        { id: 30, text: 'I routinely begin serious exam preparation only in the final few days before the test, despite knowing the date in advance.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness', reverse: true },
        // EXTRAVERSION (3 fwd + 1 rev)
        { id: 31, text: 'In group discussions or academic debates, I am usually among the first to voluntarily share my perspective or challenge an idea.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion' },
        { id: 32, text: 'After spending a full day socialising or collaborating in groups, I feel mentally refreshed and energised rather than drained.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion' },
        { id: 33, text: 'I naturally gravitate toward taking on visible leadership or spokesperson roles in group settings.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion' },
        { id: 34, text: 'I consistently prefer written communication over direct verbal conversation, even in informal or casual situations.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion', reverse: true },
        // AGREEABLENESS (2 fwd + 2 rev)
        { id: 35, text: 'When a classmate is struggling with a concept, I proactively offer help even if it costs me significant personal study time.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'agreeableness' },
        { id: 36, text: 'I can consistently identify at least some valid merit in an opposing viewpoint, even when I strongly disagree with it overall.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'agreeableness' },
        { id: 37, text: 'When my personal goals directly conflict with group harmony, I consistently and unapologetically prioritise my own interests.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'agreeableness', reverse: true },
        { id: 38, text: 'I find it genuinely difficult to collaborate with people who have very different working styles or values from my own.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'agreeableness', reverse: true },
        // NEUROTICISM (1 fwd + 1 rev)
        { id: 39, text: 'A relatively minor setback — such as a poor test score or a social misunderstanding — can negatively affect my mood for several days.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'neuroticism' },
        { id: 40, text: 'I can maintain consistent productivity and emotional stability even when the external situation around me feels chaotic or deeply uncertain.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'neuroticism', reverse: true },
      ]
    },

    // ─── SECTION 3 — INTEREST INVENTORY (20 RIASEC, Grade 8-12 depth) ──────────
    {
      id: 3, name: 'Interest Inventory', icon: '🎯', color: '#057A55', type: 'choice',
      description: 'RIASEC interest framework.',
      questions: [
        { id: 41, text: 'Which elective course would you most want to take in school?', options: ['Mechanical engineering and electronics basics', 'Advanced laboratory chemistry and biochemistry', 'Creative writing and screenwriting for film', 'Child development and adolescent counselling'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 42, text: 'Which real-world problem excites you most to work on?', options: ['Founding and scaling a successful technology startup', 'Streamlining school finance and administrative systems', 'Designing a low-cost water purification device for villages', 'Discovering a treatment for antibiotic-resistant infections'], option_types: ['E', 'C', 'R', 'I'], correct: -1, trait: 'riasec' },
        { id: 43, text: 'Which long-term project would you invest years of your life developing?', options: ['Writing a graphic novel that addresses mental health stigma', 'Building a peer support network for isolated teenagers in schools', 'Launching and growing a student-run social enterprise', 'Creating a structured digital archive of school heritage and records'], option_types: ['A', 'S', 'E', 'C'], correct: -1, trait: 'riasec' },
        { id: 44, text: 'Which type of documentary would you most want to watch or create?', options: ['How modern suspension bridges and mega-dams are engineered', 'How scientists track and predict deadly infectious disease outbreaks', 'How street artists and muralists transform neglected urban spaces', 'How dedicated teachers change lives in remote, underserved villages'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 45, text: 'Which ambitious goal would energise you most to pursue through college?', options: ['Leading a national youth entrepreneurship drive from your campus', 'Heading your institution\'s data governance and compliance office', 'Winning a state-level structural engineering design challenge', 'Publishing original research in a peer-reviewed marine biology journal'], option_types: ['E', 'C', 'R', 'I'], correct: -1, trait: 'riasec' },
        { id: 46, text: 'Which professional skill would you most love to master over the next 5 years?', options: ['Composing original film scores and cinematic soundscapes', 'Delivering trauma-informed therapy and crisis counselling', 'Negotiating high-value corporate mergers and acquisitions', 'Managing and growing large-scale financial investment portfolios'], option_types: ['A', 'S', 'E', 'C'], correct: -1, trait: 'riasec' },
        { id: 47, text: 'Which national competition would feel most meaningful to win?', options: ['National Robotics and Innovation Engineering Olympiad', 'National Science Research Paper Competition for Students', 'National Youth Theatre and Drama Championship', 'National Community Service Leadership Award'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 48, text: 'Which school project would you choose if given complete freedom?', options: ['Pitch a detailed business plan to a panel of real-world investors', 'Design and implement a financial accounting system for the school canteen', 'Build and test a working prototype of a solar-powered vehicle', 'Conduct a controlled experiment on plant growth under variable LED spectra'], option_types: ['E', 'C', 'R', 'I'], correct: -1, trait: 'riasec' },
        { id: 49, text: 'Which job setting at age 30 appeals to you most deeply?', options: ['Running your own photography or design studio with full creative control', 'Serving as a school counsellor or social welfare policy officer', 'Managing operations as a director at a fast-growing company', 'Maintaining precise financial reporting at a major multinational firm'], option_types: ['A', 'S', 'E', 'C'], correct: -1, trait: 'riasec' },
        { id: 50, text: 'How would you spend six months of completely free, unstructured time?', options: ['Build and test a mechanical invention from scratch in a workshop', 'Conduct independent fieldwork studying a local endangered ecosystem', 'Write and self-publish a novel, short film, or music album', 'Volunteer full-time at a rehabilitation centre for at-risk youth'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 51, text: 'Which headline would signal to you that you had truly succeeded in life?', options: ['You closed the largest corporate deal of the decade at age 28', 'Your financial risk model was adopted to reform a government budget', 'Your patented invention fundamentally transformed industrial production', 'Your study on climate feedback loops influenced major global policy'], option_types: ['E', 'C', 'R', 'I'], correct: -1, trait: 'riasec' },
        { id: 52, text: 'What kind of lasting impact do you most want to leave behind?', options: ['Creating art or music that redefines an entire generation\'s culture', 'Establishing a mental health counselling network across rural India', 'Building a company that employs thousands and transforms an industry', 'Digitally preserving and cataloguing a community\'s endangered history'], option_types: ['A', 'S', 'E', 'C'], correct: -1, trait: 'riasec' },
        { id: 53, text: 'Which technology innovation would you most want to be part of building?', options: ['A next-generation neural-interface prosthetic limb for amputees', 'An AI diagnostic model that detects rare genetic diseases early', 'An interactive, generative soundscape engine for immersive VR', 'A mobile mental health assessment platform built for Indian students'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 54, text: 'Which advanced professional skill would you invest most heavily in?', options: ['Pitching vision and persuading high-stakes investors or policymakers', 'Conducting forensic audits and risk assessments of large organisations', 'Precision CNC machining and advanced rapid prototyping techniques', 'Whole-genome sequencing analysis and computational bioinformatics'], option_types: ['E', 'C', 'R', 'I'], correct: -1, trait: 'riasec' },
        { id: 55, text: 'Which volunteer role would feel most personally meaningful to you?', options: ['Teaching art therapy and creative expression to children in hospitals', 'Running a 24/7 helpline for students experiencing academic crisis', 'Organising and leading a large-scale community fundraising campaign', 'Maintaining critical databases and records systems for a frontline NGO'], option_types: ['A', 'S', 'E', 'C'], correct: -1, trait: 'riasec' },
        { id: 56, text: 'Which school trip would genuinely excite you the most?', options: ['Visiting an active civil engineering mega-construction project site', 'Attending a cutting-edge science symposium at a top research university', 'Touring a national film archive, art museum, or sound recording studio', 'Spending a day at a special education school or children\'s orphanage'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 57, text: 'Which type of competition would you most want to enter and win?', options: ['A national model business plan and entrepreneurship pitch competition', 'A school-level personal finance and financial literacy olympiad', 'A state-level bridge-building and structural engineering contest', 'An all-India biology, anatomy, and physiology olympiad'], option_types: ['E', 'C', 'R', 'I'], correct: -1, trait: 'riasec' },
        { id: 58, text: 'Which genre of non-fiction book do you most enjoy reading?', options: ['Biographies of pioneering artists, filmmakers, or writers', 'True accounts of social workers, activists, and community builders', 'Autobiographies of visionary business leaders and company founders', 'Strategic management case studies and business history analysis'], option_types: ['A', 'S', 'E', 'C'], correct: -1, trait: 'riasec' },
        { id: 59, text: 'Which summer programme would you find most valuable and exciting?', options: ['A hands-on electronics, Arduino, and embedded systems bootcamp', 'A university-mentored research internship in a specialist science lab', 'A creative writing, journalism, and literary arts immersion workshop', 'A peer mediation, conflict resolution, and youth leadership training camp'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 60, text: 'Which type of mentor would most powerfully inspire your career path?', options: ['A serial entrepreneur who built and exited multiple companies', 'A CFO who restructured the finances of a national corporation', 'A master civil engineer or award-winning industrial designer', 'A Nobel Prize-winning scientist or celebrated research professor'], option_types: ['E', 'C', 'R', 'I'], correct: -1, trait: 'riasec' },
      ]
    },

    // ─── SECTION 4 — LEARNING STYLE (20 VARK, Grade 8-12 depth) ────────────────
    {
      id: 4, name: 'Learning Style Analysis', icon: '📚', color: '#C9A55D', type: 'choice',
      description: 'VARK learning style model.',
      questions: [
        { id: 61, text: 'When you begin studying a brand new chapter in science, your very first instinct is to:', options: ['Search for an animated explainer video or detailed infographic online', 'Ask a teacher or knowledgeable friend to verbally walk you through it', 'Read the textbook chapter carefully from the very beginning to end', 'Begin attempting practice questions and learn directly from your errors'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 62, text: 'In a group presentation, you most naturally gravitate toward:', options: ['Designing the slides, visual layout, and overall storytelling structure', 'Delivering the verbal explanation confidently and fielding questions live', 'Writing the research content, citations, and speaker\'s script', 'Building or physically demonstrating a live product, prototype, or model'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 63, text: 'When memorising a complex historical timeline for an exam, you prefer to:', options: ['Create a colour-coded visual timeline with icons and illustrated events', 'Record yourself narrating the events chronologically and play it back', 'Write detailed notes on each event and re-read them multiple times', 'Physically act out or role-play key scenarios from the historical period'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 64, text: 'When understanding a complex mathematical proof, you find it easiest when:', options: ['The teacher draws it out geometrically using colours and annotated arrows', 'The teacher verbally reasons through each step logically and clearly aloud', 'You have a detailed printed step-by-step reference sheet to consult', 'You immediately solve several similar examples right after the theory is introduced'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 65, text: 'Your most effective strategy the night before a major exam is:', options: ['Reviewing your summary diagrams, flowcharts, and visual concept maps', 'Reciting your notes aloud or explaining difficult concepts to yourself verbally', 'Carefully re-reading key textbook passages and rewriting core definitions', 'Solving as many full past-paper questions as possible under timed conditions'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 66, text: 'When learning a new computer programming language, you learn best by:', options: ['Watching annotated tutorial videos with visual code walkthroughs', 'Listening to a recorded lecture or a well-explained podcast series', 'Reading official documentation and carefully structured written guides', 'Immediately writing actual code and debugging real, meaningful projects'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 67, text: 'When trying to understand how the human circulatory system works, you prefer:', options: ['Studying detailed, colour-labelled anatomical diagrams and 3D illustrations', 'Listening to a doctor or teacher describe it as a flowing, narrative story', 'Reading a medically accurate, in-depth textbook chapter on cardiac physiology', 'Simulating blood flow mechanics using physical models or hands-on lab activities'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 68, text: 'You attend a workshop on effective public speaking. How do you prefer to learn the techniques?', options: ['Watching expert speaker videos with annotated visual analysis of technique', 'Listening to coaches narrate and verbally model each rhetorical technique', 'Reading a comprehensive written guide on persuasion and rhetorical strategies', 'Immediately practising your own speech live in front of a real audience'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 69, text: 'How do you best retain information from an educational documentary watched in class?', options: ['Sketch the key visuals, data, and concepts and create an illustrated summary', 'Immediately discuss what you watched with classmates and debate key ideas', 'Write a detailed structured reflection report or comprehensive set of notes', 'Re-enact a key scene, build a related physical model, or design a related experiment'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 70, text: 'When preparing an analytical debate speech, your process looks like:', options: ['Visually mapping your argument structure with colour-coded branches and logic diagrams', 'Practising your full speech aloud repeatedly with a partner who gives live feedback', 'Writing out your complete speech word-for-word, then memorising it with precision', 'Improvising in fast-paced practice debates and iteratively refining based on outcomes'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 71, text: 'When studying an economics concept like monetary inflation for the first time, you prefer:', options: ['Looking at trend graphs, comparative charts, and animated data visualisations', 'Listening to a podcast featuring an in-depth economist discussion or interview', 'Reading detailed case studies, textbook explanations, and annotated examples', 'Simulating a market exercise or analysing real monthly price-index data yourself'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 72, text: 'Assigned to independently research climate change, your very first step is:', options: ['Find a high-quality infographic series or acclaimed documentary film on the topic', 'Download and listen to a well-regarded recorded academic lecture series', 'Read multiple long-form peer-reviewed articles and reputable academic papers', 'Access real historical temperature datasets and begin your own data analysis'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 73, text: 'When learning a complex new dance routine or physical skill, you learn best by:', options: ['Watching the instructor demonstrate each step in slow motion from multiple angles', 'Having the rhythm and steps explained aloud verbally with clear counts and cues', 'Reading the choreography notation and written technique breakdown guide first', 'Diving straight in and practising the movement repeatedly until it becomes natural'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 74, text: 'Your teacher asks you to explain Newton\'s Third Law of Motion to a struggling classmate. You would:', options: ['Draw clear force diagram illustrations and annotated visual examples on paper', 'Verbally narrate a vivid, relatable real-world example like rocket propulsion', 'Write a precise, structured definition with labelled diagrams and numbered steps', 'Use physical objects in the room to demonstrate action-reaction forces in real time'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 75, text: 'Which exam preparation resource do you consistently find most useful and effective?', options: ['Colourful subject summary charts, visual concept maps, and mind-map posters', 'High-quality audio explanations sourced from recorded lectures or teacher podcasts', 'Condensed printed notes and heavily annotated, highlighted textbook chapters', 'Comprehensive solved previous-year papers and intensive self-timed testing sessions'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 76, text: 'When studying a country\'s culture for a geography or humanities project, you most enjoy:', options: ['Watching immersive travel documentaries and curated visual photo essay collections', 'Listening to traditional music, spoken local dialects, and recorded oral histories', 'Reading historical accounts, literary travelogues, and encyclopaedic cultural entries', 'Cooking traditional cuisine, crafting regional artefacts, or visiting a cultural expo'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 77, text: 'When you face writer\'s block while working on an important essay, what helps you most?', options: ['Sketching a visual brainstorm web or argument map on paper before writing', 'Verbally talking through your ideas with a classmate or recording your thoughts', 'Re-reading your source notes and the essay prompt very carefully and slowly', 'Starting to write freely and continuously without worrying about structure or polish'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 78, text: 'Which type of classroom activity do you find most genuinely engaging?', options: ['A detailed 3D simulation, augmented reality model, or animated explainer', 'A live Socratic seminar where students debate ideas verbally with the teacher', 'A structured reading task followed by detailed written comprehension questions', 'A hands-on lab experiment, fieldwork investigation, or real-world case study activity'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 79, text: 'When preparing for a high-stakes interview or important professional presentation, you:', options: ['Study successful interview recordings and analyse the speaker\'s body language visually', 'Repeatedly rehearse your answers aloud, refining tone, pacing, and clarity each time', 'Write out detailed model answers to every likely question in structured, complete form', 'Run full mock interviews with real people and iterate rapidly based on their feedback'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 80, text: 'After completing a complex long-term project, how do you consolidate and reflect on what you learned?', options: ['Create a visual portfolio, illustrated journey map, or annotated project summary', 'Present your findings and lessons verbally to peers, teachers, or a wider audience', 'Write a comprehensive structured reflective report detailing your entire process', 'Immediately begin building an improved version or designing a follow-up experiment'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
      ]
    },

    // ─── SECTION 5 — CAREER VALUES (20 choice, Grade 8-12 depth) ────────────────
    {
      id: 5, name: 'Career Values Explorer', icon: '💼', color: '#690B1B', type: 'choice',
      description: 'Career values prioritisation.',
      questions: [
        { id: 81, text: 'Which long-term career vision resonates most deeply with who you want to become?', options: ['Building products that fundamentally reshape how society lives and creates', 'Dedicating your entire career to uplifting the lives of the most vulnerable', 'Achieving complete financial independence and freedom before the age of 40', 'Rising to a position of genuine authority where you shape national policy'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 82, text: 'What would make a job feel truly meaningful and worth showing up for every single day?', options: ['Having full creative control over your projects without external constraints', 'Knowing that your daily work directly and measurably improves someone\'s life', 'Receiving financial rewards that significantly reflect your skill and performance', 'Being the trusted decision-maker others turn to for direction and guidance'], option_types: ['independence', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 83, text: 'Which kind of professional recognition would mean the very most to you personally?', options: ['A national award for creative innovation that reshaped your industry', 'A community honour for transforming the lives of thousands through service', 'A performance bonus or profit-sharing payout that far exceeds expectations', 'An appointment to a board of directors, executive committee, or advisory council'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 84, text: 'Which work environment would you find most consistently energising and fulfilling?', options: ['A small, close-knit collaborative team with a strong shared sense of purpose', 'A large, stable organisation with clear role definitions and reliable processes', 'A high-growth environment where rapid change brings constant new challenges', 'A role that gives you direct authority to lead and develop a sizeable team'], option_types: ['teamwork', 'stability', 'adventure', 'leadership'], correct: -1, trait: 'values' },
        { id: 85, text: 'If your career path forced you to permanently sacrifice one of these, which loss would be hardest to accept?', options: ['The freedom to express originality and creativity in your daily output', 'A close-knit team that genuinely supports and celebrates each other', 'A reliable, predictable income and long-term job security', 'Regular opportunities for international travel and professional exploration'], option_types: ['creativity', 'teamwork', 'stability', 'adventure'], correct: -1, trait: 'values' },
        { id: 86, text: 'When you imagine yourself at the absolute peak of your career, what does success look like?', options: ['Being celebrated globally as a pioneer or innovator who changed your field', 'Knowing your work measurably improved the lives of hundreds of thousands', 'Having the financial freedom to retire comfortably on your own terms and timeline', 'Holding a title and authority that commands deep respect across your industry'], option_types: ['status', 'impact', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 87, text: 'What level of autonomy and independence do you most want in your career?', options: ['Complete creative control over your vision, output, and working process', 'Close collaboration within a dependable, encouraging team you trust deeply', 'A clearly defined role with structured expectations and consistent boundaries', 'A continuously evolving role that pushes you into completely unfamiliar territory'], option_types: ['independence', 'teamwork', 'stability', 'adventure'], correct: -1, trait: 'values' },
        { id: 88, text: 'Which kind of workday scenario makes you feel most alive, engaged, and purposeful?', options: ['Mentoring young people and watching them grow and exceed their potential', 'Closing a major competitive deal or winning a high-stakes organisational bid', 'Completing a self-driven project ahead of schedule through pure personal effort', 'Uncovering an unexpected insight that fundamentally shifts your entire approach'], option_types: ['helping', 'leadership', 'independence', 'adventure'], correct: -1, trait: 'values' },
        { id: 89, text: 'What most powerfully motivates you to give your absolute best effort at work?', options: ['The rare opportunity to express your unique creative voice and vision', 'The real, tangible difference your output makes to actual people\'s lives', 'The direct financial reward your skills and performance deservedly earn', 'The trust, authority, and influence your role grants you over important outcomes'], option_types: ['creativity', 'impact', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 90, text: 'Which type of professional legacy would you be most proud and honoured to leave behind?', options: ['A body of creative work — art, writing, or design — that influenced a generation', 'A social programme or organisation that durably uplifted millions of people', 'A business empire that generated lasting wealth and created thousands of jobs', 'A national policy framework that permanently reformed education or healthcare'], option_types: ['creativity', 'helping', 'financial', 'impact'], correct: -1, trait: 'values' },
        { id: 91, text: 'When choosing between two equally prestigious job offers, what factor would most decisively tip the balance?', options: ['The degree of creative freedom the role offers to shape your own vision', 'The direct, measurable positive impact the role has on real communities', 'The overall compensation package and long-term financial growth trajectory', 'The scale of leadership responsibility and team size you would manage'], option_types: ['creativity', 'impact', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 92, text: 'Which career-related scenario would most deeply undermine your sense of professional fulfilment?', options: ['Being trapped in a rigid routine with absolutely no room for original thought', 'Working in complete isolation with no meaningful human connection or community', 'Having an income that stagnates or shrinks despite your sustained best efforts', 'Living with financial unpredictability that makes planning your future impossible'], option_types: ['creativity', 'teamwork', 'financial', 'stability'], correct: -1, trait: 'values' },
        { id: 93, text: 'Which kind of end-of-day feeling would leave you feeling most genuinely satisfied?', options: ['You produced an original piece of work that you are deeply, personally proud of', 'You helped someone navigate a genuinely difficult situation with real compassion', 'You negotiated or earned a major financial win that significantly benefits your organisation', 'A high-stakes decision you made today clearly and positively changed meaningful outcomes'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 94, text: 'If you could redesign your school from scratch, what would be your absolute top priority?', options: ['More structured creative workshops, makerspace studios, and design labs', 'A comprehensive peer support system and dedicated counselling resources', 'Expanded student leadership, governance, and decision-making roles', 'More adventure programmes, outdoor expeditions, and experiential learning trips'], option_types: ['creativity', 'helping', 'leadership', 'adventure'], correct: -1, trait: 'values' },
        { id: 95, text: 'What would most powerfully push you to change careers even while things were objectively going well?', options: ['The gradual realisation that your work has stopped creating any meaningful change', 'The clear recognition that your income growth has permanently hit a ceiling', 'A suffocating feeling that you\'ve completely lost creative freedom or ownership of your work', 'An overwhelming desire to radically explore a different field, culture, or part of the world'], option_types: ['impact', 'financial', 'creativity', 'adventure'], correct: -1, trait: 'values' },
        { id: 96, text: 'Which career achievement milestone excites you most to reach by the age of 35?', options: ['Having your creative work internationally recognised and critically celebrated', 'Leading a team of 100+ people toward a shared, ambitious, and meaningful mission', 'Becoming fully financially independent with a diversified investment portfolio', 'Having lived and worked professionally across three or more different countries'], option_types: ['status', 'leadership', 'financial', 'adventure'], correct: -1, trait: 'values' },
        { id: 97, text: 'How important is long-term job security to you relative to other career factors?', options: ['Less critical than having genuine creative expression and intellectual originality', 'Less critical than having meaningful, quality relationships with trusted colleagues', 'Extremely important — financial unpredictability causes me significant anxiety', 'Less critical than the thrill and growth that comes from continuous new challenges'], option_types: ['creativity', 'teamwork', 'stability', 'adventure'], correct: -1, trait: 'values' },
        { id: 98, text: 'Which type of career story would you feel proudest and most moved to share at your retirement?', options: ['How your creative vision fundamentally transformed the way an entire industry operates', 'How your sustained compassion and commitment changed thousands of individual lives', 'How your financial acumen and discipline built generational wealth and lasting security', 'How your decisive leadership guided an organisation through its most critical transformation'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 99, text: 'Which core value do you most need to see genuinely reflected in the organisation you work for?', options: ['A deep, authentic commitment to bold innovation and original thinking', 'A genuine and active focus on social responsibility and community welfare', 'A transparent, performance-linked reward system that recognises merit fairly', 'A clear and respected hierarchy where proven leadership earns genuine authority'], option_types: ['creativity', 'impact', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 100, text: 'If you could design your ideal working week with complete freedom, what would it look like?', options: ['Collaborating freely with a talented creative team on ambitious, open-ended projects', 'Spending the majority of my time in direct, meaningful service to the people I help', 'Focusing relentlessly on high-value, income-generating tasks that visibly grow my wealth', 'Working independently on fully self-defined goals with total flexibility over how and when'], option_types: ['creativity', 'helping', 'financial', 'independence'], correct: -1, trait: 'values' },
      ]
    }
  ]
};

export const CAREER_CLUSTERS: CareerCluster[] = [
  { name: 'Software Engineering & IT', codes: ['I', 'R', 'C'], color: '#690B1B', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Data Science & AI', codes: ['I', 'C', 'R'], color: '#7E3AF2', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Mechanical Engineering', codes: ['R', 'I', 'C'], color: '#057A55', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Civil Engineering & Architecture', codes: ['R', 'A', 'I'], color: '#C9A55D', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Electrical & Electronics Eng.', codes: ['R', 'I', 'C'], color: '#0694A2', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Aerospace & Defence', codes: ['R', 'I', 'E'], color: '#690B1B', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Robotics & Automation', codes: ['R', 'I', 'C'], color: '#7E3AF2', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Pure Science & Research', codes: ['I', 'R', 'A'], color: '#057A55', streams: ['science-pcm', 'science-pcb', 'science-pcmb'] },
  { name: 'Medicine & Surgery', codes: ['I', 'S', 'R'], color: '#690B1B', streams: ['science-pcb', 'science-pcmb'] },
  { name: 'Pharmacy & Drug Research', codes: ['I', 'R', 'C'], color: '#0694A2', streams: ['science-pcb', 'science-pcmb'] },
  { name: 'Biotechnology & Genetics', codes: ['I', 'R', 'A'], color: '#7E3AF2', streams: ['science-pcb', 'science-pcmb'] },
  { name: 'Nursing & Allied Health', codes: ['S', 'I', 'R'], color: '#057A55', streams: ['science-pcb', 'science-pcmb'] },
  { name: 'Dental Sciences', codes: ['I', 'R', 'S'], color: '#C9A55D', streams: ['science-pcb', 'science-pcmb'] },
  { name: 'Agriculture & Veterinary', codes: ['R', 'I', 'S'], color: '#057A55', streams: ['science-pcb', 'science-pcmb'] },
  { name: 'Environmental Science', codes: ['I', 'R', 'S'], color: '#0694A2', streams: ['science-pcm', 'science-pcb', 'science-pcmb'] },
  { name: 'Chartered Accountancy & Audit', codes: ['C', 'I', 'E'], color: '#690B1B', streams: ['commerce-maths', 'commerce-without-maths'] },
  { name: 'Finance & Investment Banking', codes: ['C', 'E', 'I'], color: '#7E3AF2', streams: ['commerce-maths', 'commerce-without-maths'] },
  { name: 'Economics & Policy', codes: ['I', 'S', 'E'], color: '#057A55', streams: ['commerce-maths', 'humanities'] },
  { name: 'Business Management & MBA', codes: ['E', 'C', 'S'], color: '#C9A55D', streams: ['commerce-maths', 'commerce-without-maths'] },
  { name: 'Marketing & Advertising', codes: ['E', 'A', 'S'], color: '#690B1B', streams: ['commerce-maths', 'commerce-without-maths', 'humanities'] },
  { name: 'Human Resources & OB', codes: ['S', 'E', 'C'], color: '#0694A2', streams: ['commerce-maths', 'commerce-without-maths'] },
  { name: 'Actuarial Science & Risk', codes: ['C', 'I', 'R'], color: '#7E3AF2', streams: ['commerce-maths'] },
  { name: 'Supply Chain & Operations', codes: ['C', 'R', 'E'], color: '#057A55', streams: ['commerce-maths', 'commerce-without-maths'] },
  { name: 'Law & Legal Services', codes: ['I', 'S', 'E'], color: '#C9A55D', streams: ['humanities', 'commerce-without-maths'] },
  { name: 'Civil Services & Governance', codes: ['S', 'E', 'I'], color: '#690B1B', streams: ['humanities', 'commerce-maths'] },
  { name: 'Journalism & Mass Media', codes: ['A', 'S', 'E'], color: '#7E3AF2', streams: ['humanities'] },
  { name: 'Psychology & Counselling', codes: ['S', 'I', 'A'], color: '#057A55', streams: ['humanities'] },
  { name: 'Education & Teaching', codes: ['S', 'A', 'C'], color: '#0694A2', streams: ['humanities', 'science-pcm', 'science-pcb', 'science-pcmb'] },
  { name: 'Social Work & NGO', codes: ['S', 'A', 'E'], color: '#690B1B', streams: ['humanities'] },
  { name: 'Fashion & Textile Design', codes: ['A', 'R', 'E'], color: '#7E3AF2', streams: ['humanities'] },
  { name: 'Graphic & UI/UX Design', codes: ['A', 'I', 'R'], color: '#C9A55D', streams: ['humanities', 'science-pcm'] },
  { name: 'Film Making & Visual Arts', codes: ['A', 'S', 'E'], color: '#690B1B', streams: ['humanities'] },
  { name: 'Hospitality & Hotel Mgmt.', codes: ['S', 'E', 'R'], color: '#057A55', streams: ['humanities', 'commerce-without-maths'] },
  { name: 'Sports Management & Fitness', codes: ['R', 'S', 'E'], color: '#0694A2', streams: ['humanities', 'science-pcb'] },
  { name: 'Interior & Product Design', codes: ['A', 'R', 'I'], color: '#C9A55D', streams: ['humanities', 'science-pcm'] },
  { name: 'Animation & Game Design', codes: ['A', 'I', 'R'], color: '#7E3AF2', streams: ['humanities', 'science-pcm'] },
  { name: 'Entrepreneurship & Startups', codes: ['E', 'A', 'S'], color: '#690B1B', streams: ['commerce-maths', 'commerce-without-maths', 'science-pcm', 'humanities'] },
  { name: 'International Business & Trade', codes: ['E', 'C', 'I'], color: '#0694A2', streams: ['commerce-maths', 'commerce-without-maths'] },
  { name: 'Cybersecurity & Networking', codes: ['I', 'R', 'C'], color: '#057A55', streams: ['science-pcm', 'science-pcmb'] },
  { name: 'Petroleum & Mining Eng.', codes: ['R', 'I', 'C'], color: '#C9A55D', streams: ['science-pcm', 'science-pcmb'] },
];

// ── JUNIOR APTITUDE — Tricky questions for Grade 7-9 ──────────────────────────
export const JUNIOR_APTITUDE_QUESTIONS: Question[] = [

  // ──── SYMBOL PATTERN ─────────────────────────────────────────────────────
  {
    id: 1, trait: 'numerical', questionType: 'symbol-pattern',
    symbolDefs: [
      { sym: '🔴 + 🔵', value: '13' },
      { sym: '🔴 × 🔵', value: '42' },
    ],
    text: 'Find  🔴 − 🔵  (🔴 > 🔵)',
    options: ['1', '2', '3', '4'], correct: 0,
  },
  {
    id: 2, trait: 'numerical', questionType: 'symbol-pattern',
    symbolDefs: [
      { sym: '2🍎 + 🍊', value: '20' },
      { sym: '🍎 + 2🍊', value: '16' },
    ],
    text: 'Find  🍎 + 🍊',
    options: ['10', '12', '14', '16'], correct: 1,
  },
  {
    id: 3, trait: 'numerical', questionType: 'symbol-pattern',
    symbolDefs: [
      { sym: '🐱 × 🐱 × 🐱', value: '27' },
      { sym: '🐱 + 🐶 + 🐶', value: '15' },
    ],
    text: 'Find  🐶 × 🐶',
    options: ['16', '25', '36', '49'], correct: 2,
  },
  {
    id: 4, trait: 'reasoning', questionType: 'symbol-pattern',
    symbolDefs: [{ sym: 'A ⊕ B', value: 'A² + AB − B²' }],
    text: 'Find  3 ⊕ 2',
    options: ['9', '10', '11', '13'], correct: 2,
  },
  {
    id: 5, trait: 'reasoning', questionType: 'symbol-pattern',
    symbolDefs: [{ sym: 'A # B', value: '2A − B' }],
    text: 'Find  4 # (3 # 1)',
    options: ['3', '5', '7', '9'], correct: 0,
  },

  // ──── SEQUENCE FILL ───────────────────────────────────────────────────────
  {
    id: 6, trait: 'reasoning', questionType: 'sequence-fill',
    text: '1,  2,  6,  24,  120,  ___',
    options: ['360', '600', '720', '840'], correct: 2,
  },
  {
    id: 7, trait: 'reasoning', questionType: 'sequence-fill',
    text: '3,  5,  11,  29,  83,  ___',
    options: ['215', '235', '245', '249'], correct: 2,
  },
  {
    id: 8, trait: 'numerical', questionType: 'sequence-fill',
    text: '1,  8,  27,  64,  ___,  216',
    options: ['100', '120', '125', '150'], correct: 2,
  },
  {
    id: 9, trait: 'reasoning', questionType: 'sequence-fill',
    text: '2,  3,  5,  7,  11,  13,  ___',
    options: ['14', '15', '17', '19'], correct: 2,
  },
  {
    id: 10, trait: 'reasoning', questionType: 'sequence-fill',
    text: 'AB,  DE,  GH,  JK,  ___',
    options: ['LM', 'MN', 'NO', 'OP'], correct: 1,
  },

  // ──── HARD MCQ ────────────────────────────────────────────────────────────
  {
    id: 11, trait: 'numerical',
    text: '🐱 5 cats catch 5 rats in 5 min.\nHow many cats for 100 rats in 100 min?',
    options: ['5', '10', '20', '100'], correct: 0,
  },
  {
    id: 12, trait: 'spatial',
    text: '🕐 Angle between clock hands at 3:30?',
    options: ['60°', '70°', '75°', '90°'], correct: 2,
  },
  {
    id: 13, trait: 'reasoning',
    text: '2+3=10\n7+2=63\n6+5=66\n8+4=96\n9+7=?',
    options: ['112', '128', '133', '144'], correct: 3,
  },
  {
    id: 14, trait: 'numerical',
    text: '👨‍👦 Father = 3× son.\nIn 10 yrs, father = 2× son.\nFather\'s age now?',
    options: ['24', '27', '30', '36'], correct: 2,
  },
  {
    id: 15, trait: 'numerical',
    text: '🚂 200m train passes a pole in 10s.\nTime to pass a 300m platform?',
    options: ['20s', '22s', '25s', '30s'], correct: 2,
  },
  {
    id: 16, trait: 'reasoning',
    text: '🔢 Smallest N where:\nN ÷ 5 → rem 3\nN ÷ 7 → rem 5',
    options: ['19', '26', '33', '38'], correct: 2,
  },
  {
    id: 17, trait: 'reasoning',
    text: '📅 Jan 1, 2023 = Sunday.\nDec 31, 2023 = ?',
    options: ['Friday', 'Saturday', 'Sunday', 'Monday'], correct: 2,
  },
  {
    id: 18, trait: 'spatial',
    text: '🧭 Facing North.\n→ 90° CW  → 180° ACW  → 90° CW\nFacing?',
    options: ['East', 'West', 'North', 'South'], correct: 2,
  },
  {
    id: 19, trait: 'numerical',
    text: '🏗️ 6 workers finish in 10 days.\nAfter 4 days, 4 workers leave.\nHow many MORE days for 2 to finish?',
    options: ['15', '16', '18', '20'], correct: 2,
  },
  // Q20 — mirror-image clock (hardest — most students get wrong)
  {
    id: 20, trait: 'spatial',
    text: '🪞 Clock shows 8:20.\nMirror image shows?',
    options: ['3:40', '4:40', '3:20', '4:20'], correct: 0,
  },
];

export const GRADE_10_APTITUDE_QUESTIONS: Question[] = [
  // VERBAL (5)
  { id: 1,  text: 'Choose the word closest in meaning to "Pragmatic":', options: ['Practical', 'Idealistic', 'Mysterious', 'Aggressive'], correct: 0, trait: 'verbal' },
  { id: 2,  text: 'Malleable is to Metals as Brittle is to ___:', options: ['Non-metals', 'Liquids', 'Gases', 'Alloys'], correct: 0, trait: 'verbal' },
  { id: 3,  text: 'Find the word that does NOT belong in the group: Helium, Argon, Neon, Nitrogen', options: ['Helium', 'Argon', 'Neon', 'Nitrogen'], correct: 3, trait: 'verbal' },
  { id: 4,  text: '"Each of the candidates ___ interviewed by the panel." Which verb correctly completes this sentence?', options: ['was', 'were', 'are', 'have been'], correct: 0, trait: 'verbal' },
  { id: 5,  text: 'Tropic of Cancer is to India as Equator is to ___:', options: ['Brazil', 'Australia', 'South Africa', 'United Kingdom'], correct: 0, trait: 'verbal' },
  // NUMERICAL (7)
  { id: 6,  text: 'An article costing ₹800 is sold at a profit of 15%. What is the selling price?', options: ['₹900', '₹920', '₹940', '₹960'], correct: 1, trait: 'numerical' },
  { id: 7,  text: 'If x + y = 12 and xy = 35, what is the value of x² + y²?', options: ['74', '84', '94', '104'], correct: 0, trait: 'numerical' },
  { id: 8,  text: 'Two unbiased coins are tossed simultaneously. What is the probability of getting at least one head?', options: ['1/4', '1/2', '3/4', '1'], correct: 2, trait: 'numerical' },
  { id: 9,  text: 'The ratio of the ages of A and B is 4:3. If A will be 24 years old in 4 years, how old is B now?', options: ['12 years', '15 years', '18 years', '20 years'], correct: 1, trait: 'numerical' },
  { id: 10, text: 'The area of a circle is 154 cm². What is its circumference? (Take π = 22/7)', options: ['22 cm', '44 cm', '66 cm', '88 cm'], correct: 1, trait: 'numerical' },
  { id: 11, text: 'A person covers a distance of 12 km in 40 minutes. What is their speed in km/h?', options: ['15 km/h', '18 km/h', '20 km/h', '24 km/h'], correct: 1, trait: 'numerical' },
  { id: 12, text: 'What is the 10th term of the arithmetic progression: 5, 9, 13, 17, ...?', options: ['37', '41', '45', '49'], correct: 1, trait: 'numerical' },
  // REASONING (5)
  { id: 13, text: 'Find the next term in the series: 3, 7, 15, 31, 63, ___', options: ['125', '127', '129', '131'], correct: 1, trait: 'reasoning' },
  { id: 14, text: 'If MATH is coded by shifting each letter forward by 2 (M→O, A→C, T→V, H→J), how is GATE coded?', options: ['ICVG', 'ICWG', 'IDVG', 'JCVG'], correct: 0, trait: 'reasoning' },
  { id: 15, text: 'A is B\'s sister. C is B\'s mother. D is C\'s father. How is A related to D?', options: ['Granddaughter', 'Daughter', 'Mother', 'Grandmother'], correct: 0, trait: 'reasoning' },
  { id: 16, text: '"All books are pages. All pages are trees." Which conclusion definitely follows?', options: ['All books are trees', 'All trees are books', 'Some trees are not pages', 'No book is a tree'], correct: 0, trait: 'reasoning' },
  { id: 17, text: 'If it is true that "Some students are athletes" and "All athletes are energetic", which of the following must be true?', options: ['Some students are energetic', 'All students are energetic', 'No student is energetic', 'All energetic people are athletes'], correct: 0, trait: 'reasoning' },
  // SPATIAL (3)
  { id: 18, text: 'If a cylinder has two flat circular faces, how many curved faces does it have?', options: ['0', '1', '2', '3'], correct: 1, trait: 'spatial' },
  { id: 19, text: 'Which 3D shape can be formed by folding a net consisting of six identical squares?', options: ['Cuboid', 'Pyramid', 'Cube', 'Prism'], correct: 2, trait: 'spatial' },
  { id: 20, text: 'A map is drawn to a scale of 1:10,000. If a distance on the map is 5 cm, what is the actual distance in meters?', options: ['50 m', '500 m', '5,000 m', '50,000 m'], correct: 1, trait: 'spatial' },
];

export const GRADE_12_SCIENCE_APTITUDE_QUESTIONS: Question[] = [
  // VERBAL (5)
  { id: 1,  text: 'Choose the word closest in meaning to "Anomalous":', options: ['Standard', 'Abnormal', 'Intelligent', 'Periodic'], correct: 1, trait: 'verbal' },
  { id: 2,  text: 'Entropy is to Thermodynamics as Mutation is to ___:', options: ['Genetics', 'Mechanics', 'Geology', 'Astronomy'], correct: 0, trait: 'verbal' },
  { id: 3,  text: 'Find the term that does NOT belong in the group: Mitochondria, Ribosome, Lysosome, Myofibril', options: ['Mitochondria', 'Ribosome', 'Lysosome', 'Myofibril'], correct: 3, trait: 'verbal' },
  { id: 4,  text: '"The research team, along with the supervisor, ___ publishing the findings." Which verb correctly completes this sentence?', options: ['is', 'are', 'were', 'have been'], correct: 0, trait: 'verbal' },
  { id: 5,  text: 'Einstein is to Relativity as Mendel is to ___:', options: ['Evolution', 'Genetics', 'Quantum Mechanics', 'Electromagnetism'], correct: 1, trait: 'verbal' },
  // NUMERICAL (7)
  { id: 6,  text: 'What is the derivative of f(x) = x³ − 3x + 5 at x = 2?', options: ['3', '6', '9', '12'], correct: 2, trait: 'numerical' },
  { id: 7,  text: 'A force of 10 N acts on a body of mass 2 kg. What is the acceleration produced?', options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'], correct: 1, trait: 'numerical' },
  { id: 8,  text: 'What is the pH of a 0.01 M HCl solution?', options: ['1', '2', '3', '7'], correct: 1, trait: 'numerical' },
  { id: 9,  text: 'If P(A) = 0.6, P(B) = 0.4, and A and B are independent events, what is P(A ∩ B)?', options: ['0.2', '0.24', '0.6', '1.0'], correct: 1, trait: 'numerical' },
  { id: 10, text: 'If two heterozygous tall pea plants (Tt) are crossed, what is the probability of a dwarf offspring (tt)?', options: ['0%', '25%', '50%', '75%'], correct: 1, trait: 'numerical' },
  { id: 11, text: 'Three resistors of 6 ohms each are connected in parallel. What is the equivalent resistance?', options: ['2 ohms', '6 ohms', '18 ohms', '0.5 ohms'], correct: 0, trait: 'numerical' },
  { id: 12, text: 'What is the sum of the infinite geometric series 1 + 1/2 + 1/4 + 1/8 + ...?', options: ['1.5', '1.75', '2', 'Infinite'], correct: 2, trait: 'numerical' },
  // REASONING (5)
  { id: 13, text: 'Find the next term in the series: 1, 4, 9, 16, 25, 36, ___', options: ['45', '49', '54', '64'], correct: 1, trait: 'reasoning' },
  { id: 14, text: 'An element X has an atomic number of 12. Which group and period does it belong to in the periodic table?', options: ['Group 2, Period 3', 'Group 3, Period 2', 'Group 12, Period 3', 'Group 2, Period 2'], correct: 0, trait: 'reasoning' },
  { id: 15, text: 'If vector A points North and vector B points East, in which direction does the vector cross product A × B point (using the right-hand rule)?', options: ['West', 'South', 'Into the page / Downward', 'Out of the page / Upward'], correct: 3, trait: 'reasoning' },
  { id: 16, text: '"All metals are conductors. All conductors have free electrons." Which conclusion definitely follows?', options: ['All metals have free electrons', 'All elements with free electrons are metals', 'No non-metal has free electrons', 'Some conductors are not metals'], correct: 0, trait: 'reasoning' },
  { id: 17, text: 'Which statement is correct regarding a chemical catalyst?', options: ['It increases the activation energy', 'It decreases the rate of reaction', 'It lowers the activation energy of the reaction', 'It changes the equilibrium constant'], correct: 2, trait: 'reasoning' },
  // SPATIAL (3)
  { id: 18, text: 'A sphere of radius r fits exactly inside a cylinder. What is the height of the cylinder?', options: ['r', '2r', '3r', '4r'], correct: 1, trait: 'spatial' },
  { id: 19, text: 'Which molecular geometry corresponds to a central atom with 4 bonding pairs and 0 lone pairs (like methane CH₄)?', options: ['Linear', 'Trigonal Planar', 'Tetrahedral', 'Octahedral'], correct: 2, trait: 'spatial' },
  { id: 20, text: 'A ray of light enters a glass slab from air at an angle. Which path does it take?', options: ['Bends away from the normal', 'Bends towards the normal', 'Goes straight without bending', 'Gets completely reflected'], correct: 1, trait: 'spatial' },
];

export const GRADE_12_COMMERCE_APTITUDE_QUESTIONS: Question[] = [
  // VERBAL (5)
  { id: 1,  text: 'Choose the word closest in meaning to "Fiscal":', options: ['Physical', 'Financial/Monetary', 'Mental', 'Legal'], correct: 1, trait: 'verbal' },
  { id: 2,  text: 'Assets are to Liabilities as Surplus is to ___:', options: ['Profit', 'Deficit', 'Equity', 'Revenue'], correct: 1, trait: 'verbal' },
  { id: 3,  text: 'Find the term that does NOT belong in the group: Ledger, Journal, Cash Book, Inventory', options: ['Ledger', 'Journal', 'Cash Book', 'Inventory'], correct: 3, trait: 'verbal' },
  { id: 4,  text: '"Neither the manager nor the partners ___ signed the financial audit statement." Which verb correctly completes the sentence?', options: ['has', 'have', 'was', 'is'], correct: 1, trait: 'verbal' },
  { id: 5,  text: 'Inflation is to Purchasing Power as Deflation is to ___:', options: ['increase in purchasing power', 'decrease in purchasing power', 'stable purchasing power', 'zero purchasing power'], correct: 0, trait: 'verbal' },
  // NUMERICAL (7)
  { id: 6,  text: 'At what simple interest rate per annum will ₹25,000 earn ₹5,000 interest in 2 years?', options: ['8%', '10%', '12%', '15%'], correct: 1, trait: 'numerical' },
  { id: 7,  text: 'If a business has assets of ₹5,00,000 and owner\'s equity of ₹3,00,000, what are its total liabilities?', options: ['₹2,00,000', '₹3,00,000', '₹5,00,000', '₹8,00,000'], correct: 0, trait: 'numerical' },
  { id: 8,  text: 'If the price of a good increases from ₹10 to ₹12, and quantity demanded falls from 100 to 80 units, what is the price elasticity?', options: ['0.5', '1.0', '1.5', '2.0'], correct: 1, trait: 'numerical' },
  { id: 9,  text: 'A company buys a machine for ₹1,00,000. It depreciates at 10% per annum using the straight-line method. What is its book value after 3 years?', options: ['₹90,000', '₹80,000', '₹70,000', '₹72,900'], correct: 2, trait: 'numerical' },
  { id: 10, text: 'A shopkeeper marks up his goods by 20% and then offers a 10% discount. What is his net profit percentage?', options: ['8%', '10%', '12%', '15%'], correct: 0, trait: 'numerical' },
  { id: 11, text: 'What is the median of the following test scores: 45, 60, 72, 85, 90, 95, 100?', options: ['80', '85', '90', '72'], correct: 1, trait: 'numerical' },
  { id: 12, text: 'If a product is sold for ₹120, including a 20% Goods and Services Tax (GST), what is its price before tax?', options: ['₹96', '₹100', '₹105', '₹110'], correct: 1, trait: 'numerical' },
  // REASONING (5)
  { id: 13, text: 'Find the next term in the series: 1, 3, 7, 15, 31, 63, ___', options: ['125', '127', '129', '131'], correct: 1, trait: 'reasoning' },
  { id: 14, text: 'If the central bank increases the repo rate, what is the likely impact on borrowing and inflation?', options: ['Borrowing becomes cheaper, inflation rises', 'Borrowing becomes costlier, inflation falls', 'Borrowing becomes costlier, inflation rises', 'No impact on borrowing or inflation'], correct: 1, trait: 'reasoning' },
  { id: 15, text: 'A firm\'s profit margin is high, but its cash balance is extremely low. Which of the following explains this?', options: ['Large credit sales not yet collected', 'Low interest rates', 'High customer satisfaction', 'High cash collections from debtors'], correct: 0, trait: 'reasoning' },
  { id: 16, text: '"All entrepreneurs are risk-takers. All risk-takers are innovators." Which conclusion definitely follows?', options: ['All entrepreneurs are innovators', 'All innovators are entrepreneurs', 'No entrepreneur is an innovator', 'Some entrepreneurs are not innovators'], correct: 0, trait: 'reasoning' },
  { id: 17, text: 'If Demand increases and Supply remains constant, what happens to the equilibrium price of the commodity?', options: ['Price decreases', 'Price increases', 'Price remains unchanged', 'Price drops to zero'], correct: 1, trait: 'reasoning' },
  // SPATIAL (3)
  { id: 18, text: 'In a pie chart representing a company\'s total expenses of ₹12,00,000, the raw materials sector has an angle of 90°. How much is spent on raw materials?', options: ['₹2,00,000', '₹3,00,000', '₹4,00,000', '₹6,00,000'], correct: 1, trait: 'spatial' },
  { id: 19, text: 'Which sequence represents the correct flow of a product in a standard supply chain?', options: ['Manufacturer -> Retailer -> Wholesaler -> Consumer', 'Wholesaler -> Manufacturer -> Retailer -> Consumer', 'Manufacturer -> Wholesaler -> Retailer -> Consumer', 'Retailer -> Wholesaler -> Manufacturer -> Consumer'], correct: 2, trait: 'spatial' },
  { id: 20, text: 'If a company\'s sales graph shows a steady upward slope, but the net profit graph shows a downward slope, this implies:', options: ['Expenses are rising faster than sales revenue', 'Expenses are falling rapidly', 'Sales volume is decreasing', 'Product prices are rising'], correct: 0, trait: 'spatial' },
];

export const GRADE_12_ARTS_APTITUDE_QUESTIONS: Question[] = [
  // VERBAL (5)
  { id: 1,  text: 'Choose the word closest in meaning to "Cognitive":', options: ['Emotional', 'Mental/Intellectual', 'Physical', 'Spiritual'], correct: 1, trait: 'verbal' },
  { id: 2,  text: 'Monarchy is to King as Oligarchy is to ___:', options: ['A small group of rulers', 'A single dictator', 'All citizens', 'Religious priests'], correct: 0, trait: 'verbal' },
  { id: 3,  text: 'Find the word that does NOT belong in the group: Harappa, Mohenjo-daro, Lothal, Rome', options: ['Harappa', 'Mohenjo-daro', 'Lothal', 'Rome'], correct: 3, trait: 'verbal' },
  { id: 4,  text: '"The jury ___ divided in their opinions regarding the verdict." Which verb correctly completes this sentence?', options: ['was', 'were', 'is', 'has been'], correct: 1, trait: 'verbal' },
  { id: 5,  text: 'Magna Carta is to England as the Declaration of Independence is to ___:', options: ['France', 'United States of America', 'Germany', 'Russia'], correct: 1, trait: 'verbal' },
  // NUMERICAL (7)
  { id: 6,  text: 'What is the range of the following historical timeline events (years): 1526, 1556, 1757, 1857, 1947?', options: ['321 years', '421 years', '450 years', '500 years'], correct: 1, trait: 'numerical' },
  { id: 7,  text: 'In a village of 5,000 people, the literacy rate is 65%. How many literate people are there?', options: ['3,000', '3,250', '3,500', '3,750'], correct: 1, trait: 'numerical' },
  { id: 8,  text: 'If a map uses a scale of 1 cm to represent 50 km on the ground, what ground distance does 7.5 cm represent?', options: ['300 km', '350 km', '375 km', '400 km'], correct: 2, trait: 'numerical' },
  { id: 9,  text: 'A museum exhibits 40 paintings. 60% are from the Renaissance period. How many paintings are NOT from the Renaissance?', options: ['12', '16', '20', '24'], correct: 1, trait: 'numerical' },
  { id: 10, text: 'The temperature of a city recorded over 5 days was: 30°C, 32°C, 35°C, 31°C, 32°C. What is the average temperature?', options: ['31°C', '32°C', '33°C', '34°C'], correct: 1, trait: 'numerical' },
  { id: 11, text: 'If a standard dice is rolled once, what is the probability of rolling a prime number (2, 3, or 5)?', options: ['1/6', '1/3', '1/2', '2/3'], correct: 2, trait: 'numerical' },
  { id: 12, text: 'A writer completes 4 pages of a manuscript in 1.5 hours. At this rate, how long will it take to write 24 pages?', options: ['8 hours', '9 hours', '10 hours', '12 hours'], correct: 1, trait: 'numerical' },
  // REASONING (5)
  { id: 13, text: 'Find the next term in the series: A, C, F, J, O, ___', options: ['R', 'S', 'T', 'U'], correct: 3, trait: 'reasoning' },
  { id: 14, text: 'Which form of government is characterized by a system where power is divided between a central authority and constituent units?', options: ['Unitary', 'Federalism', 'Autocracy', 'Anarchy'], correct: 1, trait: 'reasoning' },
  { id: 15, text: 'If all art is subjective and some subjective things are highly valuable, which conclusion follows logically?', options: ['Some art may be highly valuable', 'All art is highly valuable', 'No art is highly valuable', 'All highly valuable things are art'], correct: 0, trait: 'reasoning' },
  { id: 16, text: '"All humans are mortal. Socrates is human." Which conclusion definitely follows?', options: ['Socrates is mortal', 'Socrates is immortal', 'All mortals are Socrates', 'Mortal beings are not human'], correct: 0, trait: 'reasoning' },
  { id: 17, text: 'If it is true that "No democracy is a tyranny" and "Country A is a democracy", then which statement is definitely true?', options: ['Country A is not a tyranny', 'Country A is a tyranny', 'Some democracies are tyrannies', 'All tyrannies are democracies'], correct: 0, trait: 'reasoning' },
  // SPATIAL (3)
  { id: 18, text: 'If you are looking at a standard world map facing North, in which direction is the continent of South America relative to Africa?', options: ['East', 'West', 'North', 'South'], correct: 1, trait: 'spatial' },
  { id: 19, text: 'A sculptor wants to make a human statue that is 3 times the size of a normal human. If a normal human arm is 70 cm, how long is the statue\'s arm?', options: ['140 cm', '210 cm', '280 cm', '350 cm'], correct: 1, trait: 'spatial' },
  { id: 20, text: 'When parallel railway tracks are viewed stretching towards the horizon, they appear to converge at a single point. This optical effect is:', options: ['Perspective/Vanishing point', 'Refraction', 'Isometric projection', 'Reflection'], correct: 0, trait: 'spatial' },
];

export const FBQ_GRADE10: { sections: Section[] } = {
  sections: [
    {
      ...FBQ.sections[0],
      questions: GRADE_10_APTITUDE_QUESTIONS,
    },
    ...FBQ.sections.slice(1),
  ]
};

export const FBQ_GRADE12_SCIENCE: { sections: Section[] } = {
  sections: [
    {
      ...FBQ.sections[0],
      questions: GRADE_12_SCIENCE_APTITUDE_QUESTIONS,
    },
    ...FBQ.sections.slice(1),
  ]
};

export const FBQ_GRADE12_COMMERCE: { sections: Section[] } = {
  sections: [
    {
      ...FBQ.sections[0],
      questions: GRADE_12_COMMERCE_APTITUDE_QUESTIONS,
    },
    ...FBQ.sections.slice(1),
  ]
};

export const FBQ_GRADE12_ARTS: { sections: Section[] } = {
  sections: [
    {
      ...FBQ.sections[0],
      questions: GRADE_12_ARTS_APTITUDE_QUESTIONS,
    },
    ...FBQ.sections.slice(1),
  ]
};

export const FBQ_SENIOR = FBQ;

// ─── JUNIOR (Grade 7-9) — Full Question Bank ─────────────────────────────────
// All 5 sections are age-appropriate: simple, fun, creative questions
// Types: Pattern Solving, Match the Pair, Odd-One-Out, Situational, Emoji-based
export const FBQ_JUNIOR: { sections: Section[] } = {
  sections: [
    // ── SECTION 1 — APTITUDE (20 simple MCQ for Grade 7-9) ──────────────────
    {
      id: 1, name: 'Brain Puzzles & Patterns', icon: '🧠', color: '#690B1B', type: 'mcq',
      description: 'Fun patterns, matching pairs, and brain teasers to test how you think!',
      questions: JUNIOR_APTITUDE_QUESTIONS,
    },

    // ── SECTION 2 — PERSONALITY (20 simple Likert for Grade 7-9) ────────────
    {
      id: 2, name: 'Who Are You? 🌟', icon: '🌟', color: '#7E3AF2', type: 'likert',
      description: 'Simple agree/disagree questions about your personality and daily habits.',
      questions: [
        // OPENNESS (5)
        { id: 21, text: '🎨 I love trying out new activities — like a new sport, craft, or hobby — even if I have never done it before.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness' },
        { id: 22, text: '📚 When I read a story, I enjoy imagining how things could have happened differently.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness' },
        { id: 23, text: '🌍 I get excited when I learn something completely new about the world — like a fun science fact or history story.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness' },
        { id: 24, text: '🏠 I prefer doing the same things every day rather than trying something new or different.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness', reverse: true },
        { id: 25, text: '🎵 I enjoy drawing, painting, writing stories, or making music in my free time.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'openness' },
        // CONSCIENTIOUSNESS (5)
        { id: 26, text: '📓 I finish my homework and assignments on time without being reminded by a teacher or parent.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness' },
        { id: 27, text: '🗂️ I keep my school bag, books, and study table neat and organised.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness' },
        { id: 28, text: '📅 When I have a test coming up, I start studying a few days before — not just the night before.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness' },
        { id: 29, text: '😴 I often forget to complete tasks or leave things for the last minute.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness', reverse: true },
        { id: 30, text: '✅ If I promise to do something, I always make sure I follow through and do it.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'conscientiousness' },
        // EXTRAVERSION (4)
        { id: 31, text: '🙋 In class or group activities, I am usually one of the first to raise my hand and share my answer.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion' },
        { id: 32, text: '🎉 I feel happy and full of energy after spending time playing or chatting with my friends.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion' },
        { id: 33, text: '🤝 I enjoy being a team captain or group leader during school activities or sports.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion' },
        { id: 34, text: '📖 I prefer reading a book or playing alone rather than going out and meeting many people.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'extraversion', reverse: true },
        // AGREEABLENESS (3)
        { id: 35, text: '💛 When a classmate is sad or upset, I go and check on them to make them feel better.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'agreeableness' },
        { id: 36, text: '🤝 I like helping my friends with their school work or projects even when I am busy.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'agreeableness' },
        { id: 37, text: '😤 I get annoyed when others do not do things the way I want them to be done.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'agreeableness', reverse: true },
        // NEUROTICISM (3)
        { id: 38, text: '😟 I feel very worried or nervous before an exam or a big school event.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'neuroticism' },
        { id: 39, text: '💪 When something goes wrong — like failing a test — I bounce back quickly and try again.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'neuroticism', reverse: true },
        { id: 40, text: '😌 Even when things feel difficult or confusing at school, I stay calm and do not panic easily.', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], correct: -1, trait: 'neuroticism', reverse: true },
      ]
    },

    // ── SECTION 3 — INTEREST INVENTORY (20 simple RIASEC for Grade 7-9) ──────
    {
      id: 3, name: 'What Do You Like? 🎯', icon: '🎯', color: '#057A55', type: 'choice',
      description: 'Pick the activity that sounds the most fun and exciting to you!',
      questions: [
        { id: 41, text: '🏫 If you could choose any school club to join, which one would it be?', options: ['Science & Robotics Club 🤖', 'Art & Craft Club 🎨', 'Debate & Public Speaking Club 🎤', 'Helping & Community Service Club 💛'], option_types: ['R', 'A', 'E', 'S'], correct: -1, trait: 'riasec' },
        { id: 42, text: '🎮 Which type of game do you enjoy the most?', options: ['Building games (like Minecraft/Lego) 🏗️', 'Quiz & brain puzzle games 🧩', 'Acting & storytelling games 🎭', 'Team sports and outdoor games 🏃'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 43, text: '📺 Which TV show or YouTube channel would you binge-watch?', options: ['How things are made (factories, machines) ⚙️', 'Science experiments & discovery 🔬', 'Drawing, cooking, or craft tutorials 🎨', 'Talk shows, comedy, or motivational content 😄'], option_types: ['R', 'I', 'A', 'E'], correct: -1, trait: 'riasec' },
        { id: 44, text: '🛠️ Which activity sounds most fun for a weekend project?', options: ['Fixing or building something with your hands 🔧', 'Running a small business or lemonade stand 💼', 'Writing a poem, story, or making a short film 📝', 'Organising a neighbourhood clean-up drive 🌱'], option_types: ['R', 'E', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 45, text: '📚 Which subject is your absolute favourite in school?', options: ['Maths & Science 🔢', 'History & Social Studies 📜', 'Art, Music, or Drama 🎵', 'English & Languages 📖'], option_types: ['I', 'C', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 46, text: '🏆 Which competition would you most love to enter at school?', options: ['Science & Maths Olympiad 🔬', 'Art & Painting Contest 🖌️', 'Debate & Quiz Bowl 🗣️', 'Sports Tournament 🏅'], option_types: ['I', 'A', 'E', 'R'], correct: -1, trait: 'riasec' },
        { id: 47, text: '🌟 Which school role sounds the coolest to you?', options: ['Class Monitor / School Captain 📋', 'Science Lab Assistant 🧪', 'School Magazine Editor ✍️', 'Peer Counsellor (helping students) 💬'], option_types: ['E', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 48, text: '🎒 If you could go on a school trip to any of these, which would you pick?', options: ['A space museum or technology expo 🚀', 'A nature park or wildlife sanctuary 🦁', 'A theatre show or art gallery 🎭', 'A hospital or social service centre 🏥'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 49, text: '💻 What would you most enjoy making on a computer?', options: ['A simple game or animation 🎮', 'A spreadsheet or organised database 📊', 'A digital painting or music composition 🎼', 'A blog or video about a topic you love 📹'], option_types: ['R', 'C', 'A', 'E'], correct: -1, trait: 'riasec' },
        { id: 50, text: '🌈 Which of these real jobs sounds the coolest to you right now?', options: ['Engineer or Inventor 🔧', 'Doctor or Scientist 🩺', 'Artist or Designer 🎨', 'Teacher or Counsellor 📘'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 51, text: '🧠 Which activity do you do best and enjoy the most?', options: ['Solving maths puzzles or fixing things ⚙️', 'Reading, researching, and discovering facts 🔍', 'Creating — drawing, writing, singing, or acting 🎤', 'Helping or teaching a friend who is struggling 🤝'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 52, text: '💡 If you could invent something, what would it be?', options: ['A cool machine or gadget 🤖', 'A new way to organise and track things neatly 📋', 'A beautiful piece of art or music 🎵', 'Something that helps people in need 💛'], option_types: ['R', 'C', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 53, text: '🎤 If you had your own YouTube channel, what would it be about?', options: ['DIY projects and building stuff 🏗️', 'Facts, trivia, and science experiments 🔬', 'Vlogs, comedy sketches, or creative content 😂', 'Motivational talks and helping people grow 🌟'], option_types: ['R', 'I', 'A', 'E'], correct: -1, trait: 'riasec' },
        { id: 54, text: '🏅 Which achievement would make you feel the proudest?', options: ['Winning a science or maths competition 🏆', 'Selling something you made yourself 💰', 'Performing on stage in front of a big audience 🎭', 'Being chosen to represent your school at an event 📣'], option_types: ['I', 'E', 'A', 'E'], correct: -1, trait: 'riasec' },
        { id: 55, text: '🌱 If your school needed volunteers, which role would you choose?', options: ['Setting up computers and AV equipment 💻', 'Decorating the hall and making banners 🎨', 'Coordinating activities and managing the schedule 📋', 'Welcoming guests and looking after younger kids 🤗'], option_types: ['R', 'A', 'C', 'S'], correct: -1, trait: 'riasec' },
        { id: 56, text: '📖 Which book would you pick from the library?', options: ['How Science and Technology Changed the World ⚗️', 'Famous Biographies of Scientists and Inventors 🧬', 'Stories of Artists, Musicians, and Filmmakers 🎬', 'Inspiring Stories of Leaders Who Changed Society 🌍'], option_types: ['R', 'I', 'A', 'E'], correct: -1, trait: 'riasec' },
        { id: 57, text: '🤝 How do you prefer to work on school projects?', options: ['Alone — so I can build or experiment my own way 🔧', 'In a small focused group with a clear plan 📝', 'Creatively — with freedom to express my own ideas 🎨', 'As a team where everyone participates and contributes 🙌'], option_types: ['R', 'C', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 58, text: '😊 Which of these activities do you do purely for fun (not for marks)?', options: ['Tinkering with gadgets or building models 🛠️', 'Solving puzzles, riddles, or quiz questions 🧩', 'Sketching, journaling, or making music 🎵', 'Chatting, mentoring, or helping a friend 💬'], option_types: ['R', 'I', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 59, text: '🔭 Which future career sounds exciting when you imagine it?', options: ['Space Engineer or Game Developer 🚀', 'Business Owner or Startup Founder 💼', 'Fashion Designer or Filmmaker 🎬', 'Psychologist or Social Worker 🧠'], option_types: ['R', 'E', 'A', 'S'], correct: -1, trait: 'riasec' },
        { id: 60, text: '✨ When you grow up, what is the ONE thing you want your work to be known for?', options: ['Making something cool and innovative 🔧', 'Organising things perfectly and efficiently 📋', 'Creating beautiful art or entertainment 🎨', 'Making people\'s lives better and happier 💛'], option_types: ['R', 'C', 'A', 'S'], correct: -1, trait: 'riasec' },
      ]
    },

    // ── SECTION 4 — LEARNING STYLE (20 simple VARK for Grade 7-9) ────────────
    {
      id: 4, name: 'How Do You Learn Best? 📚', icon: '📚', color: '#C9A55D', type: 'choice',
      description: 'Tell us how you like to study and learn new things at school!',
      questions: [
        { id: 61, text: '📖 When your teacher introduces a new chapter, what helps you understand it best?', options: ['A diagram, picture, or chart on the board 🖼️', 'Teacher explaining it out loud with examples 🗣️', 'Reading the textbook yourself quietly 📘', 'Trying out an activity or experiment right away 🧪'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 62, text: '🗺️ When you need to remember where countries are on a map, you:', options: ['Look at a colourful map and trace the outlines 🗺️', 'Repeat the country names aloud until you remember 📣', 'Write the names down in a list and read them 📝', 'Point to and touch each country on the map 👆'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 63, text: '📝 What is your favourite way to take notes in class?', options: ['Draw pictures, arrows, and diagrams ✏️', 'Write down exactly what the teacher says 🖊️', 'Write a neat summary in your own words 📋', 'Skip notes and just do the exercises right away 📌'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 64, text: '🎲 When you play a new board game, how do you learn the rules?', options: ['Look at the pictures and cards in the box 🖼️', 'Ask someone to explain the rules to you out loud 🗣️', 'Read the instruction booklet carefully 📖', 'Just start playing and learn as you go 🎯'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 65, text: '🔢 When you get a maths problem you don\'t understand, you:', options: ['Draw a picture or diagram to understand it 📐', 'Ask a friend or teacher to explain it verbally 💬', 'Re-read the textbook example very carefully 📘', 'Just try solving different practice questions 🖊️'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 66, text: '⏳ The night before an exam, what do you do to study?', options: ['Review my colourful notes, charts, and mind maps 🗂️', 'Read my notes out loud or explain topics to myself 🗣️', 'Re-read chapters and rewrite important points 📖', 'Solve as many practice questions as I can 📝'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 67, text: '🌿 To remember the parts of a plant for a test, you would:', options: ['Draw and label the plant with colours 🖍️', 'Say the parts out loud like a rhyme or song 🎵', 'Write each part and its function in a list 📋', 'Touch or point to each part on a real plant or model 🌱'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 68, text: '📹 You\'re watching a documentary for a project. What do you do to remember what you learnt?', options: ['Sketch the key visuals and diagrams you see 🖼️', 'Discuss what you saw with a friend right after 💬', 'Write a short summary with bullet points 📝', 'Re-enact or physically recreate something from the video 🎬'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 69, text: '🏠 At home, how do you prefer to do your homework?', options: ['Sitting quietly with colourful pens and highlighters 🖊️', 'With some background music or sound to focus 🎶', 'In complete silence, reading and re-reading 🤫', 'Taking breaks and moving around between tasks 🏃'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 70, text: '🎭 If your class puts on a play, what role would you enjoy most?', options: ['Designing the stage set and costumes 🎨', 'Playing an acting role with lots of dialogue 🎤', 'Writing the script and stage directions ✍️', 'Building the props and managing backstage 🛠️'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 71, text: '🌈 What kind of project do you find easiest and most enjoyable?', options: ['Making a colourful poster or visual presentation 🎨', 'Giving a speech or oral presentation to the class 🗣️', 'Writing a detailed essay or report 📝', 'Doing a hands-on science experiment or model 🔬'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 72, text: '🏋️ When learning a new sport or physical activity, you prefer:', options: ['Watching a video of someone doing it correctly 📹', 'Listening to the coach explain what to do 🗣️', 'Reading the rules and techniques first 📖', 'Just jumping in and trying it yourself 🏃'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 73, text: '🎵 When you learn a new song for school, how do you memorise it?', options: ['Look at the written lyrics and follow along 👁️', 'Listen to it repeatedly until it sticks 🎧', 'Write out the lyrics yourself by hand 📝', 'Sing and perform it out loud with actions 🎤'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 74, text: '🤔 When explaining something to a friend, you usually:', options: ['Draw it out with a diagram or picture 🖼️', 'Tell them the story in your own words 💬', 'Show them the page in the textbook 📘', 'Do a quick demonstration or role-play it 🎭'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 75, text: '🗝️ What makes studying feel less boring to you?', options: ['Using colours, stickers, and pretty notebooks 🖍️', 'Playing study music or having someone explain it 🎵', 'Finding a well-written guide or clear notes 📖', 'Making it into a game or challenge 🎮'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 76, text: '🌟 Which learning style is most like you?', options: ['I like seeing things — pictures, charts, diagrams 👁️', 'I like hearing things — talks, podcasts, discussions 👂', 'I like reading and writing things down 📝', 'I like doing things — experiments, building, moving 🖐️'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 77, text: '📌 If you forget something during an exam, what helps you remember?', options: ['Picturing the diagram or colourful notes I made 🖼️', 'Replaying how the teacher said it in my head 🗣️', 'Remembering the exact words I read in the book 📖', 'Thinking about the activity I did when I learnt it 🧪'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 78, text: '💡 How do you best understand a concept in science?', options: ['Watching an animated video or seeing a chart 📊', 'The teacher explaining it with real-life examples 🗣️', 'Reading a detailed explanation and making notes 📘', 'Doing a hands-on experiment in the lab 🔬'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 79, text: '🖐️ Which of these would you do first when given a new school assignment?', options: ['Search for visuals, images, or infographics online 🖼️', 'Watch a video or ask someone to explain the topic 📹', 'Read a book or article about the topic first 📚', 'Start working on the task right away to learn by doing 🖊️'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
        { id: 80, text: '🎓 After finishing a project, how do you know you actually understood it?', options: ['I can draw or sketch the whole concept clearly 🖊️', 'I can explain it out loud to someone else without notes 🗣️', 'I can write a summary with all the key points 📝', 'I can apply it to a real-life task or problem 🏗️'], option_types: ['V', 'A', 'R', 'K'], correct: -1, trait: 'vark' },
      ]
    },

    // ── SECTION 5 — CAREER VALUES (20 simple choice for Grade 7-9) ───────────
    {
      id: 5, name: 'What Matters to You? 💼', icon: '💼', color: '#690B1B', type: 'choice',
      description: 'Pick the option that feels most "YOU" — there are no wrong answers!',
      questions: [
        { id: 81, text: '🌟 When you grow up, what is the most important thing you want from your job?', options: ['To create something amazing and new 🎨', 'To help and take care of people 💛', 'To earn lots of money 💰', 'To be a respected leader or boss 👑'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 82, text: '🏆 If you won a prize at school, which award would mean the most to you?', options: ['Most Creative Student 🎨', 'Most Helpful Student 💛', 'Best Academic Score 📊', 'Best Student Leader 🏅'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 83, text: '💼 Which part of a job sounds the most exciting to you?', options: ['Working in a fun, close team with your best friends 🤝', 'Having a safe and stable routine you can count on 🏠', 'Exploring new places and trying new challenges 🌍', 'Being in charge and making important decisions 👑'], option_types: ['teamwork', 'stability', 'adventure', 'leadership'], correct: -1, trait: 'values' },
        { id: 84, text: '😊 Which of these makes you feel the happiest and proudest?', options: ['Creating something beautiful — art, music, or a story 🎨', 'Helping a friend or someone who is struggling 💛', 'Doing something no one has ever done before 🚀', 'Being really good at something and getting praised for it 🌟'], option_types: ['creativity', 'helping', 'adventure', 'status'], correct: -1, trait: 'values' },
        { id: 85, text: '🔑 If your dream job were a superpower, what would it be?', options: ['The power to create wonderful things 🎨', 'The power to heal and help people 💊', 'The power to lead and inspire thousands 🎤', 'The power to explore any place in the universe 🚀'], option_types: ['creativity', 'helping', 'leadership', 'adventure'], correct: -1, trait: 'values' },
        { id: 86, text: '🏠 Which type of workspace sounds most like your dream?', options: ['A colourful art studio or music room 🎵', 'A hospital, school, or community centre 🏥', 'A cool startup office with a fun team 🏢', 'Outdoors — in nature, on field trips, or travelling 🌿'], option_types: ['creativity', 'helping', 'teamwork', 'adventure'], correct: -1, trait: 'values' },
        { id: 87, text: '📅 What does your ideal workday look like when you grow up?', options: ['Making something new every single day 🛠️', 'Talking to and helping different people all day 💬', 'Having a clear plan and routine each day 📋', 'Doing something different and exciting every day 🎉'], option_types: ['creativity', 'helping', 'stability', 'adventure'], correct: -1, trait: 'values' },
        { id: 88, text: '🤔 What would make you choose one job over another?', options: ['It lets me be creative and express myself freely ✨', 'It lets me make a real difference in someone\'s life 💛', 'It pays well and gives me financial comfort 💰', 'It gives me the chance to travel and explore 🌍'], option_types: ['creativity', 'helping', 'financial', 'adventure'], correct: -1, trait: 'values' },
        { id: 89, text: '🌱 If you could change one thing about the world, what would it be?', options: ['Make the world more colourful and full of art 🎨', 'Make sure everyone is healthy and happy 💊', 'Make sure everyone has enough money to live well 💰', 'Make sure everyone has the freedom to explore and grow 🌍'], option_types: ['creativity', 'helping', 'financial', 'impact'], correct: -1, trait: 'values' },
        { id: 90, text: '🌟 What kind of story do you want people to tell about you when you are famous?', options: ['"They created amazing things that inspired everyone" 🎨', '"They helped so many people and made life better" 💛', '"They were successful and built a big company" 💼', '"They were an incredible leader everyone looked up to" 👑'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 91, text: '🎯 Which project would you be most excited to work on after school today?', options: ['Painting or making a creative art/craft project 🖌️', 'Visiting elderly people at a care home to cheer them up 💛', 'Organising a small fair or event for your neighbourhood 📣', 'Exploring a hiking trail or going on a nature walk 🌿'], option_types: ['creativity', 'helping', 'leadership', 'adventure'], correct: -1, trait: 'values' },
        { id: 92, text: '💡 What makes you feel most excited about the future?', options: ['Inventing something nobody has thought of before 💡', 'Becoming someone people come to for advice and support 🤝', 'Being a successful person with a great lifestyle 🌟', 'Being known for doing something that made history 🏅'], option_types: ['creativity', 'helping', 'financial', 'status'], correct: -1, trait: 'values' },
        { id: 93, text: '🤝 When working in a team at school, what role do you usually take?', options: ['The creative one — coming up with all the cool ideas 💡', 'The helper — making sure everyone is okay and included 💛', 'The organiser — managing the plan and keeping things on track 📋', 'The leader — directing the group and making final decisions 👑'], option_types: ['creativity', 'helping', 'stability', 'leadership'], correct: -1, trait: 'values' },
        { id: 94, text: '🎁 If someone gave you ₹10,000 to spend on anything, what would you do?', options: ['Buy art supplies, craft materials, or music equipment 🎨', 'Donate it to a cause that helps animals or people in need 🐾', 'Save it and invest it to grow even more over time 💰', 'Plan an adventure trip somewhere new and exciting 🌍'], option_types: ['creativity', 'helping', 'financial', 'adventure'], correct: -1, trait: 'values' },
        { id: 95, text: '😔 Which situation would feel the WORST at a future job?', options: ['Not being allowed to be creative or think freely 🚫', 'Working alone with no people around you at all 😶', 'Not knowing if your job is safe or secure 😟', 'Doing the same boring thing over and over forever 😴'], option_types: ['creativity', 'teamwork', 'stability', 'adventure'], correct: -1, trait: 'values' },
        { id: 96, text: '📣 If you had to give a speech in front of your entire school, what would it be about?', options: ['Why art and creativity make life more beautiful 🎨', 'Why kindness and helping others matters most 💛', 'How to become financially smart and successful 💰', 'Why trying new things and being brave is so important 🚀'], option_types: ['creativity', 'helping', 'financial', 'adventure'], correct: -1, trait: 'values' },
        { id: 97, text: '🔒 How important is it to you to have a stable, secure job with a fixed routine?', options: ['Not very — I want freedom to create my own path 🎨', 'Somewhat — I care more about helping others than stability 💛', 'Very important — I want to know exactly what to expect 🏠', 'Not at all — I love exciting and unpredictable work 🌍'], option_types: ['creativity', 'helping', 'stability', 'adventure'], correct: -1, trait: 'values' },
        { id: 98, text: '🌈 If your future career were an emoji, which one would you want it to be?', options: ['🎨 (Creative, artistic, expressive)', '❤️ (Caring, helpful, kind)', '💼 (Successful, businesslike, organised)', '🌍 (Adventurous, exploring, always changing)'], option_types: ['creativity', 'helping', 'financial', 'adventure'], correct: -1, trait: 'values' },
        { id: 99, text: '🏅 In your school life right now, what makes you feel most proud of yourself?', options: ['When I make something creative that people admire 🎨', 'When I help a friend who was really struggling 💛', 'When I get a great score or top ranking in class 📊', 'When I take charge and organise something successfully 📣'], option_types: ['creativity', 'helping', 'financial', 'leadership'], correct: -1, trait: 'values' },
        { id: 100, text: '✨ If your future life was a movie, what genre would you want it to be?', options: ['An epic adventure full of exploration 🌍', 'A heartwarming story of helping and changing lives 💛', 'An inspiring rags-to-riches success story 💰', 'A creative masterpiece that the whole world loves 🎨'], option_types: ['adventure', 'helping', 'financial', 'creativity'], correct: -1, trait: 'values' },
      ]
    },
  ]
};

export const VARK_TIPS: Record<string, string[]> = {
  V: ['Create colourful mind-maps and flowcharts when studying', 'Use diagrams, graphs, and infographics to understand concepts', 'Watch educational videos and documentaries', 'Colour-code your notes to organise information visually'],
  A: ['Record yourself explaining a concept and play it back', 'Discuss topics with classmates or study groups', 'Listen to educational podcasts and audiobooks', 'Use mnemonics, rhymes, and verbal repetition'],
  R: ['Re-read chapters and write detailed summaries in your own words', 'Make comprehensive written notes during class', 'Use written practice tests and essay-form answers', 'Keep a study journal to organise key learnings'],
  K: ['Learn through hands-on experiments and real applications', 'Use physical flashcards that you can sort', 'Take frequent movement breaks to maintain focus', 'Apply concepts to real-world scenarios or build models']
};

export const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
export const API_URL = API_KEY.startsWith('AQ.')
  ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
  : 'https://api.groq.com/openai/v1/chat/completions';
export const MODELS = API_KEY.startsWith('AQ.')
  ? ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']
  : ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];

export interface JuniorPlanWeek {
  week: number;
  topic: string;
  focus: string;
  student: boolean;
  parent: boolean;
  activity: string;
  followUp: string;
}

export interface JuniorPlanMonth {
  month: number;
  weeks: JuniorPlanWeek[];
}

export const JUNIOR_PLAN_7_8: JuniorPlanMonth[] = [
  {
    month: 1,
    weeks: [
      { week: 1, topic: "Academics", focus: "Goal Setting & Time Management", student: true, parent: true, activity: "Discuss long-term goals, introduce time management techniques.", followUp: "Goal setting worksheet, time management app suggestions." },
      { week: 2, topic: "Standardized Tests", focus: "Introduction to Standardized Tests", student: true, parent: true, activity: "Overview of relevant tests (PSAT 8/9, TOEFL Junior), scoring patterns, and importance.", followUp: "Test registration details, sample test papers." },
      { week: 3, topic: "Extra-Curriculars", focus: "Exploring Interests & Identifying Strengths", student: true, parent: false, activity: "Discuss various extracurricular options (debate, sports, music, coding), help identify student's interests and strengths.", followUp: "List of potential extracurricular activities, online resources." },
      { week: 4, topic: "Profile", focus: "Building a Strong Foundation", student: true, parent: false, activity: "Importance of academic excellence, developing good study habits, exploring different subjects.", followUp: "Subject-specific resources, study tips." }
    ]
  },
  {
    month: 2,
    weeks: [
      { week: 1, topic: "Academics", focus: "Subject-Specific Guidance", student: true, parent: false, activity: "Focus on core subjects (Math, Science, English), address any academic challenges.", followUp: "Tutoring recommendations, online learning platforms." },
      { week: 2, topic: "Standardized Tests", focus: "PSAT 8/9 Preparation", student: true, parent: false, activity: "Strategies for tackling different sections (Reading, Writing & Language, Math), practice questions.", followUp: "PSAT 8/9 study plan, online practice resources." },
      { week: 3, topic: "Extra-Curriculars", focus: "Deep Dive into Extracurriculars", student: true, parent: true, activity: "Encourage participation in chosen activities, discuss leadership roles and skill development.", followUp: "Competition information, leadership opportunities." },
      { week: 4, topic: "Profile", focus: "Early Exposure to Research", student: true, parent: false, activity: "Introduce basic research concepts, explore age-appropriate research opportunities (science fairs, online projects).", followUp: "Research project ideas, mentorship opportunities." }
    ]
  },
  {
    month: 3,
    weeks: [
      { week: 1, topic: "Academics", focus: "Olympiad Preparation", student: true, parent: false, activity: "Introduce various Olympiads (IMO, NSO, IEO), discuss preparation strategies and resources.", followUp: "Olympiad study material, online mock tests." },
      { week: 2, topic: "Standardized Tests", focus: "TOEFL Junior Preparation", student: true, parent: false, activity: "Focus on English language skills (listening, reading, speaking, writing), practice tests.", followUp: "TOEFL Junior study plan, online language learning resources." },
      { week: 3, topic: "Extra-Curriculars", focus: "Community Engagement", student: true, parent: true, activity: "Encourage volunteering and community service, discuss the importance of social responsibility.", followUp: "Volunteering opportunities, community service projects." },
      { week: 4, topic: "Profile", focus: "Building a Portfolio", student: true, parent: false, activity: "Importance of documenting achievements and activities, create a basic portfolio.", followUp: "Portfolio building tools, online platforms." }
    ]
  },
  {
    month: 4,
    weeks: [
      { week: 1, topic: "Academics", focus: "Summer Program Exploration", student: true, parent: true, activity: "Research summer programs (academic, enrichment, leadership), discuss application process.", followUp: "List of summer programs, application deadlines." },
      { week: 2, topic: "Standardized Tests", focus: "Test Taking Strategies", student: true, parent: false, activity: "General test-taking tips, time management techniques, stress management.", followUp: "Test anxiety resources, mindfulness exercises." },
      { week: 3, topic: "Extra-Curriculars", focus: "Developing Soft Skills", student: true, parent: false, activity: "Focus on communication, teamwork, leadership, and problem-solving skills.", followUp: "Soft skills development workshops, online resources." },
      { week: 4, topic: "Profile", focus: "Personal Branding", student: true, parent: true, activity: "Importance of online presence, creating a professional email address, basic online etiquette.", followUp: "Social media guidelines, online safety tips." }
    ]
  },
  {
    month: 5,
    weeks: [
      { week: 1, topic: "Academics", focus: "Review & Goal Setting", student: true, parent: true, activity: "Review academic progress, set goals for the next academic year.", followUp: "Academic progress report, goal setting worksheet." },
      { week: 2, topic: "Standardized Tests", focus: "Mock Tests & Analysis", student: true, parent: true, activity: "Take practice tests for PSAT 8/9 and TOEFL Junior, analyze results, identify areas for improvement.", followUp: "Test performance analysis, personalized study plan." },
      { week: 3, topic: "Extra-Curriculars", focus: "Summer Planning", student: true, parent: true, activity: "Finalize summer plans, ensure a balance between academics and extracurricular activities.", followUp: "Summer schedule, activity checklist." },
      { week: 4, topic: "Profile", focus: "Networking & Mentorship", student: true, parent: false, activity: "Encourage networking with professionals and alumni, explore mentorship opportunities.", followUp: "Networking events, mentorship programs." }
    ]
  },
  {
    month: 6,
    weeks: [
      { week: 1, topic: "Academics", focus: "Summer Reading List", student: true, parent: false, activity: "Provide a list of age-appropriate books to enhance reading comprehension and vocabulary.", followUp: "Book reviews, online reading platforms." },
      { week: 2, topic: "Standardized Tests", focus: "Continued Test Preparation", student: true, parent: false, activity: "Ongoing practice and review for PSAT 8/9 and TOEFL Junior.", followUp: "Weekly practice schedule, online quizzes." },
      { week: 3, topic: "Extra-Curriculars", focus: "Summer Activities", student: true, parent: false, activity: "Encourage participation in chosen summer activities, document experiences.", followUp: "Activity log, photo journal." },
      { week: 4, topic: "Profile", focus: "Reflection & Goal Setting", student: true, parent: true, activity: "Reflect on summer experiences, set goals for the upcoming academic year.", followUp: "Reflective journal, goal setting worksheet." }
    ]
  },
  {
    month: 7,
    weeks: [
      { week: 1, topic: "Academics", focus: "Academic Planning", student: true, parent: true, activity: "Discuss course selection for the next academic year, explore advanced options.", followUp: "Course catalog, academic advising resources." },
      { week: 2, topic: "Standardized Tests", focus: "Test Date Scheduling", student: true, parent: false, activity: "Schedule PSAT 8/9 and TOEFL Junior exams, discuss test day logistics.", followUp: "Test center information, exam day checklist." },
      { week: 3, topic: "Extra-Curriculars", focus: "Exploring New Interests", student: true, parent: false, activity: "Encourage trying new activities, broaden horizons, develop new skills.", followUp: "List of potential activities, online resources." },
      { week: 4, topic: "Profile", focus: "Updating Portfolio", student: true, parent: false, activity: "Add new achievements and experiences to the portfolio, refine presentation.", followUp: "Portfolio review checklist, online feedback tools." }
    ]
  },
  {
    month: 8,
    weeks: [
      { week: 1, topic: "Academics", focus: "Back to School Preparation", student: true, parent: false, activity: "Review academic goals, organize study materials, prepare for the new academic year.", followUp: "Study schedule, organizational tools." },
      { week: 2, topic: "Standardized Tests", focus: "Final Test Preparation", student: true, parent: false, activity: "Intensive review and practice for upcoming exams, focus on weak areas.", followUp: "Targeted practice material, online mock tests." },
      { week: 3, topic: "Extra-Curriculars", focus: "Extracurricular Planning", student: true, parent: false, activity: "Plan extracurricular activities for the new academic year, explore leadership roles.", followUp: "Activity schedule, leadership opportunities." },
      { week: 4, topic: "Profile", focus: "Building a Strong Online Presence", student: true, parent: false, activity: "Refine online profiles, showcase achievements and interests, maintain a professional image.", followUp: "Social media guidelines, online portfolio platforms." }
    ]
  },
  {
    month: 9,
    weeks: [
      { week: 1, topic: "Academics", focus: "Academic Performance Monitoring", student: true, parent: false, activity: "Track academic progress, address any challenges, provide support and guidance.", followUp: "Progress reports, tutoring recommendations." },
      { week: 2, topic: "Standardized Tests", focus: "Post-Test Analysis", student: true, parent: false, activity: "Review test scores, analyze performance, identify areas for improvement.", followUp: "Score report analysis, personalized feedback." },
      { week: 3, topic: "Extra-Curriculars", focus: "Continued Engagement", student: true, parent: false, activity: "Encourage active participation in extracurricular activities, develop leadership skills.", followUp: "Competition information, leadership workshops." },
      { week: 4, topic: "Profile", focus: "Essay Writing & Communication Skills", student: true, parent: false, activity: "Focus on developing strong writing and communication skills, practice essay writing.", followUp: "Essay writing resources, online writing tools." }
    ]
  },
  {
    month: 10,
    weeks: [
      { week: 1, topic: "Academics", focus: "Advanced Course Exploration", student: true, parent: false, activity: "Research advanced courses and programs (AP, IB), discuss eligibility and benefits.", followUp: "Course information, program requirements." },
      { week: 2, topic: "Standardized Tests", focus: "Standardized Test Planning", student: true, parent: true, activity: "Discuss future standardized tests (SAT, ACT), introduce test formats and content.", followUp: "Test registration details, sample test papers." },
      { week: 3, topic: "Extra-Curriculars", focus: "Building a Diverse Profile", student: true, parent: false, activity: "Encourage participation in a variety of activities, showcase diverse interests and skills.", followUp: "Activity suggestions, online resources." },
      { week: 4, topic: "Profile", focus: "Public Speaking & Presentation Skills", student: true, parent: false, activity: "Develop confident public speaking and presentation skills, practice delivering presentations.", followUp: "Public speaking workshops, online presentation tools." }
    ]
  },
  {
    month: 11,
    weeks: [
      { week: 1, topic: "Academics", focus: "Academic Enrichment", student: true, parent: false, activity: "Explore academic competitions, research opportunities, and online learning platforms.", followUp: "Competition information, research programs." },
      { week: 2, topic: "Standardized Tests", focus: "Early SAT/ACT Preparation", student: true, parent: false, activity: "Introduce basic concepts and strategies for SAT/ACT, start early preparation.", followUp: "SAT/ACT study plan, online practice resources." },
      { week: 3, topic: "Extra-Curriculars", focus: "Leadership Development", student: true, parent: false, activity: "Focus on developing leadership qualities, encourage taking on leadership roles in activities.", followUp: "Leadership training programs, mentorship opportunities." },
      { week: 4, topic: "Profile", focus: "Resume Building", student: true, parent: false, activity: "Create a basic resume highlighting academic achievements, extracurricular activities, and skills.", followUp: "Resume templates, online resume builders." }
    ]
  },
  {
    month: 12,
    weeks: [
      { week: 1, topic: "Academics", focus: "End-of-Year Review", student: true, parent: true, activity: "Review academic progress, celebrate achievements, set goals for the next year.", followUp: "Progress report, goal setting worksheet." },
      { week: 2, topic: "Standardized Tests", focus: "Continued SAT/ACT Prep", student: true, parent: false, activity: "Ongoing practice and review for SAT/ACT, focus on building a strong foundation.", followUp: "Weekly practice schedule, online quizzes." },
      { week: 3, topic: "Extra-Curriculars", focus: "Community Service & Volunteering", student: true, parent: false, activity: "Encourage continued engagement in community service, explore new volunteering opportunities.", followUp: "Volunteering opportunities, community service projects." },
      { week: 4, topic: "Profile", focus: "Personal Statement Brainstorming", student: true, parent: true, activity: "Start brainstorming ideas for college application personal statements, reflect on experiences.", followUp: "Personal statement prompts, reflective writing exercises." }
    ]
  }
];

export interface JuniorMatrixRow {
  activity: string;
  y1: number[];
  y2: number[];
  y3: number[];
  y4: number[];
  total: number;
}

export const JUNIOR_MATRIX_9: JuniorMatrixRow[] = [
  { activity: "1:1 Profile Assessment", y1: [1, 0, 0, 1], y2: [1, 0, 0, 1], y3: [1, 0, 0, 0], y4: [0, 0, 0, 0], total: 5 },
  { activity: "1:1 Career Counseling Sessions", y1: [2, 3, 2, 0], y2: [1, 1, 4, 1], y3: [1, 1, 1, 1], y4: [1, 2, 0, 1], total: 20 },
  { activity: "Profile Building - Internships, Experiences, Community Services", y1: [1, 1, 2, 0], y2: [2, 2, 0, 1], y3: [1, 1, 0, 1], y4: [0, 0, 0, 0], total: 12 },
  { activity: "Test Requirement - Initial Test Preparation and Classes", y1: [0, 0, 0, 1], y2: [1, 1, 0, 0], y3: [1, 0, 0, 0], y4: [0, 0, 0, 0], total: 4 },
  { activity: "Exclusive Webinars", y1: [1, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 0, 0], y4: [0, 0, 0, 0], total: 1 },
  { activity: "Advanced Skill Development", y1: [0, 1, 0, 0], y2: [1, 0, 2, 0], y3: [0, 2, 0, 0], y4: [0, 0, 0, 0], total: 6 },
  { activity: "Workshop and Seminars", y1: [0, 1, 1, 1], y2: [0, 0, 0, 0], y3: [0, 0, 2, 0], y4: [0, 0, 1, 0], total: 6 },
  { activity: "University Research", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [1, 0, 0, 0], y4: [0, 0, 0, 0], total: 1 },
  { activity: "Financial Planning", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 1, 1, 0], y4: [0, 0, 1, 0], total: 2 },
  { activity: "CV/Resume Building", y1: [0, 0, 1, 0], y2: [0, 0, 1, 0], y3: [0, 1, 0, 0], y4: [0, 0, 0, 0], total: 3 },
  { activity: "Language Proficiency", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 1, 0, 0], y4: [0, 0, 0, 0], total: 1 },
  { activity: "University Shortlisting", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 1, 1], y4: [0, 0, 1, 0], total: 3 },
  { activity: "Application Guidance", y1: [0, 0, 0, 1], y2: [0, 0, 0, 0], y3: [0, 0, 0, 0], y4: [1, 1, 0, 0], total: 3 },
  { activity: "Financial Aid Exploration (Scholarship, Grants, Loans)", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 1, 0], y4: [0, 0, 0, 1], total: 2 },
  { activity: "Standardized Test Preparation Counselling", y1: [0, 1, 0, 0], y2: [0, 2, 0, 0], y3: [0, 1, 1, 0], y4: [1, 0, 0, 0], total: 6 },
  { activity: "Career Path Refinement", y1: [1, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 0, 0], y4: [0, 0, 0, 0], total: 1 },
  { activity: "Final Application Assistance", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 0, 0], y4: [0, 2, 1, 1], total: 4 },
  { activity: "Interview Preparation", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 0, 0], y4: [0, 0, 1, 1], total: 2 },
  { activity: "Visa and Immigration Support", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 0, 0], y4: [1, 0, 0, 2], total: 3 },
  { activity: "Post-Acceptance Guidance", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 0, 0], y4: [0, 0, 0, 1], total: 1 },
  { activity: "Networking and Alumni Support", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [0, 0, 0, 1], y4: [0, 0, 0, 0], total: 1 },
  { activity: "Job Market Insights", y1: [0, 0, 0, 0], y2: [0, 1, 0, 0], y3: [0, 0, 0, 0], y4: [0, 0, 1, 0], total: 2 },
  { activity: "1:1 Personalised Documents Editing (SOP, Essay, Application)", y1: [0, 0, 0, 0], y2: [0, 0, 0, 0], y3: [2, 1, 1, 1], y4: [2, 1, 0, 0], total: 7 }
];

