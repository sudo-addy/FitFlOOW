import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import './NutritionPage.css';

export default function NutritionPage() {
  const { user, isSidebarCollapsed } = useAuth();

  // Targets and logged values
  const targets = { calories: 3200, protein: 180, carbs: 380, fat: 90 };
  const [logged, setLogged] = useState({ calories: 2240, protein: 135, carbs: 270, fat: 68 });
  
  // Hydration tracking (in ml)
  const [waterLogged, setWaterLogged] = useState(2250);
  const waterTarget = 4000;

  // Logged meals state
  const [meals, setMeals] = useState([
    {
      id: 'm1',
      name: 'Breakfast — Oatmeal & Whey',
      time: '07:30',
      calories: 620,
      protein: 42,
      carbs: 85,
      fat: 12
    },
    {
      id: 'm2',
      name: 'Lunch — Chicken Rice & Avocado',
      time: '13:00',
      calories: 840,
      protein: 55,
      carbs: 110,
      fat: 20
    },
    {
      id: 'm3',
      name: 'Pre-Workout Snack — Banana & Almonds',
      time: '17:00',
      calories: 380,
      protein: 8,
      carbs: 45,
      fat: 18
    },
    {
      id: 'm4',
      name: 'Post-Workout Shake',
      time: '19:30',
      calories: 400,
      protein: 30,
      carbs: 30,
      fat: 18
    }
  ]);

  // Food logger modal states
  const [showLogModal, setShowLogModal] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', mealType: 'Lunch', calories: '', protein: '', carbs: '', fat: '' });

  const handleAddWater = (amount) => {
    setWaterLogged((prev) => Math.min(prev + amount, waterTarget * 1.5));
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) return;

    const calorieVal = Number(newFood.calories) || 0;
    const proteinVal = Number(newFood.protein) || 0;
    const carbVal = Number(newFood.carbs) || 0;
    const fatVal = Number(newFood.fat) || 0;

    const newMeal = {
      id: 'meal-' + Date.now(),
      name: `${newFood.mealType} — ${newFood.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      calories: calorieVal,
      protein: proteinVal,
      carbs: carbVal,
      fat: fatVal
    };

    setMeals([...meals, newMeal]);
    setLogged({
      calories: logged.calories + calorieVal,
      protein: logged.protein + proteinVal,
      carbs: logged.carbs + carbVal,
      fat: logged.fat + fatVal
    });

    setNewFood({ name: '', mealType: 'Lunch', calories: '', protein: '', carbs: '', fat: '' });
    setShowLogModal(false);
  };

  const handleRemoveMeal = (mealId) => {
    const targetMeal = meals.find(m => m.id === mealId);
    if (!targetMeal) return;

    setMeals(meals.filter(m => m.id !== mealId));
    setLogged({
      calories: Math.max(0, logged.calories - targetMeal.calories),
      protein: Math.max(0, logged.protein - targetMeal.protein),
      carbs: Math.max(0, logged.carbs - targetMeal.carbs),
      fat: Math.max(0, logged.fat - targetMeal.fat)
    });
  };

  return (
    <div className={`portal-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main View Area */}
      <div className="portal-view">
        {/* Topbar Header */}
        <Topbar />

        {/* Nutrition Log Page Content */}
        <main className="nutrition-content">
          <div className="nutrition-header-row">
            <div>
              <h1 className="nutrition-title">NUTRITION PORTAL</h1>
              <p className="nutrition-subtitle">Log macro nutrients and hydration indices to fuel performance.</p>
            </div>
            <button
              type="button"
              className="add-food-btn"
              onClick={() => setShowLogModal(true)}
            >
              LOG MEAL/FOOD
            </button>
          </div>

          <div className="nutrition-layout-grid">
            {/* Left: Macros Progress Summary */}
            <div className="nutrition-left-col">
              
              {/* Calorie Ring Gauge Card */}
              <div className="nutrition-card calorie-summary-card">
                <h3 className="card-heading">CALORIC RATIO</h3>
                <div className="calorie-ring-box">
                  <div className="calorie-ring-svg-wrapper">
                    <svg viewBox="0 0 100 100" className="cal-gauge-svg">
                      <circle className="cal-gauge-track" cx="50" cy="50" r="42" />
                      <circle
                        className="cal-gauge-fill"
                        cx="50"
                        cy="50"
                        r="42"
                        style={{
                          strokeDasharray: '263.89',
                          strokeDashoffset: `${263.89 - (Math.min(logged.calories, targets.calories) / targets.calories) * 263.89}`
                        }}
                      />
                    </svg>
                    <div className="cal-gauge-inner">
                      <span className="cal-gauge-val">{logged.calories}</span>
                      <span className="cal-gauge-lbl">/ {targets.calories} kcal</span>
                    </div>
                  </div>
                  <div className="calorie-remaining-info">
                    <span>REMAINING FUEL</span>
                    <h4>{Math.max(0, targets.calories - logged.calories)} kcal</h4>
                    <p>Protein target should remain priority to avoid lean muscle tissue loss.</p>
                  </div>
                </div>
              </div>

              {/* Macros Breakdown Card */}
              <div className="nutrition-card macros-summary-card">
                <h3 className="card-heading">MACRONUTRIENTS</h3>
                <div className="macros-progress-list">
                  
                  {/* Protein */}
                  <div className="macro-progress-item">
                    <div className="macro-label-row">
                      <span className="macro-name protein">Protein</span>
                      <span className="macro-val">{logged.protein}g / {targets.protein}g</span>
                    </div>
                    <div className="macro-bar-bg">
                      <div
                        className="macro-bar-fill protein"
                        style={{ width: `${(Math.min(logged.protein, targets.protein) / targets.protein) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="macro-progress-item">
                    <div className="macro-label-row">
                      <span className="macro-name carbs">Carbohydrates</span>
                      <span className="macro-val">{logged.carbs}g / {targets.carbs}g</span>
                    </div>
                    <div className="macro-bar-bg">
                      <div
                        className="macro-bar-fill carbs"
                        style={{ width: `${(Math.min(logged.carbs, targets.carbs) / targets.carbs) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Fat */}
                  <div className="macro-progress-item">
                    <div className="macro-label-row">
                      <span className="macro-name fat">Fats</span>
                      <span className="macro-val">{logged.fat}g / {targets.fat}g</span>
                    </div>
                    <div className="macro-bar-bg">
                      <div
                        className="macro-bar-fill fat"
                        style={{ width: `${(Math.min(logged.fat, targets.fat) / targets.fat) * 100}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Hydration Tracker Card */}
              <div className="nutrition-card hydration-card">
                <h3 className="card-heading">HYDRATION TRACKER</h3>
                <div className="hydration-layout">
                  <div className="water-flask-visualization">
                    <div className="water-flask-glass">
                      <div
                        className="water-liquid-level"
                        style={{ height: `${Math.min((waterLogged / waterTarget) * 100, 100)}%` }}
                      />
                      <div className="water-flask-readout">
                        <span>{(waterLogged / 1000).toFixed(2)}L</span>
                        <span className="tiny-lbl">/ {(waterTarget / 1000).toFixed(0)}L</span>
                      </div>
                    </div>
                  </div>
                  <div className="hydration-controls">
                    <p className="dim-text">Consistent hydration supports recovery and joint lubrication.</p>
                    <div className="water-action-buttons">
                      <button type="button" className="water-btn" onClick={() => handleAddWater(250)}>
                        + 250 ml
                      </button>
                      <button type="button" className="water-btn" onClick={() => handleAddWater(500)}>
                        + 500 ml
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Logged Meals List */}
            <div className="nutrition-right-col">
              <h2 className="section-label">TODAY'S LOG</h2>
              <div className="meals-list">
                {meals.length > 0 ? (
                  meals.map((meal) => (
                    <div key={meal.id} className="meal-card-item">
                      <div className="meal-header">
                        <div>
                          <h4>{meal.name}</h4>
                          <span className="meal-time">{meal.time}</span>
                        </div>
                        <button
                          type="button"
                          className="meal-remove-btn"
                          onClick={() => handleRemoveMeal(meal.id)}
                          aria-label={`Remove ${meal.name}`}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="meal-stats-row">
                        <span className="meal-cals">{meal.calories} kcal</span>
                        <span className="meal-macro">P: {meal.protein}g</span>
                        <span className="meal-macro">C: {meal.carbs}g</span>
                        <span className="meal-macro">F: {meal.fat}g</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="meals-empty-state">
                    <p>No food or meals logged yet for today. Use the button above to log your nutrition.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FOOD LOGGER MODAL */}
      {showLogModal && (
        <div className="modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="success-summary-modal food-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ornament">🍎</div>
            <h2>LOG NUTRITION</h2>
            <p className="success-tagline">Track macros & energy index</p>

            <form onSubmit={handleAddFood}>
              <div className="food-form-fields">
                <div className="form-input-group">
                  <label htmlFor="food-name">Food/Meal Name</label>
                  <input
                    id="food-name"
                    type="text"
                    placeholder="e.g. Scrambled Eggs & Toast"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label htmlFor="food-mealtype">Meal Type</label>
                  <select
                    id="food-mealtype"
                    value={newFood.mealType}
                    onChange={(e) => setNewFood({ ...newFood, mealType: e.target.value })}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div className="form-row-macros">
                  <div className="form-input-group">
                    <label htmlFor="food-cals">Calories (kcal)</label>
                    <input
                      id="food-cals"
                      type="number"
                      placeholder="0"
                      value={newFood.calories}
                      onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-input-group">
                    <label htmlFor="food-protein">Protein (g)</label>
                    <input
                      id="food-protein"
                      type="number"
                      placeholder="0"
                      value={newFood.protein}
                      onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-macros">
                  <div className="form-input-group">
                    <label htmlFor="food-carbs">Carbs (g)</label>
                    <input
                      id="food-carbs"
                      type="number"
                      placeholder="0"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                    />
                  </div>
                  <div className="form-input-group">
                    <label htmlFor="food-fat">Fat (g)</label>
                    <input
                      id="food-fat"
                      type="number"
                      placeholder="0"
                      value={newFood.fat}
                      onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions-row" style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="modal-close-btn">
                  LOG FOOD
                </button>
                <button type="button" className="modal-cancel-btn" onClick={() => setShowLogModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
