import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const BackgroundCanvas = lazy(() => import('./BackgroundCanvas'));

export default function Hero() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bgRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScrollSpy = () => {
      const sections = ['home', 'chambers', 'philosophy', 'gallery', 'cta'];
      const centerline = window.innerHeight * 0.45;
      let currentSection = 'home';
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= centerline && rect.bottom >= centerline) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentSection);

      // Navbar glass effect
      setScrolled(window.scrollY > 40);

      // Hero parallax
      if (bgRef.current) {
        const parallax = window.scrollY * 0.3;
        bgRef.current.style.transform = `scale(1.08) translateY(${parallax}px)`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScrollSpy);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (window.lenis) {
      window.lenis.scrollTo(`#${sectionId}`, { offset: -80 });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section" style={{ height: '100dvh' }}>
      {/* 1. Base Background Image with parallax ref */}
      <div 
        ref={bgRef}
        className="hero-base-bg hero-zoom" 
        style={{ backgroundImage: `url('/hero-goku-hd.webp?v=4')` }}
      />

      {/* 2. Floating Amber Particles (z-index: 40) */}
      <Suspense fallback={null}>
        <BackgroundCanvas />
      </Suspense>

      {/* 3. Top Fixed Navigation overlay (z-index: 100) */}
      <nav className={`fixed-navbar ${scrolled ? 'fixed-navbar--scrolled' : ''}`} aria-label="Main navigation">
        {/* Left: Logo & Slogan */}
        <div className="nav-logo-group" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('home')} role="button" aria-label="Scroll to top">
          <svg className="nav-logo-svg" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="nav-wordmark font-playfair italic">Saiyan Gym</span>
        </div>

        {/* Center: Navigation Pill (desktop) */}
        <div className="nav-center-pill" aria-label="Site sections">
          {[['home','Home'],['chambers','Facilities'],['philosophy','Methodology'],['gallery','Programs'],['cta','Join Now']].map(([id, label]) => (
            <button 
              key={id}
              className={`nav-pill-btn ${activeSection === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
              aria-label={`Go to ${label} section`}
              aria-current={activeSection === id ? 'true' : undefined}
              id={`nav-btn-${id}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: Signup Portal + hamburger */}
        <div className="nav-right-btn-group">
          <Link to="/login" className="nav-signup-btn" style={{ textDecoration: 'none' }} aria-label="Go to member portal login">
            Member Portal
          </Link>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          id="nav-hamburger-btn"
        >
          <span className={`nav-hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`nav-hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`nav-hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="nav-mobile-overlay" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      )}
      <div className={`nav-mobile-drawer ${mobileMenuOpen ? 'nav-mobile-drawer--open' : ''}`} aria-label="Mobile navigation menu">
        <div className="nav-mobile-links">
          {[['home','Home'],['chambers','Facilities'],['philosophy','Methodology'],['gallery','Programs'],['cta','Join Now']].map(([id, label]) => (
            <button
              key={id}
              className={`nav-mobile-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
              id={`nav-mobile-btn-${id}`}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
          <Link to="/login" className="nav-mobile-portal-btn" onClick={() => setMobileMenuOpen(false)} id="nav-mobile-portal-btn">
            Member Portal
          </Link>
        </div>
      </div>

      {/* 4. Center Heading (z-index: 50) */}
      <div className="hero-heading-container">
        <h1 className="hero-heading">
          <span 
            className="hero-heading-line-1 font-playfair italic hero-anim hero-reveal"
            style={{ animationDelay: '0.25s', letterSpacing: '-0.05em' }}
          >
            Awaken your
          </span>
          <span 
            className="hero-heading-line-2 hero-anim hero-reveal"
            style={{ animationDelay: '0.42s', letterSpacing: '-0.08em', marginTop: '-4px' }}
          >
            Limitless Power
          </span>
        </h1>
      </div>

      {/* 5. Bottom-Left Paragraph (z-index: 50) */}
      <div 
        className="hero-paragraph-left hero-anim hero-fade"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="hero-desc-left">
          Every session at Saiyan Gym is designed to break your boundaries. From high-performance strength training to elite athletic conditioning, we rebuild your physical limits.
        </p>
      </div>

      {/* 6. Bottom-Right Block with CTA (z-index: 50) */}
      <div 
        className="hero-paragraph-right hero-anim hero-fade"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="hero-desc-right">
          Our world-class equipment and custom biomechanical tracking let you unlock your body's true potential. Stop training for maintenance—start training for ascension.
        </p>
        <button className="hero-cta-btn">
          Start Ascending
        </button>
      </div>
    </section>
  );
}
