const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/career-library/branches_data.js');
let content = fs.readFileSync(targetPath, 'utf-8');

// Normalize CRLF to LF for reliable string searching/replacing
const hasCRLF = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

// 1. Add cluster 'aviation-maritime' if missing
if (!content.includes("'aviation-maritime'")) {
  const clusterTarget = "'pure-science':{name:'Pure & Applied Sciences',icon:'🔭',max:2,stream:'science-health'}\n};";
  const clusterInsert = "'pure-science':{name:'Pure & Applied Sciences',icon:'🔭',max:2,stream:'science-health'},\n  // — added in v4: aviation, maritime & transport (PCM pathway) —\n  'aviation-maritime':{name:'Aviation, Maritime & Transport',icon:'✈️',max:1,stream:'engineering'}\n};";
  content = content.replace(clusterTarget, clusterInsert);
  console.log('Added aviation-maritime to CLUSTERS');
}

// 2. Add 35 new branches if missing
const newBranchesCode = `,{id:"fashion-design",name:"Fashion Design",cluster:"creative-design",family:"fashion-design",
desc:"Designing apparel and accessories — trend research, illustration, pattern making, garment construction, and styling.",
difficulty:3,futureScope:4,
whoSuits:"Creative students who love clothes, colour, fabric and trends, and enjoy sketching and making things by hand.",
traitVector:{Creativity:0.92,VisualArts:0.9,DesignThinking:0.75,TextileDesign:0.7,Innovation:0.6,Entrepreneurship:0.5,Communication:0.5,Precision:0.55,SpatialThinking:0.55,Organization:0.45,Persuasion:0.3},
coreSkills:["Fashion Illustration","Pattern Making & Draping","Garment Construction","Textile & Fabric Knowledge","Trend Forecasting","Styling & Merchandising"],
tools:["Sketchbook & Illustration Tools","Adobe Illustrator","Photoshop","CLO 3D / Browzwear","CorelDRAW","Industrial Sewing Machines","Dress Forms","Portfolio on Behance / Instagram"],
careers:["Fashion Designer","Fashion Stylist","Costume Designer","Fashion Merchandiser","Technical Designer / Pattern Maker","Fashion Entrepreneur"]
},
{id:"jewellery-design",name:"Jewellery & Accessory Design",cluster:"creative-design",family:"jewellery-design",
desc:"Designing jewellery and accessories — sketching, CAD modelling, gemmology, metalwork and luxury product thinking.",
difficulty:3,futureScope:4,
whoSuits:"Detail-oriented creatives who love craft, gems, metals and small-scale precision design.",
traitVector:{Creativity:0.88,VisualArts:0.85,DesignThinking:0.7,Precision:0.8,SpatialThinking:0.7,MaterialScience:0.3,Entrepreneurship:0.5,Innovation:0.55,Communication:0.4,Organization:0.4},
coreSkills:["Jewellery Illustration","3D CAD Modelling","Gemmology Basics","Metalsmithing & Casting","Trend & Luxury Branding","Costing & Production"],
tools:["Rhino / Matrix (Jewellery CAD)","Adobe Illustrator","Photoshop","Gem Testing Instruments","Bench Tools & Casting Equipment","3D Printers (Wax / Resin)","KeyShot Rendering","Portfolio Website"],
careers:["Jewellery Designer","CAD Jewellery Modeller","Gemmologist / Gem Grader","Accessory Designer","Brand / Collection Manager","Jewellery Entrepreneur"]
},
{id:"industrial-product-design",name:"Industrial & Product Design",cluster:"creative-design",family:"industrial-design",
desc:"Designing physical products — from phones and appliances to furniture and vehicles — balancing form, function and manufacturing.",
difficulty:4,futureScope:5,
whoSuits:"Creative problem-solvers who sketch, build prototypes and want to shape everyday objects.",
traitVector:{Creativity:0.85,DesignThinking:0.9,SpatialThinking:0.85,VisualArts:0.7,Innovation:0.75,ProblemSolving:0.7,MechanicalSystems:0.4,Empathy:0.5,Precision:0.6,Entrepreneurship:0.45,Communication:0.5},
coreSkills:["Product Sketching & Rendering","3D Modelling & CAD","Materials & Manufacturing Processes","Ergonomics & Human Factors","Prototyping","Design Research & Strategy"],
tools:["Fusion 360 / SolidWorks","Rhino","KeyShot","Adobe Illustrator / Photoshop","Blender","3D Printers","Workshop Tools (Wood / Metal / Foam)","Figma (Basics)"],
careers:["Industrial Designer","Product Designer","Design Researcher","Automotive / Transportation Designer","Furniture / Lifestyle Designer","Design Strategist"]
},
{id:"photography-cinematography",name:"Photography & Cinematography",cluster:"creative-design",family:"photography",
desc:"Capturing stills and moving images — lighting, composition, camera craft, editing and visual storytelling for film, advertising and media.",
difficulty:3,futureScope:4,
whoSuits:"Visual storytellers who notice light, framing and moments, and enjoy technical camera work.",
traitVector:{Creativity:0.85,VisualArts:0.92,Precision:0.6,SpatialThinking:0.6,DesignThinking:0.5,Communication:0.45,Entrepreneurship:0.55,Innovation:0.45,PhysicalStamina:0.4,Organization:0.4,Empathy:0.4},
coreSkills:["Camera & Exposure Craft","Lighting Design","Composition & Visual Storytelling","Cinematography Techniques","Photo / Video Editing & Colour Grading","Visual Storytelling for Brands"],
tools:["DSLR / Mirrorless Cameras","Cine Lenses & Gimbals","Lighting & Grip Equipment","Adobe Lightroom / Photoshop","DaVinci Resolve / Premiere Pro","Drone Camera (DGCA rules)","Sound Recording Basics","Portfolio Website / Instagram"],
careers:["Photographer","Cinematographer / DoP","Photojournalist","Commercial / Fashion Photographer","Video Editor / Colourist","Content Creator / Visual Producer"]
},
{id:"music-production-sound",name:"Music Production & Sound Design",cluster:"creative-design",family:"sound-music-tech",
desc:"Creating and engineering music and sound — recording, mixing, mastering, sound design for film, games and live events.",
difficulty:3,futureScope:4,
whoSuits:"Musically curious students who love sound, gear and software, and want to build songs, scores or soundscapes.",
traitVector:{Creativity:0.85,PerformingArts:0.65,Precision:0.65,Electronics:0.4,DesignThinking:0.45,Innovation:0.5,Entrepreneurship:0.5,ProblemSolving:0.5,PatternRecognition:0.55,Communication:0.4},
coreSkills:["Music Theory & Arrangement","Recording & Mixing","Mastering","Sound Design & Foley","Acoustics & Studio Setup","Audio for Film & Games"],
tools:["Ableton Live / Logic Pro / Pro Tools","Studio Monitors & Microphones","Audio Interfaces","Synths & Samplers","iZotope / Plugins","MIDI Controllers","Wwise / FMOD (Game Audio)","DaVinci Resolve (Audio Post)"],
careers:["Music Producer","Sound Designer","Mix / Mastering Engineer","Film & Game Audio Designer","Live Sound Engineer","Composer / Arranger"]
},
{id:"urban-planning-landscape",name:"Urban Planning & Landscape Architecture",cluster:"creative-design",family:"urban-planning",
desc:"Planning cities, transport, housing and public spaces — combining design, policy, data and sustainability.",
difficulty:4,futureScope:5,
whoSuits:"Students who care about how cities work and want to shape housing, transport, parks and public life.",
traitVector:{DesignThinking:0.8,SpatialThinking:0.8,SocialImpact:0.7,EnvironmentalAwareness:0.7,SystemsThinking:0.75,Creativity:0.65,Research:0.55,DataAnalysis:0.5,Communication:0.55,Construction:0.45,Organization:0.5},
coreSkills:["Urban Design & Planning Studio","GIS & Spatial Analysis","Transport & Infrastructure Planning","Housing & Land-use Policy","Landscape Design","Environmental Planning"],
tools:["AutoCAD","QGIS / ArcGIS","SketchUp / Revit","Adobe Illustrator / Photoshop","Rhino / Grasshopper (Basics)","Python (Spatial Data Basics)","Google Earth Engine","Public Consultation Tools"],
careers:["Urban Planner","Landscape Architect","Transport Planner","Smart-city / Infrastructure Consultant","Housing & Policy Analyst","Environmental Planner"]
},
{id:"culinary-arts",name:"Culinary Arts & Food Production",cluster:"management-business",family:"culinary",
desc:"Professional cooking, menu design, kitchen management and food entrepreneurship across hotels, restaurants and food brands.",
difficulty:3,futureScope:4,
whoSuits:"Hands-on, creative people who love food, can handle heat and pressure, and dream of kitchens or food brands.",
traitVector:{Creativity:0.8,PhysicalStamina:0.75,Precision:0.65,Leadership:0.5,Entrepreneurship:0.65,Organization:0.6,FoodScience:0.5,Communication:0.45,RiskTaking:0.4,ProblemSolving:0.55},
coreSkills:["Culinary Techniques","Indian & International Cuisines","Bakery & Patisserie","Menu Planning & Costing","Kitchen Management","Food Safety & Hygiene (FSSAI / HACCP)"],
tools:["Professional Kitchen Equipment","Knife Skills & Mise en Place","Pastry & Bakery Tools","Costing Spreadsheets (Excel)","POS / Inventory Software","HACCP Documentation","Food Photography","Social Media / Portfolio"],
careers:["Chef / Sous Chef","Pastry & Bakery Chef","Executive Chef","Food Stylist / Content Creator","Restaurant / Cloud-kitchen Owner","Food Product Developer"]
},
{id:"digital-marketing",name:"Digital Marketing & Social Media",cluster:"management-business",family:"digital-marketing",
desc:"Growing brands online — SEO, performance ads, social media, content, analytics and creator partnerships.",
difficulty:2,futureScope:5,
whoSuits:"Curious, creative-analytical students who like social media, trends, content and testing what works.",
traitVector:{Creativity:0.7,Communication:0.75,Persuasion:0.75,DataAnalysis:0.65,Writing:0.6,Entrepreneurship:0.55,Innovation:0.55,PatternRecognition:0.55,Organization:0.5,RiskTaking:0.4},
coreSkills:["SEO & Content Marketing","Performance Advertising (Google / Meta)","Social Media & Community Strategy","Marketing Analytics","Email & Marketing Automation","Branding & Copywriting"],
tools:["Google Analytics / Search Console","Google Ads / Meta Ads Manager","SEMrush / Ahrefs","Canva / Adobe Express","HubSpot / Mailchimp","Hootsuite / Buffer","ChatGPT-style AI Tools","Looker Studio"],
careers:["Digital Marketing Manager","SEO / Content Strategist","Performance Marketer","Social Media Manager","Growth Marketer","Influencer / Brand Partnerships Manager"]
},
{id:"tourism-travel-management",name:"Tourism & Travel Management",cluster:"management-business",family:"tourism",
desc:"Planning and managing travel experiences — tour operations, destination marketing, travel technology and heritage / eco-tourism.",
difficulty:2,futureScope:4,
whoSuits:"Outgoing, curious students who love travel, cultures and organising memorable trips.",
traitVector:{Communication:0.8,Persuasion:0.55,Organization:0.65,Leadership:0.4,Entrepreneurship:0.5,Empathy:0.5,PublicSpeaking:0.5,Creativity:0.5,SocialImpact:0.35,RiskTaking:0.3},
coreSkills:["Tour Operations & Itinerary Design","Destination & Heritage Management","Travel Technology (GDS / Booking)","Tourism Marketing","Customer Service & Hospitality","Sustainable & Eco-tourism"],
tools:["Amadeus / Sabre (GDS)","Booking Engines & OTAs","Google Maps / Trip Planning Tools","Canva / Social Media","CRM Tools","Excel / Costing","Foreign Language Skills","Photography & Storytelling"],
careers:["Tour Operator / Travel Consultant","Destination Manager","Travel Content Creator","Airline / Airport Customer Services","Event & MICE Planner","Eco / Heritage Tourism Manager"]
},
{id:"aviation-airport-management",name:"Aviation & Airport Management",cluster:"management-business",family:"aviation-management",
desc:"Running the ground side of aviation — airline operations, airport management, cabin services, ground handling and aviation logistics.",
difficulty:2,futureScope:5,
whoSuits:"Polished, communicative, team-oriented students who enjoy airports, service and fast-paced operations.",
traitVector:{Communication:0.8,Organization:0.7,Leadership:0.45,Empathy:0.5,PublicSpeaking:0.5,Persuasion:0.45,ProblemSolving:0.55,PhysicalStamina:0.5,Precision:0.5,RiskTaking:0.2},
coreSkills:["Airline & Airport Operations","Ground Handling & Passenger Services","Aviation Safety & Regulations (DGCA / ICAO)","Cargo & Air Logistics","Customer Service & Grooming","Aviation Business & Revenue Management"],
tools:["Reservation Systems (Amadeus / Sabre)","Airline Ground-handling Software","Excel / Reporting Tools","Safety Management Systems","CRM Tools","IATA Course Materials","Communication & Presentation Skills","Foreign Language Skills"],
careers:["Airport Operations Executive","Ground Handling / Customer Service Executive","Cabin Crew","Airline Revenue / Network Analyst","Aviation Cargo / Logistics Executive","Airline / Airport Manager"]
},
{id:"retail-ecommerce-management",name:"Retail & E-commerce Management",cluster:"management-business",family:"retail-ecommerce",
desc:"Running stores and online businesses — merchandising, category management, supply chain, pricing and customer experience.",
difficulty:2,futureScope:5,
whoSuits:"Customer-focused, numbers-aware students who like shopping trends, brands and fast-moving business.",
traitVector:{Communication:0.6,Persuasion:0.6,DataAnalysis:0.6,Organization:0.65,Leadership:0.5,Entrepreneurship:0.55,FinancialAcumen:0.5,Creativity:0.45,ProblemSolving:0.6,Innovation:0.45},
coreSkills:["Merchandising & Category Management","Retail Operations","E-commerce Platforms & Marketplaces","Consumer Behaviour & Pricing","Supply Chain & Inventory","Customer Experience & CRM"],
tools:["Excel / Google Sheets","Shopify / WooCommerce","Amazon / Flipkart Seller Dashboards","Google Analytics","Power BI / Tableau","Inventory / ERP Tools (SAP Basics)","Canva / Product Listing Tools","CRM Tools"],
careers:["Category / Merchandise Manager","E-commerce Manager","Store / Retail Operations Manager","Marketplace Seller / D2C Founder","Supply Chain / Inventory Analyst","Customer Experience Manager"]
},
{id:"real-estate-management",name:"Real Estate & Property Management",cluster:"management-business",family:"real-estate",
desc:"Developing, valuing, marketing and managing property — real estate finance, construction management, valuation and facility management.",
difficulty:3,futureScope:5,
whoSuits:"Business-minded students interested in property, investment, construction and negotiation.",
traitVector:{FinancialAcumen:0.7,Persuasion:0.65,Communication:0.6,Organization:0.6,Construction:0.45,Entrepreneurship:0.6,LegalReasoning:0.45,DataAnalysis:0.5,Leadership:0.45,RiskTaking:0.5},
coreSkills:["Real Estate Valuation & Finance","Construction & Project Management","Real Estate Law & RERA","Property & Facility Management","Real Estate Marketing & Sales","Urban Land Use & Investment Analysis"],
tools:["Excel Financial Modelling","Argus / Valuation Software (Basics)","MS Project / Primavera","AutoCAD (Basics)","CRM Tools","GIS / Google Earth","Property Portals (99acres / MagicBricks)","Power BI"],
careers:["Real Estate Analyst","Valuer / Property Appraiser","Project / Construction Manager","Facility / Property Manager","Real Estate Sales / Leasing Manager","Real Estate Investor / Developer"]
},
{id:"commercial-pilot",name:"Commercial Pilot (CPL)",cluster:"aviation-maritime",family:"pilot",
desc:"Flying passenger and cargo aircraft — flight training, navigation, meteorology, aviation law and crew resource management.",
difficulty:5,futureScope:5,
whoSuits:"Calm, disciplined students with strong maths-physics, quick decision-making and a passion for flying.",
traitVector:{Precision:0.85,ProblemSolving:0.8,Leadership:0.65,RiskTaking:0.45,Mathematics:0.65,SpatialThinking:0.8,LogicalReasoning:0.75,Communication:0.65,PhysicalStamina:0.6,SystemsThinking:0.7,AerospaceInterest:0.85},
coreSkills:["Air Navigation","Aviation Meteorology","Air Regulations (DGCA)","Aircraft Technical Knowledge","Flight Planning & Performance","Crew Resource Management"],
tools:["Flight Simulators","Aircraft Instruments & Avionics","Flight Planning Software","Navigation Charts & EFB Apps","Radio Telephony","Medical Fitness Records (DGCA Class 1)","Logbook","Type-rating Simulators"],
careers:["First Officer (Airline Pilot)","Captain","Cargo / Charter Pilot","Flight Instructor","Corporate / Helicopter Pilot","Aviation Safety Officer"]
},
{id:"aviation-maintenance-engineering",name:"Aircraft Maintenance Engineering (AME)",cluster:"aviation-maritime",family:"ame",
desc:"Maintaining and certifying aircraft airworthiness — airframes, engines, avionics and DGCA-licensed engineering (B1 / B2).",
difficulty:4,futureScope:5,
whoSuits:"Detail-obsessed, hands-on students who like mechanics and electronics and take safety seriously.",
traitVector:{Precision:0.9,MechanicalSystems:0.8,Electronics:0.6,ProblemSolving:0.75,Debugging:0.7,AerospaceInterest:0.8,SystemsThinking:0.6,PhysicalStamina:0.45,Mathematics:0.55,IndustrialProcess:0.45},
coreSkills:["Aircraft Structures & Systems","Gas Turbine & Piston Engines","Avionics & Electrical Systems","Aviation Regulations (DGCA CAR-66)","Maintenance Practices & Documentation","Non-destructive Testing & Safety"],
tools:["Aircraft Maintenance Manuals (AMM)","Torque / Precision Hand Tools","Borescope & NDT Equipment","Avionics Test Sets","Engine Test Cells (Training)","CAMO / MRO Software","Wiring & Harness Tools","Safety & Quality Systems"],
careers:["Aircraft Maintenance Engineer (B1 / B2)","Licensed Aircraft Engineer","MRO Planning Engineer","Quality / Airworthiness Inspector","Avionics Technician / Engineer","Line / Base Maintenance Supervisor"]
},
{id:"merchant-navy-nautical-science",name:"Merchant Navy (Nautical Science)",cluster:"aviation-maritime",family:"merchant-navy",
desc:"Navigating and commanding merchant ships — deck-officer training, seamanship, cargo operations, navigation and maritime safety.",
difficulty:4,futureScope:4,
whoSuits:"Disciplined, adventurous students who can handle long periods at sea and want a global, well-paid maritime career.",
traitVector:{Leadership:0.7,PhysicalStamina:0.7,RiskTaking:0.5,ProblemSolving:0.7,Precision:0.7,SpatialThinking:0.6,Communication:0.55,Organization:0.6,SystemsThinking:0.55,Mathematics:0.55},
coreSkills:["Celestial & Electronic Navigation","Seamanship & Ship Handling","Cargo Handling & Stability","Maritime Law & COLREGs","Meteorology & Oceanography","Ship Safety & Security (STCW)"],
tools:["ECDIS & Radar / ARPA","GPS / GNSS","Bridge Simulators","Charts & Passage Planning Tools","STCW Safety Training Kits","Cargo Planning Software","Maritime Communication Equipment (GMDSS)","Sea-time Record Book"],
careers:["Deck Cadet → Third / Second / Chief Officer","Captain / Master Mariner","Marine Pilot","Port / Terminal Manager","Marine Surveyor","Shipping Operations Manager"]
},
{id:"bca-computer-applications",name:"BCA / B.Sc. IT (Computer Applications)",cluster:"pure-science",family:"bca",
desc:"Software development, databases, web and app building and IT systems — a non-engineering route into the tech industry.",
difficulty:3,futureScope:5,
whoSuits:"Students who enjoy coding and computers but prefer a 3-year applications-focused degree (often followed by MCA / MBA / jobs).",
traitVector:{Programming:0.8,LogicalReasoning:0.7,ProblemSolving:0.7,Debugging:0.65,Mathematics:0.4,Creativity:0.4,Communication:0.4,DataAnalysis:0.4,Innovation:0.45,Entrepreneurship:0.4},
coreSkills:["Programming (C / Java / Python)","Data Structures","Database Management","Web Development","Software Engineering","Operating Systems & Networks"],
tools:["Python","Java","HTML / CSS / JavaScript","SQL / MySQL","Git / GitHub","VS Code","React (Basics)","Cloud (AWS / Azure Basics)"],
careers:["Software Developer","Web / App Developer","QA / Test Engineer","Data Analyst","IT Support / Systems Analyst","Freelance Developer / Entrepreneur"]
},
{id:"geology-earth-sciences",name:"Geology & Earth Sciences",cluster:"pure-science",family:"geology",
desc:"Rocks, minerals, water, oceans and climate — exploring Earth for resources, hazards and environmental change.",
difficulty:3,futureScope:4,
whoSuits:"Outdoor-loving, curious students interested in minerals, mountains, oil, water and natural hazards.",
traitVector:{ScientificCuriosity:0.85,Research:0.65,SpatialThinking:0.75,EnvironmentalAwareness:0.7,PhysicalStamina:0.55,PatternRecognition:0.65,DataAnalysis:0.5,Precision:0.5,Mathematics:0.45},
coreSkills:["Mineralogy & Petrology","Structural Geology","Geophysics","Hydrogeology","Remote Sensing & GIS","Economic Geology & Exploration"],
tools:["Geological Compass & Field Tools","GIS (QGIS / ArcGIS)","Google Earth Engine","Petrographic Microscope","Seismic / Geophysical Software (Basics)","Python / R","AutoCAD","Remote Sensing Data"],
careers:["Geologist / Exploration Geologist","Hydrogeologist","Geophysicist","Environmental / Climate Scientist","Mining & Oil-gas Geoscientist","GIS / Remote Sensing Analyst"]
},
{id:"biochemistry-genetics",name:"Biochemistry, Genetics & Molecular Biology",cluster:"pure-science",family:"biochemistry",
desc:"The chemistry and genetics of life — proteins, DNA, metabolism, cell biology and the science behind modern biotech and medicine.",
difficulty:4,futureScope:5,
whoSuits:"Lab-minded students fascinated by DNA, proteins and how cells work, who enjoy research and detail.",
traitVector:{ScientificCuriosity:0.9,Research:0.85,BiologicalScience:0.9,ChemicalProcessing:0.55,Precision:0.8,DataAnalysis:0.55,PatternRecognition:0.55,Mathematics:0.4,ProblemSolving:0.6},
coreSkills:["Biochemistry & Metabolism","Molecular Biology","Genetics & Genomics","Cell Biology","Bioinformatics Basics","Laboratory Techniques (PCR, Electrophoresis)"],
tools:["PCR & Gel Electrophoresis","Spectrophotometer","Microscopy","BLAST / NCBI Tools","Python / R (Bioinformatics)","Cell-culture Equipment","ImageJ","Lab Notebooks / ELN"],
careers:["Research Scientist","Genetic / Molecular Biologist","Clinical / Diagnostic Scientist","Biopharma R&D Associate","Bioinformatics Analyst","Genetic Counsellor (with further study)"],
},
{id:"forestry-wildlife",name:"Forestry, Wildlife & Conservation",cluster:"pure-science",family:"forestry",
desc:"Protecting forests and wildlife — ecology, biodiversity, forest management, conservation policy and fieldwork.",
difficulty:3,futureScope:4,
whoSuits:"Nature-loving, outdoorsy students who care about wildlife, forests, climate and conservation.",
traitVector:{EnvironmentalAwareness:0.95,ScientificCuriosity:0.7,PhysicalStamina:0.7,Research:0.55,SocialImpact:0.65,BiologicalScience:0.6,SpatialThinking:0.5,Leadership:0.4,DataAnalysis:0.4},
coreSkills:["Forest Ecology & Silviculture","Wildlife Biology & Management","Biodiversity & Conservation","GIS & Remote Sensing","Forest Policy & Law","Climate & Community Forestry"],
tools:["GIS (QGIS / ArcGIS)","Camera Traps & Field Instruments","GPS / Drones","R / Python (Ecological Data)","Remote Sensing Data","Field Notebooks / Survey Apps","Binoculars & Field Guides","Excel"],
careers:["Forest Officer (State Forest Service)","Indian Forest Service (IFoS) Officer","Wildlife Biologist / Conservationist","Environmental / Climate Consultant","GIS & Ecology Analyst","Conservation NGO Programme Manager"]
},
{id:"marine-biology-fisheries",name:"Marine Biology & Fisheries Science",cluster:"pure-science",family:"marine-biology",
desc:"Oceans, coastal ecosystems and aquaculture — marine life, fisheries management, aquaculture and ocean conservation.",
difficulty:3,futureScope:4,
whoSuits:"Students fascinated by oceans, coasts and aquatic life, comfortable with fieldwork on boats and shores.",
traitVector:{BiologicalScience:0.85,EnvironmentalAwareness:0.85,ScientificCuriosity:0.8,Research:0.6,PhysicalStamina:0.55,FoodScience:0.35,Entrepreneurship:0.35,DataAnalysis:0.45,SocialImpact:0.45},
coreSkills:["Marine Biology & Ecology","Fisheries Science & Management","Aquaculture Technology","Oceanography","Fish Nutrition & Health","Coastal & Marine Conservation"],
tools:["Plankton Nets & Water-quality Kits","Microscopy","GIS / Remote Sensing","R / Python","Scuba / Boat Field Training (Basics)","Aquaculture Pond / Hatchery Tools","Satellite & Ocean Data","Lab Instruments"],
careers:["Marine Biologist","Aquaculture / Hatchery Manager","Fisheries Officer","Marine Conservation Scientist","Seafood Quality / Export Specialist","Aquatic Researcher"]
},
{id:"optometry",name:"Optometry & Vision Science",cluster:"medical-health",family:"optometry",
desc:"Eye examination, vision correction, contact lenses and primary eye-care — a growing health profession.",
difficulty:3,futureScope:5,
whoSuits:"Detail-oriented, caring students who enjoy science, patient interaction and precise measurement.",
traitVector:{ClinicalCare:0.7,Precision:0.85,Empathy:0.65,BiologicalScience:0.55,Communication:0.65,ScientificCuriosity:0.5,Organization:0.5,Entrepreneurship:0.45,HumanBehaviour:0.4},
coreSkills:["Ocular Anatomy & Physiology","Clinical Refraction","Contact Lens Practice","Binocular Vision","Ocular Disease Basics","Low Vision & Paediatric Optometry"],
tools:["Retinoscope & Phoropter","Slit Lamp","Auto-refractor / Keratometer","Trial Lens Sets","Tonometer & Visual-field Analyser","Fundus Camera","Contact Lens Fitting Tools","Electronic Health Records"],
careers:["Optometrist","Contact-lens / Low-vision Specialist","Clinic / Hospital Optometrist","Optical Retail / Brand Manager","Public Health / Community Eye-care Professional","Vision-care Entrepreneur"]
},
{id:"occupational-therapy",name:"Occupational Therapy (BOT)",cluster:"medical-health",family:"occupational-therapy",
desc:"Helping people regain independence in daily life after injury, illness or disability — rehabilitation, mental health and child development.",
difficulty:3,futureScope:5,
whoSuits:"Empathetic, patient students who like problem-solving and want to help people live more independently.",
traitVector:{Empathy:0.9,ClinicalCare:0.8,Communication:0.7,HumanBehaviour:0.65,ProblemSolving:0.6,Creativity:0.5,SocialImpact:0.65,Organization:0.5,PhysicalStamina:0.5,Teaching:0.4},
coreSkills:["Human Anatomy & Kinesiology","Neurorehabilitation","Paediatric Occupational Therapy","Mental-health OT","Orthotics & Assistive Devices","Ergonomics & Activity Analysis"],
tools:["Assessment Scales (FIM, Barthel, etc.)","Splinting Materials","Sensory Integration Equipment","Assistive Devices & Adaptive Tools","Therapy Software / VR Rehab Tools","Ergonomic Assessment Tools","Patient Records","Telehealth Platforms"],
careers:["Occupational Therapist","Paediatric / Developmental Therapist","Neuro-rehabilitation Specialist","Mental-health / Community OT","Ergonomics Consultant","Private Practice / Rehab Centre Founder"]
},
{id:"speech-language-audiology",name:"Speech-Language Pathology & Audiology (BASLP)",cluster:"medical-health",family:"speech-audiology",
desc:"Diagnosing and treating speech, language, voice, swallowing and hearing disorders in children and adults.",
difficulty:3,futureScope:5,
whoSuits:"Patient, communicative students who like language, science and helping people communicate and hear better.",
traitVector:{Empathy:0.85,ClinicalCare:0.75,Communication:0.85,HumanBehaviour:0.65,Precision:0.6,Teaching:0.55,ScientificCuriosity:0.5,Writing:0.4,SocialImpact:0.55,PatternRecognition:0.45},
coreSkills:["Speech & Language Development","Audiology & Hearing Assessment","Voice & Fluency Disorders","Neurological Speech Disorders","Hearing Aids & Cochlear Implants","Augmentative & Alternative Communication"],
tools:["Audiometer & Tympanometer","Speech Analysis Software (Praat)","Hearing Aids & Cochlear-implant Mapping Tools","AAC Devices","Standardised Language Tests","Video Fluoroscopy / Swallow Assessment (Basics)","Telepractice Platforms","Therapy Materials"],
careers:["Speech-Language Pathologist","Audiologist","Hearing-aid / Cochlear-implant Specialist","Special Educator / Early Intervention Specialist","Clinical Supervisor / Researcher","Private Clinic Founder"]
},
{id:"marine-engineering",name:"Marine Engineering",cluster:"mechanical",family:"marine",
desc:"Design, operation and maintenance of ship engines, propulsion and onboard systems — at sea as an engineer officer or ashore in shipyards.",
difficulty:4,futureScope:4,
whoSuits:"Students who like machines and ships, can handle discipline and long stints away from home, and want global shipping careers.",
traitVector:{MechanicalSystems:0.85,IndustrialProcess:0.5,ProblemSolving:0.7,Precision:0.65,Automation:0.45,Electronics:0.3,PhysicalStamina:0.55,Debugging:0.5,SystemsThinking:0.6,Mathematics:0.55,RiskTaking:0.35},
coreSkills:["Marine Thermodynamics","Ship Propulsion & Main Engines","Marine Auxiliary Machinery","Marine Electrical & Control Systems","Naval Architecture Basics","Ship Safety & Maritime Regulations"],
tools:["Engine-room Simulators","AutoCAD","MATLAB","Marine Diesel Engine Test Rigs","Condition Monitoring Tools","PLC / SCADA Basics","Welding & Workshop Tools","STCW Safety Training"],
careers:["Marine Engineer Officer","Chief Engineer (after sea time)","Ship Superintendent","Marine Surveyor","Offshore Engineer","Shipyard Engineer"]
},
{id:"naval-architecture-ocean",name:"Naval Architecture & Ocean Engineering",cluster:"mechanical",family:"naval",
desc:"Designing ships, boats, submarines and offshore structures — hydrodynamics, structures and stability.",
difficulty:4,futureScope:4,
whoSuits:"Students fascinated by ships, fluid mechanics and large structures who enjoy design and calculation.",
traitVector:{Mathematics:0.7,SpatialThinking:0.75,MechanicalSystems:0.6,DesignThinking:0.6,Construction:0.5,Precision:0.65,ProblemSolving:0.7,Innovation:0.5,SystemsThinking:0.65},
coreSkills:["Ship Hydrostatics & Stability","Ship Resistance & Propulsion","Ship Structures","Offshore Engineering","Fluid Mechanics","Ship Design & Shipbuilding"],
tools:["AutoCAD","Rhino / Maxsurf","ANSYS / OpenFOAM (CFD)","MATLAB","SolidWorks","ShipConstructor / NAPA","Python","Model-tank Testing"],
careers:["Naval Architect","Ship Designer","Offshore Structural Engineer","Classification Society Surveyor","Shipyard Planner","Marine Consultant"]
},
{id:"environmental-engineering",name:"Environmental Engineering",cluster:"civil",family:"environmental-eng",
desc:"Water and wastewater treatment, air-pollution control, solid-waste management and sustainable infrastructure.",
difficulty:3,futureScope:5,
whoSuits:"Students who care about pollution, water and climate, and want engineering solutions to environmental problems.",
traitVector:{EnvironmentalAwareness:0.92,ChemicalProcessing:0.5,ScientificCuriosity:0.6,SocialImpact:0.6,Research:0.5,ProblemSolving:0.7,SystemsThinking:0.65,DataAnalysis:0.5,Construction:0.45,Mathematics:0.5},
coreSkills:["Water & Wastewater Treatment","Air Pollution Control","Solid & Hazardous Waste Management","Environmental Impact Assessment","Environmental Chemistry & Microbiology","Climate & Sustainability Engineering"],
tools:["AutoCAD","GIS (QGIS / ArcGIS)","EPANET / SWMM","AERMOD","Python / R","Excel","Water-quality Test Kits","Remote Sensing Data"],
careers:["Environmental Engineer","EIA / ESG Consultant","Water Treatment Engineer","Pollution Control Officer","Sustainability Analyst","Waste-to-Energy Engineer"]
},
{id:"petroleum-engineering",name:"Petroleum Engineering",cluster:"chemical-pharma",family:"petroleum",
desc:"Exploration, drilling, reservoir and production engineering for oil and gas — and the transition toward energy and carbon management.",
difficulty:4,futureScope:3,
whoSuits:"Students who like physics, chemistry and fieldwork and are willing to work in remote locations and a changing energy sector.",
traitVector:{Mathematics:0.6,ProblemSolving:0.72,ChemicalProcessing:0.55,IndustrialProcess:0.6,MechanicalSystems:0.5,RiskTaking:0.5,PhysicalStamina:0.5,DataAnalysis:0.5,SystemsThinking:0.6,Precision:0.6},
coreSkills:["Reservoir Engineering","Drilling Engineering","Petroleum Geology","Production Engineering","Well Logging & Formation Evaluation","Fluid Flow in Porous Media"],
tools:["Petrel / Eclipse (Basics)","MATLAB","Python","Excel","Well-log Analysis Software","Drilling Simulators","AutoCAD","GIS"],
careers:["Reservoir Engineer","Drilling Engineer","Production Engineer","Petroleum Geoscientist","Well-site Engineer","Energy / Carbon-capture Engineer"]
},
{id:"biochemical-engineering",name:"Biochemical Engineering",cluster:"chemical-pharma",family:"biochemical-eng",
desc:"Applying chemical engineering to living systems — fermentation, bioprocesses, enzymes and biopharmaceutical manufacturing.",
difficulty:4,futureScope:4,
whoSuits:"Students who enjoy both chemistry and biology and want to scale lab discoveries into industrial processes.",
traitVector:{ChemicalProcessing:0.7,BiologicalScience:0.7,ScientificCuriosity:0.6,Research:0.5,IndustrialProcess:0.6,Precision:0.6,ProblemSolving:0.65,Mathematics:0.55},
coreSkills:["Bioprocess Engineering","Enzyme & Fermentation Technology","Mass & Heat Transfer","Bioreactor Design","Downstream Processing","Process Control & Biosafety"],
tools:["MATLAB","Aspen Plus","SuperPro Designer","Bioreactors / Fermenters","Chromatography Systems","Python","Excel","Lab Information Systems"],
careers:["Bioprocess Engineer","Biopharma Manufacturing Engineer","Fermentation Technologist","Quality / Validation Engineer","R&D Scientist","Biofuel Process Engineer"]
},
{id:"nanotechnology",name:"Nanotechnology",cluster:"food-material",family:"nanotech",
desc:"Engineering materials and devices at the atomic scale — nanomaterials, thin films, sensors and nano-electronics.",
difficulty:5,futureScope:4,
whoSuits:"Research-minded students fascinated by physics, chemistry and materials at the smallest scales.",
traitVector:{ScientificCuriosity:0.75,MaterialScience:0.8,Research:0.7,Precision:0.75,Innovation:0.65,Electronics:0.4,ChemicalProcessing:0.5,Mathematics:0.6},
coreSkills:["Nanomaterials Synthesis","Quantum & Solid-State Physics","Thin-film Technology","Characterisation (SEM / TEM / XRD)","Nano-electronics & Sensors","Nanomedicine Basics"],
tools:["SEM / TEM Imaging","XRD / AFM","Cleanroom Fabrication","COMSOL / Materials Studio","MATLAB","Python","Origin / OriginPro","Spectroscopy Tools"],
careers:["Nanomaterials Scientist","Semiconductor Process Engineer","R&D Engineer","Sensor / Device Engineer","Materials Characterisation Specialist","Nanotech Entrepreneur"]
},
{id:"engineering-physics",name:"Engineering Physics",cluster:"emerging",family:"engineering-physics",
desc:"Physics-heavy engineering — quantum, optics, semiconductors and computation — a flexible base for research and tech roles.",
difficulty:5,futureScope:4,
whoSuits:"Students who love physics and maths and want an engineering degree that keeps research and tech options open.",
traitVector:{Mathematics:0.85,ScientificCuriosity:0.85,Research:0.75,LogicalReasoning:0.75,ProblemSolving:0.75,Electronics:0.5,Programming:0.5,Precision:0.65,PatternRecognition:0.55,MaterialScience:0.45},
coreSkills:["Classical & Quantum Mechanics","Electromagnetics & Optics","Solid-State Physics","Computational Physics","Semiconductor Devices","Instrumentation & Measurement"],
tools:["Python","MATLAB","COMSOL","Lab Instruments (Oscilloscopes / Lasers)","LaTeX","Mathematica","Git","Origin"],
careers:["Research Scientist","Semiconductor / Photonics Engineer","Quantum Technology Engineer","Data Scientist","Instrumentation Engineer","Technology Consultant"]
},
{id:"mathematics-computing",name:"Mathematics and Computing",cluster:"computer-it",family:"math-computing",
desc:"Maths and computer science combined — algorithms, optimisation, cryptography, machine-learning theory and quantitative methods.",
difficulty:5,futureScope:5,
whoSuits:"Students strong in maths who also love coding and want quant, research or AI-heavy careers.",
traitVector:{Mathematics:0.95,Programming:0.8,LogicalReasoning:0.9,ProblemSolving:0.85,Research:0.65,DataAnalysis:0.65,PatternRecognition:0.7,Precision:0.7,SystemsThinking:0.5},
coreSkills:["Linear Algebra & Probability","Algorithms & Data Structures","Optimisation","Cryptography","Machine-learning Foundations","Numerical Methods"],
tools:["Python","C/C++","R","MATLAB","Jupyter","Git","LaTeX","SQL"],
careers:["Software Engineer","Quantitative Analyst","Data Scientist","Cryptography Engineer","ML Researcher","Operations Research Analyst"]
},
{id:"industrial-engineering",name:"Industrial Engineering",cluster:"mechanical",family:"industrial-eng",
desc:"Optimising processes, factories, supply chains and workflows — productivity, quality, operations research and ergonomics.",
difficulty:3,futureScope:4,
whoSuits:"Systems thinkers who enjoy improving how things work, using data, planning and people skills.",
traitVector:{SystemsThinking:0.8,IndustrialProcess:0.75,DataAnalysis:0.65,ProblemSolving:0.75,Mathematics:0.6,Leadership:0.45,Organization:0.65,Precision:0.55,Communication:0.45,Automation:0.45},
coreSkills:["Operations Research","Production Planning & Control","Quality Engineering & Six Sigma","Supply Chain Management","Work Study & Ergonomics","Simulation & Modelling"],
tools:["Excel / Solver","Python / R","Arena / AnyLogic","Minitab","Tableau / Power BI","SAP Basics","AutoCAD","MS Project"],
careers:["Industrial Engineer","Operations Analyst","Supply Chain Analyst","Quality / Lean Six Sigma Engineer","Process Improvement Consultant","Production Planner"]
},
{id:"renewable-energy-engineering",name:"Renewable Energy Engineering",cluster:"electrical",family:"renewable-energy",
desc:"Solar, wind, storage, grid integration and green hydrogen — engineering India’s clean-energy transition.",
difficulty:3,futureScope:5,
whoSuits:"Students who care about climate and want to build the power systems of the future.",
traitVector:{EnvironmentalAwareness:0.75,Electronics:0.5,MechanicalSystems:0.4,Mathematics:0.5,ProblemSolving:0.7,Innovation:0.65,SystemsThinking:0.7,Automation:0.4,SocialImpact:0.5,Entrepreneurship:0.4},
coreSkills:["Solar PV Systems","Wind Energy Systems","Energy Storage & Batteries","Power Electronics","Smart Grids & Grid Integration","Energy Auditing & Policy"],
tools:["MATLAB / Simulink","PVsyst","HOMER Pro","AutoCAD","Python","PLC / SCADA Basics","ETAP (Basics)","Energy Meters / Analysers"],
careers:["Solar / Wind Project Engineer","Energy Storage Engineer","Grid Integration Engineer","Energy Auditor","Green Hydrogen Engineer","Renewable Energy Consultant"]
},
{id:"geoinformatics",name:"Geoinformatics & Remote Sensing",cluster:"civil",family:"geoinformatics",
desc:"Mapping and analysing the Earth with GIS, remote sensing, GNSS and drones — used in cities, agriculture, defence and climate work.",
difficulty:3,futureScope:5,
whoSuits:"Spatial thinkers who like maps, satellites and data, and want to apply them to real-world problems.",
traitVector:{SpatialThinking:0.8,DataAnalysis:0.7,EnvironmentalAwareness:0.55,Programming:0.45,Precision:0.65,Research:0.5,Construction:0.4,PatternRecognition:0.6,SystemsThinking:0.55},
coreSkills:["Remote Sensing","GIS & Spatial Analysis","Surveying & GNSS","Photogrammetry & Drones","Cartography","Spatial Databases"],
tools:["QGIS / ArcGIS","Google Earth Engine","ERDAS / ENVI","Python (GeoPandas)","Total Station / GNSS","Drone-mapping Software","PostGIS","AutoCAD Map"],
careers:["GIS Analyst","Remote Sensing Scientist","Geospatial Data Engineer","Surveyor / Mapping Engineer","Urban / Environmental Planner","Drone-mapping Specialist"]
},
{id:"game-technology",name:"Game Technology (CSE – Gaming)",cluster:"computer-it",family:"game-tech",
desc:"Computer science for games — engines, graphics, physics, AI and real-time systems.",
difficulty:4,futureScope:4,
whoSuits:"Programmers who love games and want to build engines, tools and gameplay systems.",
traitVector:{Programming:0.85,Mathematics:0.6,Creativity:0.6,SpatialThinking:0.6,ProblemSolving:0.75,Debugging:0.7,LogicalReasoning:0.7,Innovation:0.55,VisualArts:0.35,DesignThinking:0.45},
coreSkills:["Game Engines & Architecture","Computer Graphics","Game Physics & AI","Data Structures & Algorithms","Real-time Rendering","Game Design Fundamentals"],
tools:["Unity","Unreal Engine","C++ / C#","Blender","OpenGL / Vulkan","Git","Python","Shader Languages (HLSL / GLSL)"],
careers:["Game Programmer","Graphics / Engine Programmer","Technical Artist","Gameplay Engineer","AR / VR Developer","Indie Game Developer"]
}`;

if (!content.includes('id:"fashion-design"')) {
  const branchEndMarker = "\ncareers:['Agricultural Officer','Agri-business Manager','Plant Breeder','Agri-tech Entrepreneur','Soil / Crop Scientist','Agricultural Extension Officer']\n}\n];";
  const branchEndReplace = "\ncareers:['Agricultural Officer','Agri-business Manager','Plant Breeder','Agri-tech Entrepreneur','Soil / Crop Scientist','Agricultural Extension Officer']\n}" + newBranchesCode + "\n];";
  content = content.replace(branchEndMarker, branchEndReplace);
  console.log('Added 35 new branches to BRANCHES');
}

// 3. Add 23 new roadmaps if missing
const newRoadmapsCode = `,"fashion-design":{
  whyFits:"Fashion Design fits you because you see clothes as a way to tell stories — you enjoy colour, fabric, sketching and turning ideas into wearable pieces.",
  entryRoute:"Class 12 (any stream) → B.Des Fashion Design via the NIFT entrance exam, or institute entrance (studio test / portfolio) at Pearl, Symbiosis SID, MIT-ID, JD, Srishti, IIAD → internships → own label or brand job.",
  yearByYear:[
    {year:'Year 1',items:["Design Fundamentals","Fashion Illustration","Colour Theory","Textile Science","Basic Pattern Making","Design History & Culture"]},
    {year:'Year 2',items:["Draping & Garment Construction","Fashion CAD (Illustrator / Photoshop)","Surface Ornamentation & Embroidery","Trend Research","Apparel Production Basics","Fashion Communication"]},
    {year:'Year 3',items:["Collection Design","Advanced Pattern Making","Styling & Fashion Photography","Brand & Retail Management","Internship at Label / Export House","Sustainable Fashion"]},
    {year:'Year 4',items:["Final Collection / Design Thesis","Portfolio & Showcase","Fashion Business & Merchandising","Professional Practice","Specialisation (Womenswear / Menswear / Accessories / Costume)","Placement Preparation"]}
  ],
  coreSubjects:["Fashion Illustration","Pattern Making & Draping","Garment Construction","Textile & Fabric Knowledge","Trend Forecasting","Styling & Merchandising"],
  tools:["Sketchbook & Illustration Tools","Adobe Illustrator","Photoshop","CLO 3D / Browzwear","CorelDRAW","Industrial Sewing Machines","Dress Forms","Portfolio on Behance / Instagram"],
  projects:["Design a 6-piece capsule collection with sketches and toiles","Create a sustainable garment from upcycled textiles","Style and shoot a lookbook with a photographer","Develop a tech pack ready for production","Launch a small online label with a brand story and first drop"],
  internshipStrategy:"Intern with designers, export houses, boutiques and costume departments. Build a portfolio of finished garments, not just sketches.",
  skillMilestones:["Year 1: Sketching, fabric and pattern fundamentals","Year 2: Construction and CAD skills","Year 3: First collection and industry internship","Year 4: Final collection, showcase and portfolio","Career: Assistant Designer → Designer → Design Head / Own Label"],
  careerPaths:["Fashion Designer","Fashion Stylist","Costume Designer","Fashion Merchandiser","Technical Designer / Pattern Maker","Fashion Entrepreneur"],
  topRecruiters:["Arvind / Raymond / Aditya Birla Fashion","Myntra / AJIO / Nykaa Fashion Design Teams","Export Houses","Designer Labels","Fabindia / Biba / W","Film & OTT Costume Departments","Premium & Luxury Brands","Own Label / Startups"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-20 LPA | Senior: ₹25 LPA+ (design heads / own label). Pay varies widely by brand and city; figures are approximate.",
  higherEd:["M.Des / MFM (NIFT)","MA Fashion Design (UAL / Polimoda / Parsons)","MBA in Fashion / Luxury Management","Costume or Textile Design Specialisation"],
  futureTrends:["Sustainable and circular fashion","3D / digital fashion (CLO 3D)","Direct-to-consumer and social-commerce brands","Handloom and craft revival","AI-assisted trend forecasting"],
  risks:["Highly competitive; success depends on portfolio and network","Entry pay can be low at smaller labels","Fast-changing trends and fast-fashion pressure","Own-label ventures need capital and business skills"],
  actionPlan:["Sketch daily and keep a design journal","Learn basic sewing and pattern making early","Build a portfolio with finished garments","Prepare for NIFT and institute studio tests","Intern with a designer or export house by Year 2"]
},
"jewellery-design":{
  whyFits:"Jewellery Design fits you because you enjoy fine detail, craft and materials, and want to turn small ideas into pieces people treasure.",
  entryRoute:"Class 12 (any stream) → B.Des (Jewellery / Accessory Design) at NIFT (Accessory Design), Pearl, Symbiosis SID, MIT-ID, IIGJ, Srishti or NID (via NID DAT) → gemmology certificates (GIA / IGI) → studio or brand roles.",
  yearByYear:[
    {year:'Year 1',items:["Design Fundamentals","Drawing & Rendering","Metals & Materials","Introduction to Gemmology","Art & Jewellery History","Basic Bench Skills"]},
    {year:'Year 2',items:["Jewellery Illustration","Jewellery CAD (Rhino / Matrix)","Stone Setting","Wax Carving & Casting","Colour & Gem Identification","Trend Research"]},
    {year:'Year 3',items:["Collection Design","3D Printing for Jewellery","Costing & Production","Fine & Fashion Jewellery Studios","Internship at Jeweller / Studio","Branding & Packaging"]},
    {year:'Year 4',items:["Final Collection / Thesis","Portfolio & Exhibition","Retail & Luxury Business","Professional Practice","Specialisation (Bridal / Contemporary / Gem-focused)","Placement Preparation"]}
  ],
  coreSubjects:["Jewellery Illustration","3D CAD Modelling","Gemmology Basics","Metalsmithing & Casting","Trend & Luxury Branding","Costing & Production"],
  tools:["Rhino / Matrix (Jewellery CAD)","Adobe Illustrator","Photoshop","Gem Testing Instruments","Bench Tools & Casting Equipment","3D Printers (Wax / Resin)","KeyShot Rendering","Portfolio Website"],
  projects:["Design and fabricate a 5-piece contemporary jewellery collection","Model and 3D-print a ring series in CAD","Create a costed production plan for a pendant line","Build a brand identity and packaging for a jewellery label","Present a gemstone grading case study"],
  internshipStrategy:"Intern with jewellery houses, CAD studios and gem labs; learn costing and production alongside design.",
  skillMilestones:["Year 1: Drawing, metals and bench skills","Year 2: CAD and casting","Year 3: Collection and internship","Year 4: Final collection and portfolio","Career: Designer → Senior Designer → Design Head / Own Brand"],
  careerPaths:["Jewellery Designer","CAD Jewellery Modeller","Gemmologist / Gem Grader","Accessory Designer","Brand / Collection Manager","Jewellery Entrepreneur"],
  topRecruiters:["Tanishq / Titan","Kalyan / Malabar / Joyalukkas Design Teams","CaratLane / BlueStone","Gitanjali / Export Jewellery Houses","Heritage & Luxury Jewellers","CAD & Casting Studios","Gem Labs (GIA / IGI)","Own Label / Startups"],
  salaryDirection:"Starting: ₹3-5 LPA | Mid-career: ₹7-15 LPA | Senior: ₹20 LPA+ (design heads / own label). Skilled CAD modellers and gemmologists often earn more; figures are approximate.",
  higherEd:["M.Des (Accessory / Product Design)","GIA Graduate Gemologist","MA Jewellery Design (Birmingham City / RCA)","MBA in Luxury Management"],
  futureTrends:["Lab-grown diamonds and new materials","3D-printed and CAD-first jewellery","Personalised and gender-neutral pieces","Online-first jewellery brands","Traceable and ethical sourcing"],
  risks:["Commodity (gold) price swings affect businesses","Small, relationship-driven industry","Tools and materials are costly to practise with","Hand skills take time to build"],
  actionPlan:["Practise precise drawing and rendering","Learn Rhino or Matrix early","Take a basic gemmology course","Visit workshops and karigar studios","Build a portfolio with finished pieces"]
},
"industrial-product-design":{
  whyFits:"Industrial & Product Design fits you because you like making things people use — combining sketching, building and problem-solving.",
  entryRoute:"Class 12 (any stream) → B.Des Industrial / Product Design via UCEED (IIT Bombay IDC, IIT Guwahati, IIT Delhi, IIT Hyderabad, IIITDM) or NID DAT; also MIT-ID, Symbiosis SID, Srishti, UID, IIAD, CEPT → M.Des / industry.",
  yearByYear:[
    {year:'Year 1',items:["Design Fundamentals","Drawing & Rendering","Form & Visualisation","Materials & Workshop Practice","Design History","Digital Tools (Illustrator / Photoshop)"]},
    {year:'Year 2',items:["Product Sketching & Rendering","3D CAD (SolidWorks / Fusion 360)","Ergonomics","Manufacturing Processes","Model Making & Prototyping","Design Research Methods"]},
    {year:'Year 3',items:["Product Design Studio","Interaction & UX Basics","Design for Manufacture","Sustainable Design","Internship at Design Studio / Product Company","Design Strategy"]},
    {year:'Year 4',items:["Design Thesis / Capstone","Advanced Prototyping","Design Management","Portfolio & Showcase","Specialisation (Auto / Furniture / Consumer / Medical)","Placement Preparation"]}
  ],
  coreSubjects:["Product Sketching & Rendering","3D Modelling & CAD","Materials & Manufacturing Processes","Ergonomics & Human Factors","Prototyping","Design Research & Strategy"],
  tools:["Fusion 360 / SolidWorks","Rhino","KeyShot","Adobe Illustrator / Photoshop","Blender","3D Printers","Workshop Tools (Wood / Metal / Foam)","Figma (Basics)"],
  projects:["Redesign an everyday object with user research and prototypes","Design a product for older users and test usability","Model and render a consumer product in CAD","Build a working functional prototype","Create a sustainable packaging-plus-product concept"],
  internshipStrategy:"Intern with design consultancies, auto and appliance makers, and startups. Keep a process-driven portfolio showing research, sketches and prototypes.",
  skillMilestones:["Year 1: Drawing and form skills","Year 2: CAD and prototyping","Year 3: Studio projects and internship","Year 4: Thesis and portfolio","Career: Designer → Senior Designer → Design Lead / Head"],
  careerPaths:["Industrial Designer","Product Designer","Design Researcher","Automotive / Transportation Designer","Furniture / Lifestyle Designer","Design Strategist"],
  topRecruiters:["Titan / Godrej / Tata Design Teams","Mahindra / TVS / Royal Enfield / Hero Design","Samsung / LG / Philips India","Design Consultancies (Elephant Design, Design Directions)","Furniture & Lifestyle Brands","Healthcare Device Companies","Startups & Hardware Product Teams","Global Design Firms"],
  salaryDirection:"Starting: ₹4-9 LPA | Mid-career: ₹10-25 LPA | Senior: ₹30 LPA+ (design leads / studio heads). Auto and tech firms pay at the higher end; figures are approximate.",
  higherEd:["M.Des (IIT IDC / NID / IISc CPDM)","MA Industrial / Transportation Design (RCA / Umeå style programmes abroad)","Design Management / Strategy","MS Human-Computer Interaction"],
  futureTrends:["Sustainable and circular product design","Design for EVs and mobility","Consumer hardware and IoT products","AI-assisted ideation and rendering","Design for accessibility"],
  risks:["Portfolio and studio-entrance competition","Prototyping tools and materials cost money","Roles overlap with UX and engineering","Smaller design market than software"],
  actionPlan:["Sketch objects daily and take things apart","Learn one CAD tool well","Prepare for UCEED and NID DAT","Build 3 process-rich portfolio projects","Join a maker space or workshop"]
},
"photography-cinematography":{
  whyFits:"Photography & Cinematography fits you because you think in frames — you enjoy light, composition and telling stories without words.",
  entryRoute:"Class 12 (any stream) → BFA / B.Des / B.Sc. Photography, or film-school routes (FTII and SRFTI via their entrance exams for cinematography; NID Photography Design via NID DAT; AJK MCRC, Whistling Woods, Symbiosis SIMC via entrance) → assistant roles.",
  yearByYear:[
    {year:'Year 1',items:["Fundamentals of Photography","Visual Design & Composition","Camera Operation","Light & Exposure","Digital Editing (Lightroom / Photoshop)","Visual Culture"]},
    {year:'Year 2',items:["Studio & Portrait Photography","Lighting Techniques","Documentary Photography","Videography Basics","Colour Management","Photo Editing & Retouching"]},
    {year:'Year 3',items:["Cinematography","Commercial & Advertising Photography","Video Editing & Grading","Internship with Photographer / Production House","Photo-essay & Visual Journalism","Business of Photography"]},
    {year:'Year 4',items:["Final Portfolio / Film Project","Advanced Cinematography","Specialisation (Fashion / Wildlife / Documentary / Film)","Professional Practice","Exhibition / Showreel","Placement Preparation"]}
  ],
  coreSubjects:["Camera & Exposure Craft","Lighting Design","Composition & Visual Storytelling","Cinematography Techniques","Photo / Video Editing & Colour Grading","Visual Storytelling for Brands"],
  tools:["DSLR / Mirrorless Cameras","Cine Lenses & Gimbals","Lighting & Grip Equipment","Adobe Lightroom / Photoshop","DaVinci Resolve / Premiere Pro","Drone Camera (DGCA rules)","Sound Recording Basics","Portfolio Website / Instagram"],
  projects:["Shoot a documentary photo-essay on a local story","Light and shoot a product catalogue","Create a 3-minute short film as DoP","Build a portrait series with controlled lighting","Colour-grade a short film in DaVinci Resolve"],
  internshipStrategy:"Assist working photographers and DoPs, join production houses and agencies, and shoot constantly. A strong showreel and portfolio matter more than the degree.",
  skillMilestones:["Year 1: Camera and light fundamentals","Year 2: Studio, lighting and video basics","Year 3: Assisting on real shoots","Year 4: Final portfolio / showreel","Career: Assistant → Photographer / DoP → Specialist / Studio Owner"],
  careerPaths:["Photographer","Cinematographer / DoP","Photojournalist","Commercial / Fashion Photographer","Video Editor / Colourist","Content Creator / Visual Producer"],
  topRecruiters:["Advertising Agencies","Production Houses & OTT Platforms","News & Magazine Publications","Fashion & E-commerce Studios","Wedding & Event Photography Studios","Travel / Wildlife Brands","Brand Content Teams","Freelance Clients"],
  salaryDirection:"Starting: ₹2.5-5 LPA | Mid-career: ₹6-15 LPA | Senior: ₹20 LPA+ (established DoPs / studio owners). Income is project-based and varies widely; figures are approximate.",
  higherEd:["M.Des / MA Visual Communication","PG Cinematography (FTII / SRFTI)","MFA Photography / Film (abroad)","Film Editing / Colour Grading Courses"],
  futureTrends:["Short-form video and branded content","Drone and virtual-production cinematography","AI-assisted editing and retouching","E-commerce and product photography growth","Documentary and OTT storytelling"],
  risks:["Income is irregular, especially early on","Equipment is expensive","Mobile cameras and AI tools raise competition","Long hours and physically demanding shoots"],
  actionPlan:["Shoot every day and review your work critically","Learn lighting before buying expensive gear","Build a niche portfolio","Assist professionals as early as Year 1","Prepare for FTII / NID entrance if aiming for film"]
},
"music-production-sound":{
  whyFits:"Music Production & Sound Design fits you because you listen closely, love building sound from scratch, and want to shape how stories and songs feel.",
  entryRoute:"Class 12 (any stream; music ability helps) → B.Sc. / BA / B.Voc in Music Production or Sound Engineering at KM Music Conservatory, Whistling Woods, FTII and SRFTI (sound), SAE-type institutes, Symbiosis, Manipal → studio assistant roles.",
  yearByYear:[
    {year:'Year 1',items:["Music Theory & Ear Training","Fundamentals of Acoustics","Introduction to DAWs","Basic Recording","Audio Electronics Basics","Music History & Industry"]},
    {year:'Year 2',items:["Mixing Techniques","Sound Synthesis","Music Arrangement","Studio Recording Sessions","MIDI & Sampling","Sound for Picture Basics"]},
    {year:'Year 3',items:["Mastering","Sound Design & Foley","Game Audio (Wwise / FMOD)","Live Sound Engineering","Internship at Studio / Post House","Music Business & Rights"]},
    {year:'Year 4',items:["Final Album / Soundtrack Project","Advanced Mixing & Mastering","Specialisation (Film / Game / Live / Electronic)","Professional Practice","Portfolio & Showreel","Placement Preparation"]}
  ],
  coreSubjects:["Music Theory & Arrangement","Recording & Mixing","Mastering","Sound Design & Foley","Acoustics & Studio Setup","Audio for Film & Games"],
  tools:["Ableton Live / Logic Pro / Pro Tools","Studio Monitors & Microphones","Audio Interfaces","Synths & Samplers","iZotope / Plugins","MIDI Controllers","Wwise / FMOD (Game Audio)","DaVinci Resolve (Audio Post)"],
  projects:["Produce and mix a 4-track EP","Design the full sound for a short film","Create adaptive audio for a small game prototype","Record and mix a live band session","Master a track for streaming platforms"],
  internshipStrategy:"Assist at recording studios, post-production houses and live-event companies. Build a showreel of mixes and sound designs.",
  skillMilestones:["Year 1: Ear training and DAW basics","Year 2: Recording and mixing","Year 3: Sound design and internship","Year 4: Final project and showreel","Career: Assistant Engineer → Engineer / Producer → Senior Sound Designer"],
  careerPaths:["Music Producer","Sound Designer","Mix / Mastering Engineer","Film & Game Audio Designer","Live Sound Engineer","Composer / Arranger"],
  topRecruiters:["Film & OTT Post-production Houses","Music Labels & Streaming Companies","Game Studios","Advertising Agencies","Live-event & Concert Companies","Recording Studios","YouTube / Podcast Networks","Freelance Clients"],
  salaryDirection:"Starting: ₹2.5-5 LPA | Mid-career: ₹6-15 LPA | Senior: ₹20 LPA+ (established producers / sound designers). Income is project-based; figures are approximate.",
  higherEd:["M.A. / M.Sc. Music Technology","PG Sound Recording & Design (FTII / SRFTI)","MFA Sound Design / Music Production (abroad)","Audio Engineering Certifications (Avid, Dolby)"],
  futureTrends:["Immersive audio (Dolby Atmos)","Game and interactive audio growth","Independent music and creator economy","AI-assisted music tools","Podcasts and audio storytelling"],
  risks:["Irregular, project-based income","Gear and software costs","Crowded creator market","Needs both technical and musical skill"],
  actionPlan:["Learn one DAW deeply","Train your ear daily","Build a mix-and-sound showreel","Network with indie artists and filmmakers","Study acoustics and signal flow basics"]
},
"urban-planning-landscape":{
  whyFits:"Urban Planning fits you because you see cities as systems — streets, homes, parks and people — and want to design them to work better.",
  entryRoute:"Class 12 (PCM preferred) → B.Plan (SPA Delhi / Bhopal / Vijayawada via JEE Main Paper 2; CEPT via entrance) or B.Arch → M.Plan / M.Urban Design (IITs, SPA, CEPT); landscape through B.Arch + M.L.Arch.",
  yearByYear:[
    {year:'Year 1',items:["Design Fundamentals","Drawing & Graphics","Introduction to Planning","Mathematics & Statistics","History of Settlements","Basic Surveying"]},
    {year:'Year 2',items:["Planning Studio I","GIS & Remote Sensing","Urban Sociology","Transport Systems","Housing Studies","Environmental Studies"]},
    {year:'Year 3',items:["Urban Design Studio","Infrastructure Planning","Land-use & Planning Law","Landscape Planning","Internship at Planning Firm / Municipality","Urban Economics"]},
    {year:'Year 4',items:["Thesis / Capstone Plan","Smart & Sustainable Cities","Regional Planning","Project Management","Specialisation (Transport / Housing / Landscape / Environment)","Placement Preparation"]}
  ],
  coreSubjects:["Urban Design & Planning Studio","GIS & Spatial Analysis","Transport & Infrastructure Planning","Housing & Land-use Policy","Landscape Design","Environmental Planning"],
  tools:["AutoCAD","QGIS / ArcGIS","SketchUp / Revit","Adobe Illustrator / Photoshop","Rhino / Grasshopper (Basics)","Python (Spatial Data Basics)","Google Earth Engine","Public Consultation Tools"],
  projects:["Prepare a neighbourhood redevelopment plan with community input","Map and analyse transport accessibility using GIS","Design a public park or street-scape","Draft a housing-policy brief for a city","Create a climate-resilience plan for a coastal or flood-prone area"],
  internshipStrategy:"Intern with planning consultancies, municipal corporations, urban labs and NGOs. Build a portfolio mixing plans, maps and policy notes.",
  skillMilestones:["Year 1: Design, drawing and planning basics","Year 2: GIS, transport and housing","Year 3: Studios and internship","Year 4: Thesis and portfolio","Career: Planner → Senior Planner → Urban Lead / Consultant"],
  careerPaths:["Urban Planner","Landscape Architect","Transport Planner","Smart-city / Infrastructure Consultant","Housing & Policy Analyst","Environmental Planner"],
  topRecruiters:["Urban Development Authorities & Municipal Corporations","Smart City Missions","Planning & Architecture Consultancies","Infrastructure & Real Estate Firms","World Bank / UN-Habitat / Multilateral Projects","Think Tanks (WRI India, CSE)","Environmental Consultancies","NGOs & Research Institutes"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-18 LPA | Senior: ₹25 LPA+ (consultancy leads / international roles). Public-sector pay follows government scales; figures are approximate.",
  higherEd:["M.Plan / M.Urban Design (IIT Kharagpur / Roorkee, SPA, CEPT)","MSc Urban Planning / City Design (UCL / MIT / TU Dortmund)","MLA (Landscape Architecture)","Master of Public Policy"],
  futureTrends:["Climate-resilient and sustainable cities","Transit-oriented and 15-minute-city planning","Smart-city data and digital twins","Affordable-housing policy","Nature-based urban design"],
  risks:["Public-sector decisions move slowly","Fewer dedicated planning jobs than in architecture","Policy and politics shape outcomes","Needs a master’s for senior roles"],
  actionPlan:["Learn GIS early","Study your own city’s master plan","Build a portfolio of maps and plans","Prepare for SPA / CEPT / JEE Paper 2","Read urban-policy journals and case studies"]
},
"culinary-arts":{
  whyFits:"Culinary Arts fits you because you think with your hands and palate — you want to create food, lead a kitchen and maybe build your own brand.",
  entryRoute:"Class 12 (any stream) → B.Sc. Hospitality / Culinary Arts via NCHM JEE (IHMs and the Indian Culinary Institute), or institute entrance at WGSHA Manipal, OCLD, Culinary Academy of India, IIHM, and private universities → kitchen trainee programmes.",
  yearByYear:[
    {year:'Year 1',items:["Basic Cookery & Kitchen Hygiene","Food Science Basics","Bakery Fundamentals","Indian Cuisine I","Food & Beverage Service Basics","Communication Skills"]},
    {year:'Year 2',items:["Indian Cuisine II (Regional)","Continental & Asian Cuisines","Patisserie & Confectionery","Menu Planning & Costing","Food Safety (FSSAI / HACCP)","Industrial Training Preparation"]},
    {year:'Year 3',items:["Industrial Training in Hotel / Restaurant Kitchen","Advanced Garde Manger","Kitchen Management","Nutrition & Dietetics Basics","Food Photography & Styling","Entrepreneurship in Food"]},
    {year:'Year 4',items:["Advanced Culinary Techniques","Banquet & Large-scale Cooking","Food Business Plan","Specialisation (Bakery / Fine Dining / Cloud Kitchen / Product Development)","Competitions & Portfolio","Placement Preparation"]}
  ],
  coreSubjects:["Culinary Techniques","Indian & International Cuisines","Bakery & Patisserie","Menu Planning & Costing","Kitchen Management","Food Safety & Hygiene (FSSAI / HACCP)"],
  tools:["Professional Kitchen Equipment","Knife Skills & Mise en Place","Pastry & Bakery Tools","Costing Spreadsheets (Excel)","POS / Inventory Software","HACCP Documentation","Food Photography","Social Media / Portfolio"],
  projects:["Design and cost a 5-course tasting menu","Run a pop-up dinner for 30 guests","Develop and test a packaged food product","Create a cloud-kitchen business plan","Document regional recipes with photography"],
  internshipStrategy:"Train in busy hotel and restaurant kitchens across sections (garde manger, bakery, hot kitchen). Enter chef competitions and build a visual portfolio.",
  skillMilestones:["Year 1: Knife skills, basic cooking and hygiene","Year 2: Cuisines, bakery and costing","Year 3: Hotel kitchen training","Year 4: Specialisation and business plan","Career: Commis → Chef de Partie → Sous Chef → Executive Chef / Owner"],
  careerPaths:["Chef / Sous Chef","Pastry & Bakery Chef","Executive Chef","Food Stylist / Content Creator","Restaurant / Cloud-kitchen Owner","Food Product Developer"],
  topRecruiters:["Taj / Oberoi / ITC / Marriott Kitchens","Cruise Lines","Restaurant Groups & Cloud Kitchens","Airline Catering (Taj SATS, Oberoi Flight Kitchens)","Bakery & Food Brands","QSR Chains","Event & Catering Companies","Own Restaurant / Café"],
  salaryDirection:"Starting: ₹2.5-4.5 LPA | Mid-career: ₹6-14 LPA | Senior: ₹18 LPA+ (executive chefs, abroad or cruise roles pay more). Entry pay is modest; figures are approximate.",
  higherEd:["MBA / PG in Hospitality or Food Business","Advanced Culinary Diplomas (Le Cordon Bleu / CIA / ALMA)","Food Technology / Product Development","Sommelier or Specialty Certifications"],
  futureTrends:["Cloud kitchens and food delivery","Plant-based and sustainable food","Regional Indian cuisine revival","Packaged and D2C food brands","Food content and creator culture"],
  risks:["Long, physically demanding hours","Low entry pay in many kitchens","Restaurants have high failure rates","Career progress depends on kitchen reputation"],
  actionPlan:["Cook and document every week","Learn knife skills and basic costing early","Train in a real kitchen as soon as possible","Build a food portfolio on Instagram","Plan a niche before starting your own venture"]
},
"digital-marketing":{
  whyFits:"Digital Marketing fits you because you enjoy understanding what people click on, writing and testing ideas, and seeing real results from your work.",
  entryRoute:"Class 12 (any stream) → BBA / BMS / B.Com / BA Mass Communication with digital-marketing specialisation (NMIMS, Symbiosis, Christ, MICA short programmes) + Google / Meta / HubSpot certifications → agency or in-house roles.",
  yearByYear:[
    {year:'Year 1',items:["Principles of Marketing","Business Communication","Consumer Behaviour","Statistics for Business","Introduction to Digital Media","Writing for the Web"]},
    {year:'Year 2',items:["SEO & Content Marketing","Social Media Marketing","Google Ads & Meta Ads","Web Analytics","Email Marketing","Brand Management"]},
    {year:'Year 3',items:["Marketing Automation & CRM","Performance Marketing","Influencer & Community Marketing","Data Visualisation","Internship at Agency / Startup","E-commerce Marketing"]},
    {year:'Year 4',items:["Marketing Strategy Capstone","Growth Marketing","Digital Brand Campaign Project","Marketing Ethics & Privacy","Specialisation (SEO / Paid / Social / Analytics)","Placement Preparation"]}
  ],
  coreSubjects:["SEO & Content Marketing","Performance Advertising (Google / Meta)","Social Media & Community Strategy","Marketing Analytics","Email & Marketing Automation","Branding & Copywriting"],
  tools:["Google Analytics / Search Console","Google Ads / Meta Ads Manager","SEMrush / Ahrefs","Canva / Adobe Express","HubSpot / Mailchimp","Hootsuite / Buffer","ChatGPT-style AI Tools","Looker Studio"],
  projects:["Grow a niche social page and document the results","Run a small paid campaign with a budget and report ROI","Audit and improve SEO for a local business website","Build a 90-day content calendar and measure performance","Create a growth plan for a startup product"],
  internshipStrategy:"Intern at digital agencies, D2C brands and startups; run real campaigns and track results. Certifications plus a results-based portfolio help.",
  skillMilestones:["Year 1: Marketing basics and writing","Year 2: SEO, social and paid ads","Year 3: Analytics, automation and internships","Year 4: Strategy capstone and portfolio","Career: Executive → Manager → Head of Growth / Digital"],
  careerPaths:["Digital Marketing Manager","SEO / Content Strategist","Performance Marketer","Social Media Manager","Growth Marketer","Influencer / Brand Partnerships Manager"],
  topRecruiters:["Digital & Performance Agencies (Dentsu, WPP, Interactive Avenues)","D2C Brands (Mamaearth, boAt, Nykaa)","E-commerce (Amazon, Flipkart, Myntra)","SaaS & Tech Startups","Media & OTT Platforms","Banks & Fintech Apps","EdTech Companies","Freelance / Own Agency"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-18 LPA | Senior: ₹25 LPA+ (growth / marketing heads). Performance marketers with proven results earn at the higher end; figures are approximate.",
  higherEd:["MBA (Marketing / Digital Business)","PG in Digital Marketing / Brand Management","MS Marketing Analytics (abroad)","Certifications (Google, Meta, HubSpot)"],
  futureTrends:["AI-assisted content and ad creative","Creator and community-led marketing","Privacy changes and first-party data","Short-form video and social commerce","Marketing automation and personalisation"],
  risks:["Platforms and algorithms change constantly","Entry-level roles are crowded","Results pressure and budget cuts hit marketing first","AI tools may automate routine tasks"],
  actionPlan:["Run a real project from Year 1","Learn analytics, not just content","Collect Google and Meta certifications","Specialise in one channel then broaden","Document measurable results in a portfolio"]
},
"tourism-travel-management":{
  whyFits:"Tourism Management fits you because you love people and places, and want to turn travel into smooth, memorable experiences.",
  entryRoute:"Class 12 (any stream) → BBA / BA / B.Sc. Tourism & Travel Management (IITTM Gwalior / Noida / Nellore, Christ, Symbiosis, Amity, Pondicherry University, DU colleges, IHMs) → travel industry roles; MBA Tourism later.",
  yearByYear:[
    {year:'Year 1',items:["Fundamentals of Tourism","Business Communication","Geography of Travel","Principles of Management","Economics for Tourism","Foreign Language I"]},
    {year:'Year 2',items:["Tour Operations","Travel Agency Management","Tourism Marketing","Destination Planning","Hospitality Basics","Foreign Language II"]},
    {year:'Year 3',items:["Travel Technology (GDS / CRS)","Event & MICE Management","Heritage & Cultural Tourism","Eco / Sustainable Tourism","Internship at Travel Company","Customer Experience"]},
    {year:'Year 4',items:["Tourism Policy & Law","Entrepreneurship in Travel","Destination Project","Specialisation (Adventure / Heritage / MICE / Luxury)","Industry Capstone","Placement Preparation"]}
  ],
  coreSubjects:["Tour Operations & Itinerary Design","Destination & Heritage Management","Travel Technology (GDS / Booking)","Tourism Marketing","Customer Service & Hospitality","Sustainable & Eco-tourism"],
  tools:["Amadeus / Sabre (GDS)","Booking Engines & OTAs","Google Maps / Trip Planning Tools","Canva / Social Media","CRM Tools","Excel / Costing","Foreign Language Skills","Photography & Storytelling"],
  projects:["Design a 7-day itinerary with costing for a niche destination","Create a destination marketing plan for a heritage site","Plan an end-to-end corporate MICE event","Build a travel content page and grow it","Develop an eco-tourism concept for a village"],
  internshipStrategy:"Intern with tour operators, hotels, airlines and tourism boards. Learn a foreign language and build real itineraries and travel content.",
  skillMilestones:["Year 1: Tourism fundamentals and language","Year 2: Tour operations and marketing","Year 3: Technology and internship","Year 4: Specialisation and capstone","Career: Executive → Manager → Head of Operations / Own Travel Brand"],
  careerPaths:["Tour Operator / Travel Consultant","Destination Manager","Travel Content Creator","Airline / Airport Customer Services","Event & MICE Planner","Eco / Heritage Tourism Manager"],
  topRecruiters:["Tour Operators (Thomas Cook, SOTC, Kuoni)","OTAs (MakeMyTrip, Cleartrip, Yatra)","Airlines & Airports","Hotels & Resorts","State Tourism Boards","Event & MICE Companies","Adventure / Eco-tourism Companies","Own Travel Company"],
  salaryDirection:"Starting: ₹2.5-4.5 LPA | Mid-career: ₹6-12 LPA | Senior: ₹15 LPA+ (operations heads / own brand). Pay is demand-sensitive; figures are approximate.",
  higherEd:["MBA Tourism & Travel Management","MA Heritage / Cultural Management","International Tourism / Hospitality Masters (abroad)","Aviation / Airline Management Certifications"],
  futureTrends:["Experiential, wellness and sustainable travel","Domestic tourism growth","Online booking and travel tech","Heritage and rural tourism","Workation and digital-nomad travel"],
  risks:["Travel is cyclical and sensitive to shocks","Many entry roles are low-paid","Online platforms squeeze agents’ margins","Seasonal demand in some roles"],
  actionPlan:["Learn a foreign language","Practise itinerary planning and costing","Intern with a tour operator early","Build a travel content portfolio","Learn at least one booking system (GDS)"]
},
"aviation-airport-management":{
  whyFits:"Aviation Management fits you because you enjoy service, structure and the energy of airports — and want a career around flying without being the pilot.",
  entryRoute:"Class 12 (any stream) → BBA / B.Sc. Aviation Management / Aviation Hospitality (UPES, Amity, SRM, HITS, Symbiosis, LPU, Christ, specialised aviation institutes) → airline / airport roles; IATA certifications help.",
  yearByYear:[
    {year:'Year 1',items:["Introduction to Aviation Industry","Business Communication","Principles of Management","Aviation Geography","Personality Development & Grooming","English & Foreign Language"]},
    {year:'Year 2',items:["Airline Operations","Airport Operations & Ground Handling","Aviation Safety & Regulations","Customer Service Excellence","Air Cargo Basics","Travel & Tourism Fundamentals"]},
    {year:'Year 3',items:["Airline Revenue & Network Management","Aviation Security & Emergency Handling","Airport Planning & Management","Internship at Airline / Airport","Aviation Logistics","Cabin Services"]},
    {year:'Year 4',items:["Aviation Business Strategy","Aviation Law & Policy","Capstone Project","Specialisation (Airline / Airport / Cargo / Cabin)","IATA Certifications","Placement Preparation"]}
  ],
  coreSubjects:["Airline & Airport Operations","Ground Handling & Passenger Services","Aviation Safety & Regulations (DGCA / ICAO)","Cargo & Air Logistics","Customer Service & Grooming","Aviation Business & Revenue Management"],
  tools:["Reservation Systems (Amadeus / Sabre)","Airline Ground-handling Software","Excel / Reporting Tools","Safety Management Systems","CRM Tools","IATA Course Materials","Communication & Presentation Skills","Foreign Language Skills"],
  projects:["Map passenger flow at an airport and propose improvements","Build a turnaround-time plan for a flight","Prepare a route-profitability analysis","Design a customer-service training module for ground staff","Create an aviation-safety awareness campaign"],
  internshipStrategy:"Intern with airlines, ground-handling companies and airports. Aviation hiring values communication, grooming and professional certifications.",
  skillMilestones:["Year 1: Industry basics and communication","Year 2: Airline and airport operations","Year 3: Internship and safety","Year 4: Specialisation and certifications","Career: Executive → Supervisor → Duty / Station Manager"],
  careerPaths:["Airport Operations Executive","Ground Handling / Customer Service Executive","Cabin Crew","Airline Revenue / Network Analyst","Aviation Cargo / Logistics Executive","Airline / Airport Manager"],
  topRecruiters:["IndiGo / Air India / Vistara-Air India Group / Akasa Air","Airports (Delhi, Mumbai, Bengaluru, Hyderabad Operators)","Ground Handlers (Celebi, AIATSL, Bird Group)","Air Cargo & Logistics Firms","Aviation Training Academies","Travel & Charter Companies","Airport Retail & Services","Consulting Firms"],
  salaryDirection:"Starting: ₹2.5-5 LPA | Mid-career: ₹6-15 LPA | Senior: ₹20 LPA+ (airline / airport managers). Pay depends on airline and role; figures are approximate.",
  higherEd:["MBA Aviation / Airport Management","PG in Airline & Airport Management","IATA / ICAO Certifications","MSc Air Transport Management (Cranfield / Coventry style programmes abroad)"],
  futureTrends:["India’s rapid fleet and airport expansion","Digital and biometric airport services","Air-cargo and e-commerce logistics","Sustainable aviation initiatives","Low-cost and regional connectivity growth"],
  risks:["Airlines are cyclical and sensitive to shocks","Competition for cabin-crew roles","Shift work and irregular hours","Quality of institutes varies widely"],
  actionPlan:["Build English and presentation skills","Pick institutes with verified airline tie-ups","Get IATA / airline-ground certifications","Stay fit and well-groomed for service roles","Intern with an airport or ground handler"]
},
"retail-ecommerce-management":{
  whyFits:"Retail & E-commerce fits you because you enjoy watching what people buy and why, and want to build or run businesses that sell.",
  entryRoute:"Class 12 (any stream) → BBA / BMS (Retail / E-commerce specialisation) or B.Com via NMIMS NPAT, Symbiosis SET, Christ, SSCBS (CUET-UG) and similar → MBA (Marketing / Retail) later; or start a D2C venture.",
  yearByYear:[
    {year:'Year 1',items:["Principles of Management","Business Communication","Retail Fundamentals","Business Mathematics","Consumer Behaviour","Introduction to E-commerce"]},
    {year:'Year 2',items:["Merchandising & Category Management","Retail Operations","Pricing & Promotions","Digital Marketing Basics","Business Statistics","Supply Chain Basics"]},
    {year:'Year 3',items:["E-commerce Platforms & Marketplaces","Customer Experience & CRM","Retail Analytics","Visual Merchandising","Internship at Retailer / E-commerce Firm","Brand Management"]},
    {year:'Year 4',items:["Omnichannel Strategy","Retail Entrepreneurship","Capstone (Run a Mini Store / Online Brand)","Specialisation (Category / D2C / Operations / Analytics)","Retail Law & Ethics","Placement Preparation"]}
  ],
  coreSubjects:["Merchandising & Category Management","Retail Operations","E-commerce Platforms & Marketplaces","Consumer Behaviour & Pricing","Supply Chain & Inventory","Customer Experience & CRM"],
  tools:["Excel / Google Sheets","Shopify / WooCommerce","Amazon / Flipkart Seller Dashboards","Google Analytics","Power BI / Tableau","Inventory / ERP Tools (SAP Basics)","Canva / Product Listing Tools","CRM Tools"],
  projects:["Launch a small online store and track sales and returns","Prepare a category plan with pricing for a retailer","Analyse sales data to recommend assortment changes","Design a customer-loyalty programme","Write a D2C brand launch plan"],
  internshipStrategy:"Intern in stores, marketplaces and D2C startups; run a real online shop to learn listings, ads and logistics.",
  skillMilestones:["Year 1: Retail and business basics","Year 2: Merchandising and pricing","Year 3: E-commerce and internship","Year 4: Capstone and specialisation","Career: Executive → Manager → Category / E-commerce Head"],
  careerPaths:["Category / Merchandise Manager","E-commerce Manager","Store / Retail Operations Manager","Marketplace Seller / D2C Founder","Supply Chain / Inventory Analyst","Customer Experience Manager"],
  topRecruiters:["Amazon / Flipkart / Meesho / Myntra","Reliance Retail / Tata Trent / Avenue Supermarts (DMart)","Aditya Birla Fashion & Retail","D2C Brands (Nykaa, Lenskart, boAt)","FMCG Companies (Retail Teams)","Quick-commerce (Blinkit, Zepto, Swiggy Instamart)","Consulting & Analytics Firms","Own Store / Online Brand"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-18 LPA | Senior: ₹25 LPA+ (category / business heads). Figures are approximate and vary by company.",
  higherEd:["MBA (Marketing / Retail / Operations)","PGDM Retail Management","Supply Chain / Analytics Specialisation","MS Marketing / Retail Analytics (abroad)"],
  futureTrends:["Quick commerce and omnichannel retail","D2C and social commerce","Retail analytics and personalisation","Private labels and marketplaces","Sustainable and resale retail"],
  risks:["Thin margins and intense competition","Store roles can involve long, irregular hours","Platform policy changes affect sellers","Depends on strong analytical skills for growth"],
  actionPlan:["Run a small online store as a project","Learn Excel and basic analytics","Study 3 retail business models","Intern in stores and warehouses","Follow quick-commerce and D2C news"]
},
"real-estate-management":{
  whyFits:"Real Estate Management fits you because you see property as both a business and a city-shaping force, and enjoy deals, numbers and projects.",
  entryRoute:"Class 12 (any stream) → BBA / B.Com / B.Sc. in Real Estate / Construction Management (NICMAR, RICS School of Built Environment at Amity, CEPT, UPES, NMIMS, Symbiosis) → MBA / PG in Real Estate; RICS accreditation adds value.",
  yearByYear:[
    {year:'Year 1',items:["Principles of Management","Business Mathematics","Introduction to Real Estate","Business Communication","Economics","Basic Accounting"]},
    {year:'Year 2',items:["Real Estate Law & RERA","Property Valuation","Construction Technology Basics","Marketing & Sales","Statistics","Finance for Real Estate"]},
    {year:'Year 3',items:["Real Estate Finance & Investment","Project Management","Facility & Asset Management","Urban Economics","Internship at Developer / Consultancy","Negotiation & Leasing"]},
    {year:'Year 4',items:["Real Estate Development Capstone","Valuation Practice","Risk & Compliance","Specialisation (Residential / Commercial / REIT / Facility)","RICS / Industry Certification","Placement Preparation"]}
  ],
  coreSubjects:["Real Estate Valuation & Finance","Construction & Project Management","Real Estate Law & RERA","Property & Facility Management","Real Estate Marketing & Sales","Urban Land Use & Investment Analysis"],
  tools:["Excel Financial Modelling","Argus / Valuation Software (Basics)","MS Project / Primavera","AutoCAD (Basics)","CRM Tools","GIS / Google Earth","Property Portals (99acres / MagicBricks)","Power BI"],
  projects:["Value a commercial property with a full report","Build a financial model for a small residential project","Prepare a feasibility study for a plot","Analyse a REIT portfolio","Create a facility-management plan for a campus"],
  internshipStrategy:"Intern with developers, brokerages, valuation firms and REITs. RICS and industry certifications improve placement odds.",
  skillMilestones:["Year 1: Business and property basics","Year 2: Valuation, law and construction","Year 3: Finance and internship","Year 4: Capstone and certification","Career: Analyst → Manager → Head of Projects / Developer"],
  careerPaths:["Real Estate Analyst","Valuer / Property Appraiser","Project / Construction Manager","Facility / Property Manager","Real Estate Sales / Leasing Manager","Real Estate Investor / Developer"],
  topRecruiters:["Developers (DLF, Godrej Properties, Prestige, Lodha)","Consultancies (JLL, CBRE, Knight Frank, Colliers, Cushman & Wakefield)","Valuation & Advisory Firms","Banks & Housing Finance Companies","REITs & Funds","Construction Companies","Facility-management Firms","Own Brokerage / Development"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-20 LPA | Senior: ₹25 LPA+ (project heads / developers; commissions can be high). Figures are approximate.",
  higherEd:["MBA Real Estate / Infrastructure","MSc Real Estate (Reading / Cambridge / MIT style programmes abroad)","PG in Construction Management (NICMAR)","RICS / CFA / CCIM Certifications"],
  futureTrends:["REITs and institutional investment","Warehousing, data-centre and co-working demand","RERA-driven transparency","PropTech and digital property platforms","Green and smart buildings"],
  risks:["Real estate is cyclical and interest-rate sensitive","Commission-based roles are volatile","Regulation and approvals can delay projects","Needs strong networks"],
  actionPlan:["Learn financial modelling in Excel","Understand RERA and property law basics","Follow property markets in 2–3 cities","Intern with a developer or consultancy","Consider RICS accreditation"]
},
"commercial-pilot":{
  whyFits:"Commercial Pilot training fits you because you stay calm under pressure, enjoy precise procedures and want a career in the cockpit.",
  entryRoute:"Class 12 with Physics & Mathematics → DGCA Class 1 and Class 2 medicals → ground-school exams → CPL flying training at a DGCA-approved flying training organisation (IGRUA, NFTI, state flying clubs, private academies, or abroad) → type rating → airline first officer.",
  yearByYear:[
    {year:'Year 1',items:["Class 12 PCM Completion & Medicals","DGCA Ground Subjects: Air Navigation","Air Regulations","Aviation Meteorology","Technical General & Specific","English Radio Telephony (RT)"]},
    {year:'Year 2',items:["Private Pilot Licence (PPL) Flying Hours","Solo Cross-country Flying","Instrument Rating Basics","Night Flying","Multi-engine Rating","CPL Skill Test Preparation"]},
    {year:'Year 3',items:["CPL Skill Test & Licence Issue","Airline Entry Tests & Interviews","Type Rating (A320 / B737 etc.)","Multi-crew Cooperation (MCC) Course","Jet Orientation Course","Airline Induction"]},
    {year:'Year 4',items:["First Officer Line Training","Recurrent Training & Check Rides","Gaining Command Hours","Instrument & Route Qualifications","Safety Management & CRM","Path to Captain"]}
  ],
  coreSubjects:["Air Navigation","Aviation Meteorology","Air Regulations (DGCA)","Aircraft Technical Knowledge","Flight Planning & Performance","Crew Resource Management"],
  tools:["Flight Simulators","Aircraft Instruments & Avionics","Flight Planning Software","Navigation Charts & EFB Apps","Radio Telephony","Medical Fitness Records (DGCA Class 1)","Logbook","Type-rating Simulators"],
  projects:["Plan a cross-country flight with fuel, weather and alternates","Complete a weather-briefing and go/no-go decision exercise","Log and review simulator emergencies (engine failure, decompression)","Prepare a CRM case study from an incident report","Build a study timetable for all DGCA papers"],
  internshipStrategy:"There are no conventional internships — hours and licences are the credential. Join flying clubs or simulators early; keep medicals valid and maintain a clean record.",
  skillMilestones:["Stage 1: Class 12 PCM + Class 1 medical","Stage 2: Ground exams and PPL","Stage 3: CPL, instrument and multi-engine ratings","Stage 4: Type rating and airline entry","Career: First Officer → Senior First Officer → Captain"],
  careerPaths:["First Officer (Airline Pilot)","Captain","Cargo / Charter Pilot","Flight Instructor","Corporate / Helicopter Pilot","Aviation Safety Officer"],
  topRecruiters:["IndiGo","Air India Group","Akasa Air","SpiceJet","Cargo Airlines","Charter & Business Aviation Operators","Helicopter Operators","Flying Training Organisations"],
  salaryDirection:"Starting (First Officer): ₹8-18 LPA | Mid-career: ₹25-60 LPA | Captain: ₹60 LPA-1.5 Cr+. Training costs are high (commonly ₹35-80 lakh or more); figures are approximate.",
  higherEd:["ATPL Theory (DGCA / EASA)","Type Ratings (A320 / B737 / ATR)","Flight Instructor Rating (FIR)","BBA / MBA Aviation Management"],
  futureTrends:["Large aircraft orders and airline expansion in India","Pilot demand from low-cost and regional carriers","Simulator-based and cadet pilot programmes","Sustainable aviation fuels and new aircraft types","Advanced air mobility (long-term)"],
  risks:["Very high training cost with loan risk","Strict medical standards can end a career","Airline hiring is cyclical","Irregular hours and time away from home"],
  actionPlan:["Confirm DGCA Class 1 medical eligibility before investing","Choose a DGCA-approved school with verified fleet and instructors","Plan funding and loans carefully","Study air navigation and meteorology early","Consider airline cadet programmes"]
},
"aviation-maintenance-engineering":{
  whyFits:"AME fits you because you like machines and precision, and want to be the person who certifies that an aircraft is safe to fly.",
  entryRoute:"Class 12 (PCM) → DGCA-approved AME course (CAR-147 institutes) or B.Sc. / B.Tech Aeronautical / AME programme → DGCA CAR-66 licence exams (B1.1 / B1.2 / B2) → MRO or airline engineering roles.",
  yearByYear:[
    {year:'Year 1',items:["Mathematics & Physics for Aviation","Basic Electricity & Electronics","Aircraft Materials & Hardware","Maintenance Practices","Basic Aerodynamics","Human Factors"]},
    {year:'Year 2',items:["Aircraft Structures & Airframe Systems","Piston & Gas Turbine Engines","Propellers","Aircraft Electrical Systems","Instruments & Avionics Basics","Aviation Legislation (CAR)"]},
    {year:'Year 3',items:["Practical Training in Hangar / MRO","Engine Maintenance & Testing","Avionics Troubleshooting","Non-destructive Testing","CAR-66 Module Exams","Safety & Quality Management"]},
    {year:'Year 4',items:["Type Training (e.g., A320 / B737)","On-the-job Training & Logbook","CAR-66 Licence Completion","Specialisation (B1 Mechanical / B2 Avionics)","Airworthiness Review Basics","Placement Preparation"]}
  ],
  coreSubjects:["Aircraft Structures & Systems","Gas Turbine & Piston Engines","Avionics & Electrical Systems","Aviation Regulations (DGCA CAR-66)","Maintenance Practices & Documentation","Non-destructive Testing & Safety"],
  tools:["Aircraft Maintenance Manuals (AMM)","Torque / Precision Hand Tools","Borescope & NDT Equipment","Avionics Test Sets","Engine Test Cells (Training)","CAMO / MRO Software","Wiring & Harness Tools","Safety & Quality Systems"],
  projects:["Perform a documented maintenance task on a training aircraft","Troubleshoot a simulated avionics fault","Prepare a defect report and rectification plan","Complete a non-destructive testing exercise","Create a checklist-based inspection plan for an engine"],
  internshipStrategy:"Hands-on training in a DGCA-approved hangar or MRO is mandatory. Log your experience carefully — licensing depends on documented maintenance time.",
  skillMilestones:["Year 1: Basics of maths, physics and maintenance","Year 2: Systems, engines and avionics","Year 3: Hangar training and CAR-66 modules","Year 4: Type training and licence","Career: Trainee → Licensed Engineer → Certifying Staff → Quality / Planning Lead"],
  careerPaths:["Aircraft Maintenance Engineer (B1 / B2)","Licensed Aircraft Engineer","MRO Planning Engineer","Quality / Airworthiness Inspector","Avionics Technician / Engineer","Line / Base Maintenance Supervisor"],
  topRecruiters:["Air India Engineering Services (AIESL)","IndiGo Engineering","Akasa Air / SpiceJet Engineering","Indamer / Air Works / Taneja Aerospace (MROs)","Hindustan Aeronautics (HAL)","Boeing / Airbus MRO Partners","Defence Aviation Units","Business Jet MROs"],
  salaryDirection:"Starting: ₹3-7 LPA | Mid-career: ₹8-20 LPA | Senior: ₹25 LPA+ (licensed engineers abroad earn more). Licensing and type ratings raise pay; figures are approximate.",
  higherEd:["B.Tech Aerospace / Aeronautical (lateral)","B1 / B2 Licence Upgrades & Type Ratings","Aviation Quality / Safety Management","MBA Aviation Management"],
  futureTrends:["Fleet growth driving MRO demand in India","Predictive maintenance and digital records","Avionics and electric-aircraft training","MRO export hubs","Shortage of licensed engineers"],
  risks:["Many unrecognised institutes — verify DGCA approval","Licensing exams are tough and time-consuming","Shift work in hangars and line stations","Cyclical airline hiring"],
  actionPlan:["Verify the institute’s DGCA CAR-147 approval","Prepare CAR-66 modules early","Keep a careful maintenance logbook","Build practical hangar experience","Plan for type-rating costs"]
},
"merchant-navy-nautical-science":{
  whyFits:"Nautical Science fits you because you enjoy responsibility, structure and travel — and want to lead a ship as a deck officer.",
  entryRoute:"Class 12 with PCM (and English) → IMU-CET → B.Sc. Nautical Science (IMU campuses, TMI, TS Chanakya, AMET, others approved by DG Shipping) → sea time as cadet → COC exams → Third / Second Mate → Master.",
  yearByYear:[
    {year:'Year 1',items:["Maritime Mathematics & Physics","Introduction to Shipping","Seamanship","Basic Navigation","Elementary First Aid & Fire Fighting","Personal Survival Techniques (STCW)"]},
    {year:'Year 2',items:["Coastal & Celestial Navigation","Ship Construction & Stability","Maritime Meteorology","Radar & ECDIS","Cargo Handling & Stowage","Maritime English"]},
    {year:'Year 3',items:["Advanced Navigation & Watchkeeping","Maritime Law & COLREGs","Ship Management","Simulator Training (Bridge)","Safety & Security (ISPS / STCW)","Pre-sea Training Preparation"]},
    {year:'Year 4',items:["Sea-time as Deck Cadet","Competency Exams (Third Mate)","Cargo & Bridge Resource Management","Leadership & Ship Safety","Port Operations Basics","Career Planning to Master"]}
  ],
  coreSubjects:["Celestial & Electronic Navigation","Seamanship & Ship Handling","Cargo Handling & Stability","Maritime Law & COLREGs","Meteorology & Oceanography","Ship Safety & Security (STCW)"],
  tools:["ECDIS & Radar / ARPA","GPS / GNSS","Bridge Simulators","Charts & Passage Planning Tools","STCW Safety Training Kits","Cargo Planning Software","Maritime Communication Equipment (GMDSS)","Sea-time Record Book"],
  projects:["Plan a full passage using ECDIS and weather data","Prepare a cargo-stowage and stability plan","Run a bridge-simulator collision-avoidance exercise","Document a safety drill and incident report","Analyse a maritime accident case study"],
  internshipStrategy:"Cadet sea-time on a merchant ship is the core training. Choose DG Shipping-approved institutes and sponsors with real shipping-company placement.",
  skillMilestones:["Year 1: Maritime fundamentals","Year 2: Navigation and cargo","Year 3: Simulator and pre-sea training","Year 4: Cadet sea-time and exams","Career: Third Officer → Second → Chief Officer → Captain"],
  careerPaths:["Deck Cadet → Third / Second / Chief Officer","Captain / Master Mariner","Marine Pilot","Port / Terminal Manager","Marine Surveyor","Shipping Operations Manager"],
  topRecruiters:["Shipping Corporation of India","Anglo-Eastern / V.Ships / Fleet Management","Synergy / Wilhelmsen / Maersk Crewing Partners","Tanker, Bulk & Container Lines","Offshore Support Vessel Operators","Cruise Lines","Port Authorities","Shipping Agencies"],
  salaryDirection:"Starting (cadet / third officer): ₹4-9 LPA | Mid-career (second / chief officer): ₹15-35 LPA | Captain: ₹40 LPA-1 Cr+. Earnings are tax-advantaged for seafarers on qualifying terms; figures are approximate.",
  higherEd:["Master Mariner Certificate (COC)","MBA Shipping & Logistics","M.Sc. Maritime Studies / Management","Marine Pilot / Surveyor Qualifications"],
  futureTrends:["Green shipping and alternative fuels","Digital navigation and autonomous-ship research","Strong demand for qualified officers","Port-led development in India","Offshore wind and energy support vessels"],
  risks:["Months away from family and limited shore life","Hazardous and demanding work conditions","Fake maritime institutes — verify DG Shipping approval","Seafaring career often shifts to shore roles later"],
  actionPlan:["Verify DG Shipping approval of the institute","Prepare for IMU-CET","Meet vision and medical standards early","Ask about shipping-company placement tie-ups","Plan a shore-based path after sea service"]
},
"bca-computer-applications":{
  whyFits:"BCA fits you because you like building things with code and want a faster, application-focused path into IT, with room for MCA or an MBA later.",
  entryRoute:"Class 12 (any stream; Maths helpful, required at some colleges) → BCA / B.Sc. CS / B.Sc. IT via CUET-UG, Christ, Symbiosis (SICSR), NMIMS, Shiv Nadar and university entrance → MCA / MBA / MS or direct jobs.",
  yearByYear:[
    {year:'Year 1',items:["Programming in C / Python","Computer Fundamentals","Mathematics for Computing","Digital Logic","Communication Skills","Web Basics (HTML / CSS)"]},
    {year:'Year 2',items:["Data Structures","Object-Oriented Programming (Java)","Database Management Systems","Operating Systems","Computer Networks","Web Development"]},
    {year:'Year 3',items:["Software Engineering","Full-stack Development","Python for Data / AI Basics","Mobile App Development","Internship at IT Company / Startup","Cloud & DevOps Basics"]},
    {year:'Year 4',items:["Capstone Project","Specialisation (AI / Cyber / Cloud / Full-stack)","Software Testing & QA","Professional Practice","Portfolio / GitHub","Placement Preparation"]}
  ],
  coreSubjects:["Programming (C / Java / Python)","Data Structures","Database Management","Web Development","Software Engineering","Operating Systems & Networks"],
  tools:["Python","Java","HTML / CSS / JavaScript","SQL / MySQL","Git / GitHub","VS Code","React (Basics)","Cloud (AWS / Azure Basics)"],
  projects:["Build a full-stack web application with a database","Create a mobile app solving a local problem","Analyse a dataset and build dashboards","Develop a REST API with authentication","Contribute to an open-source project"],
  internshipStrategy:"Apply for internships at startups, service companies and product teams from Year 2. A strong GitHub portfolio matters more than the degree name.",
  skillMilestones:["Year 1: Programming and web basics","Year 2: Data structures, databases and OOP","Year 3: Full-stack project and internship","Capstone: Portfolio and job readiness","Career: Developer → Senior Developer / Architect (MCA / MBA optional)"],
  careerPaths:["Software Developer","Web / App Developer","QA / Test Engineer","Data Analyst","IT Support / Systems Analyst","Freelance Developer / Entrepreneur"],
  topRecruiters:["TCS / Infosys / Wipro / HCLTech","Cognizant / Capgemini / Accenture","Startups & Product Companies","Banks & Fintech IT Teams","E-commerce & EdTech","IT Services SMEs","Freelance Platforms","Government IT Roles"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-20 LPA | Senior: ₹25 LPA+ (strong developers / architects). Skills and portfolio matter more than the degree; figures are approximate.",
  higherEd:["MCA (NIT / VIT / university MCA programmes)","MBA (IT / Business Analytics)","M.Sc. Computer Science / Data Science","MS in Computer Science (abroad)"],
  futureTrends:["AI-assisted coding and low-code tools","Cloud-native and DevOps skills","Cybersecurity demand","Data and AI roles for non-engineering graduates","Remote and freelance tech work"],
  risks:["Fewer campus placements than top engineering colleges","Entry roles are crowded and skills-gated","Needs continuous upskilling","Degree brand matters in some hiring"],
  actionPlan:["Code daily and build projects from Year 1","Keep an active GitHub","Learn DSA basics for interviews","Take cloud / certification courses","Plan MCA or MBA only after real projects"]
},
"geology-earth-sciences":{
  whyFits:"Geology fits you because you enjoy fieldwork, reading landscapes and understanding how the Earth works.",
  entryRoute:"Class 12 (PCM / PCB) → B.Sc. Geology / Earth Sciences / Applied Geology (CUET-UG; IIT / IISER programmes via IIT JAM or IISER Aptitude Test for M.Sc. / BS-MS) → M.Sc. / M.Tech → GSI, ONGC, mining and environmental roles.",
  yearByYear:[
    {year:'Year 1',items:["Physical Geology","Mathematics & Statistics","Chemistry for Earth Scientists","Physics for Earth Sciences","Introduction to Mineralogy","Fieldwork Basics"]},
    {year:'Year 2',items:["Mineralogy","Petrology","Structural Geology","Palaeontology","Geomorphology","Field Mapping"]},
    {year:'Year 3',items:["Geophysics","Hydrogeology","Economic Geology","Remote Sensing & GIS","Internship / Field Camp","Sedimentology"]},
    {year:'Year 4',items:["Petroleum & Mining Geology","Environmental Geology","Dissertation / Field Project","Specialisation (Exploration / Hydrogeology / Geohazards)","Research Methods","Placement / Exam Preparation"]}
  ],
  coreSubjects:["Mineralogy & Petrology","Structural Geology","Geophysics","Hydrogeology","Remote Sensing & GIS","Economic Geology & Exploration"],
  tools:["Geological Compass & Field Tools","GIS (QGIS / ArcGIS)","Google Earth Engine","Petrographic Microscope","Seismic / Geophysical Software (Basics)","Python / R","AutoCAD","Remote Sensing Data"],
  projects:["Map and report a field area with structural data","Analyse a satellite image for land-use change","Prepare a groundwater-potential map using GIS","Study a rock suite with microscope petrography","Model a landslide-hazard zone"],
  internshipStrategy:"Join field camps, GSI / state geology department internships, mining and groundwater consultancies; learn GIS and Python for modern geoscience roles.",
  skillMilestones:["Year 1: Earth-science fundamentals","Year 2: Mineralogy and structure","Year 3: Geophysics, GIS and field camp","Year 4: Project and specialisation","Career: Geologist → Senior Geoscientist → Exploration Lead"],
  careerPaths:["Geologist / Exploration Geologist","Hydrogeologist","Geophysicist","Environmental / Climate Scientist","Mining & Oil-gas Geoscientist","GIS / Remote Sensing Analyst"],
  topRecruiters:["Geological Survey of India (GSI)","ONGC / Oil India / Reliance","Coal India / NMDC / Hindustan Zinc","Mining & Exploration Companies","Water & Environmental Consultancies","ISRO / NRSC / Remote-sensing Agencies","Research Institutes","Renewable & Geothermal Firms"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-20 LPA | Senior: ₹25 LPA+ (oil-gas and mining roles pay higher). Government roles follow pay scales; figures are approximate.",
  higherEd:["M.Sc. / M.Tech Geology / Applied Geology (IIT / IIT ISM)","M.Sc. Geophysics / Remote Sensing","UPSC Geologist / GSI exams","MS / PhD Earth Sciences (abroad)"],
  futureTrends:["Critical-minerals exploration and the energy transition","Groundwater and climate-risk assessment","AI and remote sensing for exploration","Geothermal and carbon storage","Disaster-risk mapping"],
  risks:["Fieldwork can be physically demanding","Oil-gas and mining hiring is cyclical","Fewer private jobs than engineering at graduate level","Needs a master’s for most roles"],
  actionPlan:["Learn GIS and Python early","Join field camps and geology societies","Prepare for IIT JAM / university PG entrance","Aim for GSI and PSU exams","Build a portfolio of maps and reports"]
},
"biochemistry-genetics":{
  whyFits:"Biochemistry & Genetics fits you because you want to understand life at the molecular level and contribute to medicine and biotech.",
  entryRoute:"Class 12 (PCB / PCM with Biology) → B.Sc. Biochemistry / Genetics / Molecular Biology (CUET-UG) or IISER / NISER BS-MS (IAT / NEST) → M.Sc. → PhD / industry.",
  yearByYear:[
    {year:'Year 1',items:["Chemistry for Life Sciences","Cell Biology","Mathematics & Statistics","Introduction to Biochemistry","Microbiology Basics","Communication Skills"]},
    {year:'Year 2',items:["Biochemistry I & II","Molecular Biology","Genetics","Immunology","Biophysical Techniques","Lab Methods"]},
    {year:'Year 3',items:["Genomics & Proteomics","Bioinformatics","Enzymology & Metabolism","Clinical Biochemistry","Internship / Lab Project","Research Methods"]},
    {year:'Year 4',items:["Research Dissertation","Specialisation (Genomics / Cancer Biology / Biopharma)","Scientific Writing","Biosafety & Ethics","Seminar & Publication","Placement / PG Preparation"]}
  ],
  coreSubjects:["Biochemistry & Metabolism","Molecular Biology","Genetics & Genomics","Cell Biology","Bioinformatics Basics","Laboratory Techniques (PCR, Electrophoresis)"],
  tools:["PCR & Gel Electrophoresis","Spectrophotometer","Microscopy","BLAST / NCBI Tools","Python / R (Bioinformatics)","Cell-culture Equipment","ImageJ","Lab Notebooks / ELN"],
  projects:["Design and run a gene-expression experiment","Analyse a genomic dataset with bioinformatics tools","Study enzyme kinetics of a food or drug-related enzyme","Write a literature review on a disease pathway","Replicate a published molecular-biology protocol"],
  internshipStrategy:"Join university labs, ICMR / CSIR / DBT-funded projects, diagnostics labs and biotech R&D teams. Early research experience is decisive.",
  skillMilestones:["Year 1: Chemistry, cell biology fundamentals","Year 2: Biochemistry and molecular biology","Year 3: Genomics and lab research","Year 4: Dissertation and specialisation","Career: Research Assistant → Scientist → Principal Investigator / R&D Lead"],
  careerPaths:["Research Scientist","Genetic / Molecular Biologist","Clinical / Diagnostic Scientist","Biopharma R&D Associate","Bioinformatics Analyst","Genetic Counsellor (with further study)"],
  topRecruiters:["CSIR / ICMR / DBT Labs","IISc / IISERs / NCBS / Tata Institutes","Biotech Firms (Biocon, Syngene)","Diagnostics Companies (Dr Lal PathLabs, Metropolis, Thyrocare)","Pharma R&D","Genomics Startups (MedGenome, Strand)","CROs","Universities"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹8-22 LPA | Senior: ₹25 LPA+ (PhD-level scientists / R&D leads). Figures are approximate; most research careers need a master’s or PhD.",
  higherEd:["M.Sc. Biochemistry / Genetics / Biotechnology","PhD (India or abroad)","Bioinformatics / Computational Biology","Genetic Counselling or Clinical Research Programmes"],
  futureTrends:["Genomics and personalised medicine","CRISPR and gene-editing research","AI in drug discovery","Biologics and biosimilars","Diagnostics and precision health"],
  risks:["Research careers are long and competitive","Funding and fellowships are limited","Undergraduate-only job options are modest","Lab work is detailed and repetitive"],
  actionPlan:["Join a research lab by Year 2","Learn Python / R for bioinformatics","Prepare for IIT JAM / CUET-PG / IISER / TIFR GS","Read papers regularly","Aim for fellowships and conferences"]
},
"forestry-wildlife":{
  whyFits:"Forestry & Wildlife fits you because you feel at home in nature and want to protect forests, species and the communities that depend on them.",
  entryRoute:"Class 12 (PCB / PCM) → B.Sc. Forestry / B.Sc. Wildlife / Environmental Science (Forest Research Institute University, agricultural universities, CUET-UG) → M.Sc. / WII diploma → state forest service / IFoS (UPSC) / conservation careers.",
  yearByYear:[
    {year:'Year 1',items:["Principles of Forestry","Botany & Plant Diversity","Ecology & Environment","Mathematics & Statistics","Soil Science","Communication Skills"]},
    {year:'Year 2',items:["Silviculture","Forest Mensuration","Wildlife Biology","Forest Protection","Remote Sensing & GIS","Field Training"]},
    {year:'Year 3',items:["Forest Management","Wildlife Conservation & Management","Agroforestry","Forest Policy & Law","Internship in Forest Division / Reserve","Climate & Biodiversity"]},
    {year:'Year 4',items:["Project / Dissertation","Specialisation (Wildlife / Silviculture / Policy)","Forest Economics","Community Forestry","Survey & Report Writing","Placement / UPSC Preparation"]}
  ],
  coreSubjects:["Forest Ecology & Silviculture","Wildlife Biology & Management","Biodiversity & Conservation","GIS & Remote Sensing","Forest Policy & Law","Climate & Community Forestry"],
  tools:["GIS (QGIS / ArcGIS)","Camera Traps & Field Instruments","GPS / Drones","R / Python (Ecological Data)","Remote Sensing Data","Field Notebooks / Survey Apps","Binoculars & Field Guides","Excel"],
  projects:["Conduct a vegetation survey and compute forest-cover change","Study wildlife occupancy using camera-trap data","Prepare a village-level forest-management plan","Map human-wildlife conflict hotspots with GIS","Write a policy brief on a conservation issue"],
  internshipStrategy:"Join forest divisions, national parks, WII / WWF-India / Wildlife Trust programmes and research projects. Fieldwork exposure is crucial.",
  skillMilestones:["Year 1: Ecology and forestry basics","Year 2: Silviculture, wildlife and GIS","Year 3: Field internship and management","Year 4: Dissertation and specialisation","Career: Forester → Range Officer → DFO / Conservation Lead"],
  careerPaths:["Forest Officer (State Forest Service)","Indian Forest Service (IFoS) Officer","Wildlife Biologist / Conservationist","Environmental / Climate Consultant","GIS & Ecology Analyst","Conservation NGO Programme Manager"],
  topRecruiters:["State Forest Departments","Indian Forest Service (IFoS via UPSC)","Wildlife Institute of India (WII)","WWF-India / WCS-India / Bombay Natural History Society","Environmental Consultancies","Carbon / Climate Project Developers","Research Institutes (ICFRE)","Eco-tourism Organisations"],
  salaryDirection:"Starting: ₹3-6 LPA (government scales for forest service roles) | Mid-career: ₹7-15 LPA | Senior: ₹18 LPA+ (IFoS / conservation leadership). Figures are approximate.",
  higherEd:["M.Sc. Forestry / Wildlife Science / Environmental Science","PG Diploma in Wildlife Management (WII)","Indian Forest Service (UPSC) preparation","MS / PhD Conservation Biology (abroad)"],
  futureTrends:["Carbon markets and forest-based climate projects","Tech in conservation (drones, AI camera traps)","Community-based conservation","Biodiversity accounting and ESG","Eco-tourism and nature-based solutions"],
  risks:["Field postings can be remote and demanding","Limited private-sector jobs","Government recruitment is competitive and slow","Funding for conservation is uneven"],
  actionPlan:["Spend time on field surveys and nature trails","Learn GIS and basic R / Python","Prepare for FRI, WII and IFoS-related exams","Volunteer with conservation NGOs","Read India’s forest and wildlife law basics"]
},
"marine-biology-fisheries":{
  whyFits:"Marine Biology & Fisheries fits you because you want to understand and protect aquatic life — and perhaps build sustainable aquaculture.",
  entryRoute:"Class 12 (PCB) → B.F.Sc. (Fisheries Science, via NEET-based / ICAR-linked and state entrances at fisheries universities) or B.Sc. Marine Biology / Zoology → M.Sc. / M.F.Sc. → research, aquaculture or fisheries service.",
  yearByYear:[
    {year:'Year 1',items:["Fundamentals of Fisheries & Aquatic Biology","Zoology & Botany Basics","Chemistry for Aquatic Science","Statistics","Ecology","Communication Skills"]},
    {year:'Year 2',items:["Fish Biology & Taxonomy","Aquatic Ecology","Aquaculture Systems","Oceanography","Fish Nutrition","Water Quality Management"]},
    {year:'Year 3',items:["Fish Health & Disease","Fisheries Resource Management","Post-harvest Technology","Marine Biodiversity","Internship at Hatchery / Marine Institute","Remote Sensing & GIS"]},
    {year:'Year 4',items:["Research Project","Specialisation (Aquaculture / Marine Conservation / Fisheries Business)","Fisheries Economics & Policy","Entrepreneurship in Aquaculture","Field Survey & Report","Placement / PG Preparation"]}
  ],
  coreSubjects:["Marine Biology & Ecology","Fisheries Science & Management","Aquaculture Technology","Oceanography","Fish Nutrition & Health","Coastal & Marine Conservation"],
  tools:["Plankton Nets & Water-quality Kits","Microscopy","GIS / Remote Sensing","R / Python","Scuba / Boat Field Training (Basics)","Aquaculture Pond / Hatchery Tools","Satellite & Ocean Data","Lab Instruments"],
  projects:["Run a small recirculating aquaculture system experiment","Survey coastal biodiversity and report findings","Analyse water-quality data from a fishing region","Prepare a business plan for a fish hatchery","Study impact of a fisheries policy on a coastal community"],
  internshipStrategy:"Work at marine research institutes (CMFRI, NIO), fisheries universities, aquaculture farms and coastal NGOs; fieldwork is key.",
  skillMilestones:["Year 1: Aquatic biology basics","Year 2: Aquaculture and oceanography","Year 3: Health, resource management and internship","Year 4: Research and specialisation","Career: Assistant → Scientist / Manager → Research Lead / Entrepreneur"],
  careerPaths:["Marine Biologist","Aquaculture / Hatchery Manager","Fisheries Officer","Marine Conservation Scientist","Seafood Quality / Export Specialist","Aquatic Researcher"],
  topRecruiters:["ICAR Institutes (CMFRI, CIFE, CIBA)","State Fisheries Departments","CSIR-NIO and Marine Research Institutes","Aquaculture Companies & Hatcheries","Seafood Exporters","Marine Conservation NGOs","MPEDA / NFDB Programmes","Universities"],
  salaryDirection:"Starting: ₹3-6 LPA | Mid-career: ₹7-15 LPA | Senior: ₹20 LPA+ (aquaculture owners / research leads). Figures are approximate.",
  higherEd:["M.F.Sc. / M.Sc. Marine Biology / Aquaculture","Ph.D. (ICAR Institutes / Universities)","MBA Agri / Fisheries Business","MS Marine Biology / Oceanography (abroad)"],
  futureTrends:["Blue economy and sustainable aquaculture","Seaweed and marine-biotech industries","Climate impacts on fisheries","Technology in aquaculture (sensors, RAS)","Marine protected-area management"],
  risks:["Fieldwork can be physically demanding and weather dependent","Limited private jobs in some regions","Aquaculture ventures carry biological and market risk","Needs postgraduate study for research roles"],
  actionPlan:["Spend time at coastal and aquaculture sites","Learn basic GIS and R","Prepare for ICAR / university entrance exams","Volunteer with marine NGOs","Explore aquaculture entrepreneurship schemes"]
},
"optometry":{
  whyFits:"Optometry fits you because you like precise, patient-centred work and want to help people see better.",
  entryRoute:"Class 12 (PCB / PCM with English) → B.Optom / B.Sc. Optometry (L V Prasad Eye Institute, Elite School of Optometry, Aravind Eye Care, Manipal, Sri Ramachandra, Jamia Hamdard, Symbiosis, Amity and others) → M.Optom / clinical or retail roles.",
  yearByYear:[
    {year:'Year 1',items:["Anatomy & Physiology of the Eye","Geometrical Optics","Physical Optics","Biochemistry","Basic Clinical Skills","Communication Skills"]},
    {year:'Year 2',items:["Visual Optics","Ocular Disease I","Optometric Instruments","Ophthalmic Lenses & Dispensing","Clinical Refraction","Pathology & Microbiology"]},
    {year:'Year 3',items:["Contact Lens Practice","Binocular Vision & Orthoptics","Ocular Disease II","Public Health & Community Optometry","Clinical Internship Rotations","Low Vision & Paediatrics"]},
    {year:'Year 4',items:["Advanced Clinical Practice","Clinical Internship (Hospitals / Clinics)","Research Project","Practice Management & Ethics","Specialisation (Contact Lens / Low Vision / Paediatric)","Placement Preparation"]}
  ],
  coreSubjects:["Ocular Anatomy & Physiology","Clinical Refraction","Contact Lens Practice","Binocular Vision","Ocular Disease Basics","Low Vision & Paediatric Optometry"],
  tools:["Retinoscope & Phoropter","Slit Lamp","Auto-refractor / Keratometer","Trial Lens Sets","Tonometer & Visual-field Analyser","Fundus Camera","Contact Lens Fitting Tools","Electronic Health Records"],
  projects:["Perform supervised refractions and prescribe corrections","Fit contact lenses for a case series","Run a community vision-screening camp","Analyse binocular-vision case studies","Draft a business plan for an optical clinic"],
  internshipStrategy:"Complete supervised clinical internships in eye hospitals, optical chains and community outreach. Practice experience and good patient communication matter.",
  skillMilestones:["Year 1: Eye anatomy, optics and basic skills","Year 2: Instruments and refraction","Year 3: Contact lenses and clinical rotations","Year 4: Internship and specialisation","Career: Optometrist → Senior / Specialist → Clinic Owner"],
  careerPaths:["Optometrist","Contact-lens / Low-vision Specialist","Clinic / Hospital Optometrist","Optical Retail / Brand Manager","Public Health / Community Eye-care Professional","Vision-care Entrepreneur"],
  topRecruiters:["Eye Hospitals (Aravind, LVPEI, Sankara Nethralaya, Dr Agarwal’s)","Optical Chains (Lenskart, Titan Eye+, Specsmakers)","Lens Companies (Essilor, Zeiss, Bausch & Lomb)","Hospitals & Clinics","Public Health / NGO Programmes","Corporate Eye-care & Insurance","Medical Device Firms","Own Clinic / Optical Store"],
  salaryDirection:"Starting: ₹2.5-5 LPA | Mid-career: ₹6-15 LPA | Senior: ₹20 LPA+ (clinic owners / brand leads). Figures are approximate.",
  higherEd:["M.Optom / M.Sc. Optometry","Fellowships (Contact Lens / Paediatrics / Low Vision)","MBA Hospital / Healthcare Management","Master’s / Doctor of Optometry (abroad)"],
  futureTrends:["Rising myopia and screen-related eye strain","Growth of organised optical retail","Tele-optometry and AI screening","Contact-lens and myopia-control market","Ageing-population eye care"],
  risks:["Scope-of-practice rules vary by state / country","Foreign practice needs separate licensing","Retail roles can be sales-driven","Quality of institutes varies"],
  actionPlan:["Choose institutes with strong clinical tie-ups","Build refraction practice early","Learn communication and patient counselling","Join eye-camp volunteering","Plan a specialisation (contact lenses / paediatrics)"]
},
"occupational-therapy":{
  whyFits:"Occupational Therapy fits you because you want to help people do the things that matter to them — from dressing and writing to returning to work.",
  entryRoute:"Class 12 (PCB) → BOT (Bachelor of Occupational Therapy) at AIIPMR Mumbai, Seth GSMC / KEM, TNMC, CMC Vellore, Manipal, Jamia Hamdard, Sri Ramachandra, D.Y. Patil and others (state / university entrance, merit) → M.O.T. / clinical practice.",
  yearByYear:[
    {year:'Year 1',items:["Human Anatomy","Physiology","Biomechanics & Kinesiology","Introduction to Occupational Therapy","Psychology & Sociology","Communication Skills"]},
    {year:'Year 2',items:["Neuroanatomy & Neurology","Orthopaedic Conditions","Activity Analysis & Therapeutic Skills","Psychiatry & Mental Health","Paediatrics & Development","Clinical Observation"]},
    {year:'Year 3',items:["Neurorehabilitation","Paediatric OT","Splinting & Assistive Technology","Hand Therapy","Community-based Rehabilitation","Clinical Postings"]},
    {year:'Year 4',items:["Advanced Clinical Practice","Occupational Ergonomics","Research Methods & Project","Rotating Internship (6 months)","Practice Management","Specialisation / Placement Preparation"]}
  ],
  coreSubjects:["Human Anatomy & Kinesiology","Neurorehabilitation","Paediatric Occupational Therapy","Mental-health OT","Orthotics & Assistive Devices","Ergonomics & Activity Analysis"],
  tools:["Assessment Scales (FIM, Barthel, etc.)","Splinting Materials","Sensory Integration Equipment","Assistive Devices & Adaptive Tools","Therapy Software / VR Rehab Tools","Ergonomic Assessment Tools","Patient Records","Telehealth Platforms"],
  projects:["Design an assistive aid for a patient case","Plan a therapy programme for a paediatric client","Conduct an ergonomic assessment at a workplace","Run a community rehabilitation awareness programme","Prepare a case study on stroke rehabilitation"],
  internshipStrategy:"The rotating clinical internship in hospitals and rehab centres is central. Seek exposure across paediatrics, neuro, hand and mental-health OT.",
  skillMilestones:["Year 1: Anatomy and foundations","Year 2: Neurology and clinical skills","Year 3: Specialised OT and postings","Year 4: Internship and research","Career: Therapist → Senior / Specialist → Clinic / Department Lead"],
  careerPaths:["Occupational Therapist","Paediatric / Developmental Therapist","Neuro-rehabilitation Specialist","Mental-health / Community OT","Ergonomics Consultant","Private Practice / Rehab Centre Founder"],
  topRecruiters:["Hospitals & Rehabilitation Centres","Child Development & Special Education Centres","Mental Health Institutions","NGOs & Disability Organisations","Corporate Wellness / Ergonomics Firms","Sports & Geriatric Care Centres","Telerehab Startups","Private Practice"],
  salaryDirection:"Starting: ₹2.5-4.5 LPA | Mid-career: ₹6-12 LPA | Senior: ₹15 LPA+ (specialists / private practice; abroad pay is higher). Figures are approximate.",
  higherEd:["M.O.T. (Neuro / Paediatrics / Hand / Mental Health)","PhD in Rehabilitation Sciences","Sensory Integration / Neuro-developmental Certifications","MSc / Doctorate in OT (abroad)"],
  futureTrends:["Rising demand in neuro, paediatric and geriatric rehab","Tele-rehabilitation and VR-based therapy","Autism and developmental-disorder services","Workplace ergonomics and mental-health OT","Inclusive-education and disability policy"],
  risks:["Awareness of OT is still low in India","Fewer government positions than in other health roles","Emotionally demanding work","Foreign practice needs additional licensing"],
  actionPlan:["Shadow therapists in different settings","Build skills in paediatrics or neurorehab","Learn assessment tools thoroughly","Volunteer at disability organisations","Plan a specialisation early"]
},
"speech-language-audiology":{
  whyFits:"Speech & Hearing fits you because you want to help children and adults communicate — through language, voice and hearing.",
  entryRoute:"Class 12 (PCB / PCM with Biology; some institutes accept any stream with Science) → BASLP / B.Sc. Speech & Hearing at AIISH Mysuru (top), AYJNISHD Mumbai, Dr. S.R. Chandrasekhar Institute, Manipal, Sri Ramachandra, Jamia Hamdard and others (RCI-recognised) → M.Sc. / clinical practice.",
  yearByYear:[
    {year:'Year 1',items:["Anatomy & Physiology of Speech & Hearing","Speech & Language Development","Introduction to Audiology","Linguistics & Phonetics","Psychology","Communication Skills"]},
    {year:'Year 2',items:["Speech Disorders","Language Disorders in Children","Audiological Assessment","Hearing Aids & Amplification","Neurology for Communication","Clinical Observation"]},
    {year:'Year 3',items:["Voice & Fluency Disorders","Adult Neurogenic Disorders","Cochlear Implants & Auditory Rehabilitation","Swallowing Disorders (Dysphagia)","Clinical Practicum","Research Methods"]},
    {year:'Year 4',items:["Advanced Clinical Practicum","Internship (RCI-mandated)","AAC & Special Education","Professional Ethics & Rehabilitation Law","Specialisation (Paediatrics / Audiology / Voice)","Placement Preparation"]}
  ],
  coreSubjects:["Speech & Language Development","Audiology & Hearing Assessment","Voice & Fluency Disorders","Neurological Speech Disorders","Hearing Aids & Cochlear Implants","Augmentative & Alternative Communication"],
  tools:["Audiometer & Tympanometer","Speech Analysis Software (Praat)","Hearing Aids & Cochlear-implant Mapping Tools","AAC Devices","Standardised Language Tests","Video Fluoroscopy / Swallow Assessment (Basics)","Telepractice Platforms","Therapy Materials"],
  projects:["Conduct supervised audiological assessments","Plan therapy for a child with a language delay","Create a community hearing-screening camp","Analyse a voice recording using Praat","Design an AAC board for a patient case"],
  internshipStrategy:"The RCI-mandated clinical internship in hospitals, rehab centres and schools is essential. Registration with the Rehabilitation Council of India (RCI) is required to practise.",
  skillMilestones:["Year 1: Foundations in anatomy and language","Year 2: Disorders and assessment","Year 3: Clinical practicum","Year 4: Internship and specialisation","Career: Clinician → Senior Clinician → Department Head / Private Practice"],
  careerPaths:["Speech-Language Pathologist","Audiologist","Hearing-aid / Cochlear-implant Specialist","Special Educator / Early Intervention Specialist","Clinical Supervisor / Researcher","Private Clinic Founder"],
  topRecruiters:["Hospitals (ENT & Rehabilitation Departments)","Child Development / Early Intervention Centres","Cochlear-implant & Hearing-aid Companies (Cochlear, Sonova, Starkey, Widex)","Special Schools","NGOs & Government Programmes (NPPCD)","Research Institutes (AIISH)","Teletherapy Startups","Private Clinics"],
  salaryDirection:"Starting: ₹2.5-4.5 LPA | Mid-career: ₹6-12 LPA | Senior: ₹15 LPA+ (clinic owners / specialists; abroad pay is higher). Figures are approximate.",
  higherEd:["M.Sc. Speech-Language Pathology / Audiology (AIISH)","Ph.D. Communication Disorders","Cochlear-implant / Auditory-verbal Therapy Certifications","MS / Au.D. / SLP Master’s (abroad)"],
  futureTrends:["Early-intervention and autism services","Hearing-health awareness and screening programmes","Tele-speech therapy","Cochlear-implant and hearing-tech growth","Geriatric and neuro-rehab communication care"],
  risks:["Few top institutes; competitive admissions","RCI registration and recognised degrees are essential","Emotionally demanding caseloads","Limited government posts relative to need"],
  actionPlan:["Verify RCI recognition of the institute","Prepare for AIISH and university entrance tests","Volunteer with speech-hearing clinics","Learn phonetics and basic audiology early","Plan a specialisation (paediatric / audiology / voice)"]
}`;

if (!content.includes('"fashion-design":{')) {
  const roadmapEndMarker = "\ncareers:['Agricultural Officer','Agri-business Manager','Plant Breeder','Agri-tech Entrepreneur','Soil / Crop Scientist','Agricultural Extension Officer'],\n  salaryDirection:'Starting: ₹3-6 LPA | Mid-career: ₹8-15 LPA | Senior: ₹20 LPA+ (agribusiness managers / entrepreneurs / senior scientists). Government posts follow pay scales; private and entrepreneurial income varies; figures are approximate.',\n  higherEd:['M.Sc. Agriculture (ICAR AIEEA-PG)','MBA (Agribusiness — IIM Ahmedabad / IIM Lucknow / NIAM)','Ph.D. Agriculture / Plant Sciences','Food Processing / Agri-tech Certifications'],\n  futureTrends:['Agri-tech and precision farming','Drone-based spraying and monitoring','Natural and organic farming','Farmer Producer Organisations (FPOs)','Climate-smart agriculture'],\n  risks:['Farm and rural jobs may offer low starting pay','Government roles are exam-driven and limited','Field exposure can be physically demanding'],\n  actionPlan:['Gain hands-on farm exposure early','Learn agri-tech tools and digital agriculture','Consider MBA Agribusiness for management route','Prepare for ICAR / state agriculture exams','Explore agri-tech or FPO entrepreneurship']\n}\n};";
  const roadmapEndReplace = "\ncareers:['Agricultural Officer','Agri-business Manager','Plant Breeder','Agri-tech Entrepreneur','Soil / Crop Scientist','Agricultural Extension Officer'],\n  salaryDirection:'Starting: ₹3-6 LPA | Mid-career: ₹8-15 LPA | Senior: ₹20 LPA+ (agribusiness managers / entrepreneurs / senior scientists). Government posts follow pay scales; private and entrepreneurial income varies; figures are approximate.',\n  higherEd:['M.Sc. Agriculture (ICAR AIEEA-PG)','MBA (Agribusiness — IIM Ahmedabad / IIM Lucknow / NIAM)','Ph.D. Agriculture / Plant Sciences','Food Processing / Agri-tech Certifications'],\n  futureTrends:['Agri-tech and precision farming','Drone-based spraying and monitoring','Natural and organic farming','Farmer Producer Organisations (FPOs)','Climate-smart agriculture'],\n  risks:['Farm and rural jobs may offer low starting pay','Government roles are exam-driven and limited','Field exposure can be physically demanding'],\n  actionPlan:['Gain hands-on farm exposure early','Learn agri-tech tools and digital agriculture','Consider MBA Agribusiness for management route','Prepare for ICAR / state agriculture exams','Explore agri-tech or FPO entrepreneurship']\n}" + newRoadmapsCode + "\n};";
  content = content.replace(roadmapEndMarker, roadmapEndReplace);
  console.log('Added 23 new roadmaps to ROADMAPS');
}

// 4. Add v4 Top Colleges and Study Abroad section after STREAMS
const v4CollegesCode = `
/* ================================================================
   v4 — TOP COLLEGES: India (top 10, college families grouped) + Study Abroad (6 fixed locations x 5 universities)
   Fields added to every BRANCHES[] and ROADMAPS[id]: topIndiaColleges, studyAbroad, collegeNotes
   Also v4: 35 new careers (fashion design, pilot, AME, merchant navy, BCA, optometry, etc.) and cluster 'aviation-maritime'.
   Rankings reflect general NIRF / QS-type standing as of late 2026 — re-check before publishing.
   ================================================================ */
/* ========== FIXED STUDY-ABROAD LOCATIONS (same six for every branch / career) ========== */
const ABROAD_LOCATIONS=[
{code:'SG',country:'Singapore',flag:'🇸🇬',note:'Only six autonomous universities exist, so for some careers the last slot is the nearest-fit institution. Strong ties with Indian students and good post-study job links in Asia.'},
{code:'UK',country:'United Kingdom',flag:'🇬🇧',note:'Mostly 3-year bachelor’s and 1-year master’s degrees. Applications via UCAS (UG) or directly to the university (PG).'},
{code:'DE',country:'Germany',flag:'🇩🇪',note:'Public universities charge low or no tuition in most states, but some states now charge non-EU students. Many bachelor’s programmes are in German; English-taught options are mainly at master’s level.'},
{code:'IT',country:'Italy',flag:'🇮🇹',note:'Low public-university fees plus regional scholarships. English-taught programmes are mostly at master’s level; apply through Universitaly and each university.'},
{code:'US',country:'United States',flag:'🇺🇸',note:'Highest cost but the widest choice and funding for research/graduate study. Needs SAT/ACT (UG, where required), GRE/GMAT (PG, where required) and English tests.'},
{code:'CA',country:'Canada',flag:'🇨🇦',note:'Co-op programmes and post-graduation work permits are strong draws. Study-permit caps and rules change, so check current IRCC rules.'}
];

/* ========== UNIVERSITY / INSTITUTE NAMES (code -> display name) ========== */
const UNI={
// Singapore
nus:'National University of Singapore (NUS)',ntu:'Nanyang Technological University (NTU)',smu:'Singapore Management University (SMU)',sutd:'Singapore University of Technology and Design (SUTD)',sit:'Singapore Institute of Technology (SIT)',suss:'Singapore University of Social Sciences (SUSS)',nie:'National Institute of Education (NIE), NTU',dukenus:'Duke-NUS Medical School',tumasia:'TUM Asia (Technical University of Munich, Singapore)',newcastlesg:'Newcastle University in Singapore (with SIT)',lasalle:'LASALLE College of the Arts',nafa:'Nanyang Academy of Fine Arts (NAFA)',digipen:'DigiPen Institute of Technology Singapore',ystcm:'Yong Siew Toh Conservatory of Music (NUS)',atsunrice:'At-Sunrice GlobalChef Academy',temasek:'Temasek Polytechnic',jcusg:'James Cook University Singapore',sim:'SIM Global Education',rsis:'S. Rajaratnam School of International Studies (NTU)',
// United Kingdom
oxford:'University of Oxford',cambridge:'University of Cambridge',imperial:'Imperial College London',ucl:'University College London (UCL)',kcl:'King’s College London',lse:'London School of Economics (LSE)',edinburgh:'University of Edinburgh',manchester:'University of Manchester',warwick:'University of Warwick',bristol:'University of Bristol',glasgow:'University of Glasgow',durham:'Durham University',bath:'University of Bath',standrews:'University of St Andrews',southampton:'University of Southampton',leeds:'University of Leeds',birmingham:'University of Birmingham',sheffield:'University of Sheffield',nottingham:'University of Nottingham',cardiff:'Cardiff University',exeter:'University of Exeter',lancaster:'Lancaster University',loughborough:'Loughborough University',strathclyde:'University of Strathclyde',heriotwatt:'Heriot-Watt University',aberdeen:'University of Aberdeen',cranfield:'Cranfield University',reading:'University of Reading',surrey:'University of Surrey',sussex:'University of Sussex',kent:'University of Kent',dundee:'University of Dundee',uea:'University of East Anglia (UEA)',soas:'SOAS University of London',goldsmiths:'Goldsmiths, University of London',royalholloway:'Royal Holloway, University of London',bayes:'Bayes Business School (City St George’s, University of London)',cityuk:'City St George’s, University of London',lshtm:'London School of Hygiene & Tropical Medicine (LSHTM)',rvc:'Royal Veterinary College (RVC)',liverpool:'University of Liverpool',ulster:'Ulster University',greenwich:'University of Greenwich',uclan:'University of Central Lancashire (UCLan)',harperadams:'Harper Adams University',ntrent:'Nottingham Trent University',kingston:'Kingston University London',westminster:'University of Westminster',leedsbeckett:'Leeds Beckett University',oxfordbrookes:'Oxford Brookes University',edinburghnapier:'Edinburgh Napier University',bournemouth:'Bournemouth University',abertay:'Abertay University',falmouth:'Falmouth University',
rca:'Royal College of Art (RCA)',ual:'University of the Arts London (UAL)',slade:'UCL Slade School of Fine Art',ruskin:'Ruskin School of Art (Oxford)',gsa:'Glasgow School of Art',aa:'Architectural Association School of Architecture (AA)',nfts:'National Film and Television School (NFTS)',lfs:'London Film School',ram:'Royal Academy of Music',rcm:'Royal College of Music',guildhall:'Guildhall School of Music & Drama',rncm:'Royal Northern College of Music',rada:'Royal Academy of Dramatic Art (RADA)',
// Germany
tum:'Technical University of Munich (TUM)',lmu:'Ludwig-Maximilians-Universität München (LMU)',rwth:'RWTH Aachen University',kit:'Karlsruhe Institute of Technology (KIT)',tuberlin:'Technische Universität Berlin (TU Berlin)',tudarmstadt:'TU Darmstadt',tudresden:'TU Dresden',stuttgart:'University of Stuttgart',tubraunschweig:'TU Braunschweig',tudortmund:'TU Dortmund',heidelberg:'Heidelberg University',charite:'Charité – Universitätsmedizin Berlin',hub:'Humboldt-Universität zu Berlin',fub:'Freie Universität Berlin',freiburg:'University of Freiburg',tuebingen:'University of Tübingen',hamburg:'University of Hamburg',bonn:'University of Bonn',mannheim:'University of Mannheim',konstanz:'University of Konstanz',goettingen:'University of Göttingen',saarland:'Saarland University',rub:'Ruhr University Bochum',leipzig:'Leipzig University',jena:'University of Jena',mainz:'Johannes Gutenberg University Mainz',potsdam:'University of Potsdam',cologne:'University of Cologne',goethe:'Goethe University Frankfurt',ulm:'University of Ulm',halle:'Martin Luther University Halle-Wittenberg',bielefeld:'Bielefeld University',fau:'Friedrich-Alexander-Universität Erlangen-Nürnberg (FAU)',luebeck:'University of Lübeck',giessen:'Justus Liebig University Giessen',hohenheim:'University of Hohenheim',clausthal:'TU Clausthal',freiberg:'TU Bergakademie Freiberg',wuppertal:'University of Wuppertal',duisburgessen:'University of Duisburg-Essen',witten:'Witten/Herdecke University',unibw:'Universität der Bundeswehr München',hannovervet:'University of Veterinary Medicine Hannover',dshk:'German Sport University Cologne',whu:'WHU – Otto Beisheim School of Management',esmt:'ESMT Berlin',frankfurtschool:'Frankfurt School of Finance & Management',klu:'Kühne Logistics University (Hamburg)',hertie:'Hertie School (Berlin)',bucerius:'Bucerius Law School (Hamburg)',hpi:'Hasso Plattner Institute (Potsdam)',iu:'IU International University of Applied Sciences',cbs:'Cologne Business School',mbs:'Munich Business School',reutlingen:'Reutlingen University (ESB Business School & Textile/Design)',heilbronn:'Heilbronn University',niederrhein:'Hochschule Niederrhein (Textile & Clothing Technology)',hof:'Hof University of Applied Sciences',albstadt:'Albstadt-Sigmaringen University',thkoeln:'TH Köln (Cologne University of Applied Sciences)',hdm:'Stuttgart Media University (HdM)',hsgbochum:'Hochschule für Gesundheit (Bochum)',
udk:'Berlin University of the Arts (UdK)',weissensee:'Weißensee Academy of Art Berlin',bauhaus:'Bauhaus-Universität Weimar',hfgkarlsruhe:'HfG Karlsruhe',hfgoffenbach:'HfG Offenbach',dusseldorf:'Kunstakademie Düsseldorf',munichacademy:'Academy of Fine Arts Munich',staedel:'Städelschule (Frankfurt)',filmakademie:'Filmakademie Baden-Württemberg',hffmuc:'University of Television and Film Munich (HFF)',dffb:'Deutsche Film- und Fernsehakademie Berlin (dffb)',babelsberg:'Film University Babelsberg Konrad Wolf',ifs:'Internationale Filmschule Köln (ifs)',hmtmuc:'University of Music and Performing Arts Munich',hanseisler:'Hanns Eisler School of Music Berlin',folkwang:'Folkwang University of the Arts',hmthannover:'Hanover University of Music, Drama and Media',
// Italy
polimi:'Politecnico di Milano',polito:'Politecnico di Torino',sapienza:'Sapienza University of Rome',bologna:'University of Bologna',padova:'University of Padua',pisa:'University of Pisa',milan:'University of Milan (Statale)',milanbicocca:'University of Milano-Bicocca',trento:'University of Trento',trieste:'University of Trieste',turin:'University of Turin',florence:'University of Florence',federico2:'University of Naples Federico II',genoa:'University of Genoa',pavia:'University of Pavia',parma:'University of Parma',cagliari:'University of Cagliari',perugia:'University of Perugia',verona:'University of Verona',unimore:'University of Modena and Reggio Emilia (UNIMORE)',santanna:'Scuola Superiore Sant’Anna (Pisa)',normale:'Scuola Normale Superiore (Pisa)',sissa:'SISSA (Trieste)',cafoscari:'Ca’ Foscari University of Venice',gastronomic:'University of Gastronomic Sciences (Pollenzo)',bocconi:'Bocconi University (Milan)',luiss:'LUISS Guido Carli (Rome)',cattolica:'Università Cattolica del Sacro Cuore',iulm:'IULM University (Milan)',foroitalico:'University of Rome “Foro Italico”',marangoni:'Istituto Marangoni',polimoda:'Polimoda (Florence)',naba:'NABA – Nuova Accademia di Belle Arti (Milan)',ied:'Istituto Europeo di Design (IED)',domus:'Domus Academy (Milan)',iuav:'IUAV University of Venice',brera:'Brera Academy of Fine Arts (Milan)',florenceart:'Accademia di Belle Arti di Firenze',csc:'Centro Sperimentale di Cinematografia (Rome)',santacecilia:'Conservatorio di Santa Cecilia (Rome)',milanconservatorio:'Conservatorio di Milano “Giuseppe Verdi”',scalaacademy:'Accademia Teatro alla Scala (Milan)',
// United States
mit:'Massachusetts Institute of Technology (MIT)',stanford:'Stanford University',cmu:'Carnegie Mellon University',berkeley:'University of California, Berkeley',uiuc:'University of Illinois Urbana-Champaign',gatech:'Georgia Institute of Technology',umich:'University of Michigan',harvard:'Harvard University',princeton:'Princeton University',yale:'Yale University',columbia:'Columbia University',caltech:'Caltech',purdue:'Purdue University',umd:'University of Maryland',jhu:'Johns Hopkins University',duke:'Duke University',northwestern:'Northwestern University',uchicago:'University of Chicago',nyu:'New York University (NYU)',upenn:'University of Pennsylvania',usc:'University of Southern California (USC)',ucla:'UCLA',ucd:'UC Davis',ucsf:'UC San Francisco (UCSF)',cornell:'Cornell University',uwmadison:'University of Wisconsin–Madison',utaustin:'University of Texas at Austin',tamu:'Texas A&M University',mines:'Colorado School of Mines',ou:'University of Oklahoma',uarizona:'University of Arizona',psu:'Penn State University',vt:'Virginia Tech',mtu:'Michigan Technological University',clemson:'Clemson University',ncstate:'NC State University (Wilson College of Textiles)',jefferson:'Thomas Jefferson University (formerly Philadelphia University)',fit:'Fashion Institute of Technology (FIT)',parsons:'Parsons School of Design (The New School)',scad:'Savannah College of Art and Design (SCAD)',risd:'Rhode Island School of Design (RISD)',artcenter:'ArtCenter College of Design',calarts:'California Institute of the Arts (CalArts)',saic:'School of the Art Institute of Chicago',pratt:'Pratt Institute',rit:'Rochester Institute of Technology',uw:'University of Washington',ringling:'Ringling College of Art and Design',yaleart:'Yale School of Art',yaledrama:'Yale School of Drama',nyutisch:'NYU Tisch School of the Arts',afi:'American Film Institute (AFI) Conservatory',chapman:'Chapman University (Dodge College of Film)',juilliard:'The Juilliard School',berklee:'Berklee College of Music',curtis:'Curtis Institute of Music',medill:'Northwestern University (Medill School of Journalism)',columbiaj:'Columbia Journalism School',mizzou:'University of Missouri School of Journalism',syracuse:'Syracuse University (Newhouse School)',annenberg:'USC Annenberg School',wharton:'University of Pennsylvania (Wharton School)',nyustern:'NYU Stern School of Business',booth:'University of Chicago (Booth School of Business)',haas:'UC Berkeley (Haas School of Business)',msu:'Michigan State University',asu:'Arizona State University',ohiostate:'Ohio State University',unlv:'University of Nevada, Las Vegas (UNLV)',ucf:'University of Central Florida (Rosen College)',fiu:'Florida International University',uiowa:'University of Iowa',uconn:'University of Connecticut',unc:'University of North Carolina at Chapel Hill',umn:'University of Minnesota',emory:'Emory University',pitt:'University of Pittsburgh',wustl:'Washington University in St. Louis',colostate:'Colorado State University',ufl:'University of Florida',okstate:'Oklahoma State University',wpi:'Worcester Polytechnic Institute (WPI)',northeastern:'Northeastern University',rutgers:'Rutgers University',georgetown:'Georgetown University',sais:'Johns Hopkins SAIS',tufts:'Tufts University',middlebury:'Middlebury Institute of International Studies',nyulaw:'NYU School of Law',berkeleylaw:'UC Berkeley School of Law',
// Canada
toronto:'University of Toronto',waterloo:'University of Waterloo',ubc:'University of British Columbia (UBC)',mcgill:'McGill University',alberta:'University of Alberta',mcmaster:'McMaster University',queens:'Queen’s University',western:'Western University',sfu:'Simon Fraser University',montreal:'Université de Montréal',calgary:'University of Calgary',ottawa:'University of Ottawa',carleton:'Carleton University',concordia:'Concordia University',guelph:'University of Guelph',saskatchewan:'University of Saskatchewan',laval:'Université Laval',windsor:'University of Windsor',laurentian:'Laurentian University',dalhousie:'Dalhousie University',upei:'University of Prince Edward Island (Atlantic Veterinary College)',yorkcanada:'York University (Schulich)',tmu:'Toronto Metropolitan University',ocad:'OCAD University',emilycarr:'Emily Carr University of Art + Design',sheridan:'Sheridan College',vfs:'Vancouver Film School',uvic:'University of Victoria',rmc:'Royal Military College of Canada',lasallecollege:'LaSalle College (Montréal)',georgebrown:'George Brown College',niagara:'Niagara College',humber:'Humber College',conestoga:'Conestoga College',osgoode:'York University (Osgoode Hall Law School)',
saa:'Singapore Aviation Academy (SAA)',ngeeann:'Ngee Ann Polytechnic (Optometry)',bcu:'Birmingham City University (School of Jewellery)',newcastleuk:'Newcastle University (UK)',
brunel:'Brunel University London',coventry:'Coventry University',yorkuk:'University of York',aston:'Aston University (Optometry)',plymouth:'University of Plymouth',bangor:'Bangor University',
pforzheim:'Pforzheim University (Jewellery & Fashion)',trierhs:'Trier University of Applied Sciences (Gemstones & Jewellery, Idar-Oberstein)',kisd:'Köln International School of Design (KISD)',hannoverfh:'Hochschule Hannover (Photojournalism)',hfmdetmold:'Detmold University of Music (Tonmeister)',hcuhamburg:'HafenCity University Hamburg',frankfurtuas:'Frankfurt University of Applied Sciences (Aviation Management)',hsbremen:'Hochschule Bremen (Maritime / Aviation)',ebs:'EBS University for Business and Law',kiel:'Kiel University',rostock:'University of Rostock',bremen:'University of Bremen',oldenburg:'University of Oldenburg',hnee:'Eberswalde University for Sustainable Development (HNEE)',tuhh:'Hamburg University of Technology (TUHH)',aalen:'Aalen University (Optometry)',ehsjena:'Ernst-Abbe University of Applied Sciences Jena (Optometry)',beuth:'Berlin University of Applied Sciences (Beuth)',
alchimia:'Alchimia – Contemporary Jewellery School (Florence)',tuscia:'University of Tuscia',univpm:'Marche Polytechnic University (Ancona)',palermo:'University of Palermo',romatre:'Roma Tre University (Optics & Optometry)',alma:'ALMA – International School of Italian Cuisine',icif:'Italian Culinary Institute for Foreigners (ICIF)',
gia:'Gemological Institute of America (GIA)',cia:'Culinary Institute of America (CIA)',jw:'Johnson & Wales University',erau:'Embry-Riddle Aeronautical University',und:'University of North Dakota (Aerospace)',sjsu:'San José State University (Aviation)',oregonstate:'Oregon State University',ucsd:'UC San Diego (Scripps Institution of Oceanography)',ucsb:'UC Santa Barbara',webb:'Webb Institute (Naval Architecture)',salus:'Salus University (Pennsylvania College of Optometry)',uab:'University of Alabama at Birmingham (Optometry)',neco:'New England College of Optometry',vanderbilt:'Vanderbilt University',
nscad:'NSCAD University',mountroyal:'Mount Royal University',seneca:'Seneca Polytechnic',memorial:'Memorial University of Newfoundland',unbc:'University of Northern British Columbia',cordonbleulondon:'Le Cordon Bleu London'
};

/* ---- STUDY-ABROAD SETS: one set per field. Each = 6 fixed locations x 5 universities (codes resolve via UNI) ---- */
const _S=(sg,uk,de,it,us,ca)=>({SG:sg.split(' '),UK:uk.split(' '),DE:de.split(' '),IT:it.split(' '),US:us.split(' '),CA:ca.split(' ')});
const ABROAD_SETS={
// ---------- ENGINEERING & TECHNOLOGY ----------
A_CS:_S('nus ntu sutd smu sit','imperial cambridge oxford ucl edinburgh','tum rwth kit tuberlin tudarmstadt','polimi polito sapienza bologna pisa','mit stanford cmu berkeley uiuc','toronto waterloo ubc mcgill alberta'),
A_CYBER:_S('ntu nus sutd smu sit','royalholloway oxford ucl imperial lancaster','rub saarland tudarmstadt tum kit','sapienza polimi polito pisa bologna','cmu gatech purdue umd berkeley','waterloo toronto ubc carleton concordia'),
A_AI:_S('nus ntu smu sutd sit','edinburgh cambridge oxford imperial ucl','tum tuebingen saarland rwth kit','polimi sapienza bologna polito trento','cmu stanford mit berkeley uiuc','toronto montreal waterloo alberta ubc'),
A_DATA:_S('nus ntu smu sutd sit','imperial edinburgh ucl warwick lse','tum mannheim lmu rwth tuebingen','polimi bocconi sapienza bologna polito','berkeley cmu stanford columbia uiuc','toronto waterloo ubc mcgill alberta'),
A_ECE:_S('nus ntu sutd sit tumasia','cambridge imperial oxford ucl manchester','tum rwth kit tudresden stuttgart','polimi polito padova bologna sapienza','mit stanford berkeley gatech umich','toronto waterloo ubc mcgill alberta'),
A_ELEC:_S('nus ntu sutd sit tumasia','imperial cambridge manchester strathclyde edinburgh','rwth tum kit tudresden tuberlin','polimi polito padova bologna sapienza','mit stanford berkeley gatech umich','toronto ubc mcgill alberta waterloo'),
A_BME:_S('nus ntu dukenus sit sutd','imperial oxford cambridge ucl edinburgh','fau tum rwth heidelberg tuberlin','polimi polito padova bologna pisa','jhu gatech duke mit stanford','toronto mcgill ubc mcmaster waterloo'),
A_MECH:_S('nus ntu sutd sit tumasia','imperial cambridge oxford bristol bath','tum rwth kit stuttgart tuberlin','polimi polito bologna padova pisa','mit stanford berkeley gatech umich','waterloo toronto ubc mcgill queens'),
A_AUTO:_S('nus ntu sutd sit tumasia','imperial cranfield warwick bath loughborough','tum rwth stuttgart tubraunschweig kit','polito polimi unimore bologna padova','umich mit clemson gatech purdue','waterloo windsor mcmaster toronto ubc'),
A_MFG:_S('nus ntu sutd sit tumasia','cambridge imperial warwick nottingham strathclyde','rwth tum kit stuttgart tuberlin','polimi polito bologna padova unimore','mit gatech umich purdue berkeley','waterloo toronto mcmaster ubc mcgill'),
A_ROBO:_S('nus ntu sutd sit tumasia','imperial edinburgh oxford bristol cambridge','tum kit rwth tuberlin stuttgart','polimi polito santanna genoa bologna','cmu mit umich gatech berkeley','toronto waterloo ubc alberta mcgill'),
A_AERO:_S('ntu nus sutd sit tumasia','imperial cambridge bristol southampton cranfield','tum rwth stuttgart tubraunschweig tuberlin','polimi polito sapienza bologna federico2','mit caltech stanford gatech purdue','toronto mcgill ubc carleton concordia'),
A_CIVIL:_S('nus ntu sutd sit newcastlesg','imperial cambridge ucl bristol edinburgh','tum rwth kit stuttgart tudresden','polimi polito padova sapienza bologna','berkeley stanford mit uiuc gatech','toronto ubc waterloo mcgill alberta'),
A_ENVENG:_S('ntu nus sutd sit newcastlesg','imperial oxford cambridge ucl uea','tum kit freiburg hub tudresden','polimi polito padova bologna trento','stanford berkeley mit yale ucd','toronto ubc mcgill waterloo alberta'),
A_CHEM:_S('nus ntu sit tumasia newcastlesg','cambridge imperial oxford manchester ucl','rwth tum kit tudresden tuberlin','polimi polito padova bologna pisa','mit berkeley stanford caltech uwmadison','toronto ubc mcgill waterloo alberta'),
A_PETRO:_S('nus ntu sit tumasia newcastlesg','imperial heriotwatt aberdeen edinburgh strathclyde','clausthal freiberg rwth tum tuberlin','polito polimi sapienza bologna padova','utaustin tamu stanford mines ou','alberta calgary ubc toronto mcgill'),
A_PHARMA:_S('nus ntu dukenus sit sutd','ucl kcl manchester nottingham strathclyde','fub lmu heidelberg bonn saarland','milan bologna padova sapienza pavia','ucsf unc umich purdue umn','toronto ubc alberta mcgill montreal'),
A_BIOTECH:_S('nus ntu dukenus sit sutd','imperial cambridge oxford ucl edinburgh','tum heidelberg lmu kit rwth','polimi padova bologna sapienza milan','mit stanford harvard jhu berkeley','toronto ubc mcgill mcmaster alberta'),
A_TEXTILE:_S('ntu nus sit sutd tumasia','leeds manchester heriotwatt ntrent rca','rwth tudresden niederrhein hof albstadt','polito polimi marangoni polimoda ied','ncstate gatech cornell jefferson fit','alberta tmu toronto concordia ocad'),
A_FASHION:_S('lasalle nafa ntu sutd nus','ual rca leeds manchester ntrent','udk weissensee reutlingen niederrhein hof','polimi marangoni polimoda naba ied','fit parsons cornell ncstate scad','tmu alberta concordia ocad lasallecollege'),
A_FOOD:_S('nus ntu sit atsunrice temasek','reading nottingham leeds surrey cranfield','tum hohenheim tuberlin kit bonn','parma gastronomic bologna milan padova','ucd cornell purdue uwmadison msu','guelph mcgill ubc alberta laval'),
A_MATERIALS:_S('ntu nus sit sutd tumasia','imperial cambridge oxford manchester sheffield','rwth kit tum saarland clausthal','polimi polito padova bologna sapienza','mit stanford berkeley northwestern gatech','toronto mcmaster ubc mcgill alberta'),
A_AGRI:_S('ntu nus sit sutd tumasia','reading harperadams nottingham cranfield edinburgh','hohenheim tum bonn goettingen hub','milan bologna padova turin florence','ucd cornell uwmadison tamu purdue','guelph mcgill ubc alberta saskatchewan'),
A_MINING:_S('ntu nus sit sutd tumasia','exeter imperial leeds aberdeen heriotwatt','freiberg rwth clausthal tum kit','polito sapienza cagliari padova bologna','mines uarizona psu vt mtu','ubc mcgill queens laurentian alberta'),
A_SAFETY:_S('ntu nus sit sutd tumasia','edinburgh ulster greenwich uclan heriotwatt','wuppertal thkoeln rwth tum tudresden','polimi sapienza polito bologna padova','wpi umd okstate purdue gatech','carleton alberta waterloo toronto ubc'),
// ---------- COMMERCE & MANAGEMENT ----------
A_ACCFIN:_S('nus ntu smu suss sit','lse warwick manchester bayes exeter','mannheim frankfurtschool whu lmu tum','bocconi luiss bologna cattolica padova','wharton nyustern booth columbia haas','ubc toronto mcgill queens western'),
A_ACTUARIAL:_S('nus ntu smu suss sit','heriotwatt lse bayes kent manchester','ulm lmu mannheim cologne hamburg','sapienza bocconi padova bologna milanbicocca','uiuc uwmadison uiowa uconn psu','waterloo toronto western yorkcanada ubc'),
A_ECON:_S('nus smu ntu suss jcusg','lse oxford cambridge warwick ucl','mannheim bonn lmu hub konstanz','bocconi bologna luiss sapienza padova','harvard mit stanford uchicago princeton','toronto ubc mcgill queens montreal'),
A_BUSINESS:_S('nus smu ntu suss sit','lse warwick imperial bayes manchester','mannheim whu esmt frankfurtschool tum','bocconi luiss polimi bologna cattolica','wharton haas nyustern booth columbia','ubc toronto mcgill queens western'),
A_SCM:_S('nus ntu smu sit suss','cranfield warwick manchester cardiff loughborough','klu tum whu tuberlin mannheim','polimi bocconi bologna luiss cattolica','mit msu asu psu ohiostate','ubc mcmaster yorkcanada toronto western'),
A_HOSP:_S('sit atsunrice nus ntu smu','surrey strathclyde oxfordbrookes edinburghnapier leedsbeckett','iu cbs reutlingen heilbronn mbs','iulm bologna gastronomic perugia cattolica','cornell unlv ucf fiu msu','guelph tmu georgebrown niagara humber'),
// ---------- HUMANITIES, SOCIAL SCIENCES, EDUCATION ----------
A_PSYCH:_S('nus ntu smu suss jcusg','ucl oxford cambridge kcl edinburgh','lmu heidelberg mannheim hub tuebingen','padova bologna sapienza milanbicocca turin','stanford harvard yale umich berkeley','toronto ubc mcgill western waterloo'),
A_SOCIOLOGY:_S('nus ntu smu suss sit','lse oxford cambridge ucl manchester','hub fub lmu mannheim heidelberg','bologna sapienza padova trento milan','harvard berkeley uchicago princeton stanford','toronto ubc mcgill mcmaster queens'),
A_DEV:_S('nus suss ntu smu sit','lse sussex oxford edinburgh manchester','bonn hertie hub fub freiburg','bologna sapienza padova trento milan','umich columbia uchicago berkeley harvard','toronto ubc mcgill mcmaster ottawa'),
A_POLSCI:_S('nus ntu smu suss jcusg','oxford lse cambridge kcl ucl','hertie hub lmu bonn heidelberg','bologna luiss sapienza bocconi padova','harvard princeton yale stanford columbia','toronto mcgill ubc queens carleton'),
A_HISTORY:_S('nus ntu smu suss jcusg','oxford cambridge soas ucl kcl','hub lmu heidelberg fub tuebingen','bologna sapienza padova florence pisa','harvard princeton yale stanford berkeley','toronto mcgill ubc queens western'),
A_ENGLISH:_S('nus ntu smu suss jcusg','oxford cambridge ucl edinburgh kcl','hub fub lmu heidelberg tuebingen','bologna sapienza padova milan cafoscari','harvard yale princeton stanford berkeley','toronto ubc mcgill queens alberta'),
A_LIBARTS:_S('nus ntu smu suss jcusg','oxford cambridge ucl kcl standrews','hub lmu heidelberg fub konstanz','sapienza bologna normale padova milan','princeton harvard yale uchicago berkeley','toronto mcgill ubc queens western'),
A_LANG:_S('nus ntu suss smu jcusg','ucl soas oxford cambridge edinburgh','mainz heidelberg hub lmu leipzig','bologna trieste sapienza padova milan','mit georgetown stanford berkeley middlebury','montreal ottawa mcgill toronto ubc'),
A_EDU:_S('nie nus suss jcusg sit','ucl oxford cambridge edinburgh kcl','tum lmu hub heidelberg tuebingen','bologna milanbicocca padova florence sapienza','harvard stanford columbia umich ucla','toronto ubc mcgill alberta queens'),
// ---------- MEDIA, DESIGN, ARTS ----------
A_MEDIA:_S('ntu nus smu suss lasalle','cardiff cityuk goldsmiths westminster leeds','tudortmund lmu leipzig hamburg mainz','iulm cattolica sapienza bologna luiss','medill columbiaj mizzou syracuse annenberg','tmu carleton ubc concordia western'),
A_FILM:_S('ntu lasalle nafa nus smu','nfts lfs ual westminster bournemouth','filmakademie hffmuc dffb babelsberg ifs','csc bologna iulm sapienza naba','usc nyutisch afi ucla chapman','concordia yorkcanada vfs tmu sfu'),
A_FINEARTS:_S('ntu lasalle nafa nus sit','ual rca slade ruskin gsa','udk dusseldorf munichacademy weissensee staedel','brera naba iuav bologna florenceart','risd yaleart calarts saic parsons','ocad emilycarr concordia ubc uvic'),
A_DESIGN:_S('lasalle nafa ntu sutd nus','rca ual gsa falmouth leeds','udk hfgkarlsruhe hfgoffenbach weissensee bauhaus','polimi iuav naba ied domus','risd artcenter parsons calarts scad','ocad emilycarr concordia sheridan tmu'),
A_UX:_S('sutd nus ntu smu lasalle','ucl rca dundee glasgow edinburgh','hpi tum hfgoffenbach tuberlin saarland','polimi polito iuav naba sapienza','cmu stanford umich uw rit','waterloo toronto ubc ocad sfu'),
A_ANIM:_S('ntu nus smu digipen lasalle','bournemouth abertay dundee ual glasgow','filmakademie babelsberg thkoeln hdm tum','polimi naba ied csc milanbicocca','calarts usc ringling cmu scad','sheridan vfs concordia sfu tmu'),
A_INTERIOR:_S('lasalle nafa ntu sutd nus','rca ual kingston westminster leedsbeckett','udk weissensee bauhaus tuberlin tudortmund','polimi iuav naba ied domus','risd parsons pratt scad cornell','ocad tmu emilycarr sheridan conestoga'),
A_ARCH:_S('nus sutd lasalle ntu sit','ucl cambridge aa bath edinburgh','tum rwth tudresden tuberlin stuttgart','polimi polito iuav sapienza florence','mit harvard columbia cornell berkeley','mcgill toronto ubc waterloo carleton'),
A_PERF:_S('ystcm lasalle nafa nus ntu','ram rcm guildhall rncm rada','hmtmuc hanseisler folkwang udk hmthannover','santacecilia milanconservatorio scalaacademy bologna naba','juilliard berklee nyutisch yaledrama curtis','mcgill toronto ubc montreal concordia'),
// ---------- LAW, DEFENCE, PUBLIC SERVICE ----------
A_LAW:_S('nus smu suss sim ntu','oxford cambridge lse ucl kcl','hub lmu heidelberg bucerius bonn','bologna bocconi sapienza luiss padova','harvard yale stanford columbia nyulaw','toronto mcgill ubc osgoode queens'),
A_CORPLAW:_S('nus smu suss sim ntu','ucl cambridge oxford lse kcl','bucerius lmu hub mannheim heidelberg','bocconi luiss bologna cattolica sapienza','nyulaw columbia stanford harvard berkeleylaw','toronto osgoode ubc mcgill queens'),
A_DEFENCE:_S('rsis nus ntu smu sutd','kcl oxford lse cranfield exeter','unibw hertie fub hub hamburg','bologna sapienza luiss padova trento','georgetown harvard princeton sais tufts','carleton toronto queens mcgill rmc'),
A_CRIM:_S('suss nus ntu smu sit','cambridge oxford lse kcl strathclyde','tuebingen hamburg fub goethe rub','bologna milan trento sapienza padova','upenn umd northeastern asu rutgers','sfu toronto ottawa carleton mcgill'),
// ---------- MEDICAL, HEALTH, SPORTS ----------
A_MED:_S('nus ntu dukenus sit suss','oxford cambridge imperial ucl edinburgh','charite heidelberg lmu tum freiburg','sapienza bologna milan padova pavia','harvard jhu stanford ucsf duke','toronto mcgill ubc mcmaster alberta'),
A_DENTAL:_S('nus ntu dukenus sit suss','kcl ucl dundee glasgow leeds','charite heidelberg lmu bonn freiburg','sapienza bologna milan padova pavia','umich upenn ucsf harvard nyu','toronto ubc mcgill alberta dalhousie'),
A_AYUSH:_S('nus ntu dukenus sit suss','oxford kcl ucl edinburgh lshtm','charite duisburgessen heidelberg lmu tum','sapienza bologna milan padova pavia','jhu harvard ucsf umd duke','toronto mcgill ubc mcmaster alberta'),
A_NURSING:_S('nus sit suss ntu dukenus','kcl manchester edinburgh southampton nottingham','witten charite halle duisburgessen freiburg','sapienza bologna milan padova pavia','jhu upenn ucsf duke umich','toronto ubc mcmaster mcgill alberta'),
A_PHYSIO:_S('nus sit ntu suss dukenus','kcl ucl manchester southampton nottingham','hsgbochum charite luebeck witten dshk','sapienza bologna milan padova pavia','usc pitt duke wustl emory','toronto mcmaster ubc mcgill queens'),
A_VET:_S('nus ntu sit temasek dukenus','rvc cambridge edinburgh glasgow liverpool','lmu fub hannovervet leipzig giessen','milan bologna padova turin federico2','cornell ucd colostate tamu uwmadison','guelph saskatchewan calgary montreal upei'),
A_ALLIED:_S('nus sit ntu suss dukenus','kcl manchester southampton ucl nottingham','charite heidelberg lmu tum witten','sapienza bologna milan padova pavia','jhu duke emory wustl ucsf','toronto mcmaster ubc mcgill alberta'),
A_NUTRITION:_S('nus sit ntu temasek suss','kcl reading leeds nottingham southampton','hohenheim tum bonn jena giessen','parma milan bologna padova gastronomic','harvard tufts cornell ucd unc','toronto mcgill ubc guelph alberta'),
A_PUBHEALTH:_S('nus ntu dukenus sit suss','lshtm oxford imperial ucl edinburgh','charite heidelberg bielefeld lmu tum','bocconi bologna milan padova sapienza','jhu harvard columbia unc emory','toronto mcgill ubc alberta montreal'),
A_SPORTS:_S('nie nus sit suss temasek','loughborough bath birmingham exeter leeds','dshk tum leipzig potsdam freiburg','foroitalico bologna milan padova verona','umich ucla psu unc ufl','waterloo mcmaster western ubc toronto'),
// ---------- PURE SCIENCES ----------
A_PHYSICS:_S('nus ntu sutd sit tumasia','cambridge oxford imperial ucl durham','lmu heidelberg tum goettingen bonn','sapienza padova bologna sissa normale','mit caltech stanford princeton harvard','toronto ubc mcgill waterloo queens'),
A_CHEMSCI:_S('nus ntu sutd sit tumasia','oxford cambridge imperial ucl manchester','tum lmu heidelberg kit rwth','padova bologna milan pisa sapienza','caltech mit berkeley harvard stanford','toronto ubc mcgill alberta waterloo'),
A_MATHSTAT:_S('nus ntu smu sutd sit','cambridge oxford imperial warwick ucl','bonn tum lmu heidelberg hub','sapienza normale padova pisa bologna','mit princeton harvard stanford berkeley','toronto waterloo ubc mcgill alberta')
};
const ABROAD_SET_NOTES={
A_MED:'Foreign medical degrees need the NMC licensing screening test (FMGE) before practising in India; seats for international students are very limited, especially in the US, Canada and the UK. Singapore has only three medical schools, so the last two Singapore slots are the nearest health-science universities.',
A_DENTAL:'Singapore’s only dental school is at NUS; remaining Singapore slots are the nearest health-science universities. Practising in India after a foreign BDS needs the licensing screening process.',
A_AYUSH:'AYUSH degrees are generally not licensed for clinical practice in these countries. The lists show strong universities for MSc/PhD routes (pharmacology, public health, nutrition, integrative-medicine research).',
A_VET:'Singapore has no veterinary school; the Singapore slots are the nearest life-science institutions. Foreign veterinary degrees need separate registration to practise in India.',
A_NURSING:'Nursing degree providers are few in Singapore and Germany, so those slots include the nearest health-science universities.',
A_LAW:'Foreign law degrees do not allow practice in India without Bar Council of India recognition; they suit global, corporate or LL.M. routes. Singapore has only 2–3 full law schools.',
A_CORPLAW:'Foreign law degrees do not allow practice in India without Bar Council of India recognition; they suit global, corporate or LL.M. routes.',
A_TEXTILE:'Dedicated textile-engineering programmes are rare outside the UK, Germany, Italy and the US; the Singapore slots are materials-science neighbours.',
A_MINING:'Mining programmes are concentrated in Germany, the UK, the US and Canada; the Singapore slots are the nearest earth/materials-science neighbours.',
A_SAFETY:'Fire and safety engineering is a niche abroad (strongest in the UK, Germany, US, Canada); the Singapore slots are nearest-fit engineering universities.',
A_AGRI:'Agriculture programmes are strongest in the UK, Germany, Italy, US and Canada; the Singapore slots are nearest-fit life-science universities.',
A_FOOD:'Singapore’s food-science options are limited; the final Singapore slots are applied-science institutions.',
A_FASHION:'Singapore’s fashion programmes sit in arts/design schools; the last two Singapore slots are nearest-fit design-oriented universities.',
A_ACTUARIAL:'Actuarial degrees are strongest in the UK, Germany, US and Canada; Singapore options are mainly maths/statistics/finance programmes that feed the actuarial exams.'
};

/* ---- Extra study-abroad sets (added for new branches) ---- */
Object.assign(ABROAD_SETS,{
A_JEWEL:_S('lasalle nafa ntu nus sutd','bcu rca ual gsa falmouth','pforzheim trierhs udk hfgoffenbach weissensee','polimi naba ied alchimia polimoda','gia risd fit pratt scad','ocad emilycarr nscad sheridan concordia'),
A_INDDESIGN:_S('sutd nus ntu lasalle nafa','rca imperial loughborough brunel coventry','kisd hfgoffenbach udk bauhaus tum','polimi iuav polito naba ied','artcenter risd rit gatech pratt','carleton ocad emilycarr sheridan concordia'),
A_PHOTO:_S('ntu lasalle nafa nus smu','rca ual falmouth westminster bournemouth','folkwang hfgoffenbach udk weissensee hannoverfh','naba ied iuav csc brera','risd rit scad artcenter parsons','ocad concordia tmu emilycarr sheridan'),
A_SOUND:_S('ystcm lasalle nafa nus ntu','surrey yorkuk ual ram rcm','hfmdetmold hmtmuc udk folkwang hanseisler','santacecilia milanconservatorio scalaacademy bologna naba','berklee nyu usc calarts juilliard','mcgill concordia ubc toronto montreal'),
A_URBAN:_S('nus sutd ntu sit smu','ucl lse sheffield cardiff newcastleuk','tudortmund tum tuberlin hcuhamburg bauhaus','polimi polito iuav sapienza florence','mit berkeley harvard columbia umich','ubc toronto mcgill waterloo dalhousie'),
A_CULINARY:_S('atsunrice sit temasek nus ntu','cordonbleulondon surrey oxfordbrookes leedsbeckett edinburghnapier','iu cbs reutlingen hohenheim tum','gastronomic alma icif parma bologna','cia jw cornell unlv msu','georgebrown niagara humber guelph tmu'),
A_AVIATION:_S('saa ntu sit nus smu','cranfield coventry westminster loughborough cityuk','frankfurtuas hsbremen iu tum rwth','polimi polito sapienza bologna federico2','erau purdue und ohiostate sjsu','mountroyal seneca carleton concordia toronto'),
A_REALESTATE:_S('nus ntu smu suss sit','reading cambridge ucl bayes oxfordbrookes','ebs tum tuberlin whu mannheim','polimi bocconi sapienza polito bologna','mit wharton columbia nyu usc','ubc toronto mcgill tmu yorkcanada'),
A_GEOLOGY:_S('ntu nus sit sutd tumasia','imperial oxford cambridge durham leeds','potsdam freiberg tum kiel bonn','milan padova bologna sapienza florence','stanford mit caltech berkeley columbia','ubc toronto alberta mcgill calgary'),
A_FORESTRY:_S('nus ntu sit sutd tumasia','bangor oxford edinburgh kent aberdeen','freiburg goettingen tum tudresden hnee','florence padova turin tuscia bologna','yale oregonstate duke umich uw','ubc toronto alberta laval unbc'),
A_MARINEBIO:_S('nus ntu sit sutd tumasia','southampton exeter plymouth bangor standrews','kiel hamburg rostock bremen oldenburg','bologna genoa padova univpm federico2','ucsd uw ucsb oregonstate duke','dalhousie memorial ubc uvic mcgill'),
A_MARINE:_S('sit newcastlesg ntu nus sutd','strathclyde southampton newcastleuk ucl plymouth','tuhh rostock tuberlin duisburgessen hsbremen','genoa trieste federico2 palermo polimi','umich mit berkeley vt webb','memorial dalhousie ubc toronto mcgill'),
A_OPTOM:_S('ngeeann nus ntu sit dukenus','aston cardiff cityuk manchester ulster','aalen ehsjena beuth tuebingen heidelberg','milanbicocca padova romatre bologna florence','berkeley ohiostate salus uab neco','waterloo montreal toronto ubc mcgill'),
A_SLP:_S('nus sit ntu suss dukenus','ucl kcl manchester cityuk reading','lmu rwth cologne potsdam bielefeld','padova bologna milan sapienza pavia','vanderbilt northwestern uwmadison purdue usc','toronto ubc mcgill western alberta')
});
Object.assign(ABROAD_SET_NOTES,{
A_OPTOM:'Optometry degree programmes are limited: Canada has only two schools, Singapore and Germany offer few degree options, so some slots are the nearest-fit health-science institutions.',
A_AVIATION:'Pilot licences are country-specific; a foreign CPL needs DGCA conversion to fly for Indian airlines. Singapore’s slot list is aviation-adjacent. Verify approved flight schools before enrolling.',
A_MARINE:'Maritime careers need DG Shipping-recognised qualifications for Indian seafarer certification; foreign degrees help for design, offshore and research roles.',
A_CULINARY:'Culinary programmes abroad are often vocational / private institutes; check accreditation and work-permit options.',
A_JEWEL:'Dedicated jewellery-design degrees are concentrated in the UK, Germany and the US; the Singapore slots are the nearest art / design schools.',
A_FORESTRY:'Forestry programmes are strongest in the UK, Germany, Italy, US and Canada; Singapore slots are nearest-fit environmental institutions.',
A_MARINEBIO:'Marine-science programmes are strongest in the UK, Germany, US and Canada; Singapore slots are nearest-fit universities.',
A_GEOLOGY:'Earth-science programmes are strongest in the UK, Germany, US and Canada; Singapore slots are nearest-fit institutions.',
A_URBAN:'Planning degrees are often master’s-level abroad; confirm accreditation (RTPI in the UK, PAB in the US).',
A_SLP:'Practising as a speech-language pathologist or audiologist abroad needs local licensing; confirm requirements before applying.'
});

/* ========== INDIAN INSTITUTIONS / FAMILIES: key -> [display name, example campuses, how to get in] ========== */
const _J='JEE Main via JoSAA';
const INDIA_INST={
// --- Engineering families ---
iit:['IITs (Indian Institutes of Technology)',['IIT Bombay','IIT Delhi','IIT Madras','IIT Kanpur','IIT Kharagpur'],'JEE Advanced via JoSAA'],
iit_ds:['IITs (data science / AI programmes)',['IIT Madras (BS Data Science)','IIT Guwahati (B.Tech DS & AI)','IIT Delhi','IIT Bombay','IIT Kharagpur'],'JEE Advanced via JoSAA (IIT Madras BS via its own qualifier)'],
iit_kb:['IIT Kharagpur & IIT (BHU) Varanasi (other IITs with Mining)',['IIT Kharagpur','IIT (BHU) Varanasi'],'JEE Advanced via JoSAA'],
iism:['IIT (ISM) Dhanbad',['IIT (Indian School of Mines) Dhanbad'],'JEE Advanced via JoSAA'],
nit:['NITs (National Institutes of Technology)',['NIT Tiruchirappalli','NIT Karnataka (Surathkal)','NIT Warangal','NIT Rourkela','NIT Calicut'],_J],
iiith:['IIIT Hyderabad',['IIIT Hyderabad'],'UGEE / JEE Main (institute counselling)'],
iiit:['IIITs (other Indian Institutes of Information Technology)',['IIIT Delhi','IIIT Bangalore','IIIT Allahabad','IIIT Gwalior','IIITDM Jabalpur'],'JEE Main (JoSAA or institute-specific counselling)'],
iisc:['IISc Bangalore',['Indian Institute of Science'],'UG programmes via JEE / NEET-UG routes (BS Research, B.Tech Maths & Computing)'],
bits:['BITS Pilani (Pilani, Goa, Hyderabad campuses)',['BITS Pilani','BITS Goa','BITS Hyderabad'],'BITSAT'],
dtu:['DTU & NSUT (Delhi)',['Delhi Technological University','Netaji Subhas University of Technology'],'JEE Main via JAC Delhi'],
jadavpur:['Jadavpur University, Kolkata',['Jadavpur University'],'WBJEE (engineering) / university entrance (arts & science)'],
iiest:['IIEST Shibpur',['Indian Institute of Engineering Science & Technology, Shibpur'],_J],
vit:['VIT Vellore (and other VIT campuses)',['VIT Vellore','VIT Chennai'],'VITEEE'],
coep:['COEP Technological University, Pune',['COEP Tech'],'MHT CET / JEE Main'],
vjti:['VJTI Mumbai',['Veermata Jijabai Technological Institute'],'MHT CET / JEE Main'],
anna:['Anna University, Chennai',['College of Engineering Guindy (CEG)','Madras Institute of Technology (MIT)','A.C. Tech'],'TNEA (Tamil Nadu counselling)'],
pec:['Punjab Engineering College (PEC), Chandigarh',['PEC Chandigarh'],_J],
manipal:['Manipal Institute of Technology (MAHE)',['MIT Manipal'],'MET / JEE Main'],
srm:['SRM Institute of Science & Technology',['SRM KTR','SRM Ramapuram'],'SRMJEEE'],
amrita:['Amrita Vishwa Vidyapeetham',['Amritapuri','Coimbatore','Bengaluru'],'AEEE / JEE Main'],
rvce:['RVCE, PES & BMSCE (Bengaluru)',['R V College of Engineering','PES University','BMS College of Engineering'],'KCET / COMEDK / PESSAT'],
hbtu:['Harcourt Butler Technical University, Kanpur',['HBTU Kanpur'],'JEE Main via UPTAC'],
ict:['Institute of Chemical Technology (ICT), Mumbai',['ICT Mumbai'],'MHT CET / JEE Main'],
lit:['Laxminarayan Institute of Technology (LIT), Nagpur',['LIT Nagpur (RTM Nagpur University)'],'MHT CET'],
iipe:['IIPE Visakhapatnam',['Indian Institute of Petroleum & Energy'],_J],
pdeu:['Pandit Deendayal Energy University, Gandhinagar',['PDEU'],'JEE Main / institute entrance'],
upes:['UPES Dehradun',['University of Petroleum & Energy Studies'],'UPESEAT / JEE Main'],
psg:['PSG College of Technology, Coimbatore',['PSG Tech'],'TNEA'],
iist:['IIST Thiruvananthapuram',['Indian Institute of Space Science & Technology'],'JEE Advanced (IIST admission)'],
hits:['Hindustan Institute of Technology & Science, Chennai',['HITS'],'HITSEEE / JEE Main'],
rgipt:['RGIPT, Jais (Rae Bareli)',['Rajiv Gandhi Institute of Petroleum Technology'],_J],
cipet:['CIPET (Central Institute of Petrochemicals Engineering & Technology)',['CIPET Chennai','CIPET Lucknow'],'CIPET admission test / entrance'],
iitdelhi:['IIT Delhi (Textile & Fibre Engineering)',['IIT Delhi'],'JEE Advanced via JoSAA'],
nitj:['NIT Jalandhar (Textile Technology)',['NIT Jalandhar'],_J],
msub:['The M.S. University of Baroda (Faculty of Technology & Engineering)',['MSU Baroda'],'GUJCET / JEE Main'],
dkte:['DKTE Society’s Textile & Engineering Institute, Ichalkaranji',['DKTE'],'MHT CET'],
kct:['Kumaraguru College of Technology, Coimbatore',['KCT'],'TNEA'],
bannari:['Bannari Amman Institute of Technology',['BIT Sathyamangalam'],'TNEA'],
nift:['NIFT (National Institute of Fashion Technology)',['NIFT Delhi','NIFT Mumbai','NIFT Bengaluru','NIFT Chennai'],'NIFT entrance exam'],
pearl:['Pearl Academy',['Delhi','Mumbai','Jaipur','Bengaluru'],'Pearl entrance / portfolio'],
sid:['Symbiosis Institute of Design (SID), Pune',['SID Pune'],'SEED (Symbiosis Entrance Exam for Design)'],
vogue:['Vogue Institute of Art & Design, Bengaluru',['Vogue Institute'],'Institute entrance / portfolio'],
jd:['JD Institute of Fashion Technology',['Delhi','Mumbai','Bengaluru'],'Institute entrance / portfolio'],
lpu:['Lovely Professional University, Phagwara',['LPU'],'LPUNEST / JEE Main'],
amity:['Amity University (Noida & other campuses)',['Amity Noida','Amity Mumbai'],'Amity JEE / CUET-UG (programme dependent)'],
niftem:['NIFTEM (National Institute of Food Technology, Entrepreneurship & Management)',['NIFTEM Kundli','NIFTEM-Thanjavur'],'JEE Main via JoSAA / CUET-UG'],
iitkgp:['IIT Kharagpur (Agricultural & Food Engineering)',['IIT Kharagpur'],'JEE Advanced via JoSAA'],
tnau:['Tamil Nadu Agricultural University (TNAU), Coimbatore',['TNAU'],'TNAU UG counselling / CUET-UG'],
pau:['Punjab Agricultural University (PAU), Ludhiana',['PAU'],'ICAR-linked entrance (CUET-UG) / PAU admission'],
gbpuat:['G.B. Pant University of Agriculture & Technology, Pantnagar',['GBPUAT'],'ICAR-linked entrance (CUET-UG) / state counselling'],
shuats:['SHUATS, Prayagraj',['Sam Higginbottom University'],'University entrance'],
kau:['Kerala Agricultural University (KAU)',['KAU Thrissur','KCAET Tavanur'],'KEAM / ICAR-linked entrance'],
mpkv:['Mahatma Phule Krishi Vidyapeeth, Rahuri',['MPKV'],'MHT CET / ICAR-linked entrance'],
jnkvv:['Jawaharlal Nehru Krishi Vishwa Vidyalaya, Jabalpur',['JNKVV'],'ICAR-linked entrance / state counselling'],
ccshau:['CCS Haryana Agricultural University, Hisar',['CCSHAU'],'ICAR-linked entrance / state counselling'],
pdkv:['Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Akola',['Dr. PDKV'],'MHT CET / ICAR-linked entrance'],
uasb:['University of Agricultural Sciences (UAS), Bengaluru',['UAS GKVK'],'KCET / ICAR-linked entrance'],
uasd:['University of Agricultural Sciences, Dharwad',['UAS Dharwad'],'KCET / ICAR-linked entrance'],
cskhpkv:['CSK Himachal Pradesh Krishi Vishvavidyalaya, Palampur',['CSKHPKV'],'ICAR-linked entrance / state counselling'],
skuast:['SKUAST (Jammu / Kashmir)',['SKUAST-Jammu','SKUAST-Kashmir'],'ICAR-linked entrance / state counselling'],
bhu_iag:['Banaras Hindu University (Institute of Agricultural Sciences)',['BHU IAS Varanasi'],'CUET-UG'],
bitsindri:['BIT Sindri (Dhanbad)',['Birsa Institute of Technology Sindri'],'JCECE / state counselling'],
ggv:['Guru Ghasidas Vishwavidyalaya, Bilaspur',['GGV Bilaspur'],'JEE Main / state counselling'],
gcekeonjhar:['Government College of Engineering, Keonjhar',['GCE Keonjhar'],'OJEE'],
jntuh:['JNTU Hyderabad',['JNTUH'],'TS EAMCET'],
mbm:['MBM Engineering College, Jodhpur',['MBM Jodhpur (JNVU)'],'REAP / JEE Main'],
osmania:['Osmania University (College of Engineering), Hyderabad',['OU Hyderabad'],'TS EAMCET'],
nfsc:['National Fire Service College (NFSC), Nagpur',['NFSC Nagpur'],'NFSC entrance (B.E. Fire Engineering)'],
rru:['Rashtriya Raksha University, Gandhinagar',['RRU'],'RRU entrance / CUET-UG'],
nfsu:['National Forensic Sciences University (NFSU), Gandhinagar',['NFSU Gandhinagar','NFSU Delhi'],'CUET-UG / NFSU entrance'],
// --- Commerce / management ---
srcc:['Shri Ram College of Commerce (SRCC), Delhi University',['SRCC'],'CUET-UG'],
du_commerce:['Delhi University commerce & economics colleges',['Hindu College','Hansraj College','Kirori Mal College','Ramjas College','Sri Venkateswara College'],'CUET-UG'],
du_arts:['Delhi University arts & humanities colleges',['St. Stephen’s College','Miranda House','Lady Shri Ram College','Hindu College','Ramjas College'],'CUET-UG'],
du_sci:['Delhi University science colleges',['St. Stephen’s College','Hindu College','Miranda House','Hansraj College','Ramjas College'],'CUET-UG'],
du_econ:['Delhi University economics (incl. Delhi School of Economics)',['St. Stephen’s College','SRCC','Hindu College','Lady Shri Ram College','Delhi School of Economics (PG)'],'CUET-UG / CUET-PG'],
du_edu:['Delhi University (Faculty of Education & Lady Shri Ram College)',['Faculty of Education','LSR (B.El.Ed)'],'CUET-UG / DU entrance'],
du_law:['Delhi University Faculty of Law',['Campus Law Centre','Law Centre-I & II'],'CUET-UG / DU LL.B. entrance'],
du_music:['Delhi University (Faculty of Music & Fine Arts)',['Faculty of Music & Fine Arts'],'CUET-UG / department entrance'],
mumbai_com:['Mumbai University commerce colleges',['H.R. College','Sydenham College','N.M. College','K.C. College'],'State CET / merit (university admission)'],
sxc:['St. Xavier’s colleges (Mumbai, Kolkata and others)',['St. Xavier’s Mumbai','St. Xavier’s Kolkata'],'College-specific merit / CUET-UG'],
christ:['Christ University, Bengaluru',['Christ (Deemed to be University)'],'Christ University entrance / CUET-UG'],
loyola:['Loyola College, Chennai',['Loyola College'],'Merit-based college admission'],
mcc:['Madras Christian College, Chennai',['MCC'],'Merit-based college admission'],
mountcarmel:['Mount Carmel College, Bengaluru',['Mount Carmel'],'Merit / college entrance'],
fergusson:['Fergusson College, Pune',['Fergusson College'],'Merit-based / CUET-UG'],
presidency:['Presidency University, Kolkata',['Presidency University'],'CUET-UG'],
symbiosis:['Symbiosis International University, Pune',['SSLA','SIBM','SIMC','SCMHRD','SLS Pune'],'SET / programme-specific tests'],
nmims:['NMIMS Mumbai',['Mukesh Patel School','Anil Surendra Modi School of Commerce','School of Branding & Advertising'],'NPAT / programme-specific entrance'],
flame:['FLAME University, Pune',['FLAME'],'FLAME admission (SAT/CUET accepted)'],
ashoka:['Ashoka University, Sonipat',['Ashoka'],'Ashoka admission (SAT / CUET accepted)'],
shivnadar:['Shiv Nadar Institution of Eminence, Delhi-NCR',['Shiv Nadar University'],'SNUSAT / JEE Main (programme dependent)'],
jindal:['O.P. Jindal Global University, Sonipat',['Jindal Global Law School','Jindal Global Business School','Jindal School of Government & Public Policy'],'LSAT-India / JSAT / programme-specific'],
iimipm:['IIM integrated programmes (IPM / BMS)',['IIM Indore IPM','IIM Rohtak IPM','IIM Bodh Gaya IPM','IIM Jammu IPM'],'IPMAT / JIPMAT'],
iift:['IIFT (Delhi / Kolkata)',['IIFT Delhi','IIFT Kolkata'],'IIFT entrance (MBA – International Business)'],
xlri:['XLRI Jamshedpur',['XLRI'],'XAT (PGDM-HRM / BM)'],
ximb:['XIM University, Bhubaneswar',['XIMB'],'XAT / CAT'],
mdi:['MDI Gurgaon',['Management Development Institute'],'CAT (PGDM)'],
isb:['Indian School of Business (ISB)',['ISB Hyderabad','ISB Mohali'],'GMAT / GRE (PGP)'],
fore:['FORE School of Management, Delhi',['FORE'],'CAT / GMAT (PGDM)'],
mica:['MICA, Ahmedabad',['MICA'],'CAT / MICAT (PGDM-C)'],
spjimr:['S.P. Jain Institute of Management & Research (SPJIMR)',['SPJIMR Mumbai'],'CAT / GMAT'],
sscbs:['Shaheed Sukhdev College of Business Studies (SSCBS), Delhi University',['SSCBS'],'CUET-UG'],
edii:['EDII Ahmedabad',['Entrepreneurship Development Institute of India'],'EDII entrance / CAT-linked programmes'],
iit_ent:['IIT incubators & e-cells (IIT Bombay SINE, IIT Madras Incubation Cell)',['IIT Bombay','IIT Madras','IIT Delhi'],'Entry via IIT admission (JEE) or incubator applications'],
iimmumbai:['IIM Mumbai (formerly NITIE)',['IIM Mumbai'],'CAT (PGDM – operations / supply chain)'],
iitb_sjmsom:['IIT Bombay (SJMSOM)',['SJMSOM'],'CAT / GATE-linked'],
vgsom:['IIT Kharagpur (Vinod Gupta School of Management)',['VGSoM'],'CAT'],
icai:['ICAI – Institute of Chartered Accountants of India (professional body; CA exams)',['CA Foundation','CA Intermediate','CA Final'],'CA Foundation after Class 12'],
icsi:['ICSI – Institute of Company Secretaries of India (professional body; CS exams)',['CSEET','CS Executive','CS Professional'],'CSEET after Class 12'],
icmai:['ICMAI – Institute of Cost Accountants of India (professional body; CMA exams)',['CMA Foundation','CMA Intermediate','CMA Final'],'CMA Foundation after Class 12'],
// --- Hospitality ---
ihm_nchm:['IHMs (NCHM-affiliated Institutes of Hotel Management)',['IHM Pusa Delhi','IHM Mumbai','IHM Bangalore','IHM Chennai','IHM Kolkata'],'NCHM JEE'],
wgsha:['WGSHA, Manipal (MAHE)',['Welcomgroup Graduate School of Hotel Administration'],'MAHE entrance (MET-linked)'],
bcihmct:['Banarsidas Chandiwala Institute of Hotel Management (BCIHMCT), Delhi',['BCIHMCT'],'CUET-UG / institute entrance'],
iihm:['IIHM (International Institute of Hotel Management)',['IIHM Kolkata','IIHM Delhi'],'IIHM entrance / merit'],
ocld:['Oberoi Centre of Learning & Development (OCLD), Delhi',['OCLD'],'Institute selection process'],
// --- Social sciences, humanities, education, media ---
tiss:['Tata Institute of Social Sciences (TISS)',['Mumbai','Hyderabad','Guwahati','Tuljapur'],'CUET-UG (UG) / TISS-NET (PG)'],
jnu:['Jawaharlal Nehru University (JNU), Delhi',['JNU'],'CUET-UG (languages) / CUET-PG'],
jamia:['Jamia Millia Islamia, Delhi',['Jamia'],'CUET-UG / university entrance'],
bhu:['Banaras Hindu University (BHU)',['BHU Varanasi'],'CUET-UG / university entrance'],
hcu:['University of Hyderabad',['UoH'],'CUET-UG / CUET-PG'],
ambedkar:['Ambedkar University Delhi (AUD)',['AUD'],'CUET-UG'],
apu:['Azim Premji University, Bengaluru',['APU'],'Azim Premji University entrance / CUET-UG'],
dsw:['Delhi School of Social Work (Delhi University)',['DSSW'],'CUET-PG / DU entrance'],
irma:['Institute of Rural Management Anand (IRMA)',['IRMA'],'CAT / XAT / GMAT'],
nirmala:['Nirmala Niketan College of Social Work, Mumbai',['Nirmala Niketan'],'University of Mumbai entrance'],
krea:['Krea University, Sri City',['Krea'],'Krea admission (SAT / CUET accepted)'],
eflu:['EFLU (English & Foreign Languages University), Hyderabad',['EFLU'],'CUET-UG / EFLU entrance'],
deccan:['Deccan College Post-Graduate & Research Institute, Pune',['Deccan College'],'CUET-PG / institute entrance'],
rie:['NCERT Regional Institutes of Education (RIEs)',['RIE Ajmer','RIE Bhopal','RIE Bhubaneswar','RIE Mysuru'],'NCET (Integrated Teacher Education Programme)'],
iimc:['IIMC (Indian Institute of Mass Communication)',['IIMC Delhi','IIMC Dhenkanal','IIMC Aizawl','IIMC Amravati'],'IIMC entrance test (PG diploma)'],
acj:['Asian College of Journalism (ACJ), Chennai',['ACJ'],'ACJ admission test (PG)'],
ajkmcrc:['AJK Mass Communication Research Centre, Jamia',['AJK MCRC'],'Jamia entrance'],
simc:['Symbiosis Institute of Media & Communication (SIMC), Pune',['SIMC'],'SET (media)'],
xic:['Xavier Institute of Communications (XIC), Mumbai',['XIC'],'XIC entrance'],
mic:['Manipal Institute of Communication (MAHE)',['MIC'],'MAHE entrance'],
ftii:['Film and Television Institute of India (FTII), Pune',['FTII'],'FTII JET / SAT'],
srfti:['Satyajit Ray Film & Television Institute (SRFTI), Kolkata',['SRFTI'],'SRFTI JET'],
whistlingwoods:['Whistling Woods International, Mumbai',['Whistling Woods'],'Institute entrance / audition'],
krnnivsa:['K.R. Narayanan National Institute of Visual Science & Arts, Kottayam',['KRNNIVSA'],'Institute entrance'],
lvprasad:['L.V. Prasad Film & TV Academy, Chennai',['LV Prasad'],'Institute entrance'],
annapurna:['Annapurna International School of Film & Media, Hyderabad',['Annapurna'],'Institute entrance'],
nimhans:['NIMHANS, Bengaluru',['NIMHANS'],'NIMHANS entrance (PG clinical psychology / mental health)'],
// --- Arts, design, architecture ---
msub_fa:['M.S. University of Baroda (Faculty of Fine Arts)',['MSU Baroda'],'University entrance (portfolio / drawing test)'],
jj:['Sir J.J. School of Art, Mumbai',['JJ School of Art'],'MH-CET (fine arts)'],
visvabharati:['Visva-Bharati (Santiniketan)',['Kala Bhavana','Sangit Bhavana'],'CUET-UG / university entrance'],
coa_delhi:['College of Art, New Delhi',['College of Art'],'University entrance (portfolio)'],
gcacc:['Government College of Art & Craft, Kolkata',['GCAC'],'University entrance'],
gcfa:['Government College of Fine Arts, Chennai',['GCFA'],'University entrance (portfolio)'],
chitrakala:['Karnataka Chitrakala Parishath, Bengaluru',['Chitrakala Parishath'],'University entrance'],
srishti:['Srishti Manipal Institute of Art, Design & Technology, Bengaluru',['Srishti'],'Srishti entrance / portfolio'],
nid:['NID (National Institute of Design)',['NID Ahmedabad','NID Bengaluru','NID Gandhinagar','NID Kurukshetra'],'NID DAT (B.Des)'],
iit_design:['IITs (design departments)',['IDC School of Design, IIT Bombay','IIT Guwahati','IIT Delhi','IIT Hyderabad'],'UCEED (B.Des) / CEED (M.Des)'],
mitid:['MIT Institute of Design (MIT-ID), Pune',['MIT-ID'],'MIT-ID entrance'],
uid:['Unitedworld Institute of Design (UID), Gandhinagar',['UID'],'UID entrance'],
iiad:['Indian Institute of Art & Design (IIAD), Delhi',['IIAD'],'IIAD entrance / portfolio'],
iiitdm:['IIITDM (Design & Manufacturing institutes)',['IIITDM Jabalpur','IIITDM Kancheepuram'],'JEE Main / UCEED via JoSAA'],
iiit_hcd:['IIIT Delhi (Human-Centred Design)',['IIIT Delhi'],'JEE Main / institute counselling'],
iisc_cpdm:['IISc Bangalore (Centre for Product Design & Manufacturing)',['IISc CPDM'],'GATE / CEED (PG)'],
icat:['ICAT Design & Media College, Bengaluru',['ICAT'],'Institute entrance / portfolio'],
toonskool:['Toonskool, Bengaluru',['Toonskool'],'Institute entrance / portfolio'],
cept:['CEPT University, Ahmedabad',['Faculty of Architecture','Faculty of Design'],'NATA / JEE Main Paper 2 / CEPT entrance'],
jjarch:['Sir J.J. College of Architecture, Mumbai',['JJ College of Architecture'],'NATA + MH-CET'],
rachana:['Rachana Sansad Academy of Architecture, Mumbai',['Rachana Sansad'],'NATA + MH-CET'],
iitarch:['IITs (B.Arch: IIT Kharagpur, IIT Roorkee)',['IIT Kharagpur','IIT Roorkee'],'JEE Main Paper 2 + JEE Advanced (AAT)'],
spa:['SPAs (Schools of Planning & Architecture)',['SPA Delhi','SPA Bhopal','SPA Vijayawada'],'JEE Main Paper 2'],
nitarch:['NITs (B.Arch)',['NIT Calicut','NIT Trichy','MNIT Jaipur','NIT Patna'],'JEE Main Paper 2 via JoSAA'],
sap_anna:['Anna University – School of Architecture & Planning, Chennai',['SAP Anna University'],'NATA / TNEA'],
cca:['Chandigarh College of Architecture',['CCA Chandigarh'],'NATA / JEE Main Paper 2'],
msap:['Manipal School of Architecture & Planning (MAHE)',['MSAP'],'NATA / MAHE entrance'],
nsd:['National School of Drama (NSD), Delhi',['NSD'],'NSD entrance (audition)'],
kalakshetra:['Kalakshetra Foundation, Chennai',['Kalakshetra'],'Institute audition'],
kmmc:['KM Music Conservatory, Chennai',['KMMC'],'Institute audition'],
bhatkhande:['Bhatkhande Music Institute University, Lucknow',['Bhatkhande'],'University entrance (audition)'],
ikskv:['Indira Kala Sangit Vishwavidyalaya, Khairagarh',['IKSV'],'University entrance (audition)'],
sp_pune:['Savitribai Phule Pune University (Lalit Kala Kendra)',['Lalit Kala Kendra'],'University entrance (audition)'],
// --- Law, defence, public service ---
nlsiu:['National Law School of India University (NLSIU), Bengaluru',['NLSIU'],'CLAT'],
nlus:['Other top NLUs',['NALSAR Hyderabad','NLU Delhi','NLU Jodhpur','WBNUJS Kolkata','GNLU Gandhinagar'],'CLAT (NLU Delhi: AILET)'],
jgls:['Jindal Global Law School (Sonipat)',['JGLS'],'LSAT-India / JSAT'],
sls_pune:['Symbiosis Law School, Pune',['SLS Pune'],'SLAT'],
ils:['ILS Law College, Pune',['ILS'],'MH-CET (law)'],
gls_mumbai:['Government Law College, Mumbai',['GLC Mumbai'],'MH-CET (law)'],
nirma_law:['Institute of Law, Nirma University, Ahmedabad',['Nirma Law'],'CLAT / institute entrance'],
iitkgp_rgsoipl:['IIT Kharagpur – Rajiv Gandhi School of Intellectual Property Law',['RGSOIPL'],'CLAT / LL.B. entrance'],
lbsnaa:['LBSNAA, Mussoorie (training academy after selection)',['Lal Bahadur Shastri National Academy of Administration'],'Post-selection (UPSC Civil Services)'],
iipa:['Indian Institute of Public Administration (IIPA), Delhi',['IIPA'],'IIPA entrance (PG)'],
iit_hss:['IITs (humanities & policy departments)',['IIT Delhi','IIT Kanpur','IIT Madras'],'JEE / department entrance'],
nda:['National Defence Academy (NDA), Khadakwasla',['NDA Pune'],'UPSC NDA (after Class 12)'],
ima:['Indian Military Academy (IMA), Dehradun',['IMA'],'UPSC CDS / NDA / TES / UES'],
ina:['Indian Naval Academy, Ezhimala',['INA'],'UPSC NDA / CDS / INET'],
afa:['Air Force Academy, Dundigal',['AFA'],'UPSC NDA / CDS / AFCAT'],
ota:['Officers Training Academy (OTA), Chennai',['OTA'],'UPSC CDS (short service)'],
afmc:['Armed Forces Medical College (AFMC), Pune',['AFMC'],'NEET-UG + AFMC selection'],
cme:['College of Military Engineering (CME), Pune',['CME'],'Service entry (TES / UES / DSSC)'],
mcte:['Military College of Telecommunication Engineering (MCTE), Mhow',['MCTE'],'Service entry'],
mceme:['College of Electronics & Mechanical Engineering (MCEME), Secunderabad',['MCEME'],'Service entry'],
diat:['DIAT Pune (Defence Institute of Advanced Technology)',['DIAT'],'GATE / DIAT entrance (PG)'],
nicfs:['LNJN National Institute of Criminology & Forensic Science, Delhi',['NICFS'],'NICFS entrance (PG)'],
dhgu:['Dr. Harisingh Gour University, Sagar',['Dept. of Criminology & Forensic Science'],'CUET-UG / CUET-PG'],
madras_univ:['University of Madras (Department of Criminology)',['University of Madras'],'University entrance'],
// --- Pure sciences ---
iisc:['IISc Bangalore',['Indian Institute of Science'],'UG programmes via JEE / NEET-UG routes (BS Research, B.Tech Maths & Computing)'],
iiser:['IISERs (Indian Institutes of Science Education & Research)',['IISER Pune','IISER Kolkata','IISER Mohali','IISER Bhopal','IISER Thiruvananthapuram'],'IISER Aptitude Test (IAT) / JEE Advanced / NEET-UG'],
niser:['NISER Bhubaneswar',['NISER'],'NEST'],
cmi:['Chennai Mathematical Institute (CMI)',['CMI'],'CMI entrance exam'],
isi:['Indian Statistical Institute (ISI)',['ISI Kolkata','ISI Delhi','ISI Bangalore'],'ISI admission test (B.Stat / B.Math)'],
iit_sci:['IITs (science departments: BS / M.Sc.)',['IIT Bombay','IIT Madras','IIT Delhi','IIT Kanpur'],'IIT JAM / JEE (programme dependent)'],
teri:['TERI School of Advanced Studies, New Delhi',['TERI SAS'],'TERI entrance / CUET-PG'],
wii:['Wildlife Institute of India (WII), Dehradun',['WII'],'Institute entrance (PG)'],
// --- Medical & health ---
aiims:['AIIMS (All India Institutes of Medical Sciences)',['AIIMS Delhi','AIIMS Jodhpur','AIIMS Bhubaneswar','AIIMS Rishikesh'],'NEET-UG (MBBS / B.Sc. Nursing & Allied)'],
jipmer:['JIPMER (Puducherry / Karaikal)',['JIPMER Puducherry'],'NEET-UG'],
mamc:['Maulana Azad Medical College (MAMC), Delhi',['MAMC'],'NEET-UG'],
cmcv:['Christian Medical College (CMC), Vellore',['CMC Vellore'],'NEET-UG + CMC selection'],
kem:['Seth G.S. Medical College & KEM Hospital, Mumbai',['GSMC & KEM'],'NEET-UG'],
grant:['Grant Medical College & Sir J.J. Hospitals, Mumbai',['Grant Medical College'],'NEET-UG'],
mmc:['Madras Medical College, Chennai',['MMC'],'NEET-UG'],
kgmu:['King George’s Medical University (KGMU), Lucknow',['KGMU'],'NEET-UG'],
maids:['Maulana Azad Institute of Dental Sciences (MAIDS), Delhi',['MAIDS'],'NEET-UG'],
mcods:['Manipal College of Dental Sciences (MAHE)',['Manipal','Mangalore'],'NEET-UG'],
saveetha:['Saveetha Dental College, Chennai',['Saveetha'],'NEET-UG'],
gdch:['Government Dental College & Hospital, Mumbai',['GDCH'],'NEET-UG'],
nair:['Nair Hospital Dental College, Mumbai',['Nair Dental'],'NEET-UG'],
abshetty:['A.B. Shetty Memorial Institute of Dental Sciences, Mangaluru',['ABSMIDS (NITTE)'],'NEET-UG'],
dypatil_dental:['Dr. D.Y. Patil Dental College, Pune',['DY Patil Dental'],'NEET-UG'],
jss:['JSS Academy of Higher Education & Research (Mysuru / Ooty)',['JSS Dental College','JSS College of Pharmacy'],'NEET-UG / JSS entrance'],
aiia:['All India Institute of Ayurveda (AIIA), Delhi',['AIIA'],'NEET-UG (BAMS)'],
nia:['National Institute of Ayurveda (NIA), Jaipur',['NIA'],'NEET-UG (BAMS)'],
gau:['Gujarat Ayurved University, Jamnagar',['GAU'],'NEET-UG (BAMS)'],
tilak:['Tilak Ayurved Mahavidyalaya, Pune',['Tilak Ayurved'],'NEET-UG (BAMS)'],
gac_tvm:['Government Ayurveda College, Thiruvananthapuram',['GAC TVM'],'NEET-UG (BAMS)'],
nih:['National Institute of Homoeopathy (NIH), Kolkata',['NIH'],'NEET-UG (BHMS)'],
ajmal:['Ajmal Khan Tibbiya College (AMU), Aligarh',['AKTC'],'NEET-UG (BUMS)'],
nium:['National Institute of Unani Medicine (NIUM), Bengaluru',['NIUM'],'NEET-UG (BUMS)'],
sdm_naturo:['SDM College of Naturopathy & Yogic Sciences, Ujire',['SDM Ujire'],'University entrance (BNYS)'],
rkcon:['Rajkumari Amrit Kaur College of Nursing, Delhi',['RAK CON'],'Delhi University nursing entrance'],
pgimer:['PGIMER, Chandigarh',['PGIMER'],'NEET / PGIMER entrance'],
armyson:['Army College of Nursing / AFMC College of Nursing',['Army College of Nursing Jalandhar','CON AFMC Pune'],'NEET-UG / military nursing selection'],
manipal_mchp:['Manipal College of Health Professions (MAHE)',['MCHP'],'MAHE entrance (MET)'],
manipal_nursing:['Manipal College of Nursing (MAHE)',['MCON Manipal'],'MAHE entrance'],
stjohns_nursing:['St. John’s College of Nursing, Bengaluru',['St. John’s'],'KEA / college entrance'],
cmcl:['Christian Medical College, Ludhiana',['CMC Ludhiana'],'NEET-UG + CMC selection'],
jamiahamdard:['Jamia Hamdard, Delhi',['Jamia Hamdard'],'CUET-UG / university entrance'],
sriramachandra:['Sri Ramachandra Institute of Higher Education & Research, Chennai',['SRIHER'],'Institute entrance / NEET-UG'],
dmimer:['Datta Meghe Institute (DMIHER), Wardha',['Ravi Nair College of Physiotherapy'],'Institute entrance'],
dypatil:['D.Y. Patil Vidyapeeth, Pune',['DY Patil'],'Institute entrance / NEET-UG'],
symbiosis_health:['Symbiosis School of Health Sciences, Pune',['SSHS'],'SET (health sciences)'],
niper:['NIPERs (National Institutes of Pharmaceutical Education & Research)',['NIPER Mohali','NIPER Hyderabad','NIPER Ahmedabad'],'NIPER JEE (M.Pharm / MS, postgraduate route)'],
panjabuniv:['Panjab University (UIPS), Chandigarh',['UIPS'],'CUET-UG / university entrance'],
bhu_pharma:['IIT (BHU) / BHU Pharmacy, Varanasi',['IIT (BHU) Pharmaceutical Engg & Tech','BHU Pharmacy'],'JEE Advanced / CUET-UG'],
poonapharma:['Poona College of Pharmacy (Bharati Vidyapeeth)',['PCP Pune'],'MHT CET'],
dipsar:['DIPSAR, Delhi',['Delhi Institute of Pharmaceutical Sciences & Research'],'CUET-UG / DPSRU entrance'],
mcops:['Manipal College of Pharmaceutical Sciences (MAHE)',['MCOPS'],'MAHE entrance (MET)'],
ladyirwin:['Lady Irwin College (Delhi University)',['Lady Irwin College'],'CUET-UG'],
ihe:['Institute of Home Economics (Delhi University)',['IHE'],'CUET-UG'],
avinashilingam:['Avinashilingam Institute for Home Science & Higher Education for Women, Coimbatore',['Avinashilingam'],'Institute entrance / merit'],
sndt:['SNDT Women’s University, Mumbai',['SNDT'],'University entrance (state CET)'],
msub_fcs:['M.S. University of Baroda (Family & Community Sciences)',['MSU Baroda'],'University entrance'],
nirmalaniketan:['Nirmala Niketan College of Home Science, Mumbai',['Nirmala Niketan'],'University of Mumbai entrance'],
iihmr:['IIHMR University, Jaipur',['IIHMR'],'IIHMR entrance / CAT-linked'],
iiph:['IIPHs (Indian Institutes of Public Health)',['IIPH Gandhinagar','IIPH Delhi','IIPH Hyderabad'],'IIPH entrance (PG)'],
prasanna:['Manipal Prasanna School of Public Health (MAHE)',['MPSPH'],'MAHE entrance'],
sctimst:['SCTIMST (Achutha Menon Centre for Health Science Studies), Thiruvananthapuram',['AMCHSS'],'Institute entrance (PG)'],
nihfw:['NIHFW (National Institute of Health & Family Welfare), Delhi',['NIHFW'],'Institute entrance (PG)'],
nsu:['National Sports University (NSU), Imphal',['NSU Manipur'],'NSU entrance / CUET-UG'],
lnipe:['LNIPE Gwalior (Lakshmibai National Institute of Physical Education)',['LNIPE'],'LNIPE entrance'],
nsnis:['NSNIS Patiala (Netaji Subhas National Institute of Sports)',['NSNIS'],'NSNIS entrance'],
tnpesu:['Tamil Nadu Physical Education & Sports University, Chennai',['TNPESU'],'TNPESU entrance'],
panjabuniv_pe:['Panjab University (Dept. of Physical Education)',['Panjab University'],'University entrance'],
// veterinary
tanuvas:['Madras Veterinary College (TANUVAS), Chennai',['MVC'],'NEET-UG / TANUVAS counselling'],
gadvasu:['GADVASU, Ludhiana',['College of Veterinary Science'],'NEET-UG'],
kvafsu:['Veterinary College Bengaluru (KVAFSU)',['KVAFSU'],'NEET-UG'],
luvas:['LUVAS, Hisar',['Lala Lajpat Rai University of Veterinary & Animal Sciences'],'NEET-UG'],
mafsu:['MAFSU (Nagpur / Mumbai veterinary colleges)',['Nagpur Veterinary College','Mumbai Veterinary College'],'NEET-UG'],
duvasu:['DUVASU, Mathura',['Pt. Deen Dayal Upadhyaya Veterinary University'],'NEET-UG'],
svvu:['Sri Venkateswara Veterinary University, Tirupati',['SVVU'],'NEET-UG'],
kvasu:['Kerala Veterinary & Animal Sciences University, Pookode',['KVASU'],'NEET-UG'],
wbuafs:['West Bengal University of Animal & Fishery Sciences, Kolkata',['WBUAFS'],'NEET-UG'],
ivri:['ICAR-IVRI, Izatnagar',['Indian Veterinary Research Institute'],'ICAR AIEEA-PG / PhD (postgraduate route)'],
// Extra
giaindia:['GIA India (Gemological Institute of America), Mumbai',['GIA Mumbai'],'GIA admission (diploma / certificate)'],
iigj:['Indian Institute of Gems & Jewellery (IIGJ)',['IIGJ Mumbai','IIGJ Jaipur'],'Institute entrance'],
ici:['Indian Culinary Institute (ICI)',['ICI Noida','ICI Tirupati'],'NCHM JEE'],
cai:['Culinary Academy of India (CAI), Hyderabad',['CAI'],'Institute entrance'],
iittm:['IITTM (Indian Institute of Tourism & Travel Management)',['IITTM Gwalior','IITTM Noida','IITTM Nellore'],'IITTM entrance / CUET-UG'],
pondy:['Pondicherry University',['Pondicherry University'],'CUET-UG / CUET-PG'],
frankfinn:['Frankfinn Institute of Air Hostess Training',['Frankfinn'],'Institute selection (certificate / diploma)'],
cu_chd:['Chandigarh University',['CU Mohali'],'CUCET / merit'],
bvp:['Bharati Vidyapeeth (Aviation / Management programmes)',['Bharati Vidyapeeth Pune'],'Institute entrance'],
nicmar:['NICMAR University, Pune',['NICMAR Pune','NICMAR Hyderabad'],'Institute entrance / CAT-MAT (PG)'],
rics_sbe:['RICS School of Built Environment, Amity University',['RICS SBE Noida','RICS SBE Mumbai'],'Amity entrance / CAT-MAT (PG)'],
igrua:['Indira Gandhi Rashtriya Uran Akademi (IGRUA), Rae Bareli',['IGRUA'],'IGRUA entrance test'],
nfti:['National Flying Training Institute (NFTI), Gondia',['NFTI'],'NFTI selection'],
rgaat:['Rajiv Gandhi Academy for Aviation Technology (RGAAT), Thiruvananthapuram',['RGAAT'],'Institute selection'],
bfc:['Bombay Flying Club',['Bombay Flying Club'],'DGCA-approved flying-training admission'],
hica:['Haryana Institute of Civil Aviation (HICA), Hisar',['HICA'],'DGCA-approved flying-training admission'],
mpfc:['Madhya Pradesh Flying Club, Indore',['MP Flying Club'],'DGCA-approved flying-training admission'],
gfc:['Gujarat Flying Club (Vadodara / Ahmedabad)',['Gujarat Flying Club'],'DGCA-approved flying-training admission'],
chimes:['CHIMES Aviation Academy',['CHIMES'],'DGCA-approved flying-training admission'],
dfc:['Delhi Flying Club',['Delhi Flying Club'],'DGCA-approved flying-training admission'],
gfts:['Government Flying Training School, Bengaluru',['GFTS Jakkur'],'DGCA-approved flying-training admission'],
sathyabama:['Sathyabama Institute of Science & Technology, Chennai',['Sathyabama'],'SAEEE / institute entrance'],
bharath:['Bharath Institute of Higher Education & Research, Chennai',['BIHER'],'BEEE / institute entrance'],
iare:['Institute of Aeronautical Engineering (IARE), Hyderabad',['IARE'],'TS EAMCET / institute entrance'],
veltech:['Vel Tech Rangarajan Dr. Sagunthala R&D Institute, Chennai',['Vel Tech'],'VTUEEE / institute entrance'],
imu:['IMU (Indian Maritime University)',['IMU Chennai','IMU Kochi','IMU Mumbai Port','IMU Visakhapatnam','IMU Kolkata'],'IMU-CET'],
tschanakya:['T.S. Chanakya, Navi Mumbai',['TS Chanakya'],'IMU-CET / institute selection (DG Shipping approved)'],
tmi:['Tolani Maritime Institute, Pune',['TMI'],'IMU-CET / institute selection'],
meri:['Marine Engineering & Research Institute (MERI), Mumbai / Kolkata',['MERI'],'IMU-CET / institute selection'],
amet:['AMET University, Chennai',['AMET'],'AMET entrance / IMU-CET'],
himt:['Hindustan Institute of Maritime Training (HIMT), Chennai',['HIMT'],'Institute selection'],
samundra:['Samundra Institute of Maritime Studies, Lonavala',['Samundra'],'Institute selection'],
manet:['Maharashtra Academy of Naval Education & Training (MANET), Pune',['MANET'],'Institute selection'],
itme:['Institute of Technology & Marine Engineering (ITME), Kolkata',['ITME'],'Institute selection'],
geims:['Great Eastern Institute of Maritime Studies (GEIMS), Lonavala',['GEIMS'],'Institute selection'],
iit_oe:['IITs (Ocean Engineering & Naval Architecture: IIT Madras, IIT Kharagpur)',['IIT Madras','IIT Kharagpur'],'JEE Advanced via JoSAA'],
cusat:['Cochin University of Science & Technology (CUSAT)',['CUSAT Kochi'],'KEAM / CUSAT CAT'],
andhra_au:['Andhra University College of Engineering, Visakhapatnam',['AU College of Engineering'],'AP EAPCET'],
iit_plan:['IITs (M.Plan / urban planning: IIT Kharagpur, IIT Roorkee) – postgraduate route',['IIT Kharagpur','IIT Roorkee'],'GATE / CEED (postgraduate)'],
iirs:['IIRS Dehradun (Indian Institute of Remote Sensing)',['IIRS'],'Institute selection (PG diploma / M.Tech)'],
fri:['Forest Research Institute (FRI) University, Dehradun',['FRI Dehradun'],'CUET-UG / FRI admission'],
iifm:['Indian Institute of Forest Management (IIFM), Bhopal',['IIFM'],'CAT / XAT (PG management)'],
yspuhf:['Dr. Y.S. Parmar University of Horticulture & Forestry, Nauni',['YSPUHF'],'University entrance / CUET-UG'],
cife:['ICAR-CIFE, Mumbai',['Central Institute of Fisheries Education'],'ICAR AIEEA-PG (postgraduate)'],
cmfri:['ICAR-CMFRI, Kochi',['Central Marine Fisheries Research Institute'],'ICAR-linked PG / research programmes'],
kufos:['Kerala University of Fisheries & Ocean Studies (KUFOS), Kochi',['KUFOS'],'KEAM / university entrance'],
tnjfu:['Tamil Nadu Dr. J. Jayalalithaa Fisheries University, Nagapattinam',['TNJFU'],'TNJFU counselling'],
annamalai:['Annamalai University (Marine Biology), Parangipettai',['Annamalai University'],'University entrance'],
goauniv:['Goa University (Marine Sciences)',['Goa University'],'CUET-UG / CUET-PG'],
mangaloreuniv:['Mangalore University (Marine Biology)',['Mangalore University'],'University entrance'],
lvpei:['L V Prasad Eye Institute (Bausch & Lomb School of Optometry), Hyderabad',['LVPEI'],'LVPEI entrance'],
eliteoptom:['Elite School of Optometry, Chennai',['Elite School of Optometry'],'Institute entrance'],
aravind:['Aravind Eye Care System (Optometry), Madurai',['Aravind'],'Institute entrance'],
aiipmr:['All India Institute of Physical Medicine & Rehabilitation (AIIPMR), Mumbai',['AIIPMR'],'State CET / institute admission'],
tnmc:['T.N. Medical College & B.Y.L. Nair Hospital (OT School), Mumbai',['TNMC Mumbai'],'State CET / institute admission'],
aiish:['AIISH Mysuru (All India Institute of Speech & Hearing)',['AIISH'],'AIISH entrance (BASLP)'],
ayjnishd:['AYJNISHD Mumbai (Ali Yavar Jung National Institute of Speech & Hearing Disabilities)',['AYJNISHD'],'Institute entrance'],
drsrc:['Dr. S.R. Chandrasekhar Institute of Speech & Hearing, Bengaluru',['SRCISH'],'Institute entrance']
};

/* ========== INDIA SETS: top 10 per field, ranked; college families (IITs, NITs, ...) share ONE slot ========== */
const _ss=s=>s.split(' ');
const _COM='srcc du_commerce mumbai_com sxc christ nmims loyola mcc presidency symbiosis';
const INDIA_SETS={
// Engineering & technology
IN_CS:_ss('iit iiith bits nit iiit dtu jadavpur vit coep manipal'),
IN_CYBER:_ss('iit iiith nfsu bits nit iiit dtu amrita vit manipal'),
IN_AI:_ss('iit_ds iiith iisc bits nit iiit isi dtu shivnadar vit'),
IN_DATA:_ss('iit_ds iiith isi cmi bits iiit dtu shivnadar nmims vit'),
IN_ECE:_ss('iit iiith bits nit iiit dtu jadavpur iiest anna rvce'),
IN_ELEC:_ss('iit nit bits iiest jadavpur dtu anna coep vjti pec'),
IN_MECH:_ss('iit nit bits jadavpur iiest dtu anna coep vjti pec'),
IN_AUTO:_ss('iit nit bits anna coep vjti dtu manipal vit srm'),
IN_MFG:_ss('iit nit bits dtu jadavpur anna coep vjti pec iiest'),
IN_ROBO:_ss('iit iiith bits nit iiit dtu vit amrita manipal srm'),
IN_CIVIL:_ss('iit nit bits iiest jadavpur anna coep vjti dtu pec'),
IN_CHEM:_ss('iit ict nit bits anna jadavpur dtu hbtu lit vit'),
IN_PETRO:_ss('iit ict iipe nit bits pdeu upes anna hbtu jadavpur'),
IN_SPECCHEM:_ss('ict iit hbtu nit bits anna jadavpur dtu lit vit'),
IN_BIOTECH:_ss('iit nit bits anna dtu ict vit manipal srm amrita'),
IN_BME:_ss('iit nit bits manipal vit srm amrita anna dtu psg'),
IN_TEXTILE:_ss('ict iitdelhi vjti nitj psg anna msub dkte kct hbtu'),
IN_FASHION:_ss('nift psg pearl sid bannari kct amity jd lpu vogue'),
IN_FOOD:_ss('niftem iitkgp ict tnau pau hbtu anna srm shuats lpu'),
IN_MATERIALS:_ss('iit nit iiest jadavpur bits ict hbtu cipet anna vit'),
IN_AERO:_ss('iit iist anna iiest pec manipal srm upes rvce hits'),
IN_AGRIENG:_ss('iitkgp tnau pau gbpuat kau mpkv jnkvv ccshau pdkv shuats'),
IN_AGRISCI:_ss('pau tnau gbpuat uasb bhu_iag kau uasd ccshau cskhpkv skuast'),
IN_MINING:_ss('iism iit_kb iiest nit bitsindri ggv gcekeonjhar jntuh mbm osmania'),
IN_SAFETY:_ss('nfsc upes pdeu rru iit nit anna rgipt iipe vit'),
// Commerce & management
IN_COMMERCE:_ss(_COM),
IN_CA:['icai',..._ss(_COM).slice(0,9)],
IN_CSEC:['icsi',..._ss(_COM).slice(0,9)],
IN_CMA:['icmai',..._ss(_COM).slice(0,9)],
IN_FINMKT:_ss('srcc nmims iimipm flame ashoka christ sxc du_commerce symbiosis mumbai_com'),
IN_ACTUARIAL:_ss('isi nmims sxc symbiosis christ du_sci presidency ashoka mcc loyola'),
IN_ECON:_ss('du_econ isi presidency ashoka jnu christ shivnadar flame symbiosis sxc'),
IN_BBA:_ss('iimipm nmims sscbs srcc symbiosis christ flame jindal sxc mumbai_com'),
IN_MARKETING:_ss('mica nmims iimipm symbiosis flame christ srcc sscbs sxc iift'),
IN_HR:_ss('xlri tiss iimipm symbiosis nmims ximb mdi flame christ sscbs'),
IN_ENTREP:_ss('iimipm isb edii iit_ent flame ashoka nmims symbiosis christ shivnadar'),
IN_INTLBIZ:_ss('iift iimipm srcc nmims symbiosis christ flame jindal sscbs fore'),
IN_SCM:_ss('iimmumbai iimipm iitb_sjmsom vgsom nmims symbiosis spjimr mdi upes christ'),
IN_BIZANALYTICS:_ss('iimipm isi iit_ds nmims shivnadar ashoka christ symbiosis flame srcc'),
IN_HOSP:_ss('ihm_nchm wgsha bcihmct christ symbiosis amity iihm lpu ocld srm'),
// Humanities, social sciences, education, media
IN_PSYCH:_ss('du_arts christ tiss nimhans ambedkar ashoka sxc mountcarmel fergusson symbiosis'),
IN_SOCIOLOGY:_ss('du_arts jnu tiss presidency ashoka hcu ambedkar sxc christ bhu'),
IN_DEV:_ss('tiss apu dsw irma ambedkar jamia christ loyola nirmala ximb'),
IN_POLSCI:_ss('du_arts jnu ashoka presidency jindal ambedkar hcu flame jamia bhu'),
IN_CIVILSERV:_ss('du_arts jnu jamia presidency ashoka bhu hcu ambedkar iipa lbsnaa'),
IN_PUBPOLICY:_ss('ashoka tiss jindal apu jnu du_arts iipa isb iit_hss ambedkar'),
IN_HISTORY:_ss('du_arts jnu presidency ashoka deccan bhu hcu jamia ambedkar sxc'),
IN_ENGLISH:_ss('du_arts jnu jadavpur presidency hcu ashoka jamia loyola mountcarmel sxc'),
IN_LIBARTS:_ss('ashoka flame krea jindal shivnadar apu du_arts jnu christ symbiosis'),
IN_LANG:_ss('jnu eflu hcu iiith du_arts jamia deccan bhu symbiosis christ'),
IN_EDU:_ss('tiss apu rie du_edu jamia ambedkar christ bhu mountcarmel sxc'),
IN_MEDIA:_ss('iimc acj ajkmcrc simc xic du_arts mica christ mic flame'),
IN_ADVPR:_ss('mica simc nmims xic iimc christ mic du_arts flame sxc'),
IN_FILM:_ss('ftii srfti whistlingwoods krnnivsa ajkmcrc lvprasad annapurna xic simc mic'),
// Design, arts, architecture
IN_FINEARTS:_ss('msub_fa jj visvabharati coa_delhi jamia bhu gcacc gcfa chitrakala srishti'),
IN_GRAPHIC:_ss('nid iit_design mitid srishti sid nift pearl uid iiad iiitdm'),
IN_UX:_ss('iit_design nid iiit_hcd iisc_cpdm mitid srishti sid uid iiad pearl'),
IN_ANIM:_ss('nid iit_design srishti mitid whistlingwoods sid pearl uid icat toonskool'),
IN_INTERIOR:_ss('cept nid mitid srishti sid pearl uid iiad jjarch rachana'),
IN_ARCH:_ss('iitarch spa cept nitarch jjarch jadavpur sap_anna cca rachana msap'),
IN_PERF:_ss('nsd bhu visvabharati kalakshetra kmmc bhatkhande ikskv du_music sp_pune whistlingwoods'),
// Law, defence, public service
IN_LAW:_ss('nlsiu nlus jgls sls_pune du_law ils gls_mumbai christ bhu nirma_law'),
IN_CORPLAW:_ss('nlsiu nlus jgls iitkgp_rgsoipl sls_pune du_law ils gls_mumbai nirma_law christ'),
IN_DEFENCE:_ss('nda ima ina afa ota afmc cme mcte mceme diat'),
IN_CRIM:_ss('nfsu nicfs rru tiss dhgu madras_univ jindal amity christ lpu'),
// Medical & health
IN_MED:_ss('aiims jipmer mamc cmcv afmc bhu kem grant mmc kgmu'),
IN_DENTAL:_ss('maids mcods saveetha gdch nair abshetty kgmu dypatil_dental jss bhu'),
IN_AYUSH:_ss('aiia bhu nia gau tilak gac_tvm nih ajmal nium sdm_naturo'),
IN_NURSING:_ss('aiims cmcv pgimer jipmer rkcon armyson manipal_nursing cmcl stjohns_nursing symbiosis_health'),
IN_PHYSIO:_ss('manipal_mchp jamiahamdard cmcv sriramachandra srm jss dmimer kem dypatil symbiosis_health'),
IN_PHARMA:_ss('jamiahamdard niper ict bits jss mcops panjabuniv bhu_pharma poonapharma dipsar'),
IN_ALLIED:_ss('aiims jipmer pgimer cmcv manipal_mchp jamiahamdard sriramachandra symbiosis_health srm dypatil'),
IN_NUTRITION:_ss('ladyirwin ihe avinashilingam sndt msub_fcs nirmalaniketan christ mountcarmel manipal_mchp symbiosis_health'),
IN_PUBHEALTH:_ss('tiss iihmr iiph aiims pgimer prasanna sctimst cmcv symbiosis_health nihfw'),
IN_SPORTS:_ss('nsu lnipe nsnis tnpesu symbiosis amity manipal_mchp panjabuniv_pe jamia lpu'),
IN_VET:_ss('tanuvas gadvasu kvafsu luvas mafsu duvasu svvu kvasu wbuafs ivri'),
// Pure sciences
IN_PHYSICS:_ss('iisc iiser niser cmi iit_sci du_sci presidency fergusson sxc mcc'),
IN_CHEMSCI:_ss('iiser iisc niser iit_sci ict du_sci presidency fergusson sxc mcc'),
IN_MATHSTAT:_ss('cmi isi iisc iiser iit_sci niser du_sci presidency fergusson sxc'),
IN_LIFESCI:_ss('iisc iiser niser iit_sci du_sci sxc presidency fergusson christ mcc'),
IN_ENVSCI:_ss('jnu iiser iit_sci teri du_sci ashoka christ tiss wii bhu'),
// Extra
IN_FASHIONDESIGN:_ss('nift pearl sid mitid srishti jd iiad amity vogue lpu'),
IN_JEWELLERY:_ss('nid nift pearl giaindia iigj sid srishti mitid iiad jd'),
IN_INDDESIGN:_ss('iit_design nid mitid srishti sid uid iiad iiitdm cept pearl'),
IN_PHOTO:_ss('nid ftii srfti ajkmcrc simc xic whistlingwoods srishti mitid pearl'),
IN_SOUND:_ss('ftii srfti whistlingwoods kmmc lvprasad annapurna xic mitid simc krnnivsa'),
IN_URBAN:_ss('spa cept iit_plan sap_anna jadavpur cca msap tiss ambedkar jnu'),
IN_CULINARY:_ss('ici ihm_nchm wgsha ocld cai bcihmct iihm christ amity lpu'),
IN_TOURISM:_ss('iittm ihm_nchm christ symbiosis amity pondy du_arts lpu iihm jamia'),
IN_AVIATIONMGMT:_ss('upes amity srm hits lpu cu_chd symbiosis christ frankfinn bvp'),
IN_REALESTATE:_ss('nicmar rics_sbe cept spa nmims symbiosis christ upes amity jindal'),
IN_PILOT:_ss('igrua nfti rgaat bfc hica mpfc gfc chimes dfc gfts'),
IN_AME:_ss('hits srm upes sathyabama bharath iare lpu amity cu_chd veltech'),
IN_NAUTICAL:_ss('imu tschanakya tmi meri amet himt samundra manet itme geims'),
IN_MARINE:_ss('imu iit_oe amet tmi meri cusat andhra_au samundra himt tschanakya'),
IN_NAVAL:_ss('iit_oe imu cusat andhra_au amet tmi ina meri himt samundra'),
IN_BCA:_ss('christ symbiosis du_sci sxc loyola mcc nmims shivnadar mountcarmel fergusson'),
IN_GEOLOGY:_ss('iit_sci iiser niser du_sci presidency jadavpur bhu andhra_au sp_pune hcu'),
IN_FORESTRY:_ss('fri wii iifm tnau kau yspuhf gbpuat uasb bhu_iag skuast'),
IN_MARINEBIO:_ss('cife kufos tnjfu cmfri cusat annamalai goauniv andhra_au pondy mangaloreuniv'),
IN_OPTOM:_ss('lvpei eliteoptom aravind manipal_mchp sriramachandra jamiahamdard symbiosis_health srm amity dypatil'),
IN_OT:_ss('aiipmr kem tnmc cmcv manipal_mchp jamiahamdard sriramachandra dypatil symbiosis_health srm'),
IN_SLP:_ss('aiish ayjnishd manipal_mchp drsrc aiims pgimer sriramachandra jamiahamdard symbiosis_health amity'),
IN_ENGPHYS:_ss('iit nit bits dtu iiit jadavpur iiest vit manipal srm'),
IN_MATHCOMP:_ss('iit iisc iiith bits nit iiit dtu isi cmi vit'),
IN_ENERGY:_ss('iit nit pdeu bits upes dtu anna jadavpur vit amrita'),
IN_GEOINFO:_ss('iit iirs nit anna andhra_au teri du_sci bhu jnu vit')
};

const INDIA_SET_NOTES={
IN_CA:'CA is earned through ICAI exams, not a college degree. Slot 1 is the professional body; slots 2–10 are the best B.Com / BBA colleges to study alongside CA preparation.',
IN_CSEC:'Company Secretary is earned through ICSI exams, not a college degree. Slot 1 is the professional body; slots 2–10 are the best commerce colleges to study alongside.',
IN_CMA:'CMA is earned through ICMAI exams, not a college degree. Slot 1 is the professional body; slots 2–10 are the best commerce colleges to study alongside.',
IN_CIVILSERV:'Civil services selection is by UPSC exams, not a college. Slots 1–9 are strong undergraduate / postgraduate institutions for the preparation years; LBSNAA is the training academy after selection.',
IN_DEFENCE:'Defence officer training happens at service academies after selection through UPSC / service entries; these are not conventional colleges.',
IN_MINING:'Mining has few premier institutes; slots beyond the first six or so are thinner, so confirm current rankings and intake before shortlisting.',
IN_SAFETY:'Safety & Fire Engineering is a niche branch with few dedicated institutes; confirm current programme availability before shortlisting.',
IN_TEXTILE:'Textile engineering is concentrated in a few institutes; slots beyond the first five or six are thinner, so confirm programme availability.',
IN_SPECCHEM:'These specialised chemical technologies (dyes, oils, paints, coatings, fine chemicals) are concentrated at ICT Mumbai and a few others; confirm programme availability for lower slots.',
IN_MATERIALS:'Niche materials branches (polymers, plastics, paper, packaging) are offered by few institutes; confirm programme availability at each college.',
IN_FASHION:'Fashion Technology rankings are less standardised than engineering; treat lower slots as a starting shortlist and verify placements.',
IN_PHARMA:'NIPERs offer postgraduate programmes (M.Pharm / MS); for B.Pharm admission focus on the other slots first.',
IN_VET:'ICAR-IVRI is a postgraduate/PhD route; BVSc & AH admission is through NEET-UG at the other slots.',
IN_HOSP:'Hospitality rankings are less standardised; check placement records and hotel tie-ups for each institute.',
IN_ANIM:'Animation and design institutes vary widely in quality; verify faculty, studio exposure and placements.',
IN_PILOT:'Pilot training is licence-based, not a conventional degree. These are DGCA-approved flying-training organisations; verify current DGCA approval, fleet, instructor strength and total fees before enrolling.',
IN_AME:'Enrol only in institutes with valid DGCA CAR-147 approval; many unrecognised institutes exist. Lower slots are thinner and should be verified.',
IN_NAUTICAL:'Admit only to DG Shipping-approved institutes; check sponsorship / shipping-company placement before paying fees.',
IN_MARINE:'Admit only to DG Shipping-approved institutes for seafarer courses; naval-architecture roles ashore need strong engineering programmes.',
IN_NAVAL:'Naval architecture has few dedicated programmes; lower slots are maritime institutes that offer related tracks, so confirm intake.',
IN_AVIATIONMGMT:'Aviation-management rankings are less standardised; choose institutes with verified airline / airport tie-ups.',
IN_JEWELLERY:'Jewellery-design rankings are less standardised; verify workshop facilities and placement records.',
IN_URBAN:'Urban planning has few UG programmes; several slots are postgraduate routes (M.Plan) at IITs and policy institutes.',
IN_FORESTRY:'Forestry is concentrated in a few institutes; IIFM and WII are postgraduate routes. Confirm UG intake and entrance route.',
IN_MARINEBIO:'Marine biology and fisheries are concentrated in a few institutes; several slots are postgraduate routes (ICAR-CIFE, CMFRI).',
IN_GEOINFO:'IIRS and IIT planning / geoinformatics programmes are mostly postgraduate; UG geoinformatics options are limited.',
IN_SOUND:'Music-production and sound-design education in India is spread across film schools and private institutes; verify studios and placements.',
IN_OPTOM:'Optometry quality varies widely; prefer institutes attached to eye hospitals with clinical rotations.',
IN_SLP:'Practise only after RCI recognition; choose RCI-recognised institutes.'
};

const BRANCH_COLLEGE_MAP_EXTRA={
'fashion-design':['IN_FASHIONDESIGN','A_FASHION'],'jewellery-design':['IN_JEWELLERY','A_JEWEL'],'industrial-product-design':['IN_INDDESIGN','A_INDDESIGN'],
'photography-cinematography':['IN_PHOTO','A_PHOTO'],'music-production-sound':['IN_SOUND','A_SOUND'],'urban-planning-landscape':['IN_URBAN','A_URBAN'],
'culinary-arts':['IN_CULINARY','A_CULINARY'],'digital-marketing':['IN_MARKETING','A_BUSINESS'],'tourism-travel-management':['IN_TOURISM','A_HOSP'],
'aviation-airport-management':['IN_AVIATIONMGMT','A_AVIATION'],'retail-ecommerce-management':['IN_BBA','A_BUSINESS'],'real-estate-management':['IN_REALESTATE','A_REALESTATE'],
'commercial-pilot':['IN_PILOT','A_AVIATION'],'aviation-maintenance-engineering':['IN_AME','A_AERO'],'merchant-navy-nautical-science':['IN_NAUTICAL','A_MARINE'],
'bca-computer-applications':['IN_BCA','A_CS'],'geology-earth-sciences':['IN_GEOLOGY','A_GEOLOGY'],'biochemistry-genetics':['IN_LIFESCI','A_BIOTECH'],
'forestry-wildlife':['IN_FORESTRY','A_FORESTRY'],'marine-biology-fisheries':['IN_MARINEBIO','A_MARINEBIO'],'optometry':['IN_OPTOM','A_OPTOM'],
'occupational-therapy':['IN_OT','A_PHYSIO'],'speech-language-audiology':['IN_SLP','A_SLP'],
'marine-engineering':['IN_MARINE','A_MARINE'],'naval-architecture-ocean':['IN_NAVAL','A_MARINE'],'environmental-engineering':['IN_CIVIL','A_ENVENG'],
'petroleum-engineering':['IN_PETRO','A_PETRO'],'biochemical-engineering':['IN_BIOTECH','A_CHEM'],'nanotechnology':['IN_MATERIALS','A_MATERIALS'],
'engineering-physics':['IN_ENGPHYS','A_PHYSICS'],'mathematics-computing':['IN_MATHCOMP','A_MATHSTAT'],'industrial-engineering':['IN_MFG','A_MFG'],
'renewable-energy-engineering':['IN_ENERGY','A_ELEC'],'geoinformatics':['IN_GEOINFO','A_CIVIL'],'game-technology':['IN_CS','A_ANIM']
};

/* ========== BRANCH -> [India set, Abroad set] ========== */
const BRANCH_COLLEGE_MAP=(()=>{const m={};const add=(ids,i,a)=>ids.split(' ').forEach(id=>m[id]=[i,a]);
add('computer-engineering cse computer-science cs-business-systems cs-design cse-iot cs-it cs-technology computer-technology it software-engineering cloud-computing iot industrial-iot','IN_CS','A_CS');
add('cse-cyber cyber-security','IN_CYBER','A_CYBER');
add('cse-aids cse-aiml ai aiml aids','IN_AI','A_AI');
add('data-science','IN_DATA','A_DATA');
add('electronics electronics-vlsi entc ece ece-act ecs vlsi five-g embedded-systems','IN_ECE','A_ECE');
add('ece-biomed electronics-biomed biomedical','IN_BME','A_BME');
add('electrical electrical-ep electrical-computer eee eep instrumentation instrumentation-control','IN_ELEC','A_ELEC');
add('mechanical mechanical-rail mechanical-automation','IN_MECH','A_MECH');
add('automobile','IN_AUTO','A_AUTO');
add('manufacturing production production-sandwich','IN_MFG','A_MFG');
add('mechatronics robotics-ai robotics-automation','IN_ROBO','A_ROBO');
add('civil civil-planning civil-computer civil-infrastructure structural','IN_CIVIL','A_CIVIL');
add('civil-environmental','IN_CIVIL','A_ENVENG');
add('chemical','IN_CHEM','A_CHEM');
add('petrochemical','IN_PETRO','A_PETRO');
add('pharma-fine-chem pharma-chem-tech','IN_SPECCHEM','A_PHARMA');
add('dyestuff oil-tech oil-paints oil-oleo','IN_SPECCHEM','A_CHEM');
add('paints-tech surface-coating','IN_SPECCHEM','A_MATERIALS');
add('biotech','IN_BIOTECH','A_BIOTECH');
add('fashion-tech','IN_FASHION','A_FASHION');
add('textile-fibres textile-manmade technical-textiles textile-chemistry textile-tech','IN_TEXTILE','A_TEXTILE');
add('food-engineering food-tech food-tech-mgmt','IN_FOOD','A_FOOD');
add('metallurgy plastic-tech plastic-polymer polymer-eng paper-pulp printing-packing','IN_MATERIALS','A_MATERIALS');
add('aeronautical','IN_AERO','A_AERO');
add('agricultural','IN_AGRIENG','A_AGRI');
add('mining','IN_MINING','A_MINING');
add('safety-fire','IN_SAFETY','A_SAFETY');
add('ca','IN_CA','A_ACCFIN');add('company-secretary','IN_CSEC','A_ACCFIN');add('cma','IN_CMA','A_ACCFIN');
add('bcom-accounting banking-insurance','IN_COMMERCE','A_ACCFIN');
add('financial-markets','IN_FINMKT','A_ACCFIN');
add('actuarial-science','IN_ACTUARIAL','A_ACTUARIAL');
add('economics','IN_ECON','A_ECON');
add('fintech-analytics business-analytics','IN_BIZANALYTICS','A_DATA');
add('bba-management','IN_BBA','A_BUSINESS');add('marketing-brand','IN_MARKETING','A_BUSINESS');add('hr-management','IN_HR','A_BUSINESS');
add('entrepreneurship-startups','IN_ENTREP','A_BUSINESS');add('international-business','IN_INTLBIZ','A_BUSINESS');
add('supply-chain-logistics','IN_SCM','A_SCM');add('hospitality-hotel','IN_HOSP','A_HOSP');
add('psychology','IN_PSYCH','A_PSYCH');add('sociology-anthropology','IN_SOCIOLOGY','A_SOCIOLOGY');
add('political-science-ir','IN_POLSCI','A_POLSCI');add('history-archaeology','IN_HISTORY','A_HISTORY');
add('english-literature','IN_ENGLISH','A_ENGLISH');add('linguistics-languages','IN_LANG','A_LANG');
add('philosophy-liberal-arts','IN_LIBARTS','A_LIBARTS');add('social-work-development','IN_DEV','A_DEV');
add('education-teaching','IN_EDU','A_EDU');
add('journalism-mass-comm digital-media-content','IN_MEDIA','A_MEDIA');add('advertising-pr','IN_ADVPR','A_MEDIA');
add('film-tv-production','IN_FILM','A_FILM');add('fine-arts','IN_FINEARTS','A_FINEARTS');
add('graphic-visual-design','IN_GRAPHIC','A_DESIGN');add('ux-ui-design','IN_UX','A_UX');
add('animation-vfx-gaming','IN_ANIM','A_ANIM');add('interior-design','IN_INTERIOR','A_INTERIOR');
add('architecture','IN_ARCH','A_ARCH');add('performing-arts-music','IN_PERF','A_PERF');
add('law-llb','IN_LAW','A_LAW');add('corporate-ip-law','IN_CORPLAW','A_CORPLAW');
add('civil-services','IN_CIVILSERV','A_POLSCI');add('defence-services','IN_DEFENCE','A_DEFENCE');
add('public-policy-governance','IN_PUBPOLICY','A_POLSCI');add('criminology-forensic','IN_CRIM','A_CRIM');
add('mbbs','IN_MED','A_MED');add('dental-bds','IN_DENTAL','A_DENTAL');add('ayush','IN_AYUSH','A_AYUSH');
add('nursing','IN_NURSING','A_NURSING');add('physiotherapy-rehab','IN_PHYSIO','A_PHYSIO');
add('pharmacy-bpharm','IN_PHARMA','A_PHARMA');add('veterinary-science','IN_VET','A_VET');
add('allied-health-diagnostics','IN_ALLIED','A_ALLIED');add('nutrition-dietetics','IN_NUTRITION','A_NUTRITION');
add('public-health-hospital-admin','IN_PUBHEALTH','A_PUBHEALTH');add('sports-science-management','IN_SPORTS','A_SPORTS');
add('physics-astronomy','IN_PHYSICS','A_PHYSICS');add('chemistry-sciences','IN_CHEMSCI','A_CHEMSCI');
add('mathematics-statistics','IN_MATHSTAT','A_MATHSTAT');add('life-sciences-microbiology','IN_LIFESCI','A_BIOTECH');
add('environmental-science','IN_ENVSCI','A_ENVENG');add('agri-science','IN_AGRISCI','A_AGRI');
return m;})();

/* ========== BUILDERS ========== */
// Top 10 India: each slot is one institution OR one whole family (e.g. all IITs = one slot)
function buildIndiaColleges(setKey){
  return INDIA_SETS[setKey].map((k,i)=>{const r=INDIA_INST[k];return {rank:i+1,name:r[0],examples:r[1],entry:r[2]};});
}
// Top study-abroad: 6 fixed locations x 5 universities
function buildStudyAbroad(setKey){
  const s=ABROAD_SETS[setKey];
  return ABROAD_LOCATIONS.map(l=>({code:l.code,country:l.country,flag:l.flag,universities:s[l.code].map((c,i)=>({rank:i+1,name:UNI[c]}))}));
}
function getBranchColleges(id){
  const m=BRANCH_COLLEGE_MAP[id];if(!m)return null;
  const notes=[];if(INDIA_SET_NOTES[m[0]])notes.push(INDIA_SET_NOTES[m[0]]);if(ABROAD_SET_NOTES[m[1]])notes.push(ABROAD_SET_NOTES[m[1]]);
  return {topIndiaColleges:buildIndiaColleges(m[0]),studyAbroad:buildStudyAbroad(m[1]),collegeNotes:notes};
}
Object.assign(BRANCH_COLLEGE_MAP,BRANCH_COLLEGE_MAP_EXTRA);
// Attach to every branch profile AND every roadmap so either object can be read by the UI
BRANCHES.forEach(b=>{
  const c=getBranchColleges(b.id);if(!c)return;
  b.topIndiaColleges=c.topIndiaColleges;b.studyAbroad=c.studyAbroad;b.collegeNotes=c.collegeNotes;
  if(ROADMAPS[b.id]){ROADMAPS[b.id].topIndiaColleges=c.topIndiaColleges;ROADMAPS[b.id].studyAbroad=c.studyAbroad;ROADMAPS[b.id].collegeNotes=c.collegeNotes;}
});
`;

if (!content.includes('ABROAD_LOCATIONS')) {
  content = content + '\n' + v4CollegesCode;
  console.log('Appended v4 College and Study Abroad section');
}

// Restore line endings
if (hasCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetPath, content, 'utf-8');
console.log('Successfully updated branches_data.js on disk!');
