'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * ScrollCheckpoint — forces scroll to pause at each section title.
 * 
 * When scrolling crosses a checkpoint, scroll is stopped and aligned
 * to that checkpoint. A second scroll gesture continues past it.
 */
export default function ScrollCheckpoint({ selector = '[data-snap]' }: { selector?: string }) {
  const checkpoints = useRef<number[]>([]);
  const lockedAt = useRef<number | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimating = useRef(false);
  const lastDir = useRef(0);

  // Build checkpoint positions
  const updateCheckpoints = useCallback(() => {
    const els = document.querySelectorAll(selector);
    checkpoints.current = Array.from(els).map(el => {
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    });
  }, [selector]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    updateCheckpoints();
    window.addEventListener('resize', updateCheckpoints, { passive: true });

    // Also recalc after content loads
    const recalcTimer = setTimeout(updateCheckpoints, 1000);

    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const scrollY = window.scrollY;
      const dir = e.deltaY > 0 ? 1 : -1;

      // If we're locked at a checkpoint and user scrolls same direction, unlock
      if (lockedAt.current !== null) {
        if (dir === lastDir.current) {
          // Second scroll in same direction — unlock and let through
          lockedAt.current = null;
          return;
        } else {
          // Changed direction — re-lock to find new checkpoint in that direction
          lockedAt.current = null;
        }
      }

      lastDir.current = dir;

      // Find next checkpoint in scroll direction
      const threshold = 80; // px tolerance
      let target: number | null = null;

      if (dir > 0) {
        // Scrolling down — find next checkpoint below current position
        for (const cp of checkpoints.current) {
          if (cp > scrollY + threshold && cp < scrollY + window.innerHeight * 1.5) {
            target = cp;
            break;
          }
        }
      } else {
        // Scrolling up — find next checkpoint above current position
        for (let i = checkpoints.current.length - 1; i >= 0; i--) {
          const cp = checkpoints.current[i];
          if (cp < scrollY - threshold) {
            target = cp;
            break;
          }
        }
      }

      if (target !== null) {
        const distToTarget = Math.abs(target - scrollY);

        // Only intercept if we're close to crossing the checkpoint
        if (distToTarget < 400) {
          e.preventDefault();
          lockedAt.current = target;
          isAnimating.current = true;

          // Smooth scroll to checkpoint
          const start = scrollY;
          const diff = target - start;
          const duration = Math.min(500, Math.max(200, Math.abs(diff) * 2));
          let startTime: number | null = null;

          const ease = (t: number) => 1 - Math.pow(1 - t, 3);

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            window.scrollTo(0, start + diff * ease(progress));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              isAnimating.current = false;
              // Auto-unlock after delay so user isn't stuck
              if (unlockTimer.current) clearTimeout(unlockTimer.current);
              unlockTimer.current = setTimeout(() => {
                lockedAt.current = null;
              }, 2000);
            }
          };

          requestAnimationFrame(step);
        }
      }
    };

    // Touch handling
    let touchStartY = 0;
    let touchLocked = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchLocked = false;

      // If locked, next touch unlocks
      if (lockedAt.current !== null) {
        lockedAt.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }
      if (touchLocked) return;

      const touchY = e.touches[0].clientY;
      const dir = touchStartY - touchY > 0 ? 1 : -1;
      const scrollY = window.scrollY;
      const threshold = 60;

      let target: number | null = null;

      if (dir > 0) {
        for (const cp of checkpoints.current) {
          if (cp > scrollY + threshold && cp < scrollY + window.innerHeight) {
            target = cp;
            break;
          }
        }
      } else {
        for (let i = checkpoints.current.length - 1; i >= 0; i--) {
          const cp = checkpoints.current[i];
          if (cp < scrollY - threshold) {
            target = cp;
            break;
          }
        }
      }

      if (target !== null && Math.abs(target - scrollY) < 300) {
        touchLocked = true;
        lockedAt.current = target;
        isAnimating.current = true;

        const start = scrollY;
        const diff = target - start;
        const duration = Math.min(400, Math.max(150, Math.abs(diff) * 2));
        let startTime: number | null = null;

        const ease = (t: number) => 1 - Math.pow(1 - t, 3);

        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          window.scrollTo(0, start + diff * ease(progress));

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            isAnimating.current = false;
            if (unlockTimer.current) clearTimeout(unlockTimer.current);
            unlockTimer.current = setTimeout(() => {
              lockedAt.current = null;
              touchLocked = false;
            }, 1500);
          }
        };

        requestAnimationFrame(step);
      }
    };

    // wheel needs { passive: false } to call preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateCheckpoints);
      clearTimeout(recalcTimer);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, [selector, updateCheckpoints]);

  return null;
}
