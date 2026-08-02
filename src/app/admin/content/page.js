import { supabase } from '@/lib/supabase';
import { getAllCourses } from '@/data/courses';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import styles from '@/app/dashboard/dashboard.module.css';
import adminStyles from '@/app/admin/admin.module.css';
import BulkModuleImporter from '@/components/BulkModuleImporter';
import { formatDisplayDate, toDateTimeLocal, getSmartTimeStatus } from '@/utils/moduleHelpers';
import ClearAllModulesButton from '@/components/ClearAllModulesButton';
import AdminTableRow from '@/components/AdminTableRow';
import { sortCourseModulesByDate, saveModuleAction, deleteModuleAction, moveModuleAction, clearAllCourseModulesAction, sortCourseModulesByDateAction, toggleLockAction } from '@/actions/adminModules';


export default async function AdminContentPage({ searchParams }) {
  const allCourses = await getAllCourses();
  const selectedCourseId = (await searchParams)?.course || allCourses[0]?.id;

  // Fetch modules for the selected course
  const { data: modules, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', selectedCourseId)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching modules:', error);
  }

  const editModuleId = (await searchParams)?.edit || null;
  const editModule = editModuleId ? modules?.find(m => m.id === editModuleId) : null;
  const editModuleIndex = editModule ? (modules?.findIndex(m => m.id === editModule.id) + 1) : null;

  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>Course Content Manager</h1>
        <p className={styles.subtitle}>Organize your curriculum, manage live links, and build interactive quizzes.</p>
      </section>

      {/* Course Selector Tabs */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', overflowX: 'auto' }}>
          {allCourses.map(course => {
            const isActive = course.id === selectedCourseId;
            return (
              <Link 
                key={course.id} 
                href={`/admin/content?course=${course.id}`}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  background: isActive ? 'var(--accent-gold)' : 'var(--bg-surface-2)',
                  color: isActive ? '#000' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 14px rgba(200, 168, 107, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {course.shortTitle}
              </Link>
            );
          })}
        </div>
      </section>

      {/* TOP BAR: Action Tools & Bulk Importer */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form action={sortCourseModulesByDateAction}>
            <input type="hidden" name="course_id" value={selectedCourseId} />
            <button 
              type="submit" 
              title="Sort all modules chronologically by date and reassign sequential numbers S.No. #1, #2, #3..."
              style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid #4ade80',
                color: '#4ade80',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📅 Auto-Sort & Renumber by Date (1, 2, 3...)</span>
            </button>
          </form>

          <ClearAllModulesButton courseId={selectedCourseId} clearAction={clearAllCourseModulesAction} />

          <a 
            href="#module-form" 
            className="btnGold"
            style={{
              width: 'auto',
              padding: '10px 20px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            + Add New Module ↓
          </a>
        </div>
      </div>

      <BulkModuleImporter courseId={selectedCourseId} />

      {/* CURRICULUM LIST VIEW (NOW AT TOP FOR INTUITIVE LMS WORKFLOW) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className={styles.sectionTitle} style={{ margin: 0, fontSize: '1.35rem' }}>
            Curriculum Timeline ({modules?.length || 0} Modules)
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Tip: Use Move Up/Down arrows or Auto-Sort to adjust serial numbers (#1, #2...).
          </span>
        </div>

        <div className={adminStyles.tableWrapper}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th style={{ width: '70px', textAlign: 'center' }}>S.No.</th>
                <th>Date / Schedule</th>
                <th>Module Title</th>
                <th>Status</th>
                <th>Active Links</th>
                <th>Actions & Quizzes</th>
              </tr>
            </thead>
            <tbody>
              {modules?.map((m, index) => (
                <AdminTableRow key={m.id} m={m} index={index} selectedCourseId={selectedCourseId} editModuleId={editModule?.id} />
              ))}
              {(!modules || modules.length === 0) && (
                <tr>
                  <td colSpan="6" className={adminStyles.emptyState} style={{ padding: '4rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No curriculum modules added to this course yet.</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Use the form below or the ⚡ Bulk Importer above to launch your classes!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADD / EDIT MODULE FORM (AT BOTTOM, FOCUSABLE CARD) */}
      <section id="module-form" style={{ 
        background: 'var(--bg-surface-2)', 
        padding: '2.5rem', 
        borderRadius: '16px', 
        border: editModule ? '2px solid var(--accent-gold)' : '1px solid var(--card-border)',
        boxShadow: editModule ? '0 0 30px rgba(200, 168, 107, 0.15)' : 'none',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.25rem' }}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: '1.4rem', margin: 0, color: editModule ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
              {editModule ? `✏️ Editing Module #${editModuleIndex}: ${editModule.title}` : '➕ Create New Module'}
            </h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', margin: '6px 0 0 0' }}>
              {editModule 
                ? 'Update your lecture links, recordings, or study materials below.' 
                : 'Follow the steps below to publish a new lecture, attach resources, and assign topics.'}
            </p>
          </div>
          {editModule && (
            <Link href={`/admin/content?course=${selectedCourseId}`} className="btnPrimary" style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' }}>
              ❌ Cancel Edit
            </Link>
          )}
        </div>
        
        <form action={saveModuleAction} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <input type="hidden" name="course_id" value={selectedCourseId} />
          {editModule && <input type="hidden" name="module_id" value={editModule.id} />}
          {editModule?.resource_link && <input type="hidden" name="existing_resource_link" value={editModule.resource_link} />}
          {/* We hide order_index so the admin never has to worry about serial numbers! */}
          <input type="hidden" name="order_index" value={editModule?.order_index || ''} />
          
          {/* STEP 1: BASIC INFO */}
          <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 1.25rem 0' }}>
              <span>Step 1: 📌 Basic Information & Schedule</span>
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ flex: '1 1 100%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Module Title *</label>
                <input type="text" name="title" required defaultValue={editModule?.title} placeholder="e.g. Lecture 1: Introduction to Bridge Superstructures" style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '1rem' }} />
              </div>

              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Schedule Date & Time (Calendar Picker) - Optional</label>
                <input 
                  type="datetime-local" 
                  name="date_string" 
                  defaultValue={toDateTimeLocal(editModule?.date_string)} 
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem', colorScheme: 'dark' }} 
                />
                <small style={{ color: '#4ade80', display: 'block', marginTop: '4px' }}>✅ Dynamic: Powers countdown timers & auto-unlocking in classrooms!</small>
              </div>

              <div style={{ flex: '1 1 22%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Access Status</label>
                <select name="status" defaultValue={editModule?.status || "auto"} style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem' }}>
                  <option value="auto">⚡ Auto (Smart Recommended)</option>
                  <option value="upcoming">🔓 Upcoming / Live Soon</option>
                  <option value="completed">✔️ Completed (Recorded)</option>
                  <option value="locked">🔒 Locked / Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2: VIDEO & CLASSROOM LINKS */}
          <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#4da6ff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.5rem 0' }}>
              <span>Step 2: 🎥 Live Classroom & Recorded Video</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              💡 <strong>How it works:</strong> Paste your Zoom/Meet link below before class starts. Once your class is finished, paste the video recording link (YouTube/Vimeo/Drive) in the second box. When a recording is pasted, the system automatically marks the lecture as <strong>Completed</strong> for students!
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>🟢 Live Meeting URL (Before Class)</label>
                <input type="url" name="meeting_link" defaultValue={editModule?.meeting_link || ''} placeholder="https://zoom.us/j/... or Google Meet link" style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>

              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>🔴 Recording Video URL (After Class Replay)</label>
                <input type="url" name="recording_link" defaultValue={editModule?.recording_link || ''} placeholder="https://youtube.com/watch?v=... or Drive video" style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>
            </div>
          </div>

          {/* STEP 3: STUDY MATERIALS & NOTES */}
          <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#4ade80', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.5rem 0' }}>
              <span>Step 3: 📁 Study Notes & PDF Materials (Optional)</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              💡 <strong>How it works:</strong> You can upload a PDF or ZIP file directly from your computer, or paste a Google Drive share link. Students will see a green <strong>"📁 Download Resource PDF"</strong> button inside their classroom!
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Option A: Upload File Direct from PC (.pdf, .zip)</label>
                <input type="file" name="resource_file" accept=".pdf,.zip,.rar,.doc,.docx" style={{ width: '100%', padding: '10px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
              </div>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Option B: OR Paste External Cloud Link (Drive / Dropbox)</label>
                <input type="url" name="resource_link_url" defaultValue={editModule?.resource_link || ''} placeholder="https://drive.google.com/file/d/..." style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>
            </div>
            {editModule?.resource_link && (
              <div style={{ marginTop: '1.25rem', padding: '10px 14px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.3)', fontSize: '0.9rem', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>✅ <strong>Current Attached Resource:</strong> File is ready for student download.</span>
                <a href={editModule.resource_link} target="_blank" rel="noopener noreferrer" style={{ color: '#4da6ff', textDecoration: 'underline', fontWeight: 600 }}>View / Download File →</a>
              </div>
            )}
          </div>

          {/* STEP 4: ADVANCED OVERRIDES */}
          <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.5rem 0' }}>
              <span>Step 4: ✨ Advanced Overrides (Optional)</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Use these fields if you want to override the default course instructor for a guest lecture, or define specific topics covered in this module.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Instructor Name (Override)</label>
                <input type="text" name="instructor_name" defaultValue={editModule?.instructor_name || ''} placeholder="e.g. Guest Speaker: Dr. Kumar" style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>

              <div style={{ flex: '1 1 45%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Instructor Role (Override)</label>
                <input type="text" name="instructor_role" defaultValue={editModule?.instructor_role || ''} placeholder="e.g. Senior Bridge Engineer" style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>

              <div style={{ flex: '1 1 100%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Topics Covered (Comma separated)</label>
                <input type="text" name="topics" defaultValue={editModule?.topics || ''} placeholder="e.g. Tendon Profile, Prestress Losses, Elastic Shortening" style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '0.5rem' }}>
            {editModule && (
              <Link href={`/admin/content?course=${selectedCourseId}`} className="btnPrimary" style={{ background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
                Cancel
              </Link>
            )}
            <button type="submit" className="btnGold" style={{ width: 'auto', padding: '14px 44px', fontSize: '1.05rem', fontWeight: 700, boxShadow: '0 4px 20px rgba(200, 168, 107, 0.3)' }}>
              {editModule ? `💾 Save Updates to Module #${editModuleIndex}` : '➕ Publish Module Now'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
