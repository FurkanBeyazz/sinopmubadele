import { getPageBySlug } from "@/actions/page-actions";
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { Users } from "lucide-react";
import Reveal from "@/components/reveal";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const page = await getPageBySlug(params.slug);
    if (!page) {
        return {
            title: "Sayfa Bulunamadı",
        };
    }

    const description = page.content
        ? page.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
        : "Sinop Mübadele Derneği kurumsal sayfası.";

    return {
        title: page.title,
        description: description,
        openGraph: {
            title: page.title,
            description: description,
            images: page.heroImage ? [page.heroImage] : [],
        },
    };
}

export default async function DynamicPage({ params }: PageProps) {
    const decodedSlug = decodeURIComponent(params.slug);
    let page = await getPageBySlug(decodedSlug);

    if (!page) {
        const fallbackSlug = slugify(decodedSlug);
        if (fallbackSlug !== decodedSlug) {
            page = await getPageBySlug(fallbackSlug);
        }
    }

    if (!page) {
        notFound();
    }

    // Tarihçe sayfasında kurucu yönetim kurulu ayrı, vurgulu bir kutuda gösterilir
    const isTarihce = page.slug === "tarihce";
    const kurucuPage = isTarihce ? await getPageBySlug("yonetim-kurulu") : null;
    // İçeriğin kendi <h3> başlığını soy; kutunun kendi başlığı var
    const kurucuContent = kurucuPage?.content?.replace(/^\s*<h3>.*?<\/h3>/, "") || "";

    return (
        <div className="min-h-screen bg-[#F8F9FA] relative overflow-hidden">
            {/* Premium Arka Plan Efekti (Subtle Glow) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl relative z-10">
                {/* Editorial Başlık Alanı */}
                <header className="mb-16 text-center">
                    <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 block">
                        Kurumsal Bilgi
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1A202C] mb-6 tracking-tight capitalize">
                        {page.title.replace(/-/g, " ")}
                    </h1>

                    {/* Klasik/Zarif Ayraç (Ornamental Divider) */}
                    <div className="flex items-center justify-center gap-4 opacity-80">
                        <div className="h-[1px] w-12 bg-slate-300"></div>
                        <div className="w-2 h-2 rotate-45 bg-primary"></div>
                        <div className="h-[1px] w-12 bg-slate-300"></div>
                    </div>
                </header>

                {/* Yüzen İçerik Kanvası */}
                <div className="bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-16 relative">
                    {/* Zarif Üst Kenarlık Efekti */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                    {page.heroImage && (
                        <div className="mb-10 rounded-xl overflow-hidden relative h-64 md:h-96 w-full shadow-md">
                            <Image
                                src={page.heroImage}
                                alt={page.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <article
                        className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-serif prose-headings:text-[#1A202C] prose-headings:font-semibold prose-headings:tracking-tight
                        prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:tracking-wide
                        prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80
                        prose-strong:text-[#1A202C] prose-strong:font-bold
                        prose-ul:list-none prose-ul:pl-0
                        prose-li:relative prose-li:pl-6 prose-li:text-slate-700 prose-li:mb-3
                        before:prose-li:absolute before:prose-li:left-0 before:prose-li:top-[0.6em] before:prose-li:w-1.5 before:prose-li:h-1.5 before:prose-li:bg-primary/60 before:prose-li:rotate-45
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto"
                        dangerouslySetInnerHTML={{ __html: page.content || "" }}
                    />
                </div>

                {/* Kurucu Yönetim Kurulu — vurgulu özel kutu (sadece Tarihçe) */}
                {isTarihce && kurucuContent && (
                    <Reveal className="mt-14">
                        <section className="relative rounded-2xl p-[2px] bg-gradient-to-br from-red-900 via-red-900/30 to-transparent shadow-[0_25px_70px_-20px_rgba(127,29,29,0.35)]">
                            <div className="relative rounded-2xl bg-white p-8 md:p-12 overflow-hidden">
                                {/* Köşe süsü */}
                                <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-red-900/5 blur-2xl" />
                                <div className="pointer-events-none absolute top-6 right-8 font-serif text-[120px] leading-none text-red-900/[0.06] select-none">
                                    2014
                                </div>

                                {/* Başlık */}
                                <div className="relative flex flex-col items-center text-center mb-8">
                                    <div className="w-14 h-14 rounded-full bg-red-900 text-white flex items-center justify-center shadow-lg shadow-red-900/30 mb-4">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-[0.25em] text-red-900/70 uppercase mb-2">
                                        Kuruluşumuzdan
                                    </span>
                                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A202C] tracking-tight">
                                        Kurucu Yönetim Kurulu
                                    </h2>
                                    <div className="mt-4 flex items-center gap-3 opacity-80">
                                        <div className="h-[1px] w-10 bg-stone-300" />
                                        <div className="w-1.5 h-1.5 rotate-45 bg-red-900" />
                                        <div className="h-[1px] w-10 bg-stone-300" />
                                    </div>
                                </div>

                                {/* İçerik */}
                                <div
                                    className="relative prose prose-lg prose-slate max-w-2xl mx-auto
                                    prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:text-center
                                    prose-strong:text-red-900 prose-strong:font-bold
                                    prose-ul:list-none prose-ul:pl-0 prose-ul:grid prose-ul:gap-2 sm:prose-ul:grid-cols-2
                                    prose-li:m-0 prose-li:rounded-xl prose-li:border prose-li:border-stone-100 prose-li:bg-[#fdfbf7] prose-li:px-5 prose-li:py-3 prose-li:text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: kurucuContent }}
                                />
                            </div>
                        </section>
                    </Reveal>
                )}
            </div>
        </div>
    );
}
