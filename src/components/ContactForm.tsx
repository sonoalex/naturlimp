import { useState, useRef } from 'react';
import Button from './Button';

interface FormT {
  name: string;
  phone: string;
  service: string;
  zone: string;
  message: string;
  service_options: Record<string, string>;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  required: string;
  phone_hint: string;
}

interface Props {
  t: FormT;
  lang: 'es' | 'ca';
}

interface Errors {
  name?: string;
  phone?: string;
  service?: string;
}

export default function ContactForm({ t, lang }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const firstErrorRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    if (!String(data.get('name')).trim()) e.name = t.required;
    const phone = String(data.get('phone')).trim();
    if (!phone) e.phone = t.required;
    else if (!/^[\d\s+\-()]{7,15}$/.test(phone)) {
      e.phone = lang === 'es' ? 'Teléfono no válido' : 'Telèfon no vàlid';
    }
    if (!String(data.get('service'))) e.service = t.required;
    return e;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);

    setTouched({ name: true, phone: true, service: true });
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Focus first error field
      const firstKey = Object.keys(errs)[0] as keyof Errors;
      const el = form.elements.namedItem(firstKey) as HTMLInputElement | HTMLSelectElement | null;
      el?.focus();
      return;
    }

    setStatus('loading');
    try {
      // Replace with your actual form endpoint (Netlify, Formspree, etc.)
      await new Promise(r => setTimeout(r, 1200));
      setStatus('success');
      form.reset();
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const fieldClass = (field: keyof Errors) =>
    `w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-200 bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 min-h-[44px] ${
      touched[field] && errors[field]
        ? 'border-[var(--color-destructive)] bg-[var(--color-destructive-light)]'
        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
    }`;

  if (status === 'success') {
    return (
      <div
        role="alert"
        className="rounded-xl border border-[var(--color-accent)] bg-[var(--color-primary-light)] p-8 text-center"
      >
        <svg className="mx-auto mb-4 text-[var(--color-accent)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
        </svg>
        <p className="font-heading font-semibold text-[var(--color-primary-dark)]">{t.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={lang === 'es' ? 'Formulario de contacto' : 'Formulari de contacte'}
      className="space-y-5"
    >
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {t.name} <span aria-hidden="true" className="text-[var(--color-destructive)]">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? 'error-name' : undefined}
          onBlur={() => handleBlur('name')}
          className={fieldClass('name')}
        />
        {touched.name && errors.name && (
          <p id="error-name" role="alert" className="mt-1 text-xs text-[var(--color-destructive)]">{errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {t.phone} <span aria-hidden="true" className="text-[var(--color-destructive)]">*</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          aria-required="true"
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby={`phone-hint${errors.phone ? ' error-phone' : ''}`}
          onBlur={() => handleBlur('phone')}
          className={fieldClass('phone')}
        />
        <p id="phone-hint" className="mt-1 text-xs text-[var(--color-muted-fg)]">{t.phone_hint}</p>
        {touched.phone && errors.phone && (
          <p id="error-phone" role="alert" className="mt-1 text-xs text-[var(--color-destructive)]">{errors.phone}</p>
        )}
      </div>

      {/* Service */}
      <div>
        <label htmlFor="contact-service" className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {t.service} <span aria-hidden="true" className="text-[var(--color-destructive)]">*</span>
        </label>
        <select
          id="contact-service"
          name="service"
          required
          aria-required="true"
          aria-invalid={touched.service && !!errors.service}
          aria-describedby={errors.service ? 'error-service' : undefined}
          onBlur={() => handleBlur('service')}
          className={`${fieldClass('service')} cursor-pointer`}
          defaultValue=""
        >
          <option value="" disabled>{lang === 'es' ? 'Selecciona un servicio' : 'Selecciona un servei'}</option>
          {Object.entries(t.service_options).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {touched.service && errors.service && (
          <p id="error-service" role="alert" className="mt-1 text-xs text-[var(--color-destructive)]">{errors.service}</p>
        )}
      </div>

      {/* Zone */}
      <div>
        <label htmlFor="contact-zone" className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {t.zone}
        </label>
        <input
          id="contact-zone"
          name="zone"
          type="text"
          autoComplete="address-level2"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm transition-colors duration-200 hover:border-[var(--color-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[44px]"
          placeholder="Tarragona, Reus, Salou..."
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm transition-colors duration-200 hover:border-[var(--color-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={status === 'loading'}
        variant="primary"
        size="lg"
        className="w-full"
        aria-busy={status === 'loading'}
        leftIcon={status === 'loading' ? (
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        ) : undefined}
      >
        {status === 'loading' ? t.submitting : t.submit}
      </Button>

      {status === 'error' && (
        <p role="alert" className="text-center text-sm text-[var(--color-destructive)]">{t.error}</p>
      )}
    </form>
  );
}
