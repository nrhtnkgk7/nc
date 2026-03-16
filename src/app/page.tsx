'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/shared/Header';
import { SmoothScroll } from '@/components/shared/ScrollUtils';
import LoadingScreen from '@/components/interactive/LoadingScreen';

const PatternX = dynamic(() => import('@/components/patterns/PatternX'), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const onComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={onComplete} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        <SmoothScroll>
          <Header />
          <PatternX />
        </SmoothScroll>
      </div>
    </>
  );
}
