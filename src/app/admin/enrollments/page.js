import { supabase } from '@/lib/supabase';
import { clerkClient } from '@clerk/nextjs/server';
import styles from '@/app/dashboard/dashboard.module.css';
import adminStyles from '@/app/admin/admin.module.css';
import AdminEnrollmentTableRow from '@/components/AdminEnrollmentTableRow';

export default async function AdminEnrollments() {
  // Fetch all enrollments
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrollments:', error);
  }

  // Fetch Clerk users to map names
  const client = await clerkClient();
  const usersResponse = await client.users.getUserList({ limit: 100 });
  const users = usersResponse.data;
  
  const userMap = {};
  users.forEach(u => {
    userMap[u.id] = {
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown User',
      email: u.emailAddresses?.[0]?.emailAddress || 'No Email'
    };
  });

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>Enrollment Management</h1>
        <p className={styles.subtitle}>Review transactions and approve manual bank transfers.</p>
      </section>

      <section>
        <div className={adminStyles.tableWrapper}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Course</th>
                <th>Method</th>
                <th>Reference/UTR</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments?.map((e) => {
                const student = userMap[e.user_id] || { name: 'Unknown', email: e.user_id };
                return (
                  <AdminEnrollmentTableRow key={e.id} enrollment={e} student={student} />
                );
              })}
              {(!enrollments || enrollments.length === 0) && (
                <tr>
                  <td colSpan="7" className={adminStyles.emptyState} style={{ padding: '3rem', textAlign: 'center' }}>
                    No enrollments found.
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
