import Button from "./Button";

const App = () => {
    return (
        <div className="min-h-screen bg-[#e0e7ff] flex flex-col items-center justify-center">
            <h1 className="relative text-5xl md:text-7xl font-black text-slate-800 tracking-tighter inline-block
                     after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-full after:h-1 after:bg-slate-800">
                Your no1 study weapon
            </h1>
            <Button />
        </div>
    );
};

export default App;