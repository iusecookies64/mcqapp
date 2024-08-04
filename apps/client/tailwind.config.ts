import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "selector",
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
      boxShadow: {
        "big-button":
          "0px 1px 0px 0px rgba(0,0,0,0.22),0px 0px 0px 0px rgba(0,0,0,0.22),0px 2px 0px 0px rgba(0,0,0,0.22),0px 1px 0px 0px rgba(0,0,0,0.22),0px 2px 0px 0px rgba(0,0,0,0.22),0px 2px 0px 0px rgba(0,0,0,0.22),0px 2px 0px 0px rgba(0,0,0,0.22),0px 2px 0px 0px rgba(0,0,0,0.22),0px 3px 0px 0px rgba(0,0,0,0.22),0px 3px 0px 0px rgba(0,0,0,0.22),0px 3px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 5px 0px 0px rgba(0,0,0,0.22),0px 5px 0px 0px rgba(0,0,0,0.22);",
      },
      animation: {
        // Modal
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out forwards",
        // Popover, Tooltip
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-fade":
          "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Navigation menu
        "enter-from-right": "enter-from-right 0.3s ease",
        "enter-from-left": "enter-from-left 0.15s ease",
        "enter-from-top": "enter-from-top 0.15s ease",
        "exit-to-bottom": "exit-to-bottom 0.15s ease",
        "exit-to-right": "exit-to-right 0.15s ease",
        "exit-to-left": "exit-to-left 0.15s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        // Accordion
        "accordion-down": "accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-up": "accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        // Custom wiggle animation
        wiggle: "wiggle 0.75s infinite",
        // Custom spinner animation (for loading-spinner)
        spinner: "spinner 1.2s linear infinite",
        // Custom blink animation (for loading-dots)
        blink: "blink 1.4s infinite both",
        // Custom pulse animation
        pulse: "pulse 1s linear infinite alternate",
      },
      keyframes: {
        // Modal
        "scale-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Popover, Tooltip
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: "0", transform: "translateX(-2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: "0", transform: "translateY(-2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: "0", transform: "translateX(2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Navigation menu
        "enter-from-right": {
          "0%": { transform: "translateX(100px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "enter-from-top": {
          "0%": { opacity: "0", transform: "translateY(-100px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "exit-to-bottom": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(100px)" },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(200px)", opacity: "0" },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-200px)", opacity: "0" },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: "0" },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: "0" },
        },
        // Accordion
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Custom wiggle animation
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-4px) rotate(-4deg)" },
          "30%": { transform: "translateX(6px) rotate(4deg)" },
          "45%": { transform: "translateX(-6px) rotate(-2.4deg)" },
          "60%": { transform: "translateX(2px) rotate(1.6deg)" },
          "75%": { transform: "translateX(-1px) rotate(-0.8deg)" },
        },
        // Custom spinner animation (for loading-spinner)
        spinner: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        // Custom blink animation (for loading-dots)
        blink: {
          "0%": {
            opacity: "0.2",
          },
          "20%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0.2",
          },
        },
        // Custom pulse animation
        pulse: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
      colors: {
        text: "#060814",
        "text-secondary": "#141933",
        primary: "#eff2fa",
        secondary: "#c3c9d9",
        "dark-text": "#F8F9F9",
        "dark-text-secondary": "#A8B3CF",
        "dark-primary": "#0E1217",
        "dark-secondary": "#1C1F26",
        border: "#383D47",
        "border-secondary": "#404040",
      },
    },
  },
};

export default config;
