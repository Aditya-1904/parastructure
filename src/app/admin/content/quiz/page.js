import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import styles from '@/app/dashboard/dashboard.module.css';

export default async function AdminQuizManager({ searchParams }) {
  const moduleId = (await searchParams)?.module;

  if (!moduleId) {
    return <div style={{ padding: '2rem' }}>Error: No module ID provided.</div>;
  }

  // Fetch the module
  const { data: moduleData, error: moduleError } = await supabase
    .from('course_modules')
    .select('*')
    .eq('id', moduleId)
    .single();

  if (moduleError || !moduleData) {
    return <div style={{ padding: '2rem' }}>Error loading module details.</div>;
  }

  // Fetch existing questions
  const { data: questions, error: qError } = await supabase
    .from('assignment_questions')
    .select('*')
    .eq('module_id', moduleId)
    .order('created_at', { ascending: true });

  // --- Server Actions ---
  async function addQuestion(formData) {
    'use server';
    const modId = formData.get('module_id');
    const question_text = formData.get('question_text');
    const correct_option_index = parseInt(formData.get('correct_option_index') || '0', 10);
    
    // Gather options (ignore empty ones)
    const options = [
      formData.get('option_0'),
      formData.get('option_1'),
      formData.get('option_2'),
      formData.get('option_3')
    ].filter(o => o && o.trim() !== '');

    if (options.length < 2) {
      console.error('At least two options required');
      return;
    }

    const { error } = await supabase
      .from('assignment_questions')
      .insert({
        module_id: modId,
        question_text,
        options,
        correct_option_index
      });
      
    if (error) console.error(error);
    revalidatePath('/', 'layout');
  }

  async function deleteQuestion(formData) {
    'use server';
    const id = formData.get('id');
    const { error } = await supabase.from('assignment_questions').delete().eq('id', id);
    if (error) console.error(error);
    revalidatePath('/', 'layout');
  }

  return (
    <>
      <section className={styles.welcomeSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className={styles.greeting}>Manage Quiz</h1>
            <p className={styles.subtitle}>Adding questions for module: <strong>{moduleData.title}</strong></p>
          </div>
          <Link href={`/admin/content?course=${moduleData.course_id}`} className="btnPrimary" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
            ← Back to Modules
          </Link>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* ADD QUESTION FORM */}
        <section style={{ background: 'var(--bg-surface-2)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <h2 className={styles.sectionTitle} style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New MCQ</h2>
          
          <form action={addQuestion} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <input type="hidden" name="module_id" value={moduleId} />
            
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Question Text *</label>
              <textarea name="question_text" required rows="3" placeholder="e.g. Which of the following is an advantage of pre-stressed concrete?" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Option A (Index 0) *</label>
              <input type="text" name="option_0" required placeholder="Option A text..." style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Option B (Index 1) *</label>
              <input type="text" name="option_1" required placeholder="Option B text..." style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Option C (Index 2)</label>
              <input type="text" name="option_2" placeholder="Option C text... (optional)" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Option D (Index 3)</label>
              <input type="text" name="option_3" placeholder="Option D text... (optional)" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '6px' }} />
            </div>

            <div style={{ flex: '1 1 100%', padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--accent-gold)', borderRadius: '6px', marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-gold)' }}>Which option is Correct? *</label>
              <select name="correct_option_index" style={{ width: '100%', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '4px' }}>
                <option value="0">Option A (Index 0)</option>
                <option value="1">Option B (Index 1)</option>
                <option value="2">Option C (Index 2)</option>
                <option value="3">Option D (Index 3)</option>
              </select>
            </div>

            <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
              <button type="submit" className="btnGold" style={{ width: 'auto', padding: '10px 24px' }}>+ Save Question</button>
            </div>
          </form>
        </section>

        {/* LIST VIEW */}
        <section>
          <h2 className={styles.sectionTitle}>Current Questions ({questions?.length || 0})</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions?.map((q, i) => (
              <div key={q.id} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-tertiary)', marginRight: '8px' }}>Q{i+1}.</span> 
                    {q.question_text}
                  </h3>
                  <form action={deleteQuestion}>
                    <input type="hidden" name="id" value={q.id} />
                    <button type="submit" style={{ color: '#ff4d4d', fontSize: '0.8125rem', padding: '4px 8px', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}>Delete</button>
                  </form>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {q.options.map((opt, optIndex) => (
                    <div 
                      key={optIndex} 
                      style={{ 
                        padding: '10px', 
                        borderRadius: '6px', 
                        border: optIndex === q.correct_option_index ? '2px solid var(--accent-gold)' : '1px solid var(--card-border)',
                        background: optIndex === q.correct_option_index ? 'rgba(200, 168, 107, 0.1)' : 'var(--bg-surface-2)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <span style={{ fontWeight: 600, marginRight: '8px', color: optIndex === q.correct_option_index ? 'var(--accent-gold)' : 'var(--text-tertiary)' }}>
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      {opt}
                      {optIndex === q.correct_option_index && <span style={{ float: 'right', color: 'var(--accent-gold)', fontWeight: 700 }}>✓ Correct</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {(!questions || questions.length === 0) && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)', background: 'var(--bg-surface-2)', borderRadius: '8px' }}>
                No questions added to this quiz yet.
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}
