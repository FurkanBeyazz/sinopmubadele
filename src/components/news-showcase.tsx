'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface NewsItem {
    id: string;
    title: string;
    category: string;
    featuredImage?: string | null;
    excerpt?: string | null;
    date: Date | string;
}

const MONTHS = ['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'];

function dayMonth(d: Date | string) {
    const date = new Date(d);
    return { day: date.getDate(), month: MONTHS[date.getMonth()] };
}

// Kategoriye göre renk: dikkat çeken, ayırt edici tonlar
function catColors(category: string) {
    const c = (category || '').toLocaleLowerCase('tr');
    if (c.includes('etkinlik')) return { solid: 'bg-emerald-600', chip: 'bg-emerald-100 text-emerald-700' };
    if (c.includes('duyuru')) return { solid: 'bg-amber-500', chip: 'bg-amber-100 text-amber-700' };
    if (c.includes('haber')) return { solid: 'bg-blue-600', chip: 'bg-blue-100 text-blue-700' };
    return { solid: 'bg-red-900', chip: 'bg-red-100 text-red-800' };
}

export default function NewsShowcase({ items }: { items: NewsItem[] }) {
    const slides = items.slice(0, 6);
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
        return () => clearInterval(t);
    }, [slides.length]);

    if (slides.length === 0) return null;

    const go = (dir: number) => setActive((a) => (a + dir + slides.length) % slides.length);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* SOL: Büyük slider */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg lg:col-span-3">
                <div className="relative aspect-[16/11] w-full sm:aspect-[16/10]">
                    {slides.map((item, i) => (
                        <Link
                            key={item.id}
                            href={`/haberler/${item.id}`}
                            className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                        >
                            {item.featuredImage ? (
                                <Image
                                    src={item.featuredImage}
                                    alt={item.title}
                                    fill
                                    priority={i === 0}
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-800 text-5xl font-serif text-white/10">SM</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                                <span className={`mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow ${catColors(item.category).solid}`}>
                                    {item.category}
                                </span>
                                <h3 className="font-serif text-xl font-bold leading-snug text-white drop-shadow sm:text-2xl line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="mt-2 hidden text-sm text-white/85 line-clamp-2 sm:block">
                                    {item.excerpt || 'İçerik detayı için haberi okuyun...'}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white">
                                    Devamını Oku <ArrowRight className="h-4 w-4" />
                                </span>
                            </div>
                        </Link>
                    ))}

                    {/* Oklar */}
                    {slides.length > 1 && (
                        <>
                            <button
                                onClick={() => go(-1)}
                                aria-label="Önceki"
                                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => go(1)}
                                aria-label="Sonraki"
                                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            {/* Noktalar */}
                            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        aria-label={`Slayt ${i + 1}`}
                                        onClick={() => setActive(i)}
                                        className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* SAĞ: Tarih rozetli liste */}
            <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-2 shadow-sm lg:col-span-2">
                <Link
                    href="/haberler"
                    className="group flex items-center justify-between border-b-2 border-red-900 px-3 py-3"
                >
                    <span className="font-serif text-sm font-bold uppercase tracking-wide text-slate-900">
                        Haberler / Duyurular / Etkinlikler
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-red-900 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="mt-1 flex-1 divide-y divide-stone-100 overflow-y-auto lg:max-h-[420px]">
                    {items.slice(0, 8).map((item, i) => {
                        const { day, month } = dayMonth(item.date);
                        return (
                            <Link
                                key={item.id}
                                href={`/haberler/${item.id}`}
                                onMouseEnter={() => i < slides.length && setActive(i)}
                                className="group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-stone-50"
                            >
                                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-red-900/5 leading-none text-red-900">
                                    <span className="text-lg font-bold">{day}</span>
                                    <span className="text-[9px] font-bold tracking-wide">{month}</span>
                                </div>
                                <div className="min-w-0">
                                    <span className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${catColors(item.category).chip}`}>
                                        {item.category}
                                    </span>
                                    <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-red-900">
                                        {item.title}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
