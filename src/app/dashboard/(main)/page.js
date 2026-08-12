import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { getCourse } from '@/data/courses';
import { supabase } from '@/lib/supabase';
import styles from '@/app/dashboard/dashboard.module.css';
import CertificateButton from '@/components/CertificateButton';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return null;

  let myCourses = [];
  let totalSubmissions = 0;

  // Try to fetch real enrollments from Supabase
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('course_id, status')
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Supabase error fetching enrollments:', error.message);
  }
  
  // Fetch global submissions for this user (for badges)
  const { data: allSubmissions } = await supabase
    .from('assignment_submissions')
    .select('id, module_id')
    .eq('user_id', user.id);
  totalSubmissions = (allSubmissions || []).length;

  // Map course IDs to actual course data, inject status, and calculate dynamic progress
  const mappedCourses = await Promise.all(
    (enrollments || []).map(async (e) => {
      const courseData = await getCourse(e.course_id);
      if (!courseData) return null;

      // Fetch modules for this course to compute real progress
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id, status, type, recording_link')
        .eq('course_id', e.course_id);

      const allModules = modules || [];
      const totalModules = allModules.length;

      let completedCount = 0;
      if (totalModules > 0) {
        // Count completed lectures (those with recording links or explicitly marked completed)
        const completedLectures = allModules.filter(m => m.type !== 'assignment' && (m.status === 'completed' || (m.recording_link && m.recording_link.trim() !== ''))).length;

        // Count submitted assignments FOR THIS SPECIFIC COURSE
        const courseModuleIds = allModules.map(m => m.id);
        const courseSubmissions = (allSubmissions || []).filter(sub => courseModuleIds.includes(sub.module_id)).length;

        completedCount = completedLectures + courseSubmissions;
      }

      const progressPercent = totalModules > 0 ? Math.min(100, Math.round((completedCount / totalModules) * 100)) : 0;

      return { ...courseData, enrollmentStatus: e.status, progressPercent };
    })
  );
  myCourses = mappedCourses.filter(Boolean);

  // Badge Logic
  const hasFirstSteps = myCourses.length > 0;
  const firstCourseName = hasFirstSteps ? myCourses[0].title : '';

  const hasActionTaker = totalSubmissions > 0;
  
  const completedCourses = myCourses.filter(c => c.progressPercent === 100);
  const hasMasterEngineer = completedCourses.length > 0;
  const masterCourseName = hasMasterEngineer ? completedCourses[0].title : '';

  // Format date for certificate
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>Welcome back, {user?.firstName || 'Engineer'} 🚀</h1>
        <p className={styles.subtitle}>Let's build something extraordinary today. Pick up where you left off below.</p>
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
                      <span>{course.progressPercent || 0}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${course.progressPercent || 0}%` }} />
                    </div>
                  </div>
                  {course.enrollmentStatus === 'active' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Link href={`/dashboard/learn/${course.id}`} className="btnGold" style={{ textAlign: 'center', display: 'block' }}>
                        Access Course Portal
                      </Link>
                      {course.progressPercent === 100 && (
                        <CertificateButton 
                          studentName={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Engineer'}
                          courseName={course.title}
                          completionDate={today}
                        />
                      )}
                    </div>
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
          <div className={styles.emptyState} style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-surface-2)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>No active enrollments</h3>
            <p style={{ color: 'var(--text-tertiary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>You haven't enrolled in any cohorts yet. Explore our world-class bridge engineering programs to get started.</p>
            <Link href="/#programs" className="btnGold" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}>Explore Programs →</Link>
          </div>
        )}
      </section>
      {/* Gamification: Badges Section (Compact & Repositioned) */}
      <section style={{ marginTop: '3rem' }}>
        <h2 className={styles.sectionTitle}>My Achievements</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Badge 1: First Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', padding: '1rem', borderRadius: '12px', flex: '1 1 280px', opacity: hasFirstSteps ? 1 : 0.5, filter: hasFirstSteps ? 'none' : 'grayscale(100%)' }}>
            <div style={{ fontSize: '2rem' }}>🎓</div>
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>First Steps</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {hasFirstSteps ? `Enrolled in ${firstCourseName}.` : 'Enroll in your first elite program.'}
              </p>
            </div>
          </div>

          {/* Badge 2: Action Taker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', padding: '1rem', borderRadius: '12px', flex: '1 1 280px', opacity: hasActionTaker ? 1 : 0.5, filter: hasActionTaker ? 'none' : 'grayscale(100%)' }}>
            <div style={{ fontSize: '2rem' }}>📝</div>
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Action Taker</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {hasActionTaker ? 'Submitted your first assignment.' : 'Submit your first assignment.'}
              </p>
            </div>
          </div>

          {/* Badge 3: Master Engineer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', padding: '1rem', borderRadius: '12px', flex: '1 1 280px', opacity: hasMasterEngineer ? 1 : 0.5, filter: hasMasterEngineer ? 'none' : 'grayscale(100%)' }}>
            <div style={{ fontSize: '2rem' }}>🏆</div>
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Master Engineer</h4>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {hasMasterEngineer ? `Hit 100% progress in ${masterCourseName}.` : 'Hit 100% progress in any program.'}
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
