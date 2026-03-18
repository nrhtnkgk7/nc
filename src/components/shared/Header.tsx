'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  href: string;
  isRoute?: boolean;
}

const mainMenuItems: MenuItem[] = [
  { label: 'ABOUT', href: '#about' },
  { label: 'CHEF', href: '#chef' },
  { label: 'RESTAURANT', href: '#restaurant' },
  { label: 'PROJECT', href: '#project' },
  { label: 'CONTACT', href: '#contact' },
];

const taipeiMenuItems: MenuItem[] = [
  { label: 'CONCEPT', href: '#tp-concept' },
  { label: 'CHEF', href: '#tp-chef' },
  { label: 'MENU', href: '#tp-menu' },
  { label: 'INFO', href: '#tp-info' },
  { label: 'CONTACT', href: '#tp-contact' },
  { label: 'TOKYO', href: '/test/', isRoute: true },
];

export default function Header({ isTaipei = false }: { isTaipei?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollPosRef = useRef(0);

  const menuItems = isTaipei ? taipeiMenuItems : mainMenuItems;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---- mobile body lock ---- */
  const lockBody = useCallback(() => {
    scrollPosRef.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockBody = useCallback(() => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollPosRef.current);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) lockBody(); else unlockBody();
      return !prev;
    });
  }, [lockBody, unlockBody]);

  /* ---- navigate to section (used by both desktop & mobile) ---- */
  const navigateTo = useCallback((href: string, isRoute?: boolean) => {
    if (isRoute) {
      window.location.href = href;
      return;
    }
    /* small delay so DOM is ready after any modal close */
    requestAnimationFrame(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  /* ---- mobile menu click ---- */
  const handleMobileClick = useCallback((href: string, isRoute?: boolean) => {
    setIsOpen(false);
    unlockBody();
    if (isRoute) {
      window.location.href = href;
    } else {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [unlockBody]);

  /* ---- close on resize to desktop ---- */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
        unlockBody();
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen, unlockBody]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[120] flex items-center justify-between px-5 md:px-10 h-14 transition-all duration-500 ${
          isOpen ? 'bg-transparent' : scrolled ? 'bg-nc-black/90 backdrop-blur-xl' : 'bg-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Logo */}
        <a
          href={isTaipei ? '/test/taipei' : '/test/'}
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-bebas text-lg tracking-[4px] text-nc-white no-underline flex items-baseline gap-2"
        >
          <img src="/test/images/logo.png" alt="NO CODE" className="h-[36px] w-auto" />
          {isTaipei && <span className="font-ui text-[8px] tracking-[3px] text-nc-tw-gold/60">TAIPEI</span>}
        </a>

        {/* Desktop nav (md+) */}
        <nav className="hidden md:flex items-center gap-7">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => { e.preventDefault(); navigateTo(item.href, item.isRoute); }}
              className="font-ui text-[9px] tracking-[3px] uppercase text-nc-silver/70 hover:text-nc-gold active:text-nc-gold transition-colors duration-300 relative group"
            >
              {item.label}
              {item.isRoute && (
                <span className={`ml-1 text-[7px] ${isTaipei ? 'text-nc-gold/30' : 'text-nc-tw-gold/30'}`}>
                  {isTaipei ? '東京' : ''}
                </span>
              )}
              <span className={`absolute -bottom-1 left-0 right-full h-[1px] ${isTaipei ? 'bg-nc-tw-gold' : 'bg-nc-gold'} transition-all duration-500 group-hover:right-0`} />
            </a>
          ))}
        </nav>

        {/* Mobile hamburger (< md) */}
        <button
          onClick={toggle}
          className="relative w-7 h-4 flex flex-col justify-between z-[101] md:hidden"
          aria-label="Menu"
        >
          <motion.span animate={isOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }} className="block w-full h-[1px] bg-nc-white origin-center" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
          <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-[1px] bg-nc-white" transition={{ duration: 0.3 }} />
          <motion.span animate={isOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }} className="block w-full h-[1px] bg-nc-white origin-center" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
        </button>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] bg-nc-black/[.98] flex items-center justify-center md:hidden">
            <nav className="text-center flex flex-col">
              {menuItems.map((item, i) => (
                <motion.a key={item.label} href={item.href}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => { e.preventDefault(); handleMobileClick(item.href, item.isRoute); }}
                  className={`font-bebas text-[clamp(32px,7vw,64px)] tracking-[.06em] text-nc-white no-underline py-2 relative group ${item.isRoute ? 'mt-4' : ''}`}>
                  {item.label}
                  {item.isRoute && (
                    <span className={`ml-2 font-ui text-[9px] tracking-[2px] ${isTaipei ? 'text-nc-gold/40' : 'text-nc-tw-gold/40'}`}>
                      {isTaipei ? '東京' : '台北'}
                    </span>
                  )}
                  <span className={`absolute bottom-1 left-1/2 right-1/2 h-[1px] ${isTaipei ? 'bg-nc-tw-gold' : 'bg-nc-gold'} transition-all duration-500 group-hover:left-[20%] group-hover:right-[20%]`} />
                </motion.a>
              ))}
            </nav>
            <div className="absolute bottom-12 flex gap-8" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
              {['Instagram', 'Facebook'].map(s => (
                <a key={s} href="#" className="font-ui text-[10px] tracking-[3px] uppercase text-nc-slate hover:text-nc-gold active:text-nc-gold transition-colors">{s}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
