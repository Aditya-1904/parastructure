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
      'Our most successful alumni have exactly 2–4 years of experience. You already know enough to ask the right questions — this program gives you the specialisation and the tools to break through to senior roles. If you are genuinely advanced, the Steel and PSC tracks are demanding by any standard.',
  },
  {
    question: 'What makes this different from a YouTube course or an online certification?',
    answer:
      'Three things: live feedback, real project data, and intensive peer learning. On YouTube, nobody reviews your design. Here, a practicing engineer marks your MIDAS model the same way a project manager would on a real submission.',
  },
  {
    question: 'What software do I need, and how expensive is it?',
    answer:
      'We provide student licenses for MIDAS Civil as part of the program. Autodesk products (Revit, AutoCAD) have free student licenses. You need a reasonably modern laptop — 8GB RAM minimum, 16GB recommended. We send a full technical checklist after you apply.',
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
  {
    question: 'What if I am not satisfied? Can I get a refund?',
    answer:
      'Full refund, no questions, within 7 days of the cohort start date. We have had exactly two refund requests in our history — both were processed the same day. We are confident enough in the program to make the guarantee easy.',
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
    title: 'PSC I-Girder Bridge Design',
    shortTitle: 'PSC Bridge',
    image: '/course_psc.png',
    tagline: 'PSC is where senior bridge engineering begins. This is the program that gets you there.',
    description:
      'Prestressed concrete is the dominant bridge type on every major Indian expressway and NHAI project — and it\'s the niche that commands senior roles and the best salaries. This advanced program covers PSC I-girder and box girder design from first principles through to MIDAS Civil construction stage analysis and BrIM deliverables using Dynamo. If you\'ve completed the RCC program or have solid design experience, this is the natural next step.',
    duration: '6 Months',
    hours: '140+ Hours',
    sessions: '56 Live Sessions',
    level: 'Advanced',
    mode: 'Online Live',
    language: 'Hindi & English',
    price: 59999,
    emiMonths: 6,
    badge: 'Expert Track',
    badgeType: 'secondary',
    color: '#7B68EE',
    modules: [
      {
        title: 'Prestressing Fundamentals',
        topics: [
          'Pre-tensioning vs post-tensioning systems',
          'Prestressing force and eccentricity',
          'Cable profiles and layouts',
          'Anchorage zone design',
        ],
      },
      {
        title: 'Loss Calculations & Serviceability',
        topics: [
          'Elastic shortening, creep, shrinkage losses',
          'Friction and wobble losses',
          'Crack width and deflection checks',
          'Long-term behaviour of PSC elements',
        ],
      },
      {
        title: 'PSC Bridge System Design',
        topics: [
          'PSC I-girder and box girder design (IRC: 112)',
          'Balanced cantilever construction analysis',
          'Transverse design of multi-cell box girders',
          'Pier table and segment design',
        ],
      },
      {
        title: 'BrIM & Parametric Design',
        topics: [
          'Bridge Information Modelling concepts',
          'Dynamo for parametric bridge modelling',
          'BrIM-based quantity extraction and scheduling',
          'Digital twin setup for bridge structures',
        ],
      },
      {
        title: 'MIDAS Civil — Advanced',
        topics: [
          'Tendon modelling in MIDAS',
          'Creep and shrinkage analysis',
          'Construction stage analysis for cantilever bridges',
          'Design report generation',
        ],
      },
    ],
    outcomes: [
      'Design PSC I-girder and box girder bridges to IRC standards',
      'Perform advanced construction stage analysis in MIDAS Civil',
      'Deliver BrIM models using Dynamo and Revit',
      'Work on NHAI, expressway, and metro-rail bridge projects',
    ],
    targetAudience: [
      'Diploma, Graduate & Postgraduate Students looking to strengthen their CV and improve internship and career prospects',
      'Site Engineers transitioning into design office roles',
      'Professionals targeting NHAI and state highway projects',
      'Engineers aiming for senior/lead design roles',
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
};

export default courses;

export function getCourse(id) {
  return courses[id] || null;
}

export function getAllCourses() {
  return Object.values(courses).filter(course => course.isPublished);
}
