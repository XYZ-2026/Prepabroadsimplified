/**
 * Class 10 Deterministic Roadmap Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Calculates complete education & career roadmaps, degree choices, colleges,
 * postgraduate directions, global study abroad guides, multi-year timelines,
 * and individual action plans without calling external LLM APIs.
 */

import type { EditorialStudent, EditorialScores } from './class10_editorial_engine';
import type { AlignmentResult } from './comparison-engine';

export interface DegreeOption {
  degree: string;
  specialization: string;
  whyFits: string;
  careerOutcomes: string;
}

export interface PathwayRoadmapData {
  pathwayName: string;
  pathwayTitle: string;
  pathwayRankLabel: string;
  fitScore: number;
  rationale: string;
  foundation: {
    subjects: string[];
    exams: string[];
    curriculumFocus: string;
  };
  bachelors: DegreeOption[];
  colleges: {
    reach: string[];
    fit: string[];
    accessible: string[];
  };
  masters: string[];
  careerOutcomes: string[];
  skills: string[];
  targetCompanies: string[];
  milestone: string;
}

export interface StudyAbroadCountry {
  flag: string;
  name: string;
  reason: string;
  academicRoute: string;
  costCategory: string;
}

export interface StudyAbroadGuideData {
  rationale: string;
  fitmentSummary: string;
  parentOpennessLabel: string;
  financialAlignmentLabel: string;
  countries: StudyAbroadCountry[];
  scholarships: string[];
  programs: string[];
}

export interface AcademicStage {
  phase: string;
  label: string;
  icon: string;
  academicGoal: string;
  profileGoal: string;
  keySkills: string[];
  milestone: string;
}

export interface StudentActionPlanData {
  thisMonth: string[];
  next90Days: string[];
  thisAcademicYear: string[];
  skillsToBuild: string[];
  counsellorCheckpoint: string[];
  studentAction: string[];
}

// ─── HELPER: CLASSIFY PATHWAY DOMAIN ────────────────────────────────────────

export type SpecializedDomain =
  | 'CIVIL_ARCHITECTURE'
  | 'MECHANICAL_AEROSPACE'
  | 'ELECTRICAL_ELECTRONICS'
  | 'ROBOTICS_AUTOMATION'
  | 'SOFTWARE_AI_CS'
  | 'MEDICINE_SURGERY'
  | 'PHARMACY_BIOTECH'
  | 'CHARTERED_ACCOUNTANCY_FINANCE'
  | 'LAW_LEGAL'
  | 'BUSINESS_MANAGEMENT_MARKETING'
  | 'PSYCHOLOGY_HUMANITIES'
  | 'DESIGN_ANIMATION_FINE_ARTS'
  | 'PURE_SCIENCES';

export function getSpecializedDomain(pathwayName: string): SpecializedDomain {
  const name = pathwayName.toLowerCase();
  
  if (/civil|architecture|construction|structural|urban planning|infrastructure|building/i.test(name)) {
    return 'CIVIL_ARCHITECTURE';
  }
  if (/mechanical|aerospace|aeronautical|automobile|automotive|thermal|petroleum|mining|metallurg/i.test(name)) {
    return 'MECHANICAL_AEROSPACE';
  }
  if (/electrical|electronics|ece|vlsi|semiconductor|telecom|microelectronics/i.test(name)) {
    return 'ELECTRICAL_ELECTRONICS';
  }
  if (/robotics|automation|mechatronics|autonomous/i.test(name)) {
    return 'ROBOTICS_AUTOMATION';
  }
  if (/software|computer science|data science|artificial intelligence|\bai\b|machine learning|cybersecurity|networking|coding|it\b/i.test(name)) {
    return 'SOFTWARE_AI_CS';
  }
  if (/medicine|surgery|doctor|mbbs|dental|bds|nursing|allied health|clinical|ortho/i.test(name)) {
    return 'MEDICINE_SURGERY';
  }
  if (/pharmacy|drug|biotech|genetics|biomedical|biology|microbiology|agriculture|veterinary/i.test(name)) {
    return 'PHARMACY_BIOTECH';
  }
  if (/chartered accountancy|ca\b|audit|accounting|finance|investment banking|fintech|actuarial|wealth|tax/i.test(name)) {
    return 'CHARTERED_ACCOUNTANCY_FINANCE';
  }
  if (/law|legal|judiciary|corporate law|advocate|llb|arbitration/i.test(name)) {
    return 'LAW_LEGAL';
  }
  if (/business|management|mba|bba|marketing|advertising|human resources|supply chain|operations|entrepreneurship|international business|hotel|hospitality/i.test(name)) {
    return 'BUSINESS_MANAGEMENT_MARKETING';
  }
  if (/design|graphic|ui|ux|interior|fashion|product design|animation|game design|film|visual arts/i.test(name)) {
    return 'DESIGN_ANIMATION_FINE_ARTS';
  }
  if (/pure science|physics|chemistry|mathematics|research|environmental|geology/i.test(name)) {
    return 'PURE_SCIENCES';
  }
  if (/psychology|counselling|social work|journalism|media|education|teaching|civil services|governance/i.test(name)) {
    return 'PSYCHOLOGY_HUMANITIES';
  }

  return 'CIVIL_ARCHITECTURE';
}

function getPathwayCategory(pathwayName: string): 'HUMANITIES' | 'COMMERCE' | 'PCM' | 'PCB' {
  const domain = getSpecializedDomain(pathwayName);
  if (domain === 'PSYCHOLOGY_HUMANITIES' || domain === 'LAW_LEGAL' || domain === 'DESIGN_ANIMATION_FINE_ARTS') return 'HUMANITIES';
  if (domain === 'CHARTERED_ACCOUNTANCY_FINANCE' || domain === 'BUSINESS_MANAGEMENT_MARKETING') return 'COMMERCE';
  if (domain === 'MEDICINE_SURGERY' || domain === 'PHARMACY_BIOTECH') return 'PCB';
  return 'PCM';
}

// ─── 1. DETERMINISTIC PATHWAY ROADMAP GENERATOR ────────────────────────────

export function getPathwayRoadmapData(
  pathwayName: string,
  rankLabel: string,
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): PathwayRoadmapData {
  const domain = getSpecializedDomain(pathwayName);
  const firstName = student.name.split(' ')[0];

  // Find exact score from careerFitment
  const fitObj = scores.careerFitment.find(c => 
    c.name.toLowerCase().includes(pathwayName.toLowerCase()) || 
    pathwayName.toLowerCase().includes(c.name.toLowerCase())
  );
  const fitScore = fitObj ? fitObj.score : 85;

  let data: PathwayRoadmapData;

  switch (domain) {
    case 'CIVIL_ARCHITECTURE':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('civil') || pathwayName.toLowerCase().includes('arch')
          ? pathwayName
          : 'Civil Engineering, Structural Infrastructure & Architecture',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s cognitive profile is characterized by strong spatial visualization (${scores.aptitude.spatial}%) and practical reasoning (${scores.aptitude.reasoning}%), supporting high technical execution in physical infrastructure design, structural calculations, and architectural environments.`,
        foundation: {
          subjects: ['Advanced Physics & Mechanics', 'Higher Mathematics (Calculus & Vectors)', 'Chemistry & Material Science', 'Engineering Graphics & Spatial Modeling', 'Technical Communication'],
          exams: ['JEE Main (Paper 1 & Paper 2 B.Arch)', 'JEE Advanced (IIT Roorkee / IIT Bombay)', 'NATA (National Aptitude Test in Architecture)', 'BITSAT', 'State CETs (MHT-CET / WBJEE / KCET)'],
          curriculumFocus: 'Focus on Newtonian statics, material load-bearing mechanics, 3D spatial geometry, and foundational CAD drafting principles.'
        },
        bachelors: [
          {
            degree: 'B.Tech in Civil & Infrastructure Engineering',
            specialization: 'Structural Mechanics, Smart Infrastructure & Transportation Systems',
            whyFits: `Leverages ${firstName}'s high spatial visualization (${scores.aptitude.spatial}%) for physical engineering systems.`,
            careerOutcomes: 'Structural Engineer, Infrastructure Project Manager, Metro Design Lead'
          },
          {
            degree: 'B.Arch (Bachelor of Architecture - 5 Year Degree)',
            specialization: 'Sustainable Urban Architecture, Computational Generative Design & BIM',
            whyFits: 'Combines structural mathematics with visual-spatial creative aesthetics.',
            careerOutcomes: 'Principal Design Architect, Sustainable Building Consultant, Urban Planner'
          },
          {
            degree: 'B.Tech in Construction Technology & Project Management',
            specialization: 'Precast Concrete Systems, Smart Project Lifecycles & EPC Contracts',
            whyFits: 'Applies disciplined execution to mega-scale construction site lifecycles.',
            careerOutcomes: 'Construction Technology Manager, EPC Project Controller, Estimation Engineer'
          },
          {
            degree: 'B.Tech in Environmental & Geotechnical Engineering',
            specialization: 'Soil Mechanics, Seismic Hazard Mitigation, Foundation Engineering',
            whyFits: 'Applies physical science and mechanics to ground engineering and disaster resilience.',
            careerOutcomes: 'Geotechnical Consultant, Seismic Risk Analyst, Hydrology & Dam Specialist'
          }
        ],
        colleges: {
          reach: ['IIT Roorkee (Pioneer in Civil & Architecture)', 'IIT Bombay', 'IIT Delhi', 'CEPT University Ahmedabad', 'School of Planning & Architecture (SPA) New Delhi'],
          fit: ['NIT Trichy', 'NIT Surathkal', 'College of Engineering Pune (COEP)', 'Jadavpur University Kolkata', 'BMS College of Engineering Bangalore'],
          accessible: ['Manipal Institute of Technology (MIT)', 'Thapar University Patiala', 'SRM Institute of Science & Technology', 'Ramaiah Institute of Technology Bangalore']
        },
        masters: [
          'M.Tech in Structural Engineering / Earthquake Engineering (IIT Roorkee / IIT Madras)',
          'M.S. in Sustainable Urban Infrastructure & Smart Cities (NUS / TU Delft / UC Berkeley)',
          'Master of Construction Engineering & Management (NICMAR / Purdue University)',
          'Ph.D. in Computational Structural Mechanics & Green Composite Materials'
        ],
        careerOutcomes: [
          'Senior Structural Design Engineer (L&T Construction / Arup / AtkinsRealis)',
          'Principal Metro & High-Speed Rail Infrastructure Consultant',
          'Chief Urban Architect & Smart City Design Director',
          'Executive Project Director (Mega Infrastructure & EPC Concessions)'
        ],
        skills: ['AutoCAD & Civil 3D', 'Revit & BIM 3D Modeling', 'STAAD.Pro & ETABS Structural Analysis', 'Reinforced Concrete & Steel Design', 'Primavera P6 & Construction Estimation'],
        targetCompanies: ['Larsen & Toubro (L&T Infrastructure)', 'Tata Projects', 'Shapoorji Pallonji', 'Arup Global Engineering', 'AtkinsRealis / Bechtel', 'National Highways Authority of India (NHAI)'],
        milestone: 'Complete certified coursework in AutoCAD/Revit BIM, construct structural bridge prototype for engineering symposium, and achieve 99th percentile in JEE/NATA mocks.'
      };
      break;

    case 'MECHANICAL_AEROSPACE':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('aero') ? 'Aerospace, Aeronautical & Defence Engineering' : 'Mechanical, Automotive & Aerospace Engineering',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName} demonstrates high spatial reasoning (${scores.aptitude.spatial}%) and analytical problem solving (${scores.aptitude.reasoning}%), providing an ideal baseline for advanced mechanics, vehicle dynamics, fluid mechanics, and aerospace systems.`,
        foundation: {
          subjects: ['Physics (Thermodynamics & Dynamics)', 'Higher Mathematics (Differential Equations & Vectors)', 'Chemistry & Metallurgy', 'Engineering Graphics / Python for Mechanics', 'Technical English'],
          exams: ['JEE Main & JEE Advanced', 'BITSAT', 'IIST Dual Degree Admission', 'VITEEE / MET / MHT-CET', 'GATE (Future Benchmark)'],
          curriculumFocus: 'Focus on Newtonian dynamics, thermal energy cycles, fluid flow mechanics, and 3D computer-aided design (CAD).'
        },
        bachelors: [
          {
            degree: 'B.Tech in Mechanical Engineering',
            specialization: 'Finite Element Analysis, Thermal Fluid Systems, Advanced Manufacturing',
            whyFits: `Aligns with ${firstName}'s high spatial visualization and physics execution.`,
            careerOutcomes: 'Mechanical Design Engineer, Thermal Systems Specialist, Manufacturing Lead'
          },
          {
            degree: 'B.Tech in Aerospace & Aeronautical Engineering',
            specialization: 'Aerodynamics, Rocket Propulsion, Orbital Mechanics & Avionics',
            whyFits: 'Combines advanced mathematical modeling with high-speed aerospace physics.',
            careerOutcomes: 'Aerospace Propulsion Engineer, Aerodynamics Specialist, Flight Systems Analyst'
          },
          {
            degree: 'B.Tech in Automotive Engineering & EV Technology',
            specialization: 'Electric Vehicle Powertrains, Battery Thermal Management, Vehicle Dynamics',
            whyFits: 'Directly addresses the electric mobility and smart automotive revolution.',
            careerOutcomes: 'EV Powertrain Engineer, Vehicle Dynamics Lead, Automotive Systems Architect'
          },
          {
            degree: 'B.Tech in Mechatronics & Precision Engineering',
            specialization: 'Robotic Actuators, Sensor Integration, Micro-electromechanical Systems',
            whyFits: 'Bridges physical mechanical structures with electronic micro-controllers.',
            careerOutcomes: 'Mechatronics Engineer, Automation Specialist, Precision Systems Lead'
          }
        ],
        colleges: {
          reach: ['IIT Madras', 'IIT Bombay', 'IIT Kharagpur', 'Indian Institute of Space Science and Technology (IIST)', 'BITS Pilani'],
          fit: ['NIT Trichy', 'NIT Surathkal', 'Delhi Technological University (DTU)', 'PSG College of Technology Coimbatore'],
          accessible: ['Manipal Institute of Technology (MIT)', 'Thapar University Patiala', 'SRM University Kattankulathur', 'VIT Vellore']
        },
        masters: [
          'M.Tech / M.S. in Thermal Fluid Engineering & Computational Fluid Dynamics (CFD)',
          'M.S. in Aerospace Propulsion & Space Systems (Purdue / TU Delft / Cranfield)',
          'M.Tech in Automotive Engineering & E-Mobility',
          'Ph.D. in Advanced Materials Science & Lightweight Carbon Composites'
        ],
        careerOutcomes: [
          'Lead Aerospace Propulsion / Aerodynamics Engineer (ISRO / Boeing / Airbus)',
          'Senior Vehicle Dynamics & EV Powertrain Specialist (Tesla / Tata Motors / Mahindra)',
          'Thermal & Computational Fluid Dynamics (CFD) Design Specialist',
          'Chief Mechanical Design Engineer (GE Aerospace / Rolls-Royce / Bosch)'
        ],
        skills: ['SolidWorks & CATIA 3D CAD', 'ANSYS Mechanical & CFD Simulation', 'MATLAB & Simulink Modeling', 'Thermodynamics & Heat Transfer', 'Geometric Dimensioning & Tolerancing (GD&T)'],
        targetCompanies: ['ISRO / DRDO', 'Boeing India Engineering', 'Airbus Commercial', 'Tata Motors EV Division', 'Mahindra Defence / Mahindra Racing', 'General Electric (GE) Aerospace'],
        milestone: 'Design working 3D CAD mechanical assembly in SolidWorks, participate in Formula Student / SAE BAJA or aeromodelling team, and master JEE mechanics.'
      };
      break;

    case 'ELECTRICAL_ELECTRONICS':
      data = {
        pathwayName,
        pathwayTitle: 'Electrical, Electronics & Semiconductor (VLSI) Engineering',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s profile exhibits strong numerical logic (${scores.aptitude.numerical}%) and abstract analytical reasoning (${scores.aptitude.reasoning}%), enabling deep mastery of semiconductor physics, integrated circuit architecture, and modern wireless networks.`,
        foundation: {
          subjects: ['Physics (Electromagnetism & Solid-State Electronics)', 'Higher Mathematics (Complex Variables & Fourier Analysis)', 'Chemistry', 'Computer Science (C / Python)', 'Technical Communication'],
          exams: ['JEE Main & JEE Advanced', 'BITSAT', 'IIIT UGEE', 'State CETs (MHT-CET / KCET)', 'VITEEE / MET'],
          curriculumFocus: 'Focus on circuit theory, electromagnetic fields, semiconductor device physics, and digital logic synthesis.'
        },
        bachelors: [
          {
            degree: 'B.Tech in Electronics & Communication Engineering (ECE)',
            specialization: 'VLSI Design, Digital Signal Processing, RF & Wireless Communications',
            whyFits: `Capitalizes on ${firstName}'s high abstract analytical logic and numerical skills.`,
            careerOutcomes: 'Silicon Design Engineer, RF Systems Specialist, Digital Signal Processing Lead'
          },
          {
            degree: 'B.Tech in VLSI Design & Semiconductor Technology',
            specialization: 'ASIC Architecture, FPGA Prototyping, Physical Chip Layout & Verification',
            whyFits: 'Targets the booming global microchip and semiconductor fabrication ecosystem.',
            careerOutcomes: 'ASIC Verification Engineer, Physical Design Lead, Semiconductor Architect'
          },
          {
            degree: 'B.Tech in Electrical & Electronics Engineering (EEE)',
            specialization: 'Power Electronics, Smart Grids, Electric Drives & Renewable Energy',
            whyFits: 'Combines hardware electronics with high-power industrial grid systems.',
            careerOutcomes: 'Power Electronics Engineer, Smart Grid Specialist, Energy Systems Lead'
          },
          {
            degree: 'B.Tech in Embedded Systems & IoT Engineering',
            specialization: 'ARM Cortex Architecture, Real-Time Operating Systems (RTOS), Edge AI',
            whyFits: 'Bridges hardware silicon with low-level software execution.',
            careerOutcomes: 'Embedded Systems Engineer, Firmware Developer, IoT Systems Architect'
          }
        ],
        colleges: {
          reach: ['IIT Delhi', 'IIT Bombay', 'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad'],
          fit: ['NIT Trichy', 'NIT Warangal', 'Delhi Technological University (DTU)', 'COEP Pune'],
          accessible: ['Manipal Institute of Technology (MIT)', 'Thapar University Patiala', 'PES University Bangalore', 'SSN College of Engineering Chennai']
        },
        masters: [
          'M.Tech / M.S. in VLSI & Semiconductor Chip Design (IIT Madras / Stanford / TU Delft)',
          'M.S. in Wireless Communications, 6G & RF Microwave Engineering',
          'M.Tech in Power Electronics & Smart Grid Technologies',
          'Ph.D. in Quantum Nano-Electronics & Neuromorphic Hardware'
        ],
        careerOutcomes: [
          'Principal Silicon / ASIC Design Engineer (Qualcomm / Intel / NVIDIA / AMD)',
          'Senior Embedded Hardware & Firmware Architect (Apple / Texas Instruments)',
          'RF & High-Frequency Communications Specialist (Qualcomm / Ericsson)',
          'Smart Grid & Clean Energy Systems Director (Siemens / Schneider / ABB)'
        ],
        skills: ['Verilog & SystemVerilog HDL', 'Cadence / Synopsys EDA Tools', 'Embedded C / C++ & ARM Cortex', 'Digital Signal Processing (DSP)', 'Circuit Simulation (SPICE)'],
        targetCompanies: ['Qualcomm', 'Intel Semiconductors', 'Texas Instruments', 'NVIDIA Hardware Systems', 'Broadcom', 'Siemens Energy / ABB'],
        milestone: 'Design and synthesize custom digital circuit on FPGA using SystemVerilog, program an STM32 ARM microcontroller module, and secure top percentile in JEE Main.'
      };
      break;

    case 'ROBOTICS_AUTOMATION':
      data = {
        pathwayName,
        pathwayTitle: 'Robotics, Autonomous Systems & Industrial Automation',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName} demonstrates an optimal blend of spatial perception (${scores.aptitude.spatial}%) and algorithmic reasoning (${scores.aptitude.reasoning}%), essential for building intelligent autonomous robots, computer vision pipelines, and automated factory systems.`,
        foundation: {
          subjects: ['Advanced Mechanics & Kinematics', 'Linear Algebra, Calculus & Probability', 'Solid-State Electronics & Actuators', 'Python & C++ Programming', 'Technical English'],
          exams: ['JEE Main & JEE Advanced', 'BITSAT', 'State Engineering CETs', 'VITEEE / MET'],
          curriculumFocus: 'Focus on multi-body dynamics, sensor fusion, algorithmic control loops, and embedded real-time computing.'
        },
        bachelors: [
          {
            degree: 'B.Tech in Robotics & Mechatronics Engineering',
            specialization: 'Robot Kinematics, Actuator Control, Sensor Fusion & SLAM',
            whyFits: `Aligns with ${firstName}'s high spatial visualization and software aptitude.`,
            careerOutcomes: 'Robotics Software Engineer, Motion Planning Specialist, Mechatronics Lead'
          },
          {
            degree: 'B.Tech in Autonomous Systems & Control Engineering',
            specialization: 'Autonomous Vehicles, Computer Vision, Deep Reinforcement Learning for Robotics',
            whyFits: 'Applies artificial intelligence to physical autonomous platforms.',
            careerOutcomes: 'Autonomous Driving Engineer, Computer Vision Specialist, Control Systems Lead'
          },
          {
            degree: 'B.Tech in Industrial Automation & Precision Engineering',
            specialization: 'PLC Programming, Collaborative Robots (Cobots), Industry 4.0 Systems',
            whyFits: 'Focuses on high-throughput factory automation and precision robotics.',
            careerOutcomes: 'Automation Solutions Architect, Robotics Commissioning Engineer, Smart Factory Director'
          },
          {
            degree: 'B.Tech in Computer Science (Robotics & AI Track)',
            specialization: 'Robot Operating System (ROS2), Simulation, Algorithmic Navigation',
            whyFits: 'Combines pure computer science software principles with robotic control.',
            careerOutcomes: 'Robotics AI Researcher, Simulation Engineer, Embedded Perception Lead'
          }
        ],
        colleges: {
          reach: ['IIT Madras (Robert Bosch Centre for Data Science & AI)', 'IIT Delhi', 'BITS Pilani', 'IIIT Hyderabad'],
          fit: ['NIT Trichy', 'PSG Tech Coimbatore', 'Thapar University Patiala', 'SRM Mechatronics Center'],
          accessible: ['Manipal Institute of Technology (MIT)', 'MIT World Peace University Pune', 'Chandigarh University', 'UPES Dehradun']
        },
        masters: [
          'M.S. in Robotics & Perception (Carnegie Mellon University / ETH Zurich / TU Munich)',
          'M.Tech in Autonomous Systems & Intelligent Robotics (IIT Madras)',
          'M.S. in Computer Vision, SLAM & Spatial AI (Imperial College London)',
          'Ph.D. in Human-Robot Interaction & Bio-Inspired Robotics'
        ],
        careerOutcomes: [
          'Principal Robotics Software Engineer (ROS2 / Motion Planning)',
          'Autonomous Vehicle Perception & Sensor Fusion Architect (Tesla / Waymo / Cruise)',
          'Industrial Automation & Cobot Deployment Director (ABB / KUKA / Fanuc)',
          'Robotics AI Research Scientist (Boston Dynamics / Figure AI / Addverb)'
        ],
        skills: ['Robot Operating System (ROS / ROS2)', 'C++ & Python for Robotics', 'OpenCV Computer Vision & Point Clouds', 'Gazebo & Isaac Sim Physics Simulation', 'PID & Kalman Filter State Estimation'],
        targetCompanies: ['Tesla Autopilot', 'Boston Dynamics', 'Fanuc Robotics', 'ABB Robotics', 'GreyOrange Robotics', 'Addverb Technologies'],
        milestone: 'Build a working ROS2 autonomous navigation robot with LiDAR SLAM mapping, publish demo repository on GitHub, and score top tier in JEE Main.'
      };
      break;

    case 'MEDICINE_SURGERY':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('dental') ? 'Dental Sciences & Maxillofacial Surgery' : 'Medicine, Surgery & Clinical Healthcare (MBBS)',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName} shows high scientific reasoning (${scores.aptitude.reasoning}%) paired with high agreeableness and empathetic service commitment (${scores.personality.agreeableness}%), creating the ideal foundation for patient care, clinical diagnosis, and surgical excellence.`,
        foundation: {
          subjects: ['Human Biology, Physiology & Genetics', 'Organic & Medicinal Chemistry', 'Biophysics & Radiation Physics', 'Psychology & Medical Ethics', 'English Communication'],
          exams: ['NEET-UG (National Eligibility cum Entrance Test)', 'INI-CET (Future PG Specialization)', 'USMLE / PLAB (International Licensing)'],
          curriculumFocus: 'Focus on NCERT biological precision, organic reaction pathways, bio-physical principles, and diagnostic problem solving.'
        },
        bachelors: [
          {
            degree: 'MBBS (Bachelor of Medicine & Bachelor of Surgery - 5.5 Years)',
            specialization: 'Internal Medicine, Diagnostic Pathology, Surgical Anatomy & Community Health',
            whyFits: `Directly leverages ${firstName}'s scientific logic and patient care dedication.`,
            careerOutcomes: 'Consultant Physician, Clinical Resident, Medical Officer'
          },
          {
            degree: 'BDS (Bachelor of Dental Surgery - 5 Years)',
            specialization: 'Oral & Maxillofacial Surgery, Orthodontics, Cosmetic Dentistry',
            whyFits: 'Combines meticulous manual spatial precision with clinical patient treatment.',
            careerOutcomes: 'Dental Surgeon, Orthodontist, Maxillofacial Specialist'
          },
          {
            degree: 'B.Sc. (Hons) in Biomedical Science & Clinical Diagnostics',
            specialization: 'Molecular Diagnostics, Immunology, Cellular Pathology',
            whyFits: 'Ideal for students seeking diagnostic research without bedside medical duty.',
            careerOutcomes: 'Clinical Diagnostic Specialist, Pathologist Associate, Hospital Lab Director'
          },
          {
            degree: 'BAMS / BHMS (Integrative Medical Systems)',
            specialization: 'Holistic Pharmacology, Preventative Medicine, Integrative Health',
            whyFits: 'Focuses on holistic wellness and preventative lifestyle healthcare.',
            careerOutcomes: 'Integrative Medicine Physician, Clinical Wellness Consultant, Research Fellow'
          }
        ],
        colleges: {
          reach: ['AIIMS New Delhi', 'Christian Medical College (CMC) Vellore', 'JIPMER Puducherry', 'King George\'s Medical University (KGMU) Lucknow'],
          fit: ['Maulana Azad Medical College (MAMC) Delhi', 'KMC Manipal', 'St. John\'s Medical College Bangalore', 'Grant Medical College Mumbai'],
          accessible: ['MS Ramaiah Medical College Bangalore', 'Hamdard Institute of Medical Sciences Delhi', 'SRM Medical College Chennai', 'Amrita Institute of Medical Sciences Kochi']
        },
        masters: [
          'MD in Internal Medicine / Cardiology / Neurology / Paediatrics',
          'MS in General Surgery / Orthopaedics / Ophthalmology',
          'DM / MCh Super-Specialization (Cardiothoracic / Surgical Oncology)',
          'Master of Public Health (MPH - Harvard T.H. Chan / Johns Hopkins Bloomberg)'
        ],
        careerOutcomes: [
          'Chief Consultant Physician / Specialist Surgeon',
          'Clinical Trial Principal Investigator & Medical Director',
          'Hospital Medical Superintendent / Clinical Governance Head',
          'Global Healthcare Director (WHO / Health Ministry)'
        ],
        skills: ['Clinical Differential Diagnosis', 'Patient History & Empathetic Bedside Manner', 'Surgical Foundations & Aseptic Protocols', 'Medical Pharmacology & Toxicology', 'Evidence-Based Clinical Research Analysis'],
        targetCompanies: ['AIIMS Healthcare System', 'Apollo Hospitals Group', 'Fortis Healthcare', 'Max Healthcare Enterprise', 'Medanta The Medicity', 'World Health Organization (WHO)'],
        milestone: 'Achieve 650+ benchmark score in NEET-UG full diagnostics, complete NCERT Biology/Chemistry line-by-line mastery, and shadow a hospital clinical ward.'
      };
      break;

    case 'PHARMACY_BIOTECH':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('pharm') ? 'Pharmaceutical Sciences & Clinical Drug Research' : 'Biotechnology, Genetics & Bio-Engineering',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s profile exhibits strong biological comprehension (${scores.aptitude.reasoning}%) and scientific conscientiousness (${scores.personality.conscientiousness}%), creating exceptional aptitude for biopharmaceutical discovery, molecular genetics, and clinical trial development.`,
        foundation: {
          subjects: ['Organic Chemistry & Biochemistry', 'Cellular Biology & Molecular Genetics', 'Physics & Analytical Instrumentation', 'Biotechnology / Mathematics', 'Scientific English'],
          exams: ['NEET-UG', 'CUET-UG (Biochemistry / Biotechnology)', 'GPAT (Future Pharmacy PG)', 'NIPER JEE', 'BITSAT (B.Pharm)'],
          curriculumFocus: 'Focus on biomolecular synthesis, genetic engineering, drug formulation kinetics, and laboratory analytical instrumentation.'
        },
        bachelors: [
          {
            degree: 'B.Pharm / Pharm.D (Doctor of Pharmacy - Clinical Track)',
            specialization: 'Drug Formulation, Pharmacokinetics, Clinical Trials & Pharmacovigilance',
            whyFits: `Matches ${firstName}'s structured precision and pharmaceutical scientific interest.`,
            careerOutcomes: 'Clinical Pharmacist, Drug Formulation Scientist, Regulatory Affairs Lead'
          },
          {
            degree: 'B.Tech in Biotechnology & Biochemical Engineering',
            specialization: 'Recombinant DNA, Bioprocess Fermentation, Metabolic Engineering',
            whyFits: 'Applies engineering principles to biological and pharmaceutical manufacturing.',
            careerOutcomes: 'Bioprocess Engineer, Fermentation Lead, Biotech R&D Specialist'
          },
          {
            degree: 'B.Sc. (Hons) in Genetics & Molecular Biology',
            specialization: 'CRISPR Gene Editing, Genomic Sequencing, Rare Disease Research',
            whyFits: 'Deeply research-driven track for understanding genomic codes.',
            careerOutcomes: 'Genetic Counselor, Molecular Biologist, Genomics Scientist'
          },
          {
            degree: 'B.Sc. in Bioinformatics & Computational Biology',
            specialization: 'Genomic Big Data, Protein Structure Prediction, In-Silico Drug Screening',
            whyFits: 'Bridges life sciences with computational data modeling.',
            careerOutcomes: 'Bioinformatics Analyst, Computational Drug Discovery Specialist'
          }
        ],
        colleges: {
          reach: ['NIPER Mohali / Hyderabad', 'BITS Pilani (Department of Pharmacy)', 'Institute of Chemical Technology (ICT) Mumbai', 'IISc Bangalore'],
          fit: ['Jamia Hamdard Delhi (Ranked #1 Pharmacy)', 'Manipal College of Pharmaceutical Sciences', 'JSS College of Pharmacy Ooty', 'IIT Roorkee (Biotech)'],
          accessible: ['Amity Institute of Biotechnology', 'SRM College of Pharmacy Chennai', 'Chitkara University', 'Nitte Gulabi Shetty Memorial Institute']
        },
        masters: [
          'M.Pharm / M.Tech in Bioprocess Engineering & Biopharmaceuticals',
          'M.S. in Drug Discovery & Molecular Pharmacology (Oxford / ETH Zurich)',
          'Ph.D. in Genomic Medicine & CRISPR Therapeutics',
          'Master of Business Administration (Pharma Management - NMIMS / SIES)'
        ],
        careerOutcomes: [
          'Principal Scientist - Biopharmaceutical Formulation (Biocon / Pfizer)',
          'Clinical Pharmacology & Regulatory Affairs Director',
          'Bioinformatics Computational Biologist',
          'Drug Safety & Global Pharmacovigilance Lead'
        ],
        skills: ['HPLC & Spectroscopic Analysis', 'CRISPR & Recombinant DNA Protocols', 'Pharmacokinetics & Drug Formulation', 'Bioinformatics Tooling (BLAST / PyMOL / R)', 'Good Laboratory Practice (GLP) & FDA Compliance'],
        targetCompanies: ['Biocon Biologics', 'Pfizer Global R&D', 'Dr. Reddy\'s Laboratories', 'Sun Pharmaceutical Industries', 'Novartis Global', 'AstraZeneca'],
        milestone: 'Publish a secondary research review on mRNA vaccines or targeted drug delivery, document 20+ laboratory experiments, and complete baseline mock exams.'
      };
      break;

    case 'CHARTERED_ACCOUNTANCY_FINANCE':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('ca') || pathwayName.toLowerCase().includes('account')
          ? 'Chartered Accountancy, Statutory Audit & Corporate Taxation'
          : 'Investment Banking, Quantitative Finance & FinTech',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s profile exhibits exceptional numerical aptitude (${scores.aptitude.numerical}%) and meticulous execution discipline (${scores.personality.conscientiousness}% Conscientiousness), making high-stakes financial modeling, corporate valuation, and statutory accounting ideal career trajectories.`,
        foundation: {
          subjects: ['Accountancy & Financial Statements', 'Business Mathematics & Statistics', 'Microeconomics & Macroeconomics', 'Business Studies & Mercantile Law', 'English Composition'],
          exams: ['ICAI CA Foundation (Chartered Accountancy Entry)', 'CUET-UG (SRCC / SSCBS Commerce)', 'IPMAT (IIM Indore / Rohtak)', 'NPAT / SET', 'CFA Level 1 (Post-Grad)'],
          curriculumFocus: 'Focus on balance sheet reconciliations, cash-flow modeling, commercial law interpretation, and spreadsheet analytics.'
        },
        bachelors: [
          {
            degree: 'B.Com (Hons) in Professional Accounting & CA Integrated',
            specialization: 'Corporate Accounting, Statutory Audit, Direct & Indirect Taxation',
            whyFits: `Matches ${firstName}'s structured precision and high analytical discipline.`,
            careerOutcomes: 'Chartered Accountant, Statutory Auditor, Corporate Controller'
          },
          {
            degree: 'B.Sc. in Finance & Quantitative Investment Analysis',
            specialization: 'Equity Research, Financial Modeling & Valuation, Portfolio Optimization',
            whyFits: 'Applies rigorous numerical analysis to global capital markets.',
            careerOutcomes: 'Investment Banking Analyst, Equity Research Associate, Portfolio Manager'
          },
          {
            degree: 'BBA in Corporate Finance & Fintech Innovation',
            specialization: 'Treasury Operations, Venture Capital Due Diligence, Algorithmic Trading',
            whyFits: 'Combines modern corporate management with high-growth financial technology.',
            careerOutcomes: 'Fintech Product Lead, Risk Strategist, M&A Associate'
          },
          {
            degree: 'B.A. (Hons) in Financial Economics & Econometrics',
            specialization: 'Quantitative Modeling, Macroeconomic Forecasting, Monetary Policy',
            whyFits: 'Bridges macroeconomic theory with strategic enterprise investment.',
            careerOutcomes: 'Economic Analyst, Quantitative Strategist, Credit Risk Lead'
          }
        ],
        colleges: {
          reach: ['Shri Ram College of Commerce (SRCC) Delhi', 'IIM Indore (5-Year IPM Program)', 'Shaheed Sukhdev College of Business Studies (SSCBS)', 'St. Xavier\'s College Kolkata'],
          fit: ['St. Xavier\'s College Mumbai', 'NMIMS School of Commerce Mumbai', 'Christ University Bangalore', 'Loyola College Chennai'],
          accessible: ['Symbiosis College of Arts and Commerce Pune', 'Hindu College Delhi', 'Mithibai College Mumbai', 'K.J. Somaiya Mumbai']
        },
        masters: [
          'Chartered Accountant (CA Final Certification - ICAI)',
          'CFA (Chartered Financial Analyst) Charter - CFA Institute USA',
          'MBA in Finance & Strategy (IIM Ahmedabad, Bangalore, Calcutta / Wharton / LBS)',
          'M.Sc. in Financial Engineering & Quantitative Finance (Columbia / Oxford)'
        ],
        careerOutcomes: [
          'Investment Banking Associate / Vice President (M&A Advisory)',
          'Statutory Audit & Tax Partner (Big 4: Deloitte, PwC, EY, KPMG)',
          'Chief Financial Officer (CFO) / VP of Global Corporate Treasury',
          'Hedge Fund Quantitative Portfolio Manager / Equity Research Lead'
        ],
        skills: ['Three-Statement Financial Modeling & DCF Valuation', 'Statutory Audit & Ind-AS / IFRS Accounting Standards', 'Advanced Excel, VBA & Python for Finance', 'Corporate Tax Strategy & International Transfer Pricing', 'Commercial Due Diligence'],
        targetCompanies: ['Goldman Sachs', 'J.P. Morgan Chase', 'Deloitte / PwC / EY / KPMG (Big 4)', 'Morgan Stanley', 'BlackRock', 'McKinsey Corporate Finance'],
        milestone: 'Clear CA Foundation on first attempt with 280+ score, build dynamic 3-statement financial model for a publicly listed Indian firm, and lead school commerce society.'
      };
      break;

    case 'LAW_LEGAL':
      data = {
        pathwayName,
        pathwayTitle: 'Law, Corporate Jurisprudence & Dispute Resolution',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName} demonstrates high verbal analytical reasoning (${scores.aptitude.verbal}%) and structured logical deduction (${scores.aptitude.reasoning}%), establishing the ideal cognitive baseline for statutory interpretation, persuasive courtroom advocacy, and high-stakes corporate contract negotiations.`,
        foundation: {
          subjects: ['Legal Studies & Constitutional History', 'Political Science & International Relations', 'Economics & Public Policy', 'Psychology / Sociology', 'English Literature & Rhetoric'],
          exams: ['CLAT (Common Law Admission Test for NLUs)', 'AILET (National Law University Delhi)', 'SLAT (Symbiosis Law School)', 'MHCET Law', 'LSAT-India'],
          curriculumFocus: 'Focus on legal comprehension, critical argumentation, constitutional case analysis, and persuasive rhetorical composition.'
        },
        bachelors: [
          {
            degree: 'B.A. LL.B (Hons) - 5 Year Integrated Law Degree',
            specialization: 'Constitutional Law, International Human Rights, Criminal Jurisprudence',
            whyFits: `Leverages ${firstName}'s high verbal logic and analytical deduction.`,
            careerOutcomes: 'Litigation Advocate, Judicial Law Clerk, Human Rights Counsel'
          },
          {
            degree: 'B.B.A. LL.B (Hons) - Corporate & Commercial Law Track',
            specialization: 'Mergers & Acquisitions, Securities Regulation, Antitrust & Competition',
            whyFits: 'Combines corporate enterprise management with legal regulatory compliance.',
            careerOutcomes: 'Corporate Legal Associate, M&A Deal Counsel, Compliance Director'
          },
          {
            degree: 'B.Sc. LL.B (Hons) - Intellectual Property & Cyber Law',
            specialization: 'Patent Law, Artificial Intelligence Regulation, Cybercrime Forensics',
            whyFits: 'Bridges technical and digital innovation with intellectual property protection.',
            careerOutcomes: 'Patent Attorney, Tech Policy Counsel, Data Privacy Officer'
          },
          {
            degree: 'B.A. (Hons) in Public Policy & Pre-Law Foundations',
            specialization: 'Legislative Drafting, Regulatory Analysis, Global Governance',
            whyFits: 'Focuses on the socio-economic impact of legal structures and public reform.',
            careerOutcomes: 'Policy Advisor, Think-Tank Legal Analyst, Government Affairs Lead'
          }
        ],
        colleges: {
          reach: ['National Law School of India University (NLSIU) Bangalore', 'NALSAR University of Law Hyderabad', 'National Law University (NLU) Delhi', 'WBNUJS Kolkata'],
          fit: ['NLU Jodhpur', 'Gujarat National Law University (GNLU)', 'Symbiosis Law School (SLS) Pune', 'Jindal Global Law School (JGLS) Sonipat'],
          accessible: ['ILS Law College Pune', 'Christ University School of Law Bangalore', 'School of Law UPES Dehradun', 'Amity Law School Noida']
        },
        masters: [
          'LL.M. in Corporate Law & International Arbitration (Oxford / Cambridge / Harvard / NYU)',
          'LL.M. in Intellectual Property & Tech Regulation',
          'Judicial Services Examination (PCS-J / High Court Bench Track)',
          'Civil Services Examination (UPSC - Indian Administrative Service / Police Service)'
        ],
        careerOutcomes: [
          'Senior Associate / Partner - Mergers & Acquisitions (Tier-1 Law Firms)',
          'General Counsel / Chief Legal Officer (Global Corporations)',
          'Designated Senior Advocate / Constitutional Litigator',
          'International Commercial Arbitrator (London / Singapore / Paris)'
        ],
        skills: ['Constitutional & Statutory Interpretation', 'Commercial Contract Drafting & Negotiation', 'Legal Research (SCC Online / Manupatra / Westlaw)', 'Courtroom Advocacy & Oral Argumentation', 'Regulatory Compliance & Due Diligence'],
        targetCompanies: ['Shardul Amarchand Mangaldas & Co', 'Cyril Amarchand Mangaldas', 'Khaitan & Co', 'AZB & Partners', 'Trilegal', 'Supreme Court of India / High Courts'],
        milestone: 'Win regional youth parliament/moot court competition, author an essay on fundamental rights or IP jurisprudence, and score in the 99th percentile of CLAT mocks.'
      };
      break;

    case 'BUSINESS_MANAGEMENT_MARKETING':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('market') || pathwayName.toLowerCase().includes('advert')
          ? 'Marketing Strategy, Consumer Insights & Brand Leadership'
          : 'Business Administration, Strategy & Management Consulting',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s profile exhibits strong strategic initiative (${scores.personality.extraversion}% Extraversion) and organized commercial acumen (${scores.personality.conscientiousness}% Conscientiousness), creating high aptitude for cross-functional business leadership, market expansion, and consulting.`,
        foundation: {
          subjects: ['Business Studies & Corporate Organization', 'Economics & Global Commerce', 'Applied Mathematics / Statistics', 'Accountancy & Financial Basics', 'English Communication & Public Speaking'],
          exams: ['IPMAT (IIM Indore, Rohtak, Ranchi, Jammu)', 'CUET-UG (BBA / BMS / BBE)', 'NPAT (NMIMS Mumbai)', 'SET (Symbiosis International)', 'DU JAT / GGSIPU CET'],
          curriculumFocus: 'Focus on strategic case studies, market equilibrium, consumer psychology, and presentation storytelling.'
        },
        bachelors: [
          {
            degree: 'IPM (5-Year Integrated Program in Management - IIM Track)',
            specialization: 'General Management, Quantitative Strategy, International Business',
            whyFits: `Provides fast-track management training combining leadership with quantitative analysis.`,
            careerOutcomes: 'Management Consultant, Business Operations Manager, Growth Lead'
          },
          {
            degree: 'BBA / BMS (Bachelor of Management Studies - Strategy Track)',
            specialization: 'Corporate Strategy, Global Supply Chain, Digital Enterprise Transformation',
            whyFits: 'Focuses on modern agile operations and strategic enterprise execution.',
            careerOutcomes: 'Strategy Associate, Operations Manager, Business Development Lead'
          },
          {
            degree: 'B.A. (Hons) in Marketing Communications & Brand Strategy',
            specialization: 'Consumer Insights, Digital Performance Marketing, Brand Storytelling',
            whyFits: 'Applies psychological insights and creative communication to brand growth.',
            careerOutcomes: 'Brand Manager, Digital Marketing Lead, Consumer Insights Analyst'
          },
          {
            degree: 'B.Sc. in Supply Chain Operations & Logistics Analytics',
            specialization: 'Supply Chain Optimization, Procurement, Global Trade Networks',
            whyFits: 'Leverages systematic analytical logic for global logistics and manufacturing.',
            careerOutcomes: 'Supply Chain Consultant, Logistics Director, Procurement Strategist'
          }
        ],
        colleges: {
          reach: ['IIM Indore (IPM Program)', 'Shaheed Sukhdev College of Business Studies (SSCBS) Delhi', 'IIM Roorkee / IIM Ranchi IPM', 'NMIMS ASMSOC Mumbai'],
          fit: ['St. Xavier\'s College Mumbai', 'Christ University Bangalore', 'Symbiosis Centre for Management Studies (SCMS) Pune', 'Loyola College Chennai'],
          accessible: ['K.J. Somaiya Institute Mumbai', 'Mithibai College Mumbai', 'Bennett University Greater Noida', 'Amity Global Business School']
        },
        masters: [
          'Master of Business Administration (MBA - IIM Ahmedabad, Bangalore, Calcutta / INSEAD / Harvard)',
          'M.Sc. in Strategic Marketing & Brand Leadership',
          'Master of Science in Supply Chain Engineering & Global Logistics',
          'Executive Master in International Business & Trade Policy'
        ],
        careerOutcomes: [
          'Management Consultant (McKinsey & Company / BCG / Bain & Co)',
          'Global Brand Manager / Chief Marketing Officer (CMO Track)',
          'Product Growth & Go-to-Market (GTM) Strategy Director',
          'Venture Capital Operations Associate / High-Growth Founder'
        ],
        skills: ['Strategic Problem Solving & MECE Frameworks', 'Consumer Behavior & Brand Positioning Analysis', 'Performance Marketing & Digital Analytics', 'Negotiation & Stakeholder Management', 'P&L Ownership & Financial Acumen'],
        targetCompanies: ['McKinsey & Company', 'Boston Consulting Group (BCG)', 'Hindustan Unilever Limited (HUL)', 'Procter & Gamble (P&G)', 'Google Consumer Marketing', 'Amazon Operations'],
        milestone: 'Complete IPMAT syllabus coverage, launch a student entrepreneurial project or school marketing campaign, and win an inter-school business case competition.'
      };
      break;

    case 'PSYCHOLOGY_HUMANITIES':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('psych') ? 'Psychology, Cognitive Behaviour & Clinical Counselling' : 'Humanities, Social Policy & Communication',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName} demonstrates high verbal analytical ability (${scores.aptitude.verbal}%) and empathetic open-mindedness (${scores.personality.openness}% Openness), aligning strongly with cognitive psychology, clinical counselling, behavioural research, and societal impact.`,
        foundation: {
          subjects: ['Psychology (Cognitive, Developmental & Social)', 'Sociology / Political Science', 'English Literature & Academic Writing', 'Applied Statistics / Biology', 'Media & Cultural Studies'],
          exams: ['CUET-UG (Psychology / Social Sciences)', 'TISS-BAT', 'Ashoka Aptitude Test (AAT)', 'Christ University Entrance Test', 'FLAME University FEAT'],
          curriculumFocus: 'Focus on qualitative human research, psychometric methods, critical textual deconstruction, and empathetic dialogue.'
        },
        bachelors: [
          {
            degree: 'B.A. (Hons) / B.Sc. in Psychology & Cognitive Science',
            specialization: 'Cognitive & Behavioral Psychology, Clinical Research Protocols',
            whyFits: `Leverages ${firstName}'s high agreeableness and empathetic analytical capacity.`,
            careerOutcomes: 'Organizational Psychologist, Behavioral Researcher, Clinical Associate'
          },
          {
            degree: 'B.A. in Clinical & Counselling Psychology',
            specialization: 'Psychotherapy Models, Adolescent Mental Health, Crisis Counseling',
            whyFits: 'Directly serves individuals and groups seeking mental health support.',
            careerOutcomes: 'Guidance Counsellor, Mental Health Associate, Wellness Consultant'
          },
          {
            degree: 'B.A. in Journalism, Mass Media & Behavioural Communication',
            specialization: 'Investigative Reporting, Digital Media Strategy, Public Broadcasting',
            whyFits: 'Applies strong verbal and narrative storytelling skills to public discourse.',
            careerOutcomes: 'Media Producer, Content Strategist, Public Relations Specialist'
          },
          {
            degree: 'B.Sc. in Cognitive Neuroscience & Behavioral Genetics',
            specialization: 'Neuro-imaging, Brain-Computer Interfaces, Neuropsychological Testing',
            whyFits: 'Combines biological sciences with cognitive and behavioural patterns.',
            careerOutcomes: 'Neuroscience Researcher, Cognitive Lab Lead, Neuro-marketing Analyst'
          }
        ],
        colleges: {
          reach: ['Lady Shri Ram College (LSR) Delhi', 'St. Xavier\'s College Mumbai', 'Ashoka University Sonepat', 'Tata Institute of Social Sciences (TISS)'],
          fit: ['Christ University Bangalore', 'Miranda House Delhi', 'Fergusson College Pune', 'FLAME University Pune'],
          accessible: ['Mithibai College Mumbai', 'Amity Institute of Psychology & Allied Sciences', 'Mount Carmel College Bangalore', 'Gargi College Delhi']
        },
        masters: [
          'M.A. / M.Sc. in Clinical Psychology (RCI Licensed Track in India)',
          'M.Sc. in Organizational & Industrial Psychology',
          'Master of Science in Cognitive Neuroscience & Human Factors',
          'Ph.D. in Clinical Neuropsychology & Psychotherapy'
        ],
        careerOutcomes: [
          'Licensed Clinical Psychologist / Psychotherapist (RCI)',
          'Chief People Officer / Organizational Psychologist',
          'Behavioral Economics & Policy Consultant',
          'School & Adolescent Guidance Counsellor'
        ],
        skills: ['Psychometric Assessment Administration', 'Cognitive Behavioral Therapy (CBT) Frameworks', 'Statistical Analysis (SPSS / R)', 'Active Empathetic Listening & Interviewing', 'Research Design & Qualitative Coding'],
        targetCompanies: ['Fortis Mental Health Department', 'Vandrevala Foundation', 'The Mind Clan / Manastha', 'Google People Operations (HR)', 'UNICEF / Mental Health NGOs'],
        milestone: 'Conduct a certified high school survey on adolescent stress/wellbeing, complete certified course in basic counseling skills, and secure 98th percentile in CUET Psychology.'
      };
      break;

    case 'DESIGN_ANIMATION_FINE_ARTS':
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('anim') || pathwayName.toLowerCase().includes('game')
          ? 'Animation, Interactive Game Design & Visual Media'
          : 'Industrial Design, UI/UX & Interactive Digital Media',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s profile is characterized by elevated spatial reasoning (${scores.aptitude.spatial}%) and exceptional creative openness (${scores.personality.openness}% Openness), providing the ideal foundation for human-centered design, UI/UX prototyping, and immersive digital media.`,
        foundation: {
          subjects: ['Fine Arts & Freehand Drawing', '3D Spatial Geometry & Projections', 'Design Thinking & Computer Applications', 'English Communication', 'Psychology / Media Studies'],
          exams: ['UCEED (IIT Bombay / IIT Delhi / IIT Guwahati)', 'NID DAT (National Institute of Design)', 'NIFT Entrance Examination', 'SEED (Symbiosis Institute of Design)', 'CEED (Future PG)'],
          curriculumFocus: 'Focus on visual composition, ergonomics, rapid physical and digital prototyping, and user empathy.'
        },
        bachelors: [
          {
            degree: 'B.Des (Bachelor of Design) in UI/UX & Interaction Design',
            specialization: 'Design Systems, User Research, Mobile & Web Product Interfaces',
            whyFits: `Synthesizes ${firstName}'s creative openness with structured digital problem solving.`,
            careerOutcomes: 'Product Designer, UI/UX Researcher, Interaction Specialist'
          },
          {
            degree: 'B.Des in Product & Industrial Design',
            specialization: 'Consumer Hardware, Ergonomics, Sustainable Materials & 3D Prototyping',
            whyFits: 'Applies spatial visualization to tangible physical consumer products.',
            careerOutcomes: 'Industrial Designer, Consumer Hardware Lead, Concept Artist'
          },
          {
            degree: 'B.Des in Animation, Gaming & Visual Effects (VFX)',
            specialization: '3D Character Rigging, Motion Design, Real-Time Game Engines (Unreal)',
            whyFits: 'Combines dynamic visual storytelling with advanced digital modeling.',
            careerOutcomes: '3D Animator, Game Level Designer, VFX Production Artist'
          },
          {
            degree: 'B.Des in Fashion & Textile Innovation',
            specialization: 'Smart Fabrics, Sustainable Fashion Design, Apparel Tech',
            whyFits: 'Applies aesthetic intuition to material and wearable technologies.',
            careerOutcomes: 'Fashion Designer, Textile Innovation Lead, Creative Stylist'
          }
        ],
        colleges: {
          reach: ['National Institute of Design (NID) Ahmedabad', 'IDC School of Design, IIT Bombay', 'Department of Design, IIT Delhi', 'Srishti Manipal Institute Bangalore'],
          fit: ['MIT Institute of Design Pune', 'Symbiosis Institute of Design (SID) Pune', 'National Institute of Fashion Technology (NIFT) Delhi', 'UID Ahmedabad'],
          accessible: ['Pearl Academy Delhi/Mumbai', 'Chitkara School of Planning & Design', 'UPES School of Design Dehradun', 'Arch College of Design Jaipur']
        },
        masters: [
          'M.Des in Human-Computer Interaction (HCI - Carnegie Mellon / Stanford / NID)',
          'M.S. in Interactive Media & Game Design',
          'Master of Design in Sustainable Transportation & Mobility Systems',
          'Ph.D. in Design Computing & Augmented Human Cognition'
        ],
        careerOutcomes: [
          'Principal Product / UX Designer (Google / Apple / Microsoft)',
          'Lead Industrial & Automotive Concept Designer',
          'Art Director & Visual Effects (VFX) Production Supervisor',
          'Design Strategy Director & Innovation Consultant'
        ],
        skills: ['Figma & Advanced Prototyping', 'Design Thinking & Heuristic Evaluation', '3D Modeling (Blender / Rhino / Maya)', 'Visual Hierarchy & Typography', 'User Research & Usability Testing'],
        targetCompanies: ['Apple Design Studio', 'Google Product Experience', 'Microsoft Studio', 'Electronic Arts (EA)', 'IDEO Global Design', 'Tata Elxsi Design Studio'],
        milestone: 'Compile a 15-project digital design portfolio on Behance/Dribbble, build an interactive mobile app prototype in Figma, and secure top rank in NID/UCEED mocks.'
      };
      break;

    case 'PURE_SCIENCES':
      data = {
        pathwayName,
        pathwayTitle: 'Pure Sciences, Theoretical Physics & Scientific Research',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s cognitive profile is characterized by profound analytical reasoning (${scores.aptitude.reasoning}%) and mathematical rigor (${scores.aptitude.numerical}%), creating the ideal profile for theoretical research, fundamental physics, chemistry, and scientific discovery.`,
        foundation: {
          subjects: ['Theoretical Physics & Classical Mechanics', 'Pure Mathematics (Calculus & Proofs)', 'Inorganic & Physical Chemistry', 'Computer Programming for Scientific Computing', 'Technical English'],
          exams: ['IISER Aptitude Test (IAT)', 'NEST (National Entrance Screening Test - NISER)', 'JEE Advanced (IISc Bangalore BS Track)', 'CUET-UG (Pure Sciences)'],
          curriculumFocus: 'Focus on rigorous mathematical derivations, experimental physics validation, and fundamental scientific inquiry.'
        },
        bachelors: [
          {
            degree: 'BS-MS Dual Degree in Physics / Mathematics (5 Years)',
            specialization: 'Quantum Mechanics, Astrophysics, Mathematical Physics',
            whyFits: `Directly leverages ${firstName}'s high abstract reasoning and research dedication.`,
            careerOutcomes: 'Research Physicist, Theoretical Modeler, Academic Scientist'
          },
          {
            degree: 'B.Sc. (Hons) in Mathematics & Computing',
            specialization: 'Pure Mathematics, Cryptography, Numerical Simulation',
            whyFits: 'Applies pure mathematical rigor to high-level theoretical and computational problems.',
            careerOutcomes: 'Mathematical Modeler, Cryptographer, Quantitative Researcher'
          },
          {
            degree: 'B.Sc. (Hons) in Chemistry & Materials Science',
            specialization: 'Quantum Chemistry, Nanomaterials, Catalysis & Polymers',
            whyFits: 'Combines molecular theory with experimental lab syntheses.',
            careerOutcomes: 'Materials Scientist, Chemical Synthesis Researcher, Nanotechnology Lead'
          },
          {
            degree: 'B.Sc. in Environmental Sciences & Climate Dynamics',
            specialization: 'Atmospheric Physics, Climate Modeling, Geochemical Cycles',
            whyFits: 'Addresses fundamental earth systems and climate modeling.',
            careerOutcomes: 'Climate Data Scientist, Environmental Researcher, Hydrologist'
          }
        ],
        colleges: {
          reach: ['IISc Bangalore (BS Program)', 'IISER Pune / Kolkata / Mohali', 'NISER Bhubaneswar', 'Chennai Mathematical Institute (CMI)'],
          fit: ['St. Stephen\'s College Delhi', 'Loyola College Chennai', 'St. Xavier\'s College Mumbai', 'Fergusson College Pune'],
          accessible: ['Christ University Bangalore', 'Mount Carmel College Bangalore', 'Ramjas College Delhi', 'Hansraj College Delhi']
        },
        masters: [
          'M.S. / Ph.D. in Theoretical Physics (Cambridge / Princeton / TIFR)',
          'Ph.D. in Pure Mathematics & Topology',
          'M.S. in Climate Dynamics & Computational Geosciences',
          'Doctor of Philosophy in Quantum Computing & Nanotechnology'
        ],
        careerOutcomes: [
          'Senior Research Scientist (TIFR / CERN / Max Planck Institute)',
          'Principal Quantitative Researcher / Theoretical Modeler',
          'University Professor & Principal Investigator (IISc / IITs)',
          'National Laboratory Director (ISRO Space Physics Lab / BARC)'
        ],
        skills: ['Mathematical Proofs & Tensor Calculus', 'Scientific Python (NumPy / SciPy / SymPy)', 'Quantum & Statistical Mechanics', 'Experimental Lab Instrumentation & Error Analysis', 'Scientific Publishing in Peer-Reviewed Journals'],
        targetCompanies: ['Tata Institute of Fundamental Research (TIFR)', 'CERN (European Organization for Nuclear Research)', 'ISRO Space Applications Centre', 'Max Planck Society Germany', 'BARC / DRDO Labs'],
        milestone: 'Win state science olympiad, conduct original secondary research paper in physics/mathematics, and achieve 99th percentile in IISER Aptitude Test (IAT).'
      };
      break;

    case 'SOFTWARE_AI_CS':
    default:
      data = {
        pathwayName,
        pathwayTitle: pathwayName.toLowerCase().includes('data') || pathwayName.toLowerCase().includes('ai')
          ? 'Data Science, Artificial Intelligence & Machine Learning'
          : 'Computer Science, Software Systems & Artificial Intelligence',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s cognitive profile is characterized by strong spatial visualization (${scores.aptitude.spatial}%) and analytical reasoning (${scores.aptitude.reasoning}%), supporting high technical execution in algorithmic computing, distributed architecture, and artificial intelligence.`,
        foundation: {
          subjects: ['Advanced Physics & Mechanics', 'Higher Mathematics (Calculus, Linear Algebra & Discrete Math)', 'Chemistry & Materials', 'Computer Science (Python / Java / C++)', 'English Technical Writing'],
          exams: ['JEE Main & JEE Advanced', 'BITSAT (BITS Pilani)', 'IIIT UGEE', 'VITEEE / MET / MHT-CET', 'CUET-UG (Maths/Physics)'],
          curriculumFocus: 'Focus on mathematical problem solving, algorithmic thinking, data structures, and software architecture fundamentals.'
        },
        bachelors: [
          {
            degree: 'B.Tech / B.E. Computer Science & Artificial Intelligence',
            specialization: 'Machine Learning, Distributed Systems, Large Language Models',
            whyFits: `Aligns with ${firstName}'s high spatial and logical reasoning skills.`,
            careerOutcomes: 'Software Development Engineer (SDE), AI Engineer, Systems Architect'
          },
          {
            degree: 'B.Tech in Artificial Intelligence & Data Science',
            specialization: 'Deep Learning, Predictive Analytics, Big Data Infrastructure',
            whyFits: 'Applies statistical and computational logic to large-scale data engineering.',
            careerOutcomes: 'Data Scientist, Machine Learning Engineer, Analytics Architect'
          },
          {
            degree: 'B.Sc. (Hons) Mathematics & Computing / Data Science',
            specialization: 'Quantitative Analytics, Algorithmic Optimization, Applied Math',
            whyFits: 'Applies pure mathematical rigor to high-speed computational data.',
            careerOutcomes: 'Quantitative Analyst, Algorithm Specialist, Data Scientist'
          },
          {
            degree: 'B.Tech in Cybersecurity & Cloud Computing',
            specialization: 'Cryptographic Security, Cloud Native Systems, Ethical Hacking',
            whyFits: 'Focuses on safeguarding enterprise networks and distributed cloud infra.',
            careerOutcomes: 'Cybersecurity Architect, Cloud Security Lead, Penetration Tester'
          }
        ],
        colleges: {
          reach: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad'],
          fit: ['NIT Trichy', 'Delhi Technological University (DTU)', 'IIIT Bangalore', 'VIT Vellore'],
          accessible: ['Thapar Institute Patiala', 'Manipal Institute of Technology (MIT)', 'SRM Institute Chennai', 'Jaypee Institute (JIIT)']
        },
        masters: [
          'M.Tech / M.S. in Computer Science & Artificial Intelligence (Carnegie Mellon / Stanford)',
          'M.S. in Data Science & Machine Learning Systems',
          'Master of Business Administration (MBA - Technology Management)',
          'Ph.D. in Theoretical Computer Science & Generative AI'
        ],
        careerOutcomes: [
          'Senior Software Development Engineer (FAANG / Tier-1 Tech)',
          'Artificial Intelligence & Machine Learning Architect',
          'Quantitative Strategist / Data Science Lead',
          'Chief Technology Officer (CTO) / High-Growth Founder'
        ],
        skills: ['Data Structures & Algorithms', 'Python, C++ & TypeScript Programming', 'Calculus & Linear Algebra', 'System Architecture & Distributed Clouds', 'Technical Problem Solving'],
        targetCompanies: ['Google', 'Microsoft', 'NVIDIA', 'Amazon Web Services', 'Apple', 'ISRO / DRDO'],
        milestone: 'Build a functional coding portfolio on GitHub, solve 200+ algorithm problems, and achieve benchmark score in JEE Mains mocks.'
      };
      break;
  }

  // Adjust wording based on parent alignment if available
  if (comparisonData && comparisonData.overallIndicator.includes('Divergence')) {
    data.rationale += ` Note: Family discussion recommended to align career expectations with student capabilities.`;
  }

  return data;
}

// ─── 2. PERSONALIZED STUDY ABROAD GUIDE GENERATOR ────────────────────────────

export function getStudyAbroadGuideData(
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): StudyAbroadGuideData {
  const firstName = student.name.split(' ')[0];
  const primaryFit = scores.careerFitment[0]?.name || 'Civil Engineering & Architecture';
  const domain = getSpecializedDomain(primaryFit);

  let rationale = '';
  let countries: StudyAbroadCountry[] = [];
  let scholarships: string[] = [];
  let programs: string[] = [];

  // Determine parent openness & financial alignment labels
  const parentOpennessLabel = comparisonData
    ? comparisonData.areas.find(a => a.name.includes('Exposure') || a.name.includes('Environment'))?.level.toUpperCase() || 'MODERATE ALIGNMENT'
    : 'EXPLORATORY ALIGNMENT';

  const financialAlignmentLabel = comparisonData
    ? comparisonData.areas.find(a => a.name.includes('Financial') || a.name.includes('Investment'))?.level.toUpperCase() || 'BALANCED FEASIBILITY'
    : 'SCHOLARSHIP-PREFERABLE';

  switch (domain) {
    case 'CIVIL_ARCHITECTURE':
      rationale = `${firstName}'s strong spatial reasoning (${scores.aptitude.spatial}%) makes global civil and structural engineering programs (Germany's engineering powerhouses, the Netherlands' world-leading delta architecture, and US infrastructure hubs) exceptional springboards for global engineering leadership.`;
      countries = [
        {
          flag: '🇩🇪',
          name: 'Germany',
          reason: 'Europe\'s civil engineering powerhouse. TU Munich, RWTH Aachen, and TU Dresden offer world-renowned civil, structural, and infrastructure degrees with tuition-free public education and 18-month post-study work visas.',
          academicRoute: '3.5-Year B.Sc. Civil Engineering (Tuition-Free)',
          costCategory: 'Low (Tuition-Free Public Universities)'
        },
        {
          flag: '🇳🇱',
          name: 'Netherlands',
          reason: 'TU Delft ranks #2 globally in Civil & Structural Engineering. Pioneer in sustainable delta infrastructure, smart flood defense, and computational architecture with 1-year orientation year work permits.',
          academicRoute: '3-Year B.Sc. Civil Engineering (English-taught)',
          costCategory: 'Moderate'
        },
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'Home to top engineering programs (UC Berkeley, Purdue, UIUC, Georgia Tech) with massive infrastructure funding and 3-year STEM OPT work authorization with global firms like Arup, AECOM, and Bechtel.',
          academicRoute: '4-Year B.S. Civil / Structural Engineering (3-Yr OPT)',
          costCategory: 'High (Merit & Research Assistantships)'
        }
      ];
      scholarships = [
        'DAAD Undergraduate & Master\'s Engineering Scholarship (Germany)',
        'TU Delft Excellence Civil Engineering Scholarship (Netherlands)',
        'ICE QUEST Undergraduate Civil Engineering Scholarship (UK)',
        'Fulbright-Nehru & US College Dean\'s Merit Engineering Grants'
      ];
      programs = [
        'B.S. / M.S. in Civil & Environmental Engineering',
        'B.Arch / M.Arch in Sustainable Urban Architecture',
        'M.S. in Structural Mechanics & Seismic Resilience',
        'M.Sc. in Smart Cities, Infrastructure & BIM Management'
      ];
      break;

    case 'MECHANICAL_AEROSPACE':
    case 'ELECTRICAL_ELECTRONICS':
    case 'ROBOTICS_AUTOMATION':
      rationale = `${firstName}'s spatial visualization and computational logic make international STEM programs (German automotive clusters, US aerospace hubs, and UK innovation corridors) exceptional springboards for global engineering careers.`;
      countries = [
        {
          flag: '🇩🇪',
          name: 'Germany',
          reason: 'Global leader in automotive, precision robotics, and industrial engineering. RWTH Aachen, TU Munich, and Stuttgart provide cutting-edge laboratories with zero tuition fees.',
          academicRoute: '3.5-Year B.Sc. Engineering (Tuition-Free)',
          costCategory: 'Low (Tuition-Free Public Universities)'
        },
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'Purdue, Georgia Tech, Michigan, and MIT offer unmatched research grants and 3-year STEM OPT work authorizations with aerospace and semiconductor leaders.',
          academicRoute: '4-Year B.S. Engineering (3-Yr STEM OPT)',
          costCategory: 'High (Merit Aid Available)'
        },
        {
          flag: '🇸🇬',
          name: 'Singapore',
          reason: 'NUS and NTU rank in the world\'s top 15 for engineering and semiconductor research, offering direct Asian tech ecosystem recruitment.',
          academicRoute: '4-Year B.Eng (Tuition Grant Option)',
          costCategory: 'Moderate'
        }
      ];
      scholarships = [
        'DAAD Engineering Scholarship (Germany)',
        'Singapore International Graduate Award (SINGA)',
        'US College Dean\'s Merit Engineering Grant',
        'Erasmus Mundus Joint Robotics / Aerospace Master Scholarship'
      ];
      programs = [
        'B.S. / M.S. in Mechanical Engineering & Robotics',
        'B.Sc. in Aerospace Engineering & Space Systems',
        'B.Eng in Microelectronics & Semiconductor VLSI',
        'M.Sc. in Autonomous Vehicle Dynamics & Systems Control'
      ];
      break;

    case 'MEDICINE_SURGERY':
    case 'PHARMACY_BIOTECH':
      rationale = `${firstName}'s high scientific aptitude and medical service dedication align strongly with premier biomedical and clinical institutions globally.`;
      countries = [
        {
          flag: '🇬🇧',
          name: 'United Kingdom',
          reason: 'Historic medicine and life science leadership (Oxford, Cambridge, King\'s College) offering internationally recognized medical and biomedical degrees with NHS residency pathways.',
          academicRoute: '5-Year MBChB / 3-Year B.Sc. Biomedical',
          costCategory: 'High (Scholarships Available)'
        },
        {
          flag: '🇦🇺',
          name: 'Australia',
          reason: 'World-class clinical training (U of Melbourne, Sydney) with direct Australian Medical Council licensing and 3-year post-study work rights.',
          academicRoute: 'Direct Bachelor of Medical Studies / MD',
          costCategory: 'High'
        },
        {
          flag: '🇩🇪',
          name: 'Germany',
          reason: 'Heidelberg and Charité Berlin offer world-class medical science and pharmacology with minimal tuition fees at public universities.',
          academicRoute: 'State Examination Medicine / M.Sc. Biotech',
          costCategory: 'Low (Tuition-Free Public Universities)'
        }
      ];
      scholarships = [
        'Johns Hopkins / Global Health Biomedical Fellowship',
        'DAAD Biomedical & Master\'s Scholarship in Germany',
        'Commonwealth Medical & Healthcare Scholarship',
        'Gates Cambridge International Life Sciences Scholarship'
      ];
      programs = [
        'B.Sc. in Biomedical Science & Molecular Genetics',
        'Pre-Medicine Track / Doctor of Medicine (MD)',
        'M.Sc. in Biotechnology & Bioprocess Engineering',
        'Master of Public Health (MPH - Global Health Track)'
      ];
      break;

    case 'CHARTERED_ACCOUNTANCY_FINANCE':
    case 'BUSINESS_MANAGEMENT_MARKETING':
      rationale = `${firstName}'s numerical logic and structured goal-execution profile make studying business, finance, or economics abroad a high-ROI pathway, providing direct exposure to global financial hubs.`;
      countries = [
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'Home to Wall Street and global tech ecosystems. US business programs (Wharton, NYU Stern) offer STEM-designated finance degrees with 3-year OPT work permits.',
          academicRoute: '4-Year BBA / B.Sc. Finance (STEM OPT)',
          costCategory: 'High (Merit Scholarships Available)'
        },
        {
          flag: '🇬🇧',
          name: 'United Kingdom',
          reason: 'London is a global financial capital. LSE, Imperial, and King\'s College offer premier finance and economics degrees with direct corporate recruiting.',
          academicRoute: '3-Year B.Sc. Finance / 1-Year M.Sc.',
          costCategory: 'Moderate to High'
        },
        {
          flag: '🇨🇦',
          name: 'Canada',
          reason: 'Renowned business schools (U of Toronto Rotman, UBC Sauder) with co-op work terms offering direct industry placement and post-graduation work permits (PGWP).',
          academicRoute: '4-Year BBA / B.Com with Co-op Terms',
          costCategory: 'Moderate (Affordable Public Tuition)'
        }
      ];
      scholarships = [
        'Ontario Graduate & Undergraduate Merit Grants (Canada)',
        'LSE International Student Financial Aid (UK)',
        'US University Trustee & Dean\'s Merit Scholarships',
        'Erasmus Mundus Joint Master Scholarships (Europe)'
      ];
      programs = [
        'B.Sc. in Finance & Quantitative Investment Analysis',
        'BBA in Global Strategic Management (Co-op)',
        'M.Sc. in Financial Engineering & FinTech',
        'Master of Management in Analytics (MMA)'
      ];
      break;

    case 'LAW_LEGAL':
    case 'PSYCHOLOGY_HUMANITIES':
    case 'DESIGN_ANIMATION_FINE_ARTS':
    case 'PURE_SCIENCES':
    case 'SOFTWARE_AI_CS':
    default:
      rationale = `${firstName}'s strong analytical capacity (${scores.aptitude.overall}%) positions them exceptionally well for international universities offering holistic curricula with global professional opportunities.`;
      countries = [
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'World-leading curriculum, research funding, and international post-study work authorization.',
          academicRoute: '4-Year B.S. / B.A. (Holistic Admission)',
          costCategory: 'High (Merit & Need-Based Aid)'
        },
        {
          flag: '🇬🇧',
          name: 'United Kingdom',
          reason: 'World-renowned academic heritage with 2-year post-study work visas and focused degree timelines.',
          academicRoute: '3-Year B.A. / B.Sc. (Hons)',
          costCategory: 'Moderate to High'
        },
        {
          flag: '🇩🇪',
          name: 'Germany',
          reason: 'Tuition-free public education with high-tech laboratories and strong industrial integration.',
          academicRoute: '3.5-Year Bachelor\'s (Tuition-Free)',
          costCategory: 'Low (Tuition-Free Public Universities)'
        }
      ];
      scholarships = [
        'Chevening Undergraduate / Master\'s Scholarships (UK)',
        'DAAD International Student Grant (Germany)',
        'US University Dean\'s Merit Award',
        'Commonwealth Scholarship Scheme'
      ];
      programs = [
        `Undergraduate Degree in ${primaryFit}`,
        `International Honours Pathway in ${primaryFit}`,
        `Global Master of Science in ${primaryFit}`,
        'Dual Degree Interdisciplinary Track'
      ];
      break;
  }

  return {
    rationale,
    fitmentSummary: `Targeting global education pathways in ${countries.map(c => c.name).join(', ')} aligned with ${primaryFit}.`,
    parentOpennessLabel,
    financialAlignmentLabel,
    countries,
    scholarships,
    programs
  };
}

// ─── 3. ACADEMIC & PROFILE ROADMAP TIMELINE GENERATOR ───────────────────────

export function getAcademicProfileRoadmapData(
  student: EditorialStudent,
  scores: EditorialScores
): AcademicStage[] {
  const primaryFit = scores.careerFitment[0]?.name || 'Target Pathway';

  return [
    {
      phase: 'STAGE 1',
      label: 'Class 10 (Current Foundation)',
      icon: '🎯',
      academicGoal: 'Achieve 85%+ in Board Examinations; solidify Math, Science & English fundamentals.',
      profileGoal: 'Finalize Class 11 stream selection based on psychometric evidence & family alignment.',
      keySkills: ['Time Management', 'Self-Assessment', 'Foundational Logic'],
      milestone: 'Complete Class 10 Board Exams & Lock Class 11 Subject Stream Choice.'
    },
    {
      phase: 'STAGE 2',
      label: 'Class 11–12 (Specialization & Exams)',
      icon: '📚',
      academicGoal: 'Master Class 11–12 core syllabus and prepare targeted entrance exams (CUET / JEE / NEET / IPMAT).',
      profileGoal: 'Build extracurricular profile: leadership roles, Olympiads, and summer projects.',
      keySkills: ['Exam Strategy', 'Advanced Problem Solving', 'Consistency'],
      milestone: 'Achieve Top Percentile in Target Entrance Exams & Secure University Admission.'
    },
    {
      phase: 'STAGE 3',
      label: 'Bachelor\'s Degree (Years 1–2)',
      icon: '🎓',
      academicGoal: 'Maintain high Cumulative GPA (8.0+/10) in core undergraduate coursework.',
      profileGoal: 'Join campus technical/literary clubs, participate in hackathons/case competitions, and secure Year-2 summer internship.',
      keySkills: ['Domain Fundamentals', 'Networking', 'Project Execution'],
      milestone: 'Complete First Industry/Research Internship & Build Project Portfolio.'
    },
    {
      phase: 'STAGE 4',
      label: 'Bachelor\'s Specialization (Years 3–4)',
      icon: '🚀',
      academicGoal: 'Execute final-year capstone research thesis / major industry design project.',
      profileGoal: 'Secure Tier-1 campus placement or apply for top global Master\'s programs.',
      keySkills: ['Advanced Domain Tools', 'Portfolio Defense', 'Interview Readiness'],
      milestone: 'Graduate with Honors & Secure Placement Offer / Master\'s Admission.'
    },
    {
      phase: 'STAGE 5',
      label: 'Early Career Entry (Years 1–3 Post-Grad)',
      icon: '💼',
      academicGoal: 'Gain hands-on industry experience; pursue professional certifications (CFA / PMP / AWS / Clinical Board).',
      profileGoal: 'Demonstrate measurable impact in target organization; build professional network.',
      keySkills: ['Industry Expertise', 'Cross-Functional Collaboration', 'Leadership'],
      milestone: 'Promoted to Senior Role / Transition to Specialized Global Practice.'
    },
    {
      phase: 'STAGE 6',
      label: 'Advanced Master\'s / Global Leadership',
      icon: '🌍',
      academicGoal: 'Pursue Executive MBA / Specialist M.S. at top international university if desired.',
      profileGoal: 'Establish subject-matter authority and lead high-impact industry or societal initiatives.',
      keySkills: ['Strategic Vision', 'Global Management', 'Innovation'],
      milestone: 'Achieve Industry Leadership / Executive Role in Chosen Career Field.'
    }
  ];
}

// ─── 4. STUDENT ACTION PLAN GENERATOR ───────────────────────────────────────

export function getStudentActionPlanData(
  student: EditorialStudent,
  scores: EditorialScores
): StudentActionPlanData {
  const firstName = student.name.split(' ')[0];
  const topVarkLabel = 
    scores.topVark === 'V' ? 'Visual (Mind Maps & Diagrams)' :
    scores.topVark === 'A' ? 'Auditory (Discussion & Audio Recaps)' :
    scores.topVark === 'R' ? 'Reading/Writing (Structured Notes & Summaries)' : 'Kinesthetic (Hands-on Practice & Simulations)';

  return {
    thisMonth: [
      `Review Class 10 Board exam preparation gaps in weak chapters using ${topVarkLabel} techniques.`,
      `Finalize stream preference (Primary: ${scores.careerFitment[0]?.name || 'Selected Track'}) with family and counsellor.`,
      'Establish a distraction-free daily study routine with 3-hour focused deep work blocks.',
      'Research syllabus and eligibility criteria for top target entrance examinations.'
    ],
    next90Days: [
      'Complete Board examination revision cycles with minimum 5 full-length mock papers.',
      'Attend school stream counselling session with official psychometric report copy.',
      'Begin introductory foundation reading/coursework for selected Class 11 stream subjects.',
      'Organize all academic certificates, extracurricular achievements, and awards into a digital portfolio.'
    ],
    thisAcademicYear: [
      'Secure 85%+ in Class 10 Board examinations.',
      'Transition smoothly into Class 11 stream with structured weekly revision timetables.',
      'Join at least 2 relevant school clubs (e.g. Science/Coding, Debate, Commerce/Business Club).',
      'Set baseline benchmark scores in entrance exam diagnostic tests.'
    ],
    skillsToBuild: [
      `Analytical Problem Solving (${scores.aptitude.overall}% current cognitive baseline)`,
      `Conscientious Time Management (${scores.personality.conscientiousness}% current execution score)`,
      `Emotional Resilience Under Exam Conditions (${scores.personality.emotionalStability}% stability score)`,
      `${topVarkLabel} Learning Optimization`,
      'Effective Written & Verbal Communication'
    ],
    counsellorCheckpoint: [
      `Validate alignment between ${firstName}'s primary preference and parent expectations.`,
      'Review Class 11 school choices and subject combination availability (e.g. Math vs. Applied Math).',
      'Formulate coaching/preparation strategy for competitive entrance exams.'
    ],
    studentAction: [
      'Take complete ownership of daily study schedule and track weekly goal completion.',
      'Engage in proactive weekly discussions with parents regarding academic progress.',
      'Maintain balance between academic rigor, physical health, and adequate sleep.'
    ]
  };
}
