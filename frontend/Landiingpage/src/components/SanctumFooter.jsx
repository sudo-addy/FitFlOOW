import React from 'react';
import './SanctumFooter.css';

export default function SanctumFooter() {
  return (
    <footer className="sanctum-footer" id="footer">
      <div className="footer-container">
        
        {/* Top Section: Link Columns */}
        <div className="footer-links-grid">
          
          {/* Column 1: Facilities */}
          <div className="footer-col">
            <h4 className="footer-col-title">FACILITIES</h4>
            <ul className="footer-col-list">
              <li><a href="#chambers" className="footer-link">Hyperbolic Strength Space</a></li>
              <li><a href="#gallery" className="footer-link">Zen Restoration Vault</a></li>
              <li><a href="#gallery" className="footer-link">Metric Bio-Arena</a></li>
              <li><a href="#chambers" className="footer-link">Infrared Recovery Pods</a></li>
            </ul>
          </div>

          {/* Column 2: Methodology */}
          <div className="footer-col">
            <h4 className="footer-col-title">METHODOLOGY</h4>
            <ul className="footer-col-list">
              <li><a href="#philosophy" className="footer-link">Discipline Protocols</a></li>
              <li><a href="#philosophy" className="footer-link">Biometric Precision</a></li>
              <li><a href="#philosophy" className="footer-link">Ki Ascension</a></li>
              <li><a href="#philosophy" className="footer-link">Recovery Science</a></li>
            </ul>
          </div>

          {/* Column 3: Member Portal */}
          <div className="footer-col">
            <h4 className="footer-col-title">PORTAL</h4>
            <ul className="footer-col-list">
              <li><a href="#cta" className="footer-link">Member Login</a></li>
              <li><a href="#cta" className="footer-link">Request Invitation</a></li>
              <li><a href="#cta" className="footer-link">Guest Access Pass</a></li>
              <li><a href="#footer" className="footer-link">Support Desk</a></li>
            </ul>
          </div>

          {/* Column 4: Slogan & Socials */}
          <div className="footer-col footer-col-slogan">
            <h4 className="footer-col-title">THE SANCTUM</h4>
            <p className="footer-slogan-desc">
              Every rep is an absolute commitment to progression. Join our capped elite membership space and transcend.
            </p>
            
            {/* Social SVG Buttons */}
            <div className="footer-socials">
              <a href="#instagram" className="footer-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#twitter" className="footer-social-btn" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#youtube" className="footer-social-btn" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Section: Wordmark & Copyright */}
        <div className="footer-bottom">
          <div className="footer-logo-group">
            <svg className="footer-logo-svg" viewBox="0 0 256 256">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="footer-wordmark font-playfair italic">Saiyan Gym</span>
          </div>
          <span className="footer-copyright">
            © 2026 Saiyan Gym. All rights reserved. Crafted for ascension.
          </span>
        </div>

      </div>
    </footer>
  );
}
