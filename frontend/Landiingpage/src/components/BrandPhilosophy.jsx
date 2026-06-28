import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BrandPhilosophy.css';

gsap.registerPlugin(ScrollTrigger);

export default function BrandPhilosophy() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered fade and slide-up reveal for elements
      gsap.fromTo(
        ['.section-subtitle-wrapper', '.philosophy-heading', '.philosophy-quote', '.philosophy-body', '.philosophy-grid-item'],
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%', // trigger when top of section is 85% down the viewport
            toggleActions: 'play none none none', // play once
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert(); // clean up GSAP animations on unmount
  }, []);

  return (
    <section 
      className="philosophy-section" 
      ref={sectionRef}
      id="philosophy"
    >
      <div className="philosophy-container">
        
        {/* Header Label */}
        <div className="section-subtitle-wrapper">
          <span className="section-number">01</span>
          <span className="section-subtitle-line"></span>
          <span className="section-subtitle">THE VISION</span>
        </div>

        {/* Cinematic Main Heading */}
        <h2 className="philosophy-heading">
          THE ART OF <br />
          <span className="highlight-text">SELF-ASCENSION</span>
        </h2>

        {/* Narrative Concept Statement */}
        <div className="philosophy-narrative">
          <p className="philosophy-quote">
            "Training here is not about maintenance. It is about surpassing who you were yesterday."
          </p>
          <p className="philosophy-body">
            We reject the notion of generic fitness. Our methodology is built for those who seek 
            exceptional physical dominance and mental clarity. At Saiyan Gym, your training is treated as 
            a precise, high-performance science designed to rebuild your limits and unlock elite longevity.
          </p>
        </div>

        {/* 3-Column Pillars Layout */}
        <div className="pillars-grid">
          
          <div className="pillar-column">
            <div className="pillar-num">01.</div>
            <h3 className="pillar-title">DISCIPLINE</h3>
            <p className="pillar-desc">
              Power is forged in consistency. We believe true transformation happens in the quiet 
              moments of choice. Every rep, every session, is an absolute commitment to your progression.
            </p>
          </div>

          <div className="pillar-column">
            <div className="pillar-num">02.</div>
            <h3 className="pillar-title">PRECISION</h3>
            <p className="pillar-desc">
              We train with absolute focus. Technique, biometric tracking, and athletic recovery 
              are tailored precisely to your physiology, leaving nothing to chance or guesswork.
            </p>
          </div>

          <div className="pillar-column">
            <div className="pillar-num">03.</div>
            <h3 className="pillar-title">ASCENSION</h3>
            <p className="pillar-desc">
              There are no permanent limits, only temporary plateaus. We provide the equipment, 
              coaching, and atmosphere required to awaken the dormant strength within and ascend.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
