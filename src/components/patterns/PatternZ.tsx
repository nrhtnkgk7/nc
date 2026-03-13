'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Reveal, useReveal } from '@/components/shared/ScrollUtils';
import { aboutItems, chefs, restaurants } from '@/lib/content';
import { TouchRipple, TiltCard, SplitText, ScrollProgressBar, AnimatedCounter, useScrollVelocity } from '@/components/interactive/Effects';
import TextScramble from '@/components/interactive/TextScramble';

export default function PatternZ() {
  const [mounted, setMounted] = useState(false);
  const velocity = useScrollVelocity();
  useEffect(() => { setTimeout(() => setMounted(true), 300); }, []);

  return (
    <div>
      <ScrollProgressBar />

      {/* ===== HERO ===== */}
      <section className="h-svh relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('/images/hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-nc-black/10 via-nc-black/25 to-nc-black/70" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="mesh-orb w-[45vw] h-[45vw] top-[-10%] right-[-10%] bg-nc-gold/[.05]" style={{ animationDuration: '22s' }} />
          <div className="mesh-orb w-[35vw] h-[35vw] bottom-[10%] left-[-8%] bg-nc-gold-dark/[.04]" style={{ animationDuration: '28s', animationDelay: '-6s' }} />
        </div>

        <TouchRipple className="z-[2]" />

        {/* Grid structure lines */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {[20, 40, 60, 80].map(p => <div key={`h${p}`} className="absolute left-0 right-0 h-[1px] bg-nc-gold/[.03]" style={{ top: `${p}%` }} />)}
          {[16.6, 33.2, 49.8, 66.4, 83].map(p => <div key={`v${p}`} className="absolute top-0 bottom-0 w-[1px] bg-nc-gold/[.03]" style={{ left: `${p}%` }} />)}
        </div>

        {/* Title */}
        <div className="relative z-[3] text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.8 }}
            className="font-ui text-[9px] tracking-[8px] uppercase text-nc-gold/60 mb-8">
            <TextScramble text="CREATIVE LAB" trigger={mounted} speed={15} />
          </motion.div>
          <div className="overflow-hidden">
            <SplitText text="NO CODE" trigger={mounted} charClassName="font-bebas text-[clamp(68px,20vw,180px)] text-nc-white tracking-[.06em] leading-[0.85]" staggerDelay={0.04} initialDelay={0.15} />
          </div>
          <motion.div initial={{ height: 0 }} animate={mounted ? { height: 60 } : {}} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-[1px] bg-nc-gold mx-auto mt-6 mb-5" />
          <motion.p initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.9 }}
            className="font-light text-[clamp(11px,3vw,15px)] text-nc-gold/40 tracking-[clamp(3px,1vw,8px)]">
            「No Code」に生きていく
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-1.5">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-3 h-3 border-r border-b border-nc-slate rotate-45" />
          <span className="font-ui text-[8px] tracking-[3px] uppercase text-nc-slate mt-1">SCROLL</span>
        </motion.div>
      </section>

      {/* ===== ABOUT — Full-screen sections ===== */}
      {aboutItems.map((item, i) => (
        <AboutSection key={i} item={item} index={i} />
      ))}

      {/* ===== CHEF ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[60vw] h-[60vw] top-[-10%] left-[-10%] bg-[rgba(100,80,160,.04)]" style={{ animationDuration: '22s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Chef</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-8 md:mb-12">OUR CHEFS</h2>
          </Reveal>
          <div className="flex flex-col md:flex-row gap-4">
            {chefs.map((chef, i) => (
              <Reveal key={i} delay={i * 0.12} className="flex-1">
                <TiltCard intensity={6}>
                  <div className="flex gap-4 p-5 bg-white/[.02] rounded-md border border-nc-gold/[.05]">
                    <div className={`w-[clamp(80px,22vw,110px)] h-[clamp(100px,28vw,140px)] flex-shrink-0 rounded ${chef.image} relative`}>
                      <span className="absolute bottom-1 right-2 font-bebas text-[20px] text-white/[.06]">{chef.hugeName?.slice(0, 3)}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="font-ui text-[8px] tracking-[3px] uppercase text-nc-gold mb-1.5">{chef.role}</div>
                      <div className="font-bebas text-[clamp(18px,4.5vw,24px)] text-nc-white mb-0.5">{chef.name}</div>
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
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Restaurant</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-8 md:mb-12">RESTAURANTS</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ transform: `perspective(800px) rotateX(${Math.min(velocity * 3, 2)}deg)`, transition: 'transform 0.2s linear' }}>
            {restaurants.map((r, i) => (
              <Reveal key={i} delay={i * 0.08} animation="scale">
                <motion.div whileTap={{ scale: 0.95, rotateZ: -1 }} className="bg-white/[.02] rounded overflow-hidden">
                  <div className={`h-[clamp(110px,24vw,150px)] ${r.image} relative`}>
                    <span className="absolute bottom-2 left-3 font-bebas text-[28px] text-white/[.04]">{String(i+1).padStart(2,'0')}</span>
                  </div>
                  <div className="p-3">
                    <div className="font-ui text-[7px] tracking-[2px] uppercase text-nc-gold mb-1">{r.tag}</div>
                    <div className="font-bebas text-[clamp(13px,3.5vw,18px)] text-nc-white leading-tight">{r.name}</div>
                    <div className="text-[9px] text-nc-slate">{r.sub}</div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[.03] py-8 px-6 text-center text-[10px] text-nc-slate">© 2026 No Code, Inc.</footer>
    </div>
  );
}

function AboutSection({ item, index }: { item: typeof aboutItems[0]; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);
  const bgX = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -30 : 30, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] md:min-h-screen flex flex-col justify-center overflow-hidden px-6 py-20">
      {/* Mesh orb */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="mesh-orb w-[55vw] h-[55vw] bg-nc-gold/[.05]"
          style={{ top: index === 0 ? '15%' : index === 1 ? '45%' : '10%', left: index === 1 ? 'auto' : '-15%', right: index === 1 ? '-15%' : 'auto', animationDelay: `${-index * 5}s`, animationDuration: '20s' }} />
      </div>

      {/* Massive number watermark */}
      <motion.div
        style={{ x: bgX }}
        className="absolute font-bebas text-[clamp(180px,45vw,400px)] text-nc-gold/[.02] leading-none pointer-events-none z-0"
        style={{ top: '-3vh', left: index % 2 === 0 ? '-3vw' : 'auto', right: index % 2 === 1 ? '-3vw' : 'auto' }}>
        {item.num}
      </motion.div>

      <div className="relative z-[2] max-w-[600px] md:max-w-[1000px] mx-auto w-full">
        <div className={`md:grid md:grid-cols-2 md:gap-16 md:items-center ${index % 2 === 1 ? 'md:[direction:rtl] md:[&>*]:[direction:ltr]' : ''}`}>
          <Reveal>
            <TiltCard intensity={4}>
              <div className={`h-[clamp(200px,50vw,360px)] rounded overflow-hidden relative ${item.image}`}>
                <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bebas text-white/[.03] text-[80px]">{item.label}</span>
                  </div>
                </motion.div>
                <div className="absolute top-4 left-4 font-bebas text-[28px] text-nc-gold/10">
                  <AnimatedCounter value={item.num} trigger={true} />
                </div>
              </div>
            </TiltCard>
          </Reveal>

          <div className="mt-8 md:mt-0">
            <Reveal delay={0.1}>
              <span className="font-bebas text-[clamp(48px,14vw,80px)] text-nc-gold/[.06] leading-none block mb-[-8px]">{item.num}</span>
              <h3 className="font-medium text-[clamp(18px,4.5vw,22px)] text-nc-white tracking-wider mb-4 leading-relaxed">{item.title}</h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver leading-[2.3]">{item.body}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
