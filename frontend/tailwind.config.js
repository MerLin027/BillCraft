/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        background: "#0a0a0a",
        surface: "#111111",
        card: "#1a1a1a",
        border: "#2a2a2a",
        primary: "#22c55e",
        hover: "#16a34a",
        danger: "#ef4444",
        // Text
        "text-primary": "#f5f5f5",
        "text-secondary": "#888888",
        // Status
        "status-paid": "#22c55e",
        "status-pending": "#f59e0b",
        "status-overdue": "#ef4444",
        // Legacy aliases (kept for backward compat)
        "primary-dark": "#16a34a",
        "background-dark": "#0a0a0a",
        "card-dark": "#171717",
        "border-dark": "rgba(255,255,255,0.1)",
        "text-dim": "#a3a3a3",
        "text-main": "#f5f5f5",
        "text-muted": "#9ca3af",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        logo: ["Pacifico", "cursive"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "load-progress": "loadProgress 2s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "page-enter": "fadeInUp 0.22s ease-out forwards",
        "page-exit": "fadeOutUp 0.18s ease-in forwards",
      },
      keyframes: {
        loadProgress: {
          "0%": { width: "0%" },
          "100%": { width: "75%" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOutUp: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
}