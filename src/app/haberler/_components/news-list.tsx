'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsList({ news }: { news: any[] }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("Tümü");

    // Mevcut kategorileri haberlerden türet
    const categories = useMemo(() => {
        const set = new Set<string>();
        news.forEach((n) => n.category && set.add(n.category));
        return ["Tümü", ...Array.from(set)];
    }, [news]);

    const filtered = useMemo(() => {
        const q = query.trim().toLocaleLowerCase("tr");
        return news.filter((n) => {
            const catOk = category === "Tümü" || n.category === category;
            if (!catOk) return false;
            if (!q) return true;
            const hay = `${n.title} ${n.excerpt || ""} ${n.category || ""}`.toLocaleLowerCase("tr");
            return hay.includes(q);
        });
    }, [news, query, category]);

    return (
        <div>
            {/* Arama + kategori filtresi */}
            <div className="mx-auto mb-12 max-w-3xl">
                <div className="relative mb-5">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Haber veya duyuru ara..."
                        className="h-12 rounded-full border-slate-200 bg-white pl-12 text-base shadow-sm focus-visible:ring-red-900/20"
                    />
                </div>
                {categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setCategory(c)}
                                className={
                                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors " +
                                    (category === c
                                        ? "bg-red-900 text-white shadow"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-red-300")
                                }
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="relative h-56 w-full overflow-hidden bg-stone-200">
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
                                <div className="absolute left-4 top-4">
                                    <Badge className="border-none bg-white/90 px-3 py-1 text-xs capitalize text-slate-900 shadow-sm backdrop-blur hover:bg-white">
                                        {item.category}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader>
                                <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <CardTitle className="line-clamp-2 font-serif text-xl leading-snug transition-colors group-hover:text-red-900">
                                    <Link href={`/haberler/${item.id}`}>{item.title}</Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                                    {item.excerpt || "İçerik detayı için haberi okuyun..."}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="link" asChild className="h-auto p-0 text-sm font-medium text-red-900 transition-transform group-hover:translate-x-1">
                                    <Link href={`/haberler/${item.id}`} className="flex items-center gap-1">
                                        Devamını Oku <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-stone-200 bg-white py-24 text-center">
                    <p className="font-serif text-xl text-slate-500">
                        {query || category !== "Tümü" ? "Aramanıza uygun haber bulunamadı." : "Henüz haber eklenmedi."}
                    </p>
                    {(query || category !== "Tümü") && (
                        <button
                            type="button"
                            onClick={() => { setQuery(""); setCategory("Tümü"); }}
                            className="mt-4 inline-block text-red-900 hover:underline"
                        >
                            Filtreleri temizle
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
