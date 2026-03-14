'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useReveal } from '@/components/shared/ScrollUtils';
import { ScrollProgressBar } from '@/components/interactive/Effects';
import MagneticButton from '@/components/interactive/MagneticButton';
import TextScramble from '@/components/interactive/TextScramble';
import { taipeiContent, type Lang } from '@/lib/taipeiContent';

/* ===== Fade ===== */
function Fade({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
    }}>{children}</div>
  );
}

/* ===== Text visibility hook for scramble ===== */
function useTextVisible(threshold = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ===== Language Switcher ===== */
function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1">
      {([['zh', '中文'], ['en', 'EN'], ['ja', 'JP']] as [Lang, string][]).map(([code, label], i, arr) => (
        <span key={code}>
          <button onClick={() => setLang(code)}
            className={`font-ui text-[10px] tracking-[2px] transition-colors duration-300 ${lang === code ? 'text-nc-tw-gold' : 'text-nc-slate hover:text-nc-silver'}`}>
            {label}
          </button>
          {i < arr.length - 1 && <span className="text-nc-slate/30 mx-1 text-[10px]">/</span>}
        </span>
      ))}
    </div>
  );
}

/* ===== BackToTop ===== */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
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

/* =============== MAIN =============== */
export default function TaipeiSite() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.35, 0.85]);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');
  useEffect(() => { setTimeout(() => setMounted(true), 400); }, []);

  const t = taipeiContent[lang];

  return (
    <div className="bg-nc-black">
      <ScrollProgressBar />
      <BackToTop />

      {/* Lang switcher */}
      <div className="fixed top-[18px] right-[68px] md:right-[80px] z-[101]">
        <LangSwitch lang={lang} setLang={setLang} />
      </div>

      {/* ============================================================
          HERO — Full-bleed photo, title bottom-left (not centered)
          ============================================================ */}
      <section ref={heroRef} className="h-svh relative overflow-hidden">
        {/* Background image — VISIBLE */}
        <motion.div style={{ scale: imgScale }} className="absolute inset-0 z-0">
          <img src="/images/taipei-hero.jpg" alt="Taipei" className="w-full h-full object-cover" />
        </motion.div>
        {/* Dark overlay — NOT opaque */}
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-[1] bg-nc-black" />

        {/* Text — anchored to bottom-left */}
        <motion.div style={{ y: textY }} className="absolute bottom-0 left-0 right-0 z-[3] p-6 md:p-12 lg:p-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={mounted ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3, duration: 1 }}
            className="font-ui text-[8px] md:text-[9px] tracking-[6px] uppercase text-nc-tw-gold/50 mb-6">
            PRIVATE DINING — TAIPEI
          </motion.div>

          <div className="flex flex-col">
            <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.1, duration: 0.8 }}
              className="font-bebas text-[clamp(56px,16vw,140px)] text-nc-tw-gold/70 tracking-[.05em] leading-[0.82]">
              <TextScramble text="TAIPEI" trigger={mounted} speed={32} />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.4, duration: 0.8 }}
              className="font-bebas text-[clamp(56px,16vw,140px)] text-nc-white tracking-[.05em] leading-[0.82]">
              <TextScramble text="NO CODE" trigger={mounted} speed={28} />
            </motion.div>
          </div>

          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 md:w-24 h-[1px] bg-nc-tw-gold/40 mt-6 mb-4 origin-left" />

          <motion.p initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 1.3 }}
            className="font-tc-serif text-[clamp(12px,3vw,16px)] text-nc-silver/40 tracking-[3px] md:tracking-[6px] max-w-[400px]">
            {t.hero.tagline}
          </motion.p>
        </motion.div>

        {/* Scroll hint — right side */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 2 }}
          className="absolute bottom-8 right-6 md:right-12 z-[3] flex items-center gap-3">
          <span className="font-ui text-[7px] tracking-[3px] uppercase text-nc-slate/40 [writing-mode:vertical-rl]">SCROLL</span>
          <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-nc-tw-gold/30 origin-top" />
        </motion.div>
      </section>

      {/* ============================================================
          CONCEPT — Full-width numbered blocks, left-aligned
          ============================================================ */}
      <section id="tp-concept" className="scroll-mt-16">
        <div className="py-20 md:py-32 px-6 md:px-12 lg:px-16 max-w-[1200px] mx-auto">
          <Fade>
            <div className="mb-16 md:mb-24">
              <span className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold">{t.concept.label}</span>
            </div>
          </Fade>

          {t.concept.items.map((item, i) => (
            <ConceptRow key={`${lang}-c-${i}`} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ============================================================
          CHEF — Cinematic wide band
          ============================================================ */}
      <section id="tp-chef" className="scroll-mt-16">
        {/* Full-width gold rule */}
        <div className="h-[1px] bg-nc-tw-gold/[.06]" />

        <div className="py-20 md:py-32 px-6 md:px-12 lg:px-16 max-w-[1200px] mx-auto">
          <Fade>
            <span className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold">{t.chef.label}</span>
          </Fade>

          <div className="mt-14 md:mt-20 space-y-20 md:space-y-28">
            {t.chef.chefs.map((chef, i) => (
              <ChefBand key={`${lang}-ch-${i}`} chef={chef} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          MENU — Centered elegant, no timeline
          ============================================================ */}
      <section id="tp-menu" className="scroll-mt-16">
        <div className="h-[1px] bg-nc-tw-gold/[.06]" />

        <div className="py-20 md:py-32 px-6 md:px-12 lg:px-16 max-w-[800px] mx-auto text-center">
          <Fade>
            <span className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold block mb-8">{t.menu.label}</span>
            <h2 className="font-bebas text-[clamp(56px,14vw,100px)] text-nc-white tracking-[.04em] leading-[0.85]">{t.menu.title}</h2>
            <div className="w-6 h-[1px] bg-nc-tw-gold/25 mx-auto my-6" />
            <p className="font-tc-serif font-light text-[clamp(12px,3vw,15px)] text-nc-silver/40 leading-[2.4] max-w-[500px] mx-auto">{t.menu.intro}</p>
          </Fade>

          {/* Courses — single column, spaced */}
          <div className="mt-16 md:mt-24 space-y-6 md:space-y-8 text-left max-w-[520px] mx-auto">
            {t.menu.courses.map((c, i) => (
              <Fade key={`${lang}-m-${i}`} delay={i * 0.04}>
                <div className="group py-4 border-b border-nc-tw-gold/[.04] hover:border-nc-tw-gold/[.12] transition-colors duration-700">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h4 className="font-tc-serif text-[clamp(15px,4vw,18px)] text-nc-white tracking-wider group-hover:text-nc-tw-gold transition-colors duration-700">{c.name}</h4>
                    <span className="font-bebas text-[14px] text-nc-tw-gold/[.12] tracking-wider">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="font-tc-serif font-light text-[clamp(11px,2.8vw,13px)] text-nc-slate/60 leading-[2]">{c.desc}</p>
                </div>
              </Fade>
            ))}
          </div>

          {/* Pairing */}
          <Fade delay={0.15}>
            <div className="mt-16 md:mt-20 max-w-[460px] mx-auto">
              <div className="w-4 h-[1px] bg-nc-tw-gold/20 mx-auto mb-5" />
              <h4 className="font-bebas text-[clamp(18px,4.5vw,24px)] text-nc-white tracking-[.06em] mb-3">{t.menu.pairingTitle}</h4>
              <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-nc-silver/40 leading-[2.4]">{t.menu.pairingDesc}</p>
            </div>
          </Fade>

          <Fade delay={0.2}>
            <p className="mt-10 font-tc-serif font-light text-[clamp(10px,2.5vw,12px)] text-nc-slate/40 leading-[2.2] whitespace-pre-line">{t.menu.priceNote}</p>
          </Fade>
        </div>
      </section>

      {/* ============================================================
          INFO — Asymmetric two-column
          ============================================================ */}
      <section id="tp-info" className="scroll-mt-16">
        <div className="h-[1px] bg-nc-tw-gold/[.06]" />

        <div className="py-20 md:py-32 px-6 md:px-12 lg:px-16 max-w-[1100px] mx-auto">
          <Fade>
            <span className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold">{t.info.label}</span>
          </Fade>

          <div className="mt-14 md:mt-20 flex flex-col md:flex-row md:gap-20">
            {/* Left — large title + note */}
            <div className="md:w-[40%] mb-10 md:mb-0">
              <Fade>
                <h2 className="font-tc-serif text-[clamp(28px,7vw,44px)] text-nc-white tracking-wider leading-[1.5] mb-8">{t.info.title}</h2>
                <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-nc-tw-gold/25 leading-[2.2] tracking-wider">{t.info.note}</p>
              </Fade>
            </div>

            {/* Right — info details */}
            <div className="flex-1 space-y-8">
              {[
                { label: 'LOCATION', value: t.info.address },
                { label: t.info.hours, value: t.info.hoursDetail },
                { label: 'CONTACT', value: `${t.info.phone}\n${t.info.access}` },
              ].map((item, i) => (
                <Fade key={i} delay={i * 0.08}>
                  <div className="py-5 border-b border-nc-tw-gold/[.04]">
                    <div className="font-ui text-[8px] tracking-[4px] uppercase text-nc-tw-gold/50 mb-3">{item.label}</div>
                    <p className="font-tc-serif font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver/55 leading-[2.2] whitespace-pre-line">{item.value}</p>
                  </div>
                </Fade>
              ))}
            </div>
          </div>

          {/* Map */}
          <Fade delay={0.2}>
            <div className="mt-14 h-[200px] md:h-[300px] bg-white/[.01] rounded border border-nc-tw-gold/[.03] flex items-center justify-center">
              <span className="font-ui text-[9px] tracking-[4px] uppercase text-nc-slate/25">GOOGLE MAP — COMING SOON</span>
            </div>
          </Fade>
        </div>
      </section>

      {/* ============================================================
          CONTACT — Minimal bottom
          ============================================================ */}
      <section id="tp-contact" className="scroll-mt-16">
        <div className="h-[1px] bg-nc-tw-gold/[.06]" />

        <div className="py-24 md:py-36 px-6 max-w-[440px] mx-auto text-center">
          <Fade>
            <span className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold block mb-6">{t.contact.label}</span>
            <h2 className="font-tc-serif text-[clamp(26px,6.5vw,38px)] text-nc-white tracking-wider leading-[1.5] mb-4">{t.contact.title}</h2>
            <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-nc-silver/35 leading-[2.4] mb-10">{t.contact.desc}</p>
          </Fade>
          <Fade delay={0.1}>
            <MagneticButton strength={0.3}>
              <button className="font-ui text-[10px] tracking-[5px] uppercase text-nc-white border border-nc-tw-gold/15 px-10 py-5 hover:bg-nc-tw-gold/[.06] active:bg-nc-tw-gold/[.1] transition-all duration-700">
                {t.contact.btn}
              </button>
            </MagneticButton>
          </Fade>
        </div>
      </section>

      {/* ============================================================
          FOOTER — Left-aligned (different from Tokyo's split)
          ============================================================ */}
      <footer className="border-t border-white/[.025] py-12 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-bebas text-[20px] tracking-[4px] text-nc-white">NO CODE</span>
                <span className="font-bebas text-[13px] tracking-[6px] text-nc-tw-gold/25">TAIPEI</span>
              </div>
              <p className="font-tc-serif text-[11px] text-nc-slate/35 leading-[1.8]">{t.footer.tagline}</p>
            </div>
            <div className="flex items-center gap-8">
              <a href="/" className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold/30 hover:text-nc-tw-gold/70 transition-colors duration-500">
                {t.footer.parent}
              </a>
              {['Instagram'].map(s => (
                <a key={s} href="#" className="font-ui text-[9px] tracking-[2px] uppercase text-nc-slate/25 hover:text-nc-tw-gold/40 transition-colors">{s}</a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-white/[.015] text-[10px] text-nc-slate/20">
            © 2026 No Code, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== CONCEPT ROW — Number left, text right, full width ===== */
function ConceptRow({ item, index }: { item: { title: string; body: string }; index: number }) {
  const { ref, visible } = useTextVisible();

  return (
    <div className="mb-24 md:mb-32 last:mb-0">
      <div className="flex gap-6 md:gap-12 items-start">
        {/* Large number — left column */}
        <Fade>
          <span className="font-bebas text-[clamp(64px,16vw,110px)] text-nc-tw-gold/[.05] leading-none flex-shrink-0 w-[60px] md:w-[100px]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </Fade>

        {/* Text — right column */}
        <div className="flex-1 pt-3 md:pt-5" ref={ref}>
          <Fade delay={0.1}>
            <h3 className="font-tc-serif text-[clamp(20px,5vw,30px)] text-nc-white tracking-wider leading-[1.7] mb-5">
              <TextScramble text={item.title} trigger={visible} speed={30} />
            </h3>
          </Fade>
          <Fade delay={0.2}>
            <p className="font-tc-serif font-light text-[clamp(13px,3.5vw,16px)] text-nc-silver/55 leading-[2.6] md:leading-[2.8]">
              {item.body}
            </p>
          </Fade>
        </div>
      </div>

      {/* Bottom rule */}
      <Fade delay={0.3}>
        <div className="mt-10 md:mt-14 h-[1px] bg-nc-tw-gold/[.04]" />
      </Fade>
    </div>
  );
}

/* ===== CHEF — Wide cinematic band (photo left/full + text right/below) ===== */
function ChefBand({ chef, index }: { chef: { name: string; nameLocal: string; role: string; bio: string; isPlaceholder?: boolean }; index: number }) {
  return (
    <div>
      <Fade>
        <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0`}>
          {/* Photo — 60% width on desktop */}
          <div className="w-full md:w-[58%] flex-shrink-0">
            <div className="relative aspect-[3/2] overflow-hidden rounded-sm">
              {chef.isPlaceholder ? (
                <div className="absolute inset-0 bg-gradient-to-br from-nc-charcoal to-nc-graphite flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-bebas text-[40px] text-nc-tw-gold/[.06]">?</div>
                    <div className="font-ui text-[9px] tracking-[4px] uppercase text-nc-slate/25 mt-2">COMING SOON</div>
                  </div>
                </div>
              ) : (
                <>
                  <img src="/images/yonezawa.jpg" alt={chef.nameLocal} className="absolute inset-0 w-full h-full object-cover object-[center_15%]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-nc-black/30" />
                </>
              )}
            </div>
          </div>

          {/* Text — 40% */}
          <div className={`flex-1 flex flex-col justify-center py-8 md:py-0 ${index % 2 === 0 ? 'md:pl-10 lg:pl-14' : 'md:pr-10 lg:pr-14'}`}>
            <div className="font-ui text-[8px] tracking-[4px] uppercase text-nc-tw-gold/40 mb-4">{chef.role}</div>
            <div className={`font-bebas text-[clamp(26px,6vw,38px)] tracking-[.04em] mb-1 ${chef.isPlaceholder ? 'text-nc-slate/25' : 'text-nc-white'}`}>
              {chef.name}
            </div>
            <div className={`font-tc-serif text-[14px] tracking-wider mb-6 ${chef.isPlaceholder ? 'text-nc-slate/15' : 'text-nc-silver/30'}`}>
              {chef.nameLocal}
            </div>
            <div className="w-6 h-[1px] bg-nc-tw-gold/10 mb-5" />
            <p className={`font-tc-serif font-light text-[clamp(13px,3.5vw,15px)] leading-[2.6] ${chef.isPlaceholder ? 'text-nc-slate/25 italic' : 'text-nc-silver/50'}`}>
              {chef.bio}
            </p>
          </div>
        </div>
      </Fade>
    </div>
  );
}
