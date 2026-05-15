import React, { useState, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

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

/**
 * Custom handle for the slider.
 * Separated to ensure stable rendering.
 */
const CustomHandle = (props: any) => {
  const { style, ...rest } = props;
  return (
    <div 
      {...rest} 
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px', // Aumentamos el área de toque
        marginLeft: '-20px', // Centramos el área de toque sobre la línea
        backgroundColor: 'transparent',
        height: '100%',
        cursor: 'ew-resize',
        zIndex: 10,
        touchAction: 'none', // Bloqueamos gestos nativos para tomar control total
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {/* Línea central visible */}
      <div style={{ width: '2px', height: '100%', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }} />
      
      {/* Círculo del handle */}
      <div
        className="absolute flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] shadow-xl"
        style={{ 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none' // El toque lo gestiona el contenedor de 40px
        }}
      >
        <svg 
          width="20" height="20" viewBox="0 0 24 24" 
          fill="none" stroke="white" strokeWidth="3" 
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
          <path d="m9 18 6-6-6-6" transform="translate(4,0)" />
        </svg>
      </div>
    </div>
  );
};

export default function BeforeAfterSlider({ items, dragHint, lang, dark = false }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const labelClass = `mb-2 text-xs font-semibold uppercase tracking-widest ${dark ? 'text-white/40' : 'text-[var(--color-muted-fg)]'}`;
  const hintClass = `mt-6 text-center text-sm flex items-center justify-center gap-2 ${dark ? 'text-white/30' : 'text-[var(--color-muted-fg)]'}`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i}>
            <p className={labelClass}>{item.label}</p>
            <div 
              className="relative overflow-hidden rounded-xl border border-white/5 shadow-lg bg-neutral-800" 
              style={{ height: '280px', touchAction: 'pan-y' }}
            >
              {/* Only render the interactive slider once mounted to avoid hydration mismatch */}
              {mounted ? (
                <ReactCompareSlider
                  handle={<CustomHandle />}
                  position={50}
                  itemOne={
                    <ReactCompareSliderImage
                      src={item.before}
                      alt={item.beforeAlt}
                      style={{ objectFit: 'cover', height: '100%' }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={item.after}
                      alt={item.afterAlt}
                      style={{ objectFit: 'cover', height: '100%' }}
                    />
                  }
                  style={{ height: '100%', width: '100%' }}
                />
              ) : (
                /* Fallback for SSR / SEO / Initial Load */
                <img 
                  src={item.after} 
                  alt={item.afterAlt} 
                  className="w-full h-full object-cover" 
                />
              )}
              
              {/* Badges */}
              <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-between px-3">
                <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                  {lang === 'es' ? 'Antes' : 'Abans'}
                </span>
                <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                  {lang === 'es' ? 'Después' : 'Després'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className={hintClass}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M5 9l-3 3 3 3M19 9l3 3-3 3M2 12h20"/>
        </svg>
        {dragHint}
      </p>
    </div>
  );
}
