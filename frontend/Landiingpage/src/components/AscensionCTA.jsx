import React, { useEffect, useRef, useState } from 'react';
import './AscensionCTA.css';

export default function AscensionCTA() {
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
        threshold: 0.15,
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
      className={`cta-section ${isVisible ? 'animate-in' : ''}`} 
      ref={sectionRef}
      id="cta"
    >
      {/* Background Graphic Grid & Subtle Goku Backdrop overlay */}
      <div className="cta-bg-overlay" style={{ backgroundImage: `url('/hero-goku-hd.png?v=4')` }} />
      <div className="cta-bg-grid">
        <div className="grid-line" />
        <div className="grid-line" />
        <div className="grid-line" />
        <div className="grid-line" />
      </div>

      <div className="cta-container">
        
        {/* Subtitle label */}
        <div className="section-subtitle-wrapper cta-label-wrapper">
          <span className="section-number">04</span>
          <span className="section-subtitle-line"></span>
          <span className="section-subtitle">THE INITIATION</span>
        </div>

        {/* Epic Main Heading */}
        <h2 className="cta-heading font-playfair italic">
          READY TO AWAKEN <br />
          <span className="highlight-text font-sans">YOUR LIMITLESS POWER?</span>
        </h2>

        {/* Narrative editorial paragraph */}
        <p className="cta-description">
          Membership is strictly capped to preserve training volume, coaching quality, 
          and biometric focus. Secure your entry to the primary performance arena today 
          and surpass who you were yesterday.
        </p>

        {/* Action button triggers */}
        <div className="cta-button-group">
          <button className="cta-btn-primary">
            SECURE INITIATION
          </button>
          <button className="cta-btn-secondary">
            REQUEST GUEST ACCESS
          </button>
        </div>

      </div>
    </section>
  );
}
