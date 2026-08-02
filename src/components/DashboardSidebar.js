'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/dashboard/dashboard.module.css';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'My Courses', icon: '📚' },
    { href: '/dashboard/payments', label: 'Payment History', icon: '💳' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle}>Menu</div>
      
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          >
            <span>{link.icon}</span> {link.label}
          </Link>
        );
      })}

      <div className={styles.navLink} style={{ opacity: 0.4, cursor: 'default' }}>
        <span>🎓</span> Certificates <span style={{ fontSize: '0.65rem', marginLeft: '4px', color: 'var(--text-tertiary)' }}>Soon</span>
      </div>
    </aside>
  );
}
