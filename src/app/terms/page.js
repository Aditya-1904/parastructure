import styles from '../legal.module.css';

export const metadata = {
  title: 'Terms of Service | Parastructure',
  description: 'Terms of Service for Parastructure',
};

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      <div className={styles.content}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Parastructure's services, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Educational Services</h2>
        <p>
          Parastructure provides cohort-based bridge engineering programs. We reserve the right to modify, suspend or discontinue the service with or without notice at any time and without any liability to you.
        </p>

        <h2>3. User Conduct</h2>
        <p>
          You agree to use our services only for lawful purposes. You are prohibited from sharing access to your account, distributing course materials without permission, or engaging in any behavior that disrupts the learning experience of others.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All content, including but not limited to videos, assignments, and study materials, are the intellectual property of Parastructure and are protected by copyright laws.
        </p>
      </div>
    </div>
  );
}
