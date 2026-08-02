import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getCourse } from '@/data/courses';
import { formatPrice } from '@/config/payment';
import Link from 'next/link';
import styles from '@/app/dashboard/dashboard.module.css';
import adminStyles from '@/app/admin/admin.module.css';

export default async function PaymentsPage() {
  const user = await currentUser();
  if (!user) return null;

  // Fetch transaction history
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
  }

  const mappedEnrollments = await Promise.all(
    (enrollments || []).map(async (e) => {
      const course = await getCourse(e.course_id);
      return { ...e, course };
    })
  );

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>Payment History</h1>
        <p className={styles.subtitle}>View your past transactions and enrollment statuses.</p>
      </section>

      <section>
        <div className={adminStyles.tableWrapper}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Reference ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mappedEnrollments.map((e) => {
                const course = e.course;
                return (
                  <tr key={e.id}>
                    <td>{new Date(e.created_at).toLocaleDateString()}</td>
                    <td>{course ? course.shortTitle : e.course_id.toUpperCase()}</td>
                    <td>{course ? formatPrice(course.price) : 'N/A'}</td>
                    <td>{e.payment_method === 'bank' ? 'Bank Transfer' : 'Online'}</td>
                    <td>{e.payment_id}</td>
                    <td>
                      <span className={`${adminStyles.status} ${adminStyles[e.status]}`}>
                        {e.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {mappedEnrollments.length === 0 && (
                <tr>
                  <td colSpan="6" className={adminStyles.emptyState} style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No payment history found.</p>
                    <Link href="/#programs" className="btnPrimary">Explore Programs</Link>
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
