
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react"; // Import ArrowRight
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Etkinliklerimiz | Sinop Mübadele ve Balkan Halkları Derneği",
    description: "Derneğimizin düzenlediği güncel ve geçmiş etkinlikler.",
};

// Yeni etkinlik eklenince anında görünsün diye her istekte taze render
export const dynamic = "force-dynamic";

export default async function EtkinliklerPage() {
    // Veritabanından Etkinlikleri Çek
    const etkinlikler = await prisma.announcement.findMany({
        where: {
            category: "Etkinlik",
            published: true
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-20">

            {/* Sayfa Başlığı */}
            <div className="container mx-auto px-4 max-w-6xl mb-16 text-center">
                <span className="text-sm font-bold tracking-[0.2em] text-red-900 uppercase mb-4 block">
                    BİR ARAYA GELİYORUZ
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 capitalize">
                    Etkinliklerimiz
                </h1>
                <div className="w-24 h-1 bg-red-900 mx-auto rounded-full opacity-80 mb-6"></div>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Kültürümüzü yaşatmak ve bağlarımızı güçlendirmek için düzenlediğimiz buluşmalar, şenlikler ve anma programları.
                </p>
            </div>

            {/* Etkinlikler Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                {etkinlikler.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {etkinlikler.map((etkinlik) => (
                            <Link
                                href={`/haberler/${etkinlik.id}`}
                                key={etkinlik.id}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                {/* Kapak Görseli */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    {etkinlik.featuredImage ? (
                                        <Image
                                            src={etkinlik.featuredImage}
                                            alt={etkinlik.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                            <span className="text-sm font-medium">Görsel Yok</span>
                                        </div>
                                    )}
                                    {/* Etkinlik rozeti */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-red-900 shadow-sm">
                                        Etkinlik
                                    </div>
                                </div>

                                {/* İçerik */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-medium">
                                        <Calendar className="w-4 h-4 text-red-900" />
                                        {new Date(etkinlik.date).toLocaleDateString("tr-TR", {
                                            day: "numeric", month: "long", year: "numeric"
                                        })}
                                    </div>

                                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-red-900 transition-colors">
                                        {etkinlik.title}
                                    </h3>

                                    {/* İçerikten HTML taglerini temizleyip özet çıkarma */}
                                    <div className="text-slate-600 line-clamp-3 mb-6 flex-grow text-sm leading-relaxed">
                                        {etkinlik.excerpt || (
                                            <span dangerouslySetInnerHTML={{
                                                __html: etkinlik.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
                                            }} />
                                        )}
                                    </div>

                                    <div className="mt-auto inline-flex items-center gap-2 text-red-900 font-bold text-sm group-hover:gap-3 transition-all">
                                        Detayları İncele <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                            <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Henüz Etkinlik Yok</h3>
                        <p className="text-slate-500">Yakında düzenlenecek etkinliklerimiz burada listelenecektir.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
