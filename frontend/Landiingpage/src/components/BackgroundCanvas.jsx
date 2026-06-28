import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const particleCount = 35; // Lower density for a clean, non-distracting background

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize particles
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : canvas.height + 10;
        this.radius = Math.random() * 2 + 0.5; // subtle size variety
        this.vy = -(Math.random() * 0.25 + 0.1); // slow upward movement
        this.vx = (Math.random() - 0.5) * 0.15; // very gentle drift sideways
        this.alpha = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.twinklePhase += this.twinkleSpeed;
        
        // fade out as they reach the top 20%
        if (this.y < canvas.height * 0.2) {
          this.alpha -= this.fadeSpeed;
        }

        if (this.y < -10 || this.alpha <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Twinkling effect using sin wave on alpha
        const currentAlpha = Math.max(0.02, this.alpha * (0.7 + 0.3 * Math.sin(this.twinklePhase)));
        
        // Amber/Orange sunset colors
        ctx.fillStyle = `rgba(245, 158, 11, ${currentAlpha})`; // Amber accent
        ctx.shadowColor = 'rgba(234, 88, 12, 0.5)'; // Warm orange glow
        ctx.shadowBlur = this.radius * 3; // Soft blur proportional to size
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for performance
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.75,
      }}
    />
  );
}
