import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function DragonBalls({ onBallClick }) {
  const groupRef = useRef();
  const { viewport, pointer } = useThree();

  // Keep track of hover state for each ball
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Generate configuration for the 7 Dragon Balls
  const ballConfigs = useMemo(() => {
    return Array.from({ length: 7 }).map((_, idx) => {
      const starCount = idx + 1;
      
      // Distinct initial angular positions evenly spaced
      const baseAngle = (idx / 7) * Math.PI * 2;
      
      // Distinct flight height & float offsets
      const floatOffset = idx * 0.7;
      const speedMultiplier = 0.15 + (idx % 3) * 0.05;
      
      // Star arrangement vectors inside the ball (positions relative to ball center)
      const starPositions = [];
      const scale = 0.22;
      
      if (starCount === 1) {
        starPositions.push([0, 0, 0]);
      } else if (starCount === 2) {
        starPositions.push([-0.12, 0, 0], [0.12, 0, 0]);
      } else if (starCount === 3) {
        starPositions.push([0, 0.12, 0], [-0.12, -0.08, 0], [0.12, -0.08, 0]);
      } else if (starCount === 4) {
        starPositions.push(
          [-0.1, 0.1, 0], [0.1, 0.1, 0],
          [-0.1, -0.1, 0], [0.1, -0.1, 0]
        );
      } else if (starCount === 5) {
        starPositions.push(
          [0, 0.15, 0],
          [-0.12, 0.04, 0], [0.12, 0.04, 0],
          [-0.08, -0.12, 0], [0.08, -0.12, 0]
        );
      } else if (starCount === 6) {
        starPositions.push(
          [-0.12, 0.12, 0], [0.12, 0.12, 0],
          [-0.15, 0, 0], [0.15, 0, 0],
          [-0.12, -0.12, 0], [0.12, -0.12, 0]
        );
      } else if (starCount === 7) {
        starPositions.push(
          [0, 0, 0], // Center star
          [0, 0.15, 0],
          [-0.14, 0.06, 0], [0.14, 0.06, 0],
          [-0.12, -0.1, 0], [0.12, -0.1, 0],
          [0, -0.15, 0]
        );
      }

      return {
        id: idx,
        starCount,
        baseAngle,
        floatOffset,
        speedMultiplier,
        starPositions,
        orbitRadiusX: 2.2 + (idx % 2) * 0.3,
        orbitRadiusY: 1.8 + (idx % 3) * 0.2,
      };
    });
  }, []);

  // Store references to the individual meshes
  const ballRefs = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Map mouse pointer to 3D world coordinates approximately
    const mouseWorldX = (pointer.x * viewport.width) / 2;
    const mouseWorldY = (pointer.y * viewport.height) / 2;

    ballConfigs.forEach((config, idx) => {
      const ball = ballRefs.current[idx];
      if (!ball) return;

      // Orbit animation around the login card area
      // Center of orbit is offset to the right (x: 1.8) since the login card is on the right
      const centerX = viewport.width > 7 ? 1.8 : 0; 
      const centerY = viewport.width > 7 ? 0 : 1.5;

      const angle = config.baseAngle + time * config.speedMultiplier;
      const floatY = Math.sin(time * 1.2 + config.floatOffset) * 0.18;

      let targetX = centerX + Math.cos(angle) * config.orbitRadiusX;
      let targetY = centerY + Math.sin(angle) * 0.5 + floatY;
      let targetZ = Math.sin(angle) * config.orbitRadiusY; // 3D depth orbit

      // Calculate distance from cursor to ball in screen projection space (2D)
      // Since it's a z-axis orbiting mesh, we can calculate repulsion in x and y
      const dx = targetX - mouseWorldX;
      const dy = targetY - mouseWorldY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repulsion force on mouse proximity
      if (dist < 1.8) {
        const force = (1.8 - dist) / 1.8;
        const pushX = (dx / dist) * force * 0.6;
        const pushY = (dy / dist) * force * 0.6;
        
        targetX += pushX;
        targetY += pushY;
      }

      // Smooth interpolation (lerp) to target position
      ball.position.x += (targetX - ball.position.x) * 0.1;
      ball.position.y += (targetY - ball.position.y) * 0.1;
      ball.position.z += (targetZ - ball.position.z) * 0.1;

      // Slow self-rotation for stars orientation
      ball.rotation.y = time * 0.4 + config.floatOffset;
      ball.rotation.x = Math.sin(time * 0.2) * 0.2;

      // Handle hover scale changes
      const isHovered = hoveredIndex === idx;
      const targetScale = isHovered ? 1.35 : 1.0;
      ball.scale.x += (targetScale - ball.scale.x) * 0.15;
      ball.scale.y += (targetScale - ball.scale.y) * 0.15;
      ball.scale.z += (targetScale - ball.scale.z) * 0.15;

      // Update inner glow emission intensity based on hover
      const material = ball.children[0].material;
      const emissiveIntensityTarget = isHovered ? 1.8 : 0.4;
      material.emissiveIntensity += (emissiveIntensityTarget - material.emissiveIntensity) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {ballConfigs.map((config, idx) => (
        <group
          key={config.id}
          ref={(el) => (ballRefs.current[idx] = el)}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredIndex(idx);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredIndex(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onBallClick) onBallClick(config.starCount);
          }}
        >
          {/* Outer Orange Glass Spheres */}
          <mesh castShadow>
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshPhysicalMaterial
              color="#ffaa00"
              emissive="#ff3c00"
              emissiveIntensity={0.4}
              roughness={0.05}
              metalness={0.1}
              transmission={0.85}
              thickness={0.5}
              ior={1.45}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Inner Core Glow Mesh */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial
              color="#ffaa00"
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Red Stars inside the core */}
          {config.starPositions.map((pos, sIdx) => (
            <mesh key={sIdx} position={pos}>
              {/* Star-like shape using octahedron */}
              <octahedronGeometry args={[0.032, 0]} />
              <meshStandardMaterial
                color="#ff0000"
                emissive="#990000"
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
