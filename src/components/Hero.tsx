'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden bg-stone-900">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=1920"
                    alt="Legacy Sinop"
                    className="w-full h-full object-cover grayscale brightness-50 contrast-125 transition-transform duration-[3s] hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/90" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 text-center container-heritage">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="block text-white/40 mb-10 uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold whitespace-nowrap">
                        Sinop Mübadele & Balkan Halkları Kültür Araştırmaları
                    </span>

                    <h1 className="text-white mb-16 italic font-normal tracking-tighter leading-[0.9] md:leading-[1]">
                        Geçmişin İzleri, <br className="hidden md:block" />
                        <span className="font-bold not-italic">Geleceğin Sesi.</span>
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-20">
                        <button className="btn-heritage border-white text-white hover:bg-white hover:text-stone-900 px-12 py-5 text-sm tracking-[0.2em]">
                            Hikayemizi Keşfet
                        </button>
                        <button className="text-white/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/10 pb-2 hover:border-white/40">
                            Bize Katılın
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Hint */}
            <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/20"
            >
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-bold vertical-text mb-4">Keşfet</span>
                    <ArrowDown size={24} strokeWidth={1} />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
