import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavBar from "../components/MainNavBar.tsx";
import Hero from "../components/Hero.tsx";
import Button from "../components/Button.tsx";
import LoginModal from "../components/LoginModal.tsx";
import About from "../components/About.tsx";
import HowItWorks from "../components/HowItWorks.tsx";
import FlashcardAnimation from "../components/FlashcardAnimation.tsx";
import Footer from "../components/Footer.tsx";

const Home = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-base-100 flex flex-col relative">
            <MainNavBar />

            <div className="flex-1 flex flex-col items-start px-10 md:px-20 pt-28 w-full">
                <div className="mt-4 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Text and CTA */}
                    <div>
                        <Hero title="Your no1 study weapon" />
                        <p className="mt-6 text-base-content/70 text-lg leading-relaxed max-w-md">
                            Master any subject with our intelligent flashcard system. Create, organize, and study faster than ever before.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <Button
                                text="Get Started"
                                onClick={() => setIsLoginModalOpen(true)}
                                className="bg-base-content text-base-100 hover:bg-base-content/90 border-none px-6 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg"
                            />
                            <Button
                                text="Create Cards"
                                onClick={() => navigate('/create')}
                                className="bg-primary text-primary-content hover:bg-primary/90 border-none px-6 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                            />
                        </div>
                    </div>

                    {/* Right Side: Professional Animation */}
                    <div className="hidden md:flex justify-center items-center">
                        <FlashcardAnimation />
                    </div>

                </div>

                <div className="space-y-32 mt-32 w-full">
                    <div id="about" className="scroll-mt-32">
                        <About />
                    </div>
                    <div id="how-it-works" className="scroll-mt-32">
                        <HowItWorks />
                    </div>
                </div>
            </div>


            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
            <Footer />
        </div >
    );
};

export default Home;
