import { getGalleries } from "@/actions/gallery-actions";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

export const metadata = {
    title: "Fotoğraf Galerisi | Sinop Mübadele Derneği",
    description: "Derneğimizden ve etkinliklerimizden kareler.",
};

export default async function GalleryListingPage() {
    const galleries = await getGalleries();

    return (
        <div className="min-h-screen bg-[#fdfbf7]">
            {/* Header */}
            <div className="bg-slate-900 py-16 md:py-24 text-white text-center">
                <div className="container mx-auto px-4">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 italic text-orange-500">Fotoğraf Galerisi</h1>
                    <div className="w-24 h-1 bg-red-900 mx-auto rounded-full" />
                    <p className="mt-8 text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları Derneği etkinliklerinden ve tarihinden anılar.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                {galleries.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">Henüz paylaşılan bir albüm bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {galleries.map((gallery) => (
                            <Link
                                key={gallery.id}
                                href={`/galeri/${gallery.slug}`}
                                className="group block h-full bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-px overflow-hidden"
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

                                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-900 uppercase tracking-wider rounded-px">
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
