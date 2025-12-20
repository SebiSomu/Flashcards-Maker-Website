import { Link, useLocation } from "react-router-dom";

const MainNavBar = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <nav className="fixed top-0 left-0 w-full z-50 py-4 px-10 md:px-20 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center transition-all">
            <div>
                <Link to="/" className="text-white font-black text-xl tracking-tighter uppercase italic">
                    FLASH<span className="text-blue-600">CRAFT</span>
                </Link>
            </div>

            <div className="flex gap-8">
                {isHome && (
                    <>
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
                    </>
                )}
            </div>
        </nav>
    );
};

export default MainNavBar;