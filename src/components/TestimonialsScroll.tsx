import { useReducedMotion } from 'framer-motion';

export interface Testimonial {
  name: string;
  role?: string;
  rating: number;
  text: string;
  date?: string;
  source?: string;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function Avatar({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2);
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [142, 165, 200, 170, 130, 220, 155, 185];
  const hue = hues[hash % hues.length];
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-inner uppercase"
      style={{ backgroundColor: `hsl(${hue}, 46%, 32%)` }}
      aria-hidden="true"
    >
      {initials.toUpperCase()}
    </div>
  );
}

function Card({ item }: { item: Testimonial }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Stars count={item.rating} />
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-600">
          <GoogleIcon />
          <span>Google</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-foreground)]">
        “{item.text}”
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={item.name} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[var(--color-foreground)] truncate">{item.name}</div>
            <div className="text-[11px] text-[var(--color-muted-fg)] truncate">{item.role || 'Reseña de Google'}</div>
          </div>
        </div>
        {item.date && (
          <span className="text-[11px] text-[var(--color-muted-fg)] tabular-nums shrink-0 whitespace-nowrap">{item.date}</span>
        )}
      </div>
    </div>
  );
}

function Column({ items, duration, className }: { items: Testimonial[]; duration: number; className?: string }) {
  return (
    <div className={`${className ?? ''} overflow-hidden`}>
      <div
        className="flex flex-col gap-4 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        style={{
          animation: `scroll-vertical ${duration}s linear infinite`,
        }}
      >
        {[0, 1].map(idx => (
          <div key={idx} className="flex flex-col gap-4 pb-4">
            {items.map((item, i) => <Card key={`${idx}-${i}`} item={item} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsScroll({ testimonials }: { testimonials: Testimonial[] }) {
  const prefersReduced = useReducedMotion() ?? false;

  const col1: Testimonial[] = [];
  const col2: Testimonial[] = [];
  const col3: Testimonial[] = [];

  testimonials.forEach((item, index) => {
    if (index % 3 === 0) col1.push(item);
    else if (index % 3 === 1) col2.push(item);
    else col3.push(item);
  });

  if (prefersReduced) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => <Card key={i} item={item} />)}
      </div>
    );
  }

  return (
    <div className="flex gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)] max-h-[700px] overflow-hidden">
      <Column items={col1} duration={45} className="flex-1" />
      <Column items={col2} duration={55} className="hidden md:block md:flex-1" />
      <Column items={col3} duration={50} className="hidden lg:block lg:flex-1" />
    </div>
  );
}
