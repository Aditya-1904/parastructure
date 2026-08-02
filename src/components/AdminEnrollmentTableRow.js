'use client';

import { useOptimistic, startTransition } from 'react';
import { approveEnrollmentAction } from '@/actions/adminEnrollments';
import adminStyles from '@/app/admin/admin.module.css';

export default function AdminEnrollmentTableRow({ enrollment, student }) {
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    enrollment.status,
    (state, newStatus) => newStatus
  );

  const handleApprove = async (formData) => {
    startTransition(() => {
      addOptimisticStatus('active');
    });
    const res = await approveEnrollmentAction(formData);
    if (res && !res.success) {
      alert("Failed to approve enrollment: " + res.error);
    }
  };

  return (
    <tr>
      <td>{new Date(enrollment.created_at).toLocaleDateString()}</td>
      <td>
        <strong>{student.name}</strong>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{student.email}</div>
      </td>
      <td>{enrollment.course_id.toUpperCase()}</td>
      <td>{enrollment.payment_method === 'bank' ? 'Bank Transfer' : 'Online'}</td>
      <td>{enrollment.payment_id}</td>
      <td>
        <span className={`${adminStyles.status} ${adminStyles[optimisticStatus] || ''}`}>
          {optimisticStatus.replace('_', ' ')}
        </span>
      </td>
      <td>
        {optimisticStatus === 'pending_verification' && (
          <form action={handleApprove}>
            <input type="hidden" name="id" value={enrollment.id} />
            <button type="submit" className={adminStyles.approveBtn}>Approve</button>
          </form>
        )}
      </td>
    </tr>
  );
}
