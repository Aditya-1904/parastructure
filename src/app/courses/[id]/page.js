import styles from './course.module.css';
import Link from 'next/link';

// Helper to generate dynamic course data
const getCourseData = (id) => {
  const courses = {
    rcc: {
      title: "RCC Structure & BIM Technology",
      subtitle: "Comprehensive program focusing on Analysis, Design & BIM Technology for Reinforced Concrete Construction bridges.",
      duration: "8 Months",
      hours: "160+ Hours",
      modules: ["Structural Analysis Fundamentals", "RCC Design Codes (IRC/AASHTO)", "BIM Modeling with Revit", "Capstone Project"],
      price: "$1,499"
    },
    steel: {
      title: "Steel Structure & Engineering",
      subtitle: "Master advanced steel structure analysis, computational design, and project management for modern infrastructure.",
      duration: "8 Months",
      hours: "120+ Hours",
      modules: ["Steel Property & Behavior", "Connection Design", "MIDAS Civil Analysis", "Project Management Integration"],
      price: "$1,699"
    },
    psc: {
      title: "PSC Bridge Design & BrIM",
      subtitle: "Prestressed Concrete bridge design, computational modelling, and BrIM technology for tall structures.",
      duration: "6 Months",
      hours: "140+ Hours",
      modules: ["Prestressing Concepts", "Loss Calculations", "Parametric Design (Dynamo)", "BrIM Workflows"],
      price: "$1,899"
    }
  };
  
  return courses[id] || courses['rcc']; // Default to rcc if not found
};

export default async function CoursePage({ params }) {
  // Await the params object in Next.js 15
  const parameters = await params;
  const course = getCourseData(parameters.id);
  
  return (
    <div className={styles.courseContainer}>
      <div className={styles.headerSpacer}></div>
      
      <div className={styles.heroBanner}>
        <div className={styles.glowBg}></div>
        <h1>{course.title}</h1>
        <p className={styles.heroDesc}>{course.subtitle}</p>
        
        <div className={styles.metaRow}>
          <div className={styles.metaBadge}>{course.duration}</div>
          <div className={styles.metaBadge}>{course.hours}</div>
          <div className={styles.metaBadge}>Cohort Starting Soon</div>
        </div>
      </div>
      
      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <h2>Course Overview</h2>
          <p>This master certification brings together theoretical knowledge and practical application. You will be working on industry-guided projects, getting reviews from experts who design global mega-structures.</p>
          
          <h3 style={{marginTop: '2rem'}}>Curriculum Modules</h3>
          <ul className={styles.moduleList}>
            {course.modules.map((mod, idx) => (
              <li key={idx} className={styles.moduleItem}>
                <span className={styles.moduleNumber}>0{idx+1}</span>
                {mod}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.sidebar}>
          <div className={styles.pricingCard}>
            <h3>Enrollment</h3>
            <div className={styles.price}>{course.price}</div>
            <p className={styles.priceSub}>One-time payment or EMI options available.</p>
            <Link href="/contact" className={`btnPrimary ${styles.enrollBtn}`}>Apply for Next Cohort</Link>
            <p className={styles.guarantee}>Includes Placement Support & 1-on-1 Mentorship</p>
          </div>
        </div>
      </div>
    </div>
  );
}
