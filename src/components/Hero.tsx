const Hero = ({ title }: { title: string }) => {
    return (
        <div className="mb-6 max-w-2xl text-left">
            <h1 className="text-xl md:text-3xl font-black text-base-content tracking-tighter uppercase italic leading-tight">
                <span className="
                    inline
                    bg-gradient-to-r from-blue-500 to-blue-500
                    bg-[length:100%_3px]
                    bg-no-repeat
                    bg-bottom
                    pb-1
                    px-2
                    decoration-clone
                    [box-shadow:0_10px_15px_-5px_rgba(59,130,246,0.3)]
                    [text-shadow:0_0_5px_rgba(59,130,246,0.2)]
                    dark:[box-shadow:0_10px_15px_-5px_rgba(59,130,246,0.6)]
                    dark:[text-shadow:0_0_10px_rgba(59,130,246,0.3)]
                ">
                    {title}
                </span>
            </h1>
        </div>
    );
};

export default Hero;