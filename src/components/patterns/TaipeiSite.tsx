'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Reveal, useReveal } from '@/components/shared/ScrollUtils';
import { TouchRipple, useScrollVelocity, TiltCard, ScrollProgressBar, AnimatedCounter } from '@/components/interactive/Effects';
import MagneticButton from '@/components/interactive/MagneticButton';
import TextScramble from '@/components/interactive/TextScramble';
import { taipeiContent, type Lang } from '@/lib/taipeiContent';

/* ===== SlideIn ===== */
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

/* ===== Dual Marquee ===== */
function Marquee({ text, sub, speed = 18 }: { text: string; sub?: string; speed?: number }) {
  return (
    <div className="overflow-hidden py-3 md:py-4 border-y border-nc-tw-gold/[.08] relative"
      style={{ background: 'linear-gradient(180deg, rgba(201,169,110,0.02) 0%, transparent 30%, transparent 70%, rgba(201,169,110,0.02) 100%)' }}>
      <div className="absolute inset-y-0 left-0 w-12 md:w-16 bg-gradient-to-r from-nc-black to-transparent z-[2]" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-16 bg-gradient-to-l from-nc-black to-transparent z-[2]" />
      <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: speed, repeat: Infinity, ease: 'linear' }} className="flex whitespace-nowrap will-change-transform relative z-[1]">
        {[0, 1, 2, 3].map(i => (
          <span key={i} className="font-bebas text-[clamp(22px,4vw,42px)] text-nc-tw-gold/[.35] tracking-[.08em] mx-5 md:mx-6">{text}</span>
        ))}
      </motion.div>
      {sub && (
        <motion.div animate={{ x: ['-50%', '0%'] }} transition={{ duration: speed * 1.3, repeat: Infinity, ease: 'linear' }} className="flex whitespace-nowrap will-change-transform relative z-[1] mt-1">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className="font-ui text-[clamp(10px,2vw,16px)] text-nc-tw-gold/[.18] tracking-[.15em] uppercase mx-5 md:mx-6">{sub}</span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ===== Language Switcher ===== */
function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const langs: { code: Lang; label: string }[] = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'EN' },
    { code: 'ja', label: 'JP' },
  ];
  return (
    <div className="flex items-center gap-1">
      {langs.map((l, i) => (
        <span key={l.code}>
          <button
            onClick={() => setLang(l.code)}
            className={`font-ui text-[10px] tracking-[2px] transition-colors ${lang === l.code ? 'text-nc-tw-gold' : 'text-nc-slate hover:text-nc-silver'}`}
          >
            {l.label}
          </button>
          {i < langs.length - 1 && <span className="text-nc-slate/30 mx-1 text-[10px]">/</span>}
        </span>
      ))}
    </div>
  );
}

/* ===== BackToTop ===== */
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
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[90] w-10 h-10 rounded-full bg-nc-tw-gold/10 border border-nc-tw-gold/20 flex items-center justify-center backdrop-blur-sm hover:bg-nc-tw-gold/20 transition-colors"
          aria-label="Back to top">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12V2M2 6L7 1L12 6" stroke="#C9A96E" strokeWidth="1" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ===== MAIN COMPONENT ===== */
export default function TaipeiSite() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const velocity = useScrollVelocity();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');
  useEffect(() => { setTimeout(() => setMounted(true), 300); }, []);

  const t = taipeiContent[lang];

  return (
    <div>
      <ScrollProgressBar />
      <BackToTop />

      {/* Lang switcher - fixed */}
      <div className="fixed top-[18px] right-[68px] md:right-[80px] z-[101]">
        <LangSwitch lang={lang} setLang={setLang} />
      </div>

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="h-svh relative flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0 bg-[url('/images/hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-nc-black/20 via-nc-black/30 to-nc-black/80" />
        </motion.div>
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[-10%] left-[-15%] bg-nc-tw-gold/[.05]" style={{ animationDuration: '25s' }} />
          <div className="mesh-orb w-[35vw] h-[35vw] bottom-[10%] right-[-10%] bg-nc-tw-gold/[.04]" style={{ animationDuration: '30s', animationDelay: '-8s' }} />
        </div>
        <TouchRipple className="z-[2]" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-[3] text-center px-4">
          {/* Taipei badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="inline-block font-ui text-[9px] tracking-[4px] uppercase text-nc-tw-gold border border-nc-tw-gold/20 px-4 py-1.5 mb-8">
            TAIPEI, TAIWAN
          </motion.div>

          <div className="font-ui text-[10px] tracking-[8px] uppercase text-nc-tw-gold/60 mb-6">
            <TextScramble text={t.hero.eyebrow} trigger={mounted} speed={28} />
          </div>

          <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.1, duration: 0.6 }}
            className="font-bebas text-[clamp(60px,16vw,140px)] text-nc-white tracking-[.06em] leading-[0.85] mb-2">
            <TextScramble text="NO CODE" trigger={mounted} speed={28} />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
            className="font-tc text-[clamp(14px,3.5vw,18px)] text-nc-tw-gold/40 tracking-[6px] mb-6">
            {t.hero.subtitle}
          </motion.p>

          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}} transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-10 h-[1px] bg-nc-tw-gold mx-auto mb-6 origin-center" />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }}
            className="font-light text-[clamp(11px,2.8vw,15px)] text-nc-silver/70 tracking-[clamp(1px,0.5vw,4px)] max-w-[360px] mx-auto leading-[2]">
            {t.hero.tagline}
          </motion.p>
        </motion.div>

        <MagneticButton className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3]" strength={0.5}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex flex-col items-center gap-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-1 h-1 rounded-full bg-nc-tw-gold" />
            <div className="w-[1px] h-8 bg-gradient-to-b from-nc-tw-gold to-transparent" />
          </motion.div>
        </MagneticButton>
      </section>

      <Marquee text="NO CODE TAIPEI — 無代碼 — 來自東京 — 私人料理 — NO CODE TAIPEI — 無代碼 — 來自東京 — 私人料理 —" sub="Omakase — Private Dining — Taipei Da'an — Chef Yonezawa — Omakase — Private Dining — Taipei Da'an —" speed={20} />

      {/* ===== CONCEPT ===== */}
      <section id="tp-concept" className="relative py-20 md:py-40 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[55vw] h-[55vw] top-[10%] right-[-20%] bg-nc-tw-gold/[.06]" />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1000px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-tw-gold mb-3">{t.concept.label}</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,64px)] text-nc-white tracking-[.06em]">{t.concept.title}</h2>
          </Reveal>
          <div className="mt-12 md:mt-20 flex flex-col gap-16 md:gap-28">
            {t.concept.items.map((item, i) => (
              <ConceptBlock key={`${lang}-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Marquee text="FUMIO YONEZAWA — AKINORI HISAMATSU — CHEF+ — 食で未来を創る —" sub="Jean-Georges — The Burn — No Code — Sustainability —" speed={16} />

      {/* ===== CHEF ===== */}
      <section id="tp-chef" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[-10%] left-[40%] bg-[rgba(100,100,180,.05)]" style={{ animationDelay: '-3s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[1000px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-tw-gold mb-3">{t.chef.label}</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,64px)] text-nc-white tracking-[.06em] mb-8 md:mb-14">{t.chef.title}</h2>
          </Reveal>
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            {t.chef.chefs.map((c, i) => (
              <SlideIn key={`${lang}-chef-${i}`} from={i === 0 ? 'left' : 'right'} delay={i * 0.15} className="flex-1">
                <ChefCard chef={c} index={i} />
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MENU ===== */}
      <section id="tp-menu" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[45vw] h-[45vw] bottom-[5%] left-[-10%] bg-nc-tw-gold/[.05]" style={{ animationDuration: '22s' }} />
        </div>
        <div className="relative z-[2] max-w-[600px] md:max-w-[900px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-tw-gold mb-3">{t.menu.label}</div>
            <h2 className="font-bebas text-[clamp(40px,10vw,72px)] text-nc-white tracking-[.06em] mb-4">{t.menu.title}</h2>
            <p className="font-light text-[clamp(12px,3vw,15px)] text-nc-silver leading-[2.2] mb-10 md:mb-14 max-w-[560px]">{t.menu.intro}</p>
          </Reveal>

          {/* Course items */}
          <div className="flex flex-col gap-0">
            {t.menu.courses.map((c, i) => (
              <SlideIn key={`${lang}-course-${i}`} from={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.05}>
                <div className="flex items-start gap-4 md:gap-6 py-5 md:py-6 border-b border-nc-tw-gold/[.06] group">
                  <span className="font-bebas text-[clamp(28px,7vw,40px)] text-nc-tw-gold/[.12] leading-none pt-1 flex-shrink-0 w-[40px] md:w-[50px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-medium text-[clamp(14px,3.5vw,17px)] text-nc-white tracking-wider mb-1 group-hover:text-nc-tw-gold transition-colors duration-500">{c.name}</h4>
                    <p className="font-light text-[clamp(11px,2.8vw,13px)] text-nc-slate leading-[1.9]">{c.desc}</p>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>

          {/* Pairing */}
          <Reveal delay={0.15}>
            <div className="mt-10 md:mt-14 p-5 md:p-8 bg-white/[.02] rounded border border-nc-tw-gold/[.06]">
              <h4 className="font-bebas text-[clamp(20px,5vw,28px)] text-nc-white tracking-wider mb-3">{t.menu.pairingTitle}</h4>
              <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver leading-[2]">{t.menu.pairingDesc}</p>
            </div>
          </Reveal>

          {/* Price note */}
          <Reveal delay={0.2}>
            <p className="mt-8 font-light text-[clamp(10px,2.5vw,12px)] text-nc-slate leading-[2] whitespace-pre-line">{t.menu.priceNote}</p>
          </Reveal>
        </div>
      </section>

      <Marquee text="NO CODE TAIPEI — OMAKASE — 大安區 — 推薦制 — NO CODE TAIPEI — OMAKASE — 大安區 — 推薦制 —" sub="Counter Dining — Seasonal — Local Ingredients — Wine & Tea Pairing —" speed={22} />

      {/* ===== INFO ===== */}
      <section id="tp-info" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="relative z-[2] max-w-[600px] md:max-w-[900px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-tw-gold mb-3">{t.info.label}</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-10 md:mb-14">{t.info.title}</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <SlideIn from="left">
              <div className="space-y-6">
                <div>
                  <div className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold mb-2">LOCATION</div>
                  <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver leading-[2]">{t.info.address}</p>
                </div>
                <div>
                  <div className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold mb-2">{t.info.hours}</div>
                  <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver leading-[2] whitespace-pre-line">{t.info.hoursDetail}</p>
                </div>
              </div>
            </SlideIn>
            <SlideIn from="right" delay={0.1}>
              <div className="space-y-6">
                <div>
                  <div className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold mb-2">CONTACT</div>
                  <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver leading-[2]">{t.info.phone}</p>
                </div>
                <div>
                  <div className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold mb-2">ACCESS</div>
                  <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver leading-[2]">{t.info.access}</p>
                </div>
              </div>
            </SlideIn>
          </div>
          {/* Map placeholder */}
          <Reveal delay={0.2}>
            <div className="mt-10 h-[200px] md:h-[280px] bg-white/[.02] rounded border border-nc-tw-gold/[.04] flex items-center justify-center">
              <span className="font-ui text-[10px] tracking-[4px] uppercase text-nc-slate">GOOGLE MAP</span>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-6 font-light text-[clamp(11px,2.8vw,13px)] text-nc-tw-gold/50 leading-[2]">{t.info.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="tp-contact" className="relative py-20 md:py-32 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-orb w-[50vw] h-[50vw] top-[20%] left-[-10%] bg-nc-tw-gold/[.04]" style={{ animationDuration: '22s' }} />
        </div>
        <div className="relative z-[2] max-w-[500px] mx-auto px-5 md:px-6 text-center">
          <Reveal>
            <div className="font-ui text-[10px] tracking-[5px] uppercase text-nc-tw-gold mb-3">{t.contact.label}</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-4">{t.contact.title}</h2>
            <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver leading-[2.2] mb-8">{t.contact.desc}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <MagneticButton strength={0.3}>
              <button className="font-ui text-[10px] tracking-[4px] uppercase text-nc-white border border-nc-tw-gold/30 px-8 md:px-10 py-4 hover:bg-nc-tw-gold/10 active:bg-nc-tw-gold/15 transition-colors duration-500">
                {t.contact.btn}
              </button>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[.04] py-10 md:py-14 px-5 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="font-bebas text-[18px] tracking-[4px] text-nc-white mb-1">NO CODE TAIPEI</div>
              <p className="text-[11px] text-nc-slate leading-[1.8]">{t.footer.tagline}</p>
            </div>
            <div className="flex flex-col md:items-end gap-3">
              <a href="/" className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold hover:text-nc-gold-light transition-colors">
                {t.footer.parent}
              </a>
              <div className="flex gap-5">
                {['Instagram', 'Facebook'].map(s => (
                  <a key={s} href="#" className="font-ui text-[9px] tracking-[2px] uppercase text-nc-slate hover:text-nc-tw-gold transition-colors">{s}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/[.03] text-[10px] text-nc-slate/60">
            © 2026 No Code, Inc. — Taipei
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== CONCEPT BLOCK ===== */
function ConceptBlock({ item, index }: { item: { title: string; body: string }; index: number }) {
  const { ref, isVisible } = useReveal();
  const images = [
    'bg-gradient-to-br from-[#2a1f14] via-[#4a3525] to-[#1a1410]',
    'bg-gradient-to-br from-[#1a2018] via-[#3a4a35] to-[#101a10]',
    'bg-gradient-to-br from-[#1a1520] via-[#2a2535] to-[#0a0812]',
  ];
  const fromDir = index % 2 === 0 ? 'left' : 'right';
  const num = String(index + 1).padStart(2, '0');

  return (
    <div ref={ref}>
      <div className={`md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center ${index % 2 === 1 ? 'md:[direction:rtl] md:[&>*]:[direction:ltr]' : ''}`}>
        <SlideIn from={fromDir} delay={0} className="mb-5 md:mb-0">
          <TiltCard intensity={5}>
            <div className={`h-[50vw] md:h-[360px] rounded overflow-hidden relative ${images[index]}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bebas text-white/[.04] text-[80px] md:text-[120px]">
                  <AnimatedCounter value={num} trigger={isVisible} />
                </span>
              </div>
            </div>
          </TiltCard>
        </SlideIn>
        <SlideIn from={fromDir === 'left' ? 'right' : 'left'} delay={0.12}>
          <span className="font-bebas text-[clamp(48px,13vw,80px)] text-nc-tw-gold/[.06] leading-none block mb-[-6px]">{num}</span>
          <h3 className="font-medium text-[clamp(17px,4.5vw,22px)] text-nc-white tracking-wider mb-3 md:mb-4 leading-relaxed">
            {isVisible ? <TextScramble text={item.title} trigger={isVisible} speed={28} /> : item.title}
          </h3>
          <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver leading-[2.2] md:leading-[2.4]">{item.body}</p>
        </SlideIn>
      </div>
    </div>
  );
}

/* ===== CHEF CARD ===== */
function ChefCard({ chef, index }: { chef: { name: string; nameLocal: string; role: string; bio: string }; index: number }) {
  const [open, setOpen] = useState(false);
  const photos = ['/images/yonezawa.jpg', '/images/hisamatsu.jpg'];

  return (
    <TiltCard intensity={5}>
      <div className="relative overflow-hidden rounded cursor-pointer" onClick={() => setOpen(!open)}>
        <motion.div className="h-[clamp(260px,55vw,400px)] relative" whileTap={{ scale: 0.98 }}>
          <img src={photos[index]} alt={chef.nameLocal} className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-nc-black/90 via-nc-black/30 to-transparent" />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-7 z-[2]">
          <div className="font-ui text-[8px] md:text-[9px] tracking-[3px] uppercase text-nc-tw-gold mb-1.5">{chef.role}</div>
          <div className="font-bebas text-[clamp(20px,5.5vw,30px)] text-nc-white mb-0.5">{chef.name}</div>
          <div className="text-[11px] md:text-xs text-nc-silver mb-2">{chef.nameLocal}</div>
          <motion.div animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
            <p className="text-[clamp(11px,2.8vw,13px)] text-nc-slate leading-[2] pb-2">{chef.bio}</p>
          </motion.div>
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="font-ui text-[7px] md:text-[8px] tracking-[2px] uppercase text-nc-tw-gold/40">
            TAP FOR MORE
          </motion.span>
        </div>
      </div>
    </TiltCard>
  );
}
