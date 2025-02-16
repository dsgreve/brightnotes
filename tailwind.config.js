/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-one": "rgba(var(--primary-one), <alpha-value>)",
        "primary-two": "rgba(var(--primary-two), <alpha-value>)",
        "neutral-one": "rgba(var(--neutral-one), <alpha-value>)",
        "neutral-two": "rgba(var(--neutral-two), <alpha-value>)",
        accent: "rgba(var(--accent), <alpha-value>)",
        "copy-primary": "rgba(var(--copy-primary), <alpha-value>)",
        background: "rgba(var(--background),  <alpha-value>)",
        "border-color": "rgba(var(--border-color),  <alpha-value>)",
        "card-bg-color": "rgba(var(--card-bg-color),  <alpha-value>)",
        "copy-primary": "rgba(var(--copy-primary),  <alpha-value>)",
        "copy-secondary": "rgba(var(--copy-secondary),  <alpha-value>)",
        cta: "rgba(var(--cta),  <alpha-value>)",
        "cta-active": "rgba(var(--cta-active),  <alpha-value>)",
        "cta-text": "rgba(var(--cta-text),  <alpha-value>)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(160deg, rgba(var(--primary-one), 1), rgba(var(--primary-two), 1) 100%)",
      },
    },
  },
  plugins: [],
};
