'use client';
import { useState, useEffect } from 'react';

export default function LiveCountdown({ dateString }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!dateString) return;

    // Parse the date robustly
    let targetTime;
    try {
      const parts = dateString.split('|');
      let cleanDateStr = parts[0].trim();
      if (parts.length > 1) {
        let timePart = parts[1].trim();
        const timeMatch = timePart.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          cleanDateStr += ` ${timeMatch[1]}:${timeMatch[2]} ${timeMatch[3]}`;
        }
      }
      const d = new Date(cleanDateStr);
      if (isNaN(d.getTime())) {
        setTimeLeft('Invalid date');
        return;
      }
      targetTime = d.getTime();
    } catch (e) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        setTimeLeft('Class is Live!');
        return;
      }

      const diffMins = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days} day${days > 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m ${seconds}s`);
      } else {
        setTimeLeft(`${mins}m ${seconds}s`);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dateString]);

  if (!timeLeft) return null;

  return <span>{timeLeft}</span>;
}
