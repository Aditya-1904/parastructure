'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/config/payment';

export default function StickyBottomBar({ course, emiAmount }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the sticky bar after scrolling past the hero section (~400px)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 10, 12, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: 'var(--s-4) var(--s-5)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
      transform: 'translateY(0)',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .stickyContent {
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          justify-content: space-between;
          alignItems: center;
          gap: var(--s-5);
        }
        .stickyDetails {
          display: flex;
          flex-direction: column;
        }
        .stickyTitle {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-inverted);
          margin: 0;
        }
        .stickyPrice {
          font-size: 0.9375rem;
          color: var(--text-secondary);
        }
        .stickyPrice strong {
          color: var(--accent-gold);
        }
        @media (max-width: 600px) {
          .stickyTitle { display: none; }
          .stickyContent { flex-direction: row; }
        }
      `}</style>

      <div className="stickyContent">
        <div className="stickyDetails">
          <h4 className="stickyTitle">{course.title}</h4>
          <span className="stickyPrice">
            <strong>{formatPrice(course.price)}</strong> <span style={{opacity: 0.6}}>or {formatPrice(emiAmount)}/mo</span>
          </span>
        </div>
        <Link 
          href={`/checkout/${course.id}`} 
          className="btnGold"
          style={{ whiteSpace: 'nowrap', padding: 'var(--s-3) var(--s-6)' }}
        >
          Enroll Now
        </Link>
      </div>
    </div>
  );
}
