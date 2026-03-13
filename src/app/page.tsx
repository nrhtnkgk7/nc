'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/shared/Header';
import { SmoothScroll } from '@/components/shared/ScrollUtils';

const PatternX = dynamic(() => import('@/components/patterns/PatternX'), { ssr: false });
const PatternY = dynamic(() => import('@/components/patterns/PatternY'), { ssr: false });
const PatternZ = dynamic(() => import('@/components/patterns/PatternZ'), { ssr: false });

const patterns = [
  { id: 'x', label: 'X — Fluid', component: PatternX },
  { id: 'y', label: 'Y — Swipe', component: PatternY },
  { id: 'z', label: 'Z — Snap', component: PatternZ },
];

export default function Home() {
  const [activePattern, setActivePattern] = useState('x');
  const ActiveComponent = patterns.find(p => p.id === activePattern)?.component || PatternX;

  return (
    <SmoothScroll>
      {/* Pattern Selector (development only - remove in production) */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-nc-black/95 backdrop-blur-xl border-b border-white/[.03] flex items-center justify-between px-4 h-11">
        <span className="font-bebas text-sm tracking-[3px] text-nc-gold">NO CODE</span>
        <div className="flex">
          {patterns.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setActivePattern(p.id);
                window.scrollTo({ top: 0 });
              }}
              className={`px-3 py-3 font-ui text-[8px] tracking-[1.5px] uppercase border-b-2 transition-all duration-300 ${
                activePattern === p.id
                  ? 'text-nc-gold border-nc-gold'
                  : 'text-nc-slate border-transparent hover:text-nc-silver'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header with hamburger - offset for selector */}
      <div style={{ paddingTop: '44px' }}>
        <Header />
      </div>

      {/* Active Pattern */}
      <div style={{ paddingTop: '12px' }}>
        <ActiveComponent />
      </div>
    </SmoothScroll>
  );
}
