import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WarriorSilhouette() {
  const capeRef = useRef();
  const auraRef = useRef();
  const hairRef = useRef();
  
  // Custom shader for the waving cape
  const capeUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ff5500') }
  }), []);

  // Custom shader for the pulsing aura
  const auraUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ffaa00') }
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update shader uniforms
    capeUniforms.uTime.value = time;
    auraUniforms.uTime.value = time;

    // Subtle breathing animation for the warrior group
    if (hairRef.current) {
      hairRef.current.position.y = Math.sin(time * 2.0) * 0.02;
    }

    // Rotate aura particles
    if (auraRef.current) {
      auraRef.current.rotation.y = time * 0.5;
    }
  });

  // Generate aura particles data
  const particleCount = 150;
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      // Cylindrical distribution around warrior
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.6;
      pos[i * 3] = Math.cos(angle) * radius; // x
      pos[i * 3 + 1] = Math.random() * 2.5 - 0.5; // y (height)
      pos[i * 3 + 2] = Math.sin(angle) * radius; // z
      
      spd[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, spd];
  }, []);

  return (
    <group position={[-1.8, -1.2, 0]}>
      {/* 1. The Volcanic Cliff Cliff */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 1.2, 8]} />
        <meshStandardMaterial 
          color="#0f0705" 
          roughness={0.9} 
          metalness={0.2}
          emissive="#250900"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Cliff lava cracks overlay */}
      <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.4, 8]} />
        <meshBasicMaterial color="#ff3300" transparent opacity={0.6} />
      </mesh>

      {/* 2. Stylized Warrior Silhouette */}
      <group ref={hairRef} position={[0, 0.4, 0]}>
        {/* Head & Spiky Hair */}
        <group position={[0, 1.25, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#0d0604" roughness={0.8} />
          </mesh>
          
          {/* Hair spikes - using grouped cones angled outward */}
          <group position={[0, 0.05, 0]}>
            {/* Top spikes */}
            <mesh position={[0, 0.2, 0.02]} rotation={[0.2, 0, 0]}>
              <coneGeometry args={[0.07, 0.35, 4]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
            <mesh position={[0.08, 0.16, -0.04]} rotation={[0, 0, -0.4]}>
              <coneGeometry args={[0.06, 0.3, 4]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
            <mesh position={[-0.08, 0.16, -0.04]} rotation={[0, 0, 0.4]}>
              <coneGeometry args={[0.06, 0.3, 4]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>

            {/* Back/Side flares */}
            <mesh position={[0.13, 0.06, 0.05]} rotation={[-0.1, 0, -0.9]}>
              <coneGeometry args={[0.06, 0.32, 4]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
            <mesh position={[-0.13, 0.06, 0.05]} rotation={[-0.1, 0, 0.9]}>
              <coneGeometry args={[0.06, 0.32, 4]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>

            {/* Side burns / lower spikes */}
            <mesh position={[0.15, -0.05, 0]} rotation={[0, 0, -1.3]}>
              <coneGeometry args={[0.05, 0.22, 4]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
            <mesh position={[-0.15, -0.05, 0]} rotation={[0, 0, 1.3]}>
              <coneGeometry args={[0.05, 0.22, 4]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
          </group>
        </group>

        {/* Torso & Gi clothing details */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.24, 0.7, 8]} />
          {/* Deep dark orange gi silhouette */}
          <meshStandardMaterial color="#7f1d01" roughness={0.7} />
        </mesh>
        
        {/* Blue belt sash */}
        <mesh position={[0, 0.43, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 8]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
        </mesh>

        {/* Legs (Orange gi pants) */}
        <group position={[0, 0.2, 0]}>
          <mesh position={[-0.1, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.4, 8]} />
            <meshStandardMaterial color="#7f1d01" roughness={0.7} />
          </mesh>
          <mesh position={[0.1, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.4, 8]} />
            <meshStandardMaterial color="#7f1d01" roughness={0.7} />
          </mesh>
        </group>

        {/* Arms (Standing crossed or at side) */}
        <mesh position={[0.22, 0.8, 0.05]} rotation={[0.2, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.45, 8]} />
          <meshStandardMaterial color="#7f1d01" roughness={0.7} />
        </mesh>
        <mesh position={[-0.22, 0.8, 0.05]} rotation={[0.2, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.45, 8]} />
          <meshStandardMaterial color="#7f1d01" roughness={0.7} />
        </mesh>

        {/* 3. Waving Cape (High-end custom shader) */}
        <mesh ref={capeRef} position={[0, 0.95, -0.15]} rotation={[0.15, Math.PI, 0]} castShadow>
          <planeGeometry args={[0.55, 1.2, 16, 16]} />
          <shaderMaterial
            vertexShader={`
              uniform float uTime;
              varying vec2 vUv;
              void main() {
                vUv = uv;
                vec3 pos = position;
                // Waves increase at the bottom of the cape (uv.y is close to 0)
                float waveFactor = (1.0 - uv.y);
                float wave = sin(pos.y * 3.5 - uTime * 6.5) * 0.12 * waveFactor;
                // Add secondary flutter wave
                float flutter = cos(pos.x * 4.0 + uTime * 12.0) * 0.04 * waveFactor;
                
                pos.z += wave + flutter;
                // Pull cape slightly outward to simulate wind lift
                pos.y += waveFactor * 0.08;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 uColor;
              varying vec2 vUv;
              void main() {
                // Darken bottom edge and sides for shading depth
                float shadow = mix(0.3, 1.0, vUv.y) * mix(0.7, 1.0, sin(vUv.x * 3.14));
                gl_FragColor = vec4(uColor * shadow, 1.0);
              }
            `}
            uniforms={capeUniforms}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 4. Rising Ki Aura Particles */}
      <points ref={auraRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexShader={`
            uniform float uTime;
            attribute float aSpeed;
            varying float vOpacity;
            
            void main() {
              vec3 pos = position;
              // Float particles upward
              pos.y += mod(uTime * 0.4, 3.0);
              
              // Fade out near the top
              vOpacity = 1.0 - (pos.y / 3.0);
              if (vOpacity < 0.0) vOpacity = 0.0;
              
              // Add noise spiral drift
              float angle = uTime * 2.0 + pos.y * 3.0;
              pos.x += sin(angle) * 0.12;
              pos.z += cos(angle) * 0.12;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              // Size attenuation
              gl_PointSize = 15.0 * (1.0 / -mvPosition.z);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying float vOpacity;
            void main() {
              // Circular glow shape
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float intensity = 1.0 - (dist * 2.0);
              gl_FragColor = vec4(uColor, intensity * vOpacity * 0.8);
            }
          `}
          uniforms={auraUniforms}
        />
      </points>

      {/* Volcanic ambient red ground spotlight underneath warrior */}
      <pointLight position={[0, 0.1, 0.2]} color="#ff4400" intensity={6.0} distance={4} decay={2} />
    </group>
  );
}
