/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grape: "rgba(114, 46, 204, 1)",
        background: "rgba(var(--background),  <alpha-value>)",
        "border-color": "rgba(var(--border-color),  <alpha-value>)",
        "card-bg-color": "rgba(var(--card-bg-color),  <alpha-value>)",
        "copy-primary": "rgba(var(--copy-primary),  <alpha-value>)",
        "copy-secondary": "rgba(var(--copy-secondary),  <alpha-value>)",
        cta: "rgba(var(--cta),  <alpha-value>)",
        "cta-active": "rgba(var(--cta-active),  <alpha-value>)",
        "cta-text": "rgba(var(--cta-text),  <alpha-value>)",
      },
    },
  },
  plugins: [],
};
