// ============================================================
// PARASTRUCTURE — Course Data Layer
// Single source of truth for all course information.
// Update here; all pages update automatically.
// ============================================================

export const NEXT_COHORT_DATE = new Date('2026-06-15T09:00:00+05:30');

export const TOOLS = [
  { name: 'MIDAS Civil', icon: '🔩' },
  { name: 'STAAD Pro', icon: '⚙️' },
  { name: 'Autodesk Revit', icon: '🏗️' },
  { name: 'AutoCAD', icon: '📐' },
  { name: 'SAP2000', icon: '🔷' },
  { name: 'MS Project', icon: '📊' },
  { name: 'Dynamo', icon: '🔀' },
];

export const TESTIMONIALS = [
  {
    name: 'Rahul Mehra',
    role: 'Bridge Design Engineer, L&T Construction',
    cohort: 'RCC Bridge — Cohort 03',
    quote:
      'I was struggling to understand the real-world application of IRC codes. Eight weeks into this cohort, everything clicked. The MIDAS model I submitted as my capstone gave me immense confidence to handle complex live projects.',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Structural Analyst, STUP Consultants',
    cohort: 'PSC Bridge — Cohort 02',
    quote:
      'I was earning ₹28,000 a month and scared to spend ₹60K on a course. Six months later I was at STUP earning three times that. The ROI calculation was not even close. The BrIM module specifically — nobody else teaches that in India at this level.',
    rating: 5,
  },
  {
    name: 'Arjun Sharma',
    role: 'Senior Bridge Engineer, Atkins India',
    cohort: 'Steel Bridge — Cohort 04',
    quote:
      'I had struggled with STAAD and connection design in the past. This program fixed that gap. I didn\'t just learn the theory — I was confident. My instructor reviewed my drawings line-by-line, exactly how a PM would on a real project.',
    rating: 5,
  },
  {
    name: 'Deepika Rao',
    role: 'BIM Lead, AECOM India',
    cohort: 'RCC Bridge — Cohort 05',
    quote:
      'We argued about pier dimensions at 10 PM on a Saturday. That kind of engagement is what turns knowledge into instinct. The collaborative approach here mimics a real design office environment perfectly.',
    rating: 5,
  },
];

export const FAQS = [
  {
    question: 'I have a full-time job. Can I realistically do this?',
    answer:
      'Yes — and most of our students do. Sessions are on Saturday and Sunday mornings (10 AM–12 PM IST), so your weekdays stay free. Recordings go up within 2 hours of every session and stay available for a full year. We designed the schedule for working engineers, not students.',
  },
  {
    question: 'I already have 2–3 years of experience. Is this too basic for me?',
    answer:
      'These programs are designed for recent graduates and early-career engineers who want to build practical bridge design skills and position themselves for better-paying engineering opportunities. If you are genuinely advanced, the Steel and PSC tracks are demanding by any standard.',
  },
  {
    question: 'What makes this different from a YouTube course or an online certification?',
    answer:
      'Watching videos can teach concepts. Building engineering skills requires practice, guidance, and feedback. This program is designed to help you learn by doing through live sessions, practical assignments, and a structured bridge design project.',
  },
  {
    question: 'What happens after I complete the program?',
    answer:
      'You will have built a professional-grade portfolio containing complete design models and deliverables. You will also have direct access to our alumni network of practicing bridge engineers across top infrastructure firms.',
  },
  {
    question: 'What are the payment options? Can I pay in instalments?',
    answer:
      'We accept UPI, Net Banking, and all Credit/Debit cards via Razorpay. No-cost EMI is available through HDFC, ICICI, Axis, and SBI. If you need a custom payment plan, write to us — we have worked things out for deserving candidates before.',
  },
];

// ============================================================
// Individual Course Data
// ============================================================

const courses = {
  rcc: {
    id: 'rcc',
    isPublished: false,
    title: 'RCC Bridge Design & BIM',
    shortTitle: 'RCC Bridge',
    image: '/course_rcc.png',
    tagline: 'The most in-demand niche in Indian infrastructure. Go from theory to job-ready in 8 months.',
    description:
      'RCC bridge design is on the job description of every major infrastructure firm in India — and most applicants don\'t have the depth it takes. This program changes that. You\'ll move from structural analysis fundamentals through to code-compliant IRC: 112 design, MIDAS Civil modelling, and complete BIM deliverables — the exact workflow used on projects like the Mumbai Trans Harbour Link and Delhi–Meerut RRTS.',
    duration: '8 Months',
    hours: '160+ Hours',
    sessions: '64 Live Sessions',
    level: 'Intermediate to Advanced',
    mode: 'Online Live',
    language: 'Hindi & English',
    price: 49999,
    emiMonths: 8,
    badge: 'Most Popular',
    badgeType: 'primary',
    color: '#C8A86B',
    modules: [
      {
        title: 'Structural Analysis Fundamentals',
        topics: [
          'Loading combinations as per IRC: 6',
          'Influence line diagrams for bridges',
          'Grillage analysis methodology',
          'Live load distribution factors',
        ],
      },
      {
        title: 'RCC Design (IRC: 112 & AASHTO)',
        topics: [
          'Limit state design philosophy',
          'Flexure and shear design of bridge girders',
          'Pier, abutment and foundation design',
          'Deck slab design and detailing',
        ],
      },
      {
        title: 'BIM Modelling with Autodesk Revit',
        topics: [
          'Revit fundamentals for structural engineers',
          'Parametric family creation for bridge elements',
          'Clash detection and coordination workflows',
          'Drawing and quantity extraction',
        ],
      },
      {
        title: 'Industry Tools — MIDAS Civil',
        topics: [
          'Model setup, section and material properties',
          'Construction stage analysis',
          'Moving load and response spectrum analysis',
          'Result interpretation and code checks',
        ],
      },
      {
        title: 'Capstone Project',
        topics: [
          'End-to-end design of a 4-span RCC bridge',
          'Full design calculations report',
          'MIDAS Civil model submission',
          'Revit BIM model delivery',
        ],
      },
    ],
    outcomes: [
      'Design any RCC bridge to IRC: 112 independently',
      'Deliver production-ready BIM models using Revit',
      'Operate MIDAS Civil for real project analysis',
      'Qualify for roles at L&T, AECOM, STUP & top consultants',
    ],
    targetAudience: [
      'B.E./B.Tech Civil Engineering graduates',
      '0–5 years of structural engineering experience',
      'Engineers targeting infrastructure consultancies',
      'Professionals looking to upskill into bridge design',
    ],
    tools: ['MIDAS Civil', 'Autodesk Revit', 'AutoCAD', 'MS Excel'],
    testimonials: [TESTIMONIALS[0], TESTIMONIALS[3]],
  },

  steel: {
    id: 'steel',
    isPublished: false,
    title: 'Steel Bridge Design & Engineering',
    shortTitle: 'Steel Bridge',
    image: '/course_steel.png',
    tagline: 'Fewer engineers can design steel bridges well. This is how you become one of them.',
    description:
      'Steel bridges are complex, unforgiving, and extremely well-paid to work on. This program covers the full design workflow — plate girder bridges, box girder bridges, truss systems — from first load combination through to shop-drawing-ready connection detailing. You\'ll work in STAAD Pro and SAP2000 on real structural geometries, and leave knowing exactly what goes wrong on site when a connection is under-designed.',
    duration: '8 Months',
    hours: '120+ Hours',
    sessions: '48 Live Sessions',
    level: 'Advanced',
    mode: 'Online Live',
    language: 'Hindi & English',
    price: 54999,
    emiMonths: 8,
    badge: 'Flagship',
    badgeType: 'accent',
    color: '#4A90A4',
    modules: [
      {
        title: 'Steel Material Science & Behaviour',
        topics: [
          'Steel grades as per IS: 2062',
          'Fatigue and fracture mechanics basics',
          'Corrosion protection strategies',
          'Material testing and quality control',
        ],
      },
      {
        title: 'Structural Analysis for Steel Bridges',
        topics: [
          'Global and local buckling behaviour',
          'Plate girder proportioning',
          'Dynamic load analysis and vibration',
          'Wind and seismic load combinations',
        ],
      },
      {
        title: 'Connection Design & Detailing',
        topics: [
          'Bolted and welded connection design (IRC: 24)',
          'Splice design for girders',
          'Cross-frame and diaphragm design',
          'Workshop drawing preparation',
        ],
      },
      {
        title: 'STAAD Pro & SAP2000',
        topics: [
          'Model setup for bridge structures',
          'Load case generation and combinations',
          'Steel code check and member design',
          'Optimisation of member sections',
        ],
      },
      {
        title: 'Project Management & Site Integration',
        topics: [
          'MS Project — scheduling a steel bridge project',
          'Fabrication and erection sequencing',
          'Cost estimation and BOQ preparation',
          'Site inspection protocols',
        ],
      },
    ],
    outcomes: [
      'Design steel plate and box girder bridges independently',
      'Perform advanced fatigue and dynamic load analysis',
      'Produce fabrication-ready connection drawings',
      'Lead steel bridge projects from design to site',
    ],
    targetAudience: [
      'Engineers with 1+ year structural design experience',
      'RCC bridge engineers transitioning to steel',
      'Consultants working on highway and rail projects',
      'Professionals targeting international infrastructure firms',
    ],
    tools: ['STAAD Pro', 'SAP2000', 'AutoCAD', 'MS Project'],
    testimonials: [TESTIMONIALS[2], TESTIMONIALS[1]],
  },

  psc: {
    id: 'psc',
    isPublished: true,
    title: 'PSC-I Girder Design Program',
    shortTitle: 'PSC Bridge',
    image: '/course_psc.png',
    tagline: 'PSC is where senior bridge engineering begins. This is the program that gets you there.',
    description:
      'Master PSC I-Girder Bridge Design through a structured program covering bridge engineering fundamentals, design calculations, relevant IRC standards, practical design exercises, and a comprehensive capstone project. Designed for civil engineering students and engineers who want to build practical bridge design skills.',
    longDescription: [
      "Let's be totally honest. Companies do not hire you because you have a degree; they hire you because you can solve their design problems.",
      "Right now, India is building flyovers, expressways, and bridges at a record-breaking pace. Yet, thousands of civil graduates are unemployed because college textbooks still teach obsolete methods, while actual design firms use complex 3D software and advanced regulatory codes like IRC:112.",
      "This course is designed to fix that problem in exactly 3-4 months. We don't make you memorize long academic derivations. Instead, we treat you like a Junior Design Engineer from day one.",
      "[Write DBR Report] ──> [Do Manual Calculations] ──> [Build 3D MIDAS Model] ──> [Run Safety Checks]",
      "You will start with a blank screen and build a full 3D model of a Bridge. You will calculate the dimensions, program the real-world construction timeline step-by-step, figure out the post-tensioning cable paths, and check everything for safety against the latest Indian Road Congress codes.",
      "By the time you complete this course, you will have a real structural design portfolio to bring to your interviews. You will be able to answer tough interview questions with absolute confidence because you have already designed the project with your own hands.",
      "And not just that, you will be ready to explore more advanced bridges and that's the most important part of this course."
    ],
    duration: '3months',
    hours: '140+ Hours',
    sessions: '25 Live Sessions',
    level: 'Advanced',
    features: [
      '50+ Hours of Practical Bridge Design Training',
      'Interactive Live Doubt-Solving',
      'Structured Study Material & Resources',
      'Hands-on Design Assignments',
      'Student Community for Learning & Discussion',
      '1-Year Access to Session Recordings',
    ],
    mode: 'Live Online',
    hasRecordings: true,
    language: 'Hindi & English',
    price: 59999,
    emiMonths: 6,
    badge: 'Expert Track',
    badgeType: 'secondary',
    color: '#7B68EE',
    modules: [
      {
        title: 'Project Kickoff & Design Basis Report (DBR)',
        topics: [
          'Introduction to the Bridge Lifecycle: Understanding how a project goes from a proposal to an actual working drawing on site.',
        ],
      },
      {
        title: 'Section Properties & Geometric Calculations',
        topics: [
          'Section Property Computations: Calculating area, moment of inertia, and section modulus (Z) for I-girders.',
          'Effective Flange Width: Applying standard code rules to determine how much of the deck slab acts as the top flange of your I-girder.',
        ],
      },
      {
        title: 'IRC:6 Load Calculations & Combinations',
        topics: [
          'Dead Loads & SIDL Matrix: Compiling the weights of the concrete beam, wet deck slab, crash barriers, and utility lines.',
          'IRC:6 Live Load Optimization: Placing Class 70R and Class A vehicles at critical positions to create maximum bending and shearing stress.',
          'Load Combinations: Merging dead loads, live loads, impact factors, and environmental forces under Ultimate (ULS) and Serviceability (SLS) limits.',
        ],
      },
      {
        title: 'MIDAS Civil 3D Modeling from Absolute Zero',
        topics: [
          'Nodes & Elements Geometry: Generating the physical structural layout of the bridge using basic coordinates and frame elements.',
          'Section Making & Material Assignment: Inputting the custom I-girder shape and applying time-dependent concrete properties.',
          'Prestress planning and detailing: How we model prestressing tendons in a MIDAS model.',
          'Elastic & Rigid Links: Connecting the deck slab elements to the longitudinal girders to simulate perfect composite structural behaviour.',
          'Boundary Conditions & Bearings: Simulating physical POT/PTFE bridge bearings (pinned, sliding, and expansion arrangements).',
        ],
      },
      {
        title: 'Construction Stages & Result Analysis',
        topics: [
          'Construction Stage Analysis (CSA): How we make constructions stages based on real life scenarios. Setting up time-dependent steps in MIDAS: Prestressing in Girder -> Deck slab casting -> SIDL Application -> Loads for long term i.e. 100 years.',
          'Live Load Application & Analysis Run: We will check how the structure behaves when live load runs over it.',
          'Extracting Forces: Reading and validating Stresses, Bending Moment Diagrams (BMD), Shear Force Diagrams (SFD), and then comparing with codal provisions.',
        ],
      },
      {
        title: 'Prestressing Details & Loss Computations',
        topics: [
          'Tendon Profile Optimization: Designing the shape of the post-tensioning cables (parabolic and draped coordinates) to follow the bending moment shape.',
          'Immediate Prestress Losses: Calculating tension drops due to friction along the duct, anchor wedge slip, and elastic concrete shortening.',
          'Long-Term Prestress Losses: Computing long-term drops caused by concrete creep deformation, drying shrinkage, and relaxation of steel strands.',
        ],
      },
      {
        title: 'IRC:112 Structural Design Checks',
        topics: [
          'Serviceability Limit State (SLS) Checks: Keeping daily concrete stresses within bounds and calculating surface crack widths to protect steel from rust.',
          'Ultimate Limit State (ULS) Checks: Verifying total structural safety against bending moment and shear failure.',
          'Bearing Load Estimation: Extracting the maximum vertical and horizontal reaction forces to hand over to the bearing manufacturer and pier/column designer.',
        ],
      },
    ],
    outcomes: [
      'Design PSC I-Girder and PSC Box Girder Bridges in accordance with relevant IRC standards',
      'Perform bridge design calculations and construction stage analysis for prestressed concrete bridges',
      'Understand the complete PSC bridge design workflow from planning to final design documentation',
      'Complete a comprehensive PSC I-Girder Bridge Design project to build practical engineering skills',
    ],
    targetAudience: [
      'Unemployed Civil Graduates: Freshers who want to bypass low-paying data-entry or generic jobs and enter the elite core structural field.',
      'Site Engineers looking for an Office Role: Engineers tired of erratic site shifts, remote locations, and low growth who want to transition to a corporate design office.',
      'CAD Drafters upgrading their skills: Traditional 2D detailers who want to learn 3D global analysis to boost their career growth and salary.',
      'Final Year UG/PG Students: Ambitious students who want a genuine, high-quality capstone project that will make them stand out during campus placements.',
      'Government/ Private engineers: if you are already working as a designer but wants to enhance your skills with a complete manual and software solutions of bridge design',
    ],
    tools: ['MIDAS Civil', 'Autodesk Revit', 'Dynamo', 'AutoCAD'],
    testimonials: [TESTIMONIALS[1], TESTIMONIALS[2]],
    detailedSyllabus: {
      designProcess: [
        {
          title: 'Review & Understand',
          desc: 'Study GAD (General Arrangement Drawing), Design basis report, and relevant codes.'
        },
        {
          title: 'Loads & Load Combinations',
          desc: 'Determine loads and prepare load combinations.'
        },
        {
          title: 'Modeling & Analysis',
          desc: 'Build structural model and obtain design forces.'
        },
        {
          title: 'Section & Stress Calculations',
          desc: 'Compute section properties and check stresses under service loads. Variables: b_f (top flange width), b_w (web width), h (total depth).'
        },
        {
          title: 'Tendon Design',
          desc: 'Design prestressing tendons, profile and calculate losses.'
        },
        {
          title: 'SLS & ULS Checks',
          desc: 'Verify serviceability (SLS) and ultimate limit state (ULS) requirements.'
        },
        {
          title: 'Bearing Design',
          desc: 'Design bearings and check bearing stresses.'
        },
        {
          title: 'Drawings & Final Check',
          desc: 'Prepare drawings and review final design. Output: PSC I Girder is safe, serviceable and constructible.'
        }
      ],
      mechanicsComparison: {
        conventional: {
          title: 'Non-prestressed (Conventional)',
          desc: 'A straight beam deflects downward under an applied vertical load, resulting in structural cracking along the bottom tension zone.'
        },
        prestressed: {
          title: 'Prestressed',
          desc: 'An unloaded beam is cambered upward due to internal prestressing forces. When vertical load is applied, the beam counteracts the deflection and straightens out without cracking.'
        },
        benefits: [
          'Longer span capability than conventional RCC bridges',
          'Reduced cracks and improved durability',
          'Slimmer and lighter girder sections',
          'Faster construction with precast technology',
          'Widely used in highways, metros, and flyovers'
        ]
      }
    }
  },

  'industrial-steel': {
    id: 'industrial-steel',
    isPublished: true,
    title: 'Industrial Steel Building Design Program',
    shortTitle: 'Industrial Steel',
    image: '/course_steel.png',
    tagline: 'Learn how industrial steel buildings are designed in professional consultancy firms through a comprehensive program that combines engineering principles, Indian design standards, practical design exercises, and a complete real-world project. Build the confidence and technical skills needed to work on industrial structural design projects.',
    description: 'Learn how industrial steel buildings are designed in professional consultancy firms through a comprehensive program that combines engineering principles, Indian design standards, practical design exercises, and a complete real-world project.',
    longDescription: [
      'A civil engineering degree may help you get shortlisted, but practical design skills are what get you hired. Today, industries across India are rapidly expanding with new factories, warehouses, manufacturing plants, and logistics facilities, creating a growing demand for structural engineers who can design safe and economical steel buildings.',
      'This program is designed to bridge the gap between classroom learning and real consultancy work in just 3–4 months. Instead of focusing on theory alone, you\'ll follow the complete workflow used by professional structural engineers on live projects.',
      '[Study Project Drawings] → [Build STAAD Model] → [Design Steel Members] → [Prepare Connection Details]',
      'Working on a complete industrial building project from scratch, you\'ll learn how to interpret client drawings, create a structural analysis model, apply design loads, design primary and secondary steel members as per Indian Standards, optimize the structure, and prepare practical connection details and structural drawings.',
      'By the end of the program, you\'ll have a complete industry-style project that demonstrates your design capabilities and strengthens your portfolio for interviews. More importantly, you\'ll develop the confidence to understand consultancy workflows and take on real-world industrial steel building projects.'
    ],
    duration: '4 Months',
    hours: '60+ Hours',
    sessions: '32 Live Sessions',
    level: 'Intermediate',
    mode: 'Online Live',
    language: 'Hindi & English',
    price: 34999,
    emiMonths: 6,
    badge: 'New Track',
    badgeType: 'secondary',
    color: '#4A90A4',
    modules: [
      {
        title: 'Module 1: Project Kickoff & Design Basis',
        topics: [
          'Industrial Building Fundamentals',
          'Project Planning & Design Basis',
          'Codes, Materials & Building Planning',
          'Structural Modelling Fundamentals'
        ]
      },
      {
        title: 'Module 2: Loading & Structural Analysis',
        topics: [
          'Gravity & Environmental Loads',
          'Load Application & Combinations',
          'Structural Analysis & Result Interpretation',
          'Model Verification & Validation'
        ]
      },
      {
        title: 'Module 3: Steel Member Design',
        topics: [
          'Primary Steel Member Design',
          'Crane Girder & Secondary Member Design',
          'Code-Based Steel Design',
          'Design Optimization'
        ]
      },
      {
        title: 'Module 4: Connections & Detailing',
        topics: [
          'Steel Connection Design',
          'Anchor Bolt & Connection Calculations',
          'Structural Drawings & Detailing',
          'Design Review & Industry Practices'
        ]
      }
    ],
    outcomes: [
      'Master Industrial Building Design from Scratch',
      'Develop Professional Models',
      'Perform Practical Steel Design',
      'Understand Indian Steel Design Codes'
    ],
    targetAudience: [
      'Unemployed Civil Engineering Graduates',
      'Site Engineers looking for a Design Office Career',
      'CAD Draftsmen & Detailers',
      'Final Year UG/PG Students',
      'Working Structural Engineers'
    ],
    tools: ['STAAD Pro', 'AutoCAD', 'MS Excel'],
    testimonials: [TESTIMONIALS[0], TESTIMONIALS[2]],
  },
};

import { supabase } from '@/lib/supabase';

export function mapCourse(dbCourse) {
  if (!dbCourse) return null;
  const staticCourse = courses[dbCourse.id] || {};
  
  const defaultFeatures = [
    '50+ Hours of Practical Design Training',
    'Interactive Live Doubt-Solving',
    'Structured Study Material & Resources',
    'Hands-on Design Assignments',
    'Student Community for Learning & Discussion',
    '1-Year Access to Session Recordings',
  ];
  const defaultOutcomes = [
    'Master industry-standard engineering workflows and design calculations',
    'Perform complete 3D structural analysis using industry software',
    'Build a professional design portfolio for technical interviews',
    'Qualify for core structural design and consulting roles',
  ];
  const defaultAudience = [
    'Civil Engineering students and recent graduates',
    'Site engineers looking to transition into office design roles',
    'Working professionals targeting infrastructure consultancies',
  ];
  const defaultTools = ['MIDAS Civil', 'STAAD Pro', 'Autodesk Revit', 'AutoCAD'];

  return {
    id: dbCourse.id,
    isPublished: dbCourse.is_published,
    title: dbCourse.title || 'Untitled Course',
    shortTitle: dbCourse.short_title || dbCourse.title || 'Course',
    image: dbCourse.image || staticCourse.image || '/course_rcc.png',
    tagline: dbCourse.tagline || staticCourse.tagline || 'Master practical engineering skills with industry experts.',
    description: dbCourse.description || staticCourse.description || 'A comprehensive structural engineering program designed to take you from theory to job-ready deliverables.',
    duration: dbCourse.duration || staticCourse.duration || 'Self-paced',
    hours: dbCourse.hours || staticCourse.hours || '20+ Hours',
    sessions: dbCourse.sessions || staticCourse.sessions || 'Live & Recorded',
    level: dbCourse.level || staticCourse.level || 'All Levels',
    mode: dbCourse.mode || staticCourse.mode || 'Online Live',
    price: dbCourse.price !== undefined && dbCourse.price !== null ? dbCourse.price : (staticCourse.price || 49999),
    originalPrice: dbCourse.original_price || staticCourse.originalPrice || dbCourse.price || 49999,
    seatsLeft: dbCourse.seats_left !== undefined && dbCourse.seats_left !== null ? dbCourse.seats_left : 40,
    rating: dbCourse.rating || staticCourse.rating || 5,
    reviews: dbCourse.reviews || staticCourse.reviews || 12,
    instructor: dbCourse.instructor || staticCourse.instructor || 'Parastructure Faculty',
    prerequisites: dbCourse.prerequisites || staticCourse.prerequisites || [],
    syllabus: dbCourse.syllabus || staticCourse.syllabus || [],
    
    // Merge static and styling fields with robust defaults
    longDescription: staticCourse.longDescription || [
      "Let's be totally honest. Companies do not hire you because you have a degree; they hire you because you can solve their design problems.",
      "This program is designed to bridge the gap between academic theory and industry practice through hands-on modeling and manual design calculations.",
      "By the end of this course, you will have built a professional-grade portfolio containing complete design models and deliverables to showcase in interviews."
    ],
    features: (staticCourse.features && staticCourse.features.length > 0) ? staticCourse.features : defaultFeatures,
    modules: staticCourse.modules || [],
    outcomes: (staticCourse.outcomes && staticCourse.outcomes.length > 0) ? staticCourse.outcomes : defaultOutcomes,
    targetAudience: (staticCourse.targetAudience && staticCourse.targetAudience.length > 0) ? staticCourse.targetAudience : defaultAudience,
    tools: (staticCourse.tools && staticCourse.tools.length > 0) ? staticCourse.tools : defaultTools,
    testimonials: (staticCourse.testimonials && staticCourse.testimonials.length > 0) ? staticCourse.testimonials : [TESTIMONIALS[0], TESTIMONIALS[1]],
    faqs: (staticCourse.faqs && staticCourse.faqs.length > 0) ? staticCourse.faqs : FAQS,
    mechanicsComparison: staticCourse.mechanicsComparison || null,
    emiMonths: staticCourse.emiMonths || 6,
    color: staticCourse.color || '#C8A86B',
    language: staticCourse.language || 'Hindi & English',
    badge: staticCourse.badge || 'Professional Track',
    badgeType: staticCourse.badgeType || 'primary',
  };
}

export async function getCourse(id) {
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapCourse(data);
}

export async function getAllCourses() {
  const { data, error } = await supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map(mapCourse);
}

// Exporting the hardcoded courses object is no longer recommended, 
// use getAllCourses() instead.
export default {};
