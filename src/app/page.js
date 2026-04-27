import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow1}></div>
        <div className={styles.heroGlow2}></div>
        <img src="/hero.png" alt="Modern Bridge Engineering" className={styles.heroBg} />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>Building the Future</span>
          <h1 className={styles.heroTitle}>Master the Art of <br/>Bridge Engineering</h1>
          <p className={styles.heroDesc}>
            Join India's most advanced cohort-based program. Learn RCC, Steel, and PSC Bridge design from industry leaders and secure top-tier placements.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/courses/rcc" className="btnPrimary">Explore Programs</Link>
            <Link href="/contact" className="btnSecondary">Download Syllabus</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsBar}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>1000+</div>
          <div className={styles.statLabel}>Learners Placed</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>83%</div>
          <div className={styles.statLabel}>Career Success Rate</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>50%</div>
          <div className={styles.statLabel}>Average Salary Hike</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>4.8/5</div>
          <div className={styles.statLabel}>Google Reviews</div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className={styles.coursesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Flagship Courses</h2>
          <p className={styles.sectionSubtitle}>
            Specialized curriculum designed to transform your theoretical knowledge into practical, industry-ready skills.
          </p>
        </div>
        
        <div className={styles.coursesGrid}>
          {/* Course 1 */}
          <div className={styles.courseCard}>
            <div className={styles.courseBadge}>Most Popular</div>
            <div className={styles.courseImageContainer}>
              <div className={styles.shape1}></div>
              <div className={styles.shape2}></div>
              <div style={{position: 'absolute', bottom: '20px', left: '20px'}}>
                <h3 style={{margin:0, fontSize:'2rem'}}>RCC<br/>Bridge</h3>
              </div>
            </div>
            <div className={styles.courseContent}>
              <h3 className={styles.courseTitle}>RCC Structure & BIM Technology</h3>
              <p className={styles.courseDesc}>
                Comprehensive program focusing on Analysis, Design & BIM Technology for Reinforced Concrete Construction bridges.
              </p>
              <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Duration</span>
                  <span className={styles.metaValue}>8 Months</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Hours</span>
                  <span className={styles.metaValue}>160+ Hours</span>
                </div>
              </div>
              <Link href="/courses/rcc" className="btnSecondary" style={{display:'block'}}>View Details</Link>
            </div>
          </div>

          {/* Course 2 */}
          <div className={styles.courseCard}>
            <div className={styles.courseBadgePopular}>Flagship</div>
            <div className={styles.courseImageContainer}>
              <div className={styles.shape3}></div>
              <div style={{position: 'absolute', bottom: '20px', left: '20px'}}>
                <h3 style={{margin:0, fontSize:'2rem'}}>STEEL<br/>Bridge</h3>
              </div>
            </div>
            <div className={styles.courseContent}>
              <h3 className={styles.courseTitle}>Steel Structure & Engineering</h3>
              <p className={styles.courseDesc}>
                Master advanced steel structure analysis, computational design, and project management for modern infrastructure.
              </p>
              <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Duration</span>
                  <span className={styles.metaValue}>8 Months</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Hours</span>
                  <span className={styles.metaValue}>120+ Hours</span>
                </div>
              </div>
              <Link href="/courses/steel" className="btnSecondary" style={{display:'block'}}>View Details</Link>
            </div>
          </div>

          {/* Course 3 */}
          <div className={styles.courseCard}>
            <div className={styles.courseImageContainer}>
               <div className={styles.shape1}></div>
               <div className={styles.shape3}></div>
              <div style={{position: 'absolute', bottom: '20px', left: '20px'}}>
                <h3 style={{margin:0, fontSize:'2rem'}}>PSC I<br/>Design</h3>
              </div>
            </div>
            <div className={styles.courseContent}>
              <h3 className={styles.courseTitle}>PSC Bridge Design & BrIM</h3>
              <p className={styles.courseDesc}>
                Prestressed Concrete bridge design, computational modelling, and BrIM technology for tall structures.
              </p>
              <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Duration</span>
                  <span className={styles.metaValue}>6 Months</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Hours</span>
                  <span className={styles.metaValue}>140+ Hours</span>
                </div>
              </div>
              <Link href="/courses/psc" className="btnSecondary" style={{display:'block'}}>View Details</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose Parastructure?</h2>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconPrimary}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className={styles.featureTitle}>Industry Projects</h3>
            <p className={styles.featureDesc}>Gain job-ready skills through real-world mega-projects developed with top tech companies.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4M6 8 2 12l4 4M14.5 4l-5 16"/></svg>
            </div>
            <h3 className={styles.featureTitle}>Latest Technology</h3>
            <p className={styles.featureDesc}>Learn tools like MIDAS, STAAD, and advanced Computational Design & BIM.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className={styles.featureTitle}>Expert Reference</h3>
            <p className={styles.featureDesc}>Get personalized 1-on-1 feedback from industry professionals who build real bridges.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
