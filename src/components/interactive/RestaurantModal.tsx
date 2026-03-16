'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Restaurant } from '@/lib/content';

export default function RestaurantModal({ restaurant, onClose }: { restaurant: Restaurant | null; onClose: () => void }) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (restaurant) {
      scrollPosRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
      setGalleryIndex(0);
      setIsRevealed(false);
      setShowScrollHint(true);
      setTimeout(() => setIsRevealed(true), 100);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      if (restaurant) window.scrollTo(0, scrollPosRef.current);
    };
  }, [restaurant]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  // Auto-rotate gallery
  useEffect(() => {
    if (!restaurant || restaurant.gallery.length <= 1) return;
    timerRef.current = setInterval(() => {
      setGalleryIndex(i => (i + 1) % restaurant.gallery.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restaurant]);

  const goTo = useCallback((idx: number) => {
    if (!restaurant) return;
    setGalleryIndex(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGalleryIndex(i => (i + 1) % restaurant.gallery.length);
    }, 4000);
  }, [restaurant]);

  const handleSwipe = useCallback((_: any, info: PanInfo) => {
    if (!restaurant || restaurant.gallery.length <= 1) return;
    if (info.offset.x < -50) goTo((galleryIndex + 1) % restaurant.gallery.length);
    else if (info.offset.x > 50) goTo((galleryIndex - 1 + restaurant.gallery.length) % restaurant.gallery.length);
  }, [restaurant, galleryIndex, goTo]);

  // Hide scroll hint on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fn = () => { if (el.scrollTop > 30) setShowScrollHint(false); };
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, [restaurant]);

  return (
    <AnimatePresence>
      {restaurant && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} className="fixed inset-0 z-[200]">
          <div className="fixed inset-0 bg-nc-black/[.97]" onClick={onClose} />

          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: isRevealed ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-0 bottom-0 w-[1px] bg-nc-gold/20 origin-top z-[1] pointer-events-none" />

          {/* Scroll container - explicit height fix */}
          <div ref={scrollRef}
            className="fixed inset-0 z-[3] overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', height: '100dvh' }}>

            {/* Sticky close */}
            <div className="sticky top-0 z-[20] flex justify-end p-3 pointer-events-none" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
              <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                onClick={onClose}
                className="pointer-events-auto w-11 h-11 flex items-center justify-center rounded-full bg-nc-black/80 border border-nc-gold/15 active:bg-nc-gold/20 hover:border-nc-gold/40 transition-all duration-300"
                aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#B8956A" strokeWidth="1.2" /></svg>
              </motion.button>
            </div>

            <div className="flex justify-center px-3 md:px-4 pb-12 -mt-11" onClick={onClose}>
              <motion.div
                initial={{ clipPath: 'inset(0 50% 0 50%)' }}
                animate={{ clipPath: isRevealed ? 'inset(0 0% 0 0%)' : 'inset(0 50% 0 50%)' }}
                exit={{ clipPath: 'inset(0 50% 0 50%)', transition: { duration: 0.4 } }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[700px] mt-14"
                onClick={(e) => e.stopPropagation()}>

                {/* Gallery — swipeable + auto-rotate */}
                <motion.div className="relative aspect-[16/10] md:aspect-[16/9] rounded-t overflow-hidden bg-nc-charcoal"
                  drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.3} onDragEnd={handleSwipe}
                  style={{ touchAction: 'pan-y' }}>
                  <div className="absolute inset-0 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div key={galleryIndex}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0, filter: 'brightness(0.3)' }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0">
                        {restaurant.gallery[galleryIndex]?.src ? (
                          <img src={restaurant.gallery[galleryIndex].src} alt={restaurant.gallery[galleryIndex].alt} className="w-full h-full object-cover" draggable={false} />
                        ) : (
                          <div className={`w-full h-full ${restaurant.image}`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-ui text-[9px] tracking-[3px] uppercase text-nc-slate/30">{restaurant.gallery[galleryIndex]?.alt}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.025]"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-nc-black/60 via-transparent to-nc-black/20 z-[4] pointer-events-none" />

                  {/* Dots */}
                  {restaurant.gallery.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[5] flex gap-3">
                      {restaurant.gallery.map((_, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); goTo(i); }} className="p-2">
                          <div className={`rounded-full transition-all duration-500 ${i === galleryIndex ? 'bg-nc-gold w-6 h-[3px]' : 'bg-white/25 w-2 h-2'}`} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Desktop arrows */}
                  {restaurant.gallery.length > 1 && (
                    <div className="hidden md:block">
                      <button onClick={(e) => { e.stopPropagation(); goTo((galleryIndex - 1 + restaurant.gallery.length) % restaurant.gallery.length); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-[5] w-9 h-9 rounded-full bg-nc-black/30 border border-white/[.06] flex items-center justify-center hover:bg-nc-gold/20 transition-all">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="white" strokeWidth="0.8" /></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); goTo((galleryIndex + 1) % restaurant.gallery.length); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-[5] w-9 h-9 rounded-full bg-nc-black/30 border border-white/[.06] flex items-center justify-center hover:bg-nc-gold/20 transition-all">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="white" strokeWidth="0.8" /></svg>
                      </button>
                    </div>
                  )}

                  <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                    className="absolute top-3 left-3 z-[5]">
                    <span className="font-ui text-[7px] md:text-[8px] tracking-[3px] uppercase text-nc-gold bg-nc-black/70 px-3 py-1.5 border-l-2 border-nc-gold/50">{restaurant.tag}</span>
                  </motion.div>
                </motion.div>

                {/* Body */}
                <div className="bg-nc-charcoal/95 rounded-b px-5 md:px-8 py-6 md:py-8 relative"
                  style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

                  {/* Mobile scroll hint */}
                  <AnimatePresence>
                    {showScrollHint && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 flex flex-col items-center z-[10]">
                        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-4 h-4 border-b border-r border-nc-gold/40 rotate-45" />
                        <span className="font-ui text-[7px] tracking-[2px] text-nc-gold/30 mt-1">SCROLL</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.7 }} className="mb-6">
                    <h2 className="font-bebas text-[clamp(26px,7vw,44px)] text-nc-white tracking-[.04em] leading-tight">{restaurant.name}</h2>
                    <p className="text-[12px] md:text-[13px] text-nc-silver/50 mt-1 tracking-wider">{restaurant.sub}</p>
                  </motion.div>

                  <motion.div initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }} className="mb-8">
                    <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver/75 leading-[2.2]">{restaurant.longDesc || restaurant.desc}</p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
                    {([
                      restaurant.address ? { label: 'ADDRESS', value: restaurant.address } : null,
                      restaurant.hours ? { label: 'HOURS', value: restaurant.hours } : null,
                      restaurant.phone ? { label: 'PHONE', value: restaurant.phone } : null,
                      restaurant.access ? { label: 'ACCESS', value: restaurant.access } : null,
                      restaurant.seats ? { label: 'SEATS', value: restaurant.seats } : null,
                      restaurant.style ? { label: 'STYLE', value: restaurant.style } : null,
                    ].filter((x): x is { label: string; value: string } => x !== null)).map((item, i) => (
                      <motion.div key={i}
                        initial={{ x: i % 2 === 0 ? -25 : 25, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
                        className="py-3 border-b border-white/[.03]">
                        <div className="font-ui text-[7px] md:text-[8px] tracking-[3px] uppercase text-nc-gold/40 mb-2">{item.label}</div>
                        <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver/65 leading-[1.9] whitespace-pre-line">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {restaurant.note && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                      className="text-[clamp(11px,2.8vw,13px)] text-nc-gold/40 leading-[2] mt-4 pt-4 border-t border-white/[.03]">{restaurant.note}</motion.p>
                  )}

                  {restaurant.link && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                      className="mt-6 pt-4 border-t border-white/[.03]">
                      <a href={restaurant.link}
                        className="inline-flex items-center gap-2 font-ui text-[10px] tracking-[3px] uppercase text-nc-gold/60 hover:text-nc-gold active:text-nc-gold transition-colors">
                        VIEW FULL SITE
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="0.8" /></svg>
                      </a>
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
