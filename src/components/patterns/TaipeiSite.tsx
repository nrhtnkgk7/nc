'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Reveal, useReveal } from '@/components/shared/ScrollUtils';
import { ScrollProgressBar } from '@/components/interactive/Effects';
import MagneticButton from '@/components/interactive/MagneticButton';
import TextScramble from '@/components/interactive/TextScramble';
import { taipeiContent, type Lang } from '@/lib/taipeiContent';

/* ===== FadeUp ===== */
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

/* ===== ClipReveal ===== */
function ClipReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={`reveal-clip ${isVisible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ===== Gold divider with animation ===== */
function GoldLine() {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className="py-12 md:py-16">
      <div className="max-w-[120px] mx-auto flex items-center gap-3">
        <div className="flex-1 h-[1px] bg-nc-tw-gold/[.15] origin-left" style={{
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)',
        }} />
        <div className="w-1 h-1 rounded-full bg-nc-tw-gold/30" style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }} />
        <div className="flex-1 h-[1px] bg-nc-tw-gold/[.15] origin-right" style={{
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
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

/* =============== MAIN =============== */
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

      {/* ===== HERO — Stacked vertical, own background ===== */}
      <section ref={heroRef} className="min-h-svh relative flex flex-col items-center justify-center overflow-hidden">
        {/* Taipei-specific gradient background (blue-night tones) */}
        <div className="absolute inset-0 z-0">
          {/* Try taipei-hero.jpg first, gradient behind as fallback */}
          <div className="absolute inset-0 bg-[url('/images/taipei-hero.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(160deg, #040810 0%, #0a1225 25%, #0f0d1a 50%, #14100a 75%, #0a0a0a 100%)',
          }} />
          <div className="absolute inset-0 bg-nc-black/40" />
        </div>

        {/* Horizontal thin lines */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: 1.5, duration: 3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[30%] left-0 right-0 h-[1px] bg-nc-tw-gold/[.04] origin-left" />
          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: 1.8, duration: 3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[70%] left-0 right-0 h-[1px] bg-nc-tw-gold/[.04] origin-right" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-[3] text-center px-4 py-20">
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, letterSpacing: '2px' }}
            animate={mounted ? { opacity: 1, letterSpacing: '10px' } : {}}
            transition={{ delay: 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-ui text-[8px] md:text-[9px] uppercase text-nc-tw-gold/40 mb-12 md:mb-16">
            PRIVATE DINING
          </motion.div>

          {/* TAIPEI — same size as NO CODE */}
          <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.1, duration: 0.8 }}
            className="font-bebas text-[clamp(60px,18vw,160px)] text-nc-tw-gold/60 tracking-[.06em] leading-[0.82]">
            <TextScramble text="TAIPEI" trigger={mounted} speed={32} />
          </motion.div>

          {/* NO CODE — same size */}
          <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-bebas text-[clamp(60px,18vw,160px)] text-nc-white tracking-[.06em] leading-[0.82] mt-[-0.05em]">
            <TextScramble text="NO CODE" trigger={mounted} speed={28} />
          </motion.div>

          {/* Gold line */}
          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 md:w-24 h-[1px] bg-nc-tw-gold/40 mx-auto mt-10 mb-8 origin-center" />

          {/* Chinese subtitle */}
          <motion.p initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 1.3 }}
            className="font-tc-serif text-[clamp(14px,3.5vw,20px)] text-nc-silver/30 tracking-[8px] md:tracking-[12px] mb-4">
            {t.hero.subtitle}
          </motion.p>

          {/* Tagline */}
          <motion.p initial={{ opacity: 0, y: 15 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.6 }}
            className="font-tc-serif font-light text-[clamp(11px,2.8vw,14px)] text-nc-slate tracking-[2px] leading-[2.2] max-w-[320px] mx-auto">
            {t.hero.tagline}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3]">
          <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-[1px] h-10 bg-gradient-to-b from-nc-tw-gold/40 to-transparent origin-top" />
        </motion.div>
      </section>

      {/* ===== CONCEPT — Single column, pull-quote editorial ===== */}
      <section id="tp-concept" className="relative pt-24 md:pt-40 pb-8 scroll-mt-16">
        <div className="max-w-[560px] md:max-w-[640px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-4">{t.concept.label}</div>
            <h2 className="font-tc-serif text-[clamp(26px,6.5vw,40px)] text-nc-white tracking-wider leading-[1.5]">{t.concept.title}</h2>
          </FadeUp>

          <div className="mt-16 md:mt-24">
            {t.concept.items.map((item, i) => (
              <ConceptItem key={`${lang}-c-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <GoldLine />

      {/* ===== CHEF — Full-width photo + overlay text ===== */}
      <section id="tp-chef" className="relative pb-8 scroll-mt-16">
        <div className="max-w-[560px] md:max-w-[960px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-4">{t.chef.label}</div>
            <h2 className="font-tc-serif text-[clamp(26px,6.5vw,40px)] text-nc-white tracking-wider leading-[1.5] mb-14 md:mb-20">{t.chef.title}</h2>
          </FadeUp>

          <div className="flex flex-col gap-12 md:gap-16">
            {t.chef.chefs.map((chef, i) => (
              <ChefSection key={`${lang}-ch-${i}`} chef={chef} index={i} />
            ))}
          </div>
        </div>
      </section>

      <GoldLine />

      {/* ===== MENU — Centered, numbered list ===== */}
      <section id="tp-menu" className="relative pb-8 scroll-mt-16">
        <div className="max-w-[560px] md:max-w-[640px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="text-center">
              <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-4">{t.menu.label}</div>
              <h2 className="font-bebas text-[clamp(52px,14vw,90px)] text-nc-white tracking-[.04em] leading-[0.85] mb-3">{t.menu.title}</h2>
              <div className="w-8 h-[1px] bg-nc-tw-gold/20 mx-auto mb-6" />
              <p className="font-tc-serif font-light text-[clamp(12px,3vw,15px)] text-nc-silver/50 leading-[2.4] max-w-[480px] mx-auto">{t.menu.intro}</p>
            </div>
          </FadeUp>

          {/* Course grid — 2 columns on desktop */}
          <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
            {t.menu.courses.map((c, i) => (
              <CourseItem key={`${lang}-m-${i}`} course={c} index={i} />
            ))}
          </div>

          {/* Pairing */}
          <FadeUp delay={0.15}>
            <div className="mt-16 md:mt-20 text-center">
              <h4 className="font-bebas text-[clamp(18px,4.5vw,24px)] text-nc-white tracking-[.06em] mb-3">{t.menu.pairingTitle}</h4>
              <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-nc-silver/50 leading-[2.4] max-w-[460px] mx-auto">{t.menu.pairingDesc}</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-10 text-center font-tc-serif font-light text-[clamp(10px,2.5vw,12px)] text-nc-slate/50 leading-[2.2] whitespace-pre-line">{t.menu.priceNote}</p>
          </FadeUp>
        </div>
      </section>

      <GoldLine />

      {/* ===== INFO — Stacked minimal ===== */}
      <section id="tp-info" className="relative pb-8 scroll-mt-16">
        <div className="max-w-[560px] md:max-w-[800px] mx-auto px-5 md:px-6">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-4">{t.info.label}</div>
            <h2 className="font-tc-serif text-[clamp(26px,6.5vw,40px)] text-nc-white tracking-wider leading-[1.5] mb-12 md:mb-16">{t.info.title}</h2>
          </FadeUp>

          {/* Info rows */}
          <div className="space-y-8 md:space-y-10">
            {[
              { label: 'LOCATION', value: t.info.address },
              { label: t.info.hours, value: t.info.hoursDetail },
              { label: 'CONTACT', value: `${t.info.phone}\n${t.info.access}` },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="flex flex-col md:flex-row md:gap-12 py-6 border-b border-nc-tw-gold/[.05]">
                  <div className="font-ui text-[8px] tracking-[4px] uppercase text-nc-tw-gold/60 mb-3 md:mb-0 md:w-[140px] md:flex-shrink-0 md:pt-1">{item.label}</div>
                  <p className="font-tc-serif font-light text-[clamp(13px,3.5vw,15px)] text-nc-silver/60 leading-[2.2] whitespace-pre-line flex-1">{item.value}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Map placeholder */}
          <FadeUp delay={0.2}>
            <div className="mt-12 h-[180px] md:h-[280px] bg-white/[.012] rounded border border-nc-tw-gold/[.04] flex items-center justify-center">
              <span className="font-ui text-[9px] tracking-[4px] uppercase text-nc-slate/30">GOOGLE MAP — COMING SOON</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mt-8 text-center font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-nc-tw-gold/30 leading-[2.2] tracking-wider">{t.info.note}</p>
          </FadeUp>
        </div>
      </section>

      <GoldLine />

      {/* ===== CONTACT ===== */}
      <section id="tp-contact" className="relative pb-24 md:pb-36 scroll-mt-16">
        <div className="max-w-[440px] mx-auto px-5 text-center">
          <FadeUp>
            <div className="font-ui text-[9px] tracking-[6px] uppercase text-nc-tw-gold mb-4">{t.contact.label}</div>
            <h2 className="font-tc-serif text-[clamp(26px,6.5vw,38px)] text-nc-white tracking-wider leading-[1.5] mb-4">{t.contact.title}</h2>
            <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-nc-silver/40 leading-[2.4] mb-10">{t.contact.desc}</p>
          </FadeUp>
          <FadeUp delay={0.12}>
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
        <div className="max-w-[800px] mx-auto text-center">
          <div className="font-bebas text-[14px] tracking-[10px] text-nc-tw-gold/20 mb-1">TAIPEI</div>
          <div className="font-bebas text-[22px] tracking-[6px] text-nc-white mb-3">NO CODE</div>
          <p className="font-tc-serif text-[11px] text-nc-slate/40 leading-[1.8] mb-6">{t.footer.tagline}</p>
          <a href="/" className="font-ui text-[9px] tracking-[3px] uppercase text-nc-tw-gold/30 hover:text-nc-tw-gold/70 transition-colors duration-500">
            {t.footer.parent}
          </a>
          <div className="flex justify-center gap-6 mt-6">
            {['Instagram', 'Facebook'].map(s => (
              <a key={s} href="#" className="font-ui text-[9px] tracking-[2px] uppercase text-nc-slate/25 hover:text-nc-tw-gold/40 transition-colors">{s}</a>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-white/[.02] text-[10px] text-nc-slate/20">
            © 2026 No Code, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== CONCEPT ITEM — Large number + quote style ===== */
function ConceptItem({ item, index }: { item: { title: string; body: string }; index: number }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTextVisible(true); observer.unobserve(el); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mb-20 md:mb-28 last:mb-0">
      <FadeUp>
        <span className="font-bebas text-[clamp(72px,18vw,120px)] text-nc-tw-gold/[.04] leading-none block">
          {String(index + 1).padStart(2, '0')}
        </span>
      </FadeUp>

      <div ref={textRef} className="mt-[-20px] md:mt-[-30px] relative z-[1]">
        <ClipReveal delay={0.1}>
          <h3 className="font-tc-serif text-[clamp(20px,5vw,28px)] text-nc-white tracking-wider leading-[1.8] mb-5">
            <TextScramble text={item.title} trigger={textVisible} speed={30} />
          </h3>
        </ClipReveal>

        <FadeUp delay={0.2}>
          <div className="pl-5 md:pl-8 border-l border-nc-tw-gold/[.08]">
            <p className="font-tc-serif font-light text-[clamp(13px,3.5vw,16px)] text-nc-silver/60 leading-[2.6] md:leading-[2.8]">
              {item.body}
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

/* ===== CHEF SECTION — Wide photo + text below ===== */
function ChefSection({ chef, index }: { chef: { name: string; nameLocal: string; role: string; bio: string; isPlaceholder?: boolean }; index: number }) {
  return (
    <FadeUp delay={index * 0.1}>
      <div>
        {/* Photo — full width, shorter aspect */}
        <ClipReveal>
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded overflow-hidden mb-6">
            {chef.isPlaceholder ? (
              <div className="absolute inset-0 bg-gradient-to-br from-nc-charcoal via-nc-graphite to-nc-charcoal flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bebas text-[clamp(32px,8vw,48px)] text-nc-tw-gold/[.06] tracking-[.1em]">?</div>
                  <div className="font-ui text-[9px] tracking-[4px] uppercase text-nc-slate/30 mt-2">COMING SOON</div>
                </div>
              </div>
            ) : (
              <>
                <img src="/images/yonezawa.jpg" alt={chef.nameLocal} className="absolute inset-0 w-full h-full object-cover object-[center_20%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-nc-black/60 via-transparent to-nc-black/20" />
              </>
            )}
          </div>
        </ClipReveal>

        {/* Text below photo */}
        <div className="md:flex md:gap-10">
          <div className="md:w-[200px] flex-shrink-0 mb-4 md:mb-0">
            <div className="font-ui text-[8px] tracking-[4px] uppercase text-nc-tw-gold/50 mb-2">{chef.role}</div>
            <div className={`font-bebas text-[clamp(22px,5.5vw,32px)] tracking-[.04em] ${chef.isPlaceholder ? 'text-nc-slate/30' : 'text-nc-white'}`}>
              {chef.name}
            </div>
            <div className={`font-tc-serif text-[13px] tracking-wider mt-1 ${chef.isPlaceholder ? 'text-nc-slate/20' : 'text-nc-silver/35'}`}>
              {chef.nameLocal}
            </div>
          </div>
          <div className="flex-1">
            <div className="w-8 h-[1px] bg-nc-tw-gold/10 mb-4 md:mt-2" />
            <p className={`font-tc-serif font-light text-[clamp(13px,3.5vw,15px)] leading-[2.6] ${chef.isPlaceholder ? 'text-nc-slate/30 italic' : 'text-nc-silver/55'}`}>
              {chef.bio}
            </p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ===== COURSE ITEM ===== */
function CourseItem({ course, index }: { course: { name: string; desc: string }; index: number }) {
  return (
    <FadeUp delay={index * 0.06}>
      <div className="flex gap-4">
        <span className="font-bebas text-[clamp(24px,6vw,32px)] text-nc-tw-gold/[.1] leading-none pt-0.5 flex-shrink-0 w-[32px]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h4 className="font-tc-serif text-[clamp(14px,3.5vw,17px)] text-nc-white tracking-wider mb-1.5">{course.name}</h4>
          <p className="font-tc-serif font-light text-[clamp(11px,2.8vw,13px)] text-nc-slate/70 leading-[2]">{course.desc}</p>
        </div>
      </div>
    </FadeUp>
  );
}
