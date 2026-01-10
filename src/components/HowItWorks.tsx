import { motion } from "framer-motion";

const HowItWorks = () => {
    const steps = [
        { id: "01", title: "Ingest", desc: "Upload study materials in text format into the system. " },
        { id: "02", title: "Process", desc: "Our algorithm analyzes the text and generates optimized sets of flashcards every single time." },
        { id: "03", title: "Adapt", desc: "Be prepared for adaptive study sessions that target weak spots right before you forget."  }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="max-w-md text-left">
            <h2 className="text-md font-black text-primary uppercase tracking-[0.3em] mb-12">
                // System Operations
            </h2>

            <motion.div
                className="space-y-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {steps.map((step) => (
                    <motion.div key={step.id} className="flex gap-6" variants={itemVariants}>
                        <div className="flex flex-col items-center">
                            <span className="text-primary font-black text-sm tracking-tighter">
                                {step.id}
                            </span>
                            <div className="w-[1px] h-full bg-base-300 mt-2"></div>
                        </div>
                        <div className="pb-4">
                            <h3 className="text-base-content font-black text-md uppercase mb-2 tracking-tight italic">
                                {step.title}
                            </h3>
                            <p className="text-base-content/60 text-sm leading-snug">
                                {step.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default HowItWorks;