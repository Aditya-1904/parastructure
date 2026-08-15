'use client';

import { useOptimistic, startTransition } from 'react';
import { approveEnrollmentAction, revokeEnrollmentAction, deleteEnrollmentAction } from '@/actions/adminEnrollments';
import adminStyles from '@/app/admin/admin.module.css';

export default function AdminEnrollmentTableRow({ enrollment, student }) {
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    enrollment.status,
    (state, newStatus) => newStatus
  );

  // If deleted optimistically, we hide the row
  const [isDeleted, setIsDeleted] = useOptimistic(false, () => true);

  const handleApprove = async (formData) => {
    startTransition(() => {
      addOptimisticStatus('active');
    });
    const res = await approveEnrollmentAction(formData);
    if (res && !res.success) {
      alert("Failed to approve enrollment: " + res.error);
    }
  };

  const handleRevoke = async (formData) => {
    if (!confirm("Are you sure you want to revoke this student's access to the course?")) return;
    
    startTransition(() => {
      addOptimisticStatus('revoked');
    });
    const res = await revokeEnrollmentAction(formData);
    if (res && !res.success) {
      alert("Failed to revoke enrollment: " + res.error);
    }
  };

  const handleDelete = async (formData) => {
    if (!confirm("WARNING: Are you sure you want to completely delete this enrollment record? This cannot be undone.")) return;
    
    startTransition(() => {
      setIsDeleted(true);
    });
    const res = await deleteEnrollmentAction(formData);
    if (res && !res.success) {
      alert("Failed to delete enrollment: " + res.error);
    }
  };

  if (isDeleted) return null;

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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {optimisticStatus === 'pending_verification' && (
            <form action={handleApprove}>
              <input type="hidden" name="id" value={enrollment.id} />
              <button type="submit" className={adminStyles.approveBtn}>Approve</button>
            </form>
          )}
          {optimisticStatus === 'active' && (
            <form action={handleRevoke}>
              <input type="hidden" name="id" value={enrollment.id} />
              <button type="submit" className={adminStyles.revokeBtn}>Revoke</button>
            </form>
          )}
          <form action={handleDelete}>
            <input type="hidden" name="id" value={enrollment.id} />
            <button type="submit" className={adminStyles.deleteBtn}>Delete</button>
          </form>
        </div>
      </td>
    </tr>
  );
}
