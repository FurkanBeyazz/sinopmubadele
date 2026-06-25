"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GalleryViewProps {
    title: string;
    description: string | null;
    images: {
        id: string;
        url: string;
    }[];
}

export default function GalleryView({ title, description, images }: GalleryViewProps) {
    const [index, setIndex] = useState(-1);

    return (
        <>
            <div className="min-h-screen bg-[#fdfbf7] py-16 md:py-24">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                        <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 italic">
                            {title}
                        </h1>
                        <div className="w-20 h-1 bg-red-900 mx-auto mb-8 rounded-full" />
                        {description && (
                            <p className="text-slate-600 text-lg md:text-xl font-light leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Masonry Grid ( باستخدام Tailwind columns ) */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {images.map((img, i) => (
                            <div
                                key={img.id}
                                className="break-inside-avoid relative group cursor-zoom-in rounded-px overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 bg-white"
                                onClick={() => setIndex(i)}
                            >
                                <img
                                    src={img.url}
                                    alt={`Fotoğraf ${i + 1}`}
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <span className="bg-white/95 backdrop-blur px-4 py-2 text-xs font-semibold text-slate-900 uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        Tam Ekran Gör
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Lightbox
                index={index}
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={images.map(img => ({ src: img.url }))}
            />
        </>
    );
}
