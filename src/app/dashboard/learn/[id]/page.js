import { getCourse } from '@/data/courses';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import styles from './learn.module.css';

export default async function LearnPage({ params }) {
  const { id } = await params;
  const { userId } = await auth();
  const course = getCourse(id);

  if (!course) notFound();

  // Mock schedule data for the Scalar-style UI
  const schedule = [
    { date: '5 JUL', title: 'Course Orientation & Setup', status: 'completed' },
    { date: '6 JUL', title: 'Introduction to Bridge Engineering', status: 'completed' },
    { date: '8 JUL', title: 'Codes and Specifications (IRC, AASHTO)', status: 'completed' },
    { date: '10 JUL', title: 'Analyzing Real-world Loading Conditions', status: 'upcoming', active: true },
    { date: '13 JUL', title: 'MIDAS Civil: Initial Modeling', status: 'locked' },
    { date: '15 JUL', title: 'MIDAS Civil: Section Properties', status: 'locked' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />
      
      <div className={styles.layout}>
        {/* Calendar Sidebar (Left) */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Calendar</h3>
          </div>
          
          <div className={styles.calendarList}>
            {schedule.map((item, i) => (
              <div key={i} className={`${styles.calendarItem} ${item.active ? styles.calendarActive : ''} ${item.status === 'locked' ? styles.calendarLocked : ''}`}>
                <span className={styles.calDate}>{item.date}</span>
                <span className={styles.calTitle} title={item.title}>
                  {item.title.length > 25 ? item.title.substring(0, 25) + '...' : item.title}
                </span>
                <span className={styles.calIcon}>
                  {item.status === 'completed' && '✔️'}
                  {item.status === 'upcoming' && '🔓'}
                  {item.status === 'locked' && '🔒'}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          <div className={styles.tabsContainer}>
            <div className={styles.tabHeader}>
              <button className={`${styles.tabBtn} ${styles.activeTab}`}>Lecture</button>
              <button className={styles.tabBtn}>Assignment</button>
            </div>
            <div className={styles.timer}>
              Class Starts in <span>01d : 10h : 09m: 30s</span>
            </div>
          </div>

          <div className={styles.lectureCard}>
            {/* Instructor / Thumbnail side */}
            <div className={styles.instructorSide}>
              <div className={styles.thumbnail}>
                <div className={styles.thumbnailImg}>🌉</div>
              </div>
              <h3 className={styles.instructorName}>Rahul Sharma</h3>
              <p className={styles.instructorRole}>Bridge Design 🏢 L&T</p>
              <div className={styles.instructorStats}>
                <span>★ 4.9 Rating</span>
                <span>12+ Years Experience</span>
              </div>
            </div>

            {/* Lecture Details side */}
            <div className={styles.detailsSide}>
              <div className={styles.lectureHeader}>
                <h2 className={styles.lectureTitle}>Analyzing Real-world Loading Conditions</h2>
                <span className={styles.upcomingBadge}>Upcoming</span>
              </div>
              <p className={styles.lectureDate}>📅 Fri, 10 Jul | 9:00 PM IST</p>
              
              <div className={styles.topicsSection}>
                <h4>Topics to be covered:</h4>
                <div className={styles.topicsList}>
                  <span className={styles.topicPill}>Agenda of the Lecture</span>
                  <span className={styles.topicPill}>IRC Code Deep Dive</span>
                  <span className={styles.topicPill}>Vehicle Live Loads</span>
                  <span className={styles.topicPill}>Wind & Seismic Calculation</span>
                </div>
              </div>
              
              <div className={styles.actionRow}>
                <a href="#" className={`btnGold ${styles.joinBtn}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"/><rect x="3" y="6" width="12" height="12" rx="2" ry="2"/></svg>
                  View Classroom
                </a>
                <div className={styles.rewards}>
                  Attending live will earn <span>🟡 8 Coins</span> <span>⚡ 1 Streak</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.demoSection}>
            <h3>Previous Recordings & Demos</h3>
            <div className={styles.demoList}>
              <div className={styles.demoCard}>
                <div className={styles.demoThumb}>▶</div>
                <div className={styles.demoInfo}>
                  <h4>Course Orientation</h4>
                  <p>Recorded 5 JUL</p>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
