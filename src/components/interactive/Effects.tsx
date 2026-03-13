'use client';

import { useRef, useEffect, useCallback, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ===== TOUCH RIPPLE CANVAS =====
export function TouchRipple({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<{ x: number; y: number; r: number; a: number; color: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    const addRipple = (x: number, y: number) => {
      const colors = ['rgba(184,149,106,', 'rgba(212,184,150,', 'rgba(138,110,74,'];
      for (let i = 0; i < 3; i++) {
        ripples.current.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          r: Math.random() * 5,
          a: 0.3 + Math.random() * 0.2,
          color: colors[i % 3],
        });
      }
    };

    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      Array.from(e.touches).forEach(t => addRipple(t.clientX - rect.left, t.clientY - rect.top));
    };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvas.addEventListener('touchstart', onTouch, { passive: true });
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    canvas.addEventListener('click', onClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ripples.current = ripples.current.filter(r => {
        r.r += 2.5;
        r.a -= 0.004;
        if (r.a <= 0) return false;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `${r.color}${r.a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        return true;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 z-[2] ${className}`} style={{ width: '100%', height: '100%' }} />;
}

// ===== SCROLL VELOCITY HOOK =====
export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const lastScroll = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        const v = Math.abs(window.scrollY - lastScroll.current) / dt;
        setVelocity(Math.min(v * 10, 1)); // normalize 0-1
      }
      lastScroll.current = window.scrollY;
      lastTime.current = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Decay velocity
    const decay = setInterval(() => setVelocity(v => v * 0.92), 50);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(decay);
    };
  }, []);

  return velocity;
}

// ===== TILT CARD (device motion + mouse) =====
export function TiltCard({
  children,
  className = '',
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const rotateX = useSpring(0, { stiffness: 100, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 20 });
  const glow = useMotionValue('transparent');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = (e.gamma || 0) / 45;
      const y = ((e.beta || 0) - 40) / 45;
      rotateX.set(y * intensity);
      rotateY.set(-x * intensity);
    };
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [intensity, rotateX, rotateY]);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
    glow.set(`radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(184,149,106,0.08), transparent 60%)`);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glow.set('transparent');
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        background: glow,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
}

// ===== HORIZONTAL DRAG GALLERY =====
export function DragGallery({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const scrollW = containerRef.current.scrollWidth;
    const clientW = containerRef.current.clientWidth;
    setConstraints({ left: -(scrollW - clientW), right: 0 });

    const onResize = () => {
      const sw = containerRef.current!.scrollWidth;
      const cw = containerRef.current!.clientWidth;
      setConstraints({ left: -(sw - cw), right: 0 });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [children]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ===== COUNTER ANIMATION =====
export function AnimatedCounter({
  value,
  className = '',
  trigger = true,
}: {
  value: string;
  className?: string;
  trigger?: boolean;
}) {
  const [current, setCurrent] = useState('00');
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    const target = parseInt(value);
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCurrent(current.toString().padStart(2, '0'));
      if (frame >= totalFrames) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, value]);

  return <span className={className}>{current}</span>;
}

// ===== SPLIT TEXT REVEAL =====
export function SplitText({
  text,
  className = '',
  charClassName = '',
  trigger = true,
  staggerDelay = 0.03,
  initialDelay = 0,
}: {
  text: string;
  className?: string;
  charClassName?: string;
  trigger?: boolean;
  staggerDelay?: number;
  initialDelay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '120%', opacity: 0, rotateX: 80 }}
          animate={trigger ? { y: 0, opacity: 1, rotateX: 0 } : {}}
          transition={{
            delay: initialDelay + i * staggerDelay,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block ${charClassName} ${char === ' ' ? 'w-[0.2em]' : ''}`}
          style={{ transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ===== PROGRESS LINE =====
export function ScrollProgressBar() {
  const scaleX = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      scaleX.set(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scaleX]);

  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed bottom-0 left-0 right-0 h-[2px] bg-nc-gold z-[150]"
    />
  );
}
