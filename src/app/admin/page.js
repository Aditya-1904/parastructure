import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Very basic authorization: Check if the user is the admin.
  // In production, we'd check against a specific admin email or Clerk role.
  const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_CLERK_ID; 
  if (ADMIN_USER_ID && userId !== ADMIN_USER_ID) {
    // If we have an admin ID set and it doesn't match, block them.
    return (
      <div className={styles.container}>
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Fetch all enrollments
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrollments for admin:', error);
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSpacer}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Admin Operations</h1>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Enrollments</h3>
            <p className={styles.statNumber}>{enrollments?.length || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Pending Verification</h3>
            <p className={styles.statNumber}>
              {enrollments?.filter(e => e.status === 'pending_verification').length || 0}
            </p>
          </div>
        </div>

        <h2 className={styles.subtitle}>Recent Transactions</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>User ID</th>
                <th>Course</th>
                <th>Method</th>
                <th>Reference/UTR</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments?.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className={styles.userId} title={e.user_id}>{e.user_id.substring(0, 10)}...</td>
                  <td>{e.course_id.toUpperCase()}</td>
                  <td>{e.payment_method === 'bank' ? 'Bank Transfer' : 'Online'}</td>
                  <td>{e.payment_id}</td>
                  <td>
                    <span className={`${styles.status} ${styles[e.status]}`}>
                      {e.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {e.status === 'pending_verification' && (
                      <form action={async () => {
                        'use server';
                        const { revalidatePath } = await import('next/cache');
                        const { error: updateError } = await supabase
                          .from('enrollments')
                          .update({ status: 'active' })
                          .eq('id', e.id);
                          
                        if (updateError) {
                          console.error("Failed to approve:", updateError);
                        } else {
                          revalidatePath('/admin');
                          revalidatePath('/dashboard');
                        }
                      }}>
                        <button type="submit" className={styles.approveBtn}>Approve</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {(!enrollments || enrollments.length === 0) && (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>No enrollments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
