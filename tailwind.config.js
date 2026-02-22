/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Swiss dark palette
        ink: "#09090B",
        graphite: "#18181B",
        slate: "#3F3F46",
        cloud: "#FAFAFA",
        mist: "#E4E4E7",
        brand: "#3b82f6",
        brandDark: "#2563EB",
        brandLight: "#60a5fa",
        border: 'var(--sw-border)',
        muted: 'var(--sw-muted)',
        faint: 'var(--sw-text-faint)',
        surface2: 'var(--sw-surface-light)',
        // Adaptive tokens (light/dark via CSS variables)
        fg: 'var(--sw-fg)',
        canvas: 'var(--sw-bg)',
        surface: 'var(--sw-surface)',
        // Keep for backward compat
        zinc: {
          800: "#27272a",
          700: "#3f3f46",
          600: "#52525b",
          500: "#71717a",
          400: "#a1a1aa",
          300: "#d4d4d8",
        },
      },
      fontFamily: {
        display: ["Geist", "system-ui", "sans-serif"],
        body: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        accent: "0 0 0 1px #3b82f6",
        "accent-inset": "inset 0 0 0 1px #3b82f6",
      },
      backgroundImage: {
        "swiss-grid": "linear-gradient(rgba(39,39,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(39,39,42,0.4) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
