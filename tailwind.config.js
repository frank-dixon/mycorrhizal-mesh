/** Mycorrhizal Mesh — forest soil + fungal trade tokens */
module.exports = {
  content: [
    "./docs/**/*.{html,js}",
    "./src/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        soil: {
          DEFAULT: "#0f1410",
          elev: "#161c18",
          panel: "rgba(18, 24, 20, 0.88)",
        },
        canopy: {
          DEFAULT: "#2f6b4f",
          bright: "#4a9a72",
          deep: "#1a3d2c",
        },
        fungal: {
          DEFAULT: "#6b4a8a",
          soft: "#8f6aad",
          dim: "#3a284c",
        },
        carbon: {
          DEFAULT: "#d4a574",
          bright: "#e8c49a",
        },
        phos: {
          DEFAULT: "#3d9e8f",
          bright: "#5ec4b4",
        },
        nitro: {
          DEFAULT: "#6b8cae",
          bright: "#8eabd0",
        },
        mist: {
          DEFAULT: "#a8b5a8",
          dim: "#6a756a",
        },
        ink: "#e8efe8",
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        brand: "0.28em",
        wide2: "0.16em",
      },
    },
  },
  plugins: [],
};
