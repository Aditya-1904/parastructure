'use client';

import { useState } from 'react';
import { bulkImportCoursesAction } from '@/actions/bulkCourseImport';

const SAMPLE_COURSE_JSON = `[
  {
    "id": "bridge-design-pro",
    "title": "Professional Bridge Design & Analysis Track",
    "short_title": "Bridge Pro Track",
    "tagline": "Master bridge analysis from foundations to superstructure.",
    "description": "Comprehensive practical course on bridge design using MIDAS Civil and IRC codes.",
    "price": 59999,
    "original_price": 79999,
    "level": "Advanced",
    "mode": "Online Live",
    "duration": "8 Weeks",
    "hours": "30+ Hours",
    "is_published": true,
    "modules": [
      {
        "title": "Module 1: Introduction to Bridge Types & Superstructures",
        "type": "lecture",
        "date_string": "2026-08-10T20:00:00",
        "status": "upcoming",
        "meeting_link": "https://zoom.us/j/example1"
      },
      {
        "title": "Module 2: IRC Loading & Analysis Quiz",
        "type": "assignment",
        "date_string": "2026-08-15T18:00:00",
        "status": "upcoming",
        "questions": [
          {
            "question_text": "What is the primary function of shear studs in composite bridges?",
            "options": [
              "To resist horizontal shear between slab and girder",
              "To prevent corrosion of main girders",
              "To increase damping of the bridge",
              "To reduce dead load of the deck"
            ],
            "correct_option_index": 0
          },
          {
            "question_text": "Which load combination is critical for bearing sizing in IRC:6?",
            "options": [
              "Dead Load + Live Load + Temp + Braking",
              "Dead Load only",
              "Wind Load only",
              "Seismic Load only"
            ],
            "correct_option_index": 0
          }
        ]
      }
    ]
  }
]`;

export default function BulkCourseImporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Live syntax check
  let parsedCourses = 0;
  let parsedModules = 0;
  let parsedQuestions = 0;
  let syntaxError = null;

  if (jsonText.trim() !== '') {
    try {
      const p = JSON.parse(jsonText);
      const arr = Array.isArray(p) ? p : (p.courses || [p]);
      if (Array.isArray(arr)) {
        parsedCourses = arr.length;
        arr.forEach(c => {
          if (c && Array.isArray(c.modules)) {
            parsedModules += c.modules.length;
            c.modules.forEach(m => {
              if (m && Array.isArray(m.questions)) {
                parsedQuestions += m.questions.length;
              }
            });
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
    setJsonText(SAMPLE_COURSE_JSON);
    setResult(null);
  };

  const handleImport = async () => {
    if (!jsonText.trim() || syntaxError) return;
    setLoading(true);
    setResult(null);

    const res = await bulkImportCoursesAction(jsonText);
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
          <span>🌐 Global Bulk Import (Courses + Modules + MCQs JSON)</span>
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
                <span>🌐 Global Curriculum Bulk Importer</span>
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '4px', marginBottom: 0 }}>
                Import one or multiple courses simultaneously along with all their modules, lectures, and MCQ quizzes from a single JSON file.
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

          {/* Action bar */}
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
              📋 Load Full Course Example JSON
            </button>
          </div>

          {/* Textarea */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setResult(null); }}
              placeholder={`[\n  {\n    "id": "course-id",\n    "title": "Course Title",\n    "modules": [\n      {\n        "title": "Module Title",\n        "type": "lecture",\n        "date_string": "2026-08-10T20:00:00"\n      }\n    ]\n  }\n]`}
              rows={14}
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
                  <span>✅ <strong>Valid JSON Detected:</strong> Ready to import <strong>{parsedCourses} courses</strong> containing <strong>{parsedModules} modules</strong> and <strong>{parsedQuestions} MCQ questions</strong>.</span>
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
              {loading ? 'Executing Import...' : 'Confirm Global Import'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
