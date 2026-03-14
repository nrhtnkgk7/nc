'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Reveal, useReveal } from '@/components/shared/ScrollUtils';
import { aboutItems, chefs, restaurants, projects } from '@/lib/content';
import { TouchRipple, useScrollVelocity, TiltCard, ScrollProgressBar, AnimatedCounter } from '@/components/interactive/Effects';
import MagneticButton from '@/components/interactive/MagneticButton';
import TextScramble from '@/components/interactive/TextScramble';

/* ===== Horizontal slide — reduced distance on mobile ===== */
function SlideIn({ children, from = 'left', delay = 0, className = '' }: {
  children: React.ReactNode; from?: 'left' | 'right'; delay?: number; className?: string;
}) {
  const { ref, isVisible } = useReveal();
  const dir = from === 'left' ? -1 : 1;
  return (
    <div ref={ref} className={className} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : `translateX(${dir * 50}px)`,
      transition: `all 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ===== Marquee — Dual counter-scroll ===== */
function Marquee({ text, sub, speed = 18 }: { text: string; sub?: string; speed?: number }) {
  return (
    <div className="overflow-hidden py-3 md:py-4 border-y border-nc-gold/[.06] relative"
      style={{ background: 'linear-gradient(180deg, rgba(184,149,106,0.02) 0%, transparent 30%, transparent 70%, rgba(184,149,106,0.02) 100%)' }}>
      {/* Side fade masks */}
      <div className="absolute inset-y-0 left-0 w-12 md:w-16 bg-gradient-to-r from-nc-black to-transparent z-[2] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-16 bg-gradient-to-l from-nc-black to-transparent z-[2] pointer-events-none" />
      {/* Row 1: main text → left */}
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap will-change-transform relative z-[1]"
      >
        {[0, 1, 2, 3].map(i => (
          <span key={i} className="font-bebas text-[clamp(22px,4vw,42px)] text-nc-gold/[.35] tracking-[.08em] mx-5 md:mx-6">
            {text}
          </span>
        ))}
      </motion.div>
      {/* Row 2: sub text → right (counter direction) */}
      {sub && (
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: speed * 1.3, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap will-change-transform relative z-[1] mt-1"
        >
          {[0, 1, 2, 3].map(i => (
            <span key={i} className="font-ui text-[clamp(10px,2vw,16px)] text-nc-gold/[.18] tracking-[.15em] uppercase mx-5 md:mx-6">
              {sub}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ===== Back to top button ===== */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[90] w-10 h-10 rounded-full bg-nc-gold/10 border border-nc-gold/20 flex items-center justify-center backdrop-blur-sm hover:bg-nc-gold/20 transition-colors"
          aria-label="Back to top"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12V2M2 6L7 1L12 6" stroke="#B8956A" strokeWidth="1" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function PatternX() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const velocity = useScrollVelocity();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 300); }, []);

  return (
    <div>
      <ScrollProgressBar />
      <BackToTop />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="h-svh relative flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0 bg-[url('/images/hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-nc-black/15 via-nc-black/25 to-nc-black/70" />
        </motion.div>
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[-10%] right-[-15%] bg-nc-gold/[.06]" style={{ animationDuration: '25s' }} />
          <div className="mesh-orb w-[40vw] h-[40vw] bottom-[5%] left-[-10%] bg-nc-gold-dark/[.04]" style={{ animationDuration: '30s', animationDelay: '-8s' }} />
          <div className="mesh-orb w-[30vw] h-[30vw] top-[40%] left-[30%] bg-nc-gold/[.03]" style={{ animationDuration: '20s', animationDelay: '-4s' }} />
        </div>
        <TouchRipple className="z-[2]" />
        <motion.div style={{ opacity: heroOpacity }} className="relative z-[3] text-center px-4">
          <div className="font-ui text-[10px] tracking-[10px] uppercase text-nc-gold mb-8 md:mb-10">
            <TextScramble text="CREATIVE LAB" trigger={mounted} speed={30} />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-bebas text-[clamp(64px,18vw,160px)] text-nc-white tracking-[.06em] leading-[0.85]"
          >
            <TextScramble text="NO CODE" trigger={mounted} speed={28} />
          </motion.div>
          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}} transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="w-16 md:w-20 h-[1px] bg-nc-gold mx-auto mt-6 md:mt-8 mb-5 md:mb-6 origin-center" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }} className="font-light text-[clamp(12px,3vw,16px)] text-nc-gold/50 tracking-[clamp(2px,1vw,8px)]">
            「No Code」に生きていく
          </motion.p>
        </motion.div>
        <MagneticButton className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3]" strength={0.5}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex flex-col items-center gap-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-1 h-1 rounded-full bg-nc-gold" />
            <div className="w-[1px] h-8 bg-gradient-to-b from-nc-gold to-transparent" />
          </motion.div>
        </MagneticButton>
      </section>

      <Marquee text="NO CODE — CREATIVE LAB — CHEF+ — 食で未来を創る — NO CODE — CREATIVE LAB — CHEF+ — 食で未来を創る —" sub="Private Dining — Tokyo — Taipei — Bistro — Lamb Specialty — Chef+ — Private Dining — Tokyo — Taipei — Bistro — Lamb Specialty — Chef+ —" speed={18} />

      {/* ===== ABOUT ===== */}
      <section id="about" className="relative py-20 md:py-40 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[60vw] h-[60vw] top-[10%] right-[-20%] bg-nc-gold/[.08]" />
          <div className="mesh-orb w-[40vw] h-[40vw] bottom-[5%] left-[-10%] bg-nc-gold-dark/[.06]" style={{ animationDelay: '-6s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">About</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,72px)] text-nc-white tracking-[.06em]">ABOUT NO CODE</h2>
          </Reveal>
          <div className="mt-12 md:mt-24 flex flex-col gap-16 md:gap-32">
            {aboutItems.map((item, i) => (
              <AboutBlock key={i} item={item} index={i} velocity={velocity} />
            ))}
          </div>
        </div>
      </section>

      <Marquee text="FUMIO YONEZAWA — AKINORI HISAMATSU — JEAN-GEORGES — THE BURN — FUMIO YONEZAWA — AKINORI HISAMATSU —" sub="Owner Chef — Head Chef — Sustainability — Vegan Recipes — RED U-35 Gold — Owner Chef — Head Chef —" speed={15} />

      {/* ===== CHEF ===== */}
      <section id="chef" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[-10%] left-[50%] bg-[rgba(100,100,180,.06)]" style={{ animationDelay: '-3s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Chef</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,64px)] text-nc-white tracking-[.06em] mb-8 md:mb-16">OUR CHEFS</h2>
          </Reveal>
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            {chefs.map((c, i) => (
              <SlideIn key={i} from={i === 0 ? 'left' : 'right'} delay={i * 0.15} className="flex-1">
                <ChefBlock chef={c} />
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      <Marquee text="NO CODE 西麻布 — NY BISTRO — HITSUJI PUBLIC — NO CODE TAIPEI — NO CODE 西麻布 — NY BISTRO —" sub="Nishiazabu — Higashibu — Shibuya — Taipei Da'an — Nishiazabu — Higashibu — Shibuya — Taipei Da'an —" speed={20} />

      {/* ===== RESTAURANT ===== */}
      <section id="restaurant" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] bottom-[-10%] right-[-15%] bg-nc-gold/[.06]" />
        </div>
        <div className="relative z-[2] px-5 md:px-6 max-w-[600px] md:max-w-[1100px] mx-auto">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Restaurant</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,64px)] text-nc-white tracking-[.06em] mb-8 md:mb-14">OUR RESTAURANTS</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3" style={{
            transform: `perspective(800px) rotateX(${Math.min(velocity * 3, 2)}deg)`,
            transition: 'transform 0.2s linear',
          }}>
            {restaurants.map((r, i) => (
              <RestCard key={i} restaurant={r} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECT ===== */}
      <section id="project" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[45vw] h-[45vw] top-[20%] right-[-10%] bg-nc-gold/[.04]" style={{ animationDuration: '24s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Project</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,64px)] text-nc-white tracking-[.06em] mb-8 md:mb-14">PROJECTS</h2>
          </Reveal>
          <div className="flex flex-col gap-3 md:gap-4">
            {projects.map((p, i) => (
              <SlideIn key={i} from={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.06}>
                <ProjectRow project={p} />
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[20%] left-[-10%] bg-nc-gold/[.04]" style={{ animationDuration: '22s' }} />
        </div>
        <div className="relative z-[2] max-w-[500px] mx-auto px-5 md:px-6 text-center">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Contact</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-4">GET IN TOUCH</h2>
            <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver leading-[2.2] mb-8">
              食に関わる関わらないを問わず、<br />NoCodeにご依頼したいことがございましたらご連絡ください。
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <MagneticButton strength={0.3}>
              <button className="font-ui text-[10px] tracking-[4px] uppercase text-nc-white border border-nc-gold/30 px-8 md:px-10 py-4 hover:bg-nc-gold/10 active:bg-nc-gold/15 transition-colors duration-500">
                CONTACT US
              </button>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[.04] py-10 md:py-14 px-5 md:px-10">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0">
            <div>
              <div className="font-bebas text-[20px] tracking-[4px] text-nc-white mb-2">NO CODE</div>
              <p className="text-[11px] text-nc-slate leading-[1.8]">Creative Lab — 「No Code」に生きていく</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <nav className="flex flex-wrap gap-x-5 gap-y-2">
                {['About', 'Chef', 'Restaurant', 'Project', 'Contact'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="font-ui text-[9px] tracking-[2px] uppercase text-nc-slate hover:text-nc-gold transition-colors">
                    {item}
                  </a>
                ))}
              </nav>
              <div className="flex gap-5">
                {['Instagram', 'Facebook'].map(s => (
                  <a key={s} href="#" className="font-ui text-[9px] tracking-[2px] uppercase text-nc-slate hover:text-nc-gold transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/[.03] flex flex-col md:flex-row md:justify-between gap-2 text-[10px] text-nc-slate/60">
            <span>© 2026 No Code, Inc.</span>
            <a href="#" className="hover:text-nc-gold transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== ABOUT BLOCK ===== */
function AboutBlock({ item, index, velocity }: { item: typeof aboutItems[0]; index: number; velocity: number }) {
  const { ref, isVisible } = useReveal();
  const skew = Math.min(velocity * 3, 4) * (index % 2 === 0 ? -0.3 : 0.3);
  const fromDir = index % 2 === 0 ? 'left' : 'right';

  return (
    <div ref={ref}>
      <div className={`md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center ${index % 2 === 1 ? 'md:[direction:rtl] md:[&>*]:[direction:ltr]' : ''}`}>
        <SlideIn from={fromDir} delay={0} className="mb-5 md:mb-0">
          <TiltCard intensity={6}>
            <div className={`h-[52vw] md:h-[400px] rounded overflow-hidden relative ${item.image}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bebas text-white/[.04] text-[80px] md:text-[140px]">
                  <AnimatedCounter value={item.num} trigger={isVisible} />
                </span>
              </div>
              <div className="absolute bottom-3 right-4 font-ui text-[8px] tracking-[2px] text-white/10">{item.label}</div>
            </div>
          </TiltCard>
        </SlideIn>
        <SlideIn from={fromDir === 'left' ? 'right' : 'left'} delay={0.12}>
          <div style={{ transform: `skewY(${skew}deg)`, transition: 'transform 0.15s linear' }}>
            <span className="font-bebas text-[clamp(48px,14vw,100px)] text-nc-gold/[.06] leading-none block mb-[-8px] md:mb-[-12px]">{item.num}</span>
            <h3 className="font-medium text-[clamp(17px,4.5vw,22px)] text-nc-white tracking-wider mb-3 md:mb-4 leading-relaxed">
              {isVisible ? <TextScramble text={item.title} trigger={isVisible} speed={28} /> : item.title}
            </h3>
            <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver leading-[2.2] md:leading-[2.4]">{item.body}</p>
          </div>
        </SlideIn>
      </div>
    </div>
  );
}

/* ===== CHEF BLOCK ===== */
function ChefBlock({ chef }: { chef: typeof chefs[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <TiltCard intensity={5}>
      <div className="relative overflow-hidden rounded cursor-pointer" onClick={() => setOpen(!open)}>
        <motion.div className="h-[clamp(260px,55vw,420px)] relative" whileTap={{ scale: 0.98 }}>
          {chef.photo ? (
            <img src={chef.photo} alt={chef.nameJp} className="absolute inset-0 w-full h-full object-cover object-top" />
          ) : (
            <div className={`absolute inset-0 ${chef.image}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-nc-black/90 via-nc-black/30 to-transparent" />
          <span className="absolute bottom-[-8px] left-4 font-bebas text-[clamp(40px,11vw,80px)] text-white/[.06] tracking-wider pointer-events-none">{chef.hugeName}</span>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-[2]">
          <div className="font-ui text-[8px] md:text-[9px] tracking-[3px] uppercase text-nc-gold mb-1.5">{chef.role}</div>
          <div className="font-bebas text-[clamp(20px,5.5vw,32px)] text-nc-white mb-0.5">{chef.name}</div>
          <div className="text-[11px] md:text-xs text-nc-silver mb-2 md:mb-3">{chef.nameJp}</div>
          <motion.div animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
            <p className="text-[clamp(11px,2.8vw,13px)] text-nc-slate leading-[2] pb-2">{chef.bio}</p>
          </motion.div>
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="font-ui text-[7px] md:text-[8px] tracking-[2px] uppercase text-nc-gold/40">
            TAP FOR MORE
          </motion.span>
        </div>
      </div>
    </TiltCard>
  );
}

/* ===== RESTAURANT CARD — tap-friendly ===== */
function RestCard({ restaurant: r, index: i }: { restaurant: typeof restaurants[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Reveal delay={i * 0.08} animation="scale">
      <TiltCard intensity={4}>
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="bg-white/[.02] rounded overflow-hidden relative cursor-pointer"
          onClick={() => setExpanded(!expanded)}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <div className={`h-[clamp(120px,26vw,200px)] ${r.image} relative overflow-hidden`}>
            <motion.div
              animate={{ scale: expanded ? 1.06 : 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-inherit"
            />
            <span className="absolute bottom-2 left-3 font-bebas text-[28px] md:text-[32px] text-white/[.04] relative z-[1]">{String(i + 1).padStart(2, '0')}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-nc-black/40 to-transparent z-[1]" />
          </div>
          <div className="p-3 md:p-4">
            <div className="font-ui text-[6px] md:text-[7px] tracking-[2px] uppercase text-nc-gold mb-1">{r.tag}</div>
            <div className="font-bebas text-[clamp(14px,3.6vw,22px)] text-nc-white leading-tight">{r.name}</div>
            <div className="text-[9px] md:text-[10px] text-nc-slate mb-1">{r.sub}</div>
            <AnimatePresence>
              {expanded && r.address && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 mt-1 border-t border-nc-gold/[.08]">
                    <p className="text-[8px] md:text-[9px] text-nc-slate leading-[1.7]">{r.address}</p>
                    {r.hours && <p className="text-[8px] md:text-[9px] text-nc-slate leading-[1.7]">{r.hours}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </TiltCard>
    </Reveal>
  );
}

/* ===== PROJECT ROW ===== */
function ProjectRow({ project: p }: { project: typeof projects[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="flex items-center gap-3 md:gap-6 p-3 md:p-5 bg-white/[.02] rounded border border-nc-gold/[.04] cursor-pointer group hover:border-nc-gold/[.12] active:border-nc-gold/[.15] transition-colors duration-500"
      onClick={() => setExpanded(!expanded)}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex-shrink-0 w-[clamp(40px,11vw,56px)] h-[clamp(40px,11vw,56px)] rounded bg-nc-gold/[.06] flex items-center justify-center">
        <span className="font-bebas text-[clamp(14px,3.5vw,20px)] text-nc-gold/60">{p.year}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bebas text-[clamp(14px,3.8vw,22px)] text-nc-white leading-tight truncate">{p.title}</div>
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="text-[clamp(11px,2.8vw,13px)] text-nc-silver leading-[2] mt-1">{p.desc}</p>
              {p.client && <p className="text-[10px] text-nc-slate mt-1">Client: {p.client}</p>}
            </motion.div>
          ) : (
            <p className="text-[10px] md:text-[11px] text-nc-slate truncate">{p.desc}</p>
          )}
        </AnimatePresence>
      </div>
      <motion.div animate={{ rotate: expanded ? 90 : 0 }} className="flex-shrink-0 text-nc-gold/30 group-hover:text-nc-gold/60 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1" /></svg>
      </motion.div>
    </motion.div>
  );
}
