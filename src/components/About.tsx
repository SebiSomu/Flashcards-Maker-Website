// src/components/About.tsx
import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.section
            className="max-w-xl text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
                // Protocol: Origin
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
                FlashCraft nu este doar un instrument de învățare. Este o arhitectură concepută pentru a optimiza retenția informației prin repetiție spațiată și algoritmi de precizie. Am eliminat zgomotul vizual pentru a lăsa loc focusului absolut.
            </p>
            <div className="mt-6 w-12 h-[2px] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
        </motion.section>
    );
};

export default About;