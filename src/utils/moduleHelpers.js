// Shared module datetime and status helper functions (DRY Principle)

/**
 * Format ISO date or fallback text string for clean display across dashboards
 * e.g., returns "Aug 10, 2026 • 8:00 PM" or fallback "10 Aug | 8:00pm"
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // fallback for old text strings
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
  return d.toLocaleDateString('en-US', options).replace(',', ' •');
}

/**
 * Convert datetime string or ISO string to YYYY-MM-DDTHH:mm format
 * Required for <input type="datetime-local" /> default values
 */
export function toDateTimeLocal(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${mins}`;
  }
  return '';
}

/**
 * Automatically evaluate module status from recording, meeting links, and datetime
 * Used in student classroom and curriculum lists
 */
export function resolveModuleStatus(m) {
  if (m.status === 'locked') return 'locked'; // Explicitly locked by admin
  if (m.recording_link && m.recording_link.trim() !== '') return 'completed'; // Class is over, video ready
  if (m.status === 'completed') return 'completed';
  if (m.date_string) {
    const d = new Date(m.date_string);
    if (!isNaN(d.getTime())) {
      const diffMins = (d.getTime() - new Date().getTime()) / (1000 * 60);
      if (diffMins <= 30 && diffMins >= -120) return 'upcoming'; // Live class window
    }
  }
  if (m.status === 'auto' || !m.status) return 'upcoming';
  return m.status;
}

/**
 * Smart countdown and live status badge generator for Admin table & cards
 */
export function getSmartTimeStatus(dateStr, status, hasRecording) {
  if (status === 'locked') return { label: '🔒 Locked', bg: '#333', color: '#ccc', isLive: false };
  if (hasRecording || status === 'completed') return { label: '✔️ Recorded / Completed', bg: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', isLive: false };
  if (!dateStr) return { label: '⏳ Schedule TBA', bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-tertiary)', isLive: false };
  
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { label: `🔓 Upcoming`, bg: 'rgba(77, 166, 255, 0.15)', color: '#4da6ff', isLive: false };

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Within 30 mins before start or up to 2 hours after start -> LIVE NOW!
  if (diffMins <= 30 && diffMins >= -120) {
    return { label: '🔴 LIVE ROOM OPEN NOW!', bg: 'rgba(255, 77, 77, 0.2)', color: '#ff4d4d', isLive: true };
  }
  // Class ended more than 2h ago
  if (diffMins < -120) {
    return { label: '⌛ Ended (Awaiting Replay)', bg: 'rgba(200, 168, 107, 0.15)', color: 'var(--accent-gold)', isLive: false };
  }
  if (diffMins > 0 && diffMins < 60) {
    return { label: `🔥 Starts in ${diffMins}m!`, bg: 'rgba(255, 153, 0, 0.15)', color: '#ff9900', isLive: false };
  }
  if (diffHours >= 1 && diffHours < 24) {
    const remainingMins = diffMins % 60;
    return { label: `⏳ Starts in ${diffHours}h ${remainingMins}m`, bg: 'rgba(77, 166, 255, 0.15)', color: '#4da6ff', isLive: false };
  }
  if (diffDays >= 1) {
    return { label: `⏳ Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`, bg: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)', isLive: false };
  }

  return { label: '🔓 Upcoming', bg: 'rgba(77, 166, 255, 0.15)', color: '#4da6ff', isLive: false };
}

/**
 * Get dynamic countdown string for student classroom header & timer
 */
export function getStudentCountdown(dateStr) {
  if (!dateStr) return 'SOON';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'SOON';

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins <= 30 && diffMins >= -120) return '🔴 LIVE NOW!';
  if (diffMins < -120) return 'ENDED';
  if (diffMins > 0 && diffMins < 60) return `${diffMins} MINS`;
  if (diffHours >= 1 && diffHours < 24) {
    const remainingMins = diffMins % 60;
    return `${diffHours}H ${remainingMins}M`;
  }
  if (diffDays >= 1) return `${diffDays} DAY${diffDays > 1 ? 'S' : ''}`;
  return 'SOON';
}
