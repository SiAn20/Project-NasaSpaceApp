/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00C573",
        primary2: "#006239",
        primary3: "#002918",
        secondary: "#898989",
        secondary2: "#B4B4B4",
        secondary3: "#4D4D4D",
        secondary4: "#FAFAFA",
        background: "#171717",
        background2: "#1F1F1F",
        border: "#292929",
        borderHover: "#454545",
        delete: "#dc2626",
        edit: "#2563eb",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      fontSize: {
        "display-sm": ["36px", { lineHeight: "44px" }],
        "display-md": ["45px", { lineHeight: "52px" }],
        "display-lg": ["57px", { lineHeight: "64px" }],
        "title-sm": ["18px", { lineHeight: "22px" }],
        "title-md": ["24px", { lineHeight: "28px" }],
        "title-lg": ["28px", { lineHeight: "32px" }],
        "label-sm": ["14px", { lineHeight: "16px" }],
        "label-md": ["16px", { lineHeight: "18px" }],
        "label-lg": ["22px", { lineHeight: "24px" }],
        "body-sm": ["14px", { lineHeight: "16px" }],
        "body-md": ["16px", { lineHeight: "18px" }],
        "body-lg": ["20px", { lineHeight: "22px" }],
      },
    },
  },
  plugins: [],
};
