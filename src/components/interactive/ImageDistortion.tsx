'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform sampler2D uTexture;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    // Scroll-driven wave distortion
    float wave = sin(uv.y * 8.0 + uTime * 0.5 + uScroll * 3.0) * 0.008 * uScroll;
    uv.x += wave;
    
    // Mouse proximity ripple
    vec2 mouseUV = uMouse * 0.5 + 0.5;
    float dist = distance(uv, mouseUV);
    float ripple = sin(dist * 30.0 - uTime * 3.0) * 0.005 * smoothstep(0.4, 0.0, dist);
    uv += ripple;
    
    // Chromatic aberration on edges
    float aberration = 0.002 * (1.0 + uScroll * 2.0);
    float r = texture2D(uTexture, uv + vec2(aberration, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(aberration, 0.0)).b;
    
    // Vignette
    float vig = 1.0 - smoothstep(0.4, 1.2, distance(vUv, vec2(0.5)));
    
    gl_FragColor = vec4(r, g, b, 1.0) * vig;
  }
`;

function DistortionPlane({ imageUrl }: { imageUrl: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const scroll = useRef(0);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(imageUrl);
  }, [imageUrl]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTexture: { value: texture },
  }), [texture]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouse.current.set(
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1
      );
    };
    const onScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      scroll.current = Math.min(progress * 2, 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove as any, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const mat = mesh.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uScroll.value += (scroll.current - mat.uniforms.uScroll.value) * 0.05;
    mat.uniforms.uMouse.value.lerp(mouse.current, 0.05);
  });

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function ImageDistortion({
  imageUrl,
  className = '',
}: {
  imageUrl: string;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <DistortionPlane imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}
