'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSlideData } from '@/actions/hero-actions';

interface HeroSliderProps {
    slides: (HeroSlideData & { id: string })[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const words = ["Kültürümüz", "Mirasımız", "Değerlerimiz", "Anılarımız"];
    const [mounted, setMounted] = useState(false);

    // Default slide if no slides exist
    const defaultSlide = {
        id: 'default',
        image: '/images/hero-bg.jpg',
        title: 'Geçmişin İzleri, Geleceğin Sesi',
        subtitle: 'Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları Derneği olarak, köklerimizi unutmuyor, kültürümüzü yarınlara taşıyoruz.',
    };

    const activeSlides = slides.length > 0 ? slides : [defaultSlide];

    // Hydration ve Slider Timer kontrolü
    useEffect(() => {
        setMounted(true);

        if (activeSlides.length <= 1) return;

        // TEK BİR ZAMANLAYICI (Hem resmi hem yazıyı kontrol eder)
        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 5000);

        return () => {
            clearInterval(slideTimer);
        };
    }, [activeSlides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

    return (
        <section className="relative w-full h-[60vh] sm:h-[75vh] lg:h-screen min-h-[540px] flex items-center justify-center overflow-hidden bg-slate-900">

            {/* 1. ARKA PLAN SLIDER (Crossfade & Ken Burns Efekti) */}
            {activeSlides.map((slide, index) => (
                <div
                    key={slide.id || index}
                    className={`absolute inset-0 z-0 transition-all duration-[1500ms] ease-in-out transform
            ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title || "Hero Background"}
                        fill
                        className="object-cover object-[50%_25%] md:object-[50%_30%]"
                        priority={index === 0}
                        quality={90}
                    />
                </div>
            ))}

            {/* 2. ZARİF KARARTMA (Sadece sol-alt köşe koyu; fotoğrafın geri kalanı net) */}
            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/85 via-black/30 to-transparent"></div>

            {/* 3. SOL-ALT ÖN YÜZ İÇERİĞİ */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-start text-left h-full justify-end pb-16 md:pb-24">

                <span className="text-[10px] md:text-sm font-bold tracking-[0.3em] text-white/90 uppercase mb-3 md:mb-4 animate-fade-in-up">
                    HOŞ GELDİNİZ
                </span>

                {/* Sol hizalı, belirgin başlık animasyonu */}
                <h1 className="text-[clamp(2rem,7vw,6.5rem)] leading-[1.05] whitespace-nowrap font-serif font-bold text-white tracking-tight flex flex-col items-start justify-end min-h-[1.1em] mb-3 md:mb-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                    {mounted ? (
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={currentSlide} // KEY BURASI ÇOK ÖNEMLİ! Slayt değiştikçe animasyon tetiklenir
                                initial={{ x: -40, opacity: 0, filter: "blur(8px)" }}
                                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                                exit={{ x: 40, opacity: 0, filter: "blur(8px)" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="text-white inline-block"
                            >
                                {/* Kelimeyi mevcut slayta göre seç (Modülo ile güvenli seçim) */}
                                {words[currentSlide % words.length]}
                            </motion.span>
                        </AnimatePresence>
                    ) : (
                        <span className="text-white opacity-0">Kültürümüz</span>
                    )}
                </h1>

                <p className="text-xs sm:text-sm md:text-xl text-white/95 max-w-xs sm:max-w-xl font-light leading-relaxed mb-5 md:mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {activeSlides[currentSlide].subtitle || "Geçmişin izlerini geleceğe taşıyan, Sinop ve Balkan kültürünün buluşma noktası."}
                </p>

                {/* Butonlar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 md:gap-4 w-full max-w-md animate-fade-in-up delay-200">
                    <Button asChild size="lg" className="bg-red-900 hover:bg-red-800 text-white rounded-full text-sm md:text-base px-6 py-4 md:px-8 md:py-6 w-full md:w-auto shadow-lg hover:shadow-red-900/30 transition-all">
                        <Link href="/tarihce">Hikayemizi Keşfet</Link>
                    </Button>
                    <Link
                        href="/kultur-evi"
                        className="group inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 text-xs md:text-sm font-bold text-white tracking-wide rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl w-full md:w-auto"
                    >
                        <Landmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>KÜLTÜR EVİ</span>
                    </Link>
                </div>
            </div>

            {/* 4. YÖN OKLARI (Zarif ve minimalist) */}
            {activeSlides.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-4 md:left-8 z-30 p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/30 hover:text-white backdrop-blur-md transition-all border border-white/10 hidden md:flex border-none outline-none focus:ring-0">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 md:right-8 z-30 p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/30 hover:text-white backdrop-blur-md transition-all border border-white/10 hidden md:flex border-none outline-none focus:ring-0">
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* 5. NOKTALAR (Dots) */}
                    <div className="absolute bottom-8 right-4 md:right-10 z-30 flex gap-3">
                        {activeSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-8 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>
                </>
            )}

        </section>
    );
}
