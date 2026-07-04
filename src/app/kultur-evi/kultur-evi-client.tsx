"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { MapPin, Info, ImageIcon, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// 3D Bileşeni SADECE tarayıcıda yükle (SSR Kapalı)
const VirtualTour = dynamic(
    () => import('@/components/virtual-tour'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[400px] md:h-[600px] bg-slate-100 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-slate-200">
                <div className="w-8 h-8 border-4 border-primary-red border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-slate-500 font-medium">360° Sanal Tur Yükleniyor...</span>
            </div>
        )
    }
);

interface KulturEviClientProps {
    pageData: {
        title: string;
        content: string | null;
        heroImage: string | null;
        images: string | null; // JSON string from DB
        panoramaImage?: string | null;
    };
}

export default function KulturEviClient({ pageData }: KulturEviClientProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // 1. Veriyi Güvenli Parse Etme
    let galleryImages: string[] = [];
    if (pageData.images) {
        try {
            const parsed = JSON.parse(pageData.images);
            if (Array.isArray(parsed)) {
                galleryImages = parsed;
            }
        } catch (error) {
            console.error("Resim verisi parse edilemedi:", error);
        }
    }

    // Eğer hiç resim yoksa heroImage'i (varsa) ekle
    if (galleryImages.length === 0 && pageData.heroImage) {
        galleryImages.push(pageData.heroImage);
    }

    // Yine de boşsa placeholder - Kullanıcı istemiyor ama boş kalmasın diye fallback
    // Kullanıcı talebi: "sabit houseImages veya yer tutucu dizisini tamamen SİL".
    // Bu nedenle eğer boşsa göstermeyeceğiz veya sadece boş kontrolü yapacağız.

    const handleImageClick = (idx: number) => {
        setIndex(idx);
        setOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] relative pb-20">

            {/* 1. Özel Hero Alanı */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={pageData.heroImage || galleryImages[0] || "/images/hero-bg.jpg"}
                        alt={pageData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#F8F9FA]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white mt-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 animate-fade-in-up">
                        <MapPin className="w-4 h-4 text-primary-gold" />
                        <span className="text-sm font-medium tracking-wider uppercase text-primary-gold">Sinop / Merkez</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 tracking-tight drop-shadow-2xl animate-fade-in-up delay-100">
                        {pageData.title.replace(/-/g, " ")}
                    </h1>

                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                        Geçmişin izlerini geleceğe taşıyan, kültür ve sanatın buluşma noktası.
                    </p>
                </div>
            </section>

            {/* 2. Asimetrik Galeri & İçerik */}
            <div className="container mx-auto px-4 -mt-20 relative z-20">

                {/* Dinamik Grid */}
                {galleryImages.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 max-w-6xl mx-auto h-[400px] md:h-[600px]">
                        {/* Büyük Ana Görsel */}
                        <div
                            className="md:col-span-2 relative rounded-2xl overflow-hidden shadow-2xl group cursor-zoom-in border-4 border-white"
                            onClick={() => handleImageClick(0)}
                        >
                            <Image
                                src={galleryImages[0]}
                                alt="Ana Görsel"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm">
                                <span className="text-slate-900 font-serif font-bold flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-primary-red" />
                                    Kültür Evi
                                </span>
                            </div>
                        </div>

                        {/* Sağdaki Küçük Görseller */}
                        <div className="flex flex-col gap-4 h-full">
                            {galleryImages.length > 1 && (
                                <div
                                    className="relative flex-1 rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in border-4 border-white"
                                    onClick={() => handleImageClick(1)}
                                >
                                    <Image
                                        src={galleryImages[1]}
                                        alt="Detay 1"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                </div>
                            )}

                            {galleryImages.length > 2 && (
                                <div
                                    className="relative flex-1 rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in border-4 border-white"
                                    onClick={() => handleImageClick(2)}
                                >
                                    <Image
                                        src={galleryImages[2]}
                                        alt="Detay 2"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* +X Fotoğraf Göstergesi */}
                                    {galleryImages.length > 3 && (
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center transition-opacity hover:bg-slate-900/80">
                                            <span className="text-white font-bold text-lg">+{galleryImages.length - 3} Fotoğraf</span>
                                        </div>
                                    )}
                                    {galleryImages.length <= 3 && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors opacity-0 group-hover:opacity-100">
                                            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                                                <ImageIcon className="w-6 h-6 mr-2" />
                                                İncele
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Sadece 1 resim varsa boşluk doldurma (Opsiyonel, tasarım kararı) */}
                            {galleryImages.length === 1 && (
                                <div className="hidden md:flex flex-col gap-4 h-full opacity-50">
                                    <div className="flex-1 bg-slate-200 rounded-2xl flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-slate-400" />
                                    </div>
                                    <div className="flex-1 bg-slate-200 rounded-2xl flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-slate-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* 3. Yüzen İçerik Kanvası (Floating Canvas) */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-16 relative overflow-hidden">
                        {/* Dekoratif Üst Çizgi */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-red via-red-500 to-primary-red" />

                        <div className="flex items-center gap-3 mb-8 text-primary-red">
                            <Info className="w-6 h-6" />
                            <h2 className="text-lg font-bold tracking-widest uppercase">Hakkında</h2>
                        </div>

                        {pageData.content ? (
                            <article className="prose prose-lg prose-slate max-w-none 
                                prose-headings:font-serif prose-headings:text-slate-900 
                                prose-p:leading-relaxed prose-p:text-slate-600
                                prose-a:text-primary-red prose-a:font-medium hover:prose-a:underline
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-li:marker:text-primary-red">
                                <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
                            </article>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>İçerik hazırlanıyor...</p>
                            </div>
                        )}

                        {/* 4. Sanal Tur Entegrasyonu */}
                        {pageData.panoramaImage && (
                            <div className="mt-12 pt-12 border-t border-slate-100">
                                <div className="flex items-center gap-3 mb-6 text-primary-red">
                                    <div className="w-2 h-2 rounded-full bg-primary-red animate-pulse" />
                                    <h3 className="text-lg font-bold tracking-widest uppercase">360° Sanal Tur</h3>
                                </div>

                                <VirtualTour imageUrl={pageData.panoramaImage} />

                                <p className="text-center text-sm text-slate-400 mt-4">
                                    Kültür Evi'ni oturduğunuz yerden 360 derece keşfedin.
                                </p>
                            </div>
                        )}

                        {/* Alt Bilgi / CTA */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-slate-500 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Her gün 09:00 - 18:00
                                </span>
                            </div>
                            <Button className="bg-primary-red hover:bg-red-800 text-white rounded-full px-8 shadow-lg shadow-red-900/20">
                                Ziyaret Planla <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={galleryImages.map(src => ({ src }))}
            />
        </div>
    );
}
