import type { Config } from "tailwindcss";

// Configuration Tailwind CSS pour Govzy
// Inclut la palette de couleurs officielle et la typographie de la marque
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Palette de couleurs Govzy
      colors: {
        govzy: {
          blue: "#1B3F8B",       // Bleu institutionnel (primaire)
          "blue-light": "#4A90D9", // Bleu moderne (secondaire)
          orange: "#FF6B35",      // Orange énergique (accent)
          bg: "#F5F7FA",          // Fond gris clair
          text: "#2D3748",        // Texte anthracite
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Typographie Govzy : Poppins (titres) + Inter (corps)
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      // Taille minimale des boutons tactiles (44px standard)
      minHeight: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
export default config;
