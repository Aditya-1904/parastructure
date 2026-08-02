import ProfileForm from '@/components/ProfileForm';
import styles from '@/app/dashboard/dashboard.module.css';

export default function ProfilePage() {
  return (
    <>
      <section className={styles.welcomeSection}>
        <h1 className={styles.greeting}>Profile Settings</h1>
        <p className={styles.subtitle}>Update your personal information and professional details.</p>
      </section>

      <section>
        <ProfileForm />
      </section>
    </>
  );
}
