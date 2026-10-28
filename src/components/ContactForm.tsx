import { useState } from 'react';
import Button from './Button';

interface Props {
  t: {
    name: string;
    phone: string;
    phone_hint?: string;
    service: string;
    service_options: Record<string, string>;
    zone?: string;
    zone_placeholder?: string;
    message?: string;
    message_placeholder?: string;
    consent?: string;
    privacy_policy?: string;
    submit: string;
    submitting: string;
    success: string;
    required: string;
    error_generic?: string;
    error?: string;
  };
  lang?: 'es' | 'ca';
  dark?: boolean;
}

interface Errors {
  name?: string;
  phone?: string;
  service?: string;
}

export default function ContactForm({ t, lang = 'es', dark = false }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      const firstKey = Object.keys(errs)[0] as keyof Errors;
      const el = form.elements.namedItem(firstKey) as HTMLInputElement | HTMLSelectElement | null;
      el?.focus();
      return;
    }

    setStatus('loading');
    try {
      const selectedServiceKey = String(data.get('service') || '');
      const serviceLabel = t.service_options[selectedServiceKey] || selectedServiceKey;

      const payload = {
        name: String(data.get('name') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        service: serviceLabel,
        zone: String(data.get('zone') || '').trim(),
        message: String(data.get('message') || '').trim(),
        _gotcha: String(data.get('_gotcha') || ''),
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al enviar el formulario');
      }

      setStatus('success');
      form.reset();
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const fieldClass = (field: keyof Errors) => {
    const isError = touched[field] && errors[field];
    const base =
      'w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[44px]';
    if (dark) {
      return `${base} bg-white/10 text-white placeholder:text-white/40 border-white/20 hover:border-white/40 ${
        isError ? 'border-red-400 bg-red-500/10 ring-1 ring-red-400' : ''
      }`;
    }
    return `${base} bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 hover:border-slate-400 ${
      isError ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : ''
    }`;
  };

  const standardFieldClass = dark
    ? 'w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors duration-200 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[44px]'
    : 'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[44px]';

  const labelClass = `mb-1.5 block text-sm font-semibold ${dark ? 'text-white' : 'text-slate-800'}`;
  const hintClass = `mt-1 text-xs ${dark ? 'text-white/60' : 'text-slate-500'}`;
  const errorClass = `mt-1 text-xs font-medium ${dark ? 'text-red-400' : 'text-red-600'}`;

  if (status === 'success') {
    return (
      <div
        role="alert"
        className="rounded-xl border border-[var(--color-accent)] bg-[var(--color-primary-light)] p-8 text-center"
      >
        <svg className="mx-auto mb-4 text-[var(--color-accent)]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
        </svg>
        <p className="font-heading font-semibold text-[var(--color-primary-dark)] text-base">{t.success}</p>
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
      {/* Honeypot field for anti-spam */}
      <input
        type="text"
        name="_gotcha"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {t.name} <span aria-hidden="true" className="text-red-500 font-bold ml-0.5">*</span>
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
          placeholder={lang === 'es' ? 'Tu nombre y apellidos' : 'El teu nom i cognoms'}
        />
        {touched.name && errors.name && (
          <p id="error-name" role="alert" className={errorClass}>{errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          {t.phone} <span aria-hidden="true" className="text-red-500 font-bold ml-0.5">*</span>
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
          placeholder="600 000 000"
        />
        {t.phone_hint && <p id="phone-hint" className={hintClass}>{t.phone_hint}</p>}
        {touched.phone && errors.phone && (
          <p id="error-phone" role="alert" className={errorClass}>{errors.phone}</p>
        )}
      </div>

      {/* Service */}
      <div>
        <label htmlFor="contact-service" className={labelClass}>
          {t.service} <span aria-hidden="true" className="text-red-500 font-bold ml-0.5">*</span>
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
          <option value="" disabled className={dark ? 'bg-slate-900 text-white' : 'text-slate-500'}>
            {lang === 'es' ? 'Selecciona un servicio' : 'Selecciona un servei'}
          </option>
          {Object.entries(t.service_options).map(([key, label]) => (
            <option key={key} value={key} className={dark ? 'bg-slate-900 text-white' : 'text-slate-900'}>
              {label}
            </option>
          ))}
        </select>
        {touched.service && errors.service && (
          <p id="error-service" role="alert" className={errorClass}>{errors.service}</p>
        )}
      </div>

      {/* Zone */}
      <div>
        <label htmlFor="contact-zone" className={labelClass}>
          {t.zone || (lang === 'es' ? 'Población / Zona' : 'Població / Zona')}
        </label>
        <input
          id="contact-zone"
          name="zone"
          type="text"
          autoComplete="address-level2"
          className={standardFieldClass}
          placeholder={t.zone_placeholder || 'Tarragona, Reus, Salou, Cambrils...'}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t.message || (lang === 'es' ? '¿En qué podemos ayudarte?' : 'En què et podem ajudar?')}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          className={`${standardFieldClass} resize-y`}
          placeholder={t.message_placeholder || (lang === 'es' ? 'Detalles sobre la limpieza (m2 aproximados, frecuencia, fechas...)' : 'Detalls sobre la neteja (m2 aproximats, freqüència, dates...)')}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={status === 'loading'}
        variant="primary"
        size="lg"
        className="w-full shadow-lg"
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
        <p role="alert" className={`text-center text-sm font-medium ${dark ? 'text-red-400' : 'text-red-600'}`}>
          {t.error || t.error_generic || (lang === 'es' ? 'Error al enviar el formulario. Por favor, llámanos directamente.' : 'Error en enviar el formulari. Si us plau, truca’ns directament.')}
        </p>
      )}
    </form>
  );
}
