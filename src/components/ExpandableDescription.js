'use client';
import { useState } from 'react';

export default function ExpandableDescription({ paragraphs, fallback, className }) {
  const [expanded, setExpanded] = useState(false);

  if (!paragraphs || paragraphs.length === 0) {
    return <p className={className}>{fallback}</p>;
  }

  // If there's only 1 paragraph, just show it
  if (paragraphs.length <= 1) {
    return <p className={className}>{paragraphs[0]}</p>;
  }

  return (
    <div className={className}>
      {/* If expanded, show all. If not, show only the first 2 paragraphs */}
      {expanded ? (
        paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: i !== paragraphs.length - 1 ? '1rem' : 0 }}>
            {p}
          </p>
        ))
      ) : (
        <>
          {paragraphs.slice(0, 2).map((p, i) => (
            <p key={i} style={{ marginBottom: i !== 1 ? '1rem' : 0 }}>
              {p}
              {i === 1 && <span style={{ opacity: 0.7 }}>...</span>}
            </p>
          ))}
        </>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--accent-gold)',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '0',
          marginTop: '0.5rem',
          fontSize: '0.9375rem',
          textDecoration: 'underline'
        }}
      >
        {expanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
}
