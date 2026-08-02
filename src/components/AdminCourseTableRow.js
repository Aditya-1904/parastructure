'use client';

import { useOptimistic, startTransition } from 'react';
import { togglePublishAction } from '@/actions/adminCourses';
import adminStyles from '@/app/admin/admin.module.css';

export default function AdminCourseTableRow({ course }) {
  const [optimisticPublished, addOptimisticPublished] = useOptimistic(
    course.is_published,
    (state, newPublished) => newPublished
  );

  const handleTogglePublish = async (formData) => {
    const newPublishedState = !optimisticPublished;
    startTransition(() => {
      addOptimisticPublished(newPublishedState);
    });
    formData.set('new_status', newPublishedState.toString());
    const res = await togglePublishAction(formData);
    if (res && !res.success) {
      alert("Failed to update course: " + res.error);
    }
  };

  return (
    <tr>
      <td style={{ color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{course.id}</td>
      <td>
        <strong>{course.short_title}</strong>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{course.title}</div>
      </td>
      <td>₹{course.price.toLocaleString('en-IN')}</td>
      <td>
        <span className={`${adminStyles.status} ${optimisticPublished ? adminStyles.active : adminStyles.pending_verification}`}>
          {optimisticPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      <td>
        <form action={handleTogglePublish}>
          <input type="hidden" name="id" value={course.id} />
          <input type="hidden" name="is_published" value={optimisticPublished} />
          <button type="submit" style={{ background: 'transparent', border: `1px solid ${optimisticPublished ? 'var(--text-tertiary)' : '#4da6ff'}`, color: optimisticPublished ? 'var(--text-tertiary)' : '#4da6ff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8125rem' }}>
            {optimisticPublished ? 'Unpublish' : 'Publish'}
          </button>
        </form>
      </td>
    </tr>
  );
}
