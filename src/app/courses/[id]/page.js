import Link from 'next/link';
import Image from 'next/image';
import Testimonials from '@/components/Testimonials';
import { getCourse } from '@/data/courses';
import { formatPrice } from '@/config/payment';
import { notFound } from 'next/navigation';
import styles from './course.module.css';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) return {};
  return {
    title: `${course.title} | Parastructure`,
    description: course.description,
  };
}

export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) notFound();

  const emiAmount = Math.ceil(course.price / course.emiMonths);

  return (
    <div className={styles.page}>

      {/* ---- Hero Banner ---- */}
      <div className={styles.heroBanner} style={{ '--course-color': course.color }}>
        {course.image && (
          <Image 
            src={course.image} 
            alt={course.title} 
            fill 
            className={styles.heroBannerImage}
            priority
          />
        )}
        <div className={styles.heroBannerOverlay} />
        
        <div className={styles.heroBannerInner}>
          <Link href="/#programs" className={styles.backLink}>
            ← All Programs
          </Link>
          <div className={styles.heroBadges}>
            <span className={styles.levelBadge}>{course.level}</span>
            <span className={styles.modeBadge}>📡 {course.mode}</span>
            <span className={styles.langBadge}>🗣 {course.language}</span>
          </div>
          <h1 className={styles.heroTitle}>{course.title}</h1>
          <p className={styles.heroDesc}>{course.description}</p>
          
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><strong>{course.duration}</strong><span>Duration</span></div>
            <div className={styles.statDivider}/>
            <div className={styles.heroStat}><strong>{course.hours}</strong><span>Total Hours</span></div>
            <div className={styles.statDivider}/>
            <div className={styles.heroStat}><strong>{course.sessions}</strong><span>Live Sessions</span></div>
          </div>
        </div>
      </div>

      {/* ---- Content Grid ---- */}
      <div className={styles.contentLayout}>
        
        {/* Main Content (Left Column) */}
        <div className={styles.mainContent}>

          {/* What You'll Achieve (Udemy Box) */}
          <section className={styles.udemyBox}>
            <h2 className={styles.sectionTitle}>What you'll learn</h2>
            <div className={styles.outcomesGrid}>
              {course.outcomes.map((o, i) => (
                <div key={i} className={styles.outcomeCard}>
                  <span className={styles.outcomeCheck}>✓</span>
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Target Audience & Tools */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Requirements & Target Audience</h2>
            <ul className={styles.audienceList}>
              {course.targetAudience.map((a, i) => (
                <li key={i} className={styles.audienceItem}>
                  <span className={styles.audienceDot} style={{ background: course.color }}/>
                  {a}
                </li>
              ))}
            </ul>
            
            <div className={styles.toolsRow}>
              <strong style={{marginRight: 'var(--s-3)'}}>Tools covered:</strong>
              {course.tools.map((t) => (
                <span key={t} className={styles.toolChip}>{t}</span>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Course content</h2>
            <div className={styles.curriculumStats}>
              {course.modules.length} sections • {course.sessions} sessions • {course.hours} total length
            </div>
            <div className={styles.modules}>
              {course.modules.map((mod, i) => (
                <details key={i} className={styles.moduleItem}>
                  <summary className={styles.moduleSummary}>
                    <span className={styles.moduleToggle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                    <span className={styles.moduleTitle}>
                      {String(i + 1).padStart(2, '0')}. {mod.title}
                    </span>
                  </summary>
                  <ul className={styles.topicList}>
                    {mod.topics.map((t, j) => (
                      <li key={j} className={styles.topicItem}>
                        <span className={styles.topicDot}/>
                        {t}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          {/* Detailed Syllabus (Native Integration) */}
          {course.detailedSyllabus && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Deep Dive: Technical Syllabus</h2>
              <p className={styles.sectionDesc}>Stop looking at idealized textbook problems. Learn the actual codal workflows used by top-tier infrastructure companies.</p>
              
              <h3 className={styles.subTitle}>The Design Workflow</h3>
              <div className={styles.timeline}>
                {course.detailedSyllabus.designProcess.map((step, i) => (
                  <div key={i} className={styles.timelineItem}>
                    <div className={styles.timelineNum} style={{ color: course.color }}>{String(i + 1).padStart(2, '0')}</div>
                    <div className={styles.timelineContent}>
                      <h4 className={styles.timelineTitle}>{step.title}</h4>
                      <p className={styles.timelineDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className={styles.subTitle} style={{marginTop: 'var(--s-8)'}}>Mechanics & Theory</h3>
              <div className={styles.mechanicsGrid}>
                <div className={styles.mechanicCard}>
                  <h4 className={styles.mechanicTitle}>{course.detailedSyllabus.mechanicsComparison.conventional.title}</h4>
                  <p className={styles.mechanicDesc}>{course.detailedSyllabus.mechanicsComparison.conventional.desc}</p>
                </div>
                <div className={styles.mechanicCard} style={{ borderColor: course.color, background: 'rgba(255,255,255,0.02)' }}>
                  <h4 className={styles.mechanicTitle} style={{ color: course.color }}>{course.detailedSyllabus.mechanicsComparison.prestressed.title}</h4>
                  <p className={styles.mechanicDesc}>{course.detailedSyllabus.mechanicsComparison.prestressed.desc}</p>
                </div>
              </div>
              <ul className={styles.benefitsList}>
                {course.detailedSyllabus.mechanicsComparison.benefits.map((b, i) => (
                  <li key={i} className={styles.benefitItem}>
                    <span className={styles.benefitCheck} style={{ color: course.color }}>✔</span>
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Cohort Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Logistics & Schedule</h2>
            <div className={styles.cohortGrid}>
              <div className={styles.cohortItem}>
                <span className={styles.cohortLabel}>Next Cohort</span>
                <strong className={styles.cohortValue}>June 15, 2026</strong>
              </div>
              <div className={styles.cohortItem}>
                <span className={styles.cohortLabel}>Batch Size</span>
                <strong className={styles.cohortValue}>Max 40 Students</strong>
              </div>
              <div className={styles.cohortItem}>
                <span className={styles.cohortLabel}>Class Time</span>
                <strong className={styles.cohortValue}>Sat & Sun, 10–12 AM</strong>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Student feedback</h2>
            <Testimonials items={course.testimonials} />
          </section>

        </div>

        {/* ---- Sticky Sidebar (Right Column) ---- */}
        <aside className={styles.sidebar}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingTop} style={{ '--course-color': course.color }}>
              <div className={styles.pricingLabel}>Program Fee</div>
              <div className={styles.price}>{formatPrice(course.price)}</div>
              <div className={styles.emiLine}>
                or <strong>{formatPrice(emiAmount)}/mo</strong> × {course.emiMonths} months
              </div>
            </div>

            <ul className={styles.includesList}>
              {[
                `${course.sessions} live sessions`,
                `${course.hours} of content`,
                'Recordings for 1 year',
                'Real project data & reviews',
                '1-on-1 mentorship',
                'Portfolio building',
                'Community access',
                '7-day money-back guarantee',
              ].map((item) => (
                <li key={item} className={styles.includesItem}>
                  <span className={styles.includesCheck}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className={styles.pricingCardButtons}>
              <Link
                href={`/checkout/${course.id}`}
                className="btnGold"
                style={{ display: 'block', width: '100%', textAlign: 'center' }}
              >
                Enroll Now
              </Link>
            </div>

            <p className={styles.guarantee}>
              🔒 Secure payment via Razorpay · UPI, Cards, Net Banking, EMI
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
