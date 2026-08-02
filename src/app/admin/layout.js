import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import styles from '@/app/dashboard/dashboard.module.css'; // Reusing dashboard layout

export default async function AdminLayout({ children }) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Security Check: Look for role in session claims, or fallback to ENV variable.
  // We use publicMetadata.role = 'admin' for a robust system.
  const role = sessionClaims?.metadata?.role;
  const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_CLERK_ID; 

  if (role !== 'admin' && userId !== ADMIN_USER_ID) {
    return (
      <div className={styles.page}>
        <div className={styles.headerSpacer}></div>
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <h1 style={{ color: '#ff4d4d', marginBottom: '1rem' }}>Access Denied</h1>
          <p>You do not have permission to view the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      
      <div className={styles.layout}>
        <AdminSidebar />
        
        {/* Main Content */}
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
