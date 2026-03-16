'use client';

import { useEffect, useRef } from 'react';

/**
 * MagneticScroll — "suction" snap to section titles.
 *
 * When the user slows down scrolling near a section title,
 * the page gently pulls to align that title to the top of the viewport.
 * Unlike CSS scroll-snap, this never hijacks fast scrolling.
 */
export default function MagneticScroll({ selectors = '[data-snap]' }: { selectors?: string }) {
  const isSnapping = useRef(false);
  const lastScroll = useRef(0);
  const velocities = useRef<number[]>([]);
  const rafId = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Bail on reduced motion
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let prevY = window.scrollY;
    let prevTime = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dt = now - prevTime;
      const dy = window.scrollY - prevY;

      if (dt > 0) {
        const v = Math.abs(dy / dt); // px/ms
        velocities.current.push(v);
        if (velocities.current.length > 5) velocities.current.shift();
      }

      prevY = window.scrollY;
      prevTime = now;

      // Clear any pending snap check
      if (timeoutId.current) clearTimeout(timeoutId.current);

      // After user stops scrolling (120ms idle), check for nearby snap target
      timeoutId.current = setTimeout(() => {
        checkSnap();
      }, 120);
    };

    const checkSnap = () => {
      if (isSnapping.current) return;

      // Only snap if velocity was low (user was slowing down)
      const avgV = velocities.current.length > 0
        ? velocities.current.reduce((a, b) => a + b, 0) / velocities.current.length
        : 0;

      // If user was scrolling fast (fling), don't snap
      if (avgV > 1.5) {
        velocities.current = [];
        return;
      }

      const targets = document.querySelectorAll(selectors);
      const scrollTop = window.scrollY;
      const magnetRange = 180; // px — how far away a section can "pull" you in

      let closest: { el: Element; dist: number; top: number } | null = null;

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + scrollTop;
        const dist = Math.abs(scrollTop - elTop);

        // Only consider sections within magnet range of current scroll
        if (dist < magnetRange) {
          if (!closest || dist < closest.dist) {
            closest = { el, dist, top: elTop };
          }
        }
      });

      if (closest && closest.dist > 3) {
        // Snap to it
        isSnapping.current = true;
        const target = closest.top;

        // Disable smooth scroll-behavior temporarily for custom easing
        document.documentElement.style.scrollBehavior = 'auto';

        const start = window.scrollY;
        const diff = target - start;
        const duration = Math.min(600, Math.max(250, Math.abs(diff) * 3));
        let startTime: number | null = null;

        const ease = (t: number) => {
          // Ease-out cubic — fast start, gentle stop
          return 1 - Math.pow(1 - t, 3);
        };

        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = ease(progress);

          window.scrollTo(0, start + diff * eased);

          if (progress < 1) {
            rafId.current = requestAnimationFrame(step);
          } else {
            document.documentElement.style.scrollBehavior = 'smooth';
            isSnapping.current = false;
            velocities.current = [];
          }
        };

        rafId.current = requestAnimationFrame(step);
      }

      velocities.current = [];
    };

    // Interrupt snap if user starts scrolling during animation
    const onWheel = () => {
      if (isSnapping.current) {
        cancelAnimationFrame(rafId.current);
        isSnapping.current = false;
        document.documentElement.style.scrollBehavior = 'smooth';
      }
    };
    const onTouch = () => {
      if (isSnapping.current) {
        cancelAnimationFrame(rafId.current);
        isSnapping.current = false;
        document.documentElement.style.scrollBehavior = 'smooth';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouch);
      if (timeoutId.current) clearTimeout(timeoutId.current);
      cancelAnimationFrame(rafId.current);
      document.documentElement.style.scrollBehavior = '';
    };
  }, [selectors]);

  return null;
}
