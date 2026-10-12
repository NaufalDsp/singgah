/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--line)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        link: 'var(--link)',
        'link-hover': 'var(--link-hover)',
        cta: {
          DEFAULT: 'var(--cta-bg)',
          bg: 'var(--cta-bg)',
          hover: 'var(--cta-hover)',
          text: 'var(--cta-text)',
        },
        warn: {
          DEFAULT: 'var(--warn)',
          bg: 'var(--warn-bg)',
        },
        error: {
          DEFAULT: 'var(--error)',
          bg: 'var(--error-bg)',
        },
        ok: {
          DEFAULT: 'var(--ok)',
          bg: 'var(--ok-bg)',
        },
        focus: 'var(--focus)',
        musim: {
          1: 'var(--musim-1)',
          2: 'var(--musim-2)',
          3: 'var(--musim-3)',
          4: 'var(--musim-4)',
        },
      },
      fontFamily: {
        serif: 'var(--font-serif)',
        sans: 'var(--font-sans)',
      },
      borderRadius: {
        media: 'var(--r-media)',
        ui: 'var(--r-ui)',
        panel: 'var(--r-panel)',
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        float: 'var(--shadow-float)',
      },
      transitionTimingFunction: {
        singgah: 'var(--ease)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        bars: 'var(--dur-bars)',
        hero: 'var(--dur-hero)',
      },
      maxWidth: {
        container: '1360px',
        content: '66ch',
      },
    },
  },
  plugins: [],
};
