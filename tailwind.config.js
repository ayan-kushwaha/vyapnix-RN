/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"], // Humne yahan src folder bhi add kiya hai
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [
    
  ],
};