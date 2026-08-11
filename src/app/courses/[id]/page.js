import Link from 'next/link';
import Image from 'next/image';
import Testimonials from '@/components/Testimonials';
import { getCourse } from '@/data/courses';
import { formatPrice } from '@/config/payment';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import styles from './course.module.css';

import ExpandableDescription from '@/components/ExpandableDescription';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) return {};
  return {
    title: `${course.title} | Parastructure`,
    description: course.description,
  };
}

export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = await getCourse(id);
  
  if (!course) {
    notFound();
  }

  const { userId } = await auth();
  const emiAmount = Math.ceil(course.price / course.emiMonths);

  let isEnrolled = false;
  if (userId) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', id)
      .eq('status', 'active')
      .single();
    
    if (enrollment) {
      isEnrolled = true;
    }
  }

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

          {/* Long Description Section */}
          {course.longDescription && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About This Program</h2>
              <ExpandableDescription 
                paragraphs={course.longDescription} 
                fallback={course.description} 
                className={styles.sectionDesc} 
              />
            </section>
          )}

          {/* Outcomes */}
          {course.outcomes && course.outcomes.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>What You'll Be Able to Do:</h2>
              <div className={styles.outcomesGrid}>
                {course.outcomes.map((o, i) => (
                  <div key={i} className={styles.outcomeCard}>
                    <span className={styles.outcomeCheck}>✓</span>
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Target Audience & Tools */}
          {course.targetAudience && course.targetAudience.length > 0 && (
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
            </section>
          )}

          {/* Curriculum */}
          {course.modules && course.modules.length > 0 && (
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
          {course.testimonials && course.testimonials.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Student feedback</h2>
              <Testimonials items={course.testimonials} />
            </section>
          )}

        </div>

        {/* ---- Sticky Sidebar (Right Column) ---- */}
        <aside className={styles.sidebar}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingTop} style={{ '--course-color': course.color }}>
              {isEnrolled ? (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-inverted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-inverted)' }}>You own this course!</h3>
                  <p style={{ opacity: 0.9, fontSize: '0.9rem', color: 'var(--text-inverted)' }}>You are fully enrolled in this program.</p>
                </div>
              ) : (
                <>
                  <div className={styles.pricingLabel}>Program Fee</div>
                  <div className={styles.price}>{formatPrice(course.price)}</div>
                  <div className={styles.emiLine}>
                    or <strong>{formatPrice(emiAmount)}/mo</strong> × {course.emiMonths} months
                  </div>
                </>
              )}
            </div>

            <ul className={styles.includesList}>
              {(course.features || [
                `${course.sessions} live sessions`,
                `${course.hours} of content`,
                'Recordings for 1 year',
                'Real project data & reviews',
                '1-on-1 mentorship',
                'Portfolio building',
                'Community access',
                '7-day money-back guarantee',
              ]).map((item) => (
                <li key={item} className={styles.includesItem}>
                  <span className={styles.includesCheck}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className={styles.pricingCardButtons}>
              {isEnrolled ? (
                <Link
                  href={`/dashboard/learn/${course.id}`}
                  className="btnGold"
                  style={{ display: 'block', width: '100%', textAlign: 'center' }}
                >
                  Go to Course Dashboard →
                </Link>
              ) : (
                <Link
                  href={`/checkout/${course.id}`}
                  className="btnGold"
                  style={{ display: 'block', width: '100%', textAlign: 'center' }}
                >
                  Enroll Now
                </Link>
              )}
            </div>

            {!isEnrolled && (
              <p className={styles.guarantee}>
                🔒 Secure payment via Razorpay · UPI, Cards, Net Banking, EMI
              </p>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
