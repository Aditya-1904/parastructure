'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LectureComments({ moduleId, userId, userName, isAdmin }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [lastPostTime, setLastPostTime] = useState(0);

  useEffect(() => {
    fetchComments();
  }, [moduleId]);

  async function fetchComments() {
    setLoading(true);
    const { data, error } = await supabase
      .from('module_comments')
      .select('*')
      .eq('module_id', moduleId)
      .order('created_at', { ascending: false });
    
    if (data) setComments(data);
    setLoading(false);
  }

  async function handleDelete(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    const { error } = await supabase
      .from('module_comments')
      .delete()
      .eq('id', commentId);
      
    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    } else {
      alert("Failed to delete comment. " + error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Rate limit: 30 seconds between posts
    if (Date.now() - lastPostTime < 30000) {
      alert("Please wait 30 seconds before posting another comment to prevent spam.");
      return;
    }
    
    setSubmitting(true);
    
    const payload = {
      module_id: moduleId,
      user_id: userId,
      user_name: userName || 'Student',
      content: newComment.trim()
    };
    
    const { data, error } = await supabase
      .from('module_comments')
      .insert(payload)
      .select()
      .single();
      
    if (data) {
      setComments([data, ...comments]);
      setNewComment('');
      setLastPostTime(Date.now());
    } else if (error) {
      alert("Failed to post comment. " + error.message);
    }
    setSubmitting(false);
  }

  return (
    <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-surface-2)', borderRadius: '12px', border: '1px solid var(--card-border)', flexShrink: 0 }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        💬 Lecture Q&A
      </h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask a question or share your thoughts about this lecture..."
          rows={3}
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--bg-main)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontSize: '0.95rem',
            resize: 'vertical',
            marginBottom: '1rem'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            disabled={submitting || !newComment.trim()}
            className="btnGold"
            style={{ padding: '8px 24px', opacity: (submitting || !newComment.trim()) ? 0.5 : 1, width: 'auto' }}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {loading ? (
        <div style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem 0' }}>
          No questions yet. Be the first to start a discussion!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gold)', 
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 700, flexShrink: 0 
              }}>
                {comment.user_name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{comment.user_name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {new Date(comment.created_at).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {(isAdmin || comment.user_id === userId) && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      style={{ 
                        background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', 
                        fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px',
                        background: 'rgba(255, 77, 77, 0.1)'
                      }}
                      title="Delete Comment"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
