import { supabase } from '@/lib/supabase';

import styles from '@/app/dashboard/dashboard.module.css';

export default async function AdminOverview() {
  // Fetch all enrollments for basic metrics
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('status, course_id, payment_method');

  if (error) {
    console.error('Error fetching enrollments:', error);
  }

  const total = enrollments?.length || 0;
  const pending = enrollments?.filter(e => e.status === 'pending_verification').length || 0;
  const active = enrollments?.filter(e => e.status === 'active').length || 0;

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>Admin Overview</h1>
        <p className={styles.subtitle}>High-level metrics for your platform.</p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Key Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--bg-surface-2)', padding: '2rem', borderRadius: 'var(--r-lg)', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Enrollments</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{total}</div>
          </div>
          
          <div style={{ background: 'var(--bg-surface-2)', padding: '2rem', borderRadius: 'var(--r-lg)', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Students</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{active}</div>
          </div>

          <div style={{ background: 'var(--bg-surface-2)', padding: '2rem', borderRadius: 'var(--r-lg)', border: '1px solid var(--card-border)', borderColor: pending > 0 ? '#ffb142' : 'var(--card-border)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Pending Verification</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: pending > 0 ? '#ffb142' : 'var(--text-primary)' }}>{pending}</div>
          </div>

        </div>
      </section>
    </>
  );
}
