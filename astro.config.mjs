import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://naturlimp.com',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          ca: 'ca-ES',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca'],
    routing: { prefixDefaultLocale: false },
  },
  build: { assets: '_assets' },
  compressHTML: true,
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
