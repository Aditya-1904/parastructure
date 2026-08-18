'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/dashboard/learn/[id]/learn.module.css';
import QuizEngine from '@/components/QuizEngine';
import LiveCountdown from '@/components/LiveCountdown';
import LectureComments from '@/components/LectureComments';
import { formatDisplayDate } from '@/utils/moduleHelpers';

export default function LearnPortalClient({ course, schedule, initialModuleId, initialTab, userId, userName, isAdmin, completedModules }) {
  const router = useRouter();
  
  // Auto-complete past lectures based on date
  const processedSchedule = schedule.map(item => {
    let computedStatus = item.status;
    if (computedStatus !== 'completed' && item.date_string) {
      const datePart = item.date_string.split('|')[0].trim();
      const itemDate = new Date(datePart);
      if (!isNaN(itemDate.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (itemDate < today) {
          computedStatus = 'completed';
        }
      }
    }
    return { ...item, status: computedStatus };
  });

  const [activeModuleId, setActiveModuleId] = useState(
    initialModuleId || (processedSchedule.length > 0 ? (processedSchedule.find(m => m.status === 'upcoming')?.id || processedSchedule[0].id) : null)
  );
  const [activeTab, setActiveTab] = useState(initialTab || 'lecture');

  const activeModule = processedSchedule.find(m => m.id === activeModuleId);

  // Sync URL shallowly without reloading the page
  const updateUrl = (moduleId, tab) => {
    const url = new URL(window.location.href);
    if (moduleId) url.searchParams.set('m', moduleId);
    if (tab) url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url.toString());
  };

  const handleModuleClick = (e, moduleId) => {
    e.preventDefault();
    setActiveModuleId(moduleId);
    updateUrl(moduleId, activeTab);
  };

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
    updateUrl(activeModuleId, tab);
  };

  return (
    <div className={styles.layout}>
      {/* Calendar Sidebar (Left) */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.backLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500, transition: 'color 0.2s' }}>
            ← Back to Dashboard
          </Link>
          <h3>Curriculum</h3>
        </div>
        
        <div className={styles.calendarList}>
          {processedSchedule.map((item, idx) => {
            const isActive = activeModule?.id === item.id;
            const dateStr = item.date_string ? (isNaN(new Date(item.date_string).getTime()) ? item.date_string.split('|')[0].trim() : new Date(item.date_string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) : 'TBA';
            return (
              <a key={item.id} href={`?m=${item.id}`} onClick={(e) => handleModuleClick(e, item.id)} style={{ textDecoration: 'none' }}>
                <div className={`${styles.calendarItem} ${isActive ? styles.calendarActive : ''} ${item.status === 'locked' ? styles.calendarLocked : ''}`}>
                  <span className={styles.calDate} style={{ width: 'auto', minWidth: '50px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <strong style={{ color: isActive ? 'var(--accent-gold)' : 'var(--text-tertiary)', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: '4px' }}>#{item.order_index}</strong>
                    <span>{dateStr}</span>
                  </span>
                  <span className={styles.calTitle} title={item.title}>
                    {item.title}
                  </span>
                  <span className={styles.calIcon}>
                    {item.status === 'completed' && <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>☑️</span>}
                    {item.status === 'upcoming' && '🔓'}
                    {item.status === 'locked' && '🔒'}
                  </span>
                </div>
              </a>
            );
          })}
          {processedSchedule.length === 0 && (
            <div style={{ padding: '1rem', color: 'var(--text-tertiary)', textAlign: 'center', fontSize: '0.875rem' }}>
              No modules published yet.
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {activeModule ? (
          <>
            <div className={styles.tabsContainer}>
              <div className={styles.tabHeader}>
                <a href={`?tab=lecture`} onClick={(e) => handleTabClick(e, 'lecture')} className={`${styles.tabBtn} ${activeTab === 'lecture' ? styles.activeTab : ''}`} style={{textDecoration: 'none'}}>Lecture</a>
                <a href={`?tab=assignment`} onClick={(e) => handleTabClick(e, 'assignment')} className={`${styles.tabBtn} ${activeTab === 'assignment' ? styles.activeTab : ''}`} style={{textDecoration: 'none'}}>Assignment</a>
                <a href={`?tab=resources`} onClick={(e) => handleTabClick(e, 'resources')} className={`${styles.tabBtn} ${activeTab === 'resources' ? styles.activeTab : ''}`} style={{textDecoration: 'none'}}>📁 Resources</a>
              </div>
              {activeModule.status === 'upcoming' && (
                <div className={styles.timer}>
                  Class Starts in <LiveCountdown dateString={activeModule.date_string} />
                </div>
              )}
            </div>

            {activeTab === 'assignment' ? (
              <div style={{ marginTop: '2rem' }}>
                {activeModule.status === 'locked' ? (
                  <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-surface-2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Assignment Locked</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>This assignment will unlock according to the schedule.</p>
                  </div>
                ) : (
                  <QuizEngine moduleId={activeModule.id} userId={userId} />
                )}
              </div>
            ) : activeTab === 'resources' ? (
              <div style={{ marginTop: '2rem' }}>
                <div style={{ padding: '2rem', background: 'var(--bg-surface-2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>📁 Course Resources</h3>
                  <p style={{ color: 'var(--text-tertiary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    Downloadable materials, PDFs, and code files from all modules in this course.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {processedSchedule.filter(m => m.resource_link).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No resources have been uploaded for this course yet.</div>
                    ) : (
                      processedSchedule.filter(m => m.resource_link).map(m => (
                        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                          <div>
                            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{m.title}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Module Resource</span>
                          </div>
                          <a href={m.resource_link} target="_blank" rel="noopener noreferrer" className="btnGold" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.9rem', width: 'auto' }}>
                            Download ↓
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.lectureCard}>
                  {/* Instructor / Thumbnail side */}
                  <div className={styles.instructorSide}>
                    <div className={styles.thumbnail}>
                      <div className={styles.thumbnailImg}>👤</div>
                    </div>
                    <h3 className={styles.instructorName}>{activeModule.instructor_name || course.instructor || 'Parastructure Faculty'}</h3>
                    <p className={styles.instructorRole}>{activeModule.instructor_role || 'Expert Instructor'}</p>
                  </div>

                  {/* Lecture Details side */}
                  <div className={styles.detailsSide}>
                    {/* Embedded Video Player */}
                    {activeModule.status === 'completed' && activeModule.recording_link && activeModule.recording_link.includes('youtube.com') && (
                      <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)', background: '#000', aspectRatio: '16/9' }}>
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${new URL(activeModule.recording_link).searchParams.get('v') || activeModule.recording_link.split('v=')[1]?.split('&')[0]}`} 
                          title="Course Video Player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          style={{ display: 'block' }}
                        ></iframe>
                      </div>
                    )}
                    {activeModule.status === 'completed' && activeModule.recording_link && activeModule.recording_link.includes('youtu.be') && (
                      <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)', background: '#000', aspectRatio: '16/9' }}>
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${activeModule.recording_link.split('youtu.be/')[1]?.split('?')[0]}`} 
                          title="Course Video Player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          style={{ display: 'block' }}
                        ></iframe>
                      </div>
                    )}

                    <div className={styles.lectureHeader}>
                      <h2 className={styles.lectureTitle}>{activeModule.title}</h2>
                      {activeModule.status === 'completed' ? (
                        <span className={styles.upcomingBadge} style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                          ☑️ Completed
                        </span>
                      ) : (
                        <span className={styles.upcomingBadge}>
                          {activeModule.status}
                        </span>
                      )}
                    </div>
                    <p className={styles.lectureDate}>📅 {formatDisplayDate(activeModule.date_string)}</p>
                    
                    <div className={styles.topicsSection}>
                      <h4>Topics to be covered:</h4>
                      <div className={styles.topicsList}>
                        {activeModule.topics ? (
                          activeModule.topics.split(',').map((topic, i) => (
                            <span key={i} className={styles.topicPill}>{topic.trim()}</span>
                          ))
                        ) : (
                          <span className={styles.topicPill}>Module Content</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.actionRow}>
                      {activeModule.status === 'locked' ? (
                        <div style={{ padding: '10px 16px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', borderRadius: '8px', color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                          <span>🔒</span> Content Locked (Waiting for Release)
                        </div>
                      ) : (
                        <>
                          {activeModule.status === 'upcoming' && (
                            <a href={`/api/live-class?moduleId=${activeModule.id}`} target="_blank" rel="noopener noreferrer" className={`btnGold ${styles.joinBtn}`}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"/><rect x="3" y="6" width="12" height="12" rx="2" ry="2"/></svg>
                              Join Live Class
                            </a>
                          )}
                          {activeModule.status === 'completed' && activeModule.recording_link && (
                            <a href={activeModule.recording_link} target="_blank" rel="noopener noreferrer" className={`btnGold ${styles.joinBtn}`} style={{ background: 'var(--bg-surface-2)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><circle cx="12" cy="12" r="10"/></svg>
                              Watch Recording
                            </a>
                          )}
                          {activeModule.resource_link && (
                            <a href={activeModule.resource_link} target="_blank" rel="noopener noreferrer" className={styles.joinBtn} style={{ background: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              Download Resource
                            </a>
                          )}
                          {activeModule.status === 'completed' && !activeModule.recording_link && (
                            <div style={{ padding: '10px 16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                              <span>⏳</span> Recording is being processed and will be uploaded shortly.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Lecture Comments Section */}
                {activeModule.status !== 'locked' && (
                  <LectureComments moduleId={activeModule.id} userId={userId} userName={userName} isAdmin={isAdmin} />
                )}
              </>
            )}
          </>
        ) : (
           <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
             <h2>Welcome to {course.shortTitle}</h2>
             <p>The curriculum will be published here soon!</p>
           </div>
        )}

        {completedModules.length > 0 && (
          <div className={styles.demoSection}>
            <h3>Previous Recordings</h3>
            <div className={styles.demoList}>
              {completedModules.map(m => (
                <a key={m.id} href={m.recording_link || '#'} target={m.recording_link ? "_blank" : "_self"} rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.demoCard}>
                    <div className={styles.demoThumb}>▶</div>
                    <div className={styles.demoInfo}>
                      <h4>{m.title}</h4>
                      <p>Recorded {m.date_string ? m.date_string.split('|')[0] : 'TBA'}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
