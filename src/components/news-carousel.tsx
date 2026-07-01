"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAnimationFrame } from "framer-motion";

export interface NewsItem {
    id: string;
    title: string;
    category: string;
    featuredImage?: string | null;
    excerpt?: string | null;
    date: Date | string;
}

function NewsCard({ item }: { item: NewsItem }) {
    return (
        <Link
            href={`/haberler/${item.id}`}
            className="group flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[340px]"
        >
            <div className="relative h-48 w-full overflow-hidden bg-stone-200">
                {item.featuredImage ? (
                    <Image
                        src={item.featuredImage}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-stone-400">
                        <span className="font-serif text-4xl opacity-20">SM</span>
                    </div>
                )}
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-red-900 shadow-sm backdrop-blur">
                    {item.category}
                </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
                <p className="mb-2 text-xs text-slate-400">
                    {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h3 className="mb-2 line-clamp-2 font-serif text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-red-900">
                    {item.title}
                </h3>
                <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.excerpt || "İçerik detayı için haberi okuyun..."}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-red-900 transition-all group-hover:gap-2">
                    Devamını Oku <ArrowRight className="h-3.5 w-3.5" />
                </span>
            </div>
        </Link>
    );
}

export default function NewsCarousel({ items }: { items: NewsItem[] }) {
    // Kesintisiz döngü için içeriği ikiye katlıyoruz; az öğe varsa da dolgun görünür
    const base = items.length > 0 && items.length < 4 ? [...items, ...items] : items;
    const loop = [...base, ...base];
    // Tek tam tur süresi (öğe başına ~2.8sn — belirgin akış)
    const secondsPerLoop = Math.max(14, Math.round(base.length * 2.8));

    const trackRef = useRef<HTMLDivElement>(null);
    const offset = useRef(0);
    const paused = useRef(false);

    // JS tabanlı marquee: her karede kaydır (reduced-motion / CSS takozlarından etkilenmez)
    useAnimationFrame((_, delta) => {
        const el = trackRef.current;
        if (!el || paused.current) return;
        const half = el.scrollWidth / 2; // içerik iki kez var; yarısı = bir set
        if (half <= 0) return;
        const pxPerMs = half / (secondsPerLoop * 1000);
        offset.current -= pxPerMs * delta;
        if (-offset.current >= half) offset.current += half; // kesintisiz döngü
        el.style.transform = `translateX(${offset.current}px)`;
    });

    return (
        <div
            className="relative overflow-hidden"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
        >
            {/* Kenar yumuşatma (fade) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-stone-50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-stone-50 to-transparent" />

            <div ref={trackRef} className="flex w-max gap-6 py-2 will-change-transform">
                {loop.map((item, i) => (
                    <NewsCard key={`${item.id}-${i}`} item={item} />
                ))}
            </div>
        </div>
    );
}
