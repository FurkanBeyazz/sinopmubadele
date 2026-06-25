'use client';

import { motion } from 'framer-motion';
import { User, ArrowRight, History, BookCopy } from 'lucide-react';
import { getMemories } from '../data/store';

const MemoryArchive = () => {
    const memories = getMemories();

    return (
        <section id="memory-archive" className="section-padding bg-white border-y border-stone-100">
            <div className="container-heritage">
                <div className="flex flex-col md:flex-row items-center justify-between mb-32 border-b border-stone-200 pb-16 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-3 text-primary-red font-bold uppercase tracking-[0.4em] text-[10px] mb-8">
                            <BookCopy size={16} />
                            <span>Hafıza Antolojisi</span>
                        </div>
                        <h2 className="serif text-primary-blue italic font-normal">
                            Zamanın <span className="font-bold not-italic underline decoration-primary-red/20">Editorial</span> Yüzü
                        </h2>
                    </motion.div>

                    <div className="flex gap-4">
                        <button className="p-4 border border-stone-200 hover:border-primary-red hover:text-primary-red transition-all rounded-full">
                            <History size={20} />
                        </button>
                    </div>
                </div>

                {/* Editorial Grid (Masonry Vibes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-32">
                    {memories.map((memory, index) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="flex flex-col group"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden aspect-[3/4] mb-10">
                                <img
                                    src={memory.image}
                                    alt={memory.title}
                                    className="w-full h-full object-cover sepia-hover shadow-stone-300"
                                />
                                <div className="absolute top-6 left-6 p-4 bg-white/90 backdrop-blur-md text-primary-red serif font-bold text-sm">
                                    {memory.date}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-text-muted text-[10px] font-bold uppercase tracking-widest pl-1">
                                    <User size={12} className="text-primary-red" />
                                    {memory.author}
                                </div>

                                <h3 className="serif text-3xl font-bold group-hover:text-primary-red transition-colors leading-tight">
                                    {memory.title}
                                </h3>

                                <p className="text-text-muted whitespace-heavy mt-6 line-clamp-3 text-sm italic">
                                    "{memory.excerpt}"
                                </p>

                                <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-blue mt-10 hover:gap-6 transition-all group-hover:text-primary-red">
                                    Hikayeyi Tamamını Oku <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="w-full h-[1px] bg-stone-100 mt-16 group-hover:bg-primary-red/30 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MemoryArchive;
