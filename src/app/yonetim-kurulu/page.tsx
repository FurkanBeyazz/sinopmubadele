import { getPageBySlug } from "@/actions/page-actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function YonetimKuruluPage() {
    // Veritabanından veriyi çek
    const pageData = await getPageBySlug("yonetim-kurulu");

    if (!pageData) {
        return notFound();
    }

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
                        {pageData.title.replace(/-/g, " ")}
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

                    {pageData.content ? (
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
                            dangerouslySetInnerHTML={{ __html: pageData.content }}
                        />
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-block p-4 rounded-full bg-slate-50 mb-4">
                                <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                            </div>
                            <p className="text-slate-500 font-medium">İçerik güncelleniyor...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
