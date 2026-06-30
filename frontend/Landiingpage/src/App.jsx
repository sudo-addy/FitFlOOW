import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Hero from './components/Hero'
import BrandPhilosophy from './components/BrandPhilosophy'
import AscensionChambers from './components/AscensionChambers'
import SanctumGallery from './components/SanctumGallery'
import AscensionCTA from './components/AscensionCTA'
import SanctumFooter from './components/SanctumFooter'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import Dashboard from './pages/Dashboard'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutLogPage from './pages/WorkoutLogPage'
import ClassesPage from './pages/ClassesPage'
import ProgressPage from './pages/ProgressPage'
import './App.css'

function LandingPage() {
  return (
    <main className="app-container">
      {/* Step 2 — Hero Section */}
      <Hero />
      {/* Step 8 — Ascension Chambers Section (Facilities) */}
      <AscensionChambers />
      {/* Step 3 — Brand Philosophy Section (Methodology) */}
      <BrandPhilosophy />
      {/* Step 10 — Sanctum Gallery Section */}
      <SanctumGallery />
      {/* Step 11 — Ascension CTA Section */}
      <AscensionCTA />
      {/* Step 12 — Sanctum Footer Section */}
      <SanctumFooter />
    </main>
  )
}

function App() {
  const location = useLocation();

  useEffect(() => {
    // Only initialise Lenis smooth scroll on the landing page
    if (location.pathname !== '/') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      infinite: false,
    });
    window.lenis = lenis;

    // Animate loop to request animation frame steps
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/workouts" element={<WorkoutsPage />} />
      <Route path="/workouts/log" element={<WorkoutLogPage />} />
      <Route path="/classes" element={<ClassesPage />} />
      <Route path="/progress" element={<ProgressPage />} />
    </Routes>
  )
}

export default App


