import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import './App.css'

// ---- Eagerly loaded (landing page is the entry point) ----
import Hero from './components/Hero'
import BrandPhilosophy from './components/BrandPhilosophy'
import AscensionChambers from './components/AscensionChambers'
import SanctumGallery from './components/SanctumGallery'
import AscensionCTA from './components/AscensionCTA'
import SanctumFooter from './components/SanctumFooter'

// ---- Lazy loaded (portal + auth pages — not needed on first paint) ----
const LoginPage       = lazy(() => import('./components/LoginPage'))
const SignUpPage      = lazy(() => import('./components/SignUpPage'))
const NotFound        = lazy(() => import('./components/NotFound'))

// Portal pages
const Dashboard       = lazy(() => import('./components/portal/Dashboard'))
const WorkoutsHistory = lazy(() => import('./components/portal/WorkoutsHistory'))
const WorkoutLogger   = lazy(() => import('./components/portal/WorkoutLogger'))
const ClassesBooking  = lazy(() => import('./components/portal/ClassesBooking'))
const ProgressAnalytics = lazy(() => import('./components/portal/ProgressAnalytics'))
const NutritionTracker = lazy(() => import('./components/portal/NutritionTracker'))
const Achievements    = lazy(() => import('./components/portal/Achievements'))
const ProfileSettings = lazy(() => import('./components/portal/ProfileSettings'))
const MembershipBilling = lazy(() => import('./components/portal/MembershipBilling'))

// ---- Suspense fallback ----
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      background: '#070302',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <svg width="32" height="32" viewBox="0 0 256 256" fill="#ff7700" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.1em', fontFamily: 'Outfit, sans-serif' }}>
        LOADING
      </span>
    </div>
  )
}

// ---- Landing page layout ----
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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ---- Public ---- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* ---- Portal ---- */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<WorkoutsHistory />} />
        <Route path="/workouts/log" element={<WorkoutLogger />} />
        <Route path="/classes" element={<ClassesBooking />} />
        <Route path="/progress" element={<ProgressAnalytics />} />
        <Route path="/nutrition" element={<NutritionTracker />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/membership" element={<MembershipBilling />} />

        {/* ---- 404 catch-all ---- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
