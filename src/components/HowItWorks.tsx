// src/components/HowItWorks.tsx
import { motion } from "framer-motion";

const HowItWorks = () => {
    const steps = [
        { id: "01", title: "Ingest", desc: "Încarcă materialele de studiu în sistem. Suportăm multiple formate de date." },
        { id: "02", title: "Process", desc: "Algoritmul analizează textul și generează seturi optimizate de flashcards." },
        { id: "03", title: "Execute", desc: "Sesiuni de studiu intensive bazate pe curba uitării (Ebbinghaus)." }
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
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-12">
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
                            <span className="text-blue-600 font-black text-sm tracking-tighter">
                                {step.id}
                            </span>
                            <div className="w-[1px] h-full bg-slate-800 mt-2"></div>
                        </div>
                        <div className="pb-4">
                            <h3 className="text-white font-black text-md uppercase mb-2 tracking-tight italic">
                                {step.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-snug">
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