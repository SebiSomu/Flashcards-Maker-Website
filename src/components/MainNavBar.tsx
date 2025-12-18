import logoImg from "../assets/site_logo.png";

const MainNavBar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-6 bg-transparent z-50">
            <div className="flex items-center gap-3">
                <img
                    src={logoImg}
                    alt="FlashCraft Logo"
                    className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                    FlashCraft
                </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <span className="text-slate-400 text-xs font-medium hover:text-white cursor-pointer transition-colors">
                    How it works
                </span>
                <div className="w-px h-4 bg-slate-800"></div> {/* Separator vizual */}
                <span className="text-slate-400 text-xs font-medium hover:text-white cursor-pointer transition-colors">
                    About
                </span>
            </div>
        </nav>
    );
};

export default MainNavBar;