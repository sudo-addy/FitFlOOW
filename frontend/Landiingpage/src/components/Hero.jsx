import React from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section" style={{ height: '100dvh' }}>
      {/* 1. Base Background Image (z-index: 10) */}
      <div 
        className="hero-base-bg hero-zoom" 
        style={{ backgroundImage: `url('/hero-goku-hd.png?v=4')` }}
      />

      {/* 2. Floating Amber Particles (z-index: 40) */}
      <BackgroundCanvas />

      {/* 3. Top Fixed Navigation overlay (z-index: 100) */}
      <nav className="fixed-navbar">
        {/* Left: Logo & Slogan */}
        <div className="nav-logo-group">
          <svg className="nav-logo-svg" viewBox="0 0 256 256" fill="#ffffff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="nav-wordmark font-playfair italic">Saiyan Gym</span>
        </div>

        {/* Center: Navigation Pill */}
        <div className="nav-center-pill">
          <button className="nav-pill-btn active">Home</button>
          <button className="nav-pill-btn">Facilities</button>
          <button className="nav-pill-btn">Methodology</button>
          <button className="nav-pill-btn">Programs</button>
          <button className="nav-pill-btn">Join Now</button>
        </div>

        {/* Right: Signup Portal */}
        <div className="nav-right-btn-group">
          <button className="nav-signup-btn">Member Portal</button>
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
