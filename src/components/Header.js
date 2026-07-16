'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useAuth } from '@clerk/nextjs';
import styles from './components.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial scroll position
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu when route changes (click on link)
  const closeMenu = () => setMenuOpen(false);

  // Custom handler for hash links to ensure scrolling even if URL hash doesn't change
  const handleHashClick = (e, targetId) => {
    if (pathname === '/') {
      e.preventDefault();
      const elem = document.getElementById(targetId);
      if (elem) {
        const headerOffset = 80; // height of the sticky header
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        window.history.pushState(null, '', `/#${targetId}`);
      }
    }
    closeMenu();
  };

  // Determine if we are on a page with a dark hero banner at the top
  const hasDarkHero = pathname.startsWith('/courses/');
  const isDarkTheme = hasDarkHero && !scrolled;

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''} ${isDarkTheme ? styles.headerDarkTheme : ''}`}>
      <div className={styles.headerInner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          PARA<span className={styles.logoAccent}>STRUCTURE</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.navLinks} aria-label="Main navigation">
          <Link href="/#programs" className={styles.navLink} onClick={(e) => handleHashClick(e, 'programs')}>Programs</Link>
          <Link href="/#about" className={styles.navLink} onClick={(e) => handleHashClick(e, 'about')}>Why Us</Link>
          <Link href="/#testimonials" className={styles.navLink} onClick={(e) => handleHashClick(e, 'testimonials')}>Reviews</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        {/* Desktop CTA */}
        <div className={styles.headerCta}>
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in" className="btnSecondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Login</Link>
              <Link href="/sign-up" className="btnGold" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Sign Up</Link>
            </>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link href="/dashboard" className="btnSecondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="/#programs" className={styles.mobileNavLink} onClick={(e) => handleHashClick(e, 'programs')}>Programs</Link>
          <Link href="/#about" className={styles.mobileNavLink} onClick={(e) => handleHashClick(e, 'about')}>Why Us</Link>
          <Link href="/#testimonials" className={styles.mobileNavLink} onClick={(e) => handleHashClick(e, 'testimonials')}>Reviews</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={closeMenu}>Contact</Link>
        </nav>
        <div className={styles.mobileCtas}>
          {isLoaded && !isSignedIn && (
            <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
              <Link href="/sign-in" className="btnSecondary" style={{ flex: 1, textAlign: 'center' }} onClick={closeMenu}>Login</Link>
              <Link href="/sign-up" className="btnGold" style={{ flex: 1, textAlign: 'center' }} onClick={closeMenu}>Sign Up</Link>
            </div>
          )}
          {isLoaded && isSignedIn && (
            <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
              <UserButton afterSignOutUrl="/" />
              <Link href="/dashboard" className="btnGold" style={{ flex: 1, textAlign: 'center' }} onClick={closeMenu}>Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
