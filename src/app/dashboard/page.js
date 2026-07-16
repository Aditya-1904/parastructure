import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { getCourse } from '@/data/courses';
import { supabase } from '@/lib/supabase';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return null;

  let myCourses = [];

  // Try to fetch real enrollments from Supabase
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('course_id, status')
    .eq('user_id', user.id);
    
  if (error) {
    throw new Error(`Supabase Error: ${error.message}`);
  }
  
  // Map course IDs to actual course data and inject status
  myCourses = enrollments.map(e => {
    const courseData = getCourse(e.course_id);
    return courseData ? { ...courseData, enrollmentStatus: e.status } : null;
  }).filter(Boolean);

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Menu</div>
          <Link href="/dashboard" className={`${styles.navLink} ${styles.navLinkActive}`}>
            <span>📚</span> My Courses
          </Link>
          <div className={styles.navLink} style={{ opacity: 0.4, cursor: 'default' }}>
            <span>👤</span> Profile Settings <span style={{ fontSize: '0.65rem', marginLeft: '4px', color: 'var(--text-tertiary)' }}>Soon</span>
          </div>
          <div className={styles.navLink} style={{ opacity: 0.4, cursor: 'default' }}>
            <span>💳</span> Payment History <span style={{ fontSize: '0.65rem', marginLeft: '4px', color: 'var(--text-tertiary)' }}>Soon</span>
          </div>
          <div className={styles.navLink} style={{ opacity: 0.4, cursor: 'default' }}>
            <span>🎓</span> Certificates <span style={{ fontSize: '0.65rem', marginLeft: '4px', color: 'var(--text-tertiary)' }}>Soon</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <section className={styles.welcomeSection}>
            <h1 className={styles.greeting}>Welcome back, {user?.firstName || 'Engineer'}!</h1>
            <p className={styles.subtitle}>Ready to continue your bridge engineering journey?</p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>My Enrollments</h2>
            
            {myCourses.length > 0 ? (
              <div className={styles.courseGrid}>
                {myCourses.map(course => (
                  <div key={course.id} className={styles.courseCard}>
                    <div className={styles.cardImage}>
                      <div 
                        className={styles.cardImageInner} 
                        style={{ backgroundImage: `url(${course.image})` }} 
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.courseTitle}>{course.title}</h3>
                      <div className={styles.progressContainer}>
                        <div className={styles.progressHeader}>
                          <span>Overall Progress</span>
                          <span>0%</span>
                        </div>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: '0%' }} />
                        </div>
                      </div>
                      {course.enrollmentStatus === 'active' ? (
                        <Link href={`/dashboard/learn/${course.id}`} className="btnGold" style={{ textAlign: 'center', display: 'block' }}>
                          Resume Learning
                        </Link>
                      ) : (
                        <div className={styles.pendingBadge}>
                          ⏳ Pending Admin Approval
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>No active enrollments</h3>
                <p>You haven't enrolled in any cohorts yet.</p>
                <Link href="/#programs" className="btnPrimary">Explore Programs</Link>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
