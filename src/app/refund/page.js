import styles from '../legal.module.css';

export const metadata = {
  title: 'Refund Policy | Parastructure',
  description: 'Refund Policy for Parastructure',
};

export default function RefundPolicy() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Refund Policy</h1>
      <div className={styles.content}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. 7-Day Guarantee</h2>
        <p>
          We offer a full refund, no questions asked, within 7 days of the cohort start date. If you decide the program isn't right for you during this first week, simply email us and we will process your refund immediately.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          To be eligible for a refund, you must submit your request via email to admissions@parastructure.com before the end of the 7th day following the official start date of your cohort.
        </p>

        <h2>3. Processing Time</h2>
        <p>
          Refunds are processed to your original payment method. Please allow 5-7 business days for the funds to appear in your account, depending on your bank or credit card provider.
        </p>

        <h2>4. Non-Refundable Items</h2>
        <p>
          After the 7-day window has passed, all program fees are non-refundable. Registration fees or deposits specifically marked as non-refundable are excluded from this policy.
        </p>
      </div>
    </div>
  );
}
