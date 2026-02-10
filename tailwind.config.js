// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{ts,tsx,js,jsx}",
      "./pages/**/*.{ts,tsx,js,jsx}",
      "./components/**/*.{ts,tsx,js,jsx}",
      // add paths where your UI lives
    ],
    theme: {
      extend: {
        colors: {
          ijl: {
            navy: "#002E5D",
            title: "#001F3C",
            accent: "#5A5A8A",
            muted: "#9292B1",
            border: "#E6E7E8",
            ctabg: "#F2F4FA",
          },
        },
        fontFamily: {
          // map CSS variables to Tailwind font families
          oswald: ["var(--font-oswald)", "ui-sans-serif", "system-ui", "sans-serif"],
          proxima: ["var(--font-proxima)", "ui-sans-serif", "system-ui", "sans-serif"],
        },
      },
    },
    plugins: [],
  };
  