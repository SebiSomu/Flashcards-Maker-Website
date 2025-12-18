import MainNavBar from "./components/MainNavBar.tsx";
import Hero from "./components/Hero.tsx";
import Button from "./components/Button.tsx";
import { useNavigate } from "react-router-dom";

const App = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative">
            <MainNavBar />

            <Hero title="Your no1 study weapon" />

            <Button
                text="Get Started"
                onClick={() => navigate("/login")}
                className="bg-white text-slate-950 hover:bg-slate-200 border-none px-12"
            />
        </div>
    );
};

export default App;