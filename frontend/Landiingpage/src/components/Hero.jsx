import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Hero.css';

export default function Hero() {
  const containerRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightImageRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    // Entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });

    tl.fromTo(navRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo(leftContentRef.current.children, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.15 }, 
        '-=0.4'
      )
      .fromTo(rightImageRef.current, 
        { scale: 1.1, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.5 }, 
        '-=0.8'
      );
  }, []);

  return (
    <div className="hero-split-container" ref={containerRef}>
      {/* Top Navbar */}
      <header className="navbar-template" ref={navRef}>
        <div className="logo-section">
          {/* Hexagonal logo icon */}
          <div className="logo-hex">
            <span className="hex-inner"></span>
          </div>
          <div className="logo-text-group">
            <span className="logo-main">SAIYAN GYM</span>
            <span className="logo-sub">YOUR BUSINESS SLOGAN HERE</span>
          </div>
        </div>
        <nav className="nav-menu">
          <a href="#home" className="active">Home</a>
          <a href="#menu">Menu</a>
          <a href="#info">Info</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="split-layout">
        {/* Left Content Column */}
        <div className="left-column">
          <div className="content-wrapper" ref={leftContentRef}>
            <h1 className="main-heading">
              <span className="line-white">BE STRONG BUILD</span>
              <span className="line-red">YOUR DREAM BODY</span>
            </h1>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam 
              nonummy nibh euismod tincidunt ut laoreet dolore magna ali. Train 
              like a legend and ascend past your base limits.
            </p>
            <button className="learn-more-btn">
              Learn More
            </button>
          </div>

          {/* Decorative Dot Grid */}
          <div className="decoration-dots">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className="dot"></span>
            ))}
          </div>

          {/* Decorative Striped Semi-circle (bottom center of left side) */}
          <div className="decoration-lines">
            <div className="lines-inner"></div>
          </div>
        </div>

        {/* Right Image Column with Goku */}
        <div className="right-column" ref={rightImageRef}>
          <div className="image-viewport">
            <img 
              src="/hero-goku-hd.png" 
              alt="Goku Training Grounds" 
              className="split-hero-image"
            />
          </div>

          {/* Social Media Column (far right) */}
          <div className="social-column">
            <a href="#facebook" className="social-link-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#twitter" className="social-link-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#linkedin" className="social-link-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#instagram" className="social-link-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
