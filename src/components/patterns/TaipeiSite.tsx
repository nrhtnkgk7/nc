'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Reveal, useReveal } from '@/components/shared/ScrollUtils';
import { useScrollVelocity, ScrollProgressBar } from '@/components/interactive/Effects';
import MagneticButton from '@/components/interactive/MagneticButton';
import TextScramble from '@/components/interactive/TextScramble';
import { taipeiContent, type Lang } from '@/lib/taipeiContent';

/* ===== Clip reveal (unique to Taipei) ===== */
function ClipReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={`reveal-clip ${isVisible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ===== Fade up ===== */
function FadeUp({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: `all 1s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ===== Thin gold divider ===== */
function Divider() {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className="max-w-[600px] md:max-w-[900px] mx-auto px-5">
      <div className="h-[1px] bg-nc-tw-gold/[.1] origin-left" style={{
        transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 1.5s cubic-bezier(0.16,1,0.3,1)',
      }} />
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
          <button onClick={() => setLang(l.code)}
            className={`font-ui text-[10px] tracking-[2px] transition-colors duration-300 ${lang === l.code ? 'text-nc-tw-gold' : 'text-nc-slate hover:text-nc-silver'}`}>
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
          className="fixed bottom-6 right-6 z-[90] w-10 h-10 rounded-full bg-nc-tw-gold/10 border border-nc-tw-gold/20 flex items-center justify-center backdrop-blur-sm"
          aria-label="Top">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12V2M2 6L7 1L12 6" stroke="#C9A96E" strokeWidth="1" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ===== MAIN ===== */
export default function TaipeiSite() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');
  useEffect(() => { setTimeout(() => setMounted(true), 400); }, []);

  const t = taipeiContent[lang];

  return (
    <div>
      <ScrollProgressBar />
      <BackToTop />

      {/* Lang switcher */}
      <div className="fixed top-[18px] right-[68px] md:right-[80px] z-[101]">
        <LangSwitch lang={lang} setLang={setLang} />
      </div>

      {/* ===== HERO — Split screen ===== */}
      <section ref={heroRef} className="h-svh relative flex flex-col items-center justify-center overflow-hidden">
        {/* Background with parallax */}
        <div className="absolute inset-0 z-0 bg-[url('/images/hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-nc-black/70" />
        </div>

        {/* Vertical golden lines */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {[25, 50, 75].map(p => (
            <motion.div key={p} initial={{ scaleY: 0 }} animate={mounted ? { scaleY: 1 } : {}}
              transition={{ delay: 1.2 + p * 0.005, duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 bottom-0 w-[1px] bg-nc-tw-gold/[.03] origin-top"
              style={{ left: `${p}%` }} />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-[3] text-center px-4">
          {/* Top label */}
          <motion.div initial={{ opacity: 0, letterSpacing: '2px' }}
            animate={mounted ? { opacity: 1, letterSpacing: '12px' } : {}}
            transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-ui text-[9px] uppercase text-nc-tw-gold/50 mb-10 md:mb-14">
            PRIVATE DINING
          </motion.div>

          {/* TAIPEI — large, spaced */}
          <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.1, duration: 0.8 }}
            className="font-bebas text-[clamp(18px,4vw,28px)] text-nc-tw-gold/40 tracking-[clamp(12px,3vw,30px)] mb-3 md:mb-4">
            <TextScramble text="TAIPEI" trigger={mounted} speed={35} />
          </motion.div>

          {/* NO CODE — hero title */}
          <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.3, duration: 0.8 }}
            className="font-bebas text-[clamp(72px,22vw,180px)] text-nc-white tracking-[.04em] leading-[0.8]">
            <TextScramble text="NO CODE" trigger={mounted} speed={28} />
          </motion.div>

          {/* Horizontal line */}
          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 md:w-32 h-[1px] bg-nc-tw-gold/40 mx-auto mt-8 mb-6 origin-center" />

          {/* Chinese subtitle */}
          <motion.p initial={{ opacity: 0, y: 15 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1 }}
            className="font-tc text-[clamp(13px,3.5vw,17px)] text-nc-silver/50 tracking-[8px] mb-4">
            {t.hero.subtitle}
          </motion.p>

          {/* Tagline */}
          <motion.p initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 1.4 }}
            className="font-light text-[clamp(11px,2.6vw,14px)] text-nc-slate tracking-[2px] leading-[2] max-w-[320px] mx-auto">
            {t.hero.tagline}
          </motion.p>
        </motion.div>

        {/* Scroll indicator — minimal line */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center">
          <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-[1px] h-10 bg-gradient-to-b from-nc-tw-gold/40 to-transparent origin-top" />
        </motion.div>
      </section>

      {/* ===== CONCEPT — Editorial stacked ===== */}
      <section id="tp-concept" className="relative py-24 md:py-40 scroll-mt-16">
        <div className="max-w-[600px] md:max-w-[700px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-6">{t.concept.label}</div>
          </FadeUp>

          {t.concept.items.map((item, i) => (
            <div key={`${lang}-c-${i}`} className="mb-20 md:mb-28 last:mb-0">
              {/* Large number */}
              <FadeUp delay={0.05}>
                <div className="flex items-baseline gap-4 md:gap-6 mb-6">
                  <span className="font-bebas text-[clamp(80px,20vw,140px)] text-nc-tw-gold/[.06] leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 h-[1px] bg-nc-tw-gold/[.08]" />
                </div>
              </FadeUp>

              {/* Pull-quote style title */}
              <ClipReveal delay={0.1}>
                <h3 className="font-medium text-[clamp(22px,5.5vw,32px)] text-nc-white tracking-wider leading-[1.6] mb-6">
                  <TextScramble text={item.title} trigger={true} speed={30} />
                </h3>
              </ClipReveal>

              {/* Body */}
              <FadeUp delay={0.2}>
                <p className="font-light text-[clamp(13px,3.5vw,16px)] text-nc-silver/80 leading-[2.4] md:leading-[2.6] pl-0 md:pl-8 md:border-l md:border-nc-tw-gold/[.08]">
                  {item.body}
                </p>
              </FadeUp>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ===== CHEF — Horizontal editorial ===== */}
      <section id="tp-chef" className="relative py-24 md:py-36 scroll-mt-16">
        <div className="max-w-[600px] md:max-w-[1000px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-3">{t.chef.label}</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-12 md:mb-20">{t.chef.title}</h2>
          </FadeUp>

          {t.chef.chefs.map((chef, i) => (
            <ChefEditorial key={`${lang}-ch-${i}`} chef={chef} index={i} />
          ))}
        </div>
      </section>

      <Divider />

      {/* ===== MENU — Timeline style ===== */}
      <section id="tp-menu" className="relative py-24 md:py-36 scroll-mt-16">
        <div className="max-w-[600px] md:max-w-[700px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-3">{t.menu.label}</div>
            <h2 className="font-bebas text-[clamp(48px,12vw,80px)] text-nc-white tracking-[.04em] mb-4">{t.menu.title}</h2>
            <p className="font-light text-[clamp(12px,3vw,15px)] text-nc-silver/70 leading-[2.2] mb-14 md:mb-20">{t.menu.intro}</p>
          </FadeUp>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-[1px] bg-nc-tw-gold/[.08]" />

            {t.menu.courses.map((c, i) => (
              <FadeUp key={`${lang}-m-${i}`} delay={i * 0.06}>
                <div className="flex gap-6 md:gap-8 mb-10 md:mb-12 last:mb-0 relative">
                  {/* Dot on timeline */}
                  <div className="flex-shrink-0 w-[38px] md:w-[46px] flex flex-col items-center pt-1.5">
                    <div className="w-2 h-2 rounded-full bg-nc-tw-gold/30 border border-nc-tw-gold/60 relative z-[1]" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-bebas text-[clamp(12px,3vw,15px)] text-nc-tw-gold/30">{String(i + 1).padStart(2, '0')}</span>
                      <h4 className="font-medium text-[clamp(15px,4vw,19px)] text-nc-white tracking-wider">{c.name}</h4>
                    </div>
                    <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-slate leading-[2]">{c.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Pairing */}
          <FadeUp delay={0.2}>
            <div className="mt-16 md:mt-20 relative">
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-nc-tw-gold/20" />
              <div className="pt-6">
                <h4 className="font-bebas text-[clamp(20px,5vw,26px)] text-nc-white tracking-[.06em] mb-3">{t.menu.pairingTitle}</h4>
                <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver/70 leading-[2.2]">{t.menu.pairingDesc}</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mt-10 font-light text-[clamp(10px,2.5vw,12px)] text-nc-slate/70 leading-[2.2] whitespace-pre-line">{t.menu.priceNote}</p>
          </FadeUp>
        </div>
      </section>

      <Divider />

      {/* ===== INFO — Minimal cards ===== */}
      <section id="tp-info" className="relative py-24 md:py-36 scroll-mt-16">
        <div className="max-w-[600px] md:max-w-[900px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-3">{t.info.label}</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-12 md:mb-16">{t.info.title}</h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 mb-12">
            {[
              { icon: '📍', label: 'LOCATION', value: t.info.address },
              { icon: '🕐', label: t.info.hours, value: t.info.hoursDetail },
              { icon: '📞', label: 'CONTACT', value: `${t.info.phone}\n${t.info.access}` },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="p-5 md:p-6 border border-nc-tw-gold/[.06] rounded bg-white/[.01] h-full">
                  <div className="font-ui text-[8px] tracking-[3px] uppercase text-nc-tw-gold mb-4">{item.label}</div>
                  <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver/80 leading-[2] whitespace-pre-line">{item.value}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Map */}
          <FadeUp delay={0.2}>
            <div className="h-[200px] md:h-[300px] bg-white/[.015] rounded border border-nc-tw-gold/[.04] flex items-center justify-center">
              <span className="font-ui text-[10px] tracking-[4px] uppercase text-nc-slate/50">GOOGLE MAP — COMING SOON</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mt-8 text-center font-light text-[clamp(12px,3vw,14px)] text-nc-tw-gold/40 leading-[2] tracking-wider">{t.info.note}</p>
          </FadeUp>
        </div>
      </section>

      <Divider />

      {/* ===== CONTACT — Centered minimal ===== */}
      <section id="tp-contact" className="relative py-24 md:py-36 scroll-mt-16">
        <div className="max-w-[480px] mx-auto px-5 text-center">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-3">{t.contact.label}</div>
            <h2 className="font-bebas text-[clamp(36px,9vw,56px)] text-nc-white tracking-[.06em] mb-4">{t.contact.title}</h2>
            <p className="font-light text-[clamp(12px,3vw,14px)] text-nc-silver/60 leading-[2.2] mb-10">{t.contact.desc}</p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <MagneticButton strength={0.3}>
              <button className="font-ui text-[10px] tracking-[5px] uppercase text-nc-white border border-nc-tw-gold/20 px-10 py-5 hover:bg-nc-tw-gold/8 active:bg-nc-tw-gold/12 transition-all duration-700">
                {t.contact.btn}
              </button>
            </MagneticButton>
          </FadeUp>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[.03] py-12 md:py-16 px-5 md:px-10">
        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="font-bebas text-[14px] tracking-[6px] text-nc-tw-gold/30 mb-1">TAIPEI</div>
            <div className="font-bebas text-[22px] tracking-[4px] text-nc-white mb-2">NO CODE</div>
            <p className="text-[11px] text-nc-slate/60 leading-[1.8]">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-col md:items-end gap-4">
            <a href="/" className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold/50 hover:text-nc-tw-gold transition-colors duration-500">
              {t.footer.parent}
            </a>
            <div className="flex gap-6">
              {['Instagram', 'Facebook'].map(s => (
                <a key={s} href="#" className="font-ui text-[9px] tracking-[2px] uppercase text-nc-slate/40 hover:text-nc-tw-gold/60 transition-colors duration-500">{s}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-[900px] mx-auto mt-10 pt-6 border-t border-white/[.02] text-[10px] text-nc-slate/30">
          © 2026 No Code, Inc.
        </div>
      </footer>
    </div>
  );
}

/* ===== CHEF EDITORIAL — horizontal photo + text ===== */
function ChefEditorial({ chef, index }: { chef: { name: string; nameLocal: string; role: string; bio: string }; index: number }) {
  const photos = ['/images/yonezawa.jpg', '/images/hisamatsu.jpg'];
  const isEven = index % 2 === 0;

  return (
    <div className={`mb-16 md:mb-24 last:mb-0`}>
      <FadeUp>
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-10 items-center`}>
          {/* Photo — square crop */}
          <ClipReveal className="w-full md:w-[45%] flex-shrink-0">
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded overflow-hidden">
              <img src={photos[index]} alt={chef.nameLocal} className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-nc-black/50 to-transparent" />
              {/* Large watermark name */}
              <span className="absolute bottom-2 left-3 font-bebas text-[clamp(36px,8vw,60px)] text-white/[.04] tracking-wider">{chef.name.split(' ')[1]}</span>
            </div>
          </ClipReveal>

          {/* Text */}
          <div className="flex-1">
            <div className="font-ui text-[8px] tracking-[4px] uppercase text-nc-tw-gold/60 mb-3">{chef.role}</div>
            <div className="font-bebas text-[clamp(26px,6vw,38px)] text-nc-white tracking-[.04em] mb-1">{chef.name}</div>
            <div className="text-[13px] text-nc-silver/50 mb-5 tracking-wider">{chef.nameLocal}</div>
            <div className="w-8 h-[1px] bg-nc-tw-gold/20 mb-5" />
            <p className="font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver/70 leading-[2.4]">{chef.bio}</p>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}
