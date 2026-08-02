import { supabase } from '@/lib/supabase';
import styles from '@/app/dashboard/dashboard.module.css';
import adminStyles from '@/app/admin/admin.module.css';
import BulkCourseImporter from '@/components/BulkCourseImporter';
import { addCourseAction } from '@/actions/adminCourses';
import AdminCourseTableRow from '@/components/AdminCourseTableRow';

export default async function AdminCoursesPage() {
  // Fetch all courses (even unpublished)
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
  }

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>Course Creator</h1>
        <p className={styles.subtitle}>Launch new courses and manage your catalog.</p>
      </section>

      <BulkCourseImporter />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* ADD COURSE FORM */}
        <section style={{ background: 'var(--bg-surface-2)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <h2 className={styles.sectionTitle} style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create New Course</h2>
          <form action={addCourseAction} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Course Title *</label>
              <input type="text" name="title" required placeholder="e.g. Advanced Structural Dynamics" className={styles.input} style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Short Title * (For tabs & badges)</label>
              <input type="text" name="short_title" required placeholder="e.g. Structural Dynamics" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Course ID (Optional URL slug)</label>
              <input type="text" name="id" placeholder="e.g. dynamics (auto-generated if blank)" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Tagline (One sentence)</label>
              <input type="text" name="tagline" placeholder="Master the principles of dynamic loading on civil structures" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Description</label>
              <textarea name="description" rows="4" placeholder="Detailed syllabus or course highlights..." style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Selling Price (₹)</label>
              <input type="number" name="price" required placeholder="e.g. 4999" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>
            
            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Original Price (₹) - For Strikethrough</label>
              <input type="number" name="original_price" placeholder="e.g. 9999" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Duration / Access Time</label>
              <input type="text" name="duration" placeholder="e.g. 6 Months Access" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Content Length</label>
              <input type="text" name="hours" placeholder="e.g. 40+ Hours" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Mode</label>
              <select name="mode" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }}>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div style={{ flex: '1 1 30%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Level</label>
              <select name="level" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input type="checkbox" name="is_published" id="is_published" defaultChecked />
              <label htmlFor="is_published" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Publish Immediately (Visible to students)</label>
            </div>

            <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
              <button type="submit" className={styles.primaryButton} style={{ width: '100%' }}>Launch Course</button>
            </div>
          </form>
        </section>

        {/* LIST VIEW */}
        <section>
          <div className={adminStyles.tableWrapper}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((c) => (
                  <AdminCourseTableRow key={c.id} course={c} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  );
}
