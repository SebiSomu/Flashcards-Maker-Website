interface HeroProps {
    title: string;
}

const Hero = ({ title }: HeroProps) => {
    return (
        <div className="relative mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                {title}
            </h1>
            <div className="absolute left-0 bottom-[-10px] w-full h-2 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
        </div>
    );
};

export default Hero;