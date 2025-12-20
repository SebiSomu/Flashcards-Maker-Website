const Hero = ({ title }: { title: string }) => {
    return (
        <div className="relative mb-6 inline-block text-left">
            <h1 className="text-2xl md:text-3xl font-black text-base-content tracking-tighter uppercase italic">
                {title}
            </h1>
            <div className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
        </div>
    );
};

export default Hero;