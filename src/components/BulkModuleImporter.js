'use client';

import { useState } from 'react';
import { bulkImportModulesAction } from '@/actions/bulkImport';

const SAMPLE_JSON = `[
  {
    "title": "Module 1: Prestressed Concrete Analysis in MIDAS",
    "type": "lecture",
    "date_string": "2026-08-10T20:00:00",
    "status": "upcoming",
    "meeting_link": "https://zoom.us/j/example1"
  },
  {
    "title": "Module 2: Construction Sequence Analysis",
    "type": "lecture",
    "date_string": "2026-08-12T20:00:00",
    "status": "upcoming",
    "meeting_link": "https://zoom.us/j/example2"
  },
  {
    "title": "Module 3: Box Girder Design Assignment",
    "type": "assignment",
    "date_string": "2026-08-20T18:00:00",
    "status": "upcoming",
    "questions": [
      {
        "question_text": "What is the immediate loss of prestress due to elastic shortening in pre-tensioned beams?",
        "options": ["m * fc", "2 * m * fc", "Zero", "0.5 * m * fc"],
        "correct_option_index": 0
      },
      {
        "question_text": "Which IRC code governs live load combinations for highway bridges in India?",
        "options": ["IRC:6", "IRC:21", "IRC:112", "IS:456"],
        "correct_option_index": 0
      }
    ]
  }
]`;

export default function BulkModuleImporter({ courseId, courseTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Live syntax check
  let parsedCount = 0;
  let questionsCount = 0;
  let syntaxError = null;

  if (jsonText.trim() !== '') {
    try {
      const p = JSON.parse(jsonText);
      const arr = Array.isArray(p) ? p : (p.modules || [p]);
      if (Array.isArray(arr)) {
        parsedCount = arr.length;
        arr.forEach(m => {
          if (m && Array.isArray(m.questions)) {
            questionsCount += m.questions.length;
          }
        });
      }
    } catch (e) {
      syntaxError = e.message;
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonText(event.target.result);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setJsonText(SAMPLE_JSON);
    setResult(null);
  };

  const handleImport = async () => {
    if (!jsonText.trim() || syntaxError) return;
    setLoading(true);
    setResult(null);

    const res = await bulkImportModulesAction(courseId, jsonText);
    setResult(res);
    setLoading(false);
    if (res.success) {
      setJsonText(''); // Clear on success
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btnGold"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(200, 168, 107, 0.12)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s',
          }}
        >
          <span>⚡ Bulk Import Modules (JSON / Paste)</span>
        </button>
      ) : (
        <div style={{
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--accent-gold)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡ Bulk Module Importer</span>
                <span style={{ fontSize: '0.75rem', background: 'var(--bg-surface)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                  Course: {courseId}
                </span>
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '4px', marginBottom: 0 }}>
                Paste a JSON array of upcoming lectures or assignments below, or upload a .json file. New items append automatically; existing titles update.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
              title="Close"
            >
              ×
            </button>
          </div>

          {/* Action bar: Upload File or Load Template */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <label style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-secondary)',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>📁 Upload .json File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>

            <button
              onClick={handleLoadSample}
              type="button"
              style={{
                background: 'transparent',
                border: '1px dashed var(--accent-gold)',
                color: 'var(--accent-gold)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              📋 Load Example JSON Template
            </button>
          </div>

          {/* Textarea */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setResult(null); }}
              placeholder={`[\n  {\n    "title": "Module Title",\n    "type": "lecture",\n    "date_string": "2026-08-10T20:00:00",\n    "status": "upcoming",\n    "meeting_link": "https://zoom.us/j/example"\n  }\n]`}
              rows={12}
              style={{
                width: '100%',
                padding: '16px',
                background: 'var(--bg-main)',
                border: syntaxError ? '1px solid #ff4d4d' : '1px solid var(--card-border)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Syntax / Status Banner */}
          {jsonText.trim() !== '' && (
            <div style={{ marginBottom: '1.5rem' }}>
              {syntaxError ? (
                <div style={{ background: 'rgba(255, 77, 77, 0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem' }}>
                  ⚠️ <strong>Syntax Error:</strong> {syntaxError}
                </div>
              ) : (
                <div style={{ background: 'rgba(46, 213, 115, 0.1)', border: '1px solid #2ed573', color: '#2ed573', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>✅ <strong>Valid JSON Detected:</strong> Ready to import <strong>{parsedCount} modules</strong> ({questionsCount} MCQ questions attached) into <strong>{courseId}</strong>.</span>
                </div>
              )}
            </div>
          )}

          {/* Result Alert */}
          {result && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '12px 16px',
              borderRadius: '8px',
              background: result.success ? 'rgba(46, 213, 115, 0.15)' : 'rgba(255, 77, 77, 0.15)',
              border: `1px solid ${result.success ? '#2ed573' : '#ff4d4d'}`,
              color: result.success ? '#2ed573' : '#ff4d4d',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}>
              {result.success ? `🎉 ${result.message}` : `❌ Error: ${result.error}`}
            </div>
          )}

          {/* Submit Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              style={{
                background: 'transparent',
                border: '1px solid var(--card-border)',
                color: 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !jsonText.trim() || !!syntaxError}
              className="btnGold"
              style={{
                width: 'auto',
                padding: '10px 28px',
                opacity: (loading || !jsonText.trim() || !!syntaxError) ? 0.5 : 1,
              }}
            >
              {loading ? 'Executing Import...' : 'Confirm & Import Modules'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
