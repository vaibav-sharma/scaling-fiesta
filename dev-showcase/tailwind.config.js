/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable manual class switching
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // color tokens will come from CSS vars
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        sand: "var(--color-sand)",
        softwhite: "var(--color-softwhite)",
        cyan: "var(--color-cyan)",
      },
      colors: {
        // your existing custom colors
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        sand: "var(--color-sand)",
        softwhite: "var(--color-softwhite)",
        cyan: "var(--color-cyan)",

        // 👇 Add Shadcn semantic tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};