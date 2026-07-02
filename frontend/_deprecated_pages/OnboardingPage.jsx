import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // Re-use the premium login design system

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: '25',
    height: '180',
    weight: '75',
    goal: 'Build Muscle',
    experience: 'Beginner',
    tier: 'Warrior Elite'
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Finalize onboarding
      updateUser({
        height: Number(formData.height),
        weight: Number(formData.weight),
        targetWeight: formData.goal === 'Lose Fat' ? Number(formData.weight) - 5 : Number(formData.weight) + 5,
        fitnessGoal: formData.goal,
        experienceLevel: formData.experience,
        tier: formData.tier,
      });
      navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <div className="login-bg-img" style={{ backgroundImage: `url('/login-bg-goku.png')` }} />
        <div className="login-bg-gradient" />
      </div>

      <div className="login-embers" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="ember" style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 5 + 5}s`
          }} />
        ))}
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <div className="login-card-border" />
          
          <div className="login-header">
            <span className="login-subtitle">STEP {step} OF 3</span>
            <h2 className="login-title">ASCENSION INITIALIZATION</h2>
            <div className="onboarding-bar-bg" style={{ width: '100%', height: '3px', background: 'rgba(255, 85, 0, 0.1)', marginTop: '0.5rem', borderRadius: '2px', overflow: 'hidden' }}>
              <div className="onboarding-bar-fill" style={{ width: `${(step / 3) * 100}%`, height: '100%', background: 'var(--accent-orange)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div className="login-form">
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label>Biological Gender</label>
                  <select 
                    style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(18, 9, 6, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none' }}
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Age (years)</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Height (cm)</label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => handleChange('height', e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Current Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label>Primary Fitness Target</label>
                  <select 
                    style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(18, 9, 6, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none' }}
                    value={formData.goal}
                    onChange={(e) => handleChange('goal', e.target.value)}
                  >
                    <option value="Build Muscle">Build Muscle (Hypertrophy)</option>
                    <option value="Lose Fat">Lose Fat (Conditioning)</option>
                    <option value="Improve Endurance">Improve Endurance</option>
                    <option value="General Fitness">General Fitness</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Training Experience Level</label>
                  <select 
                    style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(18, 9, 6, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none' }}
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                  >
                    <option value="Beginner">Beginner (1st Phase)</option>
                    <option value="Intermediate">Intermediate (Consistent)</option>
                    <option value="Advanced">Advanced (Elite Level)</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Access Level Plan</label>
                
                {[
                  { id: 'Warrior', name: 'WARRIOR PLAN', desc: 'Basic session logs & charts', price: '$29/mo' },
                  { id: 'Warrior Elite', name: 'WARRIOR ELITE', desc: 'Full tools, calculators, CNS metrics', price: '$49/mo', popular: true },
                  { id: 'Legendary', name: 'LEGENDARY PLAN', desc: 'Unlimited classes & custom coach review', price: '$99/mo' }
                ].map((plan) => (
                  <div 
                    key={plan.id}
                    onClick={() => handleChange('tier', plan.id)}
                    style={{
                      border: formData.tier === plan.id ? '2px solid var(--accent-orange)' : '1px solid rgba(255, 85, 0, 0.15)',
                      background: formData.tier === plan.id ? 'rgba(255, 85, 0, 0.05)' : 'rgba(18, 9, 6, 0.4)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>{plan.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{plan.desc}</p>
                    </div>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.95rem' }}>{plan.price}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={handlePrev}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.5rem',
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em'
                  }}
                >
                  PREVIOUS
                </button>
              )}
              <button 
                type="button" 
                onClick={handleNext}
                style={{
                  flex: 2,
                  padding: '0.85rem 1.5rem',
                  background: 'var(--accent-orange)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  boxShadow: '0 0 15px rgba(255, 85, 0, 0.4)'
                }}
              >
                {step === 3 ? 'FINALIZE' : 'CONTINUE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
