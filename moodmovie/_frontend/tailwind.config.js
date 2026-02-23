/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                movieDark: '#0f172a',
                movieGold: '#fbbf24',
            }
        },
    },
    plugins: [],
}