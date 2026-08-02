'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import styles from '@/app/dashboard/dashboard.module.css';

export default function ProfileForm() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        title: user.unsafeMetadata?.title || '',
      });
    }
  }, [user]);

  if (!isLoaded || !user) {
    return <div>Loading profile...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          title: formData.title,
        }
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.profileForm}>
      <div className={styles.formGroup}>
        <label htmlFor="firstName">First Name</label>
        <input 
          type="text" 
          id="firstName" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="lastName">Last Name</label>
        <input 
          type="text" 
          id="lastName" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="title">Professional Title</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          placeholder="e.g. Bridge Design Engineer" 
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email Address</label>
        <input 
          type="text" 
          value={user.primaryEmailAddress?.emailAddress || ''} 
          disabled 
          style={{ opacity: 0.6 }}
        />
        <small style={{ color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
          Emails cannot be changed here.
        </small>
      </div>

      {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: '#4ade80', marginBottom: '1rem' }}>Profile updated successfully!</div>}

      <button type="submit" className="btnGold" disabled={loading} style={{ width: '100%', maxWidth: '200px' }}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
