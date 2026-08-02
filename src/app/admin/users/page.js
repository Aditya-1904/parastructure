import { clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getCourse, getAllCourses } from '@/data/courses';
import { revalidatePath } from 'next/cache';
import styles from '@/app/dashboard/dashboard.module.css';
import adminStyles from '@/app/admin/admin.module.css';

export default async function AdminUsers() {
  const client = await clerkClient();
  const usersResponse = await client.users.getUserList({
    limit: 50,
  });
  const users = usersResponse.data;

  // Fetch all enrollments to see who has access to what
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('user_id, course_id, status');

  const allCourses = await getAllCourses();

  async function grantAccess(formData) {
    'use server';
    const userId = formData.get('userId');
    const courseId = formData.get('courseId');

    if (!userId || !courseId) return;

    // Insert or update an active enrollment
    const { error: insertError } = await supabase
      .from('enrollments')
      .upsert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        payment_method: 'admin_grant',
        payment_id: 'MANUAL_GRANT',
      }, { onConflict: 'user_id, course_id' });

    if (insertError) {
      console.error('Failed to grant access:', insertError);
    } else {
      revalidatePath('/admin/users');
    }
  }

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>User Management</h1>
        <p className={styles.subtitle}>View registered users and manually manage course access.</p>
      </section>

      <section>
        <div className={adminStyles.tableWrapper}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active Courses</th>
                <th>Grant Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const userEnrollments = enrollments?.filter(e => e.user_id === u.id && e.status === 'active') || [];
                const role = u.publicMetadata?.role === 'admin' ? 'Admin' : 'Student';
                
                return (
                  <tr key={u.id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.emailAddresses[0]?.emailAddress}</td>
                    <td>
                      <span className={`${adminStyles.status} ${role === 'Admin' ? adminStyles.active : adminStyles.pending_verification}`}>
                        {role}
                      </span>
                    </td>
                    <td>
                      {userEnrollments.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {userEnrollments.map(e => (
                            <span key={e.course_id} style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--bg-surface-2)', borderRadius: '4px' }}>
                              {e.course_id.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <form action={grantAccess} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="hidden" name="userId" value={u.id} />
                        <select name="courseId" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                          <option value="">Select...</option>
                          {allCourses.map(c => (
                            <option key={c.id} value={c.id}>{c.shortTitle}</option>
                          ))}
                        </select>
                        <button type="submit" className={adminStyles.approveBtn} style={{ padding: '4px 12px' }}>Grant</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className={adminStyles.emptyState} style={{ padding: '3rem', textAlign: 'center' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
