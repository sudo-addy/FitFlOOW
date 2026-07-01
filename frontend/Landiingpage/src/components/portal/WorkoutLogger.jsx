import React, { useState, useEffect, useRef } from 'react';
import PortalLayout from './PortalLayout';
import { api } from '../../utils/api';
import './WorkoutLogger.css';
import { useToast } from '../../context/ToastContext';

/* ── Preset Templates ── */
const TEMPLATES = {
  Custom: [],
  'Push Day': [
    { name: 'Barbell Bench Press', muscle: 'Chest', sets: [{ reps: 8, weight: 100, done: false }, { reps: 8, weight: 100, done: false }, { reps: 6, weight: 107.5, done: false }, { reps: 6, weight: 107.5, done: false }], steps: [] },
    { name: 'Incline Dumbbell Press', muscle: 'Chest', sets: [{ reps: 10, weight: 32, done: false }, { reps: 10, weight: 32, done: false }, { reps: 10, weight: 32, done: false }], steps: [] },
    { name: 'Overhead Press', muscle: 'Shoulders', sets: [{ reps: 8, weight: 60, done: false }, { reps: 8, weight: 60, done: false }, { reps: 6, weight: 65, done: false }], steps: [] },
    { name: 'Lateral Raise', muscle: 'Shoulders', sets: [{ reps: 15, weight: 12, done: false }, { reps: 15, weight: 12, done: false }, { reps: 15, weight: 12, done: false }], steps: [] },
  ],
  'Pull Day': [
    { name: 'Weighted Pull-Up', muscle: 'Back', sets: [{ reps: 6, weight: 20, done: false }, { reps: 6, weight: 20, done: false }, { reps: 5, weight: 20, done: false }], steps: [] },
    { name: 'Barbell Row', muscle: 'Back', sets: [{ reps: 8, weight: 100, done: false }, { reps: 8, weight: 100, done: false }, { reps: 8, weight: 100, done: false }], steps: [] },
    { name: 'Face Pull', muscle: 'Rear Delt', sets: [{ reps: 15, weight: 25, done: false }, { reps: 15, weight: 25, done: false }, { reps: 15, weight: 25, done: false }], steps: [] },
    { name: 'EZ-Bar Curl', muscle: 'Biceps', sets: [{ reps: 10, weight: 45, done: false }, { reps: 10, weight: 45, done: false }, { reps: 10, weight: 45, done: false }], steps: [] },
  ],
  Legs: [
    { name: 'Barbell Squat', muscle: 'Quads', sets: [{ reps: 5, weight: 120, done: false }, { reps: 5, weight: 130, done: false }, { reps: 5, weight: 140, done: false }, { reps: 3, weight: 145, done: false }], steps: [] },
    { name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: [{ reps: 10, weight: 90, done: false }, { reps: 10, weight: 90, done: false }, { reps: 10, weight: 90, done: false }], steps: [] },
    { name: 'Leg Press', muscle: 'Quads', sets: [{ reps: 12, weight: 180, done: false }, { reps: 12, weight: 180, done: false }, { reps: 12, weight: 180, done: false }], steps: [] },
    { name: 'Seated Calf Raise', muscle: 'Calves', sets: [{ reps: 15, weight: 60, done: false }, { reps: 15, weight: 60, done: false }, { reps: 15, weight: 60, done: false }], steps: [] },
  ],
  'Full Body': [
    { name: 'Deadlift', muscle: 'Back', sets: [{ reps: 5, weight: 140, done: false }, { reps: 3, weight: 160, done: false }, { reps: 1, weight: 175, done: false }], steps: [] },
    { name: 'Barbell Squat', muscle: 'Quads', sets: [{ reps: 8, weight: 110, done: false }, { reps: 8, weight: 110, done: false }, { reps: 8, weight: 110, done: false }], steps: [] },
    { name: 'Bench Press', muscle: 'Chest', sets: [{ reps: 8, weight: 90, done: false }, { reps: 8, weight: 90, done: false }, { reps: 8, weight: 90, done: false }], steps: [] },
    { name: 'Pull-Up', muscle: 'Back', sets: [{ reps: 8, weight: 0, done: false }, { reps: 8, weight: 0, done: false }, { reps: 8, weight: 0, done: false }], steps: [] },
  ],
};

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Calves', 'Glutes', 'Core', 'Cardio', 'Other'];

const mapBodyPartToMuscle = (part) => {
  if (!part) return 'Other';
  const p = part.toLowerCase();
  if (p.includes('chest')) return 'Chest';
  if (p.includes('back')) return 'Back';
  if (p.includes('shoulder')) return 'Shoulders';
  if (p.includes('upper arms') || p.includes('biceps')) return 'Biceps';
  if (p.includes('triceps')) return 'Triceps';
  if (p.includes('quads') || p.includes('upper legs')) return 'Quads';
  if (p.includes('hamstring') || p.includes('lower legs')) return 'Calves';
  if (p.includes('waist') || p.includes('abs') || p.includes('core')) return 'Core';
  if (p.includes('cardio')) return 'Cardio';
  return 'Other';
};

function newSet(reps = 8, weight = 60) {
  return { reps, weight, done: false };
}

function newExercise(name = '', muscle = 'Chest', steps = []) {
  return { name, muscle, sets: [newSet(), newSet(), newSet()], steps };
}

/* ── Timer hook ── */
function useTimer(isRunning) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);
  return seconds;
}

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/* ── Component ── */
export default function WorkoutLogger() {
  const { showToast } = useToast();
  const [sessionName, setSessionName] = useState('');
  const [template, setTemplate] = useState('Custom');
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);

  // Add exercise form
  const [addMusclGroup, setAddMuscleGroup] = useState('Chest');
  const [addExName, setAddExName] = useState('');

  // Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState([]); // steps list for the active exercise to add
  
  // Instructions modal states
  const [activeSteps, setActiveSteps] = useState(null);
  const [activeStepsTitle, setActiveStepsTitle] = useState('');

  const elapsed = useTimer(sessionStarted && !finished);

  // Fetch custom templates on mount
  useEffect(() => {
    api.getTemplates()
      .then((res) => {
        setCustomTemplates(res || []);
      })
      .catch((err) => {
        console.error('Failed to fetch custom templates:', err);
      });
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (addExName.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      api.searchExercises(addExName)
        .then((res) => {
          setSuggestions(res.exercises || []);
        })
        .catch(console.error);
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [addExName]);

  // Total sets done
  const totalSets = exercises.reduce((a, ex) => a + ex.sets.length, 0);
  const doneSets = exercises.reduce((a, ex) => a + ex.sets.filter((s) => s.done).length, 0);
  const totalVolume = exercises.reduce(
    (a, ex) => a + ex.sets.filter((s) => s.done).reduce((b, s) => b + s.reps * s.weight, 0),
    0
  );

  /* Template load */
  const applyTemplate = (t) => {
    setTemplate(t);
    if (TEMPLATES[t]) {
      const tpl = TEMPLATES[t];
      if (tpl.length > 0) {
        setExercises(tpl.map((ex) => ({ ...ex, sets: ex.sets.map((s) => ({ ...s })) })));
        setSessionName(t + ' Session');
        showToast(`Loaded template: ${t}`, 'info');
      } else {
        setExercises([]);
        setSessionName('');
      }
      return;
    }

    // Check custom templates
    const customTpl = customTemplates.find((tpl) => tpl.name === t);
    if (customTpl) {
      const mappedExercises = customTpl.exercises.map((ex) => ({
        name: ex.name,
        muscle: 'Chest', // Fallback muscle group
        sets: Array.from({ length: ex.sets }, () => ({
          reps: ex.reps,
          weight: ex.weight,
          done: false,
        })),
        steps: [],
      }));
      setExercises(mappedExercises);
      setSessionName(customTpl.name + ' Session');
      showToast(`Loaded template: ${customTpl.name}`, 'info');
    } else {
      setExercises([]);
      setSessionName('');
    }
  };

  /* Start session */
  const startSession = () => {
    setSessionStarted(true);
    showToast('Timer started! Go crush it!', 'info');
  };

  /* Add exercise */
  const addExercise = () => {
    if (!addExName.trim()) return;
    setExercises((prev) => [...prev, newExercise(addExName.trim(), addMusclGroup, selectedSteps)]);
    showToast(`Added exercise: ${addExName.trim()}`, 'success');
    setAddExName('');
    setSelectedSteps([]);
  };

  /* Remove exercise */
  const removeExercise = (idx) => {
    const ex = exercises[idx];
    setExercises((prev) => prev.filter((_, i) => i !== idx));
    showToast(`Removed exercise: ${ex?.name}`, 'info');
  };

  /* Add set to exercise */
  const addSet = (exIdx) => {
    setExercises((prev) => {
      const copy = [...prev];
      const last = copy[exIdx].sets.at(-1) || { reps: 8, weight: 60 };
      copy[exIdx] = { ...copy[exIdx], sets: [...copy[exIdx].sets, newSet(last.reps, last.weight)] };
      return copy;
    });
  };

  /* Remove set */
  const removeSet = (exIdx, setIdx) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[exIdx] = { ...copy[exIdx], sets: copy[exIdx].sets.filter((_, i) => i !== setIdx) };
      return copy;
    });
  };

  /* Update set field */
  const updateSet = (exIdx, setIdx, field, value) => {
    setExercises((prev) => {
      const copy = [...prev];
      const sets = copy[exIdx].sets.map((s, i) =>
        i === setIdx ? { ...s, [field]: field === 'done' ? value : Number(value) || 0 } : s
      );
      copy[exIdx] = { ...copy[exIdx], sets };
      return copy;
    });
  };

  /* Save current layout as a new reusable template */
  const saveAsTemplate = async () => {
    const defaultName = sessionName.replace(/\s+Session$/, '') || 'My Template';
    const nameInput = prompt('Enter a name for this workout template:', defaultName);
    if (!nameInput || !nameInput.trim()) return;

    try {
      const payload = {
        name: nameInput.trim(),
        exercises: exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets.length,
          reps: ex.sets[0]?.reps || 8,
          weight: ex.sets[0]?.weight || 60,
        })),
      };
      await api.createTemplate(payload);
      showToast(`Template "${payload.name}" saved successfully!`, 'success');
      
      const updated = await api.getTemplates();
      setCustomTemplates(updated || []);
    } catch (err) {
      showToast(err.message || 'Failed to save template.', 'error');
    }
  };

  /* Finish session */
  const finishSession = async () => {
    if (exercises.length === 0) return;
    try {
      const payload = {
        name: sessionName.trim() || 'Custom Session',
        duration: Math.ceil(elapsed / 60) || 1,
        exercises: exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets.length,
          reps: ex.sets[0]?.reps || 8,
          weight: ex.sets[0]?.weight || 60,
          completed: ex.sets.some((s) => s.done),
        })),
      };
      await api.logWorkout(payload);
      setFinished(true);
      showToast(`⚡ Workout logged successfully! +${totalVolume.toLocaleString()} kg total volume`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save workout session.', 'error');
    }
  };

  if (finished) {
    return (
      <PortalLayout>
        <div className="logger-root">
          <div className="logger-complete">
            <div className="logger-complete-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="logger-complete-title">Session Complete!</h2>
            <p className="logger-complete-sub">"{sessionName || 'Unnamed Session'}" logged successfully.</p>
            <div className="logger-complete-stats">
              <div className="logger-complete-stat">
                <span className="logger-complete-stat-val">{formatTime(elapsed)}</span>
                <span className="logger-complete-stat-label">Duration</span>
              </div>
              <div className="logger-complete-stat">
                <span className="logger-complete-stat-val">{doneSets}</span>
                <span className="logger-complete-stat-label">Sets Done</span>
              </div>
              <div className="logger-complete-stat">
                <span className="logger-complete-stat-val">{totalVolume.toLocaleString()} kg</span>
                <span className="logger-complete-stat-label">Total Volume</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button
                className="portal-btn-primary logger-new-btn"
                onClick={() => { setFinished(false); setSessionStarted(false); setExercises([]); setSessionName(''); setNotes(''); setTemplate('Custom'); }}
                id="logger-new-session-btn"
                style={{ minWidth: '180px' }}
              >
                Log Another Session
              </button>
              <button
                className="portal-btn-secondary logger-save-template-btn"
                onClick={saveAsTemplate}
                id="logger-save-template-btn"
                style={{ minWidth: '180px' }}
              >
                Save as Template
              </button>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="logger-root">
        {/* Page Header */}
        <div className="portal-page-header logger-header">
          <div>
            <h1 className="portal-page-title">Log <span className="portal-highlight">Session</span></h1>
            <p className="portal-page-subtitle">Record every set. Own every rep.</p>
          </div>

          {/* Timer */}
          <div className={`logger-timer${sessionStarted ? ' logger-timer--running' : ''}`}>
            <div className="logger-timer-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="logger-timer-display">
              <span className="logger-timer-value">{formatTime(elapsed)}</span>
              <span className="logger-timer-label">{sessionStarted ? 'Session Active' : 'Not Started'}</span>
            </div>
            {!sessionStarted && (
              <button className="logger-start-btn" onClick={startSession} id="logger-start-session-btn" aria-label="Start session timer">
                Start
              </button>
            )}
          </div>
        </div>

        {/* ── Top Controls ── */}
        <div className="logger-top-controls">
          {/* Session Name */}
          <div className="logger-field-group">
            <label htmlFor="logger-session-name" className="logger-label">Session Name</label>
            <input
              id="logger-session-name"
              type="text"
              className="logger-input"
              placeholder="Name this session..."
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </div>

          {/* Template */}
          <div className="logger-field-group">
            <label htmlFor="logger-template" className="logger-label">Load Template</label>
            <div className="logger-select-wrap">
              <select
                id="logger-template"
                className="logger-select"
                value={template}
                onChange={(e) => applyTemplate(e.target.value)}
              >
                <option value="Custom">Custom (Empty)</option>
                <optgroup label="Preset Templates">
                  {Object.keys(TEMPLATES).filter((t) => t !== 'Custom').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </optgroup>
                {customTemplates.length > 0 && (
                  <optgroup label="My Templates">
                    {customTemplates.map((tpl) => (
                      <option key={tpl.name} value={tpl.name}>{tpl.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
              <svg className="logger-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Quick Start from Template Grid ── */}
        {!sessionStarted && (
          <div className="logger-quick-start-section" style={{ marginBottom: '2.5rem' }}>
            <h2 className="portal-section-title" style={{ marginBottom: '1.25rem' }}>Quick Start from Template</h2>
            <div className="logger-template-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {Object.keys(TEMPLATES).filter(t => t !== 'Custom').map((tName) => (
                <div 
                  key={tName}
                  className="logger-template-card-quick portal-card"
                  onClick={() => {
                    applyTemplate(tName);
                    setSessionStarted(true);
                    showToast(`Quick Start: ${tName} session active!`, 'success');
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 85, 0, 0.03)',
                    border: '1px solid rgba(255, 85, 0, 0.15)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 85, 0, 0.7)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 85, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 85, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 85, 0, 0.15)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 85, 0, 0.03)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>{tName}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                      {TEMPLATES[tName].length} exercises configured
                    </p>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffaa00', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Quick Start <span style={{ transition: 'transform 0.2s' }}>&rarr;</span>
                  </span>
                </div>
              ))}

              {customTemplates.map((tpl) => (
                <div 
                  key={tpl.id}
                  className="logger-template-card-quick portal-card"
                  onClick={() => {
                    applyTemplate(tpl.name);
                    setSessionStarted(true);
                    showToast(`Quick Start: ${tpl.name} session active!`, 'success');
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 170, 0, 0.03)',
                    border: '1px solid rgba(255, 170, 0, 0.15)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 170, 0, 0.7)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 170, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 170, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 170, 0, 0.15)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 170, 0, 0.03)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffaa00', backgroundColor: 'rgba(255,170,0,0.12)', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.6rem', border: '1px solid rgba(255,170,0,0.2)' }}>Custom</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>{tpl.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                      {tpl.exercises.length} exercises configured
                    </p>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffaa00', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Quick Start <span style={{ transition: 'transform 0.2s' }}>&rarr;</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Session Stats Bar (when active) ── */}
        {sessionStarted && (
          <div className="logger-stats-bar">
            <div className="logger-stats-item">
              <span className="logger-stats-val">{exercises.length}</span>
              <span className="logger-stats-label">Exercises</span>
            </div>
            <div className="logger-stats-divider" aria-hidden="true" />
            <div className="logger-stats-item">
              <span className="logger-stats-val">{doneSets}/{totalSets}</span>
              <span className="logger-stats-label">Sets Done</span>
            </div>
            <div className="logger-stats-divider" aria-hidden="true" />
            <div className="logger-stats-item">
              <span className="logger-stats-val">{totalVolume.toLocaleString()} kg</span>
              <span className="logger-stats-label">Volume Logged</span>
            </div>
          </div>
        )}

        {/* ── Exercise List ── */}
        <div className="logger-exercises-section">
          {exercises.length > 0 && (
            <h2 className="portal-section-title">Exercises</h2>
          )}
          <div className="logger-exercise-list">
            {exercises.map((ex, exIdx) => (
              <div key={exIdx} className="logger-exercise-card">
                {/* Exercise Header */}
                <div className="logger-ex-header">
                  <div className="logger-ex-muscle-tag">{ex.muscle}</div>
                  <h3 className="logger-ex-name">
                    {ex.name}
                    {ex.steps && ex.steps.length > 0 && (
                      <button
                        className="logger-ex-info-btn"
                        onClick={() => {
                          setActiveSteps(ex.steps);
                          setActiveStepsTitle(ex.name);
                        }}
                        aria-label={`Show instructions for ${ex.name}`}
                        style={{ background: 'none', border: 'none', color: '#ffaa00', marginLeft: '0.5rem', cursor: 'pointer', padding: '2px 4px' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </button>
                    )}
                  </h3>
                  <button
                    className="logger-ex-remove"
                    onClick={() => removeExercise(exIdx)}
                    id={`logger-remove-ex-${exIdx}`}
                    aria-label={`Remove ${ex.name}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Set Rows */}
                <div className="logger-sets-table">
                  <div className="logger-sets-head">
                    <span>Set</span>
                    <span>Reps</span>
                    <span>Weight (kg)</span>
                    <span>Done</span>
                    <span aria-hidden="true" />
                  </div>
                  {ex.sets.map((set, setIdx) => (
                    <div key={setIdx} className={`logger-set-row${set.done ? ' logger-set-row--done' : ''}`}>
                      <span className="logger-set-num">{setIdx + 1}</span>
                      <input
                        type="number"
                        className="logger-set-input"
                        value={set.reps}
                        min="1"
                        onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                        aria-label={`Reps for set ${setIdx + 1} of ${ex.name}`}
                        id={`logger-set-${exIdx}-${setIdx}-reps`}
                      />
                      <input
                        type="number"
                        className="logger-set-input"
                        value={set.weight}
                        min="0"
                        step="2.5"
                        onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                        aria-label={`Weight for set ${setIdx + 1} of ${ex.name}`}
                        id={`logger-set-${exIdx}-${setIdx}-weight`}
                      />
                      <label className="logger-set-check-wrap">
                        <input
                          type="checkbox"
                          className="logger-set-check"
                          checked={set.done}
                          onChange={(e) => updateSet(exIdx, setIdx, 'done', e.target.checked)}
                          aria-label={`Mark set ${setIdx + 1} of ${ex.name} as done`}
                          id={`logger-set-${exIdx}-${setIdx}-done`}
                        />
                        <span className="logger-set-check-custom" aria-hidden="true">
                          {set.done && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </label>
                      <button
                        className="logger-set-del"
                        onClick={() => removeSet(exIdx, setIdx)}
                        aria-label={`Remove set ${setIdx + 1} from ${ex.name}`}
                        id={`logger-del-set-${exIdx}-${setIdx}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="logger-add-set-btn"
                  onClick={() => addSet(exIdx)}
                  id={`logger-add-set-${exIdx}`}
                  aria-label={`Add set to ${ex.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Set
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add Exercise ── */}
        <div className="logger-add-ex-card">
          <h2 className="portal-section-title" style={{ marginBottom: '1.25rem' }}>Add Exercise</h2>
          <div className="logger-add-ex-form">
            <div className="logger-field-group">
              <label htmlFor="logger-muscle-group" className="logger-label">Muscle Group</label>
              <div className="logger-select-wrap">
                <select
                  id="logger-muscle-group"
                  className="logger-select"
                  value={addMusclGroup}
                  onChange={(e) => setAddMuscleGroup(e.target.value)}
                >
                  {MUSCLE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <svg className="logger-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="logger-field-group logger-field-group--grow" style={{ position: 'relative' }}>
              <label htmlFor="logger-ex-name" className="logger-label">Exercise Name</label>
              <input
                id="logger-ex-name"
                type="text"
                className="logger-input"
                placeholder="e.g. Barbell Squat, Cable Fly..."
                value={addExName}
                onChange={(e) => {
                  setAddExName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => e.key === 'Enter' && addExercise()}
              />
              
              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  className="logger-autocomplete-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#110a08',
                    border: '1px solid rgba(255, 85, 0, 0.25)',
                    borderRadius: '8px',
                    zIndex: 100,
                    maxHeight: '220px',
                    overflowY: 'auto',
                    marginTop: '4px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  {suggestions.map((sug) => (
                    <div
                      key={sug.id}
                      onClick={() => {
                        setAddExName(sug.name);
                        setAddMuscleGroup(mapBodyPartToMuscle(sug.bodyPart));
                        setSelectedSteps(sug.steps || []);
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="logger-autocomplete-item"
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.8)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        fontSize: '0.85rem',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 85, 0, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{sug.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#ffaa00', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {sug.target} ({sug.equipment})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="logger-field-group logger-field-group--btn">
              <label className="logger-label" aria-hidden="true">&nbsp;</label>
              <button
                className="portal-btn-secondary logger-add-ex-btn"
                onClick={addExercise}
                id="logger-add-exercise-btn"
                aria-label="Add exercise to session"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="logger-notes-section">
          <label htmlFor="logger-notes" className="portal-section-title" style={{ display: 'block', marginBottom: '0.75rem' }}>
            Session Notes
          </label>
          <textarea
            id="logger-notes"
            className="logger-notes-input"
            placeholder="How did it feel? Any PRs? Observations about form, energy levels..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* ── Finish Button ── */}
        <div className="logger-finish-wrap">
          <button
            className="logger-finish-btn"
            onClick={finishSession}
            id="logger-finish-session-btn"
            aria-label="Finish and save this workout session"
            disabled={exercises.length === 0}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Finish Session
          </button>
          {exercises.length === 0 && (
            <p className="logger-finish-hint">Add at least one exercise to finish.</p>
          )}
        </div>
      </div>

      {/* ── Step-by-Step Instructions Modal ── */}
      {activeSteps && (
        <div 
          className="logger-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.25rem'
          }}
          onClick={() => setActiveSteps(null)}
        >
          <div 
            className="logger-modal-content portal-card"
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#0c0706',
              border: '1px solid rgba(255, 85, 0, 0.2)',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative',
              animation: 'logger-modal-in 0.3s ease forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '4px'
              }}
              onClick={() => setActiveSteps(null)}
              aria-label="Close instructions modal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <span className="portal-card-label" style={{ color: '#ff5500', display: 'block', marginBottom: '0.5rem' }}>
              EXERCISE INSTRUCTIONS
            </span>
            <h2 className="portal-page-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              {activeStepsTitle}
            </h2>

            <div className="portal-divider" />

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeSteps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 85, 0, 0.1)',
                      border: '1px solid rgba(255, 85, 0, 0.3)',
                      color: '#ffaa00',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {idx + 1}
                  </span>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, margin: 0 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
