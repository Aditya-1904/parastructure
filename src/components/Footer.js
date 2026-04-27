import Link from 'next/link';
import styles from './components.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            PARA<span className={styles.logoAccent}>STRUCTURE</span>
          </div>
          <p>Transform the way you work with our cutting-edge professional courses. Ready to elevate your career? Let's innovate together.</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.linkGroup}>
            <h4>Courses</h4>
            <ul>
              <li><Link href="/courses/rcc">RCC Bridge</Link></li>
              <li><Link href="/courses/steel">Steel Bridge</Link></li>
              <li><Link href="/courses/psc">PSC I Design</Link></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Parastructure Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
