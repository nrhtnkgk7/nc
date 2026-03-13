'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/shared/Header';
import { SmoothScroll } from '@/components/shared/ScrollUtils';

const PatternX = dynamic(() => import('@/components/patterns/PatternX'), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <PatternX />
    </SmoothScroll>
  );
}
