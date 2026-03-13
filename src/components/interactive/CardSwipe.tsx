'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface CardData {
  num: string;
  title: string;
  body: string;
  image: string;
}

export default function CardSwipe({ cards }: { cards: CardData[] }) {
  const [order, setOrder] = useState(cards.map((_, i) => i));

  const cycleCards = useCallback(() => {
    setOrder(prev => {
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
  }, []);

  return (
    <div className="relative h-[min(520px,85vw)] max-w-[440px] mx-auto perspective-[800px]">
      {order.map((cardIndex, stackPos) => (
        <SwipeableCard
          key={cardIndex}
          card={cards[cardIndex]}
          stackPos={stackPos}
          total={cards.length}
          onSwipe={cycleCards}
        />
      ))}
    </div>
  );
}

function SwipeableCard({
  card,
  stackPos,
  total,
  onSwipe,
}: {
  card: CardData;
  stackPos: number;
  total: number;
  onSwipe: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const scale = 1 - stackPos * 0.04;
  const yOffset = stackPos * 14;
  const cardOpacity = stackPos === 0 ? 1 : stackPos === 1 ? 0.6 : 0.3;
  const isTop = stackPos === 0;

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = 80;
      const shouldSwipe = Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 500;
      if (shouldSwipe) {
        const direction = info.offset.x > 0 ? 1 : -1;
        animate(x, direction * window.innerWidth, {
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
          onComplete: () => {
            x.set(0);
            onSwipe();
          },
        });
      }
    },
    [x, onSwipe]
  );

  return (
    <motion.div
      className="swipe-card rounded-lg overflow-hidden border border-nc-gold/10"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: yOffset,
        opacity: isTop ? opacity : cardOpacity,
        zIndex: total - stackPos,
        background: 'rgba(20, 20, 24, 0.95)',
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isTop ? handleDragEnd : undefined}
      onClick={isTop ? onSwipe : undefined}
      whileTap={isTop ? { scale: 0.98 } : undefined}
    >
      {/* Image */}
      <div className={`h-[42%] ${card.image} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,20,24,0.8)] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="font-bebas text-[48px] text-nc-gold/[.06] leading-none mb-[-8px]">
          {card.num}
        </div>
        <h3 className="font-medium text-[clamp(16px,4.5vw,20px)] text-nc-white tracking-wider mb-3 leading-relaxed">
          {card.title}
        </h3>
        <p className="font-light text-[clamp(12px,3.2vw,14px)] text-nc-silver leading-[2.2]">
          {card.body}
        </p>
      </div>

      {/* Swipe hint */}
      {isTop && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="font-ui text-[8px] tracking-[3px] uppercase text-nc-gold/30">
            SWIPE →
          </span>
        </div>
      )}
    </motion.div>
  );
}
