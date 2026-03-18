'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useReveal } from '@/components/shared/ScrollUtils';
import { ScrollProgressBar } from '@/components/interactive/Effects';
import { taipeiContent, type Lang } from '@/lib/taipeiContent';

/* ===== Fade ===== */
function Fade({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
      transition: `all 1.1s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
    }}>{children}</div>
  );
}

/* ===== Word-by-word reveal (replaces TextScramble) ===== */
function WordReveal({ text, className = '', trigger = true, stagger = 0.08, initialDelay = 0 }: {
  text: string; className?: string; trigger?: boolean; stagger?: number; initialDelay?: number;
}) {
  const words = text.split(/(\s+)/);
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={trigger ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: initialDelay + (i * stagger), duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block"
        >
          {word === ' ' ? '\u00A0' : word}
        </motion.span>
      ))}
    </span>
  );
}

/* ===== Char-by-char reveal for hero ===== */
function CharReveal({ text, className = '', trigger = true, stagger = 0.04, initialDelay = 0 }: {
  text: string; className?: string; trigger?: boolean; stagger?: number; initialDelay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: '100%' }}
          animate={trigger ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: initialDelay + (i * stagger), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${char === ' ' ? 'w-[.25em]' : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ===== Text visible hook ===== */
function useTextVisible(threshold = 0.4) {
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
            className={`font-tc-serif text-[11px] tracking-[1px] transition-colors duration-300 ${lang === code ? 'text-tp-warm' : 'text-tp-mist hover:text-tp-tea'}`}>
            {label}
          </button>
          {i < arr.length - 1 && <span className="text-tp-stone mx-1.5 text-[10px]">·</span>}
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
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[90] w-9 h-9 rounded-full border border-tp-stone flex items-center justify-center backdrop-blur-sm hover:border-tp-tea transition-colors"
          aria-label="Top">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M2 5L6 1L10 5" stroke="#B8AFA2" strokeWidth="0.8" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* =============== MAIN =============== */
export default function TaipeiSite() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.82]);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');
  useEffect(() => { setTimeout(() => setMounted(true), 500); }, []);

  const t = taipeiContent[lang];

  return (
    <div className="bg-tp-bg">
      <ScrollProgressBar />
      <BackToTop />

      {/* Lang switcher */}
      <div className="fixed top-[18px] right-[68px] md:right-[80px] z-[101]">
        <LangSwitch lang={lang} setLang={setLang} />
      </div>

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="h-svh relative overflow-hidden">
        <motion.div style={{ scale: imgScale }} className="absolute inset-0 z-0">
          <img src="/test/images/taipei-hero.jpg" alt="Taipei" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-[1] bg-tp-bg" />

        {/* Text — bottom left */}
        <motion.div style={{ y: textY }} className="absolute bottom-0 left-0 right-0 z-[3] p-6 md:p-12 lg:p-16">
          <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.3, duration: 1 }}
            className="font-tc-serif text-[10px] md:text-[11px] tracking-[4px] text-tp-tea/50 mb-8">
            PRIVATE DINING
          </motion.div>

          <div className="overflow-hidden">
            <CharReveal text="TAIPEI" trigger={mounted} stagger={0.06} initialDelay={0.2}
              className="font-tc-serif font-bold text-[clamp(52px,15vw,130px)] text-tp-cream/70 tracking-[.03em] leading-[0.82] block" />
          </div>
          <div className="overflow-hidden">
            <CharReveal text="NO CODE" trigger={mounted} stagger={0.05} initialDelay={0.6}
              className="font-tc-serif font-bold text-[clamp(52px,15vw,130px)] text-tp-cream tracking-[.03em] leading-[0.82] block" />
          </div>

          <motion.div initial={{ scaleX: 0 }} animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-14 md:w-20 h-[1px] bg-tp-tea/30 mt-8 mb-5 origin-left" />

          <motion.p initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}
            className="font-tc-serif font-light text-[clamp(12px,3vw,15px)] text-tp-ash/60 tracking-[2px] leading-[2] max-w-[360px]">
            {t.hero.tagline}
          </motion.p>
        </motion.div>

        {/* Scroll */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}
          className="absolute bottom-8 right-6 md:right-12 z-[3] flex items-center gap-3">
          <span className="font-tc-serif text-[8px] tracking-[2px] text-tp-ash/30 [writing-mode:vertical-rl]">SCROLL</span>
          <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-tp-tea/25 origin-top" />
        </motion.div>
      </section>

      {/* ===== CONCEPT ===== */}
      <section id="tp-concept" className="scroll-mt-16">
        <div className="py-24 md:py-36 px-6 md:px-12 lg:px-16 max-w-[1100px] mx-auto">
          <Fade>
            <span className="font-tc-serif text-[10px] tracking-[5px] text-tp-tea/40 block mb-16 md:mb-24">{t.concept.label}</span>
          </Fade>

          {t.concept.items.map((item, i) => (
            <ConceptRow key={`${lang}-c-${i}`} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ===== CHEF ===== */}
      <section id="tp-chef" className="scroll-mt-16">
        <div className="h-[1px] bg-tp-line/40 mx-6 md:mx-12" />
        <div className="py-24 md:py-36 px-6 md:px-12 lg:px-16 max-w-[1100px] mx-auto">
          <Fade>
            <span className="font-tc-serif text-[10px] tracking-[5px] text-tp-tea/40 block mb-14 md:mb-20">{t.chef.label}</span>
          </Fade>
          <div className="space-y-20 md:space-y-28">
            {t.chef.chefs.map((chef, i) => (
              <ChefBand key={`${lang}-ch-${i}`} chef={chef} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MENU ===== */}
      <section id="tp-menu" className="scroll-mt-16">
        <div className="h-[1px] bg-tp-line/40 mx-6 md:mx-12" />
        <div className="py-24 md:py-36 px-6 md:px-12 lg:px-16 max-w-[720px] mx-auto">
          <Fade>
            <div className="text-center mb-16 md:mb-24">
              <span className="font-tc-serif text-[10px] tracking-[5px] text-tp-tea/40 block mb-8">{t.menu.label}</span>
              <h2 className="font-tc-serif font-semibold text-[clamp(36px,10vw,64px)] text-tp-cream tracking-[.02em] leading-[1]">{t.menu.title}</h2>
              <div className="w-5 h-[1px] bg-tp-tea/20 mx-auto my-6" />
              <p className="font-tc-serif font-light text-[clamp(12px,3vw,15px)] text-tp-ash/50 leading-[2.4] max-w-[480px] mx-auto">{t.menu.intro}</p>
            </div>
          </Fade>

          <div className="space-y-0">
            {t.menu.courses.map((c, i) => (
              <Fade key={`${lang}-m-${i}`} delay={i * 0.04}>
                <div className="group py-5 md:py-6 border-b border-tp-line/30 hover:border-tp-tea/20 transition-colors duration-700">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h4 className="font-tc-serif text-[clamp(15px,4vw,18px)] text-tp-warm group-hover:text-tp-cream transition-colors duration-700">{c.name}</h4>
                    <span className="font-tc-serif text-[12px] text-tp-mist/30">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="font-tc-serif font-light text-[clamp(11px,2.8vw,13px)] text-tp-mist/60 leading-[2]">{c.desc}</p>
                </div>
              </Fade>
            ))}
          </div>

          <Fade delay={0.15}>
            <div className="mt-16 text-center">
              <div className="w-4 h-[1px] bg-tp-tea/15 mx-auto mb-5" />
              <h4 className="font-tc-serif text-[clamp(16px,4vw,20px)] text-tp-warm mb-3">{t.menu.pairingTitle}</h4>
              <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-tp-ash/40 leading-[2.4] max-w-[420px] mx-auto">{t.menu.pairingDesc}</p>
            </div>
          </Fade>

          <Fade delay={0.2}>
            <p className="mt-10 text-center font-tc-serif font-light text-[clamp(10px,2.5vw,12px)] text-tp-mist/35 leading-[2.2] whitespace-pre-line">{t.menu.priceNote}</p>
          </Fade>
        </div>
      </section>

      {/* ===== INFO ===== */}
      <section id="tp-info" className="scroll-mt-16">
        <div className="h-[1px] bg-tp-line/40 mx-6 md:mx-12" />
        <div className="py-24 md:py-36 px-6 md:px-12 lg:px-16 max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row md:gap-20">
            <div className="md:w-[35%] mb-12 md:mb-0">
              <Fade>
                <span className="font-tc-serif text-[10px] tracking-[5px] text-tp-tea/40 block mb-6">{t.info.label}</span>
                <h2 className="font-tc-serif font-medium text-[clamp(26px,6.5vw,40px)] text-tp-cream tracking-wider leading-[1.5] mb-6">{t.info.title}</h2>
                <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-tp-tea/25 leading-[2.2] tracking-wider">{t.info.note}</p>
              </Fade>
            </div>
            <div className="flex-1 space-y-0">
              {[
                { label: 'LOCATION', value: t.info.address },
                { label: t.info.hours, value: t.info.hoursDetail },
                { label: 'CONTACT', value: `${t.info.phone}\n${t.info.access}` },
              ].map((item, i) => (
                <Fade key={i} delay={i * 0.08}>
                  <div className="py-6 border-b border-tp-line/25">
                    <div className="font-tc-serif text-[9px] tracking-[3px] text-tp-tea/40 mb-3">{item.label}</div>
                    <p className="font-tc-serif font-light text-[clamp(13px,3.5vw,15px)] text-tp-warm/60 leading-[2.2] whitespace-pre-line">{item.value}</p>
                  </div>
                </Fade>
              ))}
            </div>
          </div>

          <Fade delay={0.2}>
            <div className="mt-14 h-[200px] md:h-[280px] bg-tp-stone/20 rounded flex items-center justify-center border border-tp-line/20">
              <span className="font-tc-serif text-[10px] tracking-[3px] text-tp-mist/25">GOOGLE MAP — COMING SOON</span>
            </div>
          </Fade>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="tp-contact" className="scroll-mt-16">
        <div className="h-[1px] bg-tp-line/40 mx-6 md:mx-12" />
        <div className="py-24 md:py-36 px-6 max-w-[440px] mx-auto text-center">
          <Fade>
            <span className="font-tc-serif text-[10px] tracking-[5px] text-tp-tea/40 block mb-6">{t.contact.label}</span>
            <h2 className="font-tc-serif font-medium text-[clamp(26px,6.5vw,36px)] text-tp-cream tracking-wider leading-[1.5] mb-4">{t.contact.title}</h2>
            <p className="font-tc-serif font-light text-[clamp(12px,3vw,14px)] text-tp-ash/35 leading-[2.4] mb-10">{t.contact.desc}</p>
          </Fade>
          <Fade delay={0.1}>
            <button className="font-tc-serif text-[11px] tracking-[4px] text-tp-warm border border-tp-tea/15 px-10 py-5 hover:bg-tp-tea/[.04] active:bg-tp-tea/[.08] transition-all duration-700">
              {t.contact.btn}
            </button>
          </Fade>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-tp-line/25 py-12 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-tc-serif font-semibold text-[18px] tracking-[2px] text-tp-cream">NO CODE</span>
                <span className="font-tc-serif text-[12px] tracking-[4px] text-tp-tea/25">TAIPEI</span>
              </div>
              <p className="font-tc-serif font-light text-[11px] text-tp-mist/30 leading-[1.8]">{t.footer.tagline}</p>
            </div>
            <div className="flex items-center gap-8">
              <a href="/test/" className="font-tc-serif text-[10px] tracking-[2px] text-tp-tea/25 hover:text-tp-tea/60 transition-colors duration-500">
                {t.footer.parent}
              </a>
              <a href="#" className="font-tc-serif text-[10px] tracking-[2px] text-tp-mist/20 hover:text-tp-tea/40 transition-colors">Instagram</a>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-tp-line/15 text-[10px] text-tp-mist/15 font-tc-serif">
            © 2026 No Code, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== CONCEPT ROW ===== */
function ConceptRow({ item, index }: { item: { title: string; body: string }; index: number }) {
  const { ref, visible } = useTextVisible();

  return (
    <div className="mb-24 md:mb-32 last:mb-0">
      <div className="flex gap-6 md:gap-14 items-start">
        <Fade>
          <span className="font-tc-serif text-[clamp(56px,14vw,100px)] text-tp-stone/50 leading-none flex-shrink-0 w-[50px] md:w-[90px] font-light">
            {String(index + 1).padStart(2, '0')}
          </span>
        </Fade>

        <div className="flex-1 pt-2 md:pt-4" ref={ref}>
          <Fade delay={0.1}>
            <h3 className="font-tc-serif font-medium text-[clamp(20px,5vw,30px)] text-tp-cream tracking-wider leading-[1.8] mb-5">
              <WordReveal text={item.title} trigger={visible} stagger={0.1} />
            </h3>
          </Fade>
          <Fade delay={0.2}>
            <p className="font-tc-serif font-light text-[clamp(13px,3.5vw,16px)] text-tp-ash/55 leading-[2.6] md:leading-[2.8]">
              {item.body}
            </p>
          </Fade>
        </div>
      </div>

      <Fade delay={0.3}>
        <div className="mt-12 md:mt-16 h-[1px] bg-tp-line/25" />
      </Fade>
    </div>
  );
}

/* ===== CHEF BAND ===== */
function ChefBand({ chef, index }: { chef: { name: string; nameLocal: string; role: string; bio: string; isPlaceholder?: boolean }; index: number }) {
  return (
    <div>
      <Fade>
        <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0`}>
          <div className="w-full md:w-[55%] flex-shrink-0">
            <div className="relative aspect-[3/2] overflow-hidden rounded-sm">
              {chef.isPlaceholder ? (
                <div className="absolute inset-0 bg-tp-stone/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-tc-serif text-[36px] text-tp-mist/15 font-light">?</div>
                    <div className="font-tc-serif text-[10px] tracking-[3px] text-tp-mist/20 mt-2">COMING SOON</div>
                  </div>
                </div>
              ) : (
                <>
                  <img src="/test/images/yonezawa1.jpg" alt={chef.nameLocal} className="absolute inset-0 w-full h-full object-cover object-[center_15%]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-tp-bg/25" />
                </>
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col justify-center py-8 md:py-0 ${index % 2 === 0 ? 'md:pl-10 lg:pl-14' : 'md:pr-10 lg:pr-14'}`}>
            <div className="font-tc-serif text-[9px] tracking-[3px] text-tp-tea/35 mb-4">{chef.role}</div>
            <div className={`font-tc-serif font-semibold text-[clamp(24px,6vw,34px)] tracking-[.02em] mb-1 ${chef.isPlaceholder ? 'text-tp-mist/20' : 'text-tp-cream'}`}>
              {chef.name}
            </div>
            <div className={`font-tc-serif text-[14px] tracking-wider mb-6 ${chef.isPlaceholder ? 'text-tp-mist/12' : 'text-tp-ash/30'}`}>
              {chef.nameLocal}
            </div>
            <div className="w-5 h-[1px] bg-tp-tea/12 mb-5" />
            <p className={`font-tc-serif font-light text-[clamp(13px,3.5vw,15px)] leading-[2.6] ${chef.isPlaceholder ? 'text-tp-mist/20 italic' : 'text-tp-ash/50'}`}>
              {chef.bio}
            </p>
          </div>
        </div>
      </Fade>
    </div>
  );
}
