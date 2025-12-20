
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    // Initialize state from local storage or system preference, default to dark
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );

    // Apply theme on mount and change
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        // Toggle 'dark' class for Tailwind 'class' strategy
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-24 right-6 md:top-28 md:right-10 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 active:scale-95 group"
            aria-label="Toggle Theme"
        >
            {/* Sun Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-500 ${theme === "dark" ? "text-yellow-400 rotate-0" : "text-orange-500 rotate-180"
                    }`}
            >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>

            {/* Optional: Add a moon icon for light mode if desired, but user asked specifically for a sun on the button */}
        </button>
    );
};

export default ThemeToggle;
