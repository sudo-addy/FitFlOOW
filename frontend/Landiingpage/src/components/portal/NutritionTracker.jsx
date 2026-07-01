import React, { useState, useEffect } from 'react';
import PortalLayout from './PortalLayout';
import './NutritionTracker.css';

/* ── Macro Ring (SVG stroke-dashoffset) ─────────────────────────── */
function MacroRing({ label, current, total, unit, color, size = 110, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(current / total, 1);
  const offset = circ * (1 - pct);

  return (
    <div className="nutrition-ring-wrap" aria-label={`${label}: ${current} of ${total} ${unit}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#f5ede6"
          fontSize="13"
          fontWeight="800"
          fontFamily="Outfit, sans-serif"
        >
          {current}
        </text>
        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="Outfit, sans-serif"
        >
          {unit}
        </text>
      </svg>
      <div className="nutrition-ring-label">{label}</div>
      <div className="nutrition-ring-sub">
        <span style={{ color }}>{Math.round(pct * 100)}%</span>
        &nbsp;of {total}
      </div>
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────────────── */
const INITIAL_MEALS = [
  {
    id: 'meal-1',
    name: 'Oat & Whey Bowl',
    type: 'Breakfast',
    time: '07:30 AM',
    calories: 480,
    protein: 38,
    carbs: 52,
    fat: 12,
    items: ['90g Rolled oats', '1 scoop Whey protein', '1 Banana', '1 tbsp Peanut butter', '250ml Almond milk'],
    icon: '🥣',
  },
  {
    id: 'meal-2',
    name: 'Chicken & Rice',
    type: 'Lunch',
    time: '12:45 PM',
    calories: 620,
    protein: 52,
    carbs: 75,
    fat: 14,
    items: ['200g Chicken breast', '150g Basmati rice', 'Mixed greens', '1 tbsp Olive oil', 'Lemon & herbs'],
    icon: '🍗',
  },
  {
    id: 'meal-3',
    name: 'Banana + BCAA',
    type: 'Pre-Workout',
    time: '04:30 PM',
    calories: 230,
    protein: 18,
    carbs: 42,
    fat: 2,
    items: ['1 Large banana', '10g BCAA powder', '500ml Water', '1 Rice cake'],
    icon: '⚡',
  },
  {
    id: 'meal-4',
    name: 'Salmon & Quinoa',
    type: 'Dinner',
    time: '08:00 PM',
    calories: 510,
    protein: 40,
    carbs: 41,
    fat: 24,
    items: ['180g Salmon fillet', '130g Quinoa', 'Roasted asparagus', '1 tbsp Olive oil', 'Garlic & lemon'],
    icon: '🐟',
  },
];

const WEEKLY_SUMMARY = [
  { day: 'Mon', calories: 2310, protein: 168 },
  { day: 'Tue', calories: 2480, protein: 172 },
  { day: 'Wed', calories: 2190, protein: 155 },
  { day: 'Thu', calories: 2560, protein: 181 },
  { day: 'Fri', calories: 2340, protein: 170 },
  { day: 'Sat', calories: 2620, protein: 178 },
  { day: 'Sun', calories: 1840, protein: 148 },
];

const MAX_WEEK_CAL = Math.max(...WEEKLY_SUMMARY.map(d => d.calories));

export default function NutritionTracker() {
  const [meals, setMeals] = useState(INITIAL_MEALS);

  useEffect(() => {
    document.title = 'Nutrition | FitFlOOW';
    return () => {
      document.title = 'Saiyan Gym';
    };
  }, []);
  const [waterCups, setWaterCups] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [newMeal, setNewMeal] = useState({
    name: '',
    type: 'Snack',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const totalCals = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name) return;
    const meal = {
      id: `meal-${Date.now()}`,
      name: newMeal.name,
      type: newMeal.type,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      calories: Number(newMeal.calories) || 0,
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      items: [],
      icon: '🍽️',
    };
    setMeals(prev => [...prev, meal]);
    setNewMeal({ name: '', type: 'Snack', calories: '', protein: '', carbs: '', fat: '' });
    setShowAddForm(false);
  };

  const avgCalories = Math.round(WEEKLY_SUMMARY.reduce((s, d) => s + d.calories, 0) / WEEKLY_SUMMARY.length);
  const avgProtein = Math.round(WEEKLY_SUMMARY.reduce((s, d) => s + d.protein, 0) / WEEKLY_SUMMARY.length);

  return (
    <PortalLayout>
      <div className="nutrition-page">
        {/* Header */}
        <div className="portal-page-header">
          <div className="nutrition-header-row">
            <div>
              <h1 className="portal-page-title">
                Fuel <span className="portal-highlight">Protocol</span>
              </h1>
              <p className="portal-page-subtitle">Precision nutrition tracking — fuel the ascension</p>
            </div>
            <button
              id="nutrition-add-meal-btn"
              className="portal-btn-primary"
              onClick={() => setShowAddForm(s => !s)}
              aria-expanded={showAddForm}
              aria-controls="nutrition-add-form"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 16, height: 16 }}>
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Meal
            </button>
          </div>
        </div>

        {/* ── Add Meal Form ────────────────────────────────────────────── */}
        {showAddForm && (
          <form
            id="nutrition-add-form"
            className="nutrition-add-form"
            onSubmit={handleAddMeal}
            aria-label="Add new meal"
          >
            <div className="nutrition-form-header">
              <h3 className="nutrition-form-title">Log New Meal</h3>
              <button
                type="button"
                id="nutrition-close-form-btn"
                className="nutrition-form-close"
                onClick={() => setShowAddForm(false)}
                aria-label="Close add meal form"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="nutrition-form-grid">
              <div className="nutrition-form-group nutrition-form-group--wide">
                <label htmlFor="nutrition-input-name" className="nutrition-form-label">Meal Name</label>
                <input
                  id="nutrition-input-name"
                  type="text"
                  className="nutrition-form-input"
                  placeholder="e.g. Post-Workout Shake"
                  value={newMeal.name}
                  onChange={e => setNewMeal(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="nutrition-form-group">
                <label htmlFor="nutrition-input-type" className="nutrition-form-label">Meal Type</label>
                <select
                  id="nutrition-input-type"
                  className="nutrition-form-input"
                  value={newMeal.type}
                  onChange={e => setNewMeal(p => ({ ...p, type: e.target.value }))}
                >
                  {['Breakfast', 'Lunch', 'Dinner', 'Pre-Workout', 'Post-Workout', 'Snack'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="nutrition-form-group">
                <label htmlFor="nutrition-input-calories" className="nutrition-form-label">Calories (kcal)</label>
                <input
                  id="nutrition-input-calories"
                  type="number"
                  className="nutrition-form-input"
                  placeholder="0"
                  min="0"
                  value={newMeal.calories}
                  onChange={e => setNewMeal(p => ({ ...p, calories: e.target.value }))}
                />
              </div>
              <div className="nutrition-form-group">
                <label htmlFor="nutrition-input-protein" className="nutrition-form-label">Protein (g)</label>
                <input
                  id="nutrition-input-protein"
                  type="number"
                  className="nutrition-form-input"
                  placeholder="0"
                  min="0"
                  value={newMeal.protein}
                  onChange={e => setNewMeal(p => ({ ...p, protein: e.target.value }))}
                />
              </div>
              <div className="nutrition-form-group">
                <label htmlFor="nutrition-input-carbs" className="nutrition-form-label">Carbs (g)</label>
                <input
                  id="nutrition-input-carbs"
                  type="number"
                  className="nutrition-form-input"
                  placeholder="0"
                  min="0"
                  value={newMeal.carbs}
                  onChange={e => setNewMeal(p => ({ ...p, carbs: e.target.value }))}
                />
              </div>
              <div className="nutrition-form-group">
                <label htmlFor="nutrition-input-fat" className="nutrition-form-label">Fat (g)</label>
                <input
                  id="nutrition-input-fat"
                  type="number"
                  className="nutrition-form-input"
                  placeholder="0"
                  min="0"
                  value={newMeal.fat}
                  onChange={e => setNewMeal(p => ({ ...p, fat: e.target.value }))}
                />
              </div>
            </div>
            <div className="nutrition-form-actions">
              <button
                type="button"
                id="nutrition-cancel-form-btn"
                className="portal-btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="nutrition-submit-meal-btn"
                className="portal-btn-primary"
              >
                Log Meal
              </button>
            </div>
          </form>
        )}

        {/* ── Macro Rings ─────────────────────────────────────────────── */}
        <section className="nutrition-rings-section" aria-label="Today's macronutrient overview">
          <div className="nutrition-rings-card">
            <div className="nutrition-rings-left">
              <h2 className="nutrition-rings-heading">Today's Macros</h2>
              <p className="nutrition-rings-date">Monday, June 30</p>
              <div className="nutrition-calorie-display">
                <span className="nutrition-cal-value">{totalCals}</span>
                <span className="nutrition-cal-sep">/</span>
                <span className="nutrition-cal-target">2,400</span>
                <span className="nutrition-cal-unit">kcal</span>
              </div>
              <div className="nutrition-cal-bar-track">
                <div
                  className="nutrition-cal-bar-fill"
                  style={{ width: `${Math.min((totalCals / 2400) * 100, 100)}%` }}
                />
              </div>
              <p className="nutrition-cal-remain">
                <strong>{Math.max(2400 - totalCals, 0)} kcal</strong> remaining
              </p>
            </div>
            <div className="nutrition-rings-row" role="list" aria-label="Macro rings">
              <div role="listitem">
                <MacroRing label="Calories" current={totalCals} total={2400} unit="kcal" color="#ff5500" size={120} stroke={11} />
              </div>
              <div role="listitem">
                <MacroRing label="Protein" current={totalProtein} total={180} unit="g" color="#ffaa00" size={100} stroke={9} />
              </div>
              <div role="listitem">
                <MacroRing label="Carbs" current={totalCarbs} total={260} unit="g" color="#00ccff" size={100} stroke={9} />
              </div>
              <div role="listitem">
                <MacroRing label="Fat" current={totalFat} total={70} unit="g" color="#aa55ff" size={100} stroke={9} />
              </div>
            </div>
          </div>
        </section>

        <div className="portal-divider" />

        {/* ── Water Tracker ────────────────────────────────────────────── */}
        <section className="nutrition-water-section" aria-label="Water intake tracker">
          <div className="nutrition-water-card">
            <div className="nutrition-water-info">
              <div className="nutrition-water-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <div>
                <h2 className="nutrition-water-heading">Hydration</h2>
                <p className="nutrition-water-sub">{waterCups} of 8 cups today</p>
              </div>
              <div className="nutrition-water-stat">
                <span className="nutrition-water-ml">{waterCups * 250} ml</span>
                <span className="nutrition-water-target">/ 2,000 ml</span>
              </div>
            </div>
            <div className="nutrition-cups-row" role="group" aria-label="Toggle water cups">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  id={`nutrition-cup-${i + 1}`}
                  className={`nutrition-cup ${i < waterCups ? 'nutrition-cup--filled' : ''}`}
                  onClick={() => setWaterCups(i < waterCups ? i : i + 1)}
                  aria-label={`${i < waterCups ? 'Remove' : 'Add'} cup ${i + 1}`}
                  aria-pressed={i < waterCups}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 8h14l-1 9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8z" />
                    <path d="M3 8h18" />
                    {i < waterCups && <path d="M10 12a2 2 0 0 0 4 0" fill="currentColor" opacity="0.5" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="portal-divider" />

        {/* ── Meal Log ─────────────────────────────────────────────────── */}
        <section aria-label="Today's meal log">
          <div className="nutrition-meals-header">
            <h2 className="portal-section-title">Today's Meal Log</h2>
            <div className="nutrition-meal-totals">
              <span className="nutrition-total-chip nutrition-total-chip--cal">{totalCals} kcal</span>
              <span className="nutrition-total-chip nutrition-total-chip--pro">{totalProtein}g protein</span>
            </div>
          </div>
          <div className="nutrition-meals-list">
            {meals.map((meal) => {
              const isExpanded = expandedMeal === meal.id;
              return (
                <article key={meal.id} className="nutrition-meal-card" aria-label={`${meal.name} meal`}>
                  <button
                    id={`nutrition-meal-expand-${meal.id}`}
                    className="nutrition-meal-header"
                    onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`nutrition-meal-body-${meal.id}`}
                  >
                    <span className="nutrition-meal-icon" aria-hidden="true">{meal.icon}</span>
                    <div className="nutrition-meal-title-group">
                      <span className="nutrition-meal-name">{meal.name}</span>
                      <span className="nutrition-meal-meta">{meal.type} &middot; {meal.time}</span>
                    </div>
                    <div className="nutrition-meal-macros">
                      <span className="nutrition-macro-pill nutrition-macro-pill--cal">{meal.calories} kcal</span>
                      <span className="nutrition-macro-pill nutrition-macro-pill--pro">{meal.protein}g P</span>
                      <span className="nutrition-macro-pill nutrition-macro-pill--carb">{meal.carbs}g C</span>
                      <span className="nutrition-macro-pill nutrition-macro-pill--fat">{meal.fat}g F</span>
                    </div>
                    <svg
                      className={`nutrition-chevron ${isExpanded ? 'nutrition-chevron--open' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isExpanded && meal.items.length > 0 && (
                    <div id={`nutrition-meal-body-${meal.id}`} className="nutrition-meal-body">
                      <h4 className="nutrition-items-heading">Ingredients</h4>
                      <ul className="nutrition-items-list">
                        {meal.items.map((item, idx) => (
                          <li key={idx} className="nutrition-item">
                            <span className="nutrition-item-dot" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="nutrition-macro-bars">
                        {[
                          { label: 'Protein', val: meal.protein, max: 60, color: '#ffaa00' },
                          { label: 'Carbs', val: meal.carbs, max: 90, color: '#00ccff' },
                          { label: 'Fat', val: meal.fat, max: 30, color: '#aa55ff' },
                        ].map(bar => (
                          <div key={bar.label} className="nutrition-macro-bar-row">
                            <span className="nutrition-macro-bar-label">{bar.label}</span>
                            <div className="nutrition-macro-bar-track">
                              <div
                                className="nutrition-macro-bar-fill"
                                style={{
                                  width: `${Math.min((bar.val / bar.max) * 100, 100)}%`,
                                  background: bar.color,
                                  boxShadow: `0 0 8px ${bar.color}66`,
                                }}
                              />
                            </div>
                            <span className="nutrition-macro-bar-val">{bar.val}g</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <div className="portal-divider" />

        {/* ── Weekly Nutrition Summary ─────────────────────────────────── */}
        <section aria-label="Weekly nutrition summary">
          <h2 className="portal-section-title">Weekly Nutrition Summary</h2>
          <div className="nutrition-weekly-grid">
            {/* Summary stats */}
            <div className="nutrition-weekly-stats">
              <div className="nutrition-weekly-stat-card">
                <div className="portal-card-label">Avg. Daily Calories</div>
                <div className="portal-card-value">{avgCalories.toLocaleString()}</div>
                <p className="portal-card-meta">kcal · Target: 2,400</p>
                <span className="portal-badge portal-badge--success">On Track</span>
              </div>
              <div className="nutrition-weekly-stat-card">
                <div className="portal-card-label">Avg. Daily Protein</div>
                <div className="portal-card-value">{avgProtein}g</div>
                <p className="portal-card-meta">Target: 180g/day</p>
                <div className="nutrition-consistency-bar-track">
                  <div className="nutrition-consistency-bar-fill" style={{ width: `${(avgProtein / 180) * 100}%` }} />
                </div>
              </div>
              <div className="nutrition-weekly-stat-card">
                <div className="portal-card-label">Protein Consistency</div>
                <div className="portal-card-value">6<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--portal-text-muted)' }}>/7</span></div>
                <p className="portal-card-meta">days hitting target</p>
                <span className="portal-badge portal-badge--warning">Near Perfect</span>
              </div>
            </div>
            {/* Weekly bars */}
            <div className="nutrition-weekly-chart" aria-label="Weekly calorie chart">
              <div className="nutrition-week-bars">
                {WEEKLY_SUMMARY.map((d, i) => {
                  const heightPct = (d.calories / MAX_WEEK_CAL) * 100;
                  const isToday = i === 6;
                  return (
                    <div key={d.day} className="nutrition-week-col">
                      <div className="nutrition-week-bar-wrap">
                        <div
                          className={`nutrition-week-bar ${isToday ? 'nutrition-week-bar--today' : ''}`}
                          style={{ height: `${heightPct}%` }}
                          title={`${d.day}: ${d.calories} kcal, ${d.protein}g protein`}
                        />
                      </div>
                      <span className="nutrition-week-day">{d.day}</span>
                      <span className="nutrition-week-cal">{(d.calories / 1000).toFixed(1)}k</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
}
