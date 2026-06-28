import React, { useEffect, useRef, useState } from 'react';
import './SanctumGallery.css';

export default function SanctumGallery() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
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
        threshold: 0.1,
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

  // Handle horizontal mouse drag scrolling for desktop
  const handleMouseDown = (e) => {
    const slider = scrollContainerRef.current;
    if (!slider) return;
    slider.classList.add('active');
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    const slider = scrollContainerRef.current;
    if (!slider) return;
    slider.classList.remove('active');
  };

  const handleMouseUp = () => {
    const slider = scrollContainerRef.current;
    if (!slider) return;
    slider.classList.remove('active');
  };

  const handleMouseMove = (e) => {
    const slider = scrollContainerRef.current;
    if (!slider || !slider.classList.contains('active')) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 1.5; // Scroll speed multiplier
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  return (
    <section 
      className={`gallery-section ${isVisible ? 'animate-in' : ''}`} 
      ref={sectionRef}
      id="gallery"
    >
      <div className="gallery-container">
        
        {/* Header Block */}
        <div className="gallery-header">
          <div className="section-subtitle-wrapper">
            <span className="section-number">03</span>
            <span className="section-subtitle-line"></span>
            <span className="section-subtitle">THE SANCTUM</span>
          </div>
          <h2 className="gallery-title">
            THE PERFORMANCE <span className="highlight-text">SANCTUM</span>
          </h2>
          <p className="gallery-desc">
            Explore our state-of-the-art training spaces. Every square foot is engineered 
            to optimize athletic conditioning, output precision, and physical ascension.
          </p>
        </div>

        {/* Horizontal Scrollable Carousel Grid */}
        <div 
          className="gallery-carousel"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          
          <div className="gallery-card">
            <div className="gallery-image-wrapper">
              <div className="gallery-image-zoom-overlay" />
              <img 
                src="/gym-weight-room.png" 
                alt="Hyperbolic Power Temple" 
                className="gallery-image"
                draggable="false"
                loading="lazy"
              />
              <div className="gallery-tag">01 / STRENGTH</div>
            </div>
            <div className="gallery-card-content">
              <h3 className="gallery-card-title">THE HYPERBOLIC RACKS</h3>
              <p className="gallery-card-desc">
                Engineered for maximum raw power. Featuring heavy-duty squat cages, custom load-distribution bars, 
                and competition plates calibrated to exact tolerances.
              </p>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-image-wrapper">
              <div className="gallery-image-zoom-overlay" />
              <img 
                src="/gym-recovery-spa.png" 
                alt="Zen Recovery Vault" 
                className="gallery-image"
                draggable="false"
                loading="lazy"
              />
              <div className="gallery-tag">02 / RECOVERY</div>
            </div>
            <div className="gallery-card-content">
              <h3 className="gallery-card-title">THE ZEN RESTORATION VAULT</h3>
              <p className="gallery-card-desc">
                High-performance recovery. Infrared light therapy arrays, cold plunge tubs, and dry steam chambers 
                designed to combat inflammation and compress cellular recovery time.
              </p>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-image-wrapper">
              <div className="gallery-image-zoom-overlay" />
              <img 
                src="/hero-gym.png" 
                alt="Ki Bio-Arena conditioning floor" 
                className="gallery-image"
                draggable="false"
                loading="lazy"
              />
              <div className="gallery-tag">03 / AGILITY</div>
            </div>
            <div className="gallery-card-content">
              <h3 className="gallery-card-title">THE METRIC BIO-ARENA</h3>
              <p className="gallery-card-desc">
                Our athletic conditioning and speed track. Outfitted with high-traction sprint turf, 
                sled tracks, and integrated high-speed cameras for precise biomechanical analysis.
              </p>
            </div>
          </div>

        </div>

        {/* Scroll indicator bar at the bottom */}
        <div className="gallery-scroll-hint">
          <span className="scroll-hint-text">Drag or Scroll to Explore</span>
          <div className="scroll-hint-bar">
            <div className="scroll-hint-progress" />
          </div>
        </div>

      </div>
    </section>
  );
}
