'use client';

import { useEffect, useRef, useState } from 'react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

export default function TextScramble({
  text,
  className = '',
  trigger = true,
  speed = 30,
}: {
  text: string;
  className?: string;
  trigger?: boolean;
  speed?: number;
}) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, '—'));
  const hasRun = useRef(false);
  const prevTrigger = useRef(false);

  useEffect(() => {
    // Reset hasRun when trigger goes from false→true (e.g. new text/language)
    if (trigger && !prevTrigger.current) {
      hasRun.current = false;
    }
    prevTrigger.current = trigger;

    if (!trigger || hasRun.current) return;
    hasRun.current = true;

    let frame = 0;
    const totalFrames = Math.round(text.length * 2.5);

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            const charProgress = i / text.length;
            if (progress > charProgress + 0.2) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [trigger, text, speed]);

  return <span className={className}>{display}</span>;
}
