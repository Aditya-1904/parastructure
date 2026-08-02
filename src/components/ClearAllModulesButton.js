'use client';

import { useState, useTransition } from 'react';

export default function ClearAllModulesButton({ courseId, clearAction }) {
  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete ALL course content/modules for this course?\n\nThis will remove all test lectures, quizzes, and resources so you can start fresh with clean data. This cannot be undone."
    );
    
    if (confirmed) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('course_id', courseId);
        await clearAction(formData);
      });
    }
  };

  return (
    <button 
      type="button"
      onClick={handleClear}
      disabled={isPending}
      title="Delete all test modules from this course to start with clean data"
      style={{
        background: 'rgba(255, 77, 77, 0.1)',
        border: '1px solid #ff4d4d',
        color: '#ff4d4d',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        opacity: isPending ? 0.6 : 1,
        transition: 'all 0.2s'
      }}
    >
      <span>{isPending ? '⏳ Clearing Data...' : '🗑️ Clear All Modules (Start Fresh)'}</span>
    </button>
  );
}
