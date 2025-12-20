// src/components/MainNavBar.tsx
const MainNavBar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 py-4 px-10 md:px-20 bg-slate-950 border-b border-white/10 flex justify-between items-center">
            {/* Logo-ul */}
            <div>
                <a href="/" className="text-white font-black text-xl tracking-tighter uppercase italic">
                    FLASH<span className="text-blue-600">CRAFT</span>
                </a>
            </div>

            {/* Link-urile de navigare */}
            <div className="flex gap-8">
                <a
                    href="#about"
                    className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                >
                    About
                </a>
                <a
                    href="#how-it-works"
                    className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                >
                    How it Works
                </a>
            </div>
        </nav>
    );
};

export default MainNavBar;