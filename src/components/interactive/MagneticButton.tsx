'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const py = 'touches' in e ? e.touches[0].clientY : e.clientY;
    x.set((px - cx) * strength);
    y.set((py - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
