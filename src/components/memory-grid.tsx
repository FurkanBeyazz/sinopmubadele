"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Images } from "lucide-react";

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

interface Album {
    key: string;
    visitorName: string;
    note?: string | null;
    createdAt: Date;
    images: Memory[];
}

export default function MemoryGrid({ memories }: MemoryGridProps) {
    // Aynı başlık (visitorName) altındaki fotoğrafları tek albümde grupla
    const albums = useMemo<Album[]>(() => {
        const map = new Map<string, Album>();
        for (const m of memories) {
            const key = (m.visitorName || "").trim().toLocaleLowerCase("tr");
            const existing = map.get(key);
            if (existing) {
                existing.images.push(m);
            } else {
                map.set(key, {
                    key,
                    visitorName: m.visitorName,
                    note: m.note,
                    createdAt: m.createdAt,
                    images: [m],
                });
            }
        }
        return Array.from(map.values());
    }, [memories]);

    const [activeAlbum, setActiveAlbum] = useState(-1);

    const slides =
        activeAlbum >= 0
            ? albums[activeAlbum].images.map((m) => ({
                  src: m.image,
                  title: m.visitorName,
                  description: m.note || undefined,
              }))
            : [];

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {albums.map((album, i) => {
                    const count = album.images.length;
                    const isAlbum = count > 1;
                    return (
                        <div
                            key={album.key}
                            className="group relative cursor-pointer transition-all duration-500 hover:z-10"
                            style={{ transform: `rotate(${i % 2 === 0 ? "-1deg" : "1deg"})` }}
                            onClick={() => setActiveAlbum(i)}
                        >
                            {/* Albüm ise arkada istiflenmiş kağıt efekti */}
                            {isAlbum && (
                                <>
                                    <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 rotate-3 bg-white shadow-md" />
                                    <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 rotate-1 bg-white shadow-md" />
                                </>
                            )}

                            <div className="relative bg-white p-3 shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1 group-hover:shadow-2xl">
                                {/* Pin görseli */}
                                <div className="absolute -top-3 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white/50 bg-red-900 shadow-sm" />

                                <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-stone-100">
                                    <Image
                                        src={album.images[0].image}
                                        alt={album.visitorName}
                                        fill
                                        className="object-cover filter sepia-[0.2] transition-all duration-500 group-hover:sepia-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                                    {/* Fotoğraf sayısı rozeti (albüm ise) */}
                                    {isAlbum && (
                                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                            <Images className="h-3.5 w-3.5" />
                                            {count}
                                        </div>
                                    )}

                                    {/* Hover ipucu */}
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                                            {isAlbum ? "Albümü Aç" : "Büyüt"}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-2 pb-2 text-center">
                                    <h3
                                        className="mb-1 text-xl font-bold text-slate-800 md:text-2xl"
                                        style={{ fontFamily: "var(--font-serif)" }}
                                    >
                                        {album.visitorName}
                                    </h3>
                                    {album.note && (
                                        <p className="line-clamp-2 font-serif text-xs italic text-slate-500">
                                            "{album.note}"
                                        </p>
                                    )}
                                    <div className="mt-3 border-t border-dashed border-stone-200 pt-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                            {isAlbum
                                                ? `${count} fotoğraf`
                                                : new Date(album.createdAt).toLocaleDateString("tr-TR", {
                                                      year: "numeric",
                                                      month: "long",
                                                      day: "numeric",
                                                  })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Lightbox
                open={activeAlbum >= 0}
                index={0}
                close={() => setActiveAlbum(-1)}
                slides={slides}
                plugins={[Captions]}
                captions={{ descriptionTextAlign: "center" }}
            />
        </>
    );
}
