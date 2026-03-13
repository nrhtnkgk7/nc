'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 800, color = '#B8956A' }) {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel];
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = Math.random() * 3 + 0.5;
    return s;
  }, [count]);

  useEffect(() => {
    const handleMove = (e: TouchEvent | MouseEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouse.current.x = (x / window.innerWidth) * 2 - 1;
      mouse.current.y = -(y / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove as any, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove as any);
    };
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const geo = mesh.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Apply velocity
      pos[i3] += velocities[i3] + Math.sin(time * 0.3 + i) * 0.001;
      pos[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.2 + i) * 0.001;
      pos[i3 + 2] += velocities[i3 + 2];

      // Mouse attraction (subtle)
      const dx = mouse.current.x * viewport.width * 0.5 - pos[i3];
      const dy = mouse.current.y * viewport.height * 0.5 - pos[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        pos[i3] += dx * 0.0008;
        pos[i3 + 1] += dy * 0.0008;
      }

      // Wrap around
      if (Math.abs(pos[i3]) > 6) pos[i3] *= -0.95;
      if (Math.abs(pos[i3 + 1]) > 5) pos[i3 + 1] *= -0.95;
      if (Math.abs(pos[i3 + 2]) > 3) pos[i3 + 2] *= -0.95;
    }
    geo.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        color={color}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      child.position.x = Math.sin(t * 0.15 + i * 2) * 3;
      child.position.y = Math.cos(t * 0.12 + i * 1.5) * 2;
      child.position.z = Math.sin(t * 0.1 + i) * 1.5;
      const s = 0.8 + Math.sin(t * 0.2 + i) * 0.2;
      child.scale.setScalar(s);
    });
  });

  return (
    <group ref={group}>
      {[0, 1, 2].map(i => (
        <mesh key={i}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color={i === 0 ? '#B8956A' : i === 1 ? '#8A6E4A' : '#D4B896'}
            transparent
            opacity={0.03 + i * 0.01}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleHero({ className = '' }: { className?: string }) {
  return (
    <div className={`webgl-container ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles count={600} />
        <FloatingOrbs />
        <ambientLight intensity={0.1} />
      </Canvas>
    </div>
  );
}
