'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '@/app/dashboard/learn/[id]/learn.module.css';

export default function QuizEngine({ moduleId, userId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track selected answer per question index
  const [answers, setAnswers] = useState({});
  const [submission, setSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      // 1. Fetch questions
      const { data: qData } = await supabase
        .from('assignment_questions')
        .select('id, question_text, options, correct_option_index')
        .eq('module_id', moduleId)
        .order('created_at', { ascending: true });
        
      if (qData) setQuestions(qData);

      // 2. Check if user already submitted
      const { data: subData } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('module_id', moduleId)
        .eq('user_id', userId)
        .single();
        
      if (subData) {
        setSubmission(subData);
        setAnswers(subData.answers);
      }
      
      setLoading(false);
    }
    
    if (moduleId && userId) {
      setLoading(true);
      fetchQuiz();
    }
  }, [moduleId, userId]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (submission) return; // Prevent changing if already submitted
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    setSubmitting(true);
    
    // Calculate Score
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option_index) {
        score++;
      }
    });
    
    // Save to Supabase
    const payload = {
      user_id: userId,
      module_id: moduleId,
      score: score,
      total_questions: questions.length,
      answers: answers
    };
    
    const { data, error } = await supabase
      .from('assignment_submissions')
      .upsert(payload, { onConflict: 'user_id, module_id' })
      .select()
      .single();
      
    if (error) {
      console.error(error);
      alert('Failed to submit assignment. Please try again.');
    } else {
      setSubmission(data);
    }
    setSubmitting(false);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Quiz...</div>;
  
  if (questions.length === 0) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-surface-2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Assignment Required</h3>
        <p style={{ color: 'var(--text-tertiary)', maxWidth: '400px', margin: '0 auto' }}>You're good to go! The instructor hasn't attached any questions to this specific lecture.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-surface-2)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Interactive Quiz</h2>
        {submission && (
          <div style={{ background: 'rgba(200, 168, 107, 0.1)', border: '1px solid var(--accent-gold)', padding: '8px 16px', borderRadius: '20px', color: 'var(--accent-gold)', fontWeight: 'bold' }}>
            Score: {submission.score} / {submission.total_questions}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {questions.map((q, i) => {
          const isAnswered = answers[q.id] !== undefined;
          const selectedOption = answers[q.id];
          const isCorrect = submission ? selectedOption === q.correct_option_index : null;
          
          return (
            <div key={q.id} style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                <span style={{ color: 'var(--accent-gold)', marginRight: '8px' }}>Q{i+1}.</span> 
                {q.question_text}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  
                  // Post-submission styling
                  let bgCol = 'var(--bg-surface)';
                  let borderCol = 'var(--card-border)';
                  let textCol = 'var(--text-primary)';
                  
                  if (submission) {
                    if (optIndex === q.correct_option_index) {
                      bgCol = 'rgba(46, 213, 115, 0.1)';
                      borderCol = '#2ed573';
                      textCol = '#2ed573';
                    } else if (isSelected && !isCorrect) {
                      bgCol = 'rgba(255, 77, 77, 0.1)';
                      borderCol = '#ff4d4d';
                      textCol = '#ff4d4d';
                    }
                  } else if (isSelected) {
                    bgCol = 'rgba(200, 168, 107, 0.1)';
                    borderCol = 'var(--accent-gold)';
                    textCol = 'var(--accent-gold)';
                  }
                  
                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      disabled={!!submission}
                      style={{
                        padding: '12px 16px',
                        background: bgCol,
                        border: `1px solid ${borderCol}`,
                        color: textCol,
                        borderRadius: '6px',
                        textAlign: 'left',
                        cursor: submission ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.95rem'
                      }}
                    >
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: `2px solid ${isSelected ? borderCol : 'var(--text-tertiary)'}`,
                        background: isSelected ? borderCol : 'transparent',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}>
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bg-main)' }} />}
                      </div>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submission && (
        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button 
            onClick={handleSubmit} 
            disabled={submitting || Object.keys(answers).length !== questions.length}
            className="btnGold"
            style={{ opacity: (Object.keys(answers).length !== questions.length) ? 0.5 : 1, width: 'auto', padding: '12px 24px' }}
          >
            {submitting ? 'Grading...' : 'Submit Assignment'}
          </button>
        </div>
      )}
      
      {submission && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(46, 213, 115, 0.1)', border: '1px solid #2ed573', borderRadius: '8px', color: '#2ed573', textAlign: 'center', fontWeight: 'bold' }}>
          Assignment Completed! Your score is {submission.score} out of {submission.total_questions}.
        </div>
      )}
    </div>
  );
}
