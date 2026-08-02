import { supabase } from '@/lib/supabase';
import { getAllCourses } from '@/data/courses';
import { clerkClient } from '@clerk/nextjs/server';
import Link from 'next/link';
import styles from '@/app/dashboard/dashboard.module.css';
import adminStyles from '@/app/admin/admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionsPage({ searchParams }) {
  const allCourses = await getAllCourses();
  const selectedCourseId = (await searchParams)?.course || allCourses[0]?.id;

  // Fetch assignment modules for the selected course
  const { data: assignments, error: modError } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', selectedCourseId)
    .eq('type', 'assignment')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  if (modError) {
    console.error('Error fetching assignments:', modError);
  }

  const assignmentIds = (assignments || []).map(a => a.id);

  // Fetch questions for these assignments
  let allQuestions = [];
  let submissions = [];
  if (assignmentIds.length > 0) {
    const { data: qData } = await supabase
      .from('assignment_questions')
      .select('*')
      .in('module_id', assignmentIds)
      .order('created_at', { ascending: true });
    allQuestions = qData || [];

    const { data: sData } = await supabase
      .from('assignment_submissions')
      .select('*')
      .in('module_id', assignmentIds)
      .order('created_at', { ascending: false });
    submissions = sData || [];
  }

  // Fetch active enrollments for this course
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('course_id', selectedCourseId)
    .eq('status', 'active');
  
  const enrolledUserIds = (enrollments || []).map(e => e.user_id);

  // Fetch Clerk user details to map names and emails
  const client = await clerkClient();
  const usersResponse = await client.users.getUserList({ limit: 100 });
  const users = usersResponse.data;
  
  const userMap = {};
  users.forEach(u => {
    userMap[u.id] = {
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown Student',
      email: u.emailAddresses?.[0]?.emailAddress || 'No Email'
    };
  });

  return (
    <>
      <section className={styles.welcomeSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className={styles.greeting}>Assignments & Grading</h1>
            <p className={styles.subtitle}>Review student MCQ quiz submissions, evaluate scores, and monitor class completion rates.</p>
          </div>
          <Link href={`/admin/content?course=${selectedCourseId}`} className="btnPrimary" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
            + Create New Assignment
          </Link>
        </div>
      </section>

      {/* Course Selector Tabs */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', overflowX: 'auto' }}>
          {allCourses.map(course => {
            const isActive = course.id === selectedCourseId;
            return (
              <Link 
                key={course.id} 
                href={`/admin/submissions?course=${course.id}`}
                style={{
                  padding: '10px 20px',
                  borderRadius: '24px',
                  background: isActive ? 'var(--accent-gold)' : 'var(--bg-surface-2)',
                  color: isActive ? '#000' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  border: isActive ? '1px solid var(--accent-gold)' : '1px solid var(--card-border)'
                }}
              >
                {course.shortTitle || course.title}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Assignments List & Grading */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {(!assignments || assignments.length === 0) && (
          <div style={{ background: 'var(--bg-surface-2)', padding: '4rem 2rem', borderRadius: '16px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>No Assignments Created Yet</h2>
            <p style={{ color: 'var(--text-tertiary)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              You have not published any assignment modules for this course. Head over to Course Content to create an assignment and add MCQ questions.
            </p>
            <Link href={`/admin/content?course=${selectedCourseId}`} className="btnGold" style={{ display: 'inline-block', width: 'auto', padding: '12px 28px', textDecoration: 'none' }}>
              Go to Course Content →
            </Link>
          </div>
        )}

        {assignments?.map((mod, index) => {
          const modQuestions = allQuestions.filter(q => q.module_id === mod.id);
          const modSubmissions = submissions.filter(s => s.module_id === mod.id);
          const submittedUserIds = new Set(modSubmissions.map(s => s.user_id));
          const pendingUserIds = enrolledUserIds.filter(id => !submittedUserIds.has(id));
          
          // Average score calculation
          let avgPercentage = 0;
          if (modSubmissions.length > 0) {
            const totalPct = modSubmissions.reduce((acc, s) => {
              const totalQ = s.total_questions || modQuestions.length || 1;
              return acc + (s.score / totalQ) * 100;
            }, 0);
            avgPercentage = (totalPct / modSubmissions.length).toFixed(1);
          }

          return (
            <div key={mod.id} style={{ background: 'var(--bg-surface-2)', borderRadius: '16px', border: '1px solid var(--card-border)', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              
              {/* Card Header */}
              <div style={{ padding: '2rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ background: 'rgba(200, 168, 107, 0.15)', color: 'var(--accent-gold)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Assignment #{index + 1}
                    </span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>📅 {mod.date_string ? mod.date_string.split('|')[0].trim() : 'No date'}</span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-primary)' }}>{mod.title}</h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link href={`/admin/content/quiz?module=${mod.id}`} className="btnGold" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.875rem', textDecoration: 'none' }}>
                    ⚙️ Manage MCQ Questions ({modQuestions.length})
                  </Link>
                </div>
              </div>

              {/* Metrics Ribbon */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ background: 'var(--bg-surface-2)', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Enrolled Students</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{enrolledUserIds.length}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-2)', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Submissions Received</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2ed573' }}>{modSubmissions.length}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-2)', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pending Attempts</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffb84d' }}>{pendingUserIds.length}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-2)', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Class Average Score</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{modSubmissions.length > 0 ? `${avgPercentage}%` : 'N/A'}</div>
                </div>
              </div>

              {/* Submissions Section */}
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏆 Student Grades & Submissions</span>
                  <span style={{ fontSize: '0.8125rem', background: 'var(--bg-surface)', padding: '2px 10px', borderRadius: '12px', color: 'var(--text-secondary)' }}>{modSubmissions.length} Total</span>
                </h3>

                {modSubmissions.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: '12px', border: '1px dashed var(--card-border)', color: 'var(--text-tertiary)' }}>
                    No students have submitted this assignment yet.
                  </div>
                ) : (
                  <div className={adminStyles.tableWrapper} style={{ marginBottom: '2.5rem' }}>
                    <table className={adminStyles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '12px 16px' }}>Student</th>
                          <th style={{ textAlign: 'left', padding: '12px 16px' }}>Submission Date</th>
                          <th style={{ textAlign: 'center', padding: '12px 16px' }}>Score</th>
                          <th style={{ textAlign: 'center', padding: '12px 16px' }}>Percentage</th>
                          <th style={{ textAlign: 'left', padding: '12px 16px' }}>Detailed Answers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modSubmissions.map((sub) => {
                          const student = userMap[sub.user_id] || { name: 'Student ID: ' + sub.user_id.substring(0, 8), email: 'Unknown Email' };
                          const totalQ = sub.total_questions || modQuestions.length || 1;
                          const pct = Math.round((sub.score / totalQ) * 100);
                          
                          let badgeBg = 'rgba(255, 77, 77, 0.15)';
                          let badgeCol = '#ff4d4d';
                          let badgeText = 'Needs Focus';
                          if (pct >= 80) {
                            badgeBg = 'rgba(46, 213, 115, 0.15)';
                            badgeCol = '#2ed573';
                            badgeText = 'Excellent';
                          } else if (pct >= 50) {
                            badgeBg = 'rgba(255, 184, 77, 0.15)';
                            badgeCol = '#ffb84d';
                            badgeText = 'Satisfactory';
                          }

                          const dateFormatted = new Date(sub.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          });

                          return (
                            <tr key={sub.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                              <td style={{ padding: '16px' }}>
                                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>{student.name}</strong>
                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{student.email}</span>
                              </td>
                              <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {dateFormatted}
                              </td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{sub.score}</span>
                                <span style={{ color: 'var(--text-tertiary)' }}> / {totalQ}</span>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                <span style={{ background: badgeBg, color: badgeCol, padding: '6px 12px', borderRadius: '16px', fontSize: '0.8125rem', fontWeight: 600, display: 'inline-block' }}>
                                  {pct}% ({badgeText})
                                </span>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <details style={{ cursor: 'pointer', background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                                  <summary style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--accent-gold)' }}>View Answer Sheet</summary>
                                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', fontSize: '0.8125rem' }}>
                                    {modQuestions.map((q, qIdx) => {
                                      const studentAnsIdx = sub.answers?.[q.id];
                                      const isCorrect = studentAnsIdx === q.correct_option_index;
                                      const studentAnsText = q.options?.[studentAnsIdx] || 'No Answer';
                                      const correctAnsText = q.options?.[q.correct_option_index] || 'Unknown';

                                      return (
                                        <div key={q.id} style={{ padding: '8px', background: isCorrect ? 'rgba(46, 213, 115, 0.05)' : 'rgba(255, 77, 77, 0.05)', borderRadius: '6px', borderLeft: `3px solid ${isCorrect ? '#2ed573' : '#ff4d4d'}` }}>
                                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                            Q{qIdx + 1}: {q.question_text}
                                          </div>
                                          <div style={{ color: isCorrect ? '#2ed573' : '#ff4d4d' }}>
                                            <strong>Student Answer:</strong> {studentAnsText} {isCorrect ? '✓' : '✗'}
                                          </div>
                                          {!isCorrect && (
                                            <div style={{ color: '#2ed573', marginTop: '2px' }}>
                                              <strong>Correct Answer:</strong> {correctAnsText}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </details>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pending Students List */}
                {pendingUserIds.length > 0 && (
                  <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#ffb84d', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>⏳ Pending Attempts ({pendingUserIds.length} Enrolled Students Have Not Submitted)</span>
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {pendingUserIds.map(uid => {
                        const student = userMap[uid] || { name: 'Student ID: ' + uid.substring(0, 8), email: '' };
                        return (
                          <div key={uid} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{student.name}</span>
                            {student.email && <span style={{ color: 'var(--text-tertiary)' }}>({student.email})</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
