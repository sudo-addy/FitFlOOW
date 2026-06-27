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
    const particleCount = 60;

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
        this.radius = Math.random() * 1.5 + 0.5;
        this.vy = -(Math.random() * 0.4 + 0.15); // drift upwards
        this.vx = (Math.random() - 0.5) * 0.2; // slight drift sideways
        this.alpha = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;
        
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
        
        // Gold/orange glow
        ctx.fillStyle = `rgba(255, 136, 0, ${this.alpha})`;
        ctx.shadowColor = 'rgba(255, 170, 0, 0.4)';
        ctx.shadowBlur = 8;
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
