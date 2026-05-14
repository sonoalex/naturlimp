import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, LayoutGroup } from 'framer-motion';
import { TextRotate, type TextRotateRef } from './TextRotate';

interface Props {
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badge: string;
  lang: 'es' | 'ca';
}

const SPRING = { type: 'spring', damping: 30, stiffness: 400 } as const;

// 4-pointed star centered at origin — the classic "shiny clean surface" glint
function glintPath(s: number): string {
  const w = s, h = s * 0.72, t = s * 0.055;
  return `M 0 ${-h} L ${t} ${-t} L ${w} 0 L ${t} ${t} L 0 ${h} L ${-t} ${t} L ${-w} 0 L ${-t} ${-t} Z`;
}

interface Glint { id: number; x: number; y: number; s: number; delay: number }
const GLINTS: Glint[] = [
  { id: 0,  x: 88, y: 10, s: 3.5, delay: 0.0 },
  { id: 1,  x: 78, y: 8,  s: 1.8, delay: 1.2 },
  { id: 2,  x: 94, y: 22, s: 2.5, delay: 5.7 },
  { id: 3,  x: 83, y: 35, s: 5.0, delay: 2.1 },
  { id: 4,  x: 91, y: 48, s: 2.0, delay: 7.3 },
  { id: 5,  x: 76, y: 55, s: 3.8, delay: 1.8 },
  { id: 6,  x: 96, y: 62, s: 1.5, delay: 4.9 },
  { id: 7,  x: 85, y: 72, s: 4.5, delay: 3.2 },
  { id: 8,  x: 92, y: 84, s: 2.2, delay: 6.5 },
  { id: 9,  x: 55, y: 5,  s: 2.8, delay: 0.5 },
  { id: 10, x: 66, y: 12, s: 1.6, delay: 8.4 },
  { id: 11, x: 73, y: 20, s: 3.2, delay: 1.1 },
  { id: 12, x: 6,  y: 20, s: 2.0, delay: 4.8 },
  { id: 13, x: 12, y: 45, s: 3.0, delay: 0.6 },
  { id: 14, x: 4,  y: 70, s: 1.8, delay: 7.5 },
  { id: 15, x: 42, y: 90, s: 2.5, delay: 3.4 },
  { id: 16, x: 60, y: 88, s: 3.5, delay: 6.0 },
  { id: 17, x: 75, y: 92, s: 2.0, delay: 1.8 },
  { id: 18, x: 30, y: 18, s: 1.5, delay: 5.0 },
  { id: 19, x: 48, y: 40, s: 2.2, delay: 2.7 },
  { id: 20, x: 22, y: 62, s: 1.8, delay: 8.1 },
];

export default function HeroAnimation({ subheadline, ctaPrimary, ctaSecondary, badge, lang }: Props) {
  const prefersReduced = useReducedMotion();
  const line1Ref = useRef<TextRotateRef>(null);
  const adjRef   = useRef<TextRotateRef>(null);

  const isCa = lang === 'ca';

  // Paired noun + adjective — index-locked so they always tell the same story
  const line1Texts = isCa
    ? ['La teva comunitat,', 'La teva piscina,', 'El teu local,', 'El teu edifici,', 'La teva obra,', 'La teva oficina,']
    : ['Tu comunidad,',      'Tu piscina,',      'Tu local,',     'Tu edificio,',     'Tu obra,',      'Tu oficina,'];

  const adjTexts = isCa
    ? ['impecable', 'brillant',  'perfecte', 'com nou',   'relluent',   'impecable']
    : ['impecable', 'brillante', 'perfecto', 'como nuevo','reluciente', 'impecable'];

  const line2Static  = isCa ? 'sempre'   : 'siempre';
  const contactHref  = isCa ? '#contacte' : '#contacto';
  const servicesHref = isCa ? '#serveis'  : '#servicios';

  const trustSignals = isCa
    ? ['200+ clients actius', '15 anys a Tarragona', 'Assegurança RC inclosa']
    : ['200+ clientes activos', '15 años en Tarragona', 'Seguro RC incluido'];

  // Single timer drives both rotations in lockstep
  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      line1Ref.current?.next();
      adjRef.current?.next();
    }, 2800);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const item = (delay: number) => ({
    initial: prefersReduced ? {} : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReduced ? {} : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  });

  return (
    <section
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-[var(--color-foreground)] text-white"
      aria-label={isCa ? 'Secció principal' : 'Sección principal'}
    >
      {/* Background: glow + grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 70% at 10% 60%, rgba(21,128,61,0.20) 0%, transparent 65%),
            radial-gradient(ellipse 45% 50% at 85% 15%, rgba(8,145,178,0.10) 0%, transparent 55%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, 52px 52px, 52px 52px',
        }}
        aria-hidden="true"
      />

      {/* Sparkle glints — the shine of a just-cleaned surface */}
      {!prefersReduced && (
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {GLINTS.map(({ id, x, y, s, delay }) => {
            const dur = 1.8 + s * 0.2;
            const rDelay = 5 + (id % 5) * 1.3;
            return (
              <g key={id} transform={`translate(${x} ${y})`}>
                <motion.g
                  initial={{ opacity: 0, scale: 0.1 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.1, 1, 1, 0.4] }}
                  transition={{ duration: dur, repeat: Infinity, repeatDelay: rDelay, ease: 'easeInOut', delay }}
                >
                  {/* Soft bloom around the glint */}
                  <path d={glintPath(s * 2.2)} fill="white" fillOpacity={0.06} />
                  {/* Main glint */}
                  <path d={glintPath(s)} fill="white" fillOpacity={0.92} />
                </motion.g>
              </g>
            );
          })}
        </svg>
      )}

      {/* Decorative large numeral */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="block font-display font-bold leading-none text-white"
          style={{ fontSize: 'clamp(180px, 26vw, 440px)', opacity: 0.03 }}
        >
          15
        </span>
      </div>

      {/* Accent line */}
      <motion.div
        className="absolute left-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
        initial={prefersReduced ? {} : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={prefersReduced ? {} : { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ width: '100%', transformOrigin: 'left' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 sm:px-10 lg:px-14">

        {/* Badge */}
        <motion.div
          {...item(0.15)}
          className="mb-10 flex justify-center sm:justify-start"
        >
        <span className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-primary-light)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
            {badge}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.div {...item(0.25)}>
          <h1
            className="font-display font-bold tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 7.5vw, 6rem)', lineHeight: 1.05 }}
          >

            {/* Line 1 — rotating full phrase */}
            <span className="mb-2 flex justify-center sm:justify-start">
              {prefersReduced ? (
                line1Texts[0]
              ) : (
                <TextRotate
                  ref={line1Ref}
                  texts={line1Texts}
                  auto={false}
                  staggerFrom="first"
                  staggerDuration={0.013}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-120%' }}
                  splitLevelClassName="overflow-hidden pb-px"
                  transition={SPRING}
                />
              )}
            </span>

            {/* Line 2 — "siempre" + rotating adjective pill */}
            <LayoutGroup>
              <motion.span
                layout
                transition={SPRING}
                className="flex flex-wrap items-baseline justify-center gap-x-3 sm:justify-start"
              >
                <motion.span layout transition={SPRING}>
                  {line2Static}
                </motion.span>

                {prefersReduced ? (
                  <span className="inline-flex items-center rounded-lg bg-[var(--color-primary-light)] px-3 py-0.5 text-[var(--color-foreground)]">
                    {adjTexts[0]}
                  </span>
                ) : (
                  <TextRotate
                    ref={adjRef}
                    texts={adjTexts}
                    auto={false}
                    staggerFrom="last"
                    staggerDuration={0.022}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-120%' }}
                    splitLevelClassName="overflow-hidden pb-px"
                    transition={SPRING}
                    mainClassName="text-[var(--color-foreground)] px-3 py-0.5 bg-[var(--color-primary-light)] overflow-hidden rounded-lg items-center justify-center"
                  />
                )}
              </motion.span>
            </LayoutGroup>

          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          {...item(0.42)}
          className="mt-8 max-w-lg text-lg font-normal text-white/50 leading-relaxed text-center sm:text-left"
        >
          {subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div {...item(0.54)} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
          <a
            href={contactHref}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary)] hover:scale-[1.02] active:scale-[0.99]"
          >
            {ctaPrimary}
          </a>
          <a
            href={servicesHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-8 py-4 text-base font-medium text-white/70 transition-all duration-200 hover:border-white/30 hover:text-white"
          >
            {ctaSecondary}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </motion.div>

        {/* Trust signals */}
        <motion.div {...item(0.66)} className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-2 sm:justify-start">
          {trustSignals.map((signal) => (
            <span key={signal} className="flex items-center gap-2 text-sm text-white/35">
              <span className="h-px w-4 bg-[var(--color-primary)]" aria-hidden="true" />
              {signal}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...item(0.8)}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex h-8 w-5 justify-center rounded-full border border-white/15 pt-1.5">
          <motion.div
            className="h-1.5 w-px rounded-full bg-white/25"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
