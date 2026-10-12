import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false, // Menjaga token.css dan global.css tetap mengendalikan reset dasar
    }),
  ],
  build: {
    format: 'directory',
  },
});
