'use client';

import { motion } from 'framer-motion';
import { History, Handshake, Landmark } from 'lucide-react';

const AboutSection = () => {
    return (
        <section id="about" className="section-padding bg-[#fdfbf7]">
            <div className="container-heritage">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Visual Heritage */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200"
                                alt="Balkan Heritage"
                                className="w-full h-full object-cover sepia-hover"
                            />
                        </div>
                        {/* Design Element Overlay */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-red/10 -z-10" />
                        <div className="absolute top-10 left-10 p-8 glass-dark border-white/10 hidden md:block">
                            <span className="serif text-white/40 text-8xl font-black select-none">M</span>
                        </div>
                    </motion.div>

                    {/* Right: Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 text-primary-red font-bold uppercase tracking-[0.4em] text-[10px] mb-10">
                            <History size={16} />
                            <span>Misyonumuz & Tarihçemiz</span>
                        </div>

                        <h2 className="mb-12 serif text-primary-blue italic font-normal underline decoration-primary-red/30 decoration-4 underline-offset-8">
                            Kayıp Seslerin <br />
                            <span className="font-bold not-italic">Dijital Muhafızı.</span>
                        </h2>

                        <div className="space-y-10 whitespace-heavy text-text-muted text-lg">
                            <p>
                                Sinop Mübadele Derneği, 1923 yılında başlayan büyük göçün sessiz hatıralarını,
                                balkanların kadim ruhunu ve Karadeniz'in serin sularına karışan hikayeleri yaşatmak amacıyla kurulmuştur.
                            </p>
                            <p>
                                Bizler sadece bir dernek değil, geçmişle gelecek arasında kurulmuş estetik bir köprüyüz.
                                Geleneksel balkan sanatlarını, mübadele dönemi arşivlerini ve yaşayan kültürel mirası
                                modern bir diliyle yeni nesillere aktarıyoruz.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-12 mt-20">
                            <div className="space-y-4 border-l border-stone-200 pl-8">
                                <Landmark className="text-primary-red" size={24} />
                                <h4 className="serif text-xl">Araştırma</h4>
                                <p className="text-xs uppercase tracking-widest text-text-muted font-bold">Kültürel Arşiv</p>
                            </div>
                            <div className="space-y-4 border-l border-stone-200 pl-8">
                                <Handshake className="text-primary-blue" size={24} />
                                <h4 className="serif text-xl">Dayanışma</h4>
                                <p className="text-xs uppercase tracking-widest text-text-muted font-bold">Balkan Ağı</p>
                            </div>
                        </div>

                        <button className="btn-heritage mt-20">
                            Daha Fazlasını Öğren
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
