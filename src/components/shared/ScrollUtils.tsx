'use client';

import { useEffect, useRef, ReactNode, useState, useCallback } from 'react';
import Lenis from 'lenis';

// ===== Lenis Provider =====
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}

// ===== Scroll Reveal Hook =====
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ===== Scroll Progress Hook =====
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

// ===== Device Tilt =====
export function useDeviceTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const x = (e.gamma || 0) / 45;
      const y = (e.beta || 0) / 45;
      setTilt({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y - 0.5)) });
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handler, { passive: true });
    }
    return () => window.removeEventListener('deviceorientation', handler);
  }, []);

  return tilt;
}

// ===== Reveal Component =====
export function Reveal({
  children,
  className = '',
  animation = 'up',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  animation?: 'up' | 'left' | 'right' | 'scale' | 'clip';
  delay?: number;
}) {
  const { ref, isVisible } = useReveal();
  const animClass = `reveal-${animation}`;

  return (
    <div
      ref={ref}
      className={`${animClass} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
