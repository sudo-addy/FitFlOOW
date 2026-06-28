import React, { useEffect, useRef, useState } from 'react';
import './AscensionChambers.css';

export default function AscensionChambers() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section 
      className={`chambers-section ${isVisible ? 'animate-in' : ''}`} 
      ref={sectionRef}
      id="chambers"
    >
      <div className="chambers-container">
        
        {/* Left Side: Layout Intro & Facility Graphic */}
        <div className="chambers-intro-col">
          <div className="section-subtitle-wrapper">
            <span className="section-number">02</span>
            <span className="section-subtitle-line"></span>
            <span className="section-subtitle">THE LABS</span>
          </div>

          <h2 className="chambers-heading">
            ELITE ASCENSION <br />
            <span className="highlight-text">CHAMBERS</span>
          </h2>

          <p className="chambers-intro-desc">
            To reach legendary physical output, you need specialized conditions. 
            Our chambers combine biomechanical engineering with customized recovery systems 
            to ensure every session acts as a catalyst for permanent physical transformation.
          </p>

          {/* Interactive Gym Graphic Container */}
          <div className="facility-image-card">
            <div className="facility-image-overlay" />
            <img 
              src="/hero-gym.png" 
              alt="Saiyan Gym Elite Facility" 
              className="facility-image"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Side: Stack of Premium Chamber Cards */}
        <div className="chambers-grid-col">
          
          <div className="chamber-card">
            <div className="chamber-header">
              <span className="chamber-num font-playfair italic">01</span>
              <h3 className="chamber-title">HYPERBOLIC STRENGTH SPACE</h3>
            </div>
            <p className="chamber-desc">
              Our core biomechanical arena. Built with variable load-distribution machinery 
              and custom micro-metric adjustment platforms that isolate muscles and force adaptive development.
            </p>
            <div className="chamber-line" />
          </div>

          <div className="chamber-card">
            <div className="chamber-header">
              <span className="chamber-num font-playfair italic">02</span>
              <h3 className="chamber-title">CELLULAR BIOMETRIC ANALYZERS</h3>
            </div>
            <p className="chamber-desc">
              Real-time pulmonary kinetics, cellular fatigue tracking, and localized oxygen metrics. 
              We leave nothing to guesswork; your training is adjusted instant-by-instant.
            </p>
            <div className="chamber-line" />
          </div>

          <div className="chamber-card">
            <div className="chamber-header">
              <span className="chamber-num font-playfair italic">03</span>
              <h3 className="chamber-title">INFRARED RECOVERY PODS</h3>
            </div>
            <p className="chamber-desc">
              Zen restoration systems. Combining hyperbaric oxygen chambers with near-infrared light 
              arrays and medical-grade cold plunge cycles to eliminate inflammation and accelerate recovery.
            </p>
            <div className="chamber-line" />
          </div>

          <div className="chamber-card">
            <div className="chamber-header">
              <span className="chamber-num font-playfair italic">04</span>
              <h3 className="chamber-title">MASTER METHODOLOGY COACHING</h3>
            </div>
            <p className="chamber-desc">
              Custom programming guided by movement scientists. We design technical protocols 
              focused on skeletal alignment, force multipliers, and physical ascension.
            </p>
            <div className="chamber-line" />
          </div>

        </div>

      </div>
    </section>
  );
}
