'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

function ScrambleReveal({ text, speed = 40, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const [display, setDisplay] = useState(text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
  const hasStarted = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      let frame = 0;
      const totalFrames = Math.round(text.length * 3);

      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            const charProgress = i / text.length;
            if (progress > charProgress + 0.25) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplay(text);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return <span>{display}</span>;
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'scramble' | 'reveal' | 'exit'>('scramble');

  useEffect(() => {
    // Phase 1: scramble runs for ~1.2s
    const t1 = setTimeout(() => setPhase('reveal'), 1200);
    // Phase 2: hold revealed text for 0.6s, then exit
    const t2 = setTimeout(() => setPhase('exit'), 1800);
    // Phase 3: call onComplete after exit animation
    const t3 = setTimeout(() => onComplete(), 2400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] bg-nc-black flex flex-col items-center justify-center"
        style={{ display: phase === 'exit' ? undefined : undefined }}
      >
        {/* Subtle horizontal lines */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[38%] left-[10%] right-[10%] h-[1px] bg-nc-gold/[.06] origin-left"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[62%] left-[10%] right-[10%] h-[1px] bg-nc-gold/[.06] origin-right"
        />

        {/* Main text */}
        <div className="text-center">
          <div className="font-bebas text-[clamp(48px,15vw,120px)] text-nc-white tracking-[.08em] leading-[0.85]">
            <ScrambleReveal text="NO CODE" speed={35} delay={200} />
          </div>

          {/* Gold line expanding */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === 'scramble' ? 0.3 : 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 md:w-16 h-[1px] bg-nc-gold mx-auto mt-5 mb-4 origin-center"
          />

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'reveal' || phase === 'exit' ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="font-ui text-[9px] tracking-[8px] uppercase text-nc-gold/40"
          >
            WHERE FOOD MEETS FUTURE
          </motion.div>
        </div>

        {/* Loading bar */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[80px]">
          <div className="h-[1px] bg-white/[.06] relative overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, repeat: 1, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-1/2 bg-nc-gold/40"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
