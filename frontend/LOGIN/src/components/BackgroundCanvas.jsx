import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanupFn = () => {};

    // Helper functions for WebGL and 2D Canvas setup
    const initWebGL = (canvasElement) => {
      let isVisible = true;
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0 });
      observer.observe(canvasElement);

      // 1. Scene setup
      const scene = new THREE.Scene();
      
      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 8;

      // 3. Renderer setup
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvasElement.parentElement ? canvasElement.parentElement.offsetWidth : window.innerWidth, canvasElement.parentElement ? canvasElement.parentElement.offsetHeight : window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      // 4. Lighting setup
      const ambientLight = new THREE.AmbientLight(0x1a0f0a, 2.0);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffaa00, 4.0);
      dirLight.position.set(5, 5, -3);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0xff5500, 5.0, 15);
      pointLight.position.set(-2, 2, 3);
      scene.add(pointLight);

      // 5. Dragon Ball Group
      const ballGroup = new THREE.Group();
      scene.add(ballGroup);

      // 5a. Outer Glass Shell
      const glassGeo = new THREE.SphereGeometry(1.6, 64, 64);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xff2200,
        emissiveIntensity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        thickness: 1.2,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.95
      });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      ballGroup.add(glassMesh);

      // 5b. Glowing Inner Core
      const coreGeo = new THREE.SphereGeometry(1.1, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      ballGroup.add(coreMesh);

      // 5c. Extruded Red Stars
      const starShape = new THREE.Shape();
      const numPoints = 5;
      const innerRadius = 0.06;
      const outerRadius = 0.16;
      const angleStep = Math.PI / numPoints;
      for (let i = 0; i < numPoints * 2; i++) {
        const angle = i * angleStep - Math.PI / 2; // Point upward
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
          starShape.moveTo(x, y);
        } else {
          starShape.lineTo(x, y);
        }
      }
      starShape.closePath();

      const starGeo = new THREE.ExtrudeGeometry(starShape, {
        depth: 0.04,
        bevelEnabled: false
      });
      starGeo.center();

      const starMat = new THREE.MeshStandardMaterial({
        color: 0xef4444, // Crimson Red
        emissive: 0x991b1b,
        roughness: 0.2,
        metalness: 0.1
      });

      // Positions for 5 stars in a pentagon configuration inside the core
      const starPositions = [
        { x: 0, y: 0.38, z: 0.1 },
        { x: -0.38, y: 0.08, z: 0.1 },
        { x: 0.38, y: 0.08, z: 0.1 },
        { x: -0.24, y: -0.34, z: 0.1 },
        { x: 0.24, y: -0.34, z: 0.1 }
      ];

      starPositions.forEach(pos => {
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.position.set(pos.x, pos.y, pos.z);
        starMesh.rotation.z = Math.random() * 0.2 - 0.1;
        ballGroup.add(starMesh);
      });

      // 6. Particle system
      function createCircleTexture() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const pCtx = pCanvas.getContext('2d');
        const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(245, 158, 11, 0.8)'); // Amber
        gradient.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)'); // Orange
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        pCtx.fillStyle = gradient;
        pCtx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(pCanvas);
      }

      const particleCount = 120;
      const pGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);
      const speeds = new Float32Array(particleCount);
      const randoms = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
        
        scales[i] = Math.random() * 0.18 + 0.05;
        speeds[i] = Math.random() * 0.6 + 0.2;
        randoms[i] = Math.random();
      }

      pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
      pGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
      pGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

      const particleMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uTexture: { value: createCircleTexture() }
        },
        vertexShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          attribute float aScale;
          attribute float aSpeed;
          attribute float aRandom;
          varying float vRandom;
          varying float vAlpha;
          void main() {
            vRandom = aRandom;
            
            vec3 pos = position;
            
            // Calculate vertical drift
            pos.y += uTime * aSpeed * 0.5;
            // Wrap Y coordinates around screen bounds
            pos.y = mod(pos.y + 10.0, 20.0) - 10.0;
            
            // Apply horizontal drift
            pos.x += sin(uTime * 0.4 + aRandom * 6.28) * 0.2;
            
            // Mouse interaction (repel particles in proximity)
            vec2 mouseWorld = uMouse * vec2(8.0, 6.0);
            vec2 dir = pos.xy - mouseWorld;
            float dist = length(dir);
            if (dist < 4.0) {
              float force = (4.0 - dist) / 4.0;
              pos.xy += normalize(dir) * force * 1.2;
            }
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Distance size attenuation
            gl_PointSize = aScale * (350.0 / -mvPosition.z);
            
            // Twinkle effect & height-based fade
            float fade = 1.0 - smoothstep(7.0, 10.0, abs(pos.y));
            vAlpha = fade * (0.2 + 0.8 * sin(uTime * 2.5 + aRandom * 6.28));
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying float vRandom;
          varying float vAlpha;
          void main() {
            vec4 texColor = texture2D(uTexture, gl_PointCoord);
            vec3 color = mix(vec3(0.96, 0.62, 0.04), vec3(0.92, 0.34, 0.05), vRandom);
            gl_FragColor = vec4(color, texColor.a * vAlpha * 0.85);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(pGeometry, particleMat);
      scene.add(particles);

      // 7. Interactive & responsive variables
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      let scrollY = 0;
      let baseBallX = -2.2;
      let baseBallY = 0.5;
      let baseBallScale = 1.0;

      const handleMouseMove = (e) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      const handleScroll = () => {
        scrollY = window.scrollY;
      };

      const handleResize = () => {
        const width = canvasElement.parentElement ? canvasElement.parentElement.offsetWidth : window.innerWidth;
        const height = canvasElement.parentElement ? canvasElement.parentElement.offsetHeight : window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        // Make position and scale responsive
        if (width < 968) {
          baseBallX = 0;
          baseBallY = 2.4;
          baseBallScale = 0.7;
        } else {
          baseBallX = -2.2;
          baseBallY = 0.5;
          baseBallScale = 1.0;
        }
        ballGroup.scale.setScalar(baseBallScale);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call

      // 8. Animation Loop
      const clock = new THREE.Clock();
      let animationId;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (!isVisible) return;

        const elapsedTime = clock.getElapsedTime();
        
        // Update particle uniforms
        particleMat.uniforms.uTime.value = elapsedTime;
        
        // Lerp mouse coordinates
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
        particleMat.uniforms.uMouse.value.set(mouse.x, mouse.y);

        // Smooth float animation on Dragon Ball Group
        const floatOffset = Math.sin(elapsedTime * 1.5) * 0.12;
        
        // Scroll parallax calculations
        const scrollOffset = scrollY * 0.003;
        
        // Update Dragon Ball position
        const targetBallX = baseBallX + mouse.x * 0.35;
        const targetBallY = baseBallY + floatOffset + mouse.y * 0.25 - scrollOffset;
        
        ballGroup.position.x += (targetBallX - ballGroup.position.x) * 0.08;
        ballGroup.position.y += (targetBallY - ballGroup.position.y) * 0.08;

        // Slow rotation on the Dragon Ball Group
        ballGroup.rotation.y = elapsedTime * 0.15;
        ballGroup.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1 + mouse.y * 0.15;
        ballGroup.rotation.z = mouse.x * -0.15;

        renderer.render(scene, camera);
      };

      animate();

      // Return cleanup function
      return () => {
        observer.disconnect();
        cancelAnimationFrame(animationId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        
        // Dispose resources
        glassGeo.dispose();
        glassMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        starGeo.dispose();
        starMat.dispose();
        pGeometry.dispose();
        particleMat.dispose();
        renderer.dispose();
      };
    };

    const init2D = (canvasElement) => {
      let isVisible = true;
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0 });
      observer.observe(canvasElement);

      const ctx = canvasElement.getContext('2d');
      if (!ctx) return () => {};

      let animationFrameId;
      let particles = [];
      const particleCount = 45;

      const handleResize = () => {
        canvasElement.width = canvasElement.parentElement ? canvasElement.parentElement.offsetWidth : window.innerWidth;
        canvasElement.height = canvasElement.parentElement ? canvasElement.parentElement.offsetHeight : window.innerHeight;
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      class Particle {
        constructor() {
          this.reset(true);
        }

        reset(init = false) {
          this.x = Math.random() * canvasElement.width;
          this.y = init ? Math.random() * canvasElement.height : canvasElement.height + 10;
          this.radius = Math.random() * 2 + 0.5;
          this.vy = -(Math.random() * 0.25 + 0.1);
          this.vx = (Math.random() - 0.5) * 0.15;
          this.alpha = Math.random() * 0.5 + 0.1;
          this.fadeSpeed = Math.random() * 0.003 + 0.001;
          this.twinkleSpeed = Math.random() * 0.02 + 0.005;
          this.twinklePhase = Math.random() * Math.PI * 2;
        }

        update() {
          this.y += this.vy;
          this.x += this.vx;
          this.twinklePhase += this.twinkleSpeed;
          if (this.y < canvasElement.height * 0.2) {
            this.alpha -= this.fadeSpeed;
          }
          if (this.y < -10 || this.alpha <= 0) {
            this.reset();
          }
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          const currentAlpha = Math.max(0.02, this.alpha * (0.7 + 0.3 * Math.sin(this.twinklePhase)));
          ctx.fillStyle = `rgba(245, 158, 11, ${currentAlpha})`;
          ctx.shadowColor = 'rgba(234, 88, 12, 0.5)';
          ctx.shadowBlur = this.radius * 3;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      const animate = () => {
        if (isVisible) {
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          particles.forEach(p => {
            p.update();
            p.draw();
          });
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
      };
    };

    // Run WebGL with graceful fallback to 2D Canvas
    try {
      cleanupFn = initWebGL(canvas);
    } catch (error) {
      console.warn("WebGL initialization failed, falling back to 2D particle simulation:", error);
      cleanupFn = init2D(canvas);
    }

    return () => {
      cleanupFn();
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
        zIndex: 11,
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  );
}
