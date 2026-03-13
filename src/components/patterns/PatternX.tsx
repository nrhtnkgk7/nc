'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Reveal, useReveal } from '@/components/shared/ScrollUtils';
import { aboutItems, chefs, restaurants } from '@/lib/content';
import { TouchRipple, useScrollVelocity, TiltCard, SplitText, ScrollProgressBar, AnimatedCounter } from '@/components/interactive/Effects';
import MagneticButton from '@/components/interactive/MagneticButton';
import TextScramble from '@/components/interactive/TextScramble';

/* ===== Horizontal slide wrapper ===== */
function SlideIn({ children, from = 'left', delay = 0, className = '' }: {
  children: React.ReactNode; from?: 'left' | 'right'; delay?: number; className?: string;
}) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : `translateX(${from === 'left' ? '-80px' : '80px'})`,
      transition: `all 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ===== Marquee ticker ===== */
function Marquee({ text, speed = 30 }: { text: string; speed?: number }) {
  return (
    <div className="overflow-hidden py-6 border-y border-nc-gold/[.04]">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[0, 1].map(i => (
          <span key={i} className="font-bebas text-[clamp(28px,5vw,48px)] text-nc-gold/[.06] tracking-[.1em] mx-8">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
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

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="h-svh relative flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0 bg-[url('/images/hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-nc-black/15 via-nc-black/25 to-nc-black/70" />
        </motion.div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[-10%] right-[-15%] bg-nc-gold/[.06]" style={{ animationDuration: '25s' }} />
          <div className="mesh-orb w-[40vw] h-[40vw] bottom-[5%] left-[-10%] bg-nc-gold-dark/[.04]" style={{ animationDuration: '30s', animationDelay: '-8s' }} />
          <div className="mesh-orb w-[30vw] h-[30vw] top-[40%] left-[30%] bg-nc-gold/[.03]" style={{ animationDuration: '20s', animationDelay: '-4s' }} />
        </div>

        <TouchRipple className="z-[2]" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-[3] text-center">
          <div className="font-ui text-[10px] tracking-[10px] uppercase text-nc-gold mb-10">
            <TextScramble text="CREATIVE LAB" trigger={mounted} speed={15} />
          </div>
          <div className="overflow-hidden">
            <SplitText text="NO CODE" trigger={mounted} charClassName="font-bebas text-[clamp(64px,18vw,160px)] text-nc-white tracking-[.06em] leading-[0.85]" staggerDelay={0.04} initialDelay={0.15} />
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}} transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="w-20 h-[1px] bg-nc-gold mx-auto mt-8 mb-6 origin-center" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }} className="font-light text-[clamp(12px,3vw,16px)] text-nc-gold/50 tracking-[clamp(3px,1vw,8px)]">
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

      {/* ===== MARQUEE ===== */}
      <Marquee text="NO CODE — CREATIVE LAB — CHEF+ — 食で未来を創る — NO CODE — CREATIVE LAB — CHEF+ — 食で未来を創る —" speed={40} />

      {/* ===== ABOUT ===== */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[60vw] h-[60vw] top-[10%] right-[-20%] bg-nc-gold/[.08]" />
          <div className="mesh-orb w-[40vw] h-[40vw] bottom-[5%] left-[-10%] bg-nc-gold-dark/[.06]" style={{ animationDelay: '-6s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">About</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,72px)] text-nc-white tracking-[.06em]">ABOUT NO CODE</h2>
          </Reveal>
          <div className="mt-16 md:mt-24 flex flex-col gap-20 md:gap-32">
            {aboutItems.map((item, i) => (
              <AboutBlock key={i} item={item} index={i} velocity={velocity} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <Marquee text="FUMIO YONEZAWA — AKINORI HISAMATSU — JEAN-GEORGES — THE BURN — FUMIO YONEZAWA — AKINORI HISAMATSU —" speed={35} />

      {/* ===== CHEF ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[-10%] left-[50%] bg-[rgba(100,100,180,.06)]" style={{ animationDelay: '-3s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Chef</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,64px)] text-nc-white tracking-[.06em] mb-10 md:mb-16">OUR CHEFS</h2>
          </Reveal>
          <div className="flex flex-col md:flex-row gap-5">
            {chefs.map((c, i) => (
              <SlideIn key={i} from={i === 0 ? 'left' : 'right'} delay={i * 0.15} className="flex-1">
                <ChefBlock chef={c} />
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <Marquee text="NO CODE 西麻布 — NY BISTRO — HITSUJI PUBLIC — NO CODE TAIPEI — NO CODE 西麻布 — NY BISTRO — HITSUJI PUBLIC — NO CODE TAIPEI —" speed={45} />

      {/* ===== RESTAURANT (Z-style grid) ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] bottom-[-10%] right-[-15%] bg-nc-gold/[.06]" />
        </div>
        <div className="relative z-[2] px-6 max-w-[600px] md:max-w-[1100px] mx-auto">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Restaurant</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,64px)] text-nc-white tracking-[.06em] mb-10 md:mb-14">OUR RESTAURANTS</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{
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
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="relative z-[2] max-w-[600px] md:max-w-[1100px] mx-auto px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Project</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,64px)] text-nc-white tracking-[.06em] mb-10 md:mb-14">PROJECTS</h2>
          </Reveal>
          <div className="flex flex-col gap-4">
            {[
              { title: 'HOTEL THE MITSUI「FORNI」', desc: '5ツ星ラグジュアリーホテルのイタリアンダイニングにて薪窯グリルのレシピ開発', year: '2023' },
              { title: 'ヱスジ苑（SGN）', desc: '「禁牛法」コンセプトのサステナブルヤキニクのメニュー開発', year: '2023' },
              { title: '白井屋ホテル「the LOUNGE」', desc: 'アートディスティネーション・ホテルのオールデイダイニング監修', year: '2023' },
              { title: 'Purple Carrot', desc: 'Oisixヴィーガンブランドのフードプロデュース', year: '2022' },
            ].map((p, i) => (
              <SlideIn key={i} from={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.08}>
                <ProjectRow project={p} index={i} />
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[20%] left-[-10%] bg-nc-gold/[.04]" style={{ animationDuration: '22s' }} />
        </div>
        <div className="relative z-[2] max-w-[500px] mx-auto px-6 text-center">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-gold mb-3">Contact</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-4">GET IN TOUCH</h2>
            <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver leading-[2.2] mb-8">
              食に関わる関わらないを問わず、<br />NoCodeにご依頼したいことがございましたらご連絡ください。
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <MagneticButton strength={0.3}>
              <button className="font-ui text-[10px] tracking-[4px] uppercase text-nc-white border border-nc-gold/30 px-10 py-4 hover:bg-nc-gold/10 transition-colors duration-500">
                CONTACT US
              </button>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/[.03] py-8 px-6 text-center text-[10px] text-nc-slate">© 2026 No Code, Inc.</footer>
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
      <div className={`md:grid md:grid-cols-2 md:gap-16 md:items-center ${index % 2 === 1 ? 'md:[direction:rtl] md:[&>*]:[direction:ltr]' : ''}`}>
        <SlideIn from={fromDir} delay={0} className="mb-6 md:mb-0">
          <TiltCard intensity={6}>
            <div className={`h-[56vw] md:h-[400px] rounded overflow-hidden relative ${item.image}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bebas text-white/[.04] text-[100px] md:text-[140px]">
                  <AnimatedCounter value={item.num} trigger={isVisible} />
                </span>
              </div>
              <div className="absolute bottom-3 right-4 font-ui text-[8px] tracking-[2px] text-white/10">{item.label}</div>
            </div>
          </TiltCard>
        </SlideIn>
        <SlideIn from={fromDir === 'left' ? 'right' : 'left'} delay={0.15}>
          <div style={{ transform: `skewY(${skew}deg)`, transition: 'transform 0.15s linear' }}>
            <span className="font-bebas text-[clamp(60px,16vw,100px)] text-nc-gold/[.06] leading-none block mb-[-12px]">{item.num}</span>
            <h3 className="font-medium text-[clamp(18px,4.5vw,22px)] text-nc-white tracking-wider mb-4 leading-relaxed">
              {isVisible ? <TextScramble text={item.title} trigger={isVisible} speed={15} /> : item.title}
            </h3>
            <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver leading-[2.4]">{item.body}</p>
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
        <motion.div className={`h-[clamp(280px,60vw,420px)] ${chef.image} relative`} whileTap={{ scale: 0.98 }}>
          <div className="absolute inset-0 bg-gradient-to-t from-nc-black/90 via-nc-black/30 to-transparent" />
          <span className="absolute bottom-[-10px] left-4 font-bebas text-[clamp(48px,12vw,80px)] text-white/[.06] tracking-wider pointer-events-none">{chef.hugeName}</span>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-[2]">
          <div className="font-ui text-[9px] tracking-[3px] uppercase text-nc-gold mb-1.5">{chef.role}</div>
          <div className="font-bebas text-[clamp(22px,6vw,32px)] text-nc-white mb-0.5">{chef.name}</div>
          <div className="text-xs text-nc-silver mb-3">{chef.nameJp}</div>
          <motion.div animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
            <p className="text-[clamp(11px,3vw,13px)] text-nc-slate leading-[2] pb-2">{chef.bio}</p>
          </motion.div>
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="font-ui text-[8px] tracking-[2px] uppercase text-nc-gold/40">TAP FOR MORE</motion.span>
        </div>
      </div>
    </TiltCard>
  );
}

/* ===== RESTAURANT CARD ===== */
function RestCard({ restaurant: r, index: i }: { restaurant: typeof restaurants[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={i * 0.08} animation="scale">
      <TiltCard intensity={4}>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white/[.02] rounded overflow-hidden relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={`h-[clamp(130px,28vw,200px)] ${r.image} relative overflow-hidden`}>
            <motion.div
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-inherit"
            />
            <span className="absolute bottom-2 left-3 font-bebas text-[32px] text-white/[.04] relative z-[1]">{String(i + 1).padStart(2, '0')}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-nc-black/40 to-transparent z-[1]" />
          </div>
          <div className="p-3 md:p-4">
            <div className="font-ui text-[7px] tracking-[2px] uppercase text-nc-gold mb-1">{r.tag}</div>
            <div className="font-bebas text-[clamp(15px,3.8vw,22px)] text-nc-white leading-tight">{r.name}</div>
            <div className="text-[10px] text-nc-slate mb-1">{r.sub}</div>
            <AnimatePresence>
              {hovered && r.address && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 mt-2 border-t border-nc-gold/[.08]">
                    <p className="text-[9px] text-nc-slate leading-[1.8]">{r.address}</p>
                    {r.hours && <p className="text-[9px] text-nc-slate leading-[1.8]">{r.hours}</p>}
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
function ProjectRow({ project: p, index: i }: { project: { title: string; desc: string; year: string }; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="flex items-center gap-4 md:gap-6 p-4 md:p-5 bg-white/[.02] rounded border border-nc-gold/[.04] cursor-pointer group hover:border-nc-gold/[.12] transition-colors duration-500"
      onClick={() => setExpanded(!expanded)}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex-shrink-0 w-[clamp(44px,12vw,56px)] h-[clamp(44px,12vw,56px)] rounded bg-nc-gold/[.06] flex items-center justify-center">
        <span className="font-bebas text-[clamp(16px,4vw,20px)] text-nc-gold/60">{p.year}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bebas text-[clamp(16px,4vw,22px)] text-nc-white leading-tight truncate">{p.title}</div>
        <AnimatePresence>
          {expanded ? (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(11px,3vw,13px)] text-nc-slate leading-[2] overflow-hidden mt-1"
            >
              {p.desc}
            </motion.p>
          ) : (
            <p className="text-[11px] text-nc-slate truncate">{p.desc}</p>
          )}
        </AnimatePresence>
      </div>
      <motion.div animate={{ rotate: expanded ? 90 : 0 }} className="flex-shrink-0 text-nc-gold/30 group-hover:text-nc-gold/60 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1" /></svg>
      </motion.div>
    </motion.div>
  );
}
