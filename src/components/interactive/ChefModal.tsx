'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Chef } from '@/lib/content';

function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-[1]">{text}</span>
      <motion.span className="absolute inset-0 text-nc-gold/30 z-0"
        animate={{ x: [0, -3, 2, -1, 0], y: [0, 1, -2, 1, 0] }}
        transition={{ duration: 0.3, delay: 1.2, ease: 'easeInOut' }}
        aria-hidden>{text}</motion.span>
    </span>
  );
}

export default function ChefModal({ chef, onClose }: { chef: Chef | null; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    if (chef) {
      scrollPosRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
      setImgIndex(0); setIsRevealed(false); setShowScrollHint(true);
      setTimeout(() => setIsRevealed(true), 100);
    }
    return () => {
      document.body.style.position = ''; document.body.style.top = '';
      document.body.style.left = ''; document.body.style.right = '';
      document.body.style.overflow = ''; document.body.style.width = '';
      if (chef) window.scrollTo(0, scrollPosRef.current);
    };
  }, [chef]);

  useEffect(() => {
    if (!chef || chef.gallery.length <= 1) return;
    timerRef.current = setInterval(() => setImgIndex(i => (i + 1) % chef.gallery.length), 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [chef]);

  const goTo = useCallback((idx: number) => {
    if (!chef) return; setImgIndex(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setImgIndex(i => (i + 1) % chef.gallery.length), 3500);
  }, [chef]);

  const handleSwipe = useCallback((_: any, info: PanInfo) => {
    if (!chef || chef.gallery.length <= 1) return;
    if (info.offset.x < -50) goTo((imgIndex + 1) % chef.gallery.length);
    else if (info.offset.x > 50) goTo((imgIndex - 1 + chef.gallery.length) % chef.gallery.length);
  }, [chef, imgIndex, goTo]);

  useEffect(() => { const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn); }, [onClose]);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const fn = () => { if (el.scrollTop > 30) setShowScrollHint(false); };
    el.addEventListener('scroll', fn, { passive: true }); return () => el.removeEventListener('scroll', fn);
  }, [chef]);

  /*
   * 3-STEP TIMING:
   * Step 1 (0–0.8s):  Split line, clip-path reveal, gallery image
   * Step 2 (0.8–1.5s): Close button, role badge, name, subtitle, philosophy
   * Step 3 (1.8–3s+):  Biography, career timeline (each row staggered)
   */

  return (
    <AnimatePresence>
      {chef && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} className="fixed inset-0 z-[200]">
          <div className="fixed inset-0 bg-nc-black/[.97]" onClick={onClose} />

          {/* STEP 1: Split line */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: isRevealed ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-0 right-0 h-[1px] bg-nc-gold/30 origin-left z-[1] pointer-events-none" />

          <div ref={scrollRef} className="fixed inset-0 z-[3] overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', height: '100dvh' }}>

            {/* Flush to top — no sticky header gap */}
            <div className="flex justify-center px-3 md:px-4 pb-12" onClick={onClose}
              style={{ paddingTop: 'max(6px, env(safe-area-inset-top))' }}>
              <motion.div
                initial={{ clipPath: 'inset(50% 0 50% 0)' }}
                animate={{ clipPath: isRevealed ? 'inset(0% 0 0% 0)' : 'inset(50% 0 50% 0)' }}
                exit={{ clipPath: 'inset(50% 0 50% 0)', transition: { duration: 0.6 } }}
                transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[720px]"
                onClick={(e) => e.stopPropagation()}>

                {/* STEP 1: Gallery */}
                <motion.div className="relative aspect-[4/3] md:aspect-[16/10] rounded-t overflow-hidden bg-nc-charcoal"
                  drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.3} onDragEnd={handleSwipe}
                  style={{ touchAction: 'pan-y' }}>
                  <div className="absolute inset-0 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div key={imgIndex}
                        initial={{ scale: 1.15, opacity: 0, filter: 'brightness(2) saturate(0)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'brightness(1) saturate(1)' }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0">
                        {chef.gallery[imgIndex]?.src ? (
                          <img src={chef.gallery[imgIndex].src} alt={chef.gallery[imgIndex].alt} className="w-full h-full object-cover object-top" draggable={false} />
                        ) : (
                          <div className={`w-full h-full ${chef.image}`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-ui text-[9px] tracking-[3px] uppercase text-nc-slate/30">{chef.gallery[imgIndex]?.alt}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-nc-black/70 via-transparent to-nc-black/30 z-[4] pointer-events-none" />

                  {/* STEP 2: Close button — overlaid on image */}
                  <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-3 right-3 z-[10] w-11 h-11 flex items-center justify-center rounded-full bg-nc-black/60 border border-nc-gold/15 active:bg-nc-gold/20 hover:border-nc-gold/40 transition-all duration-300" aria-label="Close">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#B8956A" strokeWidth="1.2" /></svg>
                  </motion.button>

                  {chef.gallery.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[5] flex gap-3">
                      {chef.gallery.map((_, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); goTo(i); }} className="p-2">
                          <div className={`rounded-full transition-all duration-500 ${i === imgIndex ? 'bg-nc-gold w-6 h-[3px]' : 'bg-white/25 w-2 h-2'}`} />
                        </button>
                      ))}
                    </div>
                  )}
                  {chef.gallery.length > 1 && (
                    <div className="hidden md:block">
                      <button onClick={(e) => { e.stopPropagation(); goTo((imgIndex - 1 + chef.gallery.length) % chef.gallery.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 z-[5] w-9 h-9 rounded-full bg-nc-black/30 border border-white/[.06] flex items-center justify-center hover:bg-nc-gold/20 transition-all"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="white" strokeWidth="0.8" /></svg></button>
                      <button onClick={(e) => { e.stopPropagation(); goTo((imgIndex + 1) % chef.gallery.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 z-[5] w-9 h-9 rounded-full bg-nc-black/30 border border-white/[.06] flex items-center justify-center hover:bg-nc-gold/20 transition-all"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="white" strokeWidth="0.8" /></svg></button>
                    </div>
                  )}

                  {/* STEP 2: Role badge */}
                  <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.9 }}
                    className="absolute top-3 left-3 z-[5]">
                    <span className="font-ui text-[7px] md:text-[8px] tracking-[3px] uppercase text-nc-gold bg-nc-black/70 px-3 py-1.5 border-l-2 border-nc-gold/50">{chef.role}</span>
                  </motion.div>
                </motion.div>

                {/* Body */}
                <div className="bg-nc-charcoal/95 rounded-b px-5 md:px-8 py-6 md:py-8 relative" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>
                  <AnimatePresence>{showScrollHint && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-4">
                      <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-3.5 h-3.5 border-b border-r border-nc-gold/40 rotate-45" />
                      <span className="font-ui text-[7px] tracking-[2px] text-nc-gold/30 mt-2">SCROLL</span>
                    </motion.div>
                  )}</AnimatePresence>

                  {/* STEP 2: Name (0.8s) */}
                  <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="mb-6">
                    <h2 className="font-bebas text-[clamp(28px,8vw,50px)] text-nc-white tracking-[.04em] leading-tight"><GlitchText text={chef.name} /></h2>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
                      className="text-[13px] md:text-[14px] text-nc-silver/60 mt-1 tracking-[3px]">{chef.nameJp}</motion.p>
                  </motion.div>

                  {/* STEP 2: Philosophy (1.3s) */}
                  {chef.philosophy && (
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.3, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-8 pl-4 border-l-2 border-nc-gold/25">
                      <p className="font-light text-[clamp(13px,3.5vw,17px)] text-nc-gold/50 leading-[2] italic">「{chef.philosophy}」</p>
                    </motion.div>
                  )}

                  {/* STEP 3: Biography (1.8s) */}
                  <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
                    <h3 className="font-ui text-[9px] tracking-[4px] uppercase text-nc-gold/40 mb-4">BIOGRAPHY</h3>
                    <div className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver/70 leading-[2.4] whitespace-pre-line">{chef.longBio}</div>
                  </motion.div>

                  {/* STEP 3: Career (2.3s+) */}
                  {chef.career.length > 0 && (
                    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                      <h3 className="font-ui text-[9px] tracking-[4px] uppercase text-nc-gold/40 mb-5">CAREER</h3>
                      <div className="relative">
                        <div className="absolute left-[24px] md:left-[36px] top-2 bottom-2 w-[1px] bg-nc-gold/[.06]" />
                        {chef.career.map((item, i) => (
                          <motion.div key={i} initial={{ x: -25, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 2.5 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="flex gap-3 md:gap-5 mb-4 last:mb-0 relative">
                            <div className="flex-shrink-0 w-[48px] md:w-[72px] text-right pr-2 md:pr-4 pt-0.5">
                              <span className="font-bebas text-[clamp(13px,3.5vw,17px)] text-nc-gold/25">{item.year}</span>
                            </div>
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-nc-gold/20 border border-nc-gold/40 mt-2 relative z-[1]" />
                            <p className="flex-1 font-light text-[clamp(12px,3vw,14px)] text-nc-silver/60 leading-[1.9] pt-0.5">{item.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
