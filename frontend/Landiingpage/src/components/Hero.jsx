import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import './Hero.css';

export default function Hero() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const handleScrollSpy = () => {
      const sections = ['home', 'chambers', 'philosophy', 'gallery', 'cta'];
      const centerline = window.innerHeight * 0.45; // 45% from the top of the viewport
      let currentSection = 'home';
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section spans across the centerline of the viewport
          if (rect.top <= centerline && rect.bottom >= centerline) {
            currentSection = sectionId;
            break; // Active section found, exit loop
          }
        }
      }
      setActiveSection(currentSection);
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
    if (window.lenis) {
      // Scroll with a -80px offset to account for the fixed glass navbar
      window.lenis.scrollTo(`#${sectionId}`, { offset: -80 });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section" style={{ height: '100dvh' }}>
      {/* 1. Base Background Image (z-index: 10) */}
      <div 
        className="hero-base-bg hero-zoom" 
        style={{ backgroundImage: `url('/hero-goku-hd.webp?v=4')` }}
      />

      {/* 2. Floating Amber Particles (z-index: 40) */}
      <BackgroundCanvas />

      {/* 3. Top Fixed Navigation overlay (z-index: 100) */}
      <nav className="fixed-navbar">
        {/* Left: Logo & Slogan */}
        <div className="nav-logo-group" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('home')}>
          <svg className="nav-logo-svg" viewBox="0 0 256 256" fill="#ffffff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="nav-wordmark font-playfair italic">Saiyan Gym</span>
        </div>

        {/* Center: Navigation Pill */}
        <div className="nav-center-pill">
          <button 
            className={`nav-pill-btn ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`nav-pill-btn ${activeSection === 'chambers' ? 'active' : ''}`}
            onClick={() => handleNavClick('chambers')}
          >
            Facilities
          </button>
          <button 
            className={`nav-pill-btn ${activeSection === 'philosophy' ? 'active' : ''}`}
            onClick={() => handleNavClick('philosophy')}
          >
            Methodology
          </button>
          <button 
            className={`nav-pill-btn ${activeSection === 'gallery' ? 'active' : ''}`}
            onClick={() => handleNavClick('gallery')}
          >
            Programs
          </button>
          <button 
            className={`nav-pill-btn ${activeSection === 'cta' ? 'active' : ''}`}
            onClick={() => handleNavClick('cta')}
          >
            Join Now
          </button>
        </div>

        {/* Right: Signup Portal */}
        <div className="nav-right-btn-group">
          <button className="nav-signup-btn" onClick={() => handleNavClick('cta')}>
            Member Portal
          </button>
        </div>
      </nav>

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
