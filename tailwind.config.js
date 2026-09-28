/** Mycorrhizal Mesh — cream/paper craft + turquoise accent */
module.exports = {
  content: [
    "./docs/**/*.{html,js}",
    "./src/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F4EFE4",
          elev: "#FFFBF3",
          panel: "rgba(255, 251, 243, 0.92)",
          line: "#E2D8C4",
        },
        ink: {
          DEFAULT: "#1C2420",
          soft: "#3D4A42",
          mute: "#5C6B62",
        },
        accent: {
          DEFAULT: "#0B8A8F",
          bright: "#0FA3A9",
          soft: "#D5EFF0",
        },
        canopy: {
          DEFAULT: "#2F6B4F",
          bright: "#3D8A64",
          deep: "#1F4A36",
        },
        fungal: {
          DEFAULT: "#6B4A8A",
          soft: "#8F6AAD",
          mist: "#EDE4F4",
        },
        carbon: {
          DEFAULT: "#B87A3A",
          bright: "#D4954E",
        },
        phos: {
          DEFAULT: "#0B8A8F",
          bright: "#0FA3A9",
        },
        nitro: {
          DEFAULT: "#3D6A9A",
          bright: "#5282B5",
        },
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
