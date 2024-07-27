/** @type {import('tailwindcss').Config} */

import { Config } from "tailwindcss";
import sharedConfig from "@mcqapp/tailwind-config";

const config: Partial<Config> = {
  presets: [sharedConfig],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        pink: "#ff49db",
        orange: "#ff7849",
        red: "#800000",
        "light-red": "#ff7f50",
        yellow: "#FFDB58",
        primary: "#121212",
        "gray-dark": "#292929",
        gray: "#989898",
        "gray-light": "#E2E2E2",
      },
      boxShadow: {
        "big-button":
          "0px 1px 0px 0px rgba(0,0,0,0.22),0px 0px 0px 0px rgba(0,0,0,0.22),0px 2px 0px 0px rgba(0,0,0,0.22),0px 1px 0px 0px rgba(0,0,0,0.22),0px 3px 0px 0px rgba(0,0,0,0.22),0px 2px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 3px 0px 0px rgba(0,0,0,0.22),0px 0px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 3px 0px 0px rgba(0,0,0,0.22),0px 3px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22),0px 4px 0px 0px rgba(0,0,0,0.22);",
      },
    },
  },
};

export default config;

// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         blue: "#3700B3",
//         purple: "#6200EE",
//         "purple-light": "#BB86FC",
//         pink: "#ff49db",
//         orange: "#ff7849",
//         green: "#00ab41",
//         "light-green": "#abf7b1",
//         red: "#800000",
//         "light-red": "#ff7f50",
//         yellow: "#FFDB58",
//         primary: "#121212",
//         "gray-dark": "#292929",
//         gray: "#989898",
//         "gray-light": "#E2E2E2",
//       },
//     },
//   },
//   plugins: [],
//   darkMode: "selector",
// };
