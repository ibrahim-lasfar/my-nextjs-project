/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // Use the Tailwind CSS plugin directly
    autoprefixer: {}, // Ensure Autoprefixer is included
  },
};

export default config;