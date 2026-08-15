import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from '@/app/legal.module.css';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <div className={styles.content}>
          <p>Last updated: August 15, 2026</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to Parastructure. By accessing our website and enrolling in our programs, you agree to be bound by these Terms and Conditions.</p>
          
          <h2>2. Intellectual Property</h2>
          <p>All content provided in our courses, including videos, PDFs, assignments, and curriculum structures, are the exclusive intellectual property of Parastructure Pvt. Ltd. You may not distribute, reproduce, or resell any course materials.</p>
          
          <h2>3. User Accounts</h2>
          <p>To access the course portal, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials. Sharing account access with non-enrolled individuals will result in immediate termination of your account without a refund.</p>
          
          <h2>4. Payments</h2>
          <p>All payments are processed securely through Razorpay. By purchasing a course, you agree to provide valid payment information.</p>
          
          <h2>5. Course Access</h2>
          <p>Lifetime access (where applicable) refers to the lifetime of the platform. We reserve the right to modify or discontinue programs with reasonable prior notice to enrolled students.</p>
          
          <h2>6. Limitation of Liability</h2>
          <p>Our programs are educational in nature. Parastructure is not liable for any structural failures or professional liability claims arising from the application of concepts taught in our courses. You must always adhere to local engineering codes and professional standards.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
