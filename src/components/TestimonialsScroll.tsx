import { motion, useReducedMotion } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.trim().split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [142, 165, 200, 170, 130, 220];
  const hue = hues[hash % hues.length];
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
      style={{ backgroundColor: `hsl(${hue}, 48%, 30%)` }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function Card({ item }: { item: Testimonial }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <Stars count={item.rating} />
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground)]">
        "{item.text}"
      </p>
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={item.name} />
        <div>
          <div className="text-sm font-semibold text-[var(--color-foreground)]">{item.name}</div>
          <div className="text-xs text-[var(--color-muted-fg)]">{item.role}</div>
        </div>
      </div>
    </div>
  );
}

function Column({ items, duration, className }: { items: Testimonial[]; duration: number; className?: string }) {
  return (
    <div className={className ?? ''}>
      <motion.div
        animate={{ y: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col gap-4"
      >
        {[0, 1].map(idx => (
          <div key={idx} className="flex flex-col gap-4 pb-4">
            {items.map((item, i) => <Card key={i} item={item} />)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialsScroll({ testimonials }: { testimonials: Testimonial[] }) {
  const prefersReduced = useReducedMotion() ?? false;

  const col1 = testimonials.slice(0, 3);
  const col2 = testimonials.slice(3, 6);
  const col3 = testimonials.slice(6, 9);

  if (prefersReduced) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => <Card key={i} item={item} />)}
      </div>
    );
  }

  return (
    <div className="flex gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] max-h-[660px] overflow-hidden">
      <Column items={col1} duration={22} className="flex-1" />
      <Column items={col2} duration={28} className="hidden md:block md:flex-1" />
      <Column items={col3} duration={25} className="hidden lg:block lg:flex-1" />
    </div>
  );
}
