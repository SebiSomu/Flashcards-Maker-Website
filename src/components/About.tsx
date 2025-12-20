import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.section
            className="max-w-xl text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }} >
            <h2 className="text-md font-black text-primary uppercase tracking-[0.3em] mb-4">
                // Protocol: Origin
            </h2>
            <p className="text-base-content/60 text-lg leading-relaxed font-medium italic">
                FlashCraft is not just a learning tool. It is an architecture designed
                to optimize information retention through spaced repetition and precision
                algorithms. We have removed visual noise in the process to make room
                for absolute focus.
            </p>
            <div className="mt-6 w-12 h-[2px] bg-primary shadow-lg shadow-primary/40"></div>
        </motion.section>
    );
};

export default About;