import { useNavigate } from "react-router-dom";
import Button from "./components/Button.tsx";

const App = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">

            {/* Container pentru Titlu + Linie */}
            <div className="relative mb-12">
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                    Your no1 study weapon
                </h1>
                {/* Linia decorativă - am mutat-o puțin mai jos cu bottom-[-10px] */}
                <div className="absolute left-0 bottom-[-10px] w-full h-2 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
            </div>

            {/* Butonul cu spațiu deasupra */}
            <Button
                text="Get Started"
                onClick={() => navigate("/login")}
            />
        </div>
    );
};

export default App;