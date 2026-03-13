'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Reveal, useReveal } from '@/components/shared/ScrollUtils';
import { aboutItems, chefs, restaurants } from '@/lib/content';
import { TouchRipple, TiltCard, SplitText, ScrollProgressBar, useScrollVelocity } from '@/components/interactive/Effects';
import TextScramble from '@/components/interactive/TextScramble';
import MagneticButton from '@/components/interactive/MagneticButton';

export default function PatternY() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroRotate = useTransform(scrollYProgress, [0, 1], [0, 2]);
  const velocity = useScrollVelocity();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 300); }, []);

  return (
    <div>
      <ScrollProgressBar />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="h-svh relative flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale, rotate: heroRotate }} className="absolute inset-0 z-0 bg-[url('/images/hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-nc-black/10 via-nc-black/20 to-nc-black/80" />
        </motion.div>

        <TouchRipple className="z-[2]" />

        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="mesh-orb w-[70vw] h-[70vw] top-[-20%] right-[-30%] bg-nc-gold/[.05]" style={{ animationDuration: '18s' }} />
          <div className="mesh-orb w-[50vw] h-[50vw] bottom-[-10%] left-[-20%] bg-nc-gold-dark/[.03]" style={{ animationDuration: '22s', animationDelay: '-7s' }} />
        </div>

        {/* Animated frame border */}
        <div className="absolute inset-4 md:inset-6 border border-nc-gold/[.04] z-[2] pointer-events-none">
          <motion.div initial={{ width: 0 }} animate={mounted ? { width: '40%' } : {}} transition={{ delay: 1, duration: 2, ease: [0.16, 1, 0.3, 1] }} className="absolute top-[-1px] left-1/2 -translate-x-1/2 h-[1px] bg-nc-gold/60" />
          <motion.div initial={{ width: 0 }} animate={mounted ? { width: '30%' } : {}} transition={{ delay: 1.3, duration: 2, ease: [0.16, 1, 0.3, 1] }} className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 h-[1px] bg-nc-gold/60" />
          <motion.div initial={{ height: 0 }} animate={mounted ? { height: '20%' } : {}} transition={{ delay: 1.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-[1px] bg-nc-gold/30" />
          <motion.div initial={{ height: 0 }} animate={mounted ? { height: '20%' } : {}} transition={{ delay: 1.7, duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="absolute right-[-1px] top-1/2 -translate-y-1/2 w-[1px] bg-nc-gold/30" />
        </div>

        {/* Title */}
        <div className="relative z-[3] text-center">
          <div className="overflow-hidden">
            {['NO', 'CODE'].map((word, wi) => (
              <div key={wi} className="overflow-hidden">
                <motion.span initial={{ y: '110%' }} animate={mounted ? { y: 0 } : {}} transition={{ delay: 0.3 + wi * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-bebas text-[clamp(56px,16vw,120px)] text-nc-white tracking-[.08em] leading-[0.88]">{word}</motion.span>
              </div>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
            className="mt-6 font-light text-[clamp(11px,3vw,15px)] text-nc-gold/40 tracking-[clamp(3px,1vw,6px)]">
            「No Code」に生きていく
          </motion.p>
        </div>

        {['top-4 left-4', 'top-4 right-4 rotate-90', 'bottom-4 right-4 rotate-180', 'bottom-4 left-4 -rotate-90'].map((pos, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 2 + i * 0.1 }}
            className={`absolute ${pos} w-4 h-4 border-l border-t border-nc-gold/20 z-[3]`} />
        ))}
      </section>

      {/* ===== ABOUT — Scroll-triggered cards ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[60vw] h-[60vw] top-[20%] left-[-20%] bg-nc-gold/[.06]" style={{ animationDuration: '20s' }} />
        </div>
        <div className="relative z-[2] py-20 md:py-32 px-6 max-w-[600px] md:max-w-[1100px] mx-auto">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">About</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-12 md:mb-20">ABOUT NO CODE</h2>
          </Reveal>
          <ScrollCards items={aboutItems} />
        </div>
      </section>

      {/* ===== CHEF — Tilt cards ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] top-0 right-[-10%] bg-[rgba(100,80,160,.05)]" style={{ animationDuration: '16s' }} />
        </div>
        <div className="relative z-[2] px-6 max-w-[1100px] mx-auto">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Chef</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-10">OUR CHEFS</h2>
          </Reveal>
          <div className="flex flex-col md:flex-row gap-4">
            {chefs.map((chef, i) => (
              <Reveal key={i} delay={i * 0.15} className="flex-1">
                <TiltCard intensity={8}>
                  <div className="flex gap-4 p-5 bg-white/[.02] rounded-md border border-nc-gold/[.05] active:border-nc-gold/20 transition-colors">
                    <div className={`w-[clamp(90px,24vw,120px)] h-[clamp(110px,30vw,150px)] flex-shrink-0 rounded ${chef.image}`} />
                    <div className="flex flex-col justify-center">
                      <div className="font-ui text-[8px] tracking-[3px] uppercase text-nc-gold mb-1.5">{chef.role}</div>
                      <div className="font-bebas text-[clamp(20px,5vw,26px)] text-nc-white mb-0.5">{chef.name}</div>
                      <div className="text-[11px] text-nc-silver mb-2">{chef.nameJp}</div>
                      <p className="text-[clamp(10px,2.8vw,12px)] text-nc-slate leading-[1.9]">{chef.bio}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESTAURANT ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="relative z-[2] px-6 max-w-[1100px] mx-auto">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Restaurant</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-10">OUR RESTAURANTS</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ transform: `skewY(${Math.min(velocity * 2, 2) * -0.5}deg)`, transition: 'transform 0.2s linear' }}>
            {restaurants.map((r, i) => (
              <Reveal key={i} delay={i * 0.08} animation="scale">
                <TiltCard intensity={4}>
                  <motion.div whileTap={{ scale: 0.95 }} className="bg-white/[.02] rounded overflow-hidden">
                    <div className={`h-[clamp(130px,28vw,180px)] ${r.image} relative`}>
                      <span className="absolute bottom-2 left-3 font-bebas text-[32px] text-white/[.04]">{String(i+1).padStart(2,'0')}</span>
                    </div>
                    <div className="p-3">
                      <div className="font-ui text-[7px] tracking-[2px] uppercase text-nc-gold mb-1">{r.tag}</div>
                      <div className="font-bebas text-[clamp(15px,3.8vw,20px)] text-nc-white leading-tight">{r.name}</div>
                      <div className="text-[10px] text-nc-slate">{r.sub}</div>
                    </div>
                  </motion.div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[.03] py-8 px-6 text-center text-[10px] text-nc-slate">© 2026 No Code, Inc.</footer>
    </div>
  );
}

/* Scroll-triggered About cards: auto-advance as user scrolls */
function ScrollCards({ items }: { items: typeof aboutItems }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const idx = Math.min(Math.floor(v * items.length), items.length - 1);
      setActiveIndex(Math.max(0, idx));
    });
    return unsubscribe;
  }, [scrollYProgress, items.length]);

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: `${items.length * 60}vh` }}>
      {/* Sticky card display */}
      <div className="sticky top-[20vh] md:top-[15vh]">
        <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
          {/* Image side */}
          <div className="relative h-[50vw] md:h-[400px] rounded overflow-hidden mb-6 md:mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute inset-0 ${items[activeIndex].image}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bebas text-white/[.04] text-[100px] md:text-[140px]">{items[activeIndex].num}</span>
                </div>
                <div className="absolute bottom-3 right-4 font-ui text-[8px] tracking-[2px] text-white/10">{items[activeIndex].label}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text side */}
          <div>
            {/* Progress dots */}
            <div className="flex gap-3 mb-6">
              {items.map((_, i) => (
                <div key={i} className={`h-[2px] transition-all duration-500 ${i === activeIndex ? 'w-8 bg-nc-gold' : 'w-3 bg-nc-gold/20'}`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-bebas text-[clamp(48px,14vw,80px)] text-nc-gold/[.06] leading-none block mb-[-8px]">{items[activeIndex].num}</span>
                <h3 className="font-medium text-[clamp(18px,4.5vw,22px)] text-nc-white tracking-wider mb-4 leading-relaxed">
                  {items[activeIndex].title}
                </h3>
                <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver leading-[2.4]">
                  {items[activeIndex].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
