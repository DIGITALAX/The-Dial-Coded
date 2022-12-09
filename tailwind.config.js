/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dosis: "Dosis Regular",
      },
      colors: {
        offBlack: "#111313",
        offBlue: "#81A8F8",
        offWhite: "#F2F2F2",
        midGreen: "#09C261",
        midWhite: "#FAF4E8",
        mustard: "#FBEED1",
        midMus: "#FDF3D8",
        heat: "#FBDB86",
        deep: "#0091FF",
        libGray: "#DEDCE1",
        flight: "#F0E7E2",
        viol: "#9DA1F4",
        liBl: "#A3E3F4",
        liOr: "#F9C571",
        liVi: "#C1A8E8",
        offY: "#FEEA66",
        liDa: "#F27A24",
        grayBlue: "#C9D8E4",
        lime: "#77FFB8",
        baby: "#53B4FF",
        lily: "#F6DDC3",
        lili: "#B4FAB5",
        bluey: "#32C5FF",
        offYellow: "#F7F7F3",
      },
    },
  },
  plugins: [],
};
