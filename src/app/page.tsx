
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, History } from "lucide-react";
import { Button } from "@/components/ui/button";

import HeroSlider from "@/components/hero-slider";
import NewsCarousel from "@/components/news-carousel";
import { getActiveSlides } from "@/actions/hero-actions";

export const dynamic = 'force-dynamic';

async function getLatestNews() {
    try {
        const news = await prisma.announcement.findMany({
            where: {
                published: true,
            },
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
        return news;
    } catch (error) {
        console.error("Haberler çekilirken hata oluştu:", error);
        return [];
    }
}

export default async function Home() {
    const news = await getLatestNews();
    const slides = await getActiveSlides();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <HeroSlider slides={slides as any} />

            {/* Mission Section */}
            <section className="py-20 md:py-32 bg-[#fdfbf7]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-red-900 font-medium tracking-wider text-sm uppercase">Değerlerimiz</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">Kültürümüzü Yaşatıyoruz</h2>
                        <div className="w-24 h-1 bg-red-900 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <BookOpen className="w-8 h-8 text-red-900" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-slate-900">Kültürel Miras</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Atalarımızdan kalan sözlü tarih, gelenekler ve yaşam kültürünü kayıt altına alıyor, gelecek nesillere aktarıyoruz.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <Users className="w-8 h-8 text-red-900" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-slate-900">Dayanışma</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Mübadil torunları arasındaki bağları güçlendiriyor, sosyal yardımlaşma ve dayanışma ağımızı büyütüyoruz.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <History className="w-8 h-8 text-red-900" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-slate-900">Tarih Bilinci</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Mübadele tarihini akademik çalışmalar ve etkinliklerle aydınlatıyor, toplumsal hafızamızı canlı tutuyoruz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News Section */}
            <section className="py-20 bg-stone-50 border-t border-stone-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div className="space-y-2">
                            <span className="text-red-900 font-medium tracking-wider text-sm uppercase">Kurumsal Gelişmeler</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">Haberler & Duyurular</h2>
                        </div>
                        <Button variant="link" asChild className="hidden md:inline-flex text-red-900 p-0 font-medium hover:text-red-800">
                            <Link href="/haberler" className="flex items-center gap-2">
                                Tümünü Gör <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    {news.length > 0 ? (
                        <NewsCarousel items={news as any} />
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-stone-300">
                            <p className="text-slate-500 font-serif text-lg">Henüz içerik eklenmedi.</p>
                            <p className="text-slate-400 text-sm mt-2">Çok yakında yeni haberlerle buradayız.</p>
                        </div>
                    )}
                    <div className="mt-8 text-center md:hidden">
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/haberler">Tümünü Gör</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
