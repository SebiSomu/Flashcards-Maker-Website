/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [
        daisyui,
    ],
    daisyui: {
        themes: [
            "dark",
            {
                light: {
                    "primary": "#2563eb", // Blue-600
                    "primary-content": "#ffffff",

                    // Backgrounds
                    "base-100": "#f0f9ff", // Sky-50: Very faint blue/white

                    // "Light blue" for cards, footers, buttons (distinct from base-100)
                    "base-200": "#A5C9F2", // Lavender Blue (requested #A5C9F2)
                    "base-300": "#60a5fa", // Blue-400: Darker accent for borders

                    "base-content": "#0f172a", // Slate-900: Text
                },
            },
        ],
    },
}