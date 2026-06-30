import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Hero from './components/Hero'
import BrandPhilosophy from './components/BrandPhilosophy'
import AscensionChambers from './components/AscensionChambers'
import SanctumGallery from './components/SanctumGallery'
import AscensionCTA from './components/AscensionCTA'
import SanctumFooter from './components/SanctumFooter'
import './App.css'

// Lazy loaded page components
const LoginPage = lazy(() => import('./components/LoginPage'))
const SignupPage = lazy(() => import('./components/SignupPage'))
const ForgotPasswordPage = lazy(() => import('./components/ForgotPasswordPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage'))
const WorkoutLogPage = lazy(() => import('./pages/WorkoutLogPage'))
const ClassesPage = lazy(() => import('./pages/ClassesPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const NutritionPage = lazy(() => import('./pages/NutritionPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const MembershipPage = lazy(() => import('./pages/MembershipPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

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
    <Suspense fallback={
      <div className="portal-loading">
        <div className="spinner-hud" />
      </div>
    }>
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
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
