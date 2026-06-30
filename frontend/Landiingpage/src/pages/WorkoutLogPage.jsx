import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './WorkoutLogPage.css';

export default function WorkoutLogPage() {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Marcus Vance',
    tier: 'Warrior Elite',
    powerLevel: 8965,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // Exercises logged in the current session
  const [loggedExercises, setLoggedExercises] = useState([
    {
      id: 'e1',
      name: 'Incline Barbell Bench Press',
      sets: [
        { id: 's1', weight: 80, reps: 6, rpe: '8', completed: false },
        { id: 's2', weight: 80, reps: 6, rpe: '8.5', completed: false },
      ]
    }
  ]);

  // Available exercises library for searching
  const [exerciseLibrary, setExerciseLibrary] = useState([
    'Barbell Back Squat',
    'Deadlift',
    'Flat Barbell Bench Press',
    'Incline Dumbbell Flyes',
    'Overhead Press',
    'Barbell Row',
    'Weighted Pullups',
    'Dumbbell Lateral Raises',
    'Lying Leg Curls',
    'Calf Raises'
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Premium Features States
  const [activeWarmupEx, setActiveWarmupEx] = useState(null); // exercise object for warmup calculation
  const [warmupTargetWeight, setWarmupTargetWeight] = useState(80);
  const [activePlateWeight, setActivePlateWeight] = useState(null); // target weight for plate calculator

  // Start stopwatch on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add exercise to session
  const handleAddExercise = (exerciseName) => {
    const newEx = {
      id: 'ex-' + Date.now(),
      name: exerciseName,
      sets: [{ id: 'set-' + Date.now() + '-0', weight: 0, reps: 0, rpe: '-', completed: false }]
    };
    setLoggedExercises([...loggedExercises, newEx]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Create custom exercise
  const handleCreateCustomExercise = () => {
    if (!searchTerm.trim()) return;
    const customName = searchTerm.trim();
    if (!exerciseLibrary.includes(customName)) {
      setExerciseLibrary([...exerciseLibrary, customName]);
    }
    handleAddExercise(customName);
  };

  // Add set to exercise
  const handleAddSet = (exerciseId) => {
    setLoggedExercises(
      loggedExercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const prevWeight = ex.sets[ex.sets.length - 1]?.weight || 0;
        const prevReps = ex.sets[ex.sets.length - 1]?.reps || 0;
        const prevRpe = ex.sets[ex.sets.length - 1]?.rpe || '-';
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: 'set-' + Date.now(),
              weight: prevWeight,
              reps: prevReps,
              rpe: prevRpe,
              completed: false
            }
          ]
        };
      })
    );
  };

  // Update set inputs
  const handleUpdateSet = (exerciseId, setId, field, value) => {
    setLoggedExercises(
      loggedExercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((set) => {
            if (set.id !== setId) return set;
            return { ...set, [field]: value };
          })
        };
      })
    );
  };

  // Remove exercise from session
  const handleRemoveExercise = (exerciseId) => {
    setLoggedExercises(loggedExercises.filter((ex) => ex.id !== exerciseId));
  };

  // Epley 1-Rep Max estimation formula
  const calculate1RM = (weight, reps) => {
    if (!weight || !reps) return '-';
    if (reps === 1) return `${weight} kg`;
    const oneRmVal = Math.round(weight * (1 + reps / 30));
    return `${oneRmVal} kg`;
  };

  // Plate Calculator calculation
  const calculatePlates = (targetWeight, barWeight = 20) => {
    const weightPerSide = (targetWeight - barWeight) / 2;
    if (weightPerSide <= 0) return [];
    
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const plates = [];
    let remaining = weightPerSide;
    
    for (let plate of availablePlates) {
      while (remaining >= plate) {
        plates.push(plate);
        remaining -= plate;
      }
    }
    return plates;
  };

  // Generate and prepend warmup sets
  const handleAddWarmupSets = () => {
    if (!activeWarmupEx) return;

    const target = Number(warmupTargetWeight) || 0;
    const warmupSets = [
      { id: 'w-s1-' + Date.now(), weight: Math.round(target * 0.4 / 2.5) * 2.5, reps: 10, rpe: '5', completed: true },
      { id: 'w-s2-' + Date.now(), weight: Math.round(target * 0.6 / 2.5) * 2.5, reps: 8, rpe: '6', completed: true },
      { id: 'w-s3-' + Date.now(), weight: Math.round(target * 0.8 / 2.5) * 2.5, reps: 5, rpe: '7', completed: true },
    ];

    setLoggedExercises(
      loggedExercises.map((ex) => {
        if (ex.id !== activeWarmupEx.id) return ex;
        return {
          ...ex,
          sets: [...warmupSets, ...ex.sets]
        };
      })
    );

    setActiveWarmupEx(null);
  };

  // Calculate session summary stats
  const getSessionStats = () => {
    let totalSets = 0;
    let totalVol = 0;
    loggedExercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed) {
          totalSets += 1;
          totalVol += (Number(set.weight) || 0) * (Number(set.reps) || 0);
        }
      });
    });
    return { totalSets, totalVol };
  };

  const handleFinishWorkout = (e) => {
    e.preventDefault();
    clearInterval(timerRef.current);
    setShowSuccessModal(true);
  };

  const handleCloseModalAndRedirect = () => {
    setShowSuccessModal(false);
    navigate('/workouts');
  };

  const filteredLibrary = exerciseLibrary.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { totalSets, totalVol } = getSessionStats();

  return (
    <div className={`portal-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar user={user} isCollapsed={isSidebarCollapsed} />

      {/* Main View Area */}
      <div className="portal-view">
        {/* Topbar Header */}
        <Topbar
          user={user}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Live Logger panel */}
        <main className="logger-content">
          <form onSubmit={handleFinishWorkout}>
            {/* Top Toolbar */}
            <div className="logger-header-row">
              <div>
                <h1 className="logger-title">ACTIVE SESSION</h1>
                <div className="logger-timer-badge">
                  <svg className="timer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>ELAPSED TIME: {formatTime(seconds)}</span>
                </div>
              </div>
              <button type="submit" className="finish-session-btn">
                FINISH WORKOUT
              </button>
            </div>

            {/* Exercise Search Input Bar */}
            <div className="search-library-wrapper">
              <label className="library-label" htmlFor="exercise-search">Add Exercise</label>
              <div className="search-input-box">
                <input
                  id="exercise-search"
                  type="text"
                  placeholder="Search exercise library... (e.g. Squat, Deadlift)"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                {searchTerm && (
                  <button type="button" className="search-clear-btn" onClick={() => setSearchTerm('')}>
                    ✕
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown list */}
              {showDropdown && searchTerm && (
                <div className="library-dropdown">
                  {filteredLibrary.length > 0 ? (
                    filteredLibrary.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="dropdown-item-btn"
                        onClick={() => handleAddExercise(item)}
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      className="dropdown-item-btn create-custom-btn"
                      onClick={handleCreateCustomExercise}
                    >
                      + Create Custom Exercise: "{searchTerm}"
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Logged Exercises list */}
            <div className="logged-exercises-list">
              {loggedExercises.length > 0 ? (
                loggedExercises.map((exercise) => (
                  <div key={exercise.id} className="logger-exercise-card">
                    {/* Header */}
                    <div className="ex-card-header">
                      <div>
                        <h3>{exercise.name}</h3>
                        <button
                          type="button"
                          className="ex-warmup-trigger"
                          onClick={() => {
                            setActiveWarmupEx(exercise);
                            const lastSetWeight = exercise.sets[exercise.sets.length - 1]?.weight || 80;
                            setWarmupTargetWeight(lastSetWeight);
                          }}
                        >
                          Warmup Calculator
                        </button>
                      </div>
                      <button
                        type="button"
                        className="ex-remove-btn"
                        onClick={() => handleRemoveExercise(exercise.id)}
                        aria-label={`Remove ${exercise.name}`}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Sets Columns Table header */}
                    <div className="sets-table-headers">
                      <span className="col-set">SET</span>
                      <span className="col-weight">WEIGHT (KG)</span>
                      <span className="col-reps">REPS</span>
                      <span className="col-rpe">RPE</span>
                      <span className="col-1rm">EST. 1RM</span>
                      <span className="col-status">DONE</span>
                    </div>

                    {/* Sets Rows */}
                    <div className="sets-list-rows">
                      {exercise.sets.map((set, setIdx) => (
                        <div key={set.id} className={`set-row-item ${set.completed ? 'completed' : ''}`}>
                          <span className="set-num">{setIdx + 1}</span>
                          
                          {/* Weight with Plate Calculator trigger */}
                          <div className="input-with-calc">
                            <input
                              type="number"
                              className="set-input weight"
                              value={set.weight || ''}
                              onChange={(e) =>
                                handleUpdateSet(exercise.id, set.id, 'weight', Number(e.target.value))
                              }
                              placeholder="0"
                              required
                            />
                            <button
                              type="button"
                              className="plate-calc-btn"
                              onClick={() => setActivePlateWeight(Number(set.weight) || 20)}
                              title="Calculate Plates"
                            >
                              🏋️
                            </button>
                          </div>

                          {/* Reps */}
                          <input
                            type="number"
                            className="set-input reps"
                            value={set.reps || ''}
                            onChange={(e) =>
                              handleUpdateSet(exercise.id, set.id, 'reps', Number(e.target.value))
                            }
                            placeholder="0"
                            required
                          />

                          {/* RPE Select */}
                          <select
                            className="set-input rpe"
                            value={set.rpe || '-'}
                            onChange={(e) =>
                              handleUpdateSet(exercise.id, set.id, 'rpe', e.target.value)
                            }
                          >
                            <option value="-">-</option>
                            <option value="10">10</option>
                            <option value="9.5">9.5</option>
                            <option value="9">9</option>
                            <option value="8.5">8.5</option>
                            <option value="8">8</option>
                            <option value="7.5">7.5</option>
                            <option value="7">7</option>
                            <option value="6.5">6.5</option>
                            <option value="6">6</option>
                          </select>

                          {/* Real-time calculated 1RM display */}
                          <span className="col-1rm-val">
                            {calculate1RM(set.weight, set.reps)}
                          </span>

                          {/* Complete checkbox */}
                          <button
                            type="button"
                            className={`set-checkbox ${set.completed ? 'checked' : ''}`}
                            onClick={() =>
                              handleUpdateSet(exercise.id, set.id, 'completed', !set.completed)
                            }
                            aria-label={`Mark set ${setIdx + 1} as completed`}
                          >
                            {set.completed ? '✓' : ''}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add set button */}
                    <button
                      type="button"
                      className="add-set-row-btn"
                      onClick={() => handleAddSet(exercise.id)}
                    >
                      + ADD SET
                    </button>
                  </div>
                ))
              ) : (
                <div className="logger-empty-state">
                  <p>Your session is active but empty. Search and add an exercise above to log your lifts.</p>
                </div>
              )}
            </div>
          </form>
        </main>
      </div>

      {/* WARMUP CALCULATOR MODAL */}
      {activeWarmupEx && (
        <div className="modal-backdrop">
          <div className="success-summary-modal warmup-modal">
            <div className="modal-ornament">⚡</div>
            <h2>WARMUP CALCULATOR</h2>
            <p className="success-tagline">Warrior Elite Premium Tool</p>

            <div className="warmup-input-group">
              <label htmlFor="warmup-weight-input">Target Working Weight (kg)</label>
              <input
                id="warmup-weight-input"
                type="number"
                value={warmupTargetWeight}
                onChange={(e) => setWarmupTargetWeight(Number(e.target.value))}
              />
            </div>

            <div className="warmup-preview-table">
              <div className="warmup-preview-row header">
                <span>SET</span>
                <span>WEIGHT</span>
                <span>REPS</span>
                <span>% TARGET</span>
              </div>
              <div className="warmup-preview-row">
                <span>1</span>
                <span>{Math.round(warmupTargetWeight * 0.4 / 2.5) * 2.5} kg</span>
                <span>10 reps</span>
                <span>40%</span>
              </div>
              <div className="warmup-preview-row">
                <span>2</span>
                <span>{Math.round(warmupTargetWeight * 0.6 / 2.5) * 2.5} kg</span>
                <span>8 reps</span>
                <span>60%</span>
              </div>
              <div className="warmup-preview-row">
                <span>3</span>
                <span>{Math.round(warmupTargetWeight * 0.8 / 2.5) * 2.5} kg</span>
                <span>5 reps</span>
                <span>80%</span>
              </div>
            </div>

            <div className="modal-actions-row">
              <button className="modal-close-btn" onClick={handleAddWarmupSets}>
                ADD TO WORKOUT
              </button>
              <button className="modal-cancel-btn" onClick={() => setActiveWarmupEx(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLATE CALCULATOR MODAL */}
      {activePlateWeight !== null && (
        <div className="modal-backdrop">
          <div className="success-summary-modal plate-modal">
            <div className="modal-ornament">🏋️</div>
            <h2>PLATE CALCULATOR</h2>
            <p className="success-tagline">Barbell Load Visualizer</p>

            <div className="plate-summary-text">
              <h3>{activePlateWeight} kg</h3>
              <p>For a standard 20 kg Olympic barbell:</p>
            </div>

            <div className="plate-visualizer">
              <div className="plate-visual-bar">
                <span className="bar-center">BAR (20kg)</span>
                <span className="bar-sleeve-left" />
                <span className="bar-sleeve-right" />
                
                {/* Visual Plates loaded per side */}
                <div className="loaded-plates-side right">
                  {calculatePlates(activePlateWeight).map((plate, idx) => (
                    <div key={idx} className={`visual-plate p-${plate.toString().replace('.', '_')}`}>
                      {plate}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="plate-listing">
              <h4>Plates Needed Per Side:</h4>
              {calculatePlates(activePlateWeight).length > 0 ? (
                <div className="plates-row">
                  {calculatePlates(activePlateWeight).map((plate, idx) => (
                    <span key={idx} className="plate-badge">{plate} kg</span>
                  ))}
                </div>
              ) : (
                <p className="no-plates-text">Empty Barbell (No plates needed)</p>
              )}
            </div>

            <button className="modal-close-btn" onClick={() => setActivePlateWeight(null)}>
              CONFIRM LOAD
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="success-summary-modal">
            <div className="modal-ornament">★</div>
            <h2>SESSION COMPLETED</h2>
            <p className="success-tagline">Performance successfully archived.</p>

            <div className="summary-stats-box">
              <div className="summary-stat">
                <span className="sum-val">{formatTime(seconds)}</span>
                <span className="sum-lbl">DURATION</span>
              </div>
              <div className="summary-stat">
                <span className="sum-val">{totalSets}</span>
                <span className="sum-lbl">SETS DONE</span>
              </div>
              <div className="summary-stat">
                <span className="sum-val">{totalVol.toLocaleString()} kg</span>
                <span className="sum-lbl">VOLUME LIFTED</span>
              </div>
            </div>

            <div className="modal-quote">
              <p>"Strength does not come from winning. Your struggles develop your strengths."</p>
            </div>

            <button className="modal-close-btn" onClick={handleCloseModalAndRedirect}>
              RETURN TO WORKOUTS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
