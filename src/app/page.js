import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import { getAllCourses, TOOLS } from '@/data/courses';
import { formatPrice } from '@/config/payment';
import styles from './page.module.css';

export default function Home() {
  const courses = getAllCourses();

  return (
    <div className={styles.page}>

      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section className={styles.hero}>
        <Image
          src="/hero.png"
          alt="Modern bridge infrastructure — Parastructure"
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Live Classes · Real Projects · Master the Tools</span>
          <h1 className={styles.heroTitle}>
            The Bridge Engineer{' '}
            <span className={styles.heroTitleAccent}>India Needs</span>
            {' '}Is You.
          </h1>
          <p className={styles.heroDesc}>
            Stop watching tutorials. Join a live cohort of 40 serious engineers,
            work on real mega-project data, and walk out with the practical design skills
            demanded by L&T, AECOM, and top NHAI consultancies.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/#programs" className="btnGold">{courses.length === 1 ? 'View Program' : 'See All Programs'}</Link>
            <Link href="/contact" className="btnSecondary">Get the Syllabus</Link>
          </div>

          <div className={styles.heroSocProof}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>1,000+</span>
              <span className={styles.heroStatLabel}>Global Alumni</span>
            </div>
            <div className={styles.statDivider}/>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>4.8 ★</span>
              <span className={styles.heroStatLabel}>Google Reviews</span>
            </div>
            <div className={styles.statDivider}/>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>200+</span>
              <span className={styles.heroStatLabel}>Real Projects Modeled</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          COHORT COUNTDOWN BANNER
          ================================================ */}
      <section className={styles.countdownSection}>
        <div className={styles.countdownInner}>
          <CountdownTimer />
          <div className={styles.countdownCta}>
            <p className={styles.countdownText}>
              June 2026 Cohort · Only 40 Seats · Applications Close Soon
            </p>
            <Link href="/contact" className="btnGold">Reserve Your Seat →</Link>
          </div>
        </div>
      </section>

      {/* ================================================
          STATS BAR
          ================================================ */}
      <section className={styles.statsBar}>
        {[
          { value: '1,000+', label: 'Global Alumni' },
          { value: '200+', label: 'Real Projects Modeled' },
          { value: '160+', label: 'Hours of Training' },
          { value: '4.8 / 5', label: 'Google Rating' },
          { value: '≤ 40', label: 'Students Per Cohort' },
        ].map((s, i) => (
          <div key={i} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ================================================
          PROGRAMS SECTION
          ================================================ */}
      <section id="programs" className={styles.programsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>What We Teach</span>
          <h2 className={styles.sectionTitle}>
            {courses.length === 1 ? 'Our Flagship Program.' : `${courses.length} Programs.`}<br/>
            One Clear Goal — Engineering Mastery.
          </h2>
          <p className={styles.sectionSubtitle}>
            {courses.length === 1 ? 'This program is' : 'Each program is'} built around one niche, taught live by engineers who are actively working
            on the projects you aspire to work on.
          </p>
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              {/* Badge */}
              <span className={`${styles.courseBadge} ${styles[`badge_${course.badgeType}`]}`}>
                {course.badge}
              </span>

              {/* Color bar */}
              <div className={styles.courseColorBar} style={{ background: course.color }} />

              {/* Visual image */}
              <div className={styles.courseVisual} style={{ '--course-color': course.color }}>
                {course.image && (
                  <Image src={course.image} alt={course.title} fill style={{ objectFit: 'cover' }} />
                )}
                <div className={styles.courseVisualGlow} />
              </div>

              <div className={styles.courseBody}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDesc}>{course.tagline}</p>

                <div className={styles.courseMeta}>
                  <span className={styles.metaBadge}>⏱ {course.duration}</span>
                  <span className={styles.metaBadge}>🎥 {course.sessions}</span>
                  <span className={styles.metaBadge}>📡 {course.mode}</span>
                </div>

                <div className={styles.courseFooter}>
                  <div>
                    <div className={styles.coursePrice}>{formatPrice(course.price)}</div>
                    <div className={styles.courseEmi}>
                      or {formatPrice(Math.ceil(course.price / course.emiMonths))}/mo × {course.emiMonths}
                    </div>
                  </div>
                  <Link href={`/courses/${course.id}`} className="btnPrimary">
                    View Program
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          HOW IT WORKS
          ================================================ */}
      <section id="about" className={styles.howSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>The Process</span>
          <h2 className={styles.sectionTitle}>Not a Course. A Career Launchpad.</h2>
          <p className={styles.sectionSubtitle}>
            We designed this end-to-end — from day one of your application to the day you finish your capstone project.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {[
            {
              step: '01',
              title: 'Apply in 5 Minutes',
              desc: 'No entrance test. No long forms. Just tell us who you are and where you want to go. Our team calls every applicant personally — because we take your career as seriously as you do.',
            },
            {
              step: '02',
              title: 'Learn Live, Not Alone',
              desc: 'Twice a week, you\'re in a live class with 39 other engineers who are just as serious as you. Ask questions, debate design decisions, and learn from what your peers get wrong — not just what your instructor says.',
            },
            {
              step: '03',
              title: 'Work on the Real Thing',
              desc: 'Forget dummy datasets. You\'ll analyse actual load cases from NHAI projects, model real bridge geometries in MIDAS Civil, and submit deliverables that practicing engineers review with the same standard as client submissions.',
            },
            {
              step: '04',
              title: 'Build a Master Portfolio',
              desc: 'Leave the program with professional-grade design models, calculation reports, and BIM deliverables. Our alumni don\'t just put \'MIDAS Civil\' on their resume — they bring their actual project models to interviews.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step}</div>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          TESTIMONIALS
          ================================================ */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>In Their Own Words</span>
          <h2 className={styles.sectionTitle}>Engineers Who Took the<br/>Leap — and Landed.</h2>
          <p className={styles.sectionSubtitle}>
            We don't cherry-pick. These are unsolicited reviews from engineers who went through the cohort.
          </p>
        </div>
        <Testimonials />
      </section>

      {/* ================================================
          TOOLS & TECH
          ================================================ */}
      <section className={styles.toolsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>The Toolkit</span>
          <h2 className={styles.sectionTitle}>Software That Gets You Hired.</h2>
          <p className={styles.sectionSubtitle}>
            Every tool we teach is heavily utilized by top tier engineering firms and consultancies globally.
            We don't waste your time on outdated software.
          </p>
        </div>
        <div className={styles.toolsGrid}>
          {TOOLS.map((tool) => (
            <div key={tool.name} className={styles.toolChip}>
              <span className={styles.toolIcon}>{tool.icon}</span>
              <span className={styles.toolName}>{tool.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================
          FAQ
          ================================================ */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Got Questions?</span>
          <h2 className={styles.sectionTitle}>Let's Clear the Air.</h2>
          <p className={styles.sectionSubtitle}>
            If something isn't answered here, call us. We pick up.
          </p>
        </div>
        <FAQ />
      </section>

      {/* ================================================
          FINAL CTA BAND
          ================================================ */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaBandInner}>
          <h2 className={styles.ctaTitle}>One year from now,<br/>where will you be?</h2>
          <p className={styles.ctaDesc}>
            The June cohort has 40 seats and a waitlist that grows every week.
            The application takes 5 minutes. The decision could change your entire career.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btnGold">Apply Now — Free & Fast</Link>
            <Link href="/contact" className={styles.ctaSecondaryLink}>Talk to the Team →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
