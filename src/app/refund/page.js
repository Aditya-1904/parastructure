import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/app/legal.module.css';

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Refund & Cancellation Policy</h1>
        <div className={styles.content}>
          <p>Last updated: August 15, 2026</p>
          
          <h2>1. Cancellation Policy</h2>
          <p>You may cancel your enrollment in any Parastructure program up to 7 days before the official cohort start date. Cancellations made within this window will be processed without any penalty.</p>
          <p>To request a cancellation, please email our support team at admissions@parastructure.in with your enrollment details and order receipt.</p>
          
          <h2>2. Refund Policy</h2>
          <p>We are confident in the quality of our engineering curriculum. We offer a <strong>7-Day Money-Back Guarantee</strong> from the date the cohort officially begins.</p>
          <ul>
            <li>If you are unsatisfied with the course content within the first 7 days of the live cohort, you are eligible for a full refund.</li>
            <li>Refund requests made after the 7-day window will not be honored, as digital course materials and resources will have already been distributed.</li>
            <li>Refunds will be credited back to your original payment method (e.g., Credit Card, Bank Account, UPI) within 5 to 7 business days of approval.</li>
          </ul>
          
          <h2>3. Exceptions</h2>
          <p>No refunds will be issued to students whose accounts have been terminated due to a violation of our Terms and Conditions, including but not limited to sharing account credentials or illegally distributing course materials.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
