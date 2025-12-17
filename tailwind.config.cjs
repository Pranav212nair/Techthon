/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Saira Semi Condensed'", "ui-sans-serif", "system-ui"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        surface: "#0b0f1a",
        panel: "#11182a",
        accent: {
          50: "#ecf5ff",
          100: "#d7e8ff",
          200: "#9fc7ff",
          300: "#6ba7ff",
          400: "#3f87ff",
          500: "#296cf0",
          600: "#1b55c0",
          700: "#153f8f",
          800: "#0f2a60",
          900: "#0b1c3d",
        },
        neon: "#4ff3c0",
        glow: "#86f7ff",
        warning: "#f59e0b",
        danger: "#f43f5e",
        success: "#22c55e",
      },
      boxShadow: {
        glow: "0 10px 60px rgba(64, 160, 255, 0.25)",
        neon: "0 10px 50px rgba(79, 243, 192, 0.35)",
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 20%, rgba(79,243,192,0.12), transparent 20%), radial-gradient(circle at 80% 0%, rgba(134,247,255,0.10), transparent 24%), radial-gradient(circle at 50% 80%, rgba(79,243,192,0.15), transparent 30%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
