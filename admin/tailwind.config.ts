import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Wise palette */
        green: { DEFAULT: "#9FE870", press: "#8CDE5A", light: "#D7F0B6", faint: "#EAF5E0" },
        forest: "#163300",
        ink: "#0D0F0A",
        muted: { DEFAULT: "#6B6E68", 2: "#8A8D86" },
        card: { DEFAULT: "#F4F5F2", 2: "#ECEEE9" },
        line: "#E7E8E3",
        pos: "#17803D",
        neg: "#C0453F",
      },
      fontFamily: {
        wise: ['"Wise Sans"', '"Inter"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "20px" },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: { rise: "rise .5s cubic-bezier(.2,.7,.2,1) both" },
    },
  },
  plugins: [],
} satisfies Config;
