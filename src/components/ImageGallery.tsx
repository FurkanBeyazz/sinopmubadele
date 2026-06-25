'use client';

import { motion } from 'framer-motion';
import { getGallery } from '../data/store';
import { ImageIcon, Maximize2 } from 'lucide-react';

const ImageGallery = () => {
    const galleryImages = getGallery();

    return (
        <section id="gallery" className="section-padding bg-[#fdfbf7]">
            <div className="container-heritage">
                <div className="text-center mb-32 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-center gap-3 text-primary-red font-bold uppercase tracking-[0.4em] text-[10px] mb-8">
                            <ImageIcon size={18} />
                            <span>Görsel Kültür Arşivi</span>
                        </div>
                        <h2 className="mb-8 serif text-primary-blue italic font-normal">
                            Zamanın <span className="font-bold not-italic border-b-2 border-primary-red/20 pb-2">Işığında</span> Kalanlar
                        </h2>
                        <p className="text-text-muted whitespace-heavy">
                            Balkanların her bir sokağı, asırlık her bir fotoğraf karesi,
                            geleceğe miras bıraktığımız birer sanat eseridir.
                        </p>
                    </motion.div>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="relative group transition-all duration-700"
                        >
                            <div className="relative overflow-hidden group">
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-auto sepia-hover shadow-lg"
                                />

                                {/* Minimalist Overlay */}
                                <div className="absolute inset-x-8 bottom-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <div className="bg-white/95 backdrop-blur-md p-8 border border-stone-100">
                                        <span className="serif text-primary-red italic text-sm mb-2 block">Belge No: {index + 101}</span>
                                        <h3 className="serif text-2xl font-bold text-primary-blue">{image.title}</h3>
                                        <div className="mt-6 pt-6 border-t border-stone-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                            <span>Orijinal Arşiv</span>
                                            <Maximize2 size={14} className="hover:text-primary-red cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                {/* Thin Inner Border on Hover */}
                                <div className="absolute inset-4 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImageGallery;
