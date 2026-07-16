import styles from '../legal.module.css';

export const metadata = {
  title: 'Privacy Policy | Parastructure',
  description: 'Privacy Policy for Parastructure',
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including when you create an account, apply for a cohort, fill out a form, or communicate with us. The types of information we may collect include your name, email address, phone number, and any other information you choose to provide.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services. This includes processing your applications, sending you technical notices, updates, security alerts, and providing customer support.
        </p>

        <h2>3. Data Security</h2>
        <p>
          We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
        </p>

        <h2>4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:admissions@parastructure.com">admissions@parastructure.com</a>.
        </p>
      </div>
    </div>
  );
}
