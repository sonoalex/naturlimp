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

function Handle() {
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] shadow-lg"
      style={{ cursor: 'ew-resize' }}
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6" />
        <polyline points="9 18 15 12 9 6" transform="translate(6,0)" />
      </svg>
    </div>
  );
}

export default function BeforeAfterSlider({ items, dragHint, lang, dark = false }: Props) {
  const labelClass = `mb-2 text-xs font-semibold uppercase tracking-widest ${dark ? 'text-white/40' : 'text-[var(--color-muted-fg)]'}`;
  const hintClass = `mt-6 text-center text-sm flex items-center justify-center gap-2 ${dark ? 'text-white/30' : 'text-[var(--color-muted-fg)]'}`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i}>
            <p className={labelClass}>{item.label}</p>
            <div className="relative overflow-hidden rounded-xl">
              <ReactCompareSlider
                handle={<Handle />}
                itemOne={
                  <ReactCompareSliderImage
                    src={item.before}
                    alt={item.beforeAlt}
                    style={{ objectFit: 'cover' }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={item.after}
                    alt={item.afterAlt}
                    style={{ objectFit: 'cover' }}
                  />
                }
                style={{ height: '260px' }}
                aria-label={`${lang === 'es' ? 'Comparación antes y después' : 'Comparació abans i després'}: ${item.label}`}
              />
              <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {lang === 'es' ? 'Antes' : 'Abans'}
              </span>
              <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-[var(--color-primary)]/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {lang === 'es' ? 'Después' : 'Després'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className={hintClass}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
        </svg>
        {dragHint}
      </p>
    </div>
  );
}
