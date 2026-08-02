import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import styles from '@/app/dashboard/dashboard.module.css';

export default async function DashboardLayout({ children }) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      
      <div className={styles.layout}>
        <DashboardSidebar />
        
        {/* Main Content */}
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
