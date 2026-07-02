"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
                        <motion.div
                            key={album.key}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, delay: (i % 4) * 0.1, ease: "easeOut" }}
                            className="group relative cursor-pointer hover:z-10"
                            onClick={() => setActiveAlbum(i)}
                        >
                            {/* 3D Kitap: kapak hover'da sola doğru açılır */}
                            <div className="relative aspect-[3/4] [perspective:2000px]">
                                {/* İç sayfa (kapağın altında kalan) */}
                                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-[#fdfbf7] shadow-[1px_1px_12px_rgba(0,0,0,0.35)]">
                                    {/* İç sayfada ikinci fotoğraf (varsa) üst yarıda */}
                                    {isAlbum && album.images[1] && (
                                        <div className="relative h-2/5 overflow-hidden border-b border-stone-200">
                                            <Image
                                                src={album.images[1].image}
                                                alt=""
                                                fill
                                                className="object-cover opacity-90"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-5 text-center">
                                        <h3
                                            className="text-lg font-bold leading-snug text-slate-800 md:text-xl"
                                            style={{ fontFamily: "var(--font-serif)" }}
                                        >
                                            {album.visitorName}
                                        </h3>
                                        {album.note && (
                                            <p className="line-clamp-2 font-serif text-xs italic text-slate-500">
                                                "{album.note}"
                                            </p>
                                        )}
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                            {isAlbum
                                                ? `${count} fotoğraf`
                                                : new Date(album.createdAt).toLocaleDateString("tr-TR", {
                                                      year: "numeric",
                                                      month: "long",
                                                      day: "numeric",
                                                  })}
                                        </span>
                                        <span className="mt-2 rounded-full bg-red-900 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                                            {isAlbum ? "Albümü Aç" : "Büyüt"}
                                        </span>
                                    </div>
                                </div>

                                {/* Kapak: ilk fotoğraf — hover'da kitap gibi açılır */}
                                <div className="absolute inset-0 origin-left overflow-hidden rounded-xl shadow-[1px_1px_12px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-80deg)]">
                                    <Image
                                        src={album.images[0].image}
                                        alt={album.visitorName}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Kapak alt şeridi: başlık */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-3 pt-10">
                                        <p
                                            className="truncate text-base font-bold text-white drop-shadow"
                                            style={{ fontFamily: "var(--font-serif)" }}
                                        >
                                            {album.visitorName}
                                        </p>
                                    </div>
                                    {/* Fotoğraf sayısı rozeti */}
                                    {isAlbum && (
                                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                            <Images className="h-3.5 w-3.5" />
                                            {count}
                                        </div>
                                    )}
                                    {/* Cilt izi (sol kenar) */}
                                    <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/30 to-transparent" />
                                </div>
                            </div>
                        </motion.div>
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
