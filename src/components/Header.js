import Link from 'next/link';
import styles from './components.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        PARA<span className={styles.logoAccent}>STRUCTURE</span>
      </Link>
      <nav className={styles.navLinks}>
        <Link href="/#courses" className={styles.navLink}>Courses</Link>
        <Link href="/contact" className={styles.navLink}>Contact Us</Link>
        <Link href="/#about" className={styles.navLink}>Why Us</Link>
      </nav>
      <div style={{display: 'flex', gap: '1rem'}}>
        <Link href="/contact" className={styles.btnSecondary}>Sign In</Link>
        <Link href="/contact" className={styles.btnPrimary}>Apply Now</Link>
      </div>
    </header>
  );
}
