import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import NewsList from "./_components/news-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Haberler ve Duyurular",
    description: "Sinop Mübadele ve Balkan Halkları Derneği'nden en son haberler, etkinlikler ve duyurular.",
};

async function getNews() {
    return await prisma.announcement.findMany({
        where: { published: true },
        orderBy: { date: 'desc' },
    });
}

export default async function HaberlerPage() {
    const news = await getNews();

    return (
        <div className="min-h-screen bg-[#fdfbf7] py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
                    <span className="text-red-900 font-medium tracking-wider text-sm uppercase">Kurumsal İletişim</span>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900">Haberler & Duyurular</h1>
                    <div className="w-24 h-1 bg-red-900 mx-auto rounded-full" />
                    <p className="text-slate-600 text-lg mt-4">
                        Derneğimizin faaliyetleri, etkinlikleri ve güncel duyurularından haberdar olun.
                    </p>
                </div>

                <NewsList news={news} />
            </div>
        </div>
    );
}
