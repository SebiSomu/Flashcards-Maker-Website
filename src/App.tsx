import { useState } from "react";
import MainNavBar from "./components/MainNavBar.tsx";
import Hero from "./components/Hero.tsx";
import Button from "./components/Button.tsx";
import LoginModal from "./components/LoginModal.tsx";
import About from "./components/About.tsx"; // Import nou
import HowItWorks from "./components/HowItWorks.tsx"; // Import nou

// src/App.tsx
const App = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-start p-10 md:p-20 relative">
            <MainNavBar />

            <div className="mt-16 w-full">
                <Hero title="Your no1 study weapon" />

                <div className="mt-4">
                    <Button
                        text="Get Started"
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-white text-slate-950 hover:bg-slate-200 border-none px-6 py-2 text-xs font-black uppercase tracking-widest transition-all"
                    />
                </div>

                {/* Secțiunile cu ID-uri pentru scroll */}
                <div className="space-y-32 mt-32">
                    <div id="about">
                        <About />
                    </div>
                    <div id="how-it-works">
                        <HowItWorks />
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
};

export default App;