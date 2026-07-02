import { getGalleries } from "@/actions/gallery-actions";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import Reveal from "@/components/reveal";

export const metadata = {
    title: "Fotoğraf Galerisi | Sinop Mübadele Derneği",
    description: "Derneğimizden ve etkinliklerimizden kareler.",
};

export default async function GalleryListingPage() {
    const galleries = await getGalleries();

    return (
        <div className="min-h-screen bg-[#fdfbf7] relative overflow-hidden">
            {/* Zarif arka plan parlaması */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

            {/* Editoryal Başlık */}
            <header className="container mx-auto px-4 pt-32 pb-14 md:pt-40 md:pb-20 text-center relative">
                <Reveal>
                    <span className="text-xs font-bold tracking-[0.25em] text-red-900/70 uppercase mb-4 block">
                        Etkinliklerimizden Kareler
                    </span>
                </Reveal>
                <Reveal delay={0.1}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1A202C] mb-6 tracking-tight">
                        Fotoğraf Galerisi
                    </h1>
                </Reveal>
                <Reveal delay={0.2}>
                    <div className="flex items-center justify-center gap-4 opacity-80 mb-6">
                        <div className="h-[1px] w-12 bg-stone-300" />
                        <div className="w-2 h-2 rotate-45 bg-red-900" />
                        <div className="h-[1px] w-12 bg-stone-300" />
                    </div>
                </Reveal>
                <Reveal delay={0.3}>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları Derneği etkinliklerinden ve tarihinden anılar.
                    </p>
                </Reveal>
            </header>

            {/* Grid */}
            <div className="container mx-auto px-4 pb-24 relative">
                {galleries.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">Henüz paylaşılan bir albüm bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {galleries.map((gallery, i) => (
                            <Reveal key={gallery.id} delay={(i % 3) * 0.12} className="h-full">
                                <Link
                                    href={`/galeri/${gallery.slug}`}
                                    className="group block h-full bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 rounded-2xl overflow-hidden"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {gallery.coverImage ? (
                                            <Image
                                                src={gallery.coverImage}
                                                alt={gallery.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-900 uppercase tracking-wider rounded-full">
                                            {gallery._count.images} Görsel
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <h2 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-red-900 transition-colors mb-4">
                                            {gallery.title}
                                        </h2>
                                        <p className="text-slate-600 line-clamp-2 font-light leading-relaxed">
                                            {gallery.description || "Bu albüm için henüz bir açıklama girilmemiş."}
                                        </p>
                                        <div className="mt-6 flex items-center text-slate-400 text-xs uppercase tracking-widest font-semibold">
                                            <span>Detayları Gör</span>
                                            <div className="ml-4 h-[1px] flex-grow bg-slate-100 group-hover:bg-red-900 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
