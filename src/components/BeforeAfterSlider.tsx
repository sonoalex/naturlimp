'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface SlideItem {
  before: string;
  after: string;
  label: string;
  beforeAlt: string;
  afterAlt: string;
}

interface Props {
  items: SlideItem[];
  dragHint: string;
  lang: 'es' | 'ca';
  dark?: boolean;
}

const SliderItem = ({ item, lang, dark }: { item: SlideItem; lang: 'es' | 'ca'; dark: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Position from 0 to 100
  const xPercent = useMotionValue(50);
  
  // Spring for smooth movement
  const springX = useSpring(xPercent, {
    stiffness: 400,
    damping: 40,
    mass: 1
  });

  // Transform values for styling
  const clipPath = useTransform(springX, (val) => `inset(0 0 0 ${val}%)`);
  const handleLeft = useTransform(springX, (val) => `${val}%`);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    xPercent.set(percentage);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
  };

  const labelClass = `mb-3 text-xs font-bold font-display uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-[var(--color-muted-fg)]'}`;

  return (
    <div className="group flex flex-col">
      <p className={labelClass}>{item.label}</p>
      
      <div 
        ref={containerRef}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Before Image (Base) */}
        <img 
          src={item.before} 
          alt={item.beforeAlt} 
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          draggable="false"
        />

        {/* After Image (Clipped Overlay) */}
        <motion.div 
          className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
          style={{ clipPath }}
        >
          <img 
            src={item.after} 
            alt={item.afterAlt} 
            className="absolute inset-0 h-full w-full object-cover"
            draggable="false"
          />
        </motion.div>

        {/* Separator Line */}
        <motion.div 
          className="absolute inset-y-0 z-20 w-[1px] bg-gradient-to-b from-transparent via-white/80 to-transparent pointer-events-none"
          style={{ left: handleLeft, x: '-50%' }}
        />

        {/* Handle Button */}
        <motion.div
          className="absolute top-1/2 z-30 pointer-events-none"
          style={{ 
            left: handleLeft, 
            x: '-50%', 
            y: '-50%'
          }}
        >
          {/* Outer expansion ring */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-[var(--color-primary)]/20"
            animate={{ 
              scale: isDragging ? 1.8 : 1,
              opacity: isDragging ? 1 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />

          {/* Main Handle */}
          <motion.div
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[var(--color-primary)] text-white shadow-2xl backdrop-blur-sm"
            animate={{
              scale: isDragging ? 0.94 : 1,
              backgroundColor: isDragging ? 'var(--color-primary-dark)' : 'var(--color-primary)'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <motion.svg 
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="relative z-10"
            >
              <motion.path 
                d="M8 17l-5-5 5-5" 
                animate={{ x: isDragging ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              <motion.path 
                d="M16 7l5 5-5 5" 
                animate={{ x: isDragging ? 2 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </motion.svg>

            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Badges */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-between px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:opacity-100">
          <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold font-display uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
            {lang === 'es' ? 'Antes' : 'Abans'}
          </span>
          <span className="rounded-full bg-[var(--color-primary)]/80 px-3 py-1 text-[10px] font-bold font-display uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
            {lang === 'es' ? 'Después' : 'Després'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function BeforeAfterSlider({ items, dragHint, lang, dark = false }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col">
            <p className="mb-3 text-xs font-bold font-display uppercase tracking-[0.2em] opacity-50">{item.label}</p>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-800">
              <img src={item.after} alt={item.afterAlt} className="h-full w-full object-cover opacity-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }


  const hintClass = `mt-10 text-center text-sm flex items-center justify-center gap-3 transition-colors ${dark ? 'text-white/30 group-hover:text-white/50' : 'text-[var(--color-muted-fg)]'}`;

  return (
    <div className="group/section">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
        {items.map((item, i) => (
          <SliderItem key={i} item={item} lang={lang} dark={dark} />
        ))}
      </div>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={hintClass}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current opacity-50">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M7 12h10M7 12l3-3M7 12l3 3M17 12l-3-3M17 12l3 3"/>
          </svg>
        </span>
        {dragHint}
      </motion.p>
    </div>
  );
}
