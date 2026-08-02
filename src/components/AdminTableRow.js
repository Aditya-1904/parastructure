'use client';

import { useOptimistic, startTransition } from 'react';
import Link from 'next/link';
import { moveModuleAction, deleteModuleAction, toggleLockAction } from '@/actions/adminModules';
import { getSmartTimeStatus, formatDisplayDate } from '@/utils/moduleHelpers';
import adminStyles from '@/app/admin/admin.module.css';

export default function AdminTableRow({ m, index, selectedCourseId, editModuleId }) {
  // Optimistic UI state for instant visual feedback on toggle lock
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    m.status,
    (state, newStatus) => newStatus
  );

  const handleToggleLock = async (formData) => {
    const current = optimisticStatus || 'upcoming';
    const newStatus = current === 'locked' ? 'upcoming' : 'locked';
    startTransition(() => {
      addOptimisticStatus(newStatus);
    });
    // Explicitly inject the calculated new status so the server doesn't guess based on laggy states
    formData.set('new_status', newStatus);
    const res = await toggleLockAction(formData);
    if (res && !res.success) {
      alert("Failed to change lock status: " + res.error);
    }
  };

  const st = getSmartTimeStatus(m.date_string, optimisticStatus, !!m.recording_link);

  return (
    <tr style={{ background: editModuleId === m.id ? 'rgba(200, 168, 107, 0.08)' : 'transparent', transition: 'background 0.2s' }}>
      <td style={{ textAlign: 'center' }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--accent-gold)',
          color: '#000',
          padding: '4px 10px',
          borderRadius: '12px',
          fontWeight: 800,
          fontSize: '0.85rem'
        }}>
          #{index + 1}
        </span>
      </td>
      <td style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-secondary)' }}>
        <div>📅 {formatDisplayDate(m.date_string)}</div>
        <span style={{
          display: 'inline-block',
          marginTop: '6px',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '12px',
          background: st.bg,
          color: st.color,
          border: st.isLive ? '1px solid #ff4d4d' : 'none',
          boxShadow: st.isLive ? '0 0 10px rgba(255, 77, 77, 0.4)' : 'none'
        }}>
          {st.label}
        </span>
      </td>
      <td>
        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{m.title}</strong>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Order Index: {m.order_index}</span>
        </div>
      </td>
      <td>
        <span className={adminStyles.status} style={{ background: st.bg, color: st.color, border: st.isLive ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)', fontWeight: 700 }}>
          {optimisticStatus === 'locked' ? '🔒 Locked' : (optimisticStatus === 'upcoming' || optimisticStatus === 'auto') ? '⚡ Smart Auto' : optimisticStatus}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
          {m.meeting_link && <a href={m.meeting_link} target="_blank" rel="noopener noreferrer" style={{ color: '#4da6ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>🟢 Live Room</a>}
          {m.recording_link && <a href={m.recording_link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff4d4d', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>🔴 Recording</a>}
          {m.resource_link && <a href={m.resource_link} target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>📁 Resource PDF</a>}
          {!m.meeting_link && !m.recording_link && !m.resource_link && <span style={{ color: 'var(--text-tertiary)' }}>No links attached</span>}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <form action={moveModuleAction} style={{ display: 'flex', gap: '4px' }}>
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="course_id" value={selectedCourseId} />
            <button type="submit" name="direction" value="up" title="Move Up (#1)" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button type="submit" name="direction" value="down" title="Move Down" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </form>
          
          <Link href={`/admin/content/quiz?module=${m.id}`} style={{ border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '6px 10px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, background: 'rgba(200, 168, 107, 0.12)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            ⚙️ Manage Quiz
          </Link>

          <Link href={`/admin/content?course=${selectedCourseId}&edit=${m.id}#module-form`} style={{ border: '1px solid var(--card-border)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 500 }}>
            ✏️ Edit
          </Link>

          <form action={handleToggleLock}>
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="course_id" value={selectedCourseId} />
            <input type="hidden" name="current_status" value={optimisticStatus} />
            <button 
              type="submit" 
              title={(optimisticStatus || 'auto') === 'locked' ? "Click to unlock module to Smart Auto" : "Click to lock and hide module from students"} 
              style={{ 
                background: (optimisticStatus || 'auto') === 'locked' ? 'rgba(77, 166, 255, 0.15)' : 'rgba(255, 77, 77, 0.15)', 
                border: (optimisticStatus || 'auto') === 'locked' ? '1px solid #4da6ff' : '1px solid #ff4d4d', 
                color: (optimisticStatus || 'auto') === 'locked' ? '#4da6ff' : '#ff4d4d', 
                padding: '6px 10px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '0.8125rem', 
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {(optimisticStatus || 'auto') === 'locked' ? '🔓 Unlock' : '🔒 Lock'}
            </button>
          </form>
          
          <form action={deleteModuleAction}>
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="course_id" value={selectedCourseId} />
            <button type="submit" style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500 }}>
              🗑️ Delete
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
