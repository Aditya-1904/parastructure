import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.contactContainer}>
      <div className={styles.headerSpacer}></div>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h1>Get in <span className={styles.accent}>Touch</span></h1>
          <p className={styles.subtitle}>Ready to elevate your engineering career? Have questions about our cohort dates or curriculum? Drop us a message.</p>
          
          <div className={styles.infoBlocks}>
            <div className={styles.infoBlock}>
              <h3>Email Us</h3>
              <p>admissions@parastructure.com</p>
            </div>
            <div className={styles.infoBlock}>
              <h3>Call Us</h3>
              <p>+91 (800) 123-4567</p>
            </div>
            <div className={styles.infoBlock}>
              <h3>Headquarters</h3>
              <p>Tech Park, Cyber Hub<br/>New Delhi, India</p>
            </div>
          </div>
        </div>
        
        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Work Email</label>
              <input type="email" id="email" placeholder="john@company.com" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="course">Interested Course</label>
              <select id="course">
                <option>RCC Bridge Design</option>
                <option>Steel Structure & Engineering</option>
                <option>PSC I Design & BrIM</option>
                <option>Other Enquiry</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="4" placeholder="Tell us about your background and goals..."></textarea>
            </div>
            <button type="button" className={`btnPrimary ${styles.submitBtn}`}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
