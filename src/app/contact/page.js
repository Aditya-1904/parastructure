import styles from './contact.module.css';
import { getAllCourses } from '@/data/courses';

export default function ContactPage() {
  const courses = getAllCourses();

  return (
    <div className={styles.contactContainer}>
      <div className={styles.headerSpacer}></div>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>Let's talk about your <span className={styles.accent}>Career</span>.</h1>
          <p className={styles.subtitle}>
            Have questions about the cohort structure? Not sure if your profile is the right fit? 
            Our admissions team is made up of engineers, not salespeople. We'll give it to you straight.
          </p>
          
          <div className={styles.infoBlocks}>
            <div className={styles.infoBlock}>
              <h3>Admissions & Queries</h3>
              <p>admissions@parastructure.com</p>
            </div>
            <div className={styles.infoBlock}>
              <h3>Direct WhatsApp / Call</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
        
        <div className={styles.formContainer}>
          <form action="https://api.web3forms.com/submit" method="POST" className={styles.form}>
            {/* Replace with your Web3Forms Access Key later or load from env */}
            <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE"} />
            <input type="hidden" name="subject" value="New Admission Inquiry - Parastructure" />
            <input type="hidden" name="redirect" value={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact?success=true`} />

            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" placeholder="Rahul Sharma" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" placeholder="rahul@example.com" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="course">Which program are you interested in?</label>
              <select id="course" name="course">
                {courses.map(course => (
                  <option key={course.id} value={course.title}>{course.title}</option>
                ))}
                <option value="Not Sure">I'm not sure yet</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">Message (Optional)</label>
              <textarea id="message" name="message" rows="4" placeholder="Tell us about your background or specific questions..."></textarea>
            </div>
            
            <button type="submit" className={`btnGold ${styles.submitBtn}`}>Send Request</button>
          </form>
        </div>
      </div>
    </div>
  );
}
