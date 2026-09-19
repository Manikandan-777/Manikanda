import type { Config } from "tailwindcss";

/**
 * Colours are defined as CSS custom properties in globals.css (light + dark),
 * except --accent which is injected at runtime from content/settings.json.
 * This keeps the palette to one accent + one neutral ramp, per the design brief.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        "accent-contrast": "var(--accent-contrast)",
        "accent-ink": "var(--accent-ink)",
        // shadcn-style aliases so registry components (ui/*) resolve to our ramp
        background: "var(--bg)",
        foreground: "var(--fg)",
        "muted-foreground": "var(--muted)",
        ring: "var(--accent)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // A deliberately wide type scale — large jumps between levels.
        "display-1": ["clamp(2.4rem, 9vw, 5.5rem)", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(1.85rem, 6vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        "heading": ["clamp(1.4rem, 2.5vw, 1.9rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        prose: "68ch",
        shell: "1180px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};

export default config;
