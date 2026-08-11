import { getCourse } from '@/data/courses';
import { notFound } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import styles from './learn.module.css';
import { supabase } from '@/lib/supabase';
import { formatDisplayDate, getStudentCountdown, resolveModuleStatus } from '@/utils/moduleHelpers';
import LearnPortalClient from '@/components/LearnPortalClient';

export default async function LearnPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const { id } = params;
  const user = await currentUser();
  const userId = user?.id;
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student';
  const role = user?.publicMetadata?.role;
  const isAdmin = role === 'admin' || userId === process.env.NEXT_PUBLIC_ADMIN_CLERK_ID;
  const course = await getCourse(id);

  if (!course) notFound();

  // Fetch dynamic modules from Supabase
  const { data: modules, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', id)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  const schedule = (modules || []).map(m => ({
    ...m,
    status: resolveModuleStatus(m)
  }));
  
  // Find the active module
  const targetModuleId = searchParams?.m;
  const targetTab = searchParams?.tab || 'lecture';

  let activeModule = targetModuleId ? schedule.find(m => m.id === targetModuleId) : null;
  
  if (!activeModule && schedule.length > 0) {
    activeModule = schedule.find(m => m.status === 'upcoming') || schedule[0];
  }

  // Get completed modules for the Previous Recordings section
  const completedModules = schedule.filter(m => m.status === 'completed');

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      <LearnPortalClient 
        course={course} 
        schedule={schedule}
        initialModuleId={targetModuleId}
        initialTab={targetTab}
        userId={userId}
        userName={userName}
        isAdmin={isAdmin}
        completedModules={completedModules}
      />
    </div>
  );
}
