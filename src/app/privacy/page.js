import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/app/legal.module.css';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <div className={styles.content}>
          <p>Last updated: August 15, 2026</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you register for an account, enroll in a course, or communicate with us. This includes your name, email address, phone number, and billing information.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our educational services</li>
            <li>Process your transactions securely via Razorpay</li>
            <li>Send you technical notices, updates, and administrative messages</li>
            <li>Respond to your comments and customer service requests</li>
          </ul>
          
          <h2>3. Data Sharing and Security</h2>
          <p>We do not sell your personal information to third parties. We share your information only with trusted third-party service providers (such as Clerk for authentication and Razorpay for payment processing) strictly for the purpose of operating our platform.</p>
          <p>We implement reasonable security measures to protect your personal information from unauthorized access or disclosure.</p>
          
          <h2>4. Cookies</h2>
          <p>We use cookies to maintain your session, remember your preferences, and track aggregate website usage to improve our platform experience.</p>
          
          <h2>5. Your Rights</h2>
          <p>You have the right to request access to the personal data we hold about you, or request its deletion, by contacting our support team.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
