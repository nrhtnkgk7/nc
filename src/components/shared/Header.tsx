'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { label: 'ABOUT', href: '#about' },
  { label: 'CHEF', href: '#chef' },
  { label: 'RESTAURANT', href: '#restaurant' },
  { label: 'PROJECT', href: '#project' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  }, []);

  const scrollTo = useCallback((href: string) => {
    setIsOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10 h-14 transition-all duration-500 ${
          scrolled ? 'bg-nc-black/90 backdrop-blur-xl' : 'bg-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-bebas text-lg tracking-[4px] text-nc-white no-underline"
        >
          NO CODE
        </a>
        <button
          onClick={toggle}
          className="relative w-7 h-4 flex flex-col justify-between"
          aria-label="Menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
            className="block w-full h-[1px] bg-nc-white origin-center"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-full h-[1px] bg-nc-white"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
            className="block w-full h-[1px] bg-nc-white origin-center"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] bg-nc-black/[.98] backdrop-blur-3xl flex items-center justify-center"
          >
            <nav className="text-center flex flex-col">
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: 0.05 + i * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.href);
                  }}
                  className="font-bebas text-[clamp(36px,8vw,72px)] tracking-[.06em] text-nc-white no-underline py-2 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-1 left-1/2 right-1/2 h-[1px] bg-nc-gold transition-all duration-500 group-hover:left-[20%] group-hover:right-[20%]" />
                </motion.a>
              ))}
            </nav>
            <div className="absolute bottom-12 flex gap-8" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
              {['Instagram', 'Facebook'].map(s => (
                <a key={s} href="#" className="font-ui text-[10px] tracking-[3px] uppercase text-nc-slate hover:text-nc-gold transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
