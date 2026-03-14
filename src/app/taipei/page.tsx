'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/shared/Header';
import { SmoothScroll } from '@/components/shared/ScrollUtils';

const TaipeiSite = dynamic(() => import('@/components/patterns/TaipeiSite'), { ssr: false });

export default function TaipeiPage() {
  return (
    <SmoothScroll>
      <Header isTaipei />
      <TaipeiSite />
    </SmoothScroll>
  );
}
