'use client';

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { SongItem } from "@/lib/ataturk";

// YouTube linkinden (watch/share/embed/ID) video kimliğini çıkarır
function getYoutubeId(value: string): string | null {
    if (!value) return null;
    const v = value.trim();
    // Zaten sade bir ID ise
    if (/^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = v.match(p);
        if (m) return m[1];
    }
    return null;
}

export default function SongPlayer({ songs }: { songs: SongItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTitle, setActiveTitle] = useState<string>("");

    useEffect(() => {
        if (!activeId) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveId(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeId]);

    const openSong = (song: SongItem) => {
        const id = getYoutubeId(song.youtube);
        if (!id) return; // video eklenmemişse tıklama bir şey yapmaz
        setActiveTitle(song.title);
        setActiveId(id);
    };

    return (
        <>
            <div className="ak-sarki-izgara">
                {songs.map((song, i) => {
                    const hasVideo = !!getYoutubeId(song.youtube);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => openSong(song)}
                            className="ak-sarki-kart"
                            style={{ opacity: hasVideo ? 1 : 0.6, cursor: hasVideo ? "pointer" : "default" }}
                            aria-label={`${song.title} dinle`}
                        >
                            <span className="ak-play">▶</span>
                            <span className="ak-bilgi">
                                <b>{song.title}</b>
                                <span>{hasVideo ? song.subtitle : "Yakında eklenecek"}</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Site içi oynatıcı (modal) */}
            {activeId && (
                <div
                    onClick={() => setActiveId(null)}
                    style={{
                        position: "fixed", inset: 0, zIndex: 200,
                        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
                        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "relative", width: "100%", maxWidth: 880,
                            background: "#000", borderRadius: 16, overflow: "hidden",
                            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveId(null)}
                            aria-label="Kapat"
                            style={{
                                position: "absolute", top: 10, right: 10, zIndex: 2,
                                width: 38, height: 38, borderRadius: "50%", border: "none",
                                background: "rgba(0,0,0,0.6)", color: "#fff", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <X size={20} />
                        </button>
                        <div style={{ position: "relative", paddingTop: "56.25%" }}>
                            <iframe
                                title={activeTitle}
                                src={`https://www.youtube-nocookie.com/embed/${activeId}?autoplay=1&rel=0`}
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
