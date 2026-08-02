'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/dashboard/dashboard.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/courses', label: 'Course Creator', icon: '🚀' },
    { href: '/admin/enrollments', label: 'Enrollments', icon: '📝' },
    { href: '/admin/users', label: 'User Management', icon: '👥' },
    { href: '/admin/content', label: 'Course Content', icon: '📚' },
    { href: '/admin/submissions', label: 'Assignments & Grades', icon: '🎯' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle} style={{ color: 'var(--accent-gold)' }}>Admin Panel</div>
      
      {links.map((link) => {
        const isActive = link.href === '/admin' 
          ? pathname === '/admin' 
          : pathname.startsWith(link.href);
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
    </aside>
  );
}
