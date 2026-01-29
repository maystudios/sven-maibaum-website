/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090B",
        graphite: "#18181B",
        slate: "#3F3F46",
        cloud: "#FAFAFA",
        brand: "#2563EB",
        brandDark: "#1D4ED8",
        mist: "#E4E4E7",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Archivo", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 30px rgba(37, 99, 235, 0.18)",
        glass: "0 20px 60px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top, rgba(37, 99, 235, 0.15), transparent 55%), radial-gradient(circle at 20% 20%, rgba(148, 163, 184, 0.35), transparent 45%)",
        "soft-waves": "linear-gradient(120deg, rgba(15, 23, 42, 0.03) 0%, rgba(37, 99, 235, 0.08) 50%, rgba(15, 23, 42, 0.02) 100%)",
      },
    },
  },
  plugins: [],
}
