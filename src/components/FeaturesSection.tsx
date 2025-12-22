const FeaturesSection = () => {
    const features = [
        {
            title: "Smart Organization",
            description: "Keep your study materials organized with our intuitive deck system. Create custom categories and tag your cards for easy retrieval.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            title: "Study Anywhere",
            description: "Access your flashcards from any device. Your progress syncs automatically across all your devices so you never miss a beat.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "Effortless Learning",
            description: "Designed to help you focus on what matters: mastering the material. Our spaced repetition algorithm used in the Quiz mode ensures detailed retention.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 bg-base-200/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-10 md:px-20 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-black text-base-content uppercase italic tracking-tighter mb-4">Why FlashCraft?</h2>
                    <p className="text-base-content/60 text-lg leading-relaxed">
                        Built for serious students who demand efficiency and elegance in their study tools.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-base-100 p-8 rounded-3xl border border-base-content/5 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-base-content/60 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-multiply"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full mix-blend-multiply"></div>
            </div>
        </section>
    );
};

export default FeaturesSection;
