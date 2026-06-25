"use-cache";
"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

interface Memory {
    id: string;
    visitorName: string;
    image: string;
    note?: string | null;
    createdAt: Date;
}

interface MemoryGridProps {
    memories: Memory[];
}

export default function MemoryGrid({ memories }: MemoryGridProps) {
    const [index, setIndex] = useState(-1);

    const slides = memories.map((m) => ({
        src: m.image,
        title: m.visitorName,
        description: m.note || undefined, // undefined ise boş geçer
    }));

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {memories.map((memory, i) => (
                    <div
                        key={memory.id}
                        className="group relative bg-white p-3 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 hover:z-10"
                        style={{
                            transform: `rotate(${i % 2 === 0 ? '-1deg' : '1deg'})`,
                        }}
                    >
                        {/* Pin visual (pure CSS) */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-900 shadow-sm z-20 border-2 border-white/50" />

                        <div
                            className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-4 cursor-pointer"
                            onClick={() => setIndex(i)}
                        >
                            <Image
                                src={memory.image}
                                alt={memory.visitorName}
                                fill
                                className="object-cover filter sepia-[0.2] group-hover:sepia-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Hover icon implies clickability */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <span className="text-white bg-black/50 px-3 py-1 rounded-full text-xs backdrop-blur-sm">Büyüt</span>
                            </div>
                        </div>

                        <div className="text-center px-2 pb-2">
                            <h3 className="font-handwriting text-xl md:text-2xl text-slate-800 mb-1 font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
                                {memory.visitorName}
                            </h3>
                            {memory.note && (
                                <p className="text-xs text-slate-500 font-serif italic line-clamp-2">
                                    "{memory.note}"
                                </p>
                            )}
                            <div className="mt-3 pt-3 border-t border-dashed border-stone-200">
                                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                                    {new Date(memory.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={slides}
                plugins={[Captions]}
                captions={{ descriptionTextAlign: 'center' }}
            />
        </>
    );
}
