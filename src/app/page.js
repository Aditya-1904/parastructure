import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import { getAllCourses, TOOLS } from '@/data/courses';
import { formatPrice } from '@/config/payment';
import { auth } from '@clerk/nextjs/server';
import styles from './page.module.css';

export default async function Home() {
  const courses = await getAllCourses();
  const { userId } = await auth();

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
          <h1 className={styles.heroTitle}>
            The Bridge Engineer{' '}
            <span className={styles.heroTitleAccent}>India Needs</span>
            {' '}Is You.
          </h1>
          <div className={styles.heroButtons}>
            {userId ? (
              <>
                <Link href="/dashboard" className="btnGold">Go to Dashboard</Link>
                <Link href="/#programs" className="btnSecondary">Explore Programs</Link>
              </>
            ) : (
              <>
                <Link href="/#programs" className="btnGold">View Programs</Link>
                <Link href="/contact" className="btnSecondary">Get the Syllabus</Link>
              </>
            )}
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
              Next Cohort · Only 40 Seats · Applications Close Soon
            </p>
            <Link href="/contact" className="btnGold">Reserve Your Seat →</Link>
          </div>
        </div>
      </section>




      {/* ================================================
          PROGRAMS SECTION
          ================================================ */}
      <section id="programs" className={styles.programsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>What We Teach</span>
          <h2 className={styles.sectionTitle}>
            {courses.length === 1 ? 'Our Flagship Program.' : `${courses.length} Programs.`}
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
                  {course.hasRecordings && <span className={styles.metaBadge}>📼 Recordings Available</span>}
                </div>

                <div className={styles.courseFooter}>
                  <div></div>
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
          <h2 className={styles.sectionTitle}>Your Journey Starts Here</h2>
          <p className={styles.sectionSubtitle}>
            We designed this end-to-end — from day one of your application to the day you finish your capstone project.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {[
            {
              step: '01',
              title: 'Take the First Step',
              desc: 'Every bridge engineer starts somewhere. Apply with a few details, and we\'ll help you begin your learning journey with confidence.',
            },
            {
              step: '02',
              title: 'Learn With Guidance',
              desc: 'Join live classes, ask questions freely, and build your understanding step by step with instructor support.',
            },
            {
              step: '03',
              title: 'Turn Theory Into Practice',
              desc: 'Move beyond textbooks by solving practical bridge design problems, performing calculations, and creating engineering models.',
            },
            {
              step: '04',
              title: 'Build a Portfolio You Can Be Proud Of',
              desc: 'Complete a capstone bridge design project and finish the program with work that showcases your skills and progress.',
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
          <h2 className={styles.sectionTitle}>Student Feedback</h2>
          <p className={styles.sectionSubtitle}>
            Honest feedback from students who learned with ParaStructure.
          </p>
        </div>
        <Testimonials />
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
          <h2 className={styles.ctaTitle}>One year from now,<br />where will you be?</h2>
          <p className={styles.ctaDesc}>
            The June cohort has 40 seats and a waitlist that grows every week.
            The application takes 5 minutes. The decision could change your entire career.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/#programs" className="btnGold">Apply Now — Free & Fast</Link>
            <Link href="/contact" className={styles.ctaSecondaryLink}>Talk to the Team →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
